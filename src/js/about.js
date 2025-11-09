import {
  fetchSkills,
  fetchEducation,
  fetchExperience,
  fetchAwards,
} from "./sanity.js";
import { iconPaths } from "./icons.js";

// Fallback data for Skills
const fallbackSkills = [
  {
    title: "Digital Electronics",
    skills: [
      "Circuit Design",
      "Logic Gates",
      "Multisim",
      "Boolean Algebra",
      "Soldering",
      "555 Timers",
    ],
    order: 1,
  },
  {
    title: "VR Development",
    skills: [
      "Unity",
      "XR Toolkit",
      "C# Scripting",
      "VR Interaction",
      "Scene Design",
      "Prototyping",
    ],
    order: 2,
  },
  {
    title: "Aerospace Engineering",
    skills: [
      "Aerodynamics",
      "Flight Testing",
      "CAD Design",
      "Aery Simulation",
      "Structural Analysis",
      "Prototyping",
    ],
    order: 3,
  },
  {
    title: "Robotics & Automation",
    skills: [
      "VEX Robotics",
      "Blockly",
      "Sensor Integration",
      "Motor Control",
      "Biomimicry",
      "System Design",
    ],
    order: 4,
  },
  {
    title: "Engineering Tools",
    skills: [
      "Multisim",
      "Tinkercad",
      "SSA Testing",
      "Circuit Analysis",
      "Simulation Software",
      "Data Analysis",
    ],
    order: 5,
  },
  {
    title: "Soft Skills",
    skills: [
      "Problem Solving",
      "Team Collaboration",
      "Project Management",
      "Technical Writing",
      "Critical Thinking",
      "Communication",
    ],
    order: 6,
  },
];

// Fallback data for Education
const fallbackEducation = [
  {
    degree: "High School Engineering Track",
    school: "Frisco Independent School District",
    year: "Current",
    isCurrent: true,
    description:
      "Specialized coursework in Digital Electronics, Aerospace Engineering (PLTW), and Principles of Engineering. Gained hands-on experience with circuit design, logic systems, CAD modeling, and engineering principles.",
    order: 1,
  },
  {
    degree: "PLTW Engineering Program",
    school: "Project Lead The Way",
    year: "2023-2024",
    isCurrent: false,
    description:
      "Completed coursework in Principles of Engineering (POE) and Aerospace Engineering. Projects included tensile testing, marble sorting automation, glider design, and flight simulation analysis.",
    order: 2,
  },
];

// Fallback data for Experience
const fallbackExperience = [
  {
    role: "VR Developer - Crime Scene Simulation",
    company: "Collaboration with Texas A&M",
    period: "2024-Present",
    isCurrent: true,
    description:
      "Developing immersive VR training simulation for crime scene investigation with team of FISD students and A&M professor. Designing interactive mechanics for forensic evidence collection and analysis in realistic virtual environments.",
    order: 1,
  },
  {
    role: "Engineering Student",
    company: "Digital Electronics & Aerospace",
    period: "2023-Present",
    isCurrent: true,
    description:
      "Completed 15+ engineering projects including hardware random number generators, voting machines, digital timers, glider designs, and robotic marble sorters. Gained expertise in circuit design, logic systems, and aerospace principles.",
    order: 2,
  },
];

// Fallback data for Awards
const fallbackAwards = [
  {
    title:
      "Developed comprehensive VR crime scene simulation selected for collaboration with Texas A&M professor and law enforcement training program",
    description: "VR Crime Scene Simulation Project",
    year: "2024",
    order: 1,
  },
  {
    title:
      "Successfully completed 15+ engineering projects spanning digital electronics, aerospace, and robotics with documented results",
    description: "Engineering Portfolio",
    year: "2023-2024",
    order: 2,
  },
  {
    title:
      "Mastered advanced circuit design techniques including Boolean algebra, Karnaugh mapping, and AOI/NAND/NOR logic implementations",
    description: "Circuit Design Mastery",
    year: "2024",
    order: 3,
  },
  {
    title:
      "Demonstrated leadership in team projects, coordinating with peers on complex automation and simulation projects",
    description: "Team Leadership",
    year: "2023-2024",
    order: 4,
  },
  {
    title:
      "Built portfolio of documented engineering work demonstrating problem-solving, iteration, and continuous improvement",
    description: "Engineering Documentation",
    year: "2023-2024",
    order: 5,
  },
];

let skills = [];
let education = [];
let experience = [];
let awards = [];

// Load all data
async function loadAllData() {
  try {
    // Fetch from Sanity
    const [sanitySkills, sanityEducation, sanityExperience, sanityAwards] =
      await Promise.all([
        fetchSkills(),
        fetchEducation(),
        fetchExperience(),
        fetchAwards(),
      ]);

    // Use Sanity data if available, otherwise use fallback
    skills =
      sanitySkills && sanitySkills.length > 0 ? sanitySkills : fallbackSkills;
    education =
      sanityEducation && sanityEducation.length > 0
        ? sanityEducation
        : fallbackEducation;
    experience =
      sanityExperience && sanityExperience.length > 0
        ? sanityExperience
        : fallbackExperience;
    awards =
      sanityAwards && sanityAwards.length > 0 ? sanityAwards : fallbackAwards;

    console.log("✅ Loaded data:", {
      skills: skills.length > 0 ? "Sanity" : "Fallback",
      education: education.length > 0 ? "Sanity" : "Fallback",
      experience: experience.length > 0 ? "Sanity" : "Fallback",
      awards: awards.length > 0 ? "Sanity" : "Fallback",
    });
  } catch (error) {
    console.error("Error loading data:", error);
    skills = fallbackSkills;
    education = fallbackEducation;
    experience = fallbackExperience;
    awards = fallbackAwards;
    console.log("⚠️ Using fallback data");
  }
}

// Render Skills
function renderSkills() {
  const skillsGrid = document.querySelector(
    "#skills-content .tabs-content-grid",
  );
  if (!skillsGrid) return;

  skillsGrid.innerHTML = "";

  skills.forEach((category) => {
    const card = document.createElement("div");
    card.className = "skill-category-card";

    // Use icon from Sanity data, or fallback to default
    const iconPath = iconPaths[category.icon] || iconPaths["default"];

    card.innerHTML = `
            <div class="skill-category-card-inner">
                <div class="skill-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        ${iconPath}
                    </svg>
                </div>
                <div class="skill-content">
                    <h3 class="skill-category-title">${category.title}</h3>
                    <div class="skill-badges">
                        ${category.skills.map((skill) => `<span class="badge badge-secondary">${skill}</span>`).join("")}
                    </div>
                </div>
            </div>
        `;

    skillsGrid.appendChild(card);
  });
}

// Render Education
function renderEducation() {
  const educationList = document.querySelector(
    "#education-content .tabs-content-list",
  );
  if (!educationList) return;

  educationList.innerHTML = "";

  education.forEach((edu) => {
    const card = document.createElement("div");
    card.className = "timeline-card";

    card.innerHTML = `
            <div class="timeline-card-inner">
                <div class="timeline-icon education">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                        <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                    </svg>
                </div>
                <div class="timeline-content">
                    <div class="timeline-header">
                        <div>
                            <h3 class="timeline-title">${edu.degree}</h3>
                            <p class="timeline-subtitle">${edu.school}</p>
                        </div>
                        <span class="badge${edu.isCurrent ? "" : " badge-outline"}">${edu.isCurrent ? "Current" : edu.year}</span>
                    </div>
                    <p class="timeline-description">${edu.description}</p>
                </div>
            </div>
        `;

    educationList.appendChild(card);
  });
}

// Render Experience
function renderExperience() {
  const experienceList = document.querySelector(
    "#experience-content .tabs-content-list",
  );
  if (!experienceList) return;

  experienceList.innerHTML = "";

  experience.forEach((exp) => {
    const card = document.createElement("div");
    card.className = "timeline-card";

    card.innerHTML = `
            <div class="timeline-card-inner">
                <div class="timeline-icon experience">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                </div>
                <div class="timeline-content">
                    <div class="timeline-header">
                        <div>
                            <h3 class="timeline-title">${exp.role}</h3>
                            <p class="timeline-subtitle">${exp.company}</p>
                        </div>
                        <span class="badge badge-outline">${exp.isCurrent ? "Current" : exp.period}</span>
                    </div>
                    <p class="timeline-description">${exp.description}</p>
                </div>
            </div>
        `;

    experienceList.appendChild(card);
  });
}

// Render Awards
function renderAwards() {
  const awardsList = document.querySelector(
    "#achievements-content .tabs-content-list",
  );
  if (!awardsList) return;

  awardsList.innerHTML = "";

  awards.forEach((award) => {
    const card = document.createElement("div");
    card.className = "timeline-card";

    card.innerHTML = `
            <div class="timeline-card-inner">
                <div class="timeline-icon education">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="8" r="6"></circle>
                        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
                    </svg>
                </div>
                <div class="timeline-content">
                    <h3 class="timeline-title">${award.description || award.title}</h3>
                    <p class="timeline-description">${award.title}</p>
                </div>
            </div>
        `;

    awardsList.appendChild(card);
  });
}

// Initialize
document.addEventListener("DOMContentLoaded", async () => {
  await loadAllData();
  renderSkills();
  renderEducation();
  renderExperience();
  renderAwards();
});
