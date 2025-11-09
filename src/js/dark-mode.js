/**
 * Theme Manager
 * Manages light/dark mode and color theme switching with localStorage persistence
 */

class ThemeManager {
  constructor() {
    this.isDark = false;
    this.currentTheme = "navy"; // navy, emerald, purple, slate
    this.init();
  }

  init() {
    // Load saved preferences
    const savedMode = localStorage.getItem("color-mode"); // 'light' or 'dark'
    const savedTheme = localStorage.getItem("color-theme"); // 'navy', 'emerald', etc.

    if (savedTheme) {
      this.currentTheme = savedTheme;
      this.applyTheme(savedTheme);
    }

    if (savedMode === "dark") {
      this.enableDarkMode();
    } else if (savedMode === "light") {
      this.disableDarkMode();
    } else {
      // Check system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      if (prefersDark) {
        this.enableDarkMode();
      }
    }

    // Listen for system theme changes
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (!localStorage.getItem("color-mode")) {
          if (e.matches) {
            this.enableDarkMode();
          } else {
            this.disableDarkMode();
          }
        }
      });

    // Setup controls
    this.setupToggleButton();
    this.setupThemeSelector();
  }

  setupToggleButton() {
    const toggleButton = document.querySelector(".theme-toggle");
    if (toggleButton) {
      toggleButton.addEventListener("click", () => this.toggleDarkMode());
    }
  }

  setupThemeSelector() {
    const themeSelector = document.querySelector(".theme-selector");
    if (themeSelector) {
      const buttons = themeSelector.querySelectorAll("[data-theme]");
      buttons.forEach((button) => {
        button.addEventListener("click", (e) => {
          const theme = e.currentTarget.getAttribute("data-theme");
          this.setTheme(theme);
        });
      });
    }
  }

  toggleDarkMode() {
    if (this.isDark) {
      this.disableDarkMode();
    } else {
      this.enableDarkMode();
    }
  }

  enableDarkMode() {
    document.documentElement.classList.add("dark");
    this.isDark = true;
    localStorage.setItem("color-mode", "dark");
    this.updateAriaLabel("Switch to light mode");
  }

  disableDarkMode() {
    document.documentElement.classList.remove("dark");
    this.isDark = false;
    localStorage.setItem("color-mode", "light");
    this.updateAriaLabel("Switch to dark mode");
  }

  setTheme(themeName) {
    this.currentTheme = themeName;
    this.applyTheme(themeName);
    localStorage.setItem("color-theme", themeName);

    // Update active state on theme buttons
    const buttons = document.querySelectorAll(".theme-selector [data-theme]");
    buttons.forEach((btn) => {
      if (btn.getAttribute("data-theme") === themeName) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  applyTheme(themeName) {
    document.documentElement.setAttribute("data-theme", themeName);
  }

  updateAriaLabel(label) {
    const toggleButton = document.querySelector(".theme-toggle");
    if (toggleButton) {
      toggleButton.setAttribute("aria-label", label);
    }
  }
}

// Initialize theme manager on DOM load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new ThemeManager();
  });
} else {
  new ThemeManager();
}

export default ThemeManager;
