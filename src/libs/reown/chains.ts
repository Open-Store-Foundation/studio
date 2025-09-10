import {Chain} from "viem/chains";
import {defineChain} from "viem";

export const greenfieldTestnet: Chain = /*#__PURE__*/
    defineChain({
            id: 5600,
            name: 'BNB Greenfield Chain Testnet',
            nativeCurrency: {
                name: 'BNB',
                symbol: 'tBNB',
                decimals: 18,
            },
            rpcUrls: {
                default: {
                    http: ['https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org'],
                },
                public: {
                    http: ['https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org'],
                },
            },
            blockExplorers: {
                etherscan: {
                    name: `BNB Greenfield Chain Testnet Scan`,
                    url: 'https://testnet.greenfieldscan.com',
                },
                default: {
                    name: `BNB Greenfield Chain Testnet Scan`,
                    url: 'https://testnet.greenfieldscan.com',
                },
            },
            testnet: true,
        }
    )

export const bscTestnet = /*#__PURE__*/ defineChain({
    id: 97,
    name: 'BNB Smart Chain Testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'BNB',
        symbol: 'tBNB',
    },
    rpcUrls: {
        default: { http: [import.meta.env.VITE_ETH_NODE!!] },
    },
    blockExplorers: {
        default: {
            name: 'BscScan',
            url: 'https://testnet.bscscan.com',
            apiUrl: 'https://api-testnet.bscscan.com/api',
        },
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 17422483,
        },
    },
    testnet: true,
})


export const hardhat = /*#__PURE__*/ defineChain({
    id: 31337,
    name: 'Localhost',
    nativeCurrency: {
        decimals: 18,
        name: 'BSC',
        symbol: 'BNB',
    },
    rpcUrls: {
        default: { http: ['http://127.0.0.1:8545'] },
    },
})
