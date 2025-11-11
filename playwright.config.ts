import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration - Optimized for Local Development
 * Only runs chromium for fast local testing
 * Use playwright.config.ci.ts for full browser matrix
 */
export default defineConfig({
  testDir: './tests',

  // Run tests in parallel
  fullyParallel: true,

  // Fail build on CI if you accidentally left test.only
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Optimize workers: 4 is a good balance for local dev
  workers: process.env.CI ? 1 : 4,

  // Test timeout - reasonable for most tests
  timeout: 45000, // 45 seconds per test

  // Global timeout for entire test run
  globalTimeout: 900000, // 15 minutes total (358 tests * ~2.5s avg)

  // Reporter - list is faster than html during execution
  reporter: process.env.CI
    ? [['html'], ['json']]
    : [['list']],

  use: {
    // Base URL for all tests
    baseURL: 'http://localhost:3000',

    // Collect trace only on retry to save disk space
    trace: 'on-first-retry',

    // Screenshot on failure only
    screenshot: 'only-on-failure',

    // Video on failure - most expensive, only when needed
    video: 'retain-on-failure',

    // Action timeout
    actionTimeout: 10000,

    // Navigation timeout
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Web server for local testing
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
