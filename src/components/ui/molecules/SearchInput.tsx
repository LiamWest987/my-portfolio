'use client'

/**
 * Props for the SearchInput component.
 */
interface SearchInputProps {
  /** Current search input value */
  value: string
  /** Callback fired when input value changes */
  onChange: (value: string) => void
  /** Optional placeholder text */
  placeholder?: string
}

/**
 * SearchInput component provides a styled search field with icon.
 * Features a search icon and smooth focus states.
 *
 * @param props - Component props
 * @param props.value - Current search input value
 * @param props.onChange - Callback fired when input value changes
 * @param props.placeholder - Optional placeholder text
 * @returns A styled search input with icon
 *
 * @example
 * ```tsx
 * const [search, setSearch] = useState('')
 * <SearchInput
 *   value={search}
 *   onChange={setSearch}
 *   placeholder="Search projects..."
 * />
 * ```
 *
 * @remarks
 * This is a client component using React state for input handling.
 * The search icon is positioned absolutely on the left side.
 */
export function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  return (
    <div className="relative min-w-[280px] flex-1">
      <label htmlFor="search-input" className="sr-only">
        Search projects
      </label>
      <svg
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <input
        id="search-input"
        type="search"
        className="w-full rounded-md border border-border bg-card py-3 pl-11 pr-4 text-sm text-foreground transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/10 dark:focus:ring-primary/20"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search projects"
      />
    </div>
  )
}
