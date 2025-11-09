/**
 * Theme Manager
 * Manages light/dark mode for Slate theme
 * Default: Slate Dark
 */

class ThemeManager {
  constructor() {
    this.currentMode = "dark";
    this.init();
  }

  init() {
    // Load saved preference
    const savedMode = localStorage.getItem("color-mode");

    // Set mode (default to dark)
    this.currentMode = savedMode || "dark";
    this.applyMode(this.currentMode);

    // Setup UI
    this.setupDropdown();
  }

  setupDropdown() {
    const dropdown = document.querySelector(".theme-dropdown");
    const trigger = document.querySelector(".theme-dropdown-trigger");
    const modeButtons = document.querySelectorAll("[data-mode]");

    if (!dropdown || !trigger) return;

    // Toggle dropdown
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("active");
    });

    // Close on click outside
    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove("active");
      }
    });

    // Mode selection
    modeButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.stopPropagation();
        const mode = button.getAttribute("data-mode");
        this.setMode(mode);
        this.updateActiveStates();
      });
    });

    // Set initial active states
    this.updateActiveStates();
  }

  setMode(mode) {
    this.currentMode = mode;
    localStorage.setItem("color-mode", mode);
    this.applyMode(mode);
  }

  applyMode(mode) {
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // Always use slate theme
    document.documentElement.setAttribute("data-theme", "slate");
  }

  updateActiveStates() {
    // Update mode buttons
    document.querySelectorAll("[data-mode]").forEach((button) => {
      if (button.getAttribute("data-mode") === this.currentMode) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });
  }
}

// Initialize theme manager after header is loaded
document.addEventListener("header-loaded", () => {
  new ThemeManager();
});

export default ThemeManager;
