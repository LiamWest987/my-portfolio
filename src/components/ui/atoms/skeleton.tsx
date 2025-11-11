import { cn } from "@/lib/utils"

/**
 * Skeleton component displays a placeholder loading state with pulse animation.
 * Used to indicate content that is loading or not yet available.
 *
 * @param props - Component props extending standard div attributes
 * @param props.className - Additional CSS classes to apply (e.g., for sizing)
 * @returns An animated skeleton placeholder element
 *
 * @example
 * ```tsx
 * <Skeleton className="h-12 w-12 rounded-full" />
 * ```
 *
 * @example
 * ```tsx
 * <Skeleton className="h-4 w-[250px]" />
 * ```
 *
 * @example
 * ```tsx
 * // Card skeleton
 * <div className="space-y-2">
 *   <Skeleton className="h-4 w-full" />
 *   <Skeleton className="h-4 w-3/4" />
 * </div>
 * ```
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props}
    />
  )
}

export { Skeleton }
