import { Skeleton } from '@/components/ui/atoms/skeleton'
import { Card, CardContent } from '@/components/ui/card'

/**
 * ProjectCardSkeleton component displays a loading placeholder for ProjectCard.
 * Shows animated skeleton elements matching the ProjectCard layout.
 *
 * @returns A skeleton loading state for a project card
 *
 * @example
 * ```tsx
 * {loading ? (
 *   <ProjectCardSkeleton />
 * ) : (
 *   <ProjectCard project={project} />
 * )}
 * ```
 *
 * @remarks
 * Matches the structure of ProjectCard component:
 * - Image placeholder with aspect-video ratio
 * - Category badge placeholder
 * - Title placeholder (2 lines)
 * - Description placeholder (3 lines)
 * - Technology badges placeholders (3 items)
 */
export const ProjectCardSkeleton = () => {
  return (
    <Card className="group flex h-full flex-col overflow-hidden">
      {/* Image Skeleton */}
      <Skeleton className="relative aspect-video w-full" />

      {/* Content Skeleton */}
      <CardContent className="flex flex-1 flex-col p-6 pt-6">
        {/* Category Badge */}
        <Skeleton className="mb-2 h-4 w-24" />

        {/* Title */}
        <Skeleton className="mb-2 h-6 w-full" />
        <Skeleton className="mb-3 h-6 w-3/4" />

        {/* Description */}
        <Skeleton className="mb-1 h-4 w-full" />
        <Skeleton className="mb-1 h-4 w-full" />
        <Skeleton className="mb-3 h-4 w-2/3" />

        {/* Technology Badges */}
        <div className="mt-auto flex flex-wrap gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </CardContent>
    </Card>
  )
}

export default ProjectCardSkeleton
