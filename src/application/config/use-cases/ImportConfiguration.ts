import {
  IConfigurationImporter,
  ImportResult,
  ImportValidationResult,
} from '@/domain/config/ports/IConfigurationImporter';

export interface IImportConfiguration {
  preview(zipBuffer: Buffer): Promise<ImportValidationResult>;
  execute(zipBuffer: Buffer): Promise<ImportResult>;
}

export class ImportConfiguration implements IImportConfiguration {
  constructor(private readonly importer: IConfigurationImporter) {}

  async preview(zipBuffer: Buffer): Promise<ImportValidationResult> {
    return this.importer.validatePackage(zipBuffer);
  }

  async execute(zipBuffer: Buffer): Promise<ImportResult> {
    const validation = await this.importer.validatePackage(zipBuffer);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error ?? 'Invalid package',
      };
    }

    return this.importer.importFromZip(zipBuffer);
  }
}
