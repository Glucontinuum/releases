import { expect, test, type Page } from '@playwright/test'

const routes = ['home', 'alerts', 'reports', 'more', 'doses', 'inventory', 'settings',
  'notifications', 'appearance', 'chart-settings', 'about', 'juggluco-test']
const screens = routes.map((route) => ({ route, images: Object.fromEntries(['light', 'dark'].map((theme) =>
  [theme, { path: `captures/200-1/${route}-${theme}.png`, sha256: 'b'.repeat(64) }])) }))
const manifest = {
  schemaVersion: 1, status: 'passed', sourceRunId: 100, captureRunId: 200, runAttempt: 1,
  sourceSha: 'a'.repeat(40), capturedAt: '2026-10-15T00:00:00Z',
  device: { platform: 'AOSP', api: 35, width: 1440, height: 3088 },
  captureScope: 'catalogue', images: screens[0].images, screens,
}

async function openCarousel(page: Page) {
  await page.route('https://api.github.com/**', (route) => route.fulfill({ json: [] }))
  await page.route('https://raw.githubusercontent.com/Glucontinuum/releases/screenshots/**', (route) =>
    route.request().url().endsWith('latest.json') ? route.fulfill({ json: manifest })
      : route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="3088"><rect width="1440" height="3088" fill="#eef4ff"/></svg>' }))
  await page.clock.install()
  await page.goto('./')
  const carousel = page.getByRole('region', { name: 'Telas do aplicativo' })
  await expect(carousel).toBeVisible()
  await carousel.scrollIntoViewIfNeeded()
  await page.mouse.move(1, 1)
  await expect(page.locator('figure img')).toHaveJSProperty('complete', true)
  return carousel
}

test('advances every five seconds and loops through the full catalogue', async ({ page }) => {
  await openCarousel(page)
  const image = page.locator('figure img')
  await expect(image).toHaveAttribute('src', /home-light.png$/)
  for (let index = 1; index <= routes.length; index += 1) {
    await page.clock.runFor(5100)
    await expect(image).toHaveAttribute('src', new RegExp(`${routes[index % routes.length]}-light.png$`))
    await expect(image).toHaveJSProperty('complete', true)
  }
})

test('arrows, indicators, pause and theme preserve manual control', async ({ page }) => {
  const carousel = await openCarousel(page)
  const image = page.locator('figure img')
  await carousel.getByRole('button', { name: 'Tela anterior', exact: true }).click()
  await expect(image).toHaveAttribute('src', /juggluco-test-light.png$/)
  await carousel.getByRole('button', { name: 'Próxima tela', exact: true }).click()
  await expect(image).toHaveAttribute('src', /home-light.png$/)
  await carousel.getByRole('button', { name: 'Mostrar Configurações', exact: true }).click()
  await expect(image).toHaveAttribute('src', /settings-light.png$/)
  await page.getByRole('button', { name: 'Ativar tema escuro', exact: true }).click()
  await expect(image).toHaveAttribute('src', /settings-dark.png$/)
  await carousel.getByRole('button', { name: 'Pausar apresentação', exact: true }).click()
  await page.getByRole('heading', { name: 'Glucontinuum', exact: true }).click()
  await page.clock.runFor(10000)
  await expect(image).toHaveAttribute('src', /settings-dark.png$/)
  await carousel.getByRole('button', { name: 'Reproduzir apresentação', exact: true }).click()
  await page.getByRole('heading', { name: 'Glucontinuum', exact: true }).click()
  await page.clock.runFor(5100)
  await expect(image).toHaveAttribute('src', /notifications-dark.png$/)
})

test('reduced motion disables autoplay but keeps keyboard navigation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const carousel = await openCarousel(page)
  await page.clock.runFor(15000)
  await expect(page.locator('figure img')).toHaveAttribute('src', /home-light.png$/)
  const next = carousel.getByRole('button', { name: 'Próxima tela', exact: true })
  await next.focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('figure img')).toHaveAttribute('src', /alerts-light.png$/)
  await page.keyboard.press('ArrowLeft')
  await expect(page.locator('figure img')).toHaveAttribute('src', /home-light.png$/)
})

test('hover, focus and off-screen state suspend rotation', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 640 })
  const carousel = await openCarousel(page)
  const image = page.locator('figure img')
  await image.hover()
  await page.clock.runFor(10000)
  await expect(image).toHaveAttribute('src', /home-light.png$/)
  await carousel.getByRole('button', { name: 'Próxima tela', exact: true }).focus()
  await page.mouse.move(1, 1)
  await page.clock.runFor(10000)
  await expect(image).toHaveAttribute('src', /home-light.png$/)
  await page.getByRole('heading', { name: 'Glucontinuum', exact: true }).click()
  await page.locator('footer').scrollIntoViewIfNeeded()
  await expect(carousel).not.toBeInViewport({ ratio: 0.25 })
  await page.clock.runFor(10000)
  await expect(image).toHaveAttribute('src', /home-light.png$/)
  await carousel.scrollIntoViewIfNeeded()
  await page.mouse.move(1, 1)
  await expect(carousel).toBeInViewport({ ratio: 0.25 })
  await page.clock.runFor(5100)
  await expect(image).toHaveAttribute('src', /alerts-light.png$/)
})

test('legacy Home publications stay static without carousel controls', async ({ page }) => {
  await page.route('https://api.github.com/**', (route) => route.fulfill({ json: [] }))
  const legacy = { ...manifest, captureScope: undefined, screens: undefined }
  await page.route('**/screenshots/latest.json', (route) => route.fulfill({ json: legacy }))
  await page.route('**/screenshots/captures/**', (route) => route.fulfill({ contentType: 'image/svg+xml',
    body: '<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="3088"/>' }))
  await page.goto('./')
  await expect(page.locator('figure img')).toHaveAttribute('src', /home-light.png$/)
  await expect(page.getByRole('button', { name: 'Próxima tela', exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: 'Ativar tema escuro', exact: true }).click()
  await expect(page.locator('figure img')).toHaveAttribute('src', /home-dark.png$/)
})
