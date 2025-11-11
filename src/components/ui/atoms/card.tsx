import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Card component provides a container with rounded corners, border, and shadow.
 * Main wrapper component for card-based layouts.
 *
 * @param props - Component props extending standard div attributes
 * @param props.className - Additional CSS classes to apply
 * @param ref - Forwarded ref to the div element
 * @returns A styled card container element
 *
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Card Title</CardTitle>
 *   </CardHeader>
 *   <CardContent>Card content goes here</CardContent>
 * </Card>
 * ```
 */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border border-border/40 bg-card/90 backdrop-blur-sm text-card-foreground shadow",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

/**
 * CardHeader provides the header section of a card with consistent spacing.
 *
 * @param props - Component props extending standard div attributes
 * @param props.className - Additional CSS classes to apply
 * @param ref - Forwarded ref to the div element
 * @returns A styled card header section
 *
 * @example
 * ```tsx
 * <CardHeader>
 *   <CardTitle>Title</CardTitle>
 *   <CardDescription>Description text</CardDescription>
 * </CardHeader>
 * ```
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

/**
 * CardTitle displays the main heading within a card header.
 *
 * @param props - Component props extending standard div attributes
 * @param props.className - Additional CSS classes to apply
 * @param ref - Forwarded ref to the div element
 * @returns A styled card title element
 *
 * @example
 * ```tsx
 * <CardTitle>Project Name</CardTitle>
 * ```
 */
const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

/**
 * CardDescription displays secondary text within a card header.
 *
 * @param props - Component props extending standard div attributes
 * @param props.className - Additional CSS classes to apply
 * @param ref - Forwarded ref to the div element
 * @returns A styled card description element
 *
 * @example
 * ```tsx
 * <CardDescription>Additional context or subtitle</CardDescription>
 * ```
 */
const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

/**
 * CardContent provides the main content area of a card with appropriate padding.
 *
 * @param props - Component props extending standard div attributes
 * @param props.className - Additional CSS classes to apply
 * @param ref - Forwarded ref to the div element
 * @returns A styled card content section
 *
 * @example
 * ```tsx
 * <CardContent>
 *   <p>Main card content</p>
 * </CardContent>
 * ```
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

/**
 * CardFooter provides a footer section for actions or additional information.
 *
 * @param props - Component props extending standard div attributes
 * @param props.className - Additional CSS classes to apply
 * @param ref - Forwarded ref to the div element
 * @returns A styled card footer section
 *
 * @example
 * ```tsx
 * <CardFooter>
 *   <Button>Action</Button>
 * </CardFooter>
 * ```
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
