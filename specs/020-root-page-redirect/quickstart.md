# Quickstart Guide: Root Page Redirect to First Menu Item

**Feature**: 020-root-page-redirect  
**Date**: 2025-12-04  
**For**: Developers implementing and testing this feature

## Overview

This guide helps you implement and verify the root URL functionality that displays the first menu item's page content.

---

## Prerequisites

- Development environment set up with Docker Compose
- MongoDB running with menu items and page content
- Familiarity with Next.js App Router and server components

---

## Implementation Steps

### Step 1: Modify Root Page Component

**File**: `src/app/page.tsx`

**Current State** (Static welcome message):

```typescript
export default function Home() {
  return (
    <Container maxW="container.lg" py={16}>
      <VStack gap={4} textAlign="center">
        <Heading as="h1" size="2xl">Welcome to Shower</Heading>
        <Text fontSize="lg">Your showcase website builder.</Text>
      </VStack>
    </Container>
  );
}
```

**New Implementation** (Dynamic first menu content):

```typescript
import { notFound } from 'next/navigation';
import { Container, Box, VStack, Heading, Text } from '@chakra-ui/react';
import PublicPageContent from '@/presentation/shared/components/PublicPageContent/PublicPageContent';
import { DatabaseConnection } from '@/infrastructure/shared/databaseConnection';
import { container } from '@/infrastructure/container';
import type { GetMenuItems } from '@/application/menu/GetMenuItems';
import type { GetPageContent } from '@/application/pages/use-cases/GetPageContent';

export default async function Home() {
  // Connect to database
  await DatabaseConnection.getInstance().connect();

  // Get all menu items (sorted by position)
  const getMenuItems = container.resolve<GetMenuItems>('IGetMenuItems');
  const menuItems = await getMenuItems.execute();

  // Handle no menu items case
  if (menuItems.length === 0) {
    return (
      <Container maxW="container.lg" py={16}>
        <VStack gap={4} textAlign="center">
          <Heading as="h2" size="lg">No Content Available</Heading>
          <Text fontSize="md">
            Please add your first menu item to get started.
          </Text>
        </VStack>
      </Container>
    );
  }

  // Get first menu item (already sorted by position)
  const firstMenuItem = menuItems[0];

  // Get page content for first menu item
  const getPageContent = container.resolve<GetPageContent>('IGetPageContent');
  const pageContent = await getPageContent.execute(firstMenuItem.id);

  // Render page content (PublicPageContent handles empty state)
  return (
    <Container maxW="container.lg" py={8}>
      <Box>
        <PublicPageContent content={pageContent?.content.value || ''} />
      </Box>
    </Container>
  );
}
```

---

### Step 2: Create Unit Tests

**File**: `test/unit/app/page.test.tsx`

```typescript
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '@/app/page';
import { MenuItem } from '@/domain/menu/entities/MenuItem';
import { MenuItemText } from '@/domain/menu/value-objects/MenuItemText';
import { MenuItemUrl } from '@/domain/menu/value-objects/MenuItemUrl';
import { PageContent } from '@/domain/pages/PageContent';
import { PageContentBody } from '@/domain/pages/PageContentBody';

// Mock dependencies
jest.mock('@/infrastructure/shared/databaseConnection', () => ({
  DatabaseConnection: {
    getInstance: jest.fn(() => ({
      connect: jest.fn().mockResolvedValue(undefined),
    })),
  },
}));

jest.mock(
  '@/presentation/shared/components/PublicPageContent/PublicPageContent',
  () => ({
    __esModule: true,
    default: jest.fn(({ content }) =>
      React.createElement('div', { 'data-testid': 'page-content' }, content)
    ),
  })
);

const mockGetMenuItems = {
  execute: jest.fn(),
};

const mockGetPageContent = {
  execute: jest.fn(),
};

jest.mock('@/infrastructure/container', () => ({
  container: {
    resolve: jest.fn((key: string) => {
      if (key === 'IGetMenuItems') return mockGetMenuItems;
      if (key === 'IGetPageContent') return mockGetPageContent;
      return null;
    }),
  },
}));

describe('Home Page (Root URL)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display first menu item content when menu items exist', async () => {
    const menuItem = MenuItem.reconstitute(
      '1',
      MenuItemText.create('Home'),
      MenuItemUrl.create('/home'),
      0,
      new Date(),
      new Date()
    );

    const pageContent = PageContent.reconstitute(
      '1',
      PageContentBody.create('<h1>Welcome to Our Site</h1>'),
      new Date(),
      new Date()
    );

    mockGetMenuItems.execute.mockResolvedValue([menuItem]);
    mockGetPageContent.execute.mockResolvedValue(pageContent);

    const page = await Home();
    render(page);

    expect(screen.getByTestId('page-content')).toHaveTextContent(
      'Welcome to Our Site'
    );
  });

  it('should display empty state when no menu items exist', async () => {
    mockGetMenuItems.execute.mockResolvedValue([]);

    const page = await Home();
    render(page);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'No Content Available'
    );
    expect(screen.getByText(/add your first menu item/i)).toBeInTheDocument();
  });

  it('should handle missing page content gracefully', async () => {
    const menuItem = MenuItem.reconstitute(
      '1',
      MenuItemText.create('Home'),
      MenuItemUrl.create('/home'),
      0,
      new Date(),
      new Date()
    );

    mockGetMenuItems.execute.mockResolvedValue([menuItem]);
    mockGetPageContent.execute.mockResolvedValue(null);

    const page = await Home();
    render(page);

    // PublicPageContent component receives empty string
    expect(screen.getByTestId('page-content')).toHaveTextContent('');
  });

  it('should select first menu item by position', async () => {
    const menuItem1 = MenuItem.reconstitute(
      '1',
      MenuItemText.create('Home'),
      MenuItemUrl.create('/home'),
      0,
      new Date(),
      new Date()
    );

    const menuItem2 = MenuItem.reconstitute(
      '2',
      MenuItemText.create('About'),
      MenuItemUrl.create('/about'),
      1,
      new Date(),
      new Date()
    );

    const pageContent = PageContent.reconstitute(
      '1',
      PageContentBody.create('<h1>Home Page</h1>'),
      new Date(),
      new Date()
    );

    mockGetMenuItems.execute.mockResolvedValue([menuItem1, menuItem2]);
    mockGetPageContent.execute.mockResolvedValue(pageContent);

    const page = await Home();
    render(page);

    // Verify first menu item's content is used
    expect(mockGetPageContent.execute).toHaveBeenCalledWith('1');
    expect(screen.getByTestId('page-content')).toHaveTextContent('Home Page');
  });
});
```

---

### Step 3: Create Integration Tests

**File**: `test/integration/root-page-redirect.integration.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import PublicPageContent from '@/presentation/shared/components/PublicPageContent/PublicPageContent';

describe('Root Page Content Display Integration', () => {
  it('should render first menu item HTML content correctly', () => {
    const htmlContent = '<h1>Welcome</h1><p>This is our homepage.</p>';

    render(<PublicPageContent content={htmlContent} />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Welcome'
    );
    expect(screen.getByText('This is our homepage.')).toBeInTheDocument();
  });

  it('should display empty state when content is empty', () => {
    render(<PublicPageContent content="" />);

    expect(
      screen.getByText('This page has no content yet.')
    ).toBeInTheDocument();
  });

  it('should render complex content structure', () => {
    const htmlContent = `
      <h1>Our Services</h1>
      <ul>
        <li>Web Design</li>
        <li>Development</li>
        <li>Consulting</li>
      </ul>
    `;

    render(<PublicPageContent content={htmlContent} />);

    expect(screen.getByRole('heading')).toHaveTextContent('Our Services');
    expect(screen.getByText('Web Design')).toBeInTheDocument();
    expect(screen.getByText('Development')).toBeInTheDocument();
    expect(screen.getByText('Consulting')).toBeInTheDocument();
  });
});
```

---

## Testing the Feature

### Run Unit Tests

```bash
docker compose run --rm app npm test test/unit/app/page.test.tsx
```

**Expected Output**: All tests pass ✓

---

### Run Integration Tests

```bash
docker compose run --rm app npm test test/integration/root-page-redirect.integration.test.tsx
```

**Expected Output**: All tests pass ✓

---

### Run All Tests

```bash
docker compose run --rm app npm test
```

---

## Manual Verification

### Scenario 1: Normal Operation

**Setup**:

1. Ensure database has menu items with page content
2. First menu item (position 0) should have associated content

**Steps**:

1. Start the development server: `docker compose up app`
2. Navigate to `http://localhost:3000/`
3. Verify first menu item's page content is displayed
4. Check browser URL remains `/` (no redirect)

**Expected Result**: Root URL displays first menu item's content without URL change

---

### Scenario 2: Empty Menu

**Setup**:

1. Delete all menu items from database
2. Or use fresh database

**Steps**:

1. Navigate to `http://localhost:3000/`
2. Verify empty state message is displayed

**Expected Result**: "No Content Available" message with call-to-action

---

### Scenario 3: Menu Reordering

**Setup**:

1. Create multiple menu items with content
2. Note which item is first

**Steps**:

1. Navigate to `http://localhost:3000/`
2. Verify first menu item's content displays
3. Go to admin dashboard and reorder menu items
4. Refresh root URL
5. Verify new first menu item's content displays

**Expected Result**: Content updates to match new first menu item

---

## Debugging Tips

### Issue: "No menu items" always shows

**Check**:

1. Database connection is successful
2. Menu items exist in MongoDB
3. `GetMenuItems` use case is returning data

**Debug**:

```typescript
console.log('Menu items:', menuItems.length);
```

---

### Issue: Content not displaying

**Check**:

1. First menu item has associated page content
2. Page content ID matches menu item ID
3. Content value is not empty

**Debug**:

```typescript
console.log('First item ID:', firstMenuItem.id);
console.log('Page content:', pageContent?.content.value);
```

---

### Issue: Wrong menu item displayed

**Check**:

1. Repository is sorting by position correctly
2. Menu item positions are set correctly
3. First item in array is actually position 0

**Debug**:

```typescript
console.log(
  'All positions:',
  menuItems.map((m) => m.position)
);
```

---

## Performance Verification

### Load Time Check

**Expected**: Page loads within 2 seconds (Success Criteria SC-001)

**Measurement**:

1. Open browser DevTools (Network tab)
2. Navigate to `http://localhost:3000/`
3. Check "DOMContentLoaded" time

**Target**: < 2000ms

---

### Comparison with Dynamic Pages

**Expected**: Same performance as `/[slug]` pages (Success Criteria SC-004)

**Steps**:

1. Measure root URL load time
2. Navigate to first menu item's dedicated URL (e.g., `/home`)
3. Measure that page's load time
4. Compare times

**Target**: Within 10% difference

---

## Success Criteria Checklist

- [ ] Root URL displays first menu item's page content
- [ ] URL remains `/` in browser (no redirect)
- [ ] Empty state displays when no menu items exist
- [ ] Empty content is handled gracefully
- [ ] Content updates when menu order changes
- [ ] Page loads within 2 seconds
- [ ] Performance matches dedicated page URLs
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Theme styling is consistent with other pages

---

## Next Steps

After implementation and testing:

1. Run linting: `docker compose run --rm app npm run lint`
2. Run type check: `docker compose run --rm app npm run build:strict`
3. Run full test suite: `docker compose run --rm app npm test`
4. Manual test in browser
5. Verify success criteria
6. Create pull request

---

## Additional Resources

- **Specification**: `specs/020-root-page-redirect/spec.md`
- **Research**: `specs/020-root-page-redirect/research.md`
- **Data Model**: `specs/020-root-page-redirect/data-model.md`
- **API Contracts**: `specs/020-root-page-redirect/contracts/api-contracts.md`
- **Existing Implementation**: `src/app/[slug]/page.tsx` (reference)
