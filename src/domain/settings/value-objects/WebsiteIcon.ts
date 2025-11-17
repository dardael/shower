export interface IconMetadata {
  filename: string;
  originalName: string;
  size: number;
  format: string;
  mimeType: string;
  uploadedAt: Date;
}

export class WebsiteIcon {
  private readonly _url: string;
  private readonly _metadata: IconMetadata;

  constructor(url: string, metadata: IconMetadata | null | undefined) {
    this.validateUrl(url);
    if (!metadata) {
      throw new Error('Website icon metadata cannot be null');
    }
    this.validateMetadata(metadata);
    this._url = url.trim();
    this._metadata = { ...metadata };
  }

  private validateUrl(url: string): void {
    if (!url || url.trim().length === 0) {
      throw new Error('Website icon URL cannot be empty');
    }

    const trimmedUrl = url.trim();

    // Validate URL format
    try {
      new URL(trimmedUrl);
    } catch {
      throw new Error('Website icon URL must be a valid URL');
    }

    // Validate file extension
    const validExtensions = [
      '.ico',
      '.png',
      '.jpg',
      '.jpeg',
      '.svg',
      '.gif',
      '.webp',
    ];
    const hasValidExtension = validExtensions.some((ext) =>
      trimmedUrl.toLowerCase().endsWith(ext)
    );

    if (!hasValidExtension) {
      throw new Error(
        `Website icon must have a valid extension: ${validExtensions.join(', ')}`
      );
    }
  }

  private validateMetadata(metadata: IconMetadata | null | undefined): void {
    if (!metadata) {
      throw new Error('Website icon metadata cannot be null');
    }

    // Validate filename
    if (!metadata.filename || metadata.filename.trim().length === 0) {
      throw new Error('Website icon filename cannot be empty');
    }

    // Validate original name
    if (!metadata.originalName || metadata.originalName.trim().length === 0) {
      throw new Error('Website icon original name cannot be empty');
    }

    // Validate file size (max 5MB for favicon)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (metadata.size <= 0) {
      throw new Error('Website icon size must be greater than 0');
    }
    if (metadata.size > maxSize) {
      throw new Error(
        `Website icon size cannot exceed ${maxSize / 1024 / 1024}MB`
      );
    }

    // Validate format
    const validFormats = ['ico', 'png', 'jpg', 'jpeg', 'svg', 'gif', 'webp'];
    if (
      !metadata.format ||
      !validFormats.includes(metadata.format.toLowerCase())
    ) {
      throw new Error(
        `Website icon format must be one of: ${validFormats.join(', ')}`
      );
    }

    // Validate MIME type
    const validMimeTypes = [
      'image/x-icon',
      'image/vnd.microsoft.icon',
      'image/png',
      'image/jpeg',
      'image/svg+xml',
      'image/gif',
      'image/webp',
    ];
    if (!metadata.mimeType || !validMimeTypes.includes(metadata.mimeType)) {
      throw new Error(
        `Website icon MIME type must be one of: ${validMimeTypes.join(', ')}`
      );
    }

    // Validate upload date
    if (!metadata.uploadedAt || !(metadata.uploadedAt instanceof Date)) {
      throw new Error('Website icon upload date must be a valid date');
    }
    if (metadata.uploadedAt > new Date()) {
      throw new Error('Website icon upload date cannot be in the future');
    }
  }

  get url(): string {
    return this._url;
  }

  get metadata(): IconMetadata {
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

  equals(other: WebsiteIcon | null | undefined): boolean {
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

  isOptimalForFavicon(): boolean {
    // Check if icon is optimal for favicon usage
    const optimalFormats = ['ico', 'png', 'svg'];
    const optimalSize = 256 * 256; // 256x256 pixels max for good quality

    return (
      optimalFormats.includes(this._metadata.format.toLowerCase()) &&
      this._metadata.size <= optimalSize
    );
  }

  static createEmpty(): WebsiteIcon | null {
    // Factory method to represent no icon
    return null;
  }
}
