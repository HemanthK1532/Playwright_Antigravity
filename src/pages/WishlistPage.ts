import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for Customer Wishlist
 */
export class WishlistPage extends BasePage {
  readonly wishlistTable: Locator;
  readonly wishlistRows: Locator;
  readonly removeCheckboxes: Locator;
  readonly addToCartCheckboxes: Locator;
  readonly updateWishlistButton: Locator;
  readonly addToCartButton: Locator;
  readonly emptyWishlistMessage: Locator;
  readonly shareWishlistLink: Locator;

  constructor(page: Page) {
    super(page);
    this.wishlistTable = page.locator('table.cart');
    this.wishlistRows = page.locator('table.cart tbody tr.cart-item-row');
    this.removeCheckboxes = page.locator('input[name="removefromcart"]');
    this.addToCartCheckboxes = page.locator('input[name="addtocart"]');
    this.updateWishlistButton = page.locator('input[name="updatecart"]');
    this.addToCartButton = page.locator('input[name="addtocartbutton"]');
    this.emptyWishlistMessage = page.locator('.wishlist-content');
    this.shareWishlistLink = page.locator('a.share-link');
  }

  /**
   * Returns list of product names in wishlist
   */
  async getProductNames(): Promise<string[]> {
    return await this.wishlistRows.locator('td.product a').allTextContents();
  }

  /**
   * Removes item from wishlist by row index (0-based)
   */
  async removeItem(rowIndex: number = 0) {
    await this.removeCheckboxes.nth(rowIndex).check();
    await this.updateWishlistButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Moves item from wishlist to cart by row index (0-based)
   */
  async moveItemToCart(rowIndex: number = 0) {
    await this.addToCartCheckboxes.nth(rowIndex).check();
    await this.addToCartButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
