import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Liam West to discuss engineering projects, collaboration opportunities, or connect via LinkedIn. Open to circuit design, aerospace, and VR development projects.',
  openGraph: {
    title: 'Contact Liam West',
    description: 'Get in touch to discuss engineering projects, collaboration opportunities, or connect via LinkedIn. Open to circuit design, aerospace, and VR development projects.',
    url: '/contact',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Liam West',
    description: 'Get in touch to discuss engineering projects and collaboration opportunities.',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
