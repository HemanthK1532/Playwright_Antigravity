import { test, expect } from '../src/fixtures/testFixtures';

test.describe('Category, Sorting and Filtering', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.gotoHome();
    await homePage.selectCategory('Books');
  });

  test('TC-CAT-01: Category navigation displays products and correct category header @smoke @regression', async ({
    categoryPage,
  }) => {
    await expect(categoryPage.pageTitle).toHaveText('Books');
    const titles = await categoryPage.getProductTitles();
    expect(titles.length).toBeGreaterThan(0);
  });

  test('TC-CAT-02: Sort products by Price: Low to High @regression', async ({
    categoryPage,
  }) => {
    await categoryPage.sortBy('Price: Low to High');

    const prices = await categoryPage.getProductPrices();
    expect(prices.length).toBeGreaterThan(1);

    // Verify ascending order
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
    }
  });

  test('TC-CAT-03: Sort products by Price: High to Low @regression', async ({
    categoryPage,
  }) => {
    await categoryPage.sortBy('Price: High to Low');

    const prices = await categoryPage.getProductPrices();
    expect(prices.length).toBeGreaterThan(1);

    // Verify descending order
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1]);
    }
  });

  test('TC-CAT-04: Change page size limits displayed products @regression', async ({
    categoryPage,
  }) => {
    await categoryPage.setPageSize('4');
    const titles = await categoryPage.getProductTitles();
    expect(titles.length).toBeLessThanOrEqual(4);
  });

  test('TC-CAT-05: Switch between Grid and List view modes @regression', async ({
    categoryPage,
    page,
  }) => {
    await categoryPage.setViewMode('List');
    await expect(page.locator('.product-list')).toBeVisible();

    await categoryPage.setViewMode('Grid');
    await expect(page.locator('.product-grid')).toBeVisible();
  });
});
