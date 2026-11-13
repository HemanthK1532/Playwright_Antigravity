import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for Customer Login
 *
 * Locator strategy:
 *  - Form fields  → getByLabel()   (labels use <label for="…"> matching input id)
 *  - Buttons      → getByRole('button', …)
 *  - Links        → getByRole('link', …)
 *  - Checkboxes   → getByRole('checkbox', …)
 *  - Validation   → locator() scoped to error containers (no ARIA equivalent)
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

    // Form fields — nopCommerce renders <label for="Email">Email:</label> etc.
    this.emailInput    = page.getByLabel('Email:');
    this.passwordInput = page.getByLabel('Password:');

    // Checkbox — <label for="RememberMe">Remember me?</label>
    this.rememberMeCheckbox = page.getByRole('checkbox', { name: /remember me/i });

    // Links
    this.forgotPasswordLink = page.getByRole('link', { name: /forgot password/i });

    // Buttons — <input type="submit" value="Log in" class="login-button">
    this.loginButton = page.getByRole('button', { name: 'Log in' });

    // Checkout-as-guest / register buttons on the login/checkout-choice page
    this.checkoutAsGuestButton = page.getByRole('button', { name: 'Checkout as Guest' });
    this.registerButton        = page.getByRole('button', { name: 'Register' });

    // Validation messages — no semantic locator available; use CSS
    this.validationSummaryErrors = page.locator('.validation-summary-errors');
    this.emailValidationError    = page.locator('span[data-valmsg-for="Email"]');
  }

  /** Fills email, password, optionally ticks Remember me, then clicks Log in. */
  async login(email: string, pass: string, rememberMe: boolean = false) {
    if (email) await this.emailInput.fill(email);
    if (pass)  await this.passwordInput.fill(pass);
    if (rememberMe) await this.rememberMeCheckbox.check();
    await this.loginButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Clicks "Checkout as Guest" (shown on the checkout login-choice page). */
  async clickCheckoutAsGuest() {
    await this.checkoutAsGuestButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Clicks the "Register" button on the login page. */
  async clickRegisterButton() {
    await this.registerButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
