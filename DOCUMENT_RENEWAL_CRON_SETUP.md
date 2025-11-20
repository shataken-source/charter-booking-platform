# Document Renewal Reminder System - Setup Guide

## Overview
Automated email system that sends renewal reminders to captains 30, 14, and 7 days before document expiration.

## Edge Function Created
- **Function Name**: `document-renewal-cron`
- **Purpose**: Daily cron job to check expiring documents and send email reminders
- **Email Provider**: SendGrid (SENDGRID_API_KEY already configured)

## Features
✅ Automatic daily checks for expiring documents
✅ Sends reminders at 30, 14, and 7 days before expiration
✅ Beautiful HTML email template with document details
✅ Direct link to upload renewed documents
✅ Tracks which reminders were sent
✅ Works with existing captain_documents table

## Email Template Includes
- Captain's name (personalized)
- Document type (USCG License, Insurance, etc.)
- Exact expiration date
- Days until expiration
- Urgency indicator (URGENT for 7 days or less)
- Direct "Upload Renewed Document" button
- Information about what happens if document expires

## Setting Up the Cron Job

### Option 1: Supabase Cron (Recommended)
Run this SQL in your Supabase SQL Editor:

\`\`\`sql
-- Create pg_cron extension if not exists
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule daily check at 9 AM UTC
SELECT cron.schedule(
  'document-renewal-reminders',
  '0 9 * * *', -- Every day at 9 AM UTC
  $$
  SELECT net.http_post(
    url := 'https://api.databasepad.com/functions/v1/document-renewal-cron',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SUPABASE_ANON_KEY"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);
\`\`\`

### Option 2: External Cron Service
Use services like:
- **Cron-job.org** (free)
- **EasyCron** (free tier available)
- **GitHub Actions** (see below)

Configure to call:
- **URL**: `https://api.databasepad.com/functions/v1/document-renewal-cron`
- **Method**: POST
- **Schedule**: Daily at 9 AM
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_SUPABASE_ANON_KEY`

### Option 3: GitHub Actions Cron
Create `.github/workflows/document-renewal-cron.yml`:

\`\`\`yaml
name: Document Renewal Reminders

on:
  schedule:
    - cron: '0 9 * * *'  # Daily at 9 AM UTC
  workflow_dispatch:  # Allow manual trigger

jobs:
  send-reminders:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Document Renewal Check
        run: |
          curl -X POST \
            https://api.databasepad.com/functions/v1/document-renewal-cron \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}"
\`\`\`

## Testing the System

### Manual Test
Call the edge function directly:

\`\`\`bash
curl -X POST https://api.databasepad.com/functions/v1/document-renewal-cron \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY"
\`\`\`

### Test with Sample Data
1. Go to Captain Dashboard → Documents tab
2. Upload a document with expiration date 30 days from now
3. Run the cron function manually
4. Check email for renewal reminder

## Email Customization
To customize the email template, update the `emailHtml` variable in the `document-renewal-cron` function:
- Change colors in the `<style>` section
- Modify text content
- Update the upload link URL
- Add your company logo

## Monitoring
The function returns:
\`\`\`json
{
  "success": true,
  "reminders_sent": 5,
  "details": [
    {
      "captain_email": "captain@example.com",
      "document_type": "USCG License",
      "days_until_expiration": 30,
      "sent": true
    }
  ]
}
\`\`\`

## Troubleshooting

### Emails Not Sending
1. Verify SENDGRID_API_KEY is set in Supabase Edge Function secrets
2. Check SendGrid dashboard for email delivery status
3. Verify captain email addresses in database
4. Check function logs in Supabase dashboard

### Cron Not Running
1. Verify cron job is scheduled correctly
2. Check cron service logs
3. Test function manually to ensure it works
4. Verify authorization token is valid

## Database Requirements
Ensure `captain_documents` table has:
- `expiration_date` column (timestamp)
- Foreign key to `captains` table
- Captain email accessible via join

## Next Steps
1. Set up cron job using one of the options above
2. Test with sample documents
3. Monitor email delivery for first week
4. Adjust timing if needed (e.g., send at different hour)
5. Add additional reminder intervals if desired (60 days, 3 days, etc.)

## Support
For issues or questions:
- Check Supabase function logs
- Review SendGrid delivery reports
- Test function manually first
- Verify all environment variables are set
