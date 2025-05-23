// Project data
const projects = [
    {
        id: 1,
        title: 'Random Number Generator',
        category: 'Digital Electronics',
        date: '2024-10-17',
        image: 'photos/rng_dice.jpeg',
        description: 'This hardware RNG employs a 555 timer\'s capacitor decay and logic circuits to create randomized LED patterns, simulating dice rolls through analog signal fading and digital processing.<br>',
        longDescription: 'This project was a hardware-based Random Number Generator designed to mimic a dice roll using a 555 timer circuit. Entropy was introduced through the natural fading signal of a capacitor, which triggered sequential and combinational logic built from ICs and basic logic gates (AND, OR, NOT). The randomized outputs were displayed through LEDs, simulating dice values from 1 to 6. The design process involved circuit simulation using Multisim, analyzing truth tables, and hands-on construction through soldering and prototyping. Through this project, I learned how to integrate analog randomness with digital logic systems, gained experience debugging mixed-signal circuits, and improved my skills in simulation and physical circuit building. If I were to do this project again, I would add debouncing and output latching to stabilize the LED display and explore more efficient logic mapping to simplify the design. I also see room for improvement in validating randomness by applying basic statistical analysis to test the fairness of the output and refining the entropy source for greater consistency.',
        technologies: ['Multisim', 'Circuit Logic','Soldering'],
        pdf: '/pdfs/random_number_generator.pdf',
        //demo: 'https://drive.google.com/file/d/14m4PKFGFdnuxGtXrklP6yti_XJYTF-jA/view?usp=sharing'
    },
    {
        id: 2,
        title: 'Majority Vote',
        category: 'Digital Electronics',
        date: '2024-11-13',
        image: 'photos/vote.jpg',
        description: 'A Majority Vote machine that uses logic gates to resolve voting controversies by ensuring majority decisions, prioritizing a tiebreaker, and validating reliability through truth tables and circuit designs.<br>',
        longDescription: 'I designed an electronic voting machine that uses specified logic gates (AND, OR, NAND, NOR, and inverters) to accurately determine majority decisions among a four-member board, with the president\'s vote used to break ties. The logic was developed and verified using truth tables, Karnaugh maps, and Boolean algebra simplification, and implemented using AOI, NAND-only, and NOR-only logic circuits. This project taught me how to translate real-world decision-making rules into reliable digital logic, and how to optimize those rules for efficiency and minimal gate usage. If I were to revisit the design, I would focus on modularizing the logic for easier scalability and explore implementing the system on a programmable logic device to improve flexibility and reduce physical complexity.',
        technologies: ['MultiSim', 'Boolean Logic', 'Karnough Mapping'],
        pdf: '/pdfs/majority_vote.pdf',
    },
    {
        id: 3,
        title: 'Date of Birth Counter',
        category: 'Digital Electronics',
        date: '2025-1-19',
        image: 'photos/date_of_birth.png',
        description: 'This project converts binary switch inputs into a seven-segment display output for date storage, using logic simplification and circuit prototyping to minimize hardware complexity.<br>',
        longDescription: 'The Date of Birth project focuses on efficiently storing and displaying numerical dates using just three binary switches to control a single seven-segment display, minimizing hardware requirements. Logic design techniques—including truth tables, Karnaugh maps, and AOI, NAND, and NOR implementations—were used to decode binary inputs into the appropriate segmented outputs. The circuit was prototyped and tested using Tinkercad to ensure accurate display logic. Through this project, I deepened my understanding of binary-to-decimal conversion and display control using combinational logic. If I were to improve the design, I would streamline the logic further by using a dedicated decoder IC and expand the switch range to support double-digit outputs, enabling full date representation while maintaining minimal hardware.',
        technologies: ['MultiSim', 'Boolean Logic', 'Tinkercad'],
        pdf: '/pdfs/date_of_birth.pdf',
    },
    {
        id: 4,
        title: 'Digital Timer',
        category: 'Digital Electronics',
        date: '2025-03-14',
        image: 'photos/timer.jpg',
        description: 'I designed a digital timer circuit that uses logic components to display time on seven-segment displays.<br><br><br>',
        longDescription: 'In this project, I built a digital timer using 74LS93N and 74LS193N counter ICs along with flip-flop circuits to track and display seconds, minutes, and hours. The design operates sequentially, with each time unit triggering the next to maintain accurate timekeeping within set design constraints. Constructing this system helped me understand the coordination between asynchronous and synchronous counting, as well as the importance of timing and propagation delays in sequential logic. If I were to improve the project, I would focus on optimizing the reset logic to better handle overflow conditions and explore integrating a crystal oscillator for more precise timing instead of relying solely on manual or unstable pulse inputs. This project reinforced the value of clean circuit design and deepened my understanding of time-based digital systems.',
        technologies: ['Multisim', 'Synchronous Logic','Logic Design'],
        pdf: '/pdfs/digital_timer_report.pdf',
    },
    {
        id: 5,
        title: 'Crime Scene Simulation',
        category: 'Unity VR',
        date: '2024-9-1',
        image: 'photos/crime-scene.jpg',
        description: 'A highly interactive VR training simulation that immerses students in realistic crime scenes, teaching forensic investigation techniques through hands-on evidence collection and analysis.<br>',
        longDescription: 'The crime scene investigation VR simulation is an immersive, hands-on training tool designed to teach students forensic techniques, evidence collection, and crime scene analysis in a realistic virtual environment. Utilizing interactive mechanics and detailed crime scene scenarios, the simulation challenges users to think critically, document findings accurately, and apply investigative procedures as they would in a real-world forensic investigation.',
        technologies: ['Unity', 'XR', 'Prototyping', 'VR Development'],
        //pdf: 'https://drive.google.com/file/d/1kOsWMMR2nAOrhcJB2yukpd8sTueXrqbZ/view?usp=sharing',
        demo: 'https://drive.google.com/file/d/12YLKNvgazM30xmMHBnim2p_Efx-TkIFQ/view?usp=sharing'
    },
    {
        id: 6,
        title: 'Marble Sorter',
        category: 'PLTW POE',
        date: '2024-04-03',
        image: 'photos/marbles.jpg',
        description: 'The Marble Sorter project is an automated system inspired by a cow\'s stomach design that sorts marbles based on color using a light sensor, servo motor, and user controls for interaction and feedback.<br>',
        longDescription: 'Our team developed an innovative Marble Sorter that uses biomimicry to efficiently sort marbles by color. Combining a light sensor for detection and a motorized gear system for precise sorting, the project emphasizes automation, user interaction, and real-time feedback to enhance accuracy and efficiency in manufacturing-like environments.',
        technologies: ['VEX', 'Blockly', 'Prototyping', 'Biomimicry'],
        pdf: '/pdfs/marble_sorter.pdf',
    },
    {
        id: 7,
        title: 'Tensile Testing',
        category: 'PLTW POE',
        date: '2023-11-13',
        image: 'photos/tensiletest.jpg',
        description: 'I built balsa wood trusses, tested them on an SSA Machine, and analyzed the resulting graph to understand key properties like modulus of toughness.<br>',
        longDescription: 'In this project, I constructed balsa wood trusses and tested their strength using an SSA Machine. I analyzed the resulting graph to identify important properties such as the modulus of elasticity and modulus of toughness, while also improving my attention to detail with units and numerical accuracy.',
        technologies: ['SSA Machines', 'Property Testing'],
        pdf: '/pdfs/tensile_test_ssa.pdf',
    },
    {
        id: 8,
        title: 'Glider Design',
        category: 'PLTW Aerospace',
        date: '2024-10-16',
        image: 'photos/glider.png',
        description: 'This project involved designing, building, and testing a wooden glider to achieve long, stable flight using aerodynamic principles and Aery simulation software.<br>',
        longDescription: 'The objective was to create a glider that could fly far and straight by optimizing its design within strict material constraints and using Aery software to refine performance. We experimented with wing shape, center of gravity, and lift-to-drag ratios, then built and tested the glider through multiple launches. Through the process, I learned the importance of precision in both digital design and physical construction—and how small flaws like uneven sanding can make a big difference in real-world performance.',
        technologies: ['Flight Testing', 'Structural Design'],
        pdf: '/pdfs/glider_project.pdf',
    },
    {
        id: 9,
        title: 'Evolution Of Flight Presentation',
        category: 'PLTW Aerospace',
        date: '2023-08-24',
        image: 'photos/evolution_of_flight.jpg',
        description: 'This project explores the groundbreaking flight of the Bell X-1, the first aircraft to break the sound barrier, and its impact on aviation history.<br>',
        longDescription: 'The goal of this project was to study the Bell X-1\'s design and its historic role in surpassing the sound barrier. We researched its engineering, Chuck Yeager\'s contributions, and the broader impact on aviation to create an informative presentation. I learned how engineering and test piloting work hand-in-hand, and how this milestone paved the way for future aerospace breakthroughs.',
        technologies: ['Research', 'Analysis', 'Presenting'],
        pdf: '/pdfs/evolution_of_flight_presentation.pdf',
    },
    {
        id: 10,
        title: 'Rocket Analysis',
        category: 'PLTW Aerospace',
        date: '2025-2-11',
        image: 'photos/rocket_launch.jpg',
        description: 'This project analyzed and compared rocket engine performance using simulations, thrust tests, and real launches to find the best engine for a small-scale launch.<br>',
        longDescription: 'The goal was to determine the ideal rocket engine for a constrained launch area by comparing thrust data, running OpenRocket simulations, and analyzing real-world performance. We tested multiple engines with a force sensor and matched simulation results to launch conditions, ultimately selecting the A8 engine for its lower thrust and safer range. I learned how simulation data and physical testing complement each other, and how even small differences, like wind resistance, can shift real outcomes from predicted ones.',
        technologies: ['OpenRocket', 'Thrust Analysis', 'Data Collection'],
        pdf: '/pdfs/rocket_analysis.pdf',
    },
    {
        id: 11,
        title: 'Spacecraft Propulsion',
        category: 'PLTW Aerospace',
        date: '2025-2-19',
        image: 'photos/reaction_wheels.jpg',
        description: 'This project explores how reaction wheels allow spacecraft to control their orientation using angular momentum rather than traditional fuel-based propulsion.<br>',
        longDescription: 'The objective was to understand and explain how reaction wheels function and why they\'re crucial for fuel-efficient spacecraft attitude control. We researched their components, energy systems, and use cases, then analyzed how they apply Newton\'s Third Law to reorient a spacecraft without expelling mass. I learned how elegant and efficient non-thrust-based systems can be, especially in long-duration missions where conserving fuel is critical.',
        technologies: ['Spacecraft Dynamics', 'Mechanical Principles'],
        pdf: '/pdfs/spacecraft_propulsion.pdf',
    },
    {
        id: 12,
        title: 'Microgravity Presentation',
        category: 'PLTW Aerospace',
        date: '2025-3-12',
        image: 'photos/microgravity.png',
        description: 'This project explored how microgravity affects human vision, particularly the visual system\'s function and recovery during and after space travel.<br>',
        longDescription: 'The objective was to investigate the effects of microgravity on the human visual system and understand how astronauts prepare for and recover from these changes. We researched fluid shifts in space, the impact on intraocular pressure and vision, and current countermeasures like vision training and pressure devices. I learned how spaceflight poses unique biomedical challenges and how critical vision health is to long-term human space exploration.',
        technologies: ['Human Biology', 'Research', 'Presenting'],
        pdf: '/pdfs/microgravity_presentation.pdf',
    },
    {
        id: 13,
        title: 'Airfoil Simulation',
        category: 'PLTW Aerospace',
        date: '2024-9-19',
        image: 'photos/airfoil.png',
        description: 'This project was about comparing airfoil simulations to study how shape and angle of attack affect aerodynamic performance.<br>',
        longDescription: 'The objective was to understand how airfoil shape and angle of attack influence lift and drag. I simulated multiple airfoil setups, changing the angle of attack and recording Cl and Cd values. It showed me how critical small design changes are in optimizing aerodynamic performance.',
        technologies: ['Aerodynamics', 'Simulation Analysis'],
        pdf: '/pdfs/airfoil_simulation.pdf',
    },
    {
        id: 14,
        title: 'Traffic Light State Machine',
        category: 'Digital Electronics',
        date: '2025-05-02',
        image: 'photos/state_machine.png',
        description: 'I built a traffic light state machine using flip-flops, logic gates, and preemption control to simulate real-world traffic signal behavior.<br>',
        longDescription: 'This project involved designing and simulating a three-state traffic light controller in Multisim using D flip-flops, combinational logic, and preemption override functionality. The system cycles through green, yellow, and red lights using a finite state machine (FSM) that updates on clock pulses. I wrote Boolean equations for state transitions and outputs, implemented logic gates to match those equations, and added a traffic preemption input that forces the light to turn green—just like emergency vehicles do in the real world. Initially, I encountered issues where the FSM cycled in reverse, but I fixed this by adjusting my Da and Db logic. I learned how to debug timing-dependent logic systems, build clock-driven FSMs, and map real-world behavior into digital design. If I were to improve the project, I would focus on enhancing the clarity and modularity of the FSM logic for easier expansion and consider integrating visual indicators or timers to simulate pedestrian signals for a more comprehensive real-world model.',
        technologies: ['Multisim', 'FSM Design', 'Logic Gates'],
        pdf: '/pdfs/traffic_light_state_machine.pdf',
    },
    {
        id: 15,
        title: 'Samsung Field Trip',
        category: 'Digital Electronics',
        date: '2024-12-20',
        image: 'photos/samsung.jpg',
        description: 'I practiced phone disassembly and reassembly while observing real repair techniques like glass removal at a Samsung center.<br>',
        longDescription: 'At the Samsung repair learning center, I got hands-on experience taking apart and reassembling smartphones while observing professionals perform more advanced repairs like screen glass removal. This gave me a closer look at internal phone components and helped me understand the precision and care involved in tech hardware servicing. If I were to expand on this experience, I would take more time to practice delicate procedures such as adhesive removal and reapplication, and work on improving my familiarity with different smartphone models to build versatility in repair techniques. This experience taught me the importance of patience, attention to detail, and steady hands in professional hardware servicing.',
        technologies: ['Phone Repair', 'Component Handling'],
        pdf: '/pdfs/samsung.pdf',
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

// Get URL parameters
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        sort: params.get('sort') || 'dateDesc',
        category: params.get('category') || 'all'
    };
}

// Update URL with current parameters
function updateUrl(sort, category) {
    const params = new URLSearchParams();
    if (sort !== 'dateDesc') params.set('sort', sort);
    if (category !== 'all') params.set('category', category);
    
    const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
    window.history.pushState({ sort, category }, '', newUrl);
}

// Render projects
function renderProjects(sortType = 'dateDesc', categoryFilter = 'all') {
    const projectGrid = document.querySelector('.project-grid');
    projectGrid.innerHTML = '';
    
    let filteredProjects = [...projects];
    
    // Apply category filter
    if (categoryFilter !== 'all') {
        filteredProjects = filteredProjects.filter(project => project.category === categoryFilter);
    }
    
    // Apply sorting
    const sortedProjects = filteredProjects.sort(sortFunctions[sortType]);

    // Update URL with current parameters
    updateUrl(sortType, categoryFilter);

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
    const isMobile = window.innerWidth <= 480;
    
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
            <div class="modal-links">
                ${project.pdf ? `
                    <button class="modal-link" onclick="showPDF('${project.pdf}')">
                        <i class="fas fa-file-pdf"></i> View PDF
                    </button>
                ` : ''}
                ${project.demo ? `<a href="${project.demo}" target="_blank" class="modal-link"><i class="fas fa-video"></i> Video Demo</a>` : ''}
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    
    // Add a small delay to ensure the display change is processed before adding the active class
    setTimeout(() => {
        modal.classList.add('active');
        
        // On mobile, prevent body scrolling when modal is open
        if (isMobile) {
            document.body.style.overflow = 'hidden';
        }
    }, 10);

    const closeButton = modalBody.querySelector('.close-modal');
    closeButton.addEventListener('click', closeModal);
}

// Show PDF in new tab
function showPDF(pdfUrl) {
    window.open(pdfUrl, '_blank');
}

// Close modal
function closeModal() {
    const modal = document.getElementById('project-modal');
    modal.classList.remove('active');
    
    // Re-enable body scrolling on mobile
    if (window.innerWidth <= 480) {
        document.body.style.overflow = '';
    }
    
    setTimeout(() => modal.style.display = 'none', 300);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Get initial parameters from URL
    const { sort, category } = getUrlParams();
    let currentSort = sort;
    let currentCategory = category;
    
    renderProjects(currentSort, currentCategory);
    
    // Setup sort controls
    const sortControls = document.querySelector('.sort-controls');
    const sortButtons = sortControls.querySelectorAll('.sort-button');
    const categoryButton = document.querySelector('.category-button');
    const categoryFilter = document.querySelector('.category-filter');
    const categoryOptions = document.querySelectorAll('.category-option');

    // Toggle category dropdown
    categoryButton.addEventListener('click', (e) => {
        e.stopPropagation();
        categoryFilter.classList.toggle('active');
    });

    // Set initial active states based on URL parameters
    sortButtons.forEach(button => {
        if (button.dataset.sort === currentSort) {
            button.classList.add('active');
        }
    });

    categoryOptions.forEach(option => {
        if (option.dataset.category === currentCategory) {
            option.classList.add('active');
            categoryButton.innerHTML = currentCategory === 'all' ? 
                'Category <i class="fas fa-chevron-down"></i>' : 
                `${currentCategory} <i class="fas fa-chevron-down"></i>`;
        }
    });

    // Handle sort button clicks
    sortButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sortType = button.dataset.sort;
            currentSort = sortType;
            
            // Update active state
            sortButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            renderProjects(currentSort, currentCategory);
        });
    });

    // Handle category selection
    categoryOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const category = option.dataset.category;
            currentCategory = category;
            
            // Update active state
            categoryOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            // Update button text
            categoryButton.innerHTML = category === 'all' ? 
                'Category <i class="fas fa-chevron-down"></i>' : 
                `${category} <i class="fas fa-chevron-down"></i>`;
            
            renderProjects(currentSort, currentCategory);
            categoryFilter.classList.remove('active');
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        categoryFilter.classList.remove('active');
    });

    // Handle window resize for modal
    window.addEventListener('resize', () => {
        const modal = document.getElementById('project-modal');
        if (modal.style.display === 'block') {
            // If modal is open, update body overflow based on current width
            if (window.innerWidth <= 480) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
    });

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