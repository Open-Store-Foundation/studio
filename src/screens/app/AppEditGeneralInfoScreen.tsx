import {
    Address,
    AndroidTypeId,
    AppCategoryId,
    CategoryId,
    GameCategoryId,
    PlatformId,
    ProtocolId
} from "@data/CommonModels.ts";
import {Stack} from "@mui/material";
import {AvoirSectionTitledBox} from "@components/basic/AvoirSection.tsx";
import {ConfirmAccountForm} from "@screens/forms/ConfirmAccountForm.tsx";
import {AvoirProperty, AvoirPropertyBox} from "@components/basic/AvoirProperty.tsx";
import {AmountsSummaryForm, AmountSummaryHelper, AmountSummaryState} from "@screens/forms/AmountsSummaryForm.tsx";
import {EstimationResult} from "@data/sc/ScBaseService.ts";
import {useNavigate} from "react-router";
import {AppRoute} from "@router";
import {useCallback, useState} from "react";
import {S, useAsyncEffect, useScreenState} from "@utils/state.ts";
import {AutoSnackbar, DefaultSnackbarError} from "@components/events/AutoSnackbar.tsx";
import {ScAppGeneralInfo, ScAssetService} from "@data/sc/ScAssetService.ts";
import Box from "@mui/material/Box";
import {AvoirScreenTitle} from "@components/basic/AvoirScreenTitle.tsx";
import {ContentContainer} from "@components/layouts/BaseContainers.tsx";
import {DefaultScreenErrorProps, ScreenError} from "@components/basic/ScreenError.tsx";
import {AvoirButtons, AvoirSecondaryButton} from "@components/inputs/AvoirButtons.tsx";
import {GeneralInfoStep} from "@screens/create/CreateAppScreen.tsx";
import {AppCategorySummaryForm} from "@screens/forms/AppCategoryForm.tsx";
import {Reg} from "@utils/regex.ts";
import {RStr} from "@localization/ids.ts";
import {str} from "@localization/res.ts";

interface SummaryStepProps {
    devId: string;
    devAddress: Address;
    appPackage: string;
    appAddress: Address;
    newData: ScAppGeneralInfo;
    onStateChange: (state: AmountSummaryState) => void;
    onError: (error: string) => void;
}

function SummaryStep({
    devId,
    devAddress,
    appPackage,
    appAddress,
    newData,
    onStateChange,
    onError,
}: SummaryStepProps) {
    const estimateCall = useCallback(async (): Promise<EstimationResult> => {
        const fee = await ScAssetService.estimateUpdateGeneralInfo(
            appAddress, newData.name, newData.description, newData.categoryId
        );
        return fee;
    }, [appAddress, newData.name, newData.description, newData.categoryId]);

    return (
        <Stack spacing={6}>
            <AvoirSectionTitledBox
                title={str(RStr.AppsEditGeneralInfoScreen_summary_title)}
                description={str(RStr.AppsEditGeneralInfoScreen_summary_description)}
                infoLink={AppRoute.Article.route(AppRoute.Article.HowItWorks)}
                contentOffset={1}>
                <Stack spacing={2}>
                    <ConfirmAccountForm
                        devName={devId}
                        appPackage={appPackage}
                    />

                    <AvoirPropertyBox title={str(RStr.AppsEditGeneralInfoScreen_summary_generalInfo)}>
                        <AvoirProperty
                            title={str(RStr.AppsEditGeneralInfoScreen_summary_package)}
                            value={newData.package}
                        />
                        <AvoirProperty
                            title={str(RStr.AppsEditGeneralInfoScreen_summary_name)}
                            value={newData.name}
                        />
                    </AvoirPropertyBox>

                    <AppCategorySummaryForm
                        objType={newData.objectId || AndroidTypeId.App}
                        category={newData.categoryId}
                        platform={newData.platformId}
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

export function AppEditGeneralInfoScreen() {
    const navigate = useNavigate();

    const {devId, devAddress, appPackage, appAddress, isFetching} = AppRoute.AppInfoEdit.useParams();

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
    } = useScreenState<ScAppGeneralInfo | null, string>()

    const [appName, setAppName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [isNameValid, setIsNameValid] = useState<boolean>(true);
    const [newData, setNewData] = useState<ScAppGeneralInfo | null>(null);
    const [platformId] = useState<PlatformId>(PlatformId.Android);
    const [objType, setObjType] = useState<AndroidTypeId>(AndroidTypeId.App);
    const [category, setCategory] = useState<CategoryId>(AppCategoryId.BooksAndReference);

    // Helper logic
    const hasPendingChanges = appName != data?.name || category != data?.categoryId;
    const isDataLoading = isFetching || isLoading || isEditing;
    const isProceedDisabled = isLoading || !hasPendingChanges;
    const isBackDisabled = isDataLoading || AmountSummaryHelper.isProcessing(state);
    const isFinishDisabled = isProceedDisabled || !AmountSummaryHelper.isReady(state);

    useAsyncEffect(async () => {
        if (isFetching) {
            return
        }

        try {
            setState(S.loading())
            const state = await ScAssetService.getAppGeneralInfo(appAddress)
            setAppName(state.name)
            setCategory(state.categoryId)
            setDescription(state.description)
            setState(S.data(state))
        } catch (e) {
            console.error(e)
            setState(S.error(DefaultSnackbarError))
        }
    }, [isFetching, retryCount]);

    const handleNext = async () => {
        const isNmValid = Reg.isAppNameValid(appName);

        setIsNameValid(isNmValid);

        if (!isNmValid) {
            console.error("General info validation failed");
            return;
        }

        const newData: ScAppGeneralInfo = {
            package: appPackage,
            name: appName,
            description: description,
            categoryId: category,
            platformId: platformId,
            protocolId: ProtocolId.Greenfield,
            objectId: objType
        }

        setNewData(newData);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        window.scrollTo(0, 0);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
        window.scrollTo(0, 0)
    };

    const handleFinish = async () => {
        if (!newData) {
            setErrorMsg(str(RStr.AppsEditGeneralInfoScreen_error_updateFailed))
            return
        }

        setIsEditing(true)

        try {
            await ScAssetService.updateGeneralInfo(
                appAddress, newData.name, newData.description, newData.categoryId
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

    return (
        <Box>
            <AutoSnackbar message={errorMsg} onClose={() => setErrorMsg(null)}/>

            <AvoirScreenTitle
                title={str(RStr.AppsEditGeneralInfoScreen_title)}
                description={str(RStr.AppsEditGeneralInfoScreen_description)}
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
                            action={str(RStr.AppsEditGeneralInfoScreen_error_action)}
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
                                {activeStep === 0 && (
                                    <>
                                        <GeneralInfoStep
                                            name={{
                                                value: appName,
                                                onChange: (name) => {
                                                    setAppName(name);
                                                    setIsNameValid(Reg.isAppNameValid(name));
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
                                            isProcessing={isLoading}
                                            onCategoryChange={setCategory}
                                            onTypeChange={(newType) => {
                                                setObjType(newType);
                                                if (newType === AndroidTypeId.Game) {
                                                    setCategory(GameCategoryId.Action);
                                                } else {
                                                    setCategory(AppCategoryId.BooksAndReference);
                                                }
                                            }}
                                        />
                                    </>
                                )}

                                {activeStep === 1 && newData &&
                                    <>
                                        <SummaryStep
                                            devId={devId}
                                            devAddress={devAddress}
                                            appPackage={appPackage}
                                            appAddress={appAddress}
                                            newData={newData}
                                            onStateChange={setFeeState}
                                            onError={setErrorMsg}
                                        />
                                    </>
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
                                                text={str(RStr.AppsEditGeneralInfoScreen_button_back)}
                                            />

                                            <AvoirButtons
                                                text={str(RStr.AppsEditGeneralInfoScreen_button_continue)}
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
                                                text={str(RStr.AppsEditGeneralInfoScreen_button_back)}
                                            />

                                            <AvoirButtons
                                                text={str(RStr.AppsEditGeneralInfoScreen_button_save)}
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