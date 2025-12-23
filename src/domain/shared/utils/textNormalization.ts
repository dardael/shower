/**
 * Normalizes text for accent-insensitive and case-insensitive comparison.
 * Uses Unicode NFD normalization to decompose accented characters,
 * then removes diacritical marks.
 *
 * @example
 * normalizeText('Hélène') // returns 'helene'
 * normalizeText('DUPONT') // returns 'dupont'
 * normalizeText('Élève') // returns 'eleve'
 */
export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/**
 * Checks if the search text is contained in the target text,
 * using accent-insensitive and case-insensitive matching.
 *
 * @example
 * containsNormalized('Hélène Martin', 'helene') // returns true
 * containsNormalized('Jean Dupont', 'dup') // returns true
 * containsNormalized('Pierre', 'marie') // returns false
 */
export function containsNormalized(target: string, search: string): boolean {
  if (!search) {
    return true;
  }
  return normalizeText(target).includes(normalizeText(search));
}
