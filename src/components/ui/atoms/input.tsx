import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Input component provides a styled text input field with consistent theming.
 * Supports all standard HTML input types and attributes.
 *
 * @param props - Component props extending standard input attributes
 * @param props.className - Additional CSS classes to apply
 * @param props.type - HTML input type (text, email, password, etc.)
 * @param ref - Forwarded ref to the input element
 * @returns A styled input element
 *
 * @example
 * ```tsx
 * <Input type="text" placeholder="Enter your name" />
 * ```
 *
 * @example
 * ```tsx
 * <Input type="email" placeholder="email@example.com" required />
 * ```
 *
 * @remarks
 * Includes focus states, disabled states, and file input styling.
 * Responsive text sizing (base on mobile, sm on desktop).
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'border-input/60 flex h-9 w-full rounded-md border-2 bg-background px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
