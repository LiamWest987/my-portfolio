'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { fetchProjects, fetchContact } from '@/lib/sanity/client'
import {
  Button,
  Container,
  Section,
  ProjectCard,
  ProjectCardSkeleton,
  ProjectGrid,
  ProjectModal,
  HeroSection,
  SectionHeader,
  AboutCard,
} from '@/components/ui'

// Lazy load WebGL background for better initial load performance
const HeroBackgroundWebGL = dynamic(
  () => import('@/components/ui/organisms/HeroBackgroundWebGL'),
  { ssr: false } // Disable SSR for WebGL (requires browser APIs)
)

/**
 * Project data structure from Sanity CMS.
 */
interface Project {
  _id: string
  title: string
  category: string
  date: string
  featured?: boolean
  image?: string
  images?: string[]
  description: string
  longDescription?: string
  overview?: string
  technologies?: string[]
  challenges?: string[]
  outcomes?: string[]
  tags?: string[]
  pdf?: string | null
  demo?: string
}

/**
 * Contact information data structure from Sanity CMS.
 */
interface ContactData {
  _id: string
  mainText?: string
  subtext?: string
  location?: string
  linkedinUrl?: string
  email?: string
  resume?: string
  successImage?: string
}

/**
 * Home page component displaying the portfolio landing page.
 * Features a hero section, about section with value cards, and featured projects.
 *
 * @returns JSX element rendering the home page with hero, about, and featured projects sections
 *
 * @remarks
 * Route: /
 *
 * This page includes:
 * - Animated background
 * - Hero section with introduction and call-to-action buttons
 * - Social media links (LinkedIn, Email)
 * - About section with four value cards highlighting technical skills
 * - Featured projects section showing up to 3 featured projects
 * - Project modal for detailed project views
 *
 * Data is fetched from Sanity CMS on component mount.
 */
export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [contactData, setContactData] = useState<ContactData | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch featured projects
        const projects = await fetchProjects()
        const featured = projects.filter((p: Project) => p.featured).slice(0, 3)
        setFeaturedProjects(featured)

        // Fetch contact data
        const contact = await fetchContact()
        setContactData(contact)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const openProjectModal = (project: Project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const closeProjectModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedProject(null), 300) // Wait for animation
  }

  return (
    <>
      {/* WebGL Background Animation */}
      <HeroBackgroundWebGL gridSpacing={30} intensity={1.0} />

      <main>
        {/* Hero Section */}
        <section aria-label="Hero introduction" className="relative overflow-hidden">
          <h1 className="sr-only">Liam West - Engineering & VR Development Portfolio</h1>

          <HeroSection
            badge="Engineering & VR Development Portfolio"
            title={
              <>
                Hi, I&apos;m <span className="font-bold text-primary">Liam West</span>
              </>
            }
            subtitle={
              <>
                Engineering student driving{' '}
                <span className="font-semibold text-accent">innovation and excellence</span> through
                circuit design, aerospace systems, and immersive VR development
              </>
            }
            actions={
              <>
                <Button
                  href="/projects"
                  variant="primary"
                  size="lg"
                  rightIcon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  }
                >
                  View My Work
                </Button>
                <Button
                  href={contactData?.resume || '/pdfs/resume.pdf'}
                  variant="outline"
                  size="lg"
                  download
                >
                  Download Resume
                </Button>
              </>
            }
            showScroll={true}
            socialLinks={[
              {
                href: contactData?.linkedinUrl || 'https://www.linkedin.com/in/liam-west-/',
                label: 'LinkedIn',
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                ),
              },
              {
                href: contactData?.email
                  ? `mailto:${contactData.email}`
                  : 'mailto:liamwest987@gmail.com',
                label: 'Email',
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                ),
              },
            ]}
          />
        </section>

        {/* About Section */}
        <Section id="about" aria-labelledby="about-heading" className="bg-secondary">
          <Container>
            <SectionHeader
              title="About Me"
              titleId="about-heading"
              description="Engineering student passionate about circuit design, aerospace systems, and VR development. I combine technical expertise with creativity to build innovative solutions that push the boundaries of technology and learning."
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <AboutCard
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                    <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
                  </svg>
                }
                title="Technical Excellence"
                description="Mastering circuit design, digital electronics, and aerospace engineering fundamentals"
              />

              <AboutCard
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                }
                title="Innovation Focus"
                description="Developing cutting-edge VR simulations and immersive training experiences"
              />

              <AboutCard
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                }
                title="Collaborative Problem-Solving"
                description="Working with teams to tackle complex engineering challenges and deliver real-world solutions"
              />

              <AboutCard
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                }
                title="Continuous Learning"
                description="Constantly exploring new technologies and expanding skills in electronics, aerospace, and software development"
              />
            </div>
          </Container>
        </Section>

        {/* Featured Projects Section */}
        <Section id="featured-projects" aria-labelledby="featured-projects-heading">
          <Container>
            <SectionHeader
              title="Featured Projects"
              titleId="featured-projects-heading"
              description="Highlights from my work in digital electronics, aerospace engineering, and VR development"
            />

            <ProjectGrid>
              {loading ? (
                // Show 3 skeleton cards while loading
                <>
                  <ProjectCardSkeleton />
                  <ProjectCardSkeleton />
                  <ProjectCardSkeleton />
                </>
              ) : featuredProjects.length > 0 ? (
                featuredProjects.map(project => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    onClick={() => openProjectModal(project)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center">
                  <p className="text-muted-foreground">No featured projects found.</p>
                </div>
              )}
            </ProjectGrid>

            <div className="mt-12 text-center">
              <Button
                href="/projects"
                variant="primary"
                size="lg"
                rightIcon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                }
              >
                View All Projects
              </Button>
            </div>
          </Container>
        </Section>
      </main>

      <ProjectModal project={selectedProject} isOpen={isModalOpen} onClose={closeProjectModal} />
    </>
  )
}
