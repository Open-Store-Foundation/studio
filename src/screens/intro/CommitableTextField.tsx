import {AvoirCountedTextField} from "@components/inputs/AvoirCountedTextField.tsx";
import {CircularProgress, Stack} from "@mui/material";
import {AvoirTextButton} from "@components/inputs/AvoirButtons.tsx";
import {str} from "@localization/res.ts";
import {RStr} from "@localization/ids.ts";

interface CheckableTextFieldProps {
    label: string
    value: string
    onChange: (value: string) => void
    onCommit: () => Promise<boolean>
    error?: boolean
    loading?: boolean
    disabled?: boolean
    commitDisabled?: boolean
    helperText?: string
    maxLength: number;
}

export function CheckableTextField(props: CheckableTextFieldProps) {
    return (
        <AvoirCountedTextField
            label={props.label}
            value={props.value}
            error={props.error}
            disabled={props.disabled}
            helperText={props.helperText}
            maxLength={props.maxLength}
            endAdornment={
                <Stack direction="row" spacing={3} alignItems={"center"}>
                    {
                        props.loading &&
                        <CircularProgress size={"1.5rem"}/>
                    }

                    <AvoirTextButton
                        text={str(RStr.IntroCreateDevScreen_button_check)}
                        color={"primary"}
                        disabled={props.commitDisabled || props.disabled}
                        onClick={props.onCommit}
                    />
                </Stack>
            }
            onChange={(e) => {
                props.onChange(e.target.value)
            }}
        />
    )
}
