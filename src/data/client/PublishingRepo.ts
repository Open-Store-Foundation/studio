import {Address, ProtocolId, ReqTypeId, TrackId} from "@data/CommonModels.ts";
import {HttpResponse, sendApiRequest} from "@net/core/client";
import {AxiosResponse} from "axios";

/**
 * Represents the verification status of an object.
 */
export enum ApkValidationStatus {
    Unavailable = 0,

    Success = 1,

    InvalidApkFormat = 10,
    InvalidSignBlockFormat = 11,
    Zip64NotSupported = 12,

    TooManySigners = 20,
    NoSignersFound = 21,
    NoDigestFound = 22,

    UnknownSignatureAlgorithm = 30,
    IncorrectEncryptionData = 31,
    SignaturesNotFound = 32,
    InvalidSignature = 33,

    DigestAndSignatureAlgorithmsMismatch = 40,
    PreviousDigestForSameAlgorithmMismatch = 41,

    NoCertificatesFound = 50,
    PubKeyFromCertMismatch = 51,

    NoKnownDigestToCheck = 60,
    DigestMismatch = 61,
    TooManyChunks = 62,
    DigestAlgorithmNotFound = 63,

    ProofNotFound = 70,
    IncorrectEncryptionData1 = 71,
    VersionIsOutdated = 72,
    AssetlinkIsNotVerified = 73,
    PublicKeyFormat = 74,
    InvalidProof = 75,
}

/**
 * Represents an artifact.
 * Field names are camelCase as expected in the JSON payload.
 */
export interface Artifact {
    id: number;
    refId: string;
    objectAddress: Address;
    protocolId: ProtocolId;
    size: number;
    versionName?: string;
    versionCode: number;
}

/**
 * Represents a publishing entry.
 * Direct field names are snake_case, while the 'artifact' field's content is camelCased.
 */
export interface Publishing {
    id: number;
    objectAddress: Address;
    trackId: TrackId;
    artifact: Artifact;
    isActive: boolean;
}

/**
 * Represents a build request.
 * Field names are camelCase as expected in the JSON payload.
 */
export interface BuildRequest {
    id: number;
    requestTypeId: ReqTypeId;
    objectAddress: Address;
    trackId: TrackId;
    status?: number;
    versionCode: number;
    ownerVersion: number;
}

/**
 * Represents the response from the Android publishing status endpoint.
 * Direct field names are snake_case.
 */
export interface AndroidPublishingResponse {
    published: Publishing[];
    reviewing: BuildRequest[];
}

export class PublishingRepo {

    async getPublishing(appAddress: Address): Promise<AndroidPublishingResponse> {
        const data = await sendApiRequest(
            {
                url: `/v1/object/status/${appAddress}`,
                method: "GET",
            },
            (response: AxiosResponse<HttpResponse<AndroidPublishingResponse>>) => {
                return response.data.data
            }
        )

        return data
    }
}