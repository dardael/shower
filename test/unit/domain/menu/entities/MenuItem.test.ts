import { MenuItem } from '@/domain/menu/entities/MenuItem';
import { MenuItemText } from '@/domain/menu/value-objects/MenuItemText';

describe('MenuItem', () => {
  describe('create', () => {
    it('should create a menu item with valid text and position', () => {
      const text = MenuItemText.create('Home');
      const menuItem = MenuItem.create(text, 0);

      expect(menuItem.hasId).toBe(false);
      expect(menuItem.text.value).toBe('Home');
      expect(menuItem.position).toBe(0);
      expect(menuItem.createdAt).toBeInstanceOf(Date);
      expect(menuItem.updatedAt).toBeInstanceOf(Date);
    });

    it('should throw error when accessing id on unpersisted item', () => {
      const text = MenuItemText.create('Home');
      const menuItem = MenuItem.create(text, 0);

      expect(() => menuItem.id).toThrow(
        'MenuItem has no ID - it has not been persisted yet'
      );
    });

    it('should throw error for negative position', () => {
      const text = MenuItemText.create('Home');

      expect(() => MenuItem.create(text, -1)).toThrow(
        'Position must be a non-negative number'
      );
    });
  });

  describe('withId', () => {
    it('should return a new menu item with the given ID', () => {
      const text = MenuItemText.create('Home');
      const menuItem = MenuItem.create(text, 0);
      const menuItemWithId = menuItem.withId('mongo-generated-id');

      expect(menuItemWithId.hasId).toBe(true);
      expect(menuItemWithId.id).toBe('mongo-generated-id');
      expect(menuItemWithId.text.value).toBe('Home');
      expect(menuItemWithId.position).toBe(0);
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute a menu item from stored data', () => {
      const id = 'test-id-123';
      const text = MenuItemText.create('About');
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');

      const menuItem = MenuItem.reconstitute(id, text, 1, createdAt, updatedAt);

      expect(menuItem.id).toBe(id);
      expect(menuItem.hasId).toBe(true);
      expect(menuItem.text.value).toBe('About');
      expect(menuItem.position).toBe(1);
      expect(menuItem.createdAt).toBe(createdAt);
      expect(menuItem.updatedAt).toBe(updatedAt);
    });
  });

  describe('withText', () => {
    it('should return a new menu item with updated text', () => {
      const originalText = MenuItemText.create('Home');
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const menuItem = MenuItem.reconstitute(
        'test-id',
        originalText,
        2,
        createdAt,
        updatedAt
      );

      const newText = MenuItemText.create('Updated Home');
      const updatedItem = menuItem.withText(newText);

      expect(updatedItem.text.value).toBe('Updated Home');
    });

    it('should preserve the original id', () => {
      const text = MenuItemText.create('Home');
      const menuItem = MenuItem.reconstitute(
        'original-id',
        text,
        0,
        new Date(),
        new Date()
      );

      const updatedItem = menuItem.withText(MenuItemText.create('New Text'));

      expect(updatedItem.id).toBe('original-id');
    });

    it('should preserve the original position', () => {
      const text = MenuItemText.create('Home');
      const menuItem = MenuItem.reconstitute(
        'test-id',
        text,
        5,
        new Date(),
        new Date()
      );

      const updatedItem = menuItem.withText(MenuItemText.create('New Text'));

      expect(updatedItem.position).toBe(5);
    });

    it('should preserve the original createdAt', () => {
      const text = MenuItemText.create('Home');
      const createdAt = new Date('2024-01-01');
      const menuItem = MenuItem.reconstitute(
        'test-id',
        text,
        0,
        createdAt,
        new Date()
      );

      const updatedItem = menuItem.withText(MenuItemText.create('New Text'));

      expect(updatedItem.createdAt).toBe(createdAt);
    });

    it('should update the updatedAt timestamp', () => {
      const text = MenuItemText.create('Home');
      const originalUpdatedAt = new Date('2024-01-01');
      const menuItem = MenuItem.reconstitute(
        'test-id',
        text,
        0,
        new Date(),
        originalUpdatedAt
      );

      const updatedItem = menuItem.withText(MenuItemText.create('New Text'));

      expect(updatedItem.updatedAt.getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime()
      );
    });

    it('should not mutate the original menu item', () => {
      const originalText = MenuItemText.create('Original');
      const menuItem = MenuItem.reconstitute(
        'test-id',
        originalText,
        0,
        new Date(),
        new Date()
      );

      menuItem.withText(MenuItemText.create('Updated'));

      expect(menuItem.text.value).toBe('Original');
    });
  });

  describe('equals', () => {
    it('should return true for menu items with same ID', () => {
      const text = MenuItemText.create('Home');
      const createdAt = new Date();
      const menuItem1 = MenuItem.reconstitute(
        'same-id',
        text,
        0,
        createdAt,
        createdAt
      );
      const menuItem2 = MenuItem.reconstitute(
        'same-id',
        MenuItemText.create('Different'),
        1,
        createdAt,
        createdAt
      );

      expect(menuItem1.equals(menuItem2)).toBe(true);
    });

    it('should return false for menu items with different IDs', () => {
      const text = MenuItemText.create('Home');
      const createdAt = new Date();
      const menuItem1 = MenuItem.reconstitute(
        'id-1',
        text,
        0,
        createdAt,
        createdAt
      );
      const menuItem2 = MenuItem.reconstitute(
        'id-2',
        text,
        0,
        createdAt,
        createdAt
      );

      expect(menuItem1.equals(menuItem2)).toBe(false);
    });

    it('should return false for unpersisted items', () => {
      const text = MenuItemText.create('Home');
      const menuItem1 = MenuItem.create(text, 0);
      const menuItem2 = MenuItem.create(text, 0);

      expect(menuItem1.equals(menuItem2)).toBe(false);
    });

    it('should return false for null', () => {
      const text = MenuItemText.create('Home');
      const menuItem = MenuItem.reconstitute(
        'test-id',
        text,
        0,
        new Date(),
        new Date()
      );

      expect(menuItem.equals(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      const text = MenuItemText.create('Home');
      const menuItem = MenuItem.reconstitute(
        'test-id',
        text,
        0,
        new Date(),
        new Date()
      );

      expect(menuItem.equals(undefined)).toBe(false);
    });
  });
});
