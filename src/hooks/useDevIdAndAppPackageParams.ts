import {useNavigate, useParams, useSearchParams} from "react-router";
import {useMemo, useState} from "react";
import {Address} from "@data/CommonModels.ts";
import {useAsyncEffect} from "@utils/state.ts";
import {ScDevService} from "@data/sc/ScDevService.ts";
import {ScAssetService} from "@data/sc/ScAssetService.ts";
import {addParamsToPath} from "@utils/url.ts";
import { useSafeAccount } from "./useSafeAccount";

export function useDevIdAndAppPackageParams() {
    const navigate = useNavigate();

    const { devId, appPackage } = useParams();
    const { address } = useSafeAccount();
    const [params] = useSearchParams();

    const da = useMemo(() => params.get("devAddress") as Address | null, [])
    const [devAddress, setDevAddress] = useState<Address | null>(da)

    let aa = useMemo(() => params.get("appAddress") as Address | null, [])
    const [addAddress, setAppAddress] = useState<Address | null>(aa)
    const [isFetching, setFetching] = useState<boolean>(da == null || aa == null)

    useAsyncEffect(async () => {
        if (devAddress && addAddress) {
            return
        }

        const params = new Map();

        try {
            if (!devAddress) {
                const devAddr = await ScDevService.getDevAddress(devId!, address)
                if (devAddr) {
                    setDevAddress(devAddr)
                    params.set("devAddress", devAddr)
                }
            }

            if (!addAddress) {
                const appAddr = await ScAssetService.getAppAddress(appPackage!, devAddress!)
                if (appAddr) {
                    setAppAddress(appAddr)
                    params.set("appAddress", appAddr)
                }
            }
        } catch (e) {
            console.error(e)
        } finally {
            if (!devAddress || !addAddress) {
                navigate("/", { replace: true });
                window.history.pushState(null, "", window.location.href);
            }
        }

        addParamsToPath(params)
        setFetching(false)
    }, [])

    return {
        devId: devId!,
        appPackage: appPackage!,

        devAddress: devAddress ?? "0x",
        appAddress: addAddress ?? "0x",

        address,
        isFetching,
    }
}