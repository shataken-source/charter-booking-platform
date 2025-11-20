#!/usr/bin/env node

/**
 * Gulf Coast Charters - Developer Setup Script
 * Automated onboarding process for new developers
 * 
 * Usage: npm run setup
 * 
 * This script:
 * - Checks Node.js version
 * - Verifies dependencies
 * - Checks for .env file
 * - Provides setup instructions
 * - Opens developer onboarding page
 */

import { exec } from 'child_process';
import { existsSync } from 'fs';
import { promisify } from 'util';

const execAsync = promisify(exec);

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bright}${colors.blue}${msg}${colors.reset}\n`)
};

async function checkNodeVersion() {
  log.header('Checking Node.js Version');
  const version = process.version;
  const major = parseInt(version.slice(1).split('.')[0]);
  
  if (major >= 18) {
    log.success(`Node.js ${version} detected`);
    return true;
  } else {
    log.error(`Node.js ${version} is too old. Please upgrade to v18 or higher`);
    return false;
  }
}

async function checkDependencies() {
  log.header('Checking Dependencies');
  
  if (!existsSync('node_modules')) {
    log.warning('Dependencies not installed');
    log.info('Installing dependencies...');
    try {
      await execAsync('npm install');
      log.success('Dependencies installed successfully');
    } catch (error) {
      log.error('Failed to install dependencies');
      return false;
    }
  } else {
    log.success('Dependencies already installed');
  }
  return true;
}

async function checkEnvFile() {
  log.header('Checking Environment Configuration');
  
  if (!existsSync('.env')) {
    log.warning('.env file not found');
    log.info('Creating .env from .env.example...');
    
    if (existsSync('.env.example')) {
      try {
        await execAsync('cp .env.example .env');
        log.success('.env file created');
        log.warning('Please update .env with your Supabase credentials');
      } catch (error) {
        log.error('Failed to create .env file');
        return false;
      }
    }
  } else {
    log.success('.env file exists');
  }
  return true;
}

function printNextSteps() {
  log.header('Setup Complete! 🎉');
  
  console.log(`
${colors.bright}Next Steps:${colors.reset}

1. ${colors.green}Configure Environment${colors.reset}
   Edit .env file with your Supabase credentials:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY

2. ${colors.green}Start Development Server${colors.reset}
   ${colors.blue}npm run dev${colors.reset}

3. ${colors.green}Visit Developer Onboarding${colors.reset}
   Open: ${colors.blue}http://localhost:5173/developer-onboarding${colors.reset}
   
   The onboarding page includes:
   • Interactive setup wizard
   • Guided code tour
   • Video tutorials
   • AI troubleshooting assistant

${colors.bright}Useful Commands:${colors.reset}
  npm run dev          - Start development server
  npm run build        - Build for production
  npm run lint         - Run ESLint
  npm run preview      - Preview production build

${colors.bright}Documentation:${colors.reset}
  • DEVELOPER_RESOURCES.md - All URLs and API references
  • README.md - Project overview
  • DEPLOYMENT_GUIDE.md - Deployment instructions

${colors.bright}Need Help?${colors.reset}
  Visit /developer-onboarding and use the AI assistant!
  `);
}

async function main() {
  console.log(`
${colors.bright}${colors.blue}╔═══════════════════════════════════════════════╗
║   Gulf Coast Charters - Developer Setup      ║
║   Interactive Onboarding System              ║
╚═══════════════════════════════════════════════╝${colors.reset}
  `);

  const checks = [
    checkNodeVersion(),
    checkDependencies(),
    checkEnvFile()
  ];

  const results = await Promise.all(checks);
  const allPassed = results.every(r => r);

  if (allPassed) {
    printNextSteps();
    process.exit(0);
  } else {
    log.error('Setup incomplete. Please fix the errors above and run again.');
    process.exit(1);
  }
}

main().catch(error => {
  log.error(`Setup failed: ${error.message}`);
  process.exit(1);
});