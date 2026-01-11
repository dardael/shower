import {
  ImportConfiguration,
  IImportConfiguration,
} from '@/application/config/use-cases/ImportConfiguration';
import {
  IConfigurationImporter,
  ImportResult,
  ImportValidationResult,
} from '@/domain/config/ports/IConfigurationImporter';
import { ExportPackage } from '@/domain/config/entities/ExportPackage';
import { PackageVersion } from '@/domain/config/value-objects/PackageVersion';

describe('ImportConfiguration', () => {
  let mockImporter: jest.Mocked<IConfigurationImporter>;
  let useCase: IImportConfiguration;
  const mockZipBuffer = Buffer.from('mock-zip-data');

  function createMockExportPackage(): ExportPackage {
    return ExportPackage.create({
      schemaVersion: PackageVersion.CURRENT,
      exportDate: new Date('2025-01-01T00:00:00.000Z'),
      sourceIdentifier: 'test',
      summary: {
        menuItemCount: 5,
        pageContentCount: 3,
        settingsCount: 10,
        socialNetworkCount: 2,
        productCount: 0,
        categoryCount: 0,
        activityCount: 0,
        hasAvailability: false,
        imageCount: 1,
        totalSizeBytes: 1024,
      },
    });
  }

  beforeEach(() => {
    mockImporter = {
      validatePackage: jest.fn(),
      importFromZip: jest.fn(),
    };
    useCase = new ImportConfiguration(mockImporter);
  });

  describe('preview', () => {
    it('should call validatePackage on importer', async () => {
      const mockPackage = createMockExportPackage();
      const expectedResult: ImportValidationResult = {
        valid: true,
        package: mockPackage,
      };
      mockImporter.validatePackage.mockResolvedValue(expectedResult);

      const result = await useCase.preview(mockZipBuffer);

      expect(mockImporter.validatePackage).toHaveBeenCalledWith(mockZipBuffer);
      expect(result).toEqual(expectedResult);
      expect(result.package?.summary.menuItemCount).toBe(5);
    });

    it('should return validation error for invalid package', async () => {
      const expectedResult: ImportValidationResult = {
        valid: false,
        error: 'Invalid package: missing manifest.json',
      };
      mockImporter.validatePackage.mockResolvedValue(expectedResult);

      const result = await useCase.preview(mockZipBuffer);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid package: missing manifest.json');
    });
  });

  describe('execute', () => {
    it('should validate and import when package is valid', async () => {
      const mockPackage = createMockExportPackage();
      const validationResult: ImportValidationResult = {
        valid: true,
        package: mockPackage,
      };
      const importResult: ImportResult = {
        success: true,
        imported: {
          menuItems: 5,
          pageContents: 3,
          settings: 10,
          socialNetworks: 2,
          products: 0,
          categories: 0,
          activities: 0,
          hasAvailability: false,
          images: 1,
        },
      };
      mockImporter.validatePackage.mockResolvedValue(validationResult);
      mockImporter.importFromZip.mockResolvedValue(importResult);

      const result = await useCase.execute(mockZipBuffer);

      expect(mockImporter.validatePackage).toHaveBeenCalledWith(mockZipBuffer);
      expect(mockImporter.importFromZip).toHaveBeenCalledWith(mockZipBuffer);
      expect(result.success).toBe(true);
      expect(result.imported).toEqual({
        menuItems: 5,
        pageContents: 3,
        settings: 10,
        socialNetworks: 2,
        products: 0,
        categories: 0,
        activities: 0,
        hasAvailability: false,
        images: 1,
      });
    });

    it('should return error without importing when validation fails', async () => {
      const validationResult: ImportValidationResult = {
        valid: false,
        error: 'Incompatible package version: 2.0',
      };
      mockImporter.validatePackage.mockResolvedValue(validationResult);

      const result = await useCase.execute(mockZipBuffer);

      expect(mockImporter.validatePackage).toHaveBeenCalledWith(mockZipBuffer);
      expect(mockImporter.importFromZip).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(result.error).toBe('Incompatible package version: 2.0');
    });

    it('should return default error message when validation error is undefined', async () => {
      const validationResult: ImportValidationResult = {
        valid: false,
      };
      mockImporter.validatePackage.mockResolvedValue(validationResult);

      const result = await useCase.execute(mockZipBuffer);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid package');
    });

    it('should propagate import errors', async () => {
      const mockPackage = createMockExportPackage();
      const validationResult: ImportValidationResult = {
        valid: true,
        package: mockPackage,
      };
      const importResult: ImportResult = {
        success: false,
        error: 'Database connection failed',
      };
      mockImporter.validatePackage.mockResolvedValue(validationResult);
      mockImporter.importFromZip.mockResolvedValue(importResult);

      const result = await useCase.execute(mockZipBuffer);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Database connection failed');
    });
  });
});
