# GitHub Pages deployment

The [AIwiki reader](https://zz11ss11zz.github.io/AIwiki/) is published by the [Deploy AIwiki Pages workflow](../.github/workflows/pages.yml). The workflow packages only `pages/` and deploys from `main`. Keep the GitHub Pages publishing source set to GitHub Actions. Pull requests that change the static tree or workflow validate entry points and data without deploying.

`pages/` contains the deployable public snapshot. Its initial tree is the former `gh-pages` tip at `b9c4d17`, preserved byte for byte with its commit history. Update this directory through a reviewed pull request whenever the public reader changes. Keep private inputs, local preview data and unreviewed content out of the snapshot.

To verify deployment, check the workflow's deployment job and open the English reader, Chinese reader, community page and discussions page at the existing project URL. Confirm the reader data and the main CSS and JavaScript files load. To redeploy, run **Deploy AIwiki Pages** on `main`. To roll back a future site update, revert its static files through a pull request and let the workflow deploy the resulting snapshot.
