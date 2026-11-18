# Avarenth

The Dungeon Master’s table for Avarenth, a homebrew D&D world: a map-first screen with the wiki, shops, the party and the journey behind every pin. Players sign in on their phones for the shared map (only what the party knows), their characters, the rules and spells.

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
- **Table screen**: sign a laptop in as the `table` account and it becomes a shared map for the players:
  the party, their route and trail, their own pins, and only the wiki pages they know. It reads
  everything through the `table_world()` function, so secrets never reach it. Each article has an
  "At the table" setting (Unknown / Heard of / Met or Visited); places the party reaches are marked
  visited automatically. "Show the table" on the DM's side flies the table to a place or person.
- Installable on phones and Chromebooks ("Install" / "Add to Home Screen").

## Files

- `index.html` — page shell
- `styles.css` — styles; theme colors are set at runtime from the DM's Customize screen
- `app.js` — the app: map (atlas), wiki, party, journey, shops, holdings, realm, battles
- `cities/` — city maps and their numbered keys (`index.json`)
- `config.js` — public Supabase URL and anon key (safe to publish)
- `sw.js`, `manifest.webmanifest`, `icons/` — what makes it installable

## Rules text

`srd.json` is built from the System Reference Document 5.2.1 by Wizards of the Coast LLC, licensed under
CC-BY-4.0 (https://creativecommons.org/licenses/by/4.0/). It was converted from the markdown edition at
github.com/downfallx/dnd-5e-srd-markdown and arranged into structured blocks for this app (`tools/srd_build.py`). `tools/srd_mana.py` then rewrites every
spell-slot rule for Avarenth's mana (from the wiki's Mana Guide), keeping the 2024 text alongside.

`extras.json` (built by `tools/extras/build.py`) adds own-words feats, backgrounds, Artificer infusions and Blood Hunter curses.
`monsters.json` (built by `tools/srd_monsters.py`) is the SRD 5.2.1 monsters and animals for the DM's appendix.
`gear.json` (built by `tools/srd_items.py`) is the SRD 5.2.1 equipment, magic items, starting gear and combat actions.
`spells-srd.json` holds every spell in the same SRD 5.2.1 (CC-BY-4.0), pulled out by `tools/spells_srd.py`, with
spell slots rewritten as mana. `spell-notes.json` and `subclass-notes.json` are short summaries written in our own
words for the spells and subclasses from the other books (`tools/spell-notes/`, `tools/subclass-notes/`); they are
not book text. The Artificer and Blood Hunter classes in `rules.js` are summarized the same way.
