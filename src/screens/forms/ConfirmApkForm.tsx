import {AvoirProperty, AvoirPropertyBox} from "@components/basic/AvoirProperty.tsx";
import {ApkInfo} from "@utils/apk.ts";
import {Stack} from "@mui/material";
import {str} from "@localization/res.ts";
import {RStr} from "@localization/ids.ts";

import {formatSize} from "@utils/format.ts";
import {shrinkAddress} from "@utils/account.ts";

interface ConfirmApkFormProps {
    apkInfo: ApkInfo | null;
}

export function ConfirmApkForm({apkInfo}: ConfirmApkFormProps) {
    if (!apkInfo) {
        return null;
    }

    return (
        <AvoirPropertyBox
            title={str(RStr.ConfirmApkForm_title)}>
            <Stack spacing={2}>
                <AvoirProperty
                    title={str(RStr.ConfirmApkForm_version_name)}
                    value={apkInfo.versionName}
                />
                <AvoirProperty
                    title={str(RStr.ConfirmApkForm_version_code)}
                    value={apkInfo.versionCode.toString()}
                />
                <AvoirProperty
                    title={"Checksum"} // TODO
                    value={shrinkAddress(apkInfo.checksum)}
                />
                <AvoirProperty
                    title={str(RStr.ConfirmApkForm_file_size)}
                    value={formatSize(apkInfo.fileSize)}
                />
            </Stack>
        </AvoirPropertyBox>
    );
} 