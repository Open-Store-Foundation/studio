import {useNavigate} from "react-router";
import {useCallback, useMemo, useState} from "react";
import {Stack} from "@mui/material";
import Box from "@mui/material/Box";
import {ContentContainer} from "@components/layouts/BaseContainers.tsx";
import {ScAssetService} from "@data/sc/ScAssetService.ts";
import {AppRoute} from "@router";
import {AvoirScreenTitle} from "@components/basic/AvoirScreenTitle.tsx";
import {AppOwnerInfoEditForm, parseProofs} from "@screens/forms/AppOwnerInfoForm.tsx";
import {S, useAsyncEffect, useScreenState} from "@utils/state.ts";
import {AvoirSectionTitledBox} from "@components/basic/AvoirSection.tsx";
import {Address, AppCertificateProof, AppCertificateProofFactory, AppOwnerInfo} from "@data/CommonModels.ts";
import {ConfirmAccountForm} from "@screens/forms/ConfirmAccountForm.tsx";
import {AmountsSummaryForm, AmountSummaryHelper, AmountSummaryState} from "@screens/forms/AmountsSummaryForm.tsx";
import {EstimationResult} from "@data/sc/ScBaseService.ts";
import {AvoirButtons, AvoirSecondaryButton} from "@components/inputs/AvoirButtons.tsx";
import {ScAppSyncData, ScOracleService} from "@data/sc/ScOracleService.ts";
import {AvoirProperty, AvoirPropertyBox} from "@components/basic/AvoirProperty.tsx";
import {appConfig} from "@config";
import {FieldAction} from "@components/inputs/FieldAction.tsx";
import {AutoSnackbar, DefaultSnackbarError} from "@components/events/AutoSnackbar.tsx";
import {renderOracleTitle} from "@screens/app/AppStatusScreen.tsx";
import {AvoirInfo} from "@components/basic/AvoirInfo.tsx";
import {DefaultScreenErrorProps, ScreenError} from "@components/basic/ScreenError.tsx";
import {Reg} from "@utils/regex.ts";
import {RStr} from "@localization/ids.ts";
import {str} from "@localization/res.ts";

enum ProceedActionType {
    Save = 0,
    Verify = 1,
    SaveAndVerify = 2,
}

interface InfoStepProps {
    appAddress: Address | null;
    domain: string;
    oldCerts: AppCertificateProof[];
    newCerts: AppCertificateProof[];
    deletedCertIndices: Set<number>;
    isLoading: boolean;
    isVerified: boolean;
    onWebsiteChanged: (value: string) => void;
    onDeleteCertificate: (index: number) => void;
    onRestoreCertificate: (index: number) => void;
    onAddCertificate: () => void;
    onDeleteNewCertificate: (index: number) => void;
}

function formatActionType(proceedActionType: ProceedActionType) {
    if (proceedActionType == ProceedActionType.SaveAndVerify) {
        return str(RStr.AppOwnerVerificationScreen_button_saveAndVerify);
    } else if (proceedActionType == ProceedActionType.Save) {
        return str(RStr.AppOwnerVerificationScreen_button_save);
    } else {
        return str(RStr.AppOwnerVerificationScreen_button_verify);
    }
}

function InfoStep({
    appAddress,
    domain,
    oldCerts,
    newCerts,
    deletedCertIndices,
    isLoading,
    isVerified,
    onWebsiteChanged,
    onDeleteCertificate,
    onRestoreCertificate,
    onAddCertificate,
    onDeleteNewCertificate
}: InfoStepProps) {
    return (
        <AppOwnerInfoEditForm
            isSynced={isVerified}
            domain={{
                value: domain,
                isValid: true, // checking later
                onChange: onWebsiteChanged,
            }}
            certs={oldCerts}
            deletedCertIndices={deletedCertIndices}
            isLoading={isLoading}
            onAction={(i, action) => {
                if (action === FieldAction.Delete) {
                    onDeleteCertificate(i)
                } else if (action === FieldAction.Restore) {
                    onRestoreCertificate(i)
                }
            }}
            newCertificatesProps={{
                firstRemovable: true,
                appAddress: appAddress,
                certs: newCerts,
                indexOffset: oldCerts.length,
                isAddAvailable: oldCerts.length + newCerts.length <= appConfig.maxOwnerCerts,
                isLoading: isLoading,
                onAddCertificate: onAddCertificate,
                onDeleteCertificate: onDeleteNewCertificate,
            }}
        />
    );
}

interface SummaryStepProps {
    devId: string;
    devAddress: Address;
    appPackage: string;
    appAddress: Address;
    newOwnerInfo: AppOwnerInfo;
    oracleData: ScAppSyncData;
    action: ProceedActionType;
    onStateChange: (state: AmountSummaryState) => void;
    onError: (error: string) => void;
}

function SummaryStep({
    devId,
    devAddress,
    appPackage,
    appAddress,
    newOwnerInfo,
    oracleData,
    action,
    onStateChange,
    onError,
}: SummaryStepProps) {
    const estimateCall = useCallback(async (): Promise<EstimationResult> => {
        if (action == ProceedActionType.SaveAndVerify) {
            const fee = await ScOracleService.esimateSaveAndVarifyOwnerMulticall(
                appConfig.prices.oracleAssetlink, appAddress, newOwnerInfo
            );
            return fee;
        } else if (action == ProceedActionType.Save) {
            const fee = await ScAssetService.estimateUpdateAppOwner(
                appAddress, newOwnerInfo
            );
            return fee;
        } else {
            const fee = await ScOracleService.estimateVerifyOwner(
                appConfig.prices.oracleAssetlink, appAddress
            );
            return fee;
        }
    }, [appAddress, newOwnerInfo, action]);

    return (
        <Stack spacing={6}>
            <AvoirSectionTitledBox
                title={str(RStr.AppOwnerVerificationScreen_summary_title)}
                description={str(RStr.AppOwnerVerificationScreen_summary_description)}
                infoLink={AppRoute.Article.route(AppRoute.Article.Publishing)}
                contentOffset={1}>
                <Stack spacing={2}>
                    <ConfirmAccountForm
                        devName={devId}
                        appPackage={appPackage}
                    />

                    <AvoirPropertyBox title={str(RStr.AppOwnerVerificationScreen_summary_ownershipInfo)}>
                        <AvoirProperty
                            title={str(RStr.AppOwnerVerificationScreen_summary_website)}
                            value={newOwnerInfo?.domain || "Unspecified"}
                        />

                        <AvoirProperty
                            title={str(RStr.AppOwnerVerificationScreen_summary_currentVersion)}
                            value={newOwnerInfo?.proofs?.length || "0"}
                        />

                        <AvoirProperty
                            title={str(RStr.AppOwnerVerificationScreen_summary_lastVerifiedVersion)}
                            value={oracleData?.version || "0"}
                        />

                        <AvoirProperty
                            title={str(RStr.AppOwnerVerificationScreen_summary_status)}
                            value={renderOracleTitle(oracleData.status)}
                        />
                    </AvoirPropertyBox>

                    <AvoirPropertyBox title={str(RStr.AppOwnerVerificationScreen_summary_execution)}>
                        <AvoirProperty
                            title={str(RStr.AppOwnerVerificationScreen_summary_action)}
                            value={formatActionType(action)}
                        />
                    </AvoirPropertyBox>

                    <AmountsSummaryForm
                        devId={devId}
                        devAddress={devAddress}
                        onState={onStateChange}
                        onError={onError}
                        estimation={estimateCall}

                        onIncreaseQuota={undefined}
                        retryKey={undefined}
                        storageMessages={undefined}
                        relayCalls={undefined}
                        topUpStorageAmount={undefined}
                        newQuoteGb={undefined}
                        withValidation={undefined}
                        withOracle={action !== ProceedActionType.Save}
                        fileSize={undefined}
                        quoteRequirement={undefined}
                    />
                </Stack>
            </AvoirSectionTitledBox>
        </Stack>
    );
}

export function AppEditOwnerVerificationScreen() {
    const navigate = useNavigate();

    const {devId, devAddress, appPackage, appAddress, isFetching} = AppRoute.OwnerValidation.useParams();

    const [activeStep, setActiveStep] = useState(0);
    const [isSkipVerification, setIsSkipVerification] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isVerified, setIsVerified] = useState<boolean>(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [isDomainChanged, setIsDomainChanged] = useState(false);
    const [certCounter, setCertCounter] = useState(0);

    const [domain, setDomain] = useState<string>("");
    const [deletedCertIndices, setDeletedCertIndices] = useState<Set<number>>(new Set());
    const [certs, setCerts] = useState<AppCertificateProof[]>([]);

    const [newOwnerInfo, setNewOwnerInfo] = useState<AppOwnerInfo | null>(null);
    const [feeState, setFeeState] = useState<AmountSummaryState>(AmountSummaryState.Pending);

    const {
        isLoading: isOwnerLoading,
        data: ownerData,
        error: ownerError,
        retry: ownerRetry,
        retryCount: ownerRetryCount,
        setState: setOwnerState
    } = useScreenState<AppOwnerInfo | null, string>()

    const {
        isLoading: isOracleLoading,
        data: oracleData,
        error: oracleError,
        retry: oracleRetry,
        retryCount: oracleRetryCount,
        setState: setOracleState
    } = useScreenState<ScAppSyncData | null, string>()

    // Helper logic
    const hasPendingChanges = isDomainChanged || certs.length > 0 || deletedCertIndices.size > 0;
    const hasPendingVerification = oracleData == null || oracleData.pendingVersion > 0;
    const isProceedDisabled = isFetching || isOwnerLoading || isOracleLoading || isLoading;
    const isBackDisabled = isProceedDisabled || AmountSummaryHelper.isProcessing(feeState);
    const isFinishDisabled = isProceedDisabled || !AmountSummaryHelper.isReady(feeState);

    const proceedActionType = useMemo(() => {
        if (!isSkipVerification && (hasPendingChanges || (!isVerified && hasPendingChanges))) {
            return ProceedActionType.SaveAndVerify
        } else if (hasPendingChanges) {
            return ProceedActionType.Save
        } else {
            return ProceedActionType.Verify
        }
    }, [isVerified, isSkipVerification, hasPendingChanges])

    useAsyncEffect(async () => {
        if (isFetching) {
            return
        }

        try {
            const last = await ScOracleService.lastVersionVerified(appAddress);
            setIsVerified(last > 0)
        } catch (e) {
            console.error(e)
        }

        try {
            setOracleState(S.loading())
            const result = await ScOracleService.getLastState(appAddress);
            setOracleState(S.data(result))
        } catch (e) {
            console.error(e)
            setOracleState(S.error(DefaultSnackbarError))
        }

    }, [isFetching, ownerRetryCount])

    useAsyncEffect(async () => {
        if (isFetching) {
            return
        }

        try {
            setOwnerState(S.loading())
            const {owner, proof} = await ScAssetService.getOwnerStateWithProofs(appAddress)
            const proofs = owner.fingerprints.map((fingerprint, i) =>
                AppCertificateProofFactory.defaultProof(
                    fingerprint,
                    proof.certs?.[i] || "",
                    proof.proofs?.[i] || ""
                )
            )

            const info = {
                domain: owner.domain,
                proofs: proofs
            } as AppOwnerInfo

            setDomain(owner.domain)
            setOwnerState(S.data(info))

            if (proofs.length == 0) {
                setCertCounter(1)
                setCerts([AppCertificateProofFactory.emptyProof(0)])
            }
        } catch (e) {
            console.error(e)
            setOwnerState(S.error(DefaultSnackbarError))
        }
    }, [isFetching, oracleRetryCount]);

    // TODO reuse logic with CreateAppScreen
    const calculateNewOwnerData = () => {
        let newDomain: string | undefined
        try {
            newDomain = domain
        } catch (e) {
            console.error(e)
            setErrorMsg(str(RStr.AppOwnerVerificationScreen_error_invalidWebsite));
            return false
        }

        const oldCerts = ownerData?.proofs ?? []
            .filter((_, i) => !deletedCertIndices.has(i));

        const newCerts = parseProofs(certs)

        const info: AppOwnerInfo = {
            domain: newDomain,
            proofs: [...oldCerts, ...newCerts]
        }

        if (!Reg.isWebsiteValid(info.domain)) {
            setErrorMsg(str(RStr.AppOwnerVerificationScreen_error_invalidWebsite));
            return false
        }

        for (const [i, cert] of info.proofs.entries()) {
            if (!Reg.isSha256FingerprintValid(cert.fingerprint)) {
                setErrorMsg(str(RStr.AppOwnerVerificationScreen_error_invalidCertificateHash).replace("{index}", (i + 1).toString()));
                return false;
            }

            if (!Reg.isHexValid(cert.proof)) {
                setErrorMsg(str(RStr.AppOwnerVerificationScreen_error_invalidCertificateProof).replace("{index}", (i + 1).toString()));
                return false;
            }
        }

        setNewOwnerInfo(info)
        return true
    }

    const nextWithoutVerification = () => {
        if (!calculateNewOwnerData()) {
            return
        }

        setIsSkipVerification(true)
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
        window.scrollTo(0, 0)
    };

    const handleNext = async () => {
        if (!calculateNewOwnerData()) {
            return
        }

        setIsSkipVerification(false)
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        window.scrollTo(0, 0);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
        window.scrollTo(0, 0)
    };

    const handleFinish = async () => {
        setIsLoading(true)

        try {
            if (proceedActionType == ProceedActionType.SaveAndVerify) {
                await ScOracleService.saveAndVarifyOwnerMulticall(
                    appConfig.prices.oracleAssetlink, appAddress, newOwnerInfo!
                )
            } else if (proceedActionType == ProceedActionType.Save) {
                await ScAssetService.setAppOwner(
                    appAddress, newOwnerInfo!
                )
            } else {
                await ScOracleService.verifyOwner(
                    appConfig.prices.oracleAssetlink, appAddress
                )
            }

            ScOracleService.resetAllCache()
            navigate(-1)
        } catch (e) {
            ScOracleService.resetAllCache()
            setIsLoading(false)
            setErrorMsg(DefaultSnackbarError)
            console.error(e)
        }
    }

    const handleDeleteCertificate = (index: number) => {
        setDeletedCertIndices(prev => {
            const next = new Set(prev);
            next.add(index);
            return next;
        });
    }

    const handleRestoreCertificate = (index: number) => {
        setDeletedCertIndices(prev => {
            const next = new Set(prev);
            next.delete(index);
            return next;
        });
    }

    const handleWebsiteChanged =  (value: string) => {
        if (value !== ownerData?.domain) {
            setIsDomainChanged(true)
        } else {
            setIsDomainChanged(false)
        }

        setDomain(value)
    }

    const proceedActionTitle = useMemo(() => formatActionType(proceedActionType), [proceedActionType])

    return (
        <Box>
            <AutoSnackbar message={errorMsg} onClose={() => setErrorMsg(null)}/>

            <AvoirScreenTitle
                title={str(RStr.AppOwnerVerificationScreen_title)}
                description={str(RStr.AppOwnerVerificationScreen_description)}
                isLoading={isFetching || isOwnerLoading || isOracleLoading}/>

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
                    {
                        (ownerError || oracleError) &&
                        <ScreenError
                            {...DefaultScreenErrorProps}
                            action={str(RStr.AppOwnerVerificationScreen_error_action)}
                            onAction={() => {
                                if (ownerError) {
                                    ownerRetry()
                                }

                                if (oracleError) {
                                    oracleRetry()
                                }
                            }}
                        />
                    }

                    {
                        (ownerData && oracleData) &&
                        <Stack
                            flexGrow={1}
                            spacing={3}
                            maxWidth={"1024px"}
                        >
                            <Stack spacing={3}>
                                {activeStep === 0 && (
                                    <InfoStep
                                        appAddress={appAddress}
                                        domain={domain}
                                        oldCerts={ownerData.proofs}
                                        newCerts={certs}
                                        deletedCertIndices={deletedCertIndices}
                                        isLoading={isProceedDisabled}
                                        isVerified={isVerified}
                                        onWebsiteChanged={handleWebsiteChanged}
                                        onDeleteCertificate={handleDeleteCertificate}
                                        onRestoreCertificate={handleRestoreCertificate}
                                        onAddCertificate={() => {
                                            setCerts((prevCerts) => {
                                                setCertCounter((prev) => prev + 1)
                                                return [
                                                    ...prevCerts,
                                                    AppCertificateProofFactory.emptyProof(certCounter)
                                                ]
                                            })
                                        }}
                                        onDeleteNewCertificate={(index) => {
                                            setCerts((prevCerts) =>
                                                prevCerts.filter((proof) => proof.ordinal !== index)
                                            );
                                        }}
                                    />
                                )}

                                {activeStep === 1 && oracleData && newOwnerInfo && (
                                    <SummaryStep
                                        devId={devId}
                                        devAddress={devAddress}
                                        appPackage={appPackage}
                                        appAddress={appAddress}
                                        oracleData={oracleData}
                                        newOwnerInfo={newOwnerInfo}
                                        action={proceedActionType}
                                        onStateChange={setFeeState}
                                        onError={setErrorMsg}
                                    />
                                )}
                            </Stack>

                            <Stack
                                direction="column"
                                alignItems={"flex-end"}
                                py={2}
                                spacing={2}
                            >
                                {activeStep === 0 && hasPendingVerification && (
                                    <Stack direction="row" justifyContent="flex-end">
                                        <AvoirInfo color={"warning"}>
                                            {str(RStr.AppOwnerVerificationScreen_warning_pending)}
                                        </AvoirInfo>
                                    </Stack>
                                )}

                                {activeStep === 0 && (
                                    <Stack direction={"row"} spacing={2}>
                                        {
                                            <AvoirSecondaryButton
                                                disabled={isProceedDisabled || !hasPendingChanges}
                                                onClick={nextWithoutVerification}
                                                text={str(RStr.AppOwnerVerificationScreen_button_saveChanges)}
                                            />
                                        }

                                        <AvoirButtons
                                            text={proceedActionType == ProceedActionType.Verify ?
                                                str(RStr.AppOwnerVerificationScreen_button_verifyOwnership) :
                                                str(RStr.AppOwnerVerificationScreen_button_saveAndVerify)}
                                            onClick={handleNext}
                                            disabled={hasPendingVerification || isProceedDisabled || (isVerified && !hasPendingChanges)}
                                        />
                                    </Stack>
                                )}

                                {activeStep == 1 && (
                                    <Stack direction={"row"} spacing={2}>
                                        <AvoirSecondaryButton
                                            onClick={handleBack}
                                            disabled={isBackDisabled}
                                            text={str(RStr.AppOwnerVerificationScreen_button_back)}
                                        />

                                        <AvoirButtons
                                            text={proceedActionTitle}
                                            onClick={handleFinish}
                                            disabled={isFinishDisabled}
                                            loading={isLoading}
                                        />
                                    </Stack>
                                )}
                            </Stack>
                        </Stack>
                    }
                </Stack>
            </ContentContainer>
        </Box>
    );
}
