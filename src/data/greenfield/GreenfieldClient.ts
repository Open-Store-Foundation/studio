import {Client, GRNToString, newBucketGRN} from "@bnb-chain/greenfield-js-sdk";
import {GreenNetwork} from "./networks.ts";
import {GfAuth, GfBuildFile} from "./models.ts";
import {ApkInfo} from "@utils/apk.ts";
import {GreenfieldFeeClient} from "@data/greenfield/GreenfieldFeeClient.ts";
import {GasProvider} from "@data/sc/GasProvider.ts";
import {TimedCache} from "@utils/cache.ts";
import {Address} from "@data/CommonModels.ts";
import {appConfig} from "@config";
import {signTypedDataCallback} from "@utils/sign.ts";
import {CacheKeys} from "@data/cache.ts";
import {AuthStorage} from "@data/storage/AuthStorage.ts";
import {getTimestampInMs} from "@utils/date.ts";
import {dec} from "@utils/decimal.ts";
import {formatQuota} from "@screens/dev/format/quote.ts";

import {AuthType, ExecutorMsg, IQuotaProps, PaymentBalance, QueryDynamicBalanceResponse} from "./gf_mirror.ts";
import {ActionType, Effect, Policy, PrincipalType} from "./generated/greenfield/permission.ts";
import {ResourceType} from "./generated/greenfield/resource.ts";
import {VisibilityType} from "./generated/greenfield/storage.ts";
import {GreenfieldHttpClient} from "@data/greenfield/GreenfieldHttpClient.ts";
import { toHex } from "viem";

export interface DelegateCreateParams {
    path: string,
    file: File,
    bucket: string,
    isUpdate: boolean
    onProgress: (progress: number) => void,
}

export class GreenfieldClient {

    private static INDEX_FOLDER_NAME = "open-store-external"

    private client: Client
    private httpClient: GreenfieldHttpClient
    private feeClient: GreenfieldFeeClient
    private cache: TimedCache;

    constructor(network: GreenNetwork, http: GreenfieldHttpClient, gasProvider: GasProvider, cache: TimedCache) {
        const sdkClient = Client.create(
            network.rpc,
            network.chainId,
        )
        this.client = sdkClient
        this.httpClient = http;
        this.cache = cache;
        this.feeClient = new GreenfieldFeeClient(http, gasProvider, cache)
    }

    get fee(): GreenfieldFeeClient {
        return this.feeClient;
    }

    async accountBalance(address: Address): Promise<PaymentBalance> {
        const result = await this.cache.getOrLoad<QueryDynamicBalanceResponse>(
            CacheKeys.GfBalance.key(address), CacheKeys.GfBalance.ttl,
            async () => {
                const result =  await this.httpClient.payment.dynamicBalance({account: address})
                return result
            }
        )

        return {...result}
    }

    async isEnoughQuote(quoteRequirement: number, bucket: string, auth: GfAuth) {
        const quote = formatQuota(await this.bucketReadQuote(auth, bucket))
        const isEnoughQuote = quoteRequirement <= quote.remain
        return isEnoughQuote
    }

    clearQuoteCache(bucket: string) {
        this.cache.delete(CacheKeys.GfQuote.key(bucket))
    }

    async bucketReadQuote(auth: GfAuth, bucket: string): Promise<IQuotaProps> {
        const result = await this.cache.getOrLoad<IQuotaProps>(
            CacheKeys.GfQuote.key(bucket), CacheKeys.GfQuote.ttl,
            async () => {
                const data = await this.client.bucket.getBucketReadQuota(
                    {bucketName: bucket.toLowerCase()},
                    this.eddsaAuth(auth),
                )

                return data.body!
            }
        )

        return result
    }

    async totalBucketSize(name: string) {
        const result = await this.cache.getOrLoad<bigint | undefined>(
            CacheKeys.GfTotalSize.key(name), CacheKeys.GfTotalSize.ttl,
            async () => {
                try {
                    const data = await this.httpClient.bucket.headBucketExtra(
                        name.toLowerCase()
                    )

                    const { localVirtualGroups = [] } = data.extraInfo || {};
                    const totalChargeSize = localVirtualGroups
                        .reduce((a: any, b: any) => a.plus(dec(b.totalChargeSize.toString())), dec(0))
                        .toString();

                    return BigInt(totalChargeSize)
                } catch (e) {
                    console.error("Error getting bucket size: ", e)
                    return undefined
                }
            }
        )

        return result
    }

    async hasBucket(name: string) {
        try {
            await this.httpClient.bucket.headBucket(name.toLowerCase())
            return true
        } catch (e: any) {
            if (e.message.includes("No such bucket")) {
                return false
            }

            return false
        }
    }

    static createBucketQuoteData(bucket: string, devAddress: Address, quote: bigint) {
        const bucketQuoteMsg = ExecutorMsg.getUpdateBucketInfoParams({
            bucketName: bucket.toLowerCase(),
            operator: devAddress,
            paymentAddress: devAddress,
            visibility: VisibilityType.VISIBILITY_TYPE_PUBLIC_READ,
            chargedReadQuota: { value: Number(quote) },
        });

        return bucketQuoteMsg
    }

    async hasPolicy(bucket: string, owner: Address) {
        try {
            // https://gnfd-testnet-fullnode-tendermint-ap.bnbchain.org/greenfield/storage/policy_for_account/grn%3Ab%3A%3Akittydev/0x7eeE0E672244f9f199C4d5B644D4351d14ee7D41
            const response = await this.client.bucket.getBucketPolicy(
                { principalAddress: owner, resource: GRNToString(newBucketGRN(bucket.toLowerCase())) }
            )

            // TODO v2 check policy types
            return Number(response.policy?.id ?? "0") > 0
        } catch (e: Error | any) {
            const has = e.message.includes("No such Policy")
            if (!has) {
                console.error("Error getting bucket policy: ", e)
                throw e
            }

            return false
        }
    }

    async createBucketPolicyData(bucket: string, owner: Address) {
        const lcBucket = bucket.toLowerCase()
        const bucketInfo = await this.httpClient.bucket.headBucket(lcBucket)

        if (!bucketInfo.bucketInfo) {
            return undefined
        }

        // some SP don't delete objects without explicit ActionType.ACTION_DELETE_OBJECT and `${lcBucket}/*`
        const policyData = Policy.encode({
            id: '0',
            resourceId: bucketInfo.bucketInfo.id,
            resourceType: ResourceType.RESOURCE_TYPE_BUCKET,
            statements: [
                {
                    effect: Effect.EFFECT_ALLOW,
                    actions: [ActionType.ACTION_TYPE_ALL, ActionType.ACTION_DELETE_OBJECT],
                    resources: [`${lcBucket}/*`],
                    expirationTime: undefined,
                    limitSize: undefined
                },
            ],
            principal: {
                type: PrincipalType.PRINCIPAL_TYPE_GNFD_ACCOUNT,
                value: owner,
            },
            expirationTime: undefined
        }).finish();

        return toHex(policyData)
    }

    cachedAuth(chainId: number, address: string): GfAuth | null {
        const seed = AuthStorage.getAuth(chainId, address)

        if (seed == null) {
            return null
        }

        return {
            seeds: seed,
            address: address
        }
    }

    async auth(chainId: number, address: string, provider: unknown): Promise<GfAuth | null> {
        const seed = AuthStorage.getAuth(chainId, address)
        if (seed != null) {
            return {
                seeds: seed,
                address: address
            }
        }

        const providers = await this.httpClient.sp.getStorageProviders()

        const time = getTimestampInMs()
        const result = await this.client.offchainauth.genOffChainAuthKeyPairAndUpload(
            {
                sps: providers
                    .map((item) => {
                        return {
                            address: item.operatorAddress,
                            endpoint: item.endpoint,
                            name: item.description.moniker,
                        }
                    }),
                chainId: chainId,
                expirationMs: appConfig.greenfieldAuthTtl,
                domain: window.location.origin,
                address: address,
            },
            provider
        )

        if (result.code != 0) {
            console.error("Greenfield auth error: ", result.message)
            return null
        }

        if (result.body == undefined) {
            console.error("Greenfield auth error: ", result.message)
            return null
        }

        const auth = {
            seeds: result.body.seedString,
            address: address
        }

        console.log("Greenfield auth successful")
        AuthStorage.setAuth(chainId, address, auth.seeds, time)

        return auth
    }

    async delegatedCreateObject(auth: GfAuth, request: DelegateCreateParams) {
        console.log("Creating object...", request)
        const response = await this.client.object.delegateUploadObject(
            {
                bucketName: request.bucket,
                objectName: `${request.path}`,
                body: request.file,
                delegatedOpts: {
                    visibility: VisibilityType.VISIBILITY_TYPE_PUBLIC_READ,
                    isUpdate: request.isUpdate
                },
                onProgress: (progress: any) => request?.onProgress(progress.percent)
            },
            this.eddsaAuth(auth),
        )

        const isSuccess = response.code == 0

        if (isSuccess) {
            console.log("Object created successfully!")
            this.cache.clean()
        }

        return isSuccess
    }

    async deleteObject(address: string, bucket: string, path: string, account: any) {
        const result = await this.client.object.deleteObject(
            {
                operator: address,
                bucketName: bucket.toLowerCase(),
                objectName: path,
            }
        )

        const simulateInfo = await result.simulate({
            denom: 'BNB',
        });

        const response = await result.broadcast({
            denom: 'BNB',
            gasLimit: Number(simulateInfo?.gasLimit),
            gasPrice: simulateInfo?.gasPrice || '5000000000',
            payer: address,
            granter: '',
            signTypedDataCallback: signTypedDataCallback(account),
        })

        const isSuccess = response.code == 0

        if (isSuccess) {
            console.log("Object deleted successfully!")
            this.cache.clean()
        }

        return isSuccess
    }

    apkPath(appInfo: ApkInfo): string {
        return `${this.getAppFolder(appInfo.packageName)}/android/v/${appInfo.versionName}/${appInfo.versionCode}/${appInfo.checksum.toLowerCase()}.apk`
    }

    logoPath(appPackage: string): string {
        return `${this.getAppFolder(appPackage)}/logo.png`
    }

    async hasFile(bucket: string, path: string): Promise<boolean> {
        try {
            const data = await this.client.object.headObject(bucket.toLowerCase(), path)
            return data.objectInfo != null
        } catch (e) {
            console.log(`Can't find file info ${path}`)
            return false
        }
    }

    async downloadUrl(bucket: string, path: string): Promise<string | null> {
        return await this.cache.getOrLoad(
            CacheKeys.GfAppLogo.key(bucket, path), CacheKeys.GfAppLogo.ttl,
            async () => {
                const endpoint = await this.findPrimarySpProvider(bucket);
                const url = `${endpoint}/download/${bucket.toLowerCase()}/${path}`

                return url
            }
        )
    }

    private getAppFolder(appPackage: string) {
        return `${GreenfieldClient.INDEX_FOLDER_NAME}/${appPackage.replaceAll(".", "_")}/android`
    }

    async getAppVersion(bucket: string, appInfo: ApkInfo): Promise<GfBuildFile | null> {
        const versions = await this.getAppVersions(
            bucket, appInfo.packageName, appInfo.versionName, appInfo.versionCode,
        )

        if (versions.length > 1) {
            console.log("More than one version found for app: ", appInfo.packageName, appInfo.versionName, appInfo.versionCode)
            // TODO v2 stat
        }

        return versions.length > 0 ? versions[0] : null
    }

    async getAppVersions(bucket: string, appPackage: string, version?: string, code?: number, checksum?: String): Promise<GfBuildFile[]> {
        const basePath = `${this.getAppFolder(appPackage)}/v`
        const primaryPrefix = `${basePath}/`

        let prefix = basePath
        if (version) {
            prefix += `/${version}`

            if (code) {
                prefix += `/${code}`

                if (checksum) {
                    prefix += `/${checksum}`
                }
            }
        }

        const sp = await this.findPrimarySpProvider(bucket)
        if (!sp) {
            throw new Error("No primary SP found")
        }

        const objects = await this.client.object.listObjects(
            {
                bucketName: bucket.toLowerCase(),
                endpoint: sp,
                query: new URLSearchParams([
                    [`prefix`, prefix],
                ])
            }
        )

        return objects.body
                ?.GfSpListObjectsByBucketNameResponse
                ?.Objects
                ?.filter((obj: any) => {
                    return obj.ObjectInfo.ContentType == "application/vnd.android.package-archive"
                        && obj.ObjectInfo.ObjectName.endsWith(".apk")
                })
                ?.map((obj: any) => {
                    const name = obj.ObjectInfo.ObjectName
                        .replace(primaryPrefix, "")
                        .replace(".apk", "")

                    const [versionName, versionCode, checksum] = name.split("/")

                    return <GfBuildFile>{
                        id: obj.ObjectInfo.Id,
                        versionName: versionName,
                        versionCode: parseInt(versionCode),
                        checksum: checksum,
                        createdAt: obj.ObjectInfo.CreateAt,
                        size: obj.ObjectInfo.PayloadSize,
                        path: obj.ObjectInfo.ObjectName,
                        type: "APK"
                    }
                })
            || []
    }

    private eddsaAuth(auth: GfAuth): AuthType {
        return {
            type: 'EDDSA',
            domain: window.location.origin,
            seed: auth.seeds,
            address: auth.address,
        }
    }

    async randomSpProvider(globalVirtualGroupFamilyId: number): Promise<Address> {
        return await this.cache.getOrLoad(
            CacheKeys.GfSpProviders.key, CacheKeys.GfSpProviders.ttl,
            async () => {
                const group = await this.httpClient.virtualGroup.getGlobalVirtualGroupFamilyId(
                    { familyId: globalVirtualGroupFamilyId }
                )

                const sps = group.globalVirtualGroups[0].secondarySpIds;
                const randomSp =  sps[getTimestampInMs() % sps.length]

                const node = await this.httpClient.sp.getStorageProvider(randomSp)

                return node.operatorAddress as Address
            }
        )
    }

    async findPrimarySpProvider(bucket: string): Promise<string | undefined> {
        const lcb = bucket.toLowerCase()
        return await this.cache.getOrLoad(
            CacheKeys.GfSpProvider.key(lcb), CacheKeys.GfSpProvider.ttl,
            async () => {
                const info = await this.httpClient.bucket.headBucket(lcb);
                if (!info.bucketInfo) {
                    return undefined
                }

                const groupId = await this.httpClient.virtualGroup.getGlobalVirtualGroupFamily(
                    {
                        familyId: info.bucketInfo!.globalVirtualGroupFamilyId
                    }
                )

                const sp = await this.httpClient.sp.getStorageProvider(groupId.primarySpId)
                return sp?.endpoint || undefined
            }
        )
    }
}
