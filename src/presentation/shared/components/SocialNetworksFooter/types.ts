import { SocialNetworkType } from '@/domain/settings/value-objects/SocialNetworkType';

/**
 * Public social network data structure for API response
 */
export interface PublicSocialNetwork {
  type: SocialNetworkType;
  url: string;
  label: string;
  icon: string;
}

/**
 * Props for SocialNetworkIcon component
 */
export interface SocialNetworkIconProps {
  type: SocialNetworkType;
  size: number;
  color?: string;
}

/**
 * Props for SocialNetworkItem component
 */
export interface SocialNetworkItemProps {
  type: SocialNetworkType;
  url: string;
  label: string;
  icon: string;
}

/**
 * Props for SocialNetworksFooter component
 */
export interface SocialNetworksFooterProps {
  /** Array of social networks to display */
  socialNetworks?: PublicSocialNetwork[];
  /** Optional title for the footer section */
  title?: string;
  /** Maximum number of columns in the grid */
  maxColumns?: { base: number; md?: number; lg?: number; xl?: number };
  /** Spacing between grid items */
  spacing?: number;
  /** Whether to show the title section */
  showTitle?: boolean;
  /** Maximum number of items to display */
  maxItems?: number;
}
