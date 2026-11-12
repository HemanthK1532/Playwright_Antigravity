import { test, expect } from '../src/fixtures/testFixtures';
import productsData from '../src/data/products.json';

test.describe('Product Search', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.gotoHome();
  });

  test('TC-SRCH-01: Quick search by exact product keyword returns matching products @smoke @regression', async ({
    homePage,
    searchPage,
  }) => {
    await homePage.searchFor(productsData.searchQueries.exactKeyword);

    const titles = await searchPage.getResultTitles();
    expect(titles.length).toBeGreaterThan(0);
    expect(
      titles.some(title => title.toLowerCase().includes(productsData.searchQueries.exactKeyword.toLowerCase()))
    ).toBeTruthy();
  });

  test('TC-SRCH-02: Quick search by partial keyword returns multiple matches @regression', async ({
    homePage,
    searchPage,
  }) => {
    await homePage.searchFor(productsData.searchQueries.partialKeyword);

    const titles = await searchPage.getResultTitles();
    expect(titles.length).toBeGreaterThan(0);
  });

  test('TC-SRCH-03: Search with non-existent keyword displays no results message @regression', async ({
    homePage,
    searchPage,
  }) => {
    await homePage.searchFor(productsData.searchQueries.zeroResultsKeyword);

    await expect(searchPage.noResultsMessage).toBeVisible();
    await expect(searchPage.noResultsMessage).toContainText(
      'No products were found that matched your criteria.'
    );
  });

  test('TC-SRCH-04: Empty search triggers browser alert prompt @regression', async ({
    page,
    homePage,
  }) => {
    let dialogMessage = '';
    page.once('dialog', async dialog => {
      dialogMessage = dialog.message();
      await dialog.accept();
    });

    await homePage.searchInput.fill('');
    await homePage.searchButton.click();

    expect(dialogMessage).toContain('Please enter some search keyword');
  });

  test('TC-SRCH-05: Advanced search filtered by category @regression', async ({
    homePage,
    searchPage,
  }) => {
    await homePage.searchFor('computer');
    await searchPage.performAdvancedSearch({
      keyword: 'computer',
      categoryId: '2', // Computers
      includeSubcategories: true
    });

    const titles = await searchPage.getResultTitles();
    expect(titles.length).toBeGreaterThan(0);
  });
});
