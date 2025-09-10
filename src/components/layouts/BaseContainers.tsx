import * as React from "react";
import {Stack} from "@mui/material";
import Box from "@mui/material/Box";
import {SxProps} from "@mui/system/styleFunctionSx";

interface ContainerProps {
    children: React.ReactNode;
    nonFlex?: boolean;
    nonFullHeight?: boolean;
    spacing?: number;
    sx?: SxProps
}

// Container to write the entire screen
export function MainContainer(
    {
        children, sx
    }: ContainerProps
) {
    return (
        <Box
            display={"flex"}
            height={"100vh"}
            width={"100vw"}
            children={children}
            sx={sx}
        />
    )
}

// Container to wrap <Outlet/>
export function OutletContainer(
    {
        children, sx
    }: ContainerProps
) {
    return (
        <Box
            component="main"
            height={"100vh"}
            width={"100%"}
            display={"flex"}
            flexDirection={"column"}
            bgcolor={"background.default"}
            children={children}
            sx={sx}
        />
    )
}

// Container for entire sub-screen
export function PageContainer(
    {
        children, sx, spacing
    }: ContainerProps
) {
    return (
        <Stack
            width={"100%"}
            height={"100%"}
            display={"flex"}
            flexDirection={"column"}
            bgcolor={"background.default"}
            spacing={spacing}
            sx={sx}
        >
            {children}
        </Stack>
    )
}

// Container for sub-screen content
export function ContentContainer(
    {
        children,
        nonFullHeight,
        sx,
        spacing
    }: ContainerProps
) {
    return (
        <Stack
            pt={3}
            pb={8}
            px={6}
            width={"100%"}
            height={nonFullHeight == true ? undefined : "100%"}
            alignItems={"center"}
            flexDirection={"column"}
            spacing={spacing}
            sx={sx}
        >
            {children}
        </Stack>
    )
}

export function DrawerContentContainer(
    {
        children,
        nonFullHeight,
        sx,
        spacing
    }: ContainerProps
) {
    return (
        <Stack
            pt={3}
            pb={3}
            px={4}
            width={"100%"}
            height={nonFullHeight == true ? undefined : "100%"}
            alignItems={"center"}
            flexDirection={"column"}
            spacing={spacing}
            sx={sx}
        >
            {children}
        </Stack>
    )
}


export function ScrollableContentContainer(
    {
        children,
        sx
    }: ContainerProps
) {
    return (
        <Box
            width={"100%"}
            height={"100%"}
            display={"flex"}
            flexGrow={1}
            flexDirection={"column"}
            overflow={"auto"}
            sx={sx}
        >
            {children}
        </Box>
    )
}