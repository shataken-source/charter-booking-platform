import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000);
  });

  test('homepage hero section', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-testid="hero-section"]', { timeout: 15000 });
    
    const heroSection = page.locator('[data-testid="hero-section"]');
    await expect(heroSection).toHaveScreenshot('hero-section.png', { 
      maxDiffPixels: 100 
    });
  });

  test('charter listings grid', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-testid="charter-card"]', { timeout: 20000 });
    
    const grid = page.locator('[data-testid="charter-grid"]');
    if (await grid.isVisible().catch(() => false)) {
      await expect(grid).toHaveScreenshot('charter-grid.png', { 
        maxDiffPixels: 200 
      });
    }
  });
});
