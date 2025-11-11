import React, { forwardRef } from 'react'
import Link from 'next/link'
import { Button as ShadButton, type ButtonProps as ShadButtonProps } from '../atoms/button'
import { cn } from '@/lib/utils'

// Extend shadcn button variants to match our existing API
type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'accent' | 'secondary'
type ButtonSize = 'sm' | 'base' | 'lg' | 'icon'

/**
 * Base props shared by all button variants
 */
interface BaseButtonProps {
  children?: React.ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  className?: string
}

// Props for button element
interface ButtonAsButton
  extends BaseButtonProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps> {
  href?: never
}

// Props for link element
interface ButtonAsLink
  extends BaseButtonProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps> {
  href: string
  disabled?: boolean
}

// Union type for all button props
type ButtonProps = ButtonAsButton | ButtonAsLink

// Map our variants to shadcn variants
const mapVariant = (variant: ButtonVariant): ShadButtonProps['variant'] => {
  const variantMap: Record<ButtonVariant, ShadButtonProps['variant']> = {
    primary: 'default',
    outline: 'outline',
    ghost: 'ghost',
    accent: 'accent',
    secondary: 'secondary',
  }
  return variantMap[variant]
}

// Map our sizes to shadcn sizes
const mapSize = (size: ButtonSize): ShadButtonProps['size'] => {
  const sizeMap: Record<ButtonSize, ShadButtonProps['size']> = {
    sm: 'sm',
    base: 'default',
    lg: 'lg',
    icon: 'icon',
  }
  return sizeMap[size]
}

/**
 * Button Component
 *
 * A composite button that wraps shadcn/ui Button atom with Next.js Link support
 * and icon slots. Maintains backward compatibility with existing API.
 *
 * @example
 * // Primary button
 * <Button variant="primary">Click me</Button>
 *
 * @example
 * // Button with icon
 * <Button variant="outline" leftIcon={<IconComponent />}>
 *   With Icon
 * </Button>
 *
 * @example
 * // As a link
 * <Button href="/about" variant="accent">
 *   Go to About
 * </Button>
 */
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'base',
      fullWidth = false,
      leftIcon,
      rightIcon,
      className,
      href,
      disabled,
      ...props
    },
    ref
  ) => {
    const shadVariant = mapVariant(variant)
    const shadSize = mapSize(size)

    const buttonClasses = cn(fullWidth && 'w-full', className)

    // Content with optional icons
    const content = (
      <>
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </>
    )

    // Render as Link if href is provided
    if (href !== undefined) {
      return (
        <ShadButton
          asChild
          variant={shadVariant}
          size={shadSize}
          className={buttonClasses}
          disabled={disabled}
        >
          <Link
            href={href}
            ref={ref as React.Ref<HTMLAnchorElement>}
            aria-disabled={disabled}
            {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          >
            {content}
          </Link>
        </ShadButton>
      )
    }

    // Render as button element
    return (
      <ShadButton
        variant={shadVariant}
        size={shadSize}
        className={buttonClasses}
        disabled={disabled}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </ShadButton>
    )
  }
)

Button.displayName = 'Button'
