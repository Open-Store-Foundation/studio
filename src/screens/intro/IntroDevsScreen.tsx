import {useState} from "react";
import {useAccount} from "wagmi";
import Box from "@mui/material/Box";
import {
    Button,
    CircularProgress,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Paper,
    Stack,
    Typography
} from "@mui/material";
import {useNavigate} from "react-router";
import {useWeb3} from "@di";
import {DevAccount, ScDevService} from "@data/sc/ScDevService.ts";
import {AppRoute} from "@router";
import {DefaultAvatar} from "@components/basic/DefaultAvatar.tsx";
import {OpenStoreSvg} from "@components/svgs.ts";
import {S, useAsyncEffect, useScreenState} from "@utils/state.ts";
import {AutoSnackbar} from "@components/events/AutoSnackbar.tsx";
import {str} from "@localization/res";
import {RStr} from "@localization/ids.ts";
import {NoRadius} from "@theme";
import {WalletPopup} from "@components/basic/WalletPopup.tsx";
import {WalletButton} from "@components/basic/AvoirToolbar.tsx";

export function IntroDevsScreen() {
    // Deps
    const web3 = useWeb3()
    const navigate = useNavigate();

    // State
    const {address, isConnected} = useAccount()
    const {data: accounts, setState, isLoading} = useScreenState<DevAccount[], void>()
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [walletPopupOpen, setWalletPopupOpen] = useState(false)

    // Callbacks
    const handleClickOpen = async () => navigate(AppRoute.DevCreate.route())
    const handleOpenWalletModal = async () => {
        if (isConnected) {
            setWalletPopupOpen(true);
        } else {
            await web3.modal.open();
        }
    }

    useAsyncEffect(async () => {
        if (address) {
            try {
                const data = await ScDevService.getDevAccounts(address)
                setState(S.data(data))
            } catch (e) {
                setState(S.data([]))
                console.error(e)
                setErrorMsg(str(RStr.UnknownError))
            }
        } else {
            setState(S.data([]))
        }
    }, [address])

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >

                <AutoSnackbar
                    message={errorMsg}
                    onClose={() => setErrorMsg(null)}
                />

                <Paper
                    elevation={0}
                    sx={{
                        width: 450,
                        borderRadius: 4,
                        border: '1px solid #19191A',
                        display: 'flex',
                    }}>

                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <List sx={{width: '100%'}}>

                            <ListItem key={"header"}>
                                <Header
                                    isConnected={isConnected}
                                    address={address || ""}
                                    onOpenWalletModal={handleOpenWalletModal}
                                />
                            </ListItem>

                            {
                                isLoading
                                && <ListItem key={"loading"}>
                                    <Stack
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <CircularProgress/>
                                    </Stack>
                                </ListItem>
                            }

                            {
                                accounts && accounts.length > 0
                                    ? (
                                        accounts.map((item) => (
                                            <ListItem key={item.name}>
                                                <ListItemButton
                                                    onClick={() => {
                                                        navigate(AppRoute.DevAccount.route(item.name, item.address))
                                                    }}
                                                    sx={{ ...NoRadius }}
                                                >
                                                    <ListItemAvatar>
                                                        <DefaultAvatar name={item.name}/>
                                                    </ListItemAvatar>

                                                    <ListItemText
                                                        style={{color: 'textSecondary'}}
                                                        primary={<Typography>{item.name}</Typography>}/>

                                                </ListItemButton>
                                            </ListItem>
                                        ))
                                    ) : <ListItem
                                        key={"empty"}
                                    >
                                        <Box
                                            width={"100%"}
                                            py={2}
                                            display={"flex"}
                                            alignItems={"center"}
                                            justifyContent={"center"}
                                        >
                                            <Typography
                                                color={"textSecondary"}
                                                textAlign={"center"}
                                                variant="subtitle2"
                                            >
                                                {str(RStr.IntroDevsScreen_noAccounts)}
                                            </Typography>
                                        </Box>
                                    </ListItem>
                            }

                            <Divider sx={{marginY: '0.5rem'}}/>

                            <ListItem key={"create"}>
                                <ListItemButton
                                    disabled={!isConnected}
                                    onClick={handleClickOpen}
                                    sx={{ ...NoRadius, py: 1.5 }}>

                                    <Stack
                                        direction={"row"}
                                        alignItems={"center"}
                                        justifyItems={"center"}>

                                        <ListItemText
                                            style={{color: 'text.primary'}}
                                            primary={str(RStr.IntroDevsScreen_createNew)}
                                        />
                                    </Stack>
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Box>
                </Paper>
            </Box>
            
            <WalletPopup
                open={walletPopupOpen}
                onClose={() => setWalletPopupOpen(false)}
            />
        </>
    )
}

function Header(
    {
        isConnected,
        address,
        onOpenWalletModal
    }: {
        isConnected: boolean,
        address: string,
        onOpenWalletModal: () => void
    }
) {
    return (
        <Stack width="100%" alignItems="center">
            <OpenStoreSvg height="36px" width="36px"/>

            <Stack direction="row" spacing={1} my={1} alignItems={"center"}>

                <Typography
                    noWrap
                    component="a"
                    href=""
                    variant="subtitle1"
                    fontWeight={"bold"}
                    color={`textPrimary`}
                    sx={{
                        mr: 2,
                        flexGrow: 0,
                        textDecoration: `none`,
                    }}
                >
                    {"Open Store "}
                    <Typography
                        fontWeight={"bold"}
                        variant={"subtitle1"}
                        component={"span"}
                        color={"#E6434F"}
                    >Studio</Typography>
                </Typography>
            </Stack>

            <Typography
                sx={{marginTop: 1, marginX: `1.8rem`}}
                align={"center"}
                variant="h5"
            >
                {str(RStr.IntroDevsScreen_selectAccount)}
            </Typography>

            <Typography
                sx={{marginTop: '0.5rem', marginX: `1.8rem`, marginBottom: '1rem'}}
                align={"center"}
                color="textSecondary"
                variant="subtitle2"
                gutterBottom
            >
                {str(RStr.IntroDevsScreen_selectAccountDescription)}
            </Typography>

            {
                isConnected
                    ? <WalletButton
                        address={address}
                        openWalletModal={onOpenWalletModal}
                        variant={"static"}
                    />
                    : <Button onClick={onOpenWalletModal}>
                        {str(RStr.IntroDevsScreen_button_connectWallet)}
                    </Button>
            }
        </Stack>
    )
}