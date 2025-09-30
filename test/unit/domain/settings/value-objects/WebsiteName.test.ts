import { WebsiteName } from '@/domain/settings/value-objects/WebsiteName';

describe('WebsiteName', () => {
  it('should create a valid website name', () => {
    const name = new WebsiteName('My Website');
    expect(name.value).toBe('My Website');
  });

  it('should trim whitespace', () => {
    const name = new WebsiteName('  My Website  ');
    expect(name.value).toBe('My Website');
  });

  it('should throw error for empty name', () => {
    expect(() => new WebsiteName('')).toThrow('Website name cannot be empty');
    expect(() => new WebsiteName('   ')).toThrow(
      'Website name cannot be empty'
    );
  });

  it('should throw error for name too long', () => {
    const longName = 'a'.repeat(51);
    expect(() => new WebsiteName(longName)).toThrow(
      'Website name cannot exceed 50 characters'
    );
  });

  it('should throw error for invalid characters', () => {
    expect(() => new WebsiteName('Test<script>')).toThrow(
      'Website name contains invalid characters'
    );
    expect(() => new WebsiteName('Test&')).toThrow(
      'Website name contains invalid characters'
    );
    expect(() => new WebsiteName('Test"')).toThrow(
      'Website name contains invalid characters'
    );
  });

  it('should be equal for same values', () => {
    const name1 = new WebsiteName('Test');
    const name2 = new WebsiteName('Test');
    expect(name1.equals(name2)).toBe(true);
  });

  it('should not be equal for different values', () => {
    const name1 = new WebsiteName('Test1');
    const name2 = new WebsiteName('Test2');
    expect(name1.equals(name2)).toBe(false);
  });
});
