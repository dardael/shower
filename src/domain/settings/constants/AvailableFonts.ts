/**
 * Font category types for organizing fonts in the selector
 */
export type FontCategory =
  | 'sans-serif'
  | 'serif'
  | 'display'
  | 'handwriting'
  | 'monospace';

/**
 * Display labels for font categories
 */
export const FONT_CATEGORY_LABELS: Record<FontCategory, string> = {
  'sans-serif': 'Sans Serif',
  serif: 'Serif',
  display: 'Display',
  handwriting: 'Handwriting',
  monospace: 'Monospace',
};

/**
 * Metadata for each available font
 */
export interface FontMetadata {
  name: string;
  family: string;
  category: FontCategory;
  weights: number[];
}

/**
 * Curated list of available Google Fonts organized by category
 */
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

/**
 * Default font for the website
 */
export const DEFAULT_FONT = 'Inter';

/**
 * Gets font metadata by name
 */
export function getFontByName(name: string): FontMetadata | undefined {
  return AVAILABLE_FONTS.find(
    (font) => font.name.toLowerCase() === name.toLowerCase()
  );
}

/**
 * Validates if a font name is in the available fonts list
 */
export function isValidFont(fontName: unknown): fontName is string {
  if (typeof fontName !== 'string') {
    return false;
  }
  if (!fontName || fontName.length === 0 || fontName.length > 50) {
    return false;
  }
  return AVAILABLE_FONTS.some(
    (font) => font.name.toLowerCase() === fontName.toLowerCase()
  );
}

/**
 * Gets fonts grouped by category
 */
export function getFontsByCategory(): Record<FontCategory, FontMetadata[]> {
  return AVAILABLE_FONTS.reduce(
    (acc, font) => {
      if (!acc[font.category]) {
        acc[font.category] = [];
      }
      acc[font.category].push(font);
      return acc;
    },
    {} as Record<FontCategory, FontMetadata[]>
  );
}

/**
 * Gets formatted error message for invalid fonts
 */
export function getFontErrorMessage(): string {
  return `Invalid font name. Must be one of the available fonts.`;
}
