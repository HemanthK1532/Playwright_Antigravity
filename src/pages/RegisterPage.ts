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

  // Validation locators
  readonly firstNameError: Locator;
  readonly lastNameError: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;
  readonly confirmPasswordError: Locator;
  readonly validationSummaryErrors: Locator;

  // Result locators
  readonly registrationResult: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.genderMaleRadio = page.locator('#gender-male');
    this.genderFemaleRadio = page.locator('#gender-female');
    this.firstNameInput = page.locator('#FirstName');
    this.lastNameInput = page.locator('#LastName');
    this.emailInput = page.locator('#Email');
    this.passwordInput = page.locator('#Password');
    this.confirmPasswordInput = page.locator('#ConfirmPassword');
    this.registerButton = page.locator('#register-button');

    this.firstNameError = page.locator('span[data-valmsg-for="FirstName"]');
    this.lastNameError = page.locator('span[data-valmsg-for="LastName"]');
    this.emailError = page.locator('span[data-valmsg-for="Email"]');
    this.passwordError = page.locator('span[data-valmsg-for="Password"]');
    this.confirmPasswordError = page.locator('span[data-valmsg-for="ConfirmPassword"]');
    this.validationSummaryErrors = page.locator('.validation-summary-errors');

    this.registrationResult = page.locator('.result');
    this.continueButton = page.locator('input.register-continue-button');
  }

  /**
   * Fills and submits the registration form
   */
  async fillAndSubmitRegistration(data: RegistrationData) {
    if (data.gender === 'female') {
      await this.genderFemaleRadio.check();
    } else if (data.gender === 'male') {
      await this.genderMaleRadio.check();
    }

    if (data.firstName !== undefined) {
      await this.firstNameInput.fill(data.firstName);
    }
    if (data.lastName !== undefined) {
      await this.lastNameInput.fill(data.lastName);
    }
    if (data.email !== undefined) {
      await this.emailInput.fill(data.email);
    }
    if (data.password !== undefined) {
      await this.passwordInput.fill(data.password);
    }
    if (data.confirmPassword !== undefined) {
      await this.confirmPasswordInput.fill(data.confirmPassword);
    }

    await this.registerButton.click();
  }

  /**
   * Reads field validation message
   */
  async getFieldError(field: 'firstName' | 'lastName' | 'email' | 'password' | 'confirmPassword'): Promise<string> {
    const map = {
      firstName: this.firstNameError,
      lastName: this.lastNameError,
      email: this.emailError,
      password: this.passwordError,
      confirmPassword: this.confirmPasswordError
    };
    return (await map[field].textContent()) || '';
  }

  /**
   * Clicks continue after successful registration
   */
  async clickContinue() {
    await this.continueButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
