import {AvoirScreenTitle} from "@components/basic/AvoirScreenTitle.tsx";
import {ContentContainer, MainContainer, OutletContainer} from "@components/layouts/BaseContainers.tsx";
import {Box, Stack, Toolbar} from "@mui/material";
import {AvoirButtons} from "@components/inputs/AvoirButtons.tsx";
import {useNavigate} from "react-router";
import {AppRoute} from "@router";
import {AvoirDrawer} from "@components/basic/AvoirDrawer.tsx";
import {AvoirToolbar} from "@components/basic/AvoirToolbar.tsx";
import {useCallback, useState} from "react";
import {ScDevService} from "@data/sc/ScDevService.ts";
import {ConfirmAccountForm} from "@screens/forms/ConfirmAccountForm";
import {useSafeAccount} from "@hooks/useSafeAccount.ts";
import {useGreenfield} from "@di";
import {AutoSnackbar, DefaultSnackbarError} from "@components/events/AutoSnackbar.tsx";
import {AvoirCard} from "@components/basic/AvoirCard.tsx";
import {Address, ProtocolId, ProtocolIdUtil} from "@data/CommonModels.ts";
import {RStr} from "@localization/ids.ts";
import {str} from "@localization/res.ts";
import {AvoirSectionBox, AvoirSectionTitle, AvoirSectionTitledBox} from "@components/basic/AvoirSection.tsx";
import {AvoirFooter} from "@components/basic/AvoirFooter.tsx";
import {Reg} from "@utils/regex.ts";
import {CheckableTextField} from "@screens/intro/CommitableTextField.tsx";
import {AmountsSummaryForm, AmountSummaryHelper, AmountSummaryState} from "@screens/forms/AmountsSummaryForm.tsx";
import {EstimationResult} from "@data/sc/ScBaseService.ts";
import {appConfig} from "@config";
import {parseEther} from "viem";
import {useAsyncEffect} from "@utils/state.ts";
import {useObserveGreenfield} from "@hooks/useObserveGreenfield.ts";
import {ScreenAwaitng} from "@components/basic/ScreenAwaitng.tsx";

export function IntroCreateDevScreen() {
    const navigate = useNavigate()
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <MainContainer>
            <AvoirDrawer
                idOpen={drawerOpen}
                items={[]}
                backText={str(RStr.IntroCreateDevScreen_drawer_allDevelopers)}
                backLink={AppRoute.Devs.route()}
                onBack={() => {
                    navigate(AppRoute.Devs.route(), {replace: true})
                    setDrawerOpen(false)
                }}
                onClose={() => setDrawerOpen(false)}
            />

            <AvoirToolbar
                onOpenMenu={() => {
                    setDrawerOpen(true)
                }}
            />

            <OutletContainer>
                <Toolbar/>

                <AvoirScreenTitle
                    title={str(RStr.IntroCreateDevScreen_title)}
                    description={str(RStr.IntroCreateDevScreen_description)}/>

                <Box component="main" sx={{flex: '1 0 auto'}}>
                    <Content/>
                </Box>

                <Box component="footer">
                    <AvoirFooter/>
                </Box>
            </OutletContainer>
        </MainContainer>
    )
}

function Content() {
    const {address} = useSafeAccount();

    const [feeError, setFeeError] = useState<string | null>(null);
    const [state, setState] = useState<AmountSummaryState>(AmountSummaryState.Pending);

    const {
        name,
        onNameChange,
        nameError,
        isValidatingName,
        validatedName,
        validateName,
        checkNameDisabled,
        validationError,
        clearValidationError
    } = useValidateDevName();

    const canCreate = validatedName != null
        && AmountSummaryHelper.isReady(state);

    const {
        isCreating,
        isObservingBuild,
        devAddress,
        spProvider,
        creationError,
        estimateCall,
        createDevAccount,
        clearCreationError,
    } = useCreateDev({validatedName, canCreate});

    const isLoading = isCreating
        || isValidatingName
        || AmountSummaryHelper.isLoading(state);

    const error = validationError
        || creationError
        || feeError

    return (
        <ContentContainer>
            <AutoSnackbar
                message={error}
                onClose={() => {
                    clearCreationError()
                    clearValidationError()
                    setFeeError(null)
                }}
            />

            <Stack
                width={"100%"}
                height={"100%"}
                display={"flex"}
                direction={"row"}
                justifyContent={"center"}
                spacing={4}>

                {
                    isObservingBuild &&
                    <ScreenAwaitng title={"Getting your new publisher account ready"}/>
                }

                {
                    !isObservingBuild && (<>
                        <Stack
                            flexGrow={1}
                            spacing={3}
                            maxWidth={"1024px"}
                            pb={10}>

                            <AvoirSectionTitledBox
                                contentOffset={2}
                                title={str(RStr.IntroCreateDevScreen_developerInfo_title)}
                                description={str(RStr.IntroCreateDevScreen_developerInfo_description)}>
                                <Stack spacing={3}>
                                    <Stack direction="column" spacing={2}>
                                        <CheckableTextField
                                            label={str(RStr.IntroCreateDevScreen_name_label)}
                                            value={name}
                                            maxLength={appConfig.maxDevNameLength}
                                            onChange={onNameChange}
                                            onCommit={validateName}
                                            error={nameError != null}
                                            loading={isValidatingName}
                                            disabled={isValidatingName || isLoading}
                                            commitDisabled={checkNameDisabled}
                                            helperText={nameError ?? str(RStr.IntroCreateDevScreen_name_helper)}/>
                                    </Stack>
                                </Stack>
                            </AvoirSectionTitledBox>

                            <AvoirSectionTitledBox
                                contentOffset={2}
                                title={str(RStr.IntroCreateDevScreen_primaryStorage_title)}
                                description={str(RStr.IntroCreateDevScreen_primaryStorage_description)}
                                infoLink={AppRoute.Article.route(AppRoute.Article.HowItWorks)}>
                                <AvoirCard
                                    title={ProtocolIdUtil.getProtocolName(ProtocolId.Greenfield)}
                                    description={str(RStr.IntroCreateDevScreen_greenfield_description)}
                                    image="https://forklog.com/wp-content/uploads/bnb_bsc-min.webp"
                                    selected={true}
                                />
                            </AvoirSectionTitledBox>


                        </Stack>

                        <Stack
                            position={"sticky"}
                            width={450}
                            height={"100%"}
                            flexShrink={0}
                            spacing={2}>

                            <AvoirSectionBox variant={"side"}>
                                <AvoirSectionTitle
                                    title={str(RStr.IntroCreateDevScreen_reviewSummary_title)}
                                />

                                <Stack
                                    spacing={2}>

                                    <Stack spacing={2}>
                                        <ConfirmAccountForm
                                            devName={validatedName}
                                            owner={address}
                                            devAddress={devAddress}
                                            spProvider={spProvider}
                                        />

                                        <AmountsSummaryForm
                                            {...{
                                                isReady: devAddress != null && spProvider != null,
                                                estimation: estimateCall,
                                                onError: setFeeError,
                                                onState: setState,

                                                topUpStorageAmount: appConfig.defaultBucketTopUp,
                                                withBalance: true,

                                                withValidation: undefined,
                                                withOracle: undefined,
                                                relayCalls: undefined,
                                                storageMessages: undefined,
                                                onIncreaseQuota: undefined,
                                                devId: undefined,
                                                fileSize: undefined,
                                                quoteMultiplayer: undefined,
                                                retryKey: undefined,
                                                newQuoteGb: undefined,
                                            }}
                                        />
                                    </Stack>

                                    <Stack
                                        display={"flex"}
                                        justifyContent={"flex-end"}>

                                        <AvoirButtons
                                            text={str(RStr.IntroCreateDevScreen_button_create)}
                                            color={"primary"}
                                            withIcon={false}
                                            disabled={!canCreate || isLoading}
                                            loading={isCreating}
                                            onClick={createDevAccount}
                                        />
                                    </Stack>
                                </Stack>
                            </AvoirSectionBox>
                        </Stack>
                    </>)
                }
            </Stack>
        </ContentContainer>
    )
}

function useValidateDevName() {
    const greenfield = useGreenfield();

    const [name, setName] = useState<string>('');
    const [nameError, setNameError] = useState<string>();
    const [isValidatingName, setValidatingName] = useState(false);
    const [validatedName, setValidatedName] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    const onNameChange = useCallback((newName: string) => {
        setName(newName);

        if (validatedName) {
            setValidatedName(null);
        }

        setNameError(undefined);
    }, [validatedName]);

    const validateName = useCallback(async () => {
        setValidatingName(true);
        setNameError(undefined);
        setValidationError(null);

        let localError: string | undefined;
        if (name === '') {
            localError = str(RStr.IntroCreateDevScreen_name_error_required);
        } else if (!Reg.isBucketLengthValid(name)) {
            localError = str(RStr.IntroCreateDevScreen_name_error_length);
        } else if (!Reg.isBucketSymbolsValid(name)) {
            localError = str(RStr.IntroCreateDevScreen_name_error_symbols);
        } else if (!Reg.isBucketBeginEndValid(name)) {
            localError = str(RStr.IntroCreateDevScreen_name_error_beginEnd);
        } else {
            try {
                if (await greenfield.hasBucket(name)) {
                    localError = str(RStr.IntroCreateDevScreen_name_error_taken);
                }
            } catch (e: any) {
                console.error(e.message);
                localError = DefaultSnackbarError;
                setValidationError(DefaultSnackbarError);
            }
        }

        if (localError) {
            setNameError(localError);
            setValidatedName(null);
        } else {
            setValidatedName(name);
        }
        setValidatingName(false);
        return !localError;
    }, [name, greenfield]);

    return {
        name,
        onNameChange,
        nameError,
        isValidatingName,
        validatedName,
        validateName,
        checkNameDisabled: name.length === 0 || validatedName === name || isValidatingName,
        validationError,
        clearValidationError: () => setValidationError(null)
    };
}

interface DevAccountEventData {
    devId: string;
    account: Address;
}

function useCreateDev({validatedName, canCreate}: { validatedName: string | null, canCreate: boolean }) {
    const {address} = useSafeAccount();
    const navigate = useNavigate();
    const greenfield = useGreenfield();

    const [isCreating, setCreating] = useState(false);
    const [creationError, setCreationError] = useState<string | null>(null);
    const [devAddress, setDevAccount] = useState<Address | undefined>(undefined);
    const [spAddress, setSpAddress] = useState<Address | undefined>(undefined);

    const {isObservingBuild, startObserver} = useObserveBucket(
        (data) => {
            navigate(AppRoute.DevAccount.route(data.devId, data.account), {replace: true});
        }
    )

    useAsyncEffect(async () => {
        if (!validatedName) {
            return;
        }

        const spAddress = await greenfield.randomSpProvider(appConfig.defaultGlobalFamilyGroup)
        setSpAddress(spAddress)

        const devAddress = await ScDevService.computeDevAddress(address, validatedName)
        setDevAccount(devAddress)
    }, [validatedName])

    const estimateCall = useCallback(async (): Promise<EstimationResult> => {
        if (!validatedName || !devAddress || !spAddress) {
            console.error("Invalid state", validatedName, devAddress, spAddress);
            throw new Error("Invalid state");
        }

        const topUpAmount = parseEther(appConfig.defaultBucketTopUp.toString())
        const estimation = await ScDevService.estimateCreateDevAccount(
            validatedName,
            devAddress,
            spAddress,
            appConfig.defaultGlobalFamilyGroup,
            topUpAmount,
        );

        return estimation
    }, [validatedName, devAddress, spAddress]);

    const createDevAccount = useCallback(async () => {
        if (!canCreate || !validatedName || !devAddress || !spAddress) {
            return
        }

        setCreating(true);
        setCreationError(null);

        try {
            const topUpAmount = parseEther(appConfig.defaultBucketTopUp.toString())
            const receipt = await ScDevService.createDevAccount(
                validatedName,
                devAddress,
                spAddress,
                appConfig.defaultGlobalFamilyGroup,
                topUpAmount,
            );

            const log = ScDevService.findDevAccountCreatedTopic(receipt.logs);
            if (log) {
                const event = ScDevService.decodeDevAccountCreateEvent(log);
                ScDevService.setDevAddress(event.name, event.account);
                startObserver({devId: event.name, account: event.account})
            } else {
                navigate(-1);
                setCreationError(str(RStr.IntroCreateDevScreen_error_created));
            }
        } catch (e: any) {
            setCreationError(str(RStr.IntroCreateDevScreen_error_creation));
            console.error(e.message);
            setCreating(false);
        }
    }, [validatedName, devAddress, spAddress, canCreate]);

    return {
        isCreating: isCreating || isObservingBuild,
        isObservingBuild: isObservingBuild,
        estimateCall,
        createDevAccount,
        creationError,
        devAddress,
        spProvider: spAddress,
        clearCreationError: () => setCreationError(null)
    }
}

function useObserveBucket(onSuccess: (data: DevAccountEventData) => void) {
    const greenfield = useGreenfield();

    const {isObservingBuild, startObserver} = useObserveGreenfield<DevAccountEventData>(
        async (data) => {
            if (data == null) {
                console.log("DevId or Data are empty skip observation iteration!");
                return false
            }

            const hasImage = await greenfield.hasBucket(data.devId)

            if (hasImage) {
                console.log("Bucket was created, finish observation!");
                onSuccess(data)
                return true
            }

            return false
        },
        [],
    )

    return {isObservingBuild, startObserver}
}
