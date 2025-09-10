import {getTimestampInMs} from "@utils/date.ts";
import {appConfig} from "@config";

export class AuthStorage {
    static setAuth(chain: number, address: string, auth: string, timestamp: number) {
        localStorage.setItem(`gf-auth-${chain}-${address}`, auth)
        localStorage.setItem(`gf-auth-${chain}-${address}-ttl`, timestamp.toString()) // TODO v2 timezone
    }

    static getAuth(chain: number, address: string): string | null {
        try {
            const time = Number(localStorage.getItem(`gf-auth-${chain}-${address}-ttl`))
            if (time + appConfig.greenfieldAuthTtl < getTimestampInMs()) {
                return null;
            }
        } catch (e) {
            return null;
        }

        return localStorage.getItem(`gf-auth-${chain}-${address}`)
    }
}
