import {Address} from "@data/CommonModels.ts";
import {Stack} from "@mui/material";
import {AvoirSectionTitledBox} from "@components/basic/AvoirSection.tsx";
import {ConfirmAccountForm} from "@screens/forms/ConfirmAccountForm.tsx";
import {AmountsSummaryForm, AmountSummaryHelper, AmountSummaryState} from "@screens/forms/AmountsSummaryForm.tsx";
import {EstimationResult} from "@data/sc/ScBaseService.ts";
import {useNavigate} from "react-router";
import {AppRoute} from "@router";
import {useCallback, useMemo, useState} from "react";
import {S, useAsyncEffect, useScreenState} from "@utils/state.ts";
import {AutoSnackbar, DefaultSnackbarError} from "@components/events/AutoSnackbar.tsx";
import {ScAppDistribution, ScAppDistributionType, ScAssetService} from "@data/sc/ScAssetService.ts";
import Box from "@mui/material/Box";
import {AvoirScreenTitle} from "@components/basic/AvoirScreenTitle.tsx";
import {ContentContainer} from "@components/layouts/BaseContainers.tsx";
import {DefaultScreenErrorProps, ScreenError} from "@components/basic/ScreenError.tsx";
import {AvoirButtons, AvoirSecondaryButton} from "@components/inputs/AvoirButtons.tsx";
import {AppSourcesEditForm, AppSourcesSummaryForm, MAX_CUSTOM_URL} from "@screens/forms/AppSourcesForm.tsx";
import {RStr} from "@localization/ids.ts";
import {str} from "@localization/res.ts";
import {Reg} from "@utils/regex.ts";

interface SummaryStepProps {
    devId: string;
    devAddress: Address;
    appPackage: string;
    appAddress: Address;
    distribution: ScAppDistribution;
    onStateChange: (state: AmountSummaryState) => void;
    onError: (error: string) => void;
}

function SummaryStep({
    devId,
    devAddress,
    appPackage,
    appAddress,
    distribution,
    onStateChange,
    onError,
}: SummaryStepProps) {
    const estimateCall = useCallback(async (): Promise<EstimationResult> => {
        const fee = await ScAssetService.estimateUpdateDistribution(appAddress, distribution);
        return fee
    }, [appAddress, distribution]);

    return (
        <Stack spacing={6}>
            <AvoirSectionTitledBox
                title={str(RStr.AppsEditDistributionScreen_summary_title)}
                description={str(RStr.AppsEditDistributionScreen_summary_description)}
                infoLink={AppRoute.Article.route(AppRoute.Article.CustomDistribution)}
                contentOffset={1}>
                <Stack spacing={2}>
                    <ConfirmAccountForm
                        devName={devId}
                        appPackage={appPackage}
                    />

                    <AppSourcesSummaryForm
                        distribution={distribution}
                    />

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
                        withOracle={undefined}
                        fileSize={undefined}
                        quoteRequirement={undefined}
                    />
                </Stack>
            </AvoirSectionTitledBox>
        </Stack>
    );
}

export function AppEditDistributionScreen() {
    const navigate = useNavigate();

    const {devId, devAddress, appPackage, appAddress, isFetching} = AppRoute.AppDistributionEdit.useParams();

    const [activeStep, setActiveStep] = useState(0);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [state, setFeeState] = useState<AmountSummaryState>(AmountSummaryState.Pending);

    const {
        isLoading,
        data,
        error,
        retry,
        retryCount,
        setState,
    } = useScreenState<ScAppDistribution | null, string>()

    const [deletedIndexes, setDeletedIndexes] = useState<Set<number>>(new Set<number>());
    const [distribution, setDistribution] = useState<ScAppDistribution>({
        type: ScAppDistributionType.Default,
        sources: []
    });

    const [newDistributionData, setNewDistributionData] = useState<ScAppDistribution | null>(null);

    // Helper logic
    const hasPendingChanges = useMemo(() => {
        if (isFetching || isLoading || !data) {
            return false
        }

        if (data.sources.length == 0 && distribution.sources.length == 1 && distribution.sources[0] == '') {
            return false
        }

        return deletedIndexes.size > 0 || distribution.sources.length > 0 || distribution.type != data.type
    }, [isFetching, isLoading, data, deletedIndexes, distribution]);

    const isDataLoading = isFetching || isLoading || isEditing
    const isProceedDisabled = isLoading || !hasPendingChanges
    const isBackDisabled = isDataLoading || AmountSummaryHelper.isProcessing(state)
    const isFinishDisabled = isProceedDisabled || !AmountSummaryHelper.isReady(state)

    useAsyncEffect(async () => {
        if (isFetching) {
            return
        }

        try {
            setState(S.loading())
            const state = await ScAssetService.getDistributionSources(appAddress)
            console.log(state)
            setDistribution(
                {
                    type: state.type,
                    sources: state.sources.length == 0 ? [''] : []
                }
            )
            setState(S.data(state))
        } catch (e) {
            console.error(e)
            setState(S.error(DefaultSnackbarError))
        }
    }, [isFetching, retryCount]);

    const handleNext = async () => {
        if (!data) {
            return
        }

        const newSources = data?.sources ?? []
            .filter((_, i) => !deletedIndexes.has(i));

        const newData: ScAppDistribution = {
            type: distribution.type,
            sources: [...newSources, ...distribution.sources]
        }

        if (newData.sources.length == 0 && newData.type == ScAppDistributionType.Custom) {
            setErrorMsg(str(RStr.AppsEditDistributionScreen_error_noSources))
            return
        }

        let isAllSourcesValid = true
        for (const [index, url] of newData.sources.entries()) {
            if (!Reg.isWebsiteValid(url)) {
                isAllSourcesValid = false
                setErrorMsg(str(RStr.AppsEditDistributionScreen_error_invalidUrl)
                    .replace("{index}", (index + 1).toString()))
                break
            }
        }

        if (!isAllSourcesValid) {
            return
        }

        setNewDistributionData(newData);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        window.scrollTo(0, 0);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
        window.scrollTo(0, 0)
    };

    const handleFinish = async () => {
        if (!newDistributionData) {
            setErrorMsg(str(RStr.AppsEditDistributionScreen_error_updateFailed))
            return
        }

        setIsEditing(true)

        try {
            await ScAssetService.updateDistribution(
                appAddress, newDistributionData
            )

            ScAssetService.resetAllCache()
            navigate(-1)
        } catch (e) {
            ScAssetService.resetAllCache()
            setIsEditing(false)
            setErrorMsg(DefaultSnackbarError)
            console.error(e)
        }
    }
    const changeDistributionType = (type: ScAppDistributionType) => {
        setDistribution({
            type,
            sources: distribution.sources
        });
    };

    const addCustomUrl = () => {
        if (distribution.sources.length < MAX_CUSTOM_URL) {
            setDistribution({
                ...distribution,
                sources: [...distribution.sources, '']
            });
        }
    };

    const removeCustomUrl = (index: number) => {
        const newUrls = [...distribution.sources];
        newUrls.splice(index, 1);
        setDistribution({
            ...distribution,
            sources: newUrls.length > 0
                ? newUrls
                : [],
        });
    };

    const updateCustomUrl = (index: number, value: string) => {
        const newUrls = [...distribution.sources];
        newUrls[index] = value;
        setDistribution({
            ...distribution,
            sources: newUrls
        });
    };

    return (
        <Box>
            <AutoSnackbar message={errorMsg} onClose={() => setErrorMsg(null)}/>

            <AvoirScreenTitle
                title={str(RStr.AppsEditDistributionScreen_title)}
                description={str(RStr.AppsEditDistributionScreen_description)}
                isLoading={isFetching || isLoading}/>

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
                        (error) &&
                        <ScreenError
                            {...DefaultScreenErrorProps}
                            action={str(RStr.AppsEditDistributionScreen_error_action)}
                            onAction={() => {
                                retry()
                            }}
                        />
                    }

                    {
                        (data) &&
                        <Stack
                            flexGrow={1}
                            spacing={3}
                            maxWidth={"1024px"}
                        >
                            <Stack spacing={3}>
                                {activeStep === 0 && data && (
                                    <>
                                        <AppSourcesEditForm
                                            sources={data.sources}
                                            deletedIndexes={deletedIndexes}
                                            isCustomEnabled={distribution.type == ScAppDistributionType.Custom}
                                            onRestoreSource={(index) => {
                                                setDeletedIndexes((prevState) => {
                                                    const data = new Set(prevState)
                                                    data.delete(index)
                                                    return data
                                                })
                                            }}
                                            onDeleteSource={(index) => {
                                                setDeletedIndexes((prevState) => {
                                                    return new Set(prevState).add(index)
                                                })
                                            }}
                                            onCustomChange={(isEnabled) => {
                                                changeDistributionType(
                                                    isEnabled
                                                        ? ScAppDistributionType.Custom
                                                        : ScAppDistributionType.Default
                                                )
                                            }}
                                            isLoading={isFetching || isLoading}
                                            editProps={{
                                                sources: distribution.sources,
                                                isLoading: isFetching || isLoading,
                                                onAddUrl: addCustomUrl,
                                                onRemoveUrl: removeCustomUrl,
                                                onUpdateUrl: updateCustomUrl,
                                            }}
                                        />
                                    </>
                                )}

                                {
                                    activeStep === 1 && newDistributionData &&
                                    <SummaryStep
                                        devId={devId}
                                        devAddress={devAddress}
                                        appPackage={appPackage}
                                        appAddress={appAddress}
                                        distribution={newDistributionData}
                                        onStateChange={setFeeState}
                                        onError={setErrorMsg}
                                    />
                                }

                                <Stack
                                    direction="row"
                                    justifyContent={"flex-end"}
                                    py={2}
                                    spacing={3}
                                >
                                    {activeStep === 0 && (
                                        <Stack direction={"row"} spacing={2}>
                                            <AvoirSecondaryButton
                                                onClick={() => navigate(-1)}
                                                disabled={isEditing}
                                                text={str(RStr.AppsEditDistributionScreen_button_back)}
                                            />

                                            <AvoirButtons
                                                text={str(RStr.AppsEditDistributionScreen_button_continue)}
                                                onClick={handleNext}
                                                disabled={isProceedDisabled}
                                            />
                                        </Stack>
                                    )}

                                    {activeStep == 1 && (
                                        <Stack direction={"row"} spacing={2}>
                                            <AvoirSecondaryButton
                                                onClick={handleBack}
                                                disabled={isBackDisabled}
                                                text={str(RStr.AppsEditDistributionScreen_button_back)}
                                            />

                                            <AvoirButtons
                                                text={str(RStr.AppsEditDistributionScreen_button_save)}
                                                onClick={handleFinish}
                                                disabled={isFinishDisabled}
                                                loading={isDataLoading}
                                            />
                                        </Stack>
                                    )}
                                </Stack>
                            </Stack>
                        </Stack>
                    }
                </Stack>
            </ContentContainer>
        </Box>
    );
}
