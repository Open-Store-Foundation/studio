import {Stack, Typography} from "@mui/material";
import {AvoirProperty, AvoirPropertyBox, AvoirPropertyTitle} from "@components/basic/AvoirProperty.tsx";
import {formatBigIntWithUsd, formatNumberWithUsd, formatValueWithUsdOrPlaceholder, TBNB} from "@utils/format";
import {isValueLoading} from "@components/anim/AvoirSkeleton.tsx";
import {str} from "@localization/res.ts";
import {RStr} from "@localization/ids.ts";
import {parseEther} from "viem";

export interface FeesFormProps {
    topUpAmount?: number;

    oracleFee?: bigint;
    oracleFeeIsLoading?: boolean;

    validatorFee?: bigint;
    validatorFeeIsLoading?: boolean;

    networkFee?: bigint;
    networkFeeIsLoading?: boolean;

    relayFee?: bigint;
    relayFeeIsLoading?: boolean;

    storageFee?: bigint;
    storageFeeIsLoading?: boolean;

    storageGasFee?: bigint;
    storageGasFeeIsLoading?: boolean;

    currentNetflowRatePerMonth?: bigint;
    nextNetflowRatePerMonth?: bigint;
    
    usdRate?: number;
}

function getTotalWalletFee(fees: FeesFormProps) {
    const totalWalletFee = [
        fees.oracleFee ?? 0n,
        fees.validatorFee ?? 0n,
        fees.networkFee ?? 0n,
        fees.relayFee ?? 0n,
    ].reduce((sum, fee) => sum + fee, 0n);

    return totalWalletFee;
}

function getTotalStorageFee(fees: FeesFormProps) {
    const totalStorageFee = [
        fees.storageFee ?? 0n,
        fees.storageGasFee ?? 0n
    ].reduce((sum, fee) => sum + fee, 0n);

    return totalStorageFee;
}

export function requiredWalletBalance(fees: FeesFormProps, walletBalance?: bigint) {
    const topUp = parseEther(fees.topUpAmount?.toString() ?? '0');
    const totalWalletFee = getTotalWalletFee(fees) + topUp;
    if (walletBalance === undefined) {
        return { totalWalletFee, isWalletBalanceEnough: true };
    }

    return { totalWalletFee, isWalletBalanceEnough: walletBalance >= totalWalletFee }
}

export function requiredStorageBalance(fees: FeesFormProps, storageBalance?: bigint) {
    const totalStorageFee = getTotalStorageFee(fees);
    if (storageBalance === undefined) {
        return { totalStorageFee, isStorageBalanceEnough: true };
    }

    return { totalStorageFee, isStorageBalanceEnough: storageBalance >= totalStorageFee };
}

export function FeesForm(
    fees: FeesFormProps,
) {
    const {
        topUpAmount,

        // Wallet Expenses
        oracleFee,
        oracleFeeIsLoading,

        validatorFee,
        validatorFeeIsLoading,

        networkFee,
        networkFeeIsLoading,

        relayFee,
        relayFeeIsLoading,

        // Storage Expenses
        storageFee,
        storageFeeIsLoading,
        storageGasFee,
        storageGasFeeIsLoading,

        currentNetflowRatePerMonth,

        nextNetflowRatePerMonth,

        usdRate
    }: FeesFormProps = fees;

    const totalFeeIsLoading = oracleFeeIsLoading
        || validatorFeeIsLoading
        || networkFeeIsLoading
        || relayFeeIsLoading
        || storageFeeIsLoading
        || storageGasFeeIsLoading

    const isWalletFeeVisible = validatorFee !== undefined
        || oracleFee !== undefined
        || networkFee !== undefined
        || relayFee !== undefined;

    const isStorageSectionVisible = storageFee !== undefined
        || storageGasFee !== undefined
        || (currentNetflowRatePerMonth !== undefined && nextNetflowRatePerMonth !== undefined);

    const isAnyFeeVisible = isWalletFeeVisible
        || isStorageSectionVisible
    
    if (!isAnyFeeVisible) {
        return null;
    }

    const totalWalletFee = getTotalWalletFee(fees);
    const totalStorageFee = getTotalStorageFee(fees);
    const totalFee = totalWalletFee + totalStorageFee

    return (
        <Stack spacing={2}>
            {
                topUpAmount &&
                <AvoirPropertyBox
                    title={str(RStr.ConfirmTopUpForm_title)}>
                    <AvoirProperty
                        title={str(RStr.ConfirmTopUpForm_storage_account)}
                        value={formatNumberWithUsd(topUpAmount, usdRate, TBNB)}
                    />
                </AvoirPropertyBox>
            }

            {
                (isWalletFeeVisible || isStorageSectionVisible) && <Stack>
                    <AvoirPropertyBox title={str(RStr.Fees)}>
                        <Stack spacing={2}>
                            {isWalletFeeVisible && (
                                <Stack spacing={1}>

                                    <AvoirPropertyTitle title={str(RStr.FeesForm_MainWallet)}/>

                                    {isValueLoading(validatorFee, validatorFeeIsLoading) && (
                                        <AvoirProperty
                                            title={str(RStr.FeesForm_validatorFee)}
                                            value={formatValueWithUsdOrPlaceholder(validatorFee, usdRate, validatorFeeIsLoading)}
                                            isLoading={validatorFeeIsLoading}
                                        />
                                    )}
                                    {isValueLoading(oracleFee, oracleFeeIsLoading) && (
                                        <AvoirProperty
                                            title={str(RStr.FeesForm_oracleFee)}
                                            value={formatValueWithUsdOrPlaceholder(oracleFee, usdRate, oracleFeeIsLoading)}
                                            isLoading={oracleFeeIsLoading}
                                        />
                                    )}
                                    {isValueLoading(networkFee, networkFeeIsLoading) && (
                                        <AvoirProperty
                                            title={str(RStr.FeesForm_networkFee)}
                                            value={formatValueWithUsdOrPlaceholder(networkFee, usdRate, networkFeeIsLoading)}
                                            isLoading={networkFeeIsLoading}
                                        />
                                    )}
                                    {isValueLoading(relayFee, relayFeeIsLoading) && (
                                        <AvoirProperty
                                            title={str(RStr.FeesForm_relayFee)}
                                            value={formatValueWithUsdOrPlaceholder(relayFee, usdRate, relayFeeIsLoading)}
                                            isLoading={relayFeeIsLoading}
                                        />
                                    )}
                                </Stack>
                            )}

                            {isStorageSectionVisible && (
                                <Stack spacing={1}>
                                    <AvoirPropertyTitle title={str(RStr.FeesForm_StorageWallet)}/>

                                    {isValueLoading(storageFee, storageFeeIsLoading) && (
                                        <AvoirProperty
                                            title={str(RStr.FeesForm_settlePrepayFee)}
                                            value={formatValueWithUsdOrPlaceholder(storageFee, usdRate, storageFeeIsLoading, TBNB)}
                                            isLoading={storageFeeIsLoading}
                                        />
                                    )}

                                    {isValueLoading(storageGasFee, storageGasFeeIsLoading) && (
                                        <AvoirProperty
                                            title={str(RStr.FeesForm_gasFee)}
                                            value={formatValueWithUsdOrPlaceholder(storageGasFee, usdRate, storageGasFeeIsLoading, TBNB)}
                                            isLoading={storageGasFeeIsLoading}
                                        />
                                    )}
                                </Stack>
                            )}
                        </Stack>
                    </AvoirPropertyBox>

                    {
                        currentNetflowRatePerMonth && nextNetflowRatePerMonth &&
                        <Stack alignItems={"end"}>
                            <Typography variant="caption" color="text.secondary" sx={{mt: 1}}>
                                {str(RStr.FeesForm_storagePriceRate)
                                    .replace("{from}", `${formatBigIntWithUsd(currentNetflowRatePerMonth, usdRate)}`)
                                    .replace("{to}", `${formatBigIntWithUsd(nextNetflowRatePerMonth, usdRate)}`)}
                            </Typography>
                        </Stack>
                    }
                </Stack>
            }

            {isValueLoading(totalFee, totalFeeIsLoading) && (
                <Stack spacing={1}>
                    <AvoirPropertyBox>
                        <AvoirProperty
                            title={str(RStr.Total)}
                            value={formatValueWithUsdOrPlaceholder(totalFee, usdRate, totalFeeIsLoading)}
                            variant="main"
                            isLoading={totalFeeIsLoading}
                        />
                    </AvoirPropertyBox>
                </Stack>
            )}
        </Stack>
    )
}
