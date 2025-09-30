export class WebsiteName {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Website name cannot be empty');
    }
    if (value.length > 50) {
      throw new Error('Website name cannot exceed 50 characters');
    }
    // Additional validation: no special characters that could cause issues in HTML title
    const invalidChars = /[<>\"&]/;
    if (invalidChars.test(value)) {
      throw new Error('Website name contains invalid characters');
    }
    this._value = value.trim();
  }

  get value(): string {
    return this._value;
  }

  equals(other: WebsiteName): boolean {
    return this._value === other._value;
  }
}
