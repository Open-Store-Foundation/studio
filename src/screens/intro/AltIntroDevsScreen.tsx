import {useState} from "react";
import {useAccount} from "wagmi";
import Box from "@mui/material/Box";
import {Avatar, Chip, CircularProgress, Link, Stack, Typography, IconButton, useColorScheme} from "@mui/material";
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

import {WalletPopup} from "@components/basic/WalletPopup.tsx";
import {WalletButton} from "@components/basic/AvoirToolbar.tsx";
import {AvoirFooter} from "@components/basic/AvoirFooter.tsx";
import AccountBalanceWalletRounded from "@mui/icons-material/AccountBalanceWalletRounded";
import AddRounded from "@mui/icons-material/AddRounded";
import {AvoirCardItem} from "@components/basic/AvoirCardItem.tsx";
import {IconSun} from "@tabler/icons-react";

export function AltIntroDevsScreen() {
    const web3 = useWeb3()
    const navigate = useNavigate()
    const {address, isConnected} = useAccount()
    const {data: accounts, setState, isLoading} = useScreenState<DevAccount[], void>()
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [walletPopupOpen, setWalletPopupOpen] = useState(false)

    const handleCreatePublisher = async () => navigate(AppRoute.DevCreate.route())
    const handleOpenWalletModal = async () => {
        if (isConnected) {
            setWalletPopupOpen(true)
        } else {
            await web3.modal.open()
        }
    }

    useAsyncEffect(async () => {
        if (address) {
            try {
                const data = await ScDevService.getDevAccounts(address)
                // const data = Array.from({length: 10}).map((_, i) => { return { id: `dev-${i}`, address: `0x${i.toString(16)}` } })
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
            <Toolbar/>

            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: 'calc(100vh - 80px)', py: 10}}>
                <AutoSnackbar
                    message={errorMsg}
                    onClose={() => setErrorMsg(null)}
                />

                <Box sx={{width: { xs: '100%', sm: 560 }, maxWidth: '100%', px: { xs: 2, sm: 0 }}}>
                    <Box sx={{display: 'flex', justifyContent: 'center'}}>
                        <Header
                            isConnected={isConnected}
                            address={address || ""}
                            onOpenWalletModal={handleOpenWalletModal}
                        />
                    </Box>

                    {isConnected && isLoading && (
                        <Box sx={{display: 'flex', justifyContent: 'center', my: 4}}>
                            <CircularProgress/>
                        </Box>
                    )}

                    {!isConnected && (
                        <Stack spacing={3} sx={{mt: 1}}>
                            <AvoirCardItem
                                onClick={handleOpenWalletModal}
                                left={
                                    <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', width: 40, height: 40 }}>
                                        <AccountBalanceWalletRounded fontSize="small"/>
                                    </Avatar>
                                }
                                title={"Connect existing wallet"}
                            />

                            <Typography variant="caption" align="center" color="textSecondary" sx={{ maxWidth: { xs: 320, sm: 420 }, mx: 'auto', alignSelf: 'center' }}>
                                By connecting your wallet, you acknowledge that you have read and agree to our{' '}
                                <Link href={AppRoute.Article.route(AppRoute.Article.Terms)} underline="hover">Terms of Service</Link>{' '}and{' '}
                                <Link href={AppRoute.Article.route(AppRoute.Article.Privacy)} underline="hover">Privacy Policy</Link>.
                            </Typography>
                        </Stack>
                    )}

                    {isConnected && (
                    <>
                    <Box sx={{display: 'flex', justifyContent: 'center', mt: 2, mb: 0.5}}>
                        <Typography
                            variant="overline"
                            fontWeight={700}
                            color="text.secondary"
                            sx={{letterSpacing: '.08em'}}
                        >
                            Publisher accounts
                        </Typography>
                    </Box>
                    <Stack spacing={{ xs: 1.25, sm: 1.5 }} sx={{mt: 0.5}}>
                        {accounts && accounts.length > 0 ? (
                            accounts.map((item) => (
                                <AvoirCardItem
                                    key={item.id}
                                    onClick={() => navigate(AppRoute.DevAccount.route(item.id, item.address))}
                                    left={<DefaultAvatar name={item.id} size={40}/>} 
                                    title={item.id}
                                    right={<Chip label="Greenfield" size="small" color="primary" variant="filled" sx={{ fontWeight: 600, display: { xs: 'none', sm: 'inline-flex' } }}/>} 
                                />
                            ))
                        ) : (
                            <Box width={"100%"} py={2} display={"flex"} alignItems={"center"} justifyContent={"center"}>
                                <Typography color={"textSecondary"} textAlign={"center"} variant="subtitle2">
                                    {str(RStr.IntroDevsScreen_noAccounts)}
                                </Typography>
                            </Box>
                        )}

                        <AvoirCardItem
                            onClick={() => isConnected && handleCreatePublisher()}
                            disabled={!isConnected}
                            left={
                                <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', width: { xs: 36, sm: 40 }, height: { xs: 36, sm: 40 } }}>
                                    <AddRounded fontSize="small"/>
                                </Avatar>
                            }
                            title={str(RStr.IntroDevsScreen_createNew)}
                        />
                    </Stack>
                    </>
                    )}
                </Box>
            </Box>

            <WalletPopup open={walletPopupOpen} onClose={() => setWalletPopupOpen(false)} />

            <AvoirFooter />
        </>
    )
}

function Header({
    isConnected,
    address,
    onOpenWalletModal,
}: {
    isConnected: boolean,
    address: string,
    onOpenWalletModal: () => void
}) {
    return (
        <Stack width="100%" alignItems="center">
            <OpenStoreSvg height="36px" width="36px"/>

            <Stack direction="row" spacing={1} my={1} alignItems={"center"}>
                <Typography
                    noWrap
                    component="a"
                    href=""
                    variant="h6"
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
                        variant={"h6"}
                        component={"span"}
                        color={"primary.main"}
                    >Studio</Typography>
                </Typography>
            </Stack>

            <Typography sx={{mt: 2, fontWeight: 800}} align={"center"} variant="h4">
                {isConnected ? 'Select publisher account' : 'Log in to your account'}
            </Typography>

            <Typography
                sx={{mt: 1, mb: 3, letterSpacing: '.02em'}}
                align={"center"}
                color="textSecondary"
                variant="body2"
                gutterBottom
            >
                {isConnected ? 'You can choose existing or create a new one' : 'Connect wallet to see or create publisher accounts'}
            </Typography>

            {
                isConnected &&
                <WalletButton
                    variant={"static"}
                    address={address}
                    openWalletModal={onOpenWalletModal}
                />
            }

        </Stack>
    )
}

function Toolbar() {
    const {mode, systemMode, setMode} = useColorScheme();
    return (
        <Box width="100%"
             display="flex"
             justifyContent="flex-end"
             alignItems={"center"}
             height={"70px"}
             sx={{
                 px: 2,
                 position: 'fixed',
                 zIndex: (theme) => theme.zIndex.appBar + 1,
                 bgcolor: { sm: "background.default", md: "transparent" }
            }}
        >
            <IconButton
                color={"primary"}
                onClick={() => {
                    const scheme = mode === 'system' ? systemMode : mode
                    setMode(scheme == "dark" ? "light" : "dark")
                }}
            >
                <IconSun/>
            </IconButton>
        </Box>
    )
}


