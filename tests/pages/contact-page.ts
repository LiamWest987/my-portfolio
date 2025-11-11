import { type Page, type Locator } from '@playwright/test';

/**
 * Page Object Model for the Contact page
 * Encapsulates all interactions and element selections for /contact
 */
export class ContactPage {
  readonly page: Page;

  // Main elements
  readonly pageHeader: Locator;
  readonly pageDescription: Locator;

  // Form elements
  readonly contactForm: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly messageTextarea: Locator;
  readonly submitButton: Locator;

  // Form validation
  readonly formErrors: Locator;

  // Success modal
  readonly successModal: Locator;
  readonly successModalTitle: Locator;
  readonly successModalMessage: Locator;
  readonly successModalImage: Locator;
  readonly successModalCloseButton: Locator;

  // Contact information
  readonly locationCard: Locator;
  readonly locationText: Locator;
  readonly socialLinksCard: Locator;
  readonly linkedinLink: Locator;
  readonly emailLink: Locator;
  readonly resumeLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Main elements
    this.pageHeader = page.getByRole('heading', { name: /Get In Touch/i });
    this.pageDescription = page.locator('text=Interested in engineering projects');

    // Form elements
    this.contactForm = page.locator('#contact-form, form');
    this.nameInput = page.locator('#name, input[name="name"]');
    this.emailInput = page.locator('#email, input[name="email"]');
    this.messageTextarea = page.locator('#message, textarea[name="message"]');
    this.submitButton = page.getByRole('button', { name: /Send Message/i });

    // Form validation
    this.formErrors = page.locator('[role="alert"]');

    // Success modal
    this.successModal = page.locator('#success-modal, [role="dialog"]');
    this.successModalTitle = page.locator('#success-title, text=Message Sent');
    this.successModalMessage = page.locator('text=Thanks for reaching out');
    this.successModalImage = page.locator('#success-modal-image');
    this.successModalCloseButton = this.successModal.getByRole('button', { name: /Close/i });

    // Contact information
    this.locationCard = page.locator('text=Location').locator('..');
    this.locationText = page.locator('#contact-location, text=Frisco, Texas');
    this.socialLinksCard = page.locator('text=Connect With Me').locator('..');
    this.linkedinLink = page.locator('#contact-linkedin-link, a[href*="linkedin"]');
    this.emailLink = page.locator('#contact-email-link, a[href^="mailto"]');
    this.resumeLink = page.locator('#contact-resume-link, a[href*="resume"]');
  }

  /**
   * Navigate to the contact page
   */
  async goto() {
    await this.page.goto('/contact');
    await this.waitForPageLoad();
  }

  /**
   * Wait for the page to finish loading
   */
  async waitForPageLoad() {
    await this.contactForm.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Fill out the contact form
   */
  async fillContactForm(name: string, email: string, message: string) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.messageTextarea.fill(message);
  }

  /**
   * Submit the contact form
   */
  async submitForm() {
    await this.submitButton.click();
  }

  /**
   * Fill and submit the contact form in one action
   */
  async submitContactForm(name: string, email: string, message: string) {
    await this.fillContactForm(name, email, message);
    await this.submitForm();
  }

  /**
   * Clear all form fields
   */
  async clearForm() {
    await this.nameInput.clear();
    await this.emailInput.clear();
    await this.messageTextarea.clear();
  }

  /**
   * Check if the form is submitting
   */
  async isSubmitting(): Promise<boolean> {
    const buttonText = await this.submitButton.textContent();
    return buttonText?.toLowerCase().includes('sending') || false;
  }

  /**
   * Check if the submit button is disabled
   */
  async isSubmitButtonDisabled(): Promise<boolean> {
    return await this.submitButton.isDisabled();
  }

  /**
   * Wait for the success modal to appear
   */
  async waitForSuccessModal() {
    await this.successModal.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Check if the success modal is visible
   */
  async isSuccessModalVisible(): Promise<boolean> {
    return await this.successModal.isVisible();
  }

  /**
   * Close the success modal
   */
  async closeSuccessModal() {
    await this.successModalCloseButton.click();
    await this.successModal.waitFor({ state: 'hidden' });
  }

  /**
   * Close the success modal by clicking backdrop
   */
  async closeSuccessModalWithBackdrop() {
    await this.successModal.click({ position: { x: 10, y: 10 } });
    await this.successModal.waitFor({ state: 'hidden' });
  }

  /**
   * Check if form errors are displayed
   */
  async hasFormErrors(): Promise<boolean> {
    return await this.formErrors.isVisible();
  }

  /**
   * Get the form error messages
   */
  async getFormErrors(): Promise<string[]> {
    if (!(await this.hasFormErrors())) {
      return [];
    }

    const errorItems = this.formErrors.locator('li');
    const count = await errorItems.count();
    const errors: string[] = [];

    for (let i = 0; i < count; i++) {
      const text = await errorItems.nth(i).textContent();
      if (text) {
        errors.push(text.trim());
      }
    }

    return errors;
  }

  /**
   * Validate name field
   */
  async isNameValid(): Promise<boolean> {
    const value = await this.nameInput.inputValue();
    return value.length > 0;
  }

  /**
   * Validate email field
   */
  async isEmailValid(): Promise<boolean> {
    const value = await this.emailInput.inputValue();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }

  /**
   * Validate message field
   */
  async isMessageValid(): Promise<boolean> {
    const value = await this.messageTextarea.inputValue();
    return value.length > 0;
  }

  /**
   * Check if all form fields are valid
   */
  async isFormValid(): Promise<boolean> {
    return (
      (await this.isNameValid()) &&
      (await this.isEmailValid()) &&
      (await this.isMessageValid())
    );
  }

  /**
   * Get the location text
   */
  async getLocation(): Promise<string> {
    return (await this.locationText.textContent()) || '';
  }

  /**
   * Check if LinkedIn link is visible
   */
  async hasLinkedinLink(): Promise<boolean> {
    return await this.linkedinLink.isVisible();
  }

  /**
   * Click the LinkedIn link
   */
  async clickLinkedinLink() {
    await this.linkedinLink.click();
  }

  /**
   * Get the LinkedIn URL
   */
  async getLinkedinUrl(): Promise<string> {
    return (await this.linkedinLink.getAttribute('href')) || '';
  }

  /**
   * Check if email link is visible
   */
  async hasEmailLink(): Promise<boolean> {
    return await this.emailLink.isVisible();
  }

  /**
   * Click the email link
   */
  async clickEmailLink() {
    await this.emailLink.click();
  }

  /**
   * Get the email link href
   */
  async getEmailHref(): Promise<string> {
    return (await this.emailLink.getAttribute('href')) || '';
  }

  /**
   * Check if resume link is visible
   */
  async hasResumeLink(): Promise<boolean> {
    return await this.resumeLink.isVisible();
  }

  /**
   * Click the resume link
   */
  async clickResumeLink() {
    await this.resumeLink.click();
  }

  /**
   * Get the resume link href
   */
  async getResumeHref(): Promise<string> {
    return (await this.resumeLink.getAttribute('href')) || '';
  }

  /**
   * Tab through form fields
   */
  async tabThroughForm() {
    await this.nameInput.focus();
    await this.page.keyboard.press('Tab');
    await this.page.keyboard.press('Tab');
    await this.page.keyboard.press('Tab');
  }

  /**
   * Check if a field is focused
   */
  async isFieldFocused(field: 'name' | 'email' | 'message' | 'submit'): Promise<boolean> {
    let locator: Locator;

    switch (field) {
      case 'name':
        locator = this.nameInput;
        break;
      case 'email':
        locator = this.emailInput;
        break;
      case 'message':
        locator = this.messageTextarea;
        break;
      case 'submit':
        locator = this.submitButton;
        break;
    }

    return await locator.evaluate(el => el === document.activeElement);
  }

  /**
   * Get form field values
   */
  async getFormValues(): Promise<{ name: string; email: string; message: string }> {
    return {
      name: await this.nameInput.inputValue(),
      email: await this.emailInput.inputValue(),
      message: await this.messageTextarea.inputValue(),
    };
  }

  /**
   * Check if required field indicator is present
   */
  async hasRequiredIndicator(field: 'name' | 'email' | 'message'): Promise<boolean> {
    let label: Locator;

    switch (field) {
      case 'name':
        label = this.page.locator('label[for="name"]');
        break;
      case 'email':
        label = this.page.locator('label[for="email"]');
        break;
      case 'message':
        label = this.page.locator('label[for="message"]');
        break;
    }

    const requiredIndicator = label.locator('span[aria-label="required"]');
    return await requiredIndicator.isVisible();
  }

  /**
   * Trigger HTML5 validation
   */
  async triggerValidation() {
    await this.submitButton.click();
  }
}
