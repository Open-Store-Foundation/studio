import {AppKitClient} from "@libs/reown/client.ts";
import {GreenfieldClient, GreenNetwork} from "@data/greenfield";
import {TaskClient} from "@data/scheduler/TaskClient.ts";
import {GasProvider} from "@data/sc/GasProvider.ts";
import {WalletClient} from "@libs/viem/client.ts";
import {CoinGeckoClient} from "@data/geco/CoinGeckoClient.ts";
import {TimedCache} from "@utils/cache.ts";
import {PublishingRepo} from "@data/client/PublishingRepo.ts";
import {ApkValidator, PngLogoValidator} from "@utils/validators.ts";
import {GreenfieldHttpClient} from "@data/greenfield/GreenfieldHttpClient.ts";
import { GraphApiClient } from "@data/graph/GraphApiClient.ts";
import {appConfig} from "@config";

class DI {

    private static _instance: DI;

    Web3: AppKitClient = AppKitClient.create()
    Wallet: WalletClient = WalletClient.create()
    Task: TaskClient = TaskClient.create()
    Cache: TimedCache = TimedCache.create()
    Gecko: CoinGeckoClient = new CoinGeckoClient(this.Cache)

    Graph = new GraphApiClient(appConfig.graphNodeUrl);
    GasProvider: GasProvider = new GasProvider(this.Wallet, this.Cache)
    GreenfieldHttpClient: GreenfieldHttpClient = new GreenfieldHttpClient(GreenNetwork.Testnet.rpc)
    Greenfield: GreenfieldClient = new GreenfieldClient(GreenNetwork.Testnet, this.GreenfieldHttpClient, this.GasProvider, this.Cache)

    Repo = {
        Publishing: new PublishingRepo()
    }

    FileValidator = {
        Apk: ApkValidator.getInstance(),
        Png: PngLogoValidator.getInstance(),
    }

    private constructor() {}

    public static get Instance() {
        // Do you need arguments? Make it a regular static method instead.
        return this._instance || (this._instance = new this());
    }
}

export const Injection = DI.Instance;

export function useApkValidator() {
    return Injection.FileValidator.Apk;
}

export function usePngValidator() {
    return Injection.FileValidator.Png;
}

export function useWeb3() {
    return Injection.Web3;
}

export function useWallet() {
    return Injection.Wallet;
}

export function useGraph() {
    return Injection.Graph;
}

export function useTaskManager() {
    return Injection.Task;
}

export function useGasProvider() {
    return Injection.GasProvider;
}

export function useGreenfield() {
    return Injection.Greenfield;
}

export function useGecko() {
    return Injection.Gecko;
}

// export function useCrossChainService() {
//     return Injection.Service.ScChrossChain;
// }

export function usePublishingRepo() {
    return Injection.Repo.Publishing;
}

export function useCache() {
    return Injection.Cache;
}
