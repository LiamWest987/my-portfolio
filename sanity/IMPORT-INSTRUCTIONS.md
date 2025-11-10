# Import Projects to Sanity

## Option 1: Get API Token and Run Script

1. **Create a Sanity API Token:**
   - The browser should have opened: https://www.sanity.io/manage/project/40f0qafr
   - Go to **API** → **Tokens**
   - Click **Add API token**
   - Name: `Import Script`
   - Permissions: **Editor**
   - Copy the token

2. **Run the import script:**
   ```bash
   cd portfolio-website
   SANITY_TOKEN=your-token-here node import-projects.mjs
   ```

## Option 2: Use Sanity CLI (Simpler)

Create a token as above, then:

```bash
cd portfolio-website
export SANITY_TOKEN=your-token-here
node import-projects.mjs
```

The script will:
- Upload all 15 project images
- Upload all PDFs
- Create all 15 project documents
- Link everything together

This should take about 1-2 minutes to complete.
