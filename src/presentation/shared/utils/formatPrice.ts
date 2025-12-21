/**
 * Format a price value as a currency string.
 * @param price - The price value to format
 * @param currency - The currency code (default: 'EUR')
 * @param locale - The locale for formatting (default: 'fr-FR')
 * @returns Formatted price string
 */
export function formatPrice(
  price: number,
  currency: string = 'EUR',
  locale: string = 'fr-FR'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(price);
}
