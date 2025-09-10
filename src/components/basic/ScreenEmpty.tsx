import {Stack, Typography, useTheme} from "@mui/material";
import {AvoirSecondaryButton} from "@components/inputs/AvoirButtons.tsx";
import {IconSearch} from "@tabler/icons-react";

export interface ScreenEmptyProps {
    title: string,
    action?: string,
    onAction?: () => void,
}

export const DefaultScreenEmptyProps: ScreenEmptyProps = {
    title: "Not found anything :(",
}

export function PlaceholderEmpty({title, action, onAction}: ScreenEmptyProps) {
    return (
        <Stack
            width={"100%"}
            height={"100px"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            spacing={2}
        >
            <Stack spacing={1}>
                <Typography
                    variant={"h6"}
                    align={"center"}
                    color={"text.secondary"}
                    sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        maxWidth: "100%", // Ensures it does not overflow
                        wordBreak: "break-word", // Ensures long words wrap
                        whiteSpace: "normal", // Allows multi-line text
                        textAlign: "center", // Improves readability
                        overflowWrap: "break-word", // Ensures long text does not overflow
                    }}
                >
                    {title}
                </Typography>
            </Stack>

            {
                action &&
                <AvoirSecondaryButton
                    text={action}
                    onClick={onAction}
                />
            }
        </Stack>
    )
}

export function ScreenEmpty({title, action, onAction}: ScreenEmptyProps) {
    const theme = useTheme();
    return (
        <Stack
            width={"100%"}
            height={"200px"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            spacing={2}
        >
            <IconSearch
                height="56px"
                width="56px"
                color={theme.palette.text.secondary}
            />

            <Stack spacing={1}>
                <Typography
                    variant={"h6"}
                    align={"center"}
                    color={"text.secondary"}
                    sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        maxWidth: "100%", // Ensures it does not overflow
                        wordBreak: "break-word", // Ensures long words wrap
                        whiteSpace: "normal", // Allows multi-line text
                        textAlign: "center", // Improves readability
                        overflowWrap: "break-word", // Ensures long text does not overflow
                    }}
                >
                    {title}
                </Typography>
            </Stack>

            {
                action &&
                <AvoirSecondaryButton
                    text={action}
                    onClick={onAction}
                />
            }
        </Stack>
    )
}
