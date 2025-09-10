import {AvoirProperty, AvoirPropertyBox} from "@components/basic/AvoirProperty.tsx";
import {str} from "@localization/res.ts";
import {RStr} from "@localization/ids.ts";
import {BuildFile} from "@screens/app/AppBuildsScreen.tsx";

interface BuildInfoFormProps {
    buildFile?: BuildFile;
}

export function BuildInfoForm({buildFile}: BuildInfoFormProps) {
    if (!buildFile) {
        return null;
    }

    return (
        <AvoirPropertyBox
            title={str(RStr.BuildInfoForm_title)}>
            <AvoirProperty
                title={str(RStr.AppBuildsScreen_objectId)}
                value={buildFile.referenceId}
            />
                <AvoirProperty
                    title={str(RStr.AppBuildsScreen_versionNumber)}
                    value={buildFile.versionNumber}
                />
                <AvoirProperty
                    title={str(RStr.AppBuildsScreen_versionCode)}
                    value={buildFile.versionCode.toString()}
                />
                <AvoirProperty
                    title={str(RStr.AppBuildsScreen_size)}
                    value={buildFile.size}
                />
        </AvoirPropertyBox>
    );
} 