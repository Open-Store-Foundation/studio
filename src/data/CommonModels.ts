
export type Address = string & `0x${string}`;

export enum ProtocolId {
    Greenfield = 1,
    BSC = 2,
}

export class ProtocolIdUtil {
    static getProtocolName(id: ProtocolId) {
        if (id === ProtocolId.Greenfield) {
            return 'Greenfield';
        }

        if (id === ProtocolId.BSC) {
            return 'Binance Smart Chain';
        }

        throw new Error(
            `Unknown protocol id: ${id}`
        )
    }
}

export interface AppOwnerInfo {
    domain: string;
    proofs: AppCertificateProof[]
}

export interface AppCertificateProof {
    ordinal: number;
    fingerprint: string;
    proof: string;
}

export class AppCertificateProofFactory {
    static emptyProof(id: number): AppCertificateProof {
        return {ordinal: id, fingerprint: "", proof: ""}
    }

    static defaultProof(fingerprint: string, proof: string): AppCertificateProof {
        return {ordinal: -1, fingerprint: fingerprint, proof: proof}
    }
}

export enum ReqTypeId {
    AndroidBuild = 1
}

export enum TrackId {
    None = 0,
    Release = 1,
    Beta = 2,
    Alpha = 3,
}

export enum AndroidTypeId {
    App = 1,
    Game = 2,
}

export enum PlatformId {
    Android = 1,
    iOS = 2,
    Windows = 3,
    Macos = 4,
    Linux = 5,
    Web = 6,
    CLI = 7,
}

export type CategoryId = AppCategoryId | GameCategoryId

export enum AppCategoryId {
    BooksAndReference = 1,
    Business = 2,
    DeveloperTools = 3,
    Education = 4,
    Entertainment = 5,
    Finance = 6,
    FoodAndDrink = 7,
    GraphicsAndDesign = 8,
    HealthAndFitness = 9,
    Lifestyle = 10,
    MagazinesAndNewspapers = 11,
    Medical = 12,
    Music = 13,
    Navigation = 14,
    News = 15,
    PhotoAndVideo = 16,
    Productivity = 17,
    Shopping = 18,
    SocialNetworking = 19,
    Sports = 20,
    Travel = 21,
    Utilities = 22,
    Weather = 23,
}

export enum GameCategoryId {
    Action = 101,
    Adventure = 102,
    Arcade = 103,
    Board = 104,
    Card = 105,
    Casino = 106,
    Casual = 107,
    Dice = 108,
    Educational = 109,
    Family = 110,
    Music = 111,
    Puzzle = 112,
    Racing = 113,
    RolePlaying = 114,
    Simulation = 115,
    Sports = 116,
    Strategy = 117,
    Trivia = 118,
    Word = 119,
}