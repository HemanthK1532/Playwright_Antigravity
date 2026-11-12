/**
 * Utility functions for generating dynamic, isolated test data.
 */
export class DataGenerator {
  /**
   * Generates a unique email with timestamp to avoid collision during parallel runs.
   * @param prefix optional prefix string
   */
  static generateRandomEmail(prefix: string = 'testuser'): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `${prefix}_${timestamp}_${random}@example.com`;
  }

  /**
   * Generates a random alphanumeric string of specified length.
   * @param length length of the string
   */
  static generateRandomString(length: number = 8): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generates a strong random password matching criteria.
   */
  static generateRandomPassword(): string {
    return `Pass@${Date.now()}#${Math.floor(Math.random() * 1000)}`;
  }

  /**
   * Generates a sample customer shipping/billing profile.
   */
  static generateAddressData() {
    return {
      firstName: `John_${this.generateRandomString(4)}`,
      lastName: `Doe_${this.generateRandomString(4)}`,
      email: this.generateRandomEmail('buyer'),
      country: 'United States',
      countryId: '1',
      state: 'California',
      city: 'Los Angeles',
      address1: '123 Test Automation Boulevard',
      address2: 'Suite 404',
      zipPostalCode: '90001',
      phoneNumber: '555-019-2834',
      faxNumber: '555-019-2835'
    };
  }
}
