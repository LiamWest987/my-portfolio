import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Button variant styles using class-variance-authority.
 * Defines visual styling and sizing options for different button types.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        accent:
          "bg-accent text-accent-foreground shadow hover:bg-accent/90 hover:-translate-y-0.5",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Button props interface extending standard button HTML attributes and variant options.
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** When true, renders as a Radix UI Slot component for composition patterns */
  asChild?: boolean
}

/**
 * Button component provides interactive click targets with multiple visual styles and sizes.
 * Built using shadcn/ui patterns with Radix UI Slot support for advanced composition.
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to apply
 * @param props.variant - Visual style variant (default, destructive, outline, secondary, ghost, link, accent)
 * @param props.size - Button size (default, sm, lg, icon)
 * @param props.asChild - When true, merges props into child component instead of rendering a button
 * @param ref - Forwarded ref to the button element
 * @returns A styled button element or Slot component
 *
 * @example
 * ```tsx
 * <Button variant="default">Click me</Button>
 * ```
 *
 * @example
 * ```tsx
 * <Button variant="outline" size="lg">Large Button</Button>
 * ```
 *
 * @example
 * ```tsx
 * // Using asChild with Next.js Link
 * <Button asChild>
 *   <Link href="/about">About</Link>
 * </Button>
 * ```
 *
 * @remarks
 * The asChild prop is useful for composition patterns where you want button styling
 * but need to render a different element (like a Link). Uses Radix UI's Slot component.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
