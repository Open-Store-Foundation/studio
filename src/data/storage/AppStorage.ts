import {Address} from "@data/CommonModels.ts";

export class AppStorage {
    static setAddress(appPackage: string, address: string, devAddress: string) {
        localStorage.setItem(`app-address-${devAddress}-${appPackage}`, address)
    }

    static getAddress(appPackage: string, devAddress: string): Address | null {
        return localStorage.getItem(`app-address${devAddress}-${appPackage}`) as Address
    }
}
