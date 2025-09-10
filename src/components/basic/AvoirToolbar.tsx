import {useAccount} from "wagmi";
import {AppBar, Badge, Button, ButtonBase, IconButton, Stack, useColorScheme} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {useTaskManager, useWeb3} from "@di";
import {IconListDetails, IconMenu, IconPlus, IconSun} from "@tabler/icons-react";
import {DrawerWidth, FoldDrawerWidth} from "./AvoirDrawer.tsx";
import {Link, useNavigate} from "react-router";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import {PlaceholderAvatarSvg} from "@components/svgs.ts";
import {shrinkAddress} from "@utils/account.ts";
import {useEffect, useState} from "react";
import {TaskEvent} from "@data/scheduler/TaskClient.ts";
import {WalletPopup} from "@components/basic/WalletPopup.tsx";

// TODO v2 refactor
export interface AvoirToolbarProps {
    fullWidth?: boolean,
    isLoading?: boolean,
    buttonTitle?: string,
    buttonLink?: string,
    onOpenMenu?: () => void,
    onOpenTasks?: () => void,
}

export function AvoirToolbar(
    {
        fullWidth,
        buttonTitle,
        buttonLink,
        onOpenMenu,
        onOpenTasks,
    }: AvoirToolbarProps
) {
    const taskManager = useTaskManager();
    const navigate = useNavigate();
    const web3 = useWeb3()

    const {address, isConnected} = useAccount()
    const {mode, systemMode, setMode} = useColorScheme();
    const [taskCount, setTaskCount] = useState(0);
    const [walletPopupOpen, setWalletPopupOpen] = useState(false);

    const openWalletModal = async () => {
        if (isConnected) {
            setWalletPopupOpen(true);
        } else {
            await web3.modal.open();
        }
    };

    useEffect(() => {
        const handleTaskUpdate = () => {
            setTaskCount(taskManager.getActiveTasksCount())
        };

        taskManager.on(TaskEvent.Added, handleTaskUpdate);
        taskManager.on(TaskEvent.Archived, handleTaskUpdate);

        return () => {
            taskManager.off(TaskEvent.Added, handleTaskUpdate);
            taskManager.off(TaskEvent.Archived, handleTaskUpdate);
        };
    }, []);


    const renderCreateApp = () => {
        if (buttonTitle && buttonLink) {
            return (
                <AccentButton
                    buttonLink={buttonLink}
                    buttonTitle={buttonTitle}
                    navigate={navigate}
                />
            )
        }
    }

    const renderOpenMenu = () => {
        return (
            onOpenMenu &&
            <IconButton
                color={"primary"}
                onClick={onOpenMenu}
                sx={{
                    display: {xs: "flex", lg: "none"}
                }}
            >
                <IconMenu/>
            </IconButton>
        )
    }

    const renderOpenTasks = (count: number = 0) => {
        return (
            <IconButton
                color={"primary"}
                onClick={onOpenTasks}
            >
                <Badge badgeContent={count} color="error">
                    <IconListDetails/>
                </Badge>
            </IconButton>
        )
    }

    const renderSwitchTheme = () => {
        return (
            <IconButton
                color={"primary"}
                onClick={() => {
                    const scheme = mode === 'system' ? systemMode : mode
                    setMode(scheme == "dark" ? "light" : "dark")
                }}>
                <IconSun/>
            </IconButton>
        )
    }

    return <>
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                backgroundColor: "background.default",
                width: {
                    xs: "100%",
                    ml: (fullWidth == true ? "100%" : `calc(100% - ${FoldDrawerWidth}px)`),
                    lg: (fullWidth == true ? "100%" : `calc(100% - ${DrawerWidth}px)`)
                }
            }}
        >
            <Box px={2}>
                <Toolbar disableGutters>
                    {renderOpenMenu()}
                    <Box flexGrow={1}/>

                    <Stack direction="row" spacing={2} alignItems={"center"}>
                        {renderSwitchTheme()}
                        {renderOpenTasks(taskCount)}
                        {renderCreateApp()}

                                            {
                        address
                        && <WalletButton
                            address={address}
                            openWalletModal={openWalletModal}
                        />
                    }
                    </Stack>
                </Toolbar>
            </Box>
        </AppBar>
        
        <WalletPopup
            open={walletPopupOpen}
            onClose={() => setWalletPopupOpen(false)}
        />
    </>
}

function AccentButton(
    {
        buttonLink,
        buttonTitle,
        navigate,
    }: {
        buttonLink: string,
        buttonTitle: string,
        navigate: (link: string) => void,
    }) {
    return (
        <>
            <Button
                sx={{
                    height: '35px',
                    textTransform: 'none',
                    borderRadius: 16,
                    paddingLeft: 2,
                    paddingRight: 2,
                    display: {xs: "none", lg: "flex"},
                    alignItems: 'center',
                    color: 'white',
                    background: 'linear-gradient(125deg, #2196F3 0%, #673AB7 100%)',
                    border: 'none',
                }}
                component={Link}
                to={buttonLink}
                onClick={() => navigate(buttonLink)}
            >
                <Typography fontWeight={"medium"} variant={"subtitle2"} fontSize={"0.8rem"}>
                    {buttonTitle}
                </Typography>
            </Button>

            <IconButton
                color={"primary"}
                component={Link}
                to={buttonLink}
                onClick={buttonLink ? () => navigate(buttonLink) : undefined}
                sx={{
                    display: {xs: "flex", lg: "none"}
                }}
            >
                <IconPlus/>
            </IconButton>
        </>
    )
}

export function WalletButton(
    {
        address,
        openWalletModal,
        variant = "main",
    }:{
        address: string,
        openWalletModal: () => void,
        variant?: "static" | "main"
    }
) {
    return (
        <ButtonBase
            id={"wallet-button"}
            sx={{
                borderRadius: 12,
            }}>

            <Tooltip title={address}>
                <Stack
                    direction={"row"}
                    alignItems={"center"}
                    spacing={"0.8rem"}
                    borderColor={"divider"}
                    bgcolor={"background.paper"}
                    borderRadius={12}
                    height={"38px"}
                    paddingX={"0.8rem"}
                    onClick={openWalletModal}
                    sx={{
                        "&:hover": {
                            backgroundColor: "action.hover",
                        },
                    }}>

                    <Avatar
                        onClick={openWalletModal}
                        alt="UserLogo"
                        sx={{width: 28, height: 28, border: "1px solid", borderColor: "divider"}}
                    >
                        <PlaceholderAvatarSvg/>
                    </Avatar>

                    <Typography
                        variant="caption"
                        fontWeight={"bold"}
                        color={"text.primary"}
                        sx={{
                            display: {xs: variant === "static" ? "flex" : "none", lg: "flex"}
                        }}>
                        {shrinkAddress(address)}
                    </Typography>
                </Stack>
            </Tooltip>

        </ButtonBase>
    )
}
