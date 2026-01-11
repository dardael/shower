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
  // Appointment Module
  APPOINTMENT_MODULE_ENABLED: 'appointment-module-enabled',
  // Appointment Email Templates
  EMAIL_TEMPLATE_APPOINTMENT_CONFIRMATION_SUBJECT:
    'email-template-appointment-confirmation-subject',
  EMAIL_TEMPLATE_APPOINTMENT_CONFIRMATION_BODY:
    'email-template-appointment-confirmation-body',
  EMAIL_TEMPLATE_APPOINTMENT_CONFIRMATION_ENABLED:
    'email-template-appointment-confirmation-enabled',
  EMAIL_TEMPLATE_APPOINTMENT_REMINDER_SUBJECT:
    'email-template-appointment-reminder-subject',
  EMAIL_TEMPLATE_APPOINTMENT_REMINDER_BODY:
    'email-template-appointment-reminder-body',
  EMAIL_TEMPLATE_APPOINTMENT_REMINDER_ENABLED:
    'email-template-appointment-reminder-enabled',
  EMAIL_TEMPLATE_APPOINTMENT_CANCELLATION_SUBJECT:
    'email-template-appointment-cancellation-subject',
  EMAIL_TEMPLATE_APPOINTMENT_CANCELLATION_BODY:
    'email-template-appointment-cancellation-body',
  EMAIL_TEMPLATE_APPOINTMENT_CANCELLATION_ENABLED:
    'email-template-appointment-cancellation-enabled',
  EMAIL_TEMPLATE_APPOINTMENT_ADMIN_NEW_SUBJECT:
    'email-template-appointment-admin-new-subject',
  EMAIL_TEMPLATE_APPOINTMENT_ADMIN_NEW_BODY:
    'email-template-appointment-admin-new-body',
  EMAIL_TEMPLATE_APPOINTMENT_ADMIN_NEW_ENABLED:
    'email-template-appointment-admin-new-enabled',
  EMAIL_TEMPLATE_APPOINTMENT_ADMIN_CONFIRMATION_SUBJECT:
    'email-template-appointment-admin-confirmation-subject',
  EMAIL_TEMPLATE_APPOINTMENT_ADMIN_CONFIRMATION_BODY:
    'email-template-appointment-admin-confirmation-body',
  EMAIL_TEMPLATE_APPOINTMENT_ADMIN_CONFIRMATION_ENABLED:
    'email-template-appointment-admin-confirmation-enabled',
} as const;

export const VALID_SETTING_KEY_VALUES = Object.values(
  VALID_SETTING_KEYS
) as readonly string[];

export const CUSTOM_LOADER_MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
