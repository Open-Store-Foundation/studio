import {Stack, Typography, Select, MenuItem, FormControl, SelectProps} from "@mui/material";

type SelectValue = string | number;

export interface PropertySelectorProps extends Omit<SelectProps, 'onChange' | 'value'> {
    title: string;
    options: { value: SelectValue; label: string }[];
    value: SelectValue;
    onChange: (value: SelectValue) => void;
}

export function AvoirSelector({
    title,
    options,
    value,
    onChange,
    ...props
}: PropertySelectorProps) {
    const handleChange = (event: any) => {
        onChange(event.target.value);
    };

    return (
        <Stack direction={"row"} display={"flex"}>
            <Typography
                variant={"subtitle2"}
                color={"text.secondary"}
                fontWeight={"medium"}
                width={250}
                flexWrap={"nowrap"}>
                {title}
            </Typography>

            <FormControl
                fullWidth
                sx={{
                    maxWidth: 300,
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderRadius: 4,
                    },
                }}
            >
                <Select
                    {...props}
                    value={value}
                    onChange={handleChange}
                >
                    {options.map(({value, label}) => (
                        <MenuItem key={String(value)} value={value}>
                            {label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Stack>
    )
}