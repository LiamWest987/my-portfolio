import { type Page, type Locator } from '@playwright/test';

/**
 * Page Object Model for the About page
 * Encapsulates all interactions and element selections for /about
 */
export class AboutPage {
  readonly page: Page;

  // Main elements
  readonly pageHeader: Locator;
  readonly pageDescription: Locator;

  // About cards
  readonly aboutCards: Locator;
  readonly technicalExcellenceCard: Locator;
  readonly innovationFocusCard: Locator;
  readonly collaborativeProblemSolvingCard: Locator;
  readonly continuousLearningCard: Locator;

  // Tabs
  readonly tabsList: Locator;
  readonly skillsTab: Locator;
  readonly educationTab: Locator;
  readonly experienceTab: Locator;
  readonly achievementsTab: Locator;

  // Skills tab content
  readonly skillsTabContent: Locator;
  readonly skillCategories: Locator;
  readonly loadingSkeletons: Locator;

  // Education tab content
  readonly educationTabContent: Locator;
  readonly educationEntries: Locator;

  // Experience tab content
  readonly experienceTabContent: Locator;
  readonly experienceEntries: Locator;

  // Achievements tab content
  readonly achievementsTabContent: Locator;
  readonly achievementEntries: Locator;

  constructor(page: Page) {
    this.page = page;

    // Main elements
    this.pageHeader = page.getByRole('heading', { name: /About Me/i });
    this.pageDescription = page.locator('text=Engineering student passionate');

    // About cards
    this.aboutCards = page.locator('[class*="AboutCard"], .about-card, article').filter({
      has: page.locator('svg'),
    });
    this.technicalExcellenceCard = page.locator('text=Technical Excellence').locator('..');
    this.innovationFocusCard = page.locator('text=Innovation Focus').locator('..');
    this.collaborativeProblemSolvingCard = page.locator('text=Collaborative Problem-Solving').locator('..');
    this.continuousLearningCard = page.locator('text=Continuous Learning').locator('..');

    // Tabs
    this.tabsList = page.locator('[role="tablist"]');
    this.skillsTab = page.getByRole('tab', { name: /Skills/i });
    this.educationTab = page.getByRole('tab', { name: /Education/i });
    this.experienceTab = page.getByRole('tab', { name: /Experience/i });
    this.achievementsTab = page.getByRole('tab', { name: /Awards/i });

    // Tab contents
    this.skillsTabContent = page.locator('[role="tabpanel"]').filter({ has: page.locator('text=Skills') });
    this.skillCategories = page.locator('[class*="AboutCard"]').filter({
      has: page.locator('ul, [class*="items"]'),
    });

    this.educationTabContent = page.locator('[role="tabpanel"]').filter({ has: page.locator('text=/degree|school/i') });
    this.educationEntries = page.locator('[class*="AboutCard"][class*="timeline"]');

    this.experienceTabContent = page.locator('[role="tabpanel"]').filter({ has: page.locator('text=/role|company/i') });
    this.experienceEntries = page.locator('[class*="AboutCard"][class*="timeline"]');

    this.achievementsTabContent = page.locator('[role="tabpanel"]').filter({ has: page.locator('text=/award|achievement/i') });
    this.achievementEntries = page.locator('[class*="AboutCard"][class*="timeline"]');

    this.loadingSkeletons = page.locator('[class*="Skeleton"], [role="status"]').filter({
      hasText: '',
    });
  }

  /**
   * Navigate to the about page
   */
  async goto() {
    await this.page.goto('/about');
    await this.waitForPageLoad();
  }

  /**
   * Wait for the page to finish loading
   */
  async waitForPageLoad() {
    await this.pageHeader.waitFor({ state: 'visible', timeout: 5000 });
    await this.tabsList.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Get the number of about cards displayed
   */
  async getAboutCardsCount(): Promise<number> {
    // Wait for cards to load
    await this.page.waitForTimeout(500);
    return await this.aboutCards.count();
  }

  /**
   * Check if a specific about card is visible
   */
  async isAboutCardVisible(cardName: string): Promise<boolean> {
    const card = this.page.locator(`text=${cardName}`).locator('..');
    return await card.isVisible();
  }

  /**
   * Click on the Skills tab
   */
  async clickSkillsTab() {
    await this.skillsTab.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Click on the Education tab
   */
  async clickEducationTab() {
    await this.educationTab.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Click on the Experience tab
   */
  async clickExperienceTab() {
    await this.experienceTab.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Click on the Achievements tab
   */
  async clickAchievementsTab() {
    await this.achievementsTab.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Check which tab is currently active
   */
  async getActiveTab(): Promise<string> {
    const activeTab = this.page.locator('[role="tab"][aria-selected="true"]');
    return (await activeTab.textContent()) || '';
  }

  /**
   * Check if Skills tab is active
   */
  async isSkillsTabActive(): Promise<boolean> {
    const ariaSelected = await this.skillsTab.getAttribute('aria-selected');
    return ariaSelected === 'true';
  }

  /**
   * Check if Education tab is active
   */
  async isEducationTabActive(): Promise<boolean> {
    const ariaSelected = await this.educationTab.getAttribute('aria-selected');
    return ariaSelected === 'true';
  }

  /**
   * Check if Experience tab is active
   */
  async isExperienceTabActive(): Promise<boolean> {
    const ariaSelected = await this.experienceTab.getAttribute('aria-selected');
    return ariaSelected === 'true';
  }

  /**
   * Check if Achievements tab is active
   */
  async isAchievementsTabActive(): Promise<boolean> {
    const ariaSelected = await this.achievementsTab.getAttribute('aria-selected');
    return ariaSelected === 'true';
  }

  /**
   * Get the number of skill categories
   */
  async getSkillCategoriesCount(): Promise<number> {
    await this.clickSkillsTab();
    await this.page.waitForTimeout(500);

    // Look for skill category cards
    const skillCards = this.page.locator('[role="tabpanel"][data-state="active"]').locator('[class*="AboutCard"]');
    return await skillCards.count();
  }

  /**
   * Get skill category titles
   */
  async getSkillCategoryTitles(): Promise<string[]> {
    await this.clickSkillsTab();
    await this.page.waitForTimeout(500);

    const skillCards = this.page.locator('[role="tabpanel"][data-state="active"]').locator('[class*="AboutCard"]');
    const count = await skillCards.count();
    const titles: string[] = [];

    for (let i = 0; i < count; i++) {
      const title = await skillCards.nth(i).locator('h3, h4, [class*="title"]').first().textContent();
      if (title) {
        titles.push(title.trim());
      }
    }

    return titles;
  }

  /**
   * Get skills in a specific category
   */
  async getSkillsInCategory(categoryTitle: string): Promise<string[]> {
    await this.clickSkillsTab();
    await this.page.waitForTimeout(500);

    const categoryCard = this.page.locator(`text=${categoryTitle}`).locator('..');
    const skillItems = categoryCard.locator('li, [class*="skill-item"]');
    const count = await skillItems.count();
    const skills: string[] = [];

    for (let i = 0; i < count; i++) {
      const skill = await skillItems.nth(i).textContent();
      if (skill) {
        skills.push(skill.trim());
      }
    }

    return skills;
  }

  /**
   * Get the number of education entries
   */
  async getEducationEntriesCount(): Promise<number> {
    await this.clickEducationTab();
    await this.page.waitForTimeout(500);

    const entries = this.page.locator('[role="tabpanel"][data-state="active"]').locator('[class*="AboutCard"]');
    return await entries.count();
  }

  /**
   * Get education entry titles
   */
  async getEducationTitles(): Promise<string[]> {
    await this.clickEducationTab();
    await this.page.waitForTimeout(500);

    const entries = this.page.locator('[role="tabpanel"][data-state="active"]').locator('[class*="AboutCard"]');
    const count = await entries.count();
    const titles: string[] = [];

    for (let i = 0; i < count; i++) {
      const title = await entries.nth(i).locator('h3, h4, [class*="title"]').first().textContent();
      if (title) {
        titles.push(title.trim());
      }
    }

    return titles;
  }

  /**
   * Get the number of experience entries
   */
  async getExperienceEntriesCount(): Promise<number> {
    await this.clickExperienceTab();
    await this.page.waitForTimeout(500);

    const entries = this.page.locator('[role="tabpanel"][data-state="active"]').locator('[class*="AboutCard"]');
    return await entries.count();
  }

  /**
   * Get experience entry titles (roles)
   */
  async getExperienceRoles(): Promise<string[]> {
    await this.clickExperienceTab();
    await this.page.waitForTimeout(500);

    const entries = this.page.locator('[role="tabpanel"][data-state="active"]').locator('[class*="AboutCard"]');
    const count = await entries.count();
    const roles: string[] = [];

    for (let i = 0; i < count; i++) {
      const role = await entries.nth(i).locator('h3, h4, [class*="title"]').first().textContent();
      if (role) {
        roles.push(role.trim());
      }
    }

    return roles;
  }

  /**
   * Get the number of achievement entries
   */
  async getAchievementEntriesCount(): Promise<number> {
    await this.clickAchievementsTab();
    await this.page.waitForTimeout(500);

    const entries = this.page.locator('[role="tabpanel"][data-state="active"]').locator('[class*="AboutCard"]');
    return await entries.count();
  }

  /**
   * Get achievement titles
   */
  async getAchievementTitles(): Promise<string[]> {
    await this.clickAchievementsTab();
    await this.page.waitForTimeout(500);

    const entries = this.page.locator('[role="tabpanel"][data-state="active"]').locator('[class*="AboutCard"]');
    const count = await entries.count();
    const titles: string[] = [];

    for (let i = 0; i < count; i++) {
      const title = await entries.nth(i).locator('h3, h4, [class*="title"]').first().textContent();
      if (title) {
        titles.push(title.trim());
      }
    }

    return titles;
  }

  /**
   * Check if page is in loading state
   */
  async isLoading(): Promise<boolean> {
    return (await this.loadingSkeletons.count()) > 0;
  }

  /**
   * Check if a "no results" message is displayed
   */
  async hasNoResults(): Promise<boolean> {
    const noResultsText = this.page.locator('text=/No .* found/i');
    return await noResultsText.isVisible();
  }

  /**
   * Navigate between tabs using keyboard
   */
  async navigateTabsWithKeyboard(direction: 'right' | 'left') {
    if (direction === 'right') {
      await this.page.keyboard.press('ArrowRight');
    } else {
      await this.page.keyboard.press('ArrowLeft');
    }
    await this.page.waitForTimeout(300);
  }

  /**
   * Focus on the first tab
   */
  async focusFirstTab() {
    await this.skillsTab.focus();
  }

  /**
   * Check if an entry has a date
   */
  async entryHasDate(entryIndex: number): Promise<boolean> {
    const activePanel = this.page.locator('[role="tabpanel"][data-state="active"]');
    const entry = activePanel.locator('[class*="AboutCard"]').nth(entryIndex);
    const dateElement = entry.locator('[class*="date"], span').filter({ hasText: /\d{4}/ });

    return (await dateElement.count()) > 0;
  }

  /**
   * Check if an entry has tags/badges
   */
  async entryHasTags(entryIndex: number): Promise<boolean> {
    const activePanel = this.page.locator('[role="tabpanel"][data-state="active"]');
    const entry = activePanel.locator('[class*="AboutCard"]').nth(entryIndex);
    const tags = entry.locator('[class*="Badge"], .badge, [class*="tag"]');

    return (await tags.count()) > 0;
  }

  /**
   * Get tags for a specific entry
   */
  async getEntryTags(entryIndex: number): Promise<string[]> {
    const activePanel = this.page.locator('[role="tabpanel"][data-state="active"]');
    const entry = activePanel.locator('[class*="AboutCard"]').nth(entryIndex);
    const tags = entry.locator('[class*="Badge"], .badge, [class*="tag"]');
    const count = await tags.count();
    const tagTexts: string[] = [];

    for (let i = 0; i < count; i++) {
      const text = await tags.nth(i).textContent();
      if (text) {
        tagTexts.push(text.trim());
      }
    }

    return tagTexts;
  }

  /**
   * Check if entry has achievements list
   */
  async entryHasAchievements(entryIndex: number): Promise<boolean> {
    const activePanel = this.page.locator('[role="tabpanel"][data-state="active"]');
    const entry = activePanel.locator('[class*="AboutCard"]').nth(entryIndex);
    const achievementsList = entry.locator('ul li');

    return (await achievementsList.count()) > 0;
  }

  /**
   * Get all tab names
   */
  async getAllTabNames(): Promise<string[]> {
    const tabs = this.page.locator('[role="tab"]');
    const count = await tabs.count();
    const names: string[] = [];

    for (let i = 0; i < count; i++) {
      const name = await tabs.nth(i).textContent();
      if (name) {
        names.push(name.trim());
      }
    }

    return names;
  }

  /**
   * Verify tabs are keyboard accessible
   */
  async verifyTabsKeyboardAccessibility(): Promise<boolean> {
    await this.focusFirstTab();
    const initialTab = await this.getActiveTab();

    await this.navigateTabsWithKeyboard('right');
    const nextTab = await this.getActiveTab();

    return initialTab !== nextTab;
  }
}
