import {
    ButtonBase,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    useMediaQuery,
    useTheme
} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import {Link, Location, matchPath, useLocation, useNavigate} from "react-router";
import Typography from "@mui/material/Typography";
import {ReactElement} from "react";
import {Spacer} from "@components/layouts/Spacer.tsx";
import MenuOpen from "@mui/icons-material/MenuOpen";
import {OpenStoreSvg} from "@components/svgs.ts";
import {decodePath} from "@utils/url";

// TODO v2 refactor
export class DrawerMenuItem {

    private static DEFAULT_SELECTOR = (paths: string[], location: Location) => {
        const match = paths.find((path) => matchPath(path, decodePath(location.pathname)))
        return match != null
    }

    isSelected: (paths: string[], location: Location) => boolean
    renderIcon: () => ReactElement

    constructor(
        readonly id: string,
        readonly paths: string[],
        readonly name: string,
        readonly link: string,
        renderIcon: () => ReactElement,
        isSelected?: (paths: string[], location: Location) => boolean
    ) {
        this.renderIcon = renderIcon;
        this.isSelected = isSelected ?? DrawerMenuItem.DEFAULT_SELECTOR;
    }
}

export const DrawerWidth = 280
export const FoldDrawerWidth = 80

export interface AppDrawerProps {
    idOpen: boolean
    items: DrawerMenuItem[]
    backText?: string
    backLink?: string
    onClose?: () => void
    onBack?: () => void
}

export function AvoirDrawer(
    {
        idOpen,
        onClose,
        onBack,
        items,
        backText,
        backLink,
    }: AppDrawerProps
) {
    const router = useLocation()
    const theme = useTheme()
    const navigate = useNavigate()
    const isXsUp = useMediaQuery(theme.breakpoints.up('md'));
    const drawerVariant = isXsUp ? "permanent" : "temporary";

    const renderBackNavigation = () => {
        return (
            <>
                {
                    backText && backLink && <DrawerButton
                        text={backText}
                        link={backLink}
                        onClick={() => {
                            onBack?.()
                        }}
                    />
                }
            </>
        )
    }

    const renderHeader = () => {
        return (
            <Toolbar>
                <Spacer y={10}/>

                <Stack direction="row" spacing={1}>
                    <OpenStoreSvg
                        height="30px"
                        width="30px"
                    />

                    <Typography
                        noWrap
                        component="a"
                        href="/"
                        fontWeight={"bold"}
                        fontSize={"1.2em"}
                        display={{ xs: 'block', md: 'none', lg: 'block' }}
                        color={"textPrimary"}
                        sx={{
                            mr: 2,
                            flexGrow: 0,
                            textDecoration: `none`,
                        }}
                    >
                        {"Open Store "}
                        <Typography
                            fontWeight={"bold"}
                            fontSize={"1em"}
                            component={"span"}
                            color={"primary"}
                        >
                            Studio
                        </Typography>
                    </Typography>
                </Stack>
            </Toolbar>
        )
    }

    return (
        <Drawer
            variant={drawerVariant}
            open={idOpen}
            ModalProps={{ onBackdropClick: onClose }}
            slotProps={{
                paper: {
                    sx: {
                        width: { xs: DrawerWidth, md: FoldDrawerWidth, lg: DrawerWidth},
                        boxSizing: 'border-box',
                        borderRight: "none",
                        backgroundColor: { md: "background.paper", lg: "background.drawer" }
                    }
                }
            }}
            sx={{
                width: { xs: DrawerWidth, md: FoldDrawerWidth, lg: DrawerWidth},
                flexShrink: 0,
            }}
        >
            {renderHeader()}

            <Stack
                width={"100%"}
                height={"100%"}
                direction={"column"}
            >
                <Box sx={{ overflow: 'auto', paddingX: "0.8rem" }}>
                    <List sx={{ gap: "0.3rem", display: "flex", flexDirection: "column" }}>
                        {renderBackNavigation()}

                        {
                            items.map((item) => (
                                <DrawerListItem
                                    id={item.id}
                                    name={item.name}
                                    link={item.link}
                                    icon={item.renderIcon}
                                    isSelected={item.isSelected(item.paths, router)}
                                    onClick={() => {
                                        onClose?.()
                                        navigate(item.link)
                                    }}
                                />
                            ))
                        }
                    </List>
                </Box>
            </Stack>

        </Drawer>
    )
}

function DrawerListItem(
    {
        id, name, link, icon, isSelected, onClick,
    }: {
        id: string,
        name: string,
        link: string,
        icon: () => ReactElement,
        isSelected: boolean,
        onClick: () => void,
    }
) {
    return (
        <ListItem
            key={id}
            disablePadding
        >
            <ListItemButton
                dense
                component={Link}
                to={link}
                sx={{ paddingY: "0.5rem" }}
                selected={isSelected}
                onClick={onClick}
            >
                <ListItemIcon color="primary">
                    {icon()}
                </ListItemIcon>

                <ListItemText
                    slotProps={{
                        primary: {
                            color: "primary.main",
                            fontWeight: 600,
                        }
                    }}
                    sx={{display: { xs: "block", md: "none", lg: "block" }}}
                    primary={name}
                />
            </ListItemButton>
        </ListItem>
    )
}

interface DrawerButtonProps {
    text: string,
    link: string,
    onClick?: () => void,
}

function DrawerButton(
    {text, link, onClick}: DrawerButtonProps,
) {
    const navigate = useNavigate()

    return (
        <>
            <ButtonBase
                key={"navigation-button"}
                sx={{
                    justifyContent: 'flex-start',
                    marginBottom: 4,
                    borderRadius: 4,
                    backgroundColor: "background.surface",
                    display: { xs: "block", md: "none", lg: "block" },
                    "&:hover": {
                        backgroundColor: "action.hover",
                    }
                }}
                component={Link}
                to={link}
                onClick={() => {
                    navigate(link, {replace: true})
                    onClick?.()
                }}
            >

                <Stack
                    direction="row"
                    marginX={"1rem"}
                    marginY={"0.65rem"}
                    display="flex"
                    alignItems={"center"}
                >
                    <MenuOpen/>

                    <Box width={"1rem"}/>

                    <Typography
                        variant="subtitle2"
                        color={"text.primary"}
                        fontWeight={"bold"}>
                        {text}
                    </Typography>
                </Stack>
            </ButtonBase>

            <IconButton
                color={"default"}
                component={Link}
                to={link}
                onClick={() => navigate(link, {replace: true})}
                sx={{
                    display: { xs: "none", md: "block flex", lg: "none" },
                    height: "40px",
                    marginBottom: 4,
                }}
            >
                <MenuOpen/>
            </IconButton>
        </>
    )
}
