import { test, expect } from '@fixtures/swaglabs-fixtures';
import AxeBuilder from '@axe-core/playwright';

test.use({ userRole: 'standard_user', authStrategy: 'fast_injection' });

test('Catalog_Accessibility_WCAG: Product catalog conforms to WCAG accessibility standards', async ({
  page,
  inventoryPage,
}) => {
  await test.step('1. Ensure inventory catalog is fully loaded', async () => {
    await inventoryPage.assertIsLoaded();
  });

  await test.step('2. Execute automated accessibility audit using AxeBuilder', async () => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
