/**
 * Common helper functions for string parsing, numbers, and waiting logic.
 */
export class Helpers {
  /**
   * Parses price string like "$10.00" or "10.00" into a float.
   */
  static parsePrice(priceText: string): number {
    const cleaned = priceText.replace(/[^0-9.-]+/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }

  /**
   * Formats a number to currency format "0.00".
   */
  static formatCurrency(amount: number): string {
    return amount.toFixed(2);
  }

  /**
   * Extracts digits from string (e.g. "(3)" -> 3).
   */
  static extractCount(text: string): number {
    const match = text.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }
}
