import {Box, Button, Popover, Stack} from "@mui/material";
import {useState} from "react";
import {useAccount, useDisconnect} from "wagmi";
import {AutoSnackbar} from "@components/events/AutoSnackbar.tsx";

interface WalletPopupProps {
    open: boolean;
    onClose: () => void;
}

export function WalletPopup({open, onClose}: WalletPopupProps) {
    const {address} = useAccount();
    const {disconnect} = useDisconnect();

    const [copySuccess, setCopySuccess] = useState<string | null>(null);

    const handleCopyAddress = async () => {
        if (address) {
            try {
                await navigator.clipboard.writeText(address);
                setCopySuccess("Copied to clipboard!");
            } catch (err) {
                console.error('Failed to copy address:', err);
            }
        }
    };

    const handleDisconnect = () => {
        disconnect();
        onClose();
    };

    return (
        <Popover
            open={open}
            anchorEl={() => document.getElementById("wallet-button")!} // TODO v2 refactor
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: 1.5,
                        width: 180,
                        mt: 1,
                        mr: 4,
                        boxShadow: 2
                    }
                }
            }}
        >
            <AutoSnackbar
                message={copySuccess}
                onClose={() => { setCopySuccess(null) }}
            />

            <Box sx={{ p: 1 , backgroundColor: "background.paper" }}>
                <Stack>
                    <Stack>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={handleCopyAddress}
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                            }}
                        >
                            Copy Address
                        </Button>

                        <Button
                            fullWidth
                            variant="outlined"
                            color="error"
                            onClick={handleDisconnect}
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                            }}
                        >
                            Disconnect
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Popover>
    );
} 