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
] as const;

export type ThemeColorToken = (typeof THEME_COLOR_PALETTE)[number];

/**
 * Default theme color when no custom color is set
 */
export const DEFAULT_THEME_COLOR: ThemeColorToken = 'blue';

/**
 * Validates if a color token is in the predefined palette
 */
export function isValidThemeColor(color: string): color is ThemeColorToken {
  return THEME_COLOR_PALETTE.includes(color as ThemeColorToken);
}

/**
 * Gets all available theme color options for UI display
 */
export function getAvailableThemeColors(): ThemeColorToken[] {
  return [...THEME_COLOR_PALETTE];
}
