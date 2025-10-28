import {EstimationHandlingError, EstimationResult, ScBaseService} from "@data/sc/ScBaseService.ts";
import {GfMsgType, GreenfieldFeeClient} from "@data/greenfield/GreenfieldFeeClient.ts";
import {useSafeAccount} from "@hooks/useSafeAccount.ts";
import {useGecko, useGreenfield} from "@di";
import {useGreenfieldAuth} from "@hooks/useGreenfieldAuth.ts";
import {useState} from "react";
import {FeesForm, FeesFormProps, requiredStorageBalance} from "@screens/forms/FeesForm.tsx";
import {useAsyncEffect} from "@utils/state.ts";
import {DefaultSnackbarError} from "@components/events/AutoSnackbar.tsx";
import {formatQuota} from "@screens/dev/format/quote.ts";
import {formatBigIntWithUsd, formatSize, TBNB, toBytes, toGb} from "@utils/format.ts";
import {appConfig} from "@config";
import {Stack} from "@mui/material";
import {BalancesForm} from "@screens/forms/ConfirmAccountForm.tsx";
import {NotEnoughAlert} from "@screens/release/NotEnoughAlert.tsx";
import {str} from "@localization/res.ts";
import {RStr} from "@localization/ids.ts";
import {ScGfCrosschainService} from "@data/sc/ScGfCrosschainService.ts";
import {Address} from "@data/CommonModels.ts";
import {absSubtract} from "@utils/decimal";

export enum AmountSummaryState {
    Pending,
    Loading,
    Warning,
    Error,
    Ready,
}

export class AmountSummaryHelper {
    static isProcessing(state: AmountSummaryState) {
        return state == AmountSummaryState.Pending || state == AmountSummaryState.Loading
    }
    static isLoading(state: AmountSummaryState) {
        return state == AmountSummaryState.Loading
    }

    static isReady(state: AmountSummaryState) {
        return state == AmountSummaryState.Ready || state == AmountSummaryState.Warning
    }

    static isError(state: AmountSummaryState) {
        return state == AmountSummaryState.Error
    }

    static isWarning(state: AmountSummaryState) {
        return state == AmountSummaryState.Warning
    }
}

export interface FeesModuleProps {
    devAddress?: Address;
    devId?: string;
    retryKey?: any;
    isReady?: boolean;

    onState?: (state: AmountSummaryState) => void
    onError?: (msg: string) => void
    onIncreaseQuota?: () => void
    estimation?: () => Promise<EstimationResult>

    storageMessages?: GfMsgType[],
    relayCalls?: number

    topUpStorageAmount?: number
    newQuoteGb?: number

    withValidation?: boolean;
    withOracle?: boolean;
    withBalance?: boolean;

    fileSize?: number
    quoteRequirement?: number
}

interface FeesModuleState {
    usdRate?: number;

    walletBalance?: bigint
    walletBalanceIsLoading?: boolean

    storageBalance?: bigint
    storageBalanceIsLoading?: boolean

    requiredStorageBalance?: string,
    isNotEnoughStorageBalance?: boolean,

    requiredQuote?: string,
    isNotEnoughQuote?: boolean,

    isNotEnoughWalletBalance?: boolean,
}

// TODO show old and new fees rate
export function AmountsSummaryForm(props: FeesModuleProps) {
    const {
        isReady = true,
        retryKey,
        devAddress,
        devId,

        onState,
        onError,
        onIncreaseQuota,

        estimation,
        storageMessages,
        relayCalls,

        topUpStorageAmount,
        newQuoteGb,

        withBalance = true,
        withValidation,
        withOracle,

        fileSize = 0,
        quoteRequirement = 0
    } = props

    const {address} = useSafeAccount()
    const greenfield = useGreenfield()
    const gecko = useGecko()
    // const auth = (fileSize > 0 || newQuoteGb != undefined) ? useGreenfieldAuth(address) : undefined
    const auth = useGreenfieldAuth(address)

    const [state, setState] = useState<FeesModuleState>({})
    const [fees, setFees] = useState<FeesFormProps>({})

    useAsyncEffect(async () => {
        setState(prevState => ({
            ...prevState,
            owner: address,
            storageBalanceIsLoading: true,
            walletBalanceIsLoading: true,
        }))

        try {
            const walletBalance = await ScBaseService.getBalance(address)
            const storageBalance = await greenfield.accountBalance(address)
            const rate = await gecko.getBnbToUsd()

            setState(prevState => ({
                ...prevState,
                usdRate: rate,

                walletBalance: walletBalance,
                storageBalance: BigInt(storageBalance.availableBalance),

                storageBalanceIsLoading: false,
                walletBalanceIsLoading: false,
            }))

            setFees(prevState => ({
                ...prevState,
                usdRate: rate,
            }))
        } catch (e: any) {
            console.error("[CreateReleaseScreen.initData]:", e.message)

            setState(prevState => ({
                ...prevState,
                storageBalanceIsLoading: false,
                walletBalanceIsLoading: false,
            }))

            onError?.(DefaultSnackbarError)
        }
    }, [])

    useAsyncEffect(async () => {
        if (!isReady) {
            return
        }

        if (auth == null) { // TODO make it optional for some requests
            return
        }

        const _objectSize = fileSize || 0
        if ((_objectSize > 0 || quoteRequirement > 0) && (!auth || !devId)) {
            onState?.(AmountSummaryState.Pending)
            return
        }

        if (newQuoteGb != undefined && (!auth || !devId || !devAddress)) {
            onState?.(AmountSummaryState.Pending)
            return
        }

        onState?.(AmountSummaryState.Loading)

        const _storageMessages = storageMessages?.length || 0
        const _topUpStorageAmount = topUpStorageAmount || 0
        const _relayCalls = relayCalls || 0
        const hasWorkWithStorage = newQuoteGb != undefined || _objectSize > 0 || _topUpStorageAmount > 0

        setFees(prevState => ({
            ...prevState,
            validatorFeeIsLoading: withValidation,
            oracleFeeIsLoading: withOracle,
            relayFeeIsLoading: _relayCalls > 0,
            storageGasFeeIsLoading: _storageMessages > 0,
            storageFeeIsLoading: hasWorkWithStorage,
            networkFeeIsLoading: !estimation,
        }))

        try {
            // Network Fee
            let networkFee = await estimation?.()

            // Settelement Fee
            let storageFee: bigint | undefined
            if (_topUpStorageAmount > 0 || _objectSize > 0 || newQuoteGb != undefined) {
                const settlementFee = await greenfield.fee.getSettlementFee(address);
                storageFee = settlementFee;
            }

            // Relay Fees & Storage Gas Fee
            let storageGasFee: bigint | undefined
            let totalRelayFee: bigint | undefined
            let totalRelayCalls = _relayCalls
            if (_storageMessages > 0 || _topUpStorageAmount > 0 || newQuoteGb != undefined) {
                const msgs = storageMessages ?? []

                if (topUpStorageAmount) {
                    totalRelayCalls += 1;
                }

                if (newQuoteGb != undefined) {
                    totalRelayCalls += 1;
                }

                storageGasFee = await greenfield.fee.getStorageGasFee(msgs)

                const { relayFee, minAckRelayFee } = await ScGfCrosschainService.relayFees();
                const fee = relayFee + minAckRelayFee // for execute message we don't need minAckRelayFee
                totalRelayFee = fee * BigInt(totalRelayCalls);
            }

            // Netflow Fee
            let currentNetflowPerMonth: bigint | undefined = undefined;
            let nextNetflowPerMonth: bigint | undefined = undefined;

            if (devAddress != null) {
                const balance = await greenfield.accountBalance(devAddress)
                currentNetflowPerMonth = BigInt(balance.changeRate) * BigInt(GreenfieldFeeClient.MONTHLY_STORE_TIME);

                if (newQuoteGb != undefined && auth && devId) {
                    const quoteData = formatQuota(await greenfield.bucketReadQuote(auth, devId))
                    const currentQuotaGb = toGb(quoteData.totalRead)

                    if (currentQuotaGb != newQuoteGb) {
                        const newQuoteRate = await greenfield.fee.getQuotaNetflowRate(
                            toBytes(newQuoteGb), GreenfieldFeeClient.MONTHLY_STORE_TIME
                        )
                        const currentQuoteRate = await greenfield.fee.getQuotaNetflowRate(
                            toBytes(currentQuotaGb), GreenfieldFeeClient.MONTHLY_STORE_TIME
                        )
                        nextNetflowPerMonth = absSubtract(currentNetflowPerMonth, newQuoteRate - currentQuoteRate)

                        // Settlement Fee Adjust
                        if (storageFee != undefined) {
                            const newPrepaidFeeWeekly = await greenfield.fee.getQuotaNetflowRate(
                                toBytes(newQuoteGb), GreenfieldFeeClient.WEEK_STORE_TIME
                            );
                            const currentPrepaidFeeWeekly = await greenfield.fee.getQuotaNetflowRate(
                                toBytes(currentQuotaGb), GreenfieldFeeClient.WEEK_STORE_TIME
                            );
                            const diffPrepaid = newPrepaidFeeWeekly - currentPrepaidFeeWeekly;
                            storageFee += diffPrepaid;
                        }
                    }
                }

                // File size
                if (_objectSize > 0 && auth && devId) {
                    const additionalStoreFee = await greenfield.fee.getStoreNetflowRate(
                        BigInt(_objectSize), GreenfieldFeeClient.MONTHLY_STORE_TIME
                    )

                    if (nextNetflowPerMonth) {
                        nextNetflowPerMonth += additionalStoreFee
                    } else {
                        nextNetflowPerMonth = currentNetflowPerMonth + additionalStoreFee
                    }
                }
            }

            setFees(prevState => ({
                ...prevState,
                topUpAmount: topUpStorageAmount,

                networkFee: networkFee?.result ?? undefined,
                networkFeeIsLoading: false,

                oracleFee: withOracle ? appConfig.prices.oracleAssetlink : undefined,
                oracleFeeIsLoading: false,

                validatorFee: withValidation ? appConfig.prices.validatorBuild : undefined,
                validatorFeeIsLoading: false,

                relayFee: totalRelayFee,
                relayFeeIsLoading: false,

                storageFee: storageFee,
                storageFeeIsLoading: false,

                storageGasFee: storageGasFee,
                storageGasFeeIsLoading: false,

                currentNetflowRatePerMonth: currentNetflowPerMonth,
                nextNetflowRatePerMonth: nextNetflowPerMonth,
            }))

            const isNotEnoughWalletBalance = networkFee?.error == EstimationHandlingError.OUT_OF_FUNDS
            setState(prevState => ({
                ...prevState,
                isNotEnoughWalletBalance: isNotEnoughWalletBalance,
            }))
        } catch (e) {
            console.error("[networkFee]:", e)
            setFees(prevState => ({
                ...prevState,
                networkFeeIsLoading: false,
                validatorFeeIsLoading: false,
                oracleFeeIsLoading: false,
                relayFeeIsLoading: false,
                storageGasFeeIsLoading: false,
                storageFeeIsLoading: false,
            }))

            onState?.(AmountSummaryState.Error)
            onError?.(DefaultSnackbarError)
            return
        }

        try {
            // Check storage balance
            const storageBalance = await greenfield.accountBalance(address)
            const availableBalance = BigInt(storageBalance.availableBalance)
            const {totalStorageFee, isStorageBalanceEnough} = requiredStorageBalance(fees, availableBalance)

            // Check Quotes
            let isEnoughQuote: boolean | undefined
            if (_objectSize > 0 && quoteRequirement > 0 && devId && auth) {
                const isEnough = await greenfield.isEnoughQuote(
                    quoteRequirement, devId, auth
                )
                isEnoughQuote = isEnough
            }

            setState(prevState => ({
                ...prevState,

                requiredStorageBalance: formatBigIntWithUsd(totalStorageFee, state.usdRate, TBNB),
                isNotEnoughStorageBalance: !isStorageBalanceEnough,

                requiredQuote: quoteRequirement ? formatSize(quoteRequirement) : undefined,
                isNotEnoughQuote: isEnoughQuote == false,
            }))

            const hasProblems = !isStorageBalanceEnough
                || isEnoughQuote == false
                || state.isNotEnoughWalletBalance == true

            if (hasProblems) {
                onState?.(AmountSummaryState.Warning)
            } else {
                onState?.(AmountSummaryState.Ready)
            }
        } catch (e: any) {
            setState(prevState => ({
                ...prevState,
                networkFeeIsLoading: false,
                validatorFeeIsLoading: false
            }))

            console.error("[CreateReleaseScreen.networkFee]:", e)

            onState?.(AmountSummaryState.Error)
            onError?.(DefaultSnackbarError)
        }
    }, [isReady, retryKey, auth, devId, fileSize, quoteRequirement, topUpStorageAmount, newQuoteGb, relayCalls, withValidation, withOracle])

    return (
        <Stack spacing={2}>
            {withBalance &&
                <BalancesForm
                    usdRate={state?.usdRate}

                    accountBalance={state?.storageBalance}
                    accountBalanceIsLoading={state?.storageBalanceIsLoading}

                    walletBalance={state?.walletBalance}
                    walletBalanceIsLoading={state?.walletBalanceIsLoading}
                />
            }

            <FeesForm
                {...fees}
            />

            {
                state.isNotEnoughWalletBalance &&
                <NotEnoughAlert
                    title={str(RStr.CreateReleaseScreen_wallet_warning)}
                />
            }

            {
                state.isNotEnoughStorageBalance &&
                <NotEnoughAlert
                    title={str(RStr.CreateReleaseScreen_storage_warning)}
                    required={state.requiredStorageBalance}
                    extendButton={str(RStr.TopUp)}
                    onExtend={onIncreaseQuota}
                />
            }

            {
                state.isNotEnoughQuote &&
                <NotEnoughAlert
                    title={str(RStr.CreateReleaseScreen_quota_warning)}
                    required={state.requiredQuote}
                    extendButton={str(RStr.CreateReleaseScreen_quota_increaseQuote)}
                    onExtend={onIncreaseQuota}
                />
            }
        </Stack>
    )
}
