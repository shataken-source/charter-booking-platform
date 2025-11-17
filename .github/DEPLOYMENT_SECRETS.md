# GitHub Secrets Configuration

## Required Secrets for CI/CD

Add these secrets in your GitHub repository: **Settings → Secrets and variables → Actions → New repository secret**

### Supabase Environment Variables
```
VITE_SUPABASE_URL
Value: https://xzdzmeaxbjvntuqeommq.supabasepad.com

VITE_SUPABASE_ANON_KEY
Value: [Your Supabase anon key from src/lib/supabase.ts]
```

### Vercel Deployment (for ci-cd.yml)
```
VERCEL_TOKEN
Get from: https://vercel.com/account/tokens

VERCEL_ORG_ID
Get from: Vercel project settings → General

VERCEL_PROJECT_ID
Get from: Vercel project settings → General
```

### Netlify Deployment (for deploy-netlify.yml)
```
NETLIFY_AUTH_TOKEN
Get from: https://app.netlify.com/user/applications/personal

NETLIFY_SITE_ID
Get from: Netlify site settings → Site details → Site ID
```

## Setup Instructions

1. **Push to GitHub first**
2. **Go to repository Settings → Secrets**
3. **Add each secret one by one**
4. **Workflows will run automatically on next push/PR**

## Testing Workflows

- **Pull Request**: Opens PR → Runs tests & build validation
- **Push to main**: Merges to main → Runs tests + deploys
- **Manual trigger**: Actions tab → Select workflow → Run workflow
