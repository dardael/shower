import { ThemeModePreference } from '@/domain/settings/value-objects/ThemeModePreference';

describe('ThemeModePreference', () => {
  describe('create', () => {
    it('should create ThemeModePreference with force-light value', () => {
      const config = ThemeModePreference.create('force-light');
      expect(config.value).toBe('force-light');
    });

    it('should create ThemeModePreference with force-dark value', () => {
      const config = ThemeModePreference.create('force-dark');
      expect(config.value).toBe('force-dark');
    });

    it('should create ThemeModePreference with user-choice value', () => {
      const config = ThemeModePreference.create('user-choice');
      expect(config.value).toBe('user-choice');
    });

    it('should return default for invalid value', () => {
      const config = ThemeModePreference.create('invalid-value');
      expect(config.value).toBe('user-choice');
    });

    it('should return default for empty string', () => {
      const config = ThemeModePreference.create('');
      expect(config.value).toBe('user-choice');
    });
  });

  describe('default', () => {
    it('should return user-choice as default', () => {
      const config = ThemeModePreference.default();
      expect(config.value).toBe('user-choice');
    });
  });

  describe('isValid', () => {
    it('should return true for force-light', () => {
      expect(ThemeModePreference.isValid('force-light')).toBe(true);
    });

    it('should return true for force-dark', () => {
      expect(ThemeModePreference.isValid('force-dark')).toBe(true);
    });

    it('should return true for user-choice', () => {
      expect(ThemeModePreference.isValid('user-choice')).toBe(true);
    });

    it('should return false for invalid value', () => {
      expect(ThemeModePreference.isValid('invalid')).toBe(false);
    });
  });

  describe('isForced', () => {
    it('should return true for force-light', () => {
      const config = ThemeModePreference.create('force-light');
      expect(config.isForced()).toBe(true);
    });

    it('should return true for force-dark', () => {
      const config = ThemeModePreference.create('force-dark');
      expect(config.isForced()).toBe(true);
    });

    it('should return false for user-choice', () => {
      const config = ThemeModePreference.create('user-choice');
      expect(config.isForced()).toBe(false);
    });
  });

  describe('getForcedMode', () => {
    it('should return light for force-light', () => {
      const config = ThemeModePreference.create('force-light');
      expect(config.getForcedMode()).toBe('light');
    });

    it('should return dark for force-dark', () => {
      const config = ThemeModePreference.create('force-dark');
      expect(config.getForcedMode()).toBe('dark');
    });

    it('should return null for user-choice', () => {
      const config = ThemeModePreference.create('user-choice');
      expect(config.getForcedMode()).toBeNull();
    });
  });

  describe('shouldShowToggle', () => {
    it('should return false for force-light', () => {
      const config = ThemeModePreference.create('force-light');
      expect(config.shouldShowToggle()).toBe(false);
    });

    it('should return false for force-dark', () => {
      const config = ThemeModePreference.create('force-dark');
      expect(config.shouldShowToggle()).toBe(false);
    });

    it('should return true for user-choice', () => {
      const config = ThemeModePreference.create('user-choice');
      expect(config.shouldShowToggle()).toBe(true);
    });
  });

  describe('equals', () => {
    it('should return true for same value', () => {
      const config1 = ThemeModePreference.create('force-light');
      const config2 = ThemeModePreference.create('force-light');
      expect(config1.equals(config2)).toBe(true);
    });

    it('should return false for different values', () => {
      const config1 = ThemeModePreference.create('force-light');
      const config2 = ThemeModePreference.create('force-dark');
      expect(config1.equals(config2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return string representation', () => {
      const config = ThemeModePreference.create('force-dark');
      expect(config.toString()).toBe('force-dark');
    });
  });
});
