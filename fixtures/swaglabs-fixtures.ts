import { test as baseTest, expect } from './base-fixtures';
import { LoginPage } from '@pages/swaglabs/auth/LoginPage';
import { InventoryPage } from '@pages/swaglabs/inventory/InventoryPage';
import { CartPage } from '@pages/swaglabs/cart/CartPage';
import { CheckoutPage } from '@pages/swaglabs/checkout/CheckoutPage';
import { usersData } from '@data/types';
import type { SwagUserRole } from '@data/types';

export interface SwagLabsFixturesOptions {
  userRole?: SwagUserRole;
}

export interface SwagLabsFixtures {
  authenticatedSession: void;
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
}

export const test = baseTest.extend<SwagLabsFixtures & SwagLabsFixturesOptions>({
  userRole: [undefined, { option: true }],

  authenticatedSession: [
    async ({ userRole, loginPage, inventoryPage }, use) => {
      if (userRole) {
        const credentials = usersData[userRole];
        if (!credentials) {
          throw new Error(`[Auth] User role "${userRole}" not found in data/swaglabs/users.json`);
        }

        await loginPage.goto();
        await loginPage.login(credentials.username, credentials.password);

        if (userRole !== 'locked_out_user') {
          await inventoryPage.assertIsLoaded();
        }
      }

      await use();
    },
    { auto: true },
  ],

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});

export { expect };
