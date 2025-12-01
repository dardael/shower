import { MenuItemText } from '@/domain/menu/value-objects/MenuItemText';
import { MenuItemUrl } from '@/domain/menu/value-objects/MenuItemUrl';

export class MenuItem {
  private readonly _id: string | null;
  private readonly _text: MenuItemText;
  private readonly _url: MenuItemUrl;
  private readonly _position: number;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  private constructor(
    id: string | null,
    text: MenuItemText,
    url: MenuItemUrl,
    position: number,
    createdAt: Date,
    updatedAt: Date
  ) {
    if (position < 0) {
      throw new Error('Position must be a non-negative number');
    }

    this._id = id;
    this._text = text;
    this._url = url;
    this._position = position;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  get id(): string {
    if (!this._id) {
      throw new Error('MenuItem has no ID - it has not been persisted yet');
    }
    return this._id;
  }

  get hasId(): boolean {
    return this._id !== null;
  }

  get text(): MenuItemText {
    return this._text;
  }

  get position(): number {
    return this._position;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get url(): MenuItemUrl {
    return this._url;
  }

  withId(id: string): MenuItem {
    return new MenuItem(
      id,
      this._text,
      this._url,
      this._position,
      this._createdAt,
      this._updatedAt
    );
  }

  withText(text: MenuItemText): MenuItem {
    return new MenuItem(
      this._id,
      text,
      this._url,
      this._position,
      this._createdAt,
      new Date()
    );
  }

  withUrl(url: MenuItemUrl): MenuItem {
    return new MenuItem(
      this._id,
      this._text,
      url,
      this._position,
      this._createdAt,
      new Date()
    );
  }

  equals(other: MenuItem | null | undefined): boolean {
    if (!other) {
      return false;
    }
    if (!this._id || !other._id) {
      return false;
    }
    return this._id === other._id;
  }

  static create(
    text: MenuItemText,
    url: MenuItemUrl,
    position: number
  ): MenuItem {
    const now = new Date();
    return new MenuItem(null, text, url, position, now, now);
  }

  static reconstitute(
    id: string,
    text: MenuItemText,
    url: MenuItemUrl,
    position: number,
    createdAt: Date,
    updatedAt: Date
  ): MenuItem {
    return new MenuItem(id, text, url, position, createdAt, updatedAt);
  }
}
