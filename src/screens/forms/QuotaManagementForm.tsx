import {useEffect, useMemo, useState} from "react";
import {Box, Slider, Stack, TextField, Typography, useTheme} from "@mui/material";
import {AvoirPropertyBox} from "@components/basic/AvoirProperty.tsx";
import {AvoirLegend} from "@components/basic/AvoirLegend.tsx";
import {AvoirSkeleton} from "@components/anim/AvoirSkeleton.tsx";
import {formatQuotePriceWithUsd, formatValueWithUsdOrPlaceholder, TBNB} from "@utils/format.ts";
import {str} from "@localization/res.ts";
import {RStr} from "@localization/ids.ts";

interface QuotaManagementFormProps {
    currentQuotaGb?: number;
    quoteDownloadPricePerGg?: bigint;

    selectedQuotaGb: number;
    onQuotaChange: (quotaGb: number) => void;

    usdRate?: number;
}

const MAX_QUOTA_GB = 102400;

const quotaToSliderValue = (quotaGb?: number): number => {
    if (quotaGb == null) {
        return 0;
    }

    if (quotaGb <= 100) {
        return (quotaGb - 1) / 99 * 25;
    } else if (quotaGb <= 1000) {
        return 25 + (quotaGb - 100) / 900 * 25;
    } else if (quotaGb <= 10240) {
        return 50 + (quotaGb - 1000) / 9240 * 25;
    } else {
        return 75 + (quotaGb - 10240) / (102400 - 10240) * 25;
    }
};

const sliderValueToQuota = (sliderValue: number): number => {
    if (sliderValue <= 25) {
        const quotaGb = 1 + (sliderValue / 25) * 99;
        return Math.round(quotaGb);
    } else if (sliderValue <= 50) {
        const quotaGb = 100 + ((sliderValue - 25) / 25) * 900;
        return Math.round(quotaGb);
    } else if (sliderValue <= 75) {
        const quotaGb = 1000 + ((sliderValue - 50) / 25) * 9240;
        return Math.round(quotaGb);
    } else {
        const quotaGb = 10240 + ((sliderValue - 75) / 25) * (102400 - 10240);
        return Math.round(quotaGb);
    }
};

export function QuotaManagementForm(
    {
        currentQuotaGb,
        quoteDownloadPricePerGg,

        selectedQuotaGb,
        onQuotaChange,

        usdRate
    }: QuotaManagementFormProps
) {
    const theme = useTheme();

    const [sliderValue, setSliderValue] = useState<number>(quotaToSliderValue(selectedQuotaGb));
    const currentQuotaSliderValue = useMemo(() => quotaToSliderValue(currentQuotaGb), [currentQuotaGb]);

    useEffect(() => {
        setSliderValue(quotaToSliderValue(selectedQuotaGb));
    }, [selectedQuotaGb]);

    const handleSliderChange = (_: Event, value: number | number[]) => {
        const newSliderValue = Array.isArray(value) ? value[0] : value;
        const constrainedSliderValue = Math.max(newSliderValue, currentQuotaSliderValue);
        setSliderValue(constrainedSliderValue);
        const newQuotaGb = sliderValueToQuota(constrainedSliderValue);
        onQuotaChange(newQuotaGb);
    };

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        const numericValue = parseFloat(inputValue);

        if (!isNaN(numericValue) && currentQuotaGb != null && numericValue >= 0 && numericValue <= MAX_QUOTA_GB) {
            const finalQuotaGb = Math.max(numericValue, currentQuotaGb);
            onQuotaChange(finalQuotaGb);
            setSliderValue(quotaToSliderValue(finalQuotaGb));
        }
    };

    return (
        <AvoirPropertyBox title={str(RStr.QuotaManagementForm_title)}>
            <Stack spacing={2} py={1}>
                <Box>
                    <Box sx={{position: 'relative'}}>
                        <Slider
                            value={sliderValue}
                            onChange={handleSliderChange}
                            disabled={currentQuotaGb == null}
                            min={0}
                            max={100}
                            step={0.1}
                            valueLabelDisplay="off"
                            sx={{
                                color: theme.palette.primary.main,
                                height: 8,
                                '& .MuiSlider-rail': {
                                    background: `linear-gradient(to right, 
                                    ${theme.palette.warning.main} 0%, 
                                    ${theme.palette.warning.main} ${currentQuotaSliderValue}%, 
                                    ${theme.palette.grey[300]} ${currentQuotaSliderValue}%, 
                                    ${theme.palette.grey[300]} 100%)`,
                                    opacity: 1,
                                },
                                '& .MuiSlider-track': {
                                    border: 'none',
                                    background: `linear-gradient(to right, 
                                    ${theme.palette.warning.main} 0%, 
                                    ${theme.palette.warning.main} ${(currentQuotaSliderValue / sliderValue) * 100}%, 
                                    ${theme.palette.primary.main} ${(currentQuotaSliderValue / sliderValue) * 100}%, 
                                    ${theme.palette.primary.main} 100%)`,
                                },
                                '& .MuiSlider-thumb': {
                                    height: 18,
                                    width: 18,
                                    backgroundColor: '#fff',
                                    border: '2px solid currentColor',
                                    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                                        boxShadow: 'inherit',
                                    },
                                },
                            }}
                        />

                        <Box
                            sx={{
                                position: 'absolute',
                                left: `${sliderValue}%`,
                                top: -30,
                                transform: 'translateX(-50%)',
                                bgcolor: 'background.default',
                                color: 'text.primary',
                                px: 1,
                                py: 0.2,
                                borderRadius: 1,
                                fontSize: 14,
                                fontWeight: 'bold',
                                border: '1px solid',
                                borderColor: 'divider',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    top: '100%',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: 0,
                                    height: 0,
                                    borderLeft: '6px solid transparent',
                                    borderRight: '6px solid transparent',
                                    borderTop: '6px solid',
                                    borderTopColor: 'divider',
                                }
                            }}
                        >
                            {selectedQuotaGb}GB
                        </Box>
                    </Box>

                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="caption" color="text.secondary">1 GB</Typography>
                        <Typography variant="caption" color="text.secondary">100 GB</Typography>
                        <Typography variant="caption" color="text.secondary">1 TB</Typography>
                        <Typography variant="caption" color="text.secondary">10 TB</Typography>
                        <Typography variant="caption" color="text.secondary">100 TB</Typography>
                    </Stack>
                </Box>

                <Typography variant="body2" color="text.secondary" textAlign="center">
                    {formatValueWithUsdOrPlaceholder(
                        quoteDownloadPricePerGg, usdRate, quoteDownloadPricePerGg == null,
                        str(RStr.TbnbGbPerMonth)
                    )}
                </Typography>

                <Box pb={1}>
                    <AvoirLegend 
                        items={[
                            {color: theme.palette.warning.main, label: str(RStr.QuotaManagementForm_currentQuote)},
                            {color: theme.palette.primary.main, label: str(RStr.QuotaManagementForm_newQuote)}
                        ]}
                    />
                </Box>

                <Stack direction="row" justifyContent="space-between">
                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            {str(RStr.QuotaManagementForm_currentQuote)}
                        </Typography>

                        <AvoirSkeleton isLoading={currentQuotaGb == null}>
                            <Stack height={40} justifyContent={"center"}>
                                <Typography variant="h6" fontWeight="bold">
                                    {currentQuotaGb} {str(RStr.GbPerMonth)}
                                </Typography>
                            </Stack>

                            <Typography variant="caption" color="text.secondary" pt={1}>
                                {formatQuotePriceWithUsd(
                                    currentQuotaGb, quoteDownloadPricePerGg,
                                    usdRate, currentQuotaGb == null || quoteDownloadPricePerGg == null,
                                    `${TBNB}${str(RStr.PerMonth)}`
                                )}
                            </Typography>
                        </AvoirSkeleton>
                    </Box>

                    <Stack textAlign="right">
                        <Typography variant="body2" color="text.secondary">
                            {str(RStr.QuotaManagementForm_selectedQuote)}
                        </Typography>

                        <AvoirSkeleton isLoading={currentQuotaGb == null || quoteDownloadPricePerGg == null}>
                            <Stack direction="row" alignItems={"center"} spacing={1} height={40}>
                                <TextField
                                    value={selectedQuotaGb}
                                    onChange={handleTextChange}
                                    size="small"
                                    type="number"
                                    inputProps={{
                                        min: 1,
                                        max: 102400,
                                        step: 1,
                                        style: {
                                            textAlign: 'right',
                                            fontWeight: 'bold',
                                            fontSize: '1rem'
                                        }
                                    }}
                                    sx={{
                                        width: '80px',
                                        '& .MuiOutlinedInput-input': {
                                            padding: '6px 12px',
                                        },
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
                                    }}
                                />

                                <Typography variant="h6" fontWeight="bold" color="text.primary">
                                    {str(RStr.GbPerMonth)}
                                </Typography>
                            </Stack>

                            <Typography variant="caption" color="text.secondary" pt={1}>
                                {formatQuotePriceWithUsd(
                                    selectedQuotaGb, quoteDownloadPricePerGg, usdRate,
                                    currentQuotaGb == null || quoteDownloadPricePerGg == null,
                                    `${TBNB}${str(RStr.PerMonth)}`
                                )}
                            </Typography>
                        </AvoirSkeleton>
                    </Stack>
                </Stack>
            </Stack>
        </AvoirPropertyBox>
    );
} 