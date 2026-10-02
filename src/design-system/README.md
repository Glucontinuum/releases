# Design System snapshot

This directory is a checked-in snapshot of the generated Web tokens. Its source commit and SHA-256 checksum are recorded in design-system/version.json. The generated brand manifest lives in design-system/brand-manifest.json and the Web app mark used as the favicon lives in public/favicon.svg.

The canonical source is Glucontinuum/glucontinuum-design-system. This repository owns only the integration and product-specific layout; colors, semantic roles, typography, spacing, radii and brand assets come from the pinned generated snapshot.

The Design System token generator currently emits a JavaScript-style header comment in its CSS output. The update workflow converts only that header to CSS comment syntax so the Vite production minifier can parse the snapshot.
