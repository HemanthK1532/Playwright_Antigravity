import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export interface CartItem {
  name: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

/**
 * Page Object for Shopping Cart
 */
export class CartPage extends BasePage {
  readonly cartTable: Locator;
  readonly cartRows: Locator;
  readonly removeCheckboxes: Locator;
  readonly updateCartButton: Locator;
  readonly continueShoppingButton: Locator;

  readonly couponCodeInput: Locator;
  readonly applyCouponButton: Locator;
  readonly giftCardInput: Locator;
  readonly applyGiftCardButton: Locator;

  readonly termsOfServiceCheckbox: Locator;
  readonly checkoutButton: Locator;
  readonly termsWarningDialog: Locator;

  readonly emptyCartMessage: Locator;
  readonly orderSubtotal: Locator;
  readonly orderShipping: Locator;
  readonly orderTax: Locator;
  readonly orderTotal: Locator;

  constructor(page: Page) {
    super(page);
    this.cartTable = page.locator('table.cart');
    this.cartRows = page.locator('table.cart tbody tr.cart-item-row');
    this.removeCheckboxes = page.locator('input[name="removefromcart"]');
    this.updateCartButton = page.locator('input[name="updatecart"]');
    this.continueShoppingButton = page.locator('input[name="continueshopping"]');

    this.couponCodeInput = page.locator('input[name="discountcouponcode"]');
    this.applyCouponButton = page.locator('input[name="applydiscountcouponcode"]');
    this.giftCardInput = page.locator('input[name="giftcardcouponcode"]');
    this.applyGiftCardButton = page.locator('input[name="applygiftcardcouponcode"]');

    this.termsOfServiceCheckbox = page.locator('#termsofservice');
    this.checkoutButton = page.locator('#checkout');
    this.termsWarningDialog = page.locator('#terms-of-service-warning-box');

    this.emptyCartMessage = page.locator('.order-summary-content');
    this.orderSubtotal = page.locator('span.product-price.order-subtotal');
    this.orderShipping = page.locator('span.product-price.shipping-price');
    this.orderTax = page.locator('span.product-price.tax-value');
    this.orderTotal = page.locator('span.product-price.order-total strong');
  }

  /**
   * Retrieves all items in the cart table
   */
  async getCartItems(): Promise<CartItem[]> {
    const rowCount = await this.cartRows.count();
    const items: CartItem[] = [];

    for (let i = 0; i < rowCount; i++) {
      const row = this.cartRows.nth(i);
      const name = (await row.locator('.product-name').textContent())?.trim() || '';
      const unitPriceStr = (await row.locator('.product-unit-price').textContent()) || '0';
      const qtyStr = (await row.locator('input.qty-input').inputValue()) || '0';
      const subtotalStr = (await row.locator('.product-subtotal').textContent()) || '0';

      items.push({
        name,
        unitPrice: parseFloat(unitPriceStr.replace(/[^0-9.-]+/g, '')) || 0,
        quantity: parseInt(qtyStr, 10) || 0,
        subtotal: parseFloat(subtotalStr.replace(/[^0-9.-]+/g, '')) || 0
      });
    }

    return items;
  }

  /**
   * Updates quantity for a specific item by row index (0-based)
   */
  async updateItemQuantity(rowIndex: number, newQty: number) {
    const qtyInput = this.cartRows.nth(rowIndex).locator('input.qty-input');
    await qtyInput.fill(String(newQty));
    await this.updateCartButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Removes an item from cart by row index (0-based)
   */
  async removeItem(rowIndex: number) {
    await this.cartRows.nth(rowIndex).locator('input[name="removefromcart"]').check();
    await this.updateCartButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Removes all items from cart
   */
  async clearCart() {
    const count = await this.removeCheckboxes.count();
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        await this.removeCheckboxes.nth(i).check();
      }
      await this.updateCartButton.click();
      await this.page.waitForLoadState('domcontentloaded');
    }
  }

  /**
   * Accepts terms and proceeds to checkout
   */
  async proceedToCheckout(acceptTerms: boolean = true) {
    if (acceptTerms) {
      await this.termsOfServiceCheckbox.check();
    }
    await this.checkoutButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
