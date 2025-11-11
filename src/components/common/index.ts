/**
 * Common Components Module
 *
 * Shared components and utilities used across the application including
 * theme management and context providers.
 *
 * @module components/common
 */

/**
 * Re-exports theme-related components and hooks.
 *
 * @remarks
 * Exported items:
 * - `ThemeProvider` - Context provider component for theme management
 * - `useTheme` - React hook for accessing and manipulating theme state
 *
 * @example
 * ```typescript
 * import { ThemeProvider, useTheme } from '@/components/common';
 *
 * // Wrap app with provider
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 *
 * // Use in components
 * const { theme, setTheme } = useTheme();
 * ```
 */
export { ThemeProvider, useTheme } from './ThemeProvider';
