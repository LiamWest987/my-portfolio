'use client'

import { useState, useEffect, useMemo } from 'react'
import { fetchProjects } from '@/lib/sanity/client'
import { Section, Container, PageHeader, SearchInput, Dropdown, ControlsBar, ResultsInfo, ProjectGrid, Button } from '@/components/ui/'

interface Project {
  _id: string
  title: string
  category: string
  date: string
  featured?: boolean
  image?: string
  images?: string[]
  description: string
  longDescription?: string
  overview?: string
  technologies?: string[]
  challenges?: string[]
  outcomes?: string[]
  tags?: string[]
  pdf?: string | null
  demo?: string
}

type SortOption = 'dateDesc' | 'dateAsc' | 'nameAsc' | 'nameDesc'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOption>('dateDesc')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await fetchProjects()
        setProjects(data)
      } catch (error) {
        console.error('Error loading projects:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProjects()
  }, [])

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(projects.map((p) => p.category))
    return Array.from(cats).sort()
  }, [projects])

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = projects

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((project) => {
        return (
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.category.toLowerCase().includes(query) ||
          project.tags?.some((tag) => tag.toLowerCase().includes(query)) ||
          project.technologies?.some((tech) => tech.toLowerCase().includes(query))
        )
      })
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((project) => project.category === selectedCategory)
    }

    // Sort projects
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'dateDesc':
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case 'dateAsc':
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case 'nameAsc':
          return a.title.localeCompare(b.title)
        case 'nameDesc':
          return b.title.localeCompare(a.title)
        default:
          return 0
      }
    })

    return sorted
  }, [projects, searchQuery, selectedCategory, sortBy])

  const getCategoryLabel = () => {
    if (selectedCategory === 'all') return 'All Categories'
    return selectedCategory
  }

  const getSortLabel = () => {
    switch (sortBy) {
      case 'dateDesc':
        return 'Newest First'
      case 'dateAsc':
        return 'Oldest First'
      case 'nameAsc':
        return 'Name A-Z'
      case 'nameDesc':
        return 'Name Z-A'
      default:
        return 'Newest First'
    }
  }

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setSelectedProject(null)
    document.body.style.overflow = 'auto'
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isCategoryDropdownOpen || isSortDropdownOpen) {
        const target = e.target as HTMLElement
        if (!target.closest('.dropdown')) {
          setIsCategoryDropdownOpen(false)
          setIsSortDropdownOpen(false)
        }
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isCategoryDropdownOpen, isSortDropdownOpen])

  return (
    <>
      {/* Background Animation */}
      <div className="background-animation">
        <div className="background-gradient"></div>
        <div className="gradient-orb gradient-orb-1"></div>
        <div className="gradient-orb gradient-orb-2"></div>
        <div className="gradient-orb gradient-orb-3"></div>
        <div className="grid-pattern"></div>
        <div className="dot-pattern"></div>
      </div>

      <main>
        <Section>
          <Container>
            {/* Page Header */}
            <PageHeader
              title="All Projects"
              description={
                <>
                  Explore my portfolio of <span id="project-count">{projects.length}</span> product management and
                  industrial engineering initiatives
                </>
              }
            />

            {/* Controls Bar */}
            <ControlsBar>
              {/* Search Input */}
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search projects, tags, or technologies..."
              />

              {/* Filter and Sort Controls */}
              <div className="filter-controls">
                {/* Category Dropdown */}
                <Dropdown
                  label={getCategoryLabel()}
                  isOpen={isCategoryDropdownOpen}
                  onToggle={() => {
                    setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                    setIsSortDropdownOpen(false)
                  }}
                  className="category-filter"
                  buttonClassName="category-button"
                  contentClassName="category-dropdown"
                >
                  <button
                    className={`dropdown-item ${selectedCategory === 'all' ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedCategory('all')
                      setIsCategoryDropdownOpen(false)
                    }}
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`dropdown-item ${selectedCategory === category ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedCategory(category)
                        setIsCategoryDropdownOpen(false)
                      }}
                    >
                      {category}
                    </button>
                  ))}
                </Dropdown>

                {/* Sort Dropdown */}
                <Dropdown
                  label={getSortLabel()}
                  isOpen={isSortDropdownOpen}
                  onToggle={() => {
                    setIsSortDropdownOpen(!isSortDropdownOpen)
                    setIsCategoryDropdownOpen(false)
                  }}
                  className="sort-filter"
                  buttonClassName="sort-button"
                  contentClassName="sort-dropdown"
                  showSortIcon={true}
                >
                  <button
                    className={`dropdown-item ${sortBy === 'dateDesc' ? 'active' : ''}`}
                    onClick={() => {
                      setSortBy('dateDesc')
                      setIsSortDropdownOpen(false)
                    }}
                  >
                    Newest First
                  </button>
                  <button
                    className={`dropdown-item ${sortBy === 'dateAsc' ? 'active' : ''}`}
                    onClick={() => {
                      setSortBy('dateAsc')
                      setIsSortDropdownOpen(false)
                    }}
                  >
                    Oldest First
                  </button>
                  <button
                    className={`dropdown-item ${sortBy === 'nameAsc' ? 'active' : ''}`}
                    onClick={() => {
                      setSortBy('nameAsc')
                      setIsSortDropdownOpen(false)
                    }}
                  >
                    Name A-Z
                  </button>
                  <button
                    className={`dropdown-item ${sortBy === 'nameDesc' ? 'active' : ''}`}
                    onClick={() => {
                      setSortBy('nameDesc')
                      setIsSortDropdownOpen(false)
                    }}
                  >
                    Name Z-A
                  </button>
                </Dropdown>
              </div>
            </ControlsBar>

            {/* Results Count */}
            <ResultsInfo currentCount={filteredProjects.length} totalCount={projects.length} />

            {/* Project Grid */}
            <ProjectGrid>
              {loading ? (
                <p className="text-muted" style={{ textAlign: 'center', gridColumn: '1 / -1' }}>
                  Loading projects...
                </p>
              ) : filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <div
                    key={project._id}
                    className="project-card"
                    onClick={() => handleProjectClick(project)}
                    style={{ cursor: 'pointer' }}
                  >
                    {project.image && (
                      <div className="project-image">
                        <img src={project.image} alt={project.title} />
                      </div>
                    )}
                    <div className="project-content">
                      <div className="project-category">{project.category}</div>
                      <h3 className="project-title">{project.title}</h3>
                      <p className="project-description">{project.description}</p>
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="project-tags">
                          {project.technologies.slice(0, 3).map((tech, index) => (
                            <span key={index} className="tag">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted" style={{ textAlign: 'center', gridColumn: '1 / -1' }}>
                  No projects found matching your criteria.
                </p>
              )}
            </ProjectGrid>
          </Container>
        </Section>
      </main>

      {/* Project Modal */}
      {selectedProject && (
        <div
          id="project-modal"
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal()
          }}
        >
          <div className="modal-container">
            <button className="modal-close" onClick={closeModal} aria-label="Close modal">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="modal-header">
              <div className="modal-category">{selectedProject.category}</div>
              <h2 className="modal-title">{selectedProject.title}</h2>
            </div>

            <div className="modal-body">
              {selectedProject.images && Array.isArray(selectedProject.images) && selectedProject.images.length > 0 && (
                <div className="modal-gallery">
                  {selectedProject.images.map((img, index) => (
                    <img key={index} src={img} alt={`${selectedProject.title} ${index + 1}`} />
                  ))}
                </div>
              )}

              {selectedProject.overview && (
                <div className="modal-section">
                  <h3 className="modal-section-title">Overview</h3>
                  <p className="modal-section-content">{selectedProject.overview}</p>
                </div>
              )}

              {selectedProject.longDescription && (
                <div className="modal-section">
                  <h3 className="modal-section-title">Description</h3>
                  <p className="modal-section-content">{selectedProject.longDescription}</p>
                </div>
              )}

              {selectedProject.technologies && Array.isArray(selectedProject.technologies) && selectedProject.technologies.length > 0 && (
                <div className="modal-section">
                  <h3 className="modal-section-title">Technologies</h3>
                  <div className="modal-tags">
                    {selectedProject.technologies.map((tech, index) => (
                      <span key={index} className="tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedProject.challenges && Array.isArray(selectedProject.challenges) && selectedProject.challenges.length > 0 && (
                <div className="modal-section">
                  <h3 className="modal-section-title">Challenges</h3>
                  <ul className="modal-list">
                    {selectedProject.challenges.map((challenge, index) => (
                      <li key={index}>{challenge}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedProject.outcomes && Array.isArray(selectedProject.outcomes) && selectedProject.outcomes.length > 0 && (
                <div className="modal-section">
                  <h3 className="modal-section-title">Outcomes</h3>
                  <ul className="modal-list">
                    {selectedProject.outcomes.map((outcome, index) => (
                      <li key={index}>{outcome}</li>
                    ))}
                  </ul>
                </div>
              )}

              {(selectedProject.pdf || selectedProject.demo) && (
                <div className="modal-actions">
                  {selectedProject.pdf && (
                    <Button href={selectedProject.pdf} variant="primary" download>
                      Download PDF
                    </Button>
                  )}
                  {selectedProject.demo && (
                    <Button href={selectedProject.demo} variant="outline" target="_blank" rel="noopener noreferrer">
                      View Demo
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
