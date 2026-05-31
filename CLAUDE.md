# CLAUDE.md — 12-rule template

These rules apply to every task in this project unless explicitly overridden.
Bias: caution over speed on non-trivial work.

## Rule 1 — Think Before Coding
State assumptions explicitly. Ask rather than guess.
Push back when a simpler approach exists. Stop when confused.

## Rule 2 — Simplicity First
Minimum code that solves the problem. Nothing speculative.
No abstractions for single-use code.

## Rule 3 — Surgical Changes
Touch only what you must. Don't improve adjacent code.
Match existing style. Don't refactor what isn't broken.

## Rule 4 — Goal-Driven Execution
Define success criteria. Loop until verified.
Strong success criteria let Claude loop independently.

## Rule 5 — Use the model only for judgment calls
Use for: classification, drafting, summarization, extraction.
Do NOT use for: routing, retries, deterministic transforms.
If code can answer, code answers.

## Rule 6 — Token budgets are not advisory
Per-task: 4,000 tokens. Per-session: 30,000 tokens.
If approaching budget, summarize and start fresh.
Surface the breach. Do not silently overrun.

## Rule 7 — Surface conflicts, don't average them
If two patterns contradict, pick one (more recent / more tested).
Explain why. Flag the other for cleanup.

## Rule 8 — Read before you write
Before adding code, read exports, immediate callers, shared utilities.
If unsure why existing code is structured a certain way, ask.

## Rule 9 — Tests verify intent, not just behavior
Tests must encode WHY behavior matters, not just WHAT it does.
A test that can't fail when business logic changes is wrong.

## Rule 10 — Checkpoint after every significant step
Summarize what was done, what's verified, what's left.
Don't continue from a state you can't describe back.

## Rule 11 — Match the codebase's conventions, even if you disagree
Conformance > taste inside the codebase.
If you think a convention is harmful, surface it. Don't fork silently.

## Rule 12 — Fail loud
"Completed" is wrong if anything was skipped silently.
"Tests pass" is wrong if any were skipped.
Default to surfacing uncertainty, not hiding it.

## Project Overview

**Strefa Gier** (strefagier.com.pl) is the website of a Polish gaming community founded in 2001. It is a **Jekyll static site** deployed to **GitHub Pages** via CI/CD on pushes to `main`.

## Build and Deployment

| Task | Command |
|------|---------|
| Install deps | `bundle install` |
| Local dev server | `bundle exec jekyll serve` |
| Production build | `bundle exec jekyll build` |
| CI/CD build | `bundle exec jekyll build --baseurl "<pages-base-path>"` (see `.github/workflows/jekyll.yml`) |

Ruby version: **3.4.8** (pinned in the GitHub Actions workflow). Dependencies are minimal: `jekyll`, `json`, `hash-joiner`, `open-uri` (see `Gemfile`).

There are **no tests, linters, or CI checks** beyond the build-and-deploy workflow.

## Two Coexisting Design Systems

This site has two completely independent design systems. **Do not mix them.**

### Modern pages (`index.html`, `serwery.html`)

- **Raw HTML with no Jekyll front-matter** — served directly by Jekyll as-is, without layouts or layout processing.
- **Bootstrap 5** (dark theme, vendored in `bootstrap/`), custom CSS in `assets/style.css`, custom JS in `assets/script.js`.
- Icons: inline Bootstrap Icon SVGs embedded directly in HTML.
- Assets referenced from `assets/images/` and `assets/icons/`.
- `assets/script.js` handles: navbar background on scroll, welcome section fade-in animation, and the contact section's carousel (left/right button to cycle through `.self_otherGame` panels).

### Legacy pages (`elements.html`, `generic.html`)

- Use **Jekyll front-matter** (`---`) with `layout: page` or `layout: landing`.
- Layouts in `_layouts/` wrap content with Spectral theme (by HTML5 UP). The `default` layout includes `head.html`, `header.html`, `footer.html`, and `scripts.html` from `_includes/`. The `landing` layout adds `body class="landing"`.
- **SCSS** in `css/main.scss` (imports `_sass/libs/*` for vars, mixins, Skel 3 framework).
- **Critical:** `css/main.scss` sets `$baseurl: '{{ site.baseurl }}/images'` and interpolates it into `url()` references for background images. Changing `baseurl` in `_config.yml` affects these paths.
- JS in `js/` (jquery, skel, util, main.js, scrolly/scrollex plugins).
- Assets referenced from `images/`.
- Fonts Awesome loaded via CDN kit (`kit.fontawesome.com`).
- Desktop uses `background-attachment: fixed` on banners; mobile falls back to `scroll` via the `is-mobile` body class.

### Key gotcha

Image directories are **duplicated**: `images/` (legacy) and `assets/images/` (modern). They contain different sets of files. When adding images, put them in the directory matching the page system.

## Key Configuration

- **`_config.yml`**: Site metadata (title, URL, social links) and `jekyll_get` plugin config for fetching Factorio server data from an external API.
- **`CNAME`**: Custom domain `strefagier.com.pl`.
- **`.github/workflows/jekyll.yml`**: Builds on Ubuntu 22.04 with Ruby 3.4.8, deploys via GitHub Pages environment.

## Custom Jekyll Plugin

`_plugins/jekyll_get.rb` — fetches JSON from external APIs during build and stores it in `site.data`. Configured via `jekyll_get` in `_config.yml`. Currently fetches Factorio server data from `api.dservindex.com`. When `cache: true`, it writes the data to `_data/<name>.json` so it persists across builds. If the fetch fails, it silently skips (no build error).

## Page Structure

- **`index.html`** — Landing page with sections: Home, O Nas, ARMA 3, Arma Reforger, War Thunder, Kontakt. Modern Bootstrap-based.
- **`serwery.html`** — Dedicated servers page with GameTracker/GameMonitoring/BattleMetrics badges. Modern Bootstrap-based.
- **`elements.html`** / **`generic.html`** — Legacy Spectral theme pages (reference/demo).
- **`feed.xml`** — RSS feed (iterates `site.posts`; currently no posts exist).

## Other Notes

- `.sqf` files scattered in `assets/` and `bootstrap/` are **Arma mission scripting files** — not web assets, left from the community's game development work.
