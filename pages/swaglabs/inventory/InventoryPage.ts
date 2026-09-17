import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from '@pages/swaglabs/BasePage';
import { ProductCardComponent } from '@components/ProductCardComponent';

export type ProductSortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get inventoryContainer(): Locator {
    return this.page.getByTestId('inventory-container');
  }

  get inventoryList(): Locator {
    return this.page.getByTestId('inventory-list');
  }

  get itemLocators(): Locator {
    return this.page.getByTestId('inventory-item');
  }

  get sortSelect(): Locator {
    return this.page.getByTestId('product-sort-container');
  }

  getProductByIndex(index: number): ProductCardComponent {
    return new ProductCardComponent(this.itemLocators.nth(index));
  }

  getProductByName(name: string): ProductCardComponent {
    const itemLocator = this.itemLocators.filter({ hasText: name });
    return new ProductCardComponent(itemLocator);
  }

  async selectSort(option: ProductSortOption): Promise<void> {
    await this.sortSelect.selectOption(option);
  }

  async addItemToCartByName(name: string): Promise<void> {
    const card = this.getProductByName(name);
    await card.addToCart();
  }

  async assertIsLoaded(): Promise<void> {
    await expect(this.inventoryContainer).toBeVisible();
    await expect(this.header.pageTitle).toHaveText('Products');
    await expect(this.itemLocators.first()).toBeVisible();
  }

  async assertItemCount(expectedCount: number): Promise<void> {
    await expect(this.itemLocators).toHaveCount(expectedCount);
  }
}
