import { test, expect } from '../src/fixtures/testFixtures';

test.describe('Wishlist Functionality', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.gotoHome();
  });

  test('TC-WSH-01: Add product to wishlist updates badge and wishlist table @regression', async ({
    productDetailsPage,
    wishlistPage,
  }) => {
    await productDetailsPage.navigateTo('/black-white-diamond-heart');
    await productDetailsPage.addToWishlist(1);

    const wishlistCount = await productDetailsPage.getWishlistCount();
    expect(wishlistCount).toBeGreaterThanOrEqual(1);

    await productDetailsPage.clickWishlist();
    const names = await wishlistPage.getProductNames();
    expect(names.some(n => n.includes('Black & White Diamond Heart'))).toBeTruthy();
  });

  test('TC-WSH-02: Remove item from wishlist @regression', async ({
    productDetailsPage,
    wishlistPage,
  }) => {
    await productDetailsPage.navigateTo('/black-white-diamond-heart');
    await productDetailsPage.addToWishlist(1);

    await wishlistPage.navigateTo('/wishlist');
    const initialCount = await wishlistPage.wishlistRows.count();
    expect(initialCount).toBeGreaterThan(0);

    await wishlistPage.removeItem(0);

    const afterRemoveCount = await wishlistPage.wishlistRows.count();
    expect(afterRemoveCount).toBe(initialCount - 1);
  });

  test('TC-WSH-03: Move product from wishlist to shopping cart @regression', async ({
    productDetailsPage,
    wishlistPage,
    cartPage,
  }) => {
    await productDetailsPage.navigateTo('/black-white-diamond-heart');
    await productDetailsPage.addToWishlist(1);

    await wishlistPage.navigateTo('/wishlist');
    await wishlistPage.moveItemToCart(0);

    // Verify redirected to cart and item is present
    await expect(cartPage.cartTable).toBeVisible();
    const cartItems = await cartPage.getCartItems();
    expect(cartItems.some(i => i.name.includes('Black & White Diamond'))).toBeTruthy();
  });
});
