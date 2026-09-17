import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from '@pages/swaglabs/BasePage';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get usernameInput(): Locator {
    return this.page.getByTestId('username');
  }

  get passwordInput(): Locator {
    return this.page.getByTestId('password');
  }

  get loginButton(): Locator {
    return this.page.getByTestId('login-button');
  }

  get errorMessage(): Locator {
    return this.page.getByTestId('error');
  }

  get errorButton(): Locator {
    return this.page.getByTestId('error-button');
  }

  get loginContainer(): Locator {
    return this.page.getByTestId('login-container');
  }

  async goto(): Promise<void> {
    await this.navigateTo('/');
    await this.assertIsLoaded();
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async dismissError(): Promise<void> {
    await this.errorButton.click();
  }

  async assertIsLoaded(): Promise<void> {
    await expect(this.loginButton).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
  }

  async assertErrorMessage(expectedMessage: string | RegExp): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedMessage);
  }

  async assertErrorMessageHidden(): Promise<void> {
    await expect(this.errorMessage).not.toBeVisible();
  }
}
