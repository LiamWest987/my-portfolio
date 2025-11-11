import React from 'react'
import { Card, CardContent } from '@/components/ui/card'

/**
 * Project data interface used throughout the application.
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
 * Props for the ProjectCard component.
 */
interface ProjectCardProps {
  /** Project data to display */
  project: Project
  /** Optional callback fired when card is clicked */
  onClick?: () => void
}

/**
 * ProjectCard component displays a project summary with image, title, and technologies.
 * Interactive card with hover effects and keyboard support.
 *
 * @param props - Component props
 * @param props.project - Project data to display
 * @param props.onClick - Optional callback fired when card is clicked
 * @returns An interactive project card with image and details
 *
 * @example
 * ```tsx
 * <ProjectCard
 *   project={projectData}
 *   onClick={() => setSelectedProject(projectData)}
 * />
 * ```
 *
 * @remarks
 * - Fully keyboard accessible with Enter and Space key support
 * - Displays up to 3 technology badges
 * - Hover effects include image scale and border color change
 * - Image includes descriptive alt text for accessibility
 */
export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <Card
      data-testid="project-card"
      className="group flex h-full flex-col overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:shadow-xl"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${project.title} project`}
    >
      {project.image && (
        <div className="relative aspect-video overflow-hidden bg-muted">
          <img
            src={project.image}
            alt={project.image ? `${project.title} project screenshot showing the main interface` : ''}
            aria-hidden={!project.image ? "true" : undefined}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <CardContent className="flex flex-1 flex-col p-6 pt-6">
        <div className="mb-2 inline-block text-xs font-medium uppercase tracking-wider text-accent">
          {project.category}
        </div>
        <h3 className="mb-2 text-lg font-semibold leading-snug text-card-foreground transition-colors duration-200 group-hover:text-accent">
          {project.title}
        </h3>
        <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>
        {project.technologies && project.technologies.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-2">
            {project.technologies.slice(0, 3).map((tech, index) => (
              <span
                key={index}
                className="inline-flex items-center whitespace-nowrap rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground transition-all duration-200"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ProjectCard
