import { PageContent } from '@/domain/pages/entities/PageContent';
import { PageContentBody } from '@/domain/pages/value-objects/PageContentBody';

describe('PageContent', () => {
  const validContent = PageContentBody.create('<h1>Test</h1><p>Content</p>');
  const menuItemId = 'menu-item-123';

  describe('create', () => {
    it('should create a new PageContent without ID', () => {
      const pageContent = PageContent.create(menuItemId, validContent);

      expect(pageContent.hasId).toBe(false);
      expect(pageContent.menuItemId).toBe(menuItemId);
      expect(pageContent.content.value).toBe(validContent.value);
      expect(pageContent.createdAt).toBeInstanceOf(Date);
      expect(pageContent.updatedAt).toBeInstanceOf(Date);
    });

    it('should throw error when accessing id before persistence', () => {
      const pageContent = PageContent.create(menuItemId, validContent);

      expect(() => pageContent.id).toThrow(
        'PageContent has no ID - it has not been persisted yet'
      );
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute a PageContent from stored data', () => {
      const id = 'page-content-id-123';
      const createdAt = new Date('2025-01-01T00:00:00Z');
      const updatedAt = new Date('2025-01-02T00:00:00Z');

      const pageContent = PageContent.reconstitute(
        id,
        menuItemId,
        validContent,
        createdAt,
        updatedAt
      );

      expect(pageContent.id).toBe(id);
      expect(pageContent.hasId).toBe(true);
      expect(pageContent.menuItemId).toBe(menuItemId);
      expect(pageContent.content.value).toBe(validContent.value);
      expect(pageContent.createdAt).toBe(createdAt);
      expect(pageContent.updatedAt).toBe(updatedAt);
    });
  });

  describe('withId', () => {
    it('should return a new PageContent with the given ID', () => {
      const pageContent = PageContent.create(menuItemId, validContent);
      const newId = 'new-id-456';

      const withIdContent = pageContent.withId(newId);

      expect(withIdContent.id).toBe(newId);
      expect(withIdContent.menuItemId).toBe(menuItemId);
      expect(withIdContent.content.value).toBe(validContent.value);
    });
  });

  describe('withContent', () => {
    it('should return a new PageContent with updated content and updatedAt', () => {
      const originalDate = new Date('2025-01-01T00:00:00Z');
      const pageContent = PageContent.reconstitute(
        'id-123',
        menuItemId,
        validContent,
        originalDate,
        originalDate
      );

      const newContent = PageContentBody.create('<h1>Updated</h1>');
      const updatedPageContent = pageContent.withContent(newContent);

      expect(updatedPageContent.content.value).toBe(newContent.value);
      expect(updatedPageContent.createdAt).toEqual(originalDate);
      expect(updatedPageContent.updatedAt.getTime()).toBeGreaterThan(
        originalDate.getTime()
      );
    });
  });

  describe('equals', () => {
    it('should return true for PageContents with the same ID', () => {
      const id = 'same-id';
      const content1 = PageContent.reconstitute(
        id,
        menuItemId,
        validContent,
        new Date(),
        new Date()
      );
      const content2 = PageContent.reconstitute(
        id,
        'different-menu-item',
        PageContentBody.create('<p>Different</p>'),
        new Date(),
        new Date()
      );

      expect(content1.equals(content2)).toBe(true);
    });

    it('should return false for PageContents with different IDs', () => {
      const content1 = PageContent.reconstitute(
        'id-1',
        menuItemId,
        validContent,
        new Date(),
        new Date()
      );
      const content2 = PageContent.reconstitute(
        'id-2',
        menuItemId,
        validContent,
        new Date(),
        new Date()
      );

      expect(content1.equals(content2)).toBe(false);
    });

    it('should return false when comparing with null', () => {
      const content = PageContent.reconstitute(
        'id-1',
        menuItemId,
        validContent,
        new Date(),
        new Date()
      );

      expect(content.equals(null)).toBe(false);
    });

    it('should return false when comparing unpersisted PageContents', () => {
      const content1 = PageContent.create(menuItemId, validContent);
      const content2 = PageContent.create(menuItemId, validContent);

      expect(content1.equals(content2)).toBe(false);
    });
  });
});
