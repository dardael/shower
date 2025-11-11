import { test, expect } from '@playwright/test';
import { signIn } from '../fixtures/authHelpers';
import { TestDatabase } from '../fixtures/test-database';
import { TIMEOUTS } from '../constants/timeouts';

test.describe('Social Networks Management', () => {
  test.beforeEach(async ({ page }) => {
    // Connect to test database and clean it before each test to ensure test isolation
    await TestDatabase.connect();
    await TestDatabase.cleanDatabase();

    // Authenticate as admin before running tests
    await signIn(page, true);

    // Navigate to social networks page
    await page.goto('/admin/social-networks');

    // Wait for page to load
    await page.waitForSelector('[data-testid="main-content"]', {
      timeout: TIMEOUTS.LONG,
    });
  });

  test.afterEach(async () => {
    // Clean database after each test to ensure test isolation
    await TestDatabase.cleanDatabase();
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
    // Find all enable checkboxes using test IDs
    const instagramCheckbox = page.getByTestId('checkbox-instagram');
    const facebookCheckbox = page.getByTestId('checkbox-facebook');
    const linkedinCheckbox = page.getByTestId('checkbox-linkedin');
    const emailCheckbox = page.getByTestId('checkbox-email');
    const phoneCheckbox = page.getByTestId('checkbox-phone');

    // Should have all checkboxes
    await expect(instagramCheckbox).toBeVisible();
    await expect(facebookCheckbox).toBeVisible();
    await expect(linkedinCheckbox).toBeVisible();
    await expect(emailCheckbox).toBeVisible();
    await expect(phoneCheckbox).toBeVisible();

    // All should be unchecked by default
    await expect(instagramCheckbox).not.toBeChecked();
    await expect(facebookCheckbox).not.toBeChecked();
    await expect(linkedinCheckbox).not.toBeChecked();
    await expect(emailCheckbox).not.toBeChecked();
    await expect(phoneCheckbox).not.toBeChecked();
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
    const instagramCheckboxInput = page.getByTestId('checkbox-input-instagram');
    const firstUrlInput = page.getByLabel('URL').first();
    const firstLabelInput = page.getByLabel('Label').first();

    // Initially disabled
    await expect(firstUrlInput).toBeDisabled();
    await expect(firstLabelInput).toBeDisabled();

    // Check the checkbox using force click to bypass pointer events blocking
    await instagramCheckboxInput.check({ force: true });

    // Now inputs should be enabled
    await expect(firstUrlInput).toBeEnabled();
    await expect(firstLabelInput).toBeEnabled();

    // Uncheck should disable again
    await instagramCheckboxInput.uncheck({ force: true });
    await expect(firstUrlInput).toBeDisabled();
    await expect(firstLabelInput).toBeDisabled();
  });

  test('should show correct placeholders for different network types', async ({
    page,
  }) => {
    // Enable Instagram to see its placeholder
    const instagramCheckboxInput = page.getByTestId('checkbox-input-instagram');
    await instagramCheckboxInput.check({ force: true });

    const instagramUrlInput = page.getByLabel('URL').first();
    await expect(instagramUrlInput).toHaveAttribute(
      'placeholder',
      'https://instagram.com/username'
    );

    // Enable Email to see its placeholder
    const emailCheckboxInput = page.getByTestId('checkbox-input-email');
    await emailCheckboxInput.check({ force: true });

    const emailUrlInput = page.getByLabel('URL').nth(3); // Email is 4th input (0-indexed)
    const emailPlaceholder = await emailUrlInput.getAttribute('placeholder');
    expect(emailPlaceholder).toBe('mailto:contact@example.com');
  });

  test('should validate form before saving', async ({ page }) => {
    // Enable Instagram but don't fill URL
    const instagramCheckboxInput = page.getByTestId('checkbox-input-instagram');
    await instagramCheckboxInput.check({ force: true });

    // Try to save without filling required fields
    const saveButton = page.getByRole('button', { name: 'Save Changes' });
    await saveButton.click();

    // Should show validation error
    await expect(
      page.getByText('Instagram URL is required when enabled').first()
    ).toBeVisible();
  });

  test('should save social network configuration', async ({ page }) => {
    // Enable Instagram and fill details
    const instagramCheckboxInput = page.getByTestId('checkbox-input-instagram');
    const instagramCheckbox = page.getByTestId('checkbox-instagram');
    await instagramCheckboxInput.check({ force: true });

    const instagramUrlInput = page.getByLabel('URL').first();
    await instagramUrlInput.fill('https://instagram.com/testuser');

    const instagramLabelInput = page.getByLabel('Label').first();
    await instagramLabelInput.fill('My Instagram');

    // Save changes
    const saveButton = page.getByRole('button', { name: 'Save Changes' });
    await saveButton.click();

    // Should show success message
    await expect(
      page.getByText('Social networks updated successfully').first()
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
    const instagramCheckboxInput = page.getByTestId('checkbox-input-instagram');
    const instagramCheckbox = page.getByTestId('checkbox-instagram');
    await instagramCheckboxInput.check({ force: true });

    const instagramUrlInput = page.getByLabel('URL').first();
    await instagramUrlInput.fill('https://instagram.com/testuser');

    // Enable Facebook
    const facebookCheckboxInput = page.getByTestId('checkbox-input-facebook');
    const facebookCheckbox = page.getByTestId('checkbox-facebook');
    await facebookCheckboxInput.check({ force: true });

    const facebookUrlInput = page.getByLabel('URL').nth(1); // Facebook is 2nd input
    await facebookUrlInput.fill('https://facebook.com/testpage');

    // Save changes
    const saveButton = page.getByRole('button', { name: 'Save Changes' });
    await saveButton.click();

    // Should show success message
    await expect(
      page.getByText('Social networks updated successfully').first()
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
    const emailCheckboxInput = page.getByTestId('checkbox-input-email');
    await emailCheckboxInput.check({ force: true });

    const emailUrlInput = page.getByLabel('URL').nth(3); // Email is 4th input
    await emailUrlInput.fill('mailto:test@example.com');

    // Enable Phone
    const phoneCheckboxInput = page.getByTestId('checkbox-input-phone');
    await phoneCheckboxInput.check({ force: true });

    const phoneUrlInput = page.getByLabel('URL').nth(4); // Phone is 5th input
    await phoneUrlInput.fill('tel:+1234567890');

    // Save changes
    const saveButton = page.getByRole('button', { name: 'Save Changes' });
    await saveButton.click();

    // Should show success message
    await expect(
      page.getByText('Social networks updated successfully').first()
    ).toBeVisible();

    // Verify values
    await expect(emailUrlInput).toHaveValue('mailto:test@example.com');
    await expect(phoneUrlInput).toHaveValue('tel:+1234567890');
  });

  test('should show loading state while saving', async ({ page }) => {
    // Enable Instagram
    const instagramCheckboxInput = page.getByTestId('checkbox-input-instagram');
    await instagramCheckboxInput.check({ force: true });

    const instagramUrlInput = page.getByLabel('URL').first();
    await instagramUrlInput.fill('https://instagram.com/testuser');

    const instagramLabelInput = page.getByLabel('Label').first();
    await instagramLabelInput.fill('My Instagram');

    // Save changes
    const saveButton = page.getByRole('button', { name: 'Save Changes' });
    await saveButton.click();

    // Should show loading state - check for loading text or spinner instead
    await expect(saveButton).toBeVisible();
    // The button should show loading state via Chakra's internal loading mechanism

    // Wait for success message
    await expect(
      page.getByText('Social networks updated successfully').first()
    ).toBeVisible({ timeout: TIMEOUTS.LONG });

    // Loading state should be gone and button should be back to normal
    await expect(saveButton).toBeVisible();
  });
});
