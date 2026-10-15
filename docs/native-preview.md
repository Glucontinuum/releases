# Native screenshot preview

The hero cycles through the latest approved Native Android screens beside its
copy and download controls, below them on narrow screens. It advances every five
seconds after the current image loads, wraps to the first screen, and provides
previous/next arrows, direct screen indicators, a counter and pause/play. Captions
name and describe each screen in Portuguese/English. The selected screen follows
the existing light/dark theme control without resetting its position. Both READMEs
retain the stable Home image URLs.

Autoplay pauses while the pointer or keyboard focus is inside the carousel,
while the tab is hidden or less than 25% of the carousel is visible, and after an
explicit pause. Reduced-motion preference disables autoplay and the fade animation;
manual controls remain available. Arrow keys navigate while focus is inside the
carousel. Automatic changes are not announced by the live region. Single-screen
manifests show a static preview without carousel controls.

Images are ordinary Git files in this repository's dedicated `screenshots` branch;
they are not GitHub releases or APK download assets. The Native repository's
App Screenshots workflow publishes them only after actual instrumentation and
complete PNG validation. It uses `PUBLIC_REPO_TOKEN` with Contents write on this
repository, preserves immutable capture folders, and updates the latest pair and
manifest in one atomic Git commit. All validated images in the selected scope
are public: catalogue means 12 light/dark pairs; explicit Home smoke scope means
one pair. Diagnostics/reports stay private. Older source builds cannot roll back a newer
preview. The branch is separate from `main` and `gh-pages`.

```text
screenshots branch
├── captures/RUN-ATTEMPT/ROUTE-light.png
├── captures/RUN-ATTEMPT/ROUTE-dark.png
├── captures/RUN-ATTEMPT/manifest.json
├── latest/ROUTE-light.png
├── latest/ROUTE-dark.png
└── latest.json
```

`src/services/native-preview.ts` reads the public raw `latest.json` when the page
loads and accepts only successful metadata, bounded portrait dimensions, valid
capture/source identities and the exact immutable route/theme image paths. It constructs
URLs within this branch; the manifest cannot point the hero at a foreign host.
Unavailable metadata or an image failure leaves the existing hero usable. Native
Android/demo-data labeling distinguishes the preview from other product surfaces.

The additive version-1 manifest keeps `images.light/dark` as Home aliases for
older consumers and adds `captureScope` plus ordered `screens` records containing
`route` and both `images` entries (`path`, `sha256`). The parser requires the
complete known route set for the declared scope. Old Home-only manifests remain
supported until a catalogue is published; malformed/partial new manifests are
rejected. A Home smoke publication deliberately yields a one-screen preview;
use the workflow's default catalogue scope to show all screens.

The new capture profile models Galaxy S22 Ultra screen geometry (1440×3088,
configured density 560) on AOSP API 35. It does not emulate Samsung One UI.
PNG aspect ratio comes from validated dimensions and is preserved by the hero.

The hero implementation needs an initial successful site deployment. The Quality
workflow deploys its checked build on main pushes or a manual main execution;
see [site deployment](site-deployment.md) for the one-time Pages setup. Subsequent
captures update raw image/manifest files, so they need
neither another site build nor edits to either README. GitHub's public raw/Camo
caches may briefly retain an older image; capture-specific paths remain stable.

Before merging/deploying the preview, run the Native workflow from its feature
branch with default `capture_scope=catalogue`, an empty `source_run_id` for
automatic verified reuse, and `publish_images=true`. Confirm publication of all
24 PNGs and `latest.json`; inspect the screenshots and exercise the carousel in
both themes on desktop/mobile. Existing Home publications continue to work while
the two repository changes roll out; a new catalogue capture is needed to populate
the carousel. The earlier rendered catalogue run does not itself prove the new
all-screen publication workflow.

Run `npm ci`, `npx playwright install --with-deps chromium`, then `npm run check`
for manifest regressions, tokens, lint, build and browser interaction tests. When
using an installed Chromium locally, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to its
path. Browser tests use public manifest/image fixtures and virtual time, without
GitHub API access or remote writes. Quality installs Chromium and runs these checks
before its existing main-only Pages deployment.
