import { test, expect } from '@playwright/test'

test('landing page se charge correctement', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toContainText('Dream Studio Connect')
})

test('tokens CSS DSC sont définis (AC3)', async ({ page }) => {
  await page.goto('/')
  const colorJoueur = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--color-joueur').trim()
  )
  expect(colorJoueur).toBeTruthy()
  expect(colorJoueur).not.toBe('')

  const colorAgent = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--color-agent').trim()
  )
  expect(colorAgent).toBeTruthy()

  const colorScout = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--color-scout').trim()
  )
  expect(colorScout).toBeTruthy()

  const colorAdmin = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--color-admin').trim()
  )
  expect(colorAdmin).toBeTruthy()
})

test('page 404 gérée proprement', async ({ page }) => {
  const response = await page.goto('/page-inexistante')
  expect(response?.status()).toBe(404)
})
