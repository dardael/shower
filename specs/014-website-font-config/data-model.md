# Data Model: Website Font Configuration

**Feature Branch**: `014-website-font-config`  
**Date**: 2025-12-03

## Entities

### WebsiteFont (Value Object)

Represents a validated font family selection.

| Field | Type   | Description             | Constraints                     |
| ----- | ------ | ----------------------- | ------------------------------- |
| value | string | Google Font family name | Must be in AVAILABLE_FONTS list |

**Behaviors**:

- `create(fontName: string)`: Factory method with validation
- `createDefault()`: Returns default font (Inter)
- `getValue()`: Returns the font family name
- `getGoogleFontsUrl()`: Returns the Google Fonts CSS URL

### FontMetadata (Constant)

Static metadata for each available font.

| Field    | Type         | Description                                         |
| -------- | ------------ | --------------------------------------------------- |
| name     | string       | Display name (e.g., "Inter")                        |
| family   | string       | CSS font-family value (e.g., "'Inter', sans-serif") |
| category | FontCategory | serif, sans-serif, display, handwriting, monospace  |
| weights  | number[]     | Available weights (e.g., [400, 500, 600, 700])      |

### WebsiteSetting (Existing Entity - Extended)

Existing entity with new factory method.

**New factory method**:

- `createWebsiteFont(font: WebsiteFont)`: Creates setting with key `website-font`
- `createDefaultWebsiteFont()`: Creates setting with default font "Inter"

## Constants

### VALID_SETTING_KEYS (Extended)

```typescript
export const VALID_SETTING_KEYS = {
  WEBSITE_NAME: 'website-name',
  WEBSITE_ICON: 'website-icon',
  THEME_COLOR: 'theme-color',
  HEADER_LOGO: 'header-logo',
  WEBSITE_FONT: 'website-font', // NEW
} as const;
```

### AVAILABLE_FONTS

Curated list of Google Fonts organized by category.

```typescript
export const FONT_CATEGORIES = {
  SANS_SERIF: 'sans-serif',
  SERIF: 'serif',
  DISPLAY: 'display',
  HANDWRITING: 'handwriting',
  MONOSPACE: 'monospace',
} as const;

export const AVAILABLE_FONTS: FontMetadata[] = [
  // Sans-serif
  {
    name: 'Inter',
    family: "'Inter', sans-serif",
    category: 'sans-serif',
    weights: [400, 500, 600, 700],
  },
  {
    name: 'Roboto',
    family: "'Roboto', sans-serif",
    category: 'sans-serif',
    weights: [400, 500, 700],
  },
  {
    name: 'Open Sans',
    family: "'Open Sans', sans-serif",
    category: 'sans-serif',
    weights: [400, 600, 700],
  },
  {
    name: 'Lato',
    family: "'Lato', sans-serif",
    category: 'sans-serif',
    weights: [400, 700],
  },
  {
    name: 'Montserrat',
    family: "'Montserrat', sans-serif",
    category: 'sans-serif',
    weights: [400, 500, 600, 700],
  },
  {
    name: 'Poppins',
    family: "'Poppins', sans-serif",
    category: 'sans-serif',
    weights: [400, 500, 600, 700],
  },
  {
    name: 'Nunito',
    family: "'Nunito', sans-serif",
    category: 'sans-serif',
    weights: [400, 600, 700],
  },
  {
    name: 'Raleway',
    family: "'Raleway', sans-serif",
    category: 'sans-serif',
    weights: [400, 500, 600, 700],
  },
  {
    name: 'Work Sans',
    family: "'Work Sans', sans-serif",
    category: 'sans-serif',
    weights: [400, 500, 600, 700],
  },
  {
    name: 'Quicksand',
    family: "'Quicksand', sans-serif",
    category: 'sans-serif',
    weights: [400, 500, 600, 700],
  },

  // Serif
  {
    name: 'Playfair Display',
    family: "'Playfair Display', serif",
    category: 'serif',
    weights: [400, 500, 600, 700],
  },
  {
    name: 'Merriweather',
    family: "'Merriweather', serif",
    category: 'serif',
    weights: [400, 700],
  },
  {
    name: 'Lora',
    family: "'Lora', serif",
    category: 'serif',
    weights: [400, 500, 600, 700],
  },
  {
    name: 'Crimson Text',
    family: "'Crimson Text', serif",
    category: 'serif',
    weights: [400, 600, 700],
  },
  {
    name: 'Source Serif Pro',
    family: "'Source Serif Pro', serif",
    category: 'serif',
    weights: [400, 600, 700],
  },
  {
    name: 'Libre Baskerville',
    family: "'Libre Baskerville', serif",
    category: 'serif',
    weights: [400, 700],
  },
  {
    name: 'PT Serif',
    family: "'PT Serif', serif",
    category: 'serif',
    weights: [400, 700],
  },

  // Display
  {
    name: 'Oswald',
    family: "'Oswald', sans-serif",
    category: 'display',
    weights: [400, 500, 600, 700],
  },
  {
    name: 'Bebas Neue',
    family: "'Bebas Neue', sans-serif",
    category: 'display',
    weights: [400],
  },
  {
    name: 'Anton',
    family: "'Anton', sans-serif",
    category: 'display',
    weights: [400],
  },
  {
    name: 'Archivo Black',
    family: "'Archivo Black', sans-serif",
    category: 'display',
    weights: [400],
  },
  {
    name: 'Righteous',
    family: "'Righteous', sans-serif",
    category: 'display',
    weights: [400],
  },

  // Handwriting
  {
    name: 'Dancing Script',
    family: "'Dancing Script', cursive",
    category: 'handwriting',
    weights: [400, 500, 600, 700],
  },
  {
    name: 'Pacifico',
    family: "'Pacifico', cursive",
    category: 'handwriting',
    weights: [400],
  },
  {
    name: 'Caveat',
    family: "'Caveat', cursive",
    category: 'handwriting',
    weights: [400, 500, 600, 700],
  },
  {
    name: 'Satisfy',
    family: "'Satisfy', cursive",
    category: 'handwriting',
    weights: [400],
  },
  {
    name: 'Great Vibes',
    family: "'Great Vibes', cursive",
    category: 'handwriting',
    weights: [400],
  },

  // Monospace
  {
    name: 'Fira Code',
    family: "'Fira Code', monospace",
    category: 'monospace',
    weights: [400, 500, 600, 700],
  },
  {
    name: 'Source Code Pro',
    family: "'Source Code Pro', monospace",
    category: 'monospace',
    weights: [400, 500, 600, 700],
  },
  {
    name: 'JetBrains Mono',
    family: "'JetBrains Mono', monospace",
    category: 'monospace',
    weights: [400, 500, 600, 700],
  },
  {
    name: 'Roboto Mono',
    family: "'Roboto Mono', monospace",
    category: 'monospace',
    weights: [400, 500, 700],
  },
];

export const DEFAULT_FONT = 'Inter';
```

## Relationships

```
WebsiteSetting (key: 'website-font')
    └── value: string (font name, e.g., "Inter")
           └── validated against AVAILABLE_FONTS
           └── used by WebsiteFont value object
```

## Database Schema

Uses existing `website_settings` collection:

```json
{
  "_id": ObjectId,
  "key": "website-font",
  "value": "Inter",
  "createdAt": Date,
  "updatedAt": Date
}
```

## Validation Rules

| Rule             | Description                               |
| ---------------- | ----------------------------------------- |
| Font must exist  | Font name must be in AVAILABLE_FONTS list |
| Non-empty        | Font name cannot be empty string          |
| Default fallback | If invalid, return default font "Inter"   |
