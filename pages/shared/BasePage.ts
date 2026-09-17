import { type Page, type Locator, expect } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(path: string): Promise<void> {
    await this.page.goto(path);
    await this.waitForAppToLoad();
  }

  abstract waitForAppToLoad(): Promise<void>;

  async takeScreenshot(name: string): Promise<Buffer> {
    return await this.page.screenshot({
      path: `test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: true,
    });
  }

  async assertUrlContains(expectedSegment: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(expectedSegment));
  }

  async assertPageTitle(expectedTitle: string | RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  protected async waitForVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }
}
