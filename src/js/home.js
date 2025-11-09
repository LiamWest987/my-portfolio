import { fetchProjects } from "./sanity.js";

// Fallback project data (same as main.js)
const fallbackProjects = [
  {
    id: 1,
    title: "Random Number Generator",
    category: "Digital Electronics",
    date: "2024-10-17",
    image: "photos/rng_dice.jpeg",
    description:
      "This hardware RNG employs a 555 timer's capacitor decay and logic circuits to create randomized LED patterns, simulating dice rolls through analog signal fading and digital processing.<br>",
    longDescription:
      "This project was a hardware-based Random Number Generator designed to mimic a dice roll using a 555 timer circuit. Entropy was introduced through the natural fading signal of a capacitor, which triggered sequential and combinational logic built from ICs and basic logic gates (AND, OR, NOT). The randomized outputs were displayed through LEDs, simulating dice values from 1 to 6. The design process involved circuit simulation using Multisim, analyzing truth tables, and hands-on construction through soldering and prototyping. Through this project, I learned how to integrate analog randomness with digital logic systems, gained experience debugging mixed-signal circuits, and improved my skills in simulation and physical circuit building. If I were to do this project again, I would add debouncing and output latching to stabilize the LED display and explore more efficient logic mapping to simplify the design. I also see room for improvement in validating randomness by applying basic statistical analysis to test the fairness of the output and refining the entropy source for greater consistency.",
    technologies: ["Multisim", "Circuit Logic", "Soldering"],
    pdf: "/pdfs/random_number_generator.pdf",
    featured: true,
  },
  {
    id: 5,
    title: "Crime Scene Simulation",
    category: "Unity VR",
    date: "2024-9-1",
    image: "photos/crime-scene.jpg",
    description:
      "A highly interactive VR training simulation that immerses students in realistic crime scenes, teaching forensic investigation techniques through hands-on evidence collection and analysis.<br>",
    longDescription:
      "The crime scene investigation VR simulation is an immersive, hands-on training tool designed to teach students forensic techniques, evidence collection, and crime scene analysis in a realistic virtual environment. Utilizing interactive mechanics and detailed crime scene scenarios, the simulation challenges users to think critically, document findings accurately, and apply investigative procedures as they would in a real-world forensic investigation.",
    technologies: ["Unity", "XR", "Prototyping", "VR Development"],
    demo: "https://drive.google.com/file/d/12YLKNvgazM30xmMHBnim2p_Efx-TkIFQ/view?usp=sharing",
    featured: true,
  },
  {
    id: 4,
    title: "Digital Timer",
    category: "Digital Electronics",
    date: "2025-03-14",
    image: "photos/timer.jpg",
    description:
      "I designed a digital timer circuit that uses logic components to display time on seven-segment displays.<br><br><br>",
    longDescription:
      "In this project, I built a digital timer using 74LS93N and 74LS193N counter ICs along with flip-flop circuits to track and display seconds, minutes, and hours. The design operates sequentially, with each time unit triggering the next to maintain accurate timekeeping within set design constraints. Constructing this system helped me understand the coordination between asynchronous and synchronous counting, as well as the importance of timing and propagation delays in sequential logic. If I were to improve the project, I would focus on optimizing the reset logic to better handle overflow conditions and explore integrating a crystal oscillator for more precise timing instead of relying solely on manual or unstable pulse inputs. This project reinforced the value of clean circuit design and deepened my understanding of time-based digital systems.",
    technologies: ["Multisim", "Synchronous Logic", "Logic Design"],
    pdf: "/pdfs/digital_timer_report.pdf",
    featured: true,
  },
  {
    id: 8,
    title: "Glider Design",
    category: "PLTW Aerospace",
    date: "2024-10-16",
    image: "photos/glider.png",
    description:
      "This project involved designing, building, and testing a wooden glider to achieve long, stable flight using aerodynamic principles and Aery simulation software.<br>",
    longDescription:
      "The objective was to create a glider that could fly far and straight by optimizing its design within strict material constraints and using Aery software to refine performance. We experimented with wing shape, center of gravity, and lift-to-drag ratios, then built and tested the glider through multiple launches. Through the process, I learned the importance of precision in both digital design and physical construction—and how small flaws like uneven sanding can make a big difference in real-world performance.",
    technologies: ["Flight Testing", "Structural Design"],
    pdf: "/pdfs/glider_project.pdf",
    featured: true,
  },
  {
    id: 2,
    title: "Majority Vote",
    category: "Digital Electronics",
    date: "2024-11-13",
    image: "photos/vote.jpg",
    description:
      "A Majority Vote machine that uses logic gates to resolve voting controversies by ensuring majority decisions, prioritizing a tiebreaker, and validating reliability through truth tables and circuit designs.<br>",
    longDescription:
      "I designed an electronic voting machine that uses specified logic gates (AND, OR, NAND, NOR, and inverters) to accurately determine majority decisions among a four-member board, with the president's vote used to break ties. The logic was developed and verified using truth tables, Karnaugh maps, and Boolean algebra simplification, and implemented using AOI, NAND-only, and NOR-only logic circuits. This project taught me how to translate real-world decision-making rules into reliable digital logic, and how to optimize those rules for efficiency and minimal gate usage. If I were to revisit the design, I would focus on modularizing the logic for easier scalability and explore implementing the system on a programmable logic device to improve flexibility and reduce physical complexity.",
    technologies: ["MultiSim", "Boolean Logic", "Karnough Mapping"],
    pdf: "/pdfs/majority_vote.pdf",
    featured: true,
  },
  {
    id: 6,
    title: "Marble Sorter",
    category: "PLTW POE",
    date: "2024-04-03",
    image: "photos/marbles.jpg",
    description:
      "The Marble Sorter project is an automated system inspired by a cow's stomach design that sorts marbles based on color using a light sensor, servo motor, and user controls for interaction and feedback.<br>",
    longDescription:
      "Our team developed an innovative Marble Sorter that uses biomimicry to efficiently sort marbles by color. Combining a light sensor for detection and a motorized gear system for precise sorting, the project emphasizes automation, user interaction, and real-time feedback to enhance accuracy and efficiency in manufacturing-like environments.",
    technologies: ["VEX", "Blockly", "Prototyping", "Biomimicry"],
    pdf: "/pdfs/marble_sorter.pdf",
    featured: true,
  },
];

let projects = [];

// Load projects from Sanity or use fallback
async function loadProjects() {
  try {
    const sanityProjects = await fetchProjects();
    if (sanityProjects && sanityProjects.length > 0) {
      projects = sanityProjects;
    } else {
      throw new Error("No projects from Sanity");
    }
  } catch (error) {
    console.error("Error loading projects:", error);
    projects = fallbackProjects;
  }
}

// Format date
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Render featured projects
function renderFeaturedProjects() {
  const featuredGrid = document.getElementById("featured-grid");
  if (!featuredGrid) return;

  featuredGrid.innerHTML = "";

  // Get only featured projects
  const featuredProjects = projects
    .filter((p) => p.featured === true)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  featuredProjects.forEach((project) => {
    const projectCard = document.createElement("div");
    projectCard.className = "project-card";

    // Prepare technologies (show first 4, then +X more)
    const visibleTechs = project.technologies.slice(0, 4);
    const remainingCount = project.technologies.length - 4;

    projectCard.innerHTML = `
            <div class="project-card-image-wrapper">
                <img src="${project.image}" alt="${project.title}" class="project-card-image">
            </div>
            <div class="project-card-header">
                <div class="project-card-meta">
                    <span class="badge badge-secondary">${project.category}</span>
                    <div class="project-card-date">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>${formatDate(project.date)}</span>
                    </div>
                </div>
                <h3 class="project-card-title">${project.title}</h3>
                <p class="project-card-description">${project.description}</p>
            </div>
            <div class="project-card-content">
                <div class="tech-tags">
                    ${visibleTechs
                      .map(
                        (tech) =>
                          `<span class="badge badge-outline">${tech}</span>`,
                      )
                      .join("")}
                    ${remainingCount > 0 ? `<span class="badge badge-outline">+${remainingCount}</span>` : ""}
                </div>
            </div>
            <div class="project-card-footer">
                <button class="button button-outline button-sm button-full">View Details</button>
            </div>
        `;

    projectCard.addEventListener("click", () => showProjectModal(project));
    featuredGrid.appendChild(projectCard);
  });
}

// Project modal with image gallery
function showProjectModal(project) {
  const modal = document.getElementById("project-modal");
  if (!modal) return;

  const modalContainer = modal.querySelector(".modal-container");
  if (!modalContainer) return;

  // Prepare all images (primary + additional)
  const allImages = [project.image, ...(project.images || [])].filter(Boolean);
  const hasMultipleImages = allImages.length > 1;

  // Populate modal content
  modalContainer.innerHTML = `
        <div class="modal-header">
            <div class="modal-header-content">
                <div class="modal-meta">
                    <span class="badge badge-secondary">${project.category}</span>
                    <div class="modal-date">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>${formatDate(project.date)}</span>
                    </div>
                </div>
                <h2 class="modal-title">${project.title}</h2>
                <p class="modal-subtitle">${project.description}</p>
            </div>
            <button class="modal-close" aria-label="Close modal">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
        <div class="modal-body">
            <div class="modal-image-gallery">
                ${
                  hasMultipleImages
                    ? `
                    <button class="gallery-nav gallery-prev" aria-label="Previous image">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                `
                    : ""
                }
                <div class="gallery-images">
                    ${allImages
                      .map(
                        (img, index) => `
                        <img src="${img}" alt="${project.title} - Image ${index + 1}" class="modal-image ${index === 0 ? "active" : ""}" data-index="${index}" loading="${index === 0 ? "eager" : "lazy"}">
                    `,
                      )
                      .join("")}
                </div>
                ${
                  hasMultipleImages
                    ? `
                    <button class="gallery-nav gallery-next" aria-label="Next image">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                    <div class="gallery-indicators">
                        ${allImages
                          .map(
                            (_, index) => `
                            <span class="gallery-dot ${index === 0 ? "active" : ""}" data-index="${index}"></span>
                        `,
                          )
                          .join("")}
                    </div>
                `
                    : ""
                }
            </div>

            ${
              project.pdf || project.demo
                ? `
                <div class="modal-actions">
                    ${
                      project.pdf
                        ? `
                        <a href="${project.pdf}" target="_blank" class="button button-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                            View PDF
                        </a>
                    `
                        : ""
                    }
                    ${
                      project.demo
                        ? `
                        <a href="${project.demo}" target="_blank" class="button button-outline">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                            </svg>
                            Live Demo
                        </a>
                    `
                        : ""
                    }
                </div>
            `
                : ""
            }

            <div class="modal-divider"></div>

            ${
              project.overview || project.longDescription
                ? `
                <div class="modal-section">
                    <h3 class="modal-section-title">Overview</h3>
                    <p class="modal-description">${project.overview || project.longDescription}</p>
                </div>
            `
                : ""
            }

            ${
              project.technologies && project.technologies.length > 0
                ? `
                <div class="modal-section">
                    <h3 class="modal-section-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                            <line x1="7" y1="7" x2="7.01" y2="7"></line>
                        </svg>
                        Technologies Used
                    </h3>
                    <div class="tech-tags">
                        ${project.technologies
                          .map(
                            (tech) =>
                              `<span class="badge badge-secondary">${tech}</span>`,
                          )
                          .join("")}
                    </div>
                </div>
            `
                : ""
            }

            ${
              project.challenges
                ? `
                <div class="modal-section">
                    <h3 class="modal-section-title">Challenges & Solutions</h3>
                    <p class="modal-description">${project.challenges}</p>
                </div>
            `
                : ""
            }

            ${
              project.outcomes
                ? `
                <div class="modal-section">
                    <h3 class="modal-section-title">Outcomes & Impact</h3>
                    <p class="modal-description">${project.outcomes}</p>
                </div>
            `
                : ""
            }

            ${
              project.tags && project.tags.length > 0
                ? `
                <div class="modal-section">
                    <h3 class="modal-section-title">Tags</h3>
                    <div class="tech-tags">
                        ${project.tags
                          .map(
                            (tag) =>
                              `<span class="badge badge-outline">${tag}</span>`,
                          )
                          .join("")}
                    </div>
                </div>
            `
                : ""
            }
        </div>
    `;

  // Show modal with animation
  modal.classList.add("active");
  document.body.style.overflow = "hidden";

  // Setup image gallery navigation
  if (hasMultipleImages) {
    let currentImageIndex = 0;
    const images = modalContainer.querySelectorAll(".modal-image");
    const dots = modalContainer.querySelectorAll(".gallery-dot");
    const prevBtn = modalContainer.querySelector(".gallery-prev");
    const nextBtn = modalContainer.querySelector(".gallery-next");

    function showImage(index) {
      images.forEach((img) => img.classList.remove("active"));
      dots.forEach((dot) => dot.classList.remove("active"));
      images[index].classList.add("active");
      dots[index].classList.add("active");
      currentImageIndex = index;
    }

    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const newIndex =
        (currentImageIndex - 1 + allImages.length) % allImages.length;
      showImage(newIndex);
    });

    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const newIndex = (currentImageIndex + 1) % allImages.length;
      showImage(newIndex);
    });

    dots.forEach((dot, index) => {
      dot.addEventListener("click", (e) => {
        e.stopPropagation();
        showImage(index);
      });
    });
  }

  // Setup close handlers
  const closeButton = modalContainer.querySelector(".modal-close");
  closeButton.addEventListener("click", closeModal);

  // Close on backdrop click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on escape key
  const handleEscape = (e) => {
    if (e.key === "Escape") {
      closeModal();
      document.removeEventListener("keydown", handleEscape);
    }
  };
  document.addEventListener("keydown", handleEscape);
}

// Close modal
function closeModal() {
  const modal = document.getElementById("project-modal");
  if (!modal) return;

  modal.classList.remove("active");
  document.body.style.overflow = "";
}

// Initialize
document.addEventListener("DOMContentLoaded", async () => {
  await loadProjects();
  renderFeaturedProjects();
});
