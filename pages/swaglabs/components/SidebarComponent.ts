import { type Page, type Locator, expect } from '@playwright/test';

export class SidebarComponent {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get menuWrap(): Locator {
    return this.page.locator('.bm-menu-wrap');
  }

  get closeButton(): Locator {
    return this.page.getByTestId('close-menu');
  }

  get allItemsLink(): Locator {
    return this.page.getByTestId('inventory-sidebar-link');
  }

  get aboutLink(): Locator {
    return this.page.getByTestId('about-sidebar-link');
  }

  get logoutLink(): Locator {
    return this.page.getByTestId('logout-sidebar-link');
  }

  get resetAppStateLink(): Locator {
    return this.page.getByTestId('reset-sidebar-link');
  }

  async close(): Promise<void> {
    await this.closeButton.click();
    await expect(this.menuWrap).toHaveAttribute('aria-hidden', 'true');
  }

  async clickAllItems(): Promise<void> {
    await this.allItemsLink.click();
  }

  async clickAbout(): Promise<void> {
    await this.aboutLink.click();
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
  }

  async resetAppState(): Promise<void> {
    await this.resetAppStateLink.click();
  }

  async assertIsOpen(): Promise<void> {
    await expect(this.menuWrap).toHaveAttribute('aria-hidden', 'false');
  }

  async assertIsClosed(): Promise<void> {
    await expect(this.menuWrap).toHaveAttribute('aria-hidden', 'true');
  }
}
