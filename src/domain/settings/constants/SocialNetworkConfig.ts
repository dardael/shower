/**
 * Social network types enumeration
 */
export enum SocialNetworkType {
  INSTAGRAM = 'instagram',
  FACEBOOK = 'facebook',
  LINKEDIN = 'linkedin',
  EMAIL = 'email',
  PHONE = 'phone',
}

/**
 * Configuration constants for social networks
 * Centralizes label, icon, placeholder, and protocol information
 */
export const SOCIAL_NETWORK_CONFIG = {
  [SocialNetworkType.INSTAGRAM]: {
    label: 'Instagram',
    icon: 'FaInstagram',
    placeholder: 'https://instagram.com/username',
    protocol: 'https://',
  },
  [SocialNetworkType.FACEBOOK]: {
    label: 'Facebook',
    icon: 'FaFacebook',
    placeholder: 'https://facebook.com/page',
    protocol: 'https://',
  },
  [SocialNetworkType.LINKEDIN]: {
    label: 'LinkedIn',
    icon: 'FaLinkedin',
    placeholder: 'https://linkedin.com/in/profile',
    protocol: 'https://',
  },
  [SocialNetworkType.EMAIL]: {
    label: 'Email',
    icon: 'FaEnvelope',
    placeholder: 'mailto:contact@example.com',
    protocol: 'mailto:',
  },
  [SocialNetworkType.PHONE]: {
    label: 'Phone',
    icon: 'FaPhone',
    placeholder: 'tel:+1234567890',
    protocol: 'tel:',
  },
} as const;

/**
 * Type for social network configuration
 */
export type SocialNetworkConfig =
  (typeof SOCIAL_NETWORK_CONFIG)[SocialNetworkType];

/**
 * Validation constants for social networks
 */
export const VALIDATION_CONSTANTS = {
  MAX_LABEL_LENGTH: 50,
  MAX_URL_LENGTH: 2048,
  HTML_SPECIAL_CHARS_PATTERN: /<|>|&|"|'/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_PATTERN: /^\+?[\d\s\-\(\)]+$/,
  URL_PATTERN: /^https?:\/\/.+/,
} as const;
