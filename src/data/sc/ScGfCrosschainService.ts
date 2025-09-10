import {ScBaseService} from "@data/sc/ScBaseService.ts";
import {CacheKeys} from "@data/cache.ts";
import {appConfig} from "@config";

export class ScGfCrosschainService extends ScBaseService {

    static async relayFeesTotal() {
        const { relayFee } = await ScGfCrosschainService.relayFees()
        return relayFee // + minAckRelayFee
    }

    static async relayFees() {
        return ScBaseService.cache().getOrLoad<{ relayFee: bigint, minAckRelayFee: bigint }>(
            CacheKeys.Relay.key,
            CacheKeys.Relay.ttl,
            async () => {
                let data;

                if (!appConfig.isLocalhost) {
                    data = await ScBaseService.reader.readContract(
                        {
                            abi: [
                                {
                                    "inputs": [],
                                    "name": "getRelayFees",
                                    "outputs": [
                                        {
                                            "internalType": "uint256",
                                            "name": "_relayFee",
                                            "type": "uint256"
                                        },
                                        {
                                            "internalType": "uint256",
                                            "name": "_minAckRelayFee",
                                            "type": "uint256"
                                        }
                                    ],
                                    "stateMutability": "view",
                                    "type": "function"
                                }
                            ],
                            address: appConfig.contracts.crossChain,
                            functionName: "getRelayFees",
                            args: [],
                        }
                    )
                } else {
                    data = [6000000000000n, 400000000000000n]
                }


                return { relayFee: data[0], minAckRelayFee: data[1] }
            }
        )
    }
}