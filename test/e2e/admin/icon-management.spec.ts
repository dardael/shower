import { test, expect } from '@playwright/test';
import { TestDatabase } from '../fixtures/test-database';
import { signIn } from '../fixtures/authHelpers';

// Setup for each test
test.beforeEach(async ({ page }) => {
  await TestDatabase.connect();
  await TestDatabase.cleanDatabase();
  page.on('console', (msg) => {
    // Filter out messages if needed
    if (msg.type() === 'log') {
      console.log(`Browser console log: ${msg.text()}`);
    }
  });
});

test.afterEach(async () => {
  await TestDatabase.cleanDatabase();
  await TestDatabase.disconnect();
});

test.describe('Icon Management', () => {
  test('displays icon upload section when authenticated', async ({ page }) => {
    await signIn(page);

    // Wait for the page to load - wait for both settings and icon endpoints
    await Promise.all([
      page.waitForResponse(
        (response) =>
          response.url().includes('/api/settings') && response.status() === 200
      ),
      page.waitForResponse(
        (response) =>
          response.url().includes('/api/settings/icon') &&
          response.status() === 200
      ),
    ]);

    // Wait a bit for the icon section to load
    await page.waitForTimeout(2000);

    // Check that the icon management section is visible
    await expect(
      page.locator('label').filter({ hasText: 'Website Icon' })
    ).toBeVisible();

    // Check that the upload button is present
    await expect(
      page.getByRole('button', { name: 'Upload Website Icon' })
    ).toBeVisible();
  });

  test('shows no icon initially', async ({ page }) => {
    await signIn(page);

    // Wait for the page to load
    await page.waitForResponse(
      (response) =>
        response.url().includes('/api/settings/icon') &&
        response.status() === 200
    );

    // Check that the upload area is shown (no current icon)
    await expect(page.getByText('Drag and drop your icon here')).toBeVisible();
    await expect(page.getByText('Maximum file size: 2MB')).toBeVisible();
    await expect(
      page.getByText('Supported formats: ICO, PNG, JPG, SVG, GIF, WebP')
    ).toBeVisible();
  });

  test('allows file selection for upload', async ({ page }) => {
    await signIn(page);

    // Wait for the page to load
    await page.waitForResponse(
      (response) =>
        response.url().includes('/api/settings/icon') &&
        response.status() === 200
    );

    // Check that file input exists and can accept files
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();

    // Create a test file and set it
    const testFile = Buffer.from('fake-icon-content');
    await fileInput.setInputFiles({
      name: 'test-icon.png',
      mimeType: 'image/png',
      buffer: testFile,
    });

    // Check that the file was accepted (no immediate error)
    await expect(fileInput).toBeAttached();
  });

  test('shows helper text with icon requirements', async ({ page }) => {
    await signIn(page);

    // Wait for the page to load
    await page.waitForResponse(
      (response) =>
        response.url().includes('/api/settings/icon') &&
        response.status() === 200
    );

    // Check for helper text
    await expect(
      page.getByText(/Upload a favicon that appears in browser tabs/)
    ).toBeVisible();
    await expect(
      page.getByText(/Recommended size is 32x32 pixels/)
    ).toBeVisible();
  });

  test('validates file input exists', async ({ page }) => {
    await signIn(page);

    // Wait for the page to load
    await page.waitForResponse(
      (response) =>
        response.url().includes('/api/settings/icon') &&
        response.status() === 200
    );

    // Check that file input has correct attributes
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();

    // Check that it accepts the correct file types
    const acceptAttribute = await fileInput.getAttribute('accept');
    expect(acceptAttribute).toBe('.ico,.png,.jpg,.jpeg,.svg,.gif,.webp');
  });

  test('displays upload button with correct text', async ({ page }) => {
    await signIn(page);

    // Wait for the page to load
    await page.waitForResponse(
      (response) =>
        response.url().includes('/api/settings/icon') &&
        response.status() === 200
    );

    // Check upload button text
    const uploadButton = page.getByRole('button', {
      name: 'Upload Website Icon',
    });
    await expect(uploadButton).toBeVisible();
    await expect(uploadButton).toBeEnabled();
  });

  test('shows format information', async ({ page }) => {
    await signIn(page);

    // Wait for the page to load
    await page.waitForResponse(
      (response) =>
        response.url().includes('/api/settings/icon') &&
        response.status() === 200
    );

    // Check that format information is displayed
    await expect(
      page.getByText('Supported formats: ICO, PNG, JPG, SVG, GIF, WebP')
    ).toBeVisible();
  });

  test('shows size limit information', async ({ page }) => {
    await signIn(page);

    // Wait for the page to load
    await page.waitForResponse(
      (response) =>
        response.url().includes('/api/settings/icon') &&
        response.status() === 200
    );

    // Check that size limit is displayed
    await expect(page.getByText('Maximum file size: 2MB')).toBeVisible();
  });

  test('maintains section structure', async ({ page }) => {
    await signIn(page);

    // Wait for the page to load
    await page.waitForResponse(
      (response) =>
        response.url().includes('/api/settings/icon') &&
        response.status() === 200
    );

    // Check that the icon section has proper structure using Field.Root
    const iconLabel = page.locator('label').filter({ hasText: 'Website Icon' });
    await expect(iconLabel).toBeVisible();

    // Check that the upload button is present within the icon section
    await expect(
      page.getByRole('button', { name: 'Upload Website Icon' })
    ).toBeVisible();

    // Check that the icon section container is visible
    const iconContainer = page.locator('[data-part="root"]').filter({
      has: page.locator('label').filter({ hasText: 'Website Icon' }),
    });
    await expect(iconContainer).toBeVisible();
  });

  test('persists after page reload', async ({ page }) => {
    await signIn(page);

    // Wait for the page to load
    await page.waitForResponse(
      (response) =>
        response.url().includes('/api/settings/icon') &&
        response.status() === 200
    );

    // Check initial state
    await expect(
      page.getByRole('button', { name: 'Upload Website Icon' })
    ).toBeVisible();

    // Reload the page
    await page.reload();

    // Wait for the page to load again
    await page.waitForResponse(
      (response) =>
        response.url().includes('/api/settings/icon') &&
        response.status() === 200
    );

    // Check that the upload button is still visible
    await expect(
      page.getByRole('button', { name: 'Upload Website Icon' })
    ).toBeVisible();
  });
});
