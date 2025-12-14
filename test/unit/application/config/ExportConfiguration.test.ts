import { ExportConfiguration } from '@/application/config/use-cases/ExportConfiguration';
import type { IConfigurationExporter } from '@/domain/config/ports/IConfigurationExporter';
import { ExportPackage } from '@/domain/config/entities/ExportPackage';

describe('ExportConfiguration', () => {
  const mockExporter: jest.Mocked<IConfigurationExporter> = {
    exportToZip: jest.fn(),
    getExportSummary: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should call exporter and return buffer', async () => {
      const expectedBuffer = Buffer.from('test zip content');
      mockExporter.exportToZip.mockResolvedValue(expectedBuffer);

      const useCase = new ExportConfiguration(mockExporter);
      const result = await useCase.execute();

      expect(mockExporter.exportToZip).toHaveBeenCalledTimes(1);
      expect(result).toBe(expectedBuffer);
    });

    it('should propagate errors from exporter', async () => {
      const error = new Error('Export failed');
      mockExporter.exportToZip.mockRejectedValue(error);

      const useCase = new ExportConfiguration(mockExporter);

      await expect(useCase.execute()).rejects.toThrow('Export failed');
    });
  });

  describe('getSummary', () => {
    it('should return export package summary', async () => {
      const expectedPackage = ExportPackage.create({
        summary: {
          menuItemCount: 5,
          pageContentCount: 5,
          settingsCount: 10,
          socialNetworkCount: 3,
          imageCount: 20,
          totalSizeBytes: 1024000,
        },
      });
      mockExporter.getExportSummary.mockResolvedValue(expectedPackage);

      const useCase = new ExportConfiguration(mockExporter);
      const result = await useCase.getSummary();

      expect(mockExporter.getExportSummary).toHaveBeenCalledTimes(1);
      expect(result.summary.menuItemCount).toBe(5);
      expect(result.summary.imageCount).toBe(20);
    });
  });
});
