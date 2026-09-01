const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  // Give every individual test up to 2 minutes before it times out
  timeout: 120000,
  
  use: {
    /* Base URL — include the Vite base path so goto('/') lands on the app root */
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:5173/ML-Project-CV-Analysis/',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Capture video if test fails */
    video: 'retain-on-failure',
    
    /* Take screenshot if test fails */
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
