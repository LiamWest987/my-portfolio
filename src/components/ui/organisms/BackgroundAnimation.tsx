import styles from './BackgroundAnimation.module.css'

/**
 * Props for the BackgroundAnimation component
 */
export interface BackgroundAnimationProps {
  /** Animation variant to display */
  variant?: 'dots' | 'grid' | 'gradient-orbs' | 'full'
  /** Additional CSS classes */
  className?: string
}

/**
 * Reusable background animation component with multiple variants
 *
 * Features:
 * - Multiple variants: dots, grid, gradient-orbs, full
 * - Fixed positioning with z-index: -1 (stays behind content)
 * - Respects prefers-reduced-motion
 * - Theme-aware using CSS variables
 * - Performant animations using transform and opacity
 *
 * Usage:
 * - Homepage: <BackgroundAnimation variant="dots" />
 * - Projects/Contact/About: <BackgroundAnimation variant="full" />
 */
export default function BackgroundAnimation({
  variant = 'full',
  className = '',
}: BackgroundAnimationProps) {
  return (
    <div className={`${styles.backgroundAnimation} ${className}`}>
      {/* Background gradient overlay */}
      {(variant === 'gradient-orbs' || variant === 'full') && (
        <div className={styles.backgroundGradient} />
      )}

      {/* Floating gradient orbs */}
      {(variant === 'gradient-orbs' || variant === 'full') && (
        <>
          <div className={`${styles.gradientOrb} ${styles.gradientOrb1}`} />
          <div className={`${styles.gradientOrb} ${styles.gradientOrb2}`} />
          <div className={`${styles.gradientOrb} ${styles.gradientOrb3}`} />
        </>
      )}

      {/* Grid pattern */}
      {(variant === 'grid' || variant === 'full') && (
        <div className={styles.gridPattern} />
      )}

      {/* Dot pattern */}
      {(variant === 'dots' || variant === 'full') && (
        <div className={styles.dotPattern} />
      )}
    </div>
  )
}
