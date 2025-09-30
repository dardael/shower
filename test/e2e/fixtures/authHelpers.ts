import { Page } from '@playwright/test';

export async function signIn(
  page: Page,
  email: string = 'test@example.com',
  isAdmin: boolean = true
): Promise<void> {
  const response = await page.request.post('/api/test/auth', {
    data: { email, isAdmin },
    headers: {
      'X-Test-Auth': 'true',
    },
  });

  if (!response.ok()) {
    throw new Error(`Failed to authenticate: ${response.statusText()}`);
  }

  await page.goto('/admin');
}
