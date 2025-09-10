import { Connector } from "wagmi";

export const signTypedDataCallback = (connector: Connector) => {
    return async (addr: string, message: string) => {
        const provider = await connector.getProvider();
        return await signTypedDataV4(provider, addr, message);
    };
};

export const signTypedDataV4 = async (provider: any, addr: string, message: string) => {
    return await provider?.request({
        method: 'eth_signTypedData_v4',
        params: [addr, message],
    });
};
