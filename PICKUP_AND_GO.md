# Pickup & Go — FacultyHack@Gateways 2026 site

Handoff notes for continuing this work in a new session. Originally written
2026-07-16; updated repeatedly through 2026-07-21. Major work since the
first version: Mentors + Organizers pages, a full WCAG 2.2 AA audit, a
user-supplied 5-color brand palette replacing the original blue/green
scheme, a **Resources page** (163 links across 11 categories, with live
search + jump-to-category + per-resource icons), and a long iterative
header/hero redesign (dark tab-style nav in a brand green, brand-brown
footer, several rounds of logo file swaps between watermark and upfront
placements). The "Logo & brand palette" and "Resources page" sections
below are the ones most likely to matter if you're picking this up cold.

## What this is

A Jekyll static site for the **FacultyHack@Gateways 2026** program, built for
deployment to GitHub Pages at `https://github.com/HackHPC/facultyhack-gateways26`
(→ `https://hackhpc.github.io/facultyhack-gateways26`). Built mobile-first,
targeting WCAG 2.2 AA. Four pages exist: the homepage (`index.html`), a
Mentors directory (`mentors.html`, driven by `_data/mentors.yml`), an
Organizers page (`organizers.html`, driven by `_data/organizers.yml`), and
a Resources page (`resources.html`, driven by `_data/resources.yml`).
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
- New, untracked: `_data/` (mentors.yml, sponsors.yml, organizers.yml,
  resources.yml), `_includes/` (`person-card.html`, `site-logo.html` +
  `icons/`, 19 SVGs), `assets/images/` (`mentors/`, `organizers/`,
  `sponsors/`, `branding/` — 4 logo files), `assets/js/resources.js`,
  `mentors.html`, `organizers.html`, `resources.html`

Run `git status --short` to confirm before assuming anything is saved.
Nothing has been pushed to `HackHPC/facultyhack-gateways26` — this is all
local. Worth deciding whether the binary image files should really go into
git directly or via Git LFS before committing — none are huge individually
(the largest logo file is ~1.1MB) but it's worth a conscious choice, not a
default.

## Files

| File | Purpose |
|---|---|
| `_config.yml` | Site config. `url`/`baseurl` set for the `HackHPC/facultyhack-gateways26` repo. Pulls in `jekyll-seo-tag`, `jekyll-sitemap`. Excludes non-site files from the build output. |
| `_layouts/default.html` | Base layout: skip link, `<header>`/`<nav>`/`<main>`/`<footer>` landmarks, nav includes "Mentors"/"Organizers"/"Resources" links with `aria-current="page"` when active (no "Apply" or "Challenges" links — both removed, see "Nav/hero/footer redesign" section), footer content (archives, source link, data-driven sponsor logos, NSF acknowledgment). Header and footer each carry an inline `style="--header-logo:..."`/`--footer-logo:...` custom property for their respective logo assets. |
| `index.html` | Homepage content: Hero (with upfront logo `<img>` + h1 + tagline + dates), Overview (with a background-watermark logo behind the text), Challenges & Honorarium. No more Apply section or Apply buttons — removed by request. |
| `mentors.html` | Mentors directory page. Loops `site.data.mentors`, rendering each via `_includes/person-card.html`. |
| `organizers.html` | Organizers page. Same pattern, loops `site.data.organizers` via the same `person-card.html` partial. |
| `resources.html` | Resources page — see "Resources page" section below. Search box + jump-to-category `<select>` toolbar, then 11 category sections of resource cards. |
| `_includes/person-card.html` | Shared card partial — takes a `person` param, used by both Mentors and Organizers. Renders: photo, name, linked affiliation, `specialty` tag pills, `bio`, sorted `history` ("Experience") list, and labeled/iconed `links`. Every field is individually optional (`{% if %}`-guarded), so Organizers (no `history`/`specialty` data) renders cleanly without those sections. |
| `_data/mentors.yml` | Mentor records — see "Mentors page" section below for the schema and how the content was sourced. |
| `_data/organizers.yml` | Organizer records, carried over from last year's site — see "Organizers page" section below. |
| `_data/sponsors.yml` | Sponsor records (name/url/logo, one with a nested NSF grant block) — see "Sponsors" section below. |
| `_data/resources.yml` | 163 resource records across 11 categories — see "Resources page" section below for provenance, dedup decisions, and the icon system. |
| `_includes/icons/*.svg` | 20 inline SVG icons: person-link icons (`linkedin`, `facebook`, `scholar`, `twitter`, `github`, `link`), resource brand badges (`google`, `microsoft`, `amazon`, `python`, `jupyter`, `figma`, `r-project`, `wikipedia`), and 11 `category-*.svg` topic icons (one per Resources category, used as the fallback when a resource has no specific brand match). All `aria-hidden="true" focusable="false"` — purely decorative, the link's visible text is the only accessible name. |
| `_includes/site-logo.html` | Inline `<img>` of the icon-only site logo, `alt="FacultyHack@Gateways 2026"`. Used on Mentors/Organizers hero areas (logo beside the title) — NOT used on the homepage or Resources page, which each handle their own logo placement differently. See "Nav/hero/footer redesign" section. |
| `assets/images/branding/*` | 4 logo files, all user-supplied, all confirmed to contain dark artwork (black/dark-brown/dark-olive/tan — none are light colors): `FacultyHack26_logo.svg` (icon only, pure monochrome black), `FacultyHack26_logo_w_text.svg` (icon + wordmark, ~1.78:1), `FacultyhHack26_text.svg` (wordmark only, ~3.74:1, used in the header nav bar), `FacultyHack26_logo_w_text.jpg` (unused). See "Nav/hero/footer redesign" section for which file is used where and why. |
| `assets/images/mentors/*` | Mentor headshots (8 of 10 mentors so far) + a `README.md` (excluded from the build via `_config.yml`) documenting the permission requirement and naming convention. See "Mentor photos" section below. |
| `assets/images/organizers/*` | 6 organizer avatars, reused from last year's site (org's own asset, same recurring purpose — see "Organizers page" section). |
| `assets/images/sponsors/*` | 6 sponsor/grant-agency logos, reused from last year's site. |
| `assets/js/resources.js` | The only JavaScript in this project — vanilla, ~50 lines, scoped to the Resources page only. Live search filter + jump-to-category smooth scroll. See "Resources page" section for why JS was justified here despite the site's otherwise no-JS rule. |
| `assets/css/style.css` | Mobile-first stylesheet, CSS custom properties for theming (brand palette), shared person-card/grid/photo/specialty/history styles, resource-card/toolbar styles, footer sponsor-logo styles, nav/hero/footer/overview watermark and logo styles. |
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

## Nav/hero/footer redesign

This went through many small iterative requests. Current end state first,
then the reasoning/gotchas underneath — if something looks inconsistent,
check here before "fixing" it.

**Current state:**
- Header nav bar: background `--color-header-bg` (Forest Olive `#55661A`),
  logo is `FacultyhHack26_text.svg` (wordmark only) inside a white,
  brown-bordered chip (`.site-header__brand a`), nav items styled as tabs
  (bottom-border indicator, `aria-current="page"` gets a bold label + full
  underline).
- Footer: background `--color-footer-bg` (Root Brown `#6B4A2A`, a
  *different* brand color from the header, deliberately not matching it),
  low-opacity logo watermark (`FacultyHack26_logo.svg`, icon-only,
  `filter: invert(1)` since it's dark artwork on a dark bar).
- Homepage hero: `FacultyHack26_logo_w_text.svg` (icon + wordmark) as a
  real, fully-visible `<img>` (`.hero__logo`, 70% width, left-justified),
  sitting above the `<h1>` — NOT a background watermark (that was tried
  and explicitly reverted).
- Homepage Overview section: `FacultyHack26_logo.svg` (icon-only) as a
  low-opacity background watermark (`.overview::before`), positioned on
  the right, mirrored horizontally.
- Mentors/Organizers hero areas: unchanged, `_includes/site-logo.html`
  (icon-only logo) as a plain `<img>` beside the page title.
- Resources page: no logo treatment of its own beyond the shared header.

**Brand palette is 5 user-supplied hex values**, not derived from
anything: Soft Ivory `#FAFAF7`, Root Brown `#6B4A2A`, Forest Olive
`#55661A`, Warm Brown/Gold `#876237`, Olive Green `#6E7D1F`. Mapped in
`:root` in `style.css` (documented inline at the top of that file) as:
`--color-bg` (Ivory), `--color-text` (Root Brown, body copy, 7.6-8.0:1 —
AAA), `--color-link` (Forest Olive, 6.1-6.4:1 — AA), `--color-accent`
(Warm Brown/Gold, buttons with white text, 5.5:1 — AA), `--color-heading`
(Olive Green, **`main h1` only**, 4.35:1), `--color-header-bg` (Forest
Olive again — deliberately NOT Olive Green, which only reaches ~4.35:1
with Ivory text, too low for normal-size nav labels), `--color-footer-bg`
(Root Brown).

**None of the logo files have any color in them.** Every one of the 4
files in `assets/images/branding/` was checked by extracting and
pixel-analyzing the actual image data (not just eyeballing it) before
using it: `FacultyHack26_logo.svg` is pure monochrome black/grayscale
raster wrapped in `feColorMatrix` filters; the two "`_w_text`"/"`_text`"
wordmark variants have real discrete fill colors (`#000000`, `#5a3d16`,
`#646b1f`, `#9a8b75`) but all four are dark/muted tones — none are light.
**This means every logo placement needs a plan for staying legible**, and
that plan differs by context:
- On a **dark** bar (header, footer): either invert it to white
  (`filter: invert(1)`, used for the footer watermark) or give it a light
  backdrop chip (used for the header — `.site-header__brand a` has
  `background-color: var(--color-bg-alt)` plus a 4px Root Brown border).
- On a **light** bg (hero, Overview): no filter needed, it's already dark
  artwork on a light surface.

**Olive Green is the contrast constraint to remember** (unrelated to the
above): it clears the 3:1 large-text minimum but falls short of 4.5:1 for
normal text (measured, not assumed). That's why it's scoped to page
`<h1>`s only — not `h2`/`h3`, not nav labels, not mentor/organizer card
names.

**Focus ring needs a context-specific override.** The main amber focus
ring (`#B45309`) only clears 3:1 against very light OR very dark
backgrounds — checked the math and there's no single flat color that
clears 3:1 against both the near-white Ivory body and either brand-color
bar at the same time (the achievable luminance windows don't overlap).
So `.site-header a:focus-visible, .site-footer a:focus-visible` override
to Ivory (`var(--color-text-inverse)`) instead — verified ≥6:1 against
both Forest Olive and Root Brown. The rest of the page keeps amber.

**A real bug worth knowing if you touch the Overview watermark again:**
`.overview::before` has `transform: scaleX(-1)` to mirror the logo, but
that pseudo-element spans the *entire section* (`inset: 0`), so the
transform mirrors the whole box — including where `background-position`
places the image within it. `background-position: left` is what actually
renders on the **right** after the flip; it looks backwards in the
source but isn't. Same trap would apply to any future `background-position`
+ `transform: scaleX(-1)` combination on a full-bleed pseudo-element.

**Background-image watermarks need the URL passed in via inline style**,
not referenced directly in `style.css` — that file has no front matter and
isn't Liquid-processed, so it can't resolve `relative_url` itself. Both
the footer (`--footer-logo`) and Overview (`--overview-logo`) watermarks
use this pattern: `style="--footer-logo: url('{{ ... | relative_url
}}');"` on the element, then `background-image: var(--footer-logo);` in
the CSS. The homepage hero USED this same pattern too at one point but was
converted to a plain `<img>` instead — don't be surprised if you see
half-finished traces of the watermark pattern in old commits/history that
no longer apply to the hero specifically.

**All watermark/decorative logo instances use `alt=""` or are pure CSS**
(never an accessible-name carrier) — reasoning is always "the adjacent
heading already states the program name in real text, so nothing is lost
for screen reader users." If a logo ever becomes the *only* thing
conveying information not stated elsewhere on the page, that reasoning
breaks and it needs real alt text instead — check before reusing this
pattern somewhere new.

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

## Resources page

163 resources across 11 categories, built up over several requests — worth
knowing the layers if you're adding more:

1. **Base set**: hand-curated by this project across Science Gateways, HPC,
   Cloud Computing, Programming, Web Development, Data Science, UX, and
   Organizations & Communities. One entry (Northwestern State University)
   has no URL — the user never provided one, so it renders as unlinked
   plain text rather than a guessed link.
2. **Merged in from `HackHPC/admi26`** (`_data/resources.yml` there) —
   AI Platforms and a large "Free AI Credits for Students" set. That
   source had richer per-entry fields (`what_you_get`, `signup`,
   `requires_edu`, `api_access`) that this site's simpler schema doesn't
   have — folded into the `description` text instead of extending the
   template for one category.
3. **Merged in from `HackHPC/hpcresources-pearc26`** (a CSV) — added 17
   more categories (Communities & Mentorship, Conferences, Careers &
   Opportunities, etc.). That source had a "Contact Person" column with
   real names/emails — **dropped entirely, for every row**, per explicit
   instruction and consistent with this file's existing privacy rules.
   One entry (NCAR Explorer Series) had its own URL truncated in the
   source CSV — left unlinked, same rule as #1.
4. **Consolidated from 26 categories down to 11** by request — grouped by
   what a reader is trying to do (e.g. "Computing & Infrastructure" =
   old HPC + Cloud Computing + Cyberinfrastructure Resources + AI
   Infrastructure) rather than keeping the source files' original labels,
   several of which only ever had 1-2 entries. Verified zero resources
   lost in the regroup (163 before, 163 after) via a small Ruby script,
   not by hand.
5. **Icons**: each of the 11 categories has a default topic icon
   (`_includes/icons/category-*.svg`, monochrome). 30 specific resources
   across well-known, easily-recognized brands (GitHub, Google, Microsoft,
   Amazon, Python, Jupyter, Figma, R, Wikipedia) override that with a
   colored brand badge instead, via a per-resource `icon:` field. Not
   attempted for all 163 — most resources don't have a distinct, widely
   recognized mark, and forcing one would be noise, not signal.

**Search + jump-to-category toolbar is the one place this project uses
JavaScript** (`assets/js/resources.js`, vanilla, no dependencies). This was
a deliberate exception to the site's otherwise strict no-JS rule — live
text search has no non-JS equivalent on a static site with no backend.
If JS fails to load, both controls go inert (harmless) rather than
breaking anything; the full list stays visible. The dropdown's `<option>`
values are generated from the same `| slugify` as each category's `<h2>`
id, so they're guaranteed to stay in sync — don't hand-edit one without
the other.

Whenever this data file changes, double check `resource-item` count in the
built HTML still matches the YAML resource count, and that the dropdown
option count still matches the `<h2>` count — both have been the fast way
to catch a botched edit across this many entries.

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

- **Focus ring color deviates from a literal `#FFD700` gold.** `#FFD700`
  fails the 3:1 non-text-contrast minimum against this site's light
  background (~1.3:1). Using **`#B45309`** (a darker amber) instead for
  the main page; header/footer get their own override — see "Nav/hero/
  footer redesign" section for the full color/contrast picture, which
  supersedes any older color numbers you might find elsewhere in this
  file's history (the original blue/green palette was fully replaced by
  the current 5-color brand palette).
- **Nav/header/footer are NOT pure CSS anymore in one place: the Resources
  page.** Everywhere else is still plain HTML/CSS, no JS, nav is a native
  `<a>` list with no toggle/hamburger pattern. But `assets/js/resources.js`
  exists now, scoped only to that one page, for search + jump-to-category
  — see "Resources page" section for why that was a justified exception.
  Don't add JS elsewhere without a similarly clear reason.
- **`main` has `tabindex="-1"` and `outline: none` on its own
  `:focus-visible`.** Intentional — `main` is only a *programmatic* focus
  target for the skip link, never part of tab order. Standard skip-link
  pattern, not a stray accessibility violation.
- **Mentor grid caps at 2 columns**, not 3 — with ~100–130 word bios per
  card, a third column made the text uncomfortably narrow. Breakpoint is
  `48em`, wider than the rest of the site's `40em`, on purpose.

## Verification status

**A real `jekyll build` succeeds** (Jekyll 4.4.1, Homebrew Ruby 4.0.6) for
all four pages. Output in `_site/`: `index.html`, `mentors/index.html`,
`organizers/index.html`, `resources/index.html`, `assets/css/style.css`,
`assets/js/resources.js`, `sitemap.xml`, `robots.txt`, and every image
(mentor photos, organizer avatars, sponsor/grant logos, 4 branding logos)
under `assets/images/` — no stray files. `baseurl` applies correctly
everywhere, including inside every inline `style="--*-logo: url(...)"`
custom property.

**`jekyll serve` verified working** via `curl` smoke tests early on
(HTTP 200 on homepage, mentors page, CSS asset). Organizers and Resources
were verified via build-output inspection instead of re-curling, but
Organizers uses the identical `person-card.html` partial already proven
to work, and Resources' toolbar was checked structurally (dropdown/heading
sync, resource count, no leaked contact data) rather than by an actual
browser interaction test.

Static analysis has been run after essentially every change in this
project: `_config.yml`/`_data/*.yml` parse as valid YAML; rendered HTML
has balanced/correctly-nested tags (Python's `html.parser`, void elements
including SVG `rect`/`path`/`text`/`circle` accounted for); heading
hierarchy has no skips on any page; no duplicate `id`s anywhere; no
unguarded `outline: none` outside the intentional `main` case. Color
changes were additionally verified with a small Python script computing
actual WCAG contrast ratios for every new pairing, not eyeballed — see
"Nav/hero/footer redesign" for the numbers.

**Still not done:** no page has ever been opened in an actual browser
window, across this entire project. Mobile-first reflow, 400% zoom
behavior, real screen-reader output, and — especially relevant now given
how much logo/color iteration happened by verbal description only — actual
visual correctness of the header/hero/footer/Overview redesign are
completely unverified by eye. This is the single biggest gap before
calling this done.

## To continue in a new session

1. **Open all four pages in a real browser** (`bundle exec jekyll serve
   --livereload`) — this hasn't happened even once yet, and matters more
   than usual right now:
   - The header/hero/footer/Overview logo and color redesign was all done
     from written descriptions of the source files, never seen rendered.
     Confirm it actually looks right before assuming it does.
   - Mobile-first layout at narrow widths, then the `40em`/`48em`
     breakpoints
   - 400% browser zoom — no horizontal scroll, content reflows
   - Keyboard-only pass: skip link, nav tabs (including `aria-current`
     styling), the Resources search box + jump dropdown, all card links
     on every directory page, focus ring visibility throughout (note the
     header/footer use a different-colored ring than the rest of the page
     — confirm both are actually visible, not just mathematically ≥3:1)
   - A contrast-checker browser extension against live rendered colors
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
7. **Get the missing Northwestern State University and NCAR Explorer
   Series URLs** if they're findable, or confirm they should stay
   unlinked — see "Resources page" section.
8. Not yet built: any pages beyond Home/Mentors/Organizers/Resources, a
   real favicon (currently `<link rel="icon" href="data:,">`, i.e.
   deliberately blank).

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
│   ├── resources.yml
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
│       ├── twitter.svg
│       ├── google.svg
│       ├── microsoft.svg
│       ├── amazon.svg
│       ├── python.svg
│       ├── jupyter.svg
│       ├── figma.svg
│       ├── r-project.svg
│       ├── wikipedia.svg
│       └── category-{gateway,server,code,palette,chart,sparkle,
│               people,briefcase,graduation-cap,calendar,flag}.svg
├── _layouts/
│   └── default.html
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── resources.js
│   └── images/
│       ├── branding/
│       │   ├── FacultyHack26_logo.svg        (icon only)
│       │   ├── FacultyHack26_logo_w_text.svg (icon + wordmark, hero <img>)
│       │   ├── FacultyhHack26_text.svg       (wordmark only, header nav)
│       │   └── FacultyHack26_logo_w_text.jpg (unused)
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
├── organizers.html
└── resources.html
```
