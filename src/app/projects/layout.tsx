import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Explore Liam West\'s engineering projects spanning digital electronics, aerospace systems, and VR development. Browse circuit designs, aerospace analysis, and immersive training simulations.',
  openGraph: {
    title: 'Projects - Liam West Portfolio',
    description: 'Engineering projects spanning digital electronics, aerospace systems, and VR development. Browse circuit designs, aerospace analysis, and immersive training simulations.',
    url: '/projects',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects - Liam West Portfolio',
    description: 'Engineering projects spanning digital electronics, aerospace systems, and VR development.',
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
