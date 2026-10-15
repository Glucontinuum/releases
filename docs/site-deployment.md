# Site deployment

The Quality workflow validates the site and publishes its checked `dist/` to
GitHub Pages after relevant changes reach `main`. Its deploy job depends on the
check job; failed checks or a failed artifact upload prevent publication.
Quality installs Chromium for the carousel browser regressions before `npm run check`.

Pull requests, tags and other branches keep their checks but do not upload a
Pages artifact or deploy. A manual Quality run on `main` validates and republishes
the current main commit. Executions on the same ref are serialized so a deployment
is not interrupted by a newer run.

The site uses the existing Vite `/releases/` base path. Only `dist/` goes into the
Pages artifact, retained for one day. Deployment uses the official configure-pages,
upload-pages-artifact and deploy-pages actions with the built-in `GITHUB_TOKEN`;
the deploy job receives only `pages: write` and `id-token: write`. No PAT, APK
release or generated-file commit is needed.

## One-time hosting setup

In [repository Pages settings](https://github.com/Glucontinuum/releases/settings/pages),
choose **Build and deployment → Source → GitHub Actions**. If the `github-pages`
environment has branch restrictions, allow `main`. These repository settings
need maintainer/admin access and are not changed by this workflow.

The previous process used `npm run deploy` to push generated files to `gh-pages`.
That branch was still at commit `2e43b14` dated 2026-06-02 when this issue was
investigated. The hero merged to main at `c407721` on 2026-10-14, but
[Quality run 38565307532](https://github.com/Glucontinuum/releases/actions/runs/38565307532)
contained only validation/build steps. There was no automated deployment to fail.
The old `gh-pages` branch can remain as historical output after selecting Actions
as the publishing source.

Use the artifact deployment path rather than pushing `gh-pages` with GITHUB_TOKEN:
[GitHub documents](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
that those workflow-created commits do not trigger a Pages build. The official
[custom workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
keeps validation and deployment in the same run and supplies deployment status.

## First deployment and verification

1. Select GitHub Actions as the Pages source, then merge the deployment workflow.
2. Open **Actions → Quality** and inspect the main run. If the workflow was merged
   before changing the Pages source, start a new manual run on `main`.
3. Confirm both `check` and **Deploy site to GitHub Pages** completed successfully.
   Use the `github-pages` deployment link to open the public site.
4. Confirm the run's source SHA is the main revision you intended to publish.
   Pages/CDN propagation may take a few minutes.

Native screenshot publication is a separate prerequisite for seeing the hero preview.
The deployed hero stays usable while public screenshot metadata is unavailable.
Once approved captures are published to the `screenshots` branch, it loads them
on page load without another deployment. Screenshot-only updates do not match
the workflow's source paths and therefore do not start the site build.
Legacy Home pairs remain static; a full catalogue manifest enables the twelve-screen
carousel. Deploy the carousel once, then run the Native workflow in its default
catalogue scope to publish all 24 route/theme images. See [preview contract](native-preview.md).
