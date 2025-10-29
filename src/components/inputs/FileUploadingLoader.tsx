import {CircularProgress, LinearProgress, Stack, Typography} from "@mui/material";
import {AvoirSectionBox} from "@components/basic/AvoirSection.tsx";
import {str} from "@localization/res.ts";
import {RStr} from "@localization/ids.ts";

interface FileUploadingLoaderProps {
    isLoading?: boolean;
    isProcessing?: boolean;
    progress?: number;
}

export function FileUploadingLoader({
    isLoading = false,
    isProcessing = false,
    progress = 0
}: FileUploadingLoaderProps) {
    return (
        <Stack alignItems="center" justifyContent="center" spacing={1} sx={{ width: '100%', height: '100%' }}>
            <AvoirSectionBox>
                {isLoading ? (
                    <Stack alignItems="center" spacing={2}>
                        <Typography variant="subtitle1" color="text.main">{str(RStr.FileUploadingLoader_uploading)} ({Math.round(progress)}%)</Typography>
                        <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{ width: '100%', borderRadius: 1, height: 6 }}
                        />
                        <Typography variant="caption" color="text.secondary">{str(RStr.FileUploadingLoader_mayTakeTime)}</Typography>
                    </Stack>
                ) : isProcessing ? (
                    <Stack alignItems="center" spacing={2}>
                        <Typography variant="subtitle1" color="text.main">{str(RStr.FileUploadingLoader_processing)}</Typography>
                        <CircularProgress size={24}/>
                        <Typography variant="caption" color="text.secondary">{str(RStr.FileUploadingLoader_mayTakeTime)}</Typography>
                    </Stack>
                ) : null}
            </AvoirSectionBox>
        </Stack>
    );
}


