'use client'

import { useState, useEffect } from 'react'
import { fetchContact } from '@/lib/sanity/client'
import { Section, Container, SectionHeader } from '@/components/ui'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/atoms/input'
import { Textarea } from '@/components/ui/atoms/textarea'

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

export default function ContactPage() {
  const [contactData, setContactData] = useState<ContactData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  useEffect(() => {
    async function loadContactData() {
      try {
        const data = await fetchContact()
        setContactData(data)
      } catch (error) {
        console.error('Error loading contact data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadContactData()
  }, [])

  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const user = e.currentTarget.getAttribute('data-email-user')
    const domain = e.currentTarget.getAttribute('data-email-domain')
    if (user && domain) {
      window.location.href = `mailto:${user}@${domain}`
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setShowSuccessModal(true)
        form.reset()
      } else {
        alert('Oops! Something went wrong. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Oops! Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const closeSuccessModal = () => {
    setShowSuccessModal(false)
  }

  const emailUser = contactData?.email?.split('@')[0] || 'liamwest987'
  const emailDomain = contactData?.email?.split('@')[1] || 'gmail.com'

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
        {/* Contact Section */}
        <Section
          id="contact"
          className="bg-secondary pt-20 min-h-[calc(100vh-4rem)]"
        >
          <Container>
            <SectionHeader
              title={loading ? 'Get In Touch' : contactData?.mainText || 'Get In Touch'}
              description={
                loading
                  ? "Interested in engineering projects, VR development, or collaboration opportunities? Let's connect and discuss how we can work together."
                  : contactData?.subtext ||
                    "Interested in engineering projects, VR development, or collaboration opportunities? Let's connect and discuss how we can work together."
              }
            />

            {/* Centered Contact Form */}
            <div style={{ maxWidth: '600px', margin: '0 auto 3rem' }}>
              <div className="contact-info-card">
                <form id="contact-form" onSubmit={handleSubmit}>
                  <input type="hidden" name="access_key" value="c41410e3-095d-4459-adf5-862bc0669f09" />
                  <input type="hidden" name="subject" value="New Contact Form Submission" />
                  <input type="checkbox" name="botcheck" style={{ display: 'none' }} />

                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Your Name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={6}
                      placeholder="Tell me about your project or opportunity you'd like to discuss..."
                      required
                    />
                  </div>

                  <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
              <div
                id="success-modal"
                className="modal"
                style={{
                  display: 'flex',
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(4px)',
                  zIndex: 1000,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem',
                }}
                onClick={(e) => {
                  if (e.target === e.currentTarget) closeSuccessModal()
                }}
              >
                <div
                  className="modal-content"
                  style={{
                    background: 'var(--card)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '3rem',
                    textAlign: 'center',
                    maxWidth: '28rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    transform: 'scale(1)',
                    transition: 'transform 0.3s ease',
                  }}
                >
                  {contactData?.successImage ? (
                    <img
                      id="success-modal-image"
                      src={contactData.successImage}
                      alt="Success"
                      style={{
                        width: '100%',
                        maxWidth: '200px',
                        height: 'auto',
                        margin: '0 auto 1.5rem',
                        borderRadius: 'var(--radius-lg)',
                      }}
                    />
                  ) : (
                    <div
                      className="modal-icon"
                      style={{
                        width: '4rem',
                        height: '4rem',
                        margin: '0 auto 1.5rem',
                        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                        borderRadius: 'var(--radius-full)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                  )}
                  <h3
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 'var(--font-weight-bold)',
                      marginBottom: '0.75rem',
                      color: 'var(--card-foreground)',
                    }}
                  >
                    Message Sent!
                  </h3>
                  <p
                    style={{
                      color: 'var(--muted-foreground)',
                      marginBottom: '2rem',
                      lineHeight: 1.6,
                    }}
                  >
                    Thanks for reaching out. I&apos;ll get back to you soon.
                  </p>
                  <Button variant="primary" onClick={closeSuccessModal}>
                    Close
                  </Button>
                </div>
              </div>
            )}

            {/* Location and Connect Side by Side */}
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ display: 'flex', gap: '2rem' }}>
                {/* Location Card */}
                <div
                  className="contact-info-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    minHeight: '180px',
                    flex: 1,
                  }}
                >
                  <div className="contact-icon" style={{ marginBottom: '1rem' }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <h3
                    style={{
                      marginBottom: '0.5rem',
                      fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
                    }}
                  >
                    Location
                  </h3>
                  <p id="contact-location" style={{ margin: 0 }}>
                    {loading ? 'Frisco, Texas' : contactData?.location || 'Frisco, Texas'}
                  </p>
                </div>

                {/* Social Links Card */}
                <div
                  className="contact-info-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    minHeight: '180px',
                    flex: 1,
                  }}
                >
                  <h3
                    style={{
                      marginBottom: '1.5rem',
                      fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Connect With Me
                  </h3>
                  <div className="social-buttons" style={{ justifyContent: 'center' }}>
                    <Button
                      id="linkedin-link"
                      
                      variant="outline"
                      size="icon"
                    >
                      <a
                        href={contactData?.linkedinUrl || 'https://www.linkedin.com/in/liam-west-/'}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
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
                      </a>
                    </Button>
                    <Button
                      id="email-link"
                      
                      variant="outline"
                      size="icon"
                    >
                      <a
                        href="#"
                        data-email-user={emailUser}
                        data-email-domain={emailDomain}
                        onClick={handleEmailClick}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
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
                      </a>
                    </Button>
                    <Button
                      id="resume-link"
                      
                      variant="outline"
                      size="icon"
                    >
                      <a
                        href={contactData?.resume || '/pdfs/resume.pdf'}
                        download
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      </main>
    </>
  )
}
