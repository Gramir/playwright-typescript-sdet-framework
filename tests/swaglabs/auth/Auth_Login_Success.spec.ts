import { test } from '@fixtures/swaglabs-fixtures';
import { usersData } from '@data/types';

test('Auth_Login_Success: Standard user can successfully log in and view the product catalog', async ({
  loginPage,
  inventoryPage,
}) => {
  const credentials = usersData.standard_user;

  await test.step('1. Navigate to Swag Labs login page and verify initial form readiness', async () => {
    await loginPage.goto();
  });

  await test.step('2. Submit valid credentials for standard_user', async () => {
    await loginPage.login(credentials.username, credentials.password);
  });

  await test.step('3. Verify successful redirection to inventory catalog and header display', async () => {
    await inventoryPage.assertIsLoaded();
    await inventoryPage.assertUrlContains('/inventory.html');
    await inventoryPage.header.assertPageTitle('Products');
    await inventoryPage.assertItemCount(6);
  });
});
