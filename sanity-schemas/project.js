/**
 * Sanity Schema: Project
 *
 * This schema defines the structure for portfolio projects.
 * Copy this file to your Sanity Studio's schemas directory.
 *
 * Path: studio/schemas/project.js
 */

export default {
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Project Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Digital Electronics", value: "Digital Electronics" },
          { title: "Unity VR", value: "Unity VR" },
          { title: "PLTW POE", value: "PLTW POE" },
          { title: "PLTW Aerospace", value: "PLTW Aerospace" },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "date",
      title: "Project Date",
      type: "date",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "featured",
      title: "Featured Project",
      type: "boolean",
      description: "Toggle to mark this project as featured",
      initialValue: false,
    },
    {
      name: "image",
      title: "Primary Project Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "images",
      title: "Additional Project Images",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
        },
      ],
      description: "Optional gallery of additional project images",
    },
    {
      name: "description",
      title: "Short Description",
      type: "text",
      rows: 3,
      description: "Brief description shown on project cards",
      validation: (Rule) => Rule.required().max(300),
    },
    {
      name: "longDescription",
      title: "Long Description",
      type: "text",
      rows: 8,
      description: "Detailed description shown in project modal",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "technologies",
      title: "Technologies",
      type: "array",
      of: [{ type: "string" }],
      description: "List of technologies used in this project",
    },
    {
      name: "pdf",
      title: "PDF Document",
      type: "file",
      options: {
        accept: ".pdf",
      },
      description: "Optional PDF documentation",
    },
    {
      name: "demo",
      title: "Demo URL",
      type: "url",
      description: "Optional link to video demo or live project",
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "image",
      date: "date",
    },
    prepare(selection) {
      const { title, subtitle, media, date } = selection;
      return {
        title: title,
        subtitle: `${subtitle} • ${new Date(date).toLocaleDateString()}`,
        media: media,
      };
    },
  },
};
