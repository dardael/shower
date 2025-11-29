import { WebsiteSetting } from '@/domain/settings/entities/WebsiteSetting';
import { WebsiteName } from '@/domain/settings/value-objects/WebsiteName';
import { WebsiteIcon } from '@/domain/settings/value-objects/WebsiteIcon';
import { ThemeColor } from '@/domain/settings/value-objects/ThemeColor';

describe('WebsiteSetting', () => {
  const mockIconMetadata = {
    filename: 'favicon-123.ico',
    originalName: 'favicon.ico',
    size: 1024,
    format: 'ico',
    mimeType: 'image/x-icon',
    uploadedAt: new Date('2024-01-01T00:00:00Z'),
  };

  describe('constructor', () => {
    it('should create a setting with string value', () => {
      const setting = new WebsiteSetting('website-name', 'Test Site');

      expect(setting.key).toBe('website-name');
      expect(setting.value).toBe('Test Site');
      expect(setting.isString()).toBe(true);
      expect(setting.isIcon()).toBe(false);
    });

    it('should create a setting with icon value', () => {
      const iconValue = {
        url: 'https://example.com/favicon.ico',
        metadata: mockIconMetadata,
      };
      const setting = new WebsiteSetting('website-icon', iconValue);

      expect(setting.key).toBe('website-icon');
      expect(setting.value).toEqual(iconValue);
      expect(setting.isString()).toBe(false);
      expect(setting.isIcon()).toBe(true);
    });

    it('should create a setting with null value', () => {
      const setting = new WebsiteSetting('website-icon', null);

      expect(setting.key).toBe('website-icon');
      expect(setting.value).toBe(null);
      expect(setting.isString()).toBe(false);
      expect(setting.isIcon()).toBe(true);
    });
  });

  describe('updateValue', () => {
    it('should update the value', () => {
      const setting = new WebsiteSetting('website-name', 'Old Name');
      setting.updateValue('New Name');

      expect(setting.value).toBe('New Name');
    });
  });

  describe('value getter', () => {
    it('should get value', () => {
      const setting = new WebsiteSetting('website-name', 'Test');
      expect(setting.value).toBe('Test');
    });
  });

  describe('type checking methods', () => {
    it('should correctly identify string values', () => {
      const setting = new WebsiteSetting('website-name', 'Test');
      expect(setting.isString()).toBe(true);
      expect(setting.isIcon()).toBe(false);
    });

    it('should correctly identify icon values', () => {
      const iconValue = {
        url: 'https://example.com/favicon.ico',
        metadata: mockIconMetadata,
      };
      const setting = new WebsiteSetting('website-icon', iconValue);
      expect(setting.isString()).toBe(false);
      expect(setting.isIcon()).toBe(true);
    });

    it('should correctly identify null icon values', () => {
      const setting = new WebsiteSetting('website-icon', null);
      expect(setting.isString()).toBe(false);
      expect(setting.isIcon()).toBe(true);
    });
  });

  describe('getValueAsString', () => {
    it('should return string value', () => {
      const setting = new WebsiteSetting('website-name', 'Test Site');
      expect(setting.getValueAsString()).toBe('Test Site');
    });

    it('should throw error for non-string values', () => {
      const setting = new WebsiteSetting('website-icon', null);
      expect(() => setting.getValueAsString()).toThrow('Value is not a string');
    });
  });

  describe('getValueAsIcon', () => {
    it('should return icon value', () => {
      const iconValue = {
        url: 'https://example.com/favicon.ico',
        metadata: mockIconMetadata,
      };
      const setting = new WebsiteSetting('website-icon', iconValue);
      expect(setting.getValueAsIcon()).toEqual(iconValue);
    });

    it('should return null for null icon value', () => {
      const setting = new WebsiteSetting('website-icon', null);
      expect(setting.getValueAsIcon()).toBe(null);
    });

    it('should throw error for non-icon values', () => {
      const setting = new WebsiteSetting('website-name', 'Test Site');
      expect(() => setting.getValueAsIcon()).toThrow(
        'Value is not an image object'
      );
    });
  });

  describe('equals', () => {
    it('should return true for equal settings', () => {
      const setting1 = new WebsiteSetting('website-name', 'Test Site');
      const setting2 = new WebsiteSetting('website-name', 'Test Site');
      expect(setting1.equals(setting2)).toBe(true);
    });

    it('should return false for different keys', () => {
      const setting1 = new WebsiteSetting('website-name', 'Test Site');
      const setting2 = new WebsiteSetting('theme-color', 'Test Site');
      expect(setting1.equals(setting2)).toBe(false);
    });

    it('should return false for different values', () => {
      const setting1 = new WebsiteSetting('website-name', 'Test Site 1');
      const setting2 = new WebsiteSetting('website-name', 'Test Site 2');
      expect(setting1.equals(setting2)).toBe(false);
    });

    it('should return false for null comparison', () => {
      const setting = new WebsiteSetting('website-name', 'Test Site');
      expect(setting.equals(null)).toBe(false);
    });

    it('should return false for undefined comparison', () => {
      const setting = new WebsiteSetting('website-name', 'Test Site');
      expect(setting.equals(undefined)).toBe(false);
    });

    it('should handle complex object comparison', () => {
      const iconValue = {
        url: 'https://example.com/favicon.ico',
        metadata: mockIconMetadata,
      };
      const setting1 = new WebsiteSetting('website-icon', iconValue);
      const setting2 = new WebsiteSetting('website-icon', { ...iconValue });
      expect(setting1.equals(setting2)).toBe(true);
    });
  });

  describe('factory methods', () => {
    it('should create website name setting', () => {
      const name = new WebsiteName('Test Site');
      const setting = WebsiteSetting.createWebsiteName(name);

      expect(setting.key).toBe('website-name');
      expect(setting.value).toBe('Test Site');
      expect(setting.isString()).toBe(true);
    });

    it('should create website icon setting with icon', () => {
      const icon = new WebsiteIcon(
        'https://example.com/favicon.ico',
        mockIconMetadata
      );
      const setting = WebsiteSetting.createWebsiteIcon(icon);

      expect(setting.key).toBe('website-icon');
      expect(setting.isIcon()).toBe(true);
      const iconValue = setting.getValueAsIcon();
      expect(iconValue?.url).toBe('https://example.com/favicon.ico');
      expect(iconValue?.metadata).toEqual(mockIconMetadata);
    });

    it('should create website icon setting with null icon', () => {
      const setting = WebsiteSetting.createWebsiteIcon(null);

      expect(setting.key).toBe('website-icon');
      expect(setting.value).toBe(null);
      expect(setting.isIcon()).toBe(true);
    });

    it('should create theme color setting', () => {
      const themeColor = ThemeColor.fromString('blue');
      const setting = WebsiteSetting.createThemeColor(themeColor);

      expect(setting.key).toBe('theme-color');
      expect(setting.value).toBe('blue');
      expect(setting.isString()).toBe(true);
    });
  });

  describe('default value creation', () => {
    it('should create default website name', () => {
      const setting = WebsiteSetting.createDefaultWebsiteName();

      expect(setting.key).toBe('website-name');
      expect(setting.value).toBe('Shower');
    });

    it('should create default website icon', () => {
      const setting = WebsiteSetting.createDefaultWebsiteIcon();

      expect(setting.key).toBe('website-icon');
      expect(setting.value).toBe(null);
    });

    it('should create default theme color', () => {
      const setting = WebsiteSetting.createDefaultThemeColor();

      expect(setting.key).toBe('theme-color');
      expect(setting.value).toBe('blue');
    });
  });

  describe('key validation', () => {
    it('should validate website name key', () => {
      expect(WebsiteSetting.isValidWebsiteNameKey('website-name')).toBe(true);
      expect(WebsiteSetting.isValidWebsiteNameKey('theme-color')).toBe(false);
    });

    it('should validate website icon key', () => {
      expect(WebsiteSetting.isValidWebsiteIconKey('website-icon')).toBe(true);
      expect(WebsiteSetting.isValidWebsiteIconKey('website-name')).toBe(false);
    });

    it('should validate theme color key', () => {
      expect(WebsiteSetting.isValidThemeColorKey('theme-color')).toBe(true);
      expect(WebsiteSetting.isValidThemeColorKey('website-name')).toBe(false);
    });

    it('should validate any setting key', () => {
      expect(WebsiteSetting.isValidSettingKey('website-name')).toBe(true);
      expect(WebsiteSetting.isValidSettingKey('website-icon')).toBe(true);
      expect(WebsiteSetting.isValidSettingKey('theme-color')).toBe(true);
      expect(WebsiteSetting.isValidSettingKey('invalid-key')).toBe(false);
    });
  });
});
