import {AvoirScreenTitle} from "@components/basic/AvoirScreenTitle.tsx"
import {ContentContainer, PageContainer} from "@components/layouts/BaseContainers.tsx"
import {Stack} from "@mui/material"
import {AvoirButtons, AvoirSecondaryButton} from "@components/inputs/AvoirButtons.tsx"
import * as React from "react"
import {useCallback, useMemo, useState} from "react"
import FileUpload from "@mui/icons-material/FileUpload"
import LibraryBooks from "@mui/icons-material/LibraryBooks"
import {AvoirTrackBox} from "@components/basic/AvoirTrackBox.tsx"
import {FileDrawerDialog, FileDrawerType} from "@screens/release/dialogs/FileDrawerDialog.tsx"
import {AvoirSectionTitledBox} from "@components/basic/AvoirSection.tsx"
import {ConfirmBuildForm} from "@screens/forms/ConfirmBuildForm"
import {ConfirmAccountForm} from "@screens/forms/ConfirmAccountForm"
import {ScAppBuild, ScAssetService} from "@data/sc/ScAssetService.ts"
import {Address, TrackId} from "@data/CommonModels.ts"
import {S, useAsyncEffect, useScreenState} from "@utils/state.ts"
import {AutoSnackbar, DefaultSnackbarError} from "@components/events/AutoSnackbar.tsx"
import {AppRoute} from "@router"
import {ScStoreService} from "@data/sc/ScStoreService.ts"
import {useNavigate} from "react-router"
import {DevManageDrawerDialog} from "@screens/dev/DevManageDrawerDialog.tsx";
import {RStr} from "@localization/ids.ts";
import {str} from "@localization/res.ts";
import {BundleBox} from "@screens/release/BundleBox.tsx";
import {ScOracleService} from "@data/sc/ScOracleService.ts";
import {
    AmountsSummaryForm,
    AmountSummaryHelper,
    AmountSummaryState,
    FeesModuleProps
} from "@screens/forms/AmountsSummaryForm.tsx";
import {appConfig} from "@config";
import {NotEnoughAlert} from "./NotEnoughAlert.tsx"
import {useSafeAccount} from "@hooks/useSafeAccount.ts";
import {useCache} from "@di";

interface BuildStatus {
    lastPublishedVersion: number,
    lastMirroredVersion: number,
}

interface CreateReleaseData {
    devName: string
    owner?: Address
    appBuild?: ScAppBuild

    isNotOwnershipVerified: boolean | null;
    onVerifyOwnership: () => void;
}

interface InfoStepProps {
    appBuild: ScAppBuild | null;
    selectedTrack: TrackId;
    isValidate: boolean;
    skipOptions: Array<{ id: boolean, label: string, color: string, description: string }>;
    trackOptions: Array<{ id: TrackId, label: string, color: string, description: string, disabled?: boolean }>;
    onFileTypeChange: (type: FileDrawerType | null) => void;
    onTrackChange: (track: TrackId) => void;
    onValidateChange: (validate: boolean) => void;
    onFileChange: () => void;
}

function InfoStep(
    {
        appBuild,
        selectedTrack,
        isValidate,
        skipOptions,
        trackOptions,
        onFileTypeChange,
        onTrackChange,
        onValidateChange,
        onFileChange,
    }: InfoStepProps
) {
    return (
        <Stack spacing={3}>
            <AvoirSectionTitledBox
                title={str(RStr.CreateReleaseScreen_selectFile_title)}
                description={str(RStr.CreateReleaseScreen_selectFile_description)}
                contentOffset={1}>
                {
                    appBuild
                        ? <Stack spacing={2}>
                            <ConfirmBuildForm
                                build={appBuild}
                            />

                            <Stack width={"100%"} alignItems={"end"}>
                                <AvoirSecondaryButton
                                    text={str(RStr.CreateReleaseScreen_selectFile_changeFile)}
                                    onClick={onFileChange}
                                />
                            </Stack>
                        </Stack>
                        : <Stack direction="row" spacing={2}>
                            <BundleBox
                                icon={FileUpload}
                                title={str(RStr.CreateReleaseScreen_selectFile_uploadTitle)}
                                description={str(RStr.CreateReleaseScreen_selectFile_uploadDescription)}
                                onClick={() => onFileTypeChange(FileDrawerType.Upload)}
                            />
                            <BundleBox
                                icon={LibraryBooks}
                                title={str(RStr.CreateReleaseScreen_selectFile_selectTitle)}
                                description={str(RStr.CreateReleaseScreen_selectFile_selectDescription)}
                                onClick={() => onFileTypeChange(FileDrawerType.Select)}
                            />
                        </Stack>
                }
            </AvoirSectionTitledBox>

            <AvoirSectionTitledBox
                title={str(RStr.CreateReleaseScreen_selectTrack_title)}
                description={str(RStr.CreateReleaseScreen_selectTrack_description)}
                contentOffset={1}>
                <Stack
                    direction="row"
                    spacing={3}
                    width={"100%"}
                    alignItems="center"
                >
                    {trackOptions.map((track) => (
                        <AvoirTrackBox
                            key={track.id}
                            disabled={(track.id === TrackId.None && !isValidate) || track.disabled}
                            track={track}
                            isSelected={selectedTrack === track.id}
                            onClick={() => onTrackChange(track.id)}
                        />
                    ))}
                </Stack>
            </AvoirSectionTitledBox>

            <AvoirSectionTitledBox
                title={str(RStr.CreateReleaseScreen_validation_title)}
                description={str(RStr.CreateReleaseScreen_validation_description)}
                infoLink={AppRoute.Article.route(AppRoute.Article.Publishing)}
                contentOffset={1}>
                <Stack
                    direction="row"
                    spacing={3}
                    width={"100%"}
                    alignItems="center"
                >
                    {skipOptions.map((track) => (
                        <AvoirTrackBox
                            track={track}
                            disabled={!track.id && selectedTrack === TrackId.None}
                            isSelected={isValidate === track.id}
                            onClick={() => onValidateChange(track.id)}
                        />
                    ))}
                </Stack>
            </AvoirSectionTitledBox>
        </Stack>
    );
}

interface SummaryStepProps {
    data: CreateReleaseData;
    fees: FeesModuleProps;
}

function SummaryStep(
    {
        data,
        fees,
    }: SummaryStepProps
) {
    return (
        <AvoirSectionTitledBox
            title={str(RStr.CreateReleaseScreen_summary_title)}
            description={str(RStr.CreateReleaseScreen_summary_description)}
            contentOffset={1}>
            <Stack spacing={2}>
                <ConfirmAccountForm
                    devName={data.devName}
                    owner={data?.owner}
                />

                <ConfirmBuildForm
                    build={data?.appBuild}
                />

                <AmountsSummaryForm
                    {...fees}
                />

                {
                    data.isNotOwnershipVerified == true &&
                    <NotEnoughAlert
                        title={str(RStr.AppOwnerInfoForm_ownership_alert)}
                        extendButton={str(RStr.OracleVerificationNotification_verify)}
                        onExtend={data.onVerifyOwnership}
                    />
                }
            </Stack>
        </AvoirSectionTitledBox>
    );
}

export function CreateReleaseScreen() {
    const {devAddress, appPackage, appAddress, isFetching, devId} = AppRoute.AppAsset.useParams()
    const navigate = useNavigate()
    const {address} = useSafeAccount()

    const [activeStep, setActiveStep] = useState(0);
    const [isValidate, setIsValidate] = useState<boolean>(true)
    const [selectedTrack, setSelectedTrack] = useState<TrackId>(1)
    const [fileType, setFileType] = React.useState<FileDrawerType | null>(null)
    const [appBuild, setAppBuild] = useState<ScAppBuild | null>(null)
    const [buildStatus, setBuildStatus] = useState<BuildStatus | null>(null)

    const [state, setState] = useState<AmountSummaryState>(AmountSummaryState.Pending)
    const [isManageDrawerOpen, setIsManageDrawerOpen] = useState<boolean>(false)
    const {
        isLoading: isOwnershipLoading,
        data: ownerVersion,
        setState: setOwnershipVerified
    } = useScreenState<number, boolean>()

    const [retry, setRetry] = useState<number>(0)
    const [errorText, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [canCreateRelease, setCanCreateRelease] = useState<boolean>(false)

    const isNotOwnershipVerified = !isOwnershipLoading
        && isValidate
        && (ownerVersion == null || ownerVersion == 0);

    const isReady = ownerVersion != null
        && buildStatus != null
        && appBuild != null
        && activeStep == 1

    const getState = () => {
        return {
            buildStatus: buildStatus!!,
            appBuild: appBuild!!,
        }
    };

    const skipOptions = useMemo(() => [
        {
            id: false,
            label: 'Skip',
            color: 'text.primary',
            description: str(RStr.CreateReleaseScreen_skip_description)
        },
        {
            id: true,
            label: 'Validate',
            color: 'success.main',
            description: str(RStr.CreateReleaseScreen_validate_description)
        },
    ], []);

    const trackOptions = useMemo(() => [
        {
            id: TrackId.None,
            label: 'None',
            color: 'text.primary',
            description: str(RStr.CreateReleaseScreen_track_none_description),
        },
        {
            id: TrackId.Release,
            label: 'Release',
            color: 'success.main',
            description: str(RStr.CreateReleaseScreen_track_release_description)
        },
        {
            id: TrackId.Beta,
            label: 'Beta',
            color: 'warning.main',
            description: str(RStr.CreateReleaseScreen_track_beta_description),
            disabled: true,
        },
        {
            id: TrackId.Alpha,
            label: 'Alpha',
            color: 'error.main',
            description: str(RStr.CreateReleaseScreen_track_alpha_description),
            disabled: true,
        },
    ], []);

    useAsyncEffect(async () => {
        const lastMirroredVersion = await ScAssetService.getLastBuildVersion(appAddress)
        const lastPublishedVersion = await ScStoreService.getLastAppVersion(appAddress)
        setBuildStatus({ lastPublishedVersion, lastMirroredVersion })
    }, [])

    // mark:fetching,params,prev-state
    const estimateCall = useCallback(async () => {
        if (!isReady) {
            throw new Error("Illegal state! Please contract support!")
        }

        const state = getState()

        if (!isValidate && selectedTrack === TrackId.None) {
            setError("You should select track or validation!")
            throw new Error("You should select track or validation!")
        }

        const lastPublishedVersion = state.buildStatus.lastPublishedVersion
        const lastMirroredVersion = state.buildStatus.lastMirroredVersion
        const isPublished = lastPublishedVersion >= appBuild.versionCode
        const isMirrored = lastMirroredVersion >= appBuild.versionCode

        if (isPublished) {
            // TODO local
            setError(`You should publish build with higher version, last published version is ${lastPublishedVersion}!`)
            throw new Error(`You should publish build with higher version, last published version is ${lastPublishedVersion}!`)
        }

        return await ScStoreService.estimateRelease(appAddress, appBuild, ownerVersion, selectedTrack, isValidate, isMirrored)
    }, [appBuild, isFetching, isValidate, ownerVersion, selectedTrack, activeStep])

    useAsyncEffect(async () => {
        if (activeStep !== 1) {
            return
        }

        if (!isValidate) {
            setOwnershipVerified(S.data(0))
        } else {
            setOwnershipVerified(S.loading())
            try {
                const ownerVersion = await ScOracleService.lastVersionVerified(appAddress)
                setOwnershipVerified(S.data(ownerVersion))
            } catch (e) {
                setOwnershipVerified(S.error(true))
                console.error("[CreateReleaseScreen]:", e)
                setError(DefaultSnackbarError)
            }
        }
    }, [isValidate, activeStep])

    // mark:fetching,params,prev-state
    useAsyncEffect(async () => {
        if (activeStep !== 1 || isFetching) {
            return
        }

        const feesLoading = AmountSummaryHelper.isProcessing(state)
            || isOwnershipLoading

        setIsLoading(feesLoading)

        if (feesLoading) {
            setCanCreateRelease(false)
            return
        }

        const isReady = AmountSummaryHelper.isReady(state)
            && (isValidate || selectedTrack !== TrackId.None)
            && appBuild != null
            && (isValidate && ownerVersion != null)
            && buildStatus != null

        setCanCreateRelease(isReady)
    }, [isFetching, activeStep, state, appBuild, selectedTrack, isOwnershipLoading, ownerVersion, isValidate])

    // mark:fetching,params,prev-state
    const ownerLink = useMemo(() => {
        return AppRoute.OwnerValidation.route(devId, appPackage, devAddress, appAddress)
    }, [isFetching])

    const handleBuildSelected = async (selectedBuild: ScAppBuild) => {
        try {
            setAppBuild(selectedBuild)
            setFileType(null)
        } catch (e: any) {
            console.error("[CreateReleaseScreen.handleBuildSelected]:", e)
            setError(DefaultSnackbarError)
        }
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
        window.scrollTo(0, 0);
    };

    const handleNext = () => {
        if (!appBuild) {
            setError(str(RStr.CreateReleaseScreen_error_selectBuild));
            return;
        }

        if (!isValidate && selectedTrack === TrackId.None) {
            setError(str(RStr.CreateReleaseScreen_error_selectTrackOrValidation));
            return;
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        window.scrollTo(0, 0);
    };

    const handleCreateRelease = async () => {
        if (!canCreateRelease || !isReady) {
            return
        }

        setIsLoading(true)

        try {
            const state = getState()

            if (!isValidate && selectedTrack === TrackId.None) {
                setError("You should select track or validation!")
                throw new Error("You should select track or validation!")
            }

            const lastMirroredVersion = state.buildStatus.lastMirroredVersion
            const isMirrored = lastMirroredVersion >= appBuild.versionCode

            await ScStoreService.callRelease(appAddress, appBuild, ownerVersion, selectedTrack, isValidate, isMirrored)
            useCache().clean()
            navigate(AppRoute.AppStatus.route(devId, appPackage, devAddress, appAddress), { replace: true })
        } catch (e: any) {
            console.error("[CreateReleaseScreen.handleCreateRelease]:", e.message)
            setError(DefaultSnackbarError)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <PageContainer>
            <AutoSnackbar
                message={errorText}
                onClose={() => setError(null)}
            />

            {fileType != null &&
                <FileDrawerDialog
                    open={true}
                    type={fileType}
                    onClose={() => {
                        setFileType(null)
                        setError(null)
                    }}
                    onSelected={handleBuildSelected}
                />
            }

            {isManageDrawerOpen &&
                <DevManageDrawerDialog
                    open={true}
                    onClose={() => setIsManageDrawerOpen(false)}
                    onSuccess={() => { setRetry(error => error + 1) }}
                />
            }

            <AvoirScreenTitle
                title={str(RStr.CreateReleaseScreen_title)}
                description={str(RStr.CreateReleaseScreen_description)}
            />

            <ContentContainer>
                <Stack
                    width={"100%"}
                    height={"100%"}
                    display={"flex"}
                    direction={"row"}
                    justifyContent={"center"}
                    spacing={4}>

                    <Stack
                        flexGrow={1}
                        spacing={3}
                        maxWidth={"1024px"}
                        pb={10}>

                        <Stack spacing={3}>
                            {activeStep === 0 && (
                                <InfoStep
                                    appBuild={appBuild}
                                    selectedTrack={selectedTrack}
                                    isValidate={isValidate}
                                    skipOptions={skipOptions}
                                    trackOptions={trackOptions}
                                    onFileTypeChange={setFileType}
                                    onTrackChange={setSelectedTrack}
                                    onValidateChange={setIsValidate}
                                    onFileChange={() => setAppBuild(null)}
                                />
                            )}

                            {activeStep === 1 && appBuild &&
                                <SummaryStep
                                    data={{
                                        owner: address,
                                        devName: devId,
                                        appBuild: appBuild,
                                        isNotOwnershipVerified: isNotOwnershipVerified,
                                        onVerifyOwnership: () => navigate(ownerLink, { replace: true }),
                                    }}
                                    fees={{
                                        isReady: isReady,
                                        devId: devId,
                                        retryKey: retry,
                                        estimation: estimateCall,
                                        onIncreaseQuota: () => setIsManageDrawerOpen(true),
                                        onError: setError,
                                        onState: setState,
                                        withValidation: true,
                                        quoteRequirement: appConfig.buildQuoteMultiplayer * appBuild.size,

                                        storageMessages: undefined,
                                        relayCalls: undefined,
                                        topUpStorageAmount: undefined,
                                        newQuoteGb: undefined,
                                        withOracle: undefined,
                                    }}
                                />
                            }

                            <Stack
                                direction="row"
                                justifyContent={"flex-end"}
                                sx={{pt: 3, pb: 2}}
                                spacing={3}
                            >
                                {activeStep === 1 && (
                                    <Stack direction="row" spacing={2}>
                                        <AvoirSecondaryButton
                                            disabled={isLoading}
                                            onClick={handleBack}
                                            text={str(RStr.Back)}
                                        />

                                        <AvoirButtons
                                            text={
                                                state == AmountSummaryState.Warning
                                                    ? str(RStr.CreateReleaseScreen_button_publishAnyway)
                                                    : str(RStr.CreateReleaseScreen_button_publish)
                                            }
                                            color={state == AmountSummaryState.Warning ? "warning" : "primary"}
                                            withIcon={false}
                                            disabled={!canCreateRelease}
                                            loading={isLoading}
                                            onClick={handleCreateRelease}
                                        />
                                    </Stack>
                                )}

                                {activeStep === 0 && (
                                    <AvoirButtons
                                        text={str(RStr.Continue)}
                                        onClick={handleNext}
                                        disabled={!appBuild && !isLoading}
                                        withIcon={false}
                                    />
                                )}
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>
            </ContentContainer>
        </PageContainer>
    )
}
