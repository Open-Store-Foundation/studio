import {Stack, Typography} from "@mui/material";
import {Android12Switch} from "@theme";

interface SwitchCellProps {
    disabled: boolean;
    checked: boolean;
    label: string;
    onChange?: (isChecked: boolean) => void;
}

export function AvoirSwitchCell(props: SwitchCellProps) {
    return <>

        <Stack spacing={3} direction={"row"} alignItems={"center"}>
            <Android12Switch
                disabled={props.disabled}
                checked={props.checked}
                onChange={(_, isChecked) => props.onChange?.(isChecked)}
            />

            <Typography variant="subtitle1" color="text.variant" fontWeight="bold">
                {props.label}
            </Typography>
        </Stack>
    </>
}