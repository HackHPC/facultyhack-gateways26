# Pickup & Go — FacultyHack@Gateways 2026 site

Handoff notes for continuing this work in a new session. Written 2026-07-16,
updated same day after getting a real local build working.

## What this is

A Jekyll static site for the **FacultyHack@Gateways 2026** program, built for
deployment to GitHub Pages at `https://github.com/HackHPC/facultyhack-gateways26`
(→ `https://hackhpc.github.io/facultyhack-gateways26`). Built mobile-first,
targeting WCAG 2.2 AA.

**Nothing has been committed to git yet.** Everything below is untracked in
the working tree (`git status --short` shows `??`) — decide when to commit.

## Files created

| File | Purpose |
|---|---|
| `_config.yml` | Site config. `url`/`baseurl` set for the `HackHPC/facultyhack-gateways26` repo. Pulls in `jekyll-seo-tag`, `jekyll-sitemap`. Excludes non-site files (`README.md`, `PICKUP_AND_GO.md`, `Gemfile`, `Gemfile.lock`, `.bundle`, `vendor`) from the build output. |
| `_layouts/default.html` | Base layout: skip link, `<header>`/`<nav>`/`<main>`/`<footer>` landmarks, footer content (archives, source link, sponsors, NSF acknowledgment). |
| `index.html` | Homepage content: Hero, Overview, Challenges & Honorarium, Apply sections. Uses `layout: default`. |
| `assets/css/style.css` | Mobile-first stylesheet, CSS custom properties for theming, min-width media queries at `40em`. |
| `Gemfile` / `Gemfile.lock` | Modern Jekyll 4.4, **not** the `github-pages` gem — see "Toolchain" below for why. `Gemfile.lock` is committed intentionally, for reproducible CI builds. |
| `.gitignore` | Excludes `_site/`, `.jekyll-cache/`, `.sass-cache/`, `.bundle/`, `vendor/`. |

Original `README.md` (pre-existing, not written by me) was the source of
truth for real content — the Google Form application link and the per-year
archive repo URLs (which have inconsistent casing/trailing slashes across
years) were copied from there rather than invented.

## Toolchain: why plain Jekyll instead of the `github-pages` gem

This machine's system Ruby is 2.6.10 — far too old for any current Jekyll
toolchain. The fix path went through several dead ends worth knowing about
before you touch Ruby/Gemfile on this machine again:

1. **System Ruby (2.6.10):** `gem install jekyll` fails (`rouge >= 3.0`
   needs Ruby ≥ 2.7); `bundle install` fails (`ffi` needs Ruby ≥ 3.0).
2. **Installed Homebrew Ruby 4.0.6** (`brew install ruby`) to fix that. Its
   `bin/` and gem `bin/` dir are on `PATH` via `~/.zshrc`.
3. Tried keeping the `github-pages` gem (matches GH's own legacy Pages
   builder exactly) on Homebrew Ruby 4.0.6 — **failed**: the `github-pages`
   gem pins `jekyll 3.9.0` / `liquid 4.0.3`, and `liquid` calls
   `String#tainted?`, which Ruby 3.2+ removed outright (not just
   deprecated). Unfixable with a Gemfile patch.
4. User chose to try preserving `github-pages` gem parity via an isolated
   older Ruby instead of switching. Installed `rbenv` + `ruby-build`
   (Homebrew), tried Ruby 3.1.7 (last version before `tainted?` removal) —
   **failed**: the `ext/socket` native extension couldn't compile.
   `extconf.rb` does a hardcoded `File.read('/usr/include/netinet6/in6.h')`,
   but this macOS doesn't expose `/usr/include` at all (headers now live
   only inside the Xcode Command Line Tools SDK bundle). The known fix is a
   **sudo, system-wide symlink** (`ln -s $(xcrun --show-sdk-path)/usr/include
   /usr/include`) — a machine-wide change just to work around a 2022 Ruby
   release's build script bug.
5. Given that, switched to the option that needs no sudo and no exotic
   Ruby version: **plain modern `jekyll` (~> 4.4) on Homebrew Ruby 4.0.6.**
   This is also what GitHub itself now recommends for anything beyond a
   trivial site — build via a GitHub Actions workflow using
   `actions/jekyll-build-pages`, rather than relying on GitHub's legacy
   auto-builder (which is what actually requires the ancient `github-pages`
   gem pin in the first place).

**Net effect:** this repo is *not yet* wired to auto-deploy. GitHub's
default Pages auto-builder would still try to use its own legacy Jekyll
3.9 pipeline server-side regardless of this repo's Gemfile — for that
pipeline to actually pick up `jekyll-seo-tag`/`jekyll-sitemap` and behave
predictably, either:
- **switch the repo's Pages source to "GitHub Actions"** (Settings → Pages
  → Build and deployment → Source) and add a workflow using
  `actions/jekyll-build-pages` + `actions/deploy-pages` (not yet written —
  next thing to do), or
- go back to the `github-pages` gem for the *deployed* build even though
  local dev uses plain Jekyll (works fine — GitHub's builder ignores the
  local Gemfile entirely when using the legacy source anyway).

If continuing, ask the user which Pages source model they want before
writing a workflow file.

## Local dev environment set up on this machine

Two new Rubies now exist here (not committed to the repo, this is machine
state):
- **Homebrew Ruby 4.0.6** at `/opt/homebrew/opt/ruby/bin/ruby` — this is
  what `ruby`/`bundle`/`gem` resolve to via `PATH` in `~/.zshrc`, and what
  this project's `Gemfile` is built against.
- **rbenv + Ruby 3.1.7** — installed during the abandoned `github-pages`
  gem attempt above. Ruby 3.1.7 itself is usable but **missing the
  `socket` extension** (see step 4 above), so it can't run Bundler at all
  right now. Not currently used by this project (no `.ruby-version` file).
  Safe to leave installed or `rbenv uninstall 3.1.7` to reclaim space —
  nothing in this repo depends on it anymore.

To run the site locally from a fresh shell:
```bash
cd /Users/jeaimehp/Documents/active/facultyhack26/facultyhack-gateways26
bundle install                       # only needed after Gemfile changes
bundle exec jekyll serve --livereload
# → http://127.0.0.1:4000/facultyhack-gateways26/
```
Note the `/facultyhack-gateways26/` path suffix — that's `baseurl` from
`_config.yml`, the homepage is not at bare `localhost:4000`.

## Key decisions worth knowing before you touch this

- **Focus ring color deviates from the prompt's literal example.** The spec
  suggested `outline: 3px solid #FFD700`. I checked the actual contrast math:
  `#FFD700` on the site's `#F8F9FA` background is ~1.3:1, well under the 3:1
  minimum WCAG 1.4.11 requires for a focus indicator to be legally/actually
  visible. I used `#B45309` (a darker amber) instead — it clears 3:1 against
  the off-white body, the white header, and the dark footer. This is
  documented inline as a comment at the top of `style.css`. If asked to
  restore the literal gold, flag this tradeoff to the user first.
- **Color palette contrast, as implemented:**
  - `#212529` text on `#F8F9FA` bg: ~15.9:1 (way over AA)
  - `#0056B3` links on `#F8F9FA` bg: ~6.6:1 (passes AA, doesn't quite hit AAA 7:1)
  - White text on `#0F753C` (button bg): ~5.8:1 (passes AA)
  - `#B45309` focus ring vs `#F8F9FA`/white/dark footer: all ≥3:1
- **Nav is pure CSS, no JS.** Deliberately skipped a hamburger-menu/JS
  toggle pattern in favor of an always-visible, stacked-then-inline nav
  list. Simpler, fully keyboard operable by default, no focus-trap/ARIA-state
  code to get wrong. There is no `assets/js/` directory at all. Don't add a
  JS toggle unless there's an actual content-overflow reason to.
- **`main` has `tabindex="-1"` and `outline: none` on its own
  `:focus-visible`.** This is intentional, not a stray accessibility
  violation — `main` is only a *programmatic* focus target for the skip
  link, never part of normal tab order, so suppressing its own focus ring
  is the standard skip-link pattern. Every genuinely tab-reachable element
  keeps the visible amber ring.

## Verification status

**A real `jekyll build` now succeeds** (Jekyll 4.4.1, Homebrew Ruby 4.0.6):
```
Configuration file: .../\_config.yml
      Generating...
                    done in 0.016 seconds.
```
Output in `_site/`: `index.html`, `assets/css/style.css`, `sitemap.xml`,
`robots.txt` — no stray files (README/PICKUP_AND_GO/Gemfile correctly
excluded). `baseurl` is applied correctly (`href="/facultyhack-gateways26/
assets/css/style.css"` in the rendered HTML).

**`jekyll serve` also verified working**: started it on port 4001,
`curl`'d both `/facultyhack-gateways26/` and the CSS asset, both returned
`HTTP 200`, then stopped the server cleanly.

Earlier, before a build was possible, I also did static analysis (still
true, still worth knowing): `_config.yml` parses as valid YAML; rendered
layout+content has balanced/correctly-nested HTML tags; heading hierarchy
is h1 → h2 → h3 with no skips; exactly one each of
`<header>`/`<nav>`/`<main>`/`<footer>`; no unguarded `outline: none` outside
the intentional `main` case above.

**Still not done:** this has never been opened in an actual browser window.
The mobile-first reflow, 400% zoom behavior, and visual correctness of the
rendered page are unverified by eye — only structurally/statically checked
plus an HTTP 200 smoke test.

## To continue in a new session

1. **Open it in a real browser** (`bundle exec jekyll serve --livereload`,
   see command above) and check:
   - Mobile-first layout at narrow widths, then the `40em` breakpoint
   - 400% browser zoom — no horizontal scroll, content reflows
   - Keyboard-only pass: Tab through the whole page, confirm skip link
     works and the amber focus ring is visible on every stop
   - A contrast-checker extension against the live rendered colors (the
     math above was done by hand, worth double-checking with a tool)
2. **Decide the GitHub Pages deployment model** (see "Toolchain" section
   above) — GitHub Actions workflow with modern Jekyll, or fall back to
   `github-pages` gem for the deployed build only. Nothing is wired up yet.
3. Nothing is committed yet — decide when to `git add` / commit. `.gitignore`
   now exists (`_site/`, `.jekyll-cache/`, `.sass-cache/`, `.bundle/`,
   `vendor/`); `Gemfile.lock` is deliberately *not* ignored.
4. Not yet built: any pages beyond the homepage (e.g. a dedicated FAQ or
   past-cohort page), a real favicon (currently `<link rel="icon"
   href="data:,">`, i.e. deliberately blank).

## Repo layout at handoff

```
.
├── .gitignore
├── Gemfile
├── Gemfile.lock
├── README.md            (pre-existing, source of truth for real content)
├── PICKUP_AND_GO.md      (this file)
├── _config.yml
├── _layouts/
│   └── default.html
├── assets/
│   └── css/
│       └── style.css
└── index.html
```
