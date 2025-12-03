# Quickstart: Website Font Configuration

**Feature Branch**: `014-website-font-config`  
**Date**: 2025-12-03

## Overview

This feature allows administrators to select a Google Font that applies to both the public website and admin interface. The font selector is positioned below the theme color setting in the website settings form.

## Implementation Order

### Phase 1: Domain Layer

1. **Add setting key constant**
   - File: `src/domain/settings/constants/SettingKeys.ts`
   - Add `WEBSITE_FONT: 'website-font'` to `VALID_SETTING_KEYS`

2. **Create font constants**
   - File: `src/domain/settings/constants/AvailableFonts.ts`
   - Define `AVAILABLE_FONTS` array with font metadata
   - Define `DEFAULT_FONT = 'Inter'`
   - Define `FontMetadata` interface and `FontCategory` type

3. **Create WebsiteFont value object**
   - File: `src/domain/settings/value-objects/WebsiteFont.ts`
   - Validate font name against `AVAILABLE_FONTS`
   - Factory methods: `create()`, `createDefault()`
   - Utility: `getGoogleFontsUrl()` to generate CSS URL

4. **Extend WebsiteSetting entity**
   - File: `src/domain/settings/entities/WebsiteSetting.ts`
   - Add `createWebsiteFont()` factory method
   - Add `createDefaultWebsiteFont()` factory method

### Phase 2: Application Layer

5. **Create GetWebsiteFont use case**
   - File: `src/application/settings/GetWebsiteFont.ts`
   - Interface: `src/application/settings/IGetWebsiteFont.ts`
   - Returns `WebsiteFont` value object

6. **Create UpdateWebsiteFont use case**
   - File: `src/application/settings/UpdateWebsiteFont.ts`
   - Interface: `src/application/settings/IUpdateWebsiteFont.ts`
   - Accepts font name, validates, persists

7. **Create GetAvailableFonts use case**
   - File: `src/application/settings/GetAvailableFonts.ts`
   - Interface: `src/application/settings/IGetAvailableFonts.ts`
   - Returns `AVAILABLE_FONTS` array

8. **Update SettingsServiceLocator**
   - File: `src/application/settings/SettingsServiceLocator.ts`
   - Add factory methods for new use cases

### Phase 3: Infrastructure Layer

9. **Update MongooseWebsiteSettingsRepository**
   - File: `src/infrastructure/settings/repositories/MongooseWebsiteSettingsRepository.ts`
   - Add default value handling for `website-font` key

10. **Update container.ts**
    - File: `src/infrastructure/container.ts`
    - Register new use cases with dependency injection

### Phase 4: API Layer

11. **Create website-font API route**
    - File: `src/app/api/settings/website-font/route.ts`
    - GET: Fetch current font (public)
    - POST: Update font (authenticated)

12. **Create available-fonts API route**
    - File: `src/app/api/settings/available-fonts/route.ts`
    - GET: Return list of available fonts

13. **Create API types**
    - File: `src/app/api/settings/website-font/types.ts`

### Phase 5: Presentation Layer

14. **Create WebsiteFontContext**
    - File: `src/presentation/shared/contexts/WebsiteFontContext.tsx`
    - Similar to `ThemeColorContext`
    - Provides font state to components

15. **Create useWebsiteFont hook**
    - File: `src/presentation/shared/hooks/useWebsiteFont.ts`
    - Fetch/cache font from API
    - Provide loading state

16. **Create FontSelector component**
    - File: `src/presentation/admin/components/FontSelector.tsx`
    - Dropdown with font preview
    - Category grouping
    - Similar style to ThemeColorSelector

17. **Update WebsiteSettingsForm**
    - File: `src/presentation/admin/components/WebsiteSettingsForm.tsx`
    - Add FontSelector below ThemeColorSelector

18. **Create FontProvider component**
    - File: `src/presentation/shared/components/FontProvider.tsx`
    - Injects Google Fonts `<link>` in head
    - Sets CSS custom property `--website-font`

19. **Update Provider hierarchy**
    - File: `src/presentation/shared/components/ui/provider.tsx`
    - Add `FontProvider` to provider chain

20. **Update theme system**
    - File: `src/presentation/shared/theme.ts`
    - Configure Chakra UI to use `--website-font` CSS variable

### Phase 6: Layout Integration

21. **Update public layout**
    - File: `src/app/layout.tsx`
    - Ensure font applies to body/html

22. **Update admin layout**
    - File: `src/app/admin/layout.tsx`
    - Ensure font applies to admin interface

### Phase 7: Testing

23. **Unit tests for domain**
    - `test/unit/domain/settings/value-objects/WebsiteFont.test.ts`

24. **Unit tests for use cases**
    - `test/unit/application/settings/GetWebsiteFont.test.ts`
    - `test/unit/application/settings/UpdateWebsiteFont.test.ts`

25. **Integration tests**
    - `test/integration/website-font.integration.test.tsx`
    - Test font CRUD operations
    - Test font rendering on public/admin

## Key Code Patterns

### WebsiteFont Value Object

```typescript
export class WebsiteFont {
  private readonly _value: string;

  constructor(fontName: string) {
    if (!isValidFont(fontName)) {
      throw new Error(`Invalid font: ${fontName}`);
    }
    this._value = fontName;
  }

  static create(fontName: string): WebsiteFont {
    return new WebsiteFont(fontName);
  }

  static createDefault(): WebsiteFont {
    return new WebsiteFont(DEFAULT_FONT);
  }

  get value(): string {
    return this._value;
  }

  getGoogleFontsUrl(): string {
    const fontName = this._value.replace(/ /g, '+');
    return `https://fonts.googleapis.com/css2?family=${fontName}:wght@400;500;600;700&display=swap`;
  }
}
```

### FontProvider Component

```typescript
export function FontProvider({ children }: { children: React.ReactNode }) {
  const { websiteFont } = useWebsiteFontContext();
  const fontUrl = new WebsiteFont(websiteFont).getGoogleFontsUrl();

  useEffect(() => {
    // Inject Google Fonts link
    const link = document.createElement('link');
    link.href = fontUrl;
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Set CSS custom property
    document.documentElement.style.setProperty('--website-font', `'${websiteFont}', sans-serif`);

    return () => {
      document.head.removeChild(link);
    };
  }, [websiteFont, fontUrl]);

  return <>{children}</>;
}
```

### Chakra UI Theme Integration

```typescript
// In theme.ts
export const globalCss = {
  html: {
    fontFamily: 'var(--website-font, system-ui, sans-serif)',
  },
  body: {
    fontFamily: 'var(--website-font, system-ui, sans-serif)',
  },
};
```

## Testing Strategy

### Unit Tests

- WebsiteFont value object creation and validation
- GetWebsiteFont use case returns correct font
- UpdateWebsiteFont use case persists font
- Invalid font names are rejected

### Integration Tests

- GET /api/settings/website-font returns current font
- POST /api/settings/website-font updates font
- Font is applied to public pages
- Font is applied to admin pages
- Font persists after page refresh

## Dependencies

- No new npm packages required
- Uses existing Chakra UI, React, Next.js infrastructure
