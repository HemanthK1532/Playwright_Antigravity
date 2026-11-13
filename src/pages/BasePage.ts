import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage provides reusable components and actions shared across all pages in Demo Web Shop.
 *
 * Locator strategy (in priority order per Playwright best practices):
 *   1. getByRole()       — semantic ARIA roles (links, buttons, checkboxes, textboxes)
 *   2. getByLabel()      — form fields associated via <label for="…">
 *   3. getByPlaceholder()— inputs identified by placeholder text
 *   4. getByText()       — elements identified by visible text
 *   5. locator()         — CSS/ID fallback only when no semantic locator is unique
 *
 * Scoping: header links are scoped inside `.header-links` to avoid collisions
 * with product-page wishlist/cart links.
 */
export class BasePage {
  readonly page: Page;

  // ── Header navigation ──────────────────────────────────────────────────────
  readonly headerLogo: Locator;
  readonly registerLink: Locator;
  readonly loginLink: Locator;
  readonly logoutLink: Locator;
  readonly accountLink: Locator;      // dynamic — email as link text; kept as CSS
  readonly cartLink: Locator;
  readonly cartQtyBadge: Locator;
  readonly wishlistLink: Locator;
  readonly wishlistQtyBadge: Locator;

  // ── Header search box ──────────────────────────────────────────────────────
  readonly searchInput: Locator;
  readonly searchButton: Locator;

  // ── Notification bar ───────────────────────────────────────────────────────
  readonly notificationBar: Locator;
  readonly notificationMessage: Locator;
  readonly notificationCloseBtn: Locator;

  // ── Top navigation menu ────────────────────────────────────────────────────
  readonly topMenu: Locator;

  constructor(page: Page) {
    this.page = page;

    this.headerLogo = page.locator('.header-logo a');

    // Scope header links to avoid duplicate matches on product detail pages
    const headerLinks = page.locator('.header-links');
    this.registerLink   = headerLinks.getByRole('link', { name: 'Register' });
    this.loginLink      = headerLinks.getByRole('link', { name: 'Log in' });
    this.logoutLink     = headerLinks.getByRole('link', { name: 'Logout' });
    this.accountLink    = headerLinks.locator('a.account');           // text = user email (dynamic)
    this.cartLink       = headerLinks.getByRole('link', { name: /Shopping cart/i });
    this.cartQtyBadge   = page.locator('#topcartlink .cart-qty');
    this.wishlistLink   = headerLinks.getByRole('link', { name: /Wishlist/i });
    this.wishlistQtyBadge = headerLinks.locator('.wishlist-qty');

    // Search box — `#small-searchterms` has value="Search store" (not a placeholder).
    // getByRole('searchbox') covers it; fall back to the ID when that is ambiguous.
    this.searchInput  = page.locator('#small-searchterms');
    this.searchButton = page.locator('.search-box').getByRole('button', { name: 'Search' });

    this.notificationBar      = page.locator('#bar-notification');
    this.notificationMessage  = page.locator('#bar-notification p.content');
    this.notificationCloseBtn = page.locator('#bar-notification span.close');

    this.topMenu = page.locator('ul.top-menu');
  }

  // ── Navigation helpers ──────────────────────────────────────────────────────

  async navigateTo(path: string = '/') {
    await this.page.goto(path);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async gotoHome() {
    await this.navigateTo('/');
  }

  async clickRegister() {
    await this.registerLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickLogin() {
    await this.loginLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickLogout() {
    await this.logoutLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickShoppingCart() {
    await this.cartLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickWishlist() {
    await this.wishlistLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  // ── Search ──────────────────────────────────────────────────────────────────

  async searchFor(term: string) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  // ── Category navigation ─────────────────────────────────────────────────────

  /**
   * Clicks a top-level category link by its exact visible name.
   * Uses getByRole scoped to the top menu for precision.
   */
  async selectCategory(categoryName: string) {
    await this.topMenu
      .getByRole('link', { name: categoryName, exact: true })
      .first()
      .click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  // ── Notification bar ────────────────────────────────────────────────────────

  async waitForNotification(): Promise<string> {
    await expect(this.notificationBar).toBeVisible({ timeout: 10000 });
    const text = (await this.notificationMessage.textContent()) || '';
    if (await this.notificationCloseBtn.isVisible()) {
      await this.notificationCloseBtn.click();
    }
    return text.trim();
  }

  // ── Cart / Wishlist counts ──────────────────────────────────────────────────

  async getCartCount(): Promise<number> {
    const text = await this.cartQtyBadge.textContent();
    const match = text?.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  async getWishlistCount(): Promise<number> {
    const text = await this.wishlistQtyBadge.textContent();
    const match = text?.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }
}
