# CIE Past Paper Hub

A free, buildless IGCSE and AS/A Level past-paper library with a custom navy-and-red interface.

Website: https://collin-the-fish.github.io/cie-past-paper-hub/

## Features

- English, Traditional Chinese and Simplified Chinese interfaces, with a language selector in the header. The selection is remembered in this browser and included in shareable URLs.
- Chinese and English subject search, including Traditional Chinese aliases, four-digit syllabus codes, filenames, and multiple search terms. Both search fields recognize subject names and short names such as 高数 / 高等數學 / Further Maths / 9231. The main search shows clickable matching subjects as you type.
- Recent searches: the last ten submitted queries, kept only in this browser. Click to reuse, remove one entry or clear the history. Typing alone does not add entries.
- Original open-book and orbit logo using the existing navy, blue and red colours.
- Custom language menu ordered English, Traditional Chinese, Simplified Chinese, with keyboard navigation and a checked selection.
- Light and dark appearances, switchable from the header. The first visit follows the system appearance; an explicit choice is remembered in this browser.
- Consistent rounded controls, subtle shadows and smooth interaction transitions, with reduced-motion support.
- Filters for qualification, subject, year, examination session, document type, and paper component. Subject-navigation group headings use blue for IGCSE and red for AS & A2 in both light and dark appearances.
- Matching question-paper / mark-scheme links.
- Original question-level video links when present in the source catalog.
- Responsive layout, keyboard search shortcut `/`, accessible controls, and shareable filter URLs.
- No registration, login, server, tracking script, or third-party JavaScript dependency.

## Catalog and preservation

The active catalog contains 21 selected subjects from https://cie.fraft.cn/, years 2001–2026, and March/June/November sessions. `catalog-status.json` records the coverage of the retained subjects and whether collection finished. Empty combinations are retained in the separate catalog backup, so absence is distinguishable from a missed query. `catalog-policy.json` defines 22 excluded syllabus codes; catalog refreshes respect that policy.

The source was captured on 2026-10-10 and the selection updated on 2026-10-11. The active catalog contains 21,683 unique PDFs and 506 question-level video links, covering all 1,638 retained subject/year/session query combinations. Older combined-paper files, such as `9709_s03_ms_1+2+3+4+5+6+7.pdf`, remain searchable and appear under their individual paper filters.

The selected query snapshots and explicit download URLs are also included in [cie-source-catalog-backup.zip](./cie-source-catalog-backup.zip). Excluded subjects and their resources are omitted from this website backup as well as the active search catalog.

`catalog.json` preserves subject metadata, exact filenames, and original video links. Document URLs use the original site's public download route. **The PDFs themselves are not hosted or backed up here**, in accordance with the owner's decision to preserve the complete index and links instead of downloading every PDF. Downloads depend on the source site's continued availability. This snapshot does not claim to include files or subjects absent from the source's public query interface.

Original exam resources belong to their respective rightsholders. This is an independent educational project, unaffiliated with Cambridge, the University of Cambridge, or Frank's CIE workshop. The interface and application code are original; no university crest is used.

## Run locally

```sh
python3 -m http.server 8765
```

Then open http://localhost:8765. No installation or build step is required.

## GitHub Pages

Use Settings → Pages → Deploy from a branch → `main` → `/ (root)` → Save. The `.nojekyll` file keeps the site buildless. All asset paths are relative, so the project URL works correctly.

## Update the source catalog

Run `python3 refresh_catalog.py` from a copy of this repository. Python 3.9+ and curl are required. The script queries the original public interface at a modest concurrency, writes resumable raw snapshots to `.catalog-cache`, preserves video references, validates JSON responses, and updates `data.js`, `catalog.json`, and `catalog-status.json`. The first full run may take tens of minutes. Commit the three updated catalog files after reviewing `collection-report.json`. Failed queries are reported; they are never silently counted as complete.

For design changes, edit `styles.css`, `appearance.css`, `index.html` and `logo.svg`. Search logic is in `search.js`; translations are in `i18n.js`; UI behavior and browser-local history are in `app.js`; appearance preferences are in `appearance.js`.
