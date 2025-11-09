/**
 * Shared Header Component
 * Injects consistent header across all pages with theme dropdown
 */

export function createHeader(currentPage = "home") {
  return `
    <!-- Header / Navigation -->
    <header class="header">
        <div class="header-content">
            <a href="home" class="logo">
                <span class="logo-bracket">&lt;</span>Liam West<span class="logo-accent"> /&gt;</span>
            </a>

            <nav>
                <ul class="nav-links">
                    <li><a href="home" class="${currentPage === "home" ? "active" : ""}">Home</a></li>
                    <li><a href="projects" class="${currentPage === "projects" ? "active" : ""}">Projects</a></li>
                    <li><a href="about" class="${currentPage === "about" ? "active" : ""}">About & Skills</a></li>
                    <li><a href="contact" class="${currentPage === "contact" ? "active" : ""}">Contact</a></li>
                </ul>
            </nav>

            <div class="header-actions">
                <!-- Unified Theme Dropdown -->
                <div class="theme-dropdown">
                    <button class="theme-dropdown-trigger" aria-label="Change theme">
                        <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="5"></circle>
                            <line x1="12" y1="1" x2="12" y2="3"></line>
                            <line x1="12" y1="21" x2="12" y2="23"></line>
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                            <line x1="1" y1="12" x2="3" y2="12"></line>
                            <line x1="21" y1="12" x2="23" y2="12"></line>
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                        </svg>
                        <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                        </svg>
                        <svg class="chevron-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                    <div class="theme-dropdown-content">
                        <!-- Mode Options -->
                        <div class="theme-section">
                            <h4 class="theme-section-title">Appearance</h4>
                            <button class="theme-option" data-mode="light">
                                <div class="theme-option-visual mode-light"></div>
                                <span>Light</span>
                            </button>
                            <button class="theme-option" data-mode="dark">
                                <div class="theme-option-visual mode-dark"></div>
                                <span>Dark</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
    `;
}

export function loadHeader(currentPage = "home") {
  const headerContainer = document.getElementById("header-container");
  if (headerContainer) {
    headerContainer.innerHTML = createHeader(currentPage);

    // Dispatch event to notify that header is loaded
    document.dispatchEvent(new CustomEvent("header-loaded"));
  }
}
