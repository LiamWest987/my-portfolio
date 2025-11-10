// Global TypeScript types

export interface ContactData {
  _id: string
  mainText?: string
  subtext?: string
  location?: string
  linkedinUrl?: string
  email?: string
  resume?: string
  successImage?: string
}

// Re-export feature types
export type { Project } from '../features/projects/types/project'
