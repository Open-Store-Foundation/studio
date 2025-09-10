import {Typography} from "@mui/material";
import {Variant} from "@mui/material/styles/createTypography";

export function TextDecoration({text, color, variant}: { text: string, color?: string, variant?: Variant }) {
    return <Typography
        component="span" color={color ?? "text.primary"}
        variant={variant ?? "caption"}
        fontWeight={'bold'}>
        {text}
    </Typography>
}