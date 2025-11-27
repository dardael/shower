import { BrowserThemePreference } from '@/domain/settings/entities/BrowserThemePreference';
import { ThemeMode } from '@/domain/settings/value-objects/ThemeMode';

describe('BrowserThemePreference', () => {
  const testDate = new Date('2024-01-01T00:00:00Z');
  const testUserId = 'test-user-123';

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Constructor', () => {
    it('should create preference with valid parameters', () => {
      const preference = new BrowserThemePreference(
        ThemeMode.DARK,
        false,
        testDate,
        testUserId
      );

      expect(preference.themeMode).toBe(ThemeMode.DARK);
      expect(preference.isSystemDefault()).toBe(false);
      expect(preference.lastUpdated).toEqual(testDate);
      expect(preference.userId).toBe(testUserId);
    });

    it('should create preference without user ID', () => {
      const preference = new BrowserThemePreference(
        ThemeMode.LIGHT,
        true,
        testDate
      );

      expect(preference.userId).toBeUndefined();
    });

    it('should throw error for future date', () => {
      const futureDate = new Date(Date.now() + 1000000);

      expect(() => {
        new BrowserThemePreference(ThemeMode.LIGHT, true, futureDate);
      }).toThrow('Last updated date cannot be in future');
    });

    it('should create preference with system default and any theme mode', () => {
      // This test verifies that system defaults can have any theme mode
      // The invariant was removed to allow more flexible system default handling
      const preference = new BrowserThemePreference(
        ThemeMode.DARK,
        true,
        testDate
      );

      expect(preference.themeMode).toBe(ThemeMode.DARK);
      expect(preference.isSystemDefault()).toBe(true);
      expect(preference.lastUpdated).toEqual(testDate);
    });
  });

  describe('createForNewUser', () => {
    it('should create preference for new user with system theme', () => {
      const preference = BrowserThemePreference.createForNewUser(
        ThemeMode.DARK,
        testUserId
      );

      expect(preference.themeMode).toBe(ThemeMode.DARK);
      expect(preference.isSystemDefault()).toBe(true);
      expect(preference.userId).toBe(testUserId);
      expect(preference.lastUpdated).toBeInstanceOf(Date);
    });

    it('should create preference for new user without user ID', () => {
      const preference = BrowserThemePreference.createForNewUser(
        ThemeMode.LIGHT
      );

      expect(preference.themeMode).toBe(ThemeMode.LIGHT);
      expect(preference.isSystemDefault()).toBe(true);
      expect(preference.userId).toBeUndefined();
    });
  });

  describe('createUserChoice', () => {
    it('should create preference for user choice', () => {
      const preference = BrowserThemePreference.createUserChoice(
        ThemeMode.DARK,
        testUserId
      );

      expect(preference.themeMode).toBe(ThemeMode.DARK);
      expect(preference.isSystemDefault()).toBe(false);
      expect(preference.userId).toBe(testUserId);
    });
  });

  describe('updateTheme', () => {
    it('should update theme with user choice', () => {
      const originalPreference = BrowserThemePreference.createForNewUser(
        ThemeMode.LIGHT
      );

      // Advance time to ensure different timestamp
      jest.advanceTimersByTime(1);

      const updatedPreference = originalPreference.updateTheme(ThemeMode.DARK);

      expect(updatedPreference.themeMode).toBe(ThemeMode.DARK);
      expect(updatedPreference.isSystemDefault()).toBe(false);
      expect(updatedPreference.userId).toBeUndefined();
      expect(updatedPreference.lastUpdated).toBeInstanceOf(Date);
      expect(updatedPreference.lastUpdated.getTime()).toBeGreaterThan(
        originalPreference.lastUpdated.getTime()
      );
    });

    it('should preserve user ID when updating', () => {
      const originalPreference = BrowserThemePreference.createForNewUser(
        ThemeMode.LIGHT,
        testUserId
      );
      const updatedPreference = originalPreference.updateTheme(ThemeMode.DARK);

      expect(updatedPreference.userId).toBe(testUserId);
    });
  });

  describe('resetToSystem', () => {
    it('should reset to system theme', () => {
      const userPreference = BrowserThemePreference.createUserChoice(
        ThemeMode.DARK
      );

      // Advance time to ensure different timestamp
      jest.advanceTimersByTime(1);

      const resetPreference = userPreference.resetToSystem(ThemeMode.LIGHT);

      expect(resetPreference.themeMode).toBe(ThemeMode.LIGHT);
      expect(resetPreference.isSystemDefault()).toBe(true);
      expect(resetPreference.lastUpdated).toBeInstanceOf(Date);
      expect(resetPreference.lastUpdated.getTime()).toBeGreaterThan(
        userPreference.lastUpdated.getTime()
      );
    });

    it('should preserve user ID when resetting', () => {
      const userPreference = BrowserThemePreference.createUserChoice(
        ThemeMode.DARK,
        testUserId
      );
      const resetPreference = userPreference.resetToSystem(ThemeMode.LIGHT);

      expect(resetPreference.userId).toBe(testUserId);
    });
  });

  describe('getEffectiveTheme', () => {
    it('should return user choice when not system default', () => {
      const preference = BrowserThemePreference.createUserChoice(
        ThemeMode.DARK
      );
      const effectiveTheme = preference.getEffectiveTheme(ThemeMode.LIGHT);

      expect(effectiveTheme).toBe(ThemeMode.DARK);
    });

    it('should return system theme when system default', () => {
      const preference = BrowserThemePreference.createForNewUser(
        ThemeMode.DARK
      );
      const effectiveTheme = preference.getEffectiveTheme(ThemeMode.LIGHT);

      expect(effectiveTheme).toBe(ThemeMode.LIGHT);
    });

    it('should return system theme when SYSTEM mode with system default', () => {
      const preference = new BrowserThemePreference(
        ThemeMode.SYSTEM,
        true,
        testDate
      );
      const effectiveTheme = preference.getEffectiveTheme(ThemeMode.DARK);

      expect(effectiveTheme).toBe(ThemeMode.DARK);
    });
  });

  describe('toJSON', () => {
    it('should serialize preference to JSON', () => {
      const preference = new BrowserThemePreference(
        ThemeMode.DARK,
        false,
        testDate,
        testUserId
      );
      const json = preference.toJSON();

      expect(json).toEqual({
        themeMode: ThemeMode.DARK,
        isSystemDefault: false,
        lastUpdated: testDate.toISOString(),
        userId: testUserId,
      });
    });

    it('should serialize preference without user ID', () => {
      const preference = new BrowserThemePreference(
        ThemeMode.LIGHT,
        true,
        testDate
      );
      const json = preference.toJSON();

      expect(json.userId).toBeUndefined();
    });
  });

  describe('fromJSON', () => {
    it('should create preference from valid JSON', () => {
      const json = {
        themeMode: ThemeMode.DARK,
        isSystemDefault: false,
        lastUpdated: testDate.toISOString(),
        userId: testUserId,
      };
      const preference = BrowserThemePreference.fromJSON(json);

      expect(preference.themeMode).toBe(ThemeMode.DARK);
      expect(preference.isSystemDefault()).toBe(false);
      expect(preference.lastUpdated).toEqual(testDate);
      expect(preference.userId).toBe(testUserId);
    });

    it('should throw error for missing theme mode', () => {
      const json = {
        isSystemDefault: false,
        lastUpdated: testDate.toISOString(),
      };

      expect(() => {
        BrowserThemePreference.fromJSON(json);
      }).toThrow('Missing themeMode in preference data');
    });

    it('should throw error for missing last updated', () => {
      const json = {
        themeMode: ThemeMode.DARK,
        isSystemDefault: false,
      };

      expect(() => {
        BrowserThemePreference.fromJSON(json);
      }).toThrow('Missing lastUpdated in preference data');
    });

    it('should throw error for invalid date', () => {
      const json = {
        themeMode: ThemeMode.DARK,
        isSystemDefault: false,
        lastUpdated: 'invalid-date',
      };

      expect(() => {
        BrowserThemePreference.fromJSON(json);
      }).toThrow('Invalid lastUpdated date in preference data');
    });

    it('should handle missing user ID', () => {
      const json = {
        themeMode: ThemeMode.LIGHT,
        isSystemDefault: true,
        lastUpdated: testDate.toISOString(),
      };
      const preference = BrowserThemePreference.fromJSON(json);

      expect(preference.userId).toBeUndefined();
    });
  });

  describe('equals', () => {
    it('should return true for equal preferences', () => {
      const preference1 = new BrowserThemePreference(
        ThemeMode.DARK,
        false,
        testDate,
        testUserId
      );
      const preference2 = new BrowserThemePreference(
        ThemeMode.DARK,
        false,
        testDate,
        testUserId
      );

      expect(preference1.equals(preference2)).toBe(true);
    });

    it('should return false for different theme modes', () => {
      const preference1 = new BrowserThemePreference(
        ThemeMode.DARK,
        false,
        testDate,
        testUserId
      );
      const preference2 = new BrowserThemePreference(
        ThemeMode.LIGHT,
        false,
        testDate,
        testUserId
      );

      expect(preference1.equals(preference2)).toBe(false);
    });

    it('should return false for different user IDs', () => {
      const preference1 = new BrowserThemePreference(
        ThemeMode.DARK,
        false,
        testDate,
        'user-1'
      );
      const preference2 = new BrowserThemePreference(
        ThemeMode.DARK,
        false,
        testDate,
        'user-2'
      );

      expect(preference1.equals(preference2)).toBe(false);
    });

    it('should return false for non-BrowserThemePreference objects', () => {
      const preference = new BrowserThemePreference(
        ThemeMode.DARK,
        false,
        testDate
      );

      expect(preference.equals({} as BrowserThemePreference)).toBe(false);
    });
  });

  describe('withUserId', () => {
    it('should create copy with new user ID', () => {
      const preference = new BrowserThemePreference(
        ThemeMode.DARK,
        false,
        testDate
      );
      const preferenceWithUserId = preference.withUserId(testUserId);

      expect(preferenceWithUserId.userId).toBe(testUserId);
      expect(preferenceWithUserId.themeMode).toBe(preference.themeMode);
      expect(preferenceWithUserId.isSystemDefault()).toBe(
        preference.isSystemDefault()
      );
      expect(preferenceWithUserId.lastUpdated).toEqual(preference.lastUpdated);
    });

    it('should preserve existing properties', () => {
      const originalPreference = new BrowserThemePreference(
        ThemeMode.DARK,
        false,
        testDate,
        'original-user'
      );
      const updatedPreference = originalPreference.withUserId('new-user');

      expect(updatedPreference.userId).toBe('new-user');
      expect(updatedPreference.themeMode).toBe(ThemeMode.DARK);
      expect(updatedPreference.isSystemDefault()).toBe(false);
      expect(updatedPreference.lastUpdated).toEqual(testDate);
    });
  });
});
