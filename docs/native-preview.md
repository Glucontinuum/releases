# Native screenshot preview

The hero shows the latest approved Native Android Home capture beside its copy
and download controls, below them on narrow screens. Its screenshot follows the
existing light/dark theme control. Both READMEs use the same two stable image URLs.

Images are ordinary Git files in this repository's dedicated `screenshots` branch;
they are not GitHub releases or APK download assets. The Native repository's
App Screenshots workflow publishes them only after actual instrumentation and
complete PNG validation. It uses `PUBLIC_REPO_TOKEN` with Contents write on this
repository, preserves immutable capture folders, and updates the latest pair and
manifest in one atomic Git commit. Older source builds cannot roll back a newer
preview. The branch is separate from `main` and `gh-pages`.

```text
screenshots branch
├── captures/RUN-ATTEMPT/home-light.png
├── captures/RUN-ATTEMPT/home-dark.png
├── captures/RUN-ATTEMPT/manifest.json
├── latest/home-light.png
├── latest/home-dark.png
└── latest.json
```

`src/services/native-preview.ts` reads the public raw `latest.json` when the page
loads and accepts only successful metadata, bounded portrait dimensions, valid
capture/source identities and the exact immutable Home image paths. It constructs
URLs within this branch; the manifest cannot point the hero at a foreign host.
Unavailable metadata or an image failure leaves the existing hero usable. Native
Android/demo-data labeling distinguishes the preview from other product surfaces.

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
branch with `capture_scope=home`, a compatible verified `source_run_id`, and
`publish_images=true`. Confirm that public publication passed and this branch
contains both PNGs and `latest.json`; then inspect the actual screenshots. The
readme image links are ready for that first publication and are unavailable until
it completes. Run `npm run check` for manifest regressions, tokens, lint and build.
