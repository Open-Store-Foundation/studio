import {
    Box,
    CircularProgress,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Stack,
    Tooltip,
    Typography,
    useTheme
} from "@mui/material";
import {ContentContainer, PageContainer, ScrollableContentContainer} from "@components/layouts/BaseContainers.tsx";
import {AvoirScreenTitleSmall} from "@components/basic/AvoirScreenTitle.tsx";
import {ApkFileUploadTask, LogoUploadTask, Task, TaskEvent, TaskStatus} from "@data/scheduler/TaskClient.ts";
import {useEffect, useState} from "react";
import {AvoirButtons} from "@components/inputs/AvoirButtons.tsx";
import {str} from "@localization/res.ts";
import {RStr} from "@localization/ids.ts";
import {DefaultScreenEmptyProps, PlaceholderEmpty} from "@components/basic/ScreenEmpty.tsx";
import {AvoirCard} from "@components/layouts/AvoirCard";
import {IconCircleCheck, IconClock, IconExclamationCircle} from "@tabler/icons-react";
import {useTaskManager} from "@di";
import {formatSize} from "@utils/format.ts";

interface TasksDrawerDialogProps {
    open: boolean;
    onClose: () => void;
}

export function TasksDrawerDialog({open, onClose}: TasksDrawerDialogProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const taskClient = useTaskManager();

    useEffect(() => {
        if (!open) {
            return
        }

        const updateTasks = () => {
            // DO NOT DELETE, USING FOR UI TESTING, ALL STATES
            // const mockTasks = Array.from({ length: 8 }, (_, i) => {
            //     const task = new FileUploadTask(
            //         "0xFFFFFF",
            //         "KittyDev",
            //         {
            //             packageName: "com.example.kitten.android",
            //             versionCode: i,
            //             versionName: "1.0",
            //             fileSize: 10000000,
            //         } as ApkInfo,
            //         null
            //     );
            //
            //     task.progress = i * 10;
            //
            //     if (i < 2) {
            //         task.status = TaskStatus.Pending;
            //     } else if (i < 4) {
            //         task.status = TaskStatus.Uploading;
            //     } else if (i < 6) {
            //         task.status = TaskStatus.Completed;
            //     } else {
            //         task.status = TaskStatus.Error;
            //         task.error = "Upload failed";
            //     }
            //
            //     return task;
            // });
            //
            // setTasks(mockTasks);
            const tasks = taskClient.getAllTasks();
            setTasks(tasks);
        }

        const updateSpecificTask = (taskId: string, progress: number) => {
            setTasks(prevTasks => 
                prevTasks.map(task => 
                    task.id === taskId ? { ...task, progress: progress } : task
                )
            );
        }

        updateTasks();

        taskClient.on(TaskEvent.Added, updateTasks);
        taskClient.on(TaskEvent.Updated, updateTasks);
        taskClient.on(TaskEvent.Progress, updateSpecificTask);
        taskClient.on(TaskEvent.Completed, updateTasks);
        taskClient.on(TaskEvent.Error, updateTasks);
        taskClient.on(TaskEvent.Archived, updateTasks);

        return () => {
            taskClient.off(TaskEvent.Added, updateTasks);
            taskClient.off(TaskEvent.Updated, updateTasks);
            taskClient.off(TaskEvent.Completed, updateTasks);
            taskClient.off(TaskEvent.Progress, updateSpecificTask);
            taskClient.off(TaskEvent.Error, updateTasks);
            taskClient.off(TaskEvent.Archived, updateTasks);
        };
    }, [open]);

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
            <PageContainer>
                <ScrollableContentContainer>
                    <PageContainer>
                        <AvoirScreenTitleSmall
                            title={str(RStr.TasksDrawerDialog_title)}
                        />

                        <ContentContainer>
                            <Stack width={"100%"} height={"100%"} mb={2}>
                                <TaskList tasks={tasks}/>
                            </Stack>
                        </ContentContainer>
                    </PageContainer>
                </ScrollableContentContainer>

                <Stack
                    width={"100%"}
                    direction={"row"}
                    justifyContent={"end"}
                    spacing={2}
                    p={2}
                >
                    <AvoirButtons
                        text={str(RStr.FileUploaderDrawer_button_close)}
                        onClick={onClose}
                    />
                </Stack>
            </PageContainer>
        </Drawer>
    );
}

interface TaskListProps {
    tasks: Task[];
}

function TaskList({tasks}: TaskListProps) {
    if (tasks.length === 0) {
        return (
            <AvoirCard>
                <PlaceholderEmpty {...DefaultScreenEmptyProps}/>
            </AvoirCard>
        )
    }

    const groupedTasks = groupTasksByStatus(tasks);
    const statusOrder = [TaskStatus.Pending, TaskStatus.Uploading, TaskStatus.Completed, TaskStatus.Error];

    return (
        <Box>
            {statusOrder.map((status, i) => {
                const statusTasks = groupedTasks[status];
                if (!statusTasks || statusTasks.length === 0) return null;

                return (
                    <Box key={status} sx={{ mb: 2 }}>
                        <Typography 
                            variant="subtitle1"
                            color={"textSecondary"}
                            fontWeight={"bold"}
                            pt={i > 0 ? 1 : 0}
                            textTransform={"capitalize"}
                            sx={{mb: 1, mx: 1}}
                        >
                            {getStatusDisplayName(status)} ({statusTasks.length})
                        </Typography>

                        <List sx={{ m: 0, p: 0 }}>
                            {statusTasks.map((task) => (
                                <TaskItem key={task.id} task={task}/>
                            ))}
                        </List>
                    </Box>
                );
            })}
        </Box>
    )
}

function groupTasksByStatus(tasks: Task[]): Record<TaskStatus, Task[]> {
    const grouped: Record<TaskStatus, Task[]> = {
        [TaskStatus.None]: [],
        [TaskStatus.Pending]: [],
        [TaskStatus.Uploading]: [],
        [TaskStatus.Completed]: [],
        [TaskStatus.Error]: []
    };

    tasks.forEach(task => {
        grouped[task.status].push(task);
    });

    Object.keys(grouped).forEach(status => {
        grouped[status as TaskStatus].sort((a, b) => {
            if ((a instanceof ApkFileUploadTask || a instanceof LogoUploadTask) &&
                (b instanceof ApkFileUploadTask || b instanceof LogoUploadTask)) {
                return a.createdAt.getTime() - b.createdAt.getTime();
            }
            return 0;
        });
    });

    return grouped;
}

function getStatusDisplayName(status: TaskStatus): string {
    switch (status) {
        case TaskStatus.Pending:
            return str(RStr.TasksDrawerDialog_status_pending);
        case TaskStatus.Uploading:
            return str(RStr.TasksDrawerDialog_status_uploading);
        case TaskStatus.Completed:
            return str(RStr.TasksDrawerDialog_status_completed);
        case TaskStatus.Error:
            return str(RStr.Error);
        default:
            return str(RStr.Unknown);
    }
}

interface TaskItemProps {
    task: Task;
}

function TaskItem({task}: TaskItemProps) {
    const theme = useTheme()
    
    if (task instanceof ApkFileUploadTask || task instanceof LogoUploadTask) {
        const {status, error} = task;
        let statusIcon: React.ReactNode;

        switch (status) {
            case TaskStatus.Uploading:
                statusIcon = <TaskProgressBar progress={task.progress}/>
                break;
            case TaskStatus.Completed:
                statusIcon = <IconCircleCheck color={theme.palette.success.main}/>;
                break;
            case TaskStatus.Error:
                statusIcon = (
                    <Tooltip title={error ?? str(RStr.UnknownError)}>
                        <IconExclamationCircle color={theme.palette.error.main}/>
                    </Tooltip>
                )
                break;
            default:
                statusIcon = <IconClock color={theme.palette.primary.main}/>
        }

        let primary: string;
        let secondary: string;

        // TODO Refactor this to use generic approach
        if (task instanceof ApkFileUploadTask) {
            const {appInfo} = task;
            primary = `Build upload | v${appInfo.versionName} (${appInfo.versionCode})`;
            secondary = `${appInfo.packageName}`;
        } else {
            primary = `Logo upload | ${formatSize(task.file.size)}`;
            secondary = `${task.appPackage}`;
        }

        return (
            <ListItem
                secondaryAction={statusIcon}
                sx={{
                    backgroundColor: 'background.paper',
                    mb: 1,
                    borderRadius: 2
                }}
            >
                <ListItemText
                    primary={primary}
                    secondary={secondary}
                    slotProps={{
                        primary: {
                            fontWeight: 'bold'
                        },
                        secondary: {
                            color: status === TaskStatus.Error ? 'error' : 'text.secondary'
                        }
                    }}
                />
            </ListItem>
        );
    }

    return null;
}

function TaskProgressBar({progress}: {progress?: number}) {
    return (
        progress ? (
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress
                    variant="determinate"
                    value={progress}
                    size={24}
                />

                <Box
                    sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography
                        variant="caption"
                        component="div"
                        fontSize={"8px"}
                        fontWeight={"bold"}
                    >
                        {`${Math.round(progress)}%`}
                    </Typography>
                </Box>
            </Box>
        ) : <CircularProgress size={24}/>
    )
}