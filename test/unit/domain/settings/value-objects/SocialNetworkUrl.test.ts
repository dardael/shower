import { SocialNetworkUrl } from '@/domain/settings/value-objects/SocialNetworkUrl';
import { SocialNetworkType } from '@/domain/settings/value-objects/SocialNetworkType';
import type { ISocialNetworkUrlNormalizationService } from '@/domain/settings/services/ISocialNetworkUrlNormalizationService';

describe('SocialNetworkUrl', () => {
  describe('constructor', () => {
    it('should create a valid SocialNetworkUrl with empty string', () => {
      const url = new SocialNetworkUrl('', SocialNetworkType.INSTAGRAM);

      expect(url.value).toBe('');
      expect(url.isEmpty).toBe(true);
      expect(url.isValid).toBe(true); // Empty URLs are valid (represent disabled networks)
    });

    it('should create a valid SocialNetworkUrl with HTTPS URL', () => {
      const url = new SocialNetworkUrl(
        'https://instagram.com/test',
        SocialNetworkType.INSTAGRAM
      );

      expect(url.value).toBe('https://instagram.com/test');
      expect(url.isEmpty).toBe(false);
      expect(url.isValid).toBe(true);
    });

    it('should create a valid SocialNetworkUrl with mailto', () => {
      const url = new SocialNetworkUrl(
        'mailto:test@example.com',
        SocialNetworkType.EMAIL
      );

      expect(url.value).toBe('mailto:test@example.com');
      expect(url.isEmpty).toBe(false);
      expect(url.isValid).toBe(true);
    });

    it('should create a valid SocialNetworkUrl with tel', () => {
      const url = new SocialNetworkUrl(
        'tel:+1234567890',
        SocialNetworkType.PHONE
      );

      expect(url.value).toBe('tel:+1234567890');
      expect(url.isEmpty).toBe(false);
      expect(url.isValid).toBe(true);
    });
  });

  describe('validation', () => {
    it('should throw error for invalid HTTPS URL', () => {
      expect(() => {
        new SocialNetworkUrl('invalid-url', SocialNetworkType.INSTAGRAM);
      }).toThrow('Invalid URL format. Expected: https://...');
    });

    it('should throw error for HTTP URL without protocol', () => {
      expect(() => {
        new SocialNetworkUrl('instagram.com/test', SocialNetworkType.INSTAGRAM);
      }).toThrow('Invalid URL format. Expected: https://...');
    });

    it('should throw error for invalid email format', () => {
      expect(() => {
        new SocialNetworkUrl('invalid-email', SocialNetworkType.EMAIL);
      }).toThrow('Invalid email format. Expected: mailto:email@example.com');
    });

    it('should throw error for email without mailto protocol', () => {
      expect(() => {
        new SocialNetworkUrl('test@example.com', SocialNetworkType.EMAIL);
      }).toThrow('Invalid email format. Expected: mailto:email@example.com');
    });

    it('should throw error for invalid phone format', () => {
      expect(() => {
        new SocialNetworkUrl('invalid-phone', SocialNetworkType.PHONE);
      }).toThrow('Invalid phone format. Expected: tel:+1234567890');
    });

    it('should throw error for phone without tel protocol', () => {
      expect(() => {
        new SocialNetworkUrl('+1234567890', SocialNetworkType.PHONE);
      }).toThrow('Invalid phone format. Expected: tel:+1234567890');
    });
  });

  describe('equals', () => {
    it('should return true for equal URLs', () => {
      const url1 = new SocialNetworkUrl(
        'https://instagram.com/test',
        SocialNetworkType.INSTAGRAM
      );
      const url2 = new SocialNetworkUrl(
        'https://instagram.com/test',
        SocialNetworkType.INSTAGRAM
      );

      expect(url1.equals(url2)).toBe(true);
    });

    it('should return false for different URLs', () => {
      const url1 = new SocialNetworkUrl(
        'https://instagram.com/test1',
        SocialNetworkType.INSTAGRAM
      );
      const url2 = new SocialNetworkUrl(
        'https://instagram.com/test2',
        SocialNetworkType.INSTAGRAM
      );

      expect(url1.equals(url2)).toBe(false);
    });
  });

  describe('static methods', () => {
    it('should create empty URL', () => {
      const url = SocialNetworkUrl.createEmpty();

      expect(url.value).toBe('');
      expect(url.isEmpty).toBe(true);
    });

    it('should create URL from string', () => {
      const url = SocialNetworkUrl.fromString(
        'https://instagram.com/test',
        SocialNetworkType.INSTAGRAM
      );

      expect(url.value).toBe('https://instagram.com/test');
      expect(url.isEmpty).toBe(false);
      expect(url.isValid).toBe(true);
    });

    it('should create URL with normalization applied', () => {
      const mockService = {
        normalizeUrl: jest.fn().mockReturnValue('mailto:test@example.com'),
      } as unknown as ISocialNetworkUrlNormalizationService;

      const url = SocialNetworkUrl.fromStringWithNormalization(
        'test@example.com',
        SocialNetworkType.EMAIL,
        mockService
      );

      expect(mockService.normalizeUrl).toHaveBeenCalledWith(
        'test@example.com',
        SocialNetworkType.EMAIL
      );
      expect(url.value).toBe('mailto:test@example.com');
      expect(url.isEmpty).toBe(false);
      expect(url.isValid).toBe(true);
    });

    it('should create empty URL with normalization when input is empty', () => {
      const mockService = {
        normalizeUrl: jest.fn().mockReturnValue(''),
      } as unknown as ISocialNetworkUrlNormalizationService;

      const url = SocialNetworkUrl.fromStringWithNormalization(
        '',
        SocialNetworkType.EMAIL,
        mockService
      );

      expect(mockService.normalizeUrl).toHaveBeenCalledWith(
        '',
        SocialNetworkType.EMAIL
      );
      expect(url.value).toBe('');
      expect(url.isEmpty).toBe(true);
      expect(url.isValid).toBe(true);
    });
  });
});
