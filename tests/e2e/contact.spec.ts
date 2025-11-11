import { test, expect } from '@playwright/test';

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test.describe('Form Display', () => {
    test('should load contact page successfully', async ({ page }) => {
      await expect(page).toHaveURL('/contact');
      await expect(page.getByRole('heading', { name: /Get In Touch/i })).toBeVisible();
    });

    test('should display all form fields', async ({ page }) => {
      const form = page.locator('#contact-form');
      await expect(form).toBeVisible();

      // Check all input fields are present
      await expect(form.getByLabel(/Name/)).toBeVisible();
      await expect(form.getByLabel(/Email/)).toBeVisible();
      await expect(form.getByLabel(/Message/)).toBeVisible();
    });

    test('should display submit button', async ({ page }) => {
      await expect(
        page.getByRole('button', { name: /Send Message/i })
      ).toBeVisible();
    });

    test('should display location section', async ({ page }) => {
      await expect(page.getByText('Location')).toBeVisible();
      await expect(page.locator('#contact-location')).toBeVisible();
    });

    test('should display social links', async ({ page }) => {
      await expect(page.getByText(/Connect With Me/i)).toBeVisible();
      await expect(page.locator('#contact-linkedin-link')).toBeVisible();
      await expect(page.locator('#contact-email-link')).toBeVisible();
      await expect(page.locator('#contact-resume-link')).toBeVisible();
    });
  });

  test.describe('Form Validation', () => {
    test('should show HTML5 validation for empty name field', async ({ page }) => {
      const form = page.locator('#contact-form');
      const nameInput = form.getByLabel(/Name/);
      const submitButton = page.getByRole('button', { name: /Send Message/i });

      // Try to submit with empty name
      await submitButton.click();

      // Check for HTML5 validation
      const isInvalid = await nameInput.evaluate((el: HTMLInputElement) => {
        return !el.validity.valid;
      });
      expect(isInvalid).toBe(true);
    });

    test('should show HTML5 validation for empty email field', async ({ page }) => {
      const form = page.locator('#contact-form');
      const nameInput = form.getByLabel(/Name/);
      const emailInput = form.getByLabel(/Email/);
      const submitButton = page.getByRole('button', { name: /Send Message/i });

      // Fill name but leave email empty
      await nameInput.fill('Test User');
      await submitButton.click();

      // Check for HTML5 validation on email
      const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => {
        return !el.validity.valid;
      });
      expect(isInvalid).toBe(true);
    });

    test('should show HTML5 validation for invalid email format', async ({ page }) => {
      const form = page.locator('#contact-form');
      const nameInput = form.getByLabel(/Name/);
      const emailInput = form.getByLabel(/Email/);
      const submitButton = page.getByRole('button', { name: /Send Message/i });

      // Fill with invalid email
      await nameInput.fill('Test User');
      await emailInput.fill('invalid-email');
      await submitButton.click();

      // Check for HTML5 validation on email
      const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => {
        return !el.validity.valid;
      });
      expect(isInvalid).toBe(true);
    });

    test('should show HTML5 validation for empty message field', async ({ page }) => {
      const form = page.locator('#contact-form');
      const nameInput = form.getByLabel(/Name/);
      const emailInput = form.getByLabel(/Email/);
      const messageInput = form.getByLabel(/Message/);
      const submitButton = page.getByRole('button', { name: /Send Message/i });

      // Fill name and email but leave message empty
      await nameInput.fill('Test User');
      await emailInput.fill('test@example.com');
      await submitButton.click();

      // Check for HTML5 validation on message
      const isInvalid = await messageInput.evaluate((el: HTMLTextAreaElement) => {
        return !el.validity.valid;
      });
      expect(isInvalid).toBe(true);
    });
  });

  test.describe('Successful Submission', () => {
    test('should submit form successfully with valid data', async ({ page }) => {
      // Mock the Web3Forms API
      await page.route('https://api.web3forms.com/submit', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        });
      });

      // Fill out the form
      await page.locator("#contact-form").getByLabel(/Name/).fill('Test User');
      await page.locator("#contact-form").getByLabel(/Email/).fill('test@example.com');
      await page.locator("#contact-form").getByLabel(/Message/).fill('This is a test message for the contact form.');

      // Submit the form
      await page.getByRole('button', { name: /Send Message/i }).click();

      // Wait for success modal to appear
      const successModal = page.locator('#success-modal');
      await expect(successModal).toBeVisible();
      await expect(successModal.getByRole('heading', { name: /Message Sent!/i })).toBeVisible();
    });

    test('should display success modal with correct content', async ({ page }) => {
      // Mock the Web3Forms API
      await page.route('https://api.web3forms.com/submit', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        });
      });

      // Fill and submit form
      await page.locator("#contact-form").getByLabel(/Name/).fill('Test User');
      await page.locator("#contact-form").getByLabel(/Email/).fill('test@example.com');
      await page.locator("#contact-form").getByLabel(/Message/).fill('Test message');
      await page.getByRole('button', { name: /Send Message/i }).click();

      // Check success modal content
      const successModal = page.locator('#success-modal');
      await expect(successModal).toBeVisible();
      await expect(successModal.getByText(/Thanks for reaching out/i)).toBeVisible();
      await expect(successModal.getByRole('button', { name: /Close/i })).toBeVisible();
    });

    test('should close success modal when Close button is clicked', async ({ page }) => {
      // Mock the Web3Forms API
      await page.route('https://api.web3forms.com/submit', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        });
      });

      // Fill and submit form
      await page.locator("#contact-form").getByLabel(/Name/).fill('Test User');
      await page.locator("#contact-form").getByLabel(/Email/).fill('test@example.com');
      await page.locator("#contact-form").getByLabel(/Message/).fill('Test message');
      await page.getByRole('button', { name: /Send Message/i }).click();

      // Wait for modal to appear
      const successModal = page.locator('#success-modal');
      await expect(successModal).toBeVisible();

      // Close modal
      await successModal.getByRole('button', { name: /Close/i }).click();

      // Verify modal is closed
      await expect(successModal).not.toBeVisible();
    });

    test('should close success modal when clicking backdrop', async ({ page }) => {
      // Mock the Web3Forms API
      await page.route('https://api.web3forms.com/submit', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        });
      });

      // Fill and submit form
      await page.locator("#contact-form").getByLabel(/Name/).fill('Test User');
      await page.locator("#contact-form").getByLabel(/Email/).fill('test@example.com');
      await page.locator("#contact-form").getByLabel(/Message/).fill('Test message');
      await page.getByRole('button', { name: /Send Message/i }).click();

      // Wait for modal to appear
      const successModal = page.locator('#success-modal');
      await expect(successModal).toBeVisible();

      // Click on backdrop (the modal container itself, not its children)
      await successModal.click({ position: { x: 5, y: 5 } });

      // Verify modal is closed
      await expect(successModal).not.toBeVisible();
    });

    test('should clear form after successful submission', async ({ page }) => {
      // Mock the Web3Forms API
      await page.route('https://api.web3forms.com/submit', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        });
      });

      const nameInput = page.locator("#contact-form").getByLabel(/Name/);
      const emailInput = page.locator("#contact-form").getByLabel(/Email/);
      const messageInput = page.locator("#contact-form").getByLabel(/Message/);

      // Fill and submit form
      await nameInput.fill('Test User');
      await emailInput.fill('test@example.com');
      await messageInput.fill('Test message');
      await page.getByRole('button', { name: /Send Message/i }).click();

      // Wait for modal and close it
      const successModal = page.locator('#success-modal');
      await expect(successModal).toBeVisible();
      await successModal.getByRole('button', { name: /Close/i }).click();

      // Check that form is cleared
      await expect(nameInput).toHaveValue('');
      await expect(emailInput).toHaveValue('');
      await expect(messageInput).toHaveValue('');
    });
  });

  test.describe('Error Handling', () => {
    test('should display error message when API returns error', async ({ page }) => {
      // Mock API error response
      await page.route('https://api.web3forms.com/submit', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            error: 'Invalid API key',
          }),
        });
      });

      // Fill and submit form
      await page.locator("#contact-form").getByLabel(/Name/).fill('Test User');
      await page.locator("#contact-form").getByLabel(/Email/).fill('test@example.com');
      await page.locator("#contact-form").getByLabel(/Message/).fill('Test message');
      await page.getByRole('button', { name: /Send Message/i }).click();

      // Check for error message
      const errorAlert = page.locator("#contact-form").locator("..").getByRole('alert');
      await expect(errorAlert).toBeVisible();
      await expect(errorAlert).toContainText(/Invalid API key/i);
    });

    test('should display generic error message on API failure', async ({ page }) => {
      // Mock API failure (network error)
      await page.route('https://api.web3forms.com/submit', async (route) => {
        await route.abort('failed');
      });

      // Fill and submit form
      await page.locator("#contact-form").getByLabel(/Name/).fill('Test User');
      await page.locator("#contact-form").getByLabel(/Email/).fill('test@example.com');
      await page.locator("#contact-form").getByLabel(/Message/).fill('Test message');
      await page.getByRole('button', { name: /Send Message/i }).click();

      // Check for error message
      const errorAlert = page.locator("#contact-form").locator("..").getByRole('alert');
      await expect(errorAlert).toBeVisible();
      await expect(errorAlert).toContainText(/Oops! Something went wrong/i);
    });

    test('should display generic error when API returns error without message', async ({ page }) => {
      // Mock API error without error message
      await page.route('https://api.web3forms.com/submit', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: false }),
        });
      });

      // Fill and submit form
      await page.locator("#contact-form").getByLabel(/Name/).fill('Test User');
      await page.locator("#contact-form").getByLabel(/Email/).fill('test@example.com');
      await page.locator("#contact-form").getByLabel(/Message/).fill('Test message');
      await page.getByRole('button', { name: /Send Message/i }).click();

      // Check for generic error message
      const errorAlert = page.locator("#contact-form").locator("..").getByRole('alert');
      await expect(errorAlert).toBeVisible();
      await expect(errorAlert).toContainText(/Oops! Something went wrong/i);
    });

    test('should clear previous errors on new successful submission', async ({ page }) => {
      // First, mock an error
      await page.route('https://api.web3forms.com/submit', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            error: 'Test error',
          }),
        });
      });

      // Fill and submit form
      await page.locator("#contact-form").getByLabel(/Name/).fill('Test User');
      await page.locator("#contact-form").getByLabel(/Email/).fill('test@example.com');
      await page.locator("#contact-form").getByLabel(/Message/).fill('Test message');
      await page.getByRole('button', { name: /Send Message/i }).click();

      // Verify error is shown
      const errorAlert = page.locator("#contact-form").locator("..").getByRole('alert');
      await expect(errorAlert).toBeVisible();

      // Now mock a successful response
      await page.route('https://api.web3forms.com/submit', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        });
      });

      // Submit again
      await page.locator("#contact-form").getByLabel(/Name/).fill('Test User 2');
      await page.locator("#contact-form").getByLabel(/Email/).fill('test2@example.com');
      await page.locator("#contact-form").getByLabel(/Message/).fill('Test message 2');
      await page.getByRole('button', { name: /Send Message/i }).click();

      // Verify error is gone and success modal appears
      await expect(errorAlert).not.toBeVisible();
      await expect(page.locator('#success-modal')).toBeVisible();
    });
  });

  test.describe('Loading States', () => {
    test('should show loading state during submission', async ({ page }) => {
      // Mock API with delay
      await page.route('https://api.web3forms.com/submit', async (route) => {
        // Add delay to see loading state
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        });
      });

      // Fill and submit form
      await page.locator("#contact-form").getByLabel(/Name/).fill('Test User');
      await page.locator("#contact-form").getByLabel(/Email/).fill('test@example.com');
      await page.locator("#contact-form").getByLabel(/Message/).fill('Test message');

      // Get submit button by type instead of text (which changes during submission)
      const submitButton = page.locator('#contact-form button[type="submit"]');
      await submitButton.click();

      // Check loading state - button text changes to "Sending..." and becomes disabled
      // Check both simultaneously to avoid race condition with fast submission
      await Promise.all([
        expect(submitButton).toContainText(/Sending\.\.\./i),
        expect(submitButton).toBeDisabled(),
      ]);

      // Wait for completion
      await expect(page.locator('#success-modal')).toBeVisible();
    });

    test('should disable form inputs during submission', async ({ page }) => {
      // Mock API with delay
      await page.route('https://api.web3forms.com/submit', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        });
      });

      // Fill form
      await page.locator("#contact-form").getByLabel(/Name/).fill('Test User');
      await page.locator("#contact-form").getByLabel(/Email/).fill('test@example.com');
      await page.locator("#contact-form").getByLabel(/Message/).fill('Test message');

      // Get submit button by type instead of text (which changes during submission)
      const submitButton = page.locator('#contact-form button[type="submit"]');

      // Submit form
      await submitButton.click();

      // Check that submit button is disabled during submission
      await expect(submitButton).toBeDisabled();
    });
  });

  test.describe('Social Links', () => {
    test('should have LinkedIn link with correct attributes', async ({ page }) => {
      const linkedinLink = page.locator('#contact-linkedin-link');
      await expect(linkedinLink).toBeVisible();

      const href = await linkedinLink.getAttribute('href');
      expect(href).toContain('linkedin.com');

      const target = await linkedinLink.getAttribute('target');
      expect(target).toBe('_blank');

      const rel = await linkedinLink.getAttribute('rel');
      expect(rel).toContain('noopener');
    });

    test('should have email link with mailto', async ({ page }) => {
      const emailLink = page.locator('#contact-email-link');
      await expect(emailLink).toBeVisible();

      const href = await emailLink.getAttribute('href');
      expect(href).toContain('mailto:');
    });

    test('should have resume download link', async ({ page }) => {
      const resumeLink = page.locator('#contact-resume-link');
      await expect(resumeLink).toBeVisible();

      const href = await resumeLink.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toMatch(/\.(pdf|PDF)$/);
    });
  });
});
