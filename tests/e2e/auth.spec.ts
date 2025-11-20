import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Increase timeout for slow CI environments
    test.setTimeout(90000);
    
    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Browser console error:', msg.text());
      }
    });
    
    // Listen for page errors
    page.on('pageerror', error => {
      console.log('Page error:', error.message);
    });
  });

  test('should display homepage', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle', timeout: 60000 });
    
    // Wait for React to mount
    await page.waitForSelector('body', { timeout: 30000 });
    
    // Wait for hero section with longer timeout
    const heroSection = page.locator('[data-testid="hero-section"]');
    await expect(heroSection).toBeVisible({ timeout: 30000 });
    
    // Verify page title
    await expect(page).toHaveTitle(/Gulf Charter Finder/);
  });

  test('should display charter listings', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle', timeout: 60000 });
    
    // Wait for React to mount
    await page.waitForSelector('body', { timeout: 30000 });
    
    // Wait for charter grid to appear
    const charterGrid = page.locator('[data-testid="charter-grid"]');
    await expect(charterGrid).toBeVisible({ timeout: 30000 });
    
    // Wait for charter cards to load
    const charterCard = page.locator('[data-testid="charter-card"]').first();
    await expect(charterCard).toBeVisible({ timeout: 30000 });
    
    // Verify multiple charter cards exist
    const charterCount = await page.locator('[data-testid="charter-card"]').count();
    expect(charterCount).toBeGreaterThan(0);
  });
});
