import {ContentContainer, PageContainer} from "@components/layouts/BaseContainers.tsx";
import {AvoirScreenTitle} from "@components/basic/AvoirScreenTitle.tsx";
import {AvoirTitledRoFiled} from "@components/inputs/AvoirTitledRoFiled.tsx";
import {FieldAction} from "@components/inputs/FieldAction.tsx";
import {Stack} from "@mui/material";
import {BalanceInfoFrom} from "@screens/forms/BalanceInfoFrom.tsx";
import {AvoirProperty, AvoirPropertyBox} from "@components/basic/AvoirProperty.tsx";
import {AvoirSectionBox, AvoirSectionTitle, AvoirSectionTitledBox} from "@components/basic/AvoirSection.tsx";
import {ContractsInfoForm} from "@screens/forms/ContractsInfoForm.tsx";
import {useGecko, useGreenfield} from "@di";
import {S, useAsyncEffect, useScreenState} from "@utils/state.ts";
import {useSafeAccount} from "@hooks/useSafeAccount.ts";
import {GreenfieldFeeClient} from "@data/greenfield/GreenfieldFeeClient.ts";
import {isValueLoading} from "@components/anim/AvoirSkeleton.tsx";
import {formatValueWithUsdOrPlaceholder, TBNB} from "@utils/format.ts";
import {AppRoute} from "@router";
import {RStr} from "@localization//ids.ts";
import {str} from "@localization/res.ts";
import {useGreenfieldAuth} from "@hooks/useGreenfieldAuth.ts";
import {formatQuota} from "@screens/dev/format/quote.ts";
import {AutoSnackbar, DefaultSnackbarError} from "@components/events/AutoSnackbar.tsx";
import {useState} from "react";
import {DevManageDrawerDialog} from "./DevManageDrawerDialog.tsx";

interface StorageAccountInfo {
    accountBalance?: bigint;
    accountBalanceIsLoading?: boolean;

    rateFlow?: bigint;
    rateFlowIsLoading?: boolean;

    prepaidFee?: bigint;
    prepaidFeeIsLoading?: boolean;

    storeFee?: bigint;
    storeFeeIsLoading?: boolean;

    quoteFee?: bigint;
    quoteFeeIsLoading?: boolean;

    totalSize?: bigint;
    totalSizeIsLoading?: boolean;

    quoteAvailable?: string,
    quoteAvailableIsLoading?: boolean,
    freeOneTime?: string,
    freeMonthly?: string,

    freePrecent?: number,
    mainPrecent?: number,
    remainPercent?: number;

    usdRate?: number;
}

export function DevAccountScreen() {
    const {devId, devAddress} = AppRoute.DevAccount.useParams();
    const {address} = useSafeAccount();
    const greenClient = useGreenfield()
    const gecko = useGecko()
    const auth = useGreenfieldAuth(address)

    // const [data, setData] = useState<StorageAccountInfo>({})
    const { data, setState, retry, retryCount } = useScreenState<StorageAccountInfo>({ initData: {} })
    const [error, setError] = useState<string | null>(null)
    const [isManageDrawerOpen, setIsManageDrawerOpen] = useState(false);

    useAsyncEffect(async () => {
        if (auth == null) {
            return
        }

        setState(
            S.data(
                {
                    accountBalanceIsLoading: true,
                    totalSizeIsLoading: true,
                    rateFlowIsLoading: true,
                    prepaidFeeIsLoading: true,
                    quoteFeeIsLoading: true,
                    storeFeeIsLoading: true,
                    quoteAvailableIsLoading: true,
                }
            )
        )

        try {
            const rate = await gecko.getBnbToUsd()
            const balance = await greenClient.accountBalance(devAddress)

            const totalSize = await greenClient.totalBucketSize(devId)

            const quoteFee = await greenClient.fee.getQuotaNetflowRate(
                GreenfieldFeeClient.GB_STORE_SIZE, GreenfieldFeeClient.MONTHLY_STORE_TIME
            )

            const storeFee = await greenClient.fee.getStoreNetflowRate(
                GreenfieldFeeClient.GB_STORE_SIZE, GreenfieldFeeClient.MONTHLY_STORE_TIME
            )

            const rateFlow = BigInt(balance.changeRate) * BigInt(GreenfieldFeeClient.MONTHLY_STORE_TIME)

            console.log(`quoteFee ${quoteFee} | storeFee ${storeFee} | rateFlow ${rateFlow}`)

            const quote = await greenClient.bucketReadQuote(auth, devId)
            const quoteData = formatQuota(quote);


            setState(
                S.data(
                    {
                        accountBalance: BigInt(balance.availableBalance),
                        accountBalanceIsLoading: false,

                        totalSize: totalSize,
                        totalSizeIsLoading: false,

                        rateFlow: rateFlow,
                        rateFlowIsLoading: false,

                        prepaidFee: BigInt(balance.lockedFee),
                        prepaidFeeIsLoading: false,

                        quoteFee: quoteFee,
                        quoteFeeIsLoading: false,

                        storeFee: storeFee,
                        storeFeeIsLoading: false,

                        remainPercent: quoteData.remainPercent,
                        freePrecent: quoteData.freeRemainPercent,
                        mainPrecent: quoteData.readRemainPercent,

                        freeMonthly: quoteData.monthlyFreeQuota > 0 ? quoteData.showMonthly : undefined,
                        freeOneTime: (quoteData.oneTimeFree > 0 && quoteData.oneTimeFreeRemain > 0) ? quoteData.showOneTime : undefined,

                        quoteAvailable: quoteData.show,
                        quoteAvailableIsLoading: false,

                        usdRate: rate
                    }
                )
            )
        } catch (e) {
            console.error(e)
            setError(DefaultSnackbarError)
        }
    }, [auth, retryCount])

    return (
        <PageContainer>
            <AvoirScreenTitle
                title={str(RStr.DevAccountScreen_title)}
                description={str(RStr.DevAccountScreen_description)}
            />

            <ContentContainer>
                <AutoSnackbar
                    message={error}
                    onClose={() => setError(null)}
                />

                <Stack
                    width={"100%"}
                    display={"flex"}
                    direction={{ md: "column", lg: "row" }}
                    justifyContent={"center"}
                    spacing={6}>

                    <Stack
                        flexGrow={1}
                        spacing={4}
                        maxWidth={"1024px"}>

                        <AvoirSectionTitledBox
                            contentOffset={2}
                            title={str(RStr.DevAccountScreen_accountInfo_title)}
                            description={str(RStr.DevAccountScreen_accountInfo_description)}
                        >
                            <Stack spacing={4}>
                                <AvoirTitledRoFiled
                                    label={str(RStr.DevAccountScreen_accountInfo_name_label)}
                                    value={devId}
                                    helperText={str(RStr.DevAccountScreen_accountInfo_name_helper)}/>

                                <AvoirTitledRoFiled
                                    label={str(RStr.DevAccountScreen_accountInfo_address_label)}
                                    value={devAddress}
                                    action={FieldAction.Copy}
                                    helperText={str(RStr.DevAccountScreen_accountInfo_address_helper)}/>
                            </Stack>
                        </AvoirSectionTitledBox>

                        <ContractsInfoForm
                            isLoading={false}/>
                    </Stack>

                    <Stack
                        spacing={4}
                        width={450}
                    >
                        <AvoirSectionBox variant={"side"}>
                            <AvoirSectionTitle
                                title={str(RStr.DevAccountScreen_storageAccount_title)}
                                infoLink={AppRoute.Article.route(AppRoute.Article.HowItWorks)}
                            />

                            <BalanceInfoFrom
                                balance={data?.accountBalance}
                                balanceIsLoading={data?.accountBalanceIsLoading}
                                usdRate={data?.usdRate}
                                prepaidFee={data?.prepaidFee}
                                totalSize={data?.totalSize}
                                totalSizeIsLoading={data?.totalSizeIsLoading}
                                prepaidFeeIsLoading={data?.prepaidFeeIsLoading}
                                flowRate={data?.rateFlow}
                                flowRateIsLoading={data?.rateFlowIsLoading}
                                freeOneTime={data?.freeOneTime}
                                freeMonthly={data?.freeMonthly}
                                quoteAvailable={data?.quoteAvailable}
                                quoteAvailableIsLoading={data?.quoteAvailableIsLoading}
                                remainPercent={data?.remainPercent}
                                mainPercent={data?.mainPrecent}
                                freePercent={data?.freePrecent}
                                onExtend={() => setIsManageDrawerOpen(true)}
                                onManage={() => setIsManageDrawerOpen(true)}
                            />
                        </AvoirSectionBox>

                        <AvoirSectionBox variant={"side"}>
                            <AvoirSectionTitle
                                title={str(RStr.DevAccountScreen_greenfieldRates_title)}
                                infoLink={AppRoute.Article.route(AppRoute.Article.BillingAndFees)}
                            />
                            <AvoirPropertyBox type={"big"}>
                                {isValueLoading(data?.storeFee, data?.storeFeeIsLoading) && (
                                    <AvoirProperty
                                        title={str(RStr.DevAccountScreen_greenfieldRates_storageRate)}
                                        value={formatValueWithUsdOrPlaceholder(data?.storeFee, data?.usdRate, data?.storeFeeIsLoading, TBNB)}
                                        isLoading={data?.storeFeeIsLoading}
                                    />
                                )}

                                {isValueLoading(data?.quoteFee, data?.quoteFeeIsLoading) && (
                                    <AvoirProperty
                                        title={str(RStr.DevAccountScreen_greenfieldRates_downloadRate)}
                                        value={formatValueWithUsdOrPlaceholder(data?.quoteFee, data?.usdRate, data?.quoteFeeIsLoading, TBNB)}
                                        isLoading={data?.quoteFeeIsLoading}
                                    />
                                )}
                            </AvoirPropertyBox>
                        </AvoirSectionBox>
                    </Stack>
                </Stack>

                {
                    isManageDrawerOpen &&
                    <DevManageDrawerDialog
                        open={isManageDrawerOpen}
                        onClose={() => setIsManageDrawerOpen(false)}
                        onSuccess={retry}
                    />
                }
            </ContentContainer>
        </PageContainer>
    )
}