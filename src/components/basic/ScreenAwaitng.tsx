import {Stack, Typography} from "@mui/material";
import {useEffect, useMemo, useState} from "react";
import {PlaceholderImageSvg} from "@components/svgs.ts";

export interface ScreenAwaitngProps {
    title: string,
}

export function ScreenAwaitng({title}: ScreenAwaitngProps) {
    const [dotCount, setDotCount] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            setDotCount(prev => (prev % 3) + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const dots = useMemo(() => ".".repeat(dotCount), [dotCount]);

    return (
        <Stack
            width={"100%"}
            height={"500px"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            spacing={2}
        >
            <PlaceholderImageSvg
                height="200px"
                width="200px"
            />

            <Stack spacing={1}>
                <Typography
                    variant={"h6"}
                    align={"center"}
                    color={"text.secondary"}
                    sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        maxWidth: "100%",
                        wordBreak: "break-word",
                        whiteSpace: "normal",
                        textAlign: "center",
                        overflowWrap: "break-word",
                    }}
                >
                    {title}{dots}
                </Typography>
            </Stack>
        </Stack>
    )
}






