import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for the Customer Wishlist (/wishlist)
 *
 * Locator strategy:
 *  - Buttons           → getByRole('button', { name: … })
 *  - Share link        → getByRole('link', { name: /share/i })
 *  - Remove checkboxes → locator() — no label (name="removefromcart")
 *  - Add-to-cart cb    → locator() — no label (name="addtocart")
 *  - Product name link → locator scoped to td.product row
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

    this.wishlistTable      = page.locator('table.cart');
    this.wishlistRows       = page.locator('table.cart tbody tr.cart-item-row');
    this.removeCheckboxes   = page.locator('input[name="removefromcart"]');
    this.addToCartCheckboxes = page.locator('input[name="addtocart"]');

    // Buttons — matched by visible label text
    this.updateWishlistButton = page.getByRole('button', { name: 'Update wishlist' });
    this.addToCartButton      = page.getByRole('button', { name: 'Add to cart' });

    this.emptyWishlistMessage = page.locator('.wishlist-content');
    this.shareWishlistLink    = page.getByRole('link', { name: /share wishlist/i });
  }

  /**
   * Returns the product names currently in the wishlist.
   * Uses td.product a — the actual HTML structure for wishlist product links.
   */
  async getProductNames(): Promise<string[]> {
    return this.wishlistRows.locator('td.product a').allTextContents();
  }

  /** Removes an item from the wishlist by row index (0-based). */
  async removeItem(rowIndex: number = 0) {
    await this.removeCheckboxes.nth(rowIndex).check();
    await this.updateWishlistButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Checks the add-to-cart checkbox for a row and clicks Add to cart. */
  async moveItemToCart(rowIndex: number = 0) {
    await this.addToCartCheckboxes.nth(rowIndex).check();
    await this.addToCartButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
