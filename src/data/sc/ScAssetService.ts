import {AppOwnerPluginV1Abi} from "./abi/AppOwnerPluginV1.ts";
import {decodeEventLog, encodeFunctionData, fromHex, Hex, Log, parseAbiItem, toHex} from "viem";
import {AppBuildsPluginV1Abi} from "./abi/AppBuildsPluginV1.ts";
import {Address, AndroidTypeId, AppOwnerInfo, CategoryId, PlatformId, ProtocolId} from "@data/CommonModels.ts";
import {AppStorage} from "@data/storage/AppStorage.ts";
import {EventFragment, id, ZeroAddress} from "ethers";
import {ScBaseService, ScMulticallData} from "./ScBaseService.ts";
import {appConfig} from "@config";
import {ScOracleService} from "@data/sc/ScOracleService.ts";
import {AppDistributionPluginV1Abi} from "@data/sc/abi/AppDistributionPluginV1.ts";
import {CacheKeys} from "@data/cache.ts";
import {PublisherAccountAppsPluginV1Abi} from "@data/sc/abi/PublisherAccountAppsPluginV1.ts";
import {AppAssetAbi} from "@data/sc/abi/AppAsset.ts";
import {ScDevService} from "@data/sc/ScDevService.ts";
import {ScGfCrosschainService} from "@data/sc/ScGfCrosschainService.ts";

export interface ScApp {
    id: number,
    name: string,
    package: string,
    address: Address,
    avatar: string | null
}

export interface ScAppOwnerState {
    domain: string;
    fingerprints: string[];
    proofs: string[];
}

export enum ScAppDistributionType {
    Default = 0,
    Custom = 1,
}

export interface ScAppDistribution {
    type: ScAppDistributionType
    sources: string[]
}

export interface ScAppGeneralInfo {
    name: string
    package: string
    description: string
    protocolId: ProtocolId
    platformId: PlatformId
    categoryId: CategoryId
    objectId?: AndroidTypeId
}

export interface ScAppBuild {
    versionCode: number
    versionName: string
    referenceId: string
    protocolId: ProtocolId
    checksum: string
    size: number
}

export class ScAssetService extends ScBaseService {

    // /////////////////////
    // CREATE APP
    // /////////////////////
    static async computeAppAddress(
        devAddress: Address,

        packageName: string,
        name: string,
        description: string,
        protocolId: number,
        platformId: number,
        categoryId: number,
    ) {
        const data = await this.reader.readContract(
            {
                abi: PublisherAccountAppsPluginV1Abi,
                address: devAddress,
                functionName: "computeAppAddress",
                args: [packageName, name, description, protocolId, platformId, categoryId],
            }
        )

        return data as Address
    }

    static async estimateCreateApp(
        oraclePrice: bigint,

        devAddress: Address,
        appAddress: Address,

        packageName: string,
        name: string,
        description: string,
        protocolId: number,
        platformId: number,
        categoryId: number,

        ownerInfo: AppOwnerInfo | null,
        distribution: ScAppDistribution | null,

        policyData: Hex | null,
    ) {
        const fees = await ScGfCrosschainService.relayFeesTotal()
        return await this.estimateContract((account) => {
            return this.calldataCreateApp(
                oraclePrice,
                account, devAddress, appAddress, packageName,
                name, description, protocolId, platformId, categoryId,
                ownerInfo, distribution,
                policyData, fees
            )
        })
    }

    static async createApp(
        oraclePrice: bigint,

        devAddress: Address,
        appAddress: Address,

        packageName: string,
        name: string,
        description: string,
        protocolId: number,
        platformId: number,
        categoryId: number,

        ownerInfo: AppOwnerInfo | null,
        distribution: ScAppDistribution | null,

        policyData: Hex | null,
    ) {
        const fees = await ScGfCrosschainService.relayFeesTotal()
        const result = await this.callContract((account) => {
            return this.calldataCreateApp(
                oraclePrice,
                account, devAddress, appAddress, packageName,
                name, description, protocolId, platformId, categoryId,
                ownerInfo, distribution,
                policyData, fees
            )
        })

        this.cache().clean()

        return result
    }

    static calldataCreateApp(
        oraclePrice: bigint,

        sender: Address,
        devAddress: Address,
        appAddress: Address,

        packageName: string,
        name: string,
        description: string,
        protocolId: number,
        platformId: number,
        categoryId: number,

        ownerInfo: AppOwnerInfo | null,
        distribution: ScAppDistribution | null,

        policyData: Hex | null,
        replyFees: bigint,
    ) {
        let calldatas: ScMulticallData[] = []
        let totalAmount = 0n

        const createAppCalldata = encodeFunctionData(
            this.paramsCreateAppAccount(sender, devAddress, packageName, name, description, protocolId, platformId, categoryId)
        )
        calldatas.push(
            {
                manager: devAddress,
                plugin: appConfig.contracts.devAppPlugin,
                data: createAppCalldata,
                value: BigInt(0),
            }
        )

        if (policyData) {
            const setPolicyCalldata = encodeFunctionData(
                ScDevService.paramsSetPolicy(sender, devAddress, policyData)
            )

            calldatas.push(
                {
                    manager: devAddress,
                    plugin: appConfig.contracts.devGfPlugin,
                    data: setPolicyCalldata,
                    value: replyFees,
                }
            )

            totalAmount += replyFees
        }

        if (ownerInfo) {
            const updateOwnerCalldata = encodeFunctionData(
                this.paramsUpdateAppOwnerMulticall(sender, appAddress, ownerInfo)
            )
            calldatas.push(
                {
                    manager: appAddress,
                    plugin: appConfig.contracts.appOwnerPlugin,
                    data: updateOwnerCalldata,
                    value: BigInt(0),
                }
            )

            const oracleCalldata = encodeFunctionData(
                ScOracleService.paramsValidateAppMulticall(sender, appAddress)
            )
            calldatas.push(
                {
                    manager: appConfig.contracts.oracle,
                    plugin: ZeroAddress as Address,
                    data: oracleCalldata,
                    value: oraclePrice,
                }
            )

            totalAmount += oraclePrice
        }

        if (distribution) {
            const distrCalldata = encodeFunctionData(
                this.paramsUpdateDistributionMulticall(sender, appAddress, distribution)
            )

            calldatas.push(
                {
                    manager: appAddress,
                    plugin: appConfig.contracts.appDistributionPlugin,
                    data: distrCalldata,
                    value: BigInt(0),
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

    static paramsCreateAppAccount(
        sender: Address,
        developer: Address,

        packageName: string,
        name: string,
        description: string,
        protocolId: number,
        platformId: number,
        categoryId: number,
    ) {
        return {
            abi: PublisherAccountAppsPluginV1Abi,
            address: developer,
            functionName: "createApp",
            args: [sender, packageName, name, description, protocolId, platformId, categoryId],
        }
    }

    static findAppCreatedEventTopic(logs: Log<bigint, number, false>[]) {
        return logs.find(
            (log) => log.topics[0] == this.getAppCreatedEventTopic()
        )
    }

    private static getAppCreatedEventTopic()  {
        const fragment = EventFragment.from(this.appCreatedEvent())
        const topic = id(fragment.format("sighash"));
        return topic
    }

    private static appCreatedEvent() {
        return parseAbiItem(`event AppCreated(address indexed appAddress, string package, string name)`)
    }

    static paramsUpdateDistributionMulticall(sender: Address, appAddress: Address, distribution: ScAppDistribution) {
        const hashes = distribution.sources.map((source) => toHex(source))

        return {
            abi: AppDistributionPluginV1Abi,
            address: appAddress,
            functionName: "setDistribution",
            args: [sender, distribution.type, hashes],
        }
    }

    static paramsUpdateAppOwnerMulticall(sender: Address, appAddress: Address, info: AppOwnerInfo) {
        const fingers = info.proofs.map((p) => {
            return `0x${p.fingerprint.replaceAll(":", "")}`
        });

        const proofs = info.proofs.map((p) => {
            return p.proof
        });

        return {
            abi: AppOwnerPluginV1Abi,
            address: appAddress,
            functionName: "setAppOwner",
            args: [sender, info.domain, fingers, proofs],
        }
    }

    static decodeAppCreatedEvent(index: number, log: Log) {
        const result = decodeEventLog(
            {
                abi: PublisherAccountAppsPluginV1Abi,
                eventName: "AppCreated",
                data: log.data,
                topics: log.topics,
            }
        )

        const data = {
            id: index,
            // @ts-ignore
            address: result.args.appAddress,
            // @ts-ignore
            package: result.args.id,
            // @ts-ignore
            name: result.args.name,
            avatar: null,
        } as ScApp;

        return data
    }

    // /////////////////////
    // UPDATE DISTRIBUTION
    // /////////////////////
    static async estimateUpdateDistribution(appAddress: Address, distribution: ScAppDistribution) {
        return this.estimateContract((account) => {
            return this.paramsUpdateDistribution(account, appAddress, distribution)
        })
    }

    static async updateDistribution(appAddress: Address, distribution: ScAppDistribution) {
        return this.callContract((account) => {
            return this.paramsUpdateDistribution(account, appAddress, distribution)
        })
    }

    static paramsUpdateDistribution(sender: Address, appAddress: Address, distribution: ScAppDistribution) {
        const hashes = distribution.sources.map((source) => toHex(source))

        return {
            abi: AppDistributionPluginV1Abi,
            address: appAddress,
            functionName: "setDistribution",
            args: [distribution.type, hashes],
            account: sender,
        }
    }

    // /////////////////////
    // UPDATE GENERAL INFO
    // /////////////////////
    static async estimateUpdateGeneralInfo(appAddress: Address, appName: string, description: string, categoryId: CategoryId) {
        return this.estimateContract((account) => {
            return this.paramsUpdateGeneralInfo(account, appAddress, appName, description, categoryId)
        })
    }

    static async updateGeneralInfo(appAddress: Address, appName: string, description: string, categoryId: CategoryId) {
        return this.callContract((account) => {
            return this.paramsUpdateGeneralInfo(account, appAddress, appName, description, categoryId)
        })
    }

    static paramsUpdateGeneralInfo(sender: Address, appAddress: Address, appName: string, description: string, categoryId: CategoryId) {
        return {
            abi: AppAssetAbi,
            address: appAddress,
            functionName: "updateGeneralInfo",
            args: [appName, description, categoryId],
            account: sender,
        }
    }

    // /////////////////////
    // UPDATE OWNER
    // /////////////////////
    static async estimateUpdateAppOwner(appAddress: Address, ownerInfo: AppOwnerInfo) {
        return this.estimateContract((account) => {
            return this.paramsUpdateAppOwner(account, appAddress, ownerInfo)
        })
    }

    static async setAppOwner(appAddress: Address, ownerInfo: AppOwnerInfo) {
        return this.callContract((account) => {
            return this.paramsUpdateAppOwner(account, appAddress, ownerInfo)
        })
    }

    static paramsUpdateAppOwner(sender: Address, appAddress: Address, info: AppOwnerInfo) {
        const fingers = info.proofs.map((p) => {
            return `0x${p.fingerprint.replaceAll(":", "")}`
        });

        const proofs = info.proofs.map((p) => {
            return p.proof
        });

        return {
            abi: AppOwnerPluginV1Abi,
            address: appAddress,
            functionName: "setAppOwner",
            args: [info.domain, fingers, proofs],
            account: sender,
        }
    }

    // /////////////////////
    // READ ONLY GENERAL
    // /////////////////////
    static async getAppGeneralInfo(appAddress: Address): Promise<ScAppGeneralInfo> {
        return await this.cache().getOrLoad(
            CacheKeys.AppInfo.key(appAddress), CacheKeys.AppInfo.ttl,
            async () => {
                return await this.getGeneralInfo(appAddress)
            }
        )
    }

    static async getLastBuildVersion(appAddress: Address): Promise<number> {
        return await this.cache().getOrLoad(
            CacheKeys.LastBuild.key(appAddress), CacheKeys.AppInfo.ttl,
            async () => {
                return await this.reader.readContract(
                    {
                        abi: AppBuildsPluginV1Abi,
                        address: appAddress,
                        functionName: "getLastVersionCode",
                        args: [],

                    }
                )
            }
        )
    }

    static async getAppAddress(appPackage: string, devAddress: Address) {
        const appAddress = AppStorage.getAddress(appPackage, devAddress)
        if (appAddress) {
            return appAddress;
        }

        const remoteAddress = await this.getAppByPackage(appPackage, devAddress)
        if (remoteAddress == ZeroAddress) {
            return null
        }

        AppStorage.setAddress(appPackage, remoteAddress, devAddress)

        return remoteAddress;
    }

    static setAppAddress(appPackage: string, appAddress: Address, devAddress: Address) {
        AppStorage.setAddress(appPackage, appAddress, devAddress)
    }

    private static async getGeneralInfo(address: Address): Promise<ScAppGeneralInfo>  {
        const data: any = await this.reader.readContract(
            {
                abi: AppAssetAbi,
                address: address,
                functionName: "getGeneralInfo",
                args: [],
            }
        )

        return {
            package: data.id,
            name: data.name,
            description: data.description,
            protocolId: data.protocolId as ProtocolId,
            platformId: data.platformId as PlatformId,
            categoryId: data.categoryId as CategoryId,
        } as ScAppGeneralInfo
    }

    private static async getAppByPackage(appPackage: string, devAddress: Address)  {
        const data = await this.reader.readContract(
            {
                abi: PublisherAccountAppsPluginV1Abi,
                address: devAddress,
                functionName: "getAppById",
                args: [appPackage],
            }
        )

        return data as Address
    }

    static async getApps(devAddress: Address): Promise<ScApp[]> {
        return await this.cache().getOrLoad(
            CacheKeys.AppList.key(devAddress), CacheKeys.AppList.ttl,
            async () => {

                const logs = await this.etherscan.getLogs({
                    address: devAddress,
                    topic0: this.getAppCreatedEventTopic(),
                    fromBlock: appConfig.startBlock,
                })

                let result = logs.result.map((log, id) => {
                    return this.decodeAppCreatedEvent(id, log)
                })

                return result
            })
    }

    // /////////////////////
    // READ ONLY DISTRIBUTION
    // /////////////////////
    static async getDistributionSources(appAddress: Address) {
        const data = await this.reader.readContract(
            {
                abi: AppDistributionPluginV1Abi,
                address: appAddress,
                functionName: "getDistribution",
                args: [],
            }
        ) as { typeId: ScAppDistributionType, sources: `0x${string}`[] }

        return {
            type: data.typeId,
            sources: data.sources.map((source) => fromHex(source, "string"))
        } as ScAppDistribution
    }

    // /////////////////////
    // READ ONLY OWNER
    // /////////////////////
    static async getOwnerState(appAddress: Address)  {
        const data = await this.reader.readContract(
            {
                abi: AppOwnerPluginV1Abi,
                address: appAddress,
                functionName: "getState",
                args: [],
            }
        )

        return this.parseOwnerState(data)
    }

    private static parseOwnerState(data: any) {
        return {
            domain: data.domain,
            fingerprints: data.fingerprints.map((p: string) => {
                return p.replace("0x", "")
                    .match(/.{2}/g)?.join(":") || ""}
            ),
            proofs: data.proofs,
        } as ScAppOwnerState
    }

    static async version(appAddress: Address) {
        const remoteVersion = Number(
            await this.reader.readContract(
                {
                    abi: AppOwnerPluginV1Abi,
                    address: appAddress,
                    functionName: "version",
                    args: [],
                }
            ) as bigint
        )

        return remoteVersion;
    }

    // /////////////////////
    // READ ONLY BUILDS
    // /////////////////////

    static async lastBuildVersionCode(appAddress: Address) {
        return await this.reader.readContract(
            {
                abi: AppBuildsPluginV1Abi,
                address: appAddress,
                functionName: "getLastVersionCode",
                args: [],
            }
        ) as number
    }

    static paramsMulticallAddBuilds(owner: Address, appAddress: Address, params: ScAppBuild) {
        return {
            abi: AppBuildsPluginV1Abi,
            address: appAddress,
            functionName: "addBuild",
            args: [
                owner,
                {
                    versionCode: params.versionCode,
                    versionName: params.versionName,
                    referenceId: params.referenceId,
                    protocolId: params.protocolId,
                    checksum: params.checksum,
                }
            ],
            account: owner,
        }
    }

    static async hasBuild(appAddress: Address, versionCode: number) {
        return await this.reader.readContract(
            {
                abi: AppBuildsPluginV1Abi,
                address: appAddress,
                functionName: "hasBuild",
                args: [versionCode],
            }
        ) as boolean
    }

    // /////////////////////
    // CACHE
    // /////////////////////
    static resetAllCache() {
        this.cache()
            .clean()
    }
}
