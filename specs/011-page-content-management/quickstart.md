# Quickstart: Page Content Management

**Date**: 2025-12-01  
**Feature**: 011-page-content-management

## Overview

This feature allows administrators to create, edit, and delete rich text content for menu items. When users visit a menu item's URL, they see the configured content.

## Prerequisites

- Existing menu items configured via admin panel
- Authentication system working (admin access)

## Installation

Add Tiptap dependencies:

```bash
docker compose run --rm app npm install @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link
```

## Quick Test

### 1. Create Page Content (Admin)

```bash
curl -X POST http://localhost:3000/api/settings/pages \
  -H "Content-Type: application/json" \
  -H "Cookie: <auth-cookie>" \
  -d '{
    "menuItemId": "<menu-item-id>",
    "content": "<h1>Welcome</h1><p>Test content</p>"
  }'
```

### 2. View Page Content (Public)

```bash
curl http://localhost:3000/api/pages/<menu-item-id>
```

### 3. Update Page Content (Admin)

```bash
curl -X PATCH http://localhost:3000/api/settings/pages/<menu-item-id> \
  -H "Content-Type: application/json" \
  -H "Cookie: <auth-cookie>" \
  -d '{
    "content": "<h1>Updated</h1><p>New content</p>"
  }'
```

### 4. Delete Page Content (Admin)

```bash
curl -X DELETE http://localhost:3000/api/settings/pages/<menu-item-id> \
  -H "Cookie: <auth-cookie>"
```

## User Flow

### Admin Flow

1. Navigate to admin menu configuration
2. Click "Edit Content" on a menu item
3. Use rich text editor to add content (text, formatting, images via URL)
4. Save content
5. Content is now live at the menu item's URL

### Public User Flow

1. Visit website
2. Click on menu item
3. See the page content configured by admin

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Presentation Layer                        │
│  ┌─────────────────────┐  ┌───────────────────────────────────┐ │
│  │ PageContentEditor   │  │ PublicPageContent                 │ │
│  │ (Admin - Tiptap)    │  │ (Public - HTML render)            │ │
│  └─────────────────────┘  └───────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                        Application Layer                         │
│  ┌─────────────────┐ ┌──────────────────┐ ┌──────────────────┐  │
│  │CreatePageContent│ │UpdatePageContent │ │DeletePageContent │  │
│  └─────────────────┘ └──────────────────┘ └──────────────────┘  │
│  ┌─────────────────┐                                            │
│  │GetPageContent   │                                            │
│  └─────────────────┘                                            │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                         Domain Layer                             │
│  ┌─────────────────┐  ┌───────────────────────────────────────┐ │
│  │ PageContent     │  │ PageContentBody (Value Object)        │ │
│  │ (Entity)        │  │                                       │ │
│  └─────────────────┘  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                      Infrastructure Layer                        │
│  ┌─────────────────────────┐  ┌─────────────────────────────┐   │
│  │ PageContentRepository   │  │ PageContentModel (Mongoose) │   │
│  └─────────────────────────┘  └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Key Files to Create

```
src/
├── domain/pages/
│   ├── entities/PageContent.ts
│   ├── value-objects/PageContentBody.ts
│   └── repositories/IPageContentRepository.ts
├── application/pages/
│   ├── use-cases/
│   │   ├── CreatePageContent.ts
│   │   ├── UpdatePageContent.ts
│   │   ├── DeletePageContent.ts
│   │   └── GetPageContent.ts
│   └── interfaces/
│       ├── ICreatePageContent.ts
│       ├── IUpdatePageContent.ts
│       ├── IDeletePageContent.ts
│       └── IGetPageContent.ts
├── infrastructure/pages/
│   ├── repositories/PageContentRepository.ts
│   └── models/PageContentModel.ts
├── presentation/admin/components/
│   └── PageContentEditor.tsx
├── presentation/shared/components/
│   └── PublicPageContent/
│       └── PublicPageContent.tsx
└── app/
    ├── api/settings/pages/
    │   ├── route.ts           # POST
    │   └── [menuItemId]/
    │       └── route.ts       # GET, PATCH, DELETE
    └── api/pages/
        └── [menuItemId]/
            └── route.ts       # GET (public)
```

## Testing

Run tests after implementation:

```bash
# Unit tests
docker compose run --rm app npm run test -- --testPathPattern=pages

# All tests
docker compose run --rm app npm run test
```
