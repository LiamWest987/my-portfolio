/**
 * Sanity Schema: Skill Category
 *
 * This schema defines skill categories (e.g., Digital Electronics, VR Development)
 * and the individual skills within each category.
 *
 * Path: studio/schemas/skillCategory.js
 */

export default {
  name: 'skillCategory',
  title: 'Skill Category',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Category Title',
      type: 'string',
      description: 'e.g., Digital Electronics, VR Development',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this category appears (1, 2, 3, etc.)',
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: 'skills',
      title: 'Skills',
      type: 'array',
      of: [{type: 'string'}],
      description: 'List of skills in this category',
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Choose an icon for this skill category',
      options: {
        list: [
          // Technology & Electronics
          {title: '⚡ Circuit/Electronics', value: 'circuit'},
          {title: '💻 Code/Programming', value: 'code'},
          {title: '🖥️ Computer/Desktop', value: 'monitor'},
          {title: '📱 Mobile/Device', value: 'smartphone'},
          {title: '🔌 CPU/Processor', value: 'cpu'},
          {title: '💾 Database', value: 'database'},
          {title: '☁️ Cloud', value: 'cloud'},
          {title: '🌐 Network/Globe', value: 'globe'},

          // Engineering & Design
          {title: '✈️ Airplane/Aerospace', value: 'airplane'},
          {title: '🤖 Robot/Automation', value: 'robot'},
          {title: '🔧 Wrench/Tools', value: 'wrench'},
          {title: '🛠️ Settings/Gear', value: 'settings'},
          {title: '📐 Compass/Design', value: 'compass'},
          {title: '📏 Layers/CAD', value: 'layers'},
          {title: '🎯 Target/Precision', value: 'target'},
          {title: '⚙️ Cog/System', value: 'cog'},

          // VR & Creative
          {title: '🥽 VR Headset', value: 'vr'},
          {title: '🎮 Gaming/Controller', value: 'gamepad'},
          {title: '🎨 Palette/Creative', value: 'palette'},
          {title: '📷 Camera/Media', value: 'camera'},
          {title: '🎬 Video/Film', value: 'film'},
          {title: '🎵 Music/Audio', value: 'music'},

          // Collaboration & Communication
          {title: '👥 Users/Team', value: 'users'},
          {title: '💬 Message/Chat', value: 'message'},
          {title: '📢 Megaphone/Announce', value: 'megaphone'},
          {title: '🤝 Handshake/Partner', value: 'handshake'},
          {title: '📧 Mail/Email', value: 'mail'},
          {title: '📞 Phone/Call', value: 'phone'},

          // Learning & Analysis
          {title: '🧠 Brain/Thinking', value: 'brain'},
          {title: '📚 Book/Learning', value: 'book'},
          {title: '🎓 Graduation/Education', value: 'graduation'},
          {title: '📊 Chart/Analytics', value: 'chart'},
          {title: '🔬 Lab/Science', value: 'microscope'},
          {title: '🔍 Search/Research', value: 'search'},

          // Achievement & Quality
          {title: '🏆 Trophy/Award', value: 'trophy'},
          {title: '⭐ Star/Featured', value: 'star'},
          {title: '✅ Check/Quality', value: 'check'},
          {title: '🎖️ Medal/Badge', value: 'medal'},
          {title: '💎 Diamond/Premium', value: 'diamond'},
          {title: '⚡ Zap/Fast', value: 'zap'},

          // Business & Projects
          {title: '💼 Briefcase/Business', value: 'briefcase'},
          {title: '📋 Clipboard/Tasks', value: 'clipboard'},
          {title: '📁 Folder/Files', value: 'folder'},
          {title: '📦 Package/Product', value: 'package'},
          {title: '🚀 Rocket/Launch', value: 'rocket'},
        ],
      },
      validation: (Rule) => Rule.required(),
    },
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      order: 'order',
      skillCount: 'skills.length',
    },
    prepare(selection) {
      const {title, order, skillCount} = selection
      return {
        title: title,
        subtitle: `Order: ${order} • ${skillCount || 0} skills`,
      }
    },
  },
}
