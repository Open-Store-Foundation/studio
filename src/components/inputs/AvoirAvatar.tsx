import {Stack} from "@mui/material";
import {DefaultAvatar} from "@components/basic/DefaultAvatar.tsx";

export interface TextAvatarProps {
    name: string,
}

export function AvoirAvatar({ name }: TextAvatarProps) {
    return (
        <Stack
            height={"100%"}
            width={"100%"}
            display="flex"
            alignItems={"center"}
            justifyContent={"center"}
        >
            <DefaultAvatar name={name}/>
        </Stack>
    );
}