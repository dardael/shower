const HEX_COLOR_REGEX = /^#[0-9a-fA-F]{6}$/;
const DEFAULT_HEADER_MENU_TEXT_COLOR = '#000000';

/**
 * Value object representing a hex color for header menu text.
 * Ensures type safety and validation of text color selection.
 */
export class HeaderMenuTextColor {
  private readonly _value: string;

  constructor(color: string) {
    const normalizedColor = color.toLowerCase();
    if (!HEX_COLOR_REGEX.test(normalizedColor)) {
      throw new Error(
        `Invalid header menu text color: ${color}. Must be a valid hex color (e.g., #000000).`
      );
    }
    this._value = normalizedColor;
  }

  get value(): string {
    return this._value;
  }

  /**
   * Creates a HeaderMenuTextColor instance with validation
   */
  static create(color: string): HeaderMenuTextColor {
    return new HeaderMenuTextColor(color);
  }

  /**
   * Creates the default header menu text color (black)
   */
  static createDefault(): HeaderMenuTextColor {
    return new HeaderMenuTextColor(DEFAULT_HEADER_MENU_TEXT_COLOR);
  }

  /**
   * Creates a HeaderMenuTextColor from a string, returning default if invalid
   */
  static fromString(color: string | null | undefined): HeaderMenuTextColor {
    if (!color) {
      return HeaderMenuTextColor.createDefault();
    }

    try {
      return new HeaderMenuTextColor(color);
    } catch {
      return HeaderMenuTextColor.createDefault();
    }
  }

  /**
   * Checks if this text color equals another
   */
  equals(other: HeaderMenuTextColor): boolean {
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
    return HEX_COLOR_REGEX.test(color);
  }

  /**
   * Returns the default color value
   */
  static getDefault(): string {
    return DEFAULT_HEADER_MENU_TEXT_COLOR;
  }
}
