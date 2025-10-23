import { SocialNetworkType } from '@/domain/settings/value-objects/SocialNetworkType';
import { ISocialNetworkUrlNormalizationService } from './ISocialNetworkUrlNormalizationService';
import { Logger } from '@/application/shared/Logger';
import { inject } from 'tsyringe';

export class SocialNetworkUrlNormalizationService
  implements ISocialNetworkUrlNormalizationService
{
  constructor(@inject('Logger') private readonly logger: Logger) {}

  normalizeUrl(url: string, type: SocialNetworkType): string {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      return trimmedUrl;
    }

    if (!this.requiresNormalization(trimmedUrl, type)) {
      return trimmedUrl;
    }

    const normalizedUrl = this.applyNormalization(trimmedUrl, type);

    this.logger.debug('URL normalized', {
      originalUrl: trimmedUrl,
      normalizedUrl,
      type,
    });

    return normalizedUrl;
  }

  requiresNormalization(url: string, type: SocialNetworkType): boolean {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      return false;
    }

    switch (type) {
      case SocialNetworkType.EMAIL:
        return (
          !trimmedUrl.startsWith('mailto:') && this.isValidEmail(trimmedUrl)
        );
      case SocialNetworkType.PHONE:
        return !trimmedUrl.startsWith('tel:') && this.isValidPhone(trimmedUrl);
      default:
        return false;
    }
  }

  private applyNormalization(url: string, type: SocialNetworkType): string {
    switch (type) {
      case SocialNetworkType.EMAIL:
        return `mailto:${url}`;
      case SocialNetworkType.PHONE:
        return `tel:${url}`;
      default:
        return url;
    }
  }

  private isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phonePattern = /^[\d\s\-\+\(\)]+$/;
    return phonePattern.test(phone) && phone.replace(/\D/g, '').length >= 7;
  }
}
