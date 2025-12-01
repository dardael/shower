export class MenuItemUrl {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  equals(other: MenuItemUrl): boolean {
    return this._value === other._value;
  }

  static create(url: string): MenuItemUrl {
    const trimmed = url.trim();

    if (!trimmed || trimmed.length === 0) {
      throw new Error('Menu item URL cannot be empty');
    }

    if (trimmed.length > 2048) {
      throw new Error('Menu item URL cannot exceed 2048 characters');
    }

    if (!MenuItemUrl.isRelativeUrl(trimmed)) {
      throw new Error('Menu item URL must be a relative path');
    }

    return new MenuItemUrl(trimmed);
  }

  private static isRelativeUrl(url: string): boolean {
    if (url.startsWith('http://')) return false;
    if (url.startsWith('https://')) return false;
    if (url.startsWith('//')) return false;
    return true;
  }
}
