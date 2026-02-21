import { PageContentBody } from '@/domain/pages/value-objects/PageContentBody';

export type HeroMediaType = 'image' | 'video';

export class PageContent {
  private readonly _id: string | null;
  private readonly _menuItemId: string;
  private readonly _content: PageContentBody;
  private readonly _heroMediaUrl: string | null;
  private readonly _heroMediaType: HeroMediaType | null;
  private readonly _heroText: string | null;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  private constructor(
    id: string | null,
    menuItemId: string,
    content: PageContentBody,
    createdAt: Date,
    updatedAt: Date,
    heroMediaUrl: string | null = null,
    heroMediaType: HeroMediaType | null = null,
    heroText: string | null = null
  ) {
    this._id = id;
    this._menuItemId = menuItemId;
    this._content = content;
    this._heroMediaUrl = heroMediaUrl;
    this._heroMediaType = heroMediaType;
    this._heroText = heroText;
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

  get heroMediaUrl(): string | null {
    return this._heroMediaUrl;
  }

  get heroMediaType(): HeroMediaType | null {
    return this._heroMediaType;
  }

  get heroText(): string | null {
    return this._heroText;
  }

  get hasHero(): boolean {
    return this._heroMediaUrl !== null && this._heroMediaType !== null;
  }

  withId(id: string): PageContent {
    return new PageContent(
      id,
      this._menuItemId,
      this._content,
      this._createdAt,
      this._updatedAt,
      this._heroMediaUrl,
      this._heroMediaType,
      this._heroText
    );
  }

  withContent(content: PageContentBody): PageContent {
    return new PageContent(
      this._id,
      this._menuItemId,
      content,
      this._createdAt,
      new Date(),
      this._heroMediaUrl,
      this._heroMediaType,
      this._heroText
    );
  }

  withHero(
    heroMediaUrl: string | null,
    heroMediaType: HeroMediaType | null,
    heroText: string | null
  ): PageContent {
    return new PageContent(
      this._id,
      this._menuItemId,
      this._content,
      this._createdAt,
      new Date(),
      heroMediaUrl,
      heroMediaType,
      heroText
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

  static create(
    menuItemId: string,
    content: PageContentBody,
    heroMediaUrl: string | null = null,
    heroMediaType: HeroMediaType | null = null,
    heroText: string | null = null
  ): PageContent {
    const now = new Date();
    return new PageContent(
      null,
      menuItemId,
      content,
      now,
      now,
      heroMediaUrl,
      heroMediaType,
      heroText
    );
  }

  static reconstitute(
    id: string,
    menuItemId: string,
    content: PageContentBody,
    createdAt: Date,
    updatedAt: Date,
    heroMediaUrl: string | null = null,
    heroMediaType: HeroMediaType | null = null,
    heroText: string | null = null
  ): PageContent {
    return new PageContent(
      id,
      menuItemId,
      content,
      createdAt,
      updatedAt,
      heroMediaUrl,
      heroMediaType,
      heroText
    );
  }
}
