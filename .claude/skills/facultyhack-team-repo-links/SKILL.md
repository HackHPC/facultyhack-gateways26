---
name: facultyhack-team-repo-links
description: Update _data/teams.yml and each mentee's local file folder for FacultyHack (or similar hackathon) events by reading the mentee/mentor roster, pulling each mentee's project_repo, and scanning that GitHub repo for a syllabus (initial + revised), poster, headshot/picture, and CV/resume. Initial Syllabus / Revised Syllabus / CV-Resume become verified links written straight into teams.yml. Poster and Picture are never linked to the remote repo — both are downloaded and saved as real files in that mentee's assets/files/teams/<slug>/ folder. A poster is normalized to Poster.pdf (converted to PDF first if the source wasn't already a PDF, discarding the non-PDF original) plus a rendered Poster.png preview of that PDF; a picture is resized to 300px wide and renamed <FirstName>_<LastName>_portrait.<ext>. Any existing teams.yml link pointing at a remote GitHub copy of the poster is removed once the local Poster.pdf exists. Never produces a table. Use this whenever the user asks to update or refresh syllabus/poster/picture/CV links against participants' GitHub repos, add a newly-corrected repo URL for one participant and re-sync their files, or otherwise wants teams.yml and each mentee's local files brought up to date with what's actually in their repo. Always trigger this for requests involving teams.yml + GitHub repos + syllabus/poster/picture/CV, even if the user doesn't say "skill."
---

# FacultyHack Team Repo Links

Reads `_data/teams.yml` (mentee/mentor pairings with a `project_repo` field per
mentee) and scans each mentee's GitHub repo for a syllabus, poster, picture,
and CV/resume. Three different outcomes depending on file type — don't blend
them:

- **Initial Syllabus / Revised Syllabus / CV/Resume** → verified links written
  **directly into `_data/teams.yml`** — never a table, never mentor info.
- **Poster** → never a link to the remote repo. Downloaded, normalized to a
  single `Poster.pdf` (converted first if the source wasn't already a PDF),
  and rendered to a companion `Poster.png` preview — both saved to
  `assets/files/teams/<mentee-slug>/`. If `teams.yml` currently has a `links:`
  entry labeled `"Poster"` pointing at a GitHub URL for this mentee, that
  entry is removed once the local `Poster.pdf` exists. See step 5.
- Any **new** picture found (one not already downloaded for that mentee) →
  downloaded, resized to 300px wide, and saved as
  `<FirstName>_<LastName>_portrait.<ext>` in the same folder. See step 6.

## Where each file type goes

Three destinations, matching this project's existing conventions — don't
invent a fourth shape:

- **Initial Syllabus / Revised Syllabus / CV/Resume** → appended to that
  mentee's `links:` list in `teams.yml` (create the `links:` key if it doesn't
  exist yet) as `{label, url, icon}`:
  - `label`: exactly `"Initial Syllabus"`, `"Revised Syllabus"`, or
    `"CV/Resume"` — these exact strings, not the raw filename.
  - `url`: the verified GitHub blob URL.
  - `icon`: by the file's extension — `.pdf` → `"solid:file-pdf"`, `.docx`/`.doc`
    → `"solid:file-word"`, `.pptx`/`.ppt` → `"solid:file-powerpoint"`,
    an image extension → `"solid:file-image"`, anything else →
    `"solid:file-lines"`.
  - **Idempotent**: if a `links:` entry with that exact `label` already exists
    for this mentee, update its `url`/`icon` in place rather than appending a
    duplicate.
- **Poster** → not a `teams.yml` field at all, and always exactly two files,
  never the original as-downloaded format:
  - `assets/files/teams/<mentee-slug>/Poster.pdf` — literally `Poster`,
    capital P, no mentee name prefix (deliberately different from the
    picture naming below; this project's own instruction for this file
    type). If the source file wasn't already a PDF (a `.pptx`/`.ppt`,
    `.docx`/`.doc`, or a raster image like `.png`/`.jpg`), convert it to PDF
    first — **only the PDF is kept**, the original-format file is not saved
    or left in the repo working tree. Full resolution/quality — unlike a
    picture, a poster is meant to be read at size, don't resize the PDF
    itself.
  - `assets/files/teams/<mentee-slug>/Poster.png` — a rendered preview of
    `Poster.pdf`'s (single) page, generated *from* the PDF, not from
    whatever the original source format was.
  Then remove any `links:` entry labeled `"Poster"` for this mentee from
  `teams.yml`, if one exists — the local file replaces it, it doesn't sit
  alongside it. Full procedure, including which conversion tool to use for
  which source format, in step 5.
- **Picture** → also not a `teams.yml` field. Download the file, resize it to
  300px wide, and save it as
  `assets/files/teams/<mentee-slug>/<FirstName>_<LastName>_portrait.<ext>`.
  Full procedure in step 6.

Poster and Picture both rely on the existing Files/Photos sections on the
Teams page already auto-discovering any file dropped in a mentee's
`assets/files/teams/<slug>/` directory (image extensions render as a photo,
everything else as a downloadable file link) — nothing further needs writing
to `teams.yml` or `teams-card.html` for either to show up. With the
PDF+PNG pairing above, a mentee's poster now intentionally shows up in
*both* places at once: `Poster.pdf` as a downloadable file under Files, and
`Poster.png` as a visual thumbnail under Photos (same pairing pattern this
project already uses for `Updated_Course_Goals.pdf` + `.png`) — this is the
intended outcome, not a routing gap to fix.

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
given, then redo steps 2–7 for that one mentee only.

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
fill one category. Filenames aren't always honest about content — if a match
is ambiguous or a name looks accidental (e.g. a `.pdf.png` double extension),
open the file and check before trusting the name alone; this has mattered in
practice (see the empty-headshot and mislabeled-poster cases below).

- **Syllabus** (Initial / Revised): filenames containing "syllabus" or
  "course" + a course-number-like token. If there are exactly two such files
  and their names distinguish them (e.g. `original_*` vs `revised_*`, or
  "Original ..." vs "Revised ..."), map directly: original → Initial, revised
  → Revised. If there's only one syllabus-like file, put it in Initial and
  leave Revised unset. If there are 3+ candidates with no clear naming split,
  use commit history to disambiguate (step 3a) rather than guessing from
  filename alone, and drop any file that's clearly just a duplicate/re-upload
  of another (same apparent content, e.g. a `(1)` suffix or identical file
  hash to another candidate).
- **Poster**: filenames containing "poster", OR a file that renders as a
  finished FacultyHack conference poster when opened (green-header layout,
  abstract/goals/references sections, sponsor row) even if the filename
  doesn't say "poster" — this has happened (a `....pdf.png` file with no
  "poster" in the name that was the mentee's actual finished poster). If
  there's a finished/final file alongside a working/source file (e.g.
  `Poster_Final.pdf` next to `Poster_SWANIER.pptx`), prefer the final one and
  note the other as a discretionary alternative rather than silently picking
  one. **Also check whether a file already linked/saved as the poster is
  actually a placeholder** — open it if there's any doubt; a `poster_final.pdf`
  has turned out to be an unfinished draft (bracketed `[placeholder]` text, a
  blank QR code box) while a differently-named file in the same repo was the
  real finished poster. If so, treat the real one as the match even though the
  other file's name looks more authoritative.
- **Picture**: filenames containing "photo", "headshot", or sitting in an
  `Image`/`images`-type folder AND clearly depicting a person (not a diagram,
  screenshot, or unrelated illustration — use judgment on the filename; e.g.
  "CherylSwanierPhoto.jpeg" is a picture, "Cloud Architecture.jpeg" is not, a
  bare "Screenshot ....png" is not). **If the obviously-intended file is empty
  or corrupt** (this has happened before — a `Faculty_Headshot.png` that was a
  2-byte placeholder while the real photo sat in an `images/` subfolder under a
  different name), check sibling files/folders for the real one before giving
  up on that mentee's picture. A picture embedded only inside a poster PDF
  (not available as its own file) doesn't count — don't try to crop/extract
  one from a PDF.
- **CV/Resume**: filenames containing "cv", "resume", or "vitae". If the same
  resume appears at two paths (check by file hash, not just name, when a repo
  has a duplicate-looking layout like a top-level `assets/` plus a nested
  `project-materials/assets/`), use the more clearly-named path and ignore the
  duplicate.
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

### 4. Build and verify Syllabus/CV links

For each matched Initial Syllabus / Revised Syllabus / CV file (**not**
Poster — that never becomes a `teams.yml` link, see step 5), build the blob
URL: `https://github.com/{owner}/{repo}/blob/{branch}/{urlencoded path}`
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

### 5. Poster: download, normalize to PDF, render a PNG, remove any remote link

For each mentee with a poster file found in step 3:

1. **Check first**: does `assets/files/teams/<mentee-slug>/` already contain a
   `Poster.pdf`? If yes, skip steps 2–4 entirely (no re-download, no
   re-convert, no re-render) unless the user explicitly asked to refresh that
   specific mentee's poster — but **still do step 5** (remote-link removal)
   regardless, since an already-satisfied mentee should never be left with a
   stale remote link either.
2. Convert the found file's GitHub blob URL to the raw content URL
   (`https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{path}`, same
   URL-encoding as step 4) and download it.
3. **Actually view the downloaded file** before using it — confirm it's a
   real, complete poster (not a placeholder draft, not corrupt). Don't skip
   this on the assumption the filename is enough — see the placeholder-poster
   case in step 3. Do this check on the *original* downloaded file, before
   conversion — a bad conversion of a bad source is still bad.
4. **Normalize to `Poster.pdf`**, tool depending on the source format:
   - Already a `.pdf` → just save it as `assets/files/teams/<mentee-slug>/Poster.pdf`,
     no conversion needed.
   - A raster image (`.png`, `.jpg`/`.jpeg`) → convert with Pillow, already a
     project dependency:
     ```python
     from PIL import Image
     Image.open(src_path).convert("RGB").save(dest_path, "PDF")
     ```
   - A `.pptx`/`.ppt` or `.docx`/`.doc` → requires LibreOffice headless
     (`soffice --headless --convert-to pdf --outdir <dir> <file>`). **This is
     not installed on this machine by default** — check with
     `command -v soffice` before relying on it. If it's missing, don't
     silently skip or fabricate a workaround (no cloud-conversion API,
     nothing that uploads a mentee's file to a third-party service without
     asking) — stop and ask the user whether to install it
     (`brew install --cask libreoffice`, a real several-hundred-MB
     application install, not something to do without confirmation) or
     handle that mentee's poster manually. Report this plainly rather than
     quietly leaving a `.pptx` in place under a `.pdf` name.
   - Whatever the source format, **only `Poster.pdf` is kept** — the
     downloaded original (the `.pptx`, `.png`, etc.) is a scratch/temp file
     and does not get copied into `assets/files/teams/<mentee-slug>/`.
5. **Render `Poster.png`** from the now-saved `Poster.pdf`, using `pdftoppm`
   (poppler-utils, already installed on this machine):
   ```bash
   pdftoppm -png -scale-to 3000 -singlefile \
     "assets/files/teams/<mentee-slug>/Poster.pdf" \
     "assets/files/teams/<mentee-slug>/Poster"
   ```
   `-scale-to 3000` fits the render within a 3000×3000 box on its long edge —
   matches this project's existing convention for slide/poster preview PNGs
   (e.g. `Updated_Course_Goals.png`, ~3000px long edge). Re-save through
   Pillow with `optimize=True` afterward; the size win is small for a
   text-dense poster but it's free and matches how every other image in this
   project is already handled.
6. **Remove the remote link**: if `teams.yml` has a `links:` entry labeled
   exactly `"Poster"` for this mentee, delete that entry now that
   `Poster.pdf` exists locally. Do this regardless of whether this run just
   converted a new file or the mentee already had one from a prior run — the
   rule is "no remote Poster link once a local PDF exists," not "only right
   after a fresh conversion."

No `_includes/teams-card.html` change is needed — the Files/Photos section
already auto-discovers any file dropped in a mentee's
`assets/files/teams/<slug>/` directory, and `Poster.pdf`/`Poster.png` route
to Files/Photos respectively by extension, same as any other file there (see
"Where each file type goes"). Report which mentees got a new poster PDF+PNG,
which had their remote link removed, which were skipped because a local
`Poster.pdf` already existed, and which were blocked on a missing LibreOffice
install, as part of the summary in step 7.4.

### 6. Picture: download, resize, name — only for new pictures

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

Report which mentees got a new picture and which were skipped because one
already existed, as part of the summary in step 7.4.

### 7. Write to teams.yml and verify

Edit `_data/teams.yml` directly (not a table, not a separate output file):

- For each mentee with new/changed Syllabus/CV links, add or update the
  relevant `links:` entries per "Where each file type goes" above.
- For each mentee who got a Poster this run (or already had one locally),
  remove their `links:` entry labeled `"Poster"` if present.
- If a `project_repo` URL was corrected for a mentee this run, update that
  field too.

Then, same verification bar as every other change to this site:

1. `bundle exec jekyll build` and confirm it succeeds.
2. For each mentee touched, confirm in the built
   `_site/teams/index.html` that the new label(s)/filename(s) appear inside
   *that specific mentee's* card, and that a removed remote Poster link is
   actually gone from that card (slice between consecutive
   `<li class="teams-card"` boundaries — a bare site-wide substring check
   risks a false positive from an adjacent card on this page).
3. Run the project's standard structural check (balanced/nested tags via
   Python's `html.parser`, no duplicate `id`s, no heading-hierarchy skips)
   across all built pages.
4. Report a short summary: which mentees got which new links/posters/pictures,
   which remote Poster links were removed, which file types were genuinely not
   found (not just "—", say why: no matching file, repo 404, ambiguous poster
   source vs. final), and any judgment calls made in categorization (step 3)
   or disambiguation (step 3a) — the same "Notes" concept as a table version
   would have, just as prose in the reply rather than a table footer.

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
- Poster and Picture are the two file types that are never a `teams.yml`
  link — both live only as real files in `assets/files/teams/<slug>/`. Only
  Initial Syllabus, Revised Syllabus, and CV/Resume ever become `links:`
  entries.
- Poster conversion tooling: Pillow (already a project dependency) handles
  image→PDF. `pdftoppm` (poppler-utils, already installed on this machine)
  handles PDF→PNG. `.pptx`/`.docx` sources need LibreOffice headless
  (`soffice`), which is **not installed by default** — check with
  `command -v soffice` before step 5.4 relies on it, and ask before
  installing it (`brew install --cask libreoffice`) rather than assuming
  it's fine to add a large new dependency unprompted.
