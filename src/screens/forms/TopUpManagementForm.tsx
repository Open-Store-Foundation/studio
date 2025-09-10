import {Stack} from "@mui/material";
import {AvoirProperty, AvoirPropertyBox, AvoirPropertyTitle} from "@components/basic/AvoirProperty.tsx";
import {formatNumberToUsd, formatValueWithUsdOrPlaceholder, TBNB} from "@utils/format.ts";
import {ChangeEvent, useEffect, useState} from "react";
import {str} from "@localization/res.ts";
import {RStr} from "@localization/ids.ts";
import {AmountTextField} from "@components/inputs/AvoirCountedTextField.tsx";

interface TopUpManagementFormProps {
    topUpAmount?: number;
    onTopUpAmountChange: (amount: number) => void;

    walletBalance?: bigint;
    isWalletBalanceLoading: boolean;

    storageBalance?: bigint;
    isStorageBalanceLoading: boolean;

    usdRate?: number;
}

export function TopUpManagementForm(
    {
        topUpAmount,
        onTopUpAmountChange,

        walletBalance,
        isWalletBalanceLoading,

        storageBalance,
        isStorageBalanceLoading,

        usdRate
    }: TopUpManagementFormProps
) {
    const [inputValue, setInputValue] = useState<string>('');

    useEffect(() => {
        setInputValue(topUpAmount ? topUpAmount.toString() : '');
    }, [topUpAmount]);

    const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);

        if (value === undefined || value === '' || value === '.') {
            onTopUpAmountChange(0);
            return;
        }
        
        const numericValue = parseFloat(value);
        if (!isNaN(numericValue) && numericValue >= 0) {
            onTopUpAmountChange(numericValue);
        }
    };

    return (
        <AvoirPropertyBox title={str(RStr.TopUpManagementForm_title)}>
            <Stack spacing={3}>
                <Stack spacing={1}>
                    <AvoirPropertyTitle title={str(RStr.TopUpManagementForm_balances)}/>

                    <AvoirProperty
                        title={str(RStr.TopUpManagementForm_yourWalletBalance)}
                        isLoading={isWalletBalanceLoading}
                        value={formatValueWithUsdOrPlaceholder(walletBalance, usdRate, isWalletBalanceLoading)}
                    />

                    <AvoirProperty
                        title={str(RStr.TopUpManagementForm_storageAccountBalance)}
                        isLoading={isStorageBalanceLoading}
                        value={formatValueWithUsdOrPlaceholder(storageBalance, usdRate, isStorageBalanceLoading)}
                    />
                </Stack>

                <Stack spacing={1}>
                    <AvoirPropertyTitle title={str(RStr.TopUpManagementForm_amount)}/>

                    <AmountTextField
                        value={inputValue}
                        onChange={handleAmountChange}
                        placeholder="0"
                        currency={TBNB}
                        usdEquivalent={`${str(RStr.TopUpManagementForm_equivalent)}${formatNumberToUsd(topUpAmount, usdRate)}`}
                        grow
                    />
                </Stack>
            </Stack>
        </AvoirPropertyBox>
    );
}
