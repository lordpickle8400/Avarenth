# Avarenth

The Dungeon Master’s table for Avarenth, a homebrew D&D world: a map-first screen with the wiki, shops, the party and the journey behind every pin. DM only; there are no player accounts.

**App:** https://lordpickle8400.github.io/Avarenth/

## How it works

- Plain HTML, CSS and JavaScript, hosted on GitHub Pages. No build step.
- Data and the DM's login live in Supabase, protected by row level security.
- **Map** (home): pinch, drag, scroll or trackpad to move. Search finds places, people, shops and
  city-map keys. Tap a pin for its article, secrets and shops in the side panel. Zoom far into a
  city with its own map (in `cities/`) and the city map opens; zoom back out to return.
- **Link screens**: phone and laptop follow each other's view and panel (Supabase broadcast).
  Data changes (journey, pins, shops, articles, party) sync live on every device.
- **Party**: a roster with a class cheat sheet for each character.
- Installable on phones and Chromebooks ("Install" / "Add to Home Screen").

## Files

- `index.html` — page shell
- `styles.css` — styles; theme colors are set at runtime from the DM's Customize screen
- `app.js` — the app: map (atlas), wiki, party, journey, shops, holdings, realm, battles
- `cities/` — city maps and their numbered keys (`index.json`)
- `config.js` — public Supabase URL and anon key (safe to publish)
- `sw.js`, `manifest.webmanifest`, `icons/` — what makes it installable
