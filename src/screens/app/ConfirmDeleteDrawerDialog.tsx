import {useMemo, useState} from "react";
import {Alert, Box, Drawer, Stack, Typography} from "@mui/material";
import {
    DrawerContentContainer,
    PageContainer,
    ScrollableContentContainer
} from "@components/layouts/BaseContainers.tsx";
import {AvoirScreenTitleSmall} from "@components/basic/AvoirScreenTitle.tsx";
import {AvoirButtons, AvoirSecondaryButton} from "@components/inputs/AvoirButtons.tsx";
import {AutoSnackbar, DefaultSnackbarError} from "@components/events/AutoSnackbar.tsx";
import {useSafeAccount} from "@hooks/useSafeAccount.ts";
import {useSwitchChain} from "wagmi";
import {useGreenfield} from "@di";
import {ScStoreService} from "@data/sc/ScStoreService.ts";
import {GfMsgType} from "@data/greenfield/GreenfieldFeeClient.ts";
import {str} from "@localization/res.ts";
import {RStr} from "@localization/ids.ts";
import {BuildFile} from "./AppBuildsScreen.tsx";
import {BuildInfoForm} from "@screens/forms/BuildInfoForm.tsx";
import {AmountsSummaryForm, AmountSummaryHelper, AmountSummaryState} from "@screens/forms/AmountsSummaryForm.tsx";
import {Address} from "@data/CommonModels.ts";
import {useAsyncEffect} from "@utils/state.ts";
import {appConfig} from "@config";
import {useObserveGreenfield} from "@hooks/useObserveGreenfield.ts";
import {AvoirDialog} from "@components/basic/AvoirDialog.tsx";

interface ConfirmDeleteDrawerDialogProps {
    open: boolean;

    devId: string;
    devAddress: Address;
    appAddress: Address;
    buildFile: BuildFile;

    onClose: () => void;
    onSuccess: () => void;
}

export function ConfirmDeleteDrawerDialog({
    open,
    onClose,
    buildFile,
    devId,
                                              devAddress,
    appAddress,
    onSuccess,
}: ConfirmDeleteDrawerDialogProps) {
    const {address, connector, chainId} = useSafeAccount();
    const initialChainId = useMemo(() => chainId, []);
    const greenfield = useGreenfield();
    const {switchChainAsync} = useSwitchChain();

    const [isDeleting, setIsDeleting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [errorText, setError] = useState<string | null>(null);
    const [state, setState] = useState<AmountSummaryState>(AmountSummaryState.Pending);

    const [isCurrentStoreVersion, setIsCurrentStoreVersion] = useState<boolean>(false);
    const [isCheckingStoreVersion, setIsCheckingStoreVersion] = useState<boolean>(false);

    const storageMessages = useMemo(() => [GfMsgType.DELETE_OBJECT], []);

    useAsyncEffect(async () => {
        setIsCheckingStoreVersion(true);

        try {
            const lastStoreVersion = await ScStoreService.getLastAppVersion(appAddress);
            setIsCurrentStoreVersion(buildFile.versionCode === lastStoreVersion);
        } catch (error: Error | any) {
            console.error("Error checking store version", error.message);
            setError(DefaultSnackbarError);
        } finally {
            setIsCheckingStoreVersion(false);
        }
    }, [open, buildFile, appAddress]);

    const {isObservingBuild, startObserver} = useObserveDeleteObject(devId, () => {
        onSuccess()
        onClose()
    })

    const handleDelete = async () => {
        setIsDeleting(true);
        setError(null);

        try {
            const result = await switchChainAsync({ chainId: appConfig.greenfieldChain.id })
            console.log("switch result ", result)

            const isSuccess = await greenfield.deleteObject(address, devId, buildFile.objectPath, connector)
            if (isSuccess) {
                startObserver(buildFile)
            }
        } catch (error: Error | any) {
            console.error("Error deleting object", error.message)
            setError(DefaultSnackbarError)
        } finally {
            setIsDeleting(false)
            await switchChainAsync({ chainId: initialChainId })
        }
    }

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    height: "100%",
                    width: '700px',
                    display: 'flex',
                    flexDirection: 'column',
                }
            }}
        >
            <AvoirDialog
                open={isDialogOpen}
                title={str(RStr.ConfirmDeleteDrawerDialog_dialog_title)}
                description={str(RStr.ConfirmDeleteDrawerDialog_dialog_description)}
                cancelText={str(RStr.Cancel)}
                confirmText={str(RStr.Delete)}
                confirmVariant={"error"}
                loading={false}
                disableConfirm={false}
                onCancel={() => setIsDialogOpen(false)}
                onConfirm={async () => {
                    setIsDialogOpen(false);
                    await handleDelete()
                }}
            />

            <AutoSnackbar
                message={errorText}
                onClose={() => setError(null)}
            />

            <PageContainer>
                <ScrollableContentContainer>
                    <PageContainer>
                        <AvoirScreenTitleSmall
                            title={str(RStr.ConfirmDeleteDrawerDialog_title)}
                        />

                        <DrawerContentContainer>
                            <Stack
                                width="100%"
                                height="100%"
                                spacing={3}
                            >
                                <BuildInfoForm buildFile={buildFile} />

                                <AmountsSummaryForm
                                    devId={devId}
                                    devAddress={devAddress}
                                    onState={setState}
                                    onError={setError}
                                    storageMessages={storageMessages}

                                    estimation={undefined}
                                    withValidation={undefined}
                                    withOracle={undefined}
                                    onIncreaseQuota={undefined}
                                    fileSize={undefined}
                                    relayCalls={undefined}
                                    topUpStorageAmount={undefined}
                                    newQuoteGb={undefined}
                                    quoteRequirement={undefined}
                                />

                                <Box flexGrow={1}/>

                                <Stack
                                    width="100%"
                                    direction="row"
                                    justifyContent="end"
                                    spacing={2}
                                >
                                    <AvoirSecondaryButton
                                        text={str(RStr.Cancel)}
                                        onClick={onClose}
                                        disabled={isDeleting}
                                    />

                                    <AvoirButtons
                                        text={str(RStr.ConfirmDeleteDrawerDialog_button_delete)}
                                        onClick={() => setIsDialogOpen(true)}
                                        loading={isDeleting || AmountSummaryHelper.isProcessing(state) || isCheckingStoreVersion || isObservingBuild}
                                        disabled={!AmountSummaryHelper.isReady(state) && !AmountSummaryHelper.isWarning(state)}
                                        withIcon={false}
                                        color={"error"}
                                    />
                                </Stack>

                                {isCurrentStoreVersion && (
                                    <Alert color={"warning"} icon={false}>
                                        <Typography variant="body2">
                                            {str(RStr.ConfirmDeleteDrawer_storeWarning)}
                                        </Typography>
                                    </Alert>
                                )}
                            </Stack>
                        </DrawerContentContainer>
                    </PageContainer>
                </ScrollableContentContainer>
            </PageContainer>
        </Drawer>
    );
}

function useObserveDeleteObject(devId: string | null, onSuccess: () => void) {
    const greenfield = useGreenfield();

    const { isObservingBuild, startObserver } = useObserveGreenfield<BuildFile>(
        async (data) => {
            if (devId == null || data == null) {
                console.log("useObserveDeleteObject: devId or data is null", devId, data == null)
                return false
            }

            const hasFile = await greenfield.hasFile(devId, data.objectPath)
            if (!hasFile) {
                console.log("File successfully deleted: ", devId, data.objectPath)
                onSuccess()
                return true
            }

            return false
        },
        [devId],
    )

    return { isObservingBuild, startObserver }
}
