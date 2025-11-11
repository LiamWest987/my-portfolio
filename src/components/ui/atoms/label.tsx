"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Label variant styles using class-variance-authority.
 * Defines styling for form labels with accessibility features.
 */
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

/**
 * Label component provides accessible form labels using Radix UI.
 * Automatically associates with form controls and handles disabled states.
 *
 * @param props - Component props from Radix UI LabelPrimitive.Root
 * @param props.className - Additional CSS classes to apply
 * @param ref - Forwarded ref to the label element
 * @returns A styled, accessible label element
 *
 * @example
 * ```tsx
 * <Label htmlFor="email">Email address</Label>
 * <Input id="email" type="email" />
 * ```
 *
 * @remarks
 * Uses Radix UI's Label primitive which provides proper accessibility
 * and interaction with peer form elements (peer-disabled styles).
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
