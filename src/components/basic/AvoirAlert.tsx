import {Alert, AlertTitle, type AlertProps} from "@mui/material";
import type {PropsWithChildren} from "react";
import type {SxProps, Theme} from "@mui/material/styles";

type AvoirAlertProps = PropsWithChildren<{
    severity: AlertProps["severity"];
    title?: string;
    sx?: SxProps<Theme>;
}>;

export function AvoirAlert({severity, title, sx, children}: AvoirAlertProps) {
    return (
        <Alert severity={severity} sx={{backgroundColor: "background.paper", borderRadius: 8, ...sx}}>
            {title && <AlertTitle>{title}</AlertTitle>}
            {children}
        </Alert>
    )
}


