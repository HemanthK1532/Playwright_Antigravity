import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for Product Details Page
 *
 * Locator strategy:
 *  - Product name   → getByRole('heading', { level: 1 })
 *  - Quantity input → getByRole('spinbutton') — <input type="number"> / qty-input
 *  - Add to Cart    → getByRole('button', { name: /add to cart/i })
 *  - Add to Wishlist→ getByRole('button', { name: /add to wishlist/i })
 *  - Email a Friend → getByRole('button', { name: /email a friend/i })
 *  - Descriptions / Price → locator() — no semantic equivalent for these containers
 */
export class ProductDetailsPage extends BasePage {
  readonly productName: Locator;
  readonly productShortDescription: Locator;
  readonly productFullDescription: Locator;
  readonly productPrice: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly addToWishlistButton: Locator;
  readonly emailFriendButton: Locator;

  constructor(page: Page) {
    super(page);

    this.productName             = page.getByRole('heading', { level: 1 });
    this.productShortDescription = page.locator('.short-description');
    this.productFullDescription  = page.locator('.full-description');
    this.productPrice            = page.locator('.product-price span');

    // Quantity — <input type="text" class="qty-input"> (not type="number", so spinbutton won't match)
    this.quantityInput = page.locator('input.qty-input');

    // Action buttons — <input type="button" value="Add to cart" class="add-to-cart-button">
    // getByRole('button') matches both <button> and <input type="button">/<input type="submit">
    this.addToCartButton     = page.getByRole('button', { name: /add to cart/i });
    this.addToWishlistButton = page.getByRole('button', { name: /add to wishlist/i });
    this.emailFriendButton   = page.getByRole('button', { name: /email a friend/i });
  }

  /** Adds the current product to the cart (optionally sets a custom quantity). */
  async addToCart(quantity: number = 1) {
    if (quantity > 1 || (await this.quantityInput.inputValue()) !== String(quantity)) {
      await this.quantityInput.fill(String(quantity));
    }
    await this.addToCartButton.click();
    await this.waitForNotification();
  }

  /** Adds the current product to the wishlist (optionally sets a custom quantity). */
  async addToWishlist(quantity: number = 1) {
    if (quantity > 1) {
      await this.quantityInput.fill(String(quantity));
    }
    await this.addToWishlistButton.click();
    await this.waitForNotification();
  }

  /** Returns the displayed price as a float. */
  async getPrice(): Promise<number> {
    const text = (await this.productPrice.first().textContent()) || '0';
    const val  = parseFloat(text.replace(/[^0-9.-]+/g, ''));
    return isNaN(val) ? 0 : val;
  }
}
