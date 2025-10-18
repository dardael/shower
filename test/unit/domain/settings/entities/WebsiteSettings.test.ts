import { WebsiteSettings } from '@/domain/settings/entities/WebsiteSettings';
import { WebsiteName } from '@/domain/settings/value-objects/WebsiteName';
import { WebsiteIcon } from '@/domain/settings/value-objects/WebsiteIcon';

describe('WebsiteSettings', () => {
  const mockIconMetadata = {
    filename: 'favicon-123.ico',
    originalName: 'favicon.ico',
    size: 1024,
    format: 'ico',
    mimeType: 'image/x-icon',
    uploadedAt: new Date('2024-01-01T00:00:00Z'),
  };

  it('should create website settings with name', () => {
    const name = new WebsiteName('Test Site');
    const settings = new WebsiteSettings('name', name);
    expect(settings.key).toBe('name');
    expect(settings.name.value).toBe('Test Site');
    expect(settings.icon).toBeNull();
  });

  it('should create website settings with name and icon', () => {
    const name = new WebsiteName('Test Site');
    const icon = new WebsiteIcon(
      'https://example.com/favicon.ico',
      mockIconMetadata
    );
    const settings = new WebsiteSettings('name', name, icon);

    expect(settings.key).toBe('name');
    expect(settings.name.value).toBe('Test Site');
    expect(settings.icon).not.toBeNull();
    expect(settings.icon?.url).toBe('https://example.com/favicon.ico');
  });

  it('should update name', () => {
    const name1 = new WebsiteName('Old Name');
    const settings = new WebsiteSettings('name', name1);
    const name2 = new WebsiteName('New Name');
    settings.updateName(name2);
    expect(settings.name.value).toBe('New Name');
  });

  it('should update icon', () => {
    const name = new WebsiteName('Test Site');
    const settings = new WebsiteSettings('name', name);

    const icon = new WebsiteIcon(
      'https://example.com/favicon.ico',
      mockIconMetadata
    );
    settings.updateIcon(icon);

    expect(settings.icon).not.toBeNull();
    expect(settings.icon?.url).toBe('https://example.com/favicon.ico');
  });

  it('should remove icon', () => {
    const name = new WebsiteName('Test Site');
    const icon = new WebsiteIcon(
      'https://example.com/favicon.ico',
      mockIconMetadata
    );
    const settings = new WebsiteSettings('name', name, icon);

    expect(settings.hasIcon()).toBe(true);

    settings.removeIcon();

    expect(settings.icon).toBeNull();
    expect(settings.hasIcon()).toBe(false);
  });

  it('should check if has icon', () => {
    const name = new WebsiteName('Test Site');
    const settingsWithoutIcon = new WebsiteSettings('name', name);
    const icon = new WebsiteIcon(
      'https://example.com/favicon.ico',
      mockIconMetadata
    );
    const settingsWithIcon = new WebsiteSettings('name', name, icon);

    expect(settingsWithoutIcon.hasIcon()).toBe(false);
    expect(settingsWithIcon.hasIcon()).toBe(true);
  });

  it('should check if icon is optimal for favicon', () => {
    const name = new WebsiteName('Test Site');
    const settingsWithoutIcon = new WebsiteSettings('name', name);
    const icon = new WebsiteIcon(
      'https://example.com/favicon.ico',
      mockIconMetadata
    );
    const settingsWithIcon = new WebsiteSettings('name', name, icon);

    expect(settingsWithoutIcon.isIconOptimalForFavicon()).toBe(false);
    expect(settingsWithIcon.isIconOptimalForFavicon()).toBe(true);
  });

  it('should use setter for icon', () => {
    const name = new WebsiteName('Test Site');
    const settings = new WebsiteSettings('name', name);

    const icon = new WebsiteIcon(
      'https://example.com/favicon.ico',
      mockIconMetadata
    );
    settings.icon = icon;

    expect(settings.icon).not.toBeNull();
    expect(settings.icon?.url).toBe('https://example.com/favicon.ico');
  });

  it('should equal another settings with same properties', () => {
    const name = new WebsiteName('Test Site');
    const icon = new WebsiteIcon(
      'https://example.com/favicon.ico',
      mockIconMetadata
    );
    const settings1 = new WebsiteSettings('name', name, icon);
    const settings2 = new WebsiteSettings('name', name, icon);

    expect(settings1.equals(settings2)).toBe(true);
  });

  it('should not equal settings with different key', () => {
    const name = new WebsiteName('Test Site');
    const icon = new WebsiteIcon(
      'https://example.com/favicon.ico',
      mockIconMetadata
    );
    const settings1 = new WebsiteSettings('key1', name, icon);
    const settings2 = new WebsiteSettings('key2', name, icon);

    expect(settings1.equals(settings2)).toBe(false);
  });

  it('should not equal settings with different name', () => {
    const name1 = new WebsiteName('Test Site 1');
    const name2 = new WebsiteName('Test Site 2');
    const icon = new WebsiteIcon(
      'https://example.com/favicon.ico',
      mockIconMetadata
    );
    const settings1 = new WebsiteSettings('name', name1, icon);
    const settings2 = new WebsiteSettings('name', name2, icon);

    expect(settings1.equals(settings2)).toBe(false);
  });

  it('should not equal settings with different icon', () => {
    const name = new WebsiteName('Test Site');
    const icon1 = new WebsiteIcon(
      'https://example.com/favicon1.ico',
      mockIconMetadata
    );
    const icon2 = new WebsiteIcon(
      'https://example.com/favicon2.ico',
      mockIconMetadata
    );
    const settings1 = new WebsiteSettings('name', name, icon1);
    const settings2 = new WebsiteSettings('name', name, icon2);

    expect(settings1.equals(settings2)).toBe(false);
  });

  it('should handle null comparison in equals', () => {
    const name = new WebsiteName('Test Site');
    const settings = new WebsiteSettings('name', name);

    expect(settings.equals(null)).toBe(false);
  });

  it('should create using factory method', () => {
    const name = new WebsiteName('Test Site');
    const settings = WebsiteSettings.create('name', name);

    expect(settings.key).toBe('name');
    expect(settings.name.value).toBe('Test Site');
    expect(settings.icon).toBeNull();
  });

  it('should create with icon using factory method', () => {
    const name = new WebsiteName('Test Site');
    const icon = new WebsiteIcon(
      'https://example.com/favicon.ico',
      mockIconMetadata
    );
    const settings = WebsiteSettings.createWithIcon('name', name, icon);

    expect(settings.key).toBe('name');
    expect(settings.name.value).toBe('Test Site');
    expect(settings.icon).not.toBeNull();
    expect(settings.icon?.url).toBe('https://example.com/favicon.ico');
  });
});
