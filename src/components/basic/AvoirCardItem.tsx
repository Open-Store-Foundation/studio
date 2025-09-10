import {Box, Typography} from "@mui/material";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";
import {ReactNode} from "react";

export function AvoirCardItem({
    onClick,
    disabled = false,
    left,
    title,
    right,
}: {
    onClick?: () => void,
    disabled?: boolean,
    left: ReactNode,
    title: string,
    right?: ReactNode,
}) {
    const isInteractive = !!onClick && !disabled
    return (
        <Box
            onClick={isInteractive ? onClick : undefined}
            sx={{
                cursor: isInteractive ? 'pointer' : 'default',
                opacity: disabled ? 0.6 : 1,
                borderRadius: { xs: 3, sm: 4 },
                py: { xs: 2, sm: 2.5 },
                px: { xs: 2, sm: 2.5 },
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                bgcolor: 'background.surface',
                '&:hover': {
                    bgcolor: isInteractive ? 'action.hover' : undefined,
                }
            }}
        >
            {left}
            <Box flex={1}>
                <Typography variant="subtitle1" sx={{fontWeight: 700}}>{title}</Typography>
            </Box>
            {right ?? (<ChevronRightRounded fontSize="small" sx={{ color: 'text.secondary' }} />)}
        </Box>
    )
}


