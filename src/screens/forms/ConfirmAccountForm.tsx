import {AvoirProperty, AvoirPropertyBox} from "@components/basic/AvoirProperty.tsx";
import {shrinkAddress} from "@utils/account.ts";
import {Address} from "@data/CommonModels.ts";
import {str} from "@localization/res.ts";
import {RStr} from "@localization/ids.ts";
import {BNB, formatValueWithUsdOrPlaceholder, TBNB} from "@utils/format.ts";
import {isValueLoading} from "@components/anim/AvoirSkeleton.tsx";

interface ConfirmAccountFormProps {
    devName: string | null,
    appPackage?: string,
    owner?: Address,
    spProvider?: Address,
    devAddress?: Address,

    accountBalance?: bigint;
    accountBalanceIsLoading?: boolean;

    walletBalance?: bigint;
    walletBalanceIsLoading?: boolean;

    usdRate?: number;
}

export function ConfirmAccountForm(
    {
        devName,
        appPackage,
        owner,
        spProvider,
        devAddress,
        usdRate,
        accountBalance,
        accountBalanceIsLoading,
        walletBalance,
        walletBalanceIsLoading,
    }: ConfirmAccountFormProps
) {
    const isVisible = devName != null
        || appPackage != null
        || owner != null
        || devAddress != null
        || spProvider != null
        || accountBalance !== null
        || walletBalance !== null
        || walletBalanceIsLoading
        || accountBalanceIsLoading

    if (!isVisible) {
        return null;
    }

    return (
        <AvoirPropertyBox title={str(RStr.ConfirmAccountForm_title)}>
            {
                devName && <AvoirProperty
                    title={str(RStr.ConfirmAccountForm_developer_name)}
                    value={devName}
                />
            }
            {
                appPackage && <AvoirProperty
                    title={str(RStr.ConfirmAccountForm_app_name)}
                    value={appPackage}
                />
            }

            {
                owner && <AvoirProperty
                    title={str(RStr.ConfirmAccountForm_your_address)}
                    value={shrinkAddress(owner)}
                />
            }

            {
                devAddress && <AvoirProperty
                    title={str(RStr.ConfirmAccountForm_dev_address)}
                    value={shrinkAddress(devAddress)}
                />
            }

            {
                spProvider && <AvoirProperty
                    title={str(RStr.ConfirmAccountForm_spProvider_address)}
                    value={shrinkAddress(spProvider)}
                />
            }

            {isValueLoading(accountBalance, accountBalanceIsLoading) && (
                <AvoirProperty
                    title={str(RStr.ConfirmAccountForm_storage_balance)}
                    value={formatValueWithUsdOrPlaceholder(accountBalance, usdRate, accountBalanceIsLoading, TBNB)}
                    isLoading={accountBalanceIsLoading}
                />
            )}

            {isValueLoading(walletBalance, walletBalanceIsLoading) && (
                <AvoirProperty
                    title={str(RStr.ConfirmAccountForm_storage_balance)}
                    value={formatValueWithUsdOrPlaceholder(accountBalance, usdRate, walletBalanceIsLoading, TBNB)}
                    isLoading={accountBalanceIsLoading}
                />
            )}
        </AvoirPropertyBox>
    );
}


export interface BalancesFormProps {
    accountBalance?: bigint;
    accountBalanceIsLoading?: boolean;

    walletBalance?: bigint;
    walletBalanceIsLoading?: boolean;

    usdRate?: number;
}

export function BalancesForm(
    {
        usdRate,
        accountBalance,
        accountBalanceIsLoading,
        walletBalance,
        walletBalanceIsLoading,
    }: BalancesFormProps
) {
    const isVisible = accountBalance !== undefined
        || walletBalance !== undefined
        || walletBalanceIsLoading
        || accountBalanceIsLoading

    if (!isVisible) {
        return null;
    }

    return (
        <AvoirPropertyBox title={"Balances"}>
            {isValueLoading(accountBalance, accountBalanceIsLoading) && (
                <AvoirProperty
                    title={str(RStr.ConfirmAccountForm_storage_balance)}
                    value={formatValueWithUsdOrPlaceholder(accountBalance, usdRate, accountBalanceIsLoading, TBNB)}
                    isLoading={accountBalanceIsLoading}
                />
            )}

            {isValueLoading(walletBalance, walletBalanceIsLoading) && (
                <AvoirProperty
                    title={str(RStr.ConfirmAccountForm_wallet_balance)}
                    value={formatValueWithUsdOrPlaceholder(walletBalance, usdRate, walletBalanceIsLoading, BNB)}
                    isLoading={walletBalanceIsLoading}
                />
            )}
        </AvoirPropertyBox>
    );
}