/**
 * Sanity Schema: Skill Category
 *
 * This schema defines skill categories (e.g., Digital Electronics, VR Development)
 * and the individual skills within each category.
 *
 * Path: studio/schemas/skillCategory.js
 */

export default {
  name: "skillCategory",
  title: "Skill Category",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Category Title",
      type: "string",
      description: "e.g., Digital Electronics, VR Development",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Order in which this category appears (1, 2, 3, etc.)",
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: "skills",
      title: "Skills",
      type: "array",
      of: [{ type: "string" }],
      description: "List of skills in this category",
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: "icon",
      title: "Icon Name",
      type: "string",
      description: "Optional: Icon identifier for custom icon display",
      options: {
        list: [
          { title: "Circuit", value: "circuit" },
          { title: "VR Headset", value: "vr" },
          { title: "Airplane", value: "airplane" },
          { title: "Robot", value: "robot" },
          { title: "Tools", value: "tools" },
          { title: "Brain", value: "brain" },
        ],
      },
    },
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      order: "order",
      skillCount: "skills.length",
    },
    prepare(selection) {
      const { title, order, skillCount } = selection;
      return {
        title: title,
        subtitle: `Order: ${order} • ${skillCount || 0} skills`,
      };
    },
  },
};
