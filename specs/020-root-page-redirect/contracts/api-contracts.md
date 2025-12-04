# API Contracts: Root Page Redirect to First Menu Item

**Feature**: 020-root-page-redirect  
**Date**: 2025-12-04  
**Type**: Internal Interfaces (No external APIs)

## Overview

This feature does NOT introduce new API endpoints or modify existing ones. It leverages existing internal Application layer interfaces for data retrieval.

---

## Internal Application Interfaces (Reused)

### IGetMenuItems

**Location**: `src/application/menu/IGetMenuItems.ts`  
**Implementation**: `src/application/menu/GetMenuItems.ts`

**Interface Definition**:

```typescript
export interface IGetMenuItems {
  execute(): Promise<MenuItem[]>;
}
```

**Behavior**:

- Returns all menu items from the repository
- Items are sorted by `position` in ascending order (lowest first)
- Empty array returned if no menu items exist

**Parameters**: None

**Return Value**:

- `Promise<MenuItem[]>` - Array of MenuItem entities sorted by position

**Error Handling**:

- Database connection errors propagate to caller
- Invalid data in repository throws error during domain entity reconstitution

**Usage in Feature**:

```typescript
const getMenuItems = container.resolve<IGetMenuItems>('IGetMenuItems');
const menuItems = await getMenuItems.execute();
const firstMenuItem = menuItems[0]; // First item by position
```

---

### IGetPageContent

**Location**: `src/application/pages/use-cases/IGetPageContent.ts`  
**Implementation**: `src/application/pages/use-cases/GetPageContent.ts`

**Interface Definition**:

```typescript
export interface IGetPageContent {
  execute(pageId: string): Promise<PageContent | null>;
}
```

**Behavior**:

- Retrieves page content associated with given menu item ID
- Returns `null` if no content exists for the given ID
- Returns `PageContent` entity if content found

**Parameters**:

- `pageId: string` - Menu item ID to retrieve content for

**Return Value**:

- `Promise<PageContent | null>` - PageContent entity or null if not found

**Error Handling**:

- Invalid pageId format may throw error (implementation-specific)
- Database errors propagate to caller
- Missing content returns `null` (not an error)

**Usage in Feature**:

```typescript
const getPageContent = container.resolve<IGetPageContent>('IGetPageContent');
const pageContent = await getPageContent.execute(firstMenuItem.id);
const htmlContent = pageContent?.content.value || '';
```

---

## Dependency Injection Container

**Location**: `src/infrastructure/container.ts`

**Service Resolution**:

```typescript
container.resolve<IGetMenuItems>('IGetMenuItems');
container.resolve<IGetPageContent>('IGetPageContent');
```

**Registration** (existing):

- `'IGetMenuItems'` → `GetMenuItems` class
- `'IGetPageContent'` → `GetPageContent` class

**No Changes Required**: Existing registrations are sufficient

---

## Component Contracts

### Root Page Component

**Location**: `src/app/page.tsx`

**Component Signature**:

```typescript
export default async function Home(): Promise<JSX.Element>;
```

**Responsibilities**:

1. Establish database connection
2. Resolve use cases from DI container
3. Query menu items
4. Identify first menu item (array index 0)
5. Query page content for first menu item
6. Render content via PublicPageContent component
7. Handle edge cases (no items, no content)

**Return Type**: `Promise<JSX.Element>` (async server component)

**Error Handling**:

- No menu items: Render empty state placeholder
- No page content: Render PublicPageContent with empty string
- Database errors: Let Next.js error boundary handle

---

### PublicPageContent Component (Reused)

**Location**: `src/presentation/shared/components/PublicPageContent/PublicPageContent.tsx`

**Component Signature**:

```typescript
interface PublicPageContentProps {
  content: string;
}

export default function PublicPageContent({
  content,
}: PublicPageContentProps): JSX.Element;
```

**Behavior**:

- Renders HTML content safely
- Displays "This page has no content yet." if content is empty
- Applies theme-aware styling

**Props**:

- `content: string` - HTML string to render (may be empty)

**Usage in Feature**:

```typescript
<PublicPageContent content={pageContent?.content.value || ''} />
```

---

## Data Flow Contract

```
┌──────────────────────────────────┐
│ Next.js Request: GET /           │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ src/app/page.tsx (Server)        │
│ - Connect to database            │
│ - Resolve use cases              │
└────────────┬─────────────────────┘
             │
             ├─────────────────────────────┐
             │                             │
             ▼                             ▼
┌──────────────────────┐    ┌──────────────────────┐
│ IGetMenuItems        │    │ IGetPageContent      │
│ execute()            │    │ execute(menuItemId)  │
└────────┬─────────────┘    └──────────┬───────────┘
         │                              │
         ▼                              ▼
┌──────────────────────┐    ┌──────────────────────┐
│ MenuItem[]           │    │ PageContent | null   │
│ [sorted by position] │    │                      │
└────────┬─────────────┘    └──────────┬───────────┘
         │                              │
         └──────────┬───────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Render Logic         │
         │ - menuItems[0]       │
         │ - pageContent.value  │
         └──────────┬───────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ PublicPageContent    │
         │ component            │
         └──────────┬───────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ HTML Response        │
         └──────────────────────┘
```

---

## Edge Case Contracts

### Scenario 1: No Menu Items

**Request**: `GET /`

**Flow**:

```typescript
menuItems = await getMenuItems.execute(); // Returns []
if (menuItems.length === 0) {
  return <EmptyState />;
}
```

**Response**: HTML with empty state message

**Status Code**: 200 OK (not an error)

---

### Scenario 2: Menu Item Without Page Content

**Request**: `GET /`

**Flow**:

```typescript
menuItems = await getMenuItems.execute(); // Returns [menuItem]
firstMenuItem = menuItems[0];
pageContent = await getPageContent.execute(firstMenuItem.id); // Returns null
htmlContent = pageContent?.content.value || ''; // Resolves to ''
return <PublicPageContent content="" />;
```

**Response**: HTML with PublicPageContent's empty state UI

**Status Code**: 200 OK

---

### Scenario 3: Normal Operation

**Request**: `GET /`

**Flow**:

```typescript
menuItems = await getMenuItems.execute(); // Returns [item1, item2, ...]
firstMenuItem = menuItems[0];
pageContent = await getPageContent.execute(firstMenuItem.id); // Returns PageContent
htmlContent = pageContent.content.value; // HTML string
return <PublicPageContent content={htmlContent} />;
```

**Response**: HTML with rendered page content

**Status Code**: 200 OK

---

## Testing Contracts

### Unit Test Mocks

**Mock IGetMenuItems**:

```typescript
const mockGetMenuItems = {
  execute: jest.fn().mockResolvedValue([mockMenuItem1, mockMenuItem2]),
};
```

**Mock IGetPageContent**:

```typescript
const mockGetPageContent = {
  execute: jest.fn().mockResolvedValue(mockPageContent),
};
```

**Mock Container Resolution**:

```typescript
jest.mock('@/infrastructure/container', () => ({
  container: {
    resolve: jest.fn((key: string) => {
      if (key === 'IGetMenuItems') return mockGetMenuItems;
      if (key === 'IGetPageContent') return mockGetPageContent;
    }),
  },
}));
```

---

### Integration Test Contracts

**Test Scenario**: Render first menu item's content

```typescript
// Setup: Create menu items with content
// Action: Render root page component
// Assert: Content from first menu item is displayed
```

**Test Scenario**: Handle empty menu

```typescript
// Setup: No menu items in database
// Action: Render root page component
// Assert: Empty state message displayed
```

---

## Summary

**New External APIs**: 0  
**New Internal Interfaces**: 0  
**Modified Interfaces**: 0  
**Reused Interfaces**: 2 (IGetMenuItems, IGetPageContent)

**Conclusion**: This feature requires no API contract changes. All necessary interfaces already exist and are sufficient for the implementation.
