export enum SocialNetworkType {
  INSTAGRAM = 'instagram',
  FACEBOOK = 'facebook',
  LINKEDIN = 'linkedin',
  EMAIL = 'email',
  PHONE = 'phone',
}

export class SocialNetworkTypeValueObject {
  private readonly _value: SocialNetworkType;

  constructor(value: SocialNetworkType) {
    this._value = value;
  }

  get value(): SocialNetworkType {
    return this._value;
  }

  getDefaultLabel(): string {
    const labels = {
      [SocialNetworkType.INSTAGRAM]: 'Instagram',
      [SocialNetworkType.FACEBOOK]: 'Facebook',
      [SocialNetworkType.LINKEDIN]: 'LinkedIn',
      [SocialNetworkType.EMAIL]: 'Email',
      [SocialNetworkType.PHONE]: 'Phone',
    };
    return labels[this._value];
  }

  getIconComponent(): string {
    const icons = {
      [SocialNetworkType.INSTAGRAM]: 'FaInstagram',
      [SocialNetworkType.FACEBOOK]: 'FaFacebook',
      [SocialNetworkType.LINKEDIN]: 'FaLinkedin',
      [SocialNetworkType.EMAIL]: 'FaEnvelope',
      [SocialNetworkType.PHONE]: 'FaPhone',
    };
    return icons[this._value];
  }

  getUrlPlaceholder(): string {
    const placeholders = {
      [SocialNetworkType.INSTAGRAM]: 'https://instagram.com/username',
      [SocialNetworkType.FACEBOOK]: 'https://facebook.com/page',
      [SocialNetworkType.LINKEDIN]: 'https://linkedin.com/in/profile',
      [SocialNetworkType.EMAIL]: 'mailto:contact@example.com',
      [SocialNetworkType.PHONE]: 'tel:+1234567890',
    };
    return placeholders[this._value];
  }

  getUrlProtocol(): string {
    const protocols = {
      [SocialNetworkType.INSTAGRAM]: 'https://',
      [SocialNetworkType.FACEBOOK]: 'https://',
      [SocialNetworkType.LINKEDIN]: 'https://',
      [SocialNetworkType.EMAIL]: 'mailto:',
      [SocialNetworkType.PHONE]: 'tel:',
    };
    return protocols[this._value];
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
