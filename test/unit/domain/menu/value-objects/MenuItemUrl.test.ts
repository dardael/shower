import { MenuItemUrl } from '@/domain/menu/value-objects/MenuItemUrl';

describe('MenuItemUrl', () => {
  describe('create', () => {
    describe('valid relative URLs', () => {
      it('should create with absolute path /about', () => {
        const url = MenuItemUrl.create('/about');
        expect(url.value).toBe('/about');
      });

      it('should create with relative path contact', () => {
        const url = MenuItemUrl.create('contact');
        expect(url.value).toBe('contact');
      });

      it('should create with nested path /pages/info', () => {
        const url = MenuItemUrl.create('/pages/info');
        expect(url.value).toBe('/pages/info');
      });

      it('should create with path/to/page format', () => {
        const url = MenuItemUrl.create('path/to/page');
        expect(url.value).toBe('path/to/page');
      });

      it('should create with query parameters /path?query=value', () => {
        const url = MenuItemUrl.create('/path?query=value');
        expect(url.value).toBe('/path?query=value');
      });

      it('should create with anchor /path#anchor', () => {
        const url = MenuItemUrl.create('/path#anchor');
        expect(url.value).toBe('/path#anchor');
      });

      it('should create with root path /', () => {
        const url = MenuItemUrl.create('/');
        expect(url.value).toBe('/');
      });
    });

    describe('trimming', () => {
      it('should trim leading whitespace', () => {
        const url = MenuItemUrl.create('  /about');
        expect(url.value).toBe('/about');
      });

      it('should trim trailing whitespace', () => {
        const url = MenuItemUrl.create('/about  ');
        expect(url.value).toBe('/about');
      });

      it('should trim both leading and trailing whitespace', () => {
        const url = MenuItemUrl.create('  /about  ');
        expect(url.value).toBe('/about');
      });
    });

    describe('empty URL rejection', () => {
      it('should throw error for empty string', () => {
        expect(() => MenuItemUrl.create('')).toThrow(
          'Menu item URL cannot be empty'
        );
      });

      it('should throw error for whitespace-only string', () => {
        expect(() => MenuItemUrl.create('   ')).toThrow(
          'Menu item URL cannot be empty'
        );
      });
    });

    describe('absolute URL rejection', () => {
      it('should throw error for http:// URL', () => {
        expect(() => MenuItemUrl.create('http://example.com')).toThrow(
          'Menu item URL must be a relative path'
        );
      });

      it('should throw error for https:// URL', () => {
        expect(() => MenuItemUrl.create('https://example.com')).toThrow(
          'Menu item URL must be a relative path'
        );
      });

      it('should throw error for protocol-relative URL //', () => {
        expect(() => MenuItemUrl.create('//example.com')).toThrow(
          'Menu item URL must be a relative path'
        );
      });

      it('should throw error for http:// URL with path', () => {
        expect(() => MenuItemUrl.create('http://example.com/path')).toThrow(
          'Menu item URL must be a relative path'
        );
      });

      it('should throw error for https:// URL with path', () => {
        expect(() => MenuItemUrl.create('https://example.com/path')).toThrow(
          'Menu item URL must be a relative path'
        );
      });
    });

    describe('maximum length enforcement', () => {
      it('should create URL with exactly 2048 characters', () => {
        const longPath = '/' + 'a'.repeat(2047);
        const url = MenuItemUrl.create(longPath);
        expect(url.value).toBe(longPath);
        expect(url.value.length).toBe(2048);
      });

      it('should throw error for URL exceeding 2048 characters', () => {
        const longPath = '/' + 'a'.repeat(2048);
        expect(() => MenuItemUrl.create(longPath)).toThrow(
          'Menu item URL cannot exceed 2048 characters'
        );
      });
    });
  });

  describe('value getter', () => {
    it('should return the URL value', () => {
      const url = MenuItemUrl.create('/test');
      expect(url.value).toBe('/test');
    });
  });

  describe('equals', () => {
    it('should return true for URLs with same value', () => {
      const url1 = MenuItemUrl.create('/about');
      const url2 = MenuItemUrl.create('/about');
      expect(url1.equals(url2)).toBe(true);
    });

    it('should return false for URLs with different values', () => {
      const url1 = MenuItemUrl.create('/about');
      const url2 = MenuItemUrl.create('/contact');
      expect(url1.equals(url2)).toBe(false);
    });
  });
});
