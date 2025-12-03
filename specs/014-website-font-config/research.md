# Research: Website Font Configuration

**Feature Branch**: `014-website-font-config`  
**Date**: 2025-12-03

## Research Questions

### 1. How to dynamically load Google Fonts at runtime?

**Decision**: Use Google Fonts CSS API with dynamic `<link>` injection

**Rationale**:

- Next.js `next/font/google` requires fonts to be imported at build time (static imports)
- Dynamic font selection requires runtime loading
- Google Fonts CSS API allows loading any font via URL: `https://fonts.googleapis.com/css2?family=FontName&display=swap`
- The link can be injected in the `<head>` dynamically based on stored settings

**Alternatives considered**:

- `next/font/google` static imports: Rejected because fonts must be known at build time
- Self-hosted fonts: Rejected due to complexity and maintenance overhead
- Fontsource: Rejected as it also requires build-time configuration

### 2. How to provide a list of all Google Fonts?

**Decision**: Use a curated static list of popular Google Fonts (50-100 fonts)

**Rationale**:

- Google Fonts API (developer_api) requires an API key
- Loading 1500+ fonts would create performance issues in the UI
- A curated list of popular fonts covers 95%+ of use cases
- List can be expanded incrementally based on user feedback

**Font Categories to include**:

- Sans-serif: Inter, Roboto, Open Sans, Lato, Montserrat, Poppins, Nunito, Raleway
- Serif: Playfair Display, Merriweather, Lora, Crimson Text, Source Serif Pro
- Display: Oswald, Bebas Neue, Anton, Archivo Black
- Handwriting: Dancing Script, Pacifico, Caveat
- Monospace: Fira Code, Source Code Pro, JetBrains Mono

**Alternatives considered**:

- Full Google Fonts API integration: Rejected due to API key requirement and performance
- Web Font Loader library: Rejected as unnecessary complexity for this use case

### 3. How to apply font to both public and admin interfaces?

**Decision**: Use CSS custom property (`--website-font`) injected at root level

**Rationale**:

- Both public layout (`src/app/layout.tsx`) and admin layout (`src/app/admin/layout.tsx`) share the same Provider system
- CSS custom properties can be set dynamically and inherited by all children
- Consistent with existing theme color approach using Chakra UI theme system
- Font can be updated without full page reload

**Implementation approach**:

1. Create `FontProvider` context similar to `ThemeColorProvider`
2. Inject Google Fonts `<link>` in document head
3. Set CSS custom property `--website-font` on root element
4. Configure Chakra UI theme to use this CSS variable

**Alternatives considered**:

- Separate font configurations for public/admin: Rejected as user wants unified font
- Inline styles on each component: Rejected as not maintainable

### 4. How to handle font loading states and fallbacks?

**Decision**: Use `display=swap` and sensible fallback font stack

**Rationale**:

- `display=swap` prevents invisible text during font loading (FOIT)
- Fallback stack ensures readable content even if Google Fonts fails
- Standard web practice for progressive enhancement

**Fallback stack**: `font-family: var(--website-font), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

### 5. How to structure the font setting in the database?

**Decision**: Store font family name as string in WebsiteSettings with key `website-font`

**Rationale**:

- Follows existing pattern for `theme-color`, `website-name`, etc.
- Simple string value (e.g., "Inter", "Roboto") is sufficient
- Font metadata (weights, categories) stored in static constants

**Default value**: "Inter" (most popular, highly readable, excellent language support)

### 6. How to position font selector in settings UI?

**Decision**: Place font selector field directly below theme color selector

**Rationale**:

- User explicitly requested this positioning
- Groups visual/branding settings together
- Follows existing form layout patterns

### 7. Testing approach for font CRUD and application?

**Decision**: Unit tests for use cases, integration tests for API and UI rendering

**Unit tests**:

- `GetWebsiteFont` use case
- `UpdateWebsiteFont` use case
- `WebsiteFont` value object validation

**Integration tests**:

- Font API endpoint (GET/POST)
- Font applied correctly in public layout
- Font applied correctly in admin layout
- Font persists after settings change

## Technical Decisions Summary

| Decision         | Choice                       | Reason                   |
| ---------------- | ---------------------------- | ------------------------ |
| Font loading     | Google Fonts CSS API         | Dynamic runtime loading  |
| Font list        | Curated static list (50-100) | Performance, UX          |
| Font application | CSS custom property          | Unified public/admin     |
| Default font     | Inter                        | Popular, readable        |
| Storage          | String in WebsiteSettings    | Follows existing pattern |
| Fallback         | System font stack            | Progressive enhancement  |

## Dependencies

- No new npm packages required
- Uses existing Chakra UI theming system
- Uses existing WebsiteSettings infrastructure
