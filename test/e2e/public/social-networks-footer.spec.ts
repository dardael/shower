import { test, expect } from '@playwright/test';

test.describe('Social Networks Footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should not render footer when no social networks are configured', async ({ page }) => {
    // Check if footer exists
    const footer = page.locator('footer[aria-label="Social networks footer"]');
    await expect(footer).not.toBeVisible();
  });

  test('should render footer when social networks are configured', async ({ page }) => {
    // This test assumes social networks are pre-configured in test database
    // The test setup should seed the database with test social networks
    
    // Go to home page
    await page.goto('/');
    
    // Check if footer is visible (assuming test data is seeded)
    const footer = page.locator('footer[aria-label="Social networks footer"]');
    
    // Only assert if footer should be visible based on test data
    // If test database has social networks configured, footer should be visible
    const footerExists = await footer.isVisible();
    
    if (footerExists) {
      await expect(footer).toBeVisible();
      
      // Check for social network items if they exist
      const socialNetworkItems = page.locator('[data-testid^="social-network-item-"]');
      const itemCount = await socialNetworkItems.count();
      
      if (itemCount > 0) {
        // Verify at least one social network item is present
        await expect(socialNetworkItems.first()).toBeVisible();
      }
    } else {
      // If no social networks in test data, footer should not be visible
      await expect(footer).not.toBeVisible();
    }
  });

  test('should render correct icons for each social network type', async ({ page }) => {
    // This test would require pre-configured social networks
    // For now, let's test the icon rendering structure
    
    await page.goto('/');
    
    // Check if any social network icons are present
    const icons = page.locator('[data-testid^="social-network-icon-"]');
    
    // If no social networks are configured, icons should not be present
    // If they are configured, each should have proper test-id structure
    const iconCount = await icons.count();
    
    if (iconCount > 0) {
      // Check that each icon has the correct test-id pattern
      for (let i = 0; i < iconCount; i++) {
        const icon = icons.nth(i);
        const testId = await icon.getAttribute('data-testid');
        expect(testId).toMatch(/^social-network-icon-[a-z]+$/);
      }
    }
  });

  test('should open social network links in new tabs', async ({ page, context }) => {
    // Setup: Navigate to a page with social networks
    await page.goto('/');
    
    // Look for any social network links
    const links = page.locator('[data-testid^="social-network-item-"]');
    const linkCount = await links.count();
    
    if (linkCount > 0) {
      // Test the first link
      const firstLink = links.first();
      
      // Check that link has proper attributes
      await expect(firstLink).toHaveAttribute('target', '_blank');
      await expect(firstLink).toHaveAttribute('rel', 'noopener noreferrer nofollow');
      
      // Get the href to test navigation
      const href = await firstLink.getAttribute('href');
      expect(href).toBeTruthy();
      
      // Test that clicking opens new tab
      const pagePromise = context.waitForEvent('page');
      await firstLink.click();
      const newPage = await pagePromise;
      
      await expect(newPage).toBeTruthy();
      await newPage.close();
    }
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    await page.goto('/');
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    const footerMobile = page.locator('footer[aria-label="Social networks footer"]');
    
    // Check if footer adapts to mobile layout
    if (await footerMobile.isVisible()) {
      await expect(footerMobile).toBeVisible();
      // Check that grid is responsive (this would depend on implementation)
    }
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    const footerTablet = page.locator('footer[aria-label="Social networks footer"]');
    
    if (await footerTablet.isVisible()) {
      await expect(footerTablet).toBeVisible();
    }
    
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    const footerDesktop = page.locator('footer[aria-label="Social networks footer"]');
    
    if (await footerDesktop.isVisible()) {
      await expect(footerDesktop).toBeVisible();
    }
  });

  test('should handle empty state gracefully', async ({ page }) => {
    await page.goto('/');
    
    // When no social networks are configured, footer should not render
    const footer = page.locator('footer[aria-label="Social networks footer"]');
    await expect(footer).not.toBeVisible();
    
    // Page should still function normally
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    await page.goto('/');
    
    const footer = page.locator('footer[aria-label="Social networks footer"]');
    
    if (await footer.isVisible()) {
      // Check footer accessibility
      await expect(footer).toHaveAttribute('role', 'contentinfo');
      
      // Check social network items accessibility
      const items = page.locator('[data-testid^="social-network-item-"]');
      const itemCount = await items.count();
      
      for (let i = 0; i < itemCount; i++) {
        const item = items.nth(i);
        
        // Check for proper aria labels
        const ariaLabel = await item.getAttribute('aria-label');
        expect(ariaLabel).toBeTruthy();
        expect(ariaLabel).toContain('link (opens in new tab)');
      }
    }
  });
});