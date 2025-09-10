import {Stack, Typography} from "@mui/material";
import {ReactNode} from "react";

export interface AvoirTitledContainerProps {
    title: string;
    children: ReactNode;
    spacing?: number;
    alignItems?: string;
}

export function AvoirTitledContainer({
    title, 
    children, 
    spacing = 1,
    alignItems = "flex-start"
}: AvoirTitledContainerProps) {
    return (
        <Stack direction={"row"} display={"flex"} spacing={spacing} alignItems={alignItems}>
            <Typography
                variant={"subtitle2"}
                pt={1}
                color={"text.secondary"}
                fontWeight={"medium"}
                display={{ xs: 'none', xl: 'block' }}
                width={250}
                flexWrap={"nowrap"}>
                {title}
            </Typography>

            <Stack spacing={1}>
                <Typography
                    variant={"subtitle2"}
                    color={"text.secondary"}
                    display={{ lg: 'block', xl: 'none' }}
                    fontWeight={"400"}
                    flexWrap={"nowrap"}>
                    {title}
                </Typography>

                {children}
            </Stack>
        </Stack>
    );
} 