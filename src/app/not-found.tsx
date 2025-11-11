import { Button } from '@/components/ui'
import styles from './not-found.module.css'

/**
 * Custom 404 Not Found error page component.
 * Displayed when users navigate to a non-existent route.
 *
 * @returns JSX element rendering a centered 404 error message with navigation back to home
 *
 * @remarks
 * Route: Displayed for any non-existent routes
 *
 * Features:
 * - Large 404 heading
 * - User-friendly error message
 * - Call-to-action button to return to homepage
 * - Styled using CSS modules for scoped styling
 */
export default function NotFound() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <h2 className={styles.subtitle}>Page Not Found</h2>
      <p className={styles.text}>Sorry, the page you&apos;re looking for doesn&apos;t exist.</p>
      <Button href="/" variant="primary" size="lg">
        Return Home
      </Button>
    </div>
  )
}
