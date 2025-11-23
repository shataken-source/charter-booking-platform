#!/usr/bin/env node
// scripts/setup.js
// One-click setup script for Phase 1 testing

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(`
🎣 ================================ 🎣
   GULF COAST CHARTERS SETUP
   Phase 1 Testing Configuration
🎣 ================================ 🎣
`);

const questions = [
  {
    key: 'NEXT_PUBLIC_SUPABASE_URL',
    question: '🗄️  Enter your Supabase URL (or press Enter to skip): ',
    default: ''
  },
  {
    key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    question: '🔑 Enter your Supabase Anon Key (or press Enter to skip): ',
    default: ''
  },
  {
    key: 'SENDGRID_API_KEY',
    question: '📧 Enter your SendGrid API Key (or press Enter to skip): ',
    default: ''
  },
  {
    key: 'NEXT_PUBLIC_STRIPE_PUBLIC_KEY',
    question: '💳 Enter your Stripe Public Key (or press Enter to use test mode): ',
    default: 'pk_test_51234567890abcdefghijklmnop'
  }
];

const config = {};

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question.question, (answer) => {
      config[question.key] = answer || question.default;
      resolve();
    });
  });
}

async function setup() {
  console.log('Welcome! Let\'s set up your fishing charter platform. 🐟\n');
  console.log('You can skip any step and configure later in the admin panel.\n');

  // Ask configuration questions
  for (const q of questions) {
    await askQuestion(q);
  }

  // Create .env.local file
  const envContent = Object.entries(config)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  fs.writeFileSync('.env.local', envContent + '\n');
  console.log('\n✅ Created .env.local file');

  // Install dependencies
  console.log('\n📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed');
  } catch (error) {
    console.log('⚠️  Could not install dependencies. Run "npm install" manually.');
  }

  // Create necessary directories
  const dirs = [
    'public/uploads',
    'public/images',
    'data',
    'logs'
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    }
  });

  // Database setup instructions
  console.log(`
🗄️  DATABASE SETUP
==================
1. Go to https://supabase.com and create a free account
2. Create a new project
3. Go to SQL Editor
4. Copy and paste the contents of database-schema.sql
5. Run the SQL to create all tables

📧 EMAIL SETUP (Optional)
=========================
1. Go to https://sendgrid.com for free email service
2. Or use any SMTP service you prefer
3. Configure in admin panel later

💳 PAYMENT SETUP (Optional)
===========================
1. Go to https://stripe.com for payment processing
2. Use test mode for Phase 1 testing
3. Configure in admin panel later

🌊 WEATHER DATA
===============
No setup needed! NOAA data is free and open.

🎣 READY TO START!
==================
Run these commands:

  npm run dev     # Start development server
  npm run test    # Run tests
  
Then open http://localhost:3000 in your browser.

First time? Go to http://localhost:3000/admin/configuration

Need help? The fish icon 🐟 in the corner is always there!

Happy fishing! 🎣
`);

  rl.close();
}

// Run setup
setup().catch(console.error);
