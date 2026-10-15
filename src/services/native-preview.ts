const SCREENSHOT_ROOT = 'https://raw.githubusercontent.com/Glucontinuum/releases/screenshots/'

export const PREVIEW_ROUTES = ['home', 'alerts', 'reports', 'more', 'doses', 'inventory', 'settings',
  'notifications', 'appearance', 'chart-settings', 'about', 'juggluco-test'] as const
export type PreviewRoute = typeof PREVIEW_ROUTES[number]

export interface NativeScreenPreview {
  route: PreviewRoute
  light: string
  dark: string
}

export interface NativePreview {
  width: number
  height: number
  light: string
  dark: string
  screens: NativeScreenPreview[]
}

function record(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown> : null
}

function positiveId(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0
}

export function parseNativePreview(value: unknown): NativePreview | null {
  const manifest = record(value)
  if (!manifest || manifest.schemaVersion !== 1 || manifest.status !== 'passed'
    || !positiveId(manifest.sourceRunId) || !positiveId(manifest.captureRunId) || !positiveId(manifest.runAttempt)
    || typeof manifest.sourceSha !== 'string' || !/^[a-f0-9]{40}$/.test(manifest.sourceSha)
    || typeof manifest.capturedAt !== 'string' || !Number.isFinite(Date.parse(manifest.capturedAt))) return null

  const device = record(manifest.device)
  const images = record(manifest.images)
  if (!device || !images || device.api !== 35 || device.platform !== 'AOSP'
    || !positiveId(device.width) || !positiveId(device.height)
    || device.width < 720 || device.width > 2160 || device.height <= device.width || device.height > 4000) return null

  const captureRoot = `captures/${manifest.captureRunId}-${manifest.runAttempt}/`
  function screenImages(value: unknown, route: PreviewRoute): NativeScreenPreview | null {
    const pair = record(value)
    const urls: Record<string, string> = {}
    for (const theme of ['light', 'dark']) {
      const image = record(pair?.[theme])
      const expected = `${captureRoot}${route}-${theme}.png`
      if (!image || image.path !== expected || typeof image.sha256 !== 'string' || !/^[a-f0-9]{64}$/.test(image.sha256)) return null
      urls[theme] = SCREENSHOT_ROOT + expected
    }
    return { route, light: urls.light, dark: urls.dark }
  }
  const home = screenImages(images, 'home')
  if (!home) return null
  const screens: NativeScreenPreview[] = []
  if (manifest.screens === undefined && manifest.captureScope === undefined) {
    // Existing published manifests remain usable until the first catalogue is published.
    screens.push(home)
  } else {
    const routes = manifest.captureScope === 'catalogue' ? PREVIEW_ROUTES
      : manifest.captureScope === 'home' ? ['home'] as const : null
    if (!routes || !Array.isArray(manifest.screens) || manifest.screens.length !== routes.length) return null
    for (const [index, route] of routes.entries()) {
      const item = record(manifest.screens[index])
      const screen = screenImages(item?.images, route)
      if (item?.route !== route || !screen) return null
      screens.push(screen)
    }
  }
  return { width: device.width, height: device.height, light: home.light, dark: home.dark, screens }
}

export async function loadNativePreview(signal?: AbortSignal, fetcher: typeof fetch = fetch): Promise<NativePreview | null> {
  try {
    const response = await fetcher(`${SCREENSHOT_ROOT}latest.json`, { signal, cache: 'no-cache' })
    if (!response.ok) return null
    const text = await response.text()
    if (text.length > 65536) return null
    return parseNativePreview(JSON.parse(text))
  } catch {
    return null
  }
}
