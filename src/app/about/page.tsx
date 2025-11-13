'use client'

import { useState, useEffect } from 'react'
import { fetchSkills, fetchEducation, fetchExperience, fetchAwards } from '@/lib/sanity/client'
import {
  Section,
  Container,
  SectionHeader,
  AboutCard,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Skeleton,
  BackgroundAnimation,
} from '@/components/ui'

/**
 * Skill category data structure from Sanity CMS.
 */
interface SkillCategory {
  _id: string
  title: string
  order: number
  skills: string[]
  icon?: string
}

/**
 * Education entry data structure from Sanity CMS.
 */
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

/**
 * Work experience data structure from Sanity CMS.
 */
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

/**
 * Award and achievement data structure from Sanity CMS.
 */
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

/**
 * About page component displaying comprehensive professional information.
 * Features tabbed sections for skills, education, experience, and awards.
 *
 * @returns JSX element rendering the about page with personal information and tabbed content
 *
 * @remarks
 * Route: /about
 *
 * This page includes:
 * - Animated background
 * - About section with four value cards
 * - Tabbed interface with four sections:
 *   - Skills: Technical skill categories displayed in a grid
 *   - Education: Academic background in timeline format
 *   - Experience: Work experience with achievements and skills
 *   - Awards: Honors and achievements with optional highlighting
 * - Loading skeletons for improved UX during data fetch
 * - Formatted date ranges for timeline entries
 *
 * All data is fetched from Sanity CMS on component mount.
 */
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

  const formatDate = (
    startDate?: string,
    endDate?: string,
    isCurrent?: boolean,
    year?: string,
    period?: string
  ) => {
    if (period) return period
    if (year) return year
    if (!startDate) return ''

    const start = new Date(startDate).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    })
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
      <BackgroundAnimation variant="full" />

      {/* About Section */}
      <Section id="about" className="bg-secondary pt-20">
        <Container>
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold">About & Skills</h1>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Engineering student passionate about designing better systems and creating
              user-centric solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <AboutCard
              headingLevel="div"
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
                  <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                  <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
                </svg>
              }
              title="Technical Excellence"
              description="Mastering engineering fundamentals"
            />

            <AboutCard
              headingLevel="div"
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
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              }
              title="Innovation Focus"
              description="Developing innovative solutions through user-centric design and engineering"
            />

            <AboutCard
              headingLevel="div"
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
              headingLevel="div"
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
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              }
              title="Continuous Learning"
              description="Constantly exploring new technologies and expanding skills in multiple engineering disciplines"
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
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-48 w-full" />
                  ))}
                </div>
              ) : skills.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {skills.map(category => (
                    <AboutCard
                      key={category._id}
                      icon={
                        category.icon ? (
                          <div dangerouslySetInnerHTML={{ __html: category.icon }} />
                        ) : undefined
                      }
                      title={category.title}
                      items={category.skills}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No skills found.</p>
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
                    <AboutCard
                      key={edu._id}
                      variant="timeline"
                      title={edu.degree}
                      subtitle={edu.school}
                      date={formatDate(edu.startDate, edu.endDate, edu.isCurrent, edu.year)}
                      description={edu.description}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No education entries found.</p>
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
                    <AboutCard
                      key={exp._id}
                      variant="timeline"
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
                <p className="text-center text-muted-foreground">No experience entries found.</p>
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
                    <AboutCard
                      key={award._id}
                      variant="timeline"
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
                <p className="text-center text-muted-foreground">No awards found.</p>
              )}
            </TabsContent>
          </Tabs>
        </Container>
      </Section>
    </>
  )
}
