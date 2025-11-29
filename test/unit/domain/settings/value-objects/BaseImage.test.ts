import { describe, it, expect } from '@jest/globals';
import {
  BaseImage,
  type ImageMetadata,
  type ImageConstraints,
} from '@/domain/settings/value-objects/BaseImage';

class TestImage extends BaseImage {
  constructor(
    url: string,
    metadata: ImageMetadata | null | undefined,
    constraints: ImageConstraints
  ) {
    super(url, metadata, constraints);
  }

  equals(other: TestImage | null | undefined): boolean {
    return this.equalsBase(other);
  }
}

describe('BaseImage', () => {
  const defaultConstraints: ImageConstraints = {
    validExtensions: ['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp'],
    validFormats: ['png', 'jpg', 'jpeg', 'svg', 'gif', 'webp'],
    validMimeTypes: [
      'image/png',
      'image/jpeg',
      'image/svg+xml',
      'image/gif',
      'image/webp',
    ],
    maxSizeBytes: 2 * 1024 * 1024,
    entityName: 'Test image',
  };

  const validMetadata: ImageMetadata = {
    filename: 'test-1234567890.png',
    originalName: 'test.png',
    size: 4096,
    format: 'png',
    mimeType: 'image/png',
    uploadedAt: new Date('2024-01-01T00:00:00Z'),
  };

  const validUrl = 'https://example.com/images/test-1234567890.png';

  describe('Constructor and Getters', () => {
    it('should create an instance with valid URL and metadata', () => {
      const image = new TestImage(validUrl, validMetadata, defaultConstraints);

      expect(image.url).toBe(validUrl);
      expect(image.metadata).toEqual(validMetadata);
      expect(image.filename).toBe(validMetadata.filename);
      expect(image.originalName).toBe(validMetadata.originalName);
      expect(image.size).toBe(validMetadata.size);
      expect(image.format).toBe(validMetadata.format);
      expect(image.mimeType).toBe(validMetadata.mimeType);
      expect(image.uploadedAt).toEqual(validMetadata.uploadedAt);
    });

    it('should trim whitespace from URL', () => {
      const urlWithSpaces = '  https://example.com/images/test.png  ';
      const image = new TestImage(
        urlWithSpaces,
        validMetadata,
        defaultConstraints
      );
      expect(image.url).toBe('https://example.com/images/test.png');
    });
  });

  describe('URL Validation', () => {
    it('should throw error when URL is empty', () => {
      expect(() => {
        new TestImage('', validMetadata, defaultConstraints);
      }).toThrow('Test image URL cannot be empty');
    });

    it('should throw error when URL is whitespace only', () => {
      expect(() => {
        new TestImage('   ', validMetadata, defaultConstraints);
      }).toThrow('Test image URL cannot be empty');
    });

    it('should throw error when URL is invalid format', () => {
      expect(() => {
        new TestImage('not-a-valid-url', validMetadata, defaultConstraints);
      }).toThrow('Test image URL must be a valid URL');
    });

    it('should throw error when URL has invalid extension', () => {
      expect(() => {
        new TestImage(
          'https://example.com/image.txt',
          validMetadata,
          defaultConstraints
        );
      }).toThrow('Test image must have a valid extension');
    });

    it('should accept URLs with valid extensions', () => {
      const validUrls = [
        'https://example.com/image.png',
        'https://example.com/image.jpg',
        'https://example.com/image.jpeg',
        'https://example.com/image.svg',
        'https://example.com/image.gif',
        'https://example.com/image.webp',
      ];

      validUrls.forEach((url) => {
        expect(() => {
          new TestImage(url, validMetadata, defaultConstraints);
        }).not.toThrow();
      });
    });

    it('should handle case-insensitive extensions', () => {
      const caseInsensitiveUrls = [
        'https://example.com/image.PNG',
        'https://example.com/image.JPG',
        'https://example.com/image.JPEG',
      ];

      caseInsensitiveUrls.forEach((url) => {
        expect(() => {
          new TestImage(url, validMetadata, defaultConstraints);
        }).not.toThrow();
      });
    });
  });

  describe('Metadata Validation', () => {
    it('should throw error when metadata is null', () => {
      expect(() => {
        new TestImage(validUrl, null, defaultConstraints);
      }).toThrow('Test image metadata cannot be null');
    });

    it('should throw error when metadata is undefined', () => {
      expect(() => {
        new TestImage(validUrl, undefined, defaultConstraints);
      }).toThrow('Test image metadata cannot be null');
    });

    it('should throw error when filename is empty', () => {
      const invalidMetadata = { ...validMetadata, filename: '' };
      expect(() => {
        new TestImage(validUrl, invalidMetadata, defaultConstraints);
      }).toThrow('Test image filename cannot be empty');
    });

    it('should throw error when filename is whitespace only', () => {
      const invalidMetadata = { ...validMetadata, filename: '   ' };
      expect(() => {
        new TestImage(validUrl, invalidMetadata, defaultConstraints);
      }).toThrow('Test image filename cannot be empty');
    });

    it('should throw error when original name is empty', () => {
      const invalidMetadata = { ...validMetadata, originalName: '' };
      expect(() => {
        new TestImage(validUrl, invalidMetadata, defaultConstraints);
      }).toThrow('Test image original name cannot be empty');
    });

    it('should throw error when original name is whitespace only', () => {
      const invalidMetadata = { ...validMetadata, originalName: '   ' };
      expect(() => {
        new TestImage(validUrl, invalidMetadata, defaultConstraints);
      }).toThrow('Test image original name cannot be empty');
    });
  });

  describe('Size Validation', () => {
    it('should throw error when size is zero', () => {
      const invalidMetadata = { ...validMetadata, size: 0 };
      expect(() => {
        new TestImage(validUrl, invalidMetadata, defaultConstraints);
      }).toThrow('Test image size must be greater than 0');
    });

    it('should throw error when size is negative', () => {
      const invalidMetadata = { ...validMetadata, size: -100 };
      expect(() => {
        new TestImage(validUrl, invalidMetadata, defaultConstraints);
      }).toThrow('Test image size must be greater than 0');
    });

    it('should throw error when size exceeds limit', () => {
      const invalidMetadata = { ...validMetadata, size: 3 * 1024 * 1024 };
      expect(() => {
        new TestImage(validUrl, invalidMetadata, defaultConstraints);
      }).toThrow('Test image size cannot exceed 2MB');
    });

    it('should accept size at the exact limit', () => {
      const limitMetadata = { ...validMetadata, size: 2 * 1024 * 1024 };
      expect(() => {
        new TestImage(validUrl, limitMetadata, defaultConstraints);
      }).not.toThrow();
    });

    it('should respect custom size limits from constraints', () => {
      const customConstraints = {
        ...defaultConstraints,
        maxSizeBytes: 5 * 1024 * 1024,
        entityName: 'Custom image',
      };
      const largeMetadata = { ...validMetadata, size: 4 * 1024 * 1024 };

      expect(() => {
        new TestImage(validUrl, largeMetadata, customConstraints);
      }).not.toThrow();
    });
  });

  describe('Format Validation', () => {
    it('should throw error when format is invalid', () => {
      const invalidMetadata = { ...validMetadata, format: 'txt' };
      expect(() => {
        new TestImage(validUrl, invalidMetadata, defaultConstraints);
      }).toThrow('Test image format must be one of');
    });

    it('should throw error when format is empty', () => {
      const invalidMetadata = { ...validMetadata, format: '' };
      expect(() => {
        new TestImage(validUrl, invalidMetadata, defaultConstraints);
      }).toThrow('Test image format must be one of');
    });

    it('should accept valid formats (case-insensitive)', () => {
      const upperCaseMetadata = { ...validMetadata, format: 'PNG' };
      expect(() => {
        new TestImage(validUrl, upperCaseMetadata, defaultConstraints);
      }).not.toThrow();
    });
  });

  describe('MIME Type Validation', () => {
    it('should throw error when MIME type is invalid', () => {
      const invalidMetadata = { ...validMetadata, mimeType: 'text/plain' };
      expect(() => {
        new TestImage(validUrl, invalidMetadata, defaultConstraints);
      }).toThrow('Test image MIME type must be one of');
    });

    it('should throw error when MIME type is empty', () => {
      const invalidMetadata = { ...validMetadata, mimeType: '' };
      expect(() => {
        new TestImage(validUrl, invalidMetadata, defaultConstraints);
      }).toThrow('Test image MIME type must be one of');
    });

    it('should accept all valid MIME types', () => {
      const validMimeTypes = [
        'image/png',
        'image/jpeg',
        'image/svg+xml',
        'image/gif',
        'image/webp',
      ];

      validMimeTypes.forEach((mimeType) => {
        const metadata = { ...validMetadata, mimeType };
        expect(() => {
          new TestImage(validUrl, metadata, defaultConstraints);
        }).not.toThrow();
      });
    });
  });

  describe('Upload Date Validation', () => {
    it('should throw error when upload date is null', () => {
      const invalidMetadata = {
        ...validMetadata,
        uploadedAt: null as unknown as Date,
      };
      expect(() => {
        new TestImage(validUrl, invalidMetadata, defaultConstraints);
      }).toThrow('Test image upload date must be a valid date');
    });

    it('should throw error when upload date is not a Date object', () => {
      const invalidMetadata = {
        ...validMetadata,
        uploadedAt: 'not-a-date' as unknown as Date,
      };
      expect(() => {
        new TestImage(validUrl, invalidMetadata, defaultConstraints);
      }).toThrow('Test image upload date must be a valid date');
    });

    it('should throw error when upload date is in the future', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const invalidMetadata = { ...validMetadata, uploadedAt: futureDate };
      expect(() => {
        new TestImage(validUrl, invalidMetadata, defaultConstraints);
      }).toThrow('Test image upload date cannot be in the future');
    });

    it('should accept current date', () => {
      const nowMetadata = { ...validMetadata, uploadedAt: new Date() };
      expect(() => {
        new TestImage(validUrl, nowMetadata, defaultConstraints);
      }).not.toThrow();
    });

    it('should accept past dates', () => {
      const pastDate = new Date('2020-01-01T00:00:00Z');
      const pastMetadata = { ...validMetadata, uploadedAt: pastDate };
      expect(() => {
        new TestImage(validUrl, pastMetadata, defaultConstraints);
      }).not.toThrow();
    });
  });

  describe('Metadata Immutability', () => {
    it('should return a copy of metadata', () => {
      const image = new TestImage(validUrl, validMetadata, defaultConstraints);
      const metadata = image.metadata;

      metadata.filename = 'modified.png';

      expect(image.metadata.filename).toBe(validMetadata.filename);
    });

    it('should not be affected by modifications to original metadata', () => {
      const mutableMetadata = { ...validMetadata };
      const image = new TestImage(
        validUrl,
        mutableMetadata,
        defaultConstraints
      );

      mutableMetadata.filename = 'modified.png';

      expect(image.filename).toBe(validMetadata.filename);
    });
  });

  describe('equalsBase', () => {
    it('should return true for equal images', () => {
      const image1 = new TestImage(validUrl, validMetadata, defaultConstraints);
      const image2 = new TestImage(
        validUrl,
        { ...validMetadata },
        defaultConstraints
      );
      expect(image1.equals(image2)).toBe(true);
    });

    it('should return false for different URLs', () => {
      const image1 = new TestImage(validUrl, validMetadata, defaultConstraints);
      const image2 = new TestImage(
        'https://example.com/different.png',
        validMetadata,
        defaultConstraints
      );
      expect(image1.equals(image2)).toBe(false);
    });

    it('should return false for different filenames', () => {
      const image1 = new TestImage(validUrl, validMetadata, defaultConstraints);
      const differentMetadata = { ...validMetadata, filename: 'different.png' };
      const image2 = new TestImage(
        validUrl,
        differentMetadata,
        defaultConstraints
      );
      expect(image1.equals(image2)).toBe(false);
    });

    it('should return false for different sizes', () => {
      const image1 = new TestImage(validUrl, validMetadata, defaultConstraints);
      const differentMetadata = { ...validMetadata, size: 8192 };
      const image2 = new TestImage(
        validUrl,
        differentMetadata,
        defaultConstraints
      );
      expect(image1.equals(image2)).toBe(false);
    });

    it('should return false for different formats', () => {
      const image1 = new TestImage(validUrl, validMetadata, defaultConstraints);
      const differentMetadata = { ...validMetadata, format: 'jpg' };
      const image2 = new TestImage(
        validUrl,
        differentMetadata,
        defaultConstraints
      );
      expect(image1.equals(image2)).toBe(false);
    });

    it('should return false when comparing to null', () => {
      const image = new TestImage(validUrl, validMetadata, defaultConstraints);
      expect(image.equals(null)).toBe(false);
    });

    it('should return false when comparing to undefined', () => {
      const image = new TestImage(validUrl, validMetadata, defaultConstraints);
      expect(image.equals(undefined)).toBe(false);
    });

    it('should ignore differences in non-compared fields', () => {
      const image1 = new TestImage(validUrl, validMetadata, defaultConstraints);
      const differentMetadata = {
        ...validMetadata,
        originalName: 'different-original.png',
        mimeType: 'image/jpeg',
        uploadedAt: new Date('2023-01-01T00:00:00Z'),
      };
      const image2 = new TestImage(
        validUrl,
        differentMetadata,
        defaultConstraints
      );
      expect(image1.equals(image2)).toBe(true);
    });
  });

  describe('Custom Constraints', () => {
    it('should use entity name in error messages', () => {
      const customConstraints = {
        ...defaultConstraints,
        entityName: 'Profile picture',
      };

      expect(() => {
        new TestImage('', validMetadata, customConstraints);
      }).toThrow('Profile picture URL cannot be empty');
    });

    it('should validate against custom extensions', () => {
      const customConstraints = {
        ...defaultConstraints,
        validExtensions: ['.ico', '.png'],
        entityName: 'Favicon',
      };

      expect(() => {
        new TestImage(
          'https://example.com/image.jpg',
          validMetadata,
          customConstraints
        );
      }).toThrow('Favicon must have a valid extension');

      expect(() => {
        new TestImage(
          'https://example.com/image.ico',
          { ...validMetadata, format: 'ico', mimeType: 'image/x-icon' },
          {
            ...customConstraints,
            validFormats: ['ico', 'png'],
            validMimeTypes: ['image/x-icon', 'image/png'],
          }
        );
      }).not.toThrow();
    });

    it('should validate against custom MIME types', () => {
      const customConstraints = {
        ...defaultConstraints,
        validMimeTypes: ['image/x-icon', 'image/png'],
        validFormats: ['ico', 'png'],
        entityName: 'Icon',
      };

      const icoMetadata = {
        ...validMetadata,
        mimeType: 'image/x-icon',
        format: 'ico',
      };

      expect(() => {
        new TestImage(
          'https://example.com/image.png',
          icoMetadata,
          customConstraints
        );
      }).not.toThrow();

      expect(() => {
        new TestImage(
          'https://example.com/image.png',
          { ...validMetadata, mimeType: 'image/gif' },
          customConstraints
        );
      }).toThrow('Icon MIME type must be one of');
    });
  });
});
