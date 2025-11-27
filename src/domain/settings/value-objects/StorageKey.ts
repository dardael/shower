/**
 * Storage Key Value Object
 *
 * Type-safe localStorage key management for theme preferences.
 * Prevents key collisions and provides centralized key management.
 */

export class StorageKey {
  private static readonly THEME_PREFERENCE = 'shower-admin-theme';
  private static readonly THEME_STORAGE_TEST = '__theme_storage_test__';

  /**
   * Gets the localStorage key for theme preferences
   * @returns Theme preference storage key
   */
  static getThemePreferenceKey(): string {
    return StorageKey.THEME_PREFERENCE;
  }

  /**
   * Gets the test key for storage availability checking
   * @returns Storage test key
   */
  static getStorageTestKey(): string {
    return StorageKey.THEME_STORAGE_TEST;
  }

  /**
   * Validates if a key is a valid theme storage key
   * @param key - Storage key to validate
   * @returns true if key is a valid theme storage key
   */
  static isValidThemeKey(key: string): boolean {
    return (
      key === StorageKey.THEME_PREFERENCE ||
      key === StorageKey.THEME_STORAGE_TEST
    );
  }

  /**
   * Gets all theme-related storage keys
   * @returns Array of theme storage keys
   */
  static getAllThemeKeys(): string[] {
    return [StorageKey.THEME_PREFERENCE, StorageKey.THEME_STORAGE_TEST];
  }

  /**
   * Checks if a key is a test key (should be cleaned up)
   * @param key - Storage key to check
   * @returns true if key is a test key
   */
  static isTestKey(key: string): boolean {
    return key === StorageKey.THEME_STORAGE_TEST;
  }

  /**
   * Creates a namespaced key for future extensibility
   * @param suffix - Key suffix
   * @returns Namespaced storage key
   */
  static createNamespacedKey(suffix: string): string {
    return `shower-admin-${suffix}`;
  }
}
