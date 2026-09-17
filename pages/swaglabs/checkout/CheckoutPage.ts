import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from '@pages/swaglabs/BasePage';

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get infoContainer(): Locator {
    return this.page.getByTestId('checkout-info-container');
  }

  get firstNameInput(): Locator {
    return this.page.getByTestId('firstName');
  }

  get lastNameInput(): Locator {
    return this.page.getByTestId('lastName');
  }

  get postalCodeInput(): Locator {
    return this.page.getByTestId('postalCode');
  }

  get continueButton(): Locator {
    return this.page.getByTestId('continue');
  }

  get cancelInfoButton(): Locator {
    return this.page.getByTestId('cancel');
  }

  get errorMessage(): Locator {
    return this.page.getByTestId('error');
  }

  get summaryContainer(): Locator {
    return this.page.getByTestId('checkout-summary-container');
  }

  get paymentInfo(): Locator {
    return this.page.getByTestId('payment-info-value');
  }

  get shippingInfo(): Locator {
    return this.page.getByTestId('shipping-info-value');
  }

  get subtotalLabel(): Locator {
    return this.page.getByTestId('subtotal-label');
  }

  get taxLabel(): Locator {
    return this.page.getByTestId('tax-label');
  }

  get totalLabel(): Locator {
    return this.page.getByTestId('total-label');
  }

  get finishButton(): Locator {
    return this.page.getByTestId('finish');
  }

  get completeContainer(): Locator {
    return this.page.getByTestId('checkout-complete-container');
  }

  get completeHeader(): Locator {
    return this.page.getByTestId('complete-header');
  }

  get completeText(): Locator {
    return this.page.getByTestId('complete-text');
  }

  get backToProductsButton(): Locator {
    return this.page.getByTestId('back-to-products');
  }

  async fillInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  async finishCheckout(): Promise<void> {
    await this.finishButton.click();
  }

  async backToProducts(): Promise<void> {
    await this.backToProductsButton.click();
  }

  async assertStepOneLoaded(): Promise<void> {
    await expect(this.infoContainer).toBeVisible();
    await expect(this.header.pageTitle).toHaveText('Checkout: Your Information');
  }

  async assertStepTwoLoaded(): Promise<void> {
    await expect(this.summaryContainer).toBeVisible();
    await expect(this.header.pageTitle).toHaveText('Checkout: Overview');
    await expect(this.finishButton).toBeVisible();
  }

  async assertOrderComplete(expectedHeader: string = 'Thank you for your order!'): Promise<void> {
    await expect(this.completeContainer).toBeVisible();
    await expect(this.header.pageTitle).toHaveText('Checkout: Complete!');
    await expect(this.completeHeader).toHaveText(expectedHeader);
  }
}
