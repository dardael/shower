import { PackageSummary } from './PackageSummary';
import { PackageVersion } from '../value-objects/PackageVersion';

/**
 * ExportPackage entity representing the metadata and structure of an export package.
 */
export class ExportPackage {
  private constructor(
    public readonly schemaVersion: PackageVersion,
    public readonly exportDate: Date,
    public readonly sourceIdentifier: string,
    public readonly summary: PackageSummary
  ) {}

  static create(params: {
    schemaVersion?: PackageVersion;
    exportDate?: Date;
    sourceIdentifier?: string;
    summary: PackageSummary;
  }): ExportPackage {
    return new ExportPackage(
      params.schemaVersion ?? PackageVersion.CURRENT,
      params.exportDate ?? new Date(),
      params.sourceIdentifier ?? 'unknown',
      params.summary
    );
  }

  static fromManifest(manifest: ManifestData): ExportPackage {
    return new ExportPackage(
      PackageVersion.fromString(manifest.schemaVersion),
      new Date(manifest.exportDate),
      manifest.sourceIdentifier,
      manifest.summary
    );
  }

  toManifest(): ManifestData {
    return {
      schemaVersion: this.schemaVersion.toString(),
      exportDate: this.exportDate.toISOString(),
      sourceIdentifier: this.sourceIdentifier,
      summary: this.summary,
    };
  }

  isCompatibleWithCurrent(): boolean {
    return this.schemaVersion.isCompatibleWith(PackageVersion.CURRENT);
  }
}

/**
 * Raw manifest.json structure in the ZIP package.
 */
export interface ManifestData {
  schemaVersion: string;
  exportDate: string;
  sourceIdentifier: string;
  summary: PackageSummary;
}
