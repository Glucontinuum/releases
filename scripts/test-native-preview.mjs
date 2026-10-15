import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import ts from 'typescript'

const source = await readFile(new URL('../src/services/native-preview.ts', import.meta.url), 'utf8')
const javascript = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
const { parseNativePreview, loadNativePreview } = await import(`data:text/javascript;base64,${Buffer.from(javascript).toString('base64')}`)

const manifest = {
  schemaVersion: 1, status: 'passed', sourceRunId: 100, captureRunId: 200, runAttempt: 1,
  sourceSha: 'a'.repeat(40), capturedAt: '2026-10-14T02:14:42+00:00',
  device: { id: 'galaxy_s22_ultra', platform: 'AOSP', api: 35, width: 1440, height: 3088 },
  images: {
    light: { path: 'captures/200-1/home-light.png', sha256: 'b'.repeat(64) },
    dark: { path: 'captures/200-1/home-dark.png', sha256: 'c'.repeat(64) },
  },
}

test('approved images preserve S22 Ultra proportions and public capture identity', () => {
  const preview = parseNativePreview(manifest)
  assert.equal(preview.width, 1440)
  assert.equal(preview.height, 3088)
  assert.equal(preview.light, 'https://raw.githubusercontent.com/Glucontinuum/releases/screenshots/captures/200-1/home-light.png')
  assert.equal(preview.dark, 'https://raw.githubusercontent.com/Glucontinuum/releases/screenshots/captures/200-1/home-dark.png')
})

test('failed captures, foreign URLs and invalid device metadata cannot enter the hero', () => {
  assert.equal(parseNativePreview({ ...manifest, status: 'failed' }), null)
  assert.equal(parseNativePreview({ ...manifest, device: { ...manifest.device, width: -1 } }), null)
  assert.equal(parseNativePreview({ ...manifest, captureRunId: false }), null)
  assert.equal(parseNativePreview({ ...manifest, images: { ...manifest.images,
    light: { ...manifest.images.light, path: 'https://example.invalid/tracker.png' } } }), null)
})

test('an unavailable manifest leaves the existing hero usable', async () => {
  assert.equal(await loadNativePreview(undefined, async () => new Response('', { status: 404 })), null)
  assert.equal(await loadNativePreview(undefined, async () => { throw new Error('offline') }), null)
  const preview = await loadNativePreview(undefined, async () => new Response(JSON.stringify(manifest)))
  assert.equal(preview.height, 3088)
})

const routes = ['home', 'alerts', 'reports', 'more', 'doses', 'inventory', 'settings',
  'notifications', 'appearance', 'chart-settings', 'about', 'juggluco-test']
const catalogue = {
  ...manifest, captureScope: 'catalogue',
  screens: routes.map((route) => ({ route, images: Object.fromEntries(['light', 'dark'].map((theme) => [theme, {
    path: `captures/200-1/${route}-${theme}.png`, sha256: 'b'.repeat(64),
  }])) })),
}

test('a complete catalogue exposes all twelve ordered screen pairs for the carousel', () => {
  const preview = parseNativePreview(catalogue)
  assert.deepEqual(preview.screens.map((screen) => screen.route), routes)
  assert.equal(preview.screens[6].dark,
    'https://raw.githubusercontent.com/Glucontinuum/releases/screenshots/captures/200-1/settings-dark.png')
  assert.equal(parseNativePreview(manifest).screens.length, 1)
})

test('a catalogue rejects incomplete, duplicate or foreign screen paths', () => {
  for (const screens of [catalogue.screens.slice(0, 1), [...catalogue.screens.slice(0, -1), catalogue.screens[0]],
    catalogue.screens.map((screen) => screen.route === 'settings'
      ? { ...screen, images: { ...screen.images, dark: { path: 'https://example.invalid/settings.png', sha256: 'b'.repeat(64) } } }
      : screen)]) {
    assert.equal(parseNativePreview({ ...catalogue, screens }), null)
  }
})
