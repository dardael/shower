import { PageContentBody } from '@/domain/pages/value-objects/PageContentBody';

export class PageContent {
  private readonly _id: string | null;
  private readonly _menuItemId: string;
  private readonly _content: PageContentBody;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  private constructor(
    id: string | null,
    menuItemId: string,
    content: PageContentBody,
    createdAt: Date,
    updatedAt: Date
  ) {
    this._id = id;
    this._menuItemId = menuItemId;
    this._content = content;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  get id(): string {
    if (!this._id) {
      throw new Error('PageContent has no ID - it has not been persisted yet');
    }
    return this._id;
  }

  get hasId(): boolean {
    return this._id !== null;
  }

  get menuItemId(): string {
    return this._menuItemId;
  }

  get content(): PageContentBody {
    return this._content;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  withId(id: string): PageContent {
    return new PageContent(
      id,
      this._menuItemId,
      this._content,
      this._createdAt,
      this._updatedAt
    );
  }

  withContent(content: PageContentBody): PageContent {
    return new PageContent(
      this._id,
      this._menuItemId,
      content,
      this._createdAt,
      new Date()
    );
  }

  equals(other: PageContent | null | undefined): boolean {
    if (!other) {
      return false;
    }
    if (!this._id || !other._id) {
      return false;
    }
    return this._id === other._id;
  }

  static create(menuItemId: string, content: PageContentBody): PageContent {
    const now = new Date();
    return new PageContent(null, menuItemId, content, now, now);
  }

  static reconstitute(
    id: string,
    menuItemId: string,
    content: PageContentBody,
    createdAt: Date,
    updatedAt: Date
  ): PageContent {
    return new PageContent(id, menuItemId, content, createdAt, updatedAt);
  }
}
