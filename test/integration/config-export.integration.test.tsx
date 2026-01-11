/**
 * @jest-environment node
 */
import { ZipExporter } from '@/infrastructure/config/adapters/ZipExporter';
import AdmZip from 'adm-zip';

// Mock the repositories
const mockMenuItemRepository = {
  findAll: jest.fn(),
};

const mockPageContentRepository = {
  findByMenuItemId: jest.fn(),
};

const mockWebsiteSettingsRepository = {
  getByKey: jest.fn(),
};

const mockSocialNetworkRepository = {
  getAllSocialNetworks: jest.fn(),
};

const mockProductRepository = {
  getAll: jest.fn(),
};

const mockCategoryRepository = {
  getAll: jest.fn(),
};

const mockActivityRepository = {
  findAll: jest.fn(),
};

const mockAvailabilityRepository = {
  find: jest.fn(),
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
  promises: {
    readdir: jest.fn(),
    readFile: jest.fn(),
    stat: jest.fn(),
  },
  existsSync: jest.fn(),
}));

import * as fs from 'fs';

describe('Config Export Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mock returns
    mockMenuItemRepository.findAll.mockResolvedValue([
      {
        id: 'menu-1',
        text: { value: 'Home' },
        url: null,
        position: 0,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
        toJSON: () => ({
          id: 'menu-1',
          text: 'Home',
          url: null,
          position: 0,
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-01T00:00:00.000Z',
        }),
      },
    ]);

    mockPageContentRepository.findByMenuItemId.mockResolvedValue({
      id: 'page-1',
      menuItemId: 'menu-1',
      content: { value: '<p>Hello World</p>' },
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
      toJSON: () => ({
        id: 'page-1',
        menuItemId: 'menu-1',
        content: '<p>Hello World</p>',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
      }),
    });

    mockWebsiteSettingsRepository.getByKey.mockImplementation(
      (key: string) => ({
        key,
        value: `test-value-${key}`,
        toJSON: () => ({ key, value: `test-value-${key}` }),
      })
    );

    mockSocialNetworkRepository.getAllSocialNetworks.mockResolvedValue([
      {
        type: 'facebook',
        url: 'https://facebook.com/test',
        label: 'Facebook',
        enabled: true,
        toJSON: () => ({
          type: 'facebook',
          url: 'https://facebook.com/test',
          label: 'Facebook',
          enabled: true,
        }),
      },
    ]);

    // Mock product/category/activity/availability repositories
    mockProductRepository.getAll.mockResolvedValue([]);
    mockCategoryRepository.getAll.mockResolvedValue([]);
    mockActivityRepository.findAll.mockResolvedValue([]);
    mockAvailabilityRepository.find.mockResolvedValue(null);

    // Mock fs functions
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.promises.readdir as jest.Mock).mockResolvedValue([]);
    (fs.promises.stat as jest.Mock).mockResolvedValue({ size: 0 });
  });

  describe('exportToZip', () => {
    it('should create a valid ZIP file with manifest.json', async () => {
      const exporter = new ZipExporter(
        mockMenuItemRepository as never,
        mockPageContentRepository as never,
        mockWebsiteSettingsRepository as never,
        mockSocialNetworkRepository as never,
        mockProductRepository as never,
        mockCategoryRepository as never,
        mockActivityRepository as never,
        mockAvailabilityRepository as never,
        mockLogger as never
      );

      const buffer = await exporter.exportToZip();

      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(0);

      // Verify ZIP structure
      const zip = new AdmZip(buffer);
      const entries = zip.getEntries().map((e) => e.entryName);

      expect(entries).toContain('manifest.json');
      expect(entries).toContain('data/menu-items.json');
      expect(entries).toContain('data/page-contents.json');
      expect(entries).toContain('data/settings.json');
      expect(entries).toContain('data/social-networks.json');
    });

    it('should include correct schema version in manifest', async () => {
      const exporter = new ZipExporter(
        mockMenuItemRepository as never,
        mockPageContentRepository as never,
        mockWebsiteSettingsRepository as never,
        mockSocialNetworkRepository as never,
        mockProductRepository as never,
        mockCategoryRepository as never,
        mockActivityRepository as never,
        mockAvailabilityRepository as never,
        mockLogger as never
      );

      const buffer = await exporter.exportToZip();
      const zip = new AdmZip(buffer);
      const manifestEntry = zip.getEntry('manifest.json');
      const manifest = JSON.parse(manifestEntry!.getData().toString('utf8'));

      expect(manifest.schemaVersion).toBe('1.2');
      expect(manifest.exportDate).toBeDefined();
      expect(manifest.summary).toBeDefined();
      expect(manifest.summary.menuItemCount).toBe(1);
      expect(manifest.summary.socialNetworkCount).toBe(1);
    });

    it('should export menu items as JSON', async () => {
      const exporter = new ZipExporter(
        mockMenuItemRepository as never,
        mockPageContentRepository as never,
        mockWebsiteSettingsRepository as never,
        mockSocialNetworkRepository as never,
        mockProductRepository as never,
        mockCategoryRepository as never,
        mockActivityRepository as never,
        mockAvailabilityRepository as never,
        mockLogger as never
      );

      const buffer = await exporter.exportToZip();
      const zip = new AdmZip(buffer);
      const menuEntry = zip.getEntry('data/menu-items.json');
      const menuItems = JSON.parse(menuEntry!.getData().toString('utf8'));

      expect(menuItems).toHaveLength(1);
      expect(menuItems[0].text).toBe('Home');
    });
  });

  describe('getExportSummary', () => {
    it('should return package summary without creating ZIP', async () => {
      const exporter = new ZipExporter(
        mockMenuItemRepository as never,
        mockPageContentRepository as never,
        mockWebsiteSettingsRepository as never,
        mockSocialNetworkRepository as never,
        mockProductRepository as never,
        mockCategoryRepository as never,
        mockActivityRepository as never,
        mockAvailabilityRepository as never,
        mockLogger as never
      );

      const exportPackage = await exporter.getExportSummary();

      expect(exportPackage.summary.menuItemCount).toBe(1);
      expect(exportPackage.summary.pageContentCount).toBe(1);
      expect(exportPackage.summary.socialNetworkCount).toBe(1);
      expect(exportPackage.schemaVersion.toString()).toBe('1.2');
    });
  });
});
