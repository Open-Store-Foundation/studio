import axios, { AxiosInstance } from 'axios';
import {Log} from "viem";

export interface EtherscanLogsResponse {
    status: string;
    message: string;
    result: Log[];
}

export interface GetLogsParams {
    fromBlock: number;
    topic0: string;
    topic1?: string;
    address?: string;
    toBlock?: number;
    page?: number;
    offset?: number;
}

export class EtherscanClient {
    private http: AxiosInstance;
    private apiKey: string;

    constructor(apiKey: string, chainId: number) {
        this.apiKey = apiKey;
        this.http = axios.create({
            baseURL: 'https://api.etherscan.io/v2/api',
            timeout: 10_000,
            params: {
                chainid: chainId
            }
        });
    }

    async getLogs(params: GetLogsParams): Promise<EtherscanLogsResponse> {
        const response = await this.http.get('', {
            params: {
                module: 'logs',
                action: 'getLogs',
                fromBlock: params.fromBlock,
                toBlock: params.toBlock,
                topic0: params.topic0,
                topic1: params.topic1,
                address: params.address,
                page: params.page || 1,
                offset: params.offset || 1000,
                apikey: this.apiKey
            }
        });

        return response.data;
    }
}