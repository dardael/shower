import { test, expect } from '@playwright/test';
import { signIn } from '../fixtures/authHelpers';
import { TIMEOUTS } from '../constants/timeouts';

test.describe('Theme Color Management', () => {
  test('should display theme color selector in website settings', async ({
    page,
  }) => {
    await signIn(page, true);

    // Wait for page to load and find theme color section
    await expect(page.getByTestId('theme-color-label')).toBeVisible({
      timeout: TIMEOUTS.LONG,
    });

    // Check that color buttons are present
    const colorButtons = page.locator('button[aria-label*="Select"]');
    await expect(colorButtons).toHaveCount(8); // 8 colors in palette
  });

  test('should show currently selected theme color', async ({ page }) => {
    await signIn(page, true);

    // Find selected color button (should have data-selected="true")
    const selectedButton = page.locator('button[data-selected="true"]');
    await expect(selectedButton).toBeVisible({ timeout: TIMEOUTS.LONG });
  });

  test('should change theme color when clicking different color', async ({
    page,
  }) => {
    await signIn(page, true);

    // Wait for theme color section to be visible
    await expect(page.getByTestId('theme-color-label')).toBeVisible({
      timeout: TIMEOUTS.LONG,
    });

    // Find and click on a different color (e.g., red)
    const redButton = page.locator('button[aria-label*="Select red"]');
    await redButton.click();

    // Verify red button is now selected
    await expect(redButton).toHaveAttribute('data-selected', 'true');
  });

  test('should display helper text for theme color selection', async ({
    page,
  }) => {
    await signIn(page, true);

    // Check for helper text
    await expect(
      page.getByText('Select a color to customize your website theme')
    ).toBeVisible({ timeout: TIMEOUTS.LONG });
  });
});
