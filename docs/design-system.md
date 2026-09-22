# Design System integration

Releases consumes @glucontinuum/design-system v0.1.0 through the pinned snapshot in design-system/version.json and src/design-system/tokens.css.

The site imports the generated semantic roles through src/index.css. Stable and nightly use the same snapshot; channel metadata and release discovery remain local to this repository.

To update:

1. download the immutable Design System release artifact;
2. replace the checked-in generated snapshot;
3. update version.json with the release tag and source commit;
4. run npm run check:design-system, npm run lint and npm run build;
5. open a pull request describing token, asset and breaking changes.
