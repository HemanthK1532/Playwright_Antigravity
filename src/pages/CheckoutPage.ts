import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export interface BillingAddressDetails {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  countryId?: string;
  state?: string;
  city: string;
  address1: string;
  zipPostalCode: string;
  phoneNumber: string;
  company?: string;
}

/**
 * Page Object for One-Page Checkout (OPC)
 */
export class CheckoutPage extends BasePage {
  // Step 1: Billing Address
  readonly billingSelect: Locator;
  readonly billingFirstName: Locator;
  readonly billingLastName: Locator;
  readonly billingEmail: Locator;
  readonly billingCompany: Locator;
  readonly billingCountrySelect: Locator;
  readonly billingStateSelect: Locator;
  readonly billingCity: Locator;
  readonly billingAddress1: Locator;
  readonly billingZipPostalCode: Locator;
  readonly billingPhoneNumber: Locator;
  readonly billingContinueBtn: Locator;

  // Step 2: Shipping Address
  readonly shippingSelect: Locator;
  readonly pickUpInStoreCheckbox: Locator;
  readonly shippingContinueBtn: Locator;

  // Step 3: Shipping Method
  readonly groundShippingOption: Locator;
  readonly nextDayShippingOption: Locator;
  readonly secondDayShippingOption: Locator;
  readonly shippingMethodContinueBtn: Locator;

  // Step 4: Payment Method
  readonly paymentMethodCashOnDelivery: Locator;
  readonly paymentMethodCheck: Locator;
  readonly paymentMethodCreditCard: Locator;
  readonly paymentMethodContinueBtn: Locator;

  // Step 5: Payment Info
  readonly paymentInfoInstruction: Locator;
  readonly paymentInfoContinueBtn: Locator;

  // Step 6: Confirm Order
  readonly confirmOrderBtn: Locator;

  // Order Completed
  readonly orderCompletedTitle: Locator;
  readonly orderNumberText: Locator;
  readonly orderDetailsLink: Locator;
  readonly orderCompletedContinueBtn: Locator;

  constructor(page: Page) {
    super(page);
    // Billing
    this.billingSelect = page.locator('#billing-address-select');
    this.billingFirstName = page.locator('#BillingNewAddress_FirstName');
    this.billingLastName = page.locator('#BillingNewAddress_LastName');
    this.billingEmail = page.locator('#BillingNewAddress_Email');
    this.billingCompany = page.locator('#BillingNewAddress_Company');
    this.billingCountrySelect = page.locator('#BillingNewAddress_CountryId');
    this.billingStateSelect = page.locator('#BillingNewAddress_StateProvinceId');
    this.billingCity = page.locator('#BillingNewAddress_City');
    this.billingAddress1 = page.locator('#BillingNewAddress_Address1');
    this.billingZipPostalCode = page.locator('#BillingNewAddress_ZipPostalCode');
    this.billingPhoneNumber = page.locator('#BillingNewAddress_PhoneNumber');
    this.billingContinueBtn = page.locator('#billing-buttons-container input.button-1, input[onclick="Billing.save()"]');

    // Shipping Address
    this.shippingSelect = page.locator('#shipping-address-select');
    this.pickUpInStoreCheckbox = page.locator('#PickUpInStore');
    this.shippingContinueBtn = page.locator('#shipping-buttons-container input.button-1, input[onclick="Shipping.save()"]');

    // Shipping Method
    this.groundShippingOption = page.locator('#shippingoption_0');
    this.nextDayShippingOption = page.locator('#shippingoption_1');
    this.secondDayShippingOption = page.locator('#shippingoption_2');
    this.shippingMethodContinueBtn = page.locator('#shipping-method-buttons-container input.button-1, input[onclick="ShippingMethod.save()"]');

    // Payment Method
    this.paymentMethodCashOnDelivery = page.locator('#paymentmethod_0');
    this.paymentMethodCheck = page.locator('#paymentmethod_1');
    this.paymentMethodCreditCard = page.locator('#paymentmethod_2');
    this.paymentMethodContinueBtn = page.locator('#payment-method-buttons-container input.button-1, input[onclick="PaymentMethod.save()"]');

    // Payment Info
    this.paymentInfoInstruction = page.locator('#checkout-step-payment-info .info');
    this.paymentInfoContinueBtn = page.locator('#payment-info-buttons-container input.button-1, input[onclick="PaymentInfo.save()"]');

    // Confirm Order
    this.confirmOrderBtn = page.locator('#confirm-order-buttons-container input.button-1, input[onclick="ConfirmOrder.save()"]');

    // Completed
    this.orderCompletedTitle = page.locator('.section.order-completed .title');
    this.orderNumberText = page.locator('.section.order-completed ul.details li:has-text("Order number")');
    this.orderDetailsLink = page.locator('.section.order-completed a:has-text("Click here for order details.")');
    this.orderCompletedContinueBtn = page.locator('input.button-2.order-completed-continue-button');
  }

  /**
   * Completes Step 1: Billing Address
   */
  async fillBillingAddress(data: BillingAddressDetails) {
    if (await this.billingSelect.isVisible()) {
      // If dropdown exists, select 'New Address' if needed
      await this.billingSelect.selectOption({ label: 'New Address' }).catch(() => {});
    }

    if (await this.billingFirstName.isVisible()) {
      await this.billingFirstName.fill(data.firstName);
      await this.billingLastName.fill(data.lastName);
      await this.billingEmail.fill(data.email);
      if (data.company) await this.billingCompany.fill(data.company);
      await this.billingCountrySelect.selectOption({ label: data.country });
      if (data.state && await this.billingStateSelect.isVisible()) {
        await this.page.waitForTimeout(500); // Allow state dropdown to populate
        await this.billingStateSelect.selectOption({ label: data.state }).catch(async () => {
          await this.billingStateSelect.selectOption({ index: 1 });
        });
      }
      await this.billingCity.fill(data.city);
      await this.billingAddress1.fill(data.address1);
      await this.billingZipPostalCode.fill(data.zipPostalCode);
      await this.billingPhoneNumber.fill(data.phoneNumber);
    }

    await this.billingContinueBtn.click();
  }

  /**
   * Completes Step 2: Shipping Address
   */
  async completeShippingAddress() {
    await expect(this.shippingContinueBtn).toBeVisible({ timeout: 15000 });
    await this.shippingContinueBtn.click();
  }

  /**
   * Completes Step 3: Shipping Method
   */
  async selectShippingMethod(method: 'ground' | 'nextDay' | 'secondDay' = 'ground') {
    await expect(this.shippingMethodContinueBtn).toBeVisible({ timeout: 15000 });
    if (method === 'nextDay' && await this.nextDayShippingOption.isVisible()) {
      await this.nextDayShippingOption.check();
    } else if (method === 'secondDay' && await this.secondDayShippingOption.isVisible()) {
      await this.secondDayShippingOption.check();
    } else {
      await this.groundShippingOption.check().catch(() => {});
    }
    await this.shippingMethodContinueBtn.click();
  }

  /**
   * Completes Step 4: Payment Method
   */
  async selectPaymentMethod(method: 'cod' | 'check' | 'creditCard' = 'cod') {
    await expect(this.paymentMethodContinueBtn).toBeVisible({ timeout: 15000 });
    if (method === 'check' && await this.paymentMethodCheck.isVisible()) {
      await this.paymentMethodCheck.check();
    } else if (method === 'creditCard' && await this.paymentMethodCreditCard.isVisible()) {
      await this.paymentMethodCreditCard.check();
    } else {
      await this.paymentMethodCashOnDelivery.check().catch(() => {});
    }
    await this.paymentMethodContinueBtn.click();
  }

  /**
   * Completes Step 5: Payment Information
   */
  async completePaymentInfo() {
    await expect(this.paymentInfoContinueBtn).toBeVisible({ timeout: 15000 });
    await this.paymentInfoContinueBtn.click();
  }

  /**
   * Completes Step 6: Confirm Order
   */
  async confirmOrder() {
    await expect(this.confirmOrderBtn).toBeVisible({ timeout: 15000 });
    await this.confirmOrderBtn.click();
  }

  /**
   * Executes entire checkout sequence end-to-end
   */
  async completeFullCheckout(billingData: BillingAddressDetails) {
    await this.fillBillingAddress(billingData);
    await this.completeShippingAddress();
    await this.selectShippingMethod('ground');
    await this.selectPaymentMethod('cod');
    await this.completePaymentInfo();
    await this.confirmOrder();
    await expect(this.orderCompletedTitle).toBeVisible({ timeout: 20000 });
  }

  /**
   * Extracts order ID from success page
   */
  async getOrderNumber(): Promise<string> {
    const text = (await this.orderNumberText.textContent()) || '';
    const match = text.match(/\d+/);
    return match ? match[0] : '';
  }
}
