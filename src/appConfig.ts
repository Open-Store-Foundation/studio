import {parseEther} from "viem";
import {greenfieldTestnet, hardhat, bscTestnet} from "@libs/reown/chains.ts";
import {Address, ProtocolId} from "@data/CommonModels";
import type {AppKitNetwork} from "@reown/appkit-common";
import { Features } from "@reown/appkit";

const contracts = {
    lh: {
        devFactory: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9" as Address,
        oracle: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9" as Address,
        store: "0x0165878A594ca255338adfa4d48449f69242Eb8F" as Address,
        multicall: "0x8d90514875B0920FCEb79464045aB56A8aAa3f6B" as Address,

        devAppPlugin: "0x610178dA211FEF7D417bC0e6FeD39F05609AD788" as Address,
        devGfPlugin: "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e" as Address,
        appOwnerPlugin: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853" as Address,
        appDistributionPlugin: "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318" as Address,
        appBuildPlugin: "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6" as Address,

        crossChain: "0xa5B2c9194131A4E0BFaCbF9E5D6722c873159cb7" as Address,
    },
    bsctest: {
        devFactory: "0x7bf2b3901E3198268ec071F43A08dBD365017354" as Address,
        oracle: "0xCA21F6ab7D9Cf14444028394016066778Cbe1B4B" as Address,
        store: "0x4dc802c0E64Eb0C9d9b278F70b6a7d6e21908a46" as Address,
        multicall: "0x3f7AdDD276bC5c1a2Fffb329DD718f1fa0625D84" as Address,

        appOwnerPlugin: "0xD2dfb8a2D0f2b90f3F912566F4c4Fb0a3e9Bc336" as Address,
        appBuildPlugin: "0xe00e09e2028046DE01C9aEc7C683cF0ce08016B1" as Address,
        appDistributionPlugin: "0x76F7A70d7eCf4483Fa08D10511F997c97b247737" as Address,
        devAppPlugin: "0x374DA7507CB00FAEc54fa4226eF6c45eC99bA2E4" as Address,
        devGfPlugin: "0xaE3f8bD0a3112aE5860a72DE494A238997210756" as Address,

        crossChain: "0xa5B2c9194131A4E0BFaCbF9E5D6722c873159cb7" as Address,
    }
}

const price = {
    lh: {
        oracleAssetlink: parseEther("0.005"),
        validatorBuild: parseEther("0"),
    },
    bsctest: {
        oracleAssetlink: parseEther("0.001"),
        validatorBuild: parseEther("0"),
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

function grfdNodeUrl() {
    return import.meta.env.VITE_GREENFIELD_NODE!!
}

function graphNodeUrl() {
    return import.meta.env.VITE_GRAPH_NODE!!
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

type ChainEnv = "lh" | "bsctest";
const chainEnv: ChainEnv = chainProfile()

export const appConfig = {
    // @ts-ignore
    isLocalhost: chainEnv === "lh",
    chainName: chainEnv,
    // TODO maybe I should upload it somewhere
    // TODO from the other side the target user is a dev so it's possible to see actual version with history
    proofGenLUrl: "https://github.com/Open-Store-Foundation/studio/blob/main/src/assets/proof_gen.py",

    clientApiVersion: 1,
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
            url: 'https://studio.openstore.foundation',
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
    graphNodeUrl: graphNodeUrl(),
    grfdNodeUrl: grfdNodeUrl(),
    provider: () => window.ethereum!,

    defaultAppProtocolId: ProtocolId.Greenfield,
    defaultBucketPlaceholder: "bucket-placeholder",
    defaultBucketTopUp: 0.01,
    defaultGlobalFamilyGroup: 1,
    protocolVersion: 0,

    maxDevNameLength: 50,
    maxOwnerCerts: 10,
    maxCertCount: 5,

    buildQuoteMultiplayer: 10,
}

export function isProtocolZero() {
    return appConfig.protocolVersion === 0;
}
