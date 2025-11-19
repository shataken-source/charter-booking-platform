import { test, expect } from '@playwright/test';

test.describe('Booking Flow', () => {
  test('should display charter listings on homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-testid="charter-card"]').first()).toBeVisible({ timeout: 10000 });
    const charterCount = await page.locator('[data-testid="charter-card"]').count();
    expect(charterCount).toBeGreaterThan(0);
  });

  test('should display charter grid', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-testid="charter-grid"]')).toBeVisible({ timeout: 10000 });
  });
});
