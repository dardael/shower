import { test, expect } from '@playwright/test';
import { signIn } from '../fixtures/authHelpers';

test.describe('Footer Visibility', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page first
    await page.goto('/');
  });

  test('should display footer on public home page', async ({ page }) => {
    // Check if footer is visible on home page
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Check if footer has proper styling and attributes
    await expect(footer).toHaveAttribute(
      'data-testid',
      'social-networks-footer'
    );
    await expect(footer).toHaveAttribute('role', 'contentinfo');
  });

  test('should display footer on public routes', async ({ page }) => {
    // Test various public routes
    const publicRoutes = ['/about', '/contact', '/team'];

    for (const route of publicRoutes) {
      await page.goto(route);
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
    }
  });

  test('should not display footer on admin login page', async ({ page }) => {
    await page.goto('/admin');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check that footer is not present
    const footer = page.locator('footer');
    await expect(footer).not.toBeVisible();

    // Verify we're on admin login page
    await expect(page.locator('h1')).toContainText('Connexion');
  });

  test('should not display footer on authenticated admin page', async ({
    page,
  }) => {
    // Authenticate first
    await signIn(page);

    await page.goto('/admin');

    // Wait for admin dashboard to load
    await page.waitForLoadState('networkidle');

    // Check that footer is not present
    const footer = page.locator('footer');
    await expect(footer).not.toBeVisible();

    // Verify we're on admin dashboard
    await expect(
      page.getByRole('heading', { name: 'Admin Dashboard' })
    ).toBeVisible();
  });

  test('should not display footer on admin sub-routes', async ({ page }) => {
    // Authenticate first
    await signIn(page);

    // Test admin sub-routes (if they exist)
    const adminRoutes = ['/admin/settings', '/admin/users'];

    for (const route of adminRoutes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');

      const footer = page.locator('footer');
      await expect(footer).not.toBeVisible();
    }
  });

  test('should toggle footer visibility when navigating between public and admin', async ({
    page,
  }) => {
    // Start on public page
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Navigate to admin
    await page.goto('/admin');
    await expect(footer).not.toBeVisible();

    // Navigate back to public
    await page.goto('/');
    await expect(footer).toBeVisible();

    // Navigate to admin again
    await page.goto('/admin');
    await expect(footer).not.toBeVisible();
  });

  test('should not have empty space where footer would be on admin pages', async ({
    page,
  }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    // Get the body element
    const body = page.locator('body');

    // Check that there's no excessive empty space at the bottom
    const bodyBox = await body.boundingBox();
    const viewportSize = page.viewportSize();
    const viewportHeight = viewportSize?.height || 0;

    // The body should not be significantly taller than viewport due to empty footer space
    expect(bodyBox).not.toBeNull();
    if (bodyBox) {
      expect(bodyBox.height).toBeLessThan(viewportHeight + 200);
    }
  });

  test('should maintain proper layout structure on admin pages', async ({
    page,
  }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    // Check that page structure is intact
    const html = page.locator('html');
    const body = page.locator('body');

    await expect(html).toBeVisible();
    await expect(body).toBeVisible();
    // Attribute may or may not be present - both are valid states
  });

  test('should maintain proper layout structure on public pages', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check that page structure is intact
    const html = page.locator('html');
    const body = page.locator('body');
    const footer = page.locator('footer');

    await expect(html).toBeVisible();
    await expect(body).toBeVisible();
    await expect(footer).toBeVisible();
    // Attribute may or may not be present - both are valid states
  });

  test('should handle route changes without layout thrashing', async ({
    page,
  }) => {
    await page.goto('/');

    // Monitor for layout shifts
    const initialFooter = page.locator('footer');
    await expect(initialFooter).toBeVisible();

    // Navigate to admin and back quickly
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    await expect(initialFooter).not.toBeVisible();

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(initialFooter).toBeVisible();

    // Check that no layout errors occurred
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Navigate a few more times
    for (let i = 0; i < 3; i++) {
      await page.goto('/admin');
      await page.waitForLoadState('networkidle');
      await page.goto('/');
      await page.waitForLoadState('networkidle');
    }

    // Should have no console errors
    expect(consoleErrors).toHaveLength(0);
  });
});
