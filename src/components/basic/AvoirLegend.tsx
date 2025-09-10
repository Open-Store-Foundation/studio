import {Box, Stack, Typography} from "@mui/material";

interface AvoirLegendItemProps {
    color: string;
    label: string;
}

export function AvoirLegendItem({color, label}: AvoirLegendItemProps) {
    return (
        <Stack direction="row" alignItems="center" spacing={0.5}>
            <Box
                sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: color,
                }}
            />
            <Typography variant="caption" color="text.secondary">
                {label}
            </Typography>
        </Stack>
    );
}

interface AvoirLegendProps {
    items: Array<{color: string; label: string}>;
    spacing?: number;
}

export function AvoirLegend({items, spacing = 2}: AvoirLegendProps) {
    return (
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={spacing}>
            {items.map((item, index) => (
                <AvoirLegendItem key={index} color={item.color} label={item.label} />
            ))}
        </Stack>
    );
} 