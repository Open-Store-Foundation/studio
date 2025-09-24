import {useMemo, useState} from "react";
import {GfAuth} from "@data/greenfield";
import {useAsyncEffect} from "@utils/state.ts";
import {appConfig} from "@config";
import {useGreenfield} from "@di";

export function useGreenfieldAuth(address: string) {
    const client = useGreenfield()
    const cached = useMemo(() => {
        return client.cachedAuth(appConfig.greenfieldChain.id, address)
    }, [])

    const [auth, setAuth] = useState<GfAuth | null>(cached)

    useAsyncEffect(async () => {
        if (cached != null) {
            return
        }

        const result = await client.auth(
            appConfig.greenfieldChain.id, address, appConfig.provider()
        );

        setAuth(result)
    }, []);

    return auth;
}
