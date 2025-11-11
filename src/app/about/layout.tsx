import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Liam West - engineering student with expertise in circuit design, aerospace systems, and VR development. Explore my skills, education, experience, and awards.',
  openGraph: {
    title: 'About Liam West - Skills & Experience',
    description: 'Engineering student with expertise in circuit design, aerospace systems, and VR development. Explore my skills, education, experience, and awards.',
    url: '/about',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Liam West - Skills & Experience',
    description: 'Engineering student with expertise in circuit design, aerospace systems, and VR development.',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
