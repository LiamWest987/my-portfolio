/**
 * Sanity Schema: Experience
 *
 * This schema defines work experience, internships, and project roles.
 *
 * Path: studio/schemas/experience.js
 */

export default {
  name: 'experience',
  title: 'Experience',
  type: 'document',
  fields: [
    {
      name: 'role',
      title: 'Role/Position',
      type: 'string',
      description: 'e.g., VR Developer, Product Management Intern',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'company',
      title: 'Company/Organization',
      type: 'string',
      description: 'Name of the company or organization',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'period',
      title: 'Period',
      type: 'string',
      description: 'e.g., Summer 2024, 2023-Present, Jan 2024 - Jun 2024',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      description: 'Used for sorting (most recent first)',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      description: 'Leave blank if current position',
    },
    {
      name: 'isCurrent',
      title: 'Current Position',
      type: 'boolean',
      description: 'Check if this is a current/ongoing position',
      initialValue: false,
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      description: 'Brief description of responsibilities and achievements',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'skills',
      title: 'Skills Used',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Key skills and technologies used in this role',
    },
    {
      name: 'achievements',
      title: 'Key Achievements',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Bullet points of key accomplishments',
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this appears (1 = first, lower = higher priority)',
      validation: (Rule) => Rule.required().min(1),
      initialValue: 1,
    },
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
    {
      title: 'Most Recent First',
      name: 'dateDesc',
      by: [{field: 'startDate', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      role: 'role',
      company: 'company',
      period: 'period',
      isCurrent: 'isCurrent',
    },
    prepare(selection) {
      const {role, company, period, isCurrent} = selection
      return {
        title: role,
        subtitle: `${company} • ${isCurrent ? 'Current' : period}`,
      }
    },
  },
}
