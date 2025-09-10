import {Box, Stack, Typography, useColorScheme} from "@mui/material";

interface StorageBoxProps {
    title: string;
    image: string;
    description?: string;
    disabled?: boolean;
    selected?: boolean;
    onSelected?: (e: any) => void;
}

export function AvoirCard({title, description, image, onSelected, disabled = false, selected = false}: StorageBoxProps) {
    const { mode } = useColorScheme();

    return (
        <Box
            onClick={onSelected}
            sx={{
                width: 360,
                height: 120,
                borderRadius: 2,
                border: "2px solid",
                borderColor: selected ? "success.main" : (disabled ? "divider" : "divider"),
                overflow: "hidden",
                position: "relative",
                cursor: disabled ? "not-allowed" : "pointer",
                boxShadow: selected ? '0 0 10px rgba(76, 175, 80, 0.3)' : 'none',
                "&:hover": {
                    borderColor: disabled ? "divider" : "success.main",
                    boxShadow: disabled ? undefined : '0 0 10px rgba(76, 175, 80, 0.3)',
                },
            }}
        >
            <Box
                component="img"
                src={image}
                sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                }}
            />

            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: disabled
                        ? "linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.9))"
                        : (
                            mode == "dark"
                                ? "linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.9))"
                                : "linear-gradient(to bottom, rgba(255,255,255,0.7), rgba(255,255,255,0.9))"
                        ),
                    display: "flex",
                    alignItems: "flex-end",
                    px: 2,
                    py: 1,
                }}
            >
                <Stack pb={1}>
                    <Typography variant="h6" color="text.primary" fontWeight="bold">
                        {title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight="bold">
                        {description}
                    </Typography>
                </Stack>
            </Box>
        </Box>
    );
}