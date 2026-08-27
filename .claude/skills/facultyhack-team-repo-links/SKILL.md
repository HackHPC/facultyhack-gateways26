---
name: facultyhack-team-repo-links
description: Update _data/teams.yml directly for FacultyHack (or similar hackathon) events by reading the mentee/mentor roster, pulling each mentee's project_repo, and scanning that GitHub repo for a syllabus (initial + revised), poster, headshot/picture, and CV/resume. Syllabus/poster/CV files become verified links written straight into teams.yml; any new headshot/picture found is downloaded, resized to 300px wide, and saved into that mentee's assets/files/teams/<slug>/ folder as <FirstName>_<LastName>_portrait.<ext> — never producing a table, never just a link for the picture. Use this whenever the user asks to update or refresh syllabus/poster/picture/CV links (or pictures specifically) against participants' GitHub repos, add a newly-corrected repo URL for one participant and re-sync their files, or otherwise wants teams.yml and each mentee's photo brought up to date with what's actually in their repo. Always trigger this for requests involving teams.yml + GitHub repos + syllabus/poster/picture/CV, even if the user doesn't say "skill."
---

# FacultyHack Team Repo Links

Reads `_data/teams.yml` (mentee/mentor pairings with a `project_repo` field per
mentee) and scans each mentee's GitHub repo for a syllabus, poster, picture,
and CV/resume:

- Syllabus/poster/CV files → verified links written **directly into
  `_data/teams.yml`** — never a table, never mentor info.
- Any **new** picture found (one not already downloaded for that mentee) →
  actually downloaded, resized to 300px wide, and saved as a real file in
  that mentee's `assets/files/teams/<slug>/` folder — never just a URL in
  `teams.yml`. See step 5.

## Where each file type goes in teams.yml

Two different destinations, matching this project's existing conventions —
don't invent a third shape:

- **Initial Syllabus / Revised Syllabus / Poster / CV/Resume** → appended to
  that mentee's `links:` list (create the `links:` key if it doesn't exist yet)
  as `{label, url, icon}`:
  - `label`: exactly `"Initial Syllabus"`, `"Revised Syllabus"`, `"Poster"`, or
    `"CV/Resume"` — these exact strings, not the raw filename.
  - `url`: the verified GitHub blob URL.
  - `icon`: by the file's extension — `.pdf` → `"solid:file-pdf"`, `.docx`/`.doc`
    → `"solid:file-word"`, `.pptx`/`.ppt` → `"solid:file-powerpoint"`, anything
    else → `"solid:file-lines"`.
  - **Idempotent**: if a `links:` entry with that exact `label` already exists
    for this mentee, update its `url`/`icon` in place rather than appending a
    duplicate.
- **Picture** → not a `teams.yml` field at all. Download the file, resize it
  to 300px wide, and save it as
  `assets/files/teams/<mentee-slug>/<FirstName>_<LastName>_portrait.<ext>`.
  The existing Photos section on the Teams page already auto-discovers any
  image file in that folder, so nothing further needs writing to
  `teams.yml` or `teams-card.html` for a picture to show up. Full procedure
  in step 5 — only do this for a picture that isn't already downloaded for
  that mentee (check the folder first).

## Workflow

### 1. Get the roster

Read `_data/teams.yml`. Parse each `- mentee:` block. Skip:
- Anything commented out (lines starting with `#`) — paused/dropped entries,
  not current participants.
- All `mentor_name` / `mentor_*` fields entirely — this skill never touches
  mentor data.

For each mentee, pull: `name` (used to derive the slug via the same
`| slugify` Jekyll uses — lowercase, spaces to hyphens — for matching
`assets/files/teams/<slug>/`) and `project_repo` (may be absent).

If the user is asking to update just ONE participant (e.g. "use this repo for
X instead" or "add this corrected repo URL for X"), don't re-derive the whole
roster — update that mentee's `project_repo` field first if a new URL was
given, then redo steps 2–6 for that one mentee only.

If a mentee has no `project_repo` at all, skip them silently (nothing to scan).

### 2. List each repo's files

For each `project_repo` URL (`https://github.com/{owner}/{repo}`), get the file
tree via the codeload tarball (no auth, no rate limit — prefer this over the
GitHub API, which rate-limits hard on repeated unauthenticated calls):

```bash
for branch in main master; do
  code=$(curl -sL -w "%{http_code}" -o /tmp/repo.tar.gz \
    "https://codeload.github.com/{owner}/{repo}/tar.gz/refs/heads/$branch")
  if [ "$code" = "200" ]; then
    tar -tzf /tmp/repo.tar.gz | sed -E "s#^[^/]+/##"
    break
  fi
done
```

If both `main` and `master` 404, note it (e.g. "Oyebade's repo 404s — may be
renamed/private/wrong URL") and move on — don't guess a different URL, and
don't remove their existing `project_repo` value on a fetch failure alone.

### 3. Categorize files

Match filenames (case-insensitively) against these categories. A file can only
fill one category.

- **Syllabus** (Initial / Revised): filenames containing "syllabus" or
  "course" + a course-number-like token. If there are exactly two such files
  and their names distinguish them (e.g. `original_*` vs `revised_*`, or
  "Original ..." vs "Revised ..."), map directly: original → Initial, revised
  → Revised. If there's only one syllabus-like file, put it in Initial and
  leave Revised unset. If there are 3+ candidates with no clear naming split,
  use commit history to disambiguate (step 3a) rather than guessing from
  filename alone, and drop any file that's clearly just a duplicate/re-upload
  of another (same apparent content, e.g. a `(1)` suffix).
- **Poster**: filenames containing "poster". If there's a finished/final file
  alongside a working/source file (e.g. `Poster_Final.pdf` next to
  `Poster_SWANIER.pptx`), prefer the final one and note the other as a
  discretionary alternative rather than silently picking one — same as the
  poster-source-file case already flagged once in this project's history.
- **Picture**: filenames containing "photo", "headshot", or sitting in an
  `Image`/`images`-type folder AND clearly depicting a person (not a diagram,
  screenshot, or unrelated illustration — use judgment on the filename; e.g.
  "CherylSwanierPhoto.jpeg" is a picture, "Cloud Architecture.jpeg" is not, a
  bare "Screenshot ....png" is not). **If the obviously-intended file is empty
  or corrupt** (this has happened before — a `Faculty_Headshot.png` that was a
  2-byte placeholder while the real photo sat in an `images/` subfolder under a
  different name), check sibling files/folders for the real one before giving
  up on that mentee's picture.
- **CV/Resume**: filenames containing "cv", "resume", or "vitae".
- Ignore README, LICENSE, .gitignore, data files, notebooks, and anything not
  matching the above.

#### 3a. Disambiguating syllabus order via commit history

When filenames alone don't establish which syllabus came first, check each
candidate file's first commit date:

```bash
curl -s "https://api.github.com/repos/{owner}/{repo}/commits?path={urlencoded_path}&per_page=100"
```

Take the earliest date across all pages returned (GitHub gives newest first, so
use the *last* entry, or the oldest across all pages if it paginates) as that
file's "added" date. Order candidate files earliest → latest; earliest is
Initial, latest is Revised. This endpoint rate-limits quickly when
unauthenticated (~a handful of calls); if you hit "API rate limit exceeded,"
wait ~30-60s and retry rather than guessing, and don't hammer it back-to-back
across many files — only use it for genuinely ambiguous cases, not every repo.

### 4. Build and verify document links

For each matched syllabus/poster/CV file, build the blob URL:
`https://github.com/{owner}/{repo}/blob/{branch}/{urlencoded path}`
(URL-encode spaces as `%20`, `&` as `%26`, etc. — use
`python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))"`
on the path, then re-join path segments with `/`.)

Verify every constructed URL resolves before writing it to `teams.yml`:

```bash
curl -s -o /dev/null -w "%{http_code}" -L "{url}"
```

Only write links that return 200. If a constructed URL doesn't resolve, don't
guess an alternative — just leave that field unset for this mentee rather than
writing a broken link.

### 5. Picture: download, resize, name — only for new pictures

For each mentee with a picture file found in step 3:

1. **Check first**: does `assets/files/teams/<mentee-slug>/` already contain a
   file with `portrait` in its name? If yes, this mentee already has a
   picture — skip them entirely (no re-download, no overwrite) unless the
   user explicitly asked to refresh that specific mentee's picture. This
   step only ever processes genuinely **new** pictures.
2. Convert the found file's GitHub blob URL to the raw content URL
   (`https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{path}`,
   same URL-encoding as step 4) and download it.
3. **Actually view the downloaded image** before using it — confirm it's a
   real, legible headshot, not corrupt, not a placeholder, not something else
   entirely. Don't skip this on the assumption the filename is enough.
4. Resize to **300px wide**, preserving aspect ratio (Pillow, `LANCZOS`
   resample). Save in the original format (`quality=85, optimize=True` for
   JPEG; `optimize=True` for PNG) — this project's photos have come in at
   several MB each straight from a phone/DSLR, so this step matters, not just
   a nicety.
5. Save as `assets/files/teams/<mentee-slug>/<FirstName>_<LastName>_portrait.<ext>`
   (underscores between name parts, extension matching the source format) —
   this exact naming, not `portrait.<ext>` alone, so the file is identifiable
   on its own outside the page context.

No `_includes/teams-card.html` change is needed for this — the Photos section
already auto-discovers any image file dropped in a mentee's
`assets/files/teams/<slug>/` directory. Report which mentees got a new
picture and which were skipped because one already existed, as part of the
summary in step 6.4.

### 6. Write to teams.yml and verify

Edit `_data/teams.yml` directly (not a table, not a separate output file):

- For each mentee with new/changed document links, add or update the relevant
  `links:` entries per "Where each file type goes in teams.yml" above.
- If a `project_repo` URL was corrected for a mentee this run, update that
  field too.

Then, same verification bar as every other change to this site:

1. `bundle exec jekyll build` and confirm it succeeds.
2. For each mentee touched, confirm in the built
   `_site/teams/index.html` that the new label(s) and URL(s)/filename(s) appear
   inside *that specific mentee's* card (slice between consecutive
   `<li class="teams-card"` boundaries — a bare site-wide substring check risks
   a false positive from an adjacent card on this page).
3. Run the project's standard structural check (balanced/nested tags via
   Python's `html.parser`, no duplicate `id`s, no heading-hierarchy skips)
   across all built pages.
4. Report a short summary: which mentees got which new links/pictures, which
   file types were genuinely not found (not just "—", say why: no matching
   file, repo 404, ambiguous poster source vs. final), and any judgment calls
   made in categorization (step 3) or disambiguation (step 3a) — the same
   "Notes" concept as a table version would have, just as prose in the reply
   rather than a table footer.

## Notes

- This whole workflow is unauthenticated `curl`/`bash` — no GitHub token
  needed, but the commits API in step 3a rate-limits fast, so use it
  sparingly.
- If `_data/teams.yml` isn't present, ask for its path rather than guessing at
  a roster.
- If the user names one participant, only redo that participant's repo scan
  and `teams.yml` edit — no need to re-verify every other mentee's links again.
- Never touch `mentor_name` or any `mentor_*` field. Never write a markdown
  table as the deliverable — the roster's home is `_data/teams.yml`, and the
  rendered Teams page is the actual output surface.
