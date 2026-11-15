# HACS requirements for a dashboard card

Research date: 2026-11-15. “Dashboard” is the HACS UI name; official HACS documentation and validation use the category value `plugin` ([HACS plugin requirements](https://www.hacs.xyz/docs/publish/plugin/), [HACS Action inputs](https://www.hacs.xyz/docs/publish/action/#action-inputs)).

## Practical minimum for this repository

For `hass-offgrid-power-card`, the current build produces `dist/hass-offgrid-power-card.js`, matching the repository name. The manifest is:

```json
{
  "name": "Off-grid Power Card",
  "filename": "hass-offgrid-power-card.js"
}
```

Place `hacs.json` at the repository root. Commit `dist/hass-offgrid-power-card.js` in every installable tag/default branch and attach that same file to each GitHub Release. Keeping the default branch installable means `hide_default_branch` can remain absent. These choices follow the documented `filename` field, plugin layout rules, and current plugin filename-selection code ([general requirements](https://www.hacs.xyz/docs/publish/start/#hacsjson), [plugin requirements](https://www.hacs.xyz/docs/publish/plugin/#repository-structure), [`plugin.py`](https://github.com/hacs/integration/blob/main/custom_components/hacs/repositories/plugin.py)).

When configuring HACS or its validation Action, select `plugin`, not `dashboard`. There is no category/type property in `hacs.json`.

## 1. `hacs.json`

The published HACS requirements say this file must be at the repository root and that only `name` is required ([HACS general requirements](https://www.hacs.xyz/docs/publish/start/#hacsjson)).

| Key | Required | Valid/relevant value for a plugin |
| --- | --- | --- |
| `name` | Yes | String displayed in HACS. Use `"Off-grid Power Card"`. |
| `filename` | No, but explicit is safer | A filename string for a single-item type such as a plugin. Use the basename `"hass-offgrid-power-card.js"`. |
| `content_in_root` | No | Boolean. `true` means installable content is in the repository root rather than a subdirectory. Leave absent/`false` for a `dist/` or release-asset layout. |
| `hide_default_branch` | No | Boolean. `true` prevents HACS from offering the configured GitHub default branch as an install choice. |
| `country` | No, except for a default-store repository limited to one/a few countries | One two-character ISO 3166-1 alpha-2 string, or a list of those strings. Values are uppercased and checked against HACS's locale list. See the documentation discrepancy below. |
| `homeassistant` | No | Minimum Home Assistant version string. Appending `b0` allows Home Assistant beta versions. |
| `hacs` | No | Minimum HACS version string. |
| `render_readme` | No | Boolean accepted by the current source schema, but omitted from the current public field table; avoid relying on it. |
| `zip_release` | Not valid for this plugin use | Boolean, but explicitly supported only for integrations; it also requires `filename`. |
| `persistent_directory` | Not valid for a plugin | Relative directory string, explicitly integration-only. |

Do not invent a `category`, `type`, or `dashboard` field. For HACS Action validation the valid category values are `appdaemon`, `integration`, `plugin`, `python_script`, `template`, and `theme`; this repository uses `plugin` ([HACS Action documentation](https://www.hacs.xyz/docs/publish/action/#action-inputs)).

The current validation schema requires `name`, enforces the field types above, accepts `country` as a string or list, and rejects unknown keys. The HACS Action also rejects a missing or invalid root manifest ([current manifest schema](https://github.com/hacs/integration/blob/main/custom_components/hacs/utils/validate.py#L62-L75), [manifest validator](https://github.com/hacs/integration/blob/main/custom_components/hacs/validate/hacsjson.py)). Runtime filename selection uses `filename` before inferred plugin names ([`update_filenames` in `plugin.py`](https://github.com/hacs/integration/blob/main/custom_components/hacs/repositories/plugin.py#L75-L110)).

## 2. Repository and distributable structure

A plugin repository needs JavaScript in either:

```text
hacs.json
README.md
LICENSE

dist/
  hass-offgrid-power-card.js
```

or directly at the repository root. The documented default naming rule is a `.js` file with the repository name; this repository follows that rule and also declares the same name explicitly through `hacs.json.filename` ([plugin structure](https://www.hacs.xyz/docs/publish/plugin/#repository-structure), [`filename` manifest field](https://www.hacs.xyz/docs/publish/start/#hacsjson)).

If the plugin needs non-JavaScript runtime files, HACS says to put every runtime file, including the card JavaScript, in `dist/`. This card's single bundled JavaScript needs no additional runtime-file layout.

The repository also needs a usage README under the general publishing requirements. Only public GitHub repositories work with HACS ([HACS general requirements](https://www.hacs.xyz/docs/publish/start/#general-requirements)).

## 3. Releases, assets, and download selection

### Custom repository

GitHub releases are optional. With no releases, HACS scans the GitHub repository's configured default branch. With releases, HACS uses a published release tag for the remote version; a tag without a published GitHub Release does not count as a release ([plugin release rules](https://www.hacs.xyz/docs/publish/plugin/#github-releases-optional), [version rules](https://www.hacs.xyz/docs/publish/start/#versions)).

Attached assets are also not universally required: HACS can install a matching file committed in the release tag's root or `dist/`. An attached asset is the appropriate pattern when generated `dist/` output is not committed. For a single-file release asset, its name must match `hacs.json.filename` (or one of HACS's inferred valid names). The current plugin code checks matching release assets and otherwise checks the selected tag's tree ([`plugin.py`](https://github.com/hacs/integration/blob/main/custom_components/hacs/repositories/plugin.py#L75-L110)); the downloader then reads release assets or the selected repository tree ([`base.py`](https://github.com/hacs/integration/blob/main/custom_components/hacs/repositories/base.py#L607-L640)). Current source gathers every asset after selecting the release path, so the safest single-file release contains only the intended JavaScript asset ([release-content source](https://github.com/hacs/integration/blob/main/custom_components/hacs/repositories/base.py#L1165-L1240)).

HACS's current source chooses the first non-draft, non-prerelease release as the normal latest version; prereleases are separately available when beta display is enabled. If there is no normal release, it falls back to the default branch. The documented version chooser offers the last five releases plus the default branch, unless `hide_default_branch` suppresses that branch ([plugin release rules](https://www.hacs.xyz/docs/publish/plugin/#github-releases-optional), [`common_update_data` and `version_to_download` in `base.py`](https://github.com/hacs/integration/blob/main/custom_components/hacs/repositories/base.py)).

### Default HACS store

A full published GitHub Release is required. The default-store instructions explicitly require creating a new release—rather than only a tag—after the required validation Actions pass, and the inclusion checks require at least one release ([default inclusion requirements](https://www.hacs.xyz/docs/publish/include/#before-you-start), [release check](https://www.hacs.xyz/docs/publish/include/#check-releases)). The instructions do not require an attached asset. An asset is nevertheless recommended for this Vite project because its generated file need not be committed.

## 4. GitHub repository metadata and default branch

For HACS publishing, the repository must be public on GitHub and have:

- a short GitHub repository description; HACS displays it;
- at least one GitHub topic; HACS uses topics for searchability but specifies no mandatory topic names;
- a README explaining usage.

Source: [HACS general requirements](https://www.hacs.xyz/docs/publish/start/#general-requirements).

For default-store inclusion it must additionally be active/not archived, have GitHub Issues enabled, and have a GitHub-recognized OSI-approved license. Plugin/theme READMEs must contain images for HACS to render. These are automated inclusion checks ([default inclusion checks](https://www.hacs.xyz/docs/publish/include/#what-happens-next)).

No official HACS requirement mandates that the card repository's default branch be named `main` or `master`. It must be a usable GitHub default branch: HACS records GitHub's configured default branch, uses it when no release exists, and normally offers it alongside release choices ([plugin release rules](https://www.hacs.xyz/docs/publish/plugin/#github-releases-optional), [`version_to_download` in `base.py`](https://github.com/hacs/integration/blob/main/custom_components/hacs/repositories/base.py)). The separate instruction to branch from `master` applies only to a contributor's fork of `hacs/default`, not to this card repository ([default inclusion additional information](https://www.hacs.xyz/docs/publish/include/#additional-information)).

## 5. Default store versus a custom repository

### Custom repository

A user adds the GitHub URL in HACS **Custom repositories** and selects the correct type. The repository still needs a HACS-recognized structure; inclusion in `hacs/default`, an inclusion PR, and the default-store review are not required ([custom repository instructions](https://www.hacs.xyz/docs/faq/custom_repositories/)). Releases are optional.

The official publishing page treats `hacs.json`, description, topics, and README as repository requirements. Current runtime source only loads `hacs.json` when present, so a structurally valid custom plugin may work without it; that is an implementation/documentation discrepancy, not a safe publishing contract. Include the root manifest above ([general requirements](https://www.hacs.xyz/docs/publish/start/), [`common_validate` in `base.py`](https://github.com/hacs/integration/blob/main/custom_components/hacs/repositories/base.py)).

### Default store

Before submitting to `hacs/default`, all of the following apply:

1. The submitter is the owner or a major contributor.
2. The public GitHub repository already works as a custom repository.
3. The [HACS Action](https://github.com/hacs/action) passes with no errors and no ignored checks. Use `category: plugin`.
4. Hassfest is required only for integrations, not this plugin.
5. A new full GitHub Release is created after validation succeeds.
6. The repository passes the automated checks: active/not archived, release present, root `hacs.json` with at least `name`, identifiable OSI-approved license, README/information file with images for a plugin, Issues enabled, description, and topics.
7. If the card is limited to one or a few countries, the released `hacs.json` sets `country`.
8. Add `owner/repository` alphabetically to the `plugin` file in `hacs/default`; use an editable PR from a new branch based on that repository's `master`, and complete the PR template accurately.

Source: [HACS default inclusion instructions and checks](https://www.hacs.xyz/docs/publish/include/). The validator's official workflow uses `hacs/action@main` and supports `plugin` as the category ([HACS Action documentation](https://www.hacs.xyz/docs/publish/action/)).

## 6. Suitable GitHub Actions release pattern

For this repository's existing `npm run build` and single `dist/hass-offgrid-power-card.js`, a minimal official-tooling pattern is:

```yaml
name: Release

on:
  push:
    tags:
      - "v*"

permissions:
  contents: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run build
      - name: Publish GitHub release and HACS asset
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: >-
          gh release create "$GITHUB_REF_NAME"
          dist/hass-offgrid-power-card.js
          --verify-tag
          --generate-notes
```

Why this shape:

- GitHub workflow tag filters support release-tag pushes ([workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#onpushbranchestagsbranches-ignoretags-ignore)).
- `contents: write` permits `GITHUB_TOKEN` to create a release ([permissions reference](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#permissions)).
- GitHub CLI is preinstalled on GitHub-hosted runners and requires `GH_TOKEN` in the step environment ([GitHub CLI in workflows](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-github-cli)).
- `gh release create TAG FILE --verify-tag --generate-notes` creates a published release, uploads the named file as an asset, requires the pushed tag to exist, and generates notes ([official `gh release create` manual](https://cli.github.com/manual/gh_release_create)).
- The current official Node publishing example uses `actions/checkout@v6` and `actions/setup-node@v7` ([GitHub Node publishing tutorial](https://docs.github.com/en/actions/tutorials/publish-packages/publish-nodejs-packages)).

Use semantic release tags such as `v0.1.0`. Push a tag only after the intended commit's HACS validation has passed; default-store submission requires the release to be created after successful validation. Pinning Actions to full commit SHAs is safer than major tags; GitHub's workflow reference calls a released action's commit SHA the safest option ([workflow action-version guidance](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idstepsuses)).

## Uncertainties and documentation/source mismatches

1. **Search precedence:** the plugin documentation says HACS searches `dist/`, then the latest release, then repository root. Current `plugin.py` checks a matching release asset before the selected tag's root and `dist/` tree. Do not depend on that disputed precedence: use one explicit `filename` and make exactly that file available in the chosen distribution channel ([docs](https://www.hacs.xyz/docs/publish/plugin/#repository-structure), [source](https://github.com/hacs/integration/blob/main/custom_components/hacs/repositories/plugin.py)).
2. **`country` type:** the general requirements table calls it a string, while an example shows an array; current source normalizes a string to a list and also accepts a list. The least ambiguous single-country form is a two-letter string ([docs](https://www.hacs.xyz/docs/publish/start/#hacsjson), [source](https://github.com/hacs/integration/blob/main/custom_components/hacs/repositories/base.py)).
3. **Manifest enforcement for custom repositories:** publishing/default-store docs require `hacs.json`, while current custom-repository runtime validation conditionally reads it. This note follows the documented contract and includes it.
4. **Undocumented manifest key:** current source still models `render_readme`, but the current public table no longer lists it among supported keys. Do not use it without checking the HACS version actually targeted ([docs](https://www.hacs.xyz/docs/publish/start/#hacsjson), [source](https://github.com/hacs/integration/blob/main/custom_components/hacs/repositories/base.py)).
5. **Moving branches:** `main` links above describe current HACS implementation, not an immutable release. Re-check the official documentation and validator immediately before default-store submission.
