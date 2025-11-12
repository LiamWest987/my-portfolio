'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '../molecules/Button'
import { Badge } from '../molecules/Badge'
import { cn } from '@/lib/utils'

/**
 * Project data interface for modal display.
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
 * Props for the ProjectModal component.
 */
interface ProjectModalProps {
  /** Project data to display (null when closed) */
  project: Project | null
  /** Whether the modal is currently open */
  isOpen: boolean
  /** Callback fired when modal should close */
  onClose: () => void
}

/**
 * ProjectModal component displays detailed project information in a modal dialog.
 * Features image carousel, action buttons, and comprehensive project details.
 *
 * @param props - Component props
 * @param props.project - Project data to display (null when closed)
 * @param props.isOpen - Whether the modal is currently open
 * @param props.onClose - Callback fired when modal should close
 * @returns A full-screen modal with project details
 *
 * @example
 * ```tsx
 * const [selectedProject, setSelectedProject] = useState<Project | null>(null)
 *
 * <ProjectModal
 *   project={selectedProject}
 *   isOpen={selectedProject !== null}
 *   onClose={() => setSelectedProject(null)}
 * />
 * ```
 *
 * @remarks
 * Accessibility features:
 * - Escape key closes modal
 * - Focus trap keeps keyboard navigation within modal
 * - Body scroll locked when open
 * - Proper ARIA attributes (role="dialog", aria-modal, aria-labelledby)
 *
 * Interactive features:
 * - Image carousel with prev/next navigation
 * - Dot indicators for image position
 * - Click outside to close
 * - Smooth fade-in/scale animations
 * - Custom scrollbar styling
 *
 * Content sections:
 * - Project metadata (category, date)
 * - Title and description
 * - Image carousel
 * - Action buttons (PDF, demo)
 * - Overview/long description
 * - Technologies used
 * - Challenges and solutions
 * - Outcomes and impact
 * - Tags
 */
export const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Prepare all images (combine primary image with additional images)
  const allImages = project
    ? [
        ...(project.image ? [project.image] : []),
        ...(project.images && Array.isArray(project.images) ? project.images : []),
      ].filter((img, index, arr) => img && arr.indexOf(img) === index) // Remove duplicates
    : []
  const hasMultipleImages = allImages.length > 1

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  // Focus trap and management
  useEffect(() => {
    if (!isOpen) return

    const modal = document.querySelector('[role="dialog"]')
    if (!modal) return

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    // Store previously focused element
    const previouslyFocused = document.activeElement as HTMLElement

    // Focus first element
    firstElement?.focus()

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault()
        lastElement?.focus()
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault()
        firstElement?.focus()
      }
    }

    document.addEventListener('keydown', handleTabKey)

    return () => {
      document.removeEventListener('keydown', handleTabKey)
      // Restore focus on close
      previouslyFocused?.focus()
    }
  }, [isOpen])

  // Reset image index when project changes
  useEffect(() => {
    setCurrentImageIndex(0)
  }, [project])

  // Navigate to previous image
  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex(prev => (prev - 1 + allImages.length) % allImages.length)
  }

  // Navigate to next image
  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex(prev => (prev + 1) % allImages.length)
  }

  // Navigate to specific image
  const handleDotClick = (index: number) => (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex(index)
  }

  // Click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!project) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-[1040] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-all duration-300',
        isOpen ? 'visible opacity-100' : 'invisible opacity-0'
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={handleBackdropClick}
    >
      <div
        className={cn(
          'flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-card shadow-2xl transition-all duration-300',
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        )}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div className="flex-1">
            <h2 id="modal-title" className="text-3xl font-bold leading-tight text-card-foreground">
              {project.title}
            </h2>
            <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
              <Badge variant="secondary">{project.category}</Badge>
              <div className="flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>{formatDate(project.date)}</span>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {project.description}
            </p>
          </div>
          <button
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border-none bg-transparent text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
            aria-label="Close modal"
            onClick={onClose}
          >
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
              aria-hidden="true"
              focusable="false"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 [&::-webkit-scrollbar-thumb:hover]:bg-foreground [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-secondary [&::-webkit-scrollbar]:w-2">
          {allImages.length > 0 && (
            <div className="border-muted-foreground/20 bg-muted/30 relative mb-6 w-full rounded-lg border-2 p-2">
              {hasMultipleImages && (
                <button
                  className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-none bg-black/60 text-white opacity-70 backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/80 hover:opacity-100"
                  aria-label="Previous image"
                  onClick={handlePrevImage}
                >
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
                    aria-hidden="true"
                    focusable="false"
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
              )}
              <div className="bg-background/50 relative aspect-video w-full overflow-hidden rounded-md">
                {allImages.map((img, index) => (
                  <img
                    key={index}
                    src={img as string}
                    alt={`${project.title} - Screenshot ${index + 1} of ${allImages.length}`}
                    className={cn(
                      'absolute left-0 top-0 h-full w-full rounded-md object-contain transition-opacity duration-300',
                      index === currentImageIndex
                        ? 'pointer-events-auto opacity-100'
                        : 'pointer-events-none opacity-0'
                    )}
                    data-index={index}
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                ))}
              </div>
              {hasMultipleImages && (
                <>
                  <button
                    className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-none bg-black/60 text-white opacity-70 backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/80 hover:opacity-100"
                    aria-label="Next image"
                    onClick={handleNextImage}
                  >
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
                      aria-hidden="true"
                      focusable="false"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                  <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                    {allImages.map((_, index) => (
                      <button
                        key={index}
                        className={cn(
                          'h-2 rounded-full bg-white/50 transition-all hover:bg-white/80',
                          index === currentImageIndex ? 'w-6 bg-white' : 'w-2'
                        )}
                        data-index={index}
                        onClick={handleDotClick(index)}
                        aria-label={`View image ${index + 1} of ${allImages.length}`}
                        aria-current={index === currentImageIndex ? 'true' : undefined}
                        type="button"
                      >
                        <span className="sr-only">Image {index + 1}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {(project.pdf || project.demo) && (
            <div className="mb-6 flex flex-wrap gap-4">
              {project.pdf && (
                <Button
                  variant="primary"
                  href={project.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  leftIcon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  }
                >
                  View PDF
                </Button>
              )}
              {project.demo && (
                <Button
                  variant="outline"
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  leftIcon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <polygon points="23 7 16 12 23 17 23 7" />
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                  }
                >
                  Live Demo
                </Button>
              )}
            </div>
          )}

          <div className="my-6 h-px bg-border" />

          {(project.overview || project.longDescription) && (
            <div className="mb-6">
              <h3 className="mb-4 text-lg font-semibold text-card-foreground">Overview</h3>
              <p
                className="m-0 text-base leading-relaxed text-muted-foreground"
                dangerouslySetInnerHTML={{
                  __html: project.overview || project.longDescription || '',
                }}
              />
            </div>
          )}

          {project.technologies && project.technologies.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-card-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {project.challenges &&
            (Array.isArray(project.challenges) ? project.challenges.length > 0 : true) && (
              <div className="mb-6">
                <h3 className="mb-4 text-lg font-semibold text-card-foreground">
                  Challenges & Solutions
                </h3>
                {Array.isArray(project.challenges) ? (
                  <ul className="m-0 text-base leading-relaxed text-muted-foreground">
                    {project.challenges.map((challenge, index) => (
                      <li key={index}>{challenge}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="m-0 text-base leading-relaxed text-muted-foreground">
                    {project.challenges}
                  </p>
                )}
              </div>
            )}

          {project.outcomes &&
            (Array.isArray(project.outcomes) ? project.outcomes.length > 0 : true) && (
              <div className="mb-6">
                <h3 className="mb-4 text-lg font-semibold text-card-foreground">
                  Outcomes & Impact
                </h3>
                {Array.isArray(project.outcomes) ? (
                  <ul className="m-0 text-base leading-relaxed text-muted-foreground">
                    {project.outcomes.map((outcome, index) => (
                      <li key={index}>{outcome}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="m-0 text-base leading-relaxed text-muted-foreground">
                    {project.outcomes}
                  </p>
                )}
              </div>
            )}

          {project.tags && project.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-4 text-lg font-semibold text-card-foreground">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
