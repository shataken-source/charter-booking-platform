import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000);
  });

  test('homepage hero section', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Wait for hero section with increased timeout
    const heroSection = page.locator('[data-testid="hero-section"]');
    await heroSection.waitFor({ state: 'visible', timeout: 30000 });
    
    await expect(heroSection).toHaveScreenshot('hero-section.png', { 
      maxDiffPixels: 100,
      timeout: 30000
    });
  });

  test('charter listings grid', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Wait for charter grid first
    const grid = page.locator('[data-testid="charter-grid"]');
    await grid.waitFor({ state: 'visible', timeout: 30000 });
    
    // Then wait for at least one charter card
    await page.waitForSelector('[data-testid="charter-card"]', { 
      state: 'visible',
      timeout: 30000 
    });
    
    await expect(grid).toHaveScreenshot('charter-grid.png', {
      maxDiffPixels: 100,
      fullPage: false,
      timeout: 30000
    });
  });
});