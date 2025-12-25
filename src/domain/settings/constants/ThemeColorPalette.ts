/**
 * Predefined palette of available Chakra UI color tokens for theme selection.
 * These colors correspond to existing semantic tokens in the theme configuration.
 */
export const THEME_COLOR_PALETTE = [
  'blue', // Default Chakra UI color
  'red', // Accent/Warning colors
  'green', // Success colors
  'purple', // Creative/Premium colors
  'orange', // Energetic colors
  'teal', // Modern/Calm colors
  'pink', // Soft/Friendly colors
  'cyan', // Tech/Professional colors
  'beige', // Warm neutral colors
  'cream', // Soft warm colors
  'gold', // Warm golden colors (#eeb252)
  'sand', // Soft sand colors (#f2e8de)
  'taupe', // Warm taupe colors (#e2cbac)
  'white', // Pure white background (#ffffff)
] as const;

export type ThemeColorToken = (typeof THEME_COLOR_PALETTE)[number];

/**
 * Default theme color when no custom color is set
 */
export const DEFAULT_THEME_COLOR: ThemeColorToken = 'blue';

/**
 * Validates if a color token is in predefined palette with enhanced runtime validation
 */
export function isValidThemeColor(color: unknown): color is ThemeColorToken {
  // Type check: must be a string
  if (typeof color !== 'string') {
    return false;
  }

  // Null/undefined check (redundant with typeof but explicit for clarity)
  if (color === null || color === undefined) {
    return false;
  }

  // Length validation: reasonable length for color names
  if (color.length === 0 || color.length > 20) {
    return false;
  }

  // Character validation: only allow lowercase letters, no special characters or spaces
  if (!/^[a-z]+$/.test(color)) {
    return false;
  }

  // Case normalization: convert to lowercase for validation
  const normalizedColor = color.toLowerCase();

  // Palette validation: check against predefined palette
  return THEME_COLOR_PALETTE.includes(normalizedColor as ThemeColorToken);
}

/**
 * Type guard to validate theme color request body structure
 */
export function isValidThemeColorRequest(
  body: unknown
): body is { themeColor: string } {
  // Must be an object
  if (typeof body !== 'object' || body === null) {
    return false;
  }

  // Must have themeColor property
  if (!('themeColor' in body)) {
    return false;
  }

  // themeColor must be a string
  const themeColor = (body as { themeColor: unknown }).themeColor;
  return typeof themeColor === 'string';
}

/**
 * Type guard to validate complete theme color request with color validation
 */
export function isValidThemeColorRequestWithColor(
  body: unknown
): body is { themeColor: ThemeColorToken } {
  if (!isValidThemeColorRequest(body)) {
    return false;
  }

  return isValidThemeColor(body.themeColor);
}

/**
 * Gets all available theme color options for UI display
 */
export function getAvailableThemeColors(): ThemeColorToken[] {
  return [...THEME_COLOR_PALETTE];
}

/**
 * Gets formatted error message for invalid theme colors
 */
export function getThemeColorErrorMessage(): string {
  return `Invalid theme color provided. Must be one of: ${THEME_COLOR_PALETTE.join(', ')}`;
}
