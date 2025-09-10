import {Stack, Typography} from "@mui/material";
import {AvoirSecondaryButton} from "@components/inputs/AvoirButtons.tsx";
import {PlaceholderImageSvg} from "@components/svgs.ts";

export interface ScreenErrorProps {
    title: string,
    description: string,
    action?: string,
    onAction?: () => void,
}

export const DefaultScreenErrorProps: ScreenErrorProps = {
    title: "Something went wrong", // TODO use localization
    description: "Please try again later", // TODO use localization
}

export function ScreenError({title, description, action, onAction}: ScreenErrorProps) {
    return (
        <Stack
            width={"100%"}
            height={"500px"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            p={8}
            spacing={2}
        >
            <PlaceholderImageSvg
                height="200px"
                width="200px"
            />

            <Stack spacing={1}>
                <Typography
                    variant={"h6"}
                    align={"center"}
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

                <Typography
                    variant={"subtitle2"}
                    color={"textSecondary"}
                    align={"center"}
                    sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        maxWidth: "100%", // Ensures it does not overflow
                        wordBreak: "break-word", // Ensures long words wrap
                        whiteSpace: "normal", // Allows multi-line text
                        textAlign: "center", // Improves readability
                        overflowWrap: "break-word", // Ensures long text does not overflow
                    }}
                >{description}</Typography>
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
