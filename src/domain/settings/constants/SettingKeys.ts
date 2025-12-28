export const VALID_SETTING_KEYS = {
  WEBSITE_NAME: 'website-name',
  WEBSITE_ICON: 'website-icon',
  THEME_COLOR: 'theme-color',
  HEADER_LOGO: 'header-logo',
  WEBSITE_FONT: 'website-font',
  BACKGROUND_COLOR: 'background-color',
  THEME_MODE: 'theme-mode',
  CUSTOM_LOADER: 'custom-loader',
  SCHEDULED_RESTART: 'scheduled-restart',
  SELLING_ENABLED: 'selling-enabled',
  HEADER_MENU_TEXT_COLOR: 'header-menu-text-color',
  LOADER_BACKGROUND_COLOR: 'loader-background-color',
  // SMTP Configuration
  EMAIL_SMTP_HOST: 'email-smtp-host',
  EMAIL_SMTP_PORT: 'email-smtp-port',
  EMAIL_SMTP_USERNAME: 'email-smtp-username',
  EMAIL_SMTP_PASSWORD: 'email-smtp-password',
  EMAIL_SMTP_ENCRYPTION: 'email-smtp-encryption',
  // Email Addresses
  EMAIL_SENDER_ADDRESS: 'email-sender-address',
  EMAIL_ADMIN_ADDRESS: 'email-admin-address',
  // Admin Template
  EMAIL_TEMPLATE_ADMIN_SUBJECT: 'email-template-admin-subject',
  EMAIL_TEMPLATE_ADMIN_BODY: 'email-template-admin-body',
  EMAIL_TEMPLATE_ADMIN_ENABLED: 'email-template-admin-enabled',
  // Purchaser Template
  EMAIL_TEMPLATE_PURCHASER_SUBJECT: 'email-template-purchaser-subject',
  EMAIL_TEMPLATE_PURCHASER_BODY: 'email-template-purchaser-body',
  EMAIL_TEMPLATE_PURCHASER_ENABLED: 'email-template-purchaser-enabled',
} as const;

export const VALID_SETTING_KEY_VALUES = Object.values(
  VALID_SETTING_KEYS
) as readonly string[];

export const CUSTOM_LOADER_MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
