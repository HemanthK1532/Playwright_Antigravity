import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export interface RegistrationData {
  gender?: 'male' | 'female';
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

/**
 * Page Object for User Registration
 *
 * Locator strategy:
 *  - Gender radios   → getByRole('radio', { name })
 *  - Text inputs     → getByLabel()  (nopCommerce renders <label for="FieldId">Label:</label>)
 *  - Submit button   → getByRole('button', { name: 'Register' })
 *  - Continue button → getByRole('button', { name: 'Continue' })
 *  - Validation msgs → locator() scoped to data-valmsg-for attributes
 */
export class RegisterPage extends BasePage {
  readonly genderMaleRadio: Locator;
  readonly genderFemaleRadio: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly registerButton: Locator;

  // Inline validation spans
  readonly firstNameError: Locator;
  readonly lastNameError: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;
  readonly confirmPasswordError: Locator;
  readonly validationSummaryErrors: Locator;

  // Success page
  readonly registrationResult: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);

    // Gender radios — <label for="gender-male">Male</label>
    this.genderMaleRadio   = page.getByRole('radio', { name: 'Male' });
    this.genderFemaleRadio = page.getByRole('radio', { name: 'Female' });

    // Text inputs — labels: "First name:", "Last name:", "Email:", "Password:", "Confirm password:"
    this.firstNameInput       = page.getByLabel('First name:');
    this.lastNameInput        = page.getByLabel('Last name:');
    this.emailInput           = page.getByLabel('Email:');
    // Use exact:false so "Password:" matches even when "Confirm password:" is also present;
    // but we need exact match to separate the two — scope by locator order instead.
    this.passwordInput        = page.locator('#Password');       // most reliable for exact match
    this.confirmPasswordInput = page.locator('#ConfirmPassword');

    // Submit / continue buttons
    this.registerButton = page.getByRole('button', { name: 'Register' });
    this.continueButton = page.getByRole('button', { name: 'Continue' });

    // Inline validation error spans — no semantic locator; use data attribute
    this.firstNameError       = page.locator('span[data-valmsg-for="FirstName"]');
    this.lastNameError        = page.locator('span[data-valmsg-for="LastName"]');
    this.emailError           = page.locator('span[data-valmsg-for="Email"]');
    this.passwordError        = page.locator('span[data-valmsg-for="Password"]');
    this.confirmPasswordError = page.locator('span[data-valmsg-for="ConfirmPassword"]');
    this.validationSummaryErrors = page.locator('.validation-summary-errors');

    // Registration success result text
    this.registrationResult = page.locator('.result');
  }

  /** Fills and submits the registration form with the supplied data. */
  async fillAndSubmitRegistration(data: RegistrationData) {
    if (data.gender === 'female') {
      await this.genderFemaleRadio.check();
    } else if (data.gender === 'male') {
      await this.genderMaleRadio.check();
    }

    if (data.firstName !== undefined)       await this.firstNameInput.fill(data.firstName);
    if (data.lastName  !== undefined)       await this.lastNameInput.fill(data.lastName);
    if (data.email     !== undefined)       await this.emailInput.fill(data.email);
    if (data.password  !== undefined)       await this.passwordInput.fill(data.password);
    if (data.confirmPassword !== undefined) await this.confirmPasswordInput.fill(data.confirmPassword);

    await this.registerButton.click();
  }

  /** Returns the visible validation error text for a named field. */
  async getFieldError(
    field: 'firstName' | 'lastName' | 'email' | 'password' | 'confirmPassword'
  ): Promise<string> {
    const map: Record<string, Locator> = {
      firstName:       this.firstNameError,
      lastName:        this.lastNameError,
      email:           this.emailError,
      password:        this.passwordError,
      confirmPassword: this.confirmPasswordError,
    };
    return (await map[field].textContent()) || '';
  }

  /** Clicks Continue after a successful registration. */
  async clickContinue() {
    await this.continueButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
