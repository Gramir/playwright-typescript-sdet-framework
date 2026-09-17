import { test } from '@fixtures/swaglabs-fixtures';

test.use({ userRole: 'standard_user' });

test('Checkout_CompleteFlow_Success: Authenticated user can complete full purchase journey', async ({
  inventoryPage,
  cartPage,
  checkoutPage,
}) => {
  const targetProduct = 'Sauce Labs Backpack';

  await test.step('1. Add targeted item to cart and verify cart badge update', async () => {
    await inventoryPage.addItemToCartByName(targetProduct);
    await inventoryPage.header.assertCartBadgeCount(1);
  });

  await test.step('2. Open shopping cart and confirm item presence', async () => {
    await inventoryPage.header.openCart();
    await cartPage.assertIsLoaded();
    await cartPage.assertItemCount(1);
    await cartPage.assertItemPresent(targetProduct);
  });

  await test.step('3. Advance to checkout and fill customer shipping information', async () => {
    await cartPage.proceedToCheckout();
    await checkoutPage.assertStepOneLoaded();
    await checkoutPage.fillInformation('Alex', 'SDET', '90210');
  });

  await test.step('4. Verify order summary overview before finalizing', async () => {
    await checkoutPage.assertStepTwoLoaded();
  });

  await test.step('5. Finalize purchase and assert successful order completion banner', async () => {
    await checkoutPage.finishCheckout();
    await checkoutPage.assertOrderComplete('Thank you for your order!');
  });
});
