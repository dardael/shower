import { test, expect } from '@playwright/test';

test.describe('Public pages', () => {
  test('home page loads successfully', async ({ page }) => {
    await page.goto('/');

    // Should not redirect and should load without authentication
    await expect(page).toHaveURL('/');

    // Basic smoke test - should have some content
    await expect(page.locator('body')).toBeVisible();
  });

  test('admin page requires authentication', async ({ page }) => {
    await page.context().clearCookies();

    await page.goto('/admin');

    // Should show login prompt
    await expect(page.locator('h1')).toHaveText(
      'Sign in to access the Admin Dashboard'
    );

    // Should have login button
    await expect(page.locator('text=Sign in with Google')).toBeVisible();
  });
});
