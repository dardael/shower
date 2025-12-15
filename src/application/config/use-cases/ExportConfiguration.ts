import type { IConfigurationExporter } from '@/domain/config/ports/IConfigurationExporter';
import type { ExportPackage } from '@/domain/config/entities/ExportPackage';

/**
 * Use case for exporting configuration to a ZIP package.
 */
export class ExportConfiguration {
  constructor(private readonly exporter: IConfigurationExporter) {}

  /**
   * Execute the export and return the ZIP buffer.
   */
  async execute(): Promise<Buffer> {
    return this.exporter.exportToZip();
  }

  /**
   * Get a summary of what will be exported without creating the ZIP.
   */
  async getSummary(): Promise<ExportPackage> {
    return this.exporter.getExportSummary();
  }
}
