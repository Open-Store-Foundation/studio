import axios, {AxiosInstance} from 'axios';
import applyCaseMiddleware from 'axios-case-converter';
import {
    PaymentQueryParamsResponse,
    QueryGetStreamRecordResponse,
    QueryGlobalSpStorePriceByTimeResponse,
    QueryMsgGasParamsResponse,
    StorageQueryParamsResponse
} from './GreenfieldFeeClient.ts';
import {QueryDynamicBalanceResponse} from './gf_mirror.ts';

export interface GetMsgGasParamsRequest {
    msgTypeUrls: string[];
}

export interface GetQueryGlobalSpStorePriceByTimeRequest {
    timestamp: bigint;
}

export class PaymentClient {
    constructor(private http: AxiosInstance) {}

    async getStreamRecord(address: string): Promise<QueryGetStreamRecordResponse> {
        const response = await this.http.get(`/greenfield/payment/stream_record/${address}`);
        return response.data;
    }

    async params(): Promise<PaymentQueryParamsResponse> {
        const response = await this.http.get('/greenfield/payment/params');
        return response.data;
    }

    async dynamicBalance(request: { account: string }): Promise<QueryDynamicBalanceResponse> {
        const response = await this.http.get(`/greenfield/payment/dynamic_balance/${request.account}`);
        return response.data;
    }
}

export class GashubClient {
    constructor(private http: AxiosInstance) {}

    async getMsgGasParams(request: GetMsgGasParamsRequest): Promise<QueryMsgGasParamsResponse> {
        const params = new URLSearchParams();
        request.msgTypeUrls.forEach(url => params.append('msg_type_urls', url));
        const response = await this.http.get(`/cosmos/gashub/v1beta1/msg_gas_params?${params.toString()}`);
        return response.data;
    }
}

export class SpClient {
    constructor(private http: AxiosInstance) {}

    async getQueryGlobalSpStorePriceByTime(request: GetQueryGlobalSpStorePriceByTimeRequest): Promise<QueryGlobalSpStorePriceByTimeResponse> {
        const response = await this.http.get(`/greenfield/sp/global_sp_store_price_by_time/${request.timestamp.toString()}`);
        return response.data;
    }

    // {
    //     "storageProvider": {
    //         "id": 7,
    //         "operator_address": "0x5FFf5A6c94b182fB965B40C7B9F30199b969eD2f",
    //         "funding_address": "0x90ff75f85325E35B9f67BBB3BdF4ed51f775991D",
    //         "seal_address": "0x79c99D63984B59Bad67cA9746999db88754DDBF7",
    //         "approval_address": "0xF167f89b37a04c4347B5Bebf6d0C12da501afD36",
    //         "gc_address": "0xb988F202525948E6d5BE668c11107b9B01CEaCE6",
    //         "maintenance_address": "0x8E834b562509bF84112d101fA39b16046577a7b5",
    //         "total_deposit": "981026307703708764166",
    //         "status": "STATUS_IN_SERVICE",
    //         "endpoint": "https://gnfd-testnet-sp3.nodereal.io",
    //         "description": {
    //             "moniker": "nodereal-sp3",
    //             "identity": "",
    //             "website": "https://gnfd-testnet-sp3.nodereal.io",
    //             "security_contact": "",
    //             "details": "nodereal-sp3"
    //         },
    //         "bls_key": "sNhNleZZzVCpEHAu22idoJ/3zrLNCl7D3oi+DHUPam9p536lX40WodsBKeEaJT3T"
    //     }
    // }
    async getStorageProvider(id: number): Promise<any> {
        const response = await this.http.get(`/greenfield/storage_provider/${id}`);
        return response.data.storageProvider;
    }

    async getStorageProviders(): Promise<any[]> {
        const response = await this.http.get('/greenfield/storage_providers');
        return response.data.sps;
    }
}

export class StorageClient {
    constructor(private http: AxiosInstance) {}

    async params(): Promise<StorageQueryParamsResponse> {
        const response = await this.http.get('/greenfield/storage/params');
        return response.data;
    }
}

export class BucketClient {
    constructor(private http: AxiosInstance) {}

    async headBucketExtra(bucketName: string): Promise<any> {
        const response = await this.http.get(`/greenfield/storage/head_bucket_extra/${bucketName}`);
        return response.data;
    }

    async headBucket(bucketName: string): Promise<any> {
        const response = await this.http.get(`/greenfield/storage/head_bucket/${bucketName}`);
        return response.data;
    }
}

export class ObjectClient {
    constructor(private http: AxiosInstance) {}

    async listObjects(request: { bucketName: string; endpoint: string; query: URLSearchParams }): Promise<any> { // TODO
        const response = await this.http.get(`/greenfield/storage/list_objects/${request.bucketName}?${request.query.toString()}`);
        return response.data;
    }
}

export class VirtualGroupClient {
    constructor(private http: AxiosInstance) {}

    // {
    //     "global_virtual_groups": [
    //         {
    //             "id": 1,
    //             "family_id": 1,
    //             "primary_sp_id": 7,
    //             "secondary_sp_ids": [
    //                 1,
    //                 2,
    //                 3,
    //                 4,
    //                 5,
    //                 6
    //             ],
    //             "stored_size": "28366",
    //             "virtual_payment_address": "0x6213Aa806da2bACF7Cc7b5Fea702cf618077DE80",
    //             "total_deposit": "140737488355328000"
    //         },
    //         {
    //             "id": 449,
    //             "family_id": 1,
    //             "primary_sp_id": 7,
    //             "secondary_sp_ids": [
    //                 2,
    //                 3,
    //                 4,
    //                 5,
    //                 6,
    //                 14
    //             ],
    //             "stored_size": "127178",
    //             "virtual_payment_address": "0xa2A01522caE82a4974dA261bd25a388Ff3feD2A8",
    //             "total_deposit": "35184372088832000"
    //         }
    //     ]
    // }
    async getGlobalVirtualGroupFamilyId(request: { familyId: number }): Promise<any> {
        const response = await this.http.get(`/greenfield/virtualgroup/global_virtual_group_by_family_id?global_virtual_group_family_id=${request.familyId}`);
        return response.data;
    }

    // {
    //     "global_virtual_group_family": {
    //         "id": 1,
    //         "primary_sp_id": 7,
    //         "global_virtual_group_ids": [
    //             1,
    //             449
    //         ],
    //         "virtual_payment_address": "0x961d08Df33a1cD72Fe712dcD17d6B77D067AEbc7"
    //     }
    // }
    async getGlobalVirtualGroupFamily(request: { familyId: number }): Promise<any> {
        const response = await this.http.get(`/greenfield/virtualgroup/global_virtual_group_family?family_id=${request.familyId}`);
        return response.data.globalVirtualGroupFamily;
    }
}

export class GreenfieldHttpClient {
    public payment: PaymentClient;
    public gashub: GashubClient;
    public sp: SpClient;
    public storage: StorageClient;
    public bucket: BucketClient;
    public object: ObjectClient;
    public virtualGroup: VirtualGroupClient;
    
    private http: AxiosInstance;

    constructor(baseURL: string, config?: any) {
        this.http = applyCaseMiddleware(
            axios.create({
                baseURL,
                timeout: 10_000,
                headers: {
                    'Content-Type': 'application/json',
                },
                ...config
            })
        )

        this.payment = new PaymentClient(this.http);
        this.gashub = new GashubClient(this.http);
        this.sp = new SpClient(this.http);
        this.storage = new StorageClient(this.http);
        this.bucket = new BucketClient(this.http);
        this.object = new ObjectClient(this.http);
        this.virtualGroup = new VirtualGroupClient(this.http);
    }
}