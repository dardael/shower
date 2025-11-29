import {
  BaseImage,
  type ImageMetadata,
  type ImageConstraints,
} from './BaseImage';

export type LogoMetadata = ImageMetadata;

const HEADER_LOGO_CONSTRAINTS: ImageConstraints = {
  validExtensions: ['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp'],
  validFormats: ['png', 'jpg', 'jpeg', 'svg', 'gif', 'webp'],
  validMimeTypes: [
    'image/png',
    'image/jpeg',
    'image/svg+xml',
    'image/gif',
    'image/webp',
  ],
  maxSizeBytes: 2 * 1024 * 1024,
  entityName: 'Header logo',
};

export class HeaderLogo extends BaseImage {
  constructor(url: string, metadata: LogoMetadata | null | undefined) {
    super(url, metadata, HEADER_LOGO_CONSTRAINTS);
  }

  equals(other: HeaderLogo | null | undefined): boolean {
    return this.equalsBase(other);
  }

  static createEmpty(): HeaderLogo | null {
    return null;
  }
}
