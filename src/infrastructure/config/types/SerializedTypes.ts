import type { IIconMetadata } from '@/domain/settings/types/IconMetadata';

/**
 * Serialized representation of a menu item for export/import.
 */
export interface SerializedMenuItem {
  id: string;
  text: string;
  url: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Serialized representation of page content for export/import.
 */
export interface SerializedPageContent {
  id: string;
  menuItemId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Serialized representation of a website setting for export/import.
 */
export interface SerializedSetting {
  key: string;
  value: string | { url: string; metadata?: IIconMetadata } | null;
}

/**
 * Serialized representation of a social network for export/import.
 */
export interface SerializedSocialNetwork {
  id?: string;
  type: string;
  url: string;
  label: string;
  enabled: boolean;
}
