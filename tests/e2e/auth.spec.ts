import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should display login modal when clicking login button', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Login")');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('should show validation errors for invalid credentials', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Login")');
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', '123');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=/invalid|error/i')).toBeVisible();
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Login")');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=/dashboard|profile|welcome/i')).toBeVisible({ timeout: 10000 });
  });

  test('visual regression - login modal', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Login")');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page).toHaveScreenshot('login-modal.png');
  });
});
