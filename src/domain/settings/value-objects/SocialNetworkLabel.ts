export class SocialNetworkLabel {
  private readonly _value: string;

  constructor(value: string) {
    this.validateLabel(value);
    this._value = value.trim();
  }

  get value(): string {
    return this._value;
  }

  get isEmpty(): boolean {
    return this._value === '';
  }

  get length(): number {
    return this._value.length;
  }

  private validateLabel(value: string): void {
    const trimmedValue = value.trim();

    if (trimmedValue.length > 50) {
      throw new Error('Social network label cannot exceed 50 characters');
    }

    if (trimmedValue.length < 1) {
      throw new Error('Social network label cannot be empty');
    }

    // Check for HTML special characters to prevent XSS
    if (/<|>|&|"|'/.test(trimmedValue)) {
      throw new Error('Social network label contains invalid characters');
    }
  }

  equals(other: SocialNetworkLabel): boolean {
    return this._value === other._value;
  }

  static fromString(value: string): SocialNetworkLabel {
    return new SocialNetworkLabel(value);
  }

  static createDefault(defaultLabel: string): SocialNetworkLabel {
    return new SocialNetworkLabel(defaultLabel);
  }
}
