import { test, expect } from '@playwright/test';

test.describe('Logging API Health Check', () => {
  test('should return health status without authentication', async ({
    request,
  }) => {
    const response = await request.get('/api/logs');

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('status', 'healthy');
    expect(body).toHaveProperty('timestamp');
    expect(body).toHaveProperty('rateLimitStore');
    expect(typeof body.timestamp).toBe('string');
    expect(typeof body.rateLimitStore).toBe('string');
  });

  test('should return valid ISO timestamp', async ({ request }) => {
    const response = await request.get('/api/logs');
    const body = await response.json();

    // Verify timestamp is valid ISO 8601 format
    const timestamp = new Date(body.timestamp);
    expect(timestamp.toISOString()).toBe(body.timestamp);
  });

  test('should include rate limit store type', async ({ request }) => {
    const response = await request.get('/api/logs');
    const body = await response.json();

    // Rate limit store should be 'memory'
    expect(body.rateLimitStore).toBe('memory');
  });
});
