import {EventEmitter} from 'events';
import {ApkInfo} from '@utils/apk.ts';
import {Address} from "@data/CommonModels.ts";
import {useGreenfield} from '@di';
import {appConfig} from "@config";
import {DelegateCreateParams} from "@data/greenfield";

export enum TaskStatus {
    None = 'none',
    Pending = 'pending',
    Uploading = 'uploading',
    Completed = 'completed',
    Error = 'error'
}

export enum TaskEvent {
    Added = 'taskAdded',
    Updated = 'taskUpdated',
    Progress = 'taskProgress',
    Completed = 'taskCompleted',
    Error = 'taskError',
    Archived = 'queue',
}

export interface TaskState {
    id: string;
    status: TaskStatus;
    progress?: number;
    error?: string;
}

export class TaskStateCheck {

    static isDone(state: TaskState | null) {
        if (!state) {
            return false;
        }

        return state.status === TaskStatus.Completed || state.status === TaskStatus.Error;
    }

    static isLoading(state: TaskState | null) {
        if (!state) {
            return false;
        }

        return state.status === TaskStatus.Pending || state.status === TaskStatus.Uploading;
    }

    static isError(state: TaskState | null) {
        if (!state) {
            return false;
        }

        return state.status === TaskStatus.Error;
    }

    static isCompleted(state: TaskState | null) {
        if (!state) {
            return false;
        }

        return state.status === TaskStatus.Completed;
    }
}

export interface Task {
    id: string;
    status: TaskStatus;
    progress?: number;
    error?: string;
    execute: (onProgress: (percent: number) => void) => Promise<void>;
    state: () => TaskState;
}

export class ApkFileUploadTask implements Task {

    id: string;
    status: TaskStatus;
    progress?: number;
    error?: string | undefined;

    readonly owner: Address;
    readonly devName: string;
    readonly appInfo: ApkInfo;
    readonly file: File;

    readonly createdAt: Date;

    constructor(
        owner: Address,
        devName: string,
        appInfo: ApkInfo,
        file: File,
    ) {
        this.id = ApkFileUploadTask.taskId(devName, appInfo);
        this.status = TaskStatus.None;
        this.createdAt = new Date();

        this.owner = owner;
        this.devName = devName;
        this.appInfo = appInfo;
        this.file = file;
    }

    state(): TaskState {
        return {
            id: this.id,
            status: this.status,
            error: this.error,
            progress: this.progress,
        }
    }

    static taskId(devName: string, info: ApkInfo) {
        return `gf-upload-${devName}-${info.packageName}-${info.versionCode}`
    }

    async execute(onProgress: (percent: number) => void): Promise<void> {
        const greenfield = useGreenfield();

        const auth = await greenfield.auth(
            appConfig.greenfieldChain.id, this.owner, appConfig.provider()
        );


        const filePath = greenfield.apkPath(this.appInfo)
        const isFileExist = await greenfield.hasFile(this.devName, filePath)
        if (isFileExist) {
            throw new Error('APK already exist!');
        }

        // Upload file
        const request: DelegateCreateParams = {
            bucket: this.devName.toLowerCase(),
            path: filePath,
            file: this.file,
            isUpdate: false,
            onProgress: onProgress
        };

        await greenfield.delegatedCreateObject(auth!, request);
    }
}

export class LogoUploadTask implements Task {

    id: string;
    status: TaskStatus;
    progress?: number;
    error?: string | undefined;

    readonly owner: Address;
    readonly devName: string;
    readonly appPackage: string;
    readonly file: File;

    readonly createdAt: Date;

    constructor(
        owner: Address,
        devName: string,
        appPackage: string,
        file: File,
    ) {
        this.id = LogoUploadTask.taskId(devName, appPackage);
        this.status = TaskStatus.None;
        this.createdAt = new Date();

        this.owner = owner;
        this.devName = devName;
        this.appPackage = appPackage;
        this.file = file;
    }

    state(): TaskState {
        return {
            id: this.id,
            status: this.status,
            error: this.error,
            progress: this.progress,
        }
    }

    static taskId(devName: string, appPackage: string) {
        return `gf-logo-upload-${devName}-${appPackage}`
    }

    async execute(onProgress: (percent: number) => void): Promise<void> {
        const greenfield = useGreenfield();
        const auth = await greenfield.auth(
            appConfig.greenfieldChain.id, this.owner, appConfig.provider()
        );

        const logoPath = greenfield.logoPath(this.appPackage);
        const isFileExist = await greenfield.hasFile(this.devName, logoPath)

        const request: DelegateCreateParams = {
            bucket: this.devName.toLowerCase(),
            path: logoPath,
            file: this.file,
            isUpdate: isFileExist,
            onProgress: onProgress,
        };

        await greenfield.delegatedCreateObject(auth!, request);
    }
}

export class TaskClient extends EventEmitter {
    private static instance: TaskClient;

    private tasks: Map<string, Task> = new Map();
    private completedTasks: Map<string, Task> = new Map();

    private activeUploads: number = 0;
    private readonly maxConcurrentUploads = 3;

    private constructor() {
        super();
    }

    public static create(): TaskClient {
        if (!TaskClient.instance) {
            TaskClient.instance = new TaskClient();
        }

        return TaskClient.instance;
    }

    public async addUploadTask(
        task: Task,
    ): Promise<boolean> {
        if (this.tasks.has(task.id)) {
            return false;
        }

        this.tasks.set(task.id, task);
        this.updateTaskStatus(task.id, TaskStatus.Pending);
        this.emit(TaskEvent.Added, task);

        // Start processing if we have capacity
        if (this.activeUploads < this.maxConcurrentUploads) {
            this.activeUploads++;
            this.processTask(task)
                .then();
        }

        return true;
    }

    private async processTask(
        task: Task,
    ) {
        try {
            this.updateTaskStatus(task.id, TaskStatus.Uploading);

            await task.execute(
                (percent) => {
                    this.updateTaskProgress(task.id, percent);
                }
            );
            
            this.updateTaskStatus(task.id, TaskStatus.Completed);
            this.emit(TaskEvent.Completed, task.id);
        } catch (error) {
            console.error('Upload error:', error);
            const err = error instanceof Error ? error.message : 'Unknown error';
            this.updateTaskStatus(task.id, TaskStatus.Error, err);
            this.emit(TaskEvent.Error, task.id, error);
        } finally {
            this.tasks.delete(task.id);
            this.completedTasks.set(task.id, task);
            this.activeUploads--;
            this.emit(TaskEvent.Archived);
            this.processNextTask();
        }
    }

    private processNextTask() {
        const pendingTask = Array.from(this.tasks.values())
            .find(task => task.status === TaskStatus.Pending);

        if (pendingTask && this.activeUploads < this.maxConcurrentUploads) {
            this.processTask(pendingTask)
                .then();
        }
    }

    private updateTaskStatus(taskId: string, status: TaskStatus, error?: string) {
        const task = this.tasks.get(taskId);
        if (task) {
            task.status = status;
            task.error = error;

            this.emit(TaskEvent.Updated, task.state());
        }
    }

    private updateTaskProgress(taskId: string, progress: number) {
        const task = this.tasks.get(taskId);
        if (task) {
            task.progress = progress;

            this.emit(TaskEvent.Progress, task.id, task.progress);
        }
    }

    public getTask<T extends Task>(taskId: string): T | null {
        return this.tasks.get(taskId) as T ?? null;
    }

    public getAllTasks(): Task[] {
        return [...this.tasks.values(), ...this.completedTasks.values()];
    }

    public getActiveTasksCount(): number {
        return this.tasks.size;
    }
}
