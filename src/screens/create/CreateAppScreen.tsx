import {useNavigate} from "react-router"
import {useCallback, useEffect, useState} from "react"
import {Stack} from "@mui/material"
import {AppRoute} from "@router"
import {AvoirScreenTitle} from "@components/basic/AvoirScreenTitle.tsx"
import {RStr} from "@localization/ids.ts"
import {str} from "@localization/res.ts"
import {
    Address,
    AndroidTypeId,
    AppCategoryId,
    AppCertificateProof,
    AppCertificateProofFactory,
    AppOwnerInfo,
    CategoryId,
    GameCategoryId,
    PlatformId
} from "@data/CommonModels.ts"
import {useSafeAccount} from "@hooks/useSafeAccount.ts"
import {ContentContainer, PageContainer} from "@components/layouts/BaseContainers.tsx"
import {AvoirSectionTitledBox} from "@components/basic/AvoirSection.tsx"
import {AvoirButtons, AvoirSecondaryButton} from "@components/inputs/AvoirButtons.tsx"
import {AppGeneralInfoForm} from "../forms/AppGeneralInfoForm.tsx"
import {AppOwnerInfoForm, parseProofs} from "../forms/AppOwnerInfoForm.tsx"
import {Reg} from "@utils/regex.ts"
import {AvoirProperty, AvoirPropertyBox} from "@components/basic/AvoirProperty.tsx"
import {ConfirmAccountForm} from "@screens/forms/ConfirmAccountForm.tsx"
import {shrinkAddress} from "@utils/account.ts"
import {AvoirStepper} from "@components/basic/AvoirStepper.tsx"
import {AutoSnackbar} from "@components/events/AutoSnackbar.tsx"
import {AmountsSummaryForm, AmountSummaryHelper, AmountSummaryState} from "@screens/forms/AmountsSummaryForm.tsx"
import {EstimationResult} from "@data/sc/ScBaseService.ts"
import {S, useAsyncEffect, useScreenState} from "@utils/state.ts"
import {ScAppDistribution, ScAppDistributionType, ScAssetService} from "@data/sc/ScAssetService.ts"
import {appConfig} from "@config"
import {AppCategoryForm, AppCategorySummaryForm} from "../forms/AppCategoryForm.tsx"
import {AppSourcesNewForm, AppSourcesSummaryForm, MAX_CUSTOM_URL} from "../forms/AppSourcesForm.tsx"
import {FormFieldProps} from "@screens/forms/form.tsx";
import {Hex} from "viem";
import {useGreenfield} from "@di";

const steps = [
    str(RStr.CreateAppScreen_steps_general),
    str(RStr.CreateAppScreen_steps_ownership),
    str(RStr.CreateAppScreen_steps_distribution),
    str(RStr.CreateAppScreen_steps_summary)
]

////////////////////////////////
// General - 1
////////////////////////////////
export interface GeneralInfoStepProps {
    packageName?: FormFieldProps<string>,
    name: FormFieldProps<string>,
    description?: FormFieldProps<string>,
    objType: AndroidTypeId
    category: CategoryId
    isProcessing: boolean
    onTypeChange: (type: AndroidTypeId) => void
    onCategoryChange: (category: CategoryId) => void
}

export function GeneralInfoStep(
    {
        packageName,
        name,
        description,
        objType,
        category,
        isProcessing,
        onTypeChange,
        onCategoryChange
    }: GeneralInfoStepProps
) {
    return (
        <Stack spacing={4}>
            <AppGeneralInfoForm
                packageName={packageName}
                name={name}
                description={description}
                isDisabled={isProcessing}
                sx={{}}
            />

            <AppCategoryForm
                objType={objType}
                category={category}
                onChangedType={onTypeChange}
                onChangedCategory={onCategoryChange}
                isDisabled={isProcessing}
            />
        </Stack>
    )
}


////////////////////////////////
// Ownership - 2
////////////////////////////////
interface OwnershipInfoStepProps {
    appAddress: Address | null
    website: FormFieldProps<string>,
    certs: AppCertificateProof[]
    isProcessing: boolean
    isAddAvailable: boolean
    onAddCertificate: () => void
    onDeleteCertificate: (index: number) => void
}

function OwnershipInfoStep({
    appAddress,
    website,
    certs,
    isProcessing,
    isAddAvailable,
    onAddCertificate,
    onDeleteCertificate
}: OwnershipInfoStepProps) {
    return (
        <AppOwnerInfoForm
            appAddress={appAddress}
            website={website}
            certs={certs}
            isLoading={isProcessing}
            isAddAvailable={isAddAvailable}
            onAddCertificate={onAddCertificate}
            onDeleteCertificate={onDeleteCertificate}
        />
    )
}


////////////////////////////////
// Distribution - 3
////////////////////////////////
interface DistributionStepProps {
    distribution: ScAppDistribution
    isProcessing: boolean
    onDistributionTypeChange: (type: ScAppDistributionType) => void
    onAddCustomUrl: () => void
    onRemoveCustomUrl: (index: number) => void
    onUpdateCustomUrl: (index: number, value: string) => void
}

export function DistributionStep({
    distribution,
    isProcessing,
    onDistributionTypeChange,
    onAddCustomUrl,
    onRemoveCustomUrl,
    onUpdateCustomUrl
}: DistributionStepProps) {
    return (
        <AppSourcesNewForm
            sources={distribution.sources}
            isLoading={isProcessing}
            onAddUrl={onAddCustomUrl}
            isCustomEnabled={distribution.type === ScAppDistributionType.Custom}
            onCustomChange={(isChecked) => {
                onDistributionTypeChange(
                    isChecked ? ScAppDistributionType.Custom : ScAppDistributionType.Default
                )
            }}
            onRemoveUrl={onRemoveCustomUrl}
            onUpdateUrl={onUpdateCustomUrl}
        />
    )
}


////////////////////////////////
// Summary - 4
////////////////////////////////
interface SummaryStepProps {
    devId: string
    devAddress: Address
    packageName: string
    appName: string
    description: string
    appAddress: Address | null
    objType: AndroidTypeId
    category: CategoryId
    platform: PlatformId
    host: string | null
    ownerInfo: AppOwnerInfo | null
    distribution: ScAppDistribution
    onStateChange: (state: AmountSummaryState) => void
    onError: (error: string) => void
    isProcessing: boolean
    policyData?: Hex | null
}

function SummaryStep({
    devId,
    devAddress,
    packageName,
    appName,
    description,
    appAddress,
    policyData,
    objType,
    category,
    platform,
    host,
    ownerInfo,
    distribution,
    onStateChange,
    onError,
    isProcessing
}: SummaryStepProps) {
    const estimateCall = useCallback(async (): Promise<EstimationResult> => {
        if (!appAddress || policyData === undefined) {
            throw new Error("App address not available")
        }

        const fee = await ScAssetService.estimateCreateApp(
            appConfig.prices.oracleAssetlink, devAddress, appAddress,
            packageName, appName, description,
            appConfig.defaultAppProtocolId, platform, category,
            ownerInfo, distribution,
            policyData,
        )

        return fee
    }, [devAddress, appAddress, packageName, appName, platform, category, ownerInfo, distribution])

    return (
        <Stack spacing={6}>
            <AvoirSectionTitledBox
                title={str(RStr.CreateAppScreen_summary_title)}
                description={str(RStr.CreateAppScreen_summary_description)}
                contentOffset={1}>
                <Stack spacing={2}>
                    <ConfirmAccountForm devName={devId} />

                    <AvoirPropertyBox title={str(RStr.CreateAppScreen_summary_generalInfo)}>
                        <AvoirProperty
                            title={str(RStr.CreateAppScreen_summary_package)}
                            value={packageName || '...'}
                        />
                        <AvoirProperty
                            title={str(RStr.CreateAppScreen_summary_name)}
                            value={appName || '...'}
                        />
                        <AvoirProperty
                            title={str(RStr.CreateAppScreen_summary_appAddress)}
                            value={appAddress ? shrinkAddress(appAddress) : str(RStr.CreateAppScreen_unknown)}
                            isLoading={isProcessing}
                        />
                    </AvoirPropertyBox>

                    <AppCategorySummaryForm
                        objType={objType}
                        category={category}
                        platform={platform}
                    />

                    <AvoirPropertyBox title={str(RStr.CreateAppScreen_summary_ownershipInfo)}>
                        <AvoirProperty
                            title={str(RStr.CreateAppScreen_summary_website)}
                            value={host || str(RStr.CreateAppScreen_unspecified)}
                        />
                        <AvoirProperty
                            title={str(RStr.CreateAppScreen_summary_certificates)}
                            value={ownerInfo?.proofs?.length ?? 0}
                        />
                    </AvoirPropertyBox>

                    <AppSourcesSummaryForm
                        distribution={distribution}
                    />

                    <AmountsSummaryForm
                        devId={devId}
                        devAddress={devAddress}
                        onState={onStateChange}
                        onError={onError}
                        estimation={estimateCall}
                        withOracle={ownerInfo !== null}
                        
                        onIncreaseQuota={undefined}
                        retryKey={undefined}
                        storageMessages={undefined}
                        relayCalls={undefined}
                        topUpStorageAmount={undefined}
                        newQuoteGb={undefined}
                        withValidation={undefined}
                        fileSize={undefined}
                        quoteRequirement={undefined}
                    />
                </Stack>
            </AvoirSectionTitledBox>
        </Stack>
    )
}

////////////////////////////////
// Screen
////////////////////////////////
export function CreateAppScreen() {
    const {devId, devAddress} = AppRoute.AssetsCreate.useParams()
    const {address, isValid} = useSafeAccount()
    const navigate = useNavigate()
    const greenfield = useGreenfield()

    const [activeStep, setActiveStep] = useState(0)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    // General info form state
    const [description, setDescription] = useState<string>("")
    const [packageName, setPackageName] = useState<string>("")
    const [policyData, setPolicyData] = useState<Hex | null | undefined>(undefined)
    const [appName, setAppName] = useState<string>("")
    const [isPackageValid, setIsPackageValid] = useState<boolean>(true)
    const [isNameValid, setIsNameValid] = useState<boolean>(true)
    const [objType, setObjType] = useState<AndroidTypeId>(AndroidTypeId.App)
    const [platform] = useState<PlatformId>(PlatformId.Android)
    const [category, setCategory] = useState<CategoryId>(AppCategoryId.BooksAndReference)

    // Owner info form state
    const [website, setWebsite] = useState<string>("")
    const [host, setHost] = useState<string | null>(null)
    const [ownerInfo, setOwnerInfo] = useState<AppOwnerInfo | null>(null)
    const [certCounter, setCertCounter] = useState(1)
    const [certs, setCerts] = useState<AppCertificateProof[]>([
        AppCertificateProofFactory.emptyProof(certCounter)
    ])

    // Distribution state
    const [distribution, setDistribution] = useState<ScAppDistribution>({
        type: ScAppDistributionType.Default,
        sources: []
    })

    // Application state
    const [appAddress, setAppAddress] = useState<Address | null>(null)
    const {isLoading, data, setState} = useScreenState<boolean, boolean>({initData: false, initLoadings: false})
    const [feeState, setFeeState] = useState<AmountSummaryState>(AmountSummaryState.Pending)

    if (!isValid) {
        return null
    }

    useAsyncEffect(async () => {
        const hasPermission = await greenfield.hasPolicy(devId, address)
        if (!hasPermission) {
            try {
                const policyData = await greenfield.createBucketPolicyData(devId, address)
                setPolicyData(policyData || null)
            } catch (e) {
                console.error(e)
            }
        } else {
            setPolicyData(policyData || null)
        }
    }, []);

    useEffect(() => {
        if (data && appAddress) {
            console.log("Owner setup successful, navigating...")

            navigate(AppRoute.AppInfo.route(devId, packageName, devAddress, appAddress), {replace: true, preventScrollReset: false})
        }
    }, [data, navigate, devId, packageName, devAddress, appAddress])

    const createApp = useCallback(async () => {
        setState(S.loading())

        if (!address || !devAddress || !appAddress || policyData === undefined) {
            setErrorMsg(str(RStr.CreateAppScreen_error_reload))
            setState(S.error(true))
            console.error("Wallet or Dev or App address not available.", address, devAddress, appAddress)
            return
        }

        try {
            const createReceipt = await ScAssetService.createApp(
                appConfig.prices.oracleAssetlink,
                devAddress, appAddress,
                packageName, appName, description,
                appConfig.defaultAppProtocolId, platform, category,
                ownerInfo, distribution,
                policyData,
            )

            try {
                const log = ScAssetService.findAppCreatedEventTopic(createReceipt.logs)
                if (log) {
                    const obj = ScAssetService.decodeAppCreatedEvent(0, log)
                    ScAssetService.setAppAddress(obj.package, obj.address, devAddress)
                    console.log("App created:", obj.address)
                } else {
                    console.error("Could not find AppCreated event log in receipt")
                }
            } catch (e) {
                console.error(e)
            }

            setState(S.data(true))
        } catch (e) {
            console.error(e)
            setState(S.error(true))
            setErrorMsg(str(RStr.CreateAppScreen_error_reload))
        }
    }, [address, devAddress, appAddress, packageName, appName, platform, category, ownerInfo, distribution.sources])

    const handleNext = async () => {
        if (activeStep === 0) {
            const isPkgValid = Reg.isPackageValid(packageName)
            const isNmValid = Reg.isAppNameValid(appName)

            setIsPackageValid(isPkgValid)
            setIsNameValid(isNmValid)

            if (!isPkgValid || !isNmValid) {
                console.error(str(RStr.CreateAppScreen_error_validationFailed))
                return
            }

            try {
                const appAddress = await ScAssetService.computeAppAddress(
                    devAddress, packageName, appName, description, appConfig.defaultAppProtocolId, platform, category,
                )
                console.log("Future app address:", appAddress)
                setAppAddress(appAddress)
            } catch (e) {
                console.error(e)
                setErrorMsg(str(RStr.CreateAppScreen_error_calculateAddress))
                return
            }
        } else if (activeStep === 1) {
            if (!Reg.isWebsiteValid(website)) {
                setErrorMsg(str(RStr.AppOwnerVerificationScreen_error_invalidWebsite));
                return
            }

            const proofs = parseProofs(certs)
            for (const [i, cert] of proofs.entries()) {
                if (!Reg.isSha256FingerprintValid(cert.fingerprint)) {
                    setErrorMsg(str(RStr.CreateAppScreen_error_certificateHash)
                        .replace("{index}", (i + 1).toString()))
                    return
                }

                if (!Reg.isHexValid(cert.proof)) {
                    setErrorMsg(str(RStr.CreateAppScreen_error_certificateProof)
                        .replace("{index}", (i + 1).toString()))
                    return
                }
            }

            if (website.length > 0 && proofs.length > 0) {
                setHost(website)
                setOwnerInfo({
                    domain: website,
                    proofs: proofs,
                })
            }
        } else if (activeStep === 2) {
            if (distribution.type === ScAppDistributionType.Custom) {
                for (const [i, url] of distribution.sources.entries()) {
                    if (!Reg.isWebsiteValid(url)) {
                        setErrorMsg(str(RStr.AppsEditDistributionScreen_error_invalidUrl)
                            .replace("{index}", (i + 1).toString()))

                        return
                    }
                }
            }
        }

        console.log(`Moving to step ${activeStep + 1}`)
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
        window.scrollTo(0, 0)
    }

    const handleBack = () => {
        console.log(`Moving back to step ${activeStep - 1}`)
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
        window.scrollTo(0, 0)
    }

    const handleSkip = () => {
        console.log(`Skip to step ${activeStep + 1}`)

        setHost(null)
        setOwnerInfo(null)

        setActiveStep((prevActiveStep) => prevActiveStep + 1)
        window.scrollTo(0, 0)
    }

    const addCustomUrl = () => {
        if (distribution.sources.length < MAX_CUSTOM_URL) {
            setDistribution({
                ...distribution,
                sources: [...distribution.sources, '']
            })
        }
    }

    const removeCustomUrl = (index: number) => {
        const newUrls = [...distribution.sources]
        newUrls.splice(index, 1)
        setDistribution({
            ...distribution,
            sources: newUrls.length > 0 ? newUrls : ['']
        })
    }

    const updateCustomUrl = (index: number, value: string) => {
        const newUrls = [...distribution.sources]
        newUrls[index] = value
        setDistribution({
            ...distribution,
            sources: newUrls
        })
    }

    const isProcessing = isLoading
    const canProceedFromGeneralInfo = packageName && appName && isPackageValid && isNameValid
    const canProceedFromOwnershipInfo = website.length > 0 && appAddress
    const isNextDisabled = (activeStep === 0 && !canProceedFromGeneralInfo)
        || isProcessing
        || (activeStep == 1 && !canProceedFromOwnershipInfo)
        || (activeStep == 3 && !AmountSummaryHelper.isReady(feeState))

    return (
        <PageContainer>
            <AvoirScreenTitle
                title={str(RStr.CreateAppScreen_title)}
                description={str(RStr.CreateAppScreen_description)}/>

            <AutoSnackbar message={errorMsg} onClose={() => setErrorMsg(null)}/>

            <ContentContainer>
                <Stack
                    width={"100%"}
                    height={"100%"}
                    display={"flex"}
                    direction={"row"}
                    justifyContent={"center"}
                    spacing={4}
                    pb={10}
                >
                    <Stack
                        flexGrow={1}
                        spacing={3}
                        maxWidth={"1024px"}
                    >
                        <AvoirStepper
                            sx={{width: { xs: '100%', md: '70%' }, alignSelf: 'center'}}
                            activeStep={activeStep}
                            steps={steps}
                        />

                        <Stack spacing={3}>
                            {activeStep === 0 && (
                                <GeneralInfoStep
                                    packageName={{
                                        value: packageName,
                                        onChange: (value) => {
                                            setPackageName(value)
                                            setIsPackageValid(true)
                                        },
                                        isValid: isPackageValid,
                                    }}
                                    name={{
                                        value: appName,
                                        onChange: (name) => {
                                            setAppName(name)
                                            setIsNameValid(true)
                                        },
                                        isValid: isNameValid,
                                    }}
                                    description={{
                                        value: description,
                                        onChange: setDescription,
                                        isValid: true,
                                    }}
                                    objType={objType}
                                    category={category}
                                    isProcessing={isProcessing}
                                    onTypeChange={(newType) => {
                                        setObjType(newType)
                                        if (newType === AndroidTypeId.Game) {
                                            setCategory(GameCategoryId.Action)
                                        } else {
                                            setCategory(AppCategoryId.BooksAndReference)
                                        }
                                    }}
                                    onCategoryChange={setCategory}
                                />
                            )}

                            {activeStep === 1 && (
                                <OwnershipInfoStep
                                    appAddress={appAddress}
                                    website={{
                                        value: website,
                                        onChange: setWebsite,
                                        isValid: true
                                    }}
                                    certs={certs}
                                    isProcessing={isProcessing}
                                    isAddAvailable={certCounter < appConfig.maxCertCount}
                                    onAddCertificate={() => {
                                        setCertCounter(certCounter + 1)
                                        setCerts(prevCerts => [
                                            ...prevCerts,
                                            AppCertificateProofFactory.emptyProof(certCounter)
                                        ])
                                    }}
                                    onDeleteCertificate={(index) => {
                                        setCerts(prevCerts =>
                                            prevCerts.filter((proof) => proof.ordinal !== index)
                                        )
                                    }}
                                />
                            )}

                            {activeStep === 2 && (
                                <DistributionStep
                                    distribution={distribution}
                                    isProcessing={isProcessing}
                                    onDistributionTypeChange={(type) => {
                                        setDistribution({
                                            type,
                                            sources: type === ScAppDistributionType.Default ? [] : ['']
                                        })
                                    }}
                                    onAddCustomUrl={addCustomUrl}
                                    onRemoveCustomUrl={removeCustomUrl}
                                    onUpdateCustomUrl={updateCustomUrl}
                                />
                            )}

                            {activeStep === 3 && (
                                <SummaryStep
                                    devId={devId}
                                    devAddress={devAddress}
                                    packageName={packageName}
                                    appName={appName}
                                    description={description}
                                    appAddress={appAddress}
                                    objType={objType}
                                    category={category}
                                    platform={platform}
                                    host={host}
                                    ownerInfo={ownerInfo}
                                    distribution={distribution}
                                    onStateChange={setFeeState}
                                    onError={setErrorMsg}
                                    isProcessing={isProcessing}
                                    policyData={policyData}
                                />
                            )}
                        </Stack>

                        <Stack
                            direction="row"
                            justifyContent={"flex-end"}
                            sx={{pt: 3, pb: 2}}
                            spacing={3}
                        >
                            {activeStep > 0 && (
                                <AvoirSecondaryButton
                                    disabled={isProcessing}
                                    onClick={handleBack}
                                    text={str(RStr.CreateAppScreen_button_back)}
                                />
                            )}

                            {activeStep == 1 && (
                                <AvoirButtons
                                    color={"secondary"}
                                    disabled={isProcessing}
                                    onClick={handleSkip}
                                    text={str(RStr.CreateAppScreen_button_skip)}
                                />
                            )}

                            {activeStep != 3 && (
                                <AvoirButtons
                                    text={str(RStr.CreateAppScreen_button_next)}
                                    onClick={handleNext}
                                    disabled={isNextDisabled}
                                    withIcon={false}
                                />
                            )}

                            {activeStep == 3 && (
                                <AvoirButtons
                                    text={str(RStr.CreateAppScreen_button_create)}
                                    onClick={createApp}
                                    disabled={isNextDisabled}
                                    loading={isProcessing && activeStep === steps.length - 1}
                                    withIcon={false}
                                />
                            )}
                        </Stack>
                    </Stack>
                </Stack>
            </ContentContainer>
        </PageContainer>
    )
}
