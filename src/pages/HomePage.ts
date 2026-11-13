import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for the Home Page (/)
 *
 * Locator strategy:
 *  - Featured products → locator() — product cards have no ARIA landmark
 *  - Product title links → getByRole('link') scoped within product card
 *  - Newsletter input  → getByRole('textbox', { name: /email/i })  (or getByLabel if label exists)
 *  - Subscribe button  → getByRole('button', { name: /subscribe/i })
 *  - Poll radios       → getByRole('radio') scoped within poll block
 *  - Vote button       → getByRole('button', { name: /vote/i })
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

    this.pageTitle        = page.locator('.topic-html-content-header');
    this.featuredProducts = page.locator('.product-grid .product-item');

    // Newsletter — <input id="newsletter-email"> with associated label "Your e-mail:"
    this.newsletterInput           = page.getByRole('textbox', { name: /e-mail/i });
    this.newsletterSubscribeButton = page.getByRole('button', { name: /subscribe/i });
    this.newsletterResult          = page.locator('#newsletter-result-block');

    // Community poll
    this.communityPollOptions = page.locator('.poll-options').getByRole('radio');
    this.voteButton           = page.getByRole('button', { name: /vote/i });
    this.voteAlert            = page.locator('#block-poll-vote-error-1');
  }

  /** Returns a Locator for a featured product card whose visible text contains productName. */
  getFeaturedProductByName(productName: string): Locator {
    return this.featuredProducts.filter({ hasText: productName }).first();
  }

  /** Opens a featured product's detail page by clicking its title link. */
  async clickFeaturedProduct(productName: string) {
    const product = this.getFeaturedProductByName(productName);
    await product.getByRole('link').first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Fills the newsletter email and clicks Subscribe. */
  async subscribeToNewsletter(email: string) {
    await this.newsletterInput.fill(email);
    await this.newsletterSubscribeButton.click();
  }

  /** Selects a poll option (0-based) and clicks Vote. */
  async voteCommunityPoll(optionIndex: number = 0) {
    await this.communityPollOptions.nth(optionIndex).check();
    await this.voteButton.click();
  }
}
