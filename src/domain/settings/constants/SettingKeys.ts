export const VALID_SETTING_KEYS = {
  WEBSITE_NAME: 'website-name',
  WEBSITE_ICON: 'website-icon',
  THEME_COLOR: 'theme-color',
} as const;

export const VALID_SETTING_KEY_VALUES = Object.values(
  VALID_SETTING_KEYS
) as readonly string[];
