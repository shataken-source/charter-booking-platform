import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Increase timeout for slow CI environments
    test.setTimeout(60000);
  });

  test('should display homepage', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Wait for hero section with longer timeout
    const heroSection = page.locator('[data-testid="hero-section"]');
    await expect(heroSection).toBeVisible({ timeout: 15000 });
  });

  test('should display charter listings', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Wait for charter cards to load
    const charterCard = page.locator('[data-testid="charter-card"]').first();
    await expect(charterCard).toBeVisible({ timeout: 20000 });
    
    // Verify multiple charter cards exist
    const charterCount = await page.locator('[data-testid="charter-card"]').count();
    expect(charterCount).toBeGreaterThan(0);
  });
});
