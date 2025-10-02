import { Injectable, BadRequestException } from '@nestjs/common';
import sharp from 'sharp';

export interface ImageProcessingOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
    maxSizeBytes?: number;
}

@Injectable()
export class ImageService {
    /**
     * Process and optimize image for database storage
     */
    async processImageForStorage(
        buffer: Buffer,
        options: ImageProcessingOptions = {}
    ): Promise<{
        buffer: Buffer;
        mimeType: string;
        size: number;
        width: number;
        height: number;
    }> {
        const {
            maxWidth = 300,
            maxHeight = 300,
            quality = 80,
            format = 'jpeg',
            maxSizeBytes = 1024 * 1024, // 1MB
        } = options;

        try {
            // Get image metadata
            const metadata = await sharp(buffer).metadata();

            if (!metadata.width || !metadata.height) {
                throw new BadRequestException('Invalid image format');
            }

            // Resize image if needed
            let processedImage = sharp(buffer);

            if (metadata.width > maxWidth || metadata.height > maxHeight) {
                processedImage = processedImage.resize(maxWidth, maxHeight, {
                    fit: 'inside',
                    withoutEnlargement: true,
                });
            }

            // Convert to specified format and compress
            let outputBuffer: Buffer;
            let mimeType: string;

            switch (format) {
                case 'jpeg':
                    outputBuffer = await processedImage
                        .jpeg({ quality })
                        .toBuffer();
                    mimeType = 'image/jpeg';
                    break;
                case 'png':
                    outputBuffer = await processedImage
                        .png({ quality })
                        .toBuffer();
                    mimeType = 'image/png';
                    break;
                case 'webp':
                    outputBuffer = await processedImage
                        .webp({ quality })
                        .toBuffer();
                    mimeType = 'image/webp';
                    break;
                default:
                    throw new BadRequestException('Unsupported format');
            }

            // Check final size
            if (outputBuffer.length > maxSizeBytes) {
                throw new BadRequestException(
                    `Image size (${outputBuffer.length} bytes) exceeds maximum allowed size (${maxSizeBytes} bytes)`
                );
            }

            // Get final dimensions
            const finalMetadata = await sharp(outputBuffer).metadata();

            return {
                buffer: outputBuffer,
                mimeType,
                size: outputBuffer.length,
                width: finalMetadata.width || 0,
                height: finalMetadata.height || 0,
            };
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('Failed to process image');
        }
    }

    /**
     * Validate image file
     */
    validateImageFile(file: Express.Multer.File): void {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException(
                `Invalid file type. Allowed: ${allowedMimeTypes.join(', ')}`
            );
        }

        if (file.size > maxSize) {
            throw new BadRequestException(
                `File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`
            );
        }
    }

    /**
     * Generate thumbnail for preview
     */
    generateThumbnail(
        buffer: Buffer,
        width: number = 100,
        height: number = 100
    ): Promise<Buffer> {
        return sharp(buffer)
            .resize(width, height, {
                fit: 'cover',
                position: 'center',
            })
            .jpeg({ quality: 70 })
            .toBuffer();
    }

    /**
     * Convert image to base64 for embedding in HTML/JSON
     */
    imageToBase64(buffer: Buffer, mimeType: string): string {
        return `data:${mimeType};base64,${buffer.toString('base64')}`;
    }

    /**
     * Convert base64 to buffer
     */
    base64ToBuffer(base64String: string): Buffer {
        const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
        return Buffer.from(base64Data, 'base64');
    }
}
