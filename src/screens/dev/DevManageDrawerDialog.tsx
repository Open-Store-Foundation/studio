import {useState} from "react";
import {Divider, Drawer, Stack} from "@mui/material";
import {ContentContainer, PageContainer, ScrollableContentContainer} from "@components/layouts/BaseContainers.tsx";
import {AvoirScreenTitleSmall} from "@components/basic/AvoirScreenTitle.tsx";
import {AvoirButtons, AvoirSecondaryButton} from "@components/inputs/AvoirButtons.tsx";
import {AmountsSummaryForm, AmountSummaryHelper, AmountSummaryState} from "@screens/forms/AmountsSummaryForm.tsx";
import {GreenfieldFeeClient} from "@data/greenfield/GreenfieldFeeClient.ts";
import {QuotaManagementForm} from "@screens/forms/QuotaManagementForm.tsx";
import {StorageProviderInfoForm} from "@screens/forms/StorageProviderInfoForm.tsx";
import {StorageAccountInfoForm} from "@screens/forms/StorageAccountInfoForm.tsx";
import {TopUpManagementForm} from "@screens/forms/TopUpManagementForm.tsx";
import {AutoSnackbar, DefaultSnackbarError} from "@components/events/AutoSnackbar.tsx";
import {useAsyncEffect} from "@utils/state.ts";
import {useGecko, useGreenfield} from "@di";
import {useDevIdParams} from "@hooks/useDevIdParams.ts";
import {useSafeAccount} from "@hooks/useSafeAccount";
import {str} from "@localization/res";
import {RStr} from "@localization/ids";
import {formatQuota} from "@screens/dev/format/quote.ts";
import {useGreenfieldAuth} from "@hooks/useGreenfieldAuth.ts";
import {formatSizeToGb, toBytes, toGb} from "@utils/format.ts";
import {EstimationResult, ScBaseService} from "@data/sc/ScBaseService.ts";
import {AvoirStepper} from "@components/basic/AvoirStepper.tsx";
import {ScDevService} from "@data/sc/ScDevService.ts";
import {Hex, parseEther} from "viem";
import {useObserveGreenfield} from "@hooks/useObserveGreenfield.ts";
import {sleep} from "@utils/sleep.ts";

interface DevManageDrawerDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

interface QuoteData {
    policyData?: Hex;

    spProvider?: string;
    freeMonthlyQuotaGb?: string;
    freeOneTimeQuotaGb?: string;

    currentQuotaGb?: number;
    isQuotaLoading?: boolean;

    storageBalance?: bigint;
    isStorageBalanceLoading?: boolean;

    walletBalance?: bigint;
    isWalletBalanceLoading?: boolean;

    monthlyQuotaFeePerGb?: bigint;
    monthlyQuotaFeePerGbIsLoading?: boolean;

    usdRate?: number;
}

class QuoteDataHelper {
    static isLoading(fees: QuoteData | undefined) {
        return !fees ||
            fees.isQuotaLoading ||
            fees.isStorageBalanceLoading ||
            fees.isWalletBalanceLoading ||
            fees.monthlyQuotaFeePerGbIsLoading;
    }
}

const steps = [
    "Management",
    "Summary",
];

interface DataStepProps {
    devId: string;
    address: string;
    data: QuoteData;
    selectedQuotaGb: number;
    topUpAmount: number;
    onQuotaChange: (quota: number) => void;
    onTopUpAmountChange: (amount: number) => void;
}

function DataStep({
    devId,
    address,
    data,
    selectedQuotaGb,
    topUpAmount,
    onQuotaChange,
    onTopUpAmountChange,
}: DataStepProps) {
    return (
        <Stack width="100%" spacing={3}>
            <StorageAccountInfoForm
                bucketName={devId}
                ownerAccount={address}
            />

            <StorageProviderInfoForm
                primarySp={data?.spProvider}
                freeMonthlyQuote={data?.freeMonthlyQuotaGb}
                freeOneTimeQuote={data?.freeOneTimeQuotaGb}
            />

            <Divider/>

            <QuotaManagementForm
                currentQuotaGb={data.currentQuotaGb}
                quoteDownloadPricePerGg={data.monthlyQuotaFeePerGb}

                selectedQuotaGb={selectedQuotaGb}
                onQuotaChange={onQuotaChange}

                usdRate={data.usdRate}
            />

            <TopUpManagementForm
                topUpAmount={topUpAmount}
                onTopUpAmountChange={onTopUpAmountChange}

                walletBalance={data.walletBalance}
                isWalletBalanceLoading={data.isWalletBalanceLoading ?? true}

                storageBalance={data.storageBalance}
                isStorageBalanceLoading={data.isStorageBalanceLoading ?? true}

                usdRate={data.usdRate}
            />
        </Stack>
    );
}

interface FeesStepProps {
    devId: string;
    selectedQuotaGb: number;
    topUpAmount: number;
    currentQuotaGb: number;
    onStateChange: (state: AmountSummaryState) => void;
    onError: (error: string) => void;
    estimate: () => Promise<EstimationResult>;
}

function FeesStep(
    {
        devId,
        selectedQuotaGb,
        topUpAmount,
        currentQuotaGb,
        onStateChange,
        onError,
        estimate
    }: FeesStepProps
) {
    const newQuoteGb = selectedQuotaGb !== currentQuotaGb ? selectedQuotaGb : undefined;

    return (
        <Stack width="100%" spacing={3}>
            <AmountsSummaryForm
                devId={devId}
                onState={onStateChange}
                onError={onError}
                topUpStorageAmount={topUpAmount > 0 ? topUpAmount : undefined}
                newQuoteGb={newQuoteGb}
                estimation={estimate}
                withBalance={false}

                storageMessages={undefined}
                onIncreaseQuota={undefined}
                retryKey={undefined}
                relayCalls={undefined}
                withValidation={undefined}
                withOracle={undefined}
                fileSize={undefined}
                quoteRequirement={undefined}
            />
        </Stack>
    );
}

export function DevManageDrawerDialog(
    {
        open,
        onClose,
        onSuccess,
    }: DevManageDrawerDialogProps
) {
    const {address} = useSafeAccount();
    const {devId, devAddress, isFetching} = useDevIdParams();

    const gecko = useGecko();
    const greenfield = useGreenfield();
    const auth = useGreenfieldAuth(address)

    const [activeStep, setActiveStep] = useState(0);
    const [topUpAmount, setTopUpAmount] = useState<number>(0);
    const [selectedQuotaGb, setSelectedQuotaGb] = useState<number>(0);

    const [data, setData] = useState<QuoteData>({});
    const [errorText, setError] = useState<string | null>(null);
    const [feeState, setFeeState] = useState<AmountSummaryState>(AmountSummaryState.Pending);

    const hasChanges = (data.currentQuotaGb != null && data.currentQuotaGb != selectedQuotaGb) || topUpAmount > 0;

    useAsyncEffect(async () => {
        if (auth == null || isFetching || activeStep != 0) {
            return
        }

        setData(prev => ({
            ...prev,
            isQuotaLoading: true,
            monthlyQuotaFeePerGbIsLoading: true,
            isStorageBalanceLoading: true,
            isWalletBalanceLoading: true,
        }))

        try {
            const rate = await gecko.getBnbToUsd();
            const quoteFee = await greenfield.fee.getQuotaNetflowRate(
                GreenfieldFeeClient.GB_STORE_SIZE, GreenfieldFeeClient.MONTHLY_STORE_TIME
            )
            const bnbBalance = await ScBaseService.getBalance(address);
            const balance = await greenfield.accountBalance(address)

            const provider = await greenfield.findPrimarySpProvider(devId)
            const quoteData = formatQuota(await greenfield.bucketReadQuote(auth, devId))
            const currentQuotaGb = toGb(quoteData.totalRead)

            const hasPermission = await greenfield.hasPolicy(devId, address)
            let policyData: Hex | undefined;
            if (!hasPermission) {
                policyData = await greenfield.createBucketPolicyData(devId, address)
            }

            setSelectedQuotaGb(currentQuotaGb);

            setData(prev => ({
                ...prev,
                policyData: policyData,
                spProvider: provider,

                freeMonthlyQuotaGb: formatSizeToGb(quoteData.monthlyFreeQuota),
                freeOneTimeQuotaGb: formatSizeToGb(quoteData.oneTimeFree),

                currentQuotaGb: currentQuotaGb,
                isQuotaLoading: false,

                monthlyQuotaFeePerGb: quoteFee,
                monthlyQuotaFeePerGbIsLoading: false,

                storageBalance: BigInt(balance.availableBalance),
                isStorageBalanceLoading: false,

                walletBalance: BigInt(bnbBalance),
                isWalletBalanceLoading: false,

                usdRate: rate,
            }))
        } catch (e: any) {
            console.error("[DevManageDrawerDialog.calculateFees]:", e.message);
            setError(DefaultSnackbarError);
        }
    }, [auth, isFetching]);

    const {isObservingBuild, startObserver} = useObserveQuote(devId, () => {
        onClose()
        onSuccess?.()
    })

    const handleNext = () => {
        if (!hasChanges) {
            return;
        }

        setActiveStep(1);
    };

    const handleBack = () => {
        setActiveStep(0);
    };

    const estimate = async () => {
        const amount = parseEther(topUpAmount.toString())
        const size = toBytes(selectedQuotaGb)
        return await ScDevService.estimateUpdateStorageAccount(devId, devAddress, data.policyData, amount, size)
    };

    const handleSave = async () => {
        try {
            const amount = parseEther(topUpAmount.toString())
            const size = toBytes(selectedQuotaGb)
            await ScDevService.updateStorageAccount(devId, devAddress, data.policyData, amount, size)

            startObserver()
        } catch (e) {
            console.error("[DevManageDrawerDialog.handleSave]:", e);
            setError(DefaultSnackbarError);
        }
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    height: "100%",
                    width: '700px',
                    display: 'flex',
                    flexDirection: 'column',
                }
            }}
        >
            <AutoSnackbar
                message={errorText}
                onClose={() => setError(null)}
            />

            <PageContainer>
                <ScrollableContentContainer>
                    <PageContainer>
                        <AvoirScreenTitleSmall
                            title={str(RStr.DevManageDrawerDialog_title)}
                        />

                        <ContentContainer>
                            <Stack width="100%" spacing={3}>
                                <AvoirStepper
                                    sx={{width: '70%', alignSelf: 'center'}}
                                    activeStep={activeStep}
                                    steps={steps}
                                />

                                {activeStep === 0 && (
                                    <DataStep
                                        devId={devId}
                                        address={address}
                                        data={data}
                                        selectedQuotaGb={selectedQuotaGb}
                                        topUpAmount={topUpAmount}
                                        onQuotaChange={setSelectedQuotaGb}
                                        onTopUpAmountChange={setTopUpAmount}
                                    />
                                )}

                                {activeStep === 1 && data.currentQuotaGb != null && (
                                    <FeesStep
                                        devId={devId}
                                        selectedQuotaGb={selectedQuotaGb}
                                        topUpAmount={topUpAmount}
                                        currentQuotaGb={data.currentQuotaGb}
                                        estimate={estimate}
                                        onStateChange={setFeeState}
                                        onError={setError}
                                    />
                                )}

                                <Stack
                                    width="100%"
                                    direction="row"
                                    justifyContent="end"
                                    spacing={2}
                                    py={3}
                                >
                                    {activeStep === 0 && (
                                        <>
                                            <AvoirSecondaryButton
                                                text={str(RStr.Cancel)}
                                                onClick={onClose}
                                            />

                                            <AvoirButtons
                                                text={str(RStr.Continue)}
                                                disabled={!hasChanges}
                                                loading={QuoteDataHelper.isLoading(data)}
                                                onClick={handleNext}
                                                withIcon={false}
                                            />
                                        </>
                                    )}

                                    {activeStep === 1 && (
                                        <>
                                            <AvoirSecondaryButton
                                                text={str(RStr.Back)}
                                                onClick={handleBack}
                                            />

                                            <AvoirButtons
                                                text={str(RStr.Save)}
                                                disabled={!hasChanges || !AmountSummaryHelper.isReady(feeState)}
                                                loading={AmountSummaryHelper.isProcessing(feeState) || isObservingBuild}
                                                onClick={handleSave}
                                                withIcon={false}
                                            />
                                        </>
                                    )}
                                </Stack>
                            </Stack>
                        </ContentContainer>
                    </PageContainer>
                </ScrollableContentContainer>
            </PageContainer>
        </Drawer>
    );
}

function useObserveQuote(devId: string | null, onSuccess: () => void) {
    const { isObservingBuild, startObserver } = useObserveGreenfield(
        async () => {
            await sleep(7_500)
            onSuccess()
            return true
        },
        [devId],
    )

    return { isObservingBuild, startObserver }
}
