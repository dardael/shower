import { ExportConfiguration } from '@/application/config/use-cases/ExportConfiguration';
import { ImportConfiguration } from '@/application/config/use-cases/ImportConfiguration';
import type { IConfigurationExporter } from '@/domain/config/ports/IConfigurationExporter';
import type { IConfigurationImporter } from '@/domain/config/ports/IConfigurationImporter';
import type { ExportPackage } from '@/domain/config/entities/ExportPackage';
import type {
  ImportResult,
  ImportValidationResult,
} from '@/domain/config/ports/IConfigurationImporter';

/**
 * ConfigurationService orchestrates export/import operations.
 * Provides a simpler interface for the presentation layer.
 */
export class ConfigurationService {
  private readonly exportUseCase: ExportConfiguration;
  private readonly importUseCase: ImportConfiguration | null;

  constructor(
    exporter: IConfigurationExporter,
    importer?: IConfigurationImporter
  ) {
    this.exportUseCase = new ExportConfiguration(exporter);
    this.importUseCase = importer ? new ImportConfiguration(importer) : null;
  }

  /**
   * Export all configuration to a ZIP buffer.
   */
  async exportConfiguration(): Promise<Buffer> {
    return this.exportUseCase.execute();
  }

  /**
   * Get export summary without creating the ZIP.
   */
  async getExportSummary(): Promise<ExportPackage> {
    return this.exportUseCase.getSummary();
  }

  /**
   * Preview import without applying changes.
   */
  async previewImport(zipBuffer: Buffer): Promise<ImportValidationResult> {
    if (!this.importUseCase) {
      throw new Error('Import functionality not configured');
    }
    return this.importUseCase.preview(zipBuffer);
  }

  /**
   * Import configuration from a ZIP buffer.
   */
  async importConfiguration(zipBuffer: Buffer): Promise<ImportResult> {
    if (!this.importUseCase) {
      throw new Error('Import functionality not configured');
    }
    return this.importUseCase.execute(zipBuffer);
  }
}
