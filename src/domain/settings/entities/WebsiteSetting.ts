import { WebsiteName } from '@/domain/settings/value-objects/WebsiteName';
import { WebsiteIcon } from '@/domain/settings/value-objects/WebsiteIcon';
import { ThemeColor } from '@/domain/settings/value-objects/ThemeColor';
import { IIconMetadata } from '@/domain/settings/types/IconMetadata';
import {
  VALID_SETTING_KEYS,
  VALID_SETTING_KEY_VALUES,
} from '@/domain/settings/constants/SettingKeys';

export type SettingValue =
  | string
  | { url: string; metadata: IIconMetadata }
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

  set value(newValue: SettingValue) {
    this._value = newValue;
  }

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
    if (
      this._value === null ||
      (typeof this._value === 'object' && 'url' in this._value)
    ) {
      return this._value as { url: string; metadata: IIconMetadata } | null;
    }
    throw new Error('Value is not an icon object');
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

    return (
      this._key === other._key &&
      JSON.stringify(this._value) === JSON.stringify(other._value)
    );
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
}
