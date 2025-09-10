import {ReactNode} from "react";
import {Box, Divider, IconButton, Stack, Typography} from "@mui/material";
import {Spacer} from "@components/layouts/Spacer.tsx";
import {IconInfoCircle} from "@tabler/icons-react";
import {Link} from "react-router";

export interface SectionTitledBoxProps {
    variant?: "main" | "side"
    children: ReactNode
    action?: () => ReactNode
    contentOffset?: number
    title: string;
    description?: string;
    infoLink?: string;
}

export function AvoirSectionTitledBox({children, title, description, action, contentOffset, infoLink, variant = "main"}: SectionTitledBoxProps) {
    return <Stack
        width={"100%"}
        borderRadius={2}
        borderColor={"divider"}
        bgcolor={"background.paper"}
        spacing={2}>

        <Stack
            px={variant == "main" ? 4 : 2}
            pt={variant == "main" ? 3 : 2}
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}>
                <AvoirSectionTitle
                    title={title}
                    variant={variant}
                    description={description}
                    infoLink={infoLink}
                />

            {action?.()}
        </Stack>

        <Stack>
            <Box px={variant == "main" ? 4 : 4}>
                <Divider/>
            </Box>

            {contentOffset && <Spacer y={contentOffset}/>}
        </Stack>

        <Stack
            spacing={2}
            px={variant == "main" ? 4 : 2}
            pb={variant == "main" ? 4 : 2}>
            {children}
        </Stack>
    </Stack>
}

export interface SectionBoxProps {
    variant?: "main" | "side";
    children: ReactNode
}

export function AvoirSectionBox({children, variant = "main"}: SectionBoxProps) {
    return <Stack
        width={"100%"}
        borderRadius={4}
        border={"1px solid"}
        borderColor={"divider"}
        spacing={2}
        px={variant == "main" ? 4 : 2}
        pt={variant == "main" ? 3 : 2}
        pb={variant == "main" ? 4 : 2}>
        {children}
    </Stack>
}

interface SectionTitleProps {
    title: string;
    description?: string;
    infoLink?: string;
    variant?: "main" | "side"
}

export function AvoirSectionTitle(
    {title, description, infoLink, variant}: SectionTitleProps,
) {
    return (
        description
            ? <Stack pb={1} spacing={0.25}>
                <Title title={title} link={infoLink} variant={variant}/>
                <Typography variant="caption" fontWeight={"medium"} color="text.secondary">
                    {description}
                </Typography>
            </Stack>
            : <Box px={1}>
                <Title title={title} link={infoLink}/>
            </Box>
    )
}

export function Title({title, link, variant}: { title: string, link?: string, variant?: "main" | "side"}) {
    return <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={2}
    >
        <Typography variant={variant == "main" ? "h5" : "h6"} fontWeight="bold">
            {title}
        </Typography>

        {
            link &&
            <IconButton
                component={Link}
                to={link}
                target="_blank"
                rel="noopener"
                color={"primary"}
                sx={{ p:0 }}
            >
                <IconInfoCircle size={20}/>
            </IconButton>
        }
    </Stack>
}