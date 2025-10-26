import {
  ThemeColorToken,
  isValidThemeColor,
  DEFAULT_THEME_COLOR,
  THEME_COLOR_PALETTE,
  getThemeColorErrorMessage,
} from '@/domain/settings/constants/ThemeColorPalette';

/**
 * Value object representing a Chakra UI color token for website theming.
 * Ensures type safety and validation of theme color selection.
 */
export class ThemeColor {
  private readonly _value: ThemeColorToken;

  constructor(color: ThemeColorToken | string) {
    if (!isValidThemeColor(color)) {
      throw new Error(
        `Invalid theme color: ${color}. ${getThemeColorErrorMessage()}`
      );
    }
    this._value = color as ThemeColorToken;
  }

  get value(): ThemeColorToken {
    return this._value;
  }

  /**
   * Creates a ThemeColor instance with validation
   */
  static create(color: ThemeColorToken | string): ThemeColor {
    return new ThemeColor(color);
  }

  /**
   * Creates the default theme color
   */
  static createDefault(): ThemeColor {
    return new ThemeColor(DEFAULT_THEME_COLOR);
  }

  /**
   * Creates a ThemeColor from a string, returning default if invalid
   */
  static fromString(color: string | null | undefined): ThemeColor {
    if (!color) {
      return ThemeColor.createDefault();
    }

    try {
      return new ThemeColor(color);
    } catch {
      return ThemeColor.createDefault();
    }
  }

  /**
   * Checks if this theme color equals another
   */
  equals(other: ThemeColor): boolean {
    return this._value === other._value;
  }

  /**
   * Returns the color token as a string
   */
  toString(): string {
    return this._value;
  }

  /**
   * Returns the color token as a JSON serializable value
   */
  toJSON(): ThemeColorToken {
    return this._value;
  }

  /**
   * Validates if a string is a valid theme color
   */
  static isValid(color: string): boolean {
    return isValidThemeColor(color);
  }
}
