import { WebsiteFont } from '@/domain/settings/value-objects/WebsiteFont';
import { DEFAULT_FONT } from '@/domain/settings/constants/AvailableFonts';

describe('WebsiteFont', () => {
  describe('constructor', () => {
    it('should create a valid website font', () => {
      const font = new WebsiteFont('Inter');
      expect(font.value).toBe('Inter');
    });

    it('should create font with case-insensitive matching', () => {
      const font = new WebsiteFont('inter');
      expect(font.value).toBe('Inter');
    });

    it('should throw error for invalid font', () => {
      expect(() => new WebsiteFont('InvalidFont')).toThrow(
        'Invalid font: InvalidFont. Invalid font name. Must be one of the available fonts.'
      );
    });

    it('should throw error for empty font name', () => {
      expect(() => new WebsiteFont('')).toThrow('Invalid font');
    });
  });

  describe('create', () => {
    it('should create a valid website font', () => {
      const font = WebsiteFont.create('Roboto');
      expect(font.value).toBe('Roboto');
    });
  });

  describe('createDefault', () => {
    it('should create default font', () => {
      const font = WebsiteFont.createDefault();
      expect(font.value).toBe(DEFAULT_FONT);
    });
  });

  describe('fromString', () => {
    it('should create font from valid string', () => {
      const font = WebsiteFont.fromString('Montserrat');
      expect(font.value).toBe('Montserrat');
    });

    it('should return default for invalid string', () => {
      const font = WebsiteFont.fromString('InvalidFont');
      expect(font.value).toBe(DEFAULT_FONT);
    });

    it('should return default for null string', () => {
      const font = WebsiteFont.fromString(null);
      expect(font.value).toBe(DEFAULT_FONT);
    });

    it('should return default for undefined string', () => {
      const font = WebsiteFont.fromString(undefined);
      expect(font.value).toBe(DEFAULT_FONT);
    });

    it('should return default for empty string', () => {
      const font = WebsiteFont.fromString('');
      expect(font.value).toBe(DEFAULT_FONT);
    });
  });

  describe('getGoogleFontsUrl', () => {
    it('should return correct Google Fonts URL for simple font name', () => {
      const font = new WebsiteFont('Inter');
      const url = font.getGoogleFontsUrl();
      expect(url).toContain('https://fonts.googleapis.com/css2?family=Inter');
      expect(url).toContain('display=swap');
    });

    it('should handle font names with spaces', () => {
      const font = new WebsiteFont('Open Sans');
      const url = font.getGoogleFontsUrl();
      expect(url).toContain('family=Open+Sans');
    });

    it('should include font weights', () => {
      const font = new WebsiteFont('Inter');
      const url = font.getGoogleFontsUrl();
      expect(url).toContain('wght@');
    });
  });

  describe('getMetadata', () => {
    it('should return font metadata for valid font', () => {
      const font = new WebsiteFont('Inter');
      const metadata = font.getMetadata();
      expect(metadata).toBeDefined();
      expect(metadata?.name).toBe('Inter');
      expect(metadata?.category).toBe('sans-serif');
    });
  });

  describe('getFontFamily', () => {
    it('should return CSS font-family value', () => {
      const font = new WebsiteFont('Inter');
      const family = font.getFontFamily();
      expect(family).toBe("'Inter', sans-serif");
    });
  });

  describe('equals', () => {
    it('should return true for equal fonts', () => {
      const font1 = new WebsiteFont('Inter');
      const font2 = new WebsiteFont('Inter');
      expect(font1.equals(font2)).toBe(true);
    });

    it('should return true for equal fonts with different case', () => {
      const font1 = new WebsiteFont('Inter');
      const font2 = new WebsiteFont('inter');
      expect(font1.equals(font2)).toBe(true);
    });

    it('should return false for different fonts', () => {
      const font1 = new WebsiteFont('Inter');
      const font2 = new WebsiteFont('Roboto');
      expect(font1.equals(font2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return font name as string', () => {
      const font = new WebsiteFont('Poppins');
      expect(font.toString()).toBe('Poppins');
    });
  });

  describe('toJSON', () => {
    it('should return font name as JSON', () => {
      const font = new WebsiteFont('Montserrat');
      expect(font.toJSON()).toBe('Montserrat');
    });
  });

  describe('isValid', () => {
    it('should return true for valid fonts', () => {
      expect(WebsiteFont.isValid('Inter')).toBe(true);
      expect(WebsiteFont.isValid('Roboto')).toBe(true);
      expect(WebsiteFont.isValid('Playfair Display')).toBe(true);
    });

    it('should return false for invalid fonts', () => {
      expect(WebsiteFont.isValid('InvalidFont')).toBe(false);
      expect(WebsiteFont.isValid('')).toBe(false);
      expect(WebsiteFont.isValid('ComicSans')).toBe(false);
    });
  });
});
