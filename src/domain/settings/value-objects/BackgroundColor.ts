import {
  ThemeColorToken,
  isValidThemeColor,
  DEFAULT_THEME_COLOR,
  getThemeColorErrorMessage,
} from '@/domain/settings/constants/ThemeColorPalette';

/**
 * Value object representing a Chakra UI color token for website background.
 * Ensures type safety and validation of background color selection.
 */
export class BackgroundColor {
  private readonly _value: ThemeColorToken;

  constructor(color: ThemeColorToken | string) {
    if (!isValidThemeColor(color)) {
      throw new Error(
        `Invalid background color: ${color}. ${getThemeColorErrorMessage()}`
      );
    }
    this._value = color as ThemeColorToken;
  }

  get value(): ThemeColorToken {
    return this._value;
  }

  /**
   * Creates a BackgroundColor instance with validation
   */
  static create(color: ThemeColorToken | string): BackgroundColor {
    return new BackgroundColor(color);
  }

  /**
   * Creates the default background color
   */
  static createDefault(): BackgroundColor {
    return new BackgroundColor(DEFAULT_THEME_COLOR);
  }

  /**
   * Creates a BackgroundColor from a string, returning default if invalid
   */
  static fromString(color: string | null | undefined): BackgroundColor {
    if (!color) {
      return BackgroundColor.createDefault();
    }

    try {
      return new BackgroundColor(color);
    } catch {
      return BackgroundColor.createDefault();
    }
  }

  /**
   * Checks if this background color equals another
   */
  equals(other: BackgroundColor): boolean {
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
   * Validates if a string is a valid background color
   */
  static isValid(color: string): boolean {
    return isValidThemeColor(color);
  }
}
