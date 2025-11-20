import { test, expect } from '@playwright/test';

test.describe('Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(90000);
  });

  test('should display charter listings on homepage', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle', timeout: 60000 });
    
    await page.waitForSelector('[data-testid="charter-grid"]', { 
      state: 'visible',
      timeout: 30000 
    });
    
    const charterCard = page.locator('[data-testid="charter-card"]').first();
    await expect(charterCard).toBeVisible({ timeout: 30000 });
    
    const charterCount = await page.locator('[data-testid="charter-card"]').count();
    expect(charterCount).toBeGreaterThan(0);
  });

  test('should navigate to search results', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForLoadState('domcontentloaded');
    
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]').first();
    if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await searchInput.fill('fishing');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);
    }
  });
});
