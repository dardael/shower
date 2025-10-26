import {
  SOCIAL_NETWORK_CONFIG,
  SocialNetworkType,
} from '@/domain/settings/constants/SocialNetworkConfig';

// Re-export for backward compatibility
export { SocialNetworkType };

export class SocialNetworkTypeValueObject {
  private readonly _value: SocialNetworkType;

  constructor(value: SocialNetworkType) {
    this._value = value;
  }

  get value(): SocialNetworkType {
    return this._value;
  }

  getDefaultLabel(): string {
    return SOCIAL_NETWORK_CONFIG[this._value].label;
  }

  getIconComponent(): string {
    return SOCIAL_NETWORK_CONFIG[this._value].icon;
  }

  getUrlPlaceholder(): string {
    return SOCIAL_NETWORK_CONFIG[this._value].placeholder;
  }

  getUrlProtocol(): string {
    return SOCIAL_NETWORK_CONFIG[this._value].protocol;
  }

  equals(other: SocialNetworkTypeValueObject): boolean {
    return this._value === other._value;
  }

  static fromString(value: string): SocialNetworkTypeValueObject {
    if (
      !Object.values(SocialNetworkType).includes(value as SocialNetworkType)
    ) {
      throw new Error(`Invalid social network type: ${value}`);
    }
    return new SocialNetworkTypeValueObject(value as SocialNetworkType);
  }
}
