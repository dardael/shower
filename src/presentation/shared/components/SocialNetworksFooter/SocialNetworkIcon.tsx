'use client';

import React from 'react';
import { Box } from '@chakra-ui/react';
import {
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
} from 'react-icons/fa';
import type { SocialNetworkIconProps } from './types';

/**
 * Icon mapping from social network type to React Icons component
 */
const ICON_MAP = {
  instagram: FaInstagram,
  facebook: FaFacebook,
  linkedin: FaLinkedin,
  email: FaEnvelope,
  phone: FaPhone,
} as const;

/**
 * Brand colors for social networks
 */
const BRAND_COLORS = {
  instagram: '#E4405F',
  facebook: '#1877F2',
  linkedin: '#0A66C2',
  email: undefined, // Use theme color
  phone: undefined, // Use theme color
} as const;

/**
 * SocialNetworkIcon component
 * Displays the appropriate icon for each social network type
 * Uses brand colors for social media platforms, theme colors for email/phone
 */
export function SocialNetworkIcon({
  type,
  size,
  color,
}: SocialNetworkIconProps) {
  const IconComponent = ICON_MAP[type];

  if (!IconComponent) {
    // Fallback for unknown types
    return null;
  }

  // Use brand color for social media, theme color for email/phone, or custom color
  const iconColor = color || BRAND_COLORS[type] || 'fg';

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      color={iconColor}
      data-testid={`social-network-icon-${type}`}
    >
      <IconComponent size={size} />
    </Box>
  );
}
