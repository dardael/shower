/**
 * Value object representing a hex color for loader background.
 * Ensures type safety and validation of loader background color selection.
 */
export class LoaderBackgroundColor {
  private static readonly HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;
  private static readonly DEFAULT_LIGHT = '#FFFFFF';
  private static readonly DEFAULT_DARK = '#1A202C';

  private readonly _value: string;

  constructor(color: string) {
    const normalizedColor = color.toUpperCase();
    if (!LoaderBackgroundColor.HEX_COLOR_REGEX.test(normalizedColor)) {
      throw new Error(
        `Invalid loader background color: ${color}. Must be a valid hex color (#RRGGBB).`
      );
    }
    this._value = normalizedColor;
  }

  get value(): string {
    return this._value;
  }

  /**
   * Creates a LoaderBackgroundColor instance with validation
   */
  static create(color: string): LoaderBackgroundColor {
    return new LoaderBackgroundColor(color);
  }

  /**
   * Creates the default loader background color based on theme mode
   */
  static createDefault(isDarkMode: boolean = false): LoaderBackgroundColor {
    return new LoaderBackgroundColor(
      isDarkMode
        ? LoaderBackgroundColor.DEFAULT_DARK
        : LoaderBackgroundColor.DEFAULT_LIGHT
    );
  }

  /**
   * Creates a LoaderBackgroundColor from a string, returning null if null/undefined
   */
  static fromString(
    color: string | null | undefined
  ): LoaderBackgroundColor | null {
    if (!color) {
      return null;
    }

    try {
      return new LoaderBackgroundColor(color);
    } catch {
      return null;
    }
  }

  /**
   * Checks if this loader background color equals another
   */
  equals(other: LoaderBackgroundColor): boolean {
    return this._value === other._value;
  }

  /**
   * Returns the color as a string
   */
  toString(): string {
    return this._value;
  }

  /**
   * Returns the color as a JSON serializable value
   */
  toJSON(): string {
    return this._value;
  }

  /**
   * Validates if a string is a valid hex color
   */
  static isValid(color: string): boolean {
    return LoaderBackgroundColor.HEX_COLOR_REGEX.test(color);
  }

  /**
   * Returns the default color for light mode
   */
  static getDefaultLight(): string {
    return LoaderBackgroundColor.DEFAULT_LIGHT;
  }

  /**
   * Returns the default color for dark mode
   */
  static getDefaultDark(): string {
    return LoaderBackgroundColor.DEFAULT_DARK;
  }
}
