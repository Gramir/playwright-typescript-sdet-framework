import { defineConfig, devices } from '@playwright/test';
import { createRequire } from 'node:module';
import { getWorkerBaseUrl } from './utils/worker-url';

const require = createRequire(import.meta.url);
const fs = require('node:fs');

// Gracefully handle Windows EPERM file locking from VS Code extension or indexers
for (const method of ['rmdir', 'rm'] as const) {
  const syncName = `${method}Sync`;
  const origSync = fs[syncName];
  if (origSync) {
    fs[syncName] = function (...args: any[]) {
      try {
        return origSync.apply(this, args);
      } catch (err: any) {
        if (err?.code === 'EPERM' || err?.code === 'EBUSY') return;
        throw err;
      }
    };
  }

  const origAsync = fs.promises?.[method];
  if (origAsync) {
    fs.promises[method] = async function (...args: any[]) {
      try {
        return await origAsync.apply(this, args);
      } catch (err: any) {
        if (err?.code === 'EPERM' || err?.code === 'EBUSY') return;
        throw err;
      }
    };
  }
}

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
  reporter: process.env.CI
    ? [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]]
    : [['list']],
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
  ],
});
