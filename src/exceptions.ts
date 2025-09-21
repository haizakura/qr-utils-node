/**
 * QRCode Error
 * @description Error class for QR code operations
 */
export class QRCodeError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = 'QRCodeError';
  }
}

/**
 * QRCode Validation Error
 * @description Error class for QR code validation operations
 */
export class QRCodeValidationError extends QRCodeError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
  }
}

/**
 * QRCode Processing Error
 * @description Error class for QR code processing operations
 */
export class QRCodeProcessingError extends QRCodeError {
  constructor(message: string) {
    super(message, 'PROCESSING_ERROR');
  }
}

/**
 * QRCode Converting Error
 * @description Error class for QR code converting operations
 */
export class QRCodeConvertingError extends QRCodeError {
  constructor(message: string) {
    super(message, 'CONVERTING_ERROR');
  }
}
