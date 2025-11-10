import React from 'react'
import styles from './ProjectCard.module.css'

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

interface ProjectCardProps {
  project: Project
  onClick?: () => void
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <div className={styles.projectCard} onClick={onClick}>
      {project.image && (
        <div className={styles.projectImage}>
          <img src={project.image} alt={project.title} />
        </div>
      )}
      <div className={styles.projectContent}>
        <div className={styles.projectCategory}>{project.category}</div>
        <h3 className={styles.projectTitle}>{project.title}</h3>
        <p className={styles.projectDescription}>{project.description}</p>
        {project.technologies && project.technologies.length > 0 && (
          <div className={styles.projectTags}>
            {project.technologies.slice(0, 3).map((tech, index) => (
              <span key={index} className={styles.tag}>
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectCard
