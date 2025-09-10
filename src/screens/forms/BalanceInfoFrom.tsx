import {Alert, LinearProgress, Link, Stack, Typography, useTheme} from "@mui/material";
import {AvoirActionButton} from "@components/inputs/AvoirButtons.tsx";
import {AvoirProperty, AvoirPropertyBox, AvoirPropertyTitle} from "@components/basic/AvoirProperty.tsx";
import {AvoirLegend} from "@components/basic/AvoirLegend.tsx";
import {
    formatSizeOrPlaceholder,
    formatTextOrLoading,
    formatUsdOrPlaceholder,
    formatValueOrPlaceholder,
    formatValueWithUsdOrPlaceholder,
    TBNB
} from "@utils/format";
import {AvoirSkeleton, isValueLoading} from "@components/anim/AvoirSkeleton.tsx";
import {IconArrowDownLeft, IconSettings} from "@tabler/icons-react";
import {str} from "@localization/res.ts";
import {RStr} from "@localization/ids.ts";

export interface BalanceInfoProps {
    balance?: bigint;
    balanceIsLoading?: boolean;

    prepaidFee?: bigint;
    prepaidFeeIsLoading?: boolean;

    flowRate?: bigint;
    flowRateIsLoading?: boolean;

    quoteAvailable?: string,
    quoteAvailableIsLoading?: boolean,
    mainPercent?: number;

    freeOneTime?: string,
    freeMonthly?: string,
    freePercent?: number;

    totalSize?: bigint;
    totalSizeIsLoading?: boolean;

    remainPercent?: number;
    
    onManage?: () => void;
    onExtend?: () => void;

    usdRate?: number;
}

export function BalanceInfoFrom({
    balance, balanceIsLoading,
    prepaidFee, prepaidFeeIsLoading,
    totalSize, totalSizeIsLoading,
    flowRate, flowRateIsLoading,
    usdRate, remainPercent,
    quoteAvailable, quoteAvailableIsLoading,
    freeOneTime, freeMonthly,
    mainPercent,
    freePercent,
    onManage,
    onExtend,
}: BalanceInfoProps) {
    const theme = useTheme()

    return (
        <Stack spacing={2}>
            <AvoirPropertyBox type={"big"}>
                <AvoirPropertyTitle title={str(RStr.BalanceInfoForm_title)}/>

                <Stack pb={1} direction="row" spacing={1}>
                    {isValueLoading(balance, balanceIsLoading) && (
                        <AvoirSkeleton isLoading={balanceIsLoading}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                {formatValueOrPlaceholder(balance, balanceIsLoading, TBNB, 6)}
                            </Typography>

                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.secondary'}}>
                                {`~${formatUsdOrPlaceholder(balance, usdRate, balanceIsLoading)}`}
                            </Typography>
                        </AvoirSkeleton>
                    )}
                </Stack>

                <Stack
                    direction="row"
                    justifyContent={"space-evenly"}
                    width={"100%"}
                    borderRadius={4}
                    bgcolor={"background.surfaceVariant"}
                    alignItems={"center"}
                    py={2}
                >
                    <AvoirActionButton
                        icon={
                            () => <IconArrowDownLeft
                                color={theme.palette.primary.contrastText}/>
                        }
                        title={str(RStr.BalanceInfoForm_claim)}
                        disabled={true} // balanceIsLoading || balance === undefined
                    />

                    <AvoirActionButton
                        icon={
                            () => <IconSettings
                                color={theme.palette.primary.contrastText}/>
                        }
                        title={str(RStr.BalanceInfoForm_manage)}
                        disabled={balanceIsLoading || balance === undefined}
                        onClick={onManage}
                    />
                </Stack>

                <Stack spacing={3} pt={1} >
                    <Stack spacing={1}>
                        <AvoirPropertyTitle title={str(RStr.BalanceInfoForm_fees)}/>
                        {isValueLoading(prepaidFee, prepaidFeeIsLoading) && (
                            <AvoirProperty
                                title={str(RStr.BalanceInfoForm_prepaidAmount)}
                                value={formatValueWithUsdOrPlaceholder(prepaidFee, usdRate, prepaidFeeIsLoading, TBNB)}
                                isLoading={prepaidFeeIsLoading}
                            />
                        )}
                        {isValueLoading(flowRate, flowRateIsLoading) && (
                            <AvoirProperty
                                title={str(RStr.BalanceInfoForm_monthlyAmount)}
                                value={formatValueWithUsdOrPlaceholder(flowRate, usdRate, flowRateIsLoading, TBNB)}
                                isLoading={flowRateIsLoading}
                            />
                        )}
                    </Stack>


                    <Stack spacing={1}>
                        <AvoirPropertyTitle title={str(RStr.BalanceInfoForm_data)}/>
                        {isValueLoading(totalSize, totalSizeIsLoading) && (
                            <AvoirProperty
                                title={str(RStr.BalanceInfoForm_total)}
                                value={formatSizeOrPlaceholder(totalSize, totalSizeIsLoading)}
                                isLoading={totalSizeIsLoading}
                            />
                        )}
                    </Stack>

                    <Stack spacing={3}>
                        <Stack spacing={1}>
                            <AvoirPropertyTitle title={str(RStr.BalanceInfoForm_download)}/>

                            {
                                freeOneTime &&
                                <AvoirProperty
                                    title={str(RStr.BalanceInfoForm_oneTimeFree)}
                                    value={formatTextOrLoading(freeOneTime)}
                                    isLoading={false}
                                />
                            }

                            {
                                freeMonthly &&
                                <AvoirProperty
                                    title={str(RStr.BalanceInfoForm_monthlyFree)}
                                    value={formatTextOrLoading(freeMonthly)}
                                    isLoading={false}
                                />
                            }

                            {isValueLoading(quoteAvailable, quoteAvailableIsLoading) && (
                                <AvoirProperty
                                    title={str(RStr.BalanceInfoForm_trafficAvailable)}
                                    value={formatTextOrLoading(quoteAvailable)}
                                    isLoading={quoteAvailableIsLoading}
                                />
                            )}
                        </Stack>

                        {(remainPercent !== undefined && remainPercent < 20) && ( // TODO to config
                            <Alert // TODO to separated element
                                severity="warning" 
                                icon={false}
                                sx={{ my: 1 }}
                            >
                                <Typography variant="caption">
                                    Your quota is running low ({remainPercent.toFixed(1)}% remaining). 
                                    <Link 
                                        component="button"
                                        variant="caption"
                                        onClick={onExtend}
                                        sx={{ ml: 0.5, fontWeight: 'bold' }}
                                    >
                                        Extend quota
                                    </Link>
                                </Typography>
                            </Alert>
                        )}

                        <LinearProgress
                            variant="determinate"
                            value={remainPercent || 0}
                            sx={{
                                height: 8,
                                borderRadius: 8,
                                '& .MuiLinearProgress-bar': {
                                    background: `linear-gradient(to right, 
                                        ${theme.palette.primary.main} 0%, 
                                        ${theme.palette.primary.main} ${mainPercent || 0}%,  
                                        ${theme.palette.warning.main} ${mainPercent || 0}%,  
                                        ${theme.palette.warning.main} ${(mainPercent || 0) + (freePercent || 0)}%,
                                        ${theme.palette.divider} ${(mainPercent || 0) + (freePercent || 0)}%,
                                        ${theme.palette.divider} 100%)`,
                                }
                            }}
                        />

                        <AvoirLegend
                            items={[
                                {color: theme.palette.primary.main, label: str(RStr.BalanceInfoForm_mainQuote)},
                                {color: theme.palette.warning.main, label: str(RStr.BalanceInfoForm_freeQuote)}
                            ]}
                        />
                    </Stack>
                </Stack>
            </AvoirPropertyBox>
        </Stack>
    );
}
