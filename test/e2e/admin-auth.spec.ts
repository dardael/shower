import { test, expect } from '@playwright/test';

test.describe('/admin authentication flow', () => {
  test('shows login prompt for unauthenticated user', async ({ page }) => {
    // Clear any existing auth cookies to ensure unauthenticated state
    await page.context().clearCookies();

    await page.goto('/admin');

    // Should show the login prompt since user is not authenticated
    await expect(page.locator('h1')).toHaveText(
      'Sign in to access the Admin Dashboard'
    );

    // Should have the Google login button
    await expect(page.locator('text=Sign in with Google')).toBeVisible();
  });
});
