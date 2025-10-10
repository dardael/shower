import { Page } from '@playwright/test';

export async function signIn(
  page: Page,
  email: string = 'test@example.com',
  isAdmin: boolean = true
): Promise<void> {
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
