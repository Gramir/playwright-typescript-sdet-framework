import { test as setup } from '@playwright/test';
import { usersData } from '@data/types';
import { getWorkerBaseUrl } from '@utils/worker-url';
import * as fs from 'node:fs';
import * as path from 'node:path';

const authFile = path.resolve('.auth/user.json');

setup('Authenticate and persist storageState', async ({ page, context }) => {
  const credentials = usersData.standard_user;
  const baseUrl = getWorkerBaseUrl();

  const authDir = path.dirname(authFile);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  await page.goto(baseUrl);
  await page.getByTestId('username').fill(credentials.username);
  await page.getByTestId('password').fill(credentials.password);
  await page.getByTestId('login-button').click();
  await page.waitForURL('**/inventory.html');

  await context.storageState({ path: authFile });
});
