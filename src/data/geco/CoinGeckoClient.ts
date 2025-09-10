import axios from "axios";
import {TimedCache} from "@utils/cache.ts";
import {CacheKeys} from "@data/cache.ts";

export interface GeckoQuote {
    readonly data: Map<GeckoRatio, number>
}

export enum GeckoCurrency {
    BNB = "binancecoin",
}

export enum GeckoRatio {
    USD = "usd",
}

export class CoinGeckoClient {

    private cache: TimedCache

    constructor(cache: TimedCache) {
        this.cache = cache
    }

    async getBnbToUsd() {
        try {
            const rate = await this.getQuoteCached(GeckoCurrency.BNB, [GeckoRatio.USD])
            const usdRatio = rate.data.get(GeckoRatio.USD)!
            return usdRatio
        } catch (e) {
            console.error(e)
            return undefined
        }
    }

    async getQuoteCached(from: GeckoCurrency, to: GeckoRatio[]): Promise<GeckoQuote> {
        return await this.cache.getOrLoad(
            CacheKeys.Gecko.key(from, to),
            CacheKeys.Gecko.ttl,
            async () => {
                return this.getQuote(from, to)
            }
        )
    }

    async getQuote(from: GeckoCurrency, to: GeckoRatio[]): Promise<GeckoQuote> {
        const toParam = to.join(",")
        const result = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price?ids=${from}&vs_currencies=${toParam}`
        )

        const body = result.data
        const fromBody = body[from]

        const quotes = new Map<GeckoRatio, number>()

        to.forEach((item) => {
            const data = fromBody[item]
            if (data) {
                quotes.set(item, Number(data))
            }
        })

        return { data: quotes }
    }
}
