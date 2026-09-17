import { type Locator, expect } from '@playwright/test';

export class ProductCardComponent {
  readonly root: Locator;

  constructor(root: Locator) {
    this.root = root;
  }

  get name(): Locator {
    return this.root.getByTestId('inventory-item-name');
  }

  get description(): Locator {
    return this.root.getByTestId('inventory-item-desc');
  }

  get price(): Locator {
    return this.root.getByTestId('inventory-item-price');
  }

  get addToCartButton(): Locator {
    return this.root.getByRole('button', { name: /add to cart/i });
  }

  get removeButton(): Locator {
    return this.root.getByRole('button', { name: /remove/i });
  }

  async addToCart(): Promise<void> {
    await expect(this.addToCartButton).toBeVisible();
    await this.addToCartButton.click();
    await expect(this.removeButton).toBeVisible();
  }

  async removeFromCart(): Promise<void> {
    await expect(this.removeButton).toBeVisible();
    await this.removeButton.click();
    await expect(this.addToCartButton).toBeVisible();
  }

  async assertDetails(expectedName: string, expectedPricePrefix: string = '$'): Promise<void> {
    await expect(this.name).toHaveText(expectedName);
    await expect(this.price).toContainText(expectedPricePrefix);
  }
}
