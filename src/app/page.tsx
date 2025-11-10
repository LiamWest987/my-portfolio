'use client'

import { useState, useEffect } from 'react'
import { fetchProjects, fetchContact } from '@/lib/sanity/client'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { ProjectModal } from '@/components/ui/ProjectModal'
import { HeroSection } from '@/components/ui/HeroSection'
import { SectionHeader } from '@/components/ui/SectionHeader'
import ValueCard from '@/components/ui/ValueCard'

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

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [contactData, setContactData] = useState<ContactData | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    async function loadData() {
      // Fetch featured projects
      const projects = await fetchProjects()
      const featured = projects.filter((p: Project) => p.featured).slice(0, 3)
      setFeaturedProjects(featured)

      // Fetch contact data
      const contact = await fetchContact()
      setContactData(contact)
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
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="dot-pattern text-primary" />

          <Container>
            <HeroSection
              badge="Engineering & VR Development Portfolio"
              title={
                <>
                  Hi, I'm <span className="text-primary font-bold">Liam West</span>
                </>
              }
              subtitle={
                <>
                  Engineering student driving{' '}
                  <span className="text-accent font-semibold">innovation and excellence</span> through
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
                      >
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
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
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  ),
                },
                {
                  href: '#',
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
                    >
                      <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </svg>
                  ),
                },
              ]}
            />
          </Container>
        </section>

        {/* About Section */}
        <Section id="about" className="bg-secondary">
          <Container>
            <SectionHeader
              title="About Me"
              description="Engineering student passionate about circuit design, aerospace systems, and VR development. I combine technical expertise with creativity to build innovative solutions that push the boundaries of technology and learning."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ValueCard
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
                  >
                    <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
                    <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"></path>
                  </svg>
                }
                title="Technical Excellence"
                description="Mastering circuit design, digital electronics, and aerospace engineering fundamentals"
              />

              <ValueCard
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
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                }
                title="Innovation Focus"
                description="Developing cutting-edge VR simulations and immersive training experiences"
              />

              <ValueCard
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
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                }
                title="Collaborative Problem-Solving"
                description="Working with teams to tackle complex engineering challenges and deliver real-world solutions"
              />

              <ValueCard
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
                  >
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                }
                title="Continuous Learning"
                description="Constantly exploring new technologies and expanding skills in electronics, aerospace, and software development"
              />
            </div>
          </Container>
        </Section>

        {/* Featured Projects Section */}
        <Section id="featured-projects">
          <Container>
            <SectionHeader
              title="Featured Projects"
              description="Highlights from my work in digital electronics, aerospace engineering, and VR development"
            />

            <div className="project-grid mb-8" id="featured-grid">
              {featuredProjects.length > 0 ? (
                featuredProjects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    onClick={() => openProjectModal(project)}
                  />
                ))
              ) : (
                <div className="text-center col-span-full">
                  <p className="text-muted-foreground">Loading featured projects...</p>
                </div>
              )}
            </div>

            <div className="text-center">
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
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                }
              >
                View All Projects
              </Button>
            </div>
          </Container>
        </Section>

        <ProjectModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={closeProjectModal}
        />
    </>
  )
}
