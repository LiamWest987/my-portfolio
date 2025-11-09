/**
 * Sanity Schema: Contact
 *
 * This schema defines the structure for contact page content.
 * Copy this file to your Sanity Studio's schemas directory.
 *
 * Path: studio/schemas/contact.js
 */

export default {
  name: "contact",
  title: "Contact Page",
  type: "document",
  fields: [
    {
      name: "mainText",
      title: "Main Heading",
      type: "string",
      description: 'Main heading text (e.g., "Get In Touch")',
      validation: (Rule) => Rule.required(),
    },
    {
      name: "subtext",
      title: "Subtext",
      type: "text",
      rows: 3,
      description: "Descriptive text below the heading",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "location",
      title: "Location",
      type: "string",
      description: 'Your location (e.g., "Frisco, Texas")',
      validation: (Rule) => Rule.required(),
    },
    {
      name: "linkedinUrl",
      title: "LinkedIn URL",
      type: "url",
      description: "Your LinkedIn profile URL",
      validation: (Rule) =>
        Rule.required().uri({
          scheme: ["http", "https"],
        }),
    },
    {
      name: "email",
      title: "Email Address",
      type: "string",
      description: "Your contact email address",
      validation: (Rule) => Rule.required().email(),
    },
    {
      name: "resume",
      title: "Resume PDF",
      type: "file",
      options: {
        accept: ".pdf",
      },
      description: "Your resume PDF file",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "successImage",
      title: "Contact Form Success Image",
      type: "image",
      description: "Image to display in the contact form success modal",
      options: {
        hotspot: true,
      },
    },
  ],
  preview: {
    select: {
      title: "mainText",
      subtitle: "email",
    },
  },
};
