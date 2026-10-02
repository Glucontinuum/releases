# Design System integration

Releases consumes @glucontinuum/design-system v0.1.0 through the pinned snapshot in design-system/version.json and src/design-system/tokens.css. The generated web brand manifest is kept in design-system/brand-manifest.json and its app mark is served as public/favicon.svg.

The site imports generated semantic roles through src/index.css. Its colors, light and dark themes, typography, spacing, radii, focus ring and interactive component styling use Design System tokens. The responsive layout and release discovery remain local to this repository. Stable and nightly use the same snapshot.

The update workflow also converts the generator's JavaScript-style header comment to valid CSS comment syntax; without this small normalization, Vite's production CSS minifier rejects the published stylesheet.

To update:

1. download the immutable Design System release artifact;
2. replace the generated Web tokens and brand manifest, and copy the generated app mark to public/favicon.svg;
3. update version.json with the release tag and source commit;
4. run npm run check:design-system, npm run lint and npm run build;
5. open a pull request describing token, asset and breaking changes.
