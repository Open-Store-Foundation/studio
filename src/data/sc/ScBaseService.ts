import {useCache, useGraph, useGasProvider, useWallet} from "@di";
import {PluginMulticallAbi} from "@data/sc/abi/PluginMulticall.ts";
import {appConfig} from "@config";
import {Address} from "@data/CommonModels.ts";
import {BytesLike} from "ethers";
import { InsufficientFundsError } from "viem";

export interface ScMulticallData {
    manager: Address,
    plugin: Address,
    data: BytesLike,
    value: bigint,
}

export enum EstimationHandlingError {
    OUT_OF_FUNDS
}

export type EstimationResult = {result: bigint | undefined, error: EstimationHandlingError | undefined};

export abstract class ScBaseService {

    protected static get wallet() {
        return useWallet()
    }

    protected static get graph() {
        return useGraph()
    }

    protected static get reader() {
        return this.wallet.read
    }

    protected static async gasPrice() {
        return await useGasProvider()
            .getGasPrice()
    }

    protected static cache() {
        return useCache()
    }

    static async getBalance(address: Address) {
        return await this.reader.getBalance({ address })
    }

    protected static async accountWriter() {
        const write = this.wallet.write()
        const [account] = await write.getAddresses()
        return { account, writer: write }
    }

    protected static paramsMulticall(
        account: Address,
        calldata: ScMulticallData[],
        value: bigint,
    ) {
        return {
            abi: PluginMulticallAbi,
            address: appConfig.contracts.multicall,
            functionName: "multicall",
            args: [calldata],
            value: value,
            account: account,
        }
    }

    protected static async estimateContract(params: (account: Address) => any): Promise<EstimationResult> {
        const {account} = await this.accountWriter();

        try {
            const calldata = await params(account)
            console.log("estimateContract", calldata)
            const gas = await this.reader.estimateContractGas(calldata)

            const price = await this.gasPrice()
            return { result: gas * price, error: undefined }
        } catch (err: any) {
            console.error(err)

            const isInsufficientFundsError = err instanceof InsufficientFundsError
                // || err.walk((e: any) => e instanceof InsufficientFundsError)

            if (isInsufficientFundsError) {
                return { result: undefined, error: EstimationHandlingError.OUT_OF_FUNDS }
            }

            throw err;
        }
    }

    protected static async callContract(params: (account: Address) => any) {
        const {account, writer} = await this.accountWriter();

        const calldata = await params(account)
        console.log("estimateContract", calldata)
        const { request } = await this.reader.simulateContract(calldata)
        // @ts-ignore
        const hash = await writer.writeContract(request)

        const result = await this.reader.waitForTransactionReceipt({
            hash,
            confirmations: appConfig.confirmations
        })

        if (result.status == "reverted") {
            throw new Error(result.status)
        }

        return result
    }
}
