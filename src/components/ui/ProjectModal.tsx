'use client'

import React, { useEffect, useState } from 'react'
import styles from './ProjectModal.module.css'
import { Button } from './Button'
import { Badge } from './Badge'

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

interface ProjectModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Prepare all images (primary + additional)
  const allImages = project ? [project.image, ...(project.images || [])].filter(Boolean) : []
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

  // Reset image index when project changes
  useEffect(() => {
    setCurrentImageIndex(0)
  }, [project])

  // Navigate to previous image
  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  // Navigate to next image
  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
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
      className={`${styles.modal} ${isOpen ? styles.active : ''}`}
      onClick={handleBackdropClick}
    >
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderContent}>
            <div className={styles.modalMeta}>
              <Badge variant="secondary">{project.category}</Badge>
              <div className={styles.modalDate}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>{formatDate(project.date)}</span>
              </div>
            </div>
            <h2 className={styles.modalTitle}>{project.title}</h2>
            <p className={styles.modalSubtitle}>{project.description}</p>
          </div>
          <button className={styles.modalClose} aria-label="Close modal" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className={styles.modalBody}>
          {allImages.length > 0 && (
            <div className={styles.modalImageGallery}>
              {hasMultipleImages && (
                <button className={`${styles.galleryNav} ${styles.galleryPrev}`} aria-label="Previous image" onClick={handlePrevImage}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
              )}
              <div className={styles.galleryImages}>
                {allImages.map((img, index) => (
                  <img
                    key={index}
                    src={img as string}
                    alt={`${project.title} - Image ${index + 1}`}
                    className={`${styles.modalImage} ${index === currentImageIndex ? styles.active : ''}`}
                    data-index={index}
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                ))}
              </div>
              {hasMultipleImages && (
                <>
                  <button className={`${styles.galleryNav} ${styles.galleryNext}`} aria-label="Next image" onClick={handleNextImage}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                  <div className={styles.galleryIndicators}>
                    {allImages.map((_, index) => (
                      <span
                        key={index}
                        className={`${styles.galleryDot} ${index === currentImageIndex ? styles.active : ''}`}
                        data-index={index}
                        onClick={handleDotClick(index)}
                      ></span>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {(project.pdf || project.demo) && (
            <div className={styles.modalActions}>
              {project.pdf && (
                <Button
                  variant="primary"
                  href={project.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  leftIcon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="23 7 16 12 23 17 23 7"></polygon>
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                    </svg>
                  }
                >
                  Live Demo
                </Button>
              )}
            </div>
          )}

          <div className={styles.modalDivider}></div>

          {(project.overview || project.longDescription) && (
            <div className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>Overview</h3>
              <p className={styles.modalDescription} dangerouslySetInnerHTML={{ __html: project.overview || project.longDescription || '' }}></p>
            </div>
          )}

          {project.technologies && project.technologies.length > 0 && (
            <div className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                  <line x1="7" y1="7" x2="7.01" y2="7"></line>
                </svg>
                Technologies Used
              </h3>
              <div className={styles.techTags}>
                {project.technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {project.challenges && (
            <div className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>Challenges & Solutions</h3>
              {Array.isArray(project.challenges) ? (
                <ul className={styles.modalDescription}>
                  {project.challenges.map((challenge, index) => (
                    <li key={index}>{challenge}</li>
                  ))}
                </ul>
              ) : (
                <p className={styles.modalDescription}>{project.challenges}</p>
              )}
            </div>
          )}

          {project.outcomes && (
            <div className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>Outcomes & Impact</h3>
              {Array.isArray(project.outcomes) ? (
                <ul className={styles.modalDescription}>
                  {project.outcomes.map((outcome, index) => (
                    <li key={index}>{outcome}</li>
                  ))}
                </ul>
              ) : (
                <p className={styles.modalDescription}>{project.outcomes}</p>
              )}
            </div>
          )}

          {project.tags && project.tags.length > 0 && (
            <div className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>Tags</h3>
              <div className={styles.techTags}>
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
