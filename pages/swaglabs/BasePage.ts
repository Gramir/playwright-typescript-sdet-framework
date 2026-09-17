import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage as SharedBasePage } from '@pages/shared/BasePage';
import { HeaderComponent } from '@components/HeaderComponent';
import { SidebarComponent } from '@components/SidebarComponent';

export class BasePage extends SharedBasePage {
  readonly header: HeaderComponent;
  readonly sidebar: SidebarComponent;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.sidebar = new SidebarComponent(page);
  }

  get rootContainer(): Locator {
    return this.page.locator('#root');
  }

  get footer(): Locator {
    return this.page.getByTestId('footer');
  }

  get footerCopy(): Locator {
    return this.page.getByTestId('footer-copy');
  }

  async waitForAppToLoad(): Promise<void> {
    await expect(this.rootContainer).toBeVisible();
    const spinner = this.page.getByTestId('dynamic-catalog-spinner');
    if ((await spinner.count()) > 0) {
      await expect(spinner).toBeHidden();
    }
  }

  async setOptionsViaApi(key: string, value: string): Promise<void> {
    await this.page.evaluate(
      ({ k, v }) => {
        window.localStorage.setItem(k, v);
      },
      { k: key, v: value }
    );
  }

  async assertFooterVisible(): Promise<void> {
    await expect(this.footer).toBeVisible();
  }
}
