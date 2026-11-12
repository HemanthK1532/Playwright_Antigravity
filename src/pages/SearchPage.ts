import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for Search and Advanced Search
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
    this.searchKeywordInput = page.locator('#Q');
    this.advancedSearchCheckbox = page.locator('#As');
    this.categorySelect = page.locator('#Cid');
    this.includeSubcategoriesCheckbox = page.locator('#Isc');
    this.manufacturerSelect = page.locator('#Mid');
    this.priceFromInput = page.locator('#Pf');
    this.priceToInput = page.locator('#Pt');
    this.searchInDescriptionCheckbox = page.locator('#Sid');
    this.searchSubmitButton = page.locator('input.button-1.search-button');

    this.searchResults = page.locator('.product-grid .product-item');
    this.productTitles = page.locator('.product-title a');
    this.noResultsMessage = page.locator('strong.result');
    this.warningMessage = page.locator('.warning');
  }

  /**
   * Executes advanced search
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

  /**
   * Gets list of all product titles returned
   */
  async getResultTitles(): Promise<string[]> {
    return await this.productTitles.allTextContents();
  }
}
