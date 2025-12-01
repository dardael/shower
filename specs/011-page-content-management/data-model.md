# Data Model: Page Content Management

**Date**: 2025-12-01  
**Feature**: 011-page-content-management

## Entities

### PageContent

Represents the rich text content associated with a menu item.

| Field      | Type   | Constraints                               | Description                              |
| ---------- | ------ | ----------------------------------------- | ---------------------------------------- |
| id         | string | Primary key, auto-generated               | Unique identifier                        |
| menuItemId | string | Required, unique, foreign key to MenuItem | Reference to the associated menu item    |
| content    | string | Required, max 100,000 characters          | HTML content from the rich text editor   |
| createdAt  | Date   | Auto-set on creation                      | Timestamp when content was created       |
| updatedAt  | Date   | Auto-set on update                        | Timestamp when content was last modified |

**Relationships**:

- One-to-one with MenuItem (one menu item has at most one page content)
- Cascade delete: When MenuItem is deleted, associated PageContent is also deleted

**Validation Rules**:

- `content` must not be empty or contain only whitespace
- `content` must not exceed 100,000 characters (approximately 50,000 words)
- `menuItemId` must reference an existing MenuItem

### MenuItem (Existing - Modified)

The existing MenuItem entity remains unchanged structurally. The relationship to PageContent is managed from the PageContent side.

**Existing Fields** (no changes):

- id: string
- text: MenuItemText (value object)
- url: MenuItemUrl (value object)
- position: number
- createdAt: Date
- updatedAt: Date

**Behavioral Change**:

- When a MenuItem is deleted, the system must also delete any associated PageContent

## Value Objects

### PageContentBody

Encapsulates the content HTML with validation.

| Property | Type   | Constraints                       |
| -------- | ------ | --------------------------------- |
| value    | string | Non-empty, max 100,000 characters |

**Validation**:

- Strips leading/trailing whitespace
- Rejects empty content
- Validates maximum length

## State Transitions

### PageContent Lifecycle

```
[Not Exists] --create--> [Active]
[Active] --update--> [Active]
[Active] --delete--> [Not Exists]
[Active] --(MenuItem deleted)--> [Not Exists]
```

## Database Schema (MongoDB)

### PageContent Collection

```javascript
{
  _id: ObjectId,
  menuItemId: ObjectId,  // Reference to MenuItem, indexed, unique
  content: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:

- `menuItemId`: Unique index for fast lookups and enforcing one-to-one relationship

## Repository Interface

```typescript
interface IPageContentRepository {
  findByMenuItemId(menuItemId: string): Promise<PageContent | null>;
  save(pageContent: PageContent): Promise<PageContent>;
  delete(menuItemId: string): Promise<void>;
}
```

## Domain Events (Future Consideration)

While not implemented in initial version, the following events could be emitted:

- `PageContentCreated`: When new content is created
- `PageContentUpdated`: When content is modified
- `PageContentDeleted`: When content is deleted

## Data Transfer Objects

### PageContentDTO (API Response)

```typescript
{
  id: string;
  menuItemId: string;
  content: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### CreatePageContentDTO (API Request)

```typescript
{
  menuItemId: string;
  content: string;
}
```

### UpdatePageContentDTO (API Request)

```typescript
{
  content: string;
}
```
