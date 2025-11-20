# 🚀 Deployment Guide - Gulf Coast Charters

## Quick Deploy to Vercel (5 minutes)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/gulf-coast-charters.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" (use GitHub login)
3. Click "Add New Project"
4. Import your GitHub repository
5. Vercel auto-detects Vite settings ✓

### Step 3: Add Environment Variables
In Vercel dashboard → Settings → Environment Variables:
```
VITE_SUPABASE_URL = your_supabase_project_url
VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
```

### Step 4: Deploy
- Click "Deploy"
- Wait 2 minutes
- Your site is live! 🎉

## Your Live URL
`https://gulf-coast-charters.vercel.app`

## Auto-Deploy
Every git push automatically deploys!

---

## Alternative: Netlify

### Quick Deploy
1. Go to [netlify.com](https://netlify.com)
2. Drag & drop your `dist` folder
3. Add environment variables in Site Settings
4. Done!

---

## Troubleshooting

**Build fails?**
- Check environment variables are set
- Ensure Node version 18+ in settings

**404 errors?**
- vercel.json handles this (already configured)

**Need help?** Check Vercel docs or contact support
