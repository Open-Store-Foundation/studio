import Long from "long";
import {toHex} from "viem/utils";
import { ResourceType } from "./generated/greenfield/resource";
import { MsgUpdateBucketInfo } from "./generated/greenfield/storage";

export type ECDSA = {
    type: 'ECDSA';
    privateKey: string;
};

/**
 * EDDSA Signature
 */
export type EDDSA = {
    type: 'EDDSA';
    seed: string;
    domain: string;
    address: string;
};
export type AuthType = ECDSA | EDDSA;

export interface IGRN {
    resType: ResourceType;
    groupOwner: string;
    /**
     * can be bucketName, bucketName/objectName, groupName
     */
    name: string;
}

const BucketTypeAbbr = 'b';
const ObjectTypeAbbr = 'o';
const GroupTypeAbbr = 'g';

export const newBucketGRN = (bucketName: string): IGRN => {
    return {
        resType: ResourceType.RESOURCE_TYPE_BUCKET,
        groupOwner: '',
        name: bucketName,
    };
};

export const GRNToString = (grn: IGRN) => {
    let res = '';

    switch (grn.resType) {
        case ResourceType.RESOURCE_TYPE_BUCKET:
            res = `grn:${BucketTypeAbbr}::${grn.name}`;
            break;
        case ResourceType.RESOURCE_TYPE_OBJECT:
            res = `grn:${ObjectTypeAbbr}::${grn.name}`;
            break;
        case ResourceType.RESOURCE_TYPE_GROUP:
            res = `grn:${GroupTypeAbbr}:${grn.groupOwner}:${grn.name}`;
            break;
        default:
            return '';
    }

    return res.trim();
};

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

/** Stream Payment Record of a stream account */
export interface StreamRecord {
    /** account address */
    account: string;
    /** latest update timestamp of the stream record */
    crudTimestamp: Long;
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
    settleTimestamp: Long;
    /** the count of its out flows */
    outFlowCount: Long;
    /** the frozen netflow rate, which is used when resuming stream account */
    frozenNetflowRate: string;
}

export interface QueryDynamicBalanceResponse {
    /** dynamic balance is static balance + flowDelta */
    dynamicBalance: string;
    /** the stream record of the given account, if it does not exist, it will be default values */
    streamRecord: StreamRecord;
    /** the timestamp of the current block */
    currentTimestamp: Long;
    /** bank_balance is the BNB balance of the bank module */
    bankBalance: string;
    /** available_balance is bank balance + static balance */
    availableBalance: string;
    /** locked_fee is buffer balance + locked balance */
    lockedFee: string;
    /** change_rate is the netflow rate of the given account */
    changeRate: string;
}

export interface PaymentBalance {
    /** dynamic balance is static balance + flowDelta */
    dynamicBalance: string;
    /** bank_balance is the BNB balance of the bank module */
    bankBalance: string;
    /** available_balance is bank balance + static balance */
    availableBalance: string;
    /** locked_fee is buffer balance + locked balance */
    lockedFee: string;
    /** change_rate is the netflow rate of the given account */
    changeRate: string;
}

export interface IQuotaProps {
    readQuota: number;
    freeQuota: number;
    consumedQuota: number;
    freeConsumedSize: number;
    monthlyFreeQuota: number;
    monthlyQuotaConsumedSize: number;
}

 type ExecuteParams = [number, string];

export class ExecutorMsg {
    static getUpdateBucketInfoParams = (msg: MsgUpdateBucketInfo): ExecuteParams => [
        7,
        toHex(MsgUpdateBucketInfo.encode(msg).finish()),
    ];
}
