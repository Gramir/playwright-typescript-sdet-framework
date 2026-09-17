import { test, expect } from '@fixtures/swaglabs-fixtures';

test('Domain_Action_ExpectedOutcome', async ({ loginPage, inventoryPage }) => {
  await test.step('1. Navigate to target application', async () => {
    await loginPage.goto();
  });

  await test.step('2. Perform domain action using Page Object methods', async () => {
    await loginPage.login('standard_user', 'secret_sauce');
  });

  await test.step('3. Verify expected state using Web-First assertions', async () => {
    await inventoryPage.assertIsLoaded();
  });
});
