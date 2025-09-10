
export function numberToBytes32(num: number): string {
    if (num < 0) throw new Error("Number must be non-negative");
    const hex = num.toString(16); // Convert number to hexadecimal
    return "0x" + hex.padStart(64, "0"); // Pad to 32 bytes (64 hex characters)
}
