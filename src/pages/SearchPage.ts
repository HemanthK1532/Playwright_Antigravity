import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for the Search Results page (/search)
 *
 * Locator strategy:
 *  - Keyword input        → getByRole('textbox', { name: /search keyword/i })  (label text on page)
 *  - Advanced checkbox    → getByRole('checkbox', { name: /advanced search/i })
 *  - Search button        → getByRole('button', { name: 'Search' })
 *  - Price inputs         → getByRole('textbox') scoped by label — fall back to ID when label is absent
 *  - No-results message   → getByText()  (exact visible text)
 *  - Warning message      → locator('.warning')  (no semantic equivalent)
 *
 * Note: The search page keyword input uses id="Q" (capital Q) — different from
 * the header mini-search id="small-searchterms".
 */
export class SearchPage extends BasePage {
  readonly searchKeywordInput: Locator;
  readonly advancedSearchCheckbox: Locator;
  readonly categorySelect: Locator;
  readonly includeSubcategoriesCheckbox: Locator;
  readonly manufacturerSelect: Locator;
  readonly priceFromInput: Locator;
  readonly priceToInput: Locator;
  readonly searchInDescriptionCheckbox: Locator;
  readonly searchSubmitButton: Locator;

  readonly searchResults: Locator;
  readonly productTitles: Locator;
  readonly noResultsMessage: Locator;
  readonly warningMessage: Locator;

  constructor(page: Page) {
    super(page);

    // Main keyword field — label: "Search keyword:"
    this.searchKeywordInput = page.getByLabel('Search keyword:');

    // Advanced search toggle — label: "Advanced search"
    this.advancedSearchCheckbox = page.getByRole('checkbox', { name: /advanced search/i });

    // Advanced search selects — no accessible names; use IDs (acceptable fallback)
    this.categorySelect              = page.locator('#Cid');
    this.includeSubcategoriesCheckbox = page.getByRole('checkbox', { name: /include subcategories/i });
    this.manufacturerSelect          = page.locator('#Mid');

    // Price range inputs — labels: "Price range: From" / "to"
    this.priceFromInput = page.locator('#Pf');
    this.priceToInput   = page.locator('#Pt');

    // Search in description checkbox — label: "Search in product descriptions"
    this.searchInDescriptionCheckbox = page.getByRole('checkbox', { name: /search in product descriptions/i });

    // Submit button
    this.searchSubmitButton = page.getByRole('button', { name: 'Search' });

    // Result elements
    this.searchResults   = page.locator('.product-grid .product-item');
    this.productTitles   = page.locator('.product-title a');
    this.noResultsMessage = page.getByText('No products were found that matched your criteria.');
    this.warningMessage  = page.locator('.warning');
  }

  /**
   * Performs an advanced search with the supplied options.
   * Only sets fields whose value is provided; does not change unconfigured fields.
   */
  async performAdvancedSearch(options: {
    keyword: string;
    categoryId?: string;
    includeSubcategories?: boolean;
    priceFrom?: string;
    priceTo?: string;
    searchInDescription?: boolean;
  }) {
    await this.searchKeywordInput.fill(options.keyword);

    if (!await this.advancedSearchCheckbox.isChecked()) {
      await this.advancedSearchCheckbox.check();
    }

    if (options.categoryId) {
      await this.categorySelect.selectOption(options.categoryId);
    }
    if (options.includeSubcategories) {
      await this.includeSubcategoriesCheckbox.check();
    }
    if (options.priceFrom) {
      await this.priceFromInput.fill(options.priceFrom);
    }
    if (options.priceTo) {
      await this.priceToInput.fill(options.priceTo);
    }
    if (options.searchInDescription) {
      await this.searchInDescriptionCheckbox.check();
    }

    await this.searchSubmitButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Returns all product title strings from the current result set. */
  async getResultTitles(): Promise<string[]> {
    return this.productTitles.allTextContents();
  }
}
