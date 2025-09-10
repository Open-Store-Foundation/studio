import {useAccount} from "wagmi";
import {useNavigate} from "react-router";

export function useSafeAccount(redirect?: string | number) {
    const { address, chainId, connector } = useAccount()
    const navigate = useNavigate();

    if (!address || !chainId) {
        navigate(redirect?.toString() ?? "/", { replace: true });
        window.history.pushState(null, "", window.location.href);
    }

    return {
        address: address ?? "0x",
        chainId: chainId ?? -1,
        isValid: !!address && !!chainId,
        connector: connector,
    };
}
