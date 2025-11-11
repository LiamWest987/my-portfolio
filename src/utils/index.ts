/**
 * Utility Functions Module
 *
 * Common helper functions for the portfolio application including date formatting,
 * string manipulation, class name composition, and theme management.
 *
 * @module utils
 */

/**
 * Formats a date to a human-readable string in US locale format.
 *
 * @param date - Date string or Date object to format
 * @returns Formatted date string in "Month Day, Year" format (e.g., "January 15, 2024")
 *
 * @example
 * ```typescript
 * const formatted = formatDate('2024-01-15');
 * // Returns: "January 15, 2024"
 *
 * const formatted2 = formatDate(new Date(2024, 0, 15));
 * // Returns: "January 15, 2024"
 * ```
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Truncates a string to a specified maximum length and appends ellipsis if truncated.
 *
 * @param str - String to truncate
 * @param length - Maximum length before truncation
 * @returns Original string if within length limit, otherwise truncated string with ellipsis
 *
 * @example
 * ```typescript
 * const result = truncate('This is a long string', 10);
 * // Returns: "This is a..."
 *
 * const result2 = truncate('Short', 10);
 * // Returns: "Short"
 * ```
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

/**
 * Combines multiple class names conditionally, filtering out falsy values.
 * Useful for conditional CSS class composition in React components.
 *
 * @param classes - Variable number of class names or conditional values
 * @returns Space-separated string of truthy class names
 *
 * @remarks
 * This is a lightweight alternative to libraries like classnames or clsx.
 * Null, undefined, false, and empty strings are filtered out.
 *
 * @example
 * ```typescript
 * const className = cn('base', isActive && 'active', null, 'extra');
 * // If isActive is true: "base active extra"
 * // If isActive is false: "base extra"
 * ```
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Converts a string into a URL-friendly slug format.
 *
 * Performs the following transformations:
 * - Converts to lowercase
 * - Trims whitespace
 * - Removes non-alphanumeric characters (except spaces and hyphens)
 * - Replaces spaces and underscores with hyphens
 * - Removes leading and trailing hyphens
 *
 * @param str - String to convert to slug format
 * @returns URL-friendly slug string
 *
 * @example
 * ```typescript
 * const slug = slugify('Hello World!');
 * // Returns: "hello-world"
 *
 * const slug2 = slugify('  TypeScript & React  ');
 * // Returns: "typescript-react"
 * ```
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Creates a debounced version of a function that delays invoking until after
 * the specified wait time has elapsed since the last invocation.
 *
 * @template T - Function type to be debounced
 * @param func - Function to debounce
 * @param wait - Delay time in milliseconds before function execution
 * @returns Debounced function that delays execution
 *
 * @remarks
 * Useful for optimizing performance of frequently-called functions like search input handlers,
 * resize listeners, or scroll event handlers. Each call resets the timer.
 *
 * @example
 * ```typescript
 * const handleSearch = debounce((query: string) => {
 *   console.log('Searching for:', query);
 * }, 300);
 *
 * // Multiple rapid calls
 * handleSearch('a');    // Timer starts
 * handleSearch('ab');   // Timer resets
 * handleSearch('abc');  // Timer resets
 * // After 300ms of inactivity: logs "Searching for: abc"
 * ```
 */
export function debounce<T extends (...args: never[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Checks if the code is currently executing in a client-side (browser) environment.
 *
 * @returns `true` if running in browser (window is defined), `false` if server-side
 *
 * @remarks
 * Essential for Next.js applications to prevent server-side rendering errors when
 * accessing browser-only APIs like localStorage, window, or document.
 *
 * @example
 * ```typescript
 * if (isClient()) {
 *   // Safe to use browser APIs
 *   const width = window.innerWidth;
 * }
 * ```
 */
export function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Retrieves the initial theme preference from localStorage or system settings.
 *
 * @returns Theme name string, defaults to 'slate' if no preference found or on server
 *
 * @remarks
 * Priority order:
 * 1. Saved theme from localStorage (if client-side)
 * 2. System color scheme preference
 * 3. Default 'slate' theme
 *
 * Returns 'slate' immediately on server-side to prevent hydration issues.
 *
 * @example
 * ```typescript
 * const theme = getInitialTheme();
 * // Returns: 'slate' or user's saved preference
 * ```
 */
export function getInitialTheme(): string {
  if (!isClient()) return 'slate';

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) return savedTheme;

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'slate' : 'slate';
}

/**
 * Persists the selected theme to localStorage for future sessions.
 *
 * @param theme - Theme name to save
 *
 * @remarks
 * Only executes on client-side to prevent server-side rendering errors.
 * The saved theme will be retrieved by {@link getInitialTheme} on subsequent page loads.
 *
 * @example
 * ```typescript
 * saveTheme('dark');
 * // Theme preference saved to localStorage
 * ```
 */
export function saveTheme(theme: string): void {
  if (isClient()) {
    localStorage.setItem('theme', theme);
  }
}
