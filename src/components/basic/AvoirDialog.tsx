import {Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography} from "@mui/material";
import {AvoirButtons, AvoirSecondaryButton} from "@components/inputs/AvoirButtons.tsx";
import {str} from "@localization/res.ts";
import {RStr} from "@localization/ids.ts";

interface AvoirDialogProps {
    open: boolean
    title: string
    description?: string
    confirmText?: string
    cancelText?: string
    loading?: boolean
    disableConfirm?: boolean
    confirmVariant?: "primary" | "warning" | "error"
    onConfirm: () => void
    onCancel: () => void
}

export function AvoirDialog(
    {
        open,
        title,
        description,
        confirmText = str(RStr.Continue),
        cancelText = str(RStr.Cancel) ,
        confirmVariant = "primary",
        loading,
        disableConfirm,
        onConfirm,
        onCancel,
    }: AvoirDialogProps
) {
    return (
        <Dialog
            open={open}
            onClose={onCancel}
            fullWidth
            maxWidth="xs"
            slotProps={{
                paper: {
                    elevation: 0,
                    sx: {
                        borderRadius: { xs: 3, sm: 4 },
                        boxShadow: 8,
                        bgcolor: 'background.surface',
                        backgroundImage: 'none',
                        px: 1,
                        py: 1
                    }
                }
            }}
        >
            <DialogTitle sx={{pb: 0}}>
                <Typography variant="h6" fontWeight={700} color={"textPrimary"}>{title}</Typography>
            </DialogTitle>

            <DialogContent sx={{pt: 2}}>
                {description && (
                    <Typography variant="body2" color={'textSecondary'}>
                        {description}
                    </Typography>
                )}
            </DialogContent>

            <DialogActions sx={{px: 3, pb: 2}}>
                <Stack direction="row" spacing={1} sx={{ml: "auto"}}>
                    <AvoirSecondaryButton
                        text={cancelText}
                        onClick={onCancel}
                        color={"inherit"}
                    />

                    <AvoirButtons
                        text={confirmText}
                        onClick={onConfirm}
                        loading={!!loading}
                        disabled={disableConfirm}
                        color={confirmVariant}
                    />
                </Stack>
            </DialogActions>
        </Dialog>
    )
}


