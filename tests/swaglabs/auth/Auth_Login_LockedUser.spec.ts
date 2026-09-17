import { test } from '@fixtures/swaglabs-fixtures';
import { usersData } from '@data/types';

test('Auth_Login_LockedUser: Locked out user receives appropriate denial error banner', async ({
  loginPage,
}) => {
  const credentials = usersData.locked_out_user;

  await test.step('1. Navigate to login page', async () => {
    await loginPage.goto();
  });

  await test.step('2. Submit credentials for locked_out_user', async () => {
    await loginPage.login(credentials.username, credentials.password);
  });

  await test.step('3. Verify error banner states the user has been locked out', async () => {
    await loginPage.assertErrorMessage('Sorry, this user has been locked out.');
  });

  await test.step('4. Dismiss error banner and verify it disappears', async () => {
    await loginPage.dismissError();
    await loginPage.assertErrorMessageHidden();
  });
});
