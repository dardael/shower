import { test, expect } from '@playwright/test';
import { signIn } from '../fixtures/authHelpers';

test.describe('Social Networks Management', () => {
  test.beforeEach(async ({ page }) => {
    // Authenticate as admin before running tests
    await signIn(page, true);

    // Wait for admin dashboard to load
    await page.waitForSelector('h1', { timeout: 10000 });
  });

  test('should display social networks section', async ({ page }) => {
    // Check if Social Networks section is visible
    await expect(
      page.getByRole('heading', { name: 'Social Networks' })
    ).toBeVisible();

    // Check if description is visible
    await expect(
      page.getByText('Configure your social network links')
    ).toBeVisible();

    // Check if all social network types are displayed
    await expect(page.getByText('Instagram')).toBeVisible();
    await expect(page.getByText('Facebook')).toBeVisible();
    await expect(page.getByText('LinkedIn')).toBeVisible();
    await expect(page.getByText('Email')).toBeVisible();
    await expect(page.getByText('Phone')).toBeVisible();
  });

  test('should display enable/disable checkboxes for each network', async ({
    page,
  }) => {
    // Find all enable checkboxes
    const checkboxes = page.getByLabel('Enable');

    // Should have 5 checkboxes (one for each network type)
    await expect(checkboxes).toHaveCount(5);

    // All should be unchecked by default
    for (let i = 0; i < 5; i++) {
      await expect(checkboxes.nth(i)).not.toBeChecked();
    }
  });

  test('should display URL and label input fields', async ({ page }) => {
    // Check URL input fields
    const urlInputs = page.getByLabel('URL');
    await expect(urlInputs).toHaveCount(5);

    // Check label input fields
    const labelInputs = page.getByLabel('Label');
    await expect(labelInputs).toHaveCount(5);

    // Check that inputs are disabled by default
    for (let i = 0; i < 5; i++) {
      await expect(urlInputs.nth(i)).toBeDisabled();
      await expect(labelInputs.nth(i)).toBeDisabled();
    }
  });

  test('should enable inputs when checkbox is checked', async ({ page }) => {
    // Find the first enable checkbox (Instagram)
    const firstCheckbox = page.getByLabel('Enable').first();
    const firstUrlInput = page.getByLabel('URL').first();
    const firstLabelInput = page.getByLabel('Label').first();

    // Initially disabled
    await expect(firstUrlInput).toBeDisabled();
    await expect(firstLabelInput).toBeDisabled();

    // Check the checkbox
    await firstCheckbox.check();

    // Now inputs should be enabled
    await expect(firstUrlInput).toBeEnabled();
    await expect(firstLabelInput).toBeEnabled();

    // Uncheck should disable again
    await firstCheckbox.uncheck();
    await expect(firstUrlInput).toBeDisabled();
    await expect(firstLabelInput).toBeDisabled();
  });

  test('should show correct placeholders for different network types', async ({
    page,
  }) => {
    // Enable Instagram to see its placeholder
    const instagramCheckbox = page.getByLabel('Enable').first();
    await instagramCheckbox.check();

    const instagramUrlInput = page.getByLabel('URL').first();
    await expect(instagramUrlInput).toHaveAttribute(
      'placeholder',
      'https://instagram.com/username'
    );

    // Enable Email to see its placeholder
    const emailCheckbox = page
      .getByLabel('Enable')
      .filter({ has: page.getByText('Email') });
    await emailCheckbox.check();

    const emailUrlInput = page.getByLabel('URL').nth(3); // Email is 4th input (0-indexed)
    const emailPlaceholder = await emailUrlInput.getAttribute('placeholder');
    expect(emailPlaceholder).toBe('mailto:contact@example.com');
  });

  test('should validate form before saving', async ({ page }) => {
    // Enable Instagram but don't fill URL
    const instagramCheckbox = page.getByLabel('Enable').first();
    await instagramCheckbox.check();

    // Try to save without filling required fields
    const saveButton = page.getByRole('button', { name: 'Save Changes' });
    await saveButton.click();

    // Should show validation error
    await expect(
      page.getByText('Instagram URL is required when enabled')
    ).toBeVisible();
  });

  test('should save social network configuration', async ({ page }) => {
    // Enable Instagram and fill details
    const instagramCheckbox = page.getByLabel('Enable').first();
    await instagramCheckbox.check();

    const instagramUrlInput = page.getByLabel('URL').first();
    await instagramUrlInput.fill('https://instagram.com/testuser');

    const instagramLabelInput = page.getByLabel('Label').first();
    await instagramLabelInput.fill('My Instagram');

    // Save changes
    const saveButton = page.getByRole('button', { name: 'Save Changes' });
    await saveButton.click();

    // Should show success message
    await expect(
      page.getByText('Social networks updated successfully')
    ).toBeVisible();

    // Verify the values are still there after save
    await expect(instagramCheckbox).toBeChecked();
    await expect(instagramUrlInput).toHaveValue(
      'https://instagram.com/testuser'
    );
    await expect(instagramLabelInput).toHaveValue('My Instagram');
  });

  test('should handle multiple social networks', async ({ page }) => {
    // Enable Instagram
    const instagramCheckbox = page.getByLabel('Enable').first();
    await instagramCheckbox.check();

    const instagramUrlInput = page.getByLabel('URL').first();
    await instagramUrlInput.fill('https://instagram.com/testuser');

    // Enable Facebook
    const facebookCheckbox = page
      .getByLabel('Enable')
      .filter({ has: page.getByText('Facebook') });
    await facebookCheckbox.check();

    const facebookUrlInput = page
      .getByLabel('URL')
      .filter({ has: page.getByText('Facebook') })
      .first();
    await facebookUrlInput.fill('https://facebook.com/testpage');

    // Save changes
    const saveButton = page.getByRole('button', { name: 'Save Changes' });
    await saveButton.click();

    // Should show success message
    await expect(
      page.getByText('Social networks updated successfully')
    ).toBeVisible();

    // Verify both networks are enabled and saved
    await expect(instagramCheckbox).toBeChecked();
    await expect(facebookCheckbox).toBeChecked();
    await expect(instagramUrlInput).toHaveValue(
      'https://instagram.com/testuser'
    );
    await expect(facebookUrlInput).toHaveValue('https://facebook.com/testpage');
  });

  test('should handle email and phone networks with special protocols', async ({
    page,
  }) => {
    // Enable Email
    const emailCheckbox = page
      .getByLabel('Enable')
      .filter({ has: page.getByText('Email') });
    await emailCheckbox.check();

    const emailUrlInput = page.getByLabel('URL').nth(3); // Email is 4th input
    await emailUrlInput.fill('mailto:test@example.com');

    // Enable Phone
    const phoneCheckbox = page
      .getByLabel('Enable')
      .filter({ has: page.getByText('Phone') });
    await phoneCheckbox.check();

    const phoneUrlInput = page.getByLabel('URL').nth(4); // Phone is 5th input
    await phoneUrlInput.fill('tel:+1234567890');

    // Save changes
    const saveButton = page.getByRole('button', { name: 'Save Changes' });
    await saveButton.click();

    // Should show success message
    await expect(
      page.getByText('Social networks updated successfully')
    ).toBeVisible();

    // Verify values
    await expect(emailUrlInput).toHaveValue('mailto:test@example.com');
    await expect(phoneUrlInput).toHaveValue('tel:+1234567890');
  });

  test('should show loading state while saving', async ({ page }) => {
    // Enable Instagram
    const instagramCheckbox = page.getByLabel('Enable').first();
    await instagramCheckbox.check();

    const instagramUrlInput = page.getByLabel('URL').first();
    await instagramUrlInput.fill('https://instagram.com/testuser');

    const instagramLabelInput = page.getByLabel('Label').first();
    await instagramLabelInput.fill('My Instagram');

    // Save changes
    const saveButton = page.getByRole('button', { name: 'Save Changes' });
    await saveButton.click();

    // Should show loading state
    await expect(saveButton).toHaveAttribute('data-loading', 'true');

    // Wait for success message
    await expect(
      page.getByText('Social networks updated successfully')
    ).toBeVisible({ timeout: 10000 });

    // Loading state should be gone
    await expect(saveButton).not.toHaveAttribute('data-loading', 'true');
  });
});
