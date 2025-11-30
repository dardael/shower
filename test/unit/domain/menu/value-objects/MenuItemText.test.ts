import { MenuItemText } from '@/domain/menu/value-objects/MenuItemText';

describe('MenuItemText', () => {
  describe('create', () => {
    it('should create menu item text with valid input', () => {
      const text = MenuItemText.create('Home');

      expect(text.value).toBe('Home');
    });

    it('should trim whitespace from text', () => {
      const text = MenuItemText.create('  Home  ');

      expect(text.value).toBe('Home');
    });

    it('should throw error for empty text', () => {
      expect(() => MenuItemText.create('')).toThrow(
        'Menu item text cannot be empty'
      );
    });

    it('should throw error for whitespace-only text', () => {
      expect(() => MenuItemText.create('   ')).toThrow(
        'Menu item text cannot be empty'
      );
    });

    it('should throw error for text exceeding 100 characters', () => {
      const longText = 'a'.repeat(101);

      expect(() => MenuItemText.create(longText)).toThrow(
        'Menu item text cannot exceed 100 characters'
      );
    });

    it('should accept text with exactly 100 characters', () => {
      const text = MenuItemText.create('a'.repeat(100));

      expect(text.value).toBe('a'.repeat(100));
    });
  });

  describe('equals', () => {
    it('should return true for equal text values', () => {
      const text1 = MenuItemText.create('Home');
      const text2 = MenuItemText.create('Home');

      expect(text1.equals(text2)).toBe(true);
    });

    it('should return false for different text values', () => {
      const text1 = MenuItemText.create('Home');
      const text2 = MenuItemText.create('About');

      expect(text1.equals(text2)).toBe(false);
    });
  });
});
