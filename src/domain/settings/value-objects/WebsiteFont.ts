import {
  isValidFont,
  DEFAULT_FONT,
  getFontByName,
  getFontErrorMessage,
  type FontMetadata,
} from '@/domain/settings/constants/AvailableFonts';

/**
 * Value object representing a website font selection.
 * Ensures type safety and validation of font selection.
 */
export class WebsiteFont {
  private readonly _value: string;

  constructor(fontName: string) {
    if (!isValidFont(fontName)) {
      throw new Error(`Invalid font: ${fontName}. ${getFontErrorMessage()}`);
    }
    // Normalize the font name to match the exact name in AVAILABLE_FONTS
    const fontMetadata = getFontByName(fontName);
    this._value = fontMetadata?.name || fontName;
  }

  get value(): string {
    return this._value;
  }

  /**
   * Creates a WebsiteFont instance with validation
   */
  static create(fontName: string): WebsiteFont {
    return new WebsiteFont(fontName);
  }

  /**
   * Creates the default website font
   */
  static createDefault(): WebsiteFont {
    return new WebsiteFont(DEFAULT_FONT);
  }

  /**
   * Creates a WebsiteFont from a string, returning default if invalid
   */
  static fromString(fontName: string | null | undefined): WebsiteFont {
    if (!fontName) {
      return WebsiteFont.createDefault();
    }

    try {
      return new WebsiteFont(fontName);
    } catch {
      return WebsiteFont.createDefault();
    }
  }

  /**
   * Gets the Google Fonts CSS URL for this font
   */
  getGoogleFontsUrl(): string {
    const fontMetadata = getFontByName(this._value);
    const weights = fontMetadata?.weights || [400, 500, 600, 700];
    const fontName = this._value.replace(/ /g, '+');
    const weightsParam = weights.join(';');
    return `https://fonts.googleapis.com/css2?family=${fontName}:wght@${weightsParam}&display=swap`;
  }

  /**
   * Gets the font metadata
   */
  getMetadata(): FontMetadata | undefined {
    return getFontByName(this._value);
  }

  /**
   * Gets the CSS font-family value
   */
  getFontFamily(): string {
    const fontMetadata = getFontByName(this._value);
    return fontMetadata?.family || `'${this._value}', sans-serif`;
  }

  /**
   * Checks if this font equals another
   */
  equals(other: WebsiteFont): boolean {
    return this._value.toLowerCase() === other._value.toLowerCase();
  }

  /**
   * Returns the font name as a string
   */
  toString(): string {
    return this._value;
  }

  /**
   * Returns the font name as a JSON serializable value
   */
  toJSON(): string {
    return this._value;
  }

  /**
   * Validates if a string is a valid font name
   */
  static isValid(fontName: string): boolean {
    return isValidFont(fontName);
  }
}
