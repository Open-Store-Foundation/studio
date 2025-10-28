import {appConfig} from "@config";
import {OpenStoreV0Abi} from "./abi/OpenStoreV0.ts";
import {ethers, toBeHex, ZeroAddress} from "ethers";
import {Address, ReqTypeId, TrackId} from "@data/CommonModels.ts";
import {ScBaseService, ScMulticallData} from "@data/sc/ScBaseService.ts";
import {encodeFunctionData} from "viem";
import {ScAppBuild, ScAssetService} from "@data/sc/ScAssetService.ts";

export const ScStoreServiceConfig = {
    address: appConfig.contracts.store,
    abi: OpenStoreV0Abi,
}

export class ScStoreService extends ScBaseService {

    static async getLastAppVersion(appAddress: Address) {
        const data = await this.reader.readContract({
            ...ScStoreServiceConfig,
            functionName: "getLastAppVersion",
            args: [appAddress, TrackId.Release],
        })

        return data as number
    }

    private static paramsAddBuildToChannel(account: Address, appAddress: Address, channelId: TrackId, buildVersion: number) {
        return {
            ...ScStoreServiceConfig,
            functionName: "addBuildToTrack",
            args: [account, appAddress, channelId, buildVersion],
            account: account
        }
    }

    static async estimateRelease(
        appAddress: Address,
        build: ScAppBuild,
        ownerVersion: number,
        channelId: TrackId,
        validate: boolean,
        isMirrored: boolean,
    ) {
        return this.estimateContract((account) => {
            return this.multicallRelease(account, appAddress, build, ownerVersion, channelId, validate, isMirrored)
        })
    }

    static async callRelease(
        appAddress: Address,
        build: ScAppBuild,
        ownerVersion: number,
        channelId: TrackId,
        validate: boolean,
        isMirrored: boolean,
    ) {
        return this.callContract((account) => {
            return this.multicallRelease(account, appAddress, build, ownerVersion, channelId, validate, isMirrored)
        })
    }

    static async multicallRelease(
        sender: Address,
        appAddress: Address,
        build: ScAppBuild,
        ownerVersion: number,
        channelId: TrackId,
        validate: boolean,
        isMirrored: boolean,
    ) {
        let calldatas: ScMulticallData[] = []
        let totalAmount = 0n

        if (!isMirrored) {
            const createBuildData = encodeFunctionData(
                ScAssetService.paramsMulticallAddBuilds(sender, appAddress, build)
            )

            calldatas.push(
                {
                    manager: appAddress,
                    plugin: appConfig.contracts.appBuildPlugin,
                    data: createBuildData,
                    value: 0n,
                }
            )
        }

        if (validate) {
            const addValidationData = encodeFunctionData(
                this.paramsMulticallAddValidationRequest(sender, appAddress, build.versionCode, ownerVersion, channelId)
            )

            calldatas.push(
                {
                    manager: ScStoreServiceConfig.address,
                    plugin: ZeroAddress as Address,
                    data: addValidationData,
                    value: appConfig.prices.validatorBuild,
                }
            )

            totalAmount += appConfig.prices.validatorBuild
        } else {
            const addTrackData = encodeFunctionData(
                this.paramsAddBuildToChannel(sender, appAddress, channelId, build.versionCode)
            )

            calldatas.push(
                {
                    manager: ScStoreServiceConfig.address,
                    plugin: ZeroAddress as Address,
                    data: addTrackData,
                    value: 0n,
                }
            )
        }

        const calldata = this.paramsMulticall(
            sender,
            calldatas,
            totalAmount,
        )

        return calldata
    }

    private static paramsMulticallAddValidationRequest(
        sender: Address,
        appAddress: Address,
        buildVersion: number,
        ownerVersion: number,
        channelId: TrackId,
    ) {
        const buildIdBytes = toBeHex(buildVersion, 256);
        const syncIdBytes = toBeHex(ownerVersion, 256);
        const channelInBytes = toBeHex(channelId, 256);

        const encoder = new ethers.AbiCoder()
        const data = encoder.encode(
            ["uint256", "uint256", "uint256"],
            [buildIdBytes, syncIdBytes, channelInBytes]
        );

        return {
            ...ScStoreServiceConfig,
            functionName: "addValidationRequest",
            args: [sender, ReqTypeId.AndroidBuild, appAddress, data],
            account: sender
        }
    }
}