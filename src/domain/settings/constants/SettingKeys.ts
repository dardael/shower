export const VALID_SETTING_KEYS = {
  WEBSITE_NAME: 'website-name',
  WEBSITE_ICON: 'website-icon',
  THEME_COLOR: 'theme-color',
  HEADER_LOGO: 'header-logo',
  WEBSITE_FONT: 'website-font',
  BACKGROUND_COLOR: 'background-color',
  THEME_MODE: 'theme-mode',
} as const;

export const VALID_SETTING_KEY_VALUES = Object.values(
  VALID_SETTING_KEYS
) as readonly string[];
