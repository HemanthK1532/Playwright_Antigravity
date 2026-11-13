import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for Category / Sub-Category Product Listings
 *
 * Locator strategy:
 *  - Page heading   → getByRole('heading', { level: 1 })
 *  - Sub-category links → getByRole('link') scoped to sub-category block
 *  - Sort / size / view selects → locator('#id') — these <select> elements have
 *    no associated <label>, so semantic locators cannot uniquely identify them
 *  - Product titles → getByRole('link') scoped within .product-title
 *  - Prices         → locator('.actual-price')  (no accessible name)
 */
export class CategoryPage extends BasePage {
  readonly pageTitle: Locator;
  readonly subCategories: Locator;
  readonly orderBySelect: Locator;
  readonly pageSizeSelect: Locator;
  readonly viewModeSelect: Locator;
  readonly productItems: Locator;
  readonly productTitles: Locator;
  readonly productPrices: Locator;

  constructor(page: Page) {
    super(page);

    this.pageTitle      = page.getByRole('heading', { level: 1 });
    this.subCategories  = page.locator('.sub-category-item h2').getByRole('link');

    // These selects have no <label> → ID fallback is correct here
    this.orderBySelect  = page.locator('#products-orderby');
    this.pageSizeSelect = page.locator('#products-pagesize');
    this.viewModeSelect = page.locator('#products-viewmode');

    this.productItems   = page.locator('.product-item');
    this.productTitles  = page.locator('.product-title').getByRole('link');
    this.productPrices  = page.locator('.prices .actual-price');
  }

  /**
   * Sorts the product list by the visible option label (e.g. "Price: Low to High").
   * Uses Promise.all because the select triggers a full-page navigation.
   */
  async sortBy(optionText: string) {
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }).catch(() => {}),
      this.orderBySelect.selectOption({ label: optionText }),
    ]);
  }

  /**
   * Changes the results-per-page size (e.g. "4", "8", "12").
   * Triggers full-page navigation.
   */
  async setPageSize(size: string) {
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }).catch(() => {}),
      this.pageSizeSelect.selectOption({ label: size }),
    ]);
  }

  /**
   * Switches the view mode between "Grid" and "List".
   * Triggers full-page navigation.
   */
  async setViewMode(mode: 'Grid' | 'List') {
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }).catch(() => {}),
      this.viewModeSelect.selectOption({ label: mode }),
    ]);
  }

  /** Returns every visible product title on the current page. */
  async getProductTitles(): Promise<string[]> {
    return this.productTitles.allTextContents();
  }

  /** Returns every visible product price as a parsed float. */
  async getProductPrices(): Promise<number[]> {
    const raw = await this.productPrices.allTextContents();
    return raw.map(t => {
      const val = parseFloat(t.replace(/[^0-9.-]+/g, ''));
      return isNaN(val) ? 0 : val;
    });
  }

  /** Opens a product by clicking its title link (filtered by text). */
  async openProduct(title: string) {
    await this.productTitles.filter({ hasText: title }).first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
