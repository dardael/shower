import { SocialNetworkLabel } from '@/domain/settings/value-objects/SocialNetworkLabel';

describe('SocialNetworkLabel', () => {
  describe('constructor', () => {
    it('should create a valid SocialNetworkLabel', () => {
      const label = new SocialNetworkLabel('Instagram');

      expect(label.value).toBe('Instagram');
      expect(label.isEmpty).toBe(false);
      expect(label.length).toBe(9);
    });

    it('should trim whitespace', () => {
      const label = new SocialNetworkLabel('  Instagram  ');

      expect(label.value).toBe('Instagram');
    });
  });

  describe('validation', () => {
    it('should throw error for empty label', () => {
      expect(() => {
        new SocialNetworkLabel('');
      }).toThrow('Social network label cannot be empty');
    });

    it('should throw error for whitespace-only label', () => {
      expect(() => {
        new SocialNetworkLabel('   ');
      }).toThrow('Social network label cannot be empty');
    });

    it('should throw error for label exceeding 50 characters', () => {
      const longLabel = 'a'.repeat(51);
      expect(() => {
        new SocialNetworkLabel(longLabel);
      }).toThrow('Social network label cannot exceed 50 characters');
    });

    it('should throw error for label with HTML special characters', () => {
      expect(() => {
        new SocialNetworkLabel('<script>');
      }).toThrow('Social network label contains invalid characters');

      expect(() => {
        new SocialNetworkLabel('label"test');
      }).toThrow('Social network label contains invalid characters');

      expect(() => {
        new SocialNetworkLabel("label'test");
      }).toThrow('Social network label contains invalid characters');

      expect(() => {
        new SocialNetworkLabel('label>test');
      }).toThrow('Social network label contains invalid characters');

      expect(() => {
        new SocialNetworkLabel('label\\test');
      }).toThrow('Social network label contains invalid characters');
    });

    it('should allow valid characters', () => {
      expect(() => {
        new SocialNetworkLabel('My Instagram Profile');
      }).not.toThrow();

      expect(() => {
        new SocialNetworkLabel('Instagram-Profile');
      }).not.toThrow();

      expect(() => {
        new SocialNetworkLabel('Instagram_Profile');
      }).not.toThrow();

      expect(() => {
        new SocialNetworkLabel('Instagram.Profile');
      }).not.toThrow();
    });
  });

  describe('equals', () => {
    it('should return true for equal labels', () => {
      const label1 = new SocialNetworkLabel('Instagram');
      const label2 = new SocialNetworkLabel('Instagram');

      expect(label1.equals(label2)).toBe(true);
    });

    it('should return false for different labels', () => {
      const label1 = new SocialNetworkLabel('Instagram');
      const label2 = new SocialNetworkLabel('Facebook');

      expect(label1.equals(label2)).toBe(false);
    });
  });

  describe('static methods', () => {
    it('should create label from string', () => {
      const label = SocialNetworkLabel.fromString('Instagram');

      expect(label.value).toBe('Instagram');
    });

    it('should create default label', () => {
      const label = SocialNetworkLabel.createDefault('Instagram');

      expect(label.value).toBe('Instagram');
    });
  });
});
