import { test, expect } from '@playwright/test';

test.describe('Payment Flow', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(90000);
  });

  test('should load payment success page', async ({ page }) => {
    await page.goto('/payment-success', { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('body')).toBeVisible({ timeout: 30000 });
  });

  test('should load payment history page', async ({ page }) => {
    await page.goto('/payment-history', { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('body')).toBeVisible({ timeout: 30000 });
  });
});
