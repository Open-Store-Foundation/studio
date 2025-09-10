import {createPublicClient, createWalletClient, custom, http} from "viem";
import {appConfig} from "@config";

export class WalletClient {

    static create() {
        return new WalletClient()
    }

    readonly read

    constructor() {
        this.read = createPublicClient({
            chain: appConfig.mainChain,
            transport: http()
        })
    }

    write() {
        return createWalletClient({
            chain: appConfig.mainChain,
            // @ts-ignore
            transport: custom(appConfig.provider())
        })
    }
}
