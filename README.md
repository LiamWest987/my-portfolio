# Liam West - Portfolio Website

Modern portfolio website built with Vite, vanilla JavaScript, and Sanity CMS. Deployed on Vercel.

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Create .env file with your Sanity project ID
echo "VITE_SANITY_PROJECT_ID=your-project-id" > .env

# Start dev server
npm run dev
```

Visit http://localhost:5173

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
my-portfolio/
├── src/
│   ├── js/
│   │   ├── main.js          # Main application logic + project rendering
│   │   ├── sanity.js        # Sanity CMS client
│   │   └── script.js        # Navigation & UI utilities
│   └── styles/
│       ├── theme.css        # 🎨 Design system (colors, spacing, typography)
│       └── style.css        # Main stylesheet
├── sanity-schemas/          # Sanity CMS schema definitions
│   ├── project.js           # Project content type schema
│   └── README.md            # Schema installation guide
├── studio/                  # Sanity Studio (CMS) - created during setup
├── photos/                  # Project images
├── pdfs/                    # Project documentation PDFs
├── *.html                   # Page templates
├── vercel.json             # Vercel deployment config
├── vite.config.js          # Vite build configuration
├── .env.example            # Environment variables template
├── DEPLOYMENT.md           # 📖 Full deployment guide
└── THEME-GUIDE.md          # 🎨 Theme customization guide
```

## 🎨 Customizing the Theme

All design tokens (colors, spacing, typography) are centralized in [`src/styles/theme.css`](src/styles/theme.css).

**Quick color change:**

1. Open `src/styles/theme.css`
2. Edit the color variables:
   ```css
   --primary-color: #8B5CF6;  /* Your brand color */
   --background: #0F172A;     /* Background color */
   ```

See [THEME-GUIDE.md](THEME-GUIDE.md) for detailed customization options and pre-made color schemes.

## 📝 Managing Content with Sanity CMS

### Setup Sanity Studio

1. Create your Sanity project:
   ```bash
   mkdir studio && cd studio
   npm create sanity@latest
   ```

2. Copy the schema files:
   ```bash
   cp ../sanity-schemas/project.js schemas/
   ```

3. Start the CMS:
   ```bash
   npm run dev
   ```
   Opens at http://localhost:3333

4. Add your projects in the Studio UI

### Connect Portfolio to Sanity

1. Get your project ID from `studio/sanity.config.js`
2. Add to `.env`:
   ```
   VITE_SANITY_PROJECT_ID=your-project-id
   ```
3. Restart dev server - projects will now load from Sanity!

See [sanity-schemas/README.md](sanity-schemas/README.md) for detailed schema setup.

## 🌐 Deployment

### Deploy to Vercel

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel**:
   - Visit [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Add environment variable: `VITE_SANITY_PROJECT_ID`
   - Click Deploy

3. **Deploy Sanity Studio**:
   ```bash
   cd studio
   sanity deploy
   ```
   Or deploy to Vercel separately

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment instructions.

## 🛠 Tech Stack

- **Build Tool**: Vite
- **Frontend**: Vanilla JavaScript (ES6+)
- **CMS**: Sanity.io
- **Styling**: CSS with Custom Properties
- **Hosting**: Vercel
- **Domain**: Custom domain via Vercel

## 📦 Key Features

- ✅ **Centralized theme system** - Easy color/design customization
- ✅ **Sanity CMS integration** - Manage projects without code changes
- ✅ **Responsive design** - Works on all devices
- ✅ **Fast builds** - Vite for optimal performance
- ✅ **Clean URLs** - No .html extensions
- ✅ **SEO friendly** - Proper meta tags and semantic HTML
- ✅ **Fallback data** - Works even if Sanity is down

## 🔧 Available Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build locally
```

## 📚 Documentation

- [DEPLOYMENT.md](DEPLOYMENT.md) - Complete deployment guide
- [THEME-GUIDE.md](THEME-GUIDE.md) - Theme customization guide
- [sanity-schemas/README.md](sanity-schemas/README.md) - CMS schema setup

## 🤝 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SANITY_PROJECT_ID=your-project-id-here
```

See [.env.example](.env.example) for reference.

## 📄 License

Personal portfolio - All rights reserved.

## 👤 Author

**Liam West**
- Portfolio: [your-domain.com]
- LinkedIn: [linkedin.com/in/liam-west-/](https://linkedin.com/in/liam-west-/)
- Email: liamwest987@gmail.com

---

Built with ❤️ using Vite, Sanity, and Vercel
