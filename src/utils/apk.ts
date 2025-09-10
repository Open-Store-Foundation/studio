import {inflateRaw} from "pako";
import { Buffer } from "buffer";
import {calculate_streaming_blake3} from "@utils/blake3.ts";

export interface ApkInfo {
    packageName: string;
    versionCode: number;
    versionName: string;
    fileSize: number;
    checksum: string;
}

export class ApkParser {

    static async calculateApkInfoDirect(apkPath: File) {
        
        const buffer = await ApkParser.extractAndroidManifest(apkPath)

        let offset = 0;

        // Read the AXML file header: magic number and file size (8 bytes total)
        // const magic = buffer.readUInt32LE(offset);
        offset += 4;
        // const fileSize = buffer.readUInt32LE(offset);
        offset += 4;
        // (You might want to check the magic value here.)

        // --- Parse the String Pool chunk ---
        // The string pool chunk should start here and has type 0x0001.
        const stringPoolChunkType = buffer.readUInt16LE(offset);
        if (stringPoolChunkType !== 0x0001) {
            throw new Error("Expected string pool chunk (type 0x0001), got: " + stringPoolChunkType);
        }
        offset += 2;

        // Header size and overall chunk size for the string pool.
        // const stringPoolHeaderSize = buffer.readUInt16LE(offset);
        offset += 2;
        const stringPoolChunkSize = buffer.readUInt32LE(offset);
        offset += 4;

        // String pool header values:
        //   - stringCount: number of strings in the pool.
        //   - styleCount: number of style entries (often 0).
        //   - flags: encoding flags (bit 8 set indicates UTF-8, otherwise UTF-16).
        //   - stringsStart: offset from the start of this chunk to the string data.
        //   - stylesStart: offset for style data (not used here).
        const stringCount = buffer.readUInt32LE(offset);
        offset += 4;
        // const styleCount = buffer.readUInt32LE(offset);
        offset += 4;
        // const flags = buffer.readUInt32LE(offset);
        offset += 4;
        const stringsStart = buffer.readUInt32LE(offset);
        offset += 4;
        // const stylesStart = buffer.readUInt32LE(offset);
        offset += 4;

        // Read the array of string offsets (one 32-bit integer per string)
        const stringOffsets: number[] = [];
        for (let i = 0; i < stringCount; i++) {
            stringOffsets.push(buffer.readUInt32LE(offset));
            offset += 4;
        }

        // The string data begins at the start of the string pool chunk plus stringsStart.
        // (The string pool chunk starts immediately after the 8-byte file header.)
        const stringPoolChunkStart = 8;
        const stringDataOffset = stringPoolChunkStart + stringsStart;

        // Extract the strings into an array.
        const strings: string[] = [];
        for (let i = 0; i < stringCount; i++) {
            const strOffset = stringDataOffset + stringOffsets[i];
            // For UTF-16 strings, the first 2 bytes denote the character length.
            const strLen = buffer.readUInt16LE(strOffset);
            // Read the string (each character is 2 bytes)
            const str = buffer.toString('utf16le', strOffset + 2, strOffset + 2 + strLen * 2);
            strings.push(str);
        }

        // Move the offset to the end of the string pool chunk.
        const stringPoolChunkEnd = stringPoolChunkStart + stringPoolChunkSize;
        offset = stringPoolChunkEnd;

        const data = {} as ApkInfo
        data.fileSize = apkPath.size;
        data.checksum = await calculate_streaming_blake3(apkPath)

        // --- Scan for the <manifest> start tag ---
        // In AXML, the start tag chunk has type 0x0102.
        while (offset < buffer.length) {
            const chunkType = buffer.readUInt16LE(offset);
            const headerSize = buffer.readUInt16LE(offset + 2);
            const chunkSize = buffer.readUInt32LE(offset + 4);

            // Check for start tag chunk (type 0x0102)
            if (chunkType === 0x0102) {
                // In the start tag chunk:
                //   - At offset+20: the name index for the element name.
                //   - At offset+28: 2 bytes giving the number of attributes.
                const nameIndex = buffer.readUInt32LE(offset + 20);
                const elementName = strings[nameIndex];
                if (elementName === "manifest") {
                    // Read attribute count (2 bytes at offset+28)
                    const attributeCount = buffer.readUInt16LE(offset + 28);
                    // Attributes start at the end of the header (headerSize), not at offset+32
                    let attrOffset = offset + headerSize;
                    for (let i = 0; i < attributeCount; i++) {
                        const attrNameIndex = buffer.readUInt32LE(attrOffset + 4);
                        // Read the attribute's data value (32-bit int) from offset + 16 in the attribute structure
                        const attrData = buffer.readUInt32LE(attrOffset + 16);
                        const attrName = strings[attrNameIndex];
                        if (attrName === "versionCode") {
                            data.versionCode = attrData;
                        }
                        if (attrName === "versionName") {
                            // For package, the value is usually stored as a string.
                            // Check the value string index (stored at offset+8).
                            const valueStringIndex = buffer.readInt32LE(attrOffset + 8);
                            if (valueStringIndex !== -1) {
                                data.versionName = strings[valueStringIndex];
                            }
                        }
                        if (attrName === "package") {
                            // For package, the value is usually stored as a string.
                            // Check the value string index (stored at offset+8).
                            const valueStringIndex = buffer.readInt32LE(attrOffset + 8);
                            if (valueStringIndex !== -1) {
                                data.packageName = strings[valueStringIndex];
                            }
                        }
                        attrOffset += 20; // each attribute is 20 bytes
                    }
                }
            }
            offset += chunkSize;
        }

        return data;
    }

    /**
     * Extracts the AndroidManifest.xml file from an APK.
     * @param apkPath - The path to the APK file.
     * @returns A Buffer containing the extracted AndroidManifest.xml data.
     * @throws An error if the file cannot be found or the compression method is unsupported.
     */
    private static async extractAndroidManifest(apkPath: File): Promise<Buffer> {
        const { tailBuf, eocdRelative } = await this.findEocd(apkPath)
        const { centralDirOffset, centralDirSize } = this.parseCentralDirectoryInfo(tailBuf, eocdRelative)
        const cdBuf = await this.readCentralDirectory(apkPath, centralDirOffset, centralDirSize)
        const manifestEntry = this.findAndroidManifestEntry(cdBuf)
        if (!manifestEntry) {
            throw new Error('AndroidManifest.xml not found in the APK')
        }
        const localHeader = Buffer.from(
            await apkPath.slice(manifestEntry.localHeaderOffset, manifestEntry.localHeaderOffset + 30).arrayBuffer()
        )
        if (localHeader.readUInt32LE(0) !== 0x04034b50) {
            throw new Error('Invalid local file header signature')
        }
        const localFileNameLength = localHeader.readUInt16LE(26)
        const localExtraFieldLength = localHeader.readUInt16LE(28)
        const fileDataStart = manifestEntry.localHeaderOffset + 30 + localFileNameLength + localExtraFieldLength
        const fileDataBuf = Buffer.from(
            await apkPath.slice(fileDataStart, fileDataStart + manifestEntry.compressedSize).arrayBuffer()
        )
        if (manifestEntry.compressionMethod === 0) {
            return fileDataBuf
        } else if (manifestEntry.compressionMethod === 8) {
            return Buffer.from(inflateRaw(fileDataBuf))
        } else {
            throw new Error('Unsupported compression method: ' + manifestEntry.compressionMethod)
        }
    }

    /**
     * Reads the APK tail and locates the End Of Central Directory (EOCD) record.
     * Returns the tail buffer, its absolute start offset, and the EOCD offset within that buffer.
     */
    private static async findEocd(apkPath: File): Promise<{ tailBuf: Buffer; tailStart: number; eocdRelative: number; }> {
        const fileSize = apkPath.size
        const minEOCDSize = 22
        const maxCommentLength = 0xffff
        const tailSize = Math.min(fileSize, maxCommentLength + minEOCDSize)
        const tailStart = fileSize - tailSize
        const tailBuf = Buffer.from(await apkPath.slice(tailStart, fileSize).arrayBuffer())
        let eocdRelative = -1
        for (let i = tailBuf.length - minEOCDSize; i >= 0; i--) {
            if (tailBuf.readUInt32LE(i) === 0x06054b50) {
                eocdRelative = i
                break
            }
        }
        if (eocdRelative === -1) {
            throw new Error("End of Central Directory not found")
        }
        return { tailBuf, tailStart, eocdRelative }
    }

    /**
     * Parses the EOCD to obtain central directory absolute offset and size.
     */
    private static parseCentralDirectoryInfo(tailBuf: Buffer, eocdRelative: number): { centralDirOffset: number; centralDirSize: number } {
        const centralDirSize = tailBuf.readUInt32LE(eocdRelative + 12)
        const centralDirOffset = tailBuf.readUInt32LE(eocdRelative + 16)
        return { centralDirOffset, centralDirSize }
    }

    /**
     * Reads the central directory slice from the APK using its offset and size.
     */
    private static async readCentralDirectory(apkPath: File, centralDirOffset: number, centralDirSize: number): Promise<Buffer> {
        return Buffer.from(await apkPath.slice(centralDirOffset, centralDirOffset + centralDirSize).arrayBuffer())
    }

    /**
     * Scans the central directory buffer and returns the entry describing AndroidManifest.xml.
     */
    private static findAndroidManifestEntry(cdBuf: Buffer): null | {
        localHeaderOffset: number;
        compressedSize: number;
        uncompressedSize: number;
        compressionMethod: number;
    } {
        let offset = 0
        while (offset + 46 <= cdBuf.length) {
            const sig = cdBuf.readUInt32LE(offset)
            if (sig !== 0x02014b50) break
            const fileNameLength = cdBuf.readUInt16LE(offset + 28)
            const extraFieldLength = cdBuf.readUInt16LE(offset + 30)
            const fileCommentLength = cdBuf.readUInt16LE(offset + 32)
            const localHeaderOffset = cdBuf.readUInt32LE(offset + 42)
            const compressionMethod = cdBuf.readUInt16LE(offset + 10)
            const compressedSize = cdBuf.readUInt32LE(offset + 20)
            const uncompressedSize = cdBuf.readUInt32LE(offset + 24)
            const nameStart = offset + 46
            const nameEnd = nameStart + fileNameLength
            const fileName = cdBuf.toString('utf8', nameStart, nameEnd)
            if (fileName === 'AndroidManifest.xml') {
                return {
                    localHeaderOffset,
                    compressedSize,
                    uncompressedSize,
                    compressionMethod,
                }
            }
            offset += 46 + fileNameLength + extraFieldLength + fileCommentLength
        }
        return null
    }

}
