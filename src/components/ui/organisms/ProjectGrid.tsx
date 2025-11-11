/**
 * Props for the ProjectGrid component.
 */
interface ProjectGridProps {
  /** ProjectCard components to display in grid */
  children: React.ReactNode;
}

/**
 * ProjectGrid component provides a responsive grid layout for project cards.
 * Automatically adjusts columns based on screen size.
 *
 * @param props - Component props
 * @param props.children - ProjectCard components to display in grid
 * @returns A responsive grid container
 *
 * @example
 * ```tsx
 * <ProjectGrid>
 *   {projects.map(project => (
 *     <ProjectCard key={project._id} project={project} />
 *   ))}
 * </ProjectGrid>
 * ```
 *
 * @remarks
 * Grid breakpoints:
 * - Mobile: 1 column
 * - Tablet (md): 2 columns
 * - Desktop (lg): 3 columns
 */
export function ProjectGrid({ children }: ProjectGridProps) {
  return <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7 lg:grid-cols-3 lg:gap-8">{children}</div>;
}
