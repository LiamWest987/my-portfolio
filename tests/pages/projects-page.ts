import { type Page, type Locator } from '@playwright/test';

/**
 * Page Object Model for the Projects page
 * Encapsulates all interactions and element selections for /projects
 */
export class ProjectsPage {
  readonly page: Page;

  // Main elements
  readonly pageHeader: Locator;
  readonly pageDescription: Locator;
  readonly projectCount: Locator;

  // Search and filter controls
  readonly searchInput: Locator;
  readonly categoryDropdown: Locator;
  readonly categoryDropdownButton: Locator;
  readonly sortDropdown: Locator;
  readonly sortDropdownButton: Locator;

  // Results
  readonly resultsInfo: Locator;
  readonly projectGrid: Locator;
  readonly projectCards: Locator;
  readonly loadingSkeletons: Locator;
  readonly noResultsMessage: Locator;

  // Modal
  readonly modal: Locator;
  readonly modalTitle: Locator;
  readonly modalCloseButton: Locator;
  readonly modalPrevButton: Locator;
  readonly modalNextButton: Locator;
  readonly modalGalleryIndicators: Locator;
  readonly modalImages: Locator;
  readonly modalPdfButton: Locator;
  readonly modalDemoButton: Locator;
  readonly modalOverview: Locator;
  readonly modalTechnologies: Locator;
  readonly modalChallenges: Locator;
  readonly modalOutcomes: Locator;

  constructor(page: Page) {
    this.page = page;

    // Main elements
    this.pageHeader = page.getByRole('heading', { name: /All Projects/i });
    this.pageDescription = page.locator('text=Explore my portfolio');
    this.projectCount = page.locator('#project-count');

    // Search and filter controls
    this.searchInput = page.getByPlaceholder(/Search projects/i);
    this.categoryDropdownButton = page.locator('#category-dropdown-menu').locator('..');
    this.categoryDropdown = page.locator('#category-dropdown-menu');
    this.sortDropdownButton = page.locator('#sort-dropdown-menu').locator('..');
    this.sortDropdown = page.locator('#sort-dropdown-menu');

    // Results
    this.resultsInfo = page.locator('[role="status"]').filter({ hasText: /results/i });
    this.projectGrid = page.locator('[data-testid="project-grid"], .project-grid, main').first();
    this.projectCards = page.locator('[data-testid="project-card"], .project-card, article');
    this.loadingSkeletons = page.locator('[role="status"][aria-label*="Loading"]');
    this.noResultsMessage = page.locator('text=No projects found');

    // Modal
    this.modal = page.locator('[role="dialog"]');
    this.modalTitle = this.modal.locator('#modal-title, h2, [class*="DialogTitle"]').first();
    this.modalCloseButton = this.modal.locator('button[aria-label*="Close"]').first();
    this.modalPrevButton = this.modal.locator('button[aria-label*="Previous"]');
    this.modalNextButton = this.modal.locator('button[aria-label*="Next"]');
    this.modalGalleryIndicators = this.modal.locator('button[aria-label*="View image"]');
    this.modalImages = this.modal.locator('img[data-index], img[alt*="Screenshot"]');
    this.modalPdfButton = this.modal.getByRole('link', { name: /View PDF|Download PDF/i });
    this.modalDemoButton = this.modal.getByRole('link', { name: /Live Demo|View Demo/i });
    this.modalOverview = this.modal.locator('text=Overview').locator('..');
    this.modalTechnologies = this.modal.locator('text=Technologies').locator('..');
    this.modalChallenges = this.modal.locator('text=Challenges').locator('..');
    this.modalOutcomes = this.modal.locator('text=Outcomes').locator('..');
  }

  /**
   * Navigate to the projects page
   */
  async goto() {
    await this.page.goto('/projects');
    await this.waitForProjectsToLoad();
  }

  /**
   * Wait for projects to finish loading
   */
  async waitForProjectsToLoad() {
    await this.page.waitForSelector('[data-testid="project-card"], .project-card, article', {
      timeout: 10000,
    });
  }

  /**
   * Search for projects using the search input
   */
  async search(query: string) {
    await this.searchInput.fill(query);
    await this.page.waitForTimeout(300); // Wait for debounce
  }

  /**
   * Clear the search input
   */
  async clearSearch() {
    await this.searchInput.clear();
    await this.page.waitForTimeout(300);
  }

  /**
   * Open the category dropdown
   */
  async openCategoryDropdown() {
    await this.categoryDropdownButton.click();
    await this.page.waitForTimeout(200);
  }

  /**
   * Select a category from the dropdown
   */
  async selectCategory(category: string) {
    await this.openCategoryDropdown();
    const categoryOption = this.page.getByRole('menuitem', { name: category });
    await categoryOption.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Open the sort dropdown
   */
  async openSortDropdown() {
    await this.sortDropdownButton.click();
    await this.page.waitForTimeout(200);
  }

  /**
   * Select a sort option from the dropdown
   */
  async selectSortOption(option: 'Newest First' | 'Oldest First' | 'Name A-Z' | 'Name Z-A') {
    await this.openSortDropdown();
    const sortOption = this.page.getByRole('menuitem', { name: option });
    await sortOption.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Get the number of visible project cards
   */
  async getProjectCount(): Promise<number> {
    return await this.projectCards.count();
  }

  /**
   * Click a project card by index (0-based)
   */
  async clickProjectCard(index: number = 0) {
    const card = this.projectCards.nth(index);
    await card.click();
    await this.modal.waitFor({ state: 'visible' });
  }

  /**
   * Click a project card by title
   */
  async clickProjectByTitle(title: string) {
    const card = this.projectCards.filter({ hasText: title }).first();
    await card.click();
    await this.modal.waitFor({ state: 'visible' });
  }

  /**
   * Close the project modal using the close button
   */
  async closeModal() {
    await this.modalCloseButton.click();
    await this.modal.waitFor({ state: 'hidden' });
  }

  /**
   * Close the project modal using Escape key
   */
  async closeModalWithEscape() {
    await this.page.keyboard.press('Escape');
    await this.modal.waitFor({ state: 'hidden' });
  }

  /**
   * Close the project modal by clicking backdrop
   */
  async closeModalWithBackdrop() {
    await this.modal.click({ position: { x: 10, y: 10 } });
    await this.modal.waitFor({ state: 'hidden' });
  }

  /**
   * Navigate to the next image in the modal gallery
   */
  async navigateToNextImage() {
    await this.modalNextButton.click();
    await this.page.waitForTimeout(400); // Wait for transition
  }

  /**
   * Navigate to the previous image in the modal gallery
   */
  async navigateToPreviousImage() {
    await this.modalPrevButton.click();
    await this.page.waitForTimeout(400); // Wait for transition
  }

  /**
   * Navigate to a specific image by indicator index
   */
  async navigateToImageByIndicator(index: number) {
    const indicator = this.modalGalleryIndicators.nth(index);
    await indicator.click();
    await this.page.waitForTimeout(400);
  }

  /**
   * Check if modal is visible
   */
  async isModalVisible(): Promise<boolean> {
    return await this.modal.isVisible();
  }

  /**
   * Check if the modal has multiple images
   */
  async hasMultipleImages(): Promise<boolean> {
    return (await this.modalNextButton.count()) > 0;
  }

  /**
   * Get the current modal title text
   */
  async getModalTitle(): Promise<string> {
    return (await this.modalTitle.textContent()) || '';
  }

  /**
   * Check if PDF button is available
   */
  async hasPdfButton(): Promise<boolean> {
    return (await this.modalPdfButton.count()) > 0;
  }

  /**
   * Check if demo button is available
   */
  async hasDemoButton(): Promise<boolean> {
    return (await this.modalDemoButton.count()) > 0;
  }

  /**
   * Click the PDF download button
   */
  async clickPdfButton() {
    await this.modalPdfButton.click();
  }

  /**
   * Click the demo link
   */
  async clickDemoButton() {
    await this.modalDemoButton.click();
  }

  /**
   * Get all visible project titles
   */
  async getVisibleProjectTitles(): Promise<string[]> {
    const cards = this.projectCards;
    const count = await cards.count();
    const titles: string[] = [];

    for (let i = 0; i < count; i++) {
      const title = await cards.nth(i).locator('h3, h2, [class*="title"]').first().textContent();
      if (title) {
        titles.push(title.trim());
      }
    }

    return titles;
  }

  /**
   * Check if loading state is active
   */
  async isLoading(): Promise<boolean> {
    return (await this.loadingSkeletons.count()) > 0;
  }

  /**
   * Check if no results message is displayed
   */
  async hasNoResults(): Promise<boolean> {
    return await this.noResultsMessage.isVisible();
  }

  /**
   * Get the results count text
   */
  async getResultsText(): Promise<string> {
    return (await this.resultsInfo.textContent()) || '';
  }
}
