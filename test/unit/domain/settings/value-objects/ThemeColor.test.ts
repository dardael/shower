import { ThemeColor } from '@/domain/settings/value-objects/ThemeColor';
import { DEFAULT_THEME_COLOR } from '@/domain/settings/constants/ThemeColorPalette';

describe('ThemeColor', () => {
  describe('constructor', () => {
    it('should create a valid theme color', () => {
      const themeColor = new ThemeColor('blue');
      expect(themeColor.value).toBe('blue');
    });

    it('should throw error for invalid color', () => {
      expect(() => new ThemeColor('invalid')).toThrow(
        'Invalid theme color: invalid. Invalid theme color provided. Must be one of: blue, red, green, purple, orange, teal, pink, cyan'
      );
    });
  });

  describe('createDefault', () => {
    it('should create default theme color', () => {
      const themeColor = ThemeColor.createDefault();
      expect(themeColor.value).toBe(DEFAULT_THEME_COLOR);
    });
  });

  describe('fromString', () => {
    it('should create theme color from valid string', () => {
      const themeColor = ThemeColor.fromString('red');
      expect(themeColor.value).toBe('red');
    });

    it('should return default for invalid string', () => {
      const themeColor = ThemeColor.fromString('invalid');
      expect(themeColor.value).toBe(DEFAULT_THEME_COLOR);
    });

    it('should return default for null string', () => {
      const themeColor = ThemeColor.fromString(null);
      expect(themeColor.value).toBe(DEFAULT_THEME_COLOR);
    });

    it('should return default for undefined string', () => {
      const themeColor = ThemeColor.fromString(undefined);
      expect(themeColor.value).toBe(DEFAULT_THEME_COLOR);
    });
  });

  describe('equals', () => {
    it('should return true for equal colors', () => {
      const color1 = new ThemeColor('blue');
      const color2 = new ThemeColor('blue');
      expect(color1.equals(color2)).toBe(true);
    });

    it('should return false for different colors', () => {
      const color1 = new ThemeColor('blue');
      const color2 = new ThemeColor('red');
      expect(color1.equals(color2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return color value as string', () => {
      const themeColor = new ThemeColor('green');
      expect(themeColor.toString()).toBe('green');
    });
  });

  describe('toJSON', () => {
    it('should return color value as JSON', () => {
      const themeColor = new ThemeColor('purple');
      expect(themeColor.toJSON()).toBe('purple');
    });
  });

  describe('isValid', () => {
    it('should return true for valid colors', () => {
      expect(ThemeColor.isValid('blue')).toBe(true);
      expect(ThemeColor.isValid('red')).toBe(true);
      expect(ThemeColor.isValid('green')).toBe(true);
    });

    it('should return false for invalid colors', () => {
      expect(ThemeColor.isValid('invalid')).toBe(false);
      expect(ThemeColor.isValid('')).toBe(false);
    });
  });
});
