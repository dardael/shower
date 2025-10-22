import {
  SocialNetworkType,
  SocialNetworkTypeValueObject,
} from '@/domain/settings/value-objects/SocialNetworkType';

describe('SocialNetworkTypeValueObject', () => {
  describe('constructor', () => {
    it('should create a valid SocialNetworkTypeValueObject', () => {
      const type = new SocialNetworkTypeValueObject(
        SocialNetworkType.INSTAGRAM
      );

      expect(type.value).toBe(SocialNetworkType.INSTAGRAM);
    });
  });

  describe('getDefaultLabel', () => {
    it('should return correct default labels', () => {
      const instagram = new SocialNetworkTypeValueObject(
        SocialNetworkType.INSTAGRAM
      );
      const facebook = new SocialNetworkTypeValueObject(
        SocialNetworkType.FACEBOOK
      );
      const linkedin = new SocialNetworkTypeValueObject(
        SocialNetworkType.LINKEDIN
      );
      const email = new SocialNetworkTypeValueObject(SocialNetworkType.EMAIL);
      const phone = new SocialNetworkTypeValueObject(SocialNetworkType.PHONE);

      expect(instagram.getDefaultLabel()).toBe('Instagram');
      expect(facebook.getDefaultLabel()).toBe('Facebook');
      expect(linkedin.getDefaultLabel()).toBe('LinkedIn');
      expect(email.getDefaultLabel()).toBe('Email');
      expect(phone.getDefaultLabel()).toBe('Phone');
    });
  });

  describe('getIconComponent', () => {
    it('should return correct icon component names', () => {
      const instagram = new SocialNetworkTypeValueObject(
        SocialNetworkType.INSTAGRAM
      );
      const facebook = new SocialNetworkTypeValueObject(
        SocialNetworkType.FACEBOOK
      );
      const linkedin = new SocialNetworkTypeValueObject(
        SocialNetworkType.LINKEDIN
      );
      const email = new SocialNetworkTypeValueObject(SocialNetworkType.EMAIL);
      const phone = new SocialNetworkTypeValueObject(SocialNetworkType.PHONE);

      expect(instagram.getIconComponent()).toBe('FaInstagram');
      expect(facebook.getIconComponent()).toBe('FaFacebook');
      expect(linkedin.getIconComponent()).toBe('FaLinkedin');
      expect(email.getIconComponent()).toBe('FaEnvelope');
      expect(phone.getIconComponent()).toBe('FaPhone');
    });
  });

  describe('getUrlPlaceholder', () => {
    it('should return correct URL placeholders', () => {
      const instagram = new SocialNetworkTypeValueObject(
        SocialNetworkType.INSTAGRAM
      );
      const facebook = new SocialNetworkTypeValueObject(
        SocialNetworkType.FACEBOOK
      );
      const linkedin = new SocialNetworkTypeValueObject(
        SocialNetworkType.LINKEDIN
      );
      const email = new SocialNetworkTypeValueObject(SocialNetworkType.EMAIL);
      const phone = new SocialNetworkTypeValueObject(SocialNetworkType.PHONE);

      expect(instagram.getUrlPlaceholder()).toBe(
        'https://instagram.com/username'
      );
      expect(facebook.getUrlPlaceholder()).toBe('https://facebook.com/page');
      expect(linkedin.getUrlPlaceholder()).toBe(
        'https://linkedin.com/in/profile'
      );
      expect(email.getUrlPlaceholder()).toBe('mailto:contact@example.com');
      expect(phone.getUrlPlaceholder()).toBe('tel:+1234567890');
    });
  });

  describe('getUrlProtocol', () => {
    it('should return correct URL protocols', () => {
      const instagram = new SocialNetworkTypeValueObject(
        SocialNetworkType.INSTAGRAM
      );
      const facebook = new SocialNetworkTypeValueObject(
        SocialNetworkType.FACEBOOK
      );
      const linkedin = new SocialNetworkTypeValueObject(
        SocialNetworkType.LINKEDIN
      );
      const email = new SocialNetworkTypeValueObject(SocialNetworkType.EMAIL);
      const phone = new SocialNetworkTypeValueObject(SocialNetworkType.PHONE);

      expect(instagram.getUrlProtocol()).toBe('https://');
      expect(facebook.getUrlProtocol()).toBe('https://');
      expect(linkedin.getUrlProtocol()).toBe('https://');
      expect(email.getUrlProtocol()).toBe('mailto:');
      expect(phone.getUrlProtocol()).toBe('tel:');
    });
  });

  describe('equals', () => {
    it('should return true for equal types', () => {
      const type1 = new SocialNetworkTypeValueObject(
        SocialNetworkType.INSTAGRAM
      );
      const type2 = new SocialNetworkTypeValueObject(
        SocialNetworkType.INSTAGRAM
      );

      expect(type1.equals(type2)).toBe(true);
    });

    it('should return false for different types', () => {
      const type1 = new SocialNetworkTypeValueObject(
        SocialNetworkType.INSTAGRAM
      );
      const type2 = new SocialNetworkTypeValueObject(
        SocialNetworkType.FACEBOOK
      );

      expect(type1.equals(type2)).toBe(false);
    });
  });

  describe('fromString', () => {
    it('should create valid type from string', () => {
      const type = SocialNetworkTypeValueObject.fromString('instagram');

      expect(type.value).toBe(SocialNetworkType.INSTAGRAM);
    });

    it('should throw error for invalid string', () => {
      expect(() => {
        SocialNetworkTypeValueObject.fromString('invalid');
      }).toThrow('Invalid social network type: invalid');
    });
  });
});
