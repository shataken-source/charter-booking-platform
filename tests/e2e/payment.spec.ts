import { test, expect } from '@playwright/test';

test.describe('Payment Flow', () => {
  test('should display homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();
  });
});
