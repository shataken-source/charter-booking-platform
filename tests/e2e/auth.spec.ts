import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should display homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();
  });

  test('should display charter listings', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-testid="charter-card"]').first()).toBeVisible({ timeout: 10000 });
  });
});

