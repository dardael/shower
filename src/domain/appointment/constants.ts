export const REQUIRED_FIELDS = {
  MANDATORY_FIELDS: ['name', 'email'] as const,
  OPTIONAL_FIELDS: ['phone', 'address', 'custom'] as const,
} as const;

export const REMINDER_SETTINGS = {
  DEFAULT_HOURS_BEFORE: 24,
} as const;
