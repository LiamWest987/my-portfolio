'use client'

import { useState, useEffect } from 'react'
import { fetchContact } from '@/lib/sanity/client'
import {
  Section,
  Container,
  SectionHeader,
  Button,
  Input,
  Textarea,
  BackgroundAnimation,
  Label,
} from '@/components/ui'

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
 * Contact page component with form submission and social links.
 * Allows visitors to send messages through a contact form and access social media links.
 *
 * @returns JSX element rendering the contact page with form, location, and social links
 *
 * @remarks
 * Route: /contact
 *
 * This page includes:
 * - Animated background
 * - Contact form with fields for name, email, and message
 * - Form validation and submission to Web3Forms API
 * - Success modal displayed after successful submission
 * - Error handling with user-friendly error messages
 * - Location card displaying current location
 * - Social links card with LinkedIn, email, and resume download
 * - Accessible form with ARIA labels and required field indicators
 *
 * Contact data is fetched from Sanity CMS on component mount.
 * Form submissions are handled via Web3Forms API.
 */
export default function ContactPage() {
  const [contactData, setContactData] = useState<ContactData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [formErrors, setFormErrors] = useState<string[]>([])

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
        setFormErrors([])
        form.reset()
      } else {
        const errorMessage = data.error || 'Oops! Something went wrong. Please try again.'
        setFormErrors([errorMessage])
      }
    } catch (error) {
      console.error('Error:', error)
      setFormErrors(['Oops! Something went wrong. Please try again.'])
    } finally {
      setIsSubmitting(false)
    }
  }

  const closeSuccessModal = () => {
    setShowSuccessModal(false)
  }

  const getEmailHref = (user: string, domain: string) => {
    return `mailto:${user}@${domain}`
  }

  const emailUser = contactData?.email?.split('@')[0] || 'liamwest987'
  const emailDomain = contactData?.email?.split('@')[1] || 'gmail.com'

  return (
    <>
      {/* Background Animation */}
      <BackgroundAnimation variant="full" />

      {/* Contact Section */}
      <Section
        id="contact"
        aria-labelledby="contact-heading"
        className="min-h-[calc(100vh-4rem)] bg-secondary pt-20"
      >
        <Container>
          <SectionHeader
            as="h1"
            title={loading ? 'Get In Touch' : contactData?.mainText || 'Get In Touch'}
            titleId="contact-heading"
            description={
              loading
                ? "Interested in engineering projects, VR development, or collaboration opportunities? Let's connect and discuss how we can work together."
                : contactData?.subtext ||
                  "Interested in engineering projects, VR development, or collaboration opportunities? Let's connect and discuss how we can work together."
            }
          />

          {/* Centered Contact Form */}
          <div className="mx-auto mb-12 max-w-[600px]">
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm md:p-8">
              <form id="contact-form" onSubmit={handleSubmit} className="space-y-6">
                <input
                  type="hidden"
                  name="access_key"
                  value="c41410e3-095d-4459-adf5-862bc0669f09"
                />
                <input type="hidden" name="subject" value="New Contact Form Submission" />
                <input type="checkbox" name="botcheck" className="hidden" />

                <div className="space-y-2">
                  <Label htmlFor="name">
                    Name{' '}
                    <span aria-label="required" className="text-destructive">
                      *
                    </span>
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your Name"
                    autoComplete="name"
                    required
                    aria-required="true"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email{' '}
                    <span aria-label="required" className="text-destructive">
                      *
                    </span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your.email@example.com"
                    autoComplete="email"
                    required
                    aria-required="true"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">
                    Message{' '}
                    <span aria-label="required" className="text-destructive">
                      *
                    </span>
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder="Tell me about your project or opportunity you'd like to discuss..."
                    required
                    aria-required="true"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                  aria-label={isSubmitting ? 'Sending message' : 'Send message'}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>

              {formErrors.length > 0 && (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="bg-destructive/10 mt-4 rounded-md border border-destructive p-4 text-destructive"
                >
                  <ul className="list-inside list-disc">
                    {formErrors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Success Modal */}
          {showSuccessModal && (
            <div
              id="success-modal"
              className="animate-in fade-in fixed inset-0 z-[1030] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-200 motion-reduce:animate-none"
              role="dialog"
              aria-modal="true"
              aria-labelledby="success-title"
              onClick={e => {
                if (e.target === e.currentTarget) closeSuccessModal()
              }}
            >
              <div className="animate-in zoom-in-95 w-full max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] transition-transform duration-300 motion-reduce:animate-none dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8),0_0_0_1px_hsl(var(--border))] md:p-12">
                {contactData?.successImage ? (
                  <img
                    id="success-modal-image"
                    src={contactData.successImage}
                    alt="Message sent successfully - Thank you for contacting us"
                    className="mx-auto mb-6 block h-auto w-full max-w-[200px] rounded-lg"
                  />
                ) : (
                  <div className="animate-in zoom-in duration-600 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white motion-reduce:animate-none">
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
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                )}
                <h3 id="success-title" className="mb-3 text-2xl font-bold text-card-foreground">
                  Message Sent!
                </h3>
                <p className="mb-8 leading-relaxed text-muted-foreground">
                  Thanks for reaching out. I&apos;ll get back to you soon.
                </p>
                <Button
                  variant="primary"
                  onClick={closeSuccessModal}
                  aria-label="Close success message"
                >
                  Close
                </Button>
              </div>
            </div>
          )}

          {/* Location and Connect Side by Side */}
          <div className="mx-auto max-w-[600px]">
            <div className="flex gap-8">
              {/* Location Card */}
              <div className="relative flex min-h-[180px] flex-1 flex-col items-center justify-center rounded-lg border border-border bg-card p-5 text-center md:p-6">
                <div className="mb-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-500/10 to-sky-500/10 text-primary">
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
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-medium md:text-2xl">Location</h3>
                <p id="contact-location" className="m-0">
                  {loading ? 'Frisco, Texas' : contactData?.location || 'Frisco, Texas'}
                </p>
              </div>

              {/* Social Links Card */}
              <div className="relative flex min-h-[180px] flex-1 flex-col items-center justify-center rounded-lg border border-border bg-card p-5 text-center md:p-6">
                <h3 className="mb-6 whitespace-nowrap text-xl font-medium md:text-2xl">
                  Connect With Me
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                  <a
                    id="contact-linkedin-link"
                    href={contactData?.linkedinUrl || 'https://www.linkedin.com/in/liam-west-/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                    aria-label="Visit LinkedIn profile (opens in new tab)"
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
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </a>
                  <a
                    id="contact-email-link"
                    href={getEmailHref(emailUser, emailDomain)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                    aria-label="Send email"
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
                      aria-hidden="true"
                      focusable="false"
                    >
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </a>
                  <a
                    id="contact-resume-link"
                    href={contactData?.resume || '/pdfs/resume.pdf'}
                    download
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                    aria-label="Download resume"
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
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
