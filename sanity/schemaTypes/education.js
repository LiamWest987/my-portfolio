/**
 * Sanity Schema: Education
 *
 * This schema defines educational background entries
 * including degrees, certifications, and coursework.
 *
 * Path: studio/schemas/education.js
 */

export default {
  name: 'education',
  title: 'Education',
  type: 'document',
  fields: [
    {
      name: 'degree',
      title: 'Degree/Certification',
      type: 'string',
      description: 'e.g., B.S. Industrial Engineering, Lean Six Sigma Green Belt',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'school',
      title: 'School/Institution',
      type: 'string',
      description: 'Name of the educational institution',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'year',
      title: 'Year/Period',
      type: 'string',
      description: 'e.g., Expected 2026, 2023-2024, Current',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      description: 'Used for sorting (most recent first)',
    },
    {
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      description: 'Leave blank if current/ongoing',
    },
    {
      name: 'isCurrent',
      title: 'Currently Enrolled',
      type: 'boolean',
      description: 'Check if this is current/ongoing education',
      initialValue: false,
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      description: 'Details about coursework, GPA, achievements, etc.',
      validation: (Rule) => Rule.required(),
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
      degree: 'degree',
      school: 'school',
      year: 'year',
      isCurrent: 'isCurrent',
    },
    prepare(selection) {
      const {degree, school, year, isCurrent} = selection
      return {
        title: degree,
        subtitle: `${school} • ${isCurrent ? 'Current' : year}`,
      }
    },
  },
}
