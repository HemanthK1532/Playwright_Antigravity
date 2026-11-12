import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage provides reusable components and actions shared across all pages in Demo Web Shop:
 * - Top header links (Register, Log in, Log out, Account, Cart, Wishlist)
 * - Header search box
 * - Top navigation menu
 * - Flyout cart & global notification bar
 */
export class BasePage {
  readonly page: Page;

  // Header navigation locators
  readonly headerLogo: Locator;
  readonly registerLink: Locator;
  readonly loginLink: Locator;
  readonly logoutLink: Locator;
  readonly accountLink: Locator;
  readonly cartLink: Locator;
  readonly cartQtyBadge: Locator;
  readonly wishlistLink: Locator;
  readonly wishlistQtyBadge: Locator;

  // Search box locators
  readonly searchInput: Locator;
  readonly searchButton: Locator;

  // Notification bar
  readonly notificationBar: Locator;
  readonly notificationMessage: Locator;
  readonly notificationCloseBtn: Locator;

  // Top navigation menu
  readonly topMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.headerLogo = page.locator('.header-logo a');
    this.registerLink = page.locator('.header-links a.ico-register');
    this.loginLink = page.locator('.header-links a.ico-login');
    this.logoutLink = page.locator('.header-links a.ico-logout');
    this.accountLink = page.locator('.header-links a.account');
    this.cartLink = page.locator('.header-links a.ico-cart');
    this.cartQtyBadge = page.locator('.header-links .cart-qty');
    this.wishlistLink = page.locator('.header-links a.ico-wishlist');
    this.wishlistQtyBadge = page.locator('.header-links .wishlist-qty');

    this.searchInput = page.locator('#small-searchterms');
    this.searchButton = page.locator('input.button-1.search-box-button');

    this.notificationBar = page.locator('#bar-notification');
    this.notificationMessage = page.locator('#bar-notification p.content');
    this.notificationCloseBtn = page.locator('#bar-notification span.close');

    this.topMenu = page.locator('ul.top-menu');
  }

  /**
   * Navigates to a specific path relative to baseURL
   */
  async navigateTo(path: string = '/') {
    await this.page.goto(path);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Navigates to the Home page
   */
  async gotoHome() {
    await this.navigateTo('/');
  }

  /**
   * Clicks the Register link
   */
  async clickRegister() {
    await this.registerLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Clicks the Login link
   */
  async clickLogin() {
    await this.loginLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Clicks the Logout link
   */
  async clickLogout() {
    await this.logoutLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Clicks the Shopping Cart link in header
   */
  async clickShoppingCart() {
    await this.cartLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Clicks the Wishlist link in header
   */
  async clickWishlist() {
    await this.wishlistLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Performs quick search from the header input
   */
  async searchFor(term: string) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Selects a category from the top menu by visible text
   */
  async selectCategory(categoryName: string) {
    const categoryLink = this.topMenu.locator(`> li > a:has-text("${categoryName}")`).first();
    await categoryLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Waits for the success/error notification bar and optionally closes it
   */
  async waitForNotification(): Promise<string> {
    await expect(this.notificationBar).toBeVisible({ timeout: 10000 });
    const text = (await this.notificationMessage.textContent()) || '';
    if (await this.notificationCloseBtn.isVisible()) {
      await this.notificationCloseBtn.click();
    }
    return text.trim();
  }

  /**
   * Gets current cart quantity as number
   */
  async getCartCount(): Promise<number> {
    const text = await this.cartQtyBadge.textContent();
    const match = text?.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  /**
   * Gets current wishlist quantity as number
   */
  async getWishlistCount(): Promise<number> {
    const text = await this.wishlistQtyBadge.textContent();
    const match = text?.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }
}
