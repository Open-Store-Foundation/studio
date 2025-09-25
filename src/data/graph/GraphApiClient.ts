import axios, { AxiosInstance } from 'axios';
import {Address} from "@data/CommonModels.ts";
import {DevAccount} from "@data/sc/ScDevService.ts";
import {ScApp} from "@data/sc/ScAssetService.ts";

// TODO Change format in worker GraphQL
interface GraphApp {
    id: Address,
    appId: string,
    name: string,
}

export class GraphApiClient {
    private http: AxiosInstance;

    constructor(nodeUrl: string) {
        this.http = axios.create({
            baseURL: nodeUrl,
            timeout: 10_000,
        });
    }

    async getPublishers(ownerAddress: Address): Promise<DevAccount[]> {
        const response = await this.http.get(`/publishers/${ownerAddress}`);
        return response.data.accounts;
    }

    async getApps(devAddress: Address): Promise<ScApp[]> {
        const response = await this.http.get(`/apps/${devAddress}`);
        const apps = response.data.apps.map((app: GraphApp, id: number) => {
            const data = {
                id: id,
                address: app.id,
                package: app.appId,
                name: app.name,
                avatar: null,
            } as ScApp;

            return data
        });

        return apps
    }
}
