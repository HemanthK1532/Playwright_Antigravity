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
 * Page Object for the One-Page Checkout (OPC)
 *
 * Locator strategy:
 *  - Billing text inputs   → getByLabel() — nopCommerce renders proper <label for="…">
 *  - Country / State selects → getByLabel() (labels present)
 *  - Continue / Confirm buttons → getByRole('button', { name: … }) scoped to step containers
 *    to avoid matching multiple "Continue" buttons on the collapsed OPC accordion
 *  - Shipping options (radios) → getByRole('radio') scoped within the step panel
 *  - Payment method radios → getByRole('radio') scoped within the step panel
 *  - Order completed heading  → getByRole('heading') / getByText()
 *  - ID fallbacks are used only for shipping/payment radios that have no label text
 */
export class CheckoutPage extends BasePage {
  // ── Step 1: Billing Address ────────────────────────────────────────────────
  readonly billingSection: Locator;
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

  // ── Step 2: Shipping Address ───────────────────────────────────────────────
  readonly shippingSection: Locator;
  readonly shippingSelect: Locator;
  readonly pickUpInStoreCheckbox: Locator;
  readonly shippingContinueBtn: Locator;

  // ── Step 3: Shipping Method ────────────────────────────────────────────────
  readonly shippingMethodSection: Locator;
  readonly groundShippingOption: Locator;
  readonly nextDayShippingOption: Locator;
  readonly secondDayShippingOption: Locator;
  readonly shippingMethodContinueBtn: Locator;

  // ── Step 4: Payment Method ─────────────────────────────────────────────────
  readonly paymentMethodSection: Locator;
  readonly paymentMethodCashOnDelivery: Locator;
  readonly paymentMethodCheck: Locator;
  readonly paymentMethodCreditCard: Locator;
  readonly paymentMethodContinueBtn: Locator;

  // ── Step 5: Payment Info ───────────────────────────────────────────────────
  readonly paymentInfoSection: Locator;
  readonly paymentInfoInstruction: Locator;
  readonly paymentInfoContinueBtn: Locator;

  // ── Step 6: Confirm Order ──────────────────────────────────────────────────
  readonly confirmSection: Locator;
  readonly confirmOrderBtn: Locator;

  // ── Order Completed ────────────────────────────────────────────────────────
  readonly orderCompletedTitle: Locator;
  readonly orderNumberText: Locator;
  readonly orderDetailsLink: Locator;
  readonly orderCompletedContinueBtn: Locator;

  constructor(page: Page) {
    super(page);

    // Section containers — scope buttons to prevent matching across all steps
    this.billingSection        = page.locator('#opc-billing');
    this.shippingSection       = page.locator('#opc-shipping');
    this.shippingMethodSection = page.locator('#opc-shipping_method');
    this.paymentMethodSection  = page.locator('#opc-payment_method');
    this.paymentInfoSection    = page.locator('#opc-payment_info');
    this.confirmSection        = page.locator('#opc-confirm_order');

    // ── Billing ────────────────────────────────────────────────────────────
    // Address dropdown (registered users with saved addresses)
    this.billingSelect = page.locator('#billing-address-select');

    // Input fields — labels are "First Name:", "Last Name:", "Email:", etc.
    this.billingFirstName    = page.getByLabel('First Name:').first();
    this.billingLastName     = page.getByLabel('Last Name:').first();
    this.billingEmail        = page.getByLabel('Email:').first();
    this.billingCompany      = page.getByLabel('Company:').first();
    this.billingCountrySelect = page.getByLabel('Country:').first();
    this.billingStateSelect  = page.getByLabel('State / province:').first();
    this.billingCity         = page.getByLabel('City:').first();
    this.billingAddress1     = page.getByLabel('Address 1:').first();
    this.billingZipPostalCode = page.getByLabel('Zip / postal code:').first();
    this.billingPhoneNumber  = page.getByLabel('Phone number:').first();

    // Continue button — scoped to billing section to avoid matching other steps
    this.billingContinueBtn = this.billingSection.getByRole('button', { name: 'Continue' });

    // ── Shipping ───────────────────────────────────────────────────────────
    this.shippingSelect         = page.locator('#shipping-address-select');
    this.pickUpInStoreCheckbox  = page.getByRole('checkbox', { name: /pick up in store/i });
    this.shippingContinueBtn    = this.shippingSection.getByRole('button', { name: 'Continue' });

    // ── Shipping Method ────────────────────────────────────────────────────
    // Radios use id="shippingoption_N" with adjacent labels — locator fallback acceptable
    this.groundShippingOption       = page.locator('#shippingoption_0');
    this.nextDayShippingOption      = page.locator('#shippingoption_1');
    this.secondDayShippingOption    = page.locator('#shippingoption_2');
    this.shippingMethodContinueBtn  = this.shippingMethodSection.getByRole('button', { name: 'Continue' });

    // ── Payment Method ─────────────────────────────────────────────────────
    this.paymentMethodCashOnDelivery = page.locator('#paymentmethod_0');
    this.paymentMethodCheck          = page.locator('#paymentmethod_1');
    this.paymentMethodCreditCard     = page.locator('#paymentmethod_2');
    this.paymentMethodContinueBtn    = this.paymentMethodSection.getByRole('button', { name: 'Continue' });

    // ── Payment Info ───────────────────────────────────────────────────────
    this.paymentInfoInstruction  = page.locator('#checkout-step-payment-info .info');
    this.paymentInfoContinueBtn  = this.paymentInfoSection.getByRole('button', { name: 'Continue' });

    // ── Confirm Order ──────────────────────────────────────────────────────
    this.confirmOrderBtn = this.confirmSection.getByRole('button', { name: 'Confirm' });

    // ── Order Completed ────────────────────────────────────────────────────
    this.orderCompletedTitle      = page.getByText('Your order has been successfully processed!');
    this.orderNumberText          = page.locator('.section.order-completed ul.details li').filter({ hasText: 'Order number' });
    this.orderDetailsLink         = page.getByRole('link', { name: /click here for order details/i });
    this.orderCompletedContinueBtn = page.getByRole('button', { name: 'Continue' });
  }

  /** Completes Step 1: fills billing address fields and clicks Continue. */
  async fillBillingAddress(data: BillingAddressDetails) {
    if (await this.billingSelect.isVisible()) {
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

  /** Completes Step 2: Shipping Address (uses same address as billing by default). */
  async completeShippingAddress() {
    await expect(this.shippingContinueBtn).toBeVisible({ timeout: 15000 });
    await this.shippingContinueBtn.click();
  }

  /** Completes Step 3: selects a shipping method and continues. */
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

  /** Completes Step 4: selects a payment method and continues. */
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

  /** Completes Step 5: Payment Info (instruction step — just continues). */
  async completePaymentInfo() {
    await expect(this.paymentInfoContinueBtn).toBeVisible({ timeout: 15000 });
    await this.paymentInfoContinueBtn.click();
  }

  /** Completes Step 6: Confirm Order. */
  async confirmOrder() {
    await expect(this.confirmOrderBtn).toBeVisible({ timeout: 15000 });
    await this.confirmOrderBtn.click();
  }

  /** Runs the entire checkout from billing through order confirmation. */
  async completeFullCheckout(billingData: BillingAddressDetails) {
    await this.fillBillingAddress(billingData);
    await this.completeShippingAddress();
    await this.selectShippingMethod('ground');
    await this.selectPaymentMethod('cod');
    await this.completePaymentInfo();
    await this.confirmOrder();
    await expect(this.orderCompletedTitle).toBeVisible({ timeout: 20000 });
  }

  /** Extracts the numeric order ID from the success page. */
  async getOrderNumber(): Promise<string> {
    const text  = (await this.orderNumberText.textContent()) || '';
    const match = text.match(/\d+/);
    return match ? match[0] : '';
  }
}
