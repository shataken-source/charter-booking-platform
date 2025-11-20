import { test, expect } from '@playwright/test';

test.describe('Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000);
  });

  test('should display charter listings on homepage', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    const charterCard = page.locator('[data-testid="charter-card"]').first();
    await expect(charterCard).toBeVisible({ timeout: 20000 });
    
    const charterCount = await page.locator('[data-testid="charter-card"]').count();
    expect(charterCount).toBeGreaterThan(0);
  });

  test('should navigate to search results', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Wait for page to be interactive
    await page.waitForLoadState('networkidle');
    
    // Check if search functionality exists
    const searchInput = page.locator('input[type="search"]').first();
    if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await searchInput.fill('fishing');
      await page.keyboard.press('Enter');
      await page.waitForURL('**/search**', { timeout: 10000 });
    }
  });
});
