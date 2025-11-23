# 🚀 DEPLOYMENT GUIDE - Gulf Coast Charters Platform

## Complete Setup & Deployment Instructions

---

## ✅ PRE-DEPLOYMENT CHECKLIST

Before starting, ensure you have:
- [ ] Node.js 18+ installed
- [ ] Supabase account created
- [ ] SendGrid account (for emails)
- [ ] Stripe account (for payments)
- [ ] Domain name ready
- [ ] 2-3 hours for complete setup

---

## 📋 QUICK START (15 Minutes)

### 1. Clone/Download All Files
```bash
# Create project directory
mkdir gulf-coast-charters
cd gulf-coast-charters

# Copy all provided files here
# - All .js and .jsx files
# - package.json
# - database-schema.sql
# - All documentation files
```

### 2. Run Automatic Setup
```bash
# Install dependencies and configure
npm install
node setup.js
```

### 3. Deploy Database
```sql
-- Go to Supabase SQL Editor
-- Copy and paste entire database-schema.sql
-- Click "Run"
```

### 4. Start Development Server
```bash
npm run dev
# Open http://localhost:3000
```

---

## 🔧 DETAILED SETUP STEPS

### Step 1: Supabase Configuration

1. **Create Supabase Project**
   - Go to [app.supabase.com](https://app.supabase.com)
   - Click "New Project"
   - Name: "gulf-coast-charters"
   - Database Password: (save this!)
   - Region: Choose closest to your users

2. **Get API Keys**
   - Settings → API
   - Copy:
     - Project URL
     - Anon/Public Key
     - Service Role Key (keep secret!)

3. **Setup Database**
   - SQL Editor → New Query
   - Paste `database-schema.sql`
   - Run query
   - Check Table Editor - should see 20+ tables

4. **Add Configuration Table**
```sql
-- Add this table for storing admin configuration
CREATE TABLE IF NOT EXISTS public.platform_configuration (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    configuration JSONB NOT NULL,
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default configuration
INSERT INTO public.platform_configuration (configuration) 
VALUES ('{
  "apiKeys": {},
  "emailSettings": {
    "SMTP_HOST": "smtp.sendgrid.net",
    "FROM_EMAIL": "alerts@gulfcoastcharters.com"
  },
  "weatherSettings": {
    "WIND_SPEED_WARNING": 20,
    "WIND_SPEED_DANGER": 28,
    "WAVE_HEIGHT_WARNING": 4,
    "WAVE_HEIGHT_DANGER": 6
  },
  "platformSettings": {
    "PLATFORM_NAME": "Gulf Coast Charters",
    "COMMISSION_RATE": 8.0
  }
}'::jsonb)
ON CONFLICT (id) DO NOTHING;
```

5. **Enable Realtime**
   - Database → Replication
   - Enable tables:
     - user_locations
     - notifications
     - fishing_reports

6. **Setup Authentication**
   - Authentication → Providers
   - Enable Email/Password
   - Configure email templates

### Step 2: Edge Functions Deployment

1. **Install Supabase CLI**
```bash
npm install -g supabase
supabase login
```

2. **Link Project**
```bash
supabase link --project-ref YOUR_PROJECT_ID
```

3. **Deploy Weather Alerts Function**
```bash
# Create function
supabase functions new weather-alerts

# Copy weather-alerts.js to:
# supabase/functions/weather-alerts/index.ts

# Deploy
supabase functions deploy weather-alerts

# Set secrets
supabase secrets set SENDGRID_API_KEY=your_key
supabase secrets set SMTP_PASSWORD=your_password
```

4. **Setup Cron Job**
   - Go to Supabase Dashboard
   - Database → Extensions
   - Enable pg_cron
   - SQL Editor:
```sql
-- Schedule hourly weather checks
SELECT cron.schedule(
  'weather-alerts',
  '0 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://YOUR_PROJECT.supabase.co/functions/v1/weather-alerts',
    headers := jsonb_build_object(
      'Authorization', 'Bearer YOUR_ANON_KEY',
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object('check_all', true)
  );
  $$
);
```

### Step 3: Email Configuration (SendGrid)

1. **Create SendGrid Account**
   - Sign up at [sendgrid.com](https://sendgrid.com)
   - Verify email address
   - Create API Key (Full Access)

2. **Setup Sender Verification**
   - Settings → Sender Authentication
   - Single Sender Verification
   - Add: alerts@yourdomain.com

3. **Configure Templates** (Optional)
   - Email API → Dynamic Templates
   - Create templates for:
     - Weather Alerts
     - Booking Confirmations
     - Welcome Emails

### Step 4: Payment Setup (Stripe)

1. **Create Stripe Account**
   - Sign up at [stripe.com](https://stripe.com)
   - Complete business verification

2. **Get API Keys**
   - Developers → API Keys
   - Copy Publishable and Secret keys

3. **Setup Webhooks**
   - Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/stripe-webhook`
   - Events to listen:
     - payment_intent.succeeded
     - payment_intent.failed

### Step 5: Application Configuration

1. **Environment Variables**
   Create `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx

# Email
SENDGRID_API_KEY=xxxxx
FROM_EMAIL=alerts@gulfcoastcharters.com
REPLY_TO_EMAIL=support@gulfcoastcharters.com

# Payments
STRIPE_PUBLIC_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Weather
NOAA_PRIMARY_STATION=42012
NOAA_BACKUP_STATION=42040

# App
NEXT_PUBLIC_APP_URL=https://gulfcoastcharters.com
```

2. **Install Dependencies**
```bash
npm install
```

3. **Run Compilation Check**
```bash
node compile-check.js
# Fix any errors shown
```

### Step 6: Testing

1. **Local Testing**
```bash
npm run dev
# Test all features locally
```

2. **Create Test Accounts**
   - Regular User
   - Captain Account
   - Admin Account

3. **Test Critical Paths**
   - Book a trip
   - Receive weather alert
   - Earn points
   - Share location

### Step 7: Production Deployment

#### Option A: Vercel (Recommended)

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_URL
git push -u origin main
```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import GitHub repository
   - Add environment variables
   - Deploy

3. **Configure Domain**
   - Settings → Domains
   - Add your domain
   - Update DNS records

#### Option B: Self-Hosted

1. **Build Application**
```bash
npm run build
```

2. **Setup Server**
   - Ubuntu 22.04 LTS recommended
   - Install Node.js 18+
   - Install PM2: `npm install -g pm2`

3. **Deploy**
```bash
# Copy files to server
scp -r * user@server:/var/www/charter

# On server
cd /var/www/charter
npm install --production
npm run build
pm2 start npm --name "charter" -- start
pm2 save
pm2 startup
```

4. **Setup Nginx**
```nginx
server {
    listen 80;
    server_name gulfcoastcharters.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. **SSL Certificate**
```bash
sudo certbot --nginx -d gulfcoastcharters.com
```

### Step 8: Admin Configuration

1. **Access Admin Panel**
   - Go to: https://yourdomain.com/admin
   - Login with admin account

2. **Configure Settings**
   - API Keys
   - Weather thresholds
   - Commission rates
   - Feature flags

3. **Test Everything**
   - Click "Test All Systems"
   - Verify all green checkmarks

### Step 9: Launch Preparation

1. **Security Checklist**
   - [ ] All API keys in environment variables
   - [ ] Database RLS policies enabled
   - [ ] SSL certificate active
   - [ ] Rate limiting configured
   - [ ] Backup system in place

2. **Content Setup**
   - [ ] Add captain profiles
   - [ ] Create trip offerings
   - [ ] Set pricing
   - [ ] Add photos
   - [ ] Write Terms of Service
   - [ ] Privacy Policy

3. **Testing Phase 1**
   - Share with 5-10 friends
   - Give them testing guide
   - Collect feedback for 1 week
   - Fix critical bugs

4. **Soft Launch**
   - Open to 50-100 users
   - Monitor for issues
   - Gather feedback
   - Iterate and improve

5. **Full Launch**
   - Marketing campaign
   - Social media announcement
   - Local advertising
   - Captain onboarding

---

## 🔧 TROUBLESHOOTING

### Common Issues

**"Module not found" errors**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Database connection issues**
- Check Supabase service is running
- Verify API keys are correct
- Check network/firewall settings

**Email not sending**
- Verify SendGrid API key
- Check sender verification
- Look at function logs

**Build fails**
```bash
# Clear cache
rm -rf .next
npm run build
```

---

## 📊 MONITORING

### Setup Monitoring

1. **Supabase Dashboard**
   - Monitor API usage
   - Check database performance
   - Review function logs

2. **Error Tracking**
```bash
npm install @sentry/nextjs
# Configure Sentry for error tracking
```

3. **Analytics**
```html
<!-- Add to pages/_app.js -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

4. **Uptime Monitoring**
   - Use UptimeRobot or Pingdom
   - Monitor critical endpoints
   - Set up alerts

---

## 🎯 GO-LIVE CHECKLIST

### 24 Hours Before Launch
- [ ] Final testing complete
- [ ] Backup database
- [ ] Test payment processing
- [ ] Verify email delivery
- [ ] Check all API integrations

### Launch Day
- [ ] Enable production mode
- [ ] Remove test data
- [ ] Activate monitoring
- [ ] Post on social media
- [ ] Send launch email

### Post-Launch (First Week)
- [ ] Monitor error logs daily
- [ ] Respond to user feedback
- [ ] Fix critical bugs immediately
- [ ] Daily database backups
- [ ] Track key metrics

---

## 📞 SUPPORT RESOURCES

### Documentation
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Stripe Docs: https://stripe.com/docs
- SendGrid Docs: https://docs.sendgrid.com

### Community Support
- GitHub Issues: [your-repo]/issues
- Discord: [your-discord-invite]
- Email: support@gulfcoastcharters.com

### Emergency Contacts
- Technical Lead: [Name] - [Phone]
- Database Admin: [Name] - [Phone]
- On-Call Dev: [Name] - [Phone]

---

## 🎉 CONGRATULATIONS!

You've successfully deployed Gulf Coast Charters! 

Remember:
- Start small with Phase 1 testing
- Listen to user feedback
- Iterate quickly
- Keep safety features free
- Make it simple for everyone

**Happy Fishing! 🎣**

---

*Last Updated: November 2024*
*Version: 1.0.0*
