import { SocialNetworkValidationService } from '@/domain/settings/services/SocialNetworkValidationService';
import { SocialNetworkType } from '@/domain/settings/value-objects/SocialNetworkType';
import type { ILogger } from '@/application/shared/ILogger';

describe('SocialNetworkValidationService', () => {
  let validationService: SocialNetworkValidationService;
  let mockLogger: ILogger;

  beforeEach(() => {
    mockLogger = {
      logInfo: jest.fn(),
      logWarning: jest.fn(),
      logError: jest.fn(),
      logDebug: jest.fn(),
    } as unknown as ILogger;

    validationService = new SocialNetworkValidationService(mockLogger);
  });

  describe('validateSocialNetworkData', () => {
    it('should validate a valid social network', () => {
      const validSocialNetwork = {
        type: SocialNetworkType.INSTAGRAM,
        url: 'https://instagram.com/username',
        label: 'Instagram',
        enabled: true,
      };

      const result = validationService.validateSocialNetworkData(
        validSocialNetwork,
        0
      );

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid type', () => {
      const invalidSocialNetwork = {
        type: 'invalid',
        url: 'https://instagram.com/username',
        label: 'Instagram',
        enabled: true,
      };

      const result = validationService.validateSocialNetworkData(
        invalidSocialNetwork,
        0
      );

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'type',
        message: `type must be one of: ${Object.values(SocialNetworkType).join(', ')}`,
      });
    });

    it('should reject missing type', () => {
      const invalidSocialNetwork = {
        url: 'https://instagram.com/username',
        label: 'Instagram',
        enabled: true,
      };

      const result = validationService.validateSocialNetworkData(
        invalidSocialNetwork,
        0
      );

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'type',
        message: 'type is required and must be a string',
      });
    });

    it('should reject URL that is too long', () => {
      const invalidSocialNetwork = {
        type: SocialNetworkType.INSTAGRAM,
        url: 'https://instagram.com/' + 'a'.repeat(2050),
        label: 'Instagram',
        enabled: true,
      };

      const result = validationService.validateSocialNetworkData(
        invalidSocialNetwork,
        0
      );

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'url',
        message: 'url must be less than 2048 characters',
      });
    });

    it('should reject empty label', () => {
      const invalidSocialNetwork = {
        type: SocialNetworkType.INSTAGRAM,
        url: 'https://instagram.com/username',
        label: '',
        enabled: true,
      };

      const result = validationService.validateSocialNetworkData(
        invalidSocialNetwork,
        0
      );

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'label',
        message: 'label cannot be empty',
      });
    });

    it('should reject label with invalid characters', () => {
      const invalidSocialNetwork = {
        type: SocialNetworkType.INSTAGRAM,
        url: 'https://instagram.com/username',
        label: '<script>alert("xss")</script>',
        enabled: true,
      };

      const result = validationService.validateSocialNetworkData(
        invalidSocialNetwork,
        0
      );

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'label',
        message: 'label contains invalid characters',
      });
    });

    it('should reject non-boolean enabled field', () => {
      const invalidSocialNetwork = {
        type: SocialNetworkType.INSTAGRAM,
        url: 'https://instagram.com/username',
        label: 'Instagram',
        enabled: 'true',
      };

      const result = validationService.validateSocialNetworkData(
        invalidSocialNetwork,
        0
      );

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'enabled',
        message: 'enabled is required and must be a boolean',
      });
    });

    it('should log warning when validation fails', () => {
      const invalidSocialNetwork = {
        type: 'invalid',
        url: 'https://instagram.com/username',
        label: 'Instagram',
        enabled: true,
      };

      validationService.validateSocialNetworkData(invalidSocialNetwork, 2);

      expect(mockLogger.logWarning).toHaveBeenCalledWith(
        'Validation failed for social network at index 2',
        expect.objectContaining({
          index: 2,
          socialNetwork: invalidSocialNetwork,
          errors: expect.any(Array),
        })
      );
    });
  });

  describe('validateSocialNetworksArray', () => {
    it('should validate an array of valid social networks', () => {
      const validSocialNetworks = [
        {
          type: SocialNetworkType.INSTAGRAM,
          url: 'https://instagram.com/username',
          label: 'Instagram',
          enabled: true,
        },
        {
          type: SocialNetworkType.FACEBOOK,
          url: 'https://facebook.com/page',
          label: 'Facebook',
          enabled: false,
        },
      ];

      const result =
        validationService.validateSocialNetworksArray(validSocialNetworks);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject non-array input', () => {
      const invalidInput = 'not an array';

      const result =
        validationService.validateSocialNetworksArray(invalidInput);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'socialNetworks',
        message: 'Invalid social networks data: expected an array',
      });
    });

    it('should accumulate errors from multiple invalid social networks', () => {
      const invalidSocialNetworks = [
        {
          type: 'invalid1',
          url: 'https://instagram.com/username',
          label: 'Instagram',
          enabled: true,
        },
        {
          type: 'invalid2',
          url: 'https://facebook.com/page',
          label: '',
          enabled: 'not-boolean',
        },
      ];

      const result = validationService.validateSocialNetworksArray(
        invalidSocialNetworks
      );

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(2); // Multiple errors
    });
  });
});
