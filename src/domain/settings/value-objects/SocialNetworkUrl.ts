import { SocialNetworkType } from '@/domain/settings/value-objects/SocialNetworkType';
import type { ISocialNetworkUrlNormalizationService } from '@/domain/settings/services/ISocialNetworkUrlNormalizationService';

export class SocialNetworkUrl {
  private readonly _value: string;

  constructor(value: string, type: SocialNetworkType) {
    this.validateUrl(value, type);
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  get isEmpty(): boolean {
    return this._value.trim() === '';
  }

  get isValid(): boolean {
    // Empty URLs are valid (they represent disabled networks)
    if (this._value.trim() === '') {
      return true;
    }

    // For non-empty URLs, validity is determined by constructor validation
    // If we got here without throwing an error, the URL is valid
    return true;
  }

  private validateUrl(value: string, type: SocialNetworkType): void {
    if (value.trim() === '') {
      return; // Empty URLs are allowed (disabled networks)
    }

    const protocols = {
      [SocialNetworkType.INSTAGRAM]: /^https?:\/\/.+/,
      [SocialNetworkType.FACEBOOK]: /^https?:\/\/.+/,
      [SocialNetworkType.LINKEDIN]: /^https?:\/\/.+/,
      [SocialNetworkType.EMAIL]: /^mailto:.+/,
      [SocialNetworkType.PHONE]: /^tel:.+/,
    };

    const pattern = protocols[type];
    if (!pattern) {
      throw new Error(`Unsupported social network type: ${type}`);
    }

    if (!pattern.test(value)) {
      if (type === SocialNetworkType.EMAIL) {
        throw new Error(
          'Invalid email format. Expected: mailto:email@example.com'
        );
      }
      if (type === SocialNetworkType.PHONE) {
        throw new Error('Invalid phone format. Expected: tel:+1234567890');
      }
      throw new Error('Invalid URL format. Expected: https://...');
    }

    // Additional validation for email format
    if (type === SocialNetworkType.EMAIL) {
      const emailPattern = /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        throw new Error(
          'Invalid email format. Expected: mailto:email@example.com'
        );
      }
    }

    // Additional validation for phone format
    if (type === SocialNetworkType.PHONE) {
      const phonePattern = /^tel:[\d\s\-\+\(\)]+$/;
      if (!phonePattern.test(value)) {
        throw new Error('Invalid phone format. Expected: tel:+1234567890');
      }
    }

    // Additional validation for URLs
    if (type !== SocialNetworkType.EMAIL && type !== SocialNetworkType.PHONE) {
      try {
        new URL(value);
      } catch {
        throw new Error('Invalid URL format');
      }
    }
  }

  equals(other: SocialNetworkUrl): boolean {
    return this._value === other._value;
  }

  static createEmpty(): SocialNetworkUrl {
    return new SocialNetworkUrl('', SocialNetworkType.INSTAGRAM);
  }

  static fromString(value: string, type: SocialNetworkType): SocialNetworkUrl {
    return new SocialNetworkUrl(value, type);
  }

  static fromStringWithNormalization(
    value: string,
    type: SocialNetworkType,
    normalizationService: ISocialNetworkUrlNormalizationService
  ): SocialNetworkUrl {
    const normalizedUrl = normalizationService.normalizeUrl(value, type);
    return new SocialNetworkUrl(normalizedUrl, type);
  }
}
