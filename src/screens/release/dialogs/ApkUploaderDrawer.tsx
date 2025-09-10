import {ScAppBuild, ScAssetService} from "@data/sc/ScAssetService.ts";
import {BaseFileUploaderDrawer} from "./BaseFileUploaderDrawer.tsx";
import {ApkInfo} from "@utils/apk.ts";
import {ApkFileUploadTask} from "@data/scheduler/TaskClient.ts";
import {Address} from "@data/CommonModels.ts";
import {useGreenfield} from "@di";
import {ConfirmApkForm} from "@screens/forms/ConfirmApkForm";
import {toAppBuild} from "@data/greenfield";
import {FileValidator} from "@utils/validators.ts";
import {useState} from "react";
import {S, useAsyncEffect, useScreenState} from "@utils/state.ts";
import {WorkerClient} from "@data/scheduler/WorkerClient.ts";
import {AutoSnackbar} from "@components/events/AutoSnackbar.tsx";
import {useObserveGreenfield} from "@hooks/useObserveGreenfield.ts";

interface ApkUploaderProps {
    devId: string,
    appPackage: string,
    address: Address,
    appAddress: Address,

    title: string;
    validator: FileValidator;

    onClose: () => void;
    onSuccess: (build: ScAppBuild) => void;
}


export function ApkUploaderDrawer(props: ApkUploaderProps) {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { isLastBuildLoading, lastBuildVersion } = useLastBuildVersion(props.appAddress, setError);
    const { isApkInfoLoading, apkInfo } = useApkInfo(file, lastBuildVersion, props.appPackage, setError);
    const { isObservingBuild, startObserver } = useObserveBuild(apkInfo, props.appPackage, props.onSuccess);

    const handleNext = async () => {
        if (apkInfo && file) {
            return new ApkFileUploadTask(props.address, props.devId, apkInfo, file);
        }

        return undefined;
    }

    const handleSuccess = async () => {
        if (apkInfo) {
            startObserver()
        }
    };

    return <>
        <AutoSnackbar
            message={error}
            onClose={() => { setError(null) }}
        />

        <BaseFileUploaderDrawer
            address={props.address}
            devId={props.devId}
            appPackage={props.appPackage}

            title={props.title}
            validator={props.validator}

            isReady={apkInfo != null}
            isLoading={isApkInfoLoading || isLastBuildLoading || isObservingBuild}

            uploadTask={handleNext}
            onClose={props.onClose}
            onSelected={setFile}
            onSuccess={handleSuccess}

            additionForm={
                <ConfirmApkForm
                    apkInfo={apkInfo}
                />
            }
        />
    </>;
}

function useLastBuildVersion(appAddress: Address, setError: (error: string) => void) {
    const { isLoading, data, setState } = useScreenState<number | null, string>()

    useAsyncEffect(async () => {
        try {
            setState(S.loading())
            const lastVersion = await ScAssetService.getLastBuildVersion(appAddress)
            setState(S.data(lastVersion));
        } catch (e) {
            console.error("Error while fetching last version", e);
            setState(S.data(null));
            setError("Error while fetching last build version...")
        }
    }, [appAddress])

    return { isLastBuildLoading: isLoading, lastBuildVersion: data }
}

function useApkInfo(file: File | null, lastBuildVersion: number | null, appPackage: string, setError: (error: string) => void) {
    const { isLoading, data, setState } = useScreenState<ApkInfo | null, string>({ initLoadings: false })

    useAsyncEffect(async () => {
        if (file != null && lastBuildVersion != null) {
            setState(S.loading())
            try {
                const info = await WorkerClient.calculateApkInfo(file);
                console.log("Apk info", info, appPackage);

                if (info?.versionCode <= lastBuildVersion) {
                    setError(`Version code should be greater than ${lastBuildVersion}!`)
                    setState(S.data(null));
                    return;
                }

                if (info?.packageName != appPackage) {
                    setError("Package name does not match!")
                    setState(S.data(null));
                    return;
                }

                setState(S.data(info));
            } catch (e) {
                console.error("Error while parsing apk", e);
                setState(S.data(null));
                setError("Error while parsing apk...")
            }
        }
    }, [file, lastBuildVersion])

    return { isApkInfoLoading: isLoading, apkInfo: data }
}

function useObserveBuild(apkInfo: ApkInfo | null, appPackage: string, onSuccess: (build: ScAppBuild) => void) {
    const greenfield = useGreenfield();

    const { isObservingBuild, startObserver } = useObserveGreenfield(
        async () => {
            if (apkInfo == null) {
                return false;
            }

            const buildFile = await greenfield.getAppVersion(appPackage, apkInfo);

            if (buildFile != null) {
                onSuccess(toAppBuild(buildFile));
                return true;
            }

            return false;
        },
        [apkInfo],
    )

    return { isObservingBuild, startObserver }
}

