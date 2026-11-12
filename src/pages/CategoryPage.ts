import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for Category and Subcategory Listings
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
    this.pageTitle = page.locator('.page-title h1');
    this.subCategories = page.locator('.sub-category-item h2 a');
    this.orderBySelect = page.locator('#products-orderby');
    this.pageSizeSelect = page.locator('#products-pagesize');
    this.viewModeSelect = page.locator('#products-viewmode');
    this.productItems = page.locator('.product-item');
    this.productTitles = page.locator('.product-title a');
    this.productPrices = page.locator('.prices .actual-price');
  }

  /**
   * Sort products by option text (e.g. "Price: Low to High", "Name: A to Z")
   */
  async sortBy(optionText: string) {
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }).catch(() => {}),
      this.orderBySelect.selectOption({ label: optionText })
    ]);
  }

  /**
   * Set page display size (e.g. "4", "8", "12")
   */
  async setPageSize(size: string) {
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }).catch(() => {}),
      this.pageSizeSelect.selectOption({ label: size })
    ]);
  }

  /**
   * Set view mode ("Grid" or "List")
   */
  async setViewMode(mode: 'Grid' | 'List') {
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }).catch(() => {}),
      this.viewModeSelect.selectOption({ label: mode })
    ]);
  }

  /**
   * Gets all product titles currently displayed on the page
   */
  async getProductTitles(): Promise<string[]> {
    return await this.productTitles.allTextContents();
  }

  /**
   * Gets all product prices currently displayed on the page as numbers
   */
  async getProductPrices(): Promise<number[]> {
    const raw = await this.productPrices.allTextContents();
    return raw.map(t => {
      const cleaned = t.replace(/[^0-9.-]+/g, '');
      const val = parseFloat(cleaned);
      return isNaN(val) ? 0 : val;
    });
  }

  /**
   * Opens product details by title
   */
  async openProduct(title: string) {
    await this.productTitles.filter({ hasText: title }).first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
