import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for CI
 * Full browser matrix for comprehensive testing
 */
export default defineConfig({
  testDir: './tests',

  // Run tests in parallel
  fullyParallel: true,

  // Fail build on CI if you accidentally left test.only
  forbidOnly: true,

  // Retry failed tests
  retries: 2,

  // Single worker for CI stability
  workers: 1,

  // Increase timeout for CI
  timeout: 90000, // 90 seconds per test

  // Reporter
  reporter: [['html'], ['json'], ['github']],

  use: {
    // Base URL for all tests
    baseURL: 'http://localhost:3000',

    // Collect trace on first retry
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',

    // Increase action timeout
    actionTimeout: 15000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile viewports
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Web server for CI
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: false,
    timeout: 120000,
  },
});
