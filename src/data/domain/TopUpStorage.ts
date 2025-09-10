import {TopUpOption} from "@screens/forms/TopupForm.tsx";
import {mulNumber} from "@utils/decimal.ts";

export enum TopUpOptions {
    Skip = "skip",
    Low = "low",
    Medium = "medium",
    Huge = "huge",
}

export class TopUpStorage {

    static async prepareUploadTopUpOptions(usdRate: number) {
        const options: TopUpOption[] = [
            {
                id: TopUpOptions.Low,
                bnbAmount: 0.01,
                bnbAmountFormat: "0.01",
                usdAmount: `about $${mulNumber(0.01, usdRate)}`,
                months: "",
                band: null,
                bandColor: null,
                isAmount: true,
            },
            {
                id: TopUpOptions.Medium,
                bnbAmount: 0.05,
                bnbAmountFormat: "0.05",
                usdAmount: `about $${mulNumber(0.05, usdRate)}`,
                months: "",
                band: "Best",
                bandColor: "success.main",
                isAmount: true,
            },
            {
                id: TopUpOptions.Huge,
                bnbAmount: 0.1,
                bnbAmountFormat: "0.1",
                usdAmount: `about $${mulNumber(0.1, usdRate)}`,
                months: "",
                band: null,
                bandColor: null,
                isAmount: true,
            }
        ];

        return options;
    }
}