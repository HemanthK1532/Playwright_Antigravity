import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export interface CartItem {
  name: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

/**
 * Page Object for the Shopping Cart (/cart)
 *
 * Locator strategy:
 *  - Buttons         → getByRole('button', { name: … })
 *  - Terms checkbox  → getByRole('checkbox', { name: /terms/i })  OR id fallback
 *  - Coupon / gift inputs → getByRole('textbox') inside scoped containers
 *  - Remove checkboxes, qty inputs, totals → locator() — no accessible labels
 *  - Terms warning   → locator('#terms-of-service-warning-box')  (dialog, no ARIA role)
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

    this.cartTable        = page.locator('table.cart');
    this.cartRows         = page.locator('table.cart tbody tr.cart-item-row');
    this.removeCheckboxes = page.locator('input[name="removefromcart"]');

    // Buttons — <input type="button"> / <input type="submit"> matched by getByRole('button')
    this.updateCartButton      = page.getByRole('button', { name: 'Update shopping cart' });
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue shopping' });
    this.checkoutButton        = page.getByRole('button', { name: 'Checkout' });

    // Coupon / gift card — inputs have no <label>; use name attribute (reliable, not sensitive)
    this.couponCodeInput   = page.locator('input[name="discountcouponcode"]');
    this.applyCouponButton = page.getByRole('button', { name: 'Apply coupon' });
    this.giftCardInput     = page.locator('input[name="giftcardcouponcode"]');
    this.applyGiftCardButton = page.getByRole('button', { name: 'Add gift card' });

    // Terms checkbox — <input id="termsofservice"> with visible label "I agree with the terms of service …"
    this.termsOfServiceCheckbox = page.getByRole('checkbox', { name: /terms of service/i });
    this.termsWarningDialog     = page.locator('#terms-of-service-warning-box');

    this.emptyCartMessage = page.locator('.order-summary-content');
    this.orderSubtotal    = page.locator('span.product-price.order-subtotal');
    this.orderShipping    = page.locator('span.product-price.shipping-price');
    this.orderTax         = page.locator('span.product-price.tax-value');
    this.orderTotal       = page.locator('span.product-price.order-total strong');
  }

  /** Returns all cart items with their parsed name, unit price, qty and subtotal. */
  async getCartItems(): Promise<CartItem[]> {
    const rowCount = await this.cartRows.count();
    const items: CartItem[] = [];

    for (let i = 0; i < rowCount; i++) {
      const row          = this.cartRows.nth(i);
      const name         = (await row.locator('.product-name').textContent())?.trim() || '';
      const unitPriceStr = (await row.locator('.product-unit-price').textContent()) || '0';
      const qtyStr       = (await row.locator('input.qty-input').inputValue()) || '0';
      const subtotalStr  = (await row.locator('.product-subtotal').textContent()) || '0';

      items.push({
        name,
        unitPrice: parseFloat(unitPriceStr.replace(/[^0-9.-]+/g, '')) || 0,
        quantity:  parseInt(qtyStr, 10) || 0,
        subtotal:  parseFloat(subtotalStr.replace(/[^0-9.-]+/g, '')) || 0,
      });
    }

    return items;
  }

  /** Updates the quantity for a row (0-based index) and refreshes the cart. */
  async updateItemQuantity(rowIndex: number, newQty: number) {
    const qtyInput = this.cartRows.nth(rowIndex).locator('input.qty-input');
    await qtyInput.fill(String(newQty));
    await this.updateCartButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Checks the remove checkbox for a row and updates the cart. */
  async removeItem(rowIndex: number) {
    await this.cartRows.nth(rowIndex).locator('input[name="removefromcart"]').check();
    await this.updateCartButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Removes every item from the cart. */
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
   * Optionally accepts the Terms of Service, then clicks Checkout.
   * Default: acceptTerms = true.
   */
  async proceedToCheckout(acceptTerms: boolean = true) {
    if (acceptTerms) {
      await this.termsOfServiceCheckbox.check();
    }
    await this.checkoutButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
