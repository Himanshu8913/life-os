import { test, expect, type Page } from '@playwright/test'

async function completeOnboardingIfShown(page: Page) {
  const dialog = page.getByRole('dialog')
  const visible = await dialog.isVisible().catch(() => false)
  if (!visible) return

  await page.getByLabel('What should we call you?').fill('E2E Tester')
  await page.getByRole('button', { name: 'Enter Life OS' }).click()
  await expect(dialog).not.toBeVisible()
}

test.describe('Life OS', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await completeOnboardingIfShown(page)
  })

  test('loads the app shell', async ({ page }) => {
    await expect(page.getByText('Life OS').first()).toBeVisible()
  })

  test('navigates to quests', async ({ page }) => {
    await page
      .getByRole('navigation', { name: 'Main' })
      .getByRole('link', { name: 'Quests', exact: true })
      .click()
    await expect(page.getByRole('heading', { name: 'Quests' })).toBeVisible()
  })

  test('opens command palette with keyboard shortcut', async ({ page }) => {
    const mod = process.platform === 'darwin' ? 'Meta' : 'Control'
    await page.keyboard.press(`${mod}+k`)
    await expect(page.getByPlaceholder(/type a command/i)).toBeVisible()
  })
})
