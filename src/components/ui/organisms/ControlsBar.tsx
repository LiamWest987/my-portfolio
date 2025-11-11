/**
 * Props for the ControlsBar component.
 */
interface ControlsBarProps {
  /** Control elements to display (filters, search, etc.) */
  children: React.ReactNode
}

/**
 * ControlsBar component provides a container for filter and search controls.
 * Responsive layout that stacks on mobile and flows horizontally on desktop.
 *
 * @param props - Component props
 * @param props.children - Control elements to display (filters, search, etc.)
 * @returns A flex container for control elements
 *
 * @example
 * ```tsx
 * <ControlsBar>
 *   <SearchInput value={search} onChange={setSearch} />
 *   <Dropdown options={categories} value={category} onChange={setCategory} />
 * </ControlsBar>
 * ```
 */
export const ControlsBar: React.FC<ControlsBarProps> = ({ children }) => {
  return <div className="mb-6 flex flex-wrap items-center gap-4 max-md:flex-col max-md:items-stretch">{children}</div>
}
