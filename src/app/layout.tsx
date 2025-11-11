import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/common';
import { Header, Footer } from '@/components/layout';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Liam West - Engineering Portfolio',
  description: 'Engineering student driving innovation and excellence through circuit design, aerospace systems, and immersive VR development',
  keywords: ['Engineering', 'VR Development', 'Circuit Design', 'Aerospace Systems', 'Digital Electronics'],
  authors: [{ name: 'Liam West' }],
  creator: 'Liam West',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://liamwest.me/',
    title: 'Liam West - Engineering Portfolio',
    description: 'Engineering student driving innovation and excellence through circuit design, aerospace systems, and immersive VR development',
    siteName: 'Liam West Portfolio',
    images: [
      {
        url: 'https://liamwest.me/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Liam West Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Liam West - Engineering Portfolio',
    description: 'Engineering student driving innovation and excellence through circuit design, aerospace systems, and immersive VR development',
    images: ['https://liamwest.me/og-image.svg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
