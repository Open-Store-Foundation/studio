import { TimedCache } from "@utils/cache";
import {WalletClient} from "@libs/viem/client.ts";

export class GasProvider {

    private static GAS_CACHE_KEY = "EVM_GAS_PRICE"
    private static GAS_CACHE_TTL = 1000 * 30

    private cache: TimedCache
    private wallet: WalletClient

    constructor(wallet: WalletClient, cache: TimedCache) {
        this.cache = cache
        this.wallet = wallet
    }

    async getGasPrice() {
        return this.cache.getOrLoad<bigint>(
            GasProvider.GAS_CACHE_KEY,
            GasProvider.GAS_CACHE_TTL,
            async () => {
                const price = await this.wallet.read.getGasPrice()
                return price
            })
    }
}
