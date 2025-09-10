import {ScAppBuild} from "@data/sc/ScAssetService.ts";
import {ProtocolId} from "@data/CommonModels.ts";
import {numberToBytes32} from "@utils/hex.ts";

export interface GfBuildFile {
    id: number
    versionName: string
    versionCode: number
    checksum: string
    type: string
    path: string
    size: number
    createdAt: number
}

export function toAppBuild(build: GfBuildFile): ScAppBuild {
    return {
        referenceId: numberToBytes32(build.id),
        protocolId: ProtocolId.Greenfield,
        versionName: build.versionName,
        checksum: build.checksum,
        versionCode: build.versionCode,
        size: build.size,
    }
}

export interface GfAuth {
    seeds: string,
    address: string,
}