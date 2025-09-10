import {AppKit, createAppKit} from "@reown/appkit/react";
import {WagmiAdapter} from "@reown/appkit-adapter-wagmi";
import {appConfig} from "@config";

export class AppKitClient {

    config: WagmiAdapter
    modal: AppKit

    constructor(config: WagmiAdapter, modal: AppKit) {
        this.config = config;
        this.modal = modal;
    }

    static create(): AppKitClient  {
        const wagmiAdapter = new WagmiAdapter({
            networks: appConfig.chains,
            projectId: appConfig.appKit.projectId,
        })

        const modal = createAppKit({
            adapters: [wagmiAdapter],
            networks: appConfig.chains,
            projectId: appConfig.appKit.projectId,
            metadata: appConfig.appKit.metadata,
            features: appConfig.appKit.features,
            enableCoinbase: false,
        })

        return new AppKitClient(wagmiAdapter, modal)
    }
}
