export class MenuItemText {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  equals(other: MenuItemText): boolean {
    return this._value === other._value;
  }

  static create(text: string): MenuItemText {
    const trimmed = text.trim();

    if (!trimmed || trimmed.length === 0) {
      throw new Error('Menu item text cannot be empty');
    }

    if (trimmed.length > 100) {
      throw new Error('Menu item text cannot exceed 100 characters');
    }

    return new MenuItemText(trimmed);
  }
}
