import { test, expect } from '@playwright/test';

test.describe('Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display charter listings on homepage', async ({ page }) => {
    await expect(page.locator('[data-testid="charter-card"]').first()).toBeVisible();
    const charterCount = await page.locator('[data-testid="charter-card"]').count();
    expect(charterCount).toBeGreaterThan(0);
  });

  test('should open booking modal when clicking book button', async ({ page }) => {
    await page.locator('[data-testid="charter-card"]').first().click();
    await page.click('button:has-text("Book Now")');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('text=/select date|choose date/i')).toBeVisible();
  });

  test('should complete booking flow', async ({ page }) => {
    // Select a charter
    await page.locator('[data-testid="charter-card"]').first().click();
    await page.click('button:has-text("Book Now")');
    
    // Fill booking form
    await page.locator('input[type="date"]').first().fill('2025-12-01');
    await page.fill('input[placeholder*="guests" i]', '4');
    await page.fill('input[type="email"]', 'customer@example.com');
    await page.fill('input[placeholder*="name" i]', 'John Doe');
    
    // Submit booking
    await page.click('button[type="submit"]');
    await expect(page.locator('text=/success|confirmed/i')).toBeVisible({ timeout: 10000 });
  });

  test('visual regression - charter listing page', async ({ page }) => {
    await page.waitForSelector('[data-testid="charter-card"]');
    await expect(page).toHaveScreenshot('charter-listings.png', { fullPage: true });
  });
});
