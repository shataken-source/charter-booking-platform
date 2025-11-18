import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('homepage hero section', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="hero-section"]');
    await expect(page.locator('[data-testid="hero-section"]')).toHaveScreenshot('hero-section.png');
  });

  test('charter listings grid', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="charter-card"]');
    const grid = page.locator('[data-testid="charter-grid"]');
    await expect(grid).toHaveScreenshot('charter-grid.png');
  });

  test('navigation header', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header')).toHaveScreenshot('header.png');
  });

  test('footer', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.locator('footer')).toHaveScreenshot('footer.png');
  });

  test('mobile responsive - charter card', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForSelector('[data-testid="charter-card"]');
    await expect(page.locator('[data-testid="charter-card"]').first()).toHaveScreenshot('mobile-charter-card.png');
  });

  test('tablet responsive - homepage', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await expect(page).toHaveScreenshot('tablet-homepage.png', { fullPage: true });
  });
});
