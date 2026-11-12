import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for Customer Account and Order History
 */
export class CustomerAccountPage extends BasePage {
  readonly customerInfoLink: Locator;
  readonly addressesLink: Locator;
  readonly ordersLink: Locator;
  readonly changePasswordLink: Locator;

  // Customer info fields
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly saveCustomerInfoBtn: Locator;

  // Order history
  readonly orderItems: Locator;
  readonly orderNumbers: Locator;

  constructor(page: Page) {
    super(page);
    this.customerInfoLink = page.locator('a[href*="/customer/info"]');
    this.addressesLink = page.locator('a[href*="/customer/addresses"]');
    this.ordersLink = page.locator('a[href*="/customer/orders"]');
    this.changePasswordLink = page.locator('a[href*="/customer/changepassword"]');

    this.firstNameInput = page.locator('#FirstName');
    this.lastNameInput = page.locator('#LastName');
    this.emailInput = page.locator('#Email');
    this.saveCustomerInfoBtn = page.locator('input.save-customer-info-button');

    this.orderItems = page.locator('.order-list .order-item');
    this.orderNumbers = page.locator('.order-list .order-item .title strong');
  }

  /**
   * Navigates to orders history
   */
  async goToOrders() {
    await this.ordersLink.first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Retrieves list of order numbers from account history
   */
  async getOrderNumbers(): Promise<string[]> {
    const raw = await this.orderNumbers.allTextContents();
    return raw.map(t => {
      const match = t.match(/\d+/);
      return match ? match[0] : '';
    }).filter(Boolean);
  }
}
