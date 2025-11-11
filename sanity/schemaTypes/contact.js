export default {
  name: 'contact',
  title: 'Contact',
  type: 'document',
  fields: [
    {
      name: 'mainText',
      title: 'Main Text',
      type: 'string',
      description: 'Main heading text for contact page',
    },
    {
      name: 'subtext',
      title: 'Subtext',
      type: 'text',
      description: 'Subheading or description text',
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Your location',
    },
    {
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
      description: 'Your LinkedIn profile URL',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      description: 'Your contact email',
    },
    {
      name: 'resume',
      title: 'Resume',
      type: 'file',
      description: 'Upload your resume PDF',
      options: {
        accept: '.pdf',
      },
    },
    {
      name: 'successImage',
      title: 'Success Image',
      type: 'image',
      description: 'Image to display on successful form submission',
      options: {
        hotspot: true,
      },
    },
  ],
}
