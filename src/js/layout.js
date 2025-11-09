/**
 * Layout Manager
 * Loads shared header and footer components
 */

import { loadHeader } from "./components/header.js";
import { loadFooter } from "./components/footer.js";

/**
 * Initialize layout components
 * @param {string} currentPage - The current page name for active nav highlighting
 */
export function initLayout(currentPage = "home") {
  loadHeader(currentPage);
  loadFooter();
}

// Auto-detect current page from URL
export function getCurrentPage() {
  const path = window.location.pathname;
  const page = path.split("/").pop().replace(".html", "") || "home";
  return page === "index" ? "home" : page;
}
