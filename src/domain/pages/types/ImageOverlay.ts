/**
 * Font size options for text overlay
 */
export type OverlayFontSize = 'small' | 'medium' | 'large' | 'extra-large';

/**
 * Vertical position options for text overlay
 */
export type OverlayPosition = 'top' | 'center' | 'bottom';

/**
 * Horizontal alignment options for text overlay
 */
export type OverlayAlign = 'left' | 'center' | 'right';

/**
 * Text overlay configuration interface
 */
export interface ImageTextOverlay {
  /** The text content to display */
  text: string;
  /** Text color in hex format (e.g., "#ffffff") */
  color: string;
  /** Google Font family name. Rendered with sans-serif fallback. */
  fontFamily: string;
  /** Font size preset */
  fontSize: OverlayFontSize;
  /** Vertical position on the image */
  position: OverlayPosition;
  /** Horizontal text alignment */
  align: OverlayAlign;
}

/**
 * Default overlay configuration
 */
export const DEFAULT_OVERLAY_CONFIG: Omit<ImageTextOverlay, 'text'> = {
  color: '#ffffff',
  fontFamily: 'Inter',
  fontSize: 'medium',
  position: 'center',
  align: 'center',
};

/**
 * Default text shown when adding a new overlay
 */
export const DEFAULT_OVERLAY_TEXT = 'Enter text...';

/**
 * Font size to pixel value mapping
 */
export const OVERLAY_FONT_SIZES: Record<OverlayFontSize, number> = {
  small: 14,
  medium: 18,
  large: 24,
  'extra-large': 32,
};

/**
 * Font size display labels
 */
export const OVERLAY_FONT_SIZE_LABELS: Record<OverlayFontSize, string> = {
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
  'extra-large': 'Extra Large',
};

/**
 * Position display labels
 */
export const OVERLAY_POSITION_LABELS: Record<OverlayPosition, string> = {
  top: 'Top',
  center: 'Center',
  bottom: 'Bottom',
};

/**
 * Alignment display labels
 */
export const OVERLAY_ALIGN_LABELS: Record<OverlayAlign, string> = {
  left: 'Left',
  center: 'Center',
  right: 'Right',
};
