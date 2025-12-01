import { PageContentBody } from '@/domain/pages/value-objects/PageContentBody';

describe('PageContentBody', () => {
  describe('create', () => {
    it('should create a PageContentBody with valid content', () => {
      const content = '<h1>Welcome</h1><p>Test content</p>';
      const body = PageContentBody.create(content);

      expect(body.value).toBe(content);
    });

    it('should trim whitespace from content', () => {
      const body = PageContentBody.create('  <p>Content</p>  ');

      expect(body.value).toBe('<p>Content</p>');
    });

    it('should throw error for empty content', () => {
      expect(() => PageContentBody.create('')).toThrow(
        'Page content cannot be empty'
      );
    });

    it('should throw error for whitespace-only content', () => {
      expect(() => PageContentBody.create('   ')).toThrow(
        'Page content cannot be empty'
      );
    });

    it('should throw error for content exceeding maximum length', () => {
      const longContent = 'a'.repeat(100001);

      expect(() => PageContentBody.create(longContent)).toThrow(
        'Page content cannot exceed 100000 characters'
      );
    });

    it('should accept content at exactly maximum length', () => {
      const maxContent = 'a'.repeat(100000);
      const body = PageContentBody.create(maxContent);

      expect(body.value).toBe(maxContent);
    });
  });

  describe('equals', () => {
    it('should return true for equal content', () => {
      const body1 = PageContentBody.create('<p>Test</p>');
      const body2 = PageContentBody.create('<p>Test</p>');

      expect(body1.equals(body2)).toBe(true);
    });

    it('should return false for different content', () => {
      const body1 = PageContentBody.create('<p>Test 1</p>');
      const body2 = PageContentBody.create('<p>Test 2</p>');

      expect(body1.equals(body2)).toBe(false);
    });
  });
});
