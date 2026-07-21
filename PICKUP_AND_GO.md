# Pickup & Go — FacultyHack@Gateways 2026 site

Handoff notes for continuing this work in a new session. Originally written
2026-07-16; updated 2026-07-17 (many passes) after adding the Mentors page,
running a full WCAG 2.2 AA audit with fixes, generating mentor bios from
sourced data, wiring in mentor photos, adding sponsor data/logos, adding an
Organizers page, rebuilding the color palette from user-supplied brand
colors, adding a logo watermark to the hero and footer, and adding
Experience (history) and Specialty sections to mentor cards.

## What this is

A Jekyll static site for the **FacultyHack@Gateways 2026** program, built for
deployment to GitHub Pages at `https://github.com/HackHPC/facultyhack-gateways26`
(→ `https://hackhpc.github.io/facultyhack-gateways26`). Built mobile-first,
targeting WCAG 2.2 AA. Three pages exist: the homepage (`index.html`), a
Mentors directory (`mentors.html`, driven by `_data/mentors.yml`), and an
Organizers page (`organizers.html`, driven by `_data/organizers.yml`).
Mentors and Organizers share one card partial, `_includes/person-card.html`.

## Git status — read this before committing anything

One commit already exists (`5e9d76e "wcag 2 aa inital reconfigure"`,
2026-07-16), made by the user, containing the original site: `.gitignore`,
`Gemfile`/`Gemfile.lock`, `_config.yml`, `_layouts/default.html`,
`assets/css/style.css`, `index.html`, and the previous version of this file.

**Since that commit, the working tree has further changes that are NOT
committed:**
- Modified: `PICKUP_AND_GO.md`, `_config.yml`, `_layouts/default.html`,
  `assets/css/style.css`, `index.html`
- New, untracked: `_data/` (mentors.yml, sponsors.yml, organizers.yml),
  `_includes/` (`person-card.html` + `icons/`, 6 SVGs), `assets/images/`
  (`mentors/` — 8 photos + README, `sponsors/` — 6 logos, `organizers/` —
  6 avatars, `branding/` — the site logo SVG), `mentors.html`,
  `organizers.html`

Run `git status --short` to confirm before assuming anything is saved.
Nothing has been pushed to `HackHPC/facultyhack-gateways26` — this is all
local. Worth deciding whether the ~21 binary image files should really go
into git directly or via Git LFS before committing — none are huge
individually (the logo SVG is the largest at ~575KB) but it's worth a
conscious choice, not a default.

## Files

| File | Purpose |
|---|---|
| `_config.yml` | Site config. `url`/`baseurl` set for the `HackHPC/facultyhack-gateways26` repo. Pulls in `jekyll-seo-tag`, `jekyll-sitemap`. Excludes non-site files from the build output. |
| `_layouts/default.html` | Base layout: skip link, `<header>`/`<nav>`/`<main>`/`<footer>` landmarks, nav includes "Mentors" and "Organizers" links with `aria-current="page"` when active, footer content (archives, source link, data-driven sponsor logos, NSF acknowledgment). |
| `index.html` | Homepage content: Hero, Overview, Challenges & Honorarium, Apply sections. |
| `mentors.html` | Mentors directory page. Loops `site.data.mentors`, rendering each via `_includes/person-card.html`. |
| `organizers.html` | Organizers page. Same pattern, loops `site.data.organizers` via the same `person-card.html` partial. |
| `_includes/person-card.html` | Shared card partial — takes a `person` param, used by both Mentors and Organizers. Renders: photo, name, linked affiliation, `specialty` tag pills, `bio`, sorted `history` ("Experience") list, and labeled/iconed `links`. Every field is individually optional (`{% if %}`-guarded), so Organizers (no `history`/`specialty` data) renders cleanly without those sections. |
| `_data/mentors.yml` | Mentor records — see "Mentors page" section below for the schema and how the content was sourced. |
| `_data/organizers.yml` | Organizer records, carried over from last year's site — see "Organizers page" section below. |
| `_data/sponsors.yml` | Sponsor records (name/url/logo, one with a nested NSF grant block) — see "Sponsors" section below. |
| `_includes/icons/{linkedin,facebook,scholar,link,twitter,github}.svg` | Inline SVG icons for person/sponsor links, included via `{% include icons/{{ link.icon }}.svg %}`. All `aria-hidden="true" focusable="false"` — purely decorative, the link's visible text is the only accessible name. |
| `_includes/site-logo.html` | Inline `<img>` of the site logo, `alt="FacultyHack@Gateways 2026"`. Used on Mentors/Organizers hero areas (logo beside the title). **Not** used on the homepage — see "Logo & brand palette" section below for why. |
| `assets/images/branding/FacultyHack26_logo.svg` | The site logo, supplied directly by the user. It's pure black/grayscale raster data wrapped in an SVG (confirmed by extracting and pixel-analyzing the embedded images) — no color info in it at all. See "Logo & brand palette" section. |
| `assets/images/mentors/*` | Mentor headshots (8 of 10 mentors so far) + a `README.md` (excluded from the build via `_config.yml`) documenting the permission requirement and naming convention. See "Mentor photos" section below. |
| `assets/images/organizers/*` | 6 organizer avatars, reused from last year's site (org's own asset, same recurring purpose — see "Organizers page" section). |
| `assets/images/sponsors/*` | 6 sponsor/grant-agency logos, reused from last year's site. |
| `assets/css/style.css` | Mobile-first stylesheet, CSS custom properties for theming (brand palette), shared person-card/grid/photo/specialty/history styles (used by both Mentors and Organizers), footer sponsor-logo styles, hero/footer watermark styles. |
| `Gemfile` / `Gemfile.lock` | Modern Jekyll 4.4, **not** the `github-pages` gem — see "Toolchain" below for why. `Gemfile.lock` is committed intentionally, for reproducible CI builds. |
| `.gitignore` | Excludes `_site/`, `.jekyll-cache/`, `.sass-cache/`, `.bundle/`, `vendor/`. |

Original `README.md` (pre-existing) was the source of truth for homepage
content — the Google Form application link and per-year archive repo URLs
were copied from there rather than invented.

## Mentors page — data provenance and privacy rules

The user pasted a raw spreadsheet export (11 rows) containing **home mailing
addresses and personal cellphone numbers** for real named mentors. That data
is **not** in this repo and must never be added to it. `_data/mentors.yml`
only stores: `name`, `affiliation`, `affiliation_url`, `bio`, and `links`
(each with `label`, `url`, `icon`) — all sourced from information the
mentors made public themselves (staff pages, LinkedIn, personal sites,
Google Scholar) or that's already public elsewhere (institutional
homepages). **Never add phone numbers, mailing addresses, or personal email
addresses to this file.**

Notes on the current 10 entries (deduped from 11 rows — "Mohamed Elbakary"
appeared twice with different addresses, kept as one entry):

- **`affiliation_url`** is each institution's homepage, derived from the
  mentor's own institutional email domain in the original spreadsheet
  (e.g. `mohammed.elmellouki@mvsu.edu` → `mvsu.edu`), not guessed.
- **`links`** include every public link the mentor actually provided
  (LinkedIn, Facebook, personal sites, Google Scholar, staff/department
  pages) — the user explicitly asked for all of them, not just one.
- **`bio`** (~60–135 words each, not a flat 150) was generated by fetching
  each mentor's staff-profile/personal-site/Scholar page plus corroborating
  web search, and writing only from verified facts — no invented
  biographical details. Two mentors (**Mohamed Elbakary**, **Sajida
  Faiyaz**) have thin public footprints, so their bios are shorter rather
  than padded with filler.
- **Worth the user double-checking:**
  - **Anas AlSobeh**'s "Current Affiliation" field in the original
    spreadsheet literally said "Assistant Professor of Applied AI" (a
    title, not an institution). Affiliation was inferred as **Utah Valley
    University** from his mailing address and UVU directory link — very
    likely correct, but an inference, not a direct statement.
  - **Mohammed Elmellouki**'s Google Scholar profile shows a verified
    `msstate.edu` (Mississippi State University) email, while he's listed
    at Mississippi Valley State University here. Corroborated via search
    that an MVSU professor of that name does matching CFD/heat-transfer
    research, so it's very likely the same person (Scholar often keeps a
    stale PhD-institution email) — but flag this to the mentor before
    publishing if you want certainty.
- Icon mapping: `linkedin`/`facebook`/`scholar` get colored brand-ish
  badges; anything else (staff profile, personal site, department page)
  gets the generic neutral `link` (external-link arrow) icon in
  `currentColor`.

**`history`** (rendered as "Experience" on the card): the user supplied a
full year-by-year table of past FacultyHack teams/faculty/mentors
(2022-2025) and asked to fold in "what other facultyhacks and roles"
applied to each current mentor. All 10 appear somewhere in that table —
notably, 6 of them (Al-Omari, Doswell, Elbakary, Elmellouki, Ojo, Perry)
show up first as **Faculty Participants** in earlier years before their
current Mentor role, a "grew through the program" pattern worth keeping
visible. Each entry started as `{year, role, team, plus faculty/mentors/
co_mentors/co_participants}`, then the user asked to strip everything
down to just `{year, role}` — done literally (removed `team` and every
people-list field, not just the ones named "mentors"). Rendered sorted
most-recent-first via `{% assign sorted_history = ... | sort: "year" |
reverse %}` in `person-card.html`. **John Holmen shows "2025 — Mentor"
twice** — accurate (two different courses that year), not a bug; the
distinguishing detail was removed per the user's own request, so it now
reads as a visual duplicate. Left as-is rather than silently deduped.

**`specialty`** (rendered as pill badges under the affiliation): 1-2 short
tags per mentor. For 7 mentors (Al-Omari, AlSobeh, Doswell, Elmellouki,
Holmen, MacCarthy, Elbakary) these came from their staff-profile/personal-
site/Scholar data already fetched for the bios. For the 3 mentors whose
**only** link is LinkedIn (Sajida Faiyaz, Olabisi Ojo, Sabrina Perry),
LinkedIn was tested directly and confirmed unfetchable — returns
**HTTP 999**, LinkedIn's standard anti-scraping block. Their specialty
tags are derived from their existing (non-LinkedIn-sourced) bio text
instead. If asked to refresh mentor data from LinkedIn again, don't
re-attempt the fetch — it's blocked, not flaky.

## Mentor photos

When first asked to add photos, I refused to auto-download them from
LinkedIn/Facebook/institutional pages and scrape-rehost them — those images
are copyrighted (usually by the institution or a photographer, not the
mentor) and a public profile link doesn't imply reuse rights, on top of
LinkedIn/Facebook's anti-scraping ToS. The user then supplied actual image
files directly, which is the correct path. If asked to add more photos this
way again, don't fetch them automatically — same reasoning applies.

Current state: **8 of 10 mentors have a photo**, wired up via a `photo:`
field in `_data/mentors.yml` pointing at a file in
`assets/images/mentors/`. Missing: **Mohammed Elmellouki** and **Sajida
Faiyaz**. The `mentors.html` template and CSS (`.mentor-card__header`,
`.mentor-card__photo`) already handle mentors with or without a photo
gracefully — no broken images, no empty placeholder circles for the two
without one.

Filenames as supplied don't follow one consistent convention (mixed casing,
hyphens vs. underscores, mixed extensions including one `.JPG` and one
`.jpeg`/`.png`) — e.g. `ahmad-al-omari.jpg`, `anas_alsobeh.jpg`,
`Felicia-Doswell.jpg`, `elbakary.JPG`. This is fine functionally (each
`photo:` path in the YAML matches its file exactly, verified via a real
build — Jekyll copies and serves all of them correctly, `relative_url`
resolves paths without a leading slash fine too), but note **file name
casing matters on GitHub Pages' Linux build servers** even though it's
forgiving on this Mac's case-insensitive filesystem — if a future edit ever
changes a `photo:` path's casing without renaming the actual file to match
exactly, it'll 404 in production but look fine locally. Double-check this
if photos ever go missing after a deploy.

All `<img>` tags use `alt=""` (decorative) since the mentor's name is
already the adjacent `<h2>` — verified this doesn't regress the WCAG audit
(alt attribute present on all 8, tag balance and duplicate-id checks still
clean after adding them).

## Logo & brand palette

Two separate requests, worth keeping distinct since they hit different
problems:

**The logo has no color in it.** When asked to use colors from
`assets/images/branding/FacultyHack26_logo.svg` as brand colors, I
extracted and pixel-analyzed the SVG's two embedded raster images instead
of just eyeballing the file — both are 85-87% solid black with grayscale
antialiasing, zero chromatic pixels. It's a monochrome silhouette wrapped
in `feColorMatrix` filters (one tints it white, one converts luminance to
alpha), not a color logo. Don't try to "extract brand colors" from it
again; there aren't any.

**Brand palette is 5 user-supplied hex values**, not derived from
anything: Soft Ivory `#FAFAF7`, Root Brown `#6B4A2A`, Forest Olive
`#55661A`, Warm Brown/Gold `#876237`, Olive Green `#6E7D1F`. Mapped in
`:root` in `style.css` (documented inline at the top of that file) as:
`--color-bg` (Ivory), `--color-text` (Root Brown, body copy, 7.6-8.0:1 —
AAA), `--color-link` (Forest Olive, 6.1-6.4:1 — AA), `--color-accent`
(Warm Brown/Gold, buttons with white text, 5.5:1 — AA), `--color-heading`
(Olive Green, **`main h1` only**, 4.35:1).

Olive Green is the constraint to remember: it clears the 3:1 large-text
minimum but falls short of 4.5:1 for normal text (measured, not assumed).
That's why it's scoped to page `<h1>`s only — not `h2`/`h3`, and
specifically not the mentor/organizer card names (`.mentor-card__name` is
an `h2` at 18px, just under the large-text bold threshold of 18.66px, so
it needs the full 4.5:1 and Olive Green doesn't clear it there).

**`--color-footer-bg` is deliberately its own variable**, not tied to
`--color-text`, even though before the palette existed the footer reused
`--color-text` for its background. Root Brown (L≈0.082) is much lighter
than the old charcoal (L≈0.018) was — if the footer background used Root
Brown, the existing amber focus ring (`#B45309`) would drop to ~1.6:1
there (checked the math: no single flat color clears 3:1 against both a
near-white Ivory body and a medium-dark footer at once). Footer stays the
original dark charcoal so the already-verified focus ring keeps working
everywhere.

**Hero/footer watermark**: the logo now also renders as a low-opacity
(`0.08`) decorative CSS `background-image` — homepage hero only (left
side, `.hero::before`), and the shared footer (`.site-footer::before`,
appears on all pages via `_layouts/default.html`). Two things worth
knowing if touching this again:
- The correctly-`baseurl`-prefixed asset URL is passed in via an inline
  `style="--hero-logo: url('...')"` / `--footer-logo` custom property set
  on the section/footer element in the `.html` templates — `style.css`
  itself has no front matter and isn't Liquid-processed, so it can't
  resolve `relative_url` directly.
- The footer version adds `filter: invert(1)` — the logo is solid black,
  which would be invisible against the dark footer background without
  inverting it to white first. The hero version (light Ivory background)
  doesn't need this.
- Both are pure CSS decoration (`::before` pseudo-elements, `pointer-events:
  none`), not `<img>` tags — no alt text needed or possible, and no
  accessible-name loss since the adjacent heading text already states
  "FacultyHack@Gateways 2026" (hero) or is inside the footer where the
  logo is purely decorative background texture.
- On Mentors/Organizers, the logo instead renders as an actual `<img>`
  beside the page title (via `_includes/site-logo.html`), NOT as a
  background watermark — only the homepage hero and the shared footer use
  the watermark treatment. Don't assume all three pages behave the same
  way here.

## Organizers page

Added by request to mirror last year's roster at
`HackHPC/facultyhack-gateways25/_data/organizers.yml`. All 6 organizers
(Amy Cannon, Dr. Linda Hayden, Charlie Dey, Alexander Nolte, Je'aime
Powell, Boyd Wilson) carried over, bios reused verbatim from that source —
this was explicit "reuse the same data" request, not a research task like
the mentor bios were, so no fresh sourcing/verification was done on these.

- **Emails dropped**, same rule as mentors — the source file had personal
  and work emails for each organizer, none of that is in this repo.
- **ResearchGate links dropped.** The source only stored short profile
  codes (e.g. `"L-Hayden"`), not full URLs, and ResearchGate profile URLs
  need an exact numeric suffix that can't be reliably reconstructed from a
  short code — rather than guess and risk a broken/wrong link, it was left
  out entirely.
- **Google Scholar and ORCID links WERE constructed** from the short IDs
  the source stored, because those platforms' URL patterns are
  deterministic and well-known (`scholar.google.com/citations?user=<id>`,
  `orcid.org/<id>`) — a meaningfully different confidence level than
  ResearchGate's ambiguous slugs.
- **Two new icons added** (`_includes/icons/{twitter,github}.svg`) since
  organizers link out to those platforms and mentors didn't.
- **Known data inconsistency, not silently fixed:** Je'aime Powell's entry
  has `affiliation: "Omnibond"` (from the source's `affiliation`/`site`
  fields), but the bio text itself says he currently works at TACC. This
  contradiction already existed in last year's source file — reused
  faithfully rather than editorialized, since the user asked to reuse last
  year's data, not correct it. Flagged to the user already; worth them
  deciding which is current.
- **Photos**: unlike the mentor-photo situation (refused to auto-scrape
  from LinkedIn/Facebook), organizer avatars were fetched directly from
  last year's repo after explicit user confirmation — reasoning being
  these are the org's own previously-published assets, submitted by the
  organizers themselves to HackHPC for this exact recurring purpose, not a
  third-party scrape. If asked to do something similar for a *different*
  org's site, don't assume the same reasoning applies — it hinges on this
  being the same organization's own asset reused for the same purpose.

## Sponsors

`_data/sponsors.yml` carries over the 5 *active* sponsors from last year's
file at the same repo (SGX3, Oak Ridge National Laboratory, Omnibond
Systems, Texas Advanced Computing Center, HackHPC.org). Several other
entries in that source file were commented out (US-RSE, Voltron Data,
SGCI, STAR, AWS) — read as declined/inactive drafts and intentionally not
carried over. SGX3's entry has a nested `grant` block (NSF, award
#2231406) which drives the footer acknowledgment paragraph, now with a
linked NSF logo instead of being plain unlinked text. Logos fetched
directly from last year's repo (same reasoning as organizer avatars —
sponsor logos are provided by sponsors specifically for this kind of
attribution use, lowest-risk case of the three). Footer sponsor logos
render on a white chip (`.footer-sponsors__logo-link`) so any logo's own
color scheme stays legible against the dark footer background.

## Toolchain: why plain Jekyll instead of the `github-pages` gem

This machine's system Ruby is 2.6.10 — far too old for any current Jekyll
toolchain. The fix path went through several dead ends worth knowing about
before you touch Ruby/Gemfile on this machine again:

1. **System Ruby (2.6.10):** `gem install jekyll` fails (`rouge >= 3.0`
   needs Ruby ≥ 2.7); `bundle install` fails (`ffi` needs Ruby ≥ 3.0).
2. **Installed Homebrew Ruby 4.0.6** (`brew install ruby`) to fix that. Its
   `bin/` and gem `bin/` dir are on `PATH` via `~/.zshrc`.
3. Tried keeping the `github-pages` gem (matches GH's own legacy Pages
   builder exactly) on Homebrew Ruby 4.0.6 — **failed**: it pins
   `jekyll 3.9.0` / `liquid 4.0.3`, and `liquid` calls `String#tainted?`,
   which Ruby 3.2+ removed outright. Unfixable with a Gemfile patch.
4. Tried preserving `github-pages` gem parity via an isolated older Ruby
   instead. Installed `rbenv` + `ruby-build`, tried Ruby 3.1.7 (last
   version before `tainted?` removal) — **failed**: the `ext/socket`
   native extension couldn't compile, because this macOS doesn't expose
   `/usr/include` at all (headers only live inside the Xcode CLT SDK
   bundle) and Ruby 3.1's `extconf.rb` hardcodes that path. The known fix
   is a **sudo, system-wide symlink** — rejected as too invasive for this.
5. Settled on: **plain modern `jekyll` (~> 4.4) on Homebrew Ruby 4.0.6.**
   No sudo, no exotic Ruby version. Also what GitHub itself now recommends
   for anything beyond a trivial site — build via a GitHub Actions workflow
   using `actions/jekyll-build-pages`, rather than GitHub's legacy
   auto-builder (which is what actually requires the ancient `github-pages`
   gem pin in the first place).

**Net effect: this repo is *not yet* wired to auto-deploy.** GitHub's
default Pages auto-builder would still try to use its own legacy Jekyll 3.9
pipeline server-side regardless of this repo's Gemfile. For that to behave
predictably (pick up `jekyll-seo-tag`/`jekyll-sitemap`, actually build
`mentors.html`, etc.), either:
- **switch the repo's Pages source to "GitHub Actions"** (Settings → Pages
  → Build and deployment → Source) and add a workflow using
  `actions/jekyll-build-pages` + `actions/deploy-pages` (not yet written —
  next thing to do), or
- go back to the `github-pages` gem for the *deployed* build only, while
  local dev keeps using plain Jekyll.

If continuing, ask the user which Pages source model they want before
writing a workflow file.

## Local dev environment set up on this machine

Two Rubies exist here (machine state, not part of the repo):
- **Homebrew Ruby 4.0.6** at `/opt/homebrew/opt/ruby/bin/ruby` — what
  `ruby`/`bundle`/`gem` resolve to via `PATH` in `~/.zshrc`, and what this
  project's `Gemfile` is built against.
- **rbenv + Ruby 3.1.7** — installed during the abandoned `github-pages`
  gem attempt. Missing the `socket` extension, can't run Bundler. Not used
  by this project (no `.ruby-version` file). Safe to
  `rbenv uninstall 3.1.7` to reclaim space if desired.

To run the site locally from a fresh shell:
```bash
cd /Users/jeaimehp/Documents/active/facultyhack26/facultyhack-gateways26
bundle install                       # only needed after Gemfile changes
bundle exec jekyll serve --livereload
# → http://127.0.0.1:4000/facultyhack-gateways26/
# → http://127.0.0.1:4000/facultyhack-gateways26/mentors/
# → http://127.0.0.1:4000/facultyhack-gateways26/organizers/
```
Note the `/facultyhack-gateways26/` path suffix — that's `baseurl` from
`_config.yml`.

## WCAG 2.2 AA audit — findings and fixes (2026-07-17)

A full pass was done against the built HTML/CSS. Two real bugs were found
and fixed (not style opinions — both were verified with the actual rendered
output):

1. **Duplicate `id="apply"`** existed on both the hero CTA link and the
   `<section id="apply">` further down `index.html`. Browsers resolve a
   `#apply` fragment link to the *first* match, so the nav's "Apply" link
   was actually jumping to the hero, not the Apply section. Fixed by
   removing the stray `id` from the hero CTA link.
2. **`aria-hidden="true"` on the "@" in the brand link** (`_layouts/
   default.html`) caused screen readers to announce
   "FacultyHackGateways 2026" instead of matching what sighted users see.
   Fixed by removing the `aria-hidden` wrapper — the "@" is now read
   normally.

Everything else passed: contrast ratios (documented in "Key decisions"
below), heading hierarchy (h1→h2→h3, no skips, checked programmatically),
landmark counts, keyboard operability (everything is a native `<a>`, no
custom widgets), focus order matching DOM/visual order, and link-purpose
clarity. Full ratio table and reasoning is in the conversation history if
needed again; the essentials are captured below.

## Key decisions worth knowing before you touch this

- **Focus ring color deviates from a literal `#FFD700` gold.** `#FFD700` on
  this site's `#F8F9FA` background measures ~1.3:1, under the 3:1 minimum
  WCAG 1.4.11 requires for a focus indicator to actually be visible. Using
  **`#B45309`** (a darker amber) instead — clears 3:1 against the off-white
  body, white header, and dark footer. Documented inline at the top of
  `style.css`. Flag this tradeoff to the user before reverting it.
- **Color contrast, as implemented:**
  - `#212529` text on `#F8F9FA` bg: ~15.9:1
  - `#0056B3` links on `#F8F9FA`/white bg: ~6.7:1
  - White text on `#0F753C` buttons: ~5.8:1
  - `#495057` mentor-affiliation label / footer border color on light bg: ~7.8:1
  - `#F8F9FA` footer text / `#9EC8FF` footer links on `#212529` footer bg: ~14.6:1 / ~8.9:1
  - `#B45309` focus ring vs. off-white/white/dark footer: all ≥3:1
- **Nav is pure CSS, no JS.** No hamburger/toggle pattern, no `assets/js/`
  directory at all. Everything interactive is a native `<a>`/`<button>` (in
  SVGs, decorative only). Don't add JS unless there's an actual reason to.
- **`main` has `tabindex="-1"` and `outline: none` on its own
  `:focus-visible`.** Intentional — `main` is only a *programmatic* focus
  target for the skip link, never part of tab order. Standard skip-link
  pattern, not a stray accessibility violation.
- **Mentor grid caps at 2 columns**, not 3 — with ~100–130 word bios per
  card, a third column made the text uncomfortably narrow. Breakpoint is
  `48em`, wider than the rest of the site's `40em`, on purpose.

## Verification status

**A real `jekyll build` succeeds** (Jekyll 4.4.1, Homebrew Ruby 4.0.6) for
all three pages. Output in `_site/`: `index.html`, `mentors/index.html`,
`organizers/index.html`, `assets/css/style.css`, `sitemap.xml`,
`robots.txt`, and every image (8 mentor photos, 6 organizer avatars, 6
sponsor/grant logos) under `assets/images/` — no stray files (both
`README.md` docs in `assets/images/mentors/` are correctly excluded).
`baseurl` applies correctly on all three pages and every image `src`.

**`jekyll serve` also verified working** via `curl` smoke tests (HTTP 200
on homepage, mentors page, and the CSS asset — done earlier; organizers
page was verified via the build output check instead, not re-curled, but
uses the identical `person-card.html` partial already proven to work).

Static analysis done on every build so far (still true, now covers all
three pages): `_config.yml` parses as valid YAML; rendered HTML has
balanced/correctly-nested tags (checked with Python's `html.parser`, void
elements including SVG `rect`/`path`/`text` accounted for); heading
hierarchy has no skips on any page; no duplicate `id`s anywhere; no
unguarded `outline: none` outside the intentional `main` case.

Every subsequent change (brand palette swap, hero/footer watermark,
Experience/Specialty sections) was rebuilt and re-verified the same way:
tag balance, no duplicate `id`s, heading hierarchy intact, plus targeted
checks for that specific change (e.g. a small Python script computing
actual WCAG contrast ratios for every new color pairing before considering
the palette swap done — see "Logo & brand palette" section for the
numbers).

**Still not done:** no page has been opened in an actual browser window.
Mobile-first reflow, 400% zoom behavior, real screen-reader output, and
visual correctness are unverified by eye — only structurally/statically
checked plus HTTP-level smoke tests (and those only on Home/Mentors, not
Organizers, and only from before the watermark/palette work).

## To continue in a new session

1. **Open all three pages in a real browser** (`bundle exec jekyll serve
   --livereload`) and check:
   - Mobile-first layout at narrow widths, then the `40em`/`48em`
     breakpoints
   - 400% browser zoom — no horizontal scroll, content reflows
   - Keyboard-only pass: skip link, nav (including Mentors/Organizers
     links and their `aria-current`), all card links on both directory
     pages, focus ring visibility throughout
   - A contrast-checker extension against live rendered colors (the math
     above was done by hand)
2. **Decide the GitHub Pages deployment model** (see "Toolchain" section)
   — nothing is wired to auto-deploy yet.
3. **Decide when to commit.** Working tree has uncommitted changes on top
   of the one existing commit — see "Git status" section at the top.
4. **Verify the flagged data uncertainties** with the actual people before
   this goes to production:
   - Mentors: AlSobeh's inferred affiliation, Elmellouki's Scholar-profile
     institution mismatch (see "Mentors page" section)
   - Organizers: Je'aime Powell's affiliation/bio contradiction (see
     "Organizers page" section)
5. **Get photos for the remaining 2 mentors** (Mohammed Elmellouki, Sajida
   Faiyaz) — same rule as the other 8: only with confirmed permission for
   that specific image, never auto-scraped. See "Mentor photos" section.
6. **Decide whether to fix or accept** John Holmen's duplicate "2025 —
   Mentor" line and the thin/unverified LinkedIn-only specialty tags
   (Faiyaz, Ojo, Perry) — both are documented above, neither is a bug.
7. Not yet built: any pages beyond Home/Mentors/Organizers, a real favicon
   (currently `<link rel="icon" href="data:,">`, i.e. deliberately blank).

## Repo layout at handoff

```
.
├── .gitignore
├── Gemfile
├── Gemfile.lock
├── README.md              (pre-existing, source of truth for homepage copy)
├── PICKUP_AND_GO.md        (this file)
├── _config.yml
├── _data/
│   ├── mentors.yml
│   ├── organizers.yml
│   └── sponsors.yml
├── _includes/
│   ├── person-card.html
│   ├── site-logo.html
│   └── icons/
│       ├── facebook.svg
│       ├── github.svg
│       ├── link.svg
│       ├── linkedin.svg
│       ├── scholar.svg
│       └── twitter.svg
├── _layouts/
│   └── default.html
├── assets/
│   ├── css/
│   │   └── style.css
│   └── images/
│       ├── branding/
│       │   └── FacultyHack26_logo.svg
│       ├── mentors/
│       │   ├── README.md          (excluded from build)
│       │   ├── ahmad-al-omari.jpg
│       │   ├── anas_alsobeh.jpg
│       │   ├── Felicia-Doswell.jpg
│       │   ├── elbakary.JPG
│       │   ├── john_holmen.jpg
│       │   ├── elijah_maccarthy.jpg
│       │   ├── olabisi_ojo.jpeg
│       │   └── sabrina_perry.png
│       ├── organizers/
│       │   ├── amy-cannon.png
│       │   ├── linda-hayden.jpeg
│       │   ├── charlie-dey.jpeg
│       │   ├── alexander-nolte.jpeg
│       │   ├── jeaime-powell.png
│       │   └── boyd-wilson.png
│       └── sponsors/
│           ├── sgx3.png
│           ├── nsf.svg
│           ├── ornl.png
│           ├── omnibond.svg
│           ├── tacc.svg
│           └── hackhpc.svg
├── index.html
├── mentors.html
└── organizers.html
```
