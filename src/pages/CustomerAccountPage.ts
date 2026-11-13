import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for Customer Account & Order History (/customer/info, /customer/orders)
 *
 * Locator strategy:
 *  - Navigation links  → getByRole('link', { name: … })
 *  - Form text inputs  → getByLabel()
 *  - Save button       → getByRole('button', { name: 'Save' })
 *  - Order items       → locator() — complex structure, no semantic locators available
 */
export class CustomerAccountPage extends BasePage {
  // ── Account sidebar navigation ─────────────────────────────────────────────
  readonly customerInfoLink: Locator;
  readonly addressesLink: Locator;
  readonly ordersLink: Locator;
  readonly changePasswordLink: Locator;

  // ── Customer Info form ─────────────────────────────────────────────────────
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly saveCustomerInfoBtn: Locator;

  // ── Order history ──────────────────────────────────────────────────────────
  readonly orderItems: Locator;
  readonly orderNumbers: Locator;

  constructor(page: Page) {
    super(page);

    // Sidebar nav links — text matches the visible link labels exactly
    this.customerInfoLink   = page.getByRole('link', { name: 'Customer info' });
    this.addressesLink      = page.getByRole('link', { name: 'Addresses' });
    this.ordersLink         = page.getByRole('link', { name: 'Orders' });
    this.changePasswordLink = page.getByRole('link', { name: 'Change password' });

    // Customer info form — labels: "First name:", "Last name:", "Email:"
    this.firstNameInput     = page.getByLabel('First name:');
    this.lastNameInput      = page.getByLabel('Last name:');
    this.emailInput         = page.getByLabel('Email:');
    this.saveCustomerInfoBtn = page.getByRole('button', { name: 'Save' });

    // Order history — complex markup; no accessible labels
    this.orderItems   = page.locator('.order-list .order-item');
    this.orderNumbers = page.locator('.order-list .order-item .title strong');
  }

  /** Navigates to the Orders history page via the sidebar link. */
  async goToOrders() {
    await this.ordersLink.first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Returns all order IDs from the order history list. */
  async getOrderNumbers(): Promise<string[]> {
    const raw = await this.orderNumbers.allTextContents();
    return raw
      .map(t => { const m = t.match(/\d+/); return m ? m[0] : ''; })
      .filter(Boolean);
  }
}
