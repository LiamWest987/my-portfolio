/**
 * Shared Footer Component
 * Injects consistent footer across all pages
 */

export function createFooter() {
  return `
    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <!-- Brand Section -->
                <div class="footer-brand">
                    <a href="home" class="footer-logo">
                        <span class="logo-bracket">&lt;</span>Liam West<span class="logo-accent"> /&gt;</span>
                    </a>

                    <!-- Social Links -->
                    <div class="footer-social-links">
                        <a id="footer-linkedin-link" href="https://www.linkedin.com/in/liam-west-/" target="_blank" class="footer-social-icon" aria-label="LinkedIn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                <rect x="2" y="9" width="4" height="12"></rect>
                                <circle cx="4" cy="4" r="2"></circle>
                            </svg>
                        </a>
                        <a id="footer-email-link" href="#" data-email-user="liamwest987" data-email-domain="gmail.com" class="footer-social-icon" aria-label="Email">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                            </svg>
                        </a>
                    </div>

                    <p class="footer-tagline">Engineering student passionate about circuit design, aerospace systems, and VR development.</p>
                </div>

                <!-- Navigation Sections -->
                <div class="footer-nav-grid">
                    <!-- Site Map -->
                    <div class="footer-nav-section">
                        <h3 class="footer-nav-heading">Site Map</h3>
                        <nav class="footer-nav-links">
                            <a href="/home" class="footer-nav-link">Homepage</a>
                            <a href="/about" class="footer-nav-link">About & Skills</a>
                            <a href="/projects" class="footer-nav-link">Projects</a>
                            <a href="/contact" class="footer-nav-link">Contact</a>
                        </nav>
                    </div>

                    <!-- Resources -->
                    <div class="footer-nav-section">
                        <h3 class="footer-nav-heading">Resources</h3>
                        <nav class="footer-nav-links">
                            <a id="footer-resume-link" href="/pdfs/resume.pdf" class="footer-nav-link" download>Resume</a>
                            <a id="footer-linkedin-nav-link" href="https://www.linkedin.com/in/liam-west-/" target="_blank" class="footer-nav-link">LinkedIn</a>
                        </nav>
                    </div>
                </div>
            </div>

            <!-- Back to Top Button -->
            <div class="footer-back-to-top-container">
                <button class="back-to-top" onclick="window.scrollTo({top: 0, behavior: 'smooth'})">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                    Back to Top
                </button>
            </div>
        </div>

        <!-- Copyright Bar -->
        <div class="footer-copyright-bar">
            <div class="container">
                <p id="footer-copyright" class="footer-copyright-text">Copyright © ${new Date().getFullYear()}, Liam West. All Rights Reserved.</p>
            </div>
        </div>
    </footer>
    `;
}

export function loadFooter() {
  const footerContainer = document.getElementById("footer-container");
  if (footerContainer) {
    footerContainer.innerHTML = createFooter();

    // Email obfuscation - reconstruct mailto link on click
    const footerEmailLink = document.getElementById("footer-email-link");
    if (footerEmailLink) {
      footerEmailLink.addEventListener("click", function (e) {
        e.preventDefault();
        const user = this.getAttribute("data-email-user");
        const domain = this.getAttribute("data-email-domain");
        window.location.href = "mailto:" + user + "@" + domain;
      });
    }
  }
}
