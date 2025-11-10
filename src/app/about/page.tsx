'use client'

import { useState, useEffect } from 'react'
import { fetchSkills, fetchEducation, fetchExperience, fetchAwards } from '@/lib/sanity/client'
import { Section, Container } from '@/components/ui'
import ValueCard from '@/components/ui/ValueCard'

type TabType = 'skills' | 'education' | 'experience' | 'achievements'

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
  const [activeTab, setActiveTab] = useState<TabType>('skills')
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
        <Section id="about" style={{ background: 'var(--secondary)', paddingTop: '5rem' }}>
          <Container>
            <div className="text-center" style={{ marginBottom: '3rem' }}>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: 'var(--font-weight-bold)',
                marginBottom: '1rem'
              }}>
                About Me
              </h2>
              <p className="text-muted" style={{ maxWidth: '42rem', margin: '0 auto' }}>
                Engineering student passionate about circuit design, aerospace systems, and VR development. I combine technical expertise with creativity to build innovative solutions that push the boundaries of technology and learning.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
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
            <div className="text-center" style={{ marginBottom: '3rem' }}>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: 'var(--font-weight-bold)',
                marginBottom: '1rem'
              }}>
                Skills & Experience
              </h2>
              <p className="text-muted" style={{ maxWidth: '42rem', margin: '0 auto' }}>
                Combining engineering expertise with creative problem-solving to deliver innovative solutions
              </p>
            </div>

            <div className="tabs">
              {/* Tab Navigation */}
              <div className="tabs-list">
                <button
                  className={`tabs-trigger ${activeTab === 'skills' ? 'active' : ''}`}
                  onClick={() => setActiveTab('skills')}
                >
                  Skills
                </button>
                <button
                  className={`tabs-trigger ${activeTab === 'education' ? 'active' : ''}`}
                  onClick={() => setActiveTab('education')}
                >
                  Education
                </button>
                <button
                  className={`tabs-trigger ${activeTab === 'experience' ? 'active' : ''}`}
                  onClick={() => setActiveTab('experience')}
                >
                  Experience
                </button>
                <button
                  className={`tabs-trigger ${activeTab === 'achievements' ? 'active' : ''}`}
                  onClick={() => setActiveTab('achievements')}
                >
                  Awards
                </button>
              </div>

              {/* Skills Tab */}
              <div id="skills-content" className={`tabs-content ${activeTab === 'skills' ? 'active' : ''}`}>
                <div className="tabs-content-grid">
                  {loading ? (
                    <p className="text-muted" style={{ textAlign: 'center' }}>Loading skills...</p>
                  ) : skills.length > 0 ? (
                    skills.map((category) => (
                      <div key={category._id} className="skill-category-card">
                        {category.icon && (
                          <div className="skill-category-icon" dangerouslySetInnerHTML={{ __html: category.icon }} />
                        )}
                        <h3 className="skill-category-title">{category.title}</h3>
                        <ul className="skill-list">
                          {category.skills.map((skill, index) => (
                            <li key={index} className="skill-item">{skill}</li>
                          ))}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted" style={{ textAlign: 'center' }}>No skills found.</p>
                  )}
                </div>
              </div>

              {/* Education Tab */}
              <div id="education-content" className={`tabs-content ${activeTab === 'education' ? 'active' : ''}`}>
                <div className="tabs-content-list">
                  {loading ? (
                    <p className="text-muted" style={{ textAlign: 'center' }}>Loading education...</p>
                  ) : education.length > 0 ? (
                    education.map((edu) => (
                      <div key={edu._id} className="timeline-item">
                        <div className="timeline-header">
                          <h3 className="timeline-title">{edu.degree}</h3>
                          <span className="timeline-date">
                            {formatDate(edu.startDate, edu.endDate, edu.isCurrent, edu.year)}
                          </span>
                        </div>
                        <p className="timeline-subtitle">{edu.school}</p>
                        {edu.description && (
                          <p className="timeline-description">{edu.description}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-muted" style={{ textAlign: 'center' }}>No education entries found.</p>
                  )}
                </div>
              </div>

              {/* Experience Tab */}
              <div id="experience-content" className={`tabs-content ${activeTab === 'experience' ? 'active' : ''}`}>
                <div className="tabs-content-list">
                  {loading ? (
                    <p className="text-muted" style={{ textAlign: 'center' }}>Loading experience...</p>
                  ) : experience.length > 0 ? (
                    experience.map((exp) => (
                      <div key={exp._id} className="timeline-item">
                        <div className="timeline-header">
                          <h3 className="timeline-title">{exp.role}</h3>
                          <span className="timeline-date">
                            {formatDate(exp.startDate, exp.endDate, exp.isCurrent, undefined, exp.period)}
                          </span>
                        </div>
                        <p className="timeline-subtitle">{exp.company}</p>
                        {exp.description && (
                          <p className="timeline-description">{exp.description}</p>
                        )}
                        {exp.skills && exp.skills.length > 0 && (
                          <div className="timeline-tags">
                            {exp.skills.map((skill, index) => (
                              <span key={index} className="tag">{skill}</span>
                            ))}
                          </div>
                        )}
                        {exp.achievements && exp.achievements.length > 0 && (
                          <ul className="timeline-achievements">
                            {exp.achievements.map((achievement, index) => (
                              <li key={index}>{achievement}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-muted" style={{ textAlign: 'center' }}>No experience entries found.</p>
                  )}
                </div>
              </div>

              {/* Achievements Tab */}
              <div id="achievements-content" className={`tabs-content ${activeTab === 'achievements' ? 'active' : ''}`}>
                <div className="tabs-content-list">
                  {loading ? (
                    <p className="text-muted" style={{ textAlign: 'center' }}>Loading awards...</p>
                  ) : awards.length > 0 ? (
                    awards.map((award) => (
                      <div key={award._id} className={`timeline-item ${award.isHighlighted ? 'highlighted' : ''}`}>
                        <div className="timeline-header">
                          <h3 className="timeline-title">{award.title}</h3>
                          <span className="timeline-date">{award.date || award.year}</span>
                        </div>
                        {award.issuer && (
                          <p className="timeline-subtitle">{award.issuer}</p>
                        )}
                        {award.description && (
                          <p className="timeline-description">{award.description}</p>
                        )}
                        {award.category && (
                          <div className="timeline-tags">
                            <span className="tag">{award.category}</span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-muted" style={{ textAlign: 'center' }}>No awards found.</p>
                  )}
                </div>
              </div>
            </div>
          </Container>
        </Section>
      </main>
    </>
  )
}
