import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Badge variant styles using class-variance-authority.
 * Defines visual styling for different badge types.
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-all whitespace-nowrap",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        primary:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground capitalize hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "border-border bg-transparent text-foreground hover:bg-secondary/20",
        accent: "border-accent/20 bg-accent/10 text-accent hover:bg-accent/15",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * Badge props interface extending standard div HTML attributes and badge variant options.
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * Badge component displays small labels or tags with various visual styles.
 * Built using shadcn/ui patterns with class-variance-authority for variant management.
 *
 * @param props - Component props including className, variant, and standard div attributes
 * @returns A styled badge element
 *
 * @example
 * ```tsx
 * <Badge variant="primary">New</Badge>
 * ```
 *
 * @example
 * ```tsx
 * <Badge variant="outline">JavaScript</Badge>
 * ```
 *
 * @example
 * ```tsx
 * <Badge variant="accent">Featured</Badge>
 * ```
 */
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
