import type { SocialNetworkType } from '@/domain/settings/value-objects/SocialNetworkType';

/**
 * Represents the overall loading state for a public page
 * Coordinates multiple data sources (menu, footer, page content)
 */
export interface PageLoadState {
  isLoading: boolean;
  isComplete: boolean;
  error: PageLoadError | null;
  menuLoaded: boolean;
  footerLoaded: boolean;
  contentLoaded: boolean;
  logoLoaded: boolean;
  startTime: number;
}

/**
 * Represents an error that occurred during data loading
 */
export interface PageLoadError {
  message: string;
  failedSources: Array<'menu' | 'footer' | 'content'>;
  isTimeout: boolean;
  timestamp: number;
}

/**
 * DTO for page content from API
 */
export interface PageContentDTO {
  id: string;
  menuItemId: string;
  content: string;
}

/**
 * DTO for menu item from API
 */
export interface MenuItemDTO {
  id: string;
  text: string;
  url: string;
  position: number;
}

/**
 * DTO for public logo from API
 */
export interface PublicLogoDTO {
  url: string;
  filename: string;
  format: string;
}

/**
 * DTO for custom loader from API
 */
export interface CustomLoaderDTO {
  type: 'gif' | 'video';
  url: string;
}

/**
 * Container for all successfully loaded data sources
 */
export interface PublicPageData {
  menuData: MenuItemDTO[];
  footerData: WebsiteSettingsData;
  pageContent: PageContentDTO;
  logo: PublicLogoDTO | null;
}

/**
 * Website settings data structure for footer
 */
export interface WebsiteSettingsData {
  name: string;
  icon?: string;
  themeColor?: string;
  backgroundColor?: string;
  font?: string;
  socialNetworks?: Array<{
    type: SocialNetworkType;
    url: string;
    label: string;
    icon: string;
  }>;
}

/**
 * Return type for usePublicPageData hook
 */
export interface UsePublicPageDataReturn {
  state: PageLoadState;
  data: PublicPageData | null;
  retry: () => void;
}
