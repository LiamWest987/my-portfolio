// Project data
const projects = [
    {
        id: 1,
        title: 'Random Number Generator',
        category: 'Digital Electronics',
        date: '2024-10-17',
        image: '/photos/rng_dice.jpeg',
        description: 'This hardware RNG employs a 555 timer’s capacitor decay and logic circuits to create randomized LED patterns, simulating dice rolls through analog signal fading and digital processing.<br>',
        longDescription: 'The Random Number Generator uses a 555 timer-based analog circuit with fading capacitor signals to generate entropy, combined with sequential and combinational logic (ICs, AND/OR/NOT gates) to produce randomized LED outputs mimicking a dice roll. The project integrates Multi-sim simulation, component soldering, and truth tables to achieve a hardware-driven RNG.',
        technologies: ['Multisim', 'Circuit Logic', 'Prototyping', 'Soldering'],
        pdf: '/PDFs/Resume.pdf',
        demo: 'https://drive.google.com/file/d/14m4PKFGFdnuxGtXrklP6yti_XJYTF-jA/view?usp=sharing'
    },
    {
        id: 2,
        title: 'Majority Vote',
        category: 'Digital Electronics',
        date: '2024-11-13',
        image: '/photos/vote.jpg',
        description: 'A Majority Vote machine that uses logic gates to resolve voting controversies by ensuring majority decisions, prioritizing a tiebreaker, and validating reliability through truth tables and circuit designs.<br>',
        longDescription: 'I designed an electronic voting machine using specified logic gates (AND, OR, NAND, NOR, inverters) to resolve voting controversies by ensuring accurate majority decisions for a four-member board, with the president’s vote breaking ties. The project includes truth tables, Karnaugh maps, Boolean algebra simplification, and circuit implementations (AOI, NAND, NOR) to validate the design.',
        technologies: ['MultiSim', 'Boolean Logic', 'Karnough Mapping', 'Prototyping'],
        pdf: 'https://drive.google.com/file/d/1_CRURGl8S9dinBUTRWVQbEcggrIE2tUT/view?usp=sharing',
    },
    {
        id: 3,
        title: 'Date of Birth Counter',
        category: 'Digital Electronics',
        date: '2025-1-19',
        image: '/photos/time.jpeg',
        description: 'This project converts binary switch inputs into a seven-segment display output for date storage, using logic simplification and circuit prototyping to minimize hardware complexity.<br>',
        longDescription: 'The Date of Birth project simplifies storing and displaying numerical dates using three binary switches to drive a single seven-segment display, reducing hardware costs. It employs logic design (truth tables, K-maps, AOI/NAND/NOR circuits) and Tinkercad prototyping to decode switch inputs into segmented numeric outputs efficiently.',
        technologies: ['MultiSim', 'Boolean Logic', 'Tinkercad', 'Prototyping'],
        pdf: 'https://drive.google.com/file/d/1AG72sjsBNVecBDZuNOCTct0O6LO4COOr/view?usp=sharing',
    },
    {
        id: 4,
        title: 'Digital Timer',
        category: 'Digital Electronics',
        date: '2025-03-14',
        image: '/photos/timer.jpg',
        description: 'I designed a digital timer circuit that uses logic components to display time on seven-segment displays.<br><br><br>',
        longDescription: 'For this project, I built a digital timer using 74LS93N, 74LS193N, and flip-flop circuits to control the seconds, minutes, and hours. The circuit runs sequentially, with each segment triggering the next, accurately displaying time while following design constraints.',
        technologies: ['Multisim', 'Synchronous Logic', 'Counters', 'Logic Design'],
        pdf: 'https://drive.google.com/file/d/115cOyF1QmPf-WUOUXng-5EDb2lYgIRZ8/view?usp=sharing',
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
        pdf: 'https://drive.google.com/file/d/1EPMkSKlVewyCHb6DpfNocVkwCJ0KGLhP/view?usp=sharing',
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
        pdf: 'https://drive.google.com/file/d/1nkDvxaIGGJ09dHg72MBQkCTFXN1qzq9I/view?usp=sharing',
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