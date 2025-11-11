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
          fontSize: 64,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
          }}
        >
          <div style={{ fontSize: 72, fontWeight: 'bold' }}>Liam West</div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 400,
              textAlign: 'center',
              maxWidth: '80%',
              opacity: 0.9,
            }}
          >
            Engineering Portfolio
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 300,
              textAlign: 'center',
              maxWidth: '70%',
              opacity: 0.8,
              marginTop: 10,
            }}
          >
            Circuit Design • Aerospace Systems • VR Development
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
