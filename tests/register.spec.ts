import { test, expect } from '../src/fixtures/testFixtures';
import { DataGenerator } from '../src/utils/dataGenerator';
import negativeData from '../src/data/negativeScenarios.json';

test.describe('Customer Registration', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.gotoHome();
    await homePage.clickRegister();
  });

  test('TC-REG-01: Successful user registration with valid mandatory and optional fields @smoke @regression', async ({
    registerPage,
    homePage,
  }) => {
    const newUser = {
      gender: 'male' as const,
      firstName: 'Automation',
      lastName: 'Architect',
      email: DataGenerator.generateRandomEmail('new_user'),
      password: 'StrongPassword123!',
      confirmPassword: 'StrongPassword123!'
    };

    await registerPage.fillAndSubmitRegistration(newUser);

    // Assert registration success message
    await expect(registerPage.registrationResult).toBeVisible();
    await expect(registerPage.registrationResult).toContainText('Your registration completed');

    // Assert header displays the registered user's email
    await expect(homePage.accountLink).toHaveText(newUser.email);
    await expect(homePage.logoutLink).toBeVisible();
  });

  test('TC-REG-02: Mandatory field validation errors when submitting empty form @regression', async ({
    registerPage,
  }) => {
    await registerPage.registerButton.click();

    await expect(registerPage.firstNameError).toContainText(negativeData.registrationValidation.emptyFirstName);
    await expect(registerPage.lastNameError).toContainText(negativeData.registrationValidation.emptyLastName);
    await expect(registerPage.emailError).toContainText(negativeData.registrationValidation.emptyEmail);
    await expect(registerPage.passwordError).toContainText(negativeData.registrationValidation.emptyPassword);
    await expect(registerPage.confirmPasswordError).toContainText(negativeData.registrationValidation.emptyPassword);
  });

  test('TC-REG-03: Password mismatch error message @regression', async ({
    registerPage,
  }) => {
    await registerPage.fillAndSubmitRegistration({
      firstName: 'Mismatch',
      lastName: 'Tester',
      email: DataGenerator.generateRandomEmail('mismatch'),
      password: 'Password123!',
      confirmPassword: 'DifferentPassword456!'
    });

    await expect(registerPage.confirmPasswordError).toContainText(
      negativeData.registrationValidation.mismatchedPassword
    );
  });

  test('TC-REG-04: Boundary Value Analysis: Password less than 6 characters @regression', async ({
    registerPage,
  }) => {
    await registerPage.fillAndSubmitRegistration({
      firstName: 'Short',
      lastName: 'Pass',
      email: DataGenerator.generateRandomEmail('shortpass'),
      password: '12345', // 5 characters (below boundary of 6)
      confirmPassword: '12345'
    });

    await expect(registerPage.passwordError).toContainText(
      negativeData.registrationValidation.shortPassword
    );
  });

  test('TC-REG-05: Malformed email validation error @regression', async ({
    registerPage,
  }) => {
    await registerPage.fillAndSubmitRegistration({
      firstName: 'Invalid',
      lastName: 'Email',
      email: 'invalid-email-no-at-sign',
      password: 'Password123!',
      confirmPassword: 'Password123!'
    });

    await expect(registerPage.emailError).toContainText(
      negativeData.registrationValidation.invalidEmail
    );
  });

  test('TC-REG-06: Duplicate email registration prevention @regression', async ({
    registerPage,
    homePage,
  }) => {
    const existingUser = {
      firstName: 'Duplicate',
      lastName: 'User',
      email: DataGenerator.generateRandomEmail('duplicate_test'),
      password: 'Password123!',
      confirmPassword: 'Password123!'
    };

    // First registration
    await registerPage.fillAndSubmitRegistration(existingUser);
    await expect(registerPage.registrationResult).toContainText('Your registration completed');
    await registerPage.clickLogout();

    // Second registration attempt with identical email
    await homePage.clickRegister();
    await registerPage.fillAndSubmitRegistration(existingUser);

    await expect(registerPage.validationSummaryErrors).toBeVisible();
    await expect(registerPage.validationSummaryErrors).toContainText(
      negativeData.registrationValidation.duplicateEmail
    );
  });
});
