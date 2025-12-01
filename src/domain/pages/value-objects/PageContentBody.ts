export class PageContentBody {
  private static readonly MAX_LENGTH = 100000;
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  equals(other: PageContentBody): boolean {
    return this._value === other._value;
  }

  static create(content: string): PageContentBody {
    const trimmed = content.trim();

    if (!trimmed || trimmed.length === 0) {
      throw new Error('Page content cannot be empty');
    }

    if (trimmed.length > PageContentBody.MAX_LENGTH) {
      throw new Error(
        `Page content cannot exceed ${PageContentBody.MAX_LENGTH} characters`
      );
    }

    return new PageContentBody(trimmed);
  }
}
