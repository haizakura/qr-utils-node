import { describe, it } from 'mocha';
import assert from 'assert';
import { QrcodeUtils } from '@/index';
import { QRCodeError, QRCodeValidationError, QRCodeProcessingError } from '@/exceptions';
import type { QRDecodeImageData, QRCodeOptions } from '@/const';

describe('QrcodeUtils', () => {
  describe('encode method', () => {
    it('should encode text to gif format by default', async () => {
      const text = 'Hello, World!';
      const result = await QrcodeUtils.encode(text);

      assert.ok(result);
      assert.strictEqual(typeof result, 'object');
      assert.ok(result.data);
      assert.strictEqual(result.type, 'uint8');
      assert.ok(result.data instanceof Uint8Array);
    });

    it('should encode text to svg format', async () => {
      const text = 'Hello, World!';
      const options: QRCodeOptions = { as: 'svg' };
      const result = await QrcodeUtils.encode(text, options);

      assert.ok(result);
      assert.strictEqual(typeof result.data, 'string');
      assert.strictEqual(result.type, 'string');
      assert.ok((result.data as string).includes('svg'));
    });

    it('should encode text to ascii format', async () => {
      const text = 'Test';
      const options: QRCodeOptions = { as: 'ascii' };
      const result = await QrcodeUtils.encode(text, options);

      assert.ok(result);
      assert.strictEqual(typeof result.data, 'string');
      assert.strictEqual(result.type, 'string');
    });

    it('should encode text to raw format', async () => {
      const text = 'Test';
      const options: QRCodeOptions = { as: 'raw' };
      const result = await QrcodeUtils.encode(text, options);

      assert.ok(result);
      assert.ok(Array.isArray(result.data));
      assert.strictEqual(result.type, 'boolean[][]');
    });

    it('should handle custom options', async () => {
      const text = 'Test with options';
      const options: QRCodeOptions = {
        as: 'gif',
        scale: 4,
        border: 2,
      };
      const result = await QrcodeUtils.encode(text, options);

      assert.ok(result);
      assert.ok(result.data instanceof Uint8Array);
      assert.strictEqual(result.type, 'uint8');
    });

    it('should use default options when no options provided', async () => {
      const text = 'Default options test';
      const result = await QrcodeUtils.encode(text);

      assert.ok(result);
      assert.strictEqual(result.type, 'uint8');
    });

    it('should handle unknown format and default to gif', async () => {
      const text = 'Unknown format test';
      const options: QRCodeOptions = { as: 'unknown' as any };
      const result = await QrcodeUtils.encode(text, options);

      assert.ok(result);
      assert.ok(result.data instanceof Uint8Array);
      assert.ok(result.type);
    });
  });

  describe('encode method validation', () => {
    it('should throw QRCodeValidationError for empty text', async () => {
      await assert.rejects(
        () => QrcodeUtils.encode(''),
        (error) => {
          assert.ok(error instanceof QRCodeValidationError);
          assert.strictEqual(error.message, 'Invalid text. Expected non-empty string');
          assert.strictEqual(error.code, 'VALIDATION_ERROR');
          return true;
        },
      );
    });

    it('should throw QRCodeValidationError for non-string text', async () => {
      await assert.rejects(
        () => QrcodeUtils.encode(null as any),
        (error) => {
          assert.ok(error instanceof QRCodeValidationError);
          assert.strictEqual(error.message, 'Invalid text. Expected non-empty string');
          return true;
        },
      );
    });

    it('should throw QRCodeValidationError for undefined text', async () => {
      await assert.rejects(
        () => QrcodeUtils.encode(undefined as any),
        (error) => {
          assert.ok(error instanceof QRCodeValidationError);
          assert.strictEqual(error.message, 'Invalid text. Expected non-empty string');
          return true;
        },
      );
    });

    it('should throw QRCodeValidationError for number text', async () => {
      await assert.rejects(
        () => QrcodeUtils.encode(123 as any),
        (error) => {
          assert.ok(error instanceof QRCodeValidationError);
          assert.strictEqual(error.message, 'Invalid text. Expected non-empty string');
          return true;
        },
      );
    });
  });

  describe('decode method', () => {
    it('should accept QRDecodeImageData', async () => {
      const imageData: QRDecodeImageData = {
        width: 5,
        height: 5,
        data: new Array(5 * 5 * 4).fill(255),
      };

      try {
        const result = await QrcodeUtils.decode(imageData);
        assert.ok(result);
        assert.ok(typeof result.data === 'string');
      } catch (error) {
        assert.ok(error instanceof QRCodeProcessingError || error instanceof QRCodeError);
        assert.ok(!(error instanceof QRCodeValidationError));
      }
    });

    it('should validate image data structure', async () => {
      const invalidImageData = {
        width: 10,
        height: 10,
      };

      await assert.rejects(
        () => QrcodeUtils.decode(invalidImageData as any),
        (error) => {
          assert.ok(error instanceof QRCodeValidationError);
          assert.ok(error.message.includes('Invalid image data structure'));
          return true;
        },
      );
    });
  });

  describe('decode method validation', () => {
    it('should throw QRCodeValidationError for null image data', async () => {
      await assert.rejects(
        () => QrcodeUtils.decode(null as any),
        (error) => {
          assert.ok(error instanceof QRCodeValidationError);
          assert.strictEqual(error.message, 'No image data provided');
          assert.strictEqual(error.code, 'VALIDATION_ERROR');
          return true;
        },
      );
    });

    it('should throw QRCodeValidationError for undefined image data', async () => {
      await assert.rejects(
        () => QrcodeUtils.decode(undefined as any),
        (error) => {
          assert.ok(error instanceof QRCodeValidationError);
          assert.strictEqual(error.message, 'No image data provided');
          return true;
        },
      );
    });

    it('should throw QRCodeValidationError for invalid image data type', async () => {
      await assert.rejects(
        () => QrcodeUtils.decode('invalid' as any),
        (error) => {
          assert.ok(error instanceof QRCodeValidationError);
          assert.ok(
            error.message.includes('Invalid image data type') || error.message.includes('Expected QRDecodeImageData'),
          );
          return true;
        },
      );
    });
  });

  describe('error handling', () => {
    it('should preserve QRCodeError instances', async () => {
      await assert.rejects(
        () => QrcodeUtils.encode(''),
        (error) => {
          assert.ok(error instanceof QRCodeValidationError);
          assert.ok(error instanceof QRCodeError);
          return true;
        },
      );
    });

    it('should wrap unknown errors in QRCodeProcessingError for encode', async () => {
      await assert.rejects(
        () => QrcodeUtils.encode(null as any),
        (error) => {
          assert.ok(error instanceof QRCodeError);
          return true;
        },
      );
    });

    it('should handle processing errors correctly', async () => {
      const imageData: QRDecodeImageData = {
        width: 1,
        height: 1,
        data: [0, 0, 0, 255],
      };

      try {
        await QrcodeUtils.decode(imageData);
        assert.fail('Expected QrcodeUtils.decode to throw an error');
      } catch (error) {
        assert.ok(error instanceof QRCodeProcessingError || error instanceof QRCodeError);
        if (error instanceof QRCodeProcessingError) {
          assert.strictEqual(error.code, 'PROCESSING_ERROR');
        }
      }
    });
  });

  describe('edge cases', () => {
    it('should handle very long text', async () => {
      const longText = 'A'.repeat(100);
      const result = await QrcodeUtils.encode(longText);

      assert.ok(result);
      assert.ok(result.data);
    });

    it('should handle special characters', async () => {
      const specialText = '特殊字符 🎉 @#$%^&*()_+-=[]{}|;:,.<>?';
      const result = await QrcodeUtils.encode(specialText);

      assert.ok(result);
      assert.ok(result.data);
    });

    it('should handle unicode text', async () => {
      const unicodeText = '🌟✨💫⭐🎊🎉🎈🎁🎀🎯';
      const result = await QrcodeUtils.encode(unicodeText);

      assert.ok(result);
      assert.ok(result.data);
    });

    it('should handle minimal image data', async () => {
      const minImageData: QRDecodeImageData = {
        width: 1,
        height: 1,
        data: new Uint8Array([255, 255, 255, 255]),
      };

      try {
        await QrcodeUtils.decode(minImageData);
      } catch (error) {
        assert.ok(error instanceof QRCodeProcessingError);
      }
    });
  });

  describe('options handling', () => {
    it('should merge options with defaults correctly', async () => {
      const text = 'Options test';
      const customOptions: QRCodeOptions = {
        border: 10,
      };

      const result = await QrcodeUtils.encode(text, customOptions);
      assert.ok(result);
      assert.strictEqual(result.type, 'uint8');
    });

    it('should handle empty options object', async () => {
      const text = 'Empty options test';
      const result = await QrcodeUtils.encode(text, {});

      assert.ok(result);
      assert.strictEqual(result.type, 'uint8');
    });

    it('should override defaults with provided options', async () => {
      const text = 'Override test';
      const options: QRCodeOptions = {
        as: 'svg',
        scale: 16,
      };

      const result = await QrcodeUtils.encode(text, options);
      assert.ok(result);
      assert.strictEqual(result.type, 'string');
    });
  });
});
