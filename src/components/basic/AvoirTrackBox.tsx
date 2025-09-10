import {Box, Stack, Typography} from "@mui/material";

export interface TrackBoxProps {
    track: {
        id: any;
        label: string;
        color: string;
        description: string;
    };
    isSelected: boolean;
    onClick: () => void;
    disabled?: boolean;
    width?: string | number;
    height?: string | number;
}

export function AvoirTrackBox(
    {
        track,
        isSelected,
        onClick,
        disabled,
        width = '175px',
        height = '90px'
    }: TrackBoxProps
) {
    const getBoxShadow = (color: string) => {
        if (disabled) {
            return '0 0 10px rgba(0, 0, 0, 0.3)';
        }

        switch (color) {
            case 'text.primary':
                return '0 0 10px rgba(255, 255, 255, 0.3)';
            case 'success.main':
                return '0 0 10px rgba(76, 175, 80, 0.3)';
            case 'warning.main':
                return '0 0 10px rgba(255, 152, 0, 0.3)';
            case 'error.main':
                return '0 0 10px rgba(244, 67, 54, 0.3)';
            default:
                return 'none';
        }
    };

    return (
        <Stack
            onClick={disabled ? undefined : onClick}
            width={width}
            height={height}
            display="flex"
            px={2}
            py={1}
            pt={1}
            flexDirection="column"
            bgcolor="background.default"
            justifyContent="space-around"
            borderRadius={2}
            position="relative"
            sx={{
                cursor: disabled ? "not-allowed" : "pointer",
                border: '2px solid',
                borderColor: isSelected ? track.color : 'background.default',
                transition: 'all 0.2s ease-in-out',
                boxShadow: isSelected ? getBoxShadow(track.color) : 'none',
                '&:hover': disabled ? undefined : {
                    borderColor: track.color,
                    boxShadow: getBoxShadow(track.color),
                    bgcolor: "action.hover",
                }
            }}
        >
            <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                    position="relative"
                    width={6}
                    height={6}
                    sx={{
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: -1,
                            left: -1,
                            right: -1,
                            bottom: -1,
                            bgcolor: disabled ? "divider" : track.color,
                            borderRadius: "50%",
                            filter: 'blur(1px)',
                            opacity: 0.9,
                        },
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            bgcolor: disabled ? "divider" : track.color,
                            borderRadius: "50%",
                            filter: 'blur(1px)',
                            opacity: 1,
                        }
                    }}
                />

                <Typography
                    variant="subtitle2"
                    color={ disabled ? "text.secondary" : "text.primary"}
                    overflow="hidden"
                >
                    {track.label}
                </Typography>
            </Stack>

            <Typography
                variant="caption"
                color="text.secondary"
                align="left"
                overflow="hidden"
            >
                {track.description}
            </Typography>
        </Stack>
    );
}