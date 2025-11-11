"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"
import { Cross2Icon } from "@radix-ui/react-icons"

/**
 * Dialog root component from Radix UI.
 * Manages the state and context for dialog components.
 *
 * @example
 * ```tsx
 * <Dialog>
 *   <DialogTrigger>Open</DialogTrigger>
 *   <DialogContent>Content here</DialogContent>
 * </Dialog>
 * ```
 */
const Dialog = DialogPrimitive.Root

/**
 * DialogTrigger component opens the dialog when clicked.
 * Automatically manages aria attributes and interactions.
 */
const DialogTrigger = DialogPrimitive.Trigger

/**
 * DialogPortal renders dialog content in a portal (outside DOM hierarchy).
 * Ensures proper stacking context and accessibility.
 */
const DialogPortal = DialogPrimitive.Portal

/**
 * DialogClose component closes the dialog when clicked.
 * Can be used for custom close buttons.
 */
const DialogClose = DialogPrimitive.Close

/**
 * DialogOverlay provides a dark backdrop behind the dialog content.
 * Animates in and out based on dialog state.
 *
 * @param props - Component props from Radix UI DialogPrimitive.Overlay
 * @param props.className - Additional CSS classes to apply
 * @param ref - Forwarded ref to the overlay element
 * @returns A styled overlay element with animations
 */
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

/**
 * DialogContent is the main container for dialog content.
 * Centered modal with close button and smooth animations.
 *
 * @param props - Component props from Radix UI DialogPrimitive.Content
 * @param props.className - Additional CSS classes to apply
 * @param props.children - Dialog content to render
 * @param ref - Forwarded ref to the content element
 * @returns A styled, centered dialog with close button
 *
 * @example
 * ```tsx
 * <DialogContent>
 *   <DialogHeader>
 *     <DialogTitle>Title</DialogTitle>
 *   </DialogHeader>
 *   <p>Dialog content</p>
 * </DialogContent>
 * ```
 *
 * @remarks
 * Automatically includes a close button in the top-right corner.
 * Renders within DialogPortal and includes DialogOverlay.
 */
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <Cross2Icon className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

/**
 * DialogHeader provides consistent header spacing and layout for dialogs.
 *
 * @param props - Standard div HTML attributes
 * @param props.className - Additional CSS classes to apply
 * @returns A styled dialog header section
 */
const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

/**
 * DialogFooter provides a footer section for dialog actions.
 *
 * @param props - Standard div HTML attributes
 * @param props.className - Additional CSS classes to apply
 * @returns A styled dialog footer section
 */
const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

/**
 * DialogTitle displays the main heading for a dialog.
 * Important for accessibility - identifies the dialog to screen readers.
 *
 * @param props - Component props from Radix UI DialogPrimitive.Title
 * @param props.className - Additional CSS classes to apply
 * @param ref - Forwarded ref to the title element
 * @returns A styled dialog title element
 */
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

/**
 * DialogDescription displays secondary descriptive text in a dialog.
 * Important for accessibility - provides dialog context to screen readers.
 *
 * @param props - Component props from Radix UI DialogPrimitive.Description
 * @param props.className - Additional CSS classes to apply
 * @param ref - Forwarded ref to the description element
 * @returns A styled dialog description element
 */
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
