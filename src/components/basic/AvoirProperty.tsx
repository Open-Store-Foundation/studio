import {ReactNode} from "react";
import {Box, Stack, Typography} from "@mui/material";
import {AvoirSkeleton} from "../anim/AvoirSkeleton.tsx";

export function AvoirPropertyBox(
    {children, title, type, background}:
    { children: ReactNode, title?: string, type?: "big" | "default", background?: string },
) {
    return (
        <Stack spacing={1}>
            {
                title && <Typography variant="subtitle2" color={"text.variant"} fontWeight="bold" px={1}>
                    {title}
                </Typography>
            }

            <Stack
                spacing={1}
                sx={{
                    width: '100%',
                    bgcolor: background || (type == "big" ? 'background.paper' : 'background.surfaceVariant'),
                    borderRadius: 4,
                    px: 3,
                    py: type == "big" ? 3 : 2,
                }}
            >
                {children}
            </Stack>
        </Stack>
    )
}

export function AvoirPropertyTitle({title}: { title: string }) {
    return (
        <Typography variant="body1" color={"text.variant"} fontWeight="bold">
            {title}
        </Typography>
    )
}

export function AvoirProperty(
    {title, value, variant, isLoading}: { title: string, value: any, variant?: "plain" | "main", isLoading?: boolean }
) {
    return (
        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Typography
                variant={variant != "main" ? "body2" : "body1"}
                fontWeight={variant != "main" ? "bold" : "bold"}
                color={variant != "main" ? "text.secondary" : "text.primary"}
            >
                {title}
            </Typography>

            <AvoirSkeleton isLoading={isLoading}>
                <Typography
                    variant={variant != "main" ? "subtitle2" : "body1"}
                    fontWeight={variant != "main" ? "bold" : "bold"}
                    color="text.primary"
                >
                    {value}
                </Typography>
            </AvoirSkeleton>
        </Box>
    )
}