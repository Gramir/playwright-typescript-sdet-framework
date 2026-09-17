import { defineConfig, devices } from '@playwright/test';
import { getWorkerBaseUrl } from './utils/worker-url';

export default defineConfig({
  testDir: './tests',
  testIgnore: ['**/seed.spec.ts'],
  timeout: 180_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list']],
  globalSetup: './globalSetup.ts',
  use: {
    baseURL: getWorkerBaseUrl(0),
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
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
  ],
});
