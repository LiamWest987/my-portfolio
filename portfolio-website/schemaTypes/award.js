/**
 * Sanity Schema: Award
 *
 * This schema defines awards, achievements, certifications, and recognitions.
 *
 * Path: studio/schemas/award.js
 */

export default {
  name: 'award',
  title: 'Award/Achievement',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Award/Achievement Title',
      type: 'string',
      description: "e.g., Lean Six Sigma Green Belt Certification, Dean's List",
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Brief description of the achievement or its significance',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'issuer',
      title: 'Issuing Organization',
      type: 'string',
      description: 'e.g., University Name, Certification Body (optional)',
    },
    {
      name: 'date',
      title: 'Date Received',
      type: 'date',
      description: 'When the award/achievement was received',
    },
    {
      name: 'year',
      title: 'Year/Period',
      type: 'string',
      description: 'e.g., 2024, Fall 2023, 2023-2024',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Certification', value: 'certification'},
          {title: 'Academic', value: 'academic'},
          {title: 'Competition', value: 'competition'},
          {title: 'Leadership', value: 'leadership'},
          {title: 'Project', value: 'project'},
          {title: 'Other', value: 'other'},
        ],
      },
      description: 'Type of award or achievement',
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this appears (1 = first, lower = higher priority)',
      validation: (Rule) => Rule.required().min(1),
      initialValue: 1,
    },
    {
      name: 'isHighlighted',
      title: 'Highlight This Achievement',
      type: 'boolean',
      description: 'Feature this as a top achievement',
      initialValue: false,
    },
    {
      name: 'icon',
      title: 'Icon Type',
      type: 'string',
      options: {
        list: [
          {title: 'Medal/Award', value: 'medal'},
          {title: 'Trophy', value: 'trophy'},
          {title: 'Certificate', value: 'certificate'},
          {title: 'Star', value: 'star'},
          {title: 'Badge', value: 'badge'},
        ],
      },
      description: 'Icon style for display',
      initialValue: 'medal',
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
      by: [{field: 'date', direction: 'desc'}],
    },
    {
      title: 'Highlighted First',
      name: 'highlightedFirst',
      by: [
        {field: 'isHighlighted', direction: 'desc'},
        {field: 'order', direction: 'asc'},
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      year: 'year',
      category: 'category',
      isHighlighted: 'isHighlighted',
    },
    prepare(selection) {
      const {title, year, category, isHighlighted} = selection
      const subtitle = [year, category].filter(Boolean).join(' • ')
      return {
        title: isHighlighted ? `⭐ ${title}` : title,
        subtitle: subtitle,
      }
    },
  },
}
