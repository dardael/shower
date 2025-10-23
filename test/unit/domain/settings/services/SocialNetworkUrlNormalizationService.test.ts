import { SocialNetworkUrlNormalizationService } from '@/domain/settings/services/SocialNetworkUrlNormalizationService';
import { SocialNetworkType } from '@/domain/settings/value-objects/SocialNetworkType';
import type { ISocialNetworkUrlNormalizationService } from '@/domain/settings/services/ISocialNetworkUrlNormalizationService';
import { Logger } from '@/application/shared/Logger';

describe('SocialNetworkUrlNormalizationService', () => {
  let service: ISocialNetworkUrlNormalizationService;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(() => {
    mockLogger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      // Add minimal required methods to satisfy Logger interface
      logger: {
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
      },
      normalizeError: jest.fn(),
      execute: jest.fn(),
      withContext: jest.fn(),
      logApiRequest: jest.fn(),
      logApiResponse: jest.fn(),
      logError: jest.fn(),
      logSecurity: jest.fn(),
      logUserAction: jest.fn(),
      logBusinessEvent: jest.fn(),
      startTimer: jest.fn(),
      endTimer: jest.fn(),
      measure: jest.fn(),
      logIf: jest.fn(),
      debugIf: jest.fn(),
      batch: jest.fn(),
    } as unknown as jest.Mocked<Logger>;

    service = new SocialNetworkUrlNormalizationService(mockLogger);
  });

  describe('normalizeUrl', () => {
    describe('Email normalization', () => {
      it('should add mailto: prefix to email without protocol', () => {
        const result = service.normalizeUrl(
          'test@example.com',
          SocialNetworkType.EMAIL
        );
        expect(result).toBe('mailto:test@example.com');
      });

      it('should not modify email with existing mailto: prefix', () => {
        const result = service.normalizeUrl(
          'mailto:test@example.com',
          SocialNetworkType.EMAIL
        );
        expect(result).toBe('mailto:test@example.com');
      });

      it('should not modify invalid email format', () => {
        const result = service.normalizeUrl(
          'invalid-email',
          SocialNetworkType.EMAIL
        );
        expect(result).toBe('invalid-email');
      });

      it('should handle empty email', () => {
        const result = service.normalizeUrl('', SocialNetworkType.EMAIL);
        expect(result).toBe('');
      });

      it('should handle whitespace-only email', () => {
        const result = service.normalizeUrl('   ', SocialNetworkType.EMAIL);
        expect(result).toBe('');
      });
    });

    describe('Phone normalization', () => {
      it('should add tel: prefix to phone number without protocol', () => {
        const result = service.normalizeUrl(
          '+1234567890',
          SocialNetworkType.PHONE
        );
        expect(result).toBe('tel:+1234567890');
      });

      it('should add tel: prefix to formatted phone number', () => {
        const result = service.normalizeUrl(
          '(555) 123-4567',
          SocialNetworkType.PHONE
        );
        expect(result).toBe('tel:(555) 123-4567');
      });

      it('should not modify phone with existing tel: prefix', () => {
        const result = service.normalizeUrl(
          'tel:+1234567890',
          SocialNetworkType.PHONE
        );
        expect(result).toBe('tel:+1234567890');
      });

      it('should not modify invalid phone format', () => {
        const result = service.normalizeUrl('abc123', SocialNetworkType.PHONE);
        expect(result).toBe('abc123');
      });

      it('should handle empty phone', () => {
        const result = service.normalizeUrl('', SocialNetworkType.PHONE);
        expect(result).toBe('');
      });

      it('should handle whitespace-only phone', () => {
        const result = service.normalizeUrl('   ', SocialNetworkType.PHONE);
        expect(result).toBe('');
      });
    });

    describe('Social network URLs', () => {
      it('should not modify Instagram URLs', () => {
        const result = service.normalizeUrl(
          'https://instagram.com/username',
          SocialNetworkType.INSTAGRAM
        );
        expect(result).toBe('https://instagram.com/username');
      });

      it('should not modify Facebook URLs', () => {
        const result = service.normalizeUrl(
          'https://facebook.com/page',
          SocialNetworkType.FACEBOOK
        );
        expect(result).toBe('https://facebook.com/page');
      });

      it('should not modify LinkedIn URLs', () => {
        const result = service.normalizeUrl(
          'https://linkedin.com/in/profile',
          SocialNetworkType.LINKEDIN
        );
        expect(result).toBe('https://linkedin.com/in/profile');
      });

      it('should handle empty social network URLs', () => {
        const result = service.normalizeUrl('', SocialNetworkType.INSTAGRAM);
        expect(result).toBe('');
      });
    });

    describe('Logging', () => {
      it('should log normalization when applied', () => {
        service.normalizeUrl('test@example.com', SocialNetworkType.EMAIL);
        expect(mockLogger.debug).toHaveBeenCalledWith('URL normalized', {
          originalUrl: 'test@example.com',
          normalizedUrl: 'mailto:test@example.com',
          type: SocialNetworkType.EMAIL,
        });
      });

      it('should not log when no normalization is needed', () => {
        service.normalizeUrl(
          'mailto:test@example.com',
          SocialNetworkType.EMAIL
        );
        expect(mockLogger.debug).not.toHaveBeenCalled();
      });
    });
  });

  describe('requiresNormalization', () => {
    describe('Email requirements', () => {
      it('should return true for valid email without mailto: prefix', () => {
        const result = service.requiresNormalization(
          'test@example.com',
          SocialNetworkType.EMAIL
        );
        expect(result).toBe(true);
      });

      it('should return false for email with mailto: prefix', () => {
        const result = service.requiresNormalization(
          'mailto:test@example.com',
          SocialNetworkType.EMAIL
        );
        expect(result).toBe(false);
      });

      it('should return false for invalid email format', () => {
        const result = service.requiresNormalization(
          'invalid-email',
          SocialNetworkType.EMAIL
        );
        expect(result).toBe(false);
      });

      it('should return false for empty email', () => {
        const result = service.requiresNormalization(
          '',
          SocialNetworkType.EMAIL
        );
        expect(result).toBe(false);
      });
    });

    describe('Phone requirements', () => {
      it('should return true for valid phone without tel: prefix', () => {
        const result = service.requiresNormalization(
          '+1234567890',
          SocialNetworkType.PHONE
        );
        expect(result).toBe(true);
      });

      it('should return false for phone with tel: prefix', () => {
        const result = service.requiresNormalization(
          'tel:+1234567890',
          SocialNetworkType.PHONE
        );
        expect(result).toBe(false);
      });

      it('should return false for invalid phone format', () => {
        const result = service.requiresNormalization(
          'abc123',
          SocialNetworkType.PHONE
        );
        expect(result).toBe(false);
      });

      it('should return false for phone with insufficient digits', () => {
        const result = service.requiresNormalization(
          '123',
          SocialNetworkType.PHONE
        );
        expect(result).toBe(false);
      });

      it('should return false for empty phone', () => {
        const result = service.requiresNormalization(
          '',
          SocialNetworkType.PHONE
        );
        expect(result).toBe(false);
      });
    });

    describe('Social network requirements', () => {
      it('should return false for all social network types', () => {
        const instagramResult = service.requiresNormalization(
          'https://instagram.com/username',
          SocialNetworkType.INSTAGRAM
        );
        const facebookResult = service.requiresNormalization(
          'https://facebook.com/page',
          SocialNetworkType.FACEBOOK
        );
        const linkedinResult = service.requiresNormalization(
          'https://linkedin.com/in/profile',
          SocialNetworkType.LINKEDIN
        );

        expect(instagramResult).toBe(false);
        expect(facebookResult).toBe(false);
        expect(linkedinResult).toBe(false);
      });
    });
  });
});
