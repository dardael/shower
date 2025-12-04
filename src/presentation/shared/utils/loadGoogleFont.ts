/**
 * Dynamically loads a Google Font by creating a link element in the document head.
 * Uses the Google Fonts CSS API v2 for optimal font loading.
 * Prevents duplicate font loading by tracking loaded fonts via link element IDs.
 *
 * @param fontName - The name of the font to load (e.g., 'Inter', 'Playfair Display')
 */
export function loadGoogleFont(fontName: string): void {
  if (typeof document === 'undefined') {
    return;
  }

  const linkId = `google-font-${fontName.replace(/\s+/g, '-').toLowerCase()}`;

  if (document.getElementById(linkId)) {
    return;
  }

  const link = document.createElement('link');
  link.id = linkId;
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;500;600;700&display=swap`;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}
