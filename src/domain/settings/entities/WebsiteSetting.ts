import { WebsiteName } from '@/domain/settings/value-objects/WebsiteName';
import { WebsiteIcon } from '@/domain/settings/value-objects/WebsiteIcon';
import { ThemeColor } from '@/domain/settings/value-objects/ThemeColor';
import { BackgroundColor } from '@/domain/settings/value-objects/BackgroundColor';
import { WebsiteFont } from '@/domain/settings/value-objects/WebsiteFont';
import { IIconMetadata } from '@/domain/settings/types/IconMetadata';
import { SellingEnabled } from '@/domain/settings/value-objects/SellingEnabled';
import {
  VALID_SETTING_KEYS,
  VALID_SETTING_KEY_VALUES,
} from '@/domain/settings/constants/SettingKeys';

export interface ICustomLoaderMetadata {
  type: 'gif' | 'video';
  filename: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

export type SettingValue =
  | string
  | { url: string; metadata: IIconMetadata }
  | { url: string; metadata: ICustomLoaderMetadata }
  | null;

export class WebsiteSetting {
  private readonly _key: string;
  private _value: SettingValue;

  constructor(key: string, value: SettingValue) {
    this._key = key;
    this._value = value;
  }

  get key(): string {
    return this._key;
  }

  get value(): SettingValue {
    return this._value;
  }

  /**
   * Updates the value of the setting
   * @param newValue - The new value to set
   */
  updateValue(newValue: SettingValue): void {
    this._value = newValue;
  }

  getValueAsString(): string {
    if (typeof this._value === 'string') {
      return this._value;
    }
    throw new Error('Value is not a string');
  }

  getValueAsIcon(): { url: string; metadata: IIconMetadata } | null {
    return this.getValueAsImage();
  }

  getValueAsImage(): { url: string; metadata: IIconMetadata } | null {
    if (
      this._value === null ||
      (typeof this._value === 'object' && 'url' in this._value)
    ) {
      return this._value as { url: string; metadata: IIconMetadata } | null;
    }
    throw new Error('Value is not an image object');
  }

  isString(): boolean {
    return typeof this._value === 'string';
  }

  isIcon(): boolean {
    return (
      this._value === null ||
      (typeof this._value === 'object' && 'url' in this._value)
    );
  }

  equals(other: WebsiteSetting | null | undefined): boolean {
    if (!other) {
      return false;
    }

    if (this._key !== other._key) {
      return false;
    }

    // Handle different value types more reliably than JSON.stringify
    if (this._value === other._value) {
      return true;
    }

    // Both null
    if (this._value === null && other._value === null) {
      return true;
    }

    // Both strings
    if (typeof this._value === 'string' && typeof other._value === 'string') {
      return this._value === other._value;
    }

    // Both objects (icon type)
    if (
      typeof this._value === 'object' &&
      typeof other._value === 'object' &&
      this._value !== null &&
      other._value !== null &&
      'url' in this._value &&
      'url' in other._value &&
      'metadata' in this._value &&
      'metadata' in other._value
    ) {
      const thisIcon = this._value as { url: string; metadata: unknown };
      const otherIcon = other._value as { url: string; metadata: unknown };
      return (
        thisIcon.url === otherIcon.url &&
        JSON.stringify(thisIcon.metadata) === JSON.stringify(otherIcon.metadata)
      );
    }

    return false;
  }

  // Factory methods for different setting types
  static createWebsiteName(name: WebsiteName): WebsiteSetting {
    return new WebsiteSetting(VALID_SETTING_KEYS.WEBSITE_NAME, name.value);
  }

  static createWebsiteIcon(icon: WebsiteIcon | null): WebsiteSetting {
    if (!icon) {
      return new WebsiteSetting(VALID_SETTING_KEYS.WEBSITE_ICON, null);
    }
    return new WebsiteSetting(VALID_SETTING_KEYS.WEBSITE_ICON, {
      url: icon.url,
      metadata: icon.metadata,
    });
  }

  static createThemeColor(themeColor: ThemeColor): WebsiteSetting {
    return new WebsiteSetting(VALID_SETTING_KEYS.THEME_COLOR, themeColor.value);
  }

  static createWebsiteFont(websiteFont: WebsiteFont): WebsiteSetting {
    return new WebsiteSetting(
      VALID_SETTING_KEYS.WEBSITE_FONT,
      websiteFont.value
    );
  }

  static createBackgroundColor(
    backgroundColor: BackgroundColor
  ): WebsiteSetting {
    return new WebsiteSetting(
      VALID_SETTING_KEYS.BACKGROUND_COLOR,
      backgroundColor.value
    );
  }

  // Type validation methods
  static isValidWebsiteNameKey(key: string): boolean {
    return key === VALID_SETTING_KEYS.WEBSITE_NAME;
  }

  static isValidWebsiteIconKey(key: string): boolean {
    return key === VALID_SETTING_KEYS.WEBSITE_ICON;
  }

  static isValidThemeColorKey(key: string): boolean {
    return key === VALID_SETTING_KEYS.THEME_COLOR;
  }

  static isValidWebsiteFontKey(key: string): boolean {
    return key === VALID_SETTING_KEYS.WEBSITE_FONT;
  }

  static isValidBackgroundColorKey(key: string): boolean {
    return key === VALID_SETTING_KEYS.BACKGROUND_COLOR;
  }

  static isValidSettingKey(key: string): boolean {
    return VALID_SETTING_KEY_VALUES.includes(key);
  }

  // Default value creation
  static createDefaultWebsiteName(): WebsiteSetting {
    return new WebsiteSetting(VALID_SETTING_KEYS.WEBSITE_NAME, 'Shower');
  }

  static createDefaultWebsiteIcon(): WebsiteSetting {
    return new WebsiteSetting(VALID_SETTING_KEYS.WEBSITE_ICON, null);
  }

  static createDefaultThemeColor(): WebsiteSetting {
    return new WebsiteSetting(VALID_SETTING_KEYS.THEME_COLOR, 'blue');
  }

  static createDefaultWebsiteFont(): WebsiteSetting {
    return new WebsiteSetting(VALID_SETTING_KEYS.WEBSITE_FONT, 'Inter');
  }

  static createDefaultBackgroundColor(): WebsiteSetting {
    return new WebsiteSetting(VALID_SETTING_KEYS.BACKGROUND_COLOR, 'blue');
  }

  static createCustomLoader(
    url: string | null,
    metadata: ICustomLoaderMetadata | null
  ): WebsiteSetting {
    if (!url || !metadata) {
      return new WebsiteSetting(VALID_SETTING_KEYS.CUSTOM_LOADER, null);
    }
    return new WebsiteSetting(VALID_SETTING_KEYS.CUSTOM_LOADER, {
      url,
      metadata,
    });
  }

  static createDefaultCustomLoader(): WebsiteSetting {
    return new WebsiteSetting(VALID_SETTING_KEYS.CUSTOM_LOADER, null);
  }

  static isValidCustomLoaderKey(key: string): boolean {
    return key === VALID_SETTING_KEYS.CUSTOM_LOADER;
  }

  static createSellingEnabled(sellingEnabled: SellingEnabled): WebsiteSetting {
    return new WebsiteSetting(
      VALID_SETTING_KEYS.SELLING_ENABLED,
      sellingEnabled.value ? 'true' : 'false'
    );
  }

  static createDefaultSellingEnabled(): WebsiteSetting {
    return new WebsiteSetting(VALID_SETTING_KEYS.SELLING_ENABLED, 'false');
  }

  static isValidSellingEnabledKey(key: string): boolean {
    return key === VALID_SETTING_KEYS.SELLING_ENABLED;
  }

  getValueAsSellingEnabled(): boolean {
    if (typeof this._value === 'string') {
      return this._value === 'true';
    }
    return false;
  }

  getValueAsCustomLoader(): {
    url: string;
    metadata: ICustomLoaderMetadata;
  } | null {
    if (this._value === null) {
      return null;
    }
    if (
      typeof this._value === 'object' &&
      'url' in this._value &&
      'metadata' in this._value &&
      typeof this._value.metadata === 'object' &&
      'type' in this._value.metadata
    ) {
      return this._value as { url: string; metadata: ICustomLoaderMetadata };
    }
    throw new Error('Value is not a custom loader object');
  }
}
