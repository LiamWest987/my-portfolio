/**
 * Tabs Component JavaScript
 * Handles tab switching functionality
 */

export function initializeTabs() {
  const tabContainers = document.querySelectorAll(".tabs");

  tabContainers.forEach((container) => {
    const triggers = container.querySelectorAll(".tabs-trigger");
    const contents = container.querySelectorAll(".tabs-content");

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const targetId = trigger.dataset.tab;

        // Remove active class from all triggers and contents
        triggers.forEach((t) => t.classList.remove("active"));
        contents.forEach((c) => c.classList.remove("active"));

        // Add active class to clicked trigger
        trigger.classList.add("active");

        // Show corresponding content
        const targetContent = container.querySelector(`#${targetId}`);
        if (targetContent) {
          targetContent.classList.add("active");
        }
      });
    });
  });
}

// Auto-initialize on DOM ready
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeTabs);
  } else {
    initializeTabs();
  }
}
