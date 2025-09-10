import {Alert, Link, Stack, Typography} from "@mui/material";
import {str} from "@localization/res.ts";
import {RStr} from "@localization/ids.ts";
import {TextDecoration} from "@components/basic/TextDecoration.tsx";

export function NotEnoughAlert(
    {title, required, extendButton, onExtend}: { title: string, required?: string, extendButton?: string, onExtend?: () => void }
) {
    return <Alert color={"error"} icon={false}>
        <Stack direction="column" width="100%" spacing={1}>
            <Typography variant="body2">
                {title}

                {extendButton && onExtend &&
                    <Link
                        fontWeight={"bold"}
                        sx={{textDecoration: 'none', cursor: 'pointer'}}
                        onClick={onExtend}
                    >
                        {" " + extendButton}
                    </Link>
                }
            </Typography>

            {required &&
                <Typography variant="body2">
                    {str(RStr.CreateReleaseScreen_minRequired) + " "}
                    <TextDecoration variant={"body2"} text={required}/>
                </Typography>
            }
        </Stack>
    </Alert>
}
