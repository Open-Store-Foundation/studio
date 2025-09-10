import {useNavigate, useParams, useSearchParams} from "react-router";
import {useMemo, useState} from "react";
import {Address} from "@data/CommonModels.ts";
import {useAsyncEffect} from "@utils/state.ts";
import {ScDevService} from "@data/sc/ScDevService.ts";
import {addParamsToPath} from "@utils/url.ts";
import { useSafeAccount } from "./useSafeAccount";

export function useDevIdParams() {
    const navigate = useNavigate();

    const { devId } = useParams();
    const { address } = useSafeAccount();
    const [params] = useSearchParams();

    const devAddr = useMemo(() => params.get("devAddress") as Address | null, [])
    const [devAddress, setDevAddress] = useState<Address | null>(devAddr)

    const [isFetching, setFetching] = useState<boolean>(devAddr == null)

    useAsyncEffect(async () => {
        if (devAddress) {
            return
        }

        const params = new Map();
        try {
            const devAddr = await ScDevService.getDevAddress(devId!, address)
            if (devAddr) {
                setDevAddress(devAddr)
                params.set("devAddress", devAddr)
            }
        } catch (e) {
            console.error(e)
        } finally {
            if (!devAddress) {
                navigate("/", { replace: true });
                window.history.pushState(null, "", window.location.href);
            }
        }

        addParamsToPath(params)
        setFetching(false)
    }, [])

    return {
        devId: devId!,
        devAddress: devAddress ?? "0x",
        address,
        isFetching,
    }
}
