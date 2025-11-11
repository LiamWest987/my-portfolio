'use client'

import { useState, useEffect, useMemo } from 'react'
import { fetchProjects } from '@/lib/sanity/client'
import {
  Section,
  Container,
  PageHeader,
  SearchInput,
  Dropdown,
  ControlsBar,
  ResultsInfo,
  ProjectGrid,
  ProjectCard,
  ProjectCardSkeleton,
  ProjectModal,
  BackgroundAnimation,
} from '@/components/ui'
import { cn } from '@/lib/utils'

/**
 * Project data structure from Sanity CMS.
 */
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

/**
 * Available sorting options for the projects list.
 */
type SortOption = 'dateDesc' | 'dateAsc' | 'nameAsc' | 'nameDesc'

/**
 * Projects page component displaying a filterable and sortable portfolio of projects.
 * Features search, category filtering, sorting options, and detailed project modals.
 *
 * @returns JSX element rendering the projects page with filtering, sorting, and project grid
 *
 * @remarks
 * Route: /projects
 *
 * This page includes:
 * - Animated background
 * - Page header with dynamic project count
 * - Controls bar with:
 *   - Search input for filtering by title, description, category, tags, or technologies
 *   - Category dropdown filter for project categories
 *   - Sort dropdown with options: Newest First, Oldest First, Name A-Z, Name Z-A
 * - Results info showing filtered count vs total count
 * - Project grid displaying filtered and sorted projects
 * - Loading skeletons for improved UX during data fetch
 * - Project detail dialog/modal with comprehensive project information:
 *   - Images gallery
 *   - Overview and detailed description
 *   - Technologies used
 *   - Challenges faced
 *   - Outcomes achieved
 *   - PDF download and demo links
 *
 * All projects are fetched from Sanity CMS on component mount.
 * Filtering and sorting are performed client-side using useMemo for performance.
 */
export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOption>('dateDesc')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
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
    const cats = new Set(projects.map(p => p.category))
    return Array.from(cats).sort()
  }, [projects])

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = projects

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(project => {
        return (
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.category.toLowerCase().includes(query) ||
          project.tags?.some(tag => tag.toLowerCase().includes(query)) ||
          project.technologies?.some(tech => tech.toLowerCase().includes(query))
        )
      })
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory)
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
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedProject(null), 300) // Wait for animation
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
      <BackgroundAnimation variant="full" />

      <Section>
        <Container>
          {/* Page Header */}
          <PageHeader
            title="All Projects"
            description={
              <>
                Explore my portfolio of <span id="project-count">{projects.length}</span> product
                management and industrial engineering initiatives
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
            <div className="flex flex-wrap items-center gap-4 max-md:w-full max-md:flex-col max-md:items-stretch">
              {/* Category Dropdown */}
              <Dropdown
                label={getCategoryLabel()}
                isOpen={isCategoryDropdownOpen}
                onToggle={() => {
                  setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                  setIsSortDropdownOpen(false)
                }}
                className="min-w-[200px] shrink-0 max-md:w-full"
                id="category-dropdown-menu"
              >
                <button
                  className={cn(
                    'block w-full border-none bg-transparent px-4 py-3 text-left text-sm text-foreground transition-colors hover:bg-secondary',
                    selectedCategory === 'all' &&
                      'hover:bg-primary/90 bg-primary font-semibold text-primary-foreground'
                  )}
                  onClick={() => {
                    setSelectedCategory('all')
                    setIsCategoryDropdownOpen(false)
                  }}
                  role="menuitem"
                  aria-current={selectedCategory === 'all' ? 'true' : undefined}
                >
                  All Categories
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    className={cn(
                      'block w-full border-none bg-transparent px-4 py-3 text-left text-sm text-foreground transition-colors hover:bg-secondary',
                      selectedCategory === category &&
                        'hover:bg-primary/90 bg-primary font-semibold text-primary-foreground'
                    )}
                    onClick={() => {
                      setSelectedCategory(category)
                      setIsCategoryDropdownOpen(false)
                    }}
                    role="menuitem"
                    aria-current={selectedCategory === category ? 'true' : undefined}
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
                className="min-w-[180px] shrink-0 max-md:w-full"
                showSortIcon={true}
                id="sort-dropdown-menu"
              >
                <button
                  className={cn(
                    'block w-full border-none bg-transparent px-4 py-3 text-left text-sm text-foreground transition-colors hover:bg-secondary',
                    sortBy === 'dateDesc' &&
                      'hover:bg-primary/90 bg-primary font-semibold text-primary-foreground'
                  )}
                  onClick={() => {
                    setSortBy('dateDesc')
                    setIsSortDropdownOpen(false)
                  }}
                  role="menuitem"
                  aria-current={sortBy === 'dateDesc' ? 'true' : undefined}
                >
                  Newest First
                </button>
                <button
                  className={cn(
                    'block w-full border-none bg-transparent px-4 py-3 text-left text-sm text-foreground transition-colors hover:bg-secondary',
                    sortBy === 'dateAsc' &&
                      'hover:bg-primary/90 bg-primary font-semibold text-primary-foreground'
                  )}
                  onClick={() => {
                    setSortBy('dateAsc')
                    setIsSortDropdownOpen(false)
                  }}
                  role="menuitem"
                  aria-current={sortBy === 'dateAsc' ? 'true' : undefined}
                >
                  Oldest First
                </button>
                <button
                  className={cn(
                    'block w-full border-none bg-transparent px-4 py-3 text-left text-sm text-foreground transition-colors hover:bg-secondary',
                    sortBy === 'nameAsc' &&
                      'hover:bg-primary/90 bg-primary font-semibold text-primary-foreground'
                  )}
                  onClick={() => {
                    setSortBy('nameAsc')
                    setIsSortDropdownOpen(false)
                  }}
                  role="menuitem"
                  aria-current={sortBy === 'nameAsc' ? 'true' : undefined}
                >
                  Name A-Z
                </button>
                <button
                  className={cn(
                    'block w-full border-none bg-transparent px-4 py-3 text-left text-sm text-foreground transition-colors hover:bg-secondary',
                    sortBy === 'nameDesc' &&
                      'hover:bg-primary/90 bg-primary font-semibold text-primary-foreground'
                  )}
                  onClick={() => {
                    setSortBy('nameDesc')
                    setIsSortDropdownOpen(false)
                  }}
                  role="menuitem"
                  aria-current={sortBy === 'nameDesc' ? 'true' : undefined}
                >
                  Name Z-A
                </button>
              </Dropdown>
            </div>
          </ControlsBar>

          {/* Results Count */}
          <div role="status" aria-live="polite" aria-atomic="true">
            <ResultsInfo currentCount={filteredProjects.length} totalCount={projects.length} />
          </div>

          {/* Section heading for proper hierarchy (visually hidden) */}
          <h2 className="sr-only">Project Listings</h2>

          {/* Project Grid */}
          <ProjectGrid>
            {loading ? (
              <>
                <span className="sr-only" aria-live="polite" aria-label="Loading projects">
                  Loading projects...
                </span>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <ProjectCardSkeleton key={i} aria-hidden="true" />
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
              <p className="col-span-full text-center text-muted-foreground">
                {projects.length === 0
                  ? 'No projects available yet.'
                  : 'No projects found matching your criteria.'}
              </p>
            )}
          </ProjectGrid>
        </Container>
      </Section>

      {/* Project Modal */}
      <ProjectModal project={selectedProject} isOpen={isModalOpen} onClose={closeModal} />
    </>
  )
}
