import {
  BaseImage,
  type ImageMetadata,
  type ImageConstraints,
} from './BaseImage';

export type IconMetadata = ImageMetadata;

const WEBSITE_ICON_CONSTRAINTS: ImageConstraints = {
  validExtensions: ['.ico', '.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp'],
  validFormats: ['ico', 'png', 'jpg', 'jpeg', 'svg', 'gif', 'webp'],
  validMimeTypes: [
    'image/x-icon',
    'image/vnd.microsoft.icon',
    'image/png',
    'image/jpeg',
    'image/svg+xml',
    'image/gif',
    'image/webp',
  ],
  maxSizeBytes: 5 * 1024 * 1024,
  entityName: 'Website icon',
};

export class WebsiteIcon extends BaseImage {
  constructor(url: string, metadata: IconMetadata | null | undefined) {
    super(url, metadata, WEBSITE_ICON_CONSTRAINTS);
  }

  equals(other: WebsiteIcon | null | undefined): boolean {
    return this.equalsBase(other);
  }

  isOptimalForFavicon(): boolean {
    const optimalFormats = ['ico', 'png', 'svg'];
    const optimalSize = 256 * 256;

    return (
      optimalFormats.includes(this._metadata.format.toLowerCase()) &&
      this._metadata.size <= optimalSize
    );
  }

  static createEmpty(): WebsiteIcon | null {
    return null;
  }
}
