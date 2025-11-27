/**
 * Theme Mode Value Object - represents available theme modes for dark mode toggle
 */
export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export class ThemeModeValidator {
  static isValid(theme: string): theme is ThemeMode {
    return Object.values(ThemeMode).includes(theme as ThemeMode);
  }

  static validate(theme: string): ThemeMode {
    if (!this.isValid(theme)) {
      throw new Error(
        `Invalid theme mode: ${theme}. Must be one of: ${Object.values(ThemeMode).join(', ')}`
      );
    }
    return theme as ThemeMode;
  }

  static isSystemPreference(theme: ThemeMode): boolean {
    return theme === ThemeMode.SYSTEM;
  }

  static getOpposite(theme: ThemeMode): ThemeMode {
    switch (theme) {
      case ThemeMode.LIGHT:
        return ThemeMode.DARK;
      case ThemeMode.DARK:
        return ThemeMode.LIGHT;
      case ThemeMode.SYSTEM:
        return ThemeMode.SYSTEM;
      default:
        throw new Error(`Unexpected theme mode: ${theme}`);
    }
  }

  static validateWithFallback(
    theme: string,
    fallback: ThemeMode = ThemeMode.LIGHT
  ): ThemeMode {
    try {
      return this.validate(theme);
    } catch {
      return fallback;
    }
  }
}
