import { WebsiteSettings } from '@/domain/settings/entities/WebsiteSettings';
import { WebsiteName } from '@/domain/settings/value-objects/WebsiteName';

describe('WebsiteSettings', () => {
  it('should create website settings with name', () => {
    const name = new WebsiteName('Test Site');
    const settings = new WebsiteSettings('name', name);
    expect(settings.key).toBe('name');
    expect(settings.name.value).toBe('Test Site');
  });

  it('should update name', () => {
    const name1 = new WebsiteName('Old Name');
    const settings = new WebsiteSettings('name', name1);
    const name2 = new WebsiteName('New Name');
    settings.updateName(name2);
    expect(settings.name.value).toBe('New Name');
  });
});
