/**
 * Selling Enabled Value Object - represents whether selling mode is enabled
 * Values: true (enabled) | false (disabled)
 * Default: false (disabled)
 */

export class SellingEnabled {
  private constructor(private readonly _value: boolean) {}

  get value(): boolean {
    return this._value;
  }

  static create(value: unknown): SellingEnabled {
    if (typeof value === 'boolean') {
      return new SellingEnabled(value);
    }
    if (value === 'true') {
      return new SellingEnabled(true);
    }
    if (value === 'false') {
      return new SellingEnabled(false);
    }
    return SellingEnabled.default();
  }

  static default(): SellingEnabled {
    return new SellingEnabled(false);
  }

  static enabled(): SellingEnabled {
    return new SellingEnabled(true);
  }

  static disabled(): SellingEnabled {
    return new SellingEnabled(false);
  }

  isEnabled(): boolean {
    return this._value === true;
  }

  isDisabled(): boolean {
    return this._value === false;
  }

  equals(other: SellingEnabled): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value ? 'enabled' : 'disabled';
  }
}
