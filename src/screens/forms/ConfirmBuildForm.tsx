import {AvoirProperty, AvoirPropertyBox} from "@components/basic/AvoirProperty.tsx";
import {ScAppBuild} from "@data/sc/ScAssetService.ts";
import {ProtocolIdUtil} from "@data/CommonModels.ts";
import {useMemo} from "react";
import {shrinkAddress} from "@utils/account";
import {str} from "@localization/res.ts";
import {RStr} from "@localization/ids.ts";

interface ConfirmBuildFormProps {
    build?: ScAppBuild; // Changed prop name to build
}

/**
 * Displays properties of an AppBuild.
 * Note: Assumes the structure of the AppBuild type. Adjust fields as necessary.
 */
export function ConfirmBuildForm({build}: ConfirmBuildFormProps) {
    if (!build) {
        return null;
    }

    const refId = useMemo(() => shrinkAddress(build.referenceId), [build.referenceId])
    const checksum = useMemo(() => shrinkAddress(build.checksum), [build.checksum])

    return (
        <AvoirPropertyBox title={str(RStr.ConfirmBuildForm_file_info)}>
            <AvoirProperty
                title={str(RStr.ConfirmBuildForm_version_name)}
                value={build.versionName}
            />
            <AvoirProperty
                title={str(RStr.ConfirmBuildForm_version_code)}
                value={build.versionCode.toString()}
            />
            <AvoirProperty
                title={str(RStr.ConfirmBuildForm_protocol)}
                value={ProtocolIdUtil.getProtocolName(build.protocolId)}
            />
            <AvoirProperty
                title={str(RStr.ConfirmBuildForm_reference_id)}
                value={refId}
            />
            <AvoirProperty
                title={"Checksum"}
                value={checksum}
            />
        </AvoirPropertyBox>
    );
} 