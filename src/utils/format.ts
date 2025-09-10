import {absMulNumber, dec, formatBigNumber} from "@utils/decimal.ts";

export const TBNB = "tBNB"
export const BNB = "BNB"

function formatNumberHuman(value: number, fixed?: number): string {
    if (Number.isNaN(value) || !Number.isFinite(value)) {
        return "N/A";
    }

    if (value === 0) {
        return "0";
    }

    if (fixed != null) {
        const fixedString = value.toFixed(fixed);
        return fixedString.includes(".") ? fixedString.replace(/\.?0+$/, "") : fixedString;
    }

    const absoluteValue = Math.abs(value);
    const exponent = Math.floor(Math.log10(absoluteValue));
    const precision = exponent < 0 ? Math.min(18, Math.abs(exponent) + 2) : 2;

    const result = value.toFixed(precision);
    return result.includes(".") ? result.replace(/\.?0+$/, "") : result;
}

export function formatBigIntWithUsd(
    value: bigint,
    usdRate: number | undefined,
    currency: string = BNB
): string {
    const formattedValue = formatBigNumber(value);
    return formatNumberWithUsd(formattedValue, usdRate, currency);
}

export function formatValueWithUsdOrPlaceholder(
    value: bigint | undefined,
    usdRate: number | undefined,
    isLoading?: boolean,
    currency: string = BNB
): string {
    if (value == null) {
        return isLoading ? "Loading..." : "N/A";
    }

    return formatBigIntWithUsd(value, usdRate, currency);
}

export function formatValue(
    value: bigint,
    currency: string,
    fixed?: number,
): string {
    const numericValue = formatBigNumber(value, fixed);
    const human = formatNumberHuman(numericValue, fixed);
    return `${human} ${currency}`;
}

export function formatQuotePriceWithUsd(
    value: number | undefined,
    price: bigint | undefined,
    usdRate: number | undefined,
    isLoading?: boolean,
    currency: string = TBNB,
) {
    if (value === undefined || price == null) {
        return isLoading ? "Loading..." : "N/A";
    }

    let quoteAmount = BigInt(value) * price;
    return formatBigIntWithUsd(quoteAmount, usdRate, currency);
}

export function formatValueOrPlaceholder(
    value: bigint | undefined,
    isLoading?: boolean,
    currency: string = BNB,
    fixed?: number,
): string {
    if (value == null) {
        return isLoading ? "Loading data..." : "N/A";
    }

    return formatValue(value, currency, fixed);
}

export function formatTextOrLoading(
    text: string | undefined,
    isLoading?: boolean,
): string {
    if (text == null) {
        return isLoading ? "Loading..." : "N/A";
    }

    return text;
}

export function formatNumberWithUsd(
    value: number | string,
    usdRate: number | undefined,
    currency: string = BNB,
): string {
    const numericValue = typeof value === "number" ? value : parseFloat(value);
    const human = typeof value === "number" ? formatNumberHuman(value) : value;
    const usd = usdRate ? ` ($${absMulNumber(numericValue, usdRate)})` : "";
    return `${human} ${currency}${usd}`;
}

export function formatNumberToUsd(
    value: number | undefined,
    usdRate: number | undefined,
): string {
    return usdRate && value ? `$${absMulNumber(value, usdRate)}` : "$0.00";
}

export function formatBigIntToUsd(
    value: bigint,
    usdRate: number | undefined
): string {
    const formattedValue = formatBigNumber(value);
    return usdRate ? `$${absMulNumber(formattedValue, usdRate)}` : "";
}

export function formatUsdOrPlaceholder(
    value: bigint | undefined,
    usdRate: number | undefined,
    isLoading?: boolean
): string {
    if (value == null) {
        return isLoading ? "Loading..." : "N/A";
    }

    return formatBigIntToUsd(value, usdRate);
}

const GB = 1024 * 1024 * 1024;

export function formatSizeToGb(num: number) {
    return `${dec(num).div(GB).toNumber().toFixed(0)} GB`;
};

export function toGb(bytes: number) {
    return bytes / GB
}

export function toBytes(gb: number) {
    return BigInt(gb) * BigInt(GB)
}

export function formatSizeOrPlaceholder(
    bytes?: bigint,
    isLoading?: boolean
): string {
    if (bytes == null) {
        return isLoading ? "Loading..." : "N/A";
    }

    return formatSize(Number(bytes));
}

export function formatSize(bytes: number) {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);

    // Ensure we don't show MB for files under 1MB
    if (i === 2 && bytes < k * k) {
        return `${(bytes / k).toFixed(1)} KB`;
    }

    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

export function formatDisplayName(username: string) {
    const words = username.split("-");
    const capitalizedWords = words.map(word => {
        if (word.length === 0) {
            return "";
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
    return capitalizedWords.join(" ");
}