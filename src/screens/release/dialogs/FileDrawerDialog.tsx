import {FileSelectorDrawer} from "@screens/release/dialogs/FileSelectorDrawer.tsx";
import {PageContainer, ScrollableContentContainer} from "@components/layouts/BaseContainers.tsx";
import {ApkUploaderDrawer} from "@screens/release/dialogs/ApkUploaderDrawer.tsx";
import {ScAppBuild} from "@data/sc/ScAssetService.ts";
import Drawer from "@mui/material/Drawer";
import {str} from "@localization/res.ts";
import {RStr} from "@localization/ids.ts";
import {useApkValidator} from "@di";
import {AppRoute} from "@router";

export enum FileDrawerType {
    Upload = 'upload',
    Select = 'select',
}

interface FileDrawerProps {
    open: boolean;
    onClose: () => void;
    type?: FileDrawerType | null;
    onSelected: (appBuild: ScAppBuild) => void;
}

export function FileDrawerDialog({open, type, onSelected, onClose}: FileDrawerProps) {
    const {devId, appPackage, address, appAddress} = AppRoute.AppAsset.useParams();

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
                    {
                        type == FileDrawerType.Upload
                            ? <ApkUploaderDrawer
                                address={address}
                                appAddress={appAddress}
                                devId={devId}
                                appPackage={appPackage}

                                onClose={onClose}
                                onSuccess={(appInfo) => {
                                    onSelected(appInfo)
                                }}

                                validator={useApkValidator()}
                                title={str(RStr.FileUploaderDrawer_title)}
                            />

                            : <FileSelectorDrawer
                                onClose={onClose}
                                onNext={(appInfo) => {
                                    onSelected(appInfo)
                                }}
                            />
                    }
                </ScrollableContentContainer>
            </PageContainer>
        </Drawer>
    );
}
