import { type Page, type Locator, expect } from '@playwright/test';

export class HeaderComponent {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get headerContainer(): Locator {
    return this.page.getByTestId('header-container');
  }

  get appLogo(): Locator {
    return this.page.locator('.app_logo');
  }

  get cartLink(): Locator {
    return this.page.getByTestId('shopping-cart-link');
  }

  get cartBadge(): Locator {
    return this.page.getByTestId('shopping-cart-badge');
  }

  get menuButton(): Locator {
    return this.page.getByTestId('open-menu');
  }

  get pageTitle(): Locator {
    return this.page.getByTestId('title');
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async openMenu(): Promise<void> {
    await this.menuButton.click();
  }

  async assertCartBadgeCount(expectedCount: number): Promise<void> {
    await expect(this.cartBadge).toHaveText(String(expectedCount));
  }

  async assertCartBadgeHidden(): Promise<void> {
    await expect(this.cartBadge).not.toBeVisible();
  }

  async assertPageTitle(expectedText: string): Promise<void> {
    await expect(this.pageTitle).toHaveText(expectedText);
  }
}
