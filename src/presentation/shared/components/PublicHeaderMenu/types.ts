import type { ThemeColorToken } from '@/domain/settings/constants/ThemeColorPalette';

/**
 * Public menu item data structure for API response
 */
export interface PublicMenuItem {
  id: string;
  text: string;
  position: number;
}

/**
 * Props for PublicHeaderMenuItem component
 */
export interface PublicHeaderMenuItemProps {
  text: string;
}

/**
 * Props for PublicHeaderMenu component
 */
export interface PublicHeaderMenuProps {
  menuItems?: PublicMenuItem[];
  colorPalette?: ThemeColorToken;
}
