import { ExportPackage } from '../entities/ExportPackage';

/**
 * Port interface for exporting configuration to a ZIP package.
 */
export interface IConfigurationExporter {
  /**
   * Export all configuration data and images to a ZIP buffer.
   * @returns Buffer containing the ZIP file
   */
  exportToZip(): Promise<Buffer>;

  /**
   * Get a summary of what will be exported without creating the ZIP.
   * @returns ExportPackage with summary data
   */
  getExportSummary(): Promise<ExportPackage>;
}
