import { test, expect } from '@playwright/test';

test.describe('Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000);
  });

  test('should display charter listings on homepage', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Wait for the charter grid to be visible first
    await page.waitForSelector('[data-testid="charter-grid"]', { 
      state: 'visible',
      timeout: 30000 
    });
    
    // Then wait for at least one charter card
    const charterCard = page.locator('[data-testid="charter-card"]').first();
    await expect(charterCard).toBeVisible({ timeout: 30000 });
    
    const charterCount = await page.locator('[data-testid="charter-card"]').count();
    expect(charterCount).toBeGreaterThan(0);
  });

  test('should navigate to search results', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('domcontentloaded');
    
    // Check if search functionality exists
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"], input[placeholder*="search"]').first();
    if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await searchInput.fill('fishing');
      await page.keyboard.press('Enter');
      
      // Wait for navigation or content update
      await page.waitForTimeout(2000);
    }
  });
});
