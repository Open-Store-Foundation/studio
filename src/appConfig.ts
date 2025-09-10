import {parseEther} from "viem";
import {greenfieldTestnet, hardhat, bscTestnet} from "@libs/reown/chains.ts";
import {Address, ProtocolId} from "@data/CommonModels";
import type {AppKitNetwork} from "@reown/appkit-common";
import { Features } from "@reown/appkit";

const contracts = {
    lh: {
        // TODO actualize
        devFactory: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9" as Address,
        oracle: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9" as Address,
        store: "0x0165878A594ca255338adfa4d48449f69242Eb8F" as Address,
        multicall: "0x8d90514875B0920FCEb79464045aB56A8aAa3f6B" as Address,

        devAppPlugin: "0x610178dA211FEF7D417bC0e6FeD39F05609AD788" as Address,
        devGfPlugin: "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e" as Address,
        appOwnerPlugin: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853" as Address,
        appDistributionPlugin: "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318" as Address,
        appBuildPlugin: "0x0F09669588952cA48368dd8361662D549CcCE987" as Address,

        crossChain: "0xa5B2c9194131A4E0BFaCbF9E5D6722c873159cb7" as Address,
    },
    bsctest: {
        devFactory: "0xE994189222edE5fF9056aa00BB70a1eeF42880C7" as Address,
        oracle: "0x0F61D8D6c9D6886ac7cba72716E1b98C4379E0f7" as Address,
        store: "0x6Edac88EA58168a47ab61836bCbAD0Ac844498A6" as Address,
        multicall: "0x3f7AdDD276bC5c1a2Fffb329DD718f1fa0625D84" as Address,

        devAppPlugin: "0x48A93cF38ac4cE6FE16f2E8b8a9a7B24b46445A8" as Address,
        devGfPlugin: "0x06cF16521A903971FF8F2635931dA3768e294350" as Address,
        appOwnerPlugin: "0x77F67523F8b0e7D4519B91344F629c2180447B0f" as Address,
        appDistributionPlugin: "0x51C3A4282FB9F00705Be26f11cB7EE4Cc20274C4" as Address,
        appBuildPlugin: "0x0F09669588952cA48368dd8361662D549CcCE987" as Address,

        crossChain: "0xa5B2c9194131A4E0BFaCbF9E5D6722c873159cb7" as Address,
    }
}

const price = {
    lh: {
        oracleAssetlink: parseEther("0.005"),
        validatorBuild: parseEther("0.1"),
    },
    bsctest: {
        oracleAssetlink: parseEther("0.001"),
        validatorBuild: parseEther("0.01"),
    },
}

const chains = {
    lh: [greenfieldTestnet, hardhat],
    bsctest: [greenfieldTestnet, bscTestnet],
}

const greenfieldChain = {
    lh: greenfieldTestnet,
    bsctest: greenfieldTestnet,
}

const mainChain = {
    lh: hardhat,
    bsctest: bscTestnet,
}

const startBlock = {
    lh: 0,
    bsctest: 60727665,
}

const confirmations = {
    lh: 0,
    bsctest: 10,
}

type ChainEnv = "lh" | "bsctest";
const chainEnv: ChainEnv = chainProfile()

export const appConfig = {
    // @ts-ignore
    isLocalhost: chainEnv === "lh",
    baseClientUrl: apiClientUrl(),

    contracts: contracts[chainEnv]!!,
    prices: price[chainEnv]!!,
    chains: chains[chainEnv]!! as [AppKitNetwork, ...AppKitNetwork[]],
    greenfieldChain: greenfieldChain[chainEnv]!!,
    mainChain: mainChain[chainEnv]!!,
    startBlock: startBlock[chainEnv]!!,
    confirmations: confirmations[chainEnv]!!,

    appKit: {
        projectId: projectId(),
        metadata: {
            name: 'Open Store Studio',
            description: 'Create and Publish decentralized apps',
            url: 'https://openstore.foundation',
            icons: []
        },
        chains: chains[chainEnv]!! as [AppKitNetwork, ...AppKitNetwork[]],
        features: {
            analytics: false,
            walletFeaturesOrder: [],
            connectMethodsOrder: ["wallet"],
            socials: false,
            email: false,
            send: false,
            receive: false,
            onramp: false,
            swaps: false,
        } as Features
    },

    greenfieldAuthTtl: gfAuthTtl(),
    etherscanKey: etherscanKey(),
    provider: () => window.ethereum!,

    defaultAppProtocolId: ProtocolId.Greenfield,
    defaultBucketPlaceholder: "bucket-placeholder",
    defaultBucketTopUp: 0.01,
    defaultGlobalFamilyGroup: 1,

    maxDevNameLength: 50,
    maxOwnerCerts: 10,
    maxCertCount: 5,

    buildQuoteMultiplayer: 10,
}

function etherscanKey() {
    return import.meta.env.VITE_ETHERSCAN_KEY!!
}

function projectId() {
    return import.meta.env.VITE_WAGMI_PROJECT_ID!!
}

function chainProfile(): ChainEnv {
    return import.meta.env.VITE_CHAIN_NAME as ChainEnv || "bsctest"
}

function apiClientUrl() {
    return import.meta.env.VITE_CLIENT_API_URL || "http://localhost:8081";
}

function gfAuthTtl() {
    return Number(import.meta.env.VITE_GREENFEILD_AUTH_TL) || 7 * 24 * 60 * 60 * 1000;
}
