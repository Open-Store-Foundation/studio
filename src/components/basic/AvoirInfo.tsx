import {Typography, type TypographyProps} from "@mui/material";
import type {PropsWithChildren} from "react";
import type {SxProps, Theme} from "@mui/material/styles";

type AvoirInfoProps = PropsWithChildren<{
    color?: TypographyProps['color'];
    variant?: TypographyProps['variant'];
    sx?: SxProps<Theme>;
}>;

export function AvoirInfo({children, color = 'error', variant = 'body2', sx}: AvoirInfoProps) {
    return (
        <Typography color={color} variant={variant} sx={sx}>
            {children}
        </Typography>
    )
}




