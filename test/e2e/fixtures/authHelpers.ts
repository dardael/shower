import { Page } from '@playwright/test';

/**
 * Signs in a user for testing purposes
 *
 * @param page - Playwright page instance
 * @param isAdmin - Whether the user should have admin privileges (default: true)
 *
 * Usage examples:
 * - signIn(page) // Signs in as admin using environment email
 * - signIn(page, false) // Signs in as non-admin user
 */
export async function signIn(
  page: Page,
  isAdmin: boolean = true
): Promise<void> {
  // Get appropriate email based on admin status
  const email = isAdmin
    ? process.env.ADMIN_EMAIL ||
      process.env.TEST_EMAIL ||
      'shower.test.playwrights@gmail.com'
    : 'non-admin@example.com';

  // Use the original test auth endpoint
  const response = await page.request.post('/api/test/auth', {
    data: { email, isAdmin },
    headers: {
      'X-Test-Auth': 'true',
    },
  });

  if (!response.ok()) {
    throw new Error(`Failed to authenticate: ${response.statusText()}`);
  }

  // Get the response headers to extract cookies
  const responseHeaders = response.headers();
  const setCookieHeader = responseHeaders['set-cookie'];

  if (setCookieHeader) {
    // Parse the Set-Cookie header and add cookies to the browser context
    const cookies = Array.isArray(setCookieHeader)
      ? setCookieHeader
      : [setCookieHeader];

    for (const cookie of cookies) {
      const [cookieNameValue] = cookie.split(';');
      if (cookieNameValue && cookieNameValue.includes('=')) {
        const [name, value] = cookieNameValue.split('=');
        await page.context().addCookies([
          {
            name: name.trim(),
            value: value.trim(),
            domain: 'localhost',
            path: '/',
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
          },
        ]);
      }
    }
  }

  await page.goto('/admin');
}
