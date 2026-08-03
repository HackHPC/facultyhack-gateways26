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
targeting WCAG 2.2 AA. Seven pages exist: the homepage (`index.html`), a
Schedule page (`schedule.html`, driven by `_data/schedule.yml`), a
Deliverables page (`deliverables.html`, static content, no data file), a
Mentors directory (`mentors.html`, driven by `_data/mentors.yml`), a Teams
page (`teams.html`, driven by `_data/teams.yml`, cross-referencing
`_data/mentors.yml`), an Organizers page (`organizers.html`, driven by
`_data/organizers.yml`), and a Resources page (`resources.html`, driven
by `_data/resources.yml`). Mentors and Organizers share one card partial,
`_includes/person-card.html`.

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
  resources.yml), `_includes/` (`person-card.html`, `site-logo.html` —
  the old `icons/` SVG directory is gone, see "Icon system" below),
  `assets/images/` (`mentors/`, `organizers/`, `sponsors/`, `branding/` —
  5 files including `dandelion.png`), `assets/fontawesome/`
  (self-hosted Font Awesome Free), `assets/js/resources.js`,
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
| `index.html` | Homepage content: Hero (with upfront logo `<img>` + h1 + tagline + dates), Overview (with a background-watermark logo behind the text), **Why the Dandelion?** (three paragraphs of user-authored copy on the dandelion symbolism, followed by `assets/images/branding/dandelion.png`, `alt=""` since the adjacent text already fully conveys the meaning — capped at `40rem` wide via `.dandelion__image`), Challenges & Honorarium. No more Apply section or Apply buttons — removed by request. |
| `schedule.html` | Schedule page — see "Schedule page" section below. Three data-driven `<table>`s (virtual sessions, in-person conference, daily-flow breakdown), the first real tables in the project. |
| `deliverables.html` | Deliverables page — see "Deliverables page" section below. Static content, no backing `_data/*.yml` file. Includes the README-template `<dialog>` card. |
| `assets/templates/facultyhack-readme-template.md` | The README template, raw markdown, no front matter (deliberately — see "Deliverables page"). Downloadable/shareable at its own URL, and its content is also embedded (via `include_relative`) into the dialog card on `deliverables.html`. |
| `assets/templates/facultyhack-deliverables.md` | Portable copy of the Deliverables page's own content (not the README template above), hand-transcribed with absolute URLs. Source of truth for the generated PDF below. See "Downloadable PDF/Markdown export" in "Deliverables page". |
| `assets/templates/facultyhack-deliverables.pdf` | Generated from the `.md` file above via a one-time local `reportlab` script (not checked into the repo). Regenerate by hand if the deliverables content changes. |
| `mentors.html` | Mentors directory page. Loops `site.data.mentors`, rendering each via `_includes/person-card.html`. |
| `teams.html` | Teams page — see "Teams page" section below. Search box + jump-to-team `<select>` toolbar (same shape as the Resources page's), then `site.data.teams` rendered via `_includes/teams-card.html`, which cross-references `site.data.mentors` by name and auto-lists any files under that mentee's `assets/files/teams/<slug>/` directory. A shared `#share-menu` popup sits at the end of the page, driven by `assets/js/teams.js` + `assets/js/share-menu.js`. |
| `organizers.html` | Organizers page. Same pattern, loops `site.data.organizers` via the same `person-card.html` partial. |
| `resources.html` | Resources page — see "Resources page" section below. Search box + jump-to-category `<select>` toolbar, then 11 category sections of resource cards, each with a share button. A shared `#share-menu` popup (X, Facebook, LinkedIn, Email, Copy Link) sits at the end of the page, driven by `assets/js/resources.js`. |
| `_includes/person-card.html` | Shared card partial — takes a `person` param, used by both Mentors and Organizers. Renders: photo, name (now with `id="{{ name | slugify }}"` on the card `<li>` for deep-linking — see "Teams page"), linked affiliation, `specialty` tag pills, `bio`, sorted `history` ("Experience") list, and labeled/iconed `links`. Every field is individually optional (`{% if %}`-guarded), so Organizers (no `history`/`specialty` data) renders cleanly without those sections. |
| `_includes/teams-card.html` | Team-pairing card partial — takes a `pairing` param, looks up `pairing.mentor_name` against `site.data.mentors` to reuse that mentor's existing profile data rather than duplicating it. Also scans `site.static_files` for that mentee's `assets/files/teams/<slug>/` directory and auto-renders a "Files" list. See "Teams page" section below. |
| `_data/teams.yml` | 11 mentee/mentor pairings, sorted by mentee first name (briefly 10 — see "Vivek Shandilya removed, then re-added" in "Teams page") — see "Teams page" section below for provenance and the privacy rules applied. |
| `assets/files/teams/<mentee-slug>/` | One directory per mentee, drop a file in and rebuild — no YAML editing needed. Each holds only a `.gitkeep` until a real file is added. See `assets/files/teams/README.md` and "Teams page" below. |
| `assets/files/schedule/<session-slug>/` | Same pattern, one directory per virtual session (slug = session date, slugified). See `assets/files/schedule/README.md` and "Auto-linked per-session files" in "Schedule page" below. |
| `assets/js/teams.js` | Vanilla JS, scoped to the Teams page only — live search filter + jump-to-team smooth scroll, same pattern as `resources.js`. See "Teams page" section. |
| `_data/schedule.yml` | Schedule data — `virtual_sessions`, `conference`, `daily_flow` lists. See "Schedule page" section below. |
| `_data/mentors.yml` | Mentor records — see "Mentors page" section below for the schema and how the content was sourced. |
| `_data/organizers.yml` | Organizer records, carried over from last year's site — see "Organizers page" section below. |
| `_data/sponsors.yml` | Sponsor records (name/url/logo, one with a nested NSF grant block) — see "Sponsors" section below. |
| `_data/resources.yml` | 163 resource records across 11 categories — see "Resources page" section below for provenance, dedup decisions, and the icon system. |
| `assets/fontawesome/` | Self-hosted Font Awesome Free 7.3.1 (`css/fontawesome.min.css` + `solid.min.css` + `brands.min.css`, `webfonts/fa-solid-900.woff2` + `fa-brands-400.woff2`, `LICENSE.txt`). See "Icon system" section below — this replaced the old `_includes/icons/*.svg` hand-drawn icons (all but one). |
| `_includes/icon.html` | Shared icon-render partial used by `person-card.html` and `resources.html` — takes an `icon` param (`"style:name"`), renders a Font Awesome `<i>` or, for `"custom:..."` values, an inline SVG include. See "Icon system" section below. |
| `_includes/titleize.html` | Shared partial, takes a `text` param — underscores → spaces, first letter of each word capitalized, rest of each word untouched (deliberately not Liquid's `capitalize` filter, which lowercases the remainder). Used for auto-linked file names on `teams-card.html`, `schedule.html`, and `resources.html`. See "Underscore-delimited filenames" in "Teams page". |
| `_includes/session-file-item.html` | Shared partial, takes a `file` param (a `site.static_files` entry) — extension-to-icon mapping + `.resource-item` markup for one auto-linked session file. Used by both `schedule.html`'s Files block and `resources.html`'s "Session Materials" cross-listing, so the icon-mapping logic lives in one place. See "Now cross-lists into Session Materials too" in "Schedule page". |
| `_includes/resource-item.html` | Shared resource-link partial (icon + name/link + share button + optional description) — takes `resource` and `default_icon` params. Used by `resources.html`'s main category loop, the Session Materials section, and each schedule card's Resources block. See "Per-session resources" in the "Schedule page" section below. |
| `_includes/icons/jupyter.svg` | The Jupiter "three moons" mark — Font Awesome Free and svgl.app both lack a Jupyter icon, sourced from Simple Icons instead. See "Icon system" section below. |
| `_includes/icons/favicons/*.svg` | 124 files — each domain's own real favicon, base64-embedded in a small SVG wrapper. 95 of these are for 117 of the 163 Resources entries (see "Resource icons sourced from real favicons" below); 8 more (`subr-edu`, `famu-edu`, `howard-edu`, `hamptonu-edu`, `bowiestate-edu`, `morainevalley-edu`, `voorhees-edu`, `cau-edu`) were added 2026-07-30 for mentee institution links on the Teams page, reusing `ornl-gov` for the Subil Abraham fallback rather than re-fetching it — see "Teams page" above. |
| `_includes/site-logo.html` | Inline `<img>` of the icon-only site logo, `alt="FacultyHack@Gateways 2026"`. Used on Mentors/Organizers hero areas (logo beside the title) — NOT used on the homepage or Resources page, which each handle their own logo placement differently. See "Nav/hero/footer redesign" section. |
| `assets/images/branding/*` | 5 files, all user-supplied: `FacultyHack26_logo.svg` (icon only, pure monochrome black), `FacultyHack26_logo_w_text.svg` (icon + wordmark, ~1.78:1, hero `<img>`), `FacultyhHack26_text.svg` (wordmark only, ~3.74:1, header nav bar), `FacultyHack26_logo_w_text.jpg` (1920×1080, SEO/OG share image + JSON-LD logo), `dandelion.png` (1536×1024, "Why the Dandelion?" section on the homepage). See "Nav/hero/footer redesign" section for which logo file is used where and why. |
| `assets/images/mentors/*` | Mentor headshots (10 of 11 mentors so far) + a `README.md` (excluded from the build via `_config.yml`) documenting the permission requirement and naming convention. See "Mentor photos" section below. |
| `assets/images/organizers/*` | 6 organizer avatars, reused from last year's site (org's own asset, same recurring purpose — see "Organizers page" section). |
| `assets/images/sponsors/*` | 6 sponsor/grant-agency logos, reused from last year's site. |
| `assets/js/resources.js` | Vanilla JS, scoped to the Resources page only — live search filter + jump-to-category smooth scroll. See "Resources page" section for why JS was justified here despite the site's otherwise no-JS rule. |
| `assets/js/share-menu.js` | Vanilla JS, shared by `resources.html`, `deliverables.html`, and `teams.html` — the share-menu popup logic (native Web Share API first, custom popup fallback), extracted from `resources.js` so more pages could use it. See "Share-menu refactor" in the "Deliverables page" section. |
| `assets/js/deliverables.js` | Vanilla JS, scoped to the Deliverables page only — opens/closes the README-template `<dialog>` and handles its Copy button. See "README template card" in the "Deliverables page" section. |
| `_includes/share-menu.html` | Shared share-menu popup markup, extracted from `resources.html`. Included on `resources.html`, `deliverables.html`, and `teams.html`. |
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

Current state: **10 of 11 mentors have a photo**, wired up via a `photo:`
field in `_data/mentors.yml` pointing at a file in
`assets/images/mentors/`. Missing: **Mohammed Elmellouki**. Both Subil
Abraham and Sajida Faiyaz got a photo the same day (2026-07-30) —
`subilA.jpg` and `sajida-faiyaz.jpg` — both supplied directly by the
user rather than fetched by Claude, same correct-path precedent as every
other mentor photo. Sajida's arrived as `SajidaF .jpg` (a stray space
before the extension, clearly an accidental typo rather than a naming
choice) — renamed to `sajida-faiyaz.jpg` to match the `<mentor-slug>.jpg`
convention documented in this directory's `README.md`, rather than kept
as-is the way Subil's filename was (that one wasn't a typo, just a
different but valid naming style). The `mentors.html` template and CSS
(`.mentor-card__header`, `.mentor-card__photo`) already handle mentors
with or without a photo
gracefully — no broken images, no empty placeholder circles for those
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

## Teams page

`teams.html` + `_data/teams.yml` (added 2026-07-30), from a pasted
mentee/mentor pairing spreadsheet — 11 pairings, each mentee bringing
HPC/AI into a specific course, paired with a mentor. Briefly 10 on
2026-07-31 (Vivek Shandilya removed, then restored the same day — see
"Vivek Shandilya removed, then re-added" below); also sorted
alphabetically by mentee first name that same day.

**Both mentee and mentor email columns were dropped entirely** (personal
gmail/hotmail addresses for mentees, institutional emails for mentors) —
same standing privacy rule as `_data/mentors.yml`, applied here without
being asked again since the rule doesn't need re-litigating per data set.
"N/A" / "n/a" / "I don't have one" placeholder values in the source were
treated as "no link" and not rendered literally. A few rows had the exact
same URL duplicated across the "social media" and "professional URL"
source columns — deduplicated to one link rather than showing it twice.

**All 11 mentors now have a full profile on the Mentors page** (matched by
exact name — one spelling correction: the pairing sheet had "Elijah
Maccarthy," corrected to the existing profile's "Elijah MacCarthy").
Rather than duplicate mentor bio/affiliation/link data into `teams.yml`,
`_includes/teams-card.html` looks up each pairing's `mentor_name` against
`site.data.mentors` at render time and reuses that mentor's real
affiliation, `affiliation_url`, `affiliation_icon`, and a link straight to
their card on the Mentors page. To make that deep link work,
**`_includes/person-card.html` now sets `id="{{ include.person.name |
slugify }}"` on every mentor/organizer `<li>`** — new, previously nothing
on either page was individually addressable. Verified no `id` collisions
resulted (mentors.html and organizers.html each still have fully unique
ids after the change).

**The 11th mentor, Subil Abraham (mentored Mary Beals), was initially not
in `_data/mentors.yml`** — wasn't part of the original mentor-roster
spreadsheet the Mentors page was built from, so `teams-card.html` fell
back to plain text (still there, `teams-card.html`'s `{% else %}` branch,
for any future pairing whose mentor isn't found). **Added 2026-07-30, by
request ("update the mentors page with missing mentors from the teams
page")**: a minimal entry in `_data/mentors.yml` — name + affiliation
("Oak Ridge National Laboratory", inferred from their `ornl.gov` email
domain the same way John Holmen's and Elijah MacCarthy's affiliations were
derived, not guessed) + `affiliation_url`/`affiliation_icon` (reusing the
`ornl-gov` favicon already fetched for those two). Initially added with no
bio/specialty/links, since none of that data existed anywhere for this
person and every field on `person-card.html` is independently optional.
**Bio added same day**, by request, sourced via `WebFetch` from Subil
Abraham's real ORNL staff profile
(`https://www.ornl.gov/staff-profile/subil-abraham`) — role (HPC Engineer,
Operations – User Assistance group, National Center for Computational
Sciences), M.S. in Computer Science from Virginia Tech with a thesis on
container performance on HPC workloads and filesystems, a prior
Technology Integration internship evaluating SymphonyFS, and research
interests, all written in the same third-person style as the other
mentors' bios. Got `specialty: ["Containers for HPC", "Parallel
Programming"]` and a "Staff Profile" link (`custom:favicons/ornl-gov`
icon, matching John Holmen's link pattern). **The email address the staff
profile page listed was not added**, per the file's standing privacy
rule. A photo (`subilA.jpg`) arrived separately the same day, supplied
directly by the user — see "Mentor photos" below. Inserted first in
the file (alphabetical by last name, "Abraham" sorts before "Al-Omari").
Once added, `teams.yml`'s
`mentor_affiliation_url`/`mentor_affiliation_icon` for the Mary Beals
pairing became redundant (the lookup now finds him) and were removed —
only the plain `mentor_affiliation` fallback mechanism remains in
`teams-card.html`, unused today but still there for a future gap.

Each card is a two-column split (`.teams-card`, stacks to one column below
the `40em` breakpoint): mentee info (name as a real `<h2>` — the mentee is
the primary subject of the Teams page — affiliation, target course, and
any public links) on one side, "Mentored by" info on the other. Reuses
`.mentor-card__affiliation` and `.mentor-card__links` directly rather than
inventing near-duplicate CSS classes for the same visual pattern.

**Mentee institution affiliations are now links with a real favicon icon
too** (added 2026-07-30, by request — "find the affiliate urls and add the
link also pull the favicon from the affiliate sites"), mirroring the
mentor-affiliation pattern already established in `_data/mentors.yml`.
Each mentee entry in `teams.yml` gained `affiliation_url` +
`affiliation_icon`, resolved to the institution's own real website (e.g.
"Southern University A&M College" → `https://www.subr.edu/`; "Southern
University A&M College" and "Southern University and A&M College" are the
same school spelled two ways across the source spreadsheet rows — both
point at the same URL/icon rather than "fixing" the mentee-facing text).
`_includes/teams-card.html` renders it exactly like the mentor side does:
icon + `<a>` when a URL exists, plain text otherwise. Subil Abraham's
ORNL fallback (the one mentor not in `mentors.yml`, see above) got the
same treatment — `mentor_affiliation_url`/`mentor_affiliation_icon` in
`teams.yml`, reusing the `ornl-gov` favicon already fetched for John
Holmen and Elijah MacCarthy rather than re-fetching it.

8 new favicons were fetched for this
(`_includes/icons/favicons/subr-edu.svg`, `famu-edu.svg`, `howard-edu.svg`,
`hamptonu-edu.svg`, `bowiestate-edu.svg`, `morainevalley-edu.svg`,
`voorhees-edu.svg`, `cau-edu.svg`), using the exact same one-time Python
pipeline documented in "Resource icons sourced from real favicons" below
(parse `<link rel="icon">`, prefer SVG then largest declared size, fall
back to `/favicon.ico`, re-wrap as a base64 data-URI `<svg>` — never
inline third-party markup directly). One snag: `bowiestate.edu` declares
an `apple-touch-icon.png` that genuinely 404s on their own site (confirmed
directly, not a fetch bug) — fell back to their `/favicon.ico` instead,
which is only 16×16 (their site simply doesn't serve a larger one). All 8
were spot-checked by decoding the embedded base64 back to an image (or,
for FAMU's real vector favicon, validating it as well-formed XML) to
confirm none of them silently captured an error page instead of an icon.

**Mentee personal/project links got the same treatment 2026-07-30, by
request** ("use the favicons from the mentee sites to make svg icons") —
the 4 that had been showing the generic `solid:link` icon:
`yohn-scholar-web-34116-lovable-app.svg` (Yohn Parra Bautista's personal
site), `corefutureslab-org.svg` (Agbeli Ameko's "Core Futures Lab"),
`sopss-org.svg` (Vivek Shandilya's "SOPSS" — genuinely a Google Sites page,
so its "real favicon" is Google's generic Sites icon, not a SOPSS-specific
one; that's what actually shows in a browser tab for that URL, so it was
kept rather than treated as a failure), and `caeepnc-org.svg` (Kristine
Christensen's "CAEEPNC"). **One didn't get one**: Cheryl Swanier's
"Personal Website" (`kewlgirlzkode.com`) still shows `solid:link` — its
`/favicon.ico` returns `200 image/vnd.microsoft.icon` but a genuinely
empty body (confirmed by downloading it directly), consistent with the
site's homepage also throwing a PHP 500 error; not a fetch bug, so nothing
was fabricated for it, same "don't guess" rule as every other dead-domain
case in this file. Mentee LinkedIn/Facebook/Instagram links were left
alone — those already use real Font Awesome brand icons, not favicons.

**Search + jump-to dropdown + per-team share links** (added 2026-07-30,
by request, in two passes — search followed the jump-to dropdown once it
already existed). All three reuse existing site patterns rather than
inventing new ones:

- **Search teams**: a `<input type="search" id="teams-search">` in the
  same `.resource-toolbar__field` toolbar as the jump-to select, plus a
  `<p id="teams-count" class="resource-toolbar__status" aria-live="polite">`
  status line — same markup shape as the Resources page's search box.
  Filters on each `.teams-card`'s full `textContent` (mentee name,
  affiliation, course, mentor name — everything in the card, not just the
  name), toggling the native `hidden` attribute per card and updating the
  live-region count, mirroring `resources.js`'s `filterResources()`
  logic but simplified: Teams has no category sections to hide, just a
  flat list of cards, so there's no `categories.forEach` step to port.
- **Jump to team**: a `<select id="teams-jump">` in the same toolbar,
  listing all 11 mentees by name. Each `<option value>` is `{{
  pairing.mentee.name | slugify }}`, matching a new `id` added to the
  `<li class="teams-card">` itself (previously the card had no id at
  all). Handles the `change` event — scroll into view, `tabindex="-1"` +
  focus, reset the select back to the placeholder — copied from the
  identical jump-to-category logic already in `resources.js`.
- Both live in `assets/js/teams.js`, a new small page-specific script,
  kept as its own file rather than generalizing a shared helper with
  `resources.js`, consistent with this project's one-file-per-concern
  rule for JS (see "Resources page" below). **Deliberately not one hard
  early-return guarding both features**, unlike `resources.js`'s original
  combined `if (!searchInput || !items.length) return` (a page missing
  one element would silently kill the other): the search block and the
  jump block in `teams.js` each check their own elements independently.
- **Share links**: every team card gets a share button
  (`.resource-share`, the same class/markup/icon as the Resources page's
  per-resource share button), added inside a new `.teams-card__mentee-header`
  flex row alongside the mentee `<h2>`. `data-share-url` uses Jekyll's
  `| absolute_url` filter to build a real deep link
  (`https://hackhpc.github.io/facultyhack-gateways26/teams/#<mentee-slug>`),
  same pattern already used for the Deliverables page's README-template
  share button — a relative URL would break the X/Facebook/LinkedIn share
  intents, which need a fully-qualified URL. `data-share-name` is
  "`<Mentee> & <Mentor> — FacultyHack@Gateways 2026 Team`". No new share
  UI was built: `_includes/share-menu.html` + `assets/js/share-menu.js`
  are already page-agnostic (target `[data-share-url]`, not a
  page-specific class), so `teams.html` just added the same two includes/
  scripts Resources and Deliverables already use.
- **Verified**: all 11 mentee-name slugs are unique (no id collisions),
  jump-select option values match card ids 1:1, share-menu markup and
  both scripts render once each, and the full cross-page structural check
  (tag balance, duplicate ids, heading order) still passes.

**Auto-linked per-mentee files** (added 2026-07-30, by request — "Create
directories for each mentee that when files are added they automatically
create links to them in their team section with matching icons for PDF,
image, or pptx"). No YAML editing required to add a file — this is the
one part of the Teams page that reads from the filesystem instead of
`_data/teams.yml`.

- **Directories**: `assets/files/teams/<mentee-slug>/`, one per mentee,
  slug matching the same `| slugify` used for each card's `id` (e.g.
  `assets/files/teams/antigone-anthony/`). Each starts empty except a
  `.gitkeep` placeholder — Jekyll ignores dotfiles by default, so these
  never appear in the built site, but they keep the empty directories
  tracked in git. A single `assets/files/teams/README.md` documents the
  convention (naming, supported extensions, icon mapping) and is excluded
  from the build via `_config.yml`, same precedent as
  `assets/images/mentors/README.md`.
- **Detection logic**: `_includes/teams-card.html` loops
  `site.static_files` (Jekyll's built-in list of every static file that
  will be copied into `_site`) and keeps any whose `path` contains
  `/assets/files/teams/<mentee-slug>/` — an exact directory-path segment
  check (leading and trailing slashes), not a loose substring match, so
  it can't false-positive across mentees even though none of the current
  11 slugs happen to be substrings of each other. Matches are sorted by
  filename (`| sort: "name"`) for a deterministic order. A "Files"
  section (reusing the `.mentor-card__links` list styling, same as the
  mentee's personal links right above it) only renders when at least one
  file is found — same "don't show an empty section" rule already used
  for session resources on `schedule.html`.
- **Icon mapping** (`{% case file.extname %}`): `.pdf` →
  `solid:file-pdf`, `.jpg`/`.jpeg`/`.png`/`.gif`/`.webp`/`.svg` →
  `solid:file-image`, `.ppt`/`.pptx` → `solid:file-powerpoint`, anything
  else → `solid:file-lines` (generic file, same fallback icon used for
  the Deliverables README-template link). **All four icons were verified
  at the font level, not just the CSS level** — earlier icon checks in
  this file relied on grepping `fontawesome.min.css` for the class name
  existing, but that only proves a name-to-codepoint mapping exists, not
  that the glyph itself is present in the vendored `fa-solid-900.woff2`.
  For this feature, used `fontTools` (installed into the scratchpad venv
  for this one check, not added as a project dependency) to decode the
  actual webfont and confirm each codepoint (`file-pdf` U+f1c1,
  `file-powerpoint` U+f1c4, `file-image` U+f03e/f1c5, `file-lines`
  U+f15c) really has a glyph in the solid font — a stronger check than
  the ones used elsewhere in this project, worth reusing for any new
  solid/regular icon added in the future rather than falling back to the
  occurrence-count heuristic.
- **Link text** is `file.basename` (filename without extension) run
  through a new shared partial, `_includes/titleize.html` (see below) —
  originally just raw `file.basename`, changed 2026-07-31.
- **Tested end-to-end** by temporarily dropping one real file of each
  supported type (`.pdf`, `.jpg`, `.pptx`, and an unmapped `.docx` to
  confirm the generic fallback) into four different mentees' directories,
  rebuilding, confirming each rendered with the correct icon/label/href
  in the built HTML, then deleting the test files and rebuilding clean
  again — the feature was never left half-verified on "should work"
  reasoning alone.

### Underscore-delimited filenames → readable link text (2026-07-31)

By request — "files added to the schedule and teams will use
underscore-delimited filenames. Parse them as the name of the links."
New shared partial, **`_includes/titleize.html`**, takes an `text` param
and outputs it with underscores replaced by spaces and each word's first
letter capitalized — used by both `_includes/teams-card.html` and
`schedule.html` wherever `file.basename` used to be output raw.

- **Deliberately does NOT force-lowercase the rest of each word** the
  way Liquid's built-in `capitalize` filter does. First implementation
  used `capitalize` per word and broke on the very first real file the
  user dropped in — `FacultyHack_Gateways26_Poster_Template.pptx`
  (a real poster template added to `assets/files/schedule/mon-august-3/`
  while this feature was being built) rendered as "**Facultyhack**
  Gateways26 Poster Template," mangling the site's own brand name.
  Rewritten to only uppercase the first character of each word via
  `| slice: 0, 1 | upcase` appended to `| slice: 1, 999` (the untouched
  remainder) — preserves mixed-case words and acronyms exactly as typed:
  `FacultyHack_Gateways26_Poster_Template` → "FacultyHack Gateways26
  Poster Template", `NAIRR_account_setup` → "NAIRR Account Setup". Not
  guessed — caught by testing against a real filename already sitting in
  the repo, not just synthetic test cases.
- **A second, unrelated bug surfaced while building this**: Liquid in
  this environment silently strips whitespace-only content sitting
  directly between a block tag and its matching end tag —
  `{% unless x %} {% endunless %}` (a single literal space) renders as
  nothing at all, confirmed with an isolated throwaway test page
  (`{% unless false %} {% endunless %}` → empty string). The first
  `titleize.html` draft relied on exactly that pattern to inject spaces
  between words and silently produced "CourseSyllabus" with no space.
  Worth remembering for any future Liquid include: **build an array and
  join it with a filter argument (`| join: " "`) instead of trying to
  emit a literal space as raw template text between tags** — filter
  arguments aren't affected, raw inter-tag whitespace apparently is.
  Also used `{%- -%}` trim syntax throughout the final version to keep
  the include's own multi-line structure from leaking blank
  lines/indentation into its single-line output.
- **Verified in isolation before touching the real pages both times** —
  a throwaway `titleize-test.html` page with `permalink:` front matter,
  built, checked the raw output, deleted — for both the whitespace bug
  and the capitalize-mangling bug. Only after isolated output looked
  correct was the real `teams-card.html`/`schedule.html` rebuild
  attempted, confirmed correct, then confirmed against the actual
  `FacultyHack_Gateways26_Poster_Template.pptx` file already sitting in
  the repo.
- Both `assets/files/teams/README.md` and `assets/files/schedule/
  README.md` updated to document the underscore convention and the
  case-preservation behavior for anyone adding files later.

### Vivek Shandilya removed, then re-added (2026-07-31)

Removed by request ("remove Vivek Shandilya from the teams"), then
restored later the same day by request ("add vivek's information back
to the teams page"). Net effect: no change from where things started,
but worth recording both steps since real work happened in between.

**Removal**: deleted his entire pairing entry (mentee info, target
course, LinkedIn/SOPSS links) from `_data/teams.yml`, along with his
`assets/files/teams/vivek-shandilya/` directory (held nothing but a
`.gitkeep`, safe to delete outright). His mentor, Sajida Faiyaz, was left
untouched in `_data/mentors.yml` — she's an independent mentor profile,
not derived from `teams.yml`; removing a pairing doesn't cascade to
removing the mentor, she just had no pairing on the Teams page for a
while. The two favicons fetched specifically for his entry
(`_includes/icons/favicons/sopss-org.svg`,
`_includes/icons/favicons/bowiestate-edu.svg`) were deliberately **not**
deleted even though briefly orphaned — this turned out to be the right
call, since they were needed again minutes later.

**Restoration**: re-added his pairing entry from the exact data recorded
earlier in this same conversation (not re-derived or re-guessed), and
recreated the empty `assets/files/teams/vivek-shandilya/` directory with
a fresh `.gitkeep`. Inserted in the correct alphabetical position per
the "sort by mentee first name" convention below (**"Vivek" sorts
between "Tanganiika" and "Yohn"**) rather than appended at the end,
since the sort convention was already in place by the time this
happened. Both previously-orphaned favicons were already present on
disk, so no re-fetch was needed — reused as-is.

- **Verified**: 11 `.teams-card` elements render again (was 10), Vivek's
  card shows the correct affiliation (Bowie State University), both
  personal links (Facebook, SOPSS) with working icons, and the correct
  mentor (Sajida Faiyaz); full name list confirmed in alphabetical order
  with Vivek in the right slot; structural check clean across all pages.

### Sorted by mentee first name (2026-07-31)

By request — "sort the teams by the mentee's first name." Reordered the
pairing entries in `_data/teams.yml` itself (source order = render
order, no Liquid `sort` filter added to `teams.html`) — same convention
already used for `_data/mentors.yml`, which is kept sorted by last name
in the file rather than sorted at render time. Alphabetical order (11
pairings, after Vivek's later restoration above): Agbeli Ameko, Antigone
Anthony, Cheryl Swanier, Joseph Aneke, Joshua Gbadebo, Kristine
Christensen, Mary Beals, Oyebade Oyerinde, Tanganiika Johnson, Vivek
Shandilya, Yohn Parra Bautista. Added a line to the file's header
comment documenting this convention, so a future entry gets inserted in
the right place instead of just appended.

- **Verified no data was lost or altered in the reorder**, not just that
  it looked right — parsed the rewritten YAML with `yaml.safe_load` and
  diffed mentee→mentor mappings against the pre-reorder list (same
  mentee/mentor pairs, nothing dropped or swapped), then confirmed the
  built page: both the `.teams-card` elements and the `#teams-jump`
  dropdown options render in the same alphabetical order (the dropdown
  is generated from the same `site.data.teams` loop, so reordering the
  source file was sufficient for both at once — no second place to
  update).

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

## Schedule page

`schedule.html` + `_data/schedule.yml` (added 2026-07-21, from a table the
user pasted directly — not scraped/researched, so no provenance caveats
like the Mentors/Resources data). Same three YAML lists driving three
different presentations:

- `virtual_sessions` (6 entries, Mon/Wed/Fri Aug 3–14): date,
  `announcements`, `training` — rendered as **timeline cards** (see below).
- `conference` (2 entries): the Sept 23–25 Gateways 2026 Conference
  itself, and the FacultyHack poster session/awards during the
  reception — also timeline cards.
- `daily_flow` (3 entries): the reusable breakdown of how a virtual
  session's 6–8 PM ET block splits into Announcements (6:00–6:30) /
  Mentor Time (6:30–7:00) / Training (7:00–8:00) — explains where each
  card's "Announcements & Mentor Time" content comes from. **Still a
  `<table>`**, unlike the other two — this is a legend/breakdown of a
  recurring structure, not a list of discrete dated events, so it didn't
  make sense to convert.

### Timeline-card redesign (2026-07-21)

Originally all three sections were plain `<table>`s. The user asked to
make the page "more like" `hackhpc.github.io/admi26/schedule.html` — that
page (a **post-event recap**, ADMI26 already happened) uses a vertical
timeline of `.schedule-block` cards: date/time header, a "Join Zoom"
button, an expand/collapse toggle, and a body with sub-events, award
badges, and narrative "Session Summary" recaps. Confirmed by fetching
their actual HTML (not just a WebFetch summary) before touching anything.

FacultyHack26 hasn't happened yet, so summaries/awards/slide-decks don't
apply — only the **visual timeline-card pattern** was adapted, not
ADMI26's post-event content types. Asked the user to confirm scope
first (full collapsible cards vs. always-expanded vs. just restyling the
tables); they picked full collapsible cards.

**Implementation, deliberately zero JS**: each card is a native
`<details class="schedule-block">` / `<summary class="schedule-block__summary">`
— not a custom JS toggle like ADMI26's (their `.session-toggle-btn` is
actually `style="display:none"` in their static HTML, so it's unclear
their JS toggle is even active by default; native `<details>` gets
full keyboard/screen-reader support for free with zero JS, fitting this
project's established "no JS unless there's truly no non-JS equivalent"
rule — same reasoning that scoped `assets/js/resources.js` to only the
one page that actually needs it).

- The "Join Zoom" button (`.button .button--primary .button--small` — new
  small-size modifier added to the previously-unused `.button--primary`
  from the old Apply-button era) sits **inside** `<summary>`, alongside
  the date/time, so it's always visible even when the card is collapsed
  — matching ADMI26, where Join Zoom is outside the collapsible body too.
  It's the same Zoom link repeated on all 6 cards (matches ADMI26's own
  pattern — they repeat their Zoom link across session blocks too, not
  a mistake), not just stated once, unlike the earlier one-link-in-the-
  intro version of this page. A link nested inside `<summary>` is valid
  per the HTML spec (`<summary>` accepts phrasing content); clicking it
  navigates normally, and if it also happens to toggle the details open
  as a side effect in some browsers, that's harmless since the user is
  navigating away to Zoom anyway — not worth JS `stopPropagation()` to
  prevent.
- The expand/collapse chevron (`fa-solid fa-chevron-down`) rotates via
  `.schedule-block[open] .schedule-block__chevron { transform:
  rotate(180deg); }` — pure CSS, no JS, driven by the native `[open]`
  attribute `<details>` already manages.
- **All 6 virtual-session cards default `open`** (not just the first) —
  originally only the first card did, matching a typical "expand the next
  one" pattern, but the user said that made the two-week schedule hard to
  view (having to click through 6 cards one at a time to see the actual
  content defeats the point of a schedule page). Asked which fix they
  wanted (expand-all vs. week-grouping headers vs. reverting to a compact
  table); they picked expand-all. Still fully collapsible per-card for
  anyone who wants to tuck one away. The **Conference section's 2 cards
  still only default-open the first one** — with just 2 items there's no
  equivalent scanning problem, so that wasn't touched.
- **`summary` was missing from the global focus-ring selector list**
  (`a:focus-visible, button:focus-visible, ...`) — caught and fixed while
  building this, since `<details>`/`<summary>` hadn't been used anywhere
  before. Without it, keyboard users toggling a card would've gotten the
  browser's inconsistent default outline instead of this site's amber
  focus ring.
- Each event inside a card body gets an `<h3>` (e.g. "Announcements &
  Mentor Time", "Training Focus") — verified this doesn't skip levels
  (h2 section heading → h3 event names → next h2), checked
  programmatically same as every other heading-hierarchy check in this
  project.
- **Card background/hover** (`.schedule-block`): white (`--color-bg-alt`)
  by request, with the border highlighting to `--color-accent` on both
  `:hover` and `:focus-within` (same pattern as `.resource-item`'s hover
  from the accessibility audit — keyboard users get the same visual cue
  mouse users do). Ran into a real bug getting here: the first attempt
  set the card to white *while the `.schedule` section itself was also
  white* (`--color-bg-alt`), so the "white card" had nothing to contrast
  against and just blended flat into the page — reported back as "the
  background color of the cards is not white" even though the color
  value itself was correct. Root cause was inverted from the site's
  established convention: `.mentor-card`/`.resource-item` are the *ivory*
  tone (`--color-bg`) sitting on a *white* (`--color-bg-alt`) section —
  here it was backwards. Fixed by flipping `.schedule`'s own section
  background to ivory (`--color-bg`) so the white cards actually read as
  white against it, mirroring that same established pattern (just with
  the two tones swapped, since the ask was specifically a white card).
  The resulting card/section contrast is still only ~1.05:1 — that's
  inherent to how close `--color-bg`/`--color-bg-alt` are, and it's the
  same subtlety `.mentor-card` has always had; the 1px `--color-border`
  border is what actually defines the card shape, same as everywhere
  else on the site, not the background tint.
- Removed a now-redundant `.schedule-block__summary:hover { background-
  color: var(--color-bg-alt) }` rule from an earlier pass — once the
  whole card became `--color-bg-alt`, that hover rule was white-on-white
  (a no-op).

**Zoom + calendar links**, in the Virtual Training Sessions intro
paragraph (not per-card, since it's identical across all 6): the Zoom
join link (`https://us06web.zoom.us/launch/jc/...`) also appears inside
every card's "Join Zoom" button — deliberately repeated, matching
ADMI26's own pattern of repeating their Zoom link per card rather than
stating it once. The ICS "add to calendar" link
(`https://us06web.zoom.us/meeting/.../ics?icsToken=...&meetingMasterEventId=...`)
is stated once only, in the intro text. Both links contain Zoom-generated
tokens in the URL (not secrets — this is Zoom's own "share this so people
can join/add to calendar" link format, the same kind of link that goes
out in a normal meeting invite) — added directly from what the user
pasted, not fetched/verified independently.

Nav link added as the *first* item (before Mentors), on the reasoning
that schedule/logistics is core, frequently-needed information for an
active participant — same instinct as the original (now-removed)
"Overview" link being first.

### Per-session resources (2026-07-21)

Each entry in `_data/schedule.yml`'s `virtual_sessions` can now carry an
**optional** `resources:` list — slides, recordings, PDFs, linked
articles, whatever ends up getting shared for that specific session.
None have been added yet; this is infrastructure only, built ahead of
actual content per the user's request ("add this... that only displays
once resources are added").

- **Empty by default, on purpose.** No session currently has a
  `resources:` key. Nothing related to this feature renders anywhere —
  not the "Resources" block on a session's card, not the "Session
  Materials" section at the top of the Resources page, not the extra
  "Session Materials" option in the Resources page's jump-to-category
  dropdown — until at least one session actually has resources.
  Verified this by temporarily adding 3 test entries to one session,
  confirming everything rendered correctly (favicon icon, PDF icon, the
  default-icon fallback, the optional description, the share button, the
  jump-dropdown option, tag balance), then removing the test data and
  re-confirming the site is back to a clean empty state (171 resources,
  same as before this feature existed) — don't skip that same test/revert
  cycle if you extend this further.
- **Schema per resource** (documented in `_data/schedule.yml`'s header
  comment): `name` and `url` required; `icon` optional (defaults to
  `"solid:link"`) using the exact same `"style:name"` schema as
  `_data/resources.yml` — `"custom:favicons/<domain-slug>"` for a real
  fetched favicon (same fetch-and-vendor process as every other resource
  icon — see "Icon system"), `"solid:file-pdf"` for an uploaded PDF (no
  separate "type" field needed, the icon value itself carries that
  distinction), or any other Font Awesome icon; `description` optional,
  shown under the link only if present.
- **New shared partial, `_includes/resource-item.html`**, extracted from
  what used to be inline markup in `resources.html`'s main category loop
  (icon + name + optional link + share button + optional description).
  Takes `resource` and `default_icon` params. Now used in **three
  places**: the main Resources category loop (refactored, not just
  reused — behavior-preserving, since every existing resources.yml entry
  already has a description, so the newly-added `{% if
  resource.description %}` guard changes nothing there), the new Session
  Materials section, and each schedule card's Resources block. This also
  fixed a latent inconsistency: the pre-refactor inline markup rendered
  `<p class="resource-item__description">{{ resource.description }}</p>`
  unconditionally, which would've emitted an empty `<p></p>` for any
  resource without one — never actually triggered before since every
  `_data/resources.yml` entry has always had a description, but would
  have been a real bug for a description-less session resource.
- **"Session Materials" section on `resources.html`**, positioned first
  — before the toolbar's category loop, using the same
  `.resource-category`/`.resource-item` classes as every other category,
  so it's automatically picked up by the existing search/filter JS with
  zero JS changes needed. Grouped by session date (`<h3>` per date,
  matching the h2→h3 pattern used everywhere else). Computed via a
  Liquid `push`-based list build (`{% assign session_materials = "" |
  split: "" %}` then `push` each session that has `resources`) rather
  than a `where_exp` filter, to avoid depending on a plugin-provided
  filter for something a plain loop does just as well.
- **Per-card Resources block on `schedule.html`**, reusing the existing
  `.schedule-block__event`/`.schedule-block__event-name` (h3) structure
  as a third sibling alongside "Announcements & Mentor Time" and
  "Training Focus" — no new CSS needed, it inherits the same card
  spacing/typography automatically.

### Auto-linked per-session files (2026-07-30)

By request — "Create directories for each session that allow you to
drop in files and automatically create links on the session cards on
the schedule like on the teams page for the mentees." Same mechanism as
the Teams page's per-mentee files (see "Teams page" above), ported to
`schedule.html`'s six virtual sessions, and deliberately kept as a
**separate** mechanism from the hand-curated `resources:` YAML list
right above it, not merged into it.

- **Directories**: `assets/files/schedule/<session-slug>/`, one per
  virtual session, slug = `{{ session.date | slugify }}` (e.g. "Mon,
  August 3" → `mon-august-3`) — verified against Jekyll's actual
  `slugify` output via a throwaway test page rather than assumed, since
  getting this wrong would silently break every file's matching. Same
  `.gitkeep` + single excluded `README.md` pattern as
  `assets/files/teams/`.
- **Detection logic lives inline in `schedule.html`**, not a separate
  include — unlike Teams (which already had `_includes/teams-card.html`
  to put this in), the virtual-session card markup was never extracted
  into its own partial, so the `site.static_files` scan + `{% case %}`
  icon mapping was added directly inside the `virtual_sessions` loop,
  right before the `<details class="schedule-block">` it belongs to.
  Same exact icon mapping as the Teams version: `.pdf` → `file-pdf`,
  image extensions → `file-image`, `.ppt`/`.pptx` → `file-powerpoint`,
  else → `file-lines`.
- **Renders as a new "Files" block**, a third sibling alongside the
  existing conditional "Resources" block inside `.schedule-block__body`
  — a session can have neither, either, or both, independently. Reuses
  `.resource-list`/`.resource-item` markup (same classes the "Resources"
  block already uses) rather than Teams's `.mentor-card__links`, since
  visual consistency with the sibling block in the same card mattered
  more here than consistency with the Teams page.
- **Tested end-to-end** the same way as the Teams version: dropped one
  real file of each type (`.pdf`, `.png`, `.pptx`, and an unmapped
  `.docx`) into four different sessions' directories, rebuilt, confirmed
  each rendered with the correct icon/label/href and under a "Files"
  (not "Resources") heading, then deleted the test files and rebuilt
  clean, confirming zero "Files" blocks remained.

### Now cross-lists into "Session Materials" too (2026-07-31)

By request — "added files in the sessions should also be added to the
resources page for the sessions." Reverses the previous day's
deliberate decision not to do this (see the struck-through reasoning
above, which no longer applies).

- **New shared partial, `_includes/session-file-item.html`**: the
  extension-to-icon `{% case %}` + `.resource-item` markup that used to
  be inline inside `schedule.html`'s Files block, extracted so
  `resources.html` could render the exact same markup without
  duplicating the case statement a second time. `schedule.html` now just
  does `{% include session-file-item.html file=file %}` in its loop.
- **`resources.html`'s `session_materials` filter** changed from "has
  `session.resources`" to "has `session.resources` **or** has files in
  its `assets/files/schedule/<slug>/` directory" — a session now shows
  up in "Session Materials" if it has YAML resources, dropped files, or
  both, and the render loop was extended to run the same
  `site.static_files` scan used in `schedule.html`/`teams-card.html` and
  emit both the YAML resources and the files into one shared `<ul
  class="resource-list">` per session, in that order.
- **Verified all three states**: a session with both resources and files
  (Day 1, which already has real ones — SGCI/Deliverables/README
  Template plus the real `FacultyHack_Gateways26_Poster_Template.pptx`)
  renders both together under one `<h3>`; a session with files but zero
  YAML resources (temporarily tested on Day 3, "Fri, August 7," which
  has neither `resources:` nor `_data` metadata) now correctly appears
  in "Session Materials" for the first time, then correctly disappears
  again once the test file was removed and the site rebuilt — confirming
  the `has_session_files` check drives visibility correctly in both
  directions, not just when adding.
- `assets/files/schedule/README.md` updated to remove the now-false
  "files added here do not cross-list" claim.

### Content edits (2026-07-30)

Three small, unrelated data edits to `_data/schedule.yml`, done together
by request:

- **The "Science Gateways Resource Catalog" resource moved three times**
  in quick succession — Day 1 → Day 4 (first request), Day 4 → Day 1
  ("move ... to the first session"), then explicitly undone back to Day
  4 ("undo that"). **Final state: Day 4 (Mon, August 10)**, Day 1 back to
  just SGCI + Deliverables + README Template (its original three), Day 4
  with its one resource, everything else untouched. Verified after each
  move and again after the undo: renders only on the one session's card,
  and its cross-listing on the Resources page's "Session Materials"
  section (grouped under the `<h3>` matching whichever session owns it,
  automatically, since that grouping is driven by the same data) always
  matches wherever it currently lives.
- **"Dr. O" → "Dr. Oyebade Oyerinde"** in Day 2's `training` field —
  a literal name substitution, taken as given rather than second-guessed
  (this is presumably the mentor/session lead referred to informally
  elsewhere, not something to verify against another data source).
- **These two are unrelated to the Deliverables page's "six → seven"
  wording changes** above — different files, different reason, just
  requested in the same message.

**"Travel Support Application" resource added to Day 1 (2026-07-30, by
request)** — same Google Form link added to the Conference Registration
deliverable's second paragraph (above), now also on Day 1's schedule
card and its Session Materials cross-listing. Got a real fetched favicon,
`_includes/icons/favicons/docs-google-com.svg` (`docs.google.com`, the
domain of the `/forms/d/e/.../viewform` URL), same fetch pipeline as
every other resource icon — not the generic `solid:link` default.

**"Slide Deck" resource added to Day 1 (2026-07-31, by request)** — a
Google Slides link (`docs.google.com/presentation/d/...`), inserted
first in Day 1's `resources:` list (ahead of SGCI) since it's the
literal training material for that session, not a supporting link. Day 1
now has five resources, in render order: Slide Deck, SGCI, Travel
Support Application, Deliverables, README Template.

**Icon corrected the same day, by request ("The slide deck should have
a Google Presentations icon")**: initially reused
`custom:favicons/docs-google-com` (the favicon already fetched for the
Travel Support Application Google *Form* resource) on the assumption
that same domain = same icon. Wrong — Google's apps under
`docs.google.com` each declare their own `<link rel="shortcut icon">`
per app (Forms vs. Slides vs. Docs all differ), confirmed by actually
`curl`-ing the presentation URL's HTML rather than assuming: it declares
`https://ssl.gstatic.com/docs/presentations/images/favicon-2026-v2.ico`,
a distinct orange/yellow "presentation screen" icon, not the Forms one.
Fetched properly as `_includes/icons/favicons/docs-google-com-presentation.svg`
(same fetch pipeline, domain-slug naming extended with the app path
segment since the bare domain slug was already taken by the Forms
favicon) and **visually confirmed by decoding and viewing the actual
icon** before wiring it in, not just checking it decoded to *some* valid
image — worth remembering generally: two URLs sharing a domain does not
mean they share a favicon.

**"Course Goals Slide Deck" added to Day 2 (2026-07-31, by request)** —
a second Google Slides link
(`docs.google.com/presentation/d/1DMsv7JH1u9RGOlyo0nXebsESEMC6gXSJUrGXaL8UsSg/...`),
inserted first in Day 2's (`Wed, August 5`) `resources:` list, ahead of
the existing NAIRR Pilot Portal entry. Reused
`custom:favicons/docs-google-com-presentation` as-is this time — but
only after re-confirming via `curl` that *this specific* presentation
URL serves the same Slides favicon before assuming so, rather than
repeating the earlier same-domain assumption that turned out wrong for
Forms vs. Slides. **Placement note**: the user asked for this on "the
2nd session," which is Day 2 (NAIRR & AI Deconstruction Intro) — the
deck's own title, "Course Goals," textually matches Day 3's training
topic instead (`Fri, August 7`, "Course Goals & AI Deconstruction"), but
the explicit instruction was followed as given rather than "corrected"
to Day 3, since there was no way to confirm which one was actually
intended and the user may have a reason (e.g. previewing next week's
material early). The resource's `description` was deliberately written
generically ("Course goals slides for this session") rather than reusing
Day 3's training blurb text, since that blurb describes Day 3's content
and there's no confirmation this specific deck covers the same material.
If this placement turns out to be wrong, it's a one-line move to Day 3's
`resources:` list, same as the Science Gateways Resource Catalog moves
earlier in this file.

## Deliverables page

`deliverables.html` (added 2026-07-30, static content pasted directly by
the user — no `_data/*.yml` file, since it's a fixed list of items, not
something expected to grow/get re-sorted/get per-item icons the way
Resources or Schedule do — see the note below on why that assumption
already needed revisiting once). `<li class="deliverable">` cards in an
`<ol class="deliverable-list">`, each with a circular numbered badge
(`.deliverable__number`, `aria-hidden="true"` since the `<ol>` already
gives screen readers positional info — "1 of 7" etc. — from the list
semantics alone; the visible badge would otherwise double-announce the
number) and an `<h2>` title. Two cards (#3 Poster, #4 Blog Post) also get
a `.deliverable__meta` pill badge for a size constraint / due date,
reusing the same pill-badge visual language as
`.mentor-card__specialty`.

**#1 Conference Registration got a second paragraph (2026-07-30, by
request)**: a travel-support application link (a Google Form) plus an
instruction to indicate you're presenting a poster when applying. Just a
second `<p>` inside the same `<li>` — the existing `.deliverable p + p`
rule already adds spacing between consecutive paragraphs in a card, so
no new CSS was needed. Propagated to the downloadable `.md`/`.pdf`
exports too (see "Downloadable PDF/Markdown export" below) — the PDF was
regenerated and the new paragraph re-verified by reading it back, same
habit as every other edit to that file.

**#3 Poster and #6 GitHub Repo now link to the real poster template
(2026-07-31, by request)** —
`assets/files/schedule/mon-august-3/FacultyHack_Gateways26_Poster_Template.pptx`,
the same file the user dropped into the Day 1 session folder that
motivated the underscore-filename-parsing work above. Linked from two
spots: #3's "The Physical Poster" bullet ("Use the provided poster
template to get started") and #6's "Gateways Poster (PDF)" checklist
item ("from the provided poster template") — not just one, since the
user asked for both "where appropriate" and both genuinely are: #3 is
where you'd start the poster, #6 is where the finished PDF gets listed
alongside the template it came from, same pattern as #6's README.md line
already linking its own template. Both use `| relative_url` (an internal
site-hosted file, not an absolute URL like the NAIRR/travel-support
links above — those point off-site). Propagated to the downloadable
`.md`/`.pdf` exports too, PDF regenerated and re-verified by reading it
back.

**Grew from six to seven items (2026-07-30, by request — "Add a Create a
NAIRR education account to the deliverables")**: new #7, "NAIRR Education
Account," appended at the end rather than inserted earlier in the list —
deliberately, to avoid renumbering #1–6 and breaking the "deliverable
#6" cross-reference already written into this file's README-template
section. No `.deliverable__tag` ("Include in GitHub Repo") on it, same
as #1 Conference Registration — it's an account-setup action, not a
repo-includable file. Its content (create an account at
`nairrpilot.org`, review the Educational Resources opportunity at
`nairrpilot.org/opportunities/education-call` for classroom compute
access) was **not guessed** — the NAIRR Pilot site doesn't document a
distinct "education account" flow separate from its general account +
allocation-request system, so this was verified via `WebFetch` against
the live site (homepage, then the Educational Resources opportunity
page) before writing the deliverable text, rather than assumed from the
literal instruction wording alone. Every place that said "six
deliverables" got updated to "seven": this page's front-matter
`description`, the intro paragraph, all three `_data/schedule.yml`
resource entries whose `description` says "The ~~six~~ seven
deliverables for this program...", and both the downloadable `.md` and
regenerated `.pdf` exports (see below) — checked via grep across the
whole repo, not just the obvious spot, specifically because this kind of
count-in-prose detail is exactly the sort of thing that's easy to update
in one file and miss in three others.

### Downloadable PDF/Markdown export of the page (2026-07-30)

By request — "Add links to the top of the deliverables page to download
a PDF or Markdown of the deliverables." Two buttons
(`.deliverables-downloads`, right under the intro paragraph, before the
`<ol>`) link to `assets/templates/facultyhack-deliverables.md` and
`assets/templates/facultyhack-deliverables.pdf`. **Not the README
template** below — that's a document participants fill out for their own
repo; this is a portable copy of the deliverables list itself, for anyone
who wants it offline or printed.

- **The `.md` is the source of truth**, hand-transcribed from
  `deliverables.html`'s actual content (not regenerated from the HTML
  programmatically) so it reads naturally as its own document — same
  6 items, same tags/due-dates, but with absolute URLs
  (`https://hackhpc.github.io/facultyhack-gateways26/...`) since a
  downloaded file has no page context to resolve relative links against.
  No front matter, same reasoning as the README template: Jekyll copies
  it through as a static file untouched (verified with `diff` against
  the built copy — byte-for-byte identical).
- **The `.pdf` is generated from that `.md`**, not hand-built separately
  — a one-time Python script (`reportlab`, pip-installed into the
  scratchpad only, not a project dependency) with a small custom
  markdown-subset parser (headings, bold, italic, bullets, one level of
  paragraph continuation) that walks the same source file and lays it
  out with the site's brand colors (Olive Green headings, Root Brown
  body text). Not checked into the repo, same "one-time pipeline, not a
  build step" precedent as the favicon-fetching script under "Icon
  system" below — if the deliverables content ever changes, the `.md`
  needs a hand edit and the `.pdf` needs a manual regenerate, there's no
  live build-time link between them.
- **A real bug was caught and fixed before finalizing**: the first PDF
  draft split the intro paragraph in two, because the parser's
  paragraph-continuation check treated any line starting with `*`
  (including `**bold**`) as the start of a new italic block, not just a
  genuine standalone `*italic*` line. Fixed by requiring the line to
  both start AND end with a single `*` before treating it as a block
  boundary. Caught by actually reading the rendered PDF back (via the
  same `Read`-tool PDF rendering used to review any PDF in this
  workflow), not by inspecting the generation script alone — the first
  version "looked like it should work" and didn't.
- **Verified**: both files resolve to real, non-empty files in the built
  `_site/`, the `.md` is byte-identical to its source, the `.pdf` opens
  as a valid 2-page PDF with correct content, and the two Font Awesome
  icons used (`fa-file-pdf`, `fa-file-code`) were confirmed as real
  glyphs in the vendored solid webfont via the same `fontTools` check
  used for the Teams-page file icons (see "Teams page" above) — not just
  the weaker CSS-occurrence-count heuristic used earlier in this file.

**README template** (added same day): `assets/templates/facultyhack-
readme-template.md` — the exact markdown template the user pasted,
copied verbatim, no front matter on purpose so Jekyll treats it as a
static file and copies it through byte-for-byte rather than trying to
render it as a page (confirmed with a `diff` against the source after
build, and re-confirmed after the dialog card below was added — the
`{{ readme_template_content | strip | escape }}` round-trip through
`html.unescape()` was verified to reproduce the source file exactly,
byte for byte). Linked from deliverable #6's "README.md (filled out
using the provided template)" line. If this ever needs to become an
actual rendered page instead of a downloadable raw file, it would need
front matter added and probably a different file location — don't add
front matter to this file without also deciding to convert it into a
real page, since right now the whole point is that it's raw/unrendered.

### README template card (2026-07-30)

The user asked for the template to "appear as a card when clicked...
that allows users to share or copy the code" — turned the plain
download link into a **native `<dialog>` modal** showing the template
in a scrollable code block, with Copy / Share / Download actions.

- **"provided template" is now a `<button class="link-button">`**
  (styled to look like an inline text link, not a real navigation —
  `<button>` is the correct element here since it triggers an in-page
  action, not a page change), not an `<a>`. Clicking it calls
  `dialog.showModal()` via `assets/js/deliverables.js`.
- **Why native `<dialog>` instead of a hand-rolled modal**: focus
  trapping, Escape-to-close, and top-layer stacking all come free from
  the browser, so the JS needed is tiny (open, close-button click,
  backdrop-click-to-close, plus the copy handler) — consistent with this
  project's "as little JS as the interaction actually requires" pattern,
  same reasoning as choosing native `<details>` for the Schedule page's
  timeline cards over a custom toggle.
- **The template content is embedded via `{% include_relative
  assets/templates/facultyhack-readme-template.md %}`**, captured into a
  variable and piped through `| strip | escape`, rather than duplicating
  the template text a second time somewhere in the HTML. One source of
  truth: `assets/templates/facultyhack-readme-template.md` is still the
  file that gets downloaded/shared/statically served — the same file's
  *content* is also what appears in the dialog. `include_relative`
  (rather than a plain `{% include %}`, which is restricted to
  `_includes/`) works here because it resolves relative to the
  including page, and `deliverables.html` sits at the site root, same
  level as `assets/`.
- **Copy button**: reads `#readme-template-code`'s `.textContent` (the
  browser un-escapes HTML entities back to literal characters
  automatically) and writes it to the clipboard via
  `navigator.clipboard.writeText()` — this is what actually lets someone
  paste the *exact* template straight into their own repo's README.md.
- **Share button reuses the exact same share-menu component already
  built for the Resources page** (native Web Share API first, custom
  X/Facebook/LinkedIn/Email/Copy-Link popup fallback) — see "Share-menu
  refactor" below for how that got made reusable across pages. Shares an
  **absolute** URL (`| absolute_url`, not `| relative_url`) to the raw
  template file, since a shared link needs to work outside this site's
  own pages.
- **Download button**: a plain `<a href="..." download>` to the same raw
  file — the one action that doesn't need any JS at all.
- **`<noscript>` fallback** right after the "provided template" trigger
  button: a plain link straight to the raw template file. Converting
  that trigger from an `<a>` to a `<button>` (needed since it opens a
  dialog, not a navigation) meant the template stopped being reachable
  at all with JS disabled/failed — this restores it.
- **Real bug caught while building this**: initially gave the dialog's
  Share button `class="resource-share button button--small"`, reusing
  `.resource-share` (from `resource-item.html`) purely to get picked up
  by the share-menu JS's `.resource-share` selector. That selector was
  wrong to reuse here — `.resource-share`'s own CSS (transparent
  background, icon-only sizing) would have fought with `.button
  .button--small`'s visible-label button styling, since both target the
  same element with overlapping properties. Fixed at the root instead of
  patching around it: **`share-menu.js`'s selector changed from
  `.resource-share` to `[data-share-url]`**, decoupling "what triggers a
  share" (a data attribute, always present on any share trigger) from
  "how the trigger looks" (whatever class fits the context — the compact
  icon-only `.resource-share` treatment in resource lists, or a full
  `.button` in this dialog). `resource-item.html`'s existing share
  buttons already had `data-share-url` set, so they kept working
  unmodified.

### Share-menu refactor (2026-07-30)

Extracting the Copy/Share dialog for the README template meant a second
page now needed the share-menu popup, which used to be entirely inline
in `resources.html` + `assets/js/resources.js`. Split both:

- **`_includes/share-menu.html`** — the share-menu popup markup (X /
  Facebook / LinkedIn / Email / Copy Link), extracted verbatim from what
  used to be inline in `resources.html`. Now `{% include share-menu.html
  %}` on both `resources.html` and `deliverables.html`. `id="share-menu"`
  is fine to repeat across the two since IDs only need to be unique
  *within* a document, not site-wide — each page gets its own copy.
- **`assets/js/share-menu.js`** — the share-menu *logic*, extracted from
  `resources.js`. Had to actually split the file, not just also load
  `resources.js` on `deliverables.html`, because `resources.js` opens
  with `if (!searchInput || !items.length) { return; }` — a hard
  early-return that would have skipped the share-menu code entirely on
  any page without a `#resource-search` box (i.e., every page except
  Resources). Caught this before it became a "why doesn't Share work on
  the Deliverables page" bug rather than after.
- **`assets/js/resources.js`** now only contains the search-filter and
  jump-to-category logic — genuinely Resources-page-specific, unlike
  the share-menu which is now correctly shared.
- Both `resources.html` and `deliverables.html` load two `<script>` tags
  now: their own page-specific file, plus `share-menu.js`.

This is the fuller, detailed version of the homepage's existing
"Challenges & Honorarium" section (`index.html`, 4 bullet points, same
$500 honorarium) — **deliberately not merged or cross-linked** beyond the
Deliverables page pointing back to the Schedule page in its intro
paragraph. Left the homepage section as-is rather than replacing it with
a link to this page or vice versa, since that wasn't asked for and is a
content-strategy call, not an obvious correctness fix.

**Two personal emails are published on this page on purpose**:
`haydenl@mindspring.com` (Dr. Linda Hayden, for the SGX3 blog post
submission) and `jeaime@omnibond.com` (Je'aime Powell, for the final
GitHub repo submission). This is different from the strict "never
publish personal emails" rule that governs `_data/mentors.yml` — those
were scraped from a pasted spreadsheet the mentors didn't necessarily
intend for public posting. Here, the user (an organizer) is directly
authoring official submission instructions for a page whose entire
purpose is telling participants where to send things — publishing the
submission address is the explicit point, not a privacy leak. Don't
generalize this exception to other pages without the same reasoning
applying (a program organizer directly instructing that a specific
contact method be published as part of official task instructions).

Nav link added right after Schedule (before Mentors) — both are
"what do I need to know/do" logistics pages, grouped together at the
front of the nav ahead of the people/resources pages.

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
   Organizations & Communities. (Northwestern State University originally
   had no URL and was left unlinked rather than guessed — later removed
   entirely by request instead of ever getting one.)
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
   source CSV — left unlinked, same rule as #1, until the user supplied
   the real URL directly (`https://edec.ucar.edu/public/ncar-explorer-series`).
4. **Consolidated from 26 categories down to 11** by request — grouped by
   what a reader is trying to do (e.g. "Computing & Infrastructure" =
   old HPC + Cloud Computing + Cyberinfrastructure Resources + AI
   Infrastructure) rather than keeping the source files' original labels,
   several of which only ever had 1-2 entries. Verified zero resources
   lost in the regroup (163 before, 163 after) via a small Ruby script,
   not by hand.
5. **Icons**: each of the 11 categories has a default topic icon. 30
   specific resources across well-known, easily-recognized brands (GitHub,
   Google, Microsoft/AWS, Python, Figma, R, Wikipedia) override that with
   a brand icon instead, via a per-resource `icon:` field. Not attempted
   for all 163 — most resources don't have a distinct, widely recognized
   mark, and forcing one would be noise, not signal. See "Icon system"
   below for how these render now (Font Awesome, not hand-drawn SVG).
6. **Share button**: every resource with a URL has a share button next to
   it (`.resource-share`), opening the shared `#share-menu` popup at the
   bottom of the page (X, Facebook, LinkedIn, Email, Copy Link) — or the
   native OS share sheet on devices that support `navigator.share()`.

**Search, jump-to-category, and the share menu are the reason this
project uses JavaScript at all** (`assets/js/resources.js` +
`assets/js/share-menu.js`, vanilla, no dependencies, no build step).
This was a deliberate exception to the site's otherwise strict no-JS
rule — live text search and a "pick where to share" popup have no
non-JS equivalent on a static site with no backend. The share-menu piece
was later reused on `deliverables.html` too (see "Share-menu refactor"
in the "Deliverables page" section) and the README-template card there
added its own small `assets/js/deliverables.js` for the same kind of
reason (no non-JS way to do a copy-to-clipboard button or open a
`<dialog>`) — so this is no longer literally "the one place," but the
same bar still applies everywhere JS shows up in this project: only
where the interaction has no static-HTML/CSS equivalent, one file per
actual concern, and always failing gracefully. If JS fails to load, the
search/jump controls go inert (harmless, full list stays visible), share
buttons do nothing on click, and the README template's "provided
template" trigger — a `<button>`, not a link, since it opens a dialog
rather than navigating — would do nothing on click too. That last one
got a real `<noscript>` fallback (a plain link straight to
`assets/templates/facultyhack-readme-template.md`) rather than just
accepting the gap, since unlike the share buttons (a nice-to-have on top
of content that's already reachable another way), this was the *only*
way to reach the template before the dialog existed — removing it
without a fallback would've been a regression, not just a degraded
enhancement.
The dropdown's `<option>` values are generated from the same `|
slugify` as each category's `<h2>` id, so they're guaranteed to stay in
sync — don't hand-edit one without the other.

Whenever this data file changes, double check `resource-item` count in the
built HTML still matches the YAML resource count, and that the dropdown
option count still matches the `<h2>` count — both have been the fast way
to catch a botched edit across this many entries.

### Event Branding section (added 2026-07-30)

Added directly under "Session Materials," before the alphabetical resource
categories, by request — modeled on the "Event Branding" section of the
`HackHPC/admi26` Resources page
(`https://hackhpc.github.io/admi26/resources.html`), fetched and inspected
for its structure (a collapsible logo-asset grid + a brand-color swatch
grid) but rebuilt with this site's own real assets, own CSS variables, and
its own class names (`.branding-*`, hardcoded in `resources.html` — not a
`_data` file, since there's a small fixed set of assets, unlike the
per-resource-item pattern used everywhere else on this page).

- **Structure**: `<section class="resource-category branding-section">`
  (keeps it visually consistent with every other section on the page and
  gives it a `resources-event-branding` id for the "Jump to category"
  dropdown), containing a `<details class="branding-dropdown">` — the
  same zero-JS collapsible pattern used for the Schedule timeline cards
  and Judging-Criteria-style dropdowns elsewhere, collapsed by default
  since the logo grid isn't something most visitors need immediately.
- **Logo assets** (all real files already in `assets/images/branding/`,
  nothing newly generated): Logo Mark
  (`FacultyHack26_logo.png`/`.svg`, the dandelion mark), Wordmark
  (`FacultyhHack26_text.png`/`.svg` — note the existing double-h typo in
  the filename, left as-is rather than renamed, matching the file already
  referenced by `_layouts/default.html`'s header logo), Logo + Wordmark
  (`FacultyHack26_logo_w_text.jpg`/`.svg`), and Favicon
  (`favicon.png` + the site's real `favicon.ico` — **no SVG offered for
  the favicon**, since the only SVG that exists is the plain dandelion
  mark, not the circular favicon-specific composition, and claiming it as
  a "favicon SVG" would have been fabricating an asset that doesn't
  actually exist). Each card previews the image over a checkerboard
  background (visible for the two transparent PNGs, a no-op for the
  opaque white JPG) with PNG/SVG/JPG/ICO download buttons
  (`download` attribute, real Font Awesome icons — `fa-image` and
  `fa-file-code`, both verified present in the vendored
  `fontawesome.min.css` glyph map before use, same verification habit as
  everywhere else icons get added in this file).
- **Brand Colors**: the site's real 5-color palette, pulled straight from
  the named comment block at the top of `assets/css/style.css` (Soft
  Ivory, Root Brown, Forest Olive, Warm Brown/Gold, Olive Green) — not
  invented for this section, and not the same 10-swatch structural/UI
  palette ADMI26's page shows (that page documents its own separate
  design-system colors like "Alert Red" and "Page Background," which this
  site doesn't have equivalents for).
- **Search/filter interaction**: the section is a `.resource-category`
  but deliberately contains **zero** `.resource-item` elements, so
  `resources.js`'s existing filter logic (`hidden = query.length > 0 &&
  !hasVisibleItem`) hides it automatically the moment a search query is
  typed — same as any other category with no matches, no special-casing
  needed.
- **Verified**: all 12 asset URLs referenced in the section resolve to
  real files in the built `_site/`, checked file-by-file rather than
  assumed.

## Icon system

All site icons (mentor/organizer link icons, resource brand icons, resource
category icons, the resource share button, and the share-menu popup icons)
now render via **self-hosted Font Awesome Free 7.3.1**, replacing the
26 hand-drawn placeholder SVGs that used to live in `_includes/icons/`
(that directory is gone). By request, this was done as a self-hosted
webfont/CSS integration rather than a CDN `<link>` — the site otherwise has
zero external network dependencies, and a CDN would have been the first one.

- **Vendored files** (`assets/fontawesome/`): `css/fontawesome.min.css`
  (base + all glyph definitions), `css/solid.min.css`, `css/brands.min.css`
  (each with their own `@font-face`), `webfonts/fa-solid-900.woff2`,
  `webfonts/fa-brands-400.woff2`, and `LICENSE.txt`. Only the `solid` and
  `brands` styles are vendored — `regular`/`duotone`/`sharp`/`thin` and the
  JS-based kit were left out since nothing here uses them. Total footprint
  is ~340KB, cacheable, no JS. All three CSS files are linked in
  `_layouts/default.html`'s `<head>`, before `assets/css/style.css`.
  **Deliberately not** `assets/vendor/fontawesome/` — `.gitignore` has a
  bare `vendor/` rule (for Bundler's `vendor/bundle`), which matches a
  directory named `vendor` at *any* depth, so `assets/vendor/` would have
  been silently untracked and never pushed to GitHub Pages despite working
  fine in every local build. Caught by `git check-ignore -v` before
  committing — if you ever add another self-hosted library, check it
  isn't shadowed by that rule too.
- **Data schema**: every `icon:` field in `_data/mentors.yml`,
  `_data/organizers.yml`, and `_data/resources.yml` stores a
  `"style:name"` pair, e.g. `"brands:github"` or `"solid:server"` — not a
  bare name. `style` is normally `solid` or `brands`, but there's one
  reserved value, `custom` (see the Jupiter bullet below). Both
  `_includes/person-card.html` and `resources.html` render icons through a
  single shared partial, `_includes/icon.html`, rather than duplicating the
  branch logic — pass it the raw `"style:name"` string as `icon`:
  `{% include icon.html icon=link.icon %}`. Inside, it splits on `:` into
  `icon_style`/`icon_name` (as their own `{% assign %}`s, not inline
  `icon_parts[0]`/`[1]` — Jekyll's dynamic-`{% include %}` filename regex
  doesn't accept `[` `]` in a `{{ }}` reference, so bracket-indexed access
  only works for the *non-file-path* Font Awesome branch; the custom-SVG
  branch needs the plain variable or it throws `Invalid syntax for include
  tag`), then either includes `icons/{{ icon_name }}.svg` (if
  `icon_style == "custom"`) or emits
  `<i class="mentor-card__link-icon fa-{{ icon_style }} fa-{{ icon_name }}" aria-hidden="true"></i>`.
  If you add a new icon, follow that exact pattern — don't invent a bare
  icon name, it won't resolve to a real Font Awesome class.
- **The one custom icon — Jupyter**: Font Awesome Free has no Jupyter brand
  mark. Checked svgl.app (svgl.app/api/svgs is dead; pulled their source
  data file directly from `github.com/pheralb/svgl`, `src/data/svgs.ts`,
  5,133 lines/300+ logos) — no Jupyter entry there either. The real Jupiter
  "three moons" mark came from Simple Icons instead
  (`github.com/simple-icons/simple-icons`, `icons/jupyter.svg`, CC0 —
  no attribution required, though it's still Jupyter's trademark same as
  any other brand icon here), vendored as
  `_includes/icons/jupyter.svg` with
  `fill="currentColor"` added so it inherits color like every other icon.
  Its `icon:` value in `_data/resources.yml` is `"custom:jupyter"`. Sizing
  it required one extra CSS rule (`svg.mentor-card__link-icon { width: 1em;
  height: 1em; }` in `assets/css/style.css`) since `font-size` — which
  sizes the Font Awesome `<i>` glyphs — doesn't size a plain `<svg>`; `1em`
  on the SVG itself picks up whatever `font-size` each context already set
  on the shared `.mentor-card__link-icon` class, so it stays consistent
  without a second set of per-context size overrides.
- **Other mapping decisions worth knowing**: a few more old placeholder
  names don't have a direct Font Awesome Free equivalent, substituted with
  the closest available icon rather than left broken — `twitter` →
  `brands:x-twitter` (current brand identity, not the legacy bird),
  `wikipedia` → `brands:wikipedia-w` (bare `wikipedia` doesn't exist),
  `scholar` → `brands:google-scholar`, `amazon` (AWS-context resources
  specifically) → `brands:aws`, `category-gateway` (Science Gateways) →
  `solid:door-open`, `category-sparkle` (AI Tools & Resources) →
  `solid:wand-magic-sparkles`, `category-people` (Organizations &
  Communities) → `solid:people-group`.
- **All Font Awesome icons are monochrome** (`currentColor`, sized via
  `font-size` not `width`/`height` since they're font glyphs now, not
  SVGs) rather than colored per-brand. The old placeholder icons used
  colored badges (brand-colored square + white initials); real Font
  Awesome brand icons are just glyph outlines with no built-in color, and
  re-coloring each one per brand would mean re-verifying contrast against
  every surface they appear on (card background, resource list, header,
  footer, share-menu popup) — this site has already been through that
  exercise once for the 5-color brand palette and it wasn't a small
  effort. Monochrome `var(--color-link)` was already the established
  pattern for the old category icons, so this just extends it site-wide.
  **This does not apply to the real-favicon resource icons** — see below,
  those are deliberately full-color.
- **Attribution**: Font Awesome Free's icons are CC BY 4.0 and the fonts
  are SIL OFL — the vendored CSS files keep their original header comment
  (`Font Awesome Free 7.3.1 by @fontawesome...`) intact, which is what
  satisfies their license's attribution requirement. No visible on-page
  credit link was added; if that's ever wanted, it'd be a design choice,
  not a license requirement, given the comment is already preserved. See
  `assets/fontawesome/LICENSE.txt` for the full text.

### Resource icons sourced from real favicons

By request, 117 of the 163 Resources entries (everything that didn't
already have a Font Awesome/custom brand icon) now show that site's own
real favicon instead of the shared category icon. This is a different,
deliberately non-monochrome exception to everything above.

- **How it was built** (not repeatable via a Jekyll/Liquid command — this
  was a one-time Python pipeline run from the scratchpad, not checked into
  the repo): for each of the 132 resources missing an icon, resolved a
  domain slug from its URL and deduped to 110 unique domains (many
  resources share a domain, e.g. the several `perplexity.ai` /
  `github.com` entries). For each domain: fetched the page HTML with a
  browser-like User-Agent, parsed `<link rel="icon"...>` tags (preferring
  SVG, then largest declared `sizes`), falling back to `/favicon.ico` at
  the origin if no `<link>` was declared. Decoded the result with Pillow
  (selecting the largest embedded frame for multi-resolution `.ico`
  files), downscaled anything over 64px, and wrote each as a small
  self-contained SVG: `<svg class="mentor-card__link-icon" viewBox="0 0 W
  H" ...><image width="W" height="H" href="data:{mime};base64,..."/></svg>`
  — deliberately re-wrapping *every* source (even real vector SVG
  favicons) as a base64 data URI inside a controlled wrapper, rather than
  inlining third-party SVG markup directly into the page. 163 resources
  all render on one page at once, so raw third-party SVGs risk `id`
  collisions and stray embedded `<style>` rules bleeding across icons;
  the data-URI wrapper avoids that entirely at the cost of a slightly
  larger file (~372KB total across all 95 domain icons — only loaded on
  the Resources page, not site-wide).
- **Files**: `_includes/icons/favicons/<domain-slug>.svg` (95 files, e.g.
  `github-com.svg`, `nsf-gov.svg`). Referenced from `_data/resources.yml`
  as `icon: "custom:favicons/<domain-slug>"`, rendered through the same
  `_includes/icon.html` helper as everything else (the `custom:` branch
  was already there for Jupiter — this just gave it 95 more files to
  serve instead of 1).
- **95 of 110 unique domains succeeded; 15 didn't** — those resources
  (about 15 of the 163, spread across categories) simply kept their
  category's default icon, same "don't guess" rule used everywhere else
  in this file. Breakdown of the failures:
  - **7 domains didn't resolve at all** (dead/parked, not a fetch bug —
    confirmed with `dig`): `hpc-ed.org`, `sc.ed.gov`, `acmhpdc.org`,
    `hpccampus.com`, `pearc.utulsa.edu`, and (at the time) `projecteureka.org`
    and `blackinhpc.org` — three later resolved by the user, each
    differently: `projecteureka.org` turned out to be a stale URL for the
    same resource, corrected to `projecteureka.ai` (live), and
    projectEUREKA! ended up reusing the `hackhpc-org` icon by later
    request instead of its own fetched favicon (that file was deleted).
    `blackinhpc.org` turned out to be a dead org entirely — the
    "Black in/HPC" entry was replaced outright with a different,
    unrelated organization, "Black in AI"
    (`https://www.blackinai.org/`), with its own fetched favicon,
    `_includes/icons/favicons/blackinai-org.svg`. `hpccampus.com`'s
    "HPC Campus" entry was removed from `_data/resources.yml` outright.
    `hpc-ed.org`'s "HPC-ED" entry got a corrected URL too —
    `https://hpc-ed.github.io` — plus an updated description (confirmed
    via WebFetch: "CyberTraining" in its tagline refers to NSF's
    CyberTraining program, not literal cybersecurity — it's an HPC
    training-materials federated repository, same subject as before, just
    phrased more precisely) and its own fetched favicon,
    `_includes/icons/favicons/hpc-ed-github-io.svg`. All 7 of the
    originally-dead domains are now resolved: a later full link-check
    (below) plus user-supplied corrected URLs fixed the remaining 3 —
    `sc.ed.gov` → DOE CSGF now points to `https://www.krellinst.org/csgf/`,
    `acmhpdc.org` → HPDC now points to `https://hpdc.sci.utah.edu`, and
    `ippdps.org` (the typo) → IEEE IPDPS now points to the correct
    `https://www.ipdps.org`. All three got refreshed descriptions (sourced
    via WebFetch from the real sites) and their own favicons, except
    DOE CSGF and IPDPS which fetched cleanly — HPDC too. `pearc.utulsa.edu`
    → PEARC now points to `https://pearc.acm.org/`, but that subdomain is
    Cloudflare-blocked the same way `acm.org` is (confirmed via both curl
    and WebFetch), so its description was left as-is and it reuses the
    `custom:acm` icon rather than a fetched favicon, since it's genuinely
    hosted under ACM's domain.
  - **3 sites (`acm.org`, `siam.org` on the first pass, `perplexity.ai`
    on the first pass) returned HTTP 403** — bot-protected (Cloudflare);
    `siam.org` and `perplexity.ai` succeeded on a retry with a longer
    timeout. `acm.org` never did — confirmed it's a real Cloudflare
    challenge (even `/favicon.ico` 404s into the same block), not
    pursued further since evading bot detection wasn't attempted. Instead
    of a favicon, ACM's entry uses `_includes/icons/acm.svg` — the real
    ACM diamond logo from Simple Icons (CC0, same source/precedent as
    Jupyter's icon), referenced as `icon: "custom:acm"`. Worth remembering
    this pattern (a hand-vendored `_includes/icons/<name>.svg` plus
    `"custom:<name>"`, no `favicons/` subpath) for any other bot-blocked
    site where a real logo exists in a CC0/permissive icon library.
  - **A handful of live sites still failed** despite working fine when
    tested standalone with the exact same request (`networkx.org`,
    `swcarpentry.github.io`, `openscapes.github.io`, `ncar.ucar.edu`,
    `sc.supercomputing.org`) — looked like transient/CDN flakiness during
    the batch run (concurrent fetching, GitHub Pages edge caching) rather
    than a real problem with the fetch logic; a few had none of these
    issues on a manual re-check but weren't worth chasing further given
    diminishing returns. Worth another attempt if these particular icons
    matter enough to justify it.
  - `vita.had.co.nz` (a personal academic homepage, linked directly to a
    PDF) and `networkx.org` genuinely have **no favicon declared at all**
    — confirmed by hand, not just a fetch failure.

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

### First real-browser bug report, and a stylesheet caching fix (2026-07-30)

This was **the first time anything in this project was actually checked
in a real browser** — every prior verification this whole session was
structural/mathematical (see "Verification status" below), never
visual. The user ran the site (via the `jekyll serve --livereload`
instance above) in both Safari and Chrome and reported the Deliverables
page looking broken in Chrome only: duplicated numbers next to each
deliverable, and no card borders, while Safari showed the correct
circular numbered badge + bordered card.

**Diagnosed as a stale Chrome cache, not a real CSS bug**, before making
any change: audited `assets/css/style.css` directly — brace-balanced,
comment-balanced, exactly one `.deliverable-list` rule (`list-style:
none`, which is what suppresses the browser's native "1." marker so only
the custom `.deliverable__number` circular badge shows) and exactly one
`.deliverable` rule (`border: 1px solid var(--color-border)`), no
duplicate/conflicting rules anywhere else in the file. Both properties
are fully and identically supported in current Chrome and Safari, so a
genuine cross-browser incompatibility was unlikely. Given how many times
`style.css` was edited over the course of this session against a single
already-running `localhost:4000` dev server with no cache-busting on the
stylesheet `<link>`, a stale Chrome HTTP cache (more aggressive than
Safari's for repeated local requests) was the most likely explanation.
Asked the user to hard-refresh Chrome to confirm before changing
anything — **confirmed correct**, it was in fact a local cache issue.

**Fix applied anyway, to prevent recurrence**: `_layouts/default.html`'s
`style.css` `<link>` now has a cache-busting query string,
`?v={{ site.time | date: '%s' }}` — a Unix timestamp that changes on
every Jekyll build/serve regeneration, forcing browsers to fetch a fresh
copy instead of reusing a cached one keyed to the bare URL. Deliberately
**not** applied to the three Font Awesome stylesheet `<link>`s right
above it — those are vendored, never edited, and benefit from long-lived
caching once fetched once; busting them on every rebuild would be
counterproductive.

**Worth remembering for next time**: this session never had regular
browser QA built into its workflow, relying entirely on
`html.parser`-based structural checks and WCAG contrast math (still
valuable, still worth continuing) — but this bug report is proof that
class of check cannot catch everything, particularly caching/runtime
issues, browser-specific rendering quirks, or interaction/JS behavior
under real user input. Now that a local server is genuinely running and
being used for manual QA, that's the better opportunity to catch
anything else this project's checks have been structurally blind to
before going live.

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

## Follow-up audit (2026-07-21) — after the icon system, Resources JS, and sort/hover work

A lot changed since the first audit (self-hosted Font Awesome + 117
favicon-based resource icons, the Resources share-menu JS, resource
sorting, a new hover state), so this was a full re-pass, not just a diff.
Same methodology as before — no real browser, structural checks via
Python's `html.parser`, contrast via the WCAG relative-luminance formula
— across all 4 pages' built HTML.

**Passed clean**: tag balance, no duplicate `id`s, heading hierarchy (no
skips on any page — Mentors/Organizers legitimately jump between h2→h2
where a person has no `history`/`specialty`, which is not a skip), every
`<img>` has `alt` (empty for decorative/redundant-with-adjacent-text
images, descriptive for sponsor logos), every `<svg>` and `<i class="fa-
...">` icon has `aria-hidden="true"`, every button has a real accessible
name (visible text, a `.visually-hidden` span, or `aria-label`), the
share-menu JS toggles `aria-expanded` correctly and manages focus
correctly (moves focus into the menu on open, returns it to the trigger
button on close via Escape or outside-click), `outline: none` still only
appears once, on the intentional `main:focus-visible` skip-link target
(SC 2.4.11 exception, unchanged from the first audit).

Two real, previously-unflagged issues found and fixed:

1. **Resources page search box and category dropdown had a border well
   below the SC 1.4.11 non-text-contrast minimum.** `.resource-toolbar__field
   input`/`select` used `--color-border` (`#CED4DA`), which is only
   ~1.4:1 against both the input's own ivory background and the white
   toolbar it sits in — far short of the required 3:1 for identifying a
   form control's boundary. Fixed by adding a new variable,
   **`--color-border-strong: #767268`** (~4.6:1 against ivory/white,
   still a warm neutral gray that fits the palette rather than a jarring
   brand color), and switching just that one selector to it.
   `--color-border` itself is unchanged and still fine — every other
   place it's used (`.hero__dates`, `.mentor-card`, `.mentor-card__photo`,
   `.mentor-card__specialty` badges, `.resource-item`, `.resource-toolbar`
   wrapper, `.share-menu` wrapper, section dividers) is a decorative
   container/divider/badge border, not a control boundary, so SC 1.4.11
   doesn't apply there — checked each one individually before deciding
   the fix should be scoped to just the two form controls.
2. **The new `.resource-item:hover` card highlight (background + border
   color change) had no keyboard-focus equivalent.** Mouse users hovering
   a resource card see the whole card highlight; keyboard users tabbing
   to the link/share-button inside it only got the link's own focus ring
   (still fully compliant on its own — SC 2.4.11 was never actually
   violated), but lost the parity/context cue mouse users get. Not a
   strict violation, just an equity gap in a feature added this session.
   Fixed by adding `.resource-item:focus-within` alongside `:hover` so
   both get the same treatment.

Everything else re-verified and still holds from the first audit: the
full palette contrast table (body text, links, h1 — large text so its
~4.35:1 passes the 3:1 large-text threshold, not a bug — accent pills,
header/footer inverse text, the two different focus-ring colors, the
muted `#495057` secondary text, the footer's `#9EC8FF` sponsor-link
text). The new hover/focus border color, `var(--color-accent)` at
~5.48:1 against white, was checked when that feature was first added and
re-confirmed here.

**Still unverified, same gap as always**: no real browser, so actual
screen-reader output, 400% zoom reflow, and touch-target sizing on the
171-resource list have never been checked by hand. This keeps being the
single biggest remaining risk before calling any of this "done."

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
all seven pages. Output in `_site/`: `index.html`, `schedule/index.html`,
`deliverables/index.html`, `mentors/index.html`, `team/index.html`,
`organizers/index.html`, `resources/index.html`, `assets/css/style.css`,
`assets/js/resources.js`, `sitemap.xml`, `robots.txt`, and every image
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
calling this done. **The Font Awesome icon swap is in the same boat**: the
build succeeds and every `icon:` value was confirmed to resolve to a real
Font Awesome Free glyph name (checked against the package's own
`metadata/icons.yml`) and render as `fa-{style} fa-{name}` in the built
HTML, but nobody has actually looked at whether the glyphs look right at
their rendered size next to the mentor/organizer/resource text — that's
worth a first look before this goes live. **Same for the 117 real-favicon
resource icons**: every one was confirmed to decode as a valid image
(spot-checked with Pillow) and every embedded `<image>` tag was confirmed
present in the built HTML, but a resource list mixing 117 different
sites' own full-color favicons (arbitrary shapes, resolutions, visual
weights) next to Font Awesome's uniform monochrome glyphs on the ~15
category-default entries is exactly the kind of thing that needs an
actual look, not just a build check — this is the biggest visual-risk
item added this session. **Same caveat applies to the Schedule page's
timeline cards**: the whole layout hinges on native `<details>`/
`<summary>` disclosure behavior, which has never been used anywhere else
in this project and has never been clicked in a real browser — the HTML
is spec-valid and the CSS math (chevron rotation, focus ring, hover/hover-
within, the white-card-on-ivory-section contrast bug already found and
fixed once) all check out structurally, but nobody has actually opened
and closed a card by hand yet.

## To continue in a new session

1. **Open all seven pages in a real browser** (`bundle exec jekyll serve
   --livereload`) — this hasn't happened even once yet, and matters more
   than usual right now. On the Schedule page specifically: click through
   a few `<details>` cards to confirm expand/collapse feels right, and
   confirm the nested "Join Zoom" link inside `<summary>` doesn't do
   anything visually janky when clicked (documented as "harmless either
   way" but never actually watched happen). Elsewhere:
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
7. Both no-URL resource entries are resolved now: NCAR Explorer Series got
   its real URL (`https://edec.ucar.edu/public/ncar-explorer-series`), and
   Northwestern State University was removed from `_data/resources.yml`
   entirely by request rather than ever getting a URL.
8. **All 7 originally-dead-domain resources are now resolved.** Of the
   original 7 found while fetching resource-icon favicons:
   `projecteureka.org` → `projecteureka.ai`, `blackinhpc.org` → replaced
   outright with "Black in AI" (`https://www.blackinai.org/`),
   `hpccampus.com`'s "HPC Campus" entry removed outright, `hpc-ed.org` →
   `https://hpc-ed.github.io`, `sc.ed.gov` → DOE CSGF now points to
   `https://www.krellinst.org/csgf/`, `acmhpdc.org` → HPDC now points to
   `https://hpdc.sci.utah.edu`, and the `ippdps.org` typo → IEEE IPDPS now
   points to the correct `https://www.ipdps.org`. See "Resource icons
   sourced from real favicons" in the "Icon system" section for the full
   history and which of these got a fetched favicon vs. reused/kept an
   existing icon (PEARC, `https://pearc.acm.org/`, is Cloudflare-blocked
   the same as `acm.org` and reuses the `custom:acm` icon instead).
9. **A full link-check of all 165 resources** (DNS + live GET, done in
   response to "check for other dead links in resources") found more
   issues beyond the 7 above, **not yet fixed**:
   - `lab.github.com` ("Introduction to GitHub") — dead, GitHub Learning
     Lab was retired years ago.
   - `sc.supercomputing.org` (SC Conference) — resolves to `1.2.3.4`, a
     placeholder/documentation IP, not a real host. Looks like a broken
     DNS record on their end.
   - 7 pages that 404 even though the parent site is confirmed alive
     (org restructured their site, page moved/removed):
     `access-ci.org/campus-champions`, `access-ci.org/news/careers/`,
     `access-ci.org/events/`, `carcc.org/jobs-and-careers/`,
     `www.nasa.gov/seeds/`, `www.nsf.gov/fellowships/`,
     `www.nsf.gov/od/oia/reu/`. None of these were guessed at or fixed —
     each needs either a real corrected URL or a decision to remove it,
     same as the pattern followed for the 7 dead domains above.
   - **False positives, not real problems**: `hprc.tamu.edu` and both
     `siam.org` conference pages 403 from automated fetches
     (Cloudflare/WAF) but are fine for real visitors — same pattern as
     `acm.org`/`pearc.acm.org`. `hackhpc.org`'s HTTPS was timing out
     during the check but plain HTTP returned 200 instantly and it was
     fetched successfully earlier in the same session (its favicon is
     already vendored) — looks like a flaky HTTPS listener on their end
     at that moment, not a dead link; worth a quick recheck before
     treating it as anything more than transient.
10. Not yet built: any pages beyond Home/Mentors/Organizers/Resources.
    (A real favicon now exists — `favicon.ico` + `favicon.png`, both
    user-supplied — linked from `_layouts/default.html`, replacing the
    old deliberately-blank `data:,` placeholder.)

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
│   ├── archives.yml
│   ├── mentors.yml
│   ├── organizers.yml
│   ├── resources.yml
│   ├── schedule.yml
│   ├── sponsors.yml
│   └── teams.yml
├── _includes/
│   ├── icon.html
│   ├── person-card.html
│   ├── teams-card.html
│   ├── resource-item.html
│   ├── share-menu.html
│   ├── site-logo.html
│   └── icons/
│       ├── jupyter.svg    (custom, non-Font-Awesome icon)
│       ├── acm.svg        (custom, ACM's site is Cloudflare-blocked)
│       └── favicons/      (real favicons, one per external domain used
│                            across resources/mentors/organizers/schedule)
├── _layouts/
│   └── default.html
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── resources.js    (search + jump-to-category, Resources page only)
│   │   ├── share-menu.js   (shared: Resources + Deliverables pages)
│   │   └── deliverables.js (README-template dialog, Deliverables page only)
│   ├── templates/
│   │   └── facultyhack-readme-template.md
│   ├── fontawesome/
│   │   ├── LICENSE.txt
│   │   ├── css/
│   │   │   ├── fontawesome.min.css
│   │   │   ├── solid.min.css
│   │   │   └── brands.min.css
│   │   └── webfonts/
│   │       ├── fa-solid-900.woff2
│   │       └── fa-brands-400.woff2
│   └── images/
│       ├── branding/
│       │   ├── FacultyHack26_logo.svg        (icon only)
│       │   ├── FacultyHack26_logo_w_text.svg (icon + wordmark, hero <img>)
│       │   ├── FacultyhHack26_text.svg       (wordmark only, header nav)
│       │   ├── FacultyHack26_logo_w_text.jpg (SEO/OG share image, JSON-LD logo)
│       │   └── dandelion.png                 ("Why the Dandelion?" section)
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
├── schedule.html
├── deliverables.html
├── mentors.html
├── teams.html
├── organizers.html
└── resources.html
```
