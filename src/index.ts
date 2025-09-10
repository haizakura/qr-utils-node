import sharp from 'sharp';
import encodeQR from 'qr';
import decodeQR from 'qr/decode.js';
import { QRCodeProcessingError, QRCodeValidationError, QRCodeError, QRCodeConvertingError } from '@/exceptions';
import { AS_TYPES_MAP, DEFAULT_OPTIONS } from '@/const';
import type { QRDecodeImageData, QRCodeOptions, QRDecodeResult, QREncodeResult } from '@/const';

/**
 * QRCode Utilities
 * @description Utility class for QR code operations
 */
class QrcodeUtils {
  /**
   * Validate input for QR code operations
   * @param imageData - Image data to validate
   */
  private static validateImageData(imageData: unknown): asserts imageData is QRDecodeImageData {
    if (!imageData) {
      throw new QRCodeValidationError('No image data provided');
    }
    if (typeof imageData !== 'object' || imageData === null) {
      throw new QRCodeValidationError(`Invalid image data type. Expected QRDecodeImageData, got ${typeof imageData}`);
    }
    const data = imageData as any;
    if (typeof data.width !== 'number' || typeof data.height !== 'number' || !data.data) {
      throw new QRCodeValidationError(
        'Invalid image data structure. Expected object with width, height, and data properties',
      );
    }
  }

  /**
   * Validate text input for encoding
   */
  private static validateText(text: unknown): asserts text is string {
    if (!text || typeof text !== 'string') {
      throw new QRCodeValidationError('Invalid text. Expected non-empty string');
    }
  }

  /**
   * Convert file to image data
   * @param file - File to convert
   * @returns Promise with image data
   */
  private static async convertFileToImageData(file: File): Promise<QRDecodeImageData> {
    try {
      const buffer = await file.arrayBuffer();
      const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      const { width, height } = info;
      const payload = Array.from(new Uint8Array(data));
      return {
        width: width,
        height: height,
        data: payload,
      };
    } catch (error) {
      throw new QRCodeConvertingError(
        `Convert file to image data failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Combine options
   * @param options - Options to combine
   * @returns Combined options
   */
  private static combineOptions(options: QRCodeOptions): QRCodeOptions {
    return {
      ...DEFAULT_OPTIONS,
      ...options,
    };
  }

  /**
   * Decode QR code from image file
   * @param imageData - Image data ontaining QR code or file
   * @returns Promise with decoded text result
   */
  public static async decode(imageData: QRDecodeImageData | File): Promise<QRDecodeResult> {
    try {
      if (imageData instanceof File) {
        imageData = await this.convertFileToImageData(imageData);
      }
      this.validateImageData(imageData);
      const decoded = decodeQR(imageData);
      if (!decoded) {
        throw new QRCodeProcessingError('No QR code found in image');
      }
      return {
        data: decoded,
      };
    } catch (error) {
      if (error instanceof QRCodeError) {
        throw error;
      }
      throw new QRCodeProcessingError(`Decode failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Encode text to QR code image
   * @param text - Text to encode
   * @param options - QR code generation options.
   * @returns Promise with encoded QR code result
   */
  public static async encode(text: string, options?: QRCodeOptions): Promise<QREncodeResult> {
    try {
      this.validateText(text);
      let qrData: Uint8Array | string | boolean[][];
      const { as, ...restOptions } = this.combineOptions(options ?? {});
      switch (as ?? 'gif') {
        case 'gif':
          qrData = encodeQR(text, 'gif', restOptions);
          break;
        case 'svg':
          qrData = encodeQR(text, 'svg', restOptions);
          break;
        case 'ascii':
          qrData = encodeQR(text, 'ascii', restOptions);
          break;
        case 'raw':
          qrData = encodeQR(text, 'raw', restOptions);
          break;
        default:
          qrData = encodeQR(text, 'gif', restOptions);
          break;
      }
      const outputType = as && AS_TYPES_MAP[as] ? as : 'gif';
      return {
        data: qrData,
        type: AS_TYPES_MAP[outputType],
      };
    } catch (error) {
      if (error instanceof QRCodeError) {
        throw error;
      }
      throw new QRCodeProcessingError(`Encode failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export { QrcodeUtils };
export default QrcodeUtils;
