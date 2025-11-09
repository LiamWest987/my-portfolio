// Navigation active state handling
document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-links a");
  // Extract the current page from the URL path
  let currentPage = window.location.pathname.split("/").pop();
  currentPage = currentPage.replace(/\.html+$/g, ""); // Ensure we only remove one .html if it exists

  // Default to "home" for the home page
  if (currentPage === "") {
    currentPage = "home";
  }

  navLinks.forEach((link) => {
    // Get the link's href and remove .html
    let linkHref = link.getAttribute("href").replace(".html", "");
    // Extract the last segment of the href (handles absolute/relative paths)
    let linkPage = linkHref.split("/").pop();

    // Handle home page links (empty segment or "/")
    if (linkPage === "") {
      linkPage = "home";
    }

    // Compare and toggle the 'active' class
    if (linkPage === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});

// Remove .html from URL
if (window.location.pathname.includes(".html")) {
  const newPath = window.location.pathname.replace(/\.html+/g, ""); // Removes multiple .html occurrences
  window.history.replaceState(null, "", newPath);
}
