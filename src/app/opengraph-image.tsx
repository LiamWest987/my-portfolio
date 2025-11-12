import { ImageResponse } from 'next/og'

// Image metadata
export const alt = 'Liam West - Engineering Portfolio'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0e1a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
          padding: '80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 32,
          }}
        >
          <div
            style={{
              fontSize: 32,
              fontWeight: 500,
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Engineering & VR Development Portfolio
          </div>
          <div
            style={{
              fontSize: 96,
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            Hi, I'm{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Liam West
            </span>
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 400,
              textAlign: 'center',
              maxWidth: '90%',
              color: '#94a3b8',
              lineHeight: 1.6,
            }}
          >
            Engineering student driving{' '}
            <span style={{ color: '#60a5fa' }}>innovation and excellence</span> through circuit
            design, aerospace systems, and immersive VR development
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
