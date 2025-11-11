/**
 * Metadata for the Sanity Studio layout.
 */
export const metadata = {
  title: 'Sanity Studio',
}

/**
 * Layout component for the Sanity Studio administrative interface.
 * Provides a minimal wrapper for the Studio page without header/footer.
 *
 * @param props - Component props
 * @param props.children - Child components (Sanity Studio page)
 * @returns JSX element rendering the Studio layout
 *
 * @remarks
 * Route: /studio/[[...tool]]
 *
 * This layout uses catch-all routes to handle all Sanity Studio paths.
 * It intentionally excludes the main site's header and footer to provide
 * a clean admin interface.
 */
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
