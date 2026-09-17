import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from '@pages/swaglabs/BasePage';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get cartContainer(): Locator {
    return this.page.getByTestId('cart-contents-container');
  }

  get cartList(): Locator {
    return this.page.getByTestId('cart-list');
  }

  get cartItems(): Locator {
    return this.page.getByTestId('inventory-item');
  }

  get checkoutButton(): Locator {
    return this.page.getByTestId('checkout');
  }

  get continueShoppingButton(): Locator {
    return this.page.getByTestId('continue-shopping');
  }

  async goto(): Promise<void> {
    await this.navigateTo('/cart.html');
    await this.assertIsLoaded();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async assertIsLoaded(): Promise<void> {
    await expect(this.cartContainer).toBeVisible();
    await expect(this.header.pageTitle).toHaveText('Your Cart');
  }

  async assertItemCount(expectedCount: number): Promise<void> {
    await expect(this.cartItems).toHaveCount(expectedCount);
  }

  async assertItemPresent(productName: string): Promise<void> {
    const item = this.cartItems.filter({ hasText: productName });
    await expect(item).toBeVisible();
  }
}
