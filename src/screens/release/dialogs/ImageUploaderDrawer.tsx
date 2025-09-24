import {BaseFileUploaderDrawer} from "./BaseFileUploaderDrawer.tsx";
import {LogoUploadTask} from "@data/scheduler/TaskClient.ts";
import {FileValidator} from "@utils/validators.ts";
import {useState} from "react";
import {Address} from "@data/CommonModels.ts";
import {useGreenfield} from "@di";
import {useObserveGreenfield} from "@hooks/useObserveGreenfield.ts";

interface ImageUploaderProps {
    devId: string,
    devAddress: Address,
    appPackage: string,
    address: Address,

    onClose: () => void;
    onSuccess: () => void;

    validator: FileValidator;
    title: string;
}

export function ImageUploaderDrawer(props: ImageUploaderProps) {
    const [file, setFile] = useState<File | null>(null);
    const { isObservingBuild, startObserver } = useObserveBuild(props.devId, props.appPackage, props.onSuccess);

    const handleOnNext = async () => {
        if (!file) {
            return undefined;
        }

        return new LogoUploadTask(props.address, props.devId, props.appPackage, file);
    };

    const handleSuccess = () => { startObserver() }

    return <BaseFileUploaderDrawer
        address={props.address}
        devId={props.devId}
        devAddress={props.devAddress}
        appPackage={props.appPackage}

        title={props.title}
        validator={props.validator}
        isLoading={isObservingBuild}

        onClose={props.onClose}
        onSelected={setFile}
        uploadTask={handleOnNext}
        onSuccess={handleSuccess}
    />;
}

function useObserveBuild(devId: string, appPackage: string, onSuccess: () => void) {
    const greenfield = useGreenfield();

    const { isObservingBuild, startObserver } = useObserveGreenfield(
        async () => {
            const hasImage = await greenfield.hasFile(devId, greenfield.logoPath(appPackage))

            if (hasImage) {
                console.log("Image is uploaded!")
                onSuccess()
                return true
            }

            return false
        },
        []
    )

    return { isObservingBuild, startObserver }
}
