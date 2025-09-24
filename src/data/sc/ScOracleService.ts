import {Address, AppOwnerInfo} from "@data/CommonModels.ts";
import {AssetlinksOracleAbi} from "./abi/AssetlinksOracle.ts";
import {appConfig} from "@config";
import {ZeroAddress} from "ethers";
import {ScBaseService, ScMulticallData} from "@data/sc/ScBaseService.ts";
import {ScAssetService} from "@data/sc/ScAssetService.ts";
import {encodeFunctionData} from "viem";
import {CacheKeys} from "@data/cache.ts";

export interface ScAppSyncState {
    id: number,
    type: ScOracleType,
    version: number,
    status?: ScOwnershipVerificationStatus,
}

export interface ScAppSyncData {
    version: number,
    pendingVersion: number,
    status?: ScOwnershipVerificationStatus,
}

export enum ScOwnershipVerificationStatus {
    Undefined = 0,
    Success = 1,
    ExceedRpcAttemptsErrors = 2,
    UrlFormatError = 3,
    WebsiteFormatError = 4,
    UnreachableLinkError = 5,
    AssetlinkFormatError = 6,
    ContentReadingError = 7,
    NoPackageError = 8,
    NoFingerprintError = 9,
}

export enum ScOracleType {
    Ownership = 0,
    OwnershipReview = 1,
}

export class ScOracleService extends ScBaseService {


    // /////////////////////
    // Save and Verify Owner
    // /////////////////////
    static async esimateSaveAndVarifyOwnerMulticall(oraclePrice: bigint, appAddress: Address, ownerInfo: AppOwnerInfo) {
        return this.estimateContract((account) => {
            return this.paramsSaveAndValidate(oraclePrice, account, appAddress, ownerInfo)
        })
    }

    static async saveAndVarifyOwnerMulticall(oraclePrice: bigint, appAddress: Address, ownerInfo: AppOwnerInfo) {
        return this.callContract((account) => {
            return this.paramsSaveAndValidate(oraclePrice, account, appAddress, ownerInfo)
        })
    }

    static paramsSaveAndValidate(oraclePrice: bigint, account: Address, appAddress: Address, ownerInfo: AppOwnerInfo) {
        const updateOwnerCalldata: ScMulticallData = {
            manager: appAddress,
            plugin: appConfig.contracts.appOwnerPlugin,
            data: encodeFunctionData(
                ScAssetService.paramsUpdateAppOwnerMulticall(account, appAddress, ownerInfo)
            ),
            value: BigInt(0),
        }

        const validateCalldata: ScMulticallData = {
            manager: appConfig.contracts.oracle,
            plugin: ZeroAddress as Address,
            data: encodeFunctionData(
                this.paramsValidateAppMulticall(account, appAddress)
            ),
            value: oraclePrice,
        }

        const calldata = this.paramsMulticall(
            account,
            [updateOwnerCalldata, validateCalldata],
            oraclePrice
        )

        return calldata
    }

    static paramsValidateAppMulticall(
        sender: Address,
        appAddress: Address,
    ) {
        return {
            abi: AssetlinksOracleAbi,
            address: appConfig.contracts.oracle,
            functionName: "enqueue",
            args: [sender, appAddress],
        }
    }

    // /////////////////////
    // Verify Owner
    // /////////////////////
    static async estimateVerifyOwner(oraclePrice: bigint, appAddress: Address) {
        return this.estimateContract((account) => {
            return this.paramsValidateApp(oraclePrice, account, appAddress)
        })
    }

    static async verifyOwner(oraclePrice: bigint, appAddress: Address) {
        return this.callContract((account) => {
            return this.paramsValidateApp(oraclePrice, account, appAddress)
        })
    }

    static paramsValidateApp(
        oraclePrice: bigint,
        address: Address,
        appAddress: Address,
    ) {
        return {
            abi: AssetlinksOracleAbi,
            address: appConfig.contracts.oracle,
            functionName: "enqueue",
            args: [appAddress],
            value: oraclePrice,
            account: address,
        }
    }

    // /////////////////////
    // READ-ONLY
    // /////////////////////
    static async lastVersionVerified(appAddress: Address)  {
        let data = await this.reader.readContract({
            abi: AssetlinksOracleAbi,
            address: appConfig.contracts.oracle,
            functionName: "getLastVerifiedAssetVersion",
            args: [appAddress],
        }) as number

        return data
    }

    static async getLastStates(appAddress: Address)  {
        const state = await this.getLastState(appAddress)

        let statuses: ScAppSyncState[] = [];

        if (state.pendingVersion > 0n) {
            statuses.push(
                {
                    id: 0,
                    type: ScOracleType.OwnershipReview,
                    version: state.pendingVersion,
                    status: undefined,
                }
            )
        }

        statuses.push(
            {
                id: 1,
                type: ScOracleType.Ownership,
                version: state.version,
                status: state.status,
            }
        )

        return statuses;
    }

    static clearLastState(appAddress: Address) {
        this.cache().delete(
            CacheKeys.OracleStatus.key(appAddress)
        )
    }

    static async getLastState(appAddress: Address) {
        let data: ScAppSyncData = await this.cache().getOrLoad(
            CacheKeys.OracleStatus.key(appAddress), CacheKeys.OracleStatus.ttl,
            async () =>  {
                let data = await this.reader.readContract({
                    abi: AssetlinksOracleAbi,
                    address: appConfig.contracts.oracle,
                    functionName: "getLastAssetStatus",
                    args: [appAddress],
                })
                return this.parseVerification(data)
            }
        )

        return data
    }

    static parseVerification(data: any): ScAppSyncData {
        const verificationStatus: number = Number(data?.[0]);
        const version: number = data?.[1];
        const pendingVersion: number = data?.[2];
        return { status: verificationStatus, version, pendingVersion }
    }

    // /////////////////////
    // Cache
    // /////////////////////
    static resetAllCache() {
        this.cache()
            .clean()
    }
}