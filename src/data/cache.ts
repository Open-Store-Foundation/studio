import {Cache} from "@utils/cache.ts";
import {GeckoCurrency, GeckoRatio} from "@data/geco/CoinGeckoClient.ts";

export const CacheKeys = {
    Relay: {
        key: "REPLAY_FEE",
        ttl: 1000 * 60 * 10,
    } as Cache,
    Gecko: {
        key: (from: GeckoCurrency, to: GeckoRatio[]) => {
            return `GECKO_QUOTE_${from}:${to.join(",")}`
        },
        ttl: 1000 * 60 * 10,
    },
    GfAppLogo: {
        key: (bucket: string, path: string) => {
            return `GF_APP_LOGO_${bucket}:${path}`
        },
        ttl: 1000 * 60 * 10,
    },
    OracleStatus: {
        key: (appAddress: string) => {
            return `ORACLE_STATE:${appAddress}`
        },
        ttl: 1000 * 60 * 10,
    },
    GfQuote: {
        key: (bucket: string) => {
            return `GF_QUOTE_${bucket}`
        },
        ttl: 1000 * 60 * 10,
    },
    GfSpProvider: {
        key: (bucket: string) => {
            return `GF_SP_PROVIDER_${bucket}`
        },
        ttl: 1000 * 60 * 10,
    },
    GfSpProviders: {
        key: "GF_SP_PROVIDERS",
        ttl: 1000 * 60 * 10,
    },
    GfBalance: {
        key: (paymentAddress: string) => {
            return `GF_BALANCE_${paymentAddress}`
        },
        ttl: 1000 * 60 * 10,
    },
    GfTotalSize: {
        key: (bucket: string) => {
            return `GF_TOTAL_SIZE_${bucket}`
        },
        ttl: 1000 * 60 * 10,
    },
    AppInfo: {
        key: (appAddress: string) => {
            return `APP_GENERAL_INFO_${appAddress}`
        },
        ttl: 1000 * 60 * 10,
    },
    LastBuild: {
        key: (appAddress: string) => {
            return `LAST_BUILD_${appAddress}`
        },
        ttl: 1000 * 60 * 10,
    },
    AppList: {
        key: (devAddress: string) => {
            return `APP_LIST_${devAddress}`
        },
        ttl: 1000 * 60 * 10,
    },
    DevList: {
        key: (owner: string) => {
            return `DEV_LIST_${owner}`
        },
        ttl: 1000 * 60 * 10,
    },
    AppOwnerProofs: {
        key: (appAddress: string) => {
            return `APP_OWNER_PROOFS_${appAddress}`
        },
        ttl: 1000 * 60 * 10,
    },
    AppOwnerState: {
        key: (appAddress: string) => {
            return `APP_OWNER_STATE_${appAddress}`
        },
        ttl: 1000 * 60 * 10,
    },
}


