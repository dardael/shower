import type { ThemeColorToken } from '@/domain/settings/constants/ThemeColorPalette';

/**
 * Public menu item data structure for API response
 */
export interface PublicMenuItem {
  id: string;
  text: string;
  url: string;
  position: number;
}

/**
 * Public logo data structure for API response
 */
export interface PublicLogo {
  url: string;
  filename: string;
  format: string;
}

/**
 * Props for PublicHeaderMenuItem component
 */
export interface PublicHeaderMenuItemProps {
  text: string;
  url: string;
  textColor?: string;
}

/**
 * Props for PublicHeaderMenu component
 */
export interface PublicHeaderMenuProps {
  menuItems?: PublicMenuItem[];
  logo?: PublicLogo | null;
  colorPalette?: ThemeColorToken;
  transparent?: boolean;
}
