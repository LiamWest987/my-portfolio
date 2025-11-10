# Deployment & Environment Management

**Purpose**: Guide for deploying Liam West Portfolio to Vercel and managing environment-specific configurations.

---

## Project Information

- **Project**: Liam West Portfolio
- **Stack**: Vite + Vanilla JavaScript + Sanity CMS
- **Hosting**: Vercel
- **Sanity Studio**: https://40f0qafr.sanity.studio (hosted)
- **Dataset**: portfolio

---

## Deployment Environments

| Environment | Branch | URL Pattern | Auto-Deploy |
|------------|--------|-------------|-------------|
| Production | `main` | https://liamwest.com | ✅ Yes |
| Preview | `feature/*` | https://my-portfolio-git-{branch}.vercel.app | ✅ Yes |
| Local | Any | http://localhost:5173 | ❌ No |

---

## Vercel Configuration

### vercel.json

```json
{
  "redirects": [
    {
      "source": "/:path*",
      "has": [
        {
          "type": "host",
          "value": "studio.(?<domain>.*)"
        }
      ],
      "destination": "https://40f0qafr.sanity.studio/:path*",
      "permanent": false
    }
  ]
}
```

**Purpose**: Redirects `studio.liamwest.com` subdomain to hosted Sanity Studio.

---

## Environment Variables

### Required Variables

```bash
# Sanity Configuration
VITE_SANITY_PROJECT_ID=40f0qafr

# Sanity API Token (for build-time data fetching, if needed)
SANITY_TOKEN={your-token}
```

### Setting Environment Variables

```bash
# Add to Vercel (interactive)
vercel env add VITE_SANITY_PROJECT_ID

# Pull to local .env
vercel env pull .env.local

# List all variables
vercel env ls
```

### Local Development

Create `.env` file in project root:

```bash
VITE_SANITY_PROJECT_ID=40f0qafr
```

**Note**: Vite only exposes variables prefixed with `VITE_` to the client.

---

## Deployment Commands

### Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Link project (first time)
vercel link

# Deploy preview
vercel

# Deploy to production
vercel --prod

# View recent deployments
vercel ls

# Check deployment status
vercel inspect {deployment-url}

# View logs
vercel logs {deployment-url}
```

### Git-based Deployment (Recommended)

```bash
# Push to main = production deployment
git push origin main

# Push to feature branch = preview deployment
git checkout -b feature/new-feature
git push origin feature/new-feature
```

---

## Build Configuration

### Vite Build

```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

**Build Output**: `/dist` directory

### Vercel Settings

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

---

## Deployment Workflow

### 1. Local Development

```bash
# Start dev server
npm run dev

# Verify changes at http://localhost:5173
```

### 2. Preview Deployment (Feature Branch)

```bash
# Create feature branch
git checkout -b feature/new-project

# Make changes and commit
git add .
git commit -m "Add new project to portfolio"

# Push to create preview deployment
git push origin feature/new-project

# Vercel automatically deploys preview
# URL: https://my-portfolio-git-feature-new-project.vercel.app
```

### 3. Production Deployment

```bash
# Merge to main
git checkout main
git merge feature/new-project
git push origin main

# Vercel automatically deploys to production
# URL: https://liamwest.com
```

---

## Sanity Studio Deployment

### Studio is Hosted by Sanity

- **URL**: https://40f0qafr.sanity.studio
- **Subdomain**: https://studio.liamwest.com (via redirect in vercel.json)

### Deploying Studio Updates

```bash
# Navigate to studio directory
cd portfolio-website

# Deploy to Sanity hosting
npm run deploy
```

**Note**: Studio runs independently from the main website. Schema changes are reflected immediately without redeploying the website.

---

## Troubleshooting

### Build Failures

**Check build logs**:
```bash
vercel logs {deployment-url}
```

**Common issues**:
1. Missing environment variables
2. Import errors (check paths)
3. Build script errors

**Solution**: Verify locally first with `npm run build`

### Environment Variables Not Working

**Check**:
1. Variable is prefixed with `VITE_` for client-side access
2. Variable is set in Vercel dashboard or via CLI
3. Redeploy after adding variables

**Verify**:
```javascript
console.log(import.meta.env.VITE_SANITY_PROJECT_ID)
```

### Sanity Content Not Updating

**Check**:
1. Content is published (not draft) in Studio
2. CDN cache: `useCdn: false` in development
3. Query is correct in `src/js/sanity.js`

**Force refresh**:
```javascript
// Temporarily disable CDN
export const client = createClient({
  projectId: '40f0qafr',
  dataset: 'portfolio',
  useCdn: false, // Disable CDN for fresh data
  apiVersion: '2024-01-01',
});
```

### Studio Subdomain Not Working

**Check vercel.json**:
```json
{
  "redirects": [
    {
      "source": "/:path*",
      "has": [{"type": "host", "value": "studio.(?<domain>.*)"}],
      "destination": "https://40f0qafr.sanity.studio/:path*",
      "permanent": false
    }
  ]
}
```

**Verify**: Visit https://studio.liamwest.com

---

## Performance Optimization

### Vite Build Optimization

```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['@sanity/client']
        }
      }
    }
  }
}
```

### Image Optimization

Use Sanity's image transforms:

```javascript
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(client)

function urlFor(source) {
  return builder.image(source)
}

// Usage with optimization
urlFor(project.image)
  .width(800)
  .format('webp')
  .quality(80)
  .url()
```

### CDN Caching

```javascript
// Enable CDN in production
export const client = createClient({
  projectId: '40f0qafr',
  dataset: 'portfolio',
  useCdn: import.meta.env.PROD, // true in production
  apiVersion: '2024-01-01',
});
```

---

## Monitoring

### Vercel Dashboard

- **Analytics**: View page visits, performance metrics
- **Logs**: Real-time function logs
- **Deployments**: History of all deployments

### Sanity Studio

- **Usage**: Monitor API requests
- **Activity**: See content changes
- **Access**: Manage user permissions

---

## Best Practices

### 1. Environment Variables

- ✅ Use `VITE_` prefix for client-side variables
- ✅ Keep sensitive tokens in Vercel dashboard
- ✅ Never commit `.env` files to git
- ✅ Use different tokens for dev/prod

### 2. Git Workflow

- ✅ Use feature branches for new work
- ✅ Test in preview deployments first
- ✅ Merge to main only when ready
- ✅ Write clear commit messages

### 3. Performance

- ✅ Enable CDN in production
- ✅ Optimize images with Sanity transforms
- ✅ Use code splitting in Vite
- ✅ Minimize bundle size

### 4. Content Management

- ✅ Always publish in Studio (not drafts)
- ✅ Test queries in Vision tool first
- ✅ Keep content fresh and updated
- ✅ Use featured flag thoughtfully

---

## Deployment Checklist

Before deploying to production:

- [ ] All environment variables set in Vercel
- [ ] Build succeeds locally (`npm run build`)
- [ ] Preview deployment tested and verified
- [ ] Sanity content published (not drafts)
- [ ] Images optimized and loading correctly
- [ ] Links and navigation working
- [ ] Theme switching functioning
- [ ] Mobile responsive
- [ ] Accessibility checked
- [ ] Git history clean
- [ ] Commit messages clear

---

## Related Skills

- [Sanity Studio](./sanity-studio.md) - Content management
- [Sanity Query](./sanity-query.md) - Data fetching
- [Theme & Brand](./theme-and-brand.md) - Styling system

---

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Sanity Deployment](https://www.sanity.io/docs/deployment)

---

## Version History

- **v2.0.0** (2025-01): Updated for Liam West Portfolio (Vite + Vanilla JS)
- **v1.0.0** (2024): Initial deployment guide
