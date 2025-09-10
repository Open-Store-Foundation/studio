import Decimal from "decimal.js";
import {formatEther} from "ethers";

export const wei = BigInt(10 ** 18).toString()
export const gwei  = BigInt(10 ** 9).toString()

export const ZERO = dec(0)
export const ONE = dec(1)

export function mulNumber(a: number, b: number, fixed: number = 2): string {
    return dec(a).mul(b)
        .toNumber()
        .toFixed(fixed)
}

export function absMulNumber(a: number, b: number, fixed: number = 2): string {
    return dec(a).mul(b)
        .abs()
        .toNumber()
        .toFixed(fixed)
}

export function formatBigNumber(value: bigint, fixed?: number): number {
    return formatDecimal(Number(formatEther(value)), fixed)
}

export function formatDecimal(value: number, fixed?: number): number {
    if (value === 0) return 0;

    const absValue = Math.abs(value);
    const exponent = Math.floor(Math.log10(absValue)); // Find the order of magnitude
    const precision = fixed ? fixed : exponent < 0 ? Math.abs(exponent) + 2 : 2; // Ensure two significant decimal places

    return parseFloat(value.toFixed(precision));
}

export type BigDecimal = Decimal
export type BigNumber = string | number

export function dec(n: Decimal.Value): BigDecimal {
    return new Decimal(n)
}
