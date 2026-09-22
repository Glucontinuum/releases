import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const versionPath = join(root, 'design-system/version.json')
const tokensPath = join(root, 'src/design-system/tokens.css')
const version = JSON.parse(readFileSync(versionPath, 'utf8'))

if (!/^\d+\.\d+\.\d+$/.test(version.version)) throw new Error('Design System version must be SemVer')
if (!/^[a-f0-9]{40}$/.test(version.sourceCommit)) throw new Error('Design System sourceCommit must be a full commit SHA')
if (!version.artifact.includes('glucontinuum-design-system-')) throw new Error('Design System artifact is invalid')
if (!existsSync(tokensPath)) throw new Error('Generated Design System CSS snapshot is missing')
const css = readFileSync(tokensPath, 'utf8')
for (const token of ['--brand-primary', '--surface-canvas', '--status-in-range', '--space-12']) {
  if (!css.includes(token)) throw new Error('Design System token is missing: ' + token)
}
if (css.includes('main')) throw new Error('Design System snapshot must not reference main')
console.log('Validated Design System v' + version.version + ' from ' + version.sourceCommit)
