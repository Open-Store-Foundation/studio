import Box from "@mui/material/Box";

interface SpacerProps {
    x?: number;
    y?: number;
}

export function Spacer({ x, y }: SpacerProps) {
    return (
        <Box pt={y} pl={x}/>
    )
}
