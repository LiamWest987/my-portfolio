/**
 * Props for the ResultsInfo component.
 */
interface ResultsInfoProps {
  /** Number of items currently being displayed after filtering */
  currentCount: number
  /** Total number of items available before filtering */
  totalCount: number
  /** Name of the items being counted (e.g., 'projects', 'articles') */
  itemName?: string
}

/**
 * Displays a summary of filtered results with accessibility support.
 *
 * @param props - Component props
 * @returns Accessible results summary text
 *
 * @remarks
 * Shows the number of filtered items vs total available items. Includes
 * a screen-reader-only message that provides context about whether items
 * are filtered or all items are shown.
 *
 * Accessibility features:
 * - Visual count for sighted users
 * - Enhanced context in `sr-only` span for screen readers
 * - Distinguishes between "all shown" and "filtered" states
 *
 * @example
 * ```tsx
 * // Show project count
 * <ResultsInfo currentCount={5} totalCount={10} itemName="projects" />
 * // Renders: "Showing 5 of 10 projects"
 *
 * // Show all items
 * <ResultsInfo currentCount={10} totalCount={10} />
 * // Renders: "Showing 10 of 10 projects"
 * ```
 */
export const ResultsInfo: React.FC<ResultsInfoProps> = ({
  currentCount,
  totalCount,
  itemName = 'projects'
}) => {
  return (
    <div className="mb-6">
      <p className="text-sm text-muted-foreground">
        Showing {currentCount} of {totalCount} {itemName}
      </p>
      <span className="sr-only">
        {currentCount === totalCount
          ? `All ${totalCount} ${itemName} displayed`
          : `Filtered to ${currentCount} of ${totalCount} ${itemName}`}
      </span>
    </div>
  )
}
