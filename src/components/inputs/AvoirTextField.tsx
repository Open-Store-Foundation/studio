///////////////////
// RichTextField
///////////////////
import {Box, IconButton, InputAdornment, Stack, TextField, Typography} from "@mui/material";
import {FieldAction} from "@components/inputs/FieldAction.tsx";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RefreshRounded from "@mui/icons-material/RefreshRounded";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export interface RichTextFieldProps {
    value?: string;
    defaultValue?: string;
    label?: string;
    helperText?: string;
    placeholder?: string;
    caption?: string;
    disabled?: boolean;
    error?: boolean;
    multiline?: boolean;
    sx?: any;
    id?: string;
    name?: string;
    grow?: boolean;
    minRows?: number;
    maxRows?: number;
    autocomplete?: string;
    type?: string;
    action?: FieldAction,
    actionDisabled?: boolean,
    onAction?: (action: FieldAction) => void;
    endAdornment?: React.ReactNode;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    slotProps?: {
        [P in keyof any]?: any[P];
    };
}

export function AvoirTextField(
    {
        value,
        defaultValue,
        label,
        helperText,
        placeholder,
        caption,
        disabled,
        error,
        autocomplete,
        type,
        action,
        grow,
        actionDisabled,
        onAction,
        sx,
        multiline,
        id,
        minRows,
        maxRows,
        name,
        endAdornment,
        onChange,
        slotProps
    }: RichTextFieldProps
) {
    const renderActionIcon = () => {
        switch (action) {
            case FieldAction.Delete:
                return <DeleteOutlineIcon />;
            case FieldAction.Restore:
                return <RefreshRounded />;
            case FieldAction.Copy:
                return <ContentCopyIcon />;
            default:
                return null;
        }
    };

    return (
        <Box display="flex" alignItems="start" gap={1.25}>

            <Stack spacing={0.5} width={grow ? 600 : "100%"} maxWidth={600}>
                <TextField
                    multiline={multiline}
                    label={label}
                    id={id}
                    defaultValue={defaultValue}
                    name={name}
                    onChange={onChange}
                    disabled={disabled}
                    placeholder={placeholder}
                    minRows={minRows}
                    maxRows={maxRows}
                    type={type}
                    autoComplete={autocomplete}
                    value={value}
                    error={error}
                    sx={{
                        ...sx,
                        minWidth: 300,
                    }}
                    slotProps={{
                        ...slotProps,
                        input: {
                            endAdornment: endAdornment && <InputAdornment position="end">
                                {endAdornment}
                            </InputAdornment>,
                            style: {
                                borderRadius: 12,
                            }
                        }
                    }}
                />

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={1}
                    sx={{px: 1}}
                >
                    <Typography
                        variant="caption"
                        color={error ? "error.main" : "text.secondary"}
                    >
                        {helperText}
                    </Typography>

                    <Typography
                        variant="caption"
                        color="text.variant"
                    >
                        {caption}
                    </Typography>
                </Stack>
            </Stack>

            {action !== undefined && action !== FieldAction.None && (
                <IconButton
                    onClick={() => onAction?.(action)}
                    size="small"
                    sx={{ mt: 1, color: 'text.secondary' }}
                    disabled={actionDisabled === undefined ? disabled : actionDisabled}
                >
                    {renderActionIcon()}
                </IconButton>
            )}
        </Box>
    );
}