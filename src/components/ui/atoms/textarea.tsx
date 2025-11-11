import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Textarea component provides a multi-line text input field with consistent theming.
 * Supports all standard HTML textarea attributes.
 *
 * @param props - Component props extending standard textarea attributes
 * @param props.className - Additional CSS classes to apply
 * @param ref - Forwarded ref to the textarea element
 * @returns A styled textarea element
 *
 * @example
 * ```tsx
 * <Textarea placeholder="Enter your message..." />
 * ```
 *
 * @example
 * ```tsx
 * <Textarea
 *   placeholder="Description"
 *   rows={5}
 *   className="resize-none"
 * />
 * ```
 *
 * @remarks
 * Includes focus states, disabled states, and minimum height of 60px.
 * Responsive text sizing (base on mobile, sm on desktop).
 */
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-md border-2 border-input/60 bg-background/50 px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
