import {Address} from "@data/CommonModels.ts";

export class DevStorage {
    static setAddress(devId: string, address: string) {
        localStorage.setItem(`dev-address-${devId}`, address)
    }

    static getAddress(devId: string): Address | null {
        return localStorage.getItem(`dev-address-${devId}`) as Address
    }
}
