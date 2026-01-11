import { ExportPackage } from '../entities/ExportPackage';

/**
 * Result of import validation/preview.
 */
export interface ImportValidationResult {
  valid: boolean;
  package?: ExportPackage;
  error?: string;
  details?: {
    missingFiles?: string[];
    corruptedFiles?: string[];
    packageVersion?: string;
    currentVersion?: string;
    suggestion?: string;
  };
}

/**
 * Result of import operation.
 */
export interface ImportResult {
  success: boolean;
  error?: string;
  restored?: boolean;
  message?: string;
  imported?: {
    menuItems: number;
    pageContents: number;
    settings: number;
    socialNetworks: number;
    products: number;
    categories: number;
    activities: number;
    hasAvailability: boolean;
    images: number;
  };
}

/**
 * Port interface for importing configuration from a ZIP package.
 */
export interface IConfigurationImporter {
  /**
   * Validate and preview a ZIP package without applying changes.
   * @param zipBuffer The ZIP file buffer to validate
   * @returns Validation result with package summary if valid
   */
  validatePackage(zipBuffer: Buffer): Promise<ImportValidationResult>;

  /**
   * Import configuration from a validated ZIP package.
   * Creates backup before import, restores on failure.
   * @param zipBuffer The ZIP file buffer to import
   * @returns Import result with counts or error
   */
  importFromZip(zipBuffer: Buffer): Promise<ImportResult>;
}
