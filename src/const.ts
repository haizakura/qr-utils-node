import type { ErrorCorrection, EncodingType, QrOpts } from 'qr';

/**
 * QRCode Options
 * @description Options for QR code operations
 */
export interface QRCodeOptions extends QrOpts {
  as?: string;
  ecc?: ErrorCorrection;
  encoding?: EncodingType;
  version?: number;
  mask?: number;
  border?: number;
  scale?: number;
  optimize?: boolean;
}

/**
 * QRDecode Result
 * @description Result of QR code decoding
 */
export type QRDecodeResult = {
  data: string;
};

/**
 * QREncode Result
 * @description Result of QR code encoding
 */
export type QREncodeResult = {
  data: Uint8Array | string | boolean[][];
  type: string;
};

/**
 * QRDecode Image Data
 * @description Image data for QR code decoding
 */
export type QRDecodeImageData = {
  width: number;
  height: number;
  data: Uint8Array | Uint8ClampedArray | number[];
};

export const outputTypesMap: Record<string, string> = {
  ascii: 'string',
  term: 'string',
  svg: 'string',
  raw: 'boolean[][]',
  gif: 'uint8',
};
