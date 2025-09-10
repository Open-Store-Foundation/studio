import {Box, IconButton, Stack, Typography} from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {FieldAction} from "@components/inputs/FieldAction.tsx";
import RefreshRounded from "@mui/icons-material/RefreshRounded";
import {AutoSnackbar} from "@components/events/AutoSnackbar.tsx";
import {useCallback, useState} from "react";

export interface ReadOnlyFieldProps {
    label?: string;
    value: string;
    helperText?: string;
    labelWidth?: number;
    minWidth?: number;
    action?: FieldAction;
    disabled?: boolean;
    actionDisabled?: boolean;
    onActionClick?: () => void;
}

export function AvoirTitledRoFiled(
    {
        label,
        value,
        helperText,
        minWidth,
        action,
        disabled = false,
        actionDisabled,
        onActionClick,
    }: ReadOnlyFieldProps
) {
    const renderActionIcon = () => {
        switch (action) {
            case FieldAction.Delete:
                return <DeleteOutlineIcon fontSize="inherit" />;
            case FieldAction.Restore:
                return <RefreshRounded fontSize="inherit"  />;
            case FieldAction.Copy:
                return <ContentCopyIcon fontSize="small" />;
            default:
                return null;
        }
    };

    const handleAction = useCallback(
        async () => {
            if (action === FieldAction.Copy) {
                await navigator.clipboard.writeText(value || "");
                setMessage("Copied to clipboard!")
            } else if (onActionClick) {
                onActionClick();
            }
        }, [onActionClick]
    );

    const [message, setMessage] = useState<string | null>(null)

    return (
        <Stack
            direction={"row"}
            display={"flex"}
            justifyContent={"start"}
            alignItems={"flex-start"}
        >
            <Typography
                variant={"subtitle2"}
                color={"text.secondary"}
                display={{ xs: 'none', xl: 'block' }}
                fontWeight={"medium"}
                width={250}
                flexWrap={"nowrap"}
                sx={{ pt: 1 }}
            >
                {label}
            </Typography>

            <Stack>
                <Typography
                    variant={"subtitle2"}
                    color={"text.secondary"}
                    display={{ lg: 'block', xl: 'none' }}
                    px={1}
                    pb={1}
                    fontWeight={"400"}
                    flexWrap={"nowrap"}>
                    {label}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>

                    <Typography
                        variant="body2"
                        sx={{
                            minWidth: minWidth ?? 300,
                            maxWidth: 600,
                            wordBreak: "break-all",
                            bgcolor: disabled ? "action.disabledBackground" : "background.surface",
                            color: disabled ? "text.disabled" : "text.primary",
                            p: 2,
                            borderRadius: 4,
                            opacity: disabled ? 0.5 : 1
                        }}>
                        {value || "No value"}
                    </Typography>

                    {action !== undefined && action !== FieldAction.None && (
                        <IconButton
                            onClick={handleAction}
                            sx={{ mt: 1, color: 'text.secondary' }}
                            disabled={actionDisabled === undefined ? disabled : actionDisabled}
                        >
                            {renderActionIcon()}
                        </IconButton>
                    )}
                </Box>

                {helperText && (
                    <Typography
                        variant="caption"
                        color={disabled ? "text.disabled" : "text.secondary"}
                        sx={{ px: 1, pt: 0.5 }}>
                        {helperText}
                    </Typography>
                )}

                <AutoSnackbar
                    message={message}
                    onClose={() => { setMessage(null) }}
                />
            </Stack>
        </Stack>
    );
} 