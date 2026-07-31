# Team files

One directory per mentee, named to match that mentee's slug in
`_data/teams.yml` (their name run through Jekyll's `slugify` — e.g.
"Antigone Anthony" → `antigone-anthony/`, matching the `id` already used
for that mentee's card and anchor link on `teams.html`).

## Adding a file

Drop any file into the matching mentee's directory and rebuild the site —
no YAML edits needed. `_includes/teams-card.html` scans `site.static_files`
for anything under that mentee's folder at build time and automatically
renders it as a link in a "Files" list on their team card, with an icon
chosen from the file's extension:

| Extension                          | Icon               |
| ----------------------------------- | ------------------ |
| `.pdf`                              | `solid:file-pdf`         |
| `.jpg` `.jpeg` `.png` `.gif` `.webp` `.svg` | `solid:file-image` |
| `.ppt` `.pptx`                      | `solid:file-powerpoint` |
| anything else                       | `solid:file-lines` (generic file) |

The link text is the filename without its extension. **Use underscores
to separate words** (e.g. `course_syllabus.pdf`) — they're converted to
spaces and each word's first letter is capitalized, so it renders as
"Course Syllabus". Only the first letter of each word changes case; the
rest of the word is left exactly as typed, so mixed-case words and
acronyms come through correctly (`FacultyHack_Gateways26_Poster.pptx` →
"FacultyHack Gateways26 Poster", `NAIRR_account_setup.pdf` → "NAIRR
Account Setup"). Filenames with spaces instead of underscores still work
the same way. A mentee with no files in their directory simply shows no
"Files" section — same "only show it once it exists" rule used for
session resources on `schedule.html`.

Each empty directory holds a `.gitkeep` placeholder so git tracks it —
Jekyll ignores dotfiles by default, so `.gitkeep` never appears in the
built site.
