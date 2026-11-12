import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for Product Details Page
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
    this.productName = page.locator('.product-name h1');
    this.productShortDescription = page.locator('.short-description');
    this.productFullDescription = page.locator('.full-description');
    this.productPrice = page.locator('.product-price span');
    this.quantityInput = page.locator('input.qty-input');
    this.addToCartButton = page.locator('input.add-to-cart-button');
    this.addToWishlistButton = page.locator('input.add-to-wishlist-button');
    this.emailFriendButton = page.locator('input.email-a-friend-button');
  }

  /**
   * Adds current product to cart with specified quantity
   */
  async addToCart(quantity: number = 1) {
    if (quantity > 1 || (await this.quantityInput.inputValue()) !== String(quantity)) {
      await this.quantityInput.fill(String(quantity));
    }
    await this.addToCartButton.click();
    await this.waitForNotification();
  }

  /**
   * Adds current product to wishlist
   */
  async addToWishlist(quantity: number = 1) {
    if (quantity > 1) {
      await this.quantityInput.fill(String(quantity));
    }
    await this.addToWishlistButton.click();
    await this.waitForNotification();
  }

  /**
   * Retrieves the current displayed price as a float
   */
  async getPrice(): Promise<number> {
    const text = (await this.productPrice.first().textContent()) || '0';
    const cleaned = text.replace(/[^0-9.-]+/g, '');
    const val = parseFloat(cleaned);
    return isNaN(val) ? 0 : val;
  }
}
