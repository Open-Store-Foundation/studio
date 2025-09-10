import {PageContainer, ScrollableContentContainer} from "@components/layouts/BaseContainers.tsx";
import {ImageUploaderDrawer} from "@screens/release/dialogs/ImageUploaderDrawer.tsx";
import Drawer from "@mui/material/Drawer";
import {str} from "@localization/res.ts";
import {RStr} from "@localization/ids.ts";
import {usePngValidator} from "@di";
import {AppRoute} from "@router";

interface LogoDrawerProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function LogoDrawerDialog(
    {
        open,
        onClose,
        onSuccess,
    }: LogoDrawerProps
) {
    const {devId, appPackage, address} = AppRoute.AppAsset.useParams();

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
                    <ImageUploaderDrawer
                        devId={devId}
                        appPackage={appPackage}
                        address={address}
                        onClose={onClose}
                        onSuccess={onSuccess}
                        validator={usePngValidator()}
                        title={str(RStr.LogoUploaderDrawer_title)}
                    />
                </ScrollableContentContainer>
            </PageContainer>
        </Drawer>
    );
} 