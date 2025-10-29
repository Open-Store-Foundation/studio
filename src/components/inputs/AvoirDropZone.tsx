import React, {useCallback, useState} from "react";
import {Box, Stack, Typography} from "@mui/material";
import CloudUpload from "@mui/icons-material/CloudUpload";
import Upload from "@mui/icons-material/Upload";

import {formatSize} from "@utils/format.ts";
import {str} from "@localization/res.ts";
import {RStr} from "@localization/ids.ts";

interface DropZoneProps {
    onFileSelect: (file: File) => void;
    selectedFile: File | null;
    accept: string;
    isLoading?: boolean;
    progress?: number;
    title?: string;
    subtitle?: string;
}

export function AvoirDropZone({
    onFileSelect, 
    selectedFile, 
    accept, 
    isLoading = false,
    title,
    subtitle
}: DropZoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    
    const inProgress = isLoading;

    const defaultTitle = str(RStr.AvoirDropZone_defaultTitle);
    const defaultSubtitle = accept.includes('.apk') || accept.includes('.aab') 
        ? str(RStr.AvoirDropZone_defaultSubtitle_apkAab)
        : accept.includes('.png') || accept.includes('.jpg') || accept.includes('.webp')
        ? str(RStr.AvoirDropZone_defaultSubtitle_image)
        : str(RStr.AvoirDropZone_defaultSubtitle_default);

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isLoading) {
            setIsDragging(true);
        }
    }, [isLoading]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (inProgress) return;

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            onFileSelect(files[0]);
        }
    }, [onFileSelect, isLoading ]);

    return (
        <Box
            sx={{
                width: '100%',
                height: '175px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inProgress ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
                border: theme => `${isDragging ? 2 : 1}px dashed ${isDragging ? theme.palette.primary.main : theme.palette.divider}`,
                borderRadius: 2,
                bgcolor: isDragging ? 'action.hover' : 'background.paper',
                px: 2,
                '&:hover': {
                    bgcolor: inProgress ? 'background.paper' : 'action.hover',
                    borderColor: inProgress ? 'divider' : 'primary.main',
                }
            }}
            py={2}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => !isLoading && document.getElementById('file-input')?.click()}
        >
            <input
                id="file-input"
                type="file"
                style={{display: 'none'}}
                onChange={(e) => !isLoading && e.target.files?.[0] && onFileSelect(e.target.files[0])}
                accept={accept}
                disabled={inProgress}
            />

            {selectedFile ? (
                <Stack spacing={1} alignItems="center" sx={{ width: '100%', px: 1 }}>
                    <Upload color="primary" sx={{fontSize: 40}}/>
                    <Stack alignItems="center" sx={{ width: '100%' }}>
                        <Typography maxWidth={"500px"} variant="subtitle1" color="primary" title={selectedFile.name} noWrap>
                            {selectedFile.name}
                        </Typography>
                        <Typography variant="subtitle2" color="text.main">
                            {formatSize(selectedFile.size)}
                        </Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary">{str(RStr.AvoirDropZone_clickOrDragToReplace)}</Typography>
                </Stack>
            ) : (
                <Stack spacing={1} alignItems="center" sx={{ width: '100%', px: 1 }}>
                    <CloudUpload sx={{fontSize: 40, color: 'text.secondary'}}/>
                    <Stack alignItems="center" sx={{ width: '100%' }}>

                        <Typography variant="subtitle1" color="text.main" title={title || defaultTitle}>
                            {title || defaultTitle}
                        </Typography>
                        <Typography variant="caption" color="text.main">{str(RStr.AvoirDropZone_clickToBrowse)}</Typography>
                    </Stack>

                    <Typography variant="caption" color="text.secondary" title={subtitle || defaultSubtitle}>
                        {subtitle || defaultSubtitle}
                    </Typography>
                </Stack>
            )}
        </Box>
    );
}
