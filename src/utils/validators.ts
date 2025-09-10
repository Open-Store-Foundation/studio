import {str} from "@localization/res.ts";
import {RStr} from "@localization/ids.ts";

export interface FileValidator {
    validate(file: File): Promise<string | null>;
    getAcceptedTypes(): string;
    getDropZoneTitle(): string;
    getDropZoneSubtitle(): string;
}

export class ApkValidator implements FileValidator {
    private static instance: ApkValidator;

    static getInstance(): ApkValidator {
        if (!ApkValidator.instance) {
            ApkValidator.instance = new ApkValidator();
        }
        return ApkValidator.instance;
    }

    async validate(file: File): Promise<string | null> {
        if (!file.name.endsWith('.apk')) { // TODO && !file.name.endsWith('.aab')
            return str(RStr.ApkValidator_error_fileType);
        }

        return null;
    }

    getAcceptedTypes(): string {
        return ".apk,.aab";
    }

    getDropZoneTitle(): string {
        return str(RStr.ApkValidator_dropZone_title);
    }

    getDropZoneSubtitle(): string {
        return str(RStr.ApkValidator_dropZone_subtitle);
    }
}

export class PngLogoValidator implements FileValidator {
    private static instance: PngLogoValidator;

    static getInstance(): PngLogoValidator {
        if (!PngLogoValidator.instance) {
            PngLogoValidator.instance = new PngLogoValidator();
        }
        return PngLogoValidator.instance;
    }

    async validate(file: File): Promise<string | null> {
        // Check file type
        if (file.type !== 'image/png') {
            return str(RStr.PngLogoValidator_error_fileType);
        }

        // Check file size (1MB = 1024 * 1024 bytes)
        const maxSize = 1024 * 1024;
        if (file.size > maxSize) {
            return str(RStr.PngLogoValidator_error_fileSize);
        }

        // Check image dimensions using Image API
        return new Promise((resolve) => {
            const image = new Image();
            const objectUrl = URL.createObjectURL(file);

            image.onload = () => {
                // Clean up object URL
                URL.revokeObjectURL(objectUrl);

                // Check dimensions - must be exactly 512x512
                if (image.width !== 512 || image.height !== 512) {
                    resolve(str(RStr.PngLogoValidator_error_dimensions)
                        .replace('{width}', image.width.toString())
                        .replace('{height}', image.height.toString()));
                    return;
                }

                resolve(null); // All validations passed
            };

            image.onerror = () => {
                // Clean up object URL
                URL.revokeObjectURL(objectUrl);
                resolve(str(RStr.PngLogoValidator_error_invalidImage));
            };

            // Load the image
            image.src = objectUrl;
        });
    }

    getAcceptedTypes(): string {
        return ".png";
    }

    getDropZoneTitle(): string {
        return str(RStr.PngLogoValidator_dropZone_title);
    }

    getDropZoneSubtitle(): string {
        return str(RStr.PngLogoValidator_dropZone_subtitle);
    }
}
