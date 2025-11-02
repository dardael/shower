/**
 * Global teardown for Playwright tests
 * This runs once after all tests
 */
async function globalTeardown() {
  // Add any cleanup logic here if needed
  console.log('Global teardown completed');
}

export default globalTeardown;
