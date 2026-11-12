import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { SearchPage } from '../pages/SearchPage';
import { CategoryPage } from '../pages/CategoryPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { CartPage } from '../pages/CartPage';
import { WishlistPage } from '../pages/WishlistPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { CustomerAccountPage } from '../pages/CustomerAccountPage';
import { DataGenerator } from '../utils/dataGenerator';

/**
 * Custom Fixture Type Definition
 */
type CustomFixtures = {
  homePage: HomePage;
  registerPage: RegisterPage;
  loginPage: LoginPage;
  searchPage: SearchPage;
  categoryPage: CategoryPage;
  productDetailsPage: ProductDetailsPage;
  cartPage: CartPage;
  wishlistPage: WishlistPage;
  checkoutPage: CheckoutPage;
  accountPage: CustomerAccountPage;
  newRegisteredUser: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  };
};

export const test = base.extend<CustomFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  searchPage: async ({ page }, use) => {
    await use(new SearchPage(page));
  },
  categoryPage: async ({ page }, use) => {
    await use(new CategoryPage(page));
  },
  productDetailsPage: async ({ page }, use) => {
    await use(new ProductDetailsPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  wishlistPage: async ({ page }, use) => {
    await use(new WishlistPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  accountPage: async ({ page }, use) => {
    await use(new CustomerAccountPage(page));
  },

  /**
   * Fixture to create an isolated registered user for tests that require an authenticated customer
   */
  newRegisteredUser: async ({ page }, use) => {
    const regPage = new RegisterPage(page);
    const user = {
      firstName: 'Auto',
      lastName: 'Tester',
      email: DataGenerator.generateRandomEmail('autouser'),
      password: 'Password123!',
      confirmPassword: 'Password123!',
      gender: 'male' as const
    };

    await regPage.navigateTo('/register');
    await regPage.fillAndSubmitRegistration(user);
    await expect(regPage.registrationResult).toContainText('Your registration completed');
    await regPage.clickContinue();

    await use({
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName
    });
  }
});

export { expect };
