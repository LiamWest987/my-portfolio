import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  description?: string
  className?: string
}

/**
 * SectionHeader Component
 *
 * Consistent header pattern for page sections with title and optional description.
 * Used throughout the site to maintain visual consistency.
 */
export function SectionHeader({ title, description, className }: SectionHeaderProps) {
  return (
    <div className={cn('text-center mb-12', className)}>
      <h2 className="text-4xl font-bold mb-4">{title}</h2>
      {description && (
        <p className="text-muted-foreground max-w-2xl mx-auto">{description}</p>
      )}
    </div>
  )
}
