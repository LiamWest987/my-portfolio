'use client'

import { useState, useEffect, useMemo } from 'react'
import { fetchProjects } from '@/lib/sanity/client'
import { Section, Container, PageHeader, SearchInput, Dropdown, ControlsBar, ResultsInfo, ProjectGrid, Button, ProjectCard, Dialog, DialogContent, DialogHeader, DialogTitle, Skeleton, Badge } from '@/components/ui'

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
  }

  const closeModal = () => {
    setSelectedProject(null)
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
                <>
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <Skeleton key={i} className="h-96 w-full" />
                  ))}
                </>
              ) : filteredProjects.length > 0 ? (
                filteredProjects.map(project => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    onClick={() => handleProjectClick(project)}
                  />
                ))
              ) : (
                <p className="text-muted-foreground text-center col-span-full">
                  No projects found matching your criteria.
                </p>
              )}
            </ProjectGrid>
          </Container>
        </Section>
      </main>

      {/* Project Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={(open) => !open && closeModal()}>
        {selectedProject && (
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <Badge variant="outline" className="w-fit mb-2">
                {selectedProject.category}
              </Badge>
              <DialogTitle className="text-3xl">{selectedProject.title}</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {selectedProject.images &&
                Array.isArray(selectedProject.images) &&
                selectedProject.images.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedProject.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`${selectedProject.title} ${index + 1}`}
                        className="rounded-lg w-full object-cover"
                      />
                    ))}
                  </div>
                )}

              {selectedProject.overview && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">Overview</h3>
                  <p className="text-muted-foreground">{selectedProject.overview}</p>
                </div>
              )}

              {selectedProject.longDescription && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{selectedProject.longDescription}</p>
                </div>
              )}

              {selectedProject.technologies &&
                Array.isArray(selectedProject.technologies) &&
                selectedProject.technologies.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech, index) => (
                        <Badge key={index} variant="outline">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

              {selectedProject.challenges &&
                Array.isArray(selectedProject.challenges) &&
                selectedProject.challenges.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Challenges</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {selectedProject.challenges.map((challenge, index) => (
                        <li key={index}>{challenge}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {selectedProject.outcomes &&
                Array.isArray(selectedProject.outcomes) &&
                selectedProject.outcomes.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Outcomes</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {selectedProject.outcomes.map((outcome, index) => (
                        <li key={index}>{outcome}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {(selectedProject.pdf || selectedProject.demo) && (
                <div className="flex gap-3 pt-4">
                  {selectedProject.pdf && (
                    <Button href={selectedProject.pdf} variant="primary" download>
                      Download PDF
                    </Button>
                  )}
                  {selectedProject.demo && (
                    <Button
                      href={selectedProject.demo}
                      variant="outline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Demo
                    </Button>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}
