import {useState} from 'react';
import {Box, Typography} from '@mui/material';
import Add from '@mui/icons-material/Add';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import {useGreenfield} from '@di';
import {useAsyncEffect} from '@utils/state.ts';
import {AvoirSkeleton} from "@components/anim/AvoirSkeleton.tsx";

interface AppLogoProps {
    devName: string;
    appPackage: string;
    onClick: () => void;
    size?: number;
    refreshKey?: number;
}

export function AppLogo({devName, appPackage, onClick, size = 220, refreshKey = 0}: AppLogoProps) {
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const greenfield = useGreenfield();

    useAsyncEffect(async () => {
        setLogoUrl(null);
        setLoading(true);
        setError(false);

        try {
            const path = greenfield.logoPath(appPackage)
            const hashFile = await greenfield.hasFile(devName, path);
            if (!hashFile) {
                setLoading(false);
                return
            }

            const logoUrl = await greenfield.downloadUrl(devName, path);
            if (!logoUrl) {
                setLoading(false);
                return
            }
            setLogoUrl(logoUrl);

            const img = new Image();
            img.onload = () => {
                setError(false);
                setLoading(false);
            };
            img.onerror = () => {
                setError(true);
                setLoading(false);
            };
            img.src = logoUrl;
        } catch (e) {
            console.error('Logo not found or error loading logo:', e);
            setError(true);
            setLoading(false);
        }
    }, [devName, appPackage, refreshKey]);

    return (
        <AvoirSkeleton isLoading={loading}>
            <Box
                sx={{
                    width: size,
                    height: size,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    bgcolor: 'background.paper',
                    border: theme => `2px solid ${theme.palette.divider}`,
                    backgroundImage: logoUrl ? `url(${logoUrl})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    '&:hover': {
                        border: theme => `2px dashed ${theme.palette.divider}`,
                        '& .logo-overlay': {
                            opacity: 1,
                        }
                    }
                }}
                onClick={onClick}
            >
                {error && (
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        color="error.main"
                    >
                        <ErrorOutline sx={{fontSize: 40, mb: 1}}/>
                        <Typography variant="caption" textAlign="center">
                            Failed to load
                        </Typography>
                    </Box>
                )}

                {!loading && !logoUrl && (
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        color="text.secondary"
                    >
                        <Add sx={{fontSize: 40, mb: 1}}/>
                        <Typography variant="caption" textAlign="center">
                            Upload Logo
                        </Typography>
                    </Box>
                )}

                {!loading && logoUrl && (
                    <Box
                        className="logo-overlay"
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            bgcolor: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0,
                            transition: 'opacity 0.2s ease',
                        }}
                    >
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            color="white"
                        >
                            <Add sx={{fontSize: 30, mb: 0.5}}/>
                            <Typography variant="caption" textAlign="center">
                                Change Logo
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Box>
        </AvoirSkeleton>
    );
} 