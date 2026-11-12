import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for Home Page
 */
export class HomePage extends BasePage {
  readonly pageTitle: Locator;
  readonly featuredProducts: Locator;
  readonly newsletterInput: Locator;
  readonly newsletterSubscribeButton: Locator;
  readonly newsletterResult: Locator;
  readonly communityPollOptions: Locator;
  readonly voteButton: Locator;
  readonly voteAlert: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.topic-html-content-header');
    this.featuredProducts = page.locator('.product-grid .product-item');
    this.newsletterInput = page.locator('#newsletter-email');
    this.newsletterSubscribeButton = page.locator('#newsletter-subscribe-button');
    this.newsletterResult = page.locator('#newsletter-result-block');
    this.communityPollOptions = page.locator('.poll-options input[type="radio"]');
    this.voteButton = page.locator('#vote-poll-1');
    this.voteAlert = page.locator('#block-poll-vote-error-1');
  }

  /**
   * Returns locator for a featured product by title
   */
  getFeaturedProductByName(productName: string): Locator {
    return this.featuredProducts.filter({ hasText: productName }).first();
  }

  /**
   * Clicks on a featured product by name to open its details
   */
  async clickFeaturedProduct(productName: string) {
    const product = this.getFeaturedProductByName(productName);
    await product.locator('.product-title a').click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Subscribes to newsletter
   */
  async subscribeToNewsletter(email: string) {
    await this.newsletterInput.fill(email);
    await this.newsletterSubscribeButton.click();
  }

  /**
   * Casts a community poll vote by option index (0-based)
   */
  async voteCommunityPoll(optionIndex: number = 0) {
    await this.communityPollOptions.nth(optionIndex).check();
    await this.voteButton.click();
  }
}
