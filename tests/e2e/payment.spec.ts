import { test, expect } from '@playwright/test';

test.describe('Payment Flow', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000);
  });

  test('should display homepage', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    const heroSection = page.locator('[data-testid="hero-section"]');
    await expect(heroSection).toBeVisible({ timeout: 15000 });
  });

  test('should have payment-related elements', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Check if any charter cards have pricing information
    const charterCard = page.locator('[data-testid="charter-card"]').first();
    await expect(charterCard).toBeVisible({ timeout: 20000 });
    
    // Verify pricing elements exist
    const priceElements = page.locator('text=/\\$\\d+/').first();
    await expect(priceElements).toBeVisible({ timeout: 10000 });
  });
});
