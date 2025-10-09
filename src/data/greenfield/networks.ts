import {appConfig} from "@config";

export class GreenNetwork {
    rpc: string;
    chainId: string;
    zk: string

    constructor(rpc: string, chainId: string, zk: string) {
        this.rpc = rpc;
        this.chainId = chainId;
        this.zk = zk;
    }

    static Testnet = new GreenNetwork(
        appConfig.grfdNodeUrl,
        "5600",
        "https://unpkg.com/@bnb-chain/greenfield-zk-crypto@0.0.3/dist/node/zk-crypto.wasm"
    )
}
