import { test } from '@fixtures/swaglabs-fixtures';

// Demonstrates bypass of UI login via fast session injection
test.use({ userRole: 'standard_user', authStrategy: 'fast_injection' });

test('Inventory_FastAuth_Storage: Authenticated session injected programmatically without UI login overhead', async ({
  inventoryPage,
}) => {
  await test.step('1. Verify instant access to product catalog via injected session', async () => {
    await inventoryPage.assertIsLoaded();
    await inventoryPage.assertItemCount(6);
  });

  await test.step('2. Apply price sorting filter on catalog', async () => {
    await inventoryPage.selectSort('lohi');
    const firstProduct = inventoryPage.getProductByIndex(0);
    await firstProduct.assertDetails('Sauce Labs Onesie');
  });
});
