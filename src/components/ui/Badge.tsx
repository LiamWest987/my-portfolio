import React from 'react'
import { Badge as ShadBadge, type BadgeProps as ShadBadgeProps } from './atoms/badge'

type BadgeVariant = 'secondary' | 'outline' | 'primary' | 'accent' | 'destructive'

interface BadgeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children: React.ReactNode
  variant?: BadgeVariant
}

// Map our variants to shadcn variants
const mapVariant = (variant: BadgeVariant): ShadBadgeProps['variant'] => {
  const variantMap: Record<BadgeVariant, ShadBadgeProps['variant']> = {
    primary: 'default',
    secondary: 'secondary',
    outline: 'outline',
    accent: 'secondary',
    destructive: 'destructive',
  }
  return variantMap[variant]
}

/**
 * Badge Component
 *
 * A composite badge that wraps shadcn/ui Badge atom
 * Maintains backward compatibility with existing API.
 */
export const Badge: React.FC<BadgeProps> = ({ children, variant = 'secondary', ...props }) => {
  return (
    <ShadBadge variant={mapVariant(variant)} {...props}>
      {children}
    </ShadBadge>
  )
}
