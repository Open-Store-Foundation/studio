import {Box, LinearProgress, Stack, SxProps, Theme, Typography} from "@mui/material";
import {Spacer} from "@components/layouts/Spacer.tsx";

interface PageTitleProps {
    title: string;
    description?: string;
    isLoading?: boolean;
    size?: "small" | "large";
    sx?: SxProps<Theme>;
}

export function AvoirScreenTitleSmall(
    props: PageTitleProps,
) {
    return (
        <AvoirScreenTitle
            {...props}
            size={"small"}
            sx={{ pt: 4 }}
        />
    )
}
export function AvoirScreenTitle(
    {title, description, size, sx, isLoading}: PageTitleProps,
) {
    return <Stack>
        <Stack sx={{...sx, px: 6 }} spacing={1}>
            <Typography
                color={"text.title"}
                variant={(size == "small" ? "h5" : "h4")}
                fontWeight={"900"}
            >
                {title}
            </Typography>

            {
                description && (
                    <Typography
                        variant={"subtitle2"}
                        color={'text.secondary'}>
                        {description}
                    </Typography>
                )
            }
        </Stack>

        <Spacer y={(size == "small" ? 1 : 2)}/>

        <Box sx={{height: 2}} px={2}>
            {
                isLoading &&
                <LinearProgress
                    variant={"indeterminate"}
                    sx={{height: 2}}
                />
            }
        </Box>
    </Stack>
}


