import { test, expect } from '../src/fixtures/testFixtures';
import { DataGenerator } from '../src/utils/dataGenerator';
import usersData from '../src/data/users.json';

test.describe('Authentication & Session Management', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.gotoHome();
  });

  test('TC-AUTH-01: User can login with valid registered credentials and logout successfully @smoke @regression', async ({
    registerPage,
    loginPage,
    homePage,
  }) => {
    // 1. Arrange: Create a new unique registered user
    const uniqueUser = {
      gender: 'female' as const,
      firstName: 'Jane',
      lastName: 'AuthTest',
      email: DataGenerator.generateRandomEmail('auth_valid'),
      password: 'Password123!',
      confirmPassword: 'Password123!'
    };

    await homePage.clickRegister();
    await registerPage.fillAndSubmitRegistration(uniqueUser);
    await expect(registerPage.registrationResult).toContainText('Your registration completed');
    await registerPage.clickLogout();

    // 2. Act: Log in with newly registered user
    await homePage.clickLogin();
    await loginPage.login(uniqueUser.email, uniqueUser.password);

    // 3. Assert: Header displays user email and logout link
    await expect(homePage.accountLink).toHaveText(uniqueUser.email);
    await expect(homePage.logoutLink).toBeVisible();
    await expect(homePage.loginLink).not.toBeVisible();

    // 4. Act: Log out
    await homePage.clickLogout();

    // 5. Assert: Header reverts to logged-out state
    await expect(homePage.loginLink).toBeVisible();
    await expect(homePage.registerLink).toBeVisible();
    await expect(homePage.accountLink).not.toBeVisible();
  });

  test('TC-AUTH-02: Login fails with unregistered email @regression', async ({
    homePage,
    loginPage,
  }) => {
    const unregisteredEmail = `unregistered_${Date.now()}@nonexistentdomain.com`;
    await homePage.clickLogin();
    await loginPage.login(unregisteredEmail, 'Password123!');

    await expect(loginPage.validationSummaryErrors).toBeVisible();
    await expect(loginPage.validationSummaryErrors).toContainText('No customer account found');
  });

  test('TC-AUTH-03: Login fails with incorrect password for existing user @regression', async ({
    registerPage,
    loginPage,
    homePage,
  }) => {
    const user = {
      gender: 'male' as const,
      firstName: 'Bob',
      lastName: 'WrongPass',
      email: DataGenerator.generateRandomEmail('auth_wrongpass'),
      password: 'CorrectPass123!',
      confirmPassword: 'CorrectPass123!'
    };

    // Register user first
    await homePage.clickRegister();
    await registerPage.fillAndSubmitRegistration(user);
    await registerPage.clickLogout();

    // Attempt login with wrong password
    await homePage.clickLogin();
    await loginPage.login(user.email, 'IncorrectPassword999!');

    await expect(loginPage.validationSummaryErrors).toBeVisible();
    await expect(loginPage.validationSummaryErrors).toContainText('The credentials provided are incorrect');
  });

  test('TC-AUTH-04: Login validation error on malformed email format @regression', async ({
    homePage,
    loginPage,
  }) => {
    await homePage.clickLogin();
    await loginPage.login('not-a-valid-email', 'Password123!');

    await expect(loginPage.emailValidationError).toBeVisible();
    await expect(loginPage.emailValidationError).toContainText('Please enter a valid email address.');
  });

  test('TC-AUTH-05: Login with empty credentials shows error @regression', async ({
    homePage,
    loginPage,
  }) => {
    await homePage.clickLogin();
    await loginPage.login('', '');

    await expect(loginPage.validationSummaryErrors).toBeVisible();
    await expect(loginPage.validationSummaryErrors).toContainText('Login was unsuccessful.');
  });
});
