import { ThemeMode, ThemeModeValidator } from '../value-objects/ThemeMode';

/**
 * Browser Theme Preference Entity
 *
 * Represents a user's theme preference with validation and business logic.
 * Follows DDD entity pattern with immutability and domain behavior.
 */
export class BrowserThemePreference {
  private readonly _themeMode: ThemeMode;
  private readonly _isSystemDefault: boolean;
  private readonly _lastUpdated: Date;
  private readonly _userId?: string;

  constructor(
    themeMode: ThemeMode,
    isSystemDefault: boolean,
    lastUpdated: Date,
    userId?: string
  ) {
    this._themeMode = ThemeModeValidator.validate(themeMode);
    this._isSystemDefault = Boolean(isSystemDefault);
    this._lastUpdated = new Date(lastUpdated);
    this._userId = userId;

    this.validateInvariants();
  }

  /**
   * Creates a new theme preference for first-time users based on system theme
   * @param systemTheme - Detected system theme
   * @param userId - Optional user identifier
   * @returns New BrowserThemePreference with system default
   */
  static createForNewUser(
    systemTheme: ThemeMode,
    userId?: string
  ): BrowserThemePreference {
    return new BrowserThemePreference(systemTheme, true, new Date(), userId);
  }

  /**
   * Creates a theme preference from user's explicit choice
   * @param themeMode - User's chosen theme mode
   * @param userId - Optional user identifier
   * @returns New BrowserThemePreference with user choice
   */
  static createUserChoice(
    themeMode: ThemeMode,
    userId?: string
  ): BrowserThemePreference {
    return new BrowserThemePreference(themeMode, false, new Date(), userId);
  }

  /**
   * Updates theme preference with new user choice
   * @param newThemeMode - New theme mode chosen by user
   * @returns Updated BrowserThemePreference
   */
  updateTheme(newThemeMode: ThemeMode): BrowserThemePreference {
    return new BrowserThemePreference(
      newThemeMode,
      false, // User choice overrides system default
      new Date(),
      this._userId
    );
  }

  /**
   * Resets preference to system default
   * @param systemTheme - Current system theme
   * @returns BrowserThemePreference reset to system default
   */
  resetToSystem(systemTheme: ThemeMode): BrowserThemePreference {
    return new BrowserThemePreference(
      systemTheme,
      true,
      new Date(),
      this._userId
    );
  }

  /**
   * Gets the effective theme considering system preference
   * @param currentSystemTheme - Current system theme
   * @returns Effective theme mode to apply
   */
  getEffectiveTheme(currentSystemTheme: ThemeMode): ThemeMode {
    if (this._isSystemDefault) {
      return currentSystemTheme;
    }
    return this._themeMode;
  }

  /**
   * Checks if preference represents system default
   * @returns true if using system default
   */
  isSystemDefault(): boolean {
    return this._isSystemDefault;
  }

  /**
   * Gets the theme mode
   * @returns Current theme mode
   */
  get themeMode(): ThemeMode {
    return this._themeMode;
  }

  /**
   * Gets the last updated timestamp
   * @returns Last updated date
   */
  get lastUpdated(): Date {
    return new Date(this._lastUpdated);
  }

  /**
   * Gets the user identifier
   * @returns User ID if available
   */
  get userId(): string | undefined {
    return this._userId;
  }

  /**
   * Serializes preference for localStorage storage
   * @returns Serialized preference object
   */
  toJSON(): {
    themeMode: ThemeMode;
    isSystemDefault: boolean;
    lastUpdated: string;
    userId?: string;
  } {
    return {
      themeMode: this._themeMode,
      isSystemDefault: this._isSystemDefault,
      lastUpdated: this._lastUpdated.toISOString(),
      userId: this._userId,
    };
  }

  /**
   * Creates BrowserThemePreference from serialized data
   * @param data - Serialized preference data
   * @returns BrowserThemePreference instance
   * @throws Error if data is invalid
   */
  static fromJSON(data: {
    themeMode?: string;
    isSystemDefault?: boolean;
    lastUpdated?: string;
    userId?: string;
  }): BrowserThemePreference {
    if (!data.themeMode) {
      throw new Error('Missing themeMode in preference data');
    }

    if (!data.lastUpdated) {
      throw new Error('Missing lastUpdated in preference data');
    }

    const themeMode = ThemeModeValidator.validateWithFallback(data.themeMode);
    const lastUpdated = new Date(data.lastUpdated);

    if (isNaN(lastUpdated.getTime())) {
      throw new Error('Invalid lastUpdated date in preference data');
    }

    return new BrowserThemePreference(
      themeMode,
      Boolean(data.isSystemDefault),
      lastUpdated,
      data.userId
    );
  }

  /**
   * Validates business invariants
   * @throws Error if invariants are violated
   */
  private validateInvariants(): void {
    if (this._lastUpdated > new Date()) {
      throw new Error('Last updated date cannot be in future');
    }
  }

  /**
   * Checks if two preferences are equal
   * @param other - Another preference to compare
   * @returns true if preferences are equal
   */
  equals(other: BrowserThemePreference): boolean {
    if (!(other instanceof BrowserThemePreference)) {
      return false;
    }

    return (
      this._themeMode === other._themeMode &&
      this._isSystemDefault === other._isSystemDefault &&
      this._lastUpdated.getTime() === other._lastUpdated.getTime() &&
      this._userId === other._userId
    );
  }

  /**
   * Creates a copy with new user ID
   * @param userId - New user ID
   * @returns New BrowserThemePreference with updated user ID
   */
  withUserId(userId: string): BrowserThemePreference {
    return new BrowserThemePreference(
      this._themeMode,
      this._isSystemDefault,
      this._lastUpdated,
      userId
    );
  }
}
