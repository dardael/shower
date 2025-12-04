# Research: Root Page Redirect to First Menu Item

**Feature**: 020-root-page-redirect  
**Date**: 2025-12-04  
**Purpose**: Technical research for implementing root URL display of first menu item's page content

## Research Task 1: Next.js App Router Root Page Patterns

### Question

How to implement dynamic content in root `page.tsx` while maintaining server-side rendering and sharing logic with dynamic `[slug]` routes?

### Findings

**Next.js App Router Server Components**:

- Root `page.tsx` is a server component by default (async function returning JSX)
- Can directly access backend services via dependency injection container
- Database connection can be established within the component
- Similar pattern already used in `[slug]/page.tsx` for dynamic pages

**Existing Pattern in `[slug]/page.tsx`**:

```typescript
export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  await DatabaseConnection.getInstance().connect();

  const getMenuItems = container.resolve<GetMenuItems>('IGetMenuItems');
  const menuItems = await getMenuItems.execute();

  // Find menu item by URL slug
  const menuItem = menuItems.find(/* ... */);

  const getPageContent = container.resolve<GetPageContent>('IGetPageContent');
  const pageContent = await getPageContent.execute(menuItem.id);

  return <Container>...</Container>;
}
```

**Decision**: Adapt the same pattern for root `page.tsx`:

1. Make it an async server component
2. Connect to database using `DatabaseConnection.getInstance().connect()`
3. Resolve use cases from DI container
4. Query menu items and find first by position
5. Retrieve page content for that menu item
6. Render using `PublicPageContent` component

**Rationale**:

- Maintains consistency with existing codebase patterns
- Leverages server-side rendering for better performance
- No client-side JavaScript needed for initial render
- Reuses existing infrastructure (DI container, use cases, components)

**Alternatives Considered**:

- Client-side data fetching: Rejected because it would introduce loading states and degrade performance
- Shared utility function: Rejected because logic is simple enough to implement directly in each page component (KISS principle)
- API route + client component: Rejected because server component is simpler and more performant

---

## Research Task 2: Menu Item Ordering/Position Retrieval

### Question

Does the existing `MenuItem` entity have a position/order field? Does `GetMenuItems` use case return items in sorted order?

### Findings

**MenuItem Entity** (`src/domain/menu/entities/MenuItem.ts`):

- ✅ Has `_position: number` private field
- ✅ Has public getter `get position(): number`
- ✅ Validates position must be non-negative (`position < 0` throws error)
- Position is immutable (no setter, entity uses immutable pattern)

**GetMenuItems Use Case** (`src/application/menu/GetMenuItems.ts`):

- Delegates to `MenuItemRepository.findAll()`
- No sorting logic in use case itself

**MongooseMenuItemRepository** (`src/infrastructure/menu/repositories/MongooseMenuItemRepository.ts`):

- ✅ `findAll()` method includes sorting: `.sort({ position: 1 })`
- Returns menu items sorted by position in ascending order (lowest position first)
- Line 14: `const documents = await MenuItemModel.find().sort({ position: 1 });`

**Decision**: Use the first item from `GetMenuItems.execute()` result array

- No additional sorting needed
- First item in array is already the menu item with lowest position number
- Simple array access: `menuItems[0]` or `menuItems.at(0)`

**Rationale**:

- Repository already handles sorting, no duplication needed (DRY principle)
- Simple implementation (KISS principle)
- Consistent with existing architecture (repository handles data access concerns)

**Alternatives Considered**:

- Manual sorting in page component: Rejected because repository already sorts
- Finding minimum position explicitly: Rejected because first array element is already guaranteed to be minimum

---

## Research Task 3: Edge Case Handling Patterns

### Question

What are best practices for handling empty menu items and missing page content? How does existing `[slug]/page.tsx` handle errors?

### Findings

**Existing Error Handling in `[slug]/page.tsx`**:

```typescript
const menuItem = menuItems.find(/* ... */);

if (!menuItem) {
  notFound(); // Next.js built-in 404 handler
}
```

**PublicPageContent Component** (already tested in integration tests):

- Handles empty content gracefully
- Displays: "This page has no content yet." when content is empty
- Test file: `test/integration/page-content.integration.test.tsx` (lines 127-141)

**Edge Cases to Handle**:

1. **No menu items exist**:
   - Decision: Display friendly placeholder message
   - Rationale: Better UX than showing error or 404
   - Implementation: Check `menuItems.length === 0`, render custom message

2. **First menu item exists but no associated page content**:
   - Decision: Let `PublicPageContent` component handle empty state
   - Rationale: Component already has empty state handling, reuse it (DRY)
   - Implementation: Pass empty string or null to component

3. **Page content query returns null**:
   - Decision: Use `content?.content.value || ''` pattern (same as `[slug]/page.tsx`)
   - Rationale: Consistent with existing implementation
   - Implementation: Optional chaining with fallback to empty string

**Decision**: Three-tier graceful degradation

```typescript
// 1. No menu items at all
if (menuItems.length === 0) {
  return <EmptyStateMessage />;
}

// 2. Get first menu item
const firstMenuItem = menuItems[0];

// 3. Get page content (may be null)
const pageContent = await getPageContent.execute(firstMenuItem.id);

// 4. Render with fallback to empty (PublicPageContent handles empty state)
return <PublicPageContent content={pageContent?.content.value || ''} />;
```

**Rationale**:

- Clear user feedback for each scenario
- Reuses existing component capabilities
- Consistent with existing error handling patterns
- Simple implementation (KISS principle)

**Alternatives Considered**:

- Using Next.js `notFound()` for empty state: Rejected because no menu items is not a 404 error, it's a valid state during initial setup
- Throwing errors: Rejected because these are expected states, not exceptional conditions
- Loading state with suspense: Rejected because server component renders synchronously

---

## Research Task 4: Testing Patterns for Next.js App Router Pages

### Question

What testing patterns should be used for server components? How to mock the DI container and database connection?

### Findings

**Existing Test Pattern** (`test/unit/app/layout.test.tsx`):

1. **Mock all external dependencies**:

```typescript
jest.mock('@/infrastructure/shared/layoutUtils');
jest.mock('@/infrastructure/container', () => ({
  container: {
    resolve: jest.fn(() => ({
      logErrorWithObject: jest.fn(),
    })),
  },
}));
```

2. **Render async server component**:

```typescript
const layout = await RootLayout({ children: testContent });
render(layout);
```

3. **Test component output, not implementation details**:

```typescript
expect(screen.getByTestId('footer')).toBeInTheDocument();
```

**Testing Strategy for Root Page Component**:

**Unit Tests** (`test/unit/app/page.test.tsx`):

- Mock: `DatabaseConnection`, `container.resolve`, use cases
- Test: Component logic, menu item selection, edge case handling
- Focus: Component behavior, not integration

**Integration Tests** (`test/integration/root-page-redirect.integration.test.tsx`):

- Mock: Minimal (only external APIs if needed)
- Test: Full flow from menu items to rendered content
- Focus: End-to-end behavior, actual component rendering

**Decision**: Create both test types

1. **Unit tests**: Mock all dependencies, test logic in isolation
2. **Integration tests**: Use real components, test rendering

**Mock Pattern for Unit Tests**:

```typescript
jest.mock('@/infrastructure/shared/databaseConnection', () => ({
  DatabaseConnection: {
    getInstance: jest.fn(() => ({
      connect: jest.fn().mockResolvedValue(undefined),
    })),
  },
}));

jest.mock('@/infrastructure/container', () => ({
  container: {
    resolve: jest.fn((key: string) => {
      if (key === 'IGetMenuItems') {
        return { execute: jest.fn().mockResolvedValue(mockMenuItems) };
      }
      if (key === 'IGetPageContent') {
        return { execute: jest.fn().mockResolvedValue(mockPageContent) };
      }
    }),
  },
}));
```

**Rationale**:

- Consistent with existing test patterns (`layout.test.tsx`)
- Focused tests (Principle II: Focused Testing Approach)
- Tests common cases, not edge case over-testing
- Minimal mocking in integration tests (avoid over-mocking)

**Alternatives Considered**:

- Only integration tests: Rejected because unit tests provide faster feedback for logic errors
- Testing library for server components: Rejected because existing pattern works well with `@testing-library/react`
- E2E tests with real database: Rejected because not requested in constitution (only unit and integration tests)

---

## Summary of Decisions

| Aspect                   | Decision                                  | Key Rationale                                  |
| ------------------------ | ----------------------------------------- | ---------------------------------------------- |
| Root page pattern        | Async server component with DI container  | Consistent with existing `[slug]/page.tsx`     |
| Menu item selection      | Use first item from `GetMenuItems` array  | Repository already sorts by position ascending |
| Empty menu handling      | Display friendly placeholder message      | Better UX than 404, expected during setup      |
| Missing content handling | Reuse `PublicPageContent` empty state     | DRY principle, component already handles it    |
| Unit test mocking        | Mock all external dependencies            | Consistent with existing `layout.test.tsx`     |
| Integration tests        | Minimal mocking, real component rendering | Focus on end-to-end behavior                   |

## Implementation Readiness

✅ All research questions answered
✅ Technical approach validated against existing patterns
✅ Edge cases identified and handling strategies defined
✅ Testing strategy aligned with constitution (Principle II)
✅ No architectural changes needed
✅ Ready to proceed to Phase 1 (Design & Contracts)
