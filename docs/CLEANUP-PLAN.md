# Root Folder Cleanup Plan

## Current Organization Issues

Your root folder has become cluttered with:
- ✅ 7 documentation markdown files
- ⚠️ Old HTML files (404.html, about.html, contact.html, home.html, projects.html, index.html)
- ⚠️ Empty `studio/` directory
- ⚠️ `temp-reference/` directory
- ⚠️ Jekyll config (`_config.yml`)
- ⚠️ Standalone assets (favicons, images, zip file)
- ⚠️ `pdfs/` and `photos/` (after Sanity verification)

---

## 📁 Recommended Folder Structure

```
my-portfolio/
├── docs/                          # ✨ NEW - All documentation
│   ├── ACCESSIBILITY-REPORT.md
│   ├── CHECKLIST.md
│   ├── CODE-REVIEW.md
│   ├── DEPLOYMENT.md
│   ├── MIGRATION-SUMMARY.md
│   ├── NEW-DESIGN-GUIDE.md
│   ├── PERFORMANCE-OPTIMIZATION.md
│   ├── SANITY-INTEGRATION.md
│   └── THEME-GUIDE.md
│
├── archive/                       # ✨ NEW - Old files for reference
│   ├── old-html/
│   │   ├── 404.html
│   │   ├── about.html
│   │   ├── contact.html
│   │   ├── home.html
│   │   ├── projects.html
│   │   └── index.html (old)
│   ├── temp-reference/
│   └── Engineering Portfolio Website.zip
│
├── portfolio-website/             # ✅ KEEP - Sanity Studio
├── sanity-schemas/                # ✅ KEEP - Schema definitions
├── src/                           # ✅ KEEP - Source code
├── public/                        # ✅ KEEP - Public assets
├── dist/                          # ✅ KEEP - Build output
├── node_modules/                  # ✅ KEEP - Dependencies
│
├── pdfs/                          # ⏳ VERIFY THEN DELETE
├── photos/                        # ⏳ VERIFY THEN DELETE
├── studio/                        # ❌ DELETE (empty)
│
├── .env                           # ✅ KEEP
├── .env.example                   # ✅ KEEP
├── .gitignore                     # ✅ KEEP
├── CNAME                          # ✅ KEEP
├── README.md                      # ✅ KEEP (main readme)
├── package.json                   # ✅ KEEP
├── package-lock.json              # ✅ KEEP
├── vercel.json                    # ✅ KEEP
├── vite.config.js                 # ✅ KEEP
│
├── android-chrome-*.png           # ✅ KEEP (favicons)
├── apple-touch-icon.png           # ✅ KEEP
├── favicon-*.png                  # ✅ KEEP
├── favicon.ico                    # ✅ KEEP
├── site.webmanifest               # ✅ KEEP
├── javascript.svg                 # ❌ DELETE (unused)
└── _config.yml                    # ❌ DELETE (Jekyll, not used)
```

---

## 🗑️ Safe Cleanup Steps

### Step 1: Create Organization Folders
```bash
mkdir -p docs archive/old-html
```

### Step 2: Move Documentation Files
```bash
mv ACCESSIBILITY-REPORT.md docs/
mv CHECKLIST.md docs/
mv CODE-REVIEW.md docs/
mv DEPLOYMENT.md docs/
mv MIGRATION-SUMMARY.md docs/
mv NEW-DESIGN-GUIDE.md docs/
mv PERFORMANCE-OPTIMIZATION.md docs/
mv SANITY-INTEGRATION.md docs/
mv THEME-GUIDE.md docs/
```

### Step 3: Archive Old HTML Files
```bash
mv 404.html archive/old-html/
mv about.html archive/old-html/
mv contact.html archive/old-html/
mv home.html archive/old-html/
mv projects.html archive/old-html/
mv index.html archive/old-html/
```

### Step 4: Archive Reference Materials
```bash
mv temp-reference archive/
mv "Engineering Portfolio Website.zip" archive/
```

### Step 5: Remove Unused Files
```bash
rm -rf studio/              # Empty directory
rm _config.yml              # Jekyll config (not using Jekyll)
rm javascript.svg           # Unused asset
```

### Step 6: After Sanity Verification
```bash
# ONLY after confirming all assets are in Sanity:
rm -rf pdfs/
rm -rf photos/
```

---

## 📝 Update README.md

Add a section to your main README:

```markdown
## 📁 Project Structure

- `/src` - Frontend source code
- `/portfolio-website` - Sanity Studio CMS
- `/sanity-schemas` - Sanity schema definitions
- `/docs` - Project documentation
- `/archive` - Old files kept for reference
- `/public` - Static assets
- `/dist` - Production build output
```

---

## ✅ Benefits After Cleanup

### Before (Current)
```
my-portfolio/          # 38 items in root
├── Mixed docs, HTML, configs
├── Unclear what's active vs archived
└── Hard to navigate
```

### After (Organized)
```
my-portfolio/          # 20 items in root
├── Clear active files
├── Docs organized
├── Old files archived
└── Easy to navigate
```

---

## 🎯 Verification Checklist

Before deleting anything permanently:

- [ ] All Sanity projects have images
- [ ] All PDFs are in Sanity
- [ ] Site works on Vercel deployment
- [ ] Old HTML files aren't referenced anywhere
- [ ] Backup exists (Git commit or zip)

---

## 🚨 Files to NEVER Delete

- `.env` (local environment variables)
- `.env.example` (template for env vars)
- `.gitignore` (Git configuration)
- `package.json` / `package-lock.json`
- `vercel.json` (deployment config)
- `vite.config.js` (build config)
- `CNAME` (custom domain config)
- `/src`, `/portfolio-website`, `/sanity-schemas`
- Favicon files
- `README.md`

---

## 💡 Optional: .gitignore Updates

Add to `.gitignore` after cleanup:
```
# Documentation (optional - if you don't want docs in git)
/docs/*.md

# Archives (keep out of version control)
/archive/
```

---

## 🎉 Expected Result

A clean, organized root directory:
- **Documentation**: All in `/docs`
- **Active Code**: Easy to identify
- **Old Files**: Safely archived in `/archive`
- **Assets**: Only what's needed
- **Easy Navigation**: Clear purpose for each folder

Would you like me to execute this cleanup for you?
