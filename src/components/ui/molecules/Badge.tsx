import React from 'react'
import { Badge as ShadBadge, type BadgeProps as ShadBadgeProps } from '../atoms/badge'

/**
 * Badge variant type for molecule-level badge wrapper.
 */
type BadgeVariant = 'secondary' | 'outline' | 'primary' | 'accent' | 'destructive'

/**
 * Props for the Badge molecule component.
 */
interface BadgeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Badge content */
  children: React.ReactNode
  /** Visual style variant */
  variant?: BadgeVariant
}

/**
 * Maps molecule badge variants to shadcn badge variants.
 * Provides abstraction layer for potential future customization.
 */
const mapVariant = (variant: BadgeVariant): ShadBadgeProps['variant'] => {
  const variantMap: Record<BadgeVariant, ShadBadgeProps['variant']> = {
    primary: 'primary',
    secondary: 'secondary',
    outline: 'outline',
    accent: 'accent',
    destructive: 'destructive',
  }
  return variantMap[variant]
}

/**
 * Badge molecule component wraps the shadcn/ui Badge atom.
 * Provides a stable API layer that can be extended without modifying the base atom.
 *
 * @param props - Component props
 * @param props.children - Badge content
 * @param props.variant - Visual style variant (secondary, outline, primary, accent, destructive)
 * @returns A styled badge element
 *
 * @example
 * ```tsx
 * <Badge variant="primary">New</Badge>
 * ```
 *
 * @example
 * ```tsx
 * <Badge variant="outline">React</Badge>
 * ```
 *
 * @remarks
 * This molecule exists to:
 * - Maintain backward compatibility with existing code
 * - Provide a customization point separate from the shadcn atom
 * - Allow for future extensions without touching base components
 */
export const Badge: React.FC<BadgeProps> = ({ children, variant = 'secondary', ...props }) => {
  return (
    <ShadBadge variant={mapVariant(variant)} {...props}>
      {children}
    </ShadBadge>
  )
}
