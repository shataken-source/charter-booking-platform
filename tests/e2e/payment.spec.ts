import { test, expect } from '@playwright/test';

test.describe('Payment Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to payment page after booking', async ({ page }) => {
    await page.locator('[data-testid="charter-card"]').first().click();
    await page.click('button:has-text("Book Now")');
    
    await page.locator('input[type="date"]').first().fill('2025-12-01');
    await page.fill('input[placeholder*="guests" i]', '4');
    await page.click('button:has-text("Continue to Payment")');
    
    await expect(page.locator('text=/payment|checkout/i')).toBeVisible();
  });

  test('should display payment form with required fields', async ({ page }) => {
    await page.goto('/payment');
    await expect(page.locator('input[placeholder*="card number" i]')).toBeVisible();
    await expect(page.locator('input[placeholder*="expiry" i]')).toBeVisible();
    await expect(page.locator('input[placeholder*="cvv" i]')).toBeVisible();
  });

  test('should validate payment form inputs', async ({ page }) => {
    await page.goto('/payment');
    await page.fill('input[placeholder*="card number" i]', '1234');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=/invalid|error/i')).toBeVisible();
  });

  test('visual regression - payment page', async ({ page }) => {
    await page.goto('/payment');
    await expect(page).toHaveScreenshot('payment-page.png', { fullPage: true });
  });
});
