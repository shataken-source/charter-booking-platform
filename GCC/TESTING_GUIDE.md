# E2E Testing Guide with Playwright

## Overview

This project uses Playwright for end-to-end testing with visual regression capabilities. Tests run automatically in the CI/CD pipeline and block deployments if they fail.

## Running Tests Locally

### Install Playwright
```bash
npm install
npx playwright install --with-deps
```

### Run All Tests
```bash
npm run test
```

### Run Tests in Headed Mode (with browser UI)
```bash
npm run test:headed
```

### Run Tests in UI Mode (interactive)
```bash
npm run test:ui
```

### Debug Tests
```bash
npm run test:debug
```

### Run Specific Browser Tests
```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
npm run test:mobile
```

### Update Visual Regression Snapshots
```bash
npm run test:visual
```

### View Test Report
```bash
npm run test:report
```

## Test Structure

### Critical User Flows Covered
1. **Authentication** (`tests/e2e/auth.spec.ts`)
   - Login modal display
   - Form validation
   - Successful login
   - Visual regression for login UI

2. **Booking** (`tests/e2e/booking.spec.ts`)
   - Charter listing display
   - Booking modal interaction
   - Complete booking flow
   - Visual regression for listings

3. **Payment** (`tests/e2e/payment.spec.ts`)
   - Payment page navigation
   - Form field validation
   - Payment processing
   - Visual regression for payment UI

## Visual Regression Testing

Playwright automatically captures screenshots and compares them against baseline images. If differences are detected, tests will fail.

### Updating Baseline Screenshots
When UI changes are intentional:
```bash
npm run test:visual
```

This updates the baseline screenshots in `tests/e2e/*.spec.ts-snapshots/`

## CI/CD Integration

### Staging Deployments
- Tests run on every push to `develop` branch
- Failed tests don't block staging deployment (warning only)
- Test results uploaded as artifacts

### Production Deployments
- Tests run on every push to `main` branch
- **Failed tests BLOCK production deployment**
- Can skip tests with workflow dispatch input (use with caution)

### Pull Requests
- Tests run on all PRs to `main` and `develop`
- Test results posted as PR comments
- PR cannot merge if tests fail

## Writing New Tests

### Basic Test Structure
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/');
    await page.click('button');
    await expect(page.locator('selector')).toBeVisible();
  });
});
```

### Visual Regression Test
```typescript
test('visual regression - component name', async ({ page }) => {
  await page.goto('/page');
  await expect(page).toHaveScreenshot('component-name.png');
});
```

## Best Practices

1. **Use data-testid attributes** for reliable selectors
2. **Wait for elements** before interacting
3. **Test user flows**, not implementation details
4. **Keep tests independent** - each test should work in isolation
5. **Update snapshots carefully** - review visual changes before updating

## Troubleshooting

### Tests Fail Locally But Pass in CI
- Ensure you're using the same Playwright version
- Check viewport sizes match CI configuration
- Run `npx playwright install` to update browsers

### Visual Regression Failures
- Review screenshots in `test-results/`
- Compare with baseline in `tests/e2e/*.spec.ts-snapshots/`
- Update baselines if changes are intentional

### Timeout Errors
- Increase timeout in test: `test.setTimeout(60000)`
- Check if application is slow to load
- Verify network requests complete

## Configuration

Edit `playwright.config.ts` to customize:
- Browser configurations
- Viewport sizes
- Test timeout
- Reporter options
- Base URL
