import Stack from "@mui/material/Stack/Stack";

export function AvoirCard(
    {children}: { children: React.ReactNode }
) {
    return (
        <Stack
            sx={{
                width: '100%',
                bgcolor: 'background.paper',
                borderRadius: 2,
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {children}
        </Stack>
    )
}
