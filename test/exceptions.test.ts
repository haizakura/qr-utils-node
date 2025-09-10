import { describe, it } from 'mocha';
import assert from 'assert';
import { QRCodeError, QRCodeValidationError, QRCodeProcessingError, QRCodeConvertingError } from '@/exceptions';

describe('QRCode Exceptions', () => {
  describe('QRCodeError', () => {
    it('should create error with message and code', () => {
      const message = 'Test error message';
      const code = 'TEST_ERROR';
      const error = new QRCodeError(message, code);

      assert.strictEqual(error.message, message);
      assert.strictEqual(error.code, code);
      assert.strictEqual(error.name, 'QRCodeError');
      assert.ok(error instanceof Error);
      assert.ok(error instanceof QRCodeError);
    });

    it('should be instanceof Error', () => {
      const error = new QRCodeError('test', 'TEST');
      assert.ok(error instanceof Error);
    });

    it('should have proper stack trace', () => {
      const error = new QRCodeError('test', 'TEST');
      assert.ok(error.stack);
      assert.ok(error.stack?.includes('QRCodeError'));
    });
  });

  describe('QRCodeValidationError', () => {
    it('should create validation error with correct code', () => {
      const message = 'Validation failed';
      const error = new QRCodeValidationError(message);

      assert.strictEqual(error.message, message);
      assert.strictEqual(error.code, 'VALIDATION_ERROR');
      assert.strictEqual(error.name, 'QRCodeError');
      assert.ok(error instanceof QRCodeError);
      assert.ok(error instanceof QRCodeValidationError);
    });

    it('should inherit from QRCodeError', () => {
      const error = new QRCodeValidationError('test');
      assert.ok(error instanceof QRCodeError);
      assert.ok(error instanceof Error);
    });

    it('should have validation-specific error code', () => {
      const error = new QRCodeValidationError('Invalid input');
      assert.strictEqual(error.code, 'VALIDATION_ERROR');
    });
  });

  describe('QRCodeProcessingError', () => {
    it('should create processing error with correct code', () => {
      const message = 'Processing failed';
      const error = new QRCodeProcessingError(message);

      assert.strictEqual(error.message, message);
      assert.strictEqual(error.code, 'PROCESSING_ERROR');
      assert.strictEqual(error.name, 'QRCodeError');
      assert.ok(error instanceof QRCodeError);
      assert.ok(error instanceof QRCodeProcessingError);
    });

    it('should inherit from QRCodeError', () => {
      const error = new QRCodeProcessingError('test');
      assert.ok(error instanceof QRCodeError);
      assert.ok(error instanceof Error);
    });

    it('should have processing-specific error code', () => {
      const error = new QRCodeProcessingError('Failed to process');
      assert.strictEqual(error.code, 'PROCESSING_ERROR');
    });
  });

  describe('QRCodeConvertingError', () => {
    it('should create converting error with correct code', () => {
      const message = 'Converting failed';
      const error = new QRCodeConvertingError(message);

      assert.strictEqual(error.message, message);
      assert.strictEqual(error.code, 'CONVERTING_ERROR');
      assert.strictEqual(error.name, 'QRCodeError');
      assert.ok(error instanceof QRCodeError);
      assert.ok(error instanceof QRCodeConvertingError);
    });

    it('should inherit from QRCodeError', () => {
      const error = new QRCodeConvertingError('test');
      assert.ok(error instanceof QRCodeError);
      assert.ok(error instanceof Error);
    });

    it('should have converting-specific error code', () => {
      const error = new QRCodeConvertingError('Failed to convert');
      assert.strictEqual(error.code, 'CONVERTING_ERROR');
    });
  });

  describe('Error inheritance chain', () => {
    it('should maintain proper inheritance for validation error', () => {
      const error = new QRCodeValidationError('test');

      assert.ok(error instanceof Error);
      assert.ok(error instanceof QRCodeError);
      assert.ok(error instanceof QRCodeValidationError);
      assert.ok(!(error instanceof QRCodeProcessingError));
      assert.ok(!(error instanceof QRCodeConvertingError));
    });

    it('should maintain proper inheritance for processing error', () => {
      const error = new QRCodeProcessingError('test');

      assert.ok(error instanceof Error);
      assert.ok(error instanceof QRCodeError);
      assert.ok(error instanceof QRCodeProcessingError);
      assert.ok(!(error instanceof QRCodeValidationError));
      assert.ok(!(error instanceof QRCodeConvertingError));
    });

    it('should maintain proper inheritance for converting error', () => {
      const error = new QRCodeConvertingError('test');

      assert.ok(error instanceof Error);
      assert.ok(error instanceof QRCodeError);
      assert.ok(error instanceof QRCodeConvertingError);
      assert.ok(!(error instanceof QRCodeValidationError));
      assert.ok(!(error instanceof QRCodeProcessingError));
    });
  });

  describe('Error serialization', () => {
    it('should have enumerable properties', () => {
      const error = new QRCodeError('test message', 'TEST_CODE');
      const keys = Object.getOwnPropertyNames(error);

      assert.ok(keys.includes('message'));
      assert.ok(keys.includes('code'));
      assert.ok(keys.includes('name'));
    });

    it('should have proper properties', () => {
      const error = new QRCodeConvertingError('converting failed');

      // Test that the error has the expected properties
      assert.strictEqual(error.message, 'converting failed');
      assert.strictEqual(error.code, 'CONVERTING_ERROR');
      assert.strictEqual(error.name, 'QRCodeError');

      // Test that properties are accessible
      assert.ok(error.hasOwnProperty('message'));
      assert.ok(error.hasOwnProperty('code'));
    });

    it('should have meaningful toString()', () => {
      const error = new QRCodeConvertingError('process failed');
      const str = error.toString();

      assert.ok(str.includes('QRCodeError'));
      assert.ok(str.includes('process failed'));
    });
  });

  describe('Error codes uniqueness', () => {
    it('should have unique error codes for each error type', () => {
      const validationError = new QRCodeValidationError('test');
      const processingError = new QRCodeProcessingError('test');
      const convertingError = new QRCodeConvertingError('test');

      const codes = [validationError.code, processingError.code, convertingError.code];
      const uniqueCodes = new Set(codes);

      assert.strictEqual(codes.length, uniqueCodes.size, 'Error codes should be unique');
    });

    it('should have predictable error codes', () => {
      assert.strictEqual(new QRCodeValidationError('test').code, 'VALIDATION_ERROR');
      assert.strictEqual(new QRCodeProcessingError('test').code, 'PROCESSING_ERROR');
      assert.strictEqual(new QRCodeConvertingError('test').code, 'CONVERTING_ERROR');
    });
  });
});
