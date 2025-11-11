'use client'

import { useEffect } from 'react'

/**
 * Sanity Studio redirect page component.
 * Automatically redirects to the external Sanity Studio deployment.
 *
 * @returns JSX element displaying a loading message while redirecting
 *
 * @remarks
 * Route: /studio and /studio/**
 *
 * This page immediately redirects users to the hosted Sanity Studio at
 * https://liamwest.sanity.studio upon mounting. It displays a temporary
 * "Redirecting..." message during the redirect.
 *
 * The redirect is implemented using client-side navigation to ensure
 * the redirect works properly in the browser environment.
 */
export default function StudioPage() {
  useEffect(() => {
    window.location.href = 'https://liamwest.sanity.studio'
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <p>Redirecting to Sanity Studio...</p>
    </div>
  )
}
