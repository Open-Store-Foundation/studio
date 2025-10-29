import {useTaskManager} from "@di";
import {ReactNode, useEffect, useState} from "react";
import {Address} from "@data/CommonModels.ts";
import {Box, Stack} from "@mui/material";
import {AvoirDropZone} from "@components/inputs/AvoirDropZone.tsx";
import {AvoirButtons, AvoirSecondaryButton} from "@components/inputs/AvoirButtons.tsx";
import {useAsyncEffect} from "@utils/state.ts";
import {ContentContainer, PageContainer} from "@components/layouts/BaseContainers.tsx";
import {AvoirScreenTitleSmall} from "@components/basic/AvoirScreenTitle.tsx";
import {AutoSnackbar, DefaultSnackbarError} from "@components/events/AutoSnackbar.tsx";
import {AmountsSummaryForm, AmountSummaryHelper, AmountSummaryState} from "@screens/forms/AmountsSummaryForm.tsx";
import {GfMsgType} from "@data/greenfield/GreenfieldFeeClient.ts";
import {ConfirmAccountForm} from "@screens/forms/ConfirmAccountForm";
import {RStr} from "@localization/ids.ts";
import {str} from "@localization/res.ts";
import {FileValidator} from "@utils/validators.ts";
import {Task, TaskEvent, TaskState, TaskStateCheck, TaskStatus} from "@data/scheduler/TaskClient.ts";
import {AvoirDialog} from "@components/basic/AvoirDialog.tsx";
import {FileUploadingLoader} from "@components/inputs/FileUploadingLoader.tsx";


export interface BaseFileUploaderProps {
    devId: string,
    devAddress: Address,
    appPackage: string,
    address: Address,

    validator: FileValidator;
    title: string;

    isReady?: boolean;
    isLoading?: boolean;

    onSuccess?: () => void;
    onSelected: (file: File) => void;
    onClose: () => void;
    uploadTask: () => Promise<Task | undefined>;

    additionForm?: ReactNode;
}

export function BaseFileUploaderDrawer(
    {
        devId,
        devAddress,
        appPackage,
        address,

        isReady,
        isLoading,

        onSuccess,
        onClose,
        uploadTask,
        onSelected,

        validator,
        title,

        additionForm,
    }: BaseFileUploaderProps
) {
    const taskManager = useTaskManager();

    const [errorText, setError] = useState<string | null>(null)
    const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined)
    const [taskState, setTaskState] = useState<TaskState | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [feeState, setFeeState] = useState<AmountSummaryState>(AmountSummaryState.Pending);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleNext = async () => {
        const task = await uploadTask();
        if (!task) {
            return
        }

        setCurrentTask(task);
    }

    useEffect(() => {
        if (!currentTask) {
            return
        }

        const handleTaskUpdate = (task: TaskState) => {
            if (currentTask?.id === task.id) {
                setTaskState(task);

                if (task.status === TaskStatus.Pending) {
                    setUploadProgress(0);
                }
            }
        };

        const handleTaskProgress = (id: string, progress: number) => {
            if (currentTask?.id === id) {
                setUploadProgress(progress);
            }
        };

        taskManager.on(TaskEvent.Updated, handleTaskUpdate);
        taskManager.on(TaskEvent.Progress, handleTaskProgress);

        return () => {
            taskManager.off(TaskEvent.Updated, handleTaskUpdate);
            taskManager.off(TaskEvent.Progress, handleTaskProgress);
        };
    }, [currentTask])

    useAsyncEffect(async () => {
        if (!currentTask) {
            return;
        }

        await taskManager.addUploadTask(currentTask);
    }, [currentTask]);

    useAsyncEffect(async () => {
        try {
            if (TaskStateCheck.isDone(taskState)) {
                if (TaskStateCheck.isCompleted(taskState)) {
                    onSuccess?.()
                } else {
                    setError(DefaultSnackbarError)
                }
            }
        } catch (e: any) {
            console.error("[BaseFileUploaderDrawer.taskState]:", e.message);
            setError(DefaultSnackbarError)
        }
    }, [taskState])

    const handleFileSelect = async (file: File) => {
        const validationError = await validator.validate(file);
        if (validationError) {
            setError(validationError);
            return;
        }

        setSelectedFile(file);
        setCurrentTask(undefined)
        onSelected(file)
    };

    const isTaskLoading = TaskStateCheck.isLoading(taskState)
    const inProgress = isTaskLoading || isLoading
    const canUpload = selectedFile != null
        && isReady !== false
        && AmountSummaryHelper.isReady(feeState)
        && !isTaskLoading
        && !isLoading

    return (
        <PageContainer>
            <AutoSnackbar
                message={errorText}
                onClose={() => {
                    setError(null)
                }}
            />

            <AvoirDialog
                open={isDialogOpen}
                title={str(RStr.FileUploaderDrawer_confirm_title)}
                description={str(RStr.FileUploaderDrawer_confirm_description)}
                cancelText={str(RStr.Cancel)}
                confirmText={str(RStr.FileUploaderDrawer_button_upload)}
                onCancel={() => setIsDialogOpen(false)}
                onConfirm={async () => {
                    setIsDialogOpen(false);
                    await handleNext()
                }}
            />

            <AvoirScreenTitleSmall
                title={title}
            />

            <ContentContainer sx={{ pb: 0 }}>
                <Stack
                    width={"100%"}
                    height={"100%"}
                    spacing={4}
                >
                    {inProgress ? (
                        <Stack width={"100%"} height={"100%"} alignItems={"center"} justifyContent={"center"}>
                            <FileUploadingLoader isLoading={isTaskLoading} isProcessing={isLoading} progress={uploadProgress} />
                        </Stack>
                    ) : (
                        <>
                            <AvoirDropZone
                                onFileSelect={handleFileSelect}
                                selectedFile={selectedFile}
                                accept={validator.getAcceptedTypes()}
                                isLoading={inProgress}
                                progress={uploadProgress}
                                title={validator.getDropZoneTitle()}
                                subtitle={validator.getDropZoneSubtitle()}
                            />

                            <Stack spacing={2}>
                                <ConfirmAccountForm
                                    owner={address}
                                    devName={devId}
                                    appPackage={appPackage}
                                />

                                {additionForm}

                                <AmountsSummaryForm
                                    devAddress={devAddress}
                                    devId={devId}
                                    onState={setFeeState}
                                    onError={setError}
                                    storageMessages={selectedFile ? [GfMsgType.CREATE_OBJECT] : undefined}
                                    fileSize={selectedFile?.size}
                                    isReady={isReady}

                                    quoteRequirement={undefined}
                                    estimation={undefined}
                                    onIncreaseQuota={undefined}
                                    retryKey={undefined}
                                    relayCalls={undefined}
                                    topUpStorageAmount={undefined}
                                    newQuoteGb={undefined}
                                    withValidation={undefined}
                                    withOracle={undefined}
                                />
                            </Stack>
                        </>
                    )}

                    <Box flexGrow={1}/>

                    <Stack width={"100%"} direction={"row"} justifyContent={"end"} spacing={2} pb={3}>
                        <AvoirSecondaryButton
                            text={str(RStr.FileUploaderDrawer_button_close)}
                            onClick={onClose}
                        />

                        <AvoirButtons
                            text={isTaskLoading
                                ? `${str(RStr.FileUploaderDrawer_uploading)} ${Math.round(uploadProgress)}%`
                                : str(RStr.FileUploaderDrawer_button_upload)
                            }
                            disabled={!canUpload}
                            onClick={() => setIsDialogOpen(true)}
                            loading={isTaskLoading || AmountSummaryHelper.isLoading(feeState)}
                            withIcon={false}
                        />
                    </Stack>
                </Stack>
            </ContentContainer>
        </PageContainer>
    )
}
