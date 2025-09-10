import { blake3 } from "@noble/hashes/blake3";
import {toHex} from "viem";

/**
 * Options for streaming BLAKE3 hashing.
 */
export interface StreamingBlake3Options {
    /**
     * Size in bytes for each chunk read from the File. Larger chunks reduce
     * overhead but increase peak memory usage. Defaults to 16 MiB.
     */
    chunkSize?: number;
    /**
     * Callback invoked after each chunk is processed with a value in [0, 1]
     * indicating overall progress.
     */
    onProgress?: (progress: number) => void;
    /**
     * Optional AbortSignal to cancel hashing. If aborted, an Error is thrown.
     */
    signal?: AbortSignal;
}

const DEFAULT_CHUNK_SIZE = 16 * 1024 * 1024;

/**
 * Calculates the BLAKE3 digest of a browser File by incrementally reading and
 * hashing chunks to keep memory usage bounded.
 *
 * @param file The browser File to hash.
 * @param options Optional controls for chunk size, progress reporting, and aborting.
 * @returns The 32-byte BLAKE3 digest as a Uint8Array.
 * @throws Error If the provided AbortSignal is aborted during processing.
 */
export async function calculate_streaming_blake3(
    file: File,
    options?: StreamingBlake3Options
): Promise<string> {
    const chunkSize = options?.chunkSize ?? DEFAULT_CHUNK_SIZE;
    const onProgress = options?.onProgress;
    const signal = options?.signal;
    const hasher = blake3.create();
    const total = file.size || 0;

    if (total === 0) {
        return toHex(hasher.digest());
    }

    let offset = 0;

    while (offset < total) {
        if (signal?.aborted) {
            throw new Error(`Aborted hash calculation for ${file.name}`)
        }

        const end = Math.min(offset + chunkSize, total);
        const buf = await file.slice(offset, end).arrayBuffer();
        hasher.update(new Uint8Array(buf));
        offset = end;

        if (onProgress) onProgress(offset / total);
    }

    const result = hasher.digest()
    return `0x${toHex(result).slice(2).toUpperCase()}`;
}
