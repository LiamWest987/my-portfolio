import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/common'
import { Header, Footer } from '@/components/ui/organisms'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ subsets: ['latin'] })

/**
 * Application metadata configuration for SEO and social media sharing.
 * Includes Open Graph and Twitter Card metadata for rich link previews.
 */
export const metadata: Metadata = {
  metadataBase: new URL('https://liamwest.com'),
  title: {
    default: 'Liam West - Engineering Portfolio',
    template: '%s | Liam West',
  },
  description:
    'Engineering student driving innovation and excellence through circuit design, aerospace systems, and immersive VR development',
  keywords: [
    'Engineering',
    'VR Development',
    'Circuit Design',
    'Aerospace Systems',
    'Digital Electronics',
    'Portfolio',
    'Liam West',
  ],
  authors: [{ name: 'Liam West', url: 'https://liamwest.com' }],
  creator: 'Liam West',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Liam West - Engineering Portfolio',
    description:
      'Engineering student driving innovation and excellence through circuit design, aerospace systems, and immersive VR development',
    siteName: 'Liam West Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Liam West - Engineering Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Liam West - Engineering Portfolio',
    description:
      'Engineering student driving innovation and excellence through circuit design, aerospace systems, and immersive VR development',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
}

/**
 * Root layout component that wraps all pages in the application.
 * Provides global layout structure including header, footer, theme provider, and accessibility features.
 *
 * @param props - Component props
 * @param props.children - Child components to render within the main content area
 * @returns JSX element containing the root HTML structure with global layout components
 *
 * @remarks
 * This layout includes:
 * - Skip to main content link for keyboard navigation
 * - Theme provider for dark/light mode
 * - Header and footer components
 * - Vercel Speed Insights integration
 * - Inter font from Google Fonts
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          <Header />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}
