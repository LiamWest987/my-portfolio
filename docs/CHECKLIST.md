# Deployment Checklist

Use this checklist to complete your migration to Vercel + Sanity CMS.

## ☐ Phase 1: Sanity Studio Setup

- [ ] **Initialize Sanity project**
  ```bash
  mkdir studio && cd studio
  npm create sanity@latest
  ```

- [ ] **Copy schema file**
  ```bash
  cp ../sanity-schemas/project.js schemas/
  ```

- [ ] **Update sanity.config.js** (see [sanity-schemas/README.md](sanity-schemas/README.md))

- [ ] **Start Sanity Studio**
  ```bash
  npm run dev
  ```
  Visit: http://localhost:3333

- [ ] **Add all 15 projects** in Sanity Studio
  - Upload images
  - Upload PDFs
  - Fill in all required fields

- [ ] **Note your Sanity Project ID** (from sanity.config.js)

---

## ☐ Phase 2: Local Testing

- [ ] **Create .env file**
  ```bash
  echo "VITE_SANITY_PROJECT_ID=your-project-id" > .env
  ```

- [ ] **Install dependencies** (if not done)
  ```bash
  npm install
  ```

- [ ] **Test dev server**
  ```bash
  npm run dev
  ```
  Visit: http://localhost:5173

- [ ] **Verify projects load from Sanity**
  - Open browser console
  - Look for: `✅ Projects loaded from Sanity CMS`
  - Check all 15 projects appear

- [ ] **Test production build**
  ```bash
  npm run build
  npm run preview
  ```
  Visit: http://localhost:4173

---

## ☐ Phase 3: Git & GitHub

- [ ] **Verify .gitignore includes .env**
  ```bash
  cat .gitignore | grep .env
  ```
  Should see: `.env`

- [ ] **Commit all changes**
  ```bash
  git add .
  git commit -m "Migrate to Vercel with Sanity CMS"
  ```

- [ ] **Push to GitHub**
  ```bash
  git push origin main
  ```

---

## ☐ Phase 4: Deploy Sanity Studio

### Option A: Sanity Cloud (Recommended)

- [ ] **Deploy to Sanity**
  ```bash
  cd studio
  sanity deploy
  ```

- [ ] **Note your Studio URL** (e.g., your-project.sanity.studio)

### Option B: Vercel

- [ ] Deploy studio folder as separate Vercel project
- [ ] Note the deployment URL

---

## ☐ Phase 5: Deploy Portfolio to Vercel

- [ ] **Go to** [vercel.com/new](https://vercel.com/new)

- [ ] **Import GitHub repository**

- [ ] **Configure project settings:**
  - Framework Preset: `Vite`
  - Root Directory: `./`
  - Build Command: `npm run build`
  - Output Directory: `dist`

- [ ] **Add environment variable:**
  - Key: `VITE_SANITY_PROJECT_ID`
  - Value: [your project ID]

- [ ] **Click "Deploy"**

- [ ] **Wait for deployment** (usually 1-2 minutes)

- [ ] **Note your Vercel URL** (e.g., your-project.vercel.app)

---

## ☐ Phase 6: Configure CORS

- [ ] **Go to** [sanity.io/manage](https://sanity.io/manage)

- [ ] **Select your project**

- [ ] **Navigate to:** API → CORS Origins

- [ ] **Add allowed origins:**
  - [ ] `https://your-project.vercel.app`
  - [ ] `http://localhost:5173` (for local dev)
  - [ ] Your custom domain (if applicable)

- [ ] **Save changes**

---

## ☐ Phase 7: Verification

- [ ] **Visit deployed site**
  - Open your Vercel URL
  - Navigate to Projects page
  - Verify all 15 projects display correctly

- [ ] **Test Sanity Studio**
  - Open your Studio URL
  - Edit a project
  - Save changes
  - Refresh portfolio site
  - Verify changes appear

- [ ] **Check browser console** for errors

- [ ] **Test all navigation**
  - [ ] Home page loads
  - [ ] Projects page loads
  - [ ] Project modals open
  - [ ] PDF links work
  - [ ] Demo links work

- [ ] **Test mobile responsiveness**

---

## ☐ Phase 8: Custom Domain (Optional)

- [ ] **In Vercel Dashboard:**
  - Go to: Settings → Domains
  - Add your custom domain
  - Follow DNS configuration instructions

- [ ] **Update Sanity CORS** with custom domain

- [ ] **Test custom domain** works

---

## ☐ Phase 9: Optimization (Optional)

- [ ] **Customize theme colors** ([THEME-GUIDE.md](THEME-GUIDE.md))

- [ ] **Set up Vercel Analytics**
  - Vercel Dashboard → Analytics → Enable

- [ ] **Add dark mode toggle** (see THEME-GUIDE.md)

- [ ] **Optimize images in Sanity**
  - Use WebP format
  - Compress before upload

---

## ✅ Final Checks

- [ ] Portfolio site is live and working
- [ ] Sanity Studio is accessible
- [ ] Projects load from CMS
- [ ] All links work (PDFs, demos, social)
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Custom domain configured (if applicable)

---

## 🎉 You're Done!

Your portfolio is now:
- ✅ Hosted on Vercel
- ✅ Managed by Sanity CMS
- ✅ Easy to update (no code changes needed)
- ✅ Fast and responsive
- ✅ Professional and scalable

---

## 📝 Notes

Use this space to track your project IDs and URLs:

**Sanity Project ID:** `_________________`

**Sanity Studio URL:** `_________________`

**Vercel Site URL:** `_________________`

**Custom Domain:** `_________________`

**Deployment Date:** `_________________`
