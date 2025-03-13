// Project data
const projects = [
    {
        id: 1,
        title: 'E-commerce Platform',
        category: 'Web Development',
        date: '2024-03-15',
        image: 'https://picsum.photos/800/600',
        description: 'A modern e-commerce platform built with cutting-edge web technologies. Features include real-time inventory management, secure payment processing, and an intuitive admin dashboard.',
        longDescription: 'This comprehensive e-commerce solution provides businesses with everything they need to succeed in the digital marketplace. The platform includes advanced features such as real-time inventory tracking, secure payment processing through Stripe, detailed analytics, and a powerful admin dashboard for managing products, orders, and customer relationships.',
        technologies: ['JavaScript', 'Node.js', 'MongoDB', 'React'],
        github: 'https://github.com/username/ecommerce',
        demo: 'https://demo-ecommerce.com'
    },
    {
        id: 2,
        title: 'Virtual Reality Training Simulator',
        category: 'VR',
        date: '2024-02-20',
        image: 'https://picsum.photos/800/601',
        description: 'An immersive VR training simulator for industrial safety procedures. Includes realistic physics and interactive scenarios.',
        longDescription: 'This VR training simulator revolutionizes industrial safety training by providing immersive, hands-on experience without real-world risks. Users can practice complex procedures in a safe environment with realistic physics and immediate feedback. The system includes progress tracking and performance analytics.',
        technologies: ['Unity', 'C#', 'VR', 'Oculus SDK'],
        github: 'https://github.com/username/vr-simulator',
        demo: 'https://vr-simulator-demo.com'
    },
    {
        id: 3,
        title: 'AI-Powered Analytics Dashboard',
        category: 'Engineering',
        date: '2024-01-10',
        image: 'https://picsum.photos/800/602',
        description: 'A sophisticated analytics dashboard utilizing machine learning for predictive insights and data visualization.',
        longDescription: 'This advanced analytics platform leverages artificial intelligence to provide predictive insights and beautiful data visualizations. Features include customizable dashboards, real-time data processing, and automated reporting systems. The platform helps businesses make data-driven decisions with confidence.',
        technologies: ['Python', 'TensorFlow', 'React', 'D3.js'],
        github: 'https://github.com/username/analytics',
        demo: 'https://analytics-demo.com'
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
                <a href="${project.github}" target="_blank" class="modal-link">
                    <i class="fab fa-github"></i> View on GitHub
                </a>
                <a href="${project.demo}" target="_blank" class="modal-link">
                    <i class="fas fa-external-link-alt"></i> Live Demo
                </a>
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