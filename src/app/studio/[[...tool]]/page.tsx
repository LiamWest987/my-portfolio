'use client'

import { useEffect } from 'react'

export default function StudioPage() {
  useEffect(() => {
    window.location.href = 'https://liamwest.sanity.studio'
  }, [])

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <p>Redirecting to Sanity Studio...</p>
    </div>
  )
}
