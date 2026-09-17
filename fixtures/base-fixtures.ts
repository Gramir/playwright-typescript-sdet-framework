import { test as baseTest, expect } from '@playwright/test';
import { getWorkerBaseUrl } from '@utils/worker-url';
import type { SnapshotKey } from '@data/types';

export interface BaseFixturesOptions {
  snapshotName: SnapshotKey;
}

export interface BaseFixtures {
  configureSnapshot: void;
  consoleErrors: void;
  serverLogs: void;
}

export const test = baseTest.extend<BaseFixtures & BaseFixturesOptions>({
  snapshotName: ['default_state', { option: true }],

  configureSnapshot: [
    async ({ page, context }, use) => {
      await context.clearCookies();
      await page.goto(getWorkerBaseUrl());
      await page.evaluate(() => {
        try {
          window.localStorage.clear();
          window.sessionStorage.clear();
        } catch {
          // Empty origin fallback
        }
      });

      await use();
    },
    { auto: true },
  ],

  consoleErrors: [
    async ({ page }, use) => {
      const pageErrors: Error[] = [];
      const errorListener = (error: Error) => {
        pageErrors.push(error);
      };

      page.on('pageerror', errorListener);
      await use();
      page.off('pageerror', errorListener);

      if (pageErrors.length > 0) {
        const errorMessages = pageErrors.map((e) => e.message || String(e)).join('\n---\n');
        throw new Error(
          `[FAIL] Test encountered ${pageErrors.length} uncaught browser exception(s) (pageerror):\n${errorMessages}`
        );
      }
    },
    { auto: true },
  ],

  serverLogs: [
    async ({ page }, use, testInfo) => {
      const logs: string[] = [];
      const consoleListener = (msg: any) => {
        logs.push(`[${msg.type()}] ${msg.text()}`);
      };

      page.on('console', consoleListener);
      await use();
      page.off('console', consoleListener);

      if (testInfo.status !== testInfo.expectedStatus) {
        await testInfo.attach('browser-runtime-logs.txt', {
          body: logs.join('\n') || 'No console logs captured.',
          contentType: 'text/plain',
        });
      }
    },
    { auto: true },
  ],
});

export { expect };
