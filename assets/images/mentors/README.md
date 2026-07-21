# Mentor photos

Empty until real headshots are supplied — see `PICKUP_AND_GO.md` for why
photos were not auto-downloaded from mentors' LinkedIn/staff-profile pages
(copyright + consent, not a technical limitation).

## Adding a photo

1. Get the mentor's own explicit permission to use the specific image file
   on this site, or a headshot they submitted directly for this purpose.
2. Save it here as `<mentor-slug>.jpg` (or `.png`/`.webp`), where
   `<mentor-slug>` matches the mentor's name in `_data/mentors.yml`,
   lowercased with spaces/punctuation replaced by hyphens — e.g.
   `ahmad-al-omari.jpg` for "Ahmad Al-Omari".
3. Keep it roughly square (the template renders it in a 96×96 circle,
   `object-fit: cover`, so off-square images get cropped, not distorted).
4. Add a `photo:` field to that mentor's entry in `_data/mentors.yml`:
   ```yaml
   photo: "/assets/images/mentors/ahmad-al-omari.jpg"
   ```
   The `mentors.html` template and CSS already handle the rest — no other
   changes needed. Mentors without a `photo:` field simply render without
   one (no broken image, no empty circle).
