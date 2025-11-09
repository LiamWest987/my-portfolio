# Deployment Guide

This guide will walk you through deploying your portfolio to Vercel with Sanity CMS.

## Prerequisites

- GitHub account
- Vercel account (sign up at vercel.com)
- Sanity account (sign up at sanity.io)

## Step 1: Set Up Sanity Studio

1. **Initialize Sanity project** (if not done yet):
   ```bash
   cd /Users/coreywest/Documents/liam-website/my-portfolio
   mkdir studio
   cd studio
   npm create sanity@latest
   ```

   During setup:
   - Select "Portfolio Website" as project name
   - Choose "production" dataset
   - Select "Clean project" template

2. **Add the project schema**:
   ```bash
   # Copy the schema file
   cp ../sanity-schemas/project.js schemas/
   ```

3. **Update `studio/sanity.config.js`** to include the schema:
   ```javascript
   import {defineConfig} from 'sanity'
   import {deskTool} from 'sanity/desk'
   import project from './schemas/project'

   export default defineConfig({
     name: 'default',
     title: 'Portfolio Website',
     projectId: 'your-project-id', // You'll get this during sanity init
     dataset: 'production',
     plugins: [deskTool()],
     schema: {
       types: [project],
     },
   })
   ```

4. **Start Sanity Studio locally**:
   ```bash
   cd studio
   npm run dev
   ```
   Opens at http://localhost:3333

5. **Add your projects** in the Studio interface

## Step 2: Get Your Sanity Project ID

1. Find your project ID in `studio/sanity.config.js` or at https://sanity.io/manage
2. Create `.env` file in the portfolio root:
   ```bash
   echo "VITE_SANITY_PROJECT_ID=your-project-id-here" > .env
   ```

## Step 3: Deploy Sanity Studio to Vercel

1. **From your studio directory**:
   ```bash
   cd studio
   npm run build
   ```

2. **Deploy to Vercel**:
   ```bash
   # Install Vercel CLI if needed
   npm i -g vercel

   # Deploy
   vercel
   ```

3. **Or deploy via Sanity's managed hosting**:
   ```bash
   sanity deploy
   ```
   This gives you a free `your-project.sanity.studio` URL

## Step 4: Deploy Portfolio to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Migrate to Vercel with Sanity CMS"
   git push origin main
   ```

2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add environment variable:
   - **Key**: `VITE_SANITY_PROJECT_ID`
   - **Value**: Your Sanity project ID

6. Click **Deploy**

### Option B: Via Vercel CLI

```bash
cd /Users/coreywest/Documents/liam-website/my-portfolio
vercel

# Follow prompts, then add environment variable
vercel env add VITE_SANITY_PROJECT_ID

# Deploy to production
vercel --prod
```

## Step 5: Configure Custom Domain (Optional)

1. In Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain (e.g., liamwest.com)
3. Update DNS records as instructed by Vercel

## Step 6: Update CORS Settings in Sanity

1. Go to https://sanity.io/manage
2. Select your project
3. Go to **API** → **CORS Origins**
4. Add your Vercel domains:
   - `https://your-project.vercel.app`
   - `https://your-custom-domain.com` (if applicable)
   - `http://localhost:5173` (for local development)

## Testing

1. **Local testing**:
   ```bash
   npm run dev
   ```
   Visit http://localhost:5173

2. **Build testing**:
   ```bash
   npm run build
   npm run preview
   ```
   Visit http://localhost:4173

3. **Check console** for "✅ Projects loaded from Sanity CMS" message

## Troubleshooting

### Projects not loading from Sanity
- Check browser console for errors
- Verify `VITE_SANITY_PROJECT_ID` is set correctly
- Check CORS settings in Sanity
- Ensure projects are published in Sanity Studio

### Build errors
- Run `npm run build` locally to catch errors
- Check that all file paths are correct
- Verify all environment variables are set in Vercel

### 404 errors on routes
- Ensure `vercel.json` is in the root directory
- Check that all HTML files are built in the `dist` folder

## Updating Content

1. Open your Sanity Studio (either locally or at your deployed URL)
2. Make changes to projects
3. Changes are automatically available via the API
4. Your portfolio will fetch the latest data on each page load

## Directory Structure

```
my-portfolio/
├── src/
│   ├── js/
│   │   ├── main.js          # Main application logic
│   │   ├── script.js        # Navigation scripts
│   │   └── sanity.js        # Sanity client configuration
│   └── styles/
│       ├── theme.css        # Design tokens (colors, spacing, etc.)
│       └── style.css        # Main styles
├── sanity-schemas/          # Schema definitions for Sanity Studio
│   ├── project.js           # Project content type
│   └── README.md
├── studio/                  # Sanity Studio (CMS interface)
├── photos/                  # Project images
├── pdfs/                    # Project PDFs
├── *.html                   # HTML pages
├── vercel.json             # Vercel deployment config
├── vite.config.js          # Vite build configuration
└── .env                    # Environment variables (local only)
```

## Next Steps

- [ ] Add dark mode toggle using theme.css variables
- [ ] Set up Vercel Analytics
- [ ] Configure Sanity scheduled publishing
- [ ] Add image optimization via Sanity CDN
