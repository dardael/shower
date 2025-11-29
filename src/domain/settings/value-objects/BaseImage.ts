export interface ImageMetadata {
  filename: string;
  originalName: string;
  size: number;
  format: string;
  mimeType: string;
  uploadedAt: Date;
}

export interface ImageConstraints {
  validExtensions: string[];
  validFormats: string[];
  validMimeTypes: string[];
  maxSizeBytes: number;
  entityName: string;
}

export abstract class BaseImage {
  protected readonly _url: string;
  protected readonly _metadata: ImageMetadata;

  constructor(
    url: string,
    metadata: ImageMetadata | null | undefined,
    constraints: ImageConstraints
  ) {
    this.validateUrl(url, constraints);
    if (!metadata) {
      throw new Error(`${constraints.entityName} metadata cannot be null`);
    }
    this.validateMetadata(metadata, constraints);
    this._url = url.trim();
    this._metadata = { ...metadata };
  }

  private validateUrl(url: string, constraints: ImageConstraints): void {
    if (!url || url.trim().length === 0) {
      throw new Error(`${constraints.entityName} URL cannot be empty`);
    }

    const trimmedUrl = url.trim();

    try {
      new URL(trimmedUrl);
    } catch {
      throw new Error(`${constraints.entityName} URL must be a valid URL`);
    }

    const hasValidExtension = constraints.validExtensions.some((ext) =>
      trimmedUrl.toLowerCase().endsWith(ext)
    );

    if (!hasValidExtension) {
      throw new Error(
        `${constraints.entityName} must have a valid extension: ${constraints.validExtensions.join(', ')}`
      );
    }
  }

  private validateMetadata(
    metadata: ImageMetadata,
    constraints: ImageConstraints
  ): void {
    if (!metadata.filename || metadata.filename.trim().length === 0) {
      throw new Error(`${constraints.entityName} filename cannot be empty`);
    }

    if (!metadata.originalName || metadata.originalName.trim().length === 0) {
      throw new Error(
        `${constraints.entityName} original name cannot be empty`
      );
    }

    if (metadata.size <= 0) {
      throw new Error(`${constraints.entityName} size must be greater than 0`);
    }
    if (metadata.size > constraints.maxSizeBytes) {
      throw new Error(
        `${constraints.entityName} size cannot exceed ${constraints.maxSizeBytes / 1024 / 1024}MB`
      );
    }

    if (
      !metadata.format ||
      !constraints.validFormats.includes(metadata.format.toLowerCase())
    ) {
      throw new Error(
        `${constraints.entityName} format must be one of: ${constraints.validFormats.join(', ')}`
      );
    }

    if (
      !metadata.mimeType ||
      !constraints.validMimeTypes.includes(metadata.mimeType)
    ) {
      throw new Error(
        `${constraints.entityName} MIME type must be one of: ${constraints.validMimeTypes.join(', ')}`
      );
    }

    if (!metadata.uploadedAt || !(metadata.uploadedAt instanceof Date)) {
      throw new Error(
        `${constraints.entityName} upload date must be a valid date`
      );
    }
    if (metadata.uploadedAt > new Date()) {
      throw new Error(
        `${constraints.entityName} upload date cannot be in the future`
      );
    }
  }

  get url(): string {
    return this._url;
  }

  get metadata(): ImageMetadata {
    return { ...this._metadata };
  }

  get filename(): string {
    return this._metadata.filename;
  }

  get originalName(): string {
    return this._metadata.originalName;
  }

  get size(): number {
    return this._metadata.size;
  }

  get format(): string {
    return this._metadata.format;
  }

  get mimeType(): string {
    return this._metadata.mimeType;
  }

  get uploadedAt(): Date {
    return this._metadata.uploadedAt;
  }

  protected equalsBase(other: BaseImage | null | undefined): boolean {
    if (!other) {
      return false;
    }

    return (
      this._url === other._url &&
      this._metadata.filename === other._metadata.filename &&
      this._metadata.size === other._metadata.size &&
      this._metadata.format === other._metadata.format
    );
  }
}
