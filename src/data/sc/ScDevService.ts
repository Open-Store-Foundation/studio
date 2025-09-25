import {decodeEventLog, encodeFunctionData, Hex, Log, parseAbiItem} from "viem";
import {appConfig} from "@config";
import {DevStorage} from "@data/storage/DevStorage.ts";
import {Address} from "@data/CommonModels.ts";
import {EventFragment, id, ZeroAddress} from "ethers";
import {ScBaseService, ScMulticallData} from "@data/sc/ScBaseService.ts";
import {CacheKeys} from "@data/cache.ts";
import {GreenfieldClient} from "@data/greenfield";
import {ScGfCrosschainService} from "@data/sc/ScGfCrosschainService.ts";
import {PublisherAccountFactoryAbi} from "@data/sc/abi/PublisherAccountFactory.ts";
import {PublisherGreenfieldPluginV1Abi} from "@data/sc/abi/PublisherGreenfieldPluginV1.ts";

const ScDevFactoryConfig = {
    address: appConfig.contracts.devFactory,
    abi: PublisherAccountFactoryAbi,
}

interface DevAccountCreated {
    account: Address,
    owner: Address,
    name: string,
}

export interface DevAccount {
    name: string;
    address: Address;
}

export class ScDevService extends ScBaseService {

    // /////////////////////
    // CREATE DEV ACCOUNT
    // /////////////////////
    static async computeDevAddress(
        owner: Address,
        name: string,
    ) {
        const address = await this.reader.readContract(
            {
                ...ScDevFactoryConfig,
                functionName: "computeAccountAddress",
                args: [owner, name],
            }
        )

        return address as Address
    }

    static async estimateCreateDevAccount(
        name: string,
        devAddress: Address,
        spAddress: Address,
        familyGroupId: number,
        topUpAmount: bigint | null,
    ) {
        const fees = await ScGfCrosschainService.relayFeesTotal()
        return this.estimateContract((account) => {
            return this.paramsCreateDevBucket(account, devAddress, name, fees, spAddress, familyGroupId, topUpAmount)
        })
    }

    static async createDevAccount(
        name: string,
        devAddress: Address,
        spAddress: Address,
        familyGroupId: number,
        topUpAmount: bigint | null,
    ) {
        const fees = await ScGfCrosschainService.relayFeesTotal()
        const result = await this.callContract((account) => {
            return this.paramsCreateDevBucket(account, devAddress, name, fees, spAddress, familyGroupId, topUpAmount)
        })

        this.cache().clean()

        return result
    }

    static async paramsCreateDevBucket(
        sender: Address,
        devAddress: Address,
        name: string,
        replyFees: bigint,
        spAddress: Address,
        familyGroupId: number,
        topUpAmount: bigint | null,
    ) {
        let calldatas: ScMulticallData[] = []
        let totalAmount = 0n

        const createDevCalldata = encodeFunctionData(
            this.paramsCreateDevAccount(sender, name)
        )
        calldatas.push(
            {
                manager: ScDevFactoryConfig.address,
                plugin: ZeroAddress as Address,
                data: createDevCalldata,
                value: 0n,
            }
        )

        if (!appConfig.isLocalhost && topUpAmount) {
            const topUpStorageCalldata = encodeFunctionData(
                this.paramsTopUpAccount(sender, devAddress, topUpAmount)
            )

            calldatas.push(
                {
                    manager: devAddress,
                    plugin: appConfig.contracts.devGfPlugin,
                    data: topUpStorageCalldata,
                    value: replyFees + topUpAmount,
                }
            )

            totalAmount += replyFees + topUpAmount
        }

        if (!appConfig.isLocalhost) {
            const createBucketCalldata = encodeFunctionData(
                this.paramsCreateBucketAccount(sender, devAddress, name, spAddress, familyGroupId)
            )
            calldatas.push(
                {
                    manager: devAddress,
                    plugin: appConfig.contracts.devGfPlugin,
                    data: createBucketCalldata,
                    value: replyFees,
                }
            )
            totalAmount += replyFees;
        }

        const calldata = this.paramsMulticall(
            sender,
            calldatas,
            totalAmount,
        )

        return calldata
    }

    private static paramsCreateDevAccount(account: Address, name: string) {
        return {
            ...ScDevFactoryConfig,
            functionName: "createAccount",
            args: [account, name],
        }
    }

    static paramsExecuteMessagesAccount(
        sender: Address,
        devAddress: Address,
        msgTypes: number[],
        msgData: `0x${string}`[],
    ) {
        return {
            abi: PublisherGreenfieldPluginV1Abi,
            address: devAddress,
            functionName: "executeMsg",
            args: [sender, msgTypes, msgData],
        }
    }

    static paramsSetPolicy(
        sender: Address,
        developer: Address,
        data: Hex
    ) {
        return {
            abi: PublisherGreenfieldPluginV1Abi,
            address: developer,
            functionName: "changePolicy",
            args: [sender, data],
        }
    }

    static paramsCreateBucketAccount(
        sender: Address,
        developer: Address,
        name: string,
        spAddress: Address,
        familyGroupId: number,
    ) {
        return {
            abi: PublisherGreenfieldPluginV1Abi,
            address: developer,
            functionName: "createSpace",
            args: [sender, name, spAddress, 0, familyGroupId, "0x", 0, "0x"],
        }
    }

    static paramsTopUpAccount(
        sender: Address,
        developer: Address,
        amount: bigint,
    ) {
        return {
            abi: PublisherGreenfieldPluginV1Abi,
            address: developer,
            functionName: "topUp",
            args: [sender, amount],
        }
    }

    static decodeDevAccountCreateEvent(log: Log) {
        const result = decodeEventLog(
            {
                abi: PublisherAccountFactoryAbi,
                eventName: "PublisherAccountCreated",
                data: log.data,
                topics: log.topics,
            }
        )

        const data = {
            // @ts-ignore
            owner: result.args.owner,
            // @ts-ignore
            account: result.args.account,
            // @ts-ignore
            name: result.args.name,
        } as DevAccountCreated;

        return data
    }

    static findDevAccountCreatedTopic(logs: Log[]) {
        return logs.find(
            (log) => log.topics[0] == this.devAccountCreatedTopic()
        )
    }

    private static devAccountCreatedTopic() {
        const fragment = EventFragment.from(ScDevService.devAccountCreatedEvent())
        const topic = id(fragment.format("sighash"));
        return topic
    }

    private static devAccountCreatedEvent() {
        return parseAbiItem(`event PublisherAccountCreated(address indexed owner, address account, string name)`)
    }

    // /////////////////////
    // UPDATE STORAGE ACCOUNT
    // /////////////////////
    static async estimateUpdateStorageAccount(
        bucket: string,
        devAddress: Address,
        bucketPolicy: Hex | undefined,
        topUpAmount: bigint | null,
        newBucketQuote: bigint | null,
    ) {
        const {relayFee, minAckRelayFee} = await ScGfCrosschainService.relayFees()

        return this.estimateContract((account) => {
            return this.paramsUpdateStorageAccount(account, devAddress, bucket, relayFee, minAckRelayFee, bucketPolicy, topUpAmount, newBucketQuote)
        })
    }

    static async updateStorageAccount(
        bucket: string,
        devAddress: Address,
        bucketPolicy: Hex | undefined,
        topUpAmount: bigint | null,
        newBucketQuote: bigint | null,
    ) {
        const {relayFee, minAckRelayFee} = await ScGfCrosschainService.relayFees()

        const result = await this.callContract((account) => {
            return this.paramsUpdateStorageAccount(account, devAddress, bucket, relayFee, minAckRelayFee, bucketPolicy, topUpAmount, newBucketQuote)
        })

        this.cache().clean()

        return result;
    }

    private static paramsUpdateStorageAccount(
        sender: Address,
        devAddress: Address,
        bucket: string,
        relayFee: bigint,
        relayAckFee: bigint,
        bucketPolicy: Hex | undefined,
        topUpAmount: bigint | null,
        newBucketQuote: bigint | null,
    ) {
        let calldatas: ScMulticallData[] = []
        let totalAmount = 0n

        if (!appConfig.isLocalhost && bucketPolicy) {
            const setPolicyCalldata = encodeFunctionData(
                this.paramsSetPolicy(sender, devAddress, bucketPolicy)
            )

            calldatas.push(
                {
                    manager: devAddress,
                    plugin: appConfig.contracts.devGfPlugin,
                    data: setPolicyCalldata,
                    value: relayFee + relayAckFee,
                }
            )

            totalAmount += relayFee + relayAckFee
        }

        if (!appConfig.isLocalhost && topUpAmount) {
            const topUpStorageCalldata = encodeFunctionData(
                this.paramsTopUpAccount(sender, devAddress, topUpAmount)
            )

            calldatas.push(
                {
                    manager: devAddress,
                    plugin: appConfig.contracts.devGfPlugin,
                    data: topUpStorageCalldata,
                    value: relayFee + relayAckFee + topUpAmount,
                }
            )

            totalAmount += relayFee + relayAckFee + topUpAmount
        }

        if (!appConfig.isLocalhost && newBucketQuote) {
            const params = GreenfieldClient.createBucketQuoteData(bucket, devAddress, newBucketQuote)

            const executeMessagesCalldata = encodeFunctionData(
                this.paramsExecuteMessagesAccount(sender, devAddress, [params[0]], [params[1] as Address])
            )

            calldatas.push(
                {
                    manager: devAddress,
                    plugin: appConfig.contracts.devGfPlugin,
                    data: executeMessagesCalldata,
                    value: relayFee,
                }
            )

            totalAmount += relayFee
        }

        const calldata = this.paramsMulticall(
            sender,
            calldatas,
            totalAmount,
        )

        return calldata
    }

    // /////////////////////
    // READ ONLY GENERAL
    // /////////////////////
    static async getDevAddress(devName: string, owner: Address): Promise<Address | null> {
        const appAddress = DevStorage.getAddress(devName)
        if (appAddress) {
            return appAddress;
        }

        const remoteAddress = await this.getAddressByDeveloperId(owner, devName)
        if (remoteAddress == ZeroAddress) {
            return null
        }

        DevStorage.setAddress(devName, remoteAddress)

        return remoteAddress;
    }

    static setDevAddress(devName: string, address: Address) {
        DevStorage.setAddress(devName, address)
    }

    private static async getAddressByDeveloperId(owner: Address, devName: string) {
        const data = await this.reader.readContract(
            {
                ...ScDevFactoryConfig,
                functionName: "getAddressById",
                args: [owner, id(devName)],
            }
        )

        return data as Address
    }

    static async getDevAccounts(owner: Address): Promise<DevAccount[]> {
        return await this.cache().getOrLoad(
            CacheKeys.DevList.key(owner), CacheKeys.DevList.ttl,
            async () => {
                const logs = await this.graph.getPublishers(owner)
                return logs
            }
        )
    }
}


