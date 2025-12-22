const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class EmailAddress {
  private constructor(private readonly _value: string) {}

  get value(): string {
    return this._value;
  }

  static create(email: string): EmailAddress {
    const trimmed = email.trim().toLowerCase();
    if (!EmailAddress.isValid(trimmed)) {
      throw new Error(`Format d'email invalide: ${email}`);
    }
    return new EmailAddress(trimmed);
  }

  static isValid(email: string): boolean {
    if (!email || typeof email !== 'string') {
      return false;
    }
    const trimmed = email.trim();
    return EMAIL_REGEX.test(trimmed);
  }

  toString(): string {
    return this._value;
  }

  equals(other: EmailAddress): boolean {
    return this._value === other._value;
  }
}
