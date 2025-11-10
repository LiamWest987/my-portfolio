import React, { forwardRef } from 'react';
import Link from 'next/link';
import styles from './Button.module.css';

// Button variant types based on CSS classes
type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'accent';

// Button size types based on CSS classes
type ButtonSize = 'sm' | 'base' | 'lg' | 'icon';

// Base button props
interface BaseButtonProps {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

// Props for button element
interface ButtonAsButton extends BaseButtonProps, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps> {
  href?: never;
}

// Props for link element
interface ButtonAsLink extends BaseButtonProps, Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps> {
  href: string;
}

// Union type for all button props
type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * Merges multiple class names, filtering out falsy values
 */
const mergeClassNames = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Button Component
 *
 * A flexible button component that supports multiple variants, sizes, and can render as either
 * a button element or a Next.js Link component.
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
 *
 * @example
 * // Full width button
 * <Button fullWidth variant="primary">
 *   Full Width
 * </Button>
 */
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'base',
      fullWidth = false,
      disabled = false,
      leftIcon,
      rightIcon,
      className,
      href,
      ...props
    },
    ref
  ) => {
    // Build class names based on props
    const buttonClasses = mergeClassNames(
      styles['button'],
      variant && styles[variant],
      size !== 'base' && styles[size],
      fullWidth && styles['full'],
      className
    );

    // Content with optional icons
    const content = (
      <>
        {leftIcon && <span className={styles['iconLeft']}>{leftIcon}</span>}
        {children}
        {rightIcon && <span className={styles['iconRight']}>{rightIcon}</span>}
      </>
    );

    // Render as Link if href is provided
    if (href !== undefined) {
      return (
        <Link
          href={href}
          className={buttonClasses}
          ref={ref as React.Ref<HTMLAnchorElement>}
          aria-disabled={disabled}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </Link>
      );
    }

    // Render as button element
    return (
      <button
        className={buttonClasses}
        disabled={disabled}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';
