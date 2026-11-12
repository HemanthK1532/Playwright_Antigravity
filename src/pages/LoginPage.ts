import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for Customer Login
 */
export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly forgotPasswordLink: Locator;
  readonly loginButton: Locator;

  readonly checkoutAsGuestButton: Locator;
  readonly registerButton: Locator;

  readonly validationSummaryErrors: Locator;
  readonly emailValidationError: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('#Email');
    this.passwordInput = page.locator('#Password');
    this.rememberMeCheckbox = page.locator('#RememberMe');
    this.forgotPasswordLink = page.locator('a[href*="passwordrecovery"]');
    this.loginButton = page.locator('input.login-button');

    this.checkoutAsGuestButton = page.locator('input.checkout-as-guest-button');
    this.registerButton = page.locator('input.register-button');

    this.validationSummaryErrors = page.locator('.validation-summary-errors');
    this.emailValidationError = page.locator('span[data-valmsg-for="Email"]');
  }

  /**
   * Performs standard login
   */
  async login(email: string, pass: string, rememberMe: boolean = false) {
    if (email) await this.emailInput.fill(email);
    if (pass) await this.passwordInput.fill(pass);
    if (rememberMe) await this.rememberMeCheckbox.check();
    await this.loginButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Clicks Checkout as Guest if presented (during checkout flow)
   */
  async clickCheckoutAsGuest() {
    await this.checkoutAsGuestButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Clicks Register button on login page
   */
  async clickRegisterButton() {
    await this.registerButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
