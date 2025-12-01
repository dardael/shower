# Research: Menu Item URL Configuration

**Feature**: 010-menu-item-url  
**Date**: 2025-12-01

## Research Topics

### 1. Relative URL Validation Strategy

**Decision**: Use simple string validation without external libraries

**Rationale**:

- Relative URLs are simple path strings (e.g., `/about`, `contact`, `/pages/info`)
- No need for complex URL parsing since we're rejecting absolute URLs
- Validation rules:
  1. Non-empty after trimming
  2. Must NOT start with `http://`, `https://`, or `//` (reject absolute URLs)
  3. Accept both `/path` and `path` formats
- Maximum length: 2048 characters (browser standard)

**Alternatives Considered**:

- Using `URL` constructor: Rejected - designed for absolute URLs, would require base URL workaround
- Using `path-to-regexp`: Rejected - overkill for simple validation, adds dependency
- Regex pattern: Considered but simple string checks are more readable

**Implementation Pattern**:

```typescript
// Validation in MenuItemUrl value object
static isRelativeUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('http://')) return false;
  if (trimmed.startsWith('https://')) return false;
  if (trimmed.startsWith('//')) return false;
  return true;
}
```

### 2. Value Object Pattern (Following MenuItemText)

**Decision**: Create `MenuItemUrl` value object following `MenuItemText` pattern

**Rationale**:

- Consistent with existing codebase patterns
- Encapsulates validation logic in domain layer
- Immutable with private constructor and factory method
- DRY: follows same structure as MenuItemText

**Pattern from Existing Code**:

```typescript
// From MenuItemText.ts - follow this pattern
export class MenuItemUrl {
  private constructor(private readonly _value: string) {}

  static create(url: string): MenuItemUrl {
    const trimmed = url.trim();
    // validation logic
    return new MenuItemUrl(trimmed);
  }

  get value(): string {
    return this._value;
  }

  equals(other: MenuItemUrl): boolean {
    return this._value === other._value;
  }
}
```

### 3. Entity Extension Pattern

**Decision**: Extend MenuItem entity with `_url` property and `withUrl()` method

**Rationale**:

- Follows existing immutable entity pattern
- `withUrl()` returns new instance like `withText()`
- Update factory methods to require url parameter
- No backward compatibility needed (per spec)

**Changes Required**:

- Add `_url: MenuItemUrl` property
- Update `create()` to require url parameter
- Update `reconstitute()` to include url
- Add `withUrl(url: MenuItemUrl): MenuItem` method
- Add `get url(): string` getter

### 4. Public Header Link Implementation

**Decision**: Use Next.js Link component for internal navigation

**Rationale**:

- Next.js Link provides client-side navigation (SPA behavior)
- Opens in same tab (internal navigation only)
- Semantic HTML with `<a>` element for accessibility
- No need for `target="_blank"` since all URLs are internal

**Implementation Pattern**:

```tsx
import Link from 'next/link';

// In PublicHeaderMenuItem.tsx
<Link href={url}>{text}</Link>;
```

### 5. Testing Strategy for URL Validation

**Decision**: Unit tests for MenuItemUrl value object covering validation scenarios

**Test Cases**:

1. Valid relative URLs: `/about`, `contact`, `/pages/info`, `path/to/page`
2. Empty URL rejection
3. Whitespace-only URL rejection
4. Absolute URL rejection: `http://example.com`, `https://example.com`, `//example.com`
5. URL with special characters: `/path?query=value`, `/path#anchor`
6. Maximum length enforcement (2048 chars)

### 6. Testing Strategy for Public Frontend Navigation

**Decision**: Component test for PublicHeaderMenuItem with Link verification

**Test Approach**:

- Render component with URL prop
- Verify Link component renders with correct href
- Verify link text displays correctly
- Use React Testing Library for semantic queries

**Test Cases**:

1. Renders as clickable link with correct href
2. Displays menu item text
3. Link has proper accessibility attributes

## Summary of Decisions

| Topic            | Decision                       | Key Reason                    |
| ---------------- | ------------------------------ | ----------------------------- |
| URL Validation   | Simple string checks           | KISS, no dependencies         |
| Value Object     | Follow MenuItemText pattern    | DRY, consistency              |
| Entity Extension | Add \_url property + withUrl() | Immutable pattern             |
| Link Component   | Next.js Link                   | SPA navigation, semantic HTML |
| URL Tests        | Unit tests for value object    | Explicit user request         |
| Frontend Tests   | Component tests for Link       | Explicit user request         |
