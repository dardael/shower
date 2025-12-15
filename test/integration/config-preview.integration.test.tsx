/**
 * @jest-environment node
 */
import { ZipImporter } from '@/infrastructure/config/adapters/ZipImporter';
import AdmZip from 'adm-zip';

// Mock the repositories
const mockMenuItemRepository = {
  findAll: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

const mockPageContentRepository = {
  save: jest.fn(),
};

const mockWebsiteSettingsRepository = {
  setByKey: jest.fn(),
};

const mockSocialNetworkRepository = {
  updateSocialNetworks: jest.fn(),
};

const mockLogger = {
  logInfo: jest.fn(),
  logError: jest.fn(),
  logWarning: jest.fn(),
  logDebug: jest.fn(),
};

// Mock fs module for image handling
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn(),
  readdirSync: jest.fn(),
}));

import * as fs from 'fs';

function createValidZipBuffer(): Buffer {
  const zip = new AdmZip();

  const manifest = {
    schemaVersion: '1.0',
    exportDate: new Date().toISOString(),
    summary: {
      menuItemCount: 2,
      pageContentCount: 2,
      settingsCount: 3,
      socialNetworkCount: 1,
      imageCount: 1,
    },
  };

  const menuItems = [
    {
      id: 'menu-1',
      text: 'Home',
      url: 'home',
      position: 0,
    },
    {
      id: 'menu-2',
      text: 'About',
      url: 'about',
      position: 1,
    },
  ];

  const pageContents = [
    {
      id: 'page-1',
      menuItemId: 'menu-1',
      content: '<p>Welcome to our website</p>',
    },
    {
      id: 'page-2',
      menuItemId: 'menu-2',
      content: '<p>About us content</p>',
    },
  ];

  const settings = [
    { key: 'websiteName', value: 'My Website' },
    { key: 'themeMode', value: 'dark' },
    { key: 'headerLogo', value: '/images/logo.png' },
  ];

  const socialNetworks = [
    {
      id: 'social-1',
      type: 'twitter',
      url: 'https://twitter.com/mywebsite',
      label: 'Twitter',
      enabled: true,
    },
  ];

  zip.addFile('manifest.json', Buffer.from(JSON.stringify(manifest)));
  zip.addFile('data/menu-items.json', Buffer.from(JSON.stringify(menuItems)));
  zip.addFile(
    'data/page-contents.json',
    Buffer.from(JSON.stringify(pageContents))
  );
  zip.addFile('data/settings.json', Buffer.from(JSON.stringify(settings)));
  zip.addFile(
    'data/social-networks.json',
    Buffer.from(JSON.stringify(socialNetworks))
  );
  zip.addFile(
    'images/page-content-images/logo.png',
    Buffer.from('fake-image-data')
  );

  return zip.toBuffer();
}

describe('Config Preview Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readdirSync as jest.Mock).mockReturnValue([]);
  });

  describe('validatePackage (preview)', () => {
    it('should return package summary for valid ZIP', async () => {
      const importer = new ZipImporter(
        mockMenuItemRepository as never,
        mockPageContentRepository as never,
        mockWebsiteSettingsRepository as never,
        mockSocialNetworkRepository as never,
        mockLogger as never
      );

      const zipBuffer = createValidZipBuffer();
      const result = await importer.validatePackage(zipBuffer);

      expect(result.valid).toBe(true);
      expect(result.package).toBeDefined();
      expect(result.package?.summary.menuItemCount).toBe(2);
      expect(result.package?.summary.pageContentCount).toBe(2);
      expect(result.package?.summary.settingsCount).toBe(3);
      expect(result.package?.summary.socialNetworkCount).toBe(1);
      expect(result.package?.summary.imageCount).toBe(1);
    });

    it('should return schemaVersion in package', async () => {
      const importer = new ZipImporter(
        mockMenuItemRepository as never,
        mockPageContentRepository as never,
        mockWebsiteSettingsRepository as never,
        mockSocialNetworkRepository as never,
        mockLogger as never
      );

      const zipBuffer = createValidZipBuffer();
      const result = await importer.validatePackage(zipBuffer);

      expect(result.valid).toBe(true);
      expect(result.package?.schemaVersion.toString()).toBe('1.0');
    });

    it('should return exportDate in package', async () => {
      const importer = new ZipImporter(
        mockMenuItemRepository as never,
        mockPageContentRepository as never,
        mockWebsiteSettingsRepository as never,
        mockSocialNetworkRepository as never,
        mockLogger as never
      );

      const zipBuffer = createValidZipBuffer();
      const result = await importer.validatePackage(zipBuffer);

      expect(result.valid).toBe(true);
      expect(result.package?.exportDate).toBeInstanceOf(Date);
    });

    it('should not modify any data during preview', async () => {
      const importer = new ZipImporter(
        mockMenuItemRepository as never,
        mockPageContentRepository as never,
        mockWebsiteSettingsRepository as never,
        mockSocialNetworkRepository as never,
        mockLogger as never
      );

      const zipBuffer = createValidZipBuffer();
      await importer.validatePackage(zipBuffer);

      // Verify no writes occurred
      expect(mockMenuItemRepository.save).not.toHaveBeenCalled();
      expect(mockMenuItemRepository.delete).not.toHaveBeenCalled();
      expect(mockPageContentRepository.save).not.toHaveBeenCalled();
      expect(mockWebsiteSettingsRepository.setByKey).not.toHaveBeenCalled();
      expect(
        mockSocialNetworkRepository.updateSocialNetworks
      ).not.toHaveBeenCalled();
    });

    it('should return error for incompatible version', async () => {
      const zip = new AdmZip();
      const manifest = {
        schemaVersion: '2.0',
        exportDate: new Date().toISOString(),
        summary: {
          menuItemCount: 0,
          pageContentCount: 0,
          settingsCount: 0,
          socialNetworkCount: 0,
          imageCount: 0,
        },
      };
      zip.addFile('manifest.json', Buffer.from(JSON.stringify(manifest)));

      const importer = new ZipImporter(
        mockMenuItemRepository as never,
        mockPageContentRepository as never,
        mockWebsiteSettingsRepository as never,
        mockSocialNetworkRepository as never,
        mockLogger as never
      );

      const result = await importer.validatePackage(zip.toBuffer());

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Incompatible package version');
    });

    it('should return error for missing manifest', async () => {
      const zip = new AdmZip();
      zip.addFile('data/menu-items.json', Buffer.from('[]'));

      const importer = new ZipImporter(
        mockMenuItemRepository as never,
        mockPageContentRepository as never,
        mockWebsiteSettingsRepository as never,
        mockSocialNetworkRepository as never,
        mockLogger as never
      );

      const result = await importer.validatePackage(zip.toBuffer());

      expect(result.valid).toBe(false);
      expect(result.error).toContain('missing manifest.json');
    });

    it('should return error for corrupt ZIP', async () => {
      const importer = new ZipImporter(
        mockMenuItemRepository as never,
        mockPageContentRepository as never,
        mockWebsiteSettingsRepository as never,
        mockSocialNetworkRepository as never,
        mockLogger as never
      );

      const result = await importer.validatePackage(
        Buffer.from('not a valid zip')
      );

      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('preview with ImportConfiguration use case', () => {
    it('should support preview through use case', async () => {
      // This test verifies the integration between ImportConfiguration and ZipImporter
      const { ImportConfiguration } = await import(
        '@/application/config/use-cases/ImportConfiguration'
      );

      const importer = new ZipImporter(
        mockMenuItemRepository as never,
        mockPageContentRepository as never,
        mockWebsiteSettingsRepository as never,
        mockSocialNetworkRepository as never,
        mockLogger as never
      );

      const useCase = new ImportConfiguration(importer);
      const zipBuffer = createValidZipBuffer();

      const result = await useCase.preview(zipBuffer);

      expect(result.valid).toBe(true);
      expect(result.package).toBeDefined();

      // Verify no actual import happened
      expect(mockMenuItemRepository.save).not.toHaveBeenCalled();
    });
  });
});
