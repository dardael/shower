/**
 * Theme Mode Preference Value Object - represents administrator preference for theme mode behavior
 * Values: 'force-light' | 'force-dark' | 'user-choice'
 */

export type ThemeModeValue = 'force-light' | 'force-dark' | 'user-choice';

const VALID_THEME_MODES: ThemeModeValue[] = [
  'force-light',
  'force-dark',
  'user-choice',
];

export class ThemeModePreference {
  private constructor(private readonly _value: ThemeModeValue) {}

  get value(): ThemeModeValue {
    return this._value;
  }

  static create(value: string): ThemeModePreference {
    if (!ThemeModePreference.isValid(value)) {
      return ThemeModePreference.default();
    }
    return new ThemeModePreference(value as ThemeModeValue);
  }

  static default(): ThemeModePreference {
    return new ThemeModePreference('user-choice');
  }

  static isValid(value: string): value is ThemeModeValue {
    return VALID_THEME_MODES.includes(value as ThemeModeValue);
  }

  isForced(): boolean {
    return this._value === 'force-light' || this._value === 'force-dark';
  }

  getForcedMode(): 'light' | 'dark' | null {
    if (this._value === 'force-light') return 'light';
    if (this._value === 'force-dark') return 'dark';
    return null;
  }

  shouldShowToggle(): boolean {
    return this._value === 'user-choice';
  }

  equals(other: ThemeModePreference): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
