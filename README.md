# qrcode-utils-node

QRCode Utils for Node.js, featuring error handling and validation, easy to use.

## Usage

### Encoding

```typescript
const text = 'Hello, World!';
console.log('Text:', text);

/**
 * Encode QR code - Default Options
 */
console.log('Encode QR code - Default Options');
const encodeResultDefault = await QrcodeUtils.encode(text);
console.log('Result:', encodeResultDefault);

/**
 * Encode QR code - SVG with Default Options
 */
console.log('Encode QR code - SVG with Default Options');
const encodeResultSvg = await QrcodeUtils.encode(text, { as: 'svg' });
console.log('Result:', encodeResultSvg);

/**
 * Encode QR code - ASCII with Default Options
 */
console.log('Encode QR code - ASCII with Default Options');
const encodeResultAscii = await QrcodeUtils.encode(text, { as: 'ascii' });
console.log('Result:', encodeResultAscii);

/**
 * Encode QR code - RAW with Default Options
 */
console.log('Encode QR code - RAW with Default Options');
const encodeResultRaw = await QrcodeUtils.encode(text, { as: 'raw' });
console.log('Result:', encodeResultRaw);
```

### Encodeing Options

```typescript
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
```

### Decoding

```typescript
const filePath = 'sample/img/qrcode.gif';
console.log('File path:', filePath);

/**
 * Decode QR code - File
 */
console.log('Decode QR code - File');
const fileBuffer = readFileSync(filePath);
const file = new File([fileBuffer], 'qrcode.gif', { type: 'image/gif' });
const decodeResult = await QrcodeUtils.decode(file);
console.log('Result:', decodeResult);
```

### Decode Options

```typescript
/**
 * QRDecode Image Data
 * @description Image data for QR code decoding
 */
export type QRDecodeImageData = {
  width: number;
  height: number;
  data: Uint8Array | Uint8ClampedArray | number[];
};

QrcodeUtils.decode(imageData: QRDecodeImageData | File);
```
