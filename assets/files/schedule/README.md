# Session files

One directory per virtual training session, named to match that
session's date run through Jekyll's `slugify` filter (e.g. "Mon, August
3" → `mon-august-3`). Same convention as `assets/files/teams/`.

## Adding a file

Drop any file into the matching session's directory and rebuild the
site — no YAML edits needed. `schedule.html` scans `site.static_files`
for anything under that session's folder at build time and automatically
renders it as a link in a "Files" list on that session's card, with an
icon chosen from the file's extension:

| Extension                                   | Icon                    |
| -------------------------------------------- | ----------------------- |
| `.pdf`                                       | `solid:file-pdf`        |
| `.jpg` `.jpeg` `.png` `.gif` `.webp` `.svg`   | `solid:file-image`      |
| `.ppt` `.pptx`                               | `solid:file-powerpoint` |
| anything else                                | `solid:file-lines` (generic file) |

The link text is the filename without its extension. **Use underscores
to separate words** (e.g. `session_slides.pdf`) — they're converted to
spaces and each word's first letter is capitalized, so it renders as
"Session Slides". Only the first letter of each word changes case; the
rest of the word is left exactly as typed, so mixed-case words and
acronyms come through correctly (`FacultyHack_Gateways26_Poster.pptx` →
"FacultyHack Gateways26 Poster", `NAIRR_account_setup.pdf` → "NAIRR
Account Setup"). Filenames with spaces instead of underscores still work
the same way. A session with no files in its directory simply shows no
"Files" section.

This is separate from the hand-curated `resources:` list in
`_data/schedule.yml` (used for links to external sites, described in the
comment at the top of that file) — that one also cross-lists into the
"Session Materials" section on the Resources page; files added here do
not, since there's no per-file description/name metadata to show there.

Each empty directory holds a `.gitkeep` placeholder so git tracks it —
Jekyll ignores dotfiles by default, so `.gitkeep` never appears in the
built site.
