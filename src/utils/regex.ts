import {isHexString} from "ethers";

const PACKAGE_REGEX = new RegExp("^[a-zA-Z][a-zA-Z0-9_]*(\\.[a-zA-Z][a-zA-Z0-9_]*){1,}$")
const APP_NAME_REGEX = new RegExp("^(?! )[a-zA-Z0-9\u00C0-\u017F\u0400-\u04FF\u4E00-\u9FFF&@!?#%_.,\\- ]{3,50}(?<! )$")
const SHA256_FINGERPRINT_REGEX = new RegExp("^([0-9A-F]{2}:){31}[0-9A-F]{2}$")

const BACKET_LENGHT_REGEX = new RegExp("^.{5,50}$")
const BACKET_SYMBOLS_REGEX = new RegExp("^[a-z0-9-]+$")
const BACKET_BEGIN_END_REGEX = new RegExp("^[a-zA-Z0-9].*[a-zA-Z0-9]$")


export class Reg {

    static isPackageValid(pack: string): boolean {
        return PACKAGE_REGEX.test(pack) && pack.length < 256
    }

    static isAppNameValid(appName: string): boolean {
        return APP_NAME_REGEX.test(appName) && appName.length <= 50
    }

    static isWebsiteValid(website: string): boolean {
        // try {
        //     new URL(website)
        //     return true
        // } catch (e) {
        //     return false
        // }

        return website.length > 0
    }
    
    static isSha256FingerprintValid(fingerprint: string): boolean {
        return fingerprint.length > 0 && SHA256_FINGERPRINT_REGEX.test(fingerprint.toUpperCase())
    }
    
    static isHexValid(str: string): boolean {
        return str.length > 0 && isHexString(str)
    }

    static isBucketLengthValid(bucket: string): boolean {
        return BACKET_LENGHT_REGEX.test(bucket)
    }

    static isBucketSymbolsValid(bucket: string): boolean {
        return BACKET_SYMBOLS_REGEX.test(bucket)
    }

    static isBucketBeginEndValid(bucket: string): boolean {
        return BACKET_BEGIN_END_REGEX.test(bucket)
    }
}
