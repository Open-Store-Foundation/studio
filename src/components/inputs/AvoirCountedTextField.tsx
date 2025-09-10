import {useState} from "react";
import {AvoirTextField, RichTextFieldProps} from "@components/inputs/AvoirTextField.tsx";


////////////////////////
// TextFieldWithCounter
////////////////////////
export interface TextFieldWithCounterProps extends RichTextFieldProps {
    maxLength: number;
    title?: string;
}

export function AvoirCountedTextField(
    props: TextFieldWithCounterProps
) {
    const [length, setLength] = useState(props.value?.length || 0);

    return (
        <AvoirTextField
            {...props}
            caption={`${length}/${props.maxLength}`}
            slotProps={
                {
                    formHelperText: {
                        sx: {ml: 0, px: 0},
                    },
                    htmlInput: {
                        maxLength: props.maxLength
                    }
                }
            }
            onChange={(e) => {
                setLength(e.target.value.length);
                props.onChange?.(e);
            }}
        />
    );
}

////////////////////////
// AmountTextField
////////////////////////
import {Button, Stack, Typography} from "@mui/material";

export interface AmountTextFieldProps extends RichTextFieldProps {
    currency?: string;
    balance?: string;
    showMaxButton?: boolean;
    onMaxClick?: () => void;
    usdEquivalent?: string;
    amount?: number;
}

export function AmountTextField(
    {
        currency = "BNB",
        balance,
        showMaxButton = false,
        onMaxClick,
        usdEquivalent,
        amount,
        ...props
    }: AmountTextFieldProps
) {
    return (
        <AvoirTextField
            {...props}
            type="number"
            endAdornment={
                <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Typography variant="body2" color="text.secondary">
                        {currency}
                    </Typography>
                    {showMaxButton && (
                        <Button
                            size="small"
                            onClick={onMaxClick}
                            disabled={props.disabled}
                            disableRipple
                            sx={{
                                minWidth: 'auto',
                                height: 28,
                                px: 1,
                                textTransform: 'none',
                                fontSize: '0.75rem'
                            }}
                        >
                            Max
                        </Button>
                    )}
                </Stack>
            }
            caption={balance ? `Balance: ${balance}` : undefined}
            helperText={usdEquivalent}
            slotProps={{
                ...props.slotProps,
                htmlInput: {
                    min: 0,
                    style: {
                        fontWeight: 'bold',
                    },
                    ...props.slotProps?.htmlInput
                },
                formHelperText: {
                    sx: {mx: 0, px: 0},
                    ...props.slotProps?.formHelperText
                }
            }}
            sx={{
                '& input[type=number]': {
                                                MozAppearance: 'textfield',
                        },
                        '& input[type=number]::-webkit-outer-spin-button': {
                            WebkitAppearance: 'none',
                            margin: 0,
                        },
                        '& input[type=number]::-webkit-inner-spin-button': {
                            WebkitAppearance: 'none',
                    margin: 0,
                },
                ...props.sx
            }}
        />
    );
}
