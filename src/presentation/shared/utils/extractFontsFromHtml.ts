/**
 * Extracts unique font family names from HTML content with inline font-family styles
 * and from overlay data attributes.
 * Used to determine which fonts need to be loaded for public page rendering.
 *
 * @param html - HTML content that may contain inline font-family styles or overlay fonts
 * @returns Array of unique font names found in the content
 *
 * @example
 * ```typescript
 * const html = '<span style="font-family: Pacifico">text</span>';
 * const fonts = extractFontsFromHtml(html);
 * // fonts = ['Pacifico']
 * ```
 *
 * @example
 * ```typescript
 * const html = '<div data-overlay-font="Roboto">overlay</div>';
 * const fonts = extractFontsFromHtml(html);
 * // fonts = ['Roboto']
 * ```
 */
export function extractFontsFromHtml(html: string): string[] {
  if (!html) {
    return [];
  }

  const fonts = new Set<string>();

  // Match font-family with or without quotes: font-family: Pacifico; or font-family: 'Pacifico'; or font-family: "Pacifico";
  // Also handles font names with spaces like: font-family: Dancing Script;
  const fontFamilyRegex = /font-family:\s*(?:'([^']+)'|"([^"]+)"|([^;'"]+))/g;

  let match: RegExpExecArray | null;
  while ((match = fontFamilyRegex.exec(html)) !== null) {
    // match[1] = single-quoted font, match[2] = double-quoted font, match[3] = unquoted font
    const fontName = (match[1] || match[2] || match[3]).trim();
    if (fontName) {
      fonts.add(fontName);
    }
  }

  // Match overlay font data attributes: data-overlay-font="FontName"
  const overlayFontRegex = /data-overlay-font=["']([^"']+)["']/g;

  while ((match = overlayFontRegex.exec(html)) !== null) {
    const fontName = match[1].trim();
    if (fontName) {
      fonts.add(fontName);
    }
  }

  return Array.from(fonts);
}
