import {dec} from "@utils/decimal.ts";
import {getTimestampInSeconds} from "@utils/date.ts";
import Decimal from "decimal.js";
import {TimedCache} from "@utils/cache.ts";
import {Address} from "viem";
import {GasProvider} from "@data/sc/GasProvider.ts";
import {GreenfieldHttpClient} from "./GreenfieldHttpClient.ts";
import {Long} from "@bnb-chain/greenfield-cosmos-types/helpers";

export type StoreFeeParams = {
    readPrice: Decimal;
    primarySpStorePrice: Decimal;
    secondarySpStorePrice: Decimal;
    validatorTaxRate: string;
    minChargeSize: bigint;
    redundantDataChunkNum: number;
    redundantParityChunkNum: number;
    reserveTime: string;
};

/////////////////////////////////////////////

export interface QueryGetStreamRecordResponse {
    streamRecord: StreamRecord;
}

export interface StreamRecordResult {
    netflowRate: Decimal;
    latestStaticBalance: Decimal;
    lockFee: Decimal;
    crudTimestamp: number;
}

export interface StreamRecord {
    /** account address */
    account: string;
    /** latest update timestamp of the stream record */
    crudTimestamp: bigint;
    /**
     * The per-second rate that an account's balance is changing.
     * It is the sum of the account's inbound and outbound flow rates.
     */
    netflowRate: string;
    /** The balance of the stream account at the latest CRUD timestamp. */
    staticBalance: string;
    /**
     * reserved balance of the stream account
     * If the netflow rate is negative, the reserved balance is `netflow_rate * reserve_time`
     */
    bufferBalance: string;
    /** the locked balance of the stream account after it puts a new object and before the object is sealed */
    lockBalance: string;
    /** the status of the stream account */
    status: StreamAccountStatus;
    /** the unix timestamp when the stream account will be settled */
    settleTimestamp: bigint;
    /** the count of its out flows */
    outFlowCount: bigint;
    /** the frozen netflow rate, which is used when resuming stream account */
    frozenNetflowRate: string;
}

export declare enum StreamAccountStatus {
    /** STREAM_ACCOUNT_STATUS_ACTIVE - STREAM_ACCOUNT_STATUS_ACTIVE defines the active status of a stream account. */
    STREAM_ACCOUNT_STATUS_ACTIVE = 0,
    /**
     * STREAM_ACCOUNT_STATUS_FROZEN - STREAM_ACCOUNT_STATUS_FROZEN defines the frozen status of a stream account.
     * A frozen stream account cannot be used as payment address for buckets.
     * It can be unfrozen by depositing more BNB to the stream account.
     */
    STREAM_ACCOUNT_STATUS_FROZEN = 1,
    UNRECOGNIZED = -1
}

/////////////////////////////////////////////
export interface PaymentQueryParamsResponse {
    /** params holds all the parameters of this module. */
    params: PaymentParams;
}

export interface PaymentVersionedParams {
    /** Time duration which the buffer balance need to be reserved for NetOutFlow e.g. 6 month */
    reserveTime: bigint;
    /** The tax rate to pay for validators in storage payment. The default value is 1%(0.01) */
    validatorTaxRate: string;
}

export interface PaymentParams {
    versionedParams: PaymentVersionedParams;
    /** The maximum number of payment accounts that can be created by one user */
    paymentAccountCountLimit: bigint;
    /**
     * Time duration threshold of forced settlement.
     * If dynamic balance is less than NetOutFlowRate * forcedSettleTime, the account can be forced settled.
     */
    forcedSettleTime: bigint;
    /** the maximum number of flows that will be auto forced settled in one block */
    maxAutoSettleFlowCount: bigint;
    /** the maximum number of flows that will be auto resumed in one block */
    maxAutoResumeFlowCount: bigint;
    /** The denom of fee charged in payment module */
    feeDenom: string;
    /** The withdrawal amount threshold to trigger time lock */
    withdrawTimeLockThreshold: string;
    /** The duration of the time lock for a big amount withdrawal */
    withdrawTimeLockDuration: bigint;
}
/////////////////////////////////////////////

export interface StorageQueryParamsResponse {
    /** params holds all the parameters of this module. */
    params: StorageParams;
}

export interface StorageVersionedParams {
    /** max_segment_size is the maximum size of a segment. default: 16M */
    maxSegmentSize: bigint;
    /** redundant_data_check_num is the num of data chunks of EC redundancy algorithm */
    redundantDataChunkNum: number;
    /** redundant_data_check_num is the num of parity chunks of EC redundancy algorithm */
    redundantParityChunkNum: number;
    /** min_charge_size is the minimum charge size of the payload, objects smaller than this size will be charged as this size */
    minChargeSize: bigint;
}

export interface StorageParams {
    versionedParams: StorageVersionedParams;
    /** max_payload_size is the maximum size of the payload, default: 2G */
    maxPayloadSize: bigint;
    /** relayer fee for the mirror bucket tx to bsc */
    bscMirrorBucketRelayerFee: string;
    /** relayer fee for the ACK or FAIL_ACK package of the mirror bucket tx to bsc */
    bscMirrorBucketAckRelayerFee: string;
    /** relayer fee for the mirror object tx to bsc */
    bscMirrorObjectRelayerFee: string;
    /** Relayer fee for the ACK or FAIL_ACK package of the mirror object tx to bsc */
    bscMirrorObjectAckRelayerFee: string;
    /** relayer fee for the mirror object tx to bsc */
    bscMirrorGroupRelayerFee: string;
    /** Relayer fee for the ACK or FAIL_ACK package of the mirror object tx to bsc */
    bscMirrorGroupAckRelayerFee: string;
    /** The maximum number of buckets that can be created per account */
    maxBucketsPerAccount: number;
    /** The window to count the discontinued objects or buckets */
    discontinueCountingWindow: bigint;
    /** The max objects can be requested in a window */
    discontinueObjectMax: bigint;
    /** The max buckets can be requested in a window */
    discontinueBucketMax: bigint;
    /** The object will be deleted after the confirm period in seconds */
    discontinueConfirmPeriod: bigint;
    /** The max delete objects in each end block */
    discontinueDeletionMax: bigint;
    /** The max number for deleting policy in each end block */
    stalePolicyCleanupMax: bigint;
    /** The min interval for making quota smaller in seconds */
    minQuotaUpdateInterval: bigint;
    /** the max number of local virtual group per bucket */
    maxLocalVirtualGroupNumPerBucket: number;
    /** relayer fee for the mirror bucket tx to op chain */
    opMirrorBucketRelayerFee: string;
    /** relayer fee for the ACK or FAIL_ACK package of the mirror bucket tx to op chain */
    opMirrorBucketAckRelayerFee: string;
    /** relayer fee for the mirror object tx to op chain */
    opMirrorObjectRelayerFee: string;
    /** Relayer fee for the ACK or FAIL_ACK package of the mirror object tx to op chain */
    opMirrorObjectAckRelayerFee: string;
    /** relayer fee for the mirror object tx to op chain */
    opMirrorGroupRelayerFee: string;
    /** Relayer fee for the ACK or FAIL_ACK package of the mirror object tx to op chain */
    opMirrorGroupAckRelayerFee: string;
}

/////////////////////////////////////////////

export interface QueryGlobalSpStorePriceByTimeResponse {
    globalSpStorePrice: GlobalSpStorePrice;
}

export interface GlobalSpStorePrice {
    /** update time, unix timestamp in seconds */
    updateTimeSec: bigint;
    /** read price, in bnb wei per charge byte */
    readPrice: string;
    /** primary store price, in bnb wei per charge byte */
    primaryStorePrice: string;
    /** secondary store price, in bnb wei per charge byte */
    secondaryStorePrice: string;
}

/////////////////////////////////////////////

export interface QueryMsgGasParamsResponse {
    msgGasParams: MsgGasParams[];
}

export interface MsgGasParams {
    msgTypeUrl: string;
    /** fixed_type specifies fixed type gas params. */
    fixedType?: MsgGasParams_FixedGasParams;
}

export interface MsgGasParams_FixedGasParams {
    /** fixed_gas is the gas cost for a fixed type msg */
    fixedGas: Long;
}

export enum GfMsgType {
    CREATE_OBJECT = '/greenfield.storage.MsgCreateObject',
    DELETE_OBJECT = '/greenfield.storage.MsgDeleteObject',
}

export const MSG_TYPES = Object.values(GfMsgType);

export class GreenfieldFeeClient {

    static GB_STORE_SIZE = 1024n * 1024n * 1024n; // 1 GB
    static MONTHLY_STORE_TIME = 30 * 24 * 60 * 60; // 1 month
    static WEEK_STORE_TIME = 7 * 24 * 60 * 60; // 1 week

    static GAS_FEES_TTL = 1000 * 60 * 60 * 24;
    static GAS_FEES_KEY = 'GF_FEE_GAS_FEES'

    static STREAM_TTL = 1000 * 60 * 60 * 24;
    static STREAM_KEY = 'GF_FEE_STREAM_RECORD'

    static PARAMS_TTL = 1000 * 30;
    static PARAMS_KEY = 'GF_FEE_PARAMS'

    private cache: TimedCache;
    private client: GreenfieldHttpClient;
    private gasProvider: GasProvider;

    constructor(client: GreenfieldHttpClient, gasProvider: GasProvider, cache: TimedCache) {
        this.gasProvider = gasProvider;
        this.cache = cache;
        this.client = client;
    }

    async getStorageGasFee(types: GfMsgType[]) {
        let result = 0n;
        const fees = await this.getGasFeesCache();
        const gasPrice = await this.gasProvider.getGasPrice();

        for (const type of types) {
            result += fees.get(type) ?? 0n;
        }

        console.log("getStorageGasFee", result, gasPrice)
        return result * gasPrice;
    }

    async getSettlementFee(account: Address) {
        const streamRecord = await this.getStreamRecordCache(account);
        const storedTime = getTimestampInSeconds() - Number(streamRecord.crudTimestamp); // TODO v2 timezone

        const amount = dec(streamRecord.netflowRate)
            .times(storedTime)
            .abs()
            .ceil();

        return BigInt(amount.toFixed())
    }

    async getQuotaNetflowRate(size: bigint, sec: number = 1) {
        const storeFeeParams = await this.getStoreFeeParamsCache();
        const {validatorTaxRate, readPrice} = storeFeeParams;
        const primaryQuotaRate = dec(readPrice).times(Number(size));
        const taxRate = dec(validatorTaxRate).times(primaryQuotaRate);

        const result = primaryQuotaRate.plus(taxRate)
            .times(sec)
            .ceil()

        return BigInt(result.toFixed())
    }

    async getStoreNetflowRate(
        size: bigint,
        sec: number = 1,
        isChargeSize = true,
    ) {
        const {
            primarySpStorePrice,
            secondarySpStorePrice,
            redundantDataChunkNum,
            redundantParityChunkNum,
            minChargeSize,
            validatorTaxRate,
        } = await this.getStoreFeeParamsCache();

        const chargeSize = isChargeSize ? size : size >= minChargeSize ? size : minChargeSize;

        const primarySpRate = dec(primarySpStorePrice)
            .times(Number(chargeSize));

        const secondarySpNum = redundantDataChunkNum + redundantParityChunkNum;
        let secondarySpRate = dec(secondarySpStorePrice)
            .times(Number(chargeSize))
            .times(secondarySpNum);

        const validatorTax = dec(validatorTaxRate)
            .times(primarySpRate.plus(secondarySpRate));

        const netflowRate = primarySpRate
            .plus(secondarySpRate)
            .plus(validatorTax)
            .times(sec)
            .ceil();

        return BigInt(netflowRate.toFixed());
    }

    private async getStreamRecord(address: string): Promise<StreamRecordResult> {
        const {streamRecord} = await this.client.payment.getStreamRecord(address)
            .catch(() => {
                return {streamRecord: {}} as {
                    streamRecord: {
                        netflowRate: string,
                        staticBalance: string,
                        bufferBalance: string,
                        lockBalance: string,
                        crudTimestamp: bigint
                    };
                };
            });

        const ts = getTimestampInSeconds();

        const {
            netflowRate = '0',
            staticBalance = '0',
            bufferBalance = '0',
            lockBalance = '0',
            crudTimestamp = BigInt(ts),
        } = streamRecord!;

        const _netflowRate = dec(netflowRate);
        const _staticBalance = dec(staticBalance);
        const _crudTimestamp = Number(crudTimestamp);
        const _bufferBalance = dec(bufferBalance);
        const _lockBalance = dec(lockBalance);

        const netflow = _netflowRate

        const latestStaticBalance = _staticBalance
            .plus(_netflowRate.times(ts - _crudTimestamp))

        const lockFee = _lockBalance.plus(_bufferBalance)
            .plus(Decimal.min(0, latestStaticBalance))

        return {
            netflowRate: netflow,
            latestStaticBalance: latestStaticBalance,
            lockFee: lockFee,
            crudTimestamp: _crudTimestamp,
        };
    }

    private async getGasFeePrices() {
        const fees = await this.client.gashub.getMsgGasParams(
            {msgTypeUrls: MSG_TYPES}
        );

        const types = new Map(fees.msgGasParams.map(
            obj => {
                return [obj.msgTypeUrl, BigInt(obj.fixedType?.fixedGas?.toString() || "0")]
            }
        ));

        return types;
    }

    private async getStoreFeeParams(): Promise<StoreFeeParams> {
        const now = getTimestampInSeconds();
        const [globalSpStoragePrice, {params: storageParams}, {params: paymentParams}] =
            await Promise.all([
                this.client.sp.getQueryGlobalSpStorePriceByTime({timestamp: BigInt(now)}),
                this.client.storage.params(),
                this.client.payment.params(),
            ]);

        const {
            minChargeSize = 0n,
            redundantDataChunkNum = 0,
            redundantParityChunkNum = 0,
        } = (storageParams && storageParams.versionedParams) || {};

        const {reserveTime, validatorTaxRate} = paymentParams?.versionedParams || {};

        const primarySp = dec(globalSpStoragePrice?.globalSpStorePrice.primaryStorePrice || '0' );
        const secondarySp = dec(globalSpStoragePrice?.globalSpStorePrice.secondaryStorePrice || '0' );
        const readPrice = dec(globalSpStoragePrice?.globalSpStorePrice.readPrice || '0');

        return {
            primarySpStorePrice: primarySp,
            secondarySpStorePrice: secondarySp,
            readPrice: readPrice,
            validatorTaxRate: validatorTaxRate || '',
            minChargeSize: minChargeSize,
            reserveTime: reserveTime?.toString() || '',
            redundantDataChunkNum,
            redundantParityChunkNum,
        };
    }

    private async getGasFeesCache() {
        return await this.cache.getOrLoad<Map<string, bigint>>(
            GreenfieldFeeClient.GAS_FEES_KEY,
            GreenfieldFeeClient.GAS_FEES_TTL,
            async () => await this.getGasFeePrices()
        );
    }

    private async getStreamRecordCache(address: Address) {
        return await this.cache.getOrLoad<StreamRecordResult>(
            `${GreenfieldFeeClient.STREAM_KEY}-${address}`,
            GreenfieldFeeClient.STREAM_TTL,
            async () => await this.getStreamRecord(address)
        )
    }

    private async getStoreFeeParamsCache() {
        return await this.cache.getOrLoad<StoreFeeParams>(
            GreenfieldFeeClient.PARAMS_KEY,
            GreenfieldFeeClient.PARAMS_TTL,
            async () => await this.getStoreFeeParams()
        )
    }
}

// Response Examples:
//
// /payment/params
// {
//     "params": {
//     "versioned_params": {
//         "reserve_time": "604800",
//         "validator_tax_rate": "0.010000000000000000"
//     },
//     "payment_account_count_limit": "200",
//         "forced_settle_time": "43200",
//         "max_auto_settle_flow_count": "100",
//         "max_auto_resume_flow_count": "100",
//         "fee_denom": "BNB",
//         "withdraw_time_lock_threshold": "100000000000000000000",
//         "withdraw_time_lock_duration": "86400"
// }
// }

// /payment/stream_record/0x7eeE0E672244f9f199C4d5B644D4351d14ee7D41 - my address
// {
//     "stream_record": {
//     "account": "0x7eeE0E672244f9f199C4d5B644D4351d14ee7D41",
//         "crud_timestamp": "1742314208",
//         "netflow_rate": "-1252935057",
//         "static_balance": "0",
//         "buffer_balance": "757775122473600",
//         "lock_balance": "0",
//         "status": "STREAM_ACCOUNT_STATUS_ACTIVE",
//         "settle_timestamp": "1742875808",
//         "out_flow_count": "7",
//         "frozen_netflow_rate": "0"
// }
// }

// /sp/params
// {
//     "params": {
//     "deposit_denom": "BNB",
//         "min_deposit": "500000000000000000000",
//         "secondary_sp_store_price_ratio": "0.120000000000000000",
//         "num_of_historical_blocks_for_maintenance_records": "864000",
//         "maintenance_duration_quota": "21600",
//         "num_of_lockup_blocks_for_maintenance": "21600",
//         "update_global_price_interval": "0",
//         "update_price_disallowed_days": 2
// }
// }

// /sp/sp_storage_price/0x5FFf5A6c94b182fB965B40C7B9F30199b969eD2f - sp address
// {
//     "sp_storage_price": {
//     "sp_id": 7,
//         "update_time_sec": "1711434666",
//         "read_price": "0.056732612980000000",
//         "free_read_quota": "1073741824",
//         "store_price": "0.008429264202000000"
// }
// }

// /sp/global_sp_store_price_by_time/1743081768
// {
//     "global_sp_store_price": {
//     "update_time_sec": "1740787201",
//         "read_price": "0.073279625095000000",
//         "primary_store_price": "0.010887799596000000",
//         "secondary_store_price": "0.001306535951520000"
// }
// }


// /greenfield/storage/params
// {
//     "params": {
//     "versioned_params": {
//         "max_segment_size": "16777216",
//             "redundant_data_chunk_num": 4,
//             "redundant_parity_chunk_num": 2,
//             "min_charge_size": "131072"
//     },
//     "max_payload_size": "34359738368",
//     "bsc_mirror_bucket_relayer_fee": "400000000000000",
//     "bsc_mirror_bucket_ack_relayer_fee": "6000000000000",
//     "bsc_mirror_object_relayer_fee": "400000000000000",
//     "bsc_mirror_object_ack_relayer_fee": "6000000000000",
//     "bsc_mirror_group_relayer_fee": "400000000000000",
//     "bsc_mirror_group_ack_relayer_fee": "6000000000000",
//     "max_buckets_per_account": 100,
//     "discontinue_counting_window": "10000",
//     "discontinue_object_max": "18446744073709551615",
//         "discontinue_bucket_max": "18446744073709551615",
//         "discontinue_confirm_period": "604800",
//         "discontinue_deletion_max": "100",
//         "stale_policy_cleanup_max": "200",
//         "min_quota_update_interval": "2592000",
//         "max_local_virtual_group_num_per_bucket": 10,
//         "op_mirror_bucket_relayer_fee": "13000000000000",
//         "op_mirror_bucket_ack_relayer_fee": "6000000000000",
//         "op_mirror_object_relayer_fee": "13000000000000",
//         "op_mirror_object_ack_relayer_fee": "6000000000000",
//         "op_mirror_group_relayer_fee": "13000000000000",
//         "op_mirror_group_ack_relayer_fee": "6000000000000"
// }
// }