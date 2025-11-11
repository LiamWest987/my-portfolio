"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

/**
 * Separator component creates horizontal or vertical divider lines.
 * Built using Radix UI Separator primitive for accessibility.
 *
 * @param props - Component props from Radix UI SeparatorPrimitive.Root
 * @param props.className - Additional CSS classes to apply
 * @param props.orientation - Direction of separator (horizontal or vertical)
 * @param props.decorative - Whether separator is purely decorative (affects accessibility)
 * @param ref - Forwarded ref to the separator element
 * @returns A styled separator element
 *
 * @example
 * ```tsx
 * <Separator />
 * ```
 *
 * @example
 * ```tsx
 * <Separator orientation="vertical" className="h-20" />
 * ```
 *
 * @remarks
 * Decorative separators (default) are hidden from screen readers.
 * Non-decorative separators are announced to assistive technologies.
 */
const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
