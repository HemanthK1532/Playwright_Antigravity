import { test, expect } from '../src/fixtures/testFixtures';

test.describe('Shopping Cart Management', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.gotoHome();
  });

  test('TC-CART-01: Add product to shopping cart updates badge and cart content @smoke @regression', async ({
    productDetailsPage,
    cartPage,
  }) => {
    // Navigate directly to a verified product
    await productDetailsPage.navigateTo('/computing-and-internet');
    const unitPrice = await productDetailsPage.getPrice();

    // Add 1 item
    await productDetailsPage.addToCart(1);

    // Verify cart badge count is at least 1
    const cartCount = await productDetailsPage.getCartCount();
    expect(cartCount).toBeGreaterThanOrEqual(1);

    // Open Cart page
    await productDetailsPage.clickShoppingCart();

    const items = await cartPage.getCartItems();
    expect(items.length).toBeGreaterThan(0);
    const addedItem = items.find(item => item.name.includes('Computing and Internet'));
    expect(addedItem).toBeDefined();
    expect(addedItem?.quantity).toBe(1);
    expect(addedItem?.unitPrice).toBe(unitPrice);
  });

  test('TC-CART-02: Update item quantity in shopping cart recalculates subtotal @regression', async ({
    productDetailsPage,
    cartPage,
  }) => {
    await productDetailsPage.navigateTo('/computing-and-internet');
    await productDetailsPage.addToCart(1);

    await cartPage.navigateTo('/cart');
    const initialItems = await cartPage.getCartItems();
    expect(initialItems.length).toBeGreaterThan(0);

    const unitPrice = initialItems[0].unitPrice;
    const newQty = 3;

    await cartPage.updateItemQuantity(0, newQty);

    const updatedItems = await cartPage.getCartItems();
    expect(updatedItems[0].quantity).toBe(newQty);
    expect(updatedItems[0].subtotal).toBeCloseTo(unitPrice * newQty, 2);
  });

  test('TC-CART-03: Remove item from shopping cart @regression', async ({
    productDetailsPage,
    cartPage,
  }) => {
    await productDetailsPage.navigateTo('/fiction');
    await productDetailsPage.addToCart(1);

    await cartPage.navigateTo('/cart');
    const initialItems = await cartPage.getCartItems();
    const initialCount = initialItems.length;

    await cartPage.removeItem(0);

    if (initialCount === 1) {
      await expect(cartPage.emptyCartMessage).toContainText('Your Shopping Cart is empty!');
    } else {
      const remainingItems = await cartPage.getCartItems();
      expect(remainingItems.length).toBe(initialCount - 1);
    }
  });

  test('TC-CART-04: Checkout without accepting terms of service displays warning dialog @regression', async ({
    productDetailsPage,
    cartPage,
  }) => {
    await productDetailsPage.navigateTo('/computing-and-internet');
    await productDetailsPage.addToCart(1);

    await cartPage.navigateTo('/cart');

    // Click checkout without checking terms
    await cartPage.proceedToCheckout(false);

    await expect(cartPage.termsWarningDialog).toBeVisible();
    await expect(cartPage.termsWarningDialog).toContainText(
      'Please accept the terms of service before the next step.'
    );
  });
});
