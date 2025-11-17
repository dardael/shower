export interface ImageMetadata {
  filename: string;
  originalName: string;
  size: number;
  format: string;
  mimeType: string;
  uploadedAt: Date;
}

export interface ImageData {
  url: string;
  filename: string;
  size: number;
  format: string;
}

export interface ValidationError {
  type: 'SIZE' | 'FORMAT' | 'UPLOAD_FAILED';
  message: string;
  details?: Record<string, unknown>;
}

export type ImageState =
  | 'empty'
  | 'uploading'
  | 'preview'
  | 'error'
  | 'loading';

export interface ImageManagerConfig {
  acceptedFormats: string[];
  maxFileSize: number; // in bytes
  previewSize?: { width: string; height: string };
  aspectRatio?: string;
}

export interface ImageManagerLabels {
  uploadLabel: string;
  uploadHint: string;
  replaceButton: string;
  deleteButton: string;
  dragDropText: string;
  sizeLimitText: string;
  formatText: string;
}

export interface ImageManagerProps {
  // Current image state
  currentImage?: ImageData | null;

  // Configuration
  config: ImageManagerConfig;

  // Labels and text
  labels: ImageManagerLabels;

  // Callbacks
  onImageUpload: (file: File, metadata: ImageMetadata) => Promise<void>;
  onImageDelete: () => Promise<void>;
  onImageReplace: (file: File, metadata: ImageMetadata) => Promise<void>;
  onValidationError: (error: ValidationError) => void;

  // State and behavior
  disabled?: boolean;
  loading?: boolean;
  showFileSize?: boolean;
  showFormatInfo?: boolean;
  allowDelete?: boolean;
  allowReplace?: boolean;
  disableSuccessToast?: boolean; // Disable built-in success toast
}
