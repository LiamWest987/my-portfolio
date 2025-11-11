import { cn } from '@/lib/utils'

/**
 * Props for the SectionHeader component.
 */
interface SectionHeaderProps {
  /** Main heading text for the section */
  title: string
  /** Optional descriptive text below the title */
  description?: string
  /** Additional CSS classes to apply */
  className?: string
  /** Optional ID for the title element (useful for anchor links) */
  titleId?: string
  /** Render as h1 instead of h2 (use for main page headings) */
  as?: 'h1' | 'h2'
}

/**
 * SectionHeader component provides a consistent heading pattern for page sections.
 * Used throughout the site to maintain visual consistency and spacing.
 *
 * @param props - Component props
 * @param props.title - Main heading text for the section
 * @param props.description - Optional descriptive text below the title
 * @param props.className - Additional CSS classes to apply
 * @param props.titleId - Optional ID for the title element (useful for anchor links)
 * @param props.as - Render as h1 or h2 (defaults to h2)
 * @returns A styled section header with title and optional description
 *
 * @example
 * ```tsx
 * <SectionHeader
 *   title="My Projects"
 *   description="A collection of my work and experiments"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <SectionHeader
 *   title="Skills"
 *   description="Technologies and tools I work with"
 *   titleId="skills-section"
 * />
 * ```
 */
export function SectionHeader({ title, description, className, titleId, as = 'h2' }: SectionHeaderProps) {
  const HeadingTag = as

  return (
    <div className={cn('text-center mb-12', className)}>
      <HeadingTag id={titleId} className="text-4xl font-bold mb-4">{title}</HeadingTag>
      {description && (
        <p className="text-muted-foreground max-w-2xl mx-auto">{description}</p>
      )}
    </div>
  )
}
