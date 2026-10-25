# Avarenth

Wiki and character sheets for Avarenth, a homebrew D&D world, with a section for each campaign.

**App:** https://lordpickle8400.github.io/Avarenth/

## How it works

- Plain HTML, CSS and JavaScript, hosted on GitHub Pages. No build step.
- Data and logins live in Supabase. What each person can see is enforced by the
  database's row level security:
  - New accounts start as **pending** and see nothing until the DM approves them.
  - **Players** see revealed articles and only their own characters.
  - The **DM** sees everything. DM secrets are stored in a separate table that
    player accounts can never read.
- Installable on phones and Chromebooks ("Install" / "Add to Home Screen").

## Files

- `index.html` — page shell
- `styles.css` — styles; theme colors are set at runtime from the DM's Customize screen
- `app.js` — the app: wiki, templates, editor, customize, players, character sheets
- `config.js` — public Supabase URL and anon key (safe to publish)
- `sw.js`, `manifest.webmanifest`, `icons/` — what makes it installable
