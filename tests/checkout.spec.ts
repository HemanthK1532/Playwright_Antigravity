import { test, expect } from '../src/fixtures/testFixtures';
import { DataGenerator } from '../src/utils/dataGenerator';

test.describe('Checkout and Order Processing', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.gotoHome();
  });

  test('TC-CHK-01: End-to-End Guest Checkout with Cash on Delivery @smoke @regression @e2e', async ({
    productDetailsPage,
    cartPage,
    loginPage,
    checkoutPage,
  }) => {
    // 1. Add product to cart
    await productDetailsPage.navigateTo('/computing-and-internet');
    await productDetailsPage.addToCart(1);

    // 2. Open cart and proceed to checkout
    await productDetailsPage.clickShoppingCart();
    await cartPage.proceedToCheckout(true);

    // 3. Select Checkout as Guest
    await expect(loginPage.checkoutAsGuestButton).toBeVisible();
    await loginPage.clickCheckoutAsGuest();

    // 4. Step 1: Billing Address
    const guestData = DataGenerator.generateAddressData();
    await checkoutPage.fillBillingAddress(guestData);

    // 5. Step 2: Shipping Address
    await checkoutPage.completeShippingAddress();

    // 6. Step 3: Shipping Method
    await checkoutPage.selectShippingMethod('ground');

    // 7. Step 4: Payment Method (Cash On Delivery)
    await checkoutPage.selectPaymentMethod('cod');

    // 8. Step 5: Payment Info
    await checkoutPage.completePaymentInfo();

    // 9. Step 6: Confirm Order
    await checkoutPage.confirmOrder();

    // 10. Verification of Order Completion
    await expect(checkoutPage.orderCompletedTitle).toBeVisible({ timeout: 20000 });
    await expect(checkoutPage.orderCompletedTitle).toContainText('Your order has been successfully processed!');

    const orderNumber = await checkoutPage.getOrderNumber();
    expect(orderNumber).toBeTruthy();
    expect(parseInt(orderNumber, 10)).toBeGreaterThan(0);
  });

  test('TC-CHK-02: End-to-End Registered Customer Checkout and Order History verification @regression @e2e', async ({
    registerPage,
    productDetailsPage,
    cartPage,
    checkoutPage,
    accountPage,
    homePage,
  }) => {
    // 1. Register a fresh unique user
    const user = {
      gender: 'male' as const,
      firstName: 'Buyer',
      lastName: 'Automation',
      email: DataGenerator.generateRandomEmail('buyer_e2e'),
      password: 'Password123!',
      confirmPassword: 'Password123!'
    };

    await homePage.clickRegister();
    await registerPage.fillAndSubmitRegistration(user);
    await expect(registerPage.registrationResult).toContainText('Your registration completed');

    // 2. Add product to cart
    await productDetailsPage.navigateTo('/fiction');
    await productDetailsPage.addToCart(1);

    // 3. Go to cart and proceed
    await productDetailsPage.clickShoppingCart();
    await cartPage.proceedToCheckout(true);

    // 4. Fill Billing Address
    const address = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      country: 'United States',
      city: 'Boston',
      address1: '456 Automation Way',
      zipPostalCode: '02108',
      phoneNumber: '6175550199'
    };
    await checkoutPage.fillBillingAddress(address);

    // 5. Progress through Shipping, Shipping Method, Payment Method & Confirm
    await checkoutPage.completeShippingAddress();
    await checkoutPage.selectShippingMethod('ground');
    await checkoutPage.selectPaymentMethod('cod');
    await checkoutPage.completePaymentInfo();
    await checkoutPage.confirmOrder();

    // 6. Verify completion and capture Order ID
    await expect(checkoutPage.orderCompletedTitle).toBeVisible({ timeout: 20000 });
    const orderId = await checkoutPage.getOrderNumber();
    expect(orderId).toBeTruthy();

    // 7. Verify order exists in Customer Account Order History
    await homePage.accountLink.click();
    await accountPage.goToOrders();
    const recordedOrders = await accountPage.getOrderNumbers();
    expect(recordedOrders).toContain(orderId);
  });
});
