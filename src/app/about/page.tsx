'use client'

import { useState, useEffect } from 'react'
import { fetchSkills, fetchEducation, fetchExperience, fetchAwards } from '@/lib/sanity/client'
import { Section, Container, SectionHeader, SkillCategoryCard, TimelineItem, ValueCard, Tabs, TabsContent, TabsList, TabsTrigger, Skeleton } from '@/components/ui'

interface SkillCategory {
  _id: string
  title: string
  order: number
  skills: string[]
  icon?: string
}

interface Education {
  _id: string
  degree: string
  school: string
  year?: string
  startDate?: string
  endDate?: string
  isCurrent?: boolean
  description?: string
  order: number
}

interface Experience {
  _id: string
  role: string
  company: string
  period?: string
  startDate?: string
  endDate?: string
  isCurrent?: boolean
  description?: string
  skills?: string[]
  achievements?: string[]
  order: number
}

interface Award {
  _id: string
  title: string
  description?: string
  issuer?: string
  date?: string
  year?: string
  category?: string
  order: number
  isHighlighted?: boolean
  icon?: string
}

export default function AboutPage() {
  const [skills, setSkills] = useState<SkillCategory[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [experience, setExperience] = useState<Experience[]>([])
  const [awards, setAwards] = useState<Award[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [skillsData, educationData, experienceData, awardsData] = await Promise.all([
          fetchSkills(),
          fetchEducation(),
          fetchExperience(),
          fetchAwards(),
        ])
        setSkills(skillsData)
        setEducation(educationData)
        setExperience(experienceData)
        setAwards(awardsData)
      } catch (error) {
        console.error('Error loading about page data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const formatDate = (startDate?: string, endDate?: string, isCurrent?: boolean, year?: string, period?: string) => {
    if (period) return period
    if (year) return year
    if (!startDate) return ''

    const start = new Date(startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    if (isCurrent) return `${start} - Present`
    if (endDate) {
      const end = new Date(endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      return `${start} - ${end}`
    }
    return start
  }

  return (
    <>
      {/* Background Animation */}
      <div className="background-animation">
        <div className="background-gradient"></div>
        <div className="gradient-orb gradient-orb-1"></div>
        <div className="gradient-orb gradient-orb-2"></div>
        <div className="gradient-orb gradient-orb-3"></div>
        <div className="grid-pattern"></div>
        <div className="dot-pattern"></div>
      </div>

      <main>
        {/* About Section */}
        <Section id="about" className="bg-secondary pt-20">
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

        {/* Skills Section with Tabs */}
        <Section id="skills">
          <Container>
            <SectionHeader
              title="Skills & Experience"
              description="Combining engineering expertise with creative problem-solving to deliver innovative solutions"
            />

            <Tabs defaultValue="skills" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="achievements">Awards</TabsTrigger>
              </TabsList>

              {/* Skills Tab */}
              <TabsContent value="skills" className="mt-6">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                      <Skeleton key={i} className="h-48 w-full" />
                    ))}
                  </div>
                ) : skills.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {skills.map(category => (
                      <SkillCategoryCard
                        key={category._id}
                        icon={
                          category.icon ? (
                            <div dangerouslySetInnerHTML={{ __html: category.icon }} />
                          ) : undefined
                        }
                        title={category.title}
                        skills={category.skills}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center">No skills found.</p>
                )}
              </TabsContent>

              {/* Education Tab */}
              <TabsContent value="education" className="mt-6">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2].map(i => (
                      <Skeleton key={i} className="h-32 w-full" />
                    ))}
                  </div>
                ) : education.length > 0 ? (
                  <div className="space-y-4">
                    {education.map(edu => (
                      <TimelineItem
                        key={edu._id}
                        title={edu.degree}
                        subtitle={edu.school}
                        date={formatDate(edu.startDate, edu.endDate, edu.isCurrent, edu.year)}
                        description={edu.description}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center">No education entries found.</p>
                )}
              </TabsContent>

              {/* Experience Tab */}
              <TabsContent value="experience" className="mt-6">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <Skeleton key={i} className="h-40 w-full" />
                    ))}
                  </div>
                ) : experience.length > 0 ? (
                  <div className="space-y-4">
                    {experience.map(exp => (
                      <TimelineItem
                        key={exp._id}
                        title={exp.role}
                        subtitle={exp.company}
                        date={formatDate(
                          exp.startDate,
                          exp.endDate,
                          exp.isCurrent,
                          undefined,
                          exp.period
                        )}
                        description={exp.description}
                        tags={exp.skills}
                        achievements={exp.achievements}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center">No experience entries found.</p>
                )}
              </TabsContent>

              {/* Achievements Tab */}
              <TabsContent value="achievements" className="mt-6">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <Skeleton key={i} className="h-32 w-full" />
                    ))}
                  </div>
                ) : awards.length > 0 ? (
                  <div className="space-y-4">
                    {awards.map(award => (
                      <TimelineItem
                        key={award._id}
                        title={award.title}
                        subtitle={award.issuer}
                        date={(award.date || award.year) ?? ''}
                        description={award.description}
                        tags={award.category ? [award.category] : undefined}
                        className={award.isHighlighted ? 'border-primary' : undefined}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center">No awards found.</p>
                )}
              </TabsContent>
            </Tabs>
          </Container>
        </Section>
      </main>
    </>
  )
}
