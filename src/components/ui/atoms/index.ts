/**
 * Atomic Components Module
 *
 * Re-exports all shadcn/ui atomic primitives - the foundational building blocks
 * of the design system. These are the smallest, indivisible UI components.
 *
 * @module components/ui/atoms
 *
 * @remarks
 * All components are from shadcn/ui and follow Radix UI patterns:
 * - Fully accessible with ARIA attributes
 * - Keyboard navigation support
 * - Customizable via Tailwind CSS
 * - Composable and flexible
 *
 * @example
 * ```typescript
 * // Import specific atoms
 * import { Button, Card, Input } from '@/components/ui/atoms';
 *
 * // Or import from parent ui module
 * import { Button, Card, Input } from '@/components/ui';
 * ```
 */

/** Button component with variants and sizes */
export * from './button'
/** Badge component for labels and tags */
export * from './badge'
/** Card component for content containers */
export * from './card'
/** Input component for text entry */
export * from './input'
/** Label component for form field labels */
export * from './label'
/** Separator component for visual dividers */
export * from './separator'
/** Skeleton component for loading states */
export * from './skeleton'
/** Dialog component for modals and overlays */
export * from './dialog'
/** Tabs component for tabbed interfaces */
export * from './tabs'
/** Select component for dropdown selections */
export * from './select'
/** Textarea component for multi-line text entry */
export * from './textarea'
