// Project data
const projects = [
    {
        id: 1,
        title: 'Random Number Generator',
        category: 'Digital Electronics',
        date: '2024-10-17',
        image: '/photos/rng_dice.jpeg',
        description: 'This hardware RNG employs a 555 timer’s capacitor decay and logic circuits to create randomized LED patterns, simulating dice rolls through analog signal fading and digital processing.<br>',
        longDescription: 'This project is a hardware-based Random Number Generator designed to mimic a dice roll using a 555 timer circuit. Entropy is introduced through the natural fading signal of a capacitor, which triggers sequential and combinational logic built from ICs and basic logic gates (AND, OR, NOT). The randomized outputs are displayed through LEDs, simulating dice values from 1 to 6. The design process involved circuit simulation using Multisim, developing and analyzing truth tables, and hands-on construction through soldering and prototyping. Through this project, I learned how to integrate analog randomness with digital logic systems and gained practical experience debugging mixed-signal circuits. If I were to do it again, I’d add debouncing and output latching to stabilize the LED display, and explore more efficient logic mapping to reduce complexity. There\'s also room for improving randomness validation by applying basic statistical analysis to test output fairness.',
        technologies: ['Multisim', 'Circuit Logic', 'Prototyping', 'Soldering'],
        pdf: '/PDFs/Random_Number_Generator.pdf',
        demo: 'https://drive.google.com/file/d/14m4PKFGFdnuxGtXrklP6yti_XJYTF-jA/view?usp=sharing'
    },
    {
        id: 2,
        title: 'Majority Vote',
        category: 'Digital Electronics',
        date: '2024-11-13',
        image: '/photos/vote.jpg',
        description: 'A Majority Vote machine that uses logic gates to resolve voting controversies by ensuring majority decisions, prioritizing a tiebreaker, and validating reliability through truth tables and circuit designs.<br>',
        longDescription: 'I designed an electronic voting machine that uses specified logic gates (AND, OR, NAND, NOR, and inverters) to accurately determine majority decisions among a four-member board, with the president\'s vote used to break ties. The logic was developed and verified using truth tables, Karnaugh maps, and Boolean algebra simplification, and implemented using AOI, NAND-only, and NOR-only logic circuits. This project taught me how to translate real-world decision-making rules into reliable digital logic, and how to optimize those rules for efficiency and minimal gate usage. If I were to revisit the design, I\’d focus on modularizing the logic for easier scalability and explore implementing the system on a programmable logic device to improve flexibility and reduce physical complexity.',
        technologies: ['MultiSim', 'Boolean Logic', 'Karnough Mapping', 'Prototyping'],
        pdf: '/PDFs/Majority_Vote.pdf',
    },
    {
        id: 3,
        title: 'Date of Birth Counter',
        category: 'Digital Electronics',
        date: '2025-1-19',
        image: '/photos/time.jpeg',
        description: 'This project converts binary switch inputs into a seven-segment display output for date storage, using logic simplification and circuit prototyping to minimize hardware complexity.<br>',
        longDescription: 'The Date of Birth project focuses on efficiently storing and displaying numerical dates using just three binary switches to control a single seven-segment display, minimizing hardware requirements. Logic design techniques—including truth tables, Karnaugh maps, and AOI, NAND, and NOR implementations—were used to decode binary inputs into the appropriate segmented outputs. The circuit was prototyped and tested using Tinkercad to ensure accurate display logic. Through this project, I deepened my understanding of binary-to-decimal conversion and display control using combinational logic. If I were to improve the design, I’d aim to streamline the logic further using a dedicated decoder IC and expand the switch range to support double-digit outputs, enabling full date representation while maintaining minimal hardware.',
        technologies: ['MultiSim', 'Boolean Logic', 'Tinkercad', 'Prototyping'],
        pdf: '/PDFs/Date_of_Birth',
    },
    {
        id: 4,
        title: 'Digital Timer',
        category: 'Digital Electronics',
        date: '2025-03-14',
        image: '/photos/timer.jpg',
        description: 'I designed a digital timer circuit that uses logic components to display time on seven-segment displays.<br><br><br>',
        longDescription: 'In this project, I built a digital timer using 74LS93N and 74LS193N counter ICs along with flip-flop circuits to track and display seconds, minutes, and hours. The design operates sequentially, with each time unit triggering the next to maintain accurate timekeeping within set design constraints. Constructing this system helped me understand the coordination between asynchronous and synchronous counting, as well as the importance of timing and propagation delays in sequential logic. If I were to improve the project, I’d focus on optimizing reset logic to better handle overflow conditions and explore integrating a crystal oscillator for more precise timing instead of relying solely on manual or unstable pulse inputs.',
        technologies: ['Multisim', 'Synchronous Logic', 'Counters', 'Logic Design'],
        pdf: '/PDFs/Digital_Timer_Report.pdf',
    },
    {
        id: 5,
        title: 'Crime Scene Simulation',
        category: 'Unity VR',
        date: '2024-9-1',
        image: '/photos/crime-scene.jpg',
        description: 'A highly interactive VR training simulation that immerses students in realistic crime scenes, teaching forensic investigation techniques through hands-on evidence collection and analysis.<br>',
        longDescription: 'The crime scene investigation VR simulation is an immersive, hands-on training tool designed to teach students forensic techniques, evidence collection, and crime scene analysis in a realistic virtual environment. Utilizing interactive mechanics and detailed crime scene scenarios, the simulation challenges users to think critically, document findings accurately, and apply investigative procedures as they would in a real-world forensic investigation.',
        technologies: ['Unity', 'XR', 'Prototyping', 'VR Development'],
        //pdf: 'https://drive.google.com/file/d/1kOsWMMR2nAOrhcJB2yukpd8sTueXrqbZ/view?usp=sharing',
        demo: 'https://drive.google.com/file/d/1Y8ENOqjAnYbOuniipkVFmOv4OYWC5Svj/view?usp=sharing'
    },
    {
        id: 6,
        title: 'Marble Sorter',
        category: 'PLTW POE',
        date: '2024-04-03',
        image: '/photos/marbles.jpg',
        description: 'The Marble Sorter project is an automated system inspired by a cow\'s stomach design that sorts marbles based on color using a light sensor, servo motor, and user controls for interaction and feedback.<br>',
        longDescription: 'Our team developed an innovative Marble Sorter that uses biomimicry to efficiently sort marbles by color. Combining a light sensor for detection and a motorized gear system for precise sorting, the project emphasizes automation, user interaction, and real-time feedback to enhance accuracy and efficiency in manufacturing-like environments.',
        technologies: ['VEX', 'Blockly', 'Prototyping', 'Biomimicry'],
        pdf: '/PDFs/Marble_Sorter.pdf',
    },
    {
        id: 7,
        title: 'Tensile Testing',
        category: 'PLTW POE',
        date: '2023-11-13',
        image: '/photos/tensiletest.jpg',
        description: 'I built balsa wood trusses, tested them on an SSA Machine, and analyzed the resulting graph to understand key properties like modulus of toughness.<br>',
        longDescription: 'In this project, I constructed balsa wood trusses and tested their strength using an SSA Machine. I analyzed the resulting graph to identify important properties such as the modulus of elasticity and modulus of toughness, while also improving my attention to detail with units and numerical accuracy.',
        technologies: ['SSA Machines', 'Property Testing', 'Rapid Development', 'Calculations'],
        pdf: '/PDFs/Tensile_Test_SSA.pdf',
    }
];

// Sort functions
const sortFunctions = {
    dateDesc: (a, b) => new Date(b.date) - new Date(a.date),
    dateAsc: (a, b) => new Date(a.date) - new Date(b.date),
    nameAsc: (a, b) => a.title.localeCompare(b.title),
    nameDesc: (a, b) => b.title.localeCompare(a.title),
    category: (a, b) => a.category.localeCompare(b.category)
};

// Format date
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Render projects
function renderProjects(sortType = 'dateDesc') {
    const projectGrid = document.querySelector('.project-grid');
    projectGrid.innerHTML = '';
    
    const sortedProjects = [...projects].sort(sortFunctions[sortType]);

    sortedProjects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.innerHTML = `
            <img src="${project.image}" alt="${project.title}" class="project-image">
            <div class="project-info">
                <h3 class="project-title">${project.title}</h3>
                <div class="project-meta">
                    <span>${project.category}</span>
                    <span>•</span>
                    <span>${formatDate(project.date)}</span>
                </div>
                <p class="project-description">${project.description}</p>
                <div class="tech-stack">
                    ${project.technologies.map(tech => 
                        `<span class="tech-tag">${tech}</span>`
                    ).join('')}
                </div>
            </div>
        `;
        
        projectCard.addEventListener('click', () => showProjectModal(project));
        projectGrid.appendChild(projectCard);
    });
}



// Project modal
function showProjectModal(project) {
    const modal = document.getElementById('project-modal');
    const modalBody = modal.querySelector('.modal-body');
    
    modalBody.innerHTML = `
        <div class="modal-header">
            <h2 class="modal-title">${project.title}</h2>
            <span class="close-modal">&times;</span>
        </div>
        <img src="${project.image}" alt="${project.title}" class="modal-image">
        <div class="modal-content">
            <div class="project-meta">
                <span>${project.category}</span>
                <span>•</span>
                <span>${formatDate(project.date)}</span>
            </div>
            <p class="modal-description">${project.longDescription}</p>
            <div class="tech-stack">
                ${project.technologies.map(tech => 
                    `<span class="tech-tag">${tech}</span>`
                ).join('')}
            </div>
            <div class="modal-links">
                ${project.pdf ? `<a href="${project.pdf}" target="_blank" class="modal-link"><i class="fas fa-file-pdf"></i> View PDF</a>` : ''}
                ${project.demo ? `<a href="${project.demo}" target="_blank" class="modal-link"><i class="fas fa-video"></i> Video Demo</a>` : ''}
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    setTimeout(() => modal.classList.add('active'), 10);

    const closeButton = modalBody.querySelector('.close-modal');
    closeButton.addEventListener('click', closeModal);
}


// Close modal
function closeModal() {
    const modal = document.getElementById('project-modal');
    modal.classList.remove('active');
    setTimeout(() => modal.style.display = 'none', 300);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
    
    // Setup sort controls
    const sortControls = document.querySelector('.sort-controls');
    if (sortControls) {
        sortControls.addEventListener('click', (e) => {
            if (e.target.classList.contains('sort-button')) {
                const sortType = e.target.dataset.sort;
                document.querySelector('.sort-button.active')?.classList.remove('active');
                e.target.classList.add('active');
                renderProjects(sortType);
            }
        });
    }

    // Setup intersection observer for sections
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        { threshold: 0.1 }
    );

    sections.forEach(section => observer.observe(section));
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('project-modal');
    if (e.target === modal) {
        closeModal();
    }
});