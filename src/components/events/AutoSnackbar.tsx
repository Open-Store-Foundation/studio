import Box from "@mui/material/Box";
import Snackbar, {SnackbarCloseReason} from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";
import {SyntheticEvent} from "react";

export const DefaultSnackbarError = "Something went wrong. Try refresh the page."

export function AutoSnackbar(
    {
        message,
        onClose,
        duration = 4000
    }: {
        message: string | null,
        onClose: () => void,
        duration?: number,
    }
) {
    const handleClose = (
        _: SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        onClose();
    };

    return (
        <Snackbar
            open={message != null}
            onClose={handleClose}
            autoHideDuration={duration}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center'
            }}
        >
            <Box bgcolor="text.primary" sx={{ px: 3, py: 1.5, borderRadius: 20 }}>
                <Typography variant="subtitle2" fontWeight={"bold"} color="background.paper">
                    {message}
                </Typography>
            </Box>
        </Snackbar>
    )
}

