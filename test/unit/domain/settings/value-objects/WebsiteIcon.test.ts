import { describe, it, expect } from '@jest/globals';
import { WebsiteIcon } from '../../../../../src/domain/settings/value-objects/WebsiteIcon';
import type { IconMetadata } from '../../../../../src/domain/settings/value-objects/WebsiteIcon';

describe('WebsiteIcon', () => {
  const validMetadata: IconMetadata = {
    filename: 'favicon-1234567890.ico',
    originalName: 'favicon.ico',
    size: 4096,
    format: 'ico',
    mimeType: 'image/x-icon',
    uploadedAt: new Date('2024-01-01T00:00:00Z'),
  };

  const validUrl = 'https://example.com/icons/favicon-1234567890.ico';

  describe('Constructor', () => {
    it('should create a WebsiteIcon with valid URL and metadata', () => {
      const icon = new WebsiteIcon(validUrl, validMetadata);

      expect(icon.url).toBe(validUrl);
      expect(icon.metadata).toEqual(validMetadata);
      expect(icon.filename).toBe(validMetadata.filename);
      expect(icon.originalName).toBe(validMetadata.originalName);
      expect(icon.size).toBe(validMetadata.size);
      expect(icon.format).toBe(validMetadata.format);
      expect(icon.mimeType).toBe(validMetadata.mimeType);
      expect(icon.uploadedAt).toEqual(validMetadata.uploadedAt);
    });

    it('should throw error when URL is empty', () => {
      expect(() => {
        new WebsiteIcon('', validMetadata);
      }).toThrow('Website icon URL cannot be empty');
    });

    it('should throw error when URL is invalid', () => {
      expect(() => {
        new WebsiteIcon('invalid-url', validMetadata);
      }).toThrow('Website icon URL must be a valid URL');
    });

    it('should throw error when URL has invalid extension', () => {
      expect(() => {
        new WebsiteIcon('https://example.com/icon.txt', validMetadata);
      }).toThrow('Website icon must have a valid extension');
    });

    it('should throw error when metadata is null', () => {
      expect(() => {
        new WebsiteIcon(validUrl, null);
      }).toThrow('Website icon metadata cannot be null');
    });

    it('should throw error when filename is empty', () => {
      const invalidMetadata = { ...validMetadata, filename: '' };
      expect(() => {
        new WebsiteIcon(validUrl, invalidMetadata);
      }).toThrow('Website icon filename cannot be empty');
    });

    it('should throw error when original name is empty', () => {
      const invalidMetadata = { ...validMetadata, originalName: '' };
      expect(() => {
        new WebsiteIcon(validUrl, invalidMetadata);
      }).toThrow('Website icon original name cannot be empty');
    });

    it('should throw error when size is zero', () => {
      const invalidMetadata = { ...validMetadata, size: 0 };
      expect(() => {
        new WebsiteIcon(validUrl, invalidMetadata);
      }).toThrow('Website icon size must be greater than 0');
    });

    it('should throw error when size exceeds limit', () => {
      const invalidMetadata = { ...validMetadata, size: 3 * 1024 * 1024 }; // 3MB
      expect(() => {
        new WebsiteIcon(validUrl, invalidMetadata);
      }).toThrow('Website icon size cannot exceed 2MB');
    });

    it('should throw error when format is invalid', () => {
      const invalidMetadata = { ...validMetadata, format: 'txt' };
      expect(() => {
        new WebsiteIcon(validUrl, invalidMetadata);
      }).toThrow('Website icon format must be one of');
    });

    it('should throw error when MIME type is invalid', () => {
      const invalidMetadata = { ...validMetadata, mimeType: 'text/plain' };
      expect(() => {
        new WebsiteIcon(validUrl, invalidMetadata);
      }).toThrow('Website icon MIME type must be one of');
    });

    it('should throw error when upload date is invalid', () => {
      const invalidMetadata = {
        ...validMetadata,
        uploadedAt: null as unknown as Date,
      };
      expect(() => {
        new WebsiteIcon(validUrl, invalidMetadata);
      }).toThrow('Website icon upload date must be a valid date');
    });

    it('should throw error when upload date is in future', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const invalidMetadata = { ...validMetadata, uploadedAt: futureDate };
      expect(() => {
        new WebsiteIcon(validUrl, invalidMetadata);
      }).toThrow('Website icon upload date cannot be in the future');
    });
  });

  describe('URL Validation', () => {
    it('should accept valid URLs with different extensions', () => {
      const validUrls = [
        'https://example.com/favicon.ico',
        'https://example.com/icon.png',
        'https://example.com/logo.jpg',
        'https://example.com/image.jpeg',
        'https://example.com/graphic.svg',
        'https://example.com/animation.gif',
        'https://example.com/picture.webp',
      ];

      validUrls.forEach((url) => {
        expect(() => {
          new WebsiteIcon(url, validMetadata);
        }).not.toThrow();
      });
    });

    it('should handle case-insensitive extensions', () => {
      const caseInsensitiveUrls = [
        'https://example.com/favicon.ICO',
        'https://example.com/icon.PNG',
        'https://example.com/logo.JPG',
      ];

      caseInsensitiveUrls.forEach((url) => {
        expect(() => {
          new WebsiteIcon(url, validMetadata);
        }).not.toThrow();
      });
    });

    it('should trim whitespace from URL', () => {
      const urlWithSpaces = '  https://example.com/favicon.ico  ';
      const icon = new WebsiteIcon(urlWithSpaces, validMetadata);
      expect(icon.url).toBe('https://example.com/favicon.ico');
    });
  });

  describe('equals', () => {
    it('should return true for equal icons', () => {
      const icon1 = new WebsiteIcon(validUrl, validMetadata);
      const icon2 = new WebsiteIcon(validUrl, { ...validMetadata });
      expect(icon1.equals(icon2)).toBe(true);
    });

    it('should return false for different URLs', () => {
      const icon1 = new WebsiteIcon(validUrl, validMetadata);
      const icon2 = new WebsiteIcon(
        'https://example.com/different.ico',
        validMetadata
      );
      expect(icon1.equals(icon2)).toBe(false);
    });

    it('should return false for different metadata', () => {
      const icon1 = new WebsiteIcon(validUrl, validMetadata);
      const differentMetadata = { ...validMetadata, filename: 'different.ico' };
      const icon2 = new WebsiteIcon(validUrl, differentMetadata);
      expect(icon1.equals(icon2)).toBe(false);
    });

    it('should return false when comparing to null', () => {
      const icon = new WebsiteIcon(validUrl, validMetadata);
      expect(icon.equals(null)).toBe(false);
    });
  });

  describe('isOptimalForFavicon', () => {
    it('should return true for optimal formats and size', () => {
      const optimalMetadata = { ...validMetadata, size: 1024, format: 'ico' };
      const icon = new WebsiteIcon(validUrl, optimalMetadata);
      expect(icon.isOptimalForFavicon()).toBe(true);
    });

    it('should return false for non-optimal formats', () => {
      const nonOptimalMetadata = { ...validMetadata, format: 'gif' };
      const icon = new WebsiteIcon(validUrl, nonOptimalMetadata);
      expect(icon.isOptimalForFavicon()).toBe(false);
    });

    it('should return false for oversized icons', () => {
      const oversizedMetadata = { ...validMetadata, size: 512 * 512 }; // Large image
      const icon = new WebsiteIcon(validUrl, oversizedMetadata);
      expect(icon.isOptimalForFavicon()).toBe(false);
    });
  });

  describe('metadata immutability', () => {
    it('should return a copy of metadata', () => {
      const icon = new WebsiteIcon(validUrl, validMetadata);
      const metadata = icon.metadata;

      // Modify the returned metadata
      metadata.filename = 'modified.ico';

      // Original should be unchanged
      expect(icon.metadata.filename).toBe(validMetadata.filename);
    });
  });

  describe('createEmpty', () => {
    it('should return null for empty icon', () => {
      expect(WebsiteIcon.createEmpty()).toBeNull();
    });
  });
});
