import { SocialNetwork } from '@/domain/settings/entities/SocialNetwork';
import { SocialNetworkType } from '@/domain/settings/value-objects/SocialNetworkType';

describe('SocialNetwork', () => {
  describe('constructor', () => {
    it('should create a valid SocialNetwork', () => {
      const socialNetwork = SocialNetwork.create(
        SocialNetworkType.INSTAGRAM,
        'https://instagram.com/test',
        'Instagram',
        true
      );

      expect(socialNetwork.type.value).toBe(SocialNetworkType.INSTAGRAM);
      expect(socialNetwork.url.value).toBe('https://instagram.com/test');
      expect(socialNetwork.label.value).toBe('Instagram');
      expect(socialNetwork.enabled).toBe(true);
    });

    it('should create a default SocialNetwork', () => {
      const socialNetwork = SocialNetwork.createDefault(
        SocialNetworkType.INSTAGRAM
      );

      expect(socialNetwork.type.value).toBe(SocialNetworkType.INSTAGRAM);
      expect(socialNetwork.url.value).toBe('');
      expect(socialNetwork.label.value).toBe('Instagram');
      expect(socialNetwork.enabled).toBe(false);
    });
  });

  describe('immutable methods', () => {
    it('should update URL immutably', () => {
      const socialNetwork = SocialNetwork.createDefault(
        SocialNetworkType.INSTAGRAM
      );
      const newUrl = 'https://instagram.com/new';

      const updatedSocialNetwork = socialNetwork.updateUrl(newUrl);

      expect(socialNetwork.url.value).toBe('');
      expect(updatedSocialNetwork.url.value).toBe(newUrl);
    });

    it('should update label immutably', () => {
      const socialNetwork = SocialNetwork.createDefault(
        SocialNetworkType.INSTAGRAM
      );
      const newLabel = 'My Instagram';

      const updatedSocialNetwork = socialNetwork.updateLabel(newLabel);

      expect(socialNetwork.label.value).toBe('Instagram');
      expect(updatedSocialNetwork.label.value).toBe(newLabel);
    });

    it('should update enabled status immutably', () => {
      const socialNetwork = SocialNetwork.createDefault(
        SocialNetworkType.INSTAGRAM
      );

      const enabledSocialNetwork = socialNetwork.withEnabled(true);
      expect(socialNetwork.enabled).toBe(false);
      expect(enabledSocialNetwork.enabled).toBe(true);

      const disabledSocialNetwork = enabledSocialNetwork.withEnabled(false);
      expect(enabledSocialNetwork.enabled).toBe(true);
      expect(disabledSocialNetwork.enabled).toBe(false);
    });
  });

  describe('enable/disable/toggle', () => {
    it('should enable social network immutably', () => {
      const socialNetwork = SocialNetwork.createDefault(
        SocialNetworkType.INSTAGRAM
      );

      const enabledSocialNetwork = socialNetwork.enable();

      expect(socialNetwork.enabled).toBe(false);
      expect(enabledSocialNetwork.enabled).toBe(true);
    });

    it('should disable social network immutably', () => {
      const socialNetwork = SocialNetwork.create(
        SocialNetworkType.INSTAGRAM,
        'https://instagram.com/test',
        'Instagram',
        true
      );

      const disabledSocialNetwork = socialNetwork.disable();

      expect(socialNetwork.enabled).toBe(true);
      expect(disabledSocialNetwork.enabled).toBe(false);
    });

    it('should toggle social network immutably', () => {
      const socialNetwork = SocialNetwork.createDefault(
        SocialNetworkType.INSTAGRAM
      );

      const toggledOnce = socialNetwork.toggle();
      expect(socialNetwork.enabled).toBe(false);
      expect(toggledOnce.enabled).toBe(true);

      const toggledTwice = toggledOnce.toggle();
      expect(toggledOnce.enabled).toBe(true);
      expect(toggledTwice.enabled).toBe(false);
    });
  });

  describe('isConfigured', () => {
    it('should return true when enabled and has URL', () => {
      const socialNetwork = SocialNetwork.create(
        SocialNetworkType.INSTAGRAM,
        'https://instagram.com/test',
        'Instagram',
        true
      );

      expect(socialNetwork.isConfigured()).toBe(true);
    });

    it('should return false when disabled', () => {
      const socialNetwork = SocialNetwork.create(
        SocialNetworkType.INSTAGRAM,
        'https://instagram.com/test',
        'Instagram',
        false
      );

      expect(socialNetwork.isConfigured()).toBe(false);
    });

    it('should return false when URL is empty', () => {
      const socialNetwork = SocialNetwork.create(
        SocialNetworkType.INSTAGRAM,
        '',
        'Instagram',
        true
      );

      expect(socialNetwork.isConfigured()).toBe(false);
    });
  });

  describe('getDisplayLabel', () => {
    it('should return custom label when set', () => {
      const socialNetwork = SocialNetwork.create(
        SocialNetworkType.INSTAGRAM,
        'https://instagram.com/test',
        'My Instagram',
        true
      );

      expect(socialNetwork.getDisplayLabel()).toBe('My Instagram');
    });

    it('should return default label when custom label is empty', () => {
      const socialNetwork = SocialNetwork.create(
        SocialNetworkType.INSTAGRAM,
        'https://instagram.com/test',
        '',
        true
      );

      expect(socialNetwork.getDisplayLabel()).toBe('Instagram');
    });
  });

  describe('getIconComponent', () => {
    it('should return correct icon component name', () => {
      const instagram = SocialNetwork.createDefault(
        SocialNetworkType.INSTAGRAM
      );
      const facebook = SocialNetwork.createDefault(SocialNetworkType.FACEBOOK);

      expect(instagram.getIconComponent()).toBe('FaInstagram');
      expect(facebook.getIconComponent()).toBe('FaFacebook');
    });
  });

  describe('getUrlPlaceholder', () => {
    it('should return correct URL placeholder', () => {
      const instagram = SocialNetwork.createDefault(
        SocialNetworkType.INSTAGRAM
      );
      const email = SocialNetwork.createDefault(SocialNetworkType.EMAIL);

      expect(instagram.getUrlPlaceholder()).toBe(
        'https://instagram.com/username'
      );
      expect(email.getUrlPlaceholder()).toBe('mailto:contact@example.com');
    });
  });

  describe('equals', () => {
    it('should return true for equal social networks', () => {
      const socialNetwork1 = SocialNetwork.create(
        SocialNetworkType.INSTAGRAM,
        'https://instagram.com/test',
        'Instagram',
        true
      );
      const socialNetwork2 = SocialNetwork.create(
        SocialNetworkType.INSTAGRAM,
        'https://instagram.com/test',
        'Instagram',
        true
      );

      expect(socialNetwork1.equals(socialNetwork2)).toBe(true);
    });

    it('should return false for different social networks', () => {
      const socialNetwork1 = SocialNetwork.create(
        SocialNetworkType.INSTAGRAM,
        'https://instagram.com/test1',
        'Instagram',
        true
      );
      const socialNetwork2 = SocialNetwork.create(
        SocialNetworkType.INSTAGRAM,
        'https://instagram.com/test2',
        'Instagram',
        true
      );

      expect(socialNetwork1.equals(socialNetwork2)).toBe(false);
    });

    it('should return false for null or undefined', () => {
      const socialNetwork = SocialNetwork.createDefault(
        SocialNetworkType.INSTAGRAM
      );

      expect(socialNetwork.equals(null)).toBe(false);
      expect(socialNetwork.equals(undefined)).toBe(false);
    });
  });

  describe('static methods', () => {
    it('should create all default social networks', () => {
      const allDefaults = SocialNetwork.createAllDefaults();

      expect(allDefaults).toHaveLength(5);
      expect(allDefaults[0].type.value).toBe(SocialNetworkType.INSTAGRAM);
      expect(allDefaults[1].type.value).toBe(SocialNetworkType.FACEBOOK);
      expect(allDefaults[2].type.value).toBe(SocialNetworkType.LINKEDIN);
      expect(allDefaults[3].type.value).toBe(SocialNetworkType.EMAIL);
      expect(allDefaults[4].type.value).toBe(SocialNetworkType.PHONE);

      allDefaults.forEach((sn) => {
        expect(sn.enabled).toBe(false);
        expect(sn.url.value).toBe('');
      });
    });
  });

  describe('JSON serialization', () => {
    it('should convert to JSON', () => {
      const socialNetwork = SocialNetwork.create(
        SocialNetworkType.INSTAGRAM,
        'https://instagram.com/test',
        'Instagram',
        true
      );

      const json = socialNetwork.toJSON();

      expect(json).toEqual({
        type: SocialNetworkType.INSTAGRAM,
        url: 'https://instagram.com/test',
        label: 'Instagram',
        enabled: true,
      });
    });

    it('should create from JSON', () => {
      const jsonData = {
        type: SocialNetworkType.INSTAGRAM,
        url: 'https://instagram.com/test',
        label: 'Instagram',
        enabled: true,
      };

      const socialNetwork = SocialNetwork.fromJSON(jsonData);

      expect(socialNetwork.type.value).toBe(SocialNetworkType.INSTAGRAM);
      expect(socialNetwork.url.value).toBe('https://instagram.com/test');
      expect(socialNetwork.label.value).toBe('Instagram');
      expect(socialNetwork.enabled).toBe(true);
    });
  });
});
