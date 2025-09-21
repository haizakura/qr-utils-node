import { QrcodeUtils } from '@/index';
import { readFileSync } from 'fs';

const text = 'Hello, World!';
console.log('Text:', text);

/*********************ENCODE START***************************/

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

/**********************ENCODE END****************************/

/*********************DECODE START***************************/

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

/***********************DECODE END***************************/
