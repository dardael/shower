import { SocialNetworkType } from '@/domain/settings/value-objects/SocialNetworkType';
import { UnifiedLogger } from '@/application/shared/UnifiedLogger';
import { inject } from 'tsyringe';

export interface SocialNetworkValidationError {
  field: string;
  message: string;
}

export interface SocialNetworkValidationResult {
  isValid: boolean;
  errors: SocialNetworkValidationError[];
}

export class SocialNetworkValidationService {
  constructor(
    @inject('UnifiedLogger') private readonly logger: UnifiedLogger
  ) {}

  validateSocialNetworkData(
    socialNetwork: unknown,
    index: number
  ): SocialNetworkValidationResult {
    const errors: SocialNetworkValidationError[] = [];

    if (!socialNetwork || typeof socialNetwork !== 'object') {
      errors.push({
        field: 'socialNetwork',
        message: 'Social network data must be an object',
      });
      return { isValid: false, errors };
    }

    const data = socialNetwork as Record<string, unknown>;

    // Validate type
    if (!data.type || typeof data.type !== 'string') {
      errors.push({
        field: 'type',
        message: 'type is required and must be a string',
      });
    } else if (
      !Object.values(SocialNetworkType).includes(data.type as SocialNetworkType)
    ) {
      errors.push({
        field: 'type',
        message: `type must be one of: ${Object.values(SocialNetworkType).join(', ')}`,
      });
    }

    // Validate URL
    if (typeof data.url !== 'string') {
      errors.push({
        field: 'url',
        message: 'url is required and must be a string',
      });
    } else if (data.url.length > 2048) {
      errors.push({
        field: 'url',
        message: 'url must be less than 2048 characters',
      });
    }

    // Validate label
    if (typeof data.label !== 'string') {
      errors.push({
        field: 'label',
        message: 'label is required and must be a string',
      });
    } else if (data.label.length === 0) {
      errors.push({
        field: 'label',
        message: 'label cannot be empty',
      });
    } else if (data.label.length > 50) {
      errors.push({
        field: 'label',
        message: 'label must be less than 50 characters',
      });
    } else if (/<|>|&|"|'/.test(data.label)) {
      errors.push({
        field: 'label',
        message: 'label contains invalid characters',
      });
    }

    // Validate enabled
    if (typeof data.enabled !== 'boolean') {
      errors.push({
        field: 'enabled',
        message: 'enabled is required and must be a boolean',
      });
    }

    const result = {
      isValid: errors.length === 0,
      errors,
    };

    if (!result.isValid) {
      this.logger.warn('Validation failed for social network', {
        index,
        socialNetworkType: data.type,
        errorCount: result.errors.length,
        errors: result.errors,
      });
    }

    return result;
  }

  validateSocialNetworksArray(
    socialNetworks: unknown
  ): SocialNetworkValidationResult {
    if (!Array.isArray(socialNetworks)) {
      return {
        isValid: false,
        errors: [
          {
            field: 'socialNetworks',
            message: 'Invalid social networks data: expected an array',
          },
        ],
      };
    }

    const allErrors: SocialNetworkValidationError[] = [];

    for (const [index, socialNetwork] of socialNetworks.entries()) {
      const result = this.validateSocialNetworkData(socialNetwork, index);
      if (!result.isValid) {
        allErrors.push(...result.errors);
      }
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
    };
  }
}
