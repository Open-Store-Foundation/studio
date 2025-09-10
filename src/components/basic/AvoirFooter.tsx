import {Box, IconButton, Stack} from "@mui/material";
import {AvoirTextButton} from "@components/inputs/AvoirButtons.tsx";
import {AppRoute} from "@router";
import {Link} from "react-router";
import {IconBrandDiscord, IconBrandTelegram, IconBrandX} from "@tabler/icons-react";

export function AvoirFooter() {
    return (
        <Stack
            height={"80px"}
            width={"100%"}
            display={"flex"}>

            <Stack
                direction={"row"}
                alignItems={"center"}
                height={"100%"}
                px={5}
                py={2}
                spacing={2}>

                <Stack
                    flexGrow={1}
                    direction={"row"}
                    alignItems={"center"}
                    justifyContent={"end"}
                    spacing={2}>

                    <AvoirTextButton
                        text={"Privacy"}
                        href={AppRoute.Article.route(AppRoute.Article.Privacy)}
                        target="_blank"
                    />

                    <AvoirTextButton
                        text={"Terms"}
                        href={AppRoute.Article.route(AppRoute.Article.Terms)}
                        target="_blank"
                    />

                    <AvoirTextButton
                        text={"Help"}
                        href={AppRoute.Tg.route(AppRoute.Tg.Community)}
                        target="_blank"
                    />

                    <AvoirTextButton
                        text={"About"}
                        href={AppRoute.Article.route(AppRoute.Article.Info)}
                        target="_blank"
                    />

                    <Box flexGrow={0} height={"18px"} width={"2px"} bgcolor={"divider"}/>

                    <IconButton
                        component={Link}
                        to={AppRoute.Tg.route(AppRoute.Tg.News)}
                        target="_blank"
                        rel="noopener">
                        <IconBrandTelegram size={18}/>
                    </IconButton>

                    <IconButton
                        component={Link}
                        to={AppRoute.Social.X}
                        target="_blank"
                        rel="noopener">
                        <IconBrandX size={18}/>
                    </IconButton>

                    <IconButton
                        component={Link}
                        to={AppRoute.Social.Discord}
                        target="_blank"
                        rel="noopener">
                        <IconBrandDiscord size={18}/>
                    </IconButton>
                </Stack>
            </Stack>
        </Stack>
    )
}
