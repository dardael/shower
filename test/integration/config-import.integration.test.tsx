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
  findAll: jest.fn(),
  findByMenuItemId: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
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

// Mock fs/promises module for image handling
jest.mock('fs/promises', () => ({
  readdir: jest.fn().mockResolvedValue([]),
  unlink: jest.fn().mockResolvedValue(undefined),
  mkdir: jest.fn().mockResolvedValue(undefined),
  writeFile: jest.fn().mockResolvedValue(undefined),
}));

import * as fs from 'fs/promises';

function createValidZipBuffer(): Buffer {
  const zip = new AdmZip();

  const manifest = {
    schemaVersion: '1.0',
    exportDate: new Date().toISOString(),
    summary: {
      menuItemCount: 1,
      pageContentCount: 1,
      settingsCount: 2,
      socialNetworkCount: 1,
      imageCount: 0,
    },
  };

  const menuItems = [
    {
      id: 'menu-1',
      text: 'Home',
      url: 'home',
      position: 0,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    },
  ];

  const pageContents = [
    {
      id: 'page-1',
      menuItemId: 'menu-1',
      content: '<p>Hello World</p>',
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    },
  ];

  const settings = [
    { key: 'websiteName', value: 'Test Website' },
    { key: 'themeMode', value: 'light' },
  ];

  const socialNetworks = [
    {
      id: 'social-1',
      type: 'facebook',
      url: 'https://facebook.com/test',
      label: 'Facebook',
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

  return zip.toBuffer();
}

function createInvalidVersionZipBuffer(): Buffer {
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

  return zip.toBuffer();
}

describe('Config Import Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mock returns
    mockMenuItemRepository.findAll.mockResolvedValue([]);
    mockMenuItemRepository.save.mockResolvedValue(undefined);
    mockPageContentRepository.findAll.mockResolvedValue([]);
    mockPageContentRepository.save.mockResolvedValue(undefined);
    mockPageContentRepository.delete.mockResolvedValue(undefined);
    mockMenuItemRepository.delete.mockResolvedValue(undefined);
    mockPageContentRepository.save.mockResolvedValue(undefined);
    mockWebsiteSettingsRepository.setByKey.mockResolvedValue(undefined);
    mockSocialNetworkRepository.updateSocialNetworks.mockResolvedValue(
      undefined
    );

    // Mock fs functions - readdir returns empty array by default (no files to clear)
    (fs.readdir as jest.Mock).mockResolvedValue([]);
  });

  describe('validatePackage', () => {
    it('should validate a valid ZIP package', async () => {
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
      expect(result.package?.summary.menuItemCount).toBe(1);
    });

    it('should reject package without manifest.json', async () => {
      const importer = new ZipImporter(
        mockMenuItemRepository as never,
        mockPageContentRepository as never,
        mockWebsiteSettingsRepository as never,
        mockSocialNetworkRepository as never,
        mockLogger as never
      );

      const zip = new AdmZip();
      zip.addFile('data/menu-items.json', Buffer.from('[]'));
      const zipBuffer = zip.toBuffer();

      const result = await importer.validatePackage(zipBuffer);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('missing manifest.json');
    });

    it('should reject package with incompatible version', async () => {
      const importer = new ZipImporter(
        mockMenuItemRepository as never,
        mockPageContentRepository as never,
        mockWebsiteSettingsRepository as never,
        mockSocialNetworkRepository as never,
        mockLogger as never
      );

      const zipBuffer = createInvalidVersionZipBuffer();
      const result = await importer.validatePackage(zipBuffer);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Incompatible package version');
    });

    it('should reject invalid ZIP data', async () => {
      const importer = new ZipImporter(
        mockMenuItemRepository as never,
        mockPageContentRepository as never,
        mockWebsiteSettingsRepository as never,
        mockSocialNetworkRepository as never,
        mockLogger as never
      );

      const invalidBuffer = Buffer.from('not a valid zip file');
      const result = await importer.validatePackage(invalidBuffer);

      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('importFromZip', () => {
    it('should import all data from valid ZIP', async () => {
      const importer = new ZipImporter(
        mockMenuItemRepository as never,
        mockPageContentRepository as never,
        mockWebsiteSettingsRepository as never,
        mockSocialNetworkRepository as never,
        mockLogger as never
      );

      const zipBuffer = createValidZipBuffer();
      const result = await importer.importFromZip(zipBuffer);

      expect(result.success).toBe(true);
      expect(result.imported).toBeDefined();
      expect(result.imported?.menuItems).toBe(1);
      expect(result.imported?.pageContents).toBe(1);
      expect(result.imported?.settings).toBe(2);
      expect(result.imported?.socialNetworks).toBe(1);
    });

    it('should clear existing data before import', async () => {
      const existingMenuItems = [{ id: 'old-menu-1' }, { id: 'old-menu-2' }];
      mockMenuItemRepository.findAll.mockResolvedValue(existingMenuItems);

      const importer = new ZipImporter(
        mockMenuItemRepository as never,
        mockPageContentRepository as never,
        mockWebsiteSettingsRepository as never,
        mockSocialNetworkRepository as never,
        mockLogger as never
      );

      const zipBuffer = createValidZipBuffer();
      await importer.importFromZip(zipBuffer);

      expect(mockMenuItemRepository.delete).toHaveBeenCalledWith('old-menu-1');
      expect(mockMenuItemRepository.delete).toHaveBeenCalledWith('old-menu-2');
    });

    it('should save imported menu items', async () => {
      const importer = new ZipImporter(
        mockMenuItemRepository as never,
        mockPageContentRepository as never,
        mockWebsiteSettingsRepository as never,
        mockSocialNetworkRepository as never,
        mockLogger as never
      );

      const zipBuffer = createValidZipBuffer();
      await importer.importFromZip(zipBuffer);

      expect(mockMenuItemRepository.save).toHaveBeenCalledTimes(1);
      expect(mockMenuItemRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'menu-1',
        })
      );
    });

    it('should save imported page contents', async () => {
      const importer = new ZipImporter(
        mockMenuItemRepository as never,
        mockPageContentRepository as never,
        mockWebsiteSettingsRepository as never,
        mockSocialNetworkRepository as never,
        mockLogger as never
      );

      const zipBuffer = createValidZipBuffer();
      await importer.importFromZip(zipBuffer);

      expect(mockPageContentRepository.save).toHaveBeenCalledTimes(1);
      expect(mockPageContentRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'page-1',
          menuItemId: 'menu-1',
        })
      );
    });

    it('should save imported settings', async () => {
      const importer = new ZipImporter(
        mockMenuItemRepository as never,
        mockPageContentRepository as never,
        mockWebsiteSettingsRepository as never,
        mockSocialNetworkRepository as never,
        mockLogger as never
      );

      const zipBuffer = createValidZipBuffer();
      await importer.importFromZip(zipBuffer);

      expect(mockWebsiteSettingsRepository.setByKey).toHaveBeenCalledWith(
        'websiteName',
        'Test Website'
      );
      expect(mockWebsiteSettingsRepository.setByKey).toHaveBeenCalledWith(
        'themeMode',
        'light'
      );
    });

    it('should update social networks', async () => {
      const importer = new ZipImporter(
        mockMenuItemRepository as never,
        mockPageContentRepository as never,
        mockWebsiteSettingsRepository as never,
        mockSocialNetworkRepository as never,
        mockLogger as never
      );

      const zipBuffer = createValidZipBuffer();
      await importer.importFromZip(zipBuffer);

      expect(
        mockSocialNetworkRepository.updateSocialNetworks
      ).toHaveBeenCalledTimes(1);
    });

    it('should return error for invalid package', async () => {
      const importer = new ZipImporter(
        mockMenuItemRepository as never,
        mockPageContentRepository as never,
        mockWebsiteSettingsRepository as never,
        mockSocialNetworkRepository as never,
        mockLogger as never
      );

      const invalidBuffer = Buffer.from('not a valid zip file');
      const result = await importer.importFromZip(invalidBuffer);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should log import progress', async () => {
      const importer = new ZipImporter(
        mockMenuItemRepository as never,
        mockPageContentRepository as never,
        mockWebsiteSettingsRepository as never,
        mockSocialNetworkRepository as never,
        mockLogger as never
      );

      const zipBuffer = createValidZipBuffer();
      await importer.importFromZip(zipBuffer);

      expect(mockLogger.logInfo).toHaveBeenCalledWith(
        'Starting configuration import'
      );
      expect(mockLogger.logInfo).toHaveBeenCalledWith(
        expect.stringContaining('Import complete')
      );
    });
  });

  describe('image import', () => {
    it('should import images from ZIP', async () => {
      const zip = new AdmZip();

      const manifest = {
        schemaVersion: '1.0',
        exportDate: new Date().toISOString(),
        summary: {
          menuItemCount: 0,
          pageContentCount: 0,
          settingsCount: 0,
          socialNetworkCount: 0,
          imageCount: 1,
        },
      };

      zip.addFile('manifest.json', Buffer.from(JSON.stringify(manifest)));
      zip.addFile('data/menu-items.json', Buffer.from('[]'));
      zip.addFile('data/page-contents.json', Buffer.from('[]'));
      zip.addFile('data/settings.json', Buffer.from('[]'));
      zip.addFile('data/social-networks.json', Buffer.from('[]'));
      zip.addFile(
        'images/page-content-images/test-image.png',
        Buffer.from('fake-image-data')
      );

      const importer = new ZipImporter(
        mockMenuItemRepository as never,
        mockPageContentRepository as never,
        mockWebsiteSettingsRepository as never,
        mockSocialNetworkRepository as never,
        mockLogger as never
      );

      const zipBuffer = zip.toBuffer();
      const result = await importer.importFromZip(zipBuffer);

      expect(result.success).toBe(true);
      expect(result.imported?.images).toBe(1);
      expect(fs.writeFile).toHaveBeenCalled();
    });

    it('should create images directory if not exists', async () => {
      // With fs/promises, mkdir with recursive: true handles this automatically

      const zip = new AdmZip();

      const manifest = {
        schemaVersion: '1.0',
        exportDate: new Date().toISOString(),
        summary: {
          menuItemCount: 0,
          pageContentCount: 0,
          settingsCount: 0,
          socialNetworkCount: 0,
          imageCount: 1,
        },
      };

      zip.addFile('manifest.json', Buffer.from(JSON.stringify(manifest)));
      zip.addFile('data/menu-items.json', Buffer.from('[]'));
      zip.addFile('data/page-contents.json', Buffer.from('[]'));
      zip.addFile('data/settings.json', Buffer.from('[]'));
      zip.addFile('data/social-networks.json', Buffer.from('[]'));
      zip.addFile(
        'images/page-content-images/test-image.png',
        Buffer.from('fake-image-data')
      );

      const importer = new ZipImporter(
        mockMenuItemRepository as never,
        mockPageContentRepository as never,
        mockWebsiteSettingsRepository as never,
        mockSocialNetworkRepository as never,
        mockLogger as never
      );

      const zipBuffer = zip.toBuffer();
      await importer.importFromZip(zipBuffer);

      expect(fs.mkdir).toHaveBeenCalledWith(expect.any(String), {
        recursive: true,
      });
    });
  });

  describe('menu item URL handling', () => {
    it('should generate slug when URL is null', async () => {
      const zip = new AdmZip();

      const manifest = {
        schemaVersion: '1.0',
        exportDate: new Date().toISOString(),
        summary: {
          menuItemCount: 1,
          pageContentCount: 0,
          settingsCount: 0,
          socialNetworkCount: 0,
          imageCount: 0,
        },
      };

      const menuItems = [
        {
          id: 'menu-1',
          text: 'About Us',
          url: null,
          position: 0,
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-01T00:00:00.000Z',
        },
      ];

      zip.addFile('manifest.json', Buffer.from(JSON.stringify(manifest)));
      zip.addFile(
        'data/menu-items.json',
        Buffer.from(JSON.stringify(menuItems))
      );
      zip.addFile('data/page-contents.json', Buffer.from('[]'));
      zip.addFile('data/settings.json', Buffer.from('[]'));
      zip.addFile('data/social-networks.json', Buffer.from('[]'));

      const importer = new ZipImporter(
        mockMenuItemRepository as never,
        mockPageContentRepository as never,
        mockWebsiteSettingsRepository as never,
        mockSocialNetworkRepository as never,
        mockLogger as never
      );

      const zipBuffer = zip.toBuffer();
      await importer.importFromZip(zipBuffer);

      expect(mockMenuItemRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'menu-1',
        })
      );
    });
  });
});
