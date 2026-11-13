/* Avarenth — wiki + character sheets on Supabase.
   Everything a player is allowed to see is decided by the database (row level security);
   the DM/Player toggle here is only a preview for the DM. */
(function () {
  'use strict';

  /* ================= Fixed data ================= */
  var PRESETS = {
    'Dark ink':     { bg: '#101114', panel: '#1B1D22', text: '#E6E1D6', accent: '#D9A94E' },
    'Parchment':    { bg: '#F3EBDA', panel: '#E6D9BF', text: '#3B3127', accent: '#8A5A12' },
    'Sea stone':    { bg: '#0F1719', panel: '#172225', text: '#DDE6E4', accent: '#6FA3C7' },
    'Blood & iron': { bg: '#140E0E', panel: '#241818', text: '#EAD9D4', accent: '#D2665A' },
    'Elven grove':  { bg: '#0F1610', panel: '#19251B', text: '#E1EAD9', accent: '#9BC07F' },
    'Frostwyrm':    { bg: '#EEF2F5', panel: '#DAE3EA', text: '#1E2A33', accent: '#2F5F80' }
  };
  var FONTS = {
    'Cinzel': "'Cinzel', Georgia, serif",
    'Cormorant Garamond': "'Cormorant Garamond', Georgia, serif",
    'IM Fell English': "'IM Fell English', Georgia, serif"
  };
  var DEFAULT_LOOK = { preset: 'Dark ink', custom: null, font: 'Cinzel', corners: 'Sharp' };

  function T(group, name, blurb, sidebar, sections, dm) {
    return { group: group, name: name, blurb: blurb, sidebar: sidebar, sections: sections, dm: dm };
  }
  var TEMPLATES = [
    T('People', 'Character', 'Anyone in your world, from kings to dockhands.', ['Species', 'Age', 'Faction', 'Home', 'Status'], ['Appearance', 'Personality', 'History', 'Relationships'], ['True motives', 'Secrets', 'Stat block']),
    T('People', 'Species', 'A people or creature kind and what makes them tick.', ['Lifespan', 'Size', 'Homeland', 'Languages'], ['Biology', 'Society', 'History'], ['Hidden origins']),
    T('Lore & Magic', 'Culture', 'How a group lives: customs, values, food, names.', ['Region', 'Language', 'Religion'], ['Customs', 'Values', 'Food & dress', 'Naming'], ['Tensions']),
    T('People', 'Rank / Title', 'A position someone can hold, and what comes with it.', ['Organization', 'Held by', 'Succession'], ['Duties', 'Privileges', 'History'], ['Who really holds power']),
    T('Places', 'Settlement', 'Cities, towns and villages, districts and all.', ['Region', 'Population', 'Ruler', 'Factions present', 'Status'], ['Overview', 'Districts', 'Government', 'Trade', 'Notable places'], ['Hidden factions', 'Plot hooks']),
    T('Places', 'Location', 'A single place: a tavern, temple, ruin or fortress.', ['Type', 'Settlement', 'Owner', 'Status'], ['Description', 'History', 'Who you find there'], ['Traps & secrets']),
    T('Places', 'District', 'One of the realms of a kingdom, with its own ruling house, seat and purpose.', ['Ruler', 'Ruling house', 'Seat', 'Purpose', 'Exports', 'Density', 'Baronies'], ['Overview', 'Economy', 'People', 'Politics', 'Holdings'], ['Secrets', 'Plot hooks']),
    T('Places', 'Region', 'Islands, coasts, forests and seas.', ['Climate', 'Terrain', 'Settlements'], ['Geography', 'Wildlife', 'Dangers'], ['Undiscovered places']),
    T('Places', 'Country', 'Realms, empires and kingdoms.', ['Capital', 'Ruler', 'Government', 'Allies', 'Enemies', 'Status'], ['Overview', 'History', 'Politics', 'Military', 'Economy'], ['Coming conflicts']),
    T('Groups', 'Organization', 'Factions, guilds, cults, noble houses and conspiracies.', ['Type', 'Leader', 'Members', 'Seat of power', 'Goal', 'Allies', 'Rivals', 'Status'], ['Goals', 'Methods', 'History', 'Structure', 'Relations'], ['Secret agenda', 'Infiltrators']),
    T('Groups', 'Religion', 'Faiths, their gods and their followers.', ['Deities', 'Holy site', 'Clergy'], ['Beliefs', 'Rituals', 'Holy days', 'Schisms'], ['What is actually true']),
    T('Lore & Magic', 'Spell', 'One spell, built for your mana and tome systems.', ['School', 'Mana cost', 'Casting time', 'Range', 'Class access', 'Tome location'], ['Effect', 'Tradition variants', 'Lore'], ['Which faction guards the tome']),
    T('Lore & Magic', 'Magic System', 'How magic works, what it costs, who can use it.', ['Source', 'Practitioners', 'Limits', 'Replaces'], ['How it works', 'Costs', 'Learning'], ['Hidden rules']),
    T('Lore & Magic', 'Myth / Legend', 'Stories people tell, true or not.', ['Origin', 'Told by'], ['The story', 'Variations', 'Influence'], ['What really happened']),
    T('Lore & Magic', 'Tradition', 'Festivals, rites and customs.', ['Culture', 'When'], ['Origins', 'Practice', 'Meaning'], []),
    T('Lore & Magic', 'Language', 'How a people speak and write.', ['Speakers', 'Script', 'Family'], ['Sound & feel', 'Common phrases', 'Naming'], []),
    T('Things', 'Item', 'Weapons, relics, artifacts and trinkets.', ['Type', 'Rarity', 'Owner', 'Location'], ['Description', 'History', 'Properties'], ['Curse or hidden power']),
    T('Things', 'Ship', 'Vessels that sail the isles.', ['Class', 'Captain', 'Home port', 'Crew', 'Status'], ['Description', 'History', 'Notable voyages'], ['Hidden cargo']),
    T('Things', 'Document', 'Letters, treaties, prophecies and journals.', ['Author', 'Date', 'Location'], ['Full text', 'Context'], ['Forgeries']),
    T('History', 'Historical Event', 'Something that happened and changed things.', ['Date', 'Location', 'Involved'], ['Background', 'What happened', 'Aftermath'], ['The real story']),
    T('History', 'Conflict', 'Wars, battles and feuds.', ['Sides', 'Leaders', 'Dates', 'Result'], ['Causes', 'Battles', 'Outcome'], []),
    T('Campaign & Novel', 'Session Notes', 'A recap of one game session.', ['Session #', 'Date', 'Players present'], ['Recap', 'Loot', 'NPCs met', 'Next time'], ['Prep notes']),
    T('Campaign & Novel', 'Chapter', 'A chapter of the novel, linked to the lore it uses.', ['Book', 'Chapter #', 'POV character'], ['Prose'], ['Draft notes']),
    T('General', 'Generic Article', 'Anything that does not fit elsewhere.', [], ['Overview'], [])
  ];
  var CATEGORY_LABEL = { 'People': 'People', 'Places': 'Geography', 'Groups': 'Organizations', 'Lore & Magic': 'Lore & Magic', 'Things': 'Items', 'History': 'History', 'Campaign & Novel': 'Campaign & Novel', 'General': 'General', 'Your templates': 'Your templates', 'Faith': 'Faith', 'Trash': 'Trash (delete these)' };
  var CATEGORY_HINT = { 'Places': 'Realms, regions, towns and castles', 'Groups': 'Houses, clans, armies and cults', 'Faith': 'The gods and what lies below', 'Lore & Magic': 'Magic, cultures and languages', 'People': 'Everyone worth knowing', 'Things': 'Coin, steel and relics', 'History': 'Wars and turning points', 'Campaign & Novel': 'Sessions and chapters', 'General': 'Everything else', 'Your templates': 'Your own kinds of article', 'Trash': 'Marked for deletion' };
  var CAT_ORDER = ['Places', 'Groups', 'Faith', 'Lore & Magic', 'People', 'Things', 'History', 'Campaign & Novel', 'Your templates', 'General', 'Trash'];

  var ABILITIES = [['str', 'Strength'], ['dex', 'Dexterity'], ['con', 'Constitution'], ['int', 'Intelligence'], ['wis', 'Wisdom'], ['cha', 'Charisma']];
  var SKILLS = [['Acrobatics', 'dex'], ['Animal Handling', 'wis'], ['Arcana', 'int'], ['Athletics', 'str'], ['Deception', 'cha'], ['History', 'int'], ['Insight', 'wis'], ['Intimidation', 'cha'], ['Investigation', 'int'], ['Medicine', 'wis'], ['Nature', 'int'], ['Perception', 'wis'], ['Performance', 'cha'], ['Persuasion', 'cha'], ['Religion', 'int'], ['Sleight of Hand', 'dex'], ['Stealth', 'dex'], ['Survival', 'wis']];
  var SPELL_SOURCES = ['Class', 'Universal', 'Tome'];

  /* ================= State ================= */
  var cfg = window.AVARENTH_CONFIG || {};
  var sb = null;
  var session = null;
  var profile = null;
  var loaded = { wiki: false, chars: false, members: false };
  var articles = [];
  var secrets = {};
  var customTemplates = [];
  var look = clone(DEFAULT_LOOK);
  var characters = [];
  var members = [];
  var campaigns = [];
  var memberships = [];
  var pins = {};
  var crimes = [];
  var maps = [];
  var markers = {};   // map id -> markers
  var mapUrls = {};   // image path -> { url, until }
  var travel = {};    // campaign id -> journey state
  var travelLog = [];
  var grids = {};     // map id -> decoded terrain grid (or false if none)
  var routeCache = {};
  var spells = null;  // the spell tome list, loaded when first opened
  var preview = readLocal('avarenth-preview') === 'player' ? 'player' : 'dm';
  var ui = { filters: {}, spellFilter: { q: '', rarity: '', level: '', cls: '', school: '', src: '' }, homeQuery: '', pendingDelete: null, sheetEdit: false, sheetTab: 'Actions', authMode: 'signin', selectedTemplate: 'Organization', newChar: false };
  var saveTimers = {};

  var $view = document.getElementById('view');
  var $barRight = document.getElementById('bar-right');
  var $tabs = document.getElementById('tabs');
  var $toast = document.getElementById('toast');

  /* ================= Helpers ================= */
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function readLocal(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function writeLocal(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function uid() { return session && session.user ? session.user.id : null; }
  function isDM() { return !!profile && profile.role === 'dm'; }
  function isMember() { return !!profile && (profile.role === 'dm' || profile.role === 'player'); }
  function dmView() { return isDM() && preview === 'dm'; }
  function num(v, d) { var n = parseInt(v, 10); return isNaN(n) ? d : n; }
  function uniq(arr) { var out = []; arr.forEach(function (x) { if (x && out.indexOf(x) < 0) out.push(x); }); return out; }
  function slugify(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'article'; }
  function signed(n) { return (n >= 0 ? '+' : '−') + Math.abs(n); }
  function toast(msg) {
    $toast.textContent = msg;
    $toast.hidden = false;
    clearTimeout(toast.t);
    toast.t = setTimeout(function () { $toast.hidden = true; }, 2200);
  }
  function fail(err, fallback) {
    console.error(err);
    toast(fallback || 'Something went wrong. Check your connection and try again.');
  }
  function go(hash) {
    if (location.hash === hash) render(); else location.hash = hash;
  }
  var SEARCH_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-3.5-3.5"></path></svg>';
  var USER_ICON = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"></path></svg>';

  function allTemplates() {
    var builtIn = {}; TEMPLATES.forEach(function (t) { builtIn[t.name] = true; });
    return TEMPLATES.concat(customTemplates.filter(function (t) { return !builtIn[t.name]; }).map(function (t) { return Object.assign({}, t, { group: 'Your templates', custom: true }); }));
  }
  function findTemplate(name) {
    var all = allTemplates();
    for (var i = 0; i < all.length; i++) if (all[i].name === name) return all[i];
    return TEMPLATES[TEMPLATES.length - 1];
  }
  function visibleArticles() { return articles.filter(function (a) { return dmView() || !a.hidden; }); }
  function campaignById(id) { for (var i = 0; i < campaigns.length; i++) if (campaigns[i].id === id) return campaigns[i]; return null; }
  function campaignBySlug(slug) { for (var i = 0; i < campaigns.length; i++) if (campaigns[i].slug === slug) return campaigns[i]; return null; }
  // Campaigns this person may file things under: all for the DM, only joined ones for players.
  function myCampaigns() {
    if (isDM()) return campaigns;
    return campaigns.filter(function (c) { return memberships.some(function (m) { return m.campaign_id === c.id && m.user_id === uid(); }); });
  }
  function campaignOptions(selected, allowNone, noneLabel) {
    var html = allowNone ? '<option value="">' + esc(noneLabel || 'World lore (every player)') + '</option>' : '';
    myCampaigns().forEach(function (c) { html += '<option value="' + esc(c.id) + '"' + (c.id === selected ? ' selected' : '') + '>' + esc(c.name) + (c.status === 'finished' ? ' (finished)' : '') + '</option>'; });
    return html;
  }
  function articleBySlug(slug) { for (var i = 0; i < articles.length; i++) if (articles[i].slug === slug) return articles[i]; return null; }
  function articleByTitle(title) {
    var t = String(title).trim().toLowerCase();
    var list = visibleArticles();
    for (var i = 0; i < list.length; i++) if (String(list[i].title || '').toLowerCase() === t) return list[i];
    return null;
  }
  function unescapeName(s) { return s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>'); }

  /* Text with [[Links]] and paragraphs. Input is escaped first. */
  function rich(text) {
    var links = function (html) {
      return html.replace(/\[\[([^\]]+)\]\]/g, function (_, name) {
        var target = articleByTitle(unescapeName(name));
        if (target) return '<a class="link" href="#/a/' + encodeURIComponent(target.slug) + '">' + name + '</a>';
        return '<span class="missing">' + name + '</span>';
      });
    };
    return String(text || '').split(/\n\s*\n/).map(function (p) {
      // A block where every line has a | is a table; the first line is the header.
      var lines = p.trim().split('\n').map(function (l) { return l.trim(); }).filter(function (l) { return l && !/^[\s|:-]+$/.test(l); });
      if (lines.length >= 2 && lines.every(function (l) { return l.indexOf('|') >= 0; })) {
        var cells = function (l) { return l.replace(/^\||\|$/g, '').split('|').map(function (c) { return links(esc(c.trim())); }); };
        return '<div class="wiki-table-wrap"><table class="wiki-table"><thead><tr>' + cells(lines[0]).map(function (c) { return '<th scope="col">' + c + '</th>'; }).join('') + '</tr></thead><tbody>' +
          lines.slice(1).map(function (l) { return '<tr>' + cells(l).map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
      }
      // Lines starting with "- " are a bulleted list; anything around them stays a paragraph.
      var out = '', para = [], items = [];
      var flushP = function () { if (para.length) out += '<p>' + links(esc(para.join('\n')).replace(/\n/g, '<br>')) + '</p>'; para = []; };
      var flushL = function () { if (items.length) out += '<ul class="wiki-list">' + items.map(function (i) { return '<li>' + links(esc(i)) + '</li>'; }).join('') + '</ul>'; items = []; };
      p.trim().split('\n').forEach(function (l) {
        var m = /^\s*[-•*]\s+(.*)$/.exec(l);
        if (m) { flushP(); items.push(m[1]); } else { flushL(); para.push(l.trim()); }
      });
      flushP(); flushL();
      return out;
    }).join('');
  }
  function inline(t) { return rich(t).replace(/^<p>/, '').replace(/<\/p>$/, '').replace(/<\/p><p>/g, '<br>'); }

  /* ================= Theme ================= */
  function luminance(hex) {
    var m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
    if (!m) return 0;
    var n = parseInt(m[1], 16);
    var c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  // The accent as used for words: if it is too dark (or light) to read on the background, mix it toward the text colour until it is.
  function hexMix(a, b, t) {
    var x = parseInt(a.slice(1), 16), y = parseInt(b.slice(1), 16);
    var c = [16, 8, 0].map(function (sh) { var u = (x >> sh) & 255, v = (y >> sh) & 255; return Math.round(u + (v - u) * t); });
    return '#' + c.map(function (v) { return ('0' + v.toString(16)).slice(-2); }).join('');
  }
  function contrast(a, b) { var la = luminance(a) + 0.05, lb = luminance(b) + 0.05; return la > lb ? la / lb : lb / la; }
  function readableInk(accent, text, bg) {
    for (var t = 0; t <= 1.0001; t += 0.05) { var c = hexMix(accent, text, t); if (contrast(c, bg) >= 4.5) return c; }
    return text;
  }
  function palette() {
    return (look.preset === 'Custom' && look.custom) ? look.custom : (PRESETS[look.preset] || PRESETS['Dark ink']);
  }
  function normalizeLook(s) {
    s = s || {};
    var hex = /^#[0-9a-f]{6}$/i;
    var c = s.custom;
    return {
      preset: (PRESETS[s.preset] || s.preset === 'Custom') ? s.preset : 'Dark ink',
      custom: c && hex.test(c.bg) && hex.test(c.panel) && hex.test(c.text) && hex.test(c.accent) ? { bg: c.bg, panel: c.panel, text: c.text, accent: c.accent } : null,
      font: FONTS[s.font] ? s.font : 'Cinzel',
      corners: s.corners === 'Rounded' ? 'Rounded' : 'Sharp'
    };
  }
  function applyTheme() {
    var p = palette();
    var root = document.documentElement.style;
    var dark = luminance(p.bg) < 0.25;
    root.setProperty('--bg', p.bg);
    root.setProperty('--panel', p.panel);
    root.setProperty('--text', p.text);
    root.setProperty('--accent', p.accent);
    root.setProperty('--on-accent', luminance(p.accent) > 0.32 ? '#15120C' : '#FFFFFF');
    root.setProperty('--accent-ink', readableInk(p.accent, p.text, p.bg));
    root.setProperty('--secret', dark ? '#E08A7D' : '#9A3B2E');
    root.setProperty('--good', dark ? '#8FC28A' : '#3E7A39');
    root.setProperty('--mana', dark ? '#6FA3E0' : '#2C5F9E');
    root.setProperty('--display', FONTS[look.font] || FONTS['Cinzel']);
    root.setProperty('--radius', look.corners === 'Rounded' ? '12px' : '3px');
    root.setProperty('color-scheme', dark ? 'dark' : 'light');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', p.bg);
    writeLocal('avarenth-look', JSON.stringify(look));
  }
  function saveLookSoon() {
    clearTimeout(saveTimers.look);
    saveTimers.look = setTimeout(function () {
      sb.from('settings').upsert({ id: 1, look: look }).then(function (r) { if (r.error) fail(r.error, 'Could not save the look. Try again in a moment.'); });
    }, 500);
  }

  /* ================= Data ================= */
  function loadProfile() {
    return sb.from('profiles').select('id, display_name, role').eq('id', uid()).maybeSingle().then(function (r) {
      if (r.error) throw r.error;
      profile = r.data;
    });
  }
  function loadWiki() {
    var jobs = [
      sb.from('articles').select('id, slug, title, template, summary, fields, sections, hidden, campaign_id, updated_at').order('updated_at', { ascending: false }),
      sb.from('templates').select('id, name, blurb, sidebar, sections, dm').order('name'),
      sb.from('settings').select('look').eq('id', 1).maybeSingle(),
      sb.from('campaigns').select('id, slug, name, summary, status, created_at').order('created_at'),
      sb.from('campaign_members').select('campaign_id, user_id')
    ];
    if (isDM()) {
      jobs.push(sb.from('article_secrets').select('article_id, dm, dm_notes'));
      jobs.push(sb.from('campaign_pins').select('campaign_id, pin'));
    }
    return Promise.all(jobs).then(function (res) {
      res.forEach(function (r) { if (r.error) throw r.error; });
      campaigns = res[3].data || [];
      memberships = res[4].data || [];
      pins = {};
      if (res[6]) (res[6].data || []).forEach(function (p) { pins[p.campaign_id] = p.pin; });
      res.splice(3, 2);
      articles = res[0].data || [];
      customTemplates = (res[1].data || []).map(function (t) {
        return { id: t.id, name: String(t.name), blurb: String(t.blurb || ''), sidebar: (t.sidebar || []).map(String), sections: (t.sections || []).map(String), dm: (t.dm || []).map(String) };
      });
      if (res[2].data && res[2].data.look) { look = normalizeLook(res[2].data.look); applyTheme(); }
      secrets = {};
      if (res[3]) (res[3].data || []).forEach(function (s) { secrets[s.article_id] = s; });
      loaded.wiki = true;
    });
  }
  var customSubs = [];
  function loadCustomSubs() {
    return sb.from('custom_subclasses').select('id, class, name, about, patrons, features').order('name').then(function (r) {
      if (r.error) throw r.error;
      customSubs = r.data || [];
    });
  }
  function loadCharacters() {
    return sb.from('characters').select('id, owner_id, name, sheet, ddb_url, campaign_id, updated_at').order('name').then(function (r) {
      if (r.error) throw r.error;
      characters = r.data || [];
      loaded.chars = true;
    });
  }
  function loadCrimes() {
    return sb.from('crimes').select('id, campaign_id, character_id, kind, title, location, severity, status, bounty, quantity, notes, dm_only, created_at').order('created_at').then(function (r) {
      if (r.error) throw r.error;
      crimes = r.data || [];
    });
  }
  function loadMaps() {
    return sb.from('maps').select('id, campaign_id, name, image_path, width, height, visible_to_players, show_markers, miles_across, created_at').order('created_at').then(function (r) {
      if (r.error) throw r.error;
      maps = r.data || [];
      loaded.maps = true;
      // Re-read terrain grids on the next view, in case Claude has added or updated one.
      grids = {}; routeCache = {};
    });
  }
  function loadMarkers(mapId) {
    return sb.from('map_markers').select('id, map_id, kind, character_id, label, x, y, article_slug, target_map_id, toll, info').eq('map_id', mapId).then(function (r) {
      if (r.error) throw r.error;
      markers[mapId] = r.data || [];
    });
  }
  function loadTravel() {
    return Promise.all([
      sb.from('travel_state').select('campaign_id, day, map_id, dest_x, dest_y, dest_label, mode, pace, terrain, rules, food, party_size, food_per_person, weather, arrival'),
      sb.from('travel_log').select('id, campaign_id, day, text, miles, map_id, from_x, from_y, to_x, to_y, food_used, paid, created_at').order('created_at', { ascending: false }).limit(500)
    ]).then(function (res) {
      res.forEach(function (r) { if (r.error) throw r.error; });
      travel = {};
      (res[0].data || []).forEach(function (t) { travel[t.campaign_id] = t; });
      travelLog = res[1].data || [];
    });
  }
  function loadAll() { return Promise.all([loadWiki(), loadCharacters(), loadMembers(), loadCrimes(), loadMaps(), loadTravel(), loadReputation(), loadHoldings(), loadShops(), loadCustomSubs(), isDM() ? loadSpells() : null]); }
  function loadMembers() {
    if (!isDM()) return Promise.resolve();
    return sb.from('profiles').select('id, display_name, role, created_at').order('created_at').then(function (r) {
      if (r.error) throw r.error;
      members = r.data || [];
      loaded.members = true;
    });
  }
  function memberName(id) {
    if (id === uid()) return 'You';
    for (var i = 0; i < members.length; i++) if (members[i].id === id) return members[i].display_name || 'Player';
    return 'Player';
  }

  /* ================= Routing ================= */
  function parseRoute() {
    var h = (location.hash || '').replace(/^#\/?/, '');
    var parts = h.split('/').map(function (p) { try { return decodeURIComponent(p); } catch (e) { return p; } });
    return { name: parts[0] || 'wiki', arg: parts[1] || '' };
  }

  function renderChrome() {
    var r = parseRoute();
    if (!session || !isMember()) {
      $barRight.innerHTML = session ? '<button type="button" class="btn small" data-act="signout">Sign out</button>' : '';
      $tabs.hidden = true;
      return;
    }
    var right = '';
    if (isDM()) {
      right += '<div class="seg" role="group" aria-label="Preview as"><button type="button" data-act="preview" data-mode="dm" aria-pressed="' + (preview === 'dm') + '">DM</button><button type="button" data-act="preview" data-mode="player" aria-pressed="' + (preview === 'player') + '">Player</button></div>';
    }
    right += '<a class="icon-btn" href="#/account" aria-label="Account">' + USER_ICON + '</a>';
    $barRight.innerHTML = right;
    var section = ({ wiki: 'wiki', a: 'wiki', 'new': 'wiki', edit: 'wiki', builder: 'wiki', customize: 'wiki', campaign: 'wiki', 'campaign-edit': 'wiki', join: 'wiki', crimes: 'wiki', travel: 'wiki', map: 'wiki', reputation: 'wiki', holdings: 'wiki', subclasses: 'characters', shops: 'wiki', shop: 'wiki', 'shop-edit': 'wiki', 'map-edit': 'wiki', characters: 'characters', c: 'characters', build: 'characters', 'level-up': 'characters', spells: 'spells', 'spell-new': 'spells', 'spell-edit': 'spells', members: 'members' })[r.name] || '';
    var waiting = isDM() && spells ? pendingSpells().length : 0;
    var tabs = [['wiki', 'Wiki'], ['characters', 'Characters'], ['spells', 'Spells' + (waiting ? ' <span class="badge">' + waiting + '</span>' : '')]];
    if (isDM()) tabs.push(['members', 'Players']);
    $tabs.innerHTML = tabs.map(function (t) { return '<a href="#/' + t[0] + '"' + (section === t[0] ? ' aria-current="page"' : '') + '>' + t[1] + '</a>'; }).join('');
    $tabs.hidden = false;
  }

  function render() {
    renderChrome();
    if (!sb) return renderNoLibrary();
    if (!session) return renderAuth();
    if (!profile) return renderMessage('Setting up your account…', 'This only takes a moment. If it sticks, refresh the page.');
    if (!isMember()) return renderPending();
    var r = parseRoute();
    if (r.name !== 'shop') ui.freshened = null;
    if (r.name !== 'shops') ui.marketTicked = null;
    var dmOnly = ['new', 'edit', 'builder', 'customize', 'members', 'campaign-edit', 'map-edit', 'reputation', 'shops', 'shop', 'shop-edit', 'subclasses'];
    if (dmOnly.indexOf(r.name) >= 0 && !dmView()) {
      if (!(r.name === 'members' && isDM())) { location.replace('#/wiki'); return; }
    }
    switch (r.name) {
      case 'a': return renderArticle(r.arg);
      case 'new': return renderNew(r.arg);
      case 'edit': return renderEdit(r.arg);
      case 'builder': return renderBuilder();
      case 'customize': return renderCustomize();
      case 'characters': return renderCharacters();
      case 'c': return renderSheet(r.arg);
      case 'build': return renderBuild();
      case 'level-up': return renderLevelUp(r.arg);
      case 'members': return renderMembers();
      case 'account': return renderAccount();
      case 'crimes': return renderCrimes(r.arg);
      case 'travel': return renderTravel(r.arg);
      case 'map': return renderMap(r.arg);
      case 'map-edit': return renderMapEdit(r.arg);
      case 'campaign': return renderCampaign(r.arg);
      case 'campaign-edit': return renderCampaignEdit(r.arg);
      case 'join': return renderJoin();
      case 'spells': return renderSpells();
      case 'reputation': return renderReputation(r.arg);
      case 'holdings': return renderHoldings(r.arg);
      case 'subclasses': return renderSubclasses(r.arg);
      case 'shops': return renderShops(r.arg);
      case 'shop': return renderShop(r.arg);
      case 'shop-edit': return renderShopEdit(r.arg);
      case 'spell-new': return renderSpellForm('');
      case 'spell-edit': return renderSpellForm(r.arg);
      default: return renderHome();
    }
  }

  /* ================= Auth & account ================= */
  function renderNoLibrary() {
    $view.innerHTML = '<div class="page narrow"><div class="empty">The app couldn’t load its connection library. Check that you’re online, then refresh.</div></div>';
  }
  function renderMessage(title, body) {
    $view.innerHTML = '<div class="auth"><h1>AVARENTH</h1><p class="eyebrow sub">' + esc(title) + '</p><div class="empty">' + esc(body) + '</div></div>';
  }
  function renderAuth() {
    var signup = ui.authMode === 'signup';
    $view.innerHTML = '<div class="auth">' +
      '<h1>AVARENTH</h1><p class="eyebrow sub">The World</p>' +
      '<div class="seg" role="group" aria-label="Account" style="align-self:center"><button type="button" data-act="authmode" data-mode="signin" aria-pressed="' + !signup + '">Sign in</button><button type="button" data-act="authmode" data-mode="signup" aria-pressed="' + signup + '">Create account</button></div>' +
      '<form class="form" id="auth-form" novalidate>' +
      (signup ? '<div class="field"><label for="a-name">Your name</label><input type="text" id="a-name" autocomplete="nickname" placeholder="What the table calls you"></div>' : '') +
      '<div class="field"><label for="a-email">Email</label><input type="email" id="a-email" autocomplete="email" required></div>' +
      '<div class="field"><label for="a-pass">Password</label><input type="password" id="a-pass" autocomplete="' + (signup ? 'new-password' : 'current-password') + '" required minlength="6">' + (signup ? '<span class="hint">At least 6 characters.</span>' : '') + '</div>' +
      '<p class="err" id="auth-err" role="alert" hidden></p>' +
      '<button type="submit" class="btn primary">' + (signup ? 'Create account' : 'Sign in') + '</button>' +
      (signup ? '<p class="note">New accounts wait for the DM’s approval before they can see the wiki.</p>' : '') +
      '</form></div>';
  }
  function submitAuth() {
    var email = document.getElementById('a-email').value.trim();
    var pass = document.getElementById('a-pass').value;
    var $err = document.getElementById('auth-err');
    var show = function (m) { $err.textContent = m; $err.hidden = false; };
    if (!email || !pass) return show('Enter your email and password.');
    if (ui.authMode === 'signup') {
      if (pass.length < 6) return show('Use at least 6 characters for the password.');
      var name = (document.getElementById('a-name').value || '').trim();
      sb.auth.signUp({ email: email, password: pass, options: { data: { display_name: name }, emailRedirectTo: location.origin + location.pathname } }).then(function (r) {
        if (r.error) return show(r.error.message);
        if (!r.data.session) {
          ui.authMode = 'signin';
          renderAuth();
          toast('Check your email to confirm your account, then sign in.');
        }
      });
    } else {
      sb.auth.signInWithPassword({ email: email, password: pass }).then(function (r) {
        if (r.error) show(r.error.message === 'Invalid login credentials' ? 'That email and password don’t match an account.' : r.error.message);
      });
    }
  }
  function renderPending() {
    $view.innerHTML = '<div class="auth"><h1>AVARENTH</h1><p class="eyebrow sub">Almost there</p>' +
      '<div class="empty">Your account is set up as <b>' + esc(profile.display_name || 'a new player') + '</b>. The DM needs to approve you before the wiki opens up. Once they do, tap Check again.</div>' +
      '<div class="actions" style="justify-content:center"><button type="button" class="btn primary" data-act="recheck">Check again</button><button type="button" class="btn" data-act="signout">Sign out</button></div></div>';
  }
  function renderAccount() {
    $view.innerHTML = '<div class="page narrow"><div><p class="eyebrow">Account</p><h1 class="page-title">' + esc(profile.display_name || 'Your account') + '</h1>' +
      '<p class="note" style="margin:6px 0 0">' + esc(session.user.email || '') + ' · ' + (isDM() ? 'Dungeon Master' : 'Player') + '</p></div>' +
      '<form class="form" id="account-form" novalidate><div class="field"><label for="acc-name">Display name</label><input type="text" id="acc-name" value="' + esc(profile.display_name) + '" maxlength="60"></div>' +
      '<div class="actions"><button type="submit" class="btn primary">Save name</button><button type="button" class="btn" data-act="signout">Sign out</button></div></form></div>';
  }

  /* ================= Wiki: home ================= */
  function articleRow(a, showCampaign) {
    var camp = showCampaign && a.campaign_id ? campaignById(a.campaign_id) : null;
    return '<a class="row" href="#/a/' + encodeURIComponent(a.slug) + '"><span class="row-main"><b>' + esc(a.title || 'Untitled') + '</b><span>' + esc(a.template) + (showCampaign ? ' · ' + esc(camp ? camp.name : 'World') : '') + '</span></span>' +
      statusTag(a) + (a.hidden && dmView() ? '<span class="tag">Hidden</span>' : '') + '</a>';
  }
  // A Status field (Destroyed, Fallen, Disbanded, Dead…) shows as a tag so lost things stand apart.
  function statusTag(a) {
    var st = String(((a.fields || {}).Status) || '').replace(/\[\[|\]\]/g, '').trim();
    return st ? '<span class="tag plain">' + esc(st.slice(0, 24)) + '</span>' : '';
  }

  // Browse one scope (the world, or one campaign) by drilling down: category, then type, then folders.
  var TYPE_PLURAL = { 'Character': 'Characters', 'Species': 'Species', 'Culture': 'Cultures', 'Rank / Title': 'Ranks & titles', 'Settlement': 'Settlements', 'Location': 'Locations', 'District': 'Districts', 'Region': 'Regions', 'Country': 'Countries', 'Organization': 'Organizations', 'Religion': 'Religions', 'Spell': 'Spells', 'Magic System': 'Magic systems', 'Myth / Legend': 'Myths & legends', 'Tradition': 'Traditions', 'Language': 'Languages', 'Item': 'Items', 'Ship': 'Ships', 'Document': 'Documents', 'Historical Event': 'Historical events', 'Conflict': 'Conflicts', 'Session Notes': 'Session notes', 'Chapter': 'Chapters', 'Generic Article': 'Articles' };
  // What a long list gets sorted into: characters by faction, organizations by type, places by region.
  function folderOf(a) {
    var f = a.fields || {}, t = a.template;
    var v = t === 'Character' ? f.Faction : t === 'Organization' ? orgKind(f.Type) : t === 'Settlement' ? f.Region : t === 'Region' ? f.Type : t === 'Location' ? (f.Region || f.Settlement) : t === 'Item' ? f.Type : '';
    return String(v || '').replace(/\[\[|\]\]/g, '').split(/[,(;]/)[0].trim();
  }
  // Organizations sort by what they are, not by every wording of their Type field.
  function orgKind(type) {
    var t = String(type || '').toLowerCase();
    if (!t) return '';
    if (/clan/.test(t)) return 'Clans';
    if (/house|court|royal house/.test(t) && !/guard/.test(t)) return 'Houses & courts';
    if (/army|navy|guard|levy|garrison|watch/.test(t)) return 'Armies & guards';
    if (/cult|criminal|ring|faction|conspir/.test(t)) return 'Cults & conspiracies';
    if (/order|paladin|monaster|church/.test(t)) return 'Orders';
    if (/tribe|city-state|kingdom|people|empire/.test(t)) return 'Peoples & realms';
    if (/guild|company|merc/.test(t)) return 'Guilds & companies';
    return 'Other';
  }
  // Articles with a Faith field ("Akorianism · The Hollow Court") live together under Faith, split by the part after the dot.
  function faithOf(a) { var v = String(((a.fields || {}).Faith) || '').replace(/\[\[|\]\]/g, '').trim(); if (!v) return ''; var i = v.indexOf('·'); return i >= 0 ? v.slice(i + 1).trim() : v; }
  // Anything marked for deletion (a Trash field, or "(delete me)" in the title) is gathered in a DM-only Trash category.
  function isTrash(a) { return !!((a.fields || {}).Trash) || /\(delete me\)/i.test(String(a.title || '')); }
  function groupOf(a) { return isTrash(a) ? 'Trash' : faithOf(a) ? 'Faith' : findTemplate(a.template).group; }
  function typeOf(a) { return faithOf(a) || a.template; }
  // Within a faith, demons and divine beings sort by kind: "Demon lord (Fallen)" goes under Fallen.
  function faithFolder(a) { var sp = String(((a.fields || {}).Species) || ((a.fields || {}).Type) || ''); var m = sp.match(/\(([^)]+)\)/); return m ? m[1].trim() : (a.template === 'Character' ? '' : 'About the faith'); }
  var FOLD_KEEP = ['About the faith', 'Firstborn', 'Fallen', 'Made'];
  function articleFolders(list, scope) {
    var sorted = list.slice().sort(function (x, y) { return String(x.title).localeCompare(String(y.title)); });
    var keys = {};
    sorted.forEach(function (a) { var k = (faithOf(a) ? faithFolder(a) : folderOf(a)) || 'Other'; (keys[k] = keys[k] || []).push(a); });
    var names = Object.keys(keys);
    if (names.length > 4) {
      names.forEach(function (k) { if (k !== 'Other' && keys[k].length === 1 && FOLD_KEEP.indexOf(k) < 0) { (keys.Other = keys.Other || []).push(keys[k][0]); delete keys[k]; } });
      if (keys.Other) keys.Other.sort(function (x, y) { return String(x.title).localeCompare(String(y.title)); });
      names = Object.keys(keys);
    }
    if (sorted.length <= 8 || names.length < 2) return '<div class="list">' + sorted.map(function (a) { return articleRow(a, false); }).join('') + '</div>';
    var FIRST = ['About the faith', 'Firstborn', 'Fallen', 'Made'];
    names.sort(function (x, y) { var fx = FIRST.indexOf(x), fy = FIRST.indexOf(y); if (fx >= 0 || fy >= 0) return (fx < 0 ? 99 : fx) - (fy < 0 ? 99 : fy); return (x === 'Other') - (y === 'Other') || keys[y].length - keys[x].length || x.localeCompare(y); });
    ui.openFolders = ui.openFolders || {};
    return names.map(function (k) {
      var id = scope + '|' + k;
      return '<details class="folder" data-folder="' + esc(id) + '"' + (ui.openFolders[id] ? ' open' : '') + '><summary><b>' + esc(k) + '</b><span>' + keys[k].length + '</span></summary><div class="list">' +
        keys[k].map(function (a) { return articleRow(a, false); }).join('') + '</div></details>';
    }).join('');
  }
  // After drilling in or out of a category, keep the browser's heading on screen.
  function keepBrowserInView(scope) {
    var sec = document.querySelector('[data-browser="' + String(scope).replace(/"/g, '') + '"]');
    if (sec && sec.getBoundingClientRect().top < 0) sec.scrollIntoView({ block: 'start' });
  }
  function articleBrowser(list, scope, emptyText, title) {
    title = title || 'Categories';
    ui.filters = ui.filters || {}; ui.subs = ui.subs || {};
    if (!dmView()) list = list.filter(function (a) { return !isTrash(a); });
    var groups = {};
    list.forEach(function (a) { var g = groupOf(a); groups[g] = (groups[g] || 0) + 1; });
    var cats = CAT_ORDER.filter(function (g) { return groups[g]; });
    if (!cats.length) return '<section class="block"><h2 class="sec-title">' + esc(title) + '</h2><div class="empty">' + esc(emptyText) + '</div></section>';
    var group = ui.filters[scope] && groups[ui.filters[scope]] ? ui.filters[scope] : (cats.length === 1 ? cats[0] : null);
    if (!group) {
      return '<section class="block" data-browser="' + esc(scope) + '"><h2 class="sec-title">' + esc(title) + '<small>' + list.length + ' articles</small></h2><div class="cats">' + cats.map(function (g) {
        return '<button type="button" class="cat" data-act="filter" data-scope="' + esc(scope) + '" data-group="' + esc(g) + '" aria-pressed="false"><b>' + esc(CATEGORY_LABEL[g] || g) + '</b>' + (CATEGORY_HINT[g] ? '<i>' + esc(CATEGORY_HINT[g]) + '</i>' : '') + '<span>' + groups[g] + (groups[g] === 1 ? ' article' : ' articles') + '</span></button>';
      }).join('') + '</div></section>';
    }
    var inGroup = list.filter(function (a) { return groupOf(a) === group; });
    var types = {};
    inGroup.forEach(function (a) { var t = typeOf(a); types[t] = (types[t] || 0) + 1; });
    var TYPE_ORDER = ['The Gods', 'Country', 'District', 'Region', 'Settlement', 'Location', 'Organization', 'Religion', 'Character', 'Species', 'Culture', 'Language'];
    var typeNames = Object.keys(types).sort(function (x, y) { var ox = TYPE_ORDER.indexOf(x), oy = TYPE_ORDER.indexOf(y); if (ox >= 0 || oy >= 0) return (ox < 0 ? 99 : ox) - (oy < 0 ? 99 : oy); return types[y] - types[x] || x.localeCompare(y); });
    var type = ui.subs[scope] && types[ui.subs[scope]] ? ui.subs[scope] : (typeNames.length === 1 ? typeNames[0] : null);
    var back = cats.length > 1 ? '<button type="button" class="btn small quiet" data-act="filter" data-scope="' + esc(scope) + '" data-group="">← All categories</button>' : '';
    var html = '<section class="block" data-browser="' + esc(scope) + '"><h2 class="sec-title">' + esc(title) + '<small>' + back + '</small></h2>';
    html += '<p class="crumbs browse-crumbs">' + esc(CATEGORY_LABEL[group] || group) + (type && typeNames.length > 1 ? ' › ' + esc(TYPE_PLURAL[type] || type) : '') + '</p>';
    if (!type) {
      html += '<div class="cats">' + typeNames.map(function (t) {
        return '<button type="button" class="cat" data-act="subfilter" data-scope="' + esc(scope) + '" data-type="' + esc(t) + '"><b>' + esc(TYPE_PLURAL[t] || t) + '</b><span>' + types[t] + (types[t] === 1 ? ' article' : ' articles') + '</span></button>';
      }).join('') + '</div>';
    } else {
      if (typeNames.length > 1) html += '<div class="actions"><button type="button" class="btn small quiet" data-act="subfilter" data-scope="' + esc(scope) + '" data-type="">← All ' + esc((CATEGORY_LABEL[group] || group).toLowerCase()) + '</button></div>';
      html += articleFolders(inGroup.filter(function (a) { return typeOf(a) === type; }), scope + '|' + type);
    }
    return html + '</section>';
  }

  function renderHome() {
    if (!loaded.wiki) { $view.innerHTML = '<div class="page"><div class="empty">Opening the archive…</div></div>'; return; }
    var all = visibleArticles();
    var q = ui.homeQuery.trim().toLowerCase();
    var html = '<section class="hero"><div class="hero-in"><p class="eyebrow">The World</p><h1>Avarenth</h1>' +
      (isDM() ? '<p class="crumbs">' + (dmView() ? 'DM view: everything, secrets included' : 'Player preview: what your table sees') + '</p>' : '') +
      '</div></section><div class="page">';
    if (dmView()) {
      html += '<div class="actions"><button type="button" class="btn primary" data-act="new-article" data-campaign="">+ World article</button><a class="btn" href="#/campaign-edit">+ New campaign</a><a class="btn" href="#/customize">Customize</a></div>';
    }
    // The world page only ever shows world lore; campaign articles live on their campaign's page.
    var world = all.filter(function (a) { return !a.campaign_id; });
    html += '<label class="search"><span class="sr">Search world lore</span>' + SEARCH_ICON +
      '<input id="home-search" type="search" placeholder="Search world lore…" value="' + esc(ui.homeQuery) + '" autocomplete="off"></label>';

    if (q) {
      var hits = world.filter(function (a) { return String(a.title || '').toLowerCase().indexOf(q) >= 0; });
      html += '<section class="block"><h2 class="sec-title">Search results<small>' + hits.length + '</small></h2>' +
        (hits.length ? '<div class="list">' + hits.map(function (a) { return articleRow(a, false); }).join('') + '</div>' : '<div class="empty">No world lore matches that search.</div>') + '</section>';
    } else {
      var camps = myCampaigns().slice().sort(function (a, b) { return (a.status === 'finished') - (b.status === 'finished'); });
      html += '<section class="block"><h2 class="sec-title">Campaigns' + (!isDM() ? '<small><a class="btn small quiet" href="#/join">Join a campaign</a></small>' : '') + '</h2>';
      if (camps.length) {
        html += '<div class="cats">';
        camps.forEach(function (c) {
          html += '<a class="cat" href="#/campaign/' + encodeURIComponent(c.slug) + '" style="text-decoration:none;color:inherit"><b>' + esc(c.name) + '</b><span>' + (c.status === 'finished' ? 'Finished' : 'Open campaign') + '</span></a>';
        });
        html += '</div>';
      } else {
        html += '<div class="empty">' + (isDM() ? 'No campaigns yet. Tap “New campaign” to start one.' : 'You’re not in a campaign yet. Ask your DM for the campaign PIN, then tap “Join a campaign”.') + '</div>';
      }
      html += '</section>';
      var wmaps = mapsFor(null);
      if (wmaps.length || dmView()) {
        html += '<section class="block"><h2 class="sec-title">World maps' + (dmView() ? '<small><button type="button" class="btn small quiet" data-act="new-map" data-campaign="">+ Add map</button></small>' : '') + '</h2>' +
          (wmaps.length ? mapList(wmaps) : '<div class="empty">No world maps yet.</div>') + '</section>';
      }
      html += articleBrowser(world, 'world', dmView() ? 'No world lore yet. Tap “World article” to add some.' : 'Nothing has been revealed yet.');
    }
    html += '</div>';
    $view.innerHTML = html;
  }

  /* ================= Campaigns ================= */
  function renderCampaign(slug) {
    if (!loaded.wiki) { $view.innerHTML = '<div class="page"><div class="empty">Opening the archive…</div></div>'; return; }
    var camp = campaignBySlug(slug);
    if (!camp || !(isDM() || myCampaigns().indexOf(camp) >= 0)) {
      $view.innerHTML = '<div class="page narrow"><div class="empty">That campaign doesn’t exist, or you haven’t joined it.</div><div class="actions"><a class="btn" href="#/join">Join with a PIN</a><a class="btn" href="#/wiki">Back to the world</a></div></div>';
      return;
    }
    var list = visibleArticles().filter(function (a) { return a.campaign_id === camp.id; });
    var party = characters.filter(function (c) { return c.campaign_id === camp.id; });
    var html = '<section class="hero"><div class="hero-in"><p class="crumbs"><a href="#/wiki">Avarenth</a> › Campaign' + (camp.status === 'finished' ? ' · Finished' : '') + '</p><h1>' + esc(camp.name) + '</h1></div></section><div class="page">';
    if (camp.summary) html += '<p class="lede">' + inline(camp.summary) + '</p>';
    if (dmView()) {
      html += '<div class="actions"><button type="button" class="btn primary" data-act="new-article" data-campaign="' + esc(camp.id) + '">+ Campaign article</button><a class="btn" href="#/campaign-edit/' + encodeURIComponent(camp.slug) + '">Edit campaign</a></div>';
      html += '<div class="group-box"><h2>Join PIN</h2>' + (pins[camp.id]
        ? '<p style="margin:0;font-family:var(--ui);font-size:28px;font-weight:700;letter-spacing:0.18em">' + esc(pins[camp.id]) + '</p><p class="note" style="margin:0">Give this to players so they can join. Players never see it in the app.</p>'
        : '<p class="note" style="margin:0">No PIN yet, so players can only be added from the Players tab. Set one under “Edit campaign”.</p>') + '</div>';
    }
    if (camp.status !== 'finished' || dmView()) html += journeySummary(camp);
    // A campaign shows its own articles plus all world lore, so players can look up rules and history.
    var world = visibleArticles().filter(function (a) { return !a.campaign_id; });
    var cq = (ui.campQuery || '').trim().toLowerCase();
    html += '<label class="search"><span class="sr">Search this campaign and world lore</span>' + SEARCH_ICON +
      '<input id="camp-search" type="search" placeholder="Search this campaign and world lore…" value="' + esc(ui.campQuery || '') + '" autocomplete="off"></label>';
    var cmaps = mapsFor(camp.id);
    if (cq) {
      var hits = list.concat(world).filter(function (a) { return String(a.title || '').toLowerCase().indexOf(cq) >= 0; });
      html += '<section class="block"><h2 class="sec-title">Search results<small>' + hits.length + '</small></h2>' +
        (hits.length ? '<div class="list">' + hits.map(function (a) { return articleRow(a, true); }).join('') + '</div>' : '<div class="empty">Nothing matches that search.</div>') + '</section>';
    } else {
      html += '<section class="block"><h2 class="sec-title">' + (isDM() ? 'Party' : 'Your characters here') + '</h2>' +
        '<div class="actions tight">' + (dmView() ? '<a class="btn small" href="#/shops/' + encodeURIComponent(camp.slug) + '">Shops</a><a class="btn small" href="#/reputation/' + encodeURIComponent(camp.slug) + '">Reputation</a>' : '') + '<a class="btn small" href="#/holdings/' + encodeURIComponent(camp.slug) + '">Holdings' + (dmView() && loaded.holdings && paydayDue(camp.id) ? ' <span class="badge">Payday</span>' : '') + '</a><a class="btn small" href="#/crimes/' + encodeURIComponent(camp.slug) + '">Criminal record</a><button type="button" class="btn small" data-act="newchar-in" data-campaign="' + esc(camp.id) + '">+ New character</button></div>';
      html += party.length ? '<div class="list">' + party.map(function (c) { return charRow(c, isDM() && c.owner_id !== uid()); }).join('') + '</div>' : '<div class="empty">No characters in this campaign yet.</div>';
      html += '</section>';
      html += '<section class="block"><h2 class="sec-title">Maps' + (dmView() ? '<small><button type="button" class="btn small quiet" data-act="new-map" data-campaign="' + esc(camp.id) + '">+ Add map</button></small>' : '') + '</h2>' +
        (cmaps.length ? mapList(cmaps) : '<div class="empty">' + (dmView() ? 'No maps yet. Tap “Add map” to upload one.' : 'No maps shared yet.') + '</div>') + '</section>';
      html += articleBrowser(list, 'c-' + camp.id, dmView() ? 'No articles in this campaign yet.' : 'Nothing has been revealed in this campaign yet.', 'Lore');
      var record = crimeSummary(crimes.filter(function (c) { return c.campaign_id === camp.id && (dmView() || !c.dm_only); }));
      if (record.count || dmView()) html += '<section class="block"><h2 class="sec-title">Criminal Record<small><a class="btn small quiet" href="#/crimes/' + encodeURIComponent(camp.slug) + '">Open tracker</a></small></h2>' + summaryVitals(record) + '</section>';
      ui.openFolders = ui.openFolders || {};
      var wid = 'cw-' + camp.id;
      html += '<details class="folder world-ref" data-folder="' + esc(wid) + '"' + (ui.openFolders[wid] || ui.filters && ui.filters[wid] ? ' open' : '') + '><summary><b>World reference</b><span>' + world.length + '</span></summary>' +
        articleBrowser(world, wid, 'No world lore yet.', 'World reference') + '</details>';
    }
    html += '</div>';
    $view.innerHTML = html;
  }

  function renderCampaignEdit(slug) {
    if (!loaded.wiki) { $view.innerHTML = '<div class="page"><div class="empty">Opening the archive…</div></div>'; return; }
    var camp = slug ? campaignBySlug(slug) : null;
    if (slug && !camp) { location.replace('#/wiki'); return; }
    var c = camp || { name: '', summary: '', status: 'active' };
    $view.innerHTML = '<div class="page narrow"><form class="form" id="campaign-form" novalidate data-id="' + esc(camp ? camp.id : '') + '">' +
      '<div><p class="eyebrow">' + (camp ? 'Edit campaign' : 'New campaign') + '</p><h1 class="page-title">' + (camp ? esc(camp.name) : 'Start a campaign') + '</h1></div>' +
      '<div class="field"><label for="cp-name">Campaign name</label><input type="text" id="cp-name" maxlength="80" value="' + esc(c.name) + '" placeholder="e.g. The Dornish Isles"></div>' +
      '<div class="field"><label for="cp-summary">Summary</label><textarea id="cp-summary" style="min-height:90px" placeholder="What this campaign is about">' + esc(c.summary) + '</textarea></div>' +
      '<div class="field"><label for="cp-pin">Join PIN</label><input type="text" id="cp-pin" maxlength="12" autocomplete="off" value="' + esc(camp ? (pins[camp.id] || '') : '') + '" placeholder="4 to 12 letters or numbers"><span class="hint">Players enter this to join. Leave it empty to add players only by hand.</span></div>' +
      '<div class="field"><label for="cp-status">Status</label><select id="cp-status"><option value="active"' + (c.status === 'active' ? ' selected' : '') + '>Active</option><option value="finished"' + (c.status === 'finished' ? ' selected' : '') + '>Finished (PIN stops working)</option></select></div>' +
      '<div class="sticky-actions"><button type="submit" class="btn primary" id="cp-save">Save</button><a class="btn" href="' + (camp ? '#/campaign/' + encodeURIComponent(camp.slug) : '#/wiki') + '">Cancel</a>' +
      (camp ? '<button type="button" class="btn danger" data-act="delete-campaign" data-id="' + esc(camp.id) + '" style="margin-left:auto">' + (ui.pendingDelete === camp.id ? 'Tap again to delete' : 'Delete') + '</button>' : '') + '</div>' +
      (camp ? '<p class="note">Deleting a campaign moves its articles to world lore and leaves its characters without a campaign. Nothing else is deleted.</p>' : '') +
      '</form></div>';
  }

  function saveCampaign(form) {
    var id = form.getAttribute('data-id');
    var name = document.getElementById('cp-name').value.trim();
    var pin = document.getElementById('cp-pin').value.trim();
    if (!name) { toast('Name the campaign first.'); return document.getElementById('cp-name').focus(); }
    if (pin && !/^[A-Za-z0-9]{4,12}$/.test(pin)) return toast('Use 4 to 12 letters or numbers for the PIN.');
    var row = { name: name, summary: document.getElementById('cp-summary').value.trim(), status: document.getElementById('cp-status').value };
    var btn = document.getElementById('cp-save');
    btn.disabled = true;
    var write;
    if (id) write = sb.from('campaigns').update(row).eq('id', id).select('id, slug').single();
    else {
      var base = slugify(name), s = base, n = 2;
      while (campaignBySlug(s)) s = base + '-' + (n++);
      row.slug = s;
      write = sb.from('campaigns').insert(row).select('id, slug').single();
    }
    write.then(function (r) {
      if (r.error) throw r.error;
      var cid = r.data.id, cslug = r.data.slug;
      var pinWrite = pin ? sb.from('campaign_pins').upsert({ campaign_id: cid, pin: pin }) : sb.from('campaign_pins').delete().eq('campaign_id', cid);
      return pinWrite.then(function (r2) {
        if (r2.error) throw r2.error;
        if (!id) return sb.from('campaign_members').insert({ campaign_id: cid, user_id: uid() }).then(function () { return cslug; });
        return cslug;
      });
    }).then(function (cslug) {
      return loadWiki().then(function () { toast('Saved'); go('#/campaign/' + encodeURIComponent(cslug)); });
    }).catch(function (e) { btn.disabled = false; fail(e, 'Could not save the campaign.'); });
  }

  function renderJoin() {
    var mine = myCampaigns();
    $view.innerHTML = '<div class="page narrow"><div><p class="eyebrow">Campaigns</p><h1 class="page-title">Join a campaign</h1><p class="note" style="margin:6px 0 0">Your DM will give you the campaign’s PIN.</p></div>' +
      '<form class="form" id="join-form" novalidate><div class="field"><label for="join-pin">Campaign PIN</label><input type="text" id="join-pin" maxlength="12" autocomplete="off" autocapitalize="off" inputmode="text" style="font-family:var(--ui);font-size:22px;letter-spacing:0.15em"></div>' +
      '<p class="err" id="join-err" role="alert" hidden></p><div class="actions"><button type="submit" class="btn primary">Join</button><a class="btn" href="#/wiki">Cancel</a></div></form>' +
      (mine.length ? '<section class="block"><h2 class="sec-title">You’re in</h2><div class="list">' + mine.map(function (c) { return '<a class="row" href="#/campaign/' + encodeURIComponent(c.slug) + '"><span class="row-main"><b>' + esc(c.name) + '</b><span>' + (c.status === 'finished' ? 'Finished' : 'Active') + '</span></span></a>'; }).join('') + '</div></section>' : '') +
      '</div>';
  }
  function submitJoin() {
    var code = document.getElementById('join-pin').value.trim();
    var $err = document.getElementById('join-err');
    if (!code) { $err.textContent = 'Enter the PIN your DM gave you.'; $err.hidden = false; return; }
    sb.rpc('join_campaign', { code: code }).then(function (r) {
      if (r.error) { $err.textContent = r.error.message || 'That PIN didn’t work.'; $err.hidden = false; return; }
      return Promise.all([loadWiki(), loadCharacters()]).then(function () { toast('You joined the campaign'); go('#/campaign/' + encodeURIComponent(r.data)); });
    });
  }

  /* ================= Wiki: article ================= */
  function renderArticle(slug) {
    if (!loaded.wiki) { $view.innerHTML = '<div class="page"><div class="empty">Opening the archive…</div></div>'; return; }
    var a = articleBySlug(slug);
    if (!a || (a.hidden && !dmView())) {
      $view.innerHTML = '<div class="page"><div class="empty">That article doesn’t exist, or it hasn’t been revealed yet.</div><div class="actions"><a class="btn" href="#/wiki">Back to the wiki</a></div></div>';
      return;
    }
    var tpl = findTemplate(a.template);
    var fields = a.fields || {};
    var fieldKeys = Object.keys(fields).filter(function (k) { return String(fields[k] || '').trim(); });
    var sections = (a.sections || []).filter(function (s) { return s && String(s.b || '').trim(); });
    var sec = secrets[a.id] || {};
    var dm = sec.dm || {};
    var dmKeys = Object.keys(dm).filter(function (k) { return String(dm[k] || '').trim(); });

    var camp = a.campaign_id ? campaignById(a.campaign_id) : null;
    var html = '<section class="hero"><div class="hero-in"><p class="crumbs"><a href="#/wiki">Avarenth</a> › ' +
      (camp ? '<a href="#/campaign/' + encodeURIComponent(camp.slug) + '">' + esc(camp.name) + '</a> › ' : '') +
      '<button type="button" class="btn small quiet" style="min-height:0;padding:0;border:0;font-size:12px" data-act="filter-home" data-scope="' + (camp ? 'c-' + esc(camp.id) : 'world') + '" data-target="' + (camp ? '#/campaign/' + encodeURIComponent(camp.slug) : '#/wiki') + '" data-group="' + esc(tpl.group) + '">' + esc(CATEGORY_LABEL[tpl.group] || tpl.group) + '</button></p><h1>' + esc(a.title) + '</h1>' + (statusTag(a) ? '<div class="actions" style="margin-top:6px">' + statusTag(a) + '</div>' : '') + '</div></section><div class="page">';
    if (dmView()) html += '<div class="actions"><a class="btn" href="#/edit/' + encodeURIComponent(a.slug) + '">Edit article</a>' + (a.hidden ? '<span class="tag">Hidden from players</span>' : '') + '</div>';
    html += '<div class="art' + (fieldKeys.length ? ' has-box' : '') + '">';
    if (fieldKeys.length) {
      html += '<aside class="infobox"><h2>' + esc(a.title) + '</h2><dl>';
      fieldKeys.forEach(function (k) { html += '<div><dt>' + esc(k) + '</dt><dd>' + inline(fields[k]) + '</dd></div>'; });
      html += '</dl></aside>';
    }
    html += '<div class="art-body">';
    if (a.summary) html += '<p class="lede">' + inline(a.summary) + '</p>';
    if (sections.length > 2) {
      html += '<nav class="toc" aria-label="Contents"><span class="eyebrow" style="font-size:11px">Contents</span>';
      sections.forEach(function (s, i) { html += '<button type="button" data-act="jump" data-target="s' + i + '">' + esc(s.h) + '</button>'; });
      html += '</nav>';
    }
    sections.forEach(function (s, i) { html += '<section class="section" id="s' + i + '"><h2>' + esc(s.h) + '</h2><div class="prose">' + rich(s.b) + '</div></section>'; });
    if (!sections.length && !a.summary) html += '<div class="empty">This article is empty so far.' + (dmView() ? ' Tap “Edit article” to fill it in.' : '') + '</div>';
    if (dmView() && (dmKeys.length || String(sec.dm_notes || '').trim())) {
      html += '<section class="secret"><h2>DM SECRETS</h2>';
      if (dmKeys.length) {
        html += '<dl>';
        dmKeys.forEach(function (k) { html += '<div><dt>' + esc(k) + '</dt><dd>' + inline(dm[k]) + '</dd></div>'; });
        html += '</dl>';
      }
      if (String(sec.dm_notes || '').trim()) html += '<div class="prose">' + rich(sec.dm_notes) + '</div>';
      html += '<span class="note">Players never receive this section.</span></section>';
    }
    html += articleShopsHtml(a);
    html += '</div></div></div>';
    $view.innerHTML = html;
  }

  /* ================= Wiki: templates ================= */
  function renderNew() {
    var all = allTemplates();
    var sel = findTemplate(ui.selectedTemplate);
    var groupOrder = [];
    all.forEach(function (t) { if (groupOrder.indexOf(t.group) < 0) groupOrder.push(t.group); });
    var html = '<div class="page"><div><p class="eyebrow">New article</p><h1 class="page-title">Pick a template</h1></div>';
    html += '<section class="preview-card" aria-live="polite"><div><p class="eyebrow" style="font-size:11px">' + esc(CATEGORY_LABEL[sel.group] || sel.group) + ' template</p><h2>' + esc(sel.name) + '</h2><p class="lede" style="font-size:17px">' + esc(sel.blurb || '') + '</p></div>';
    if (sel.sidebar.length) html += '<div><span class="eyebrow" style="font-size:11px">Sidebar fields</span><div class="chips">' + sel.sidebar.map(function (f) { return '<span class="chip">' + esc(f) + '</span>'; }).join('') + '</div></div>';
    if (sel.sections.length) html += '<div><span class="eyebrow" style="font-size:11px">Article sections</span><div class="chips">' + sel.sections.map(function (f) { return '<span class="chip">' + esc(f) + '</span>'; }).join('') + '</div></div>';
    if (sel.dm.length) html += '<div class="secret-row"><span class="eyebrow" style="font-size:11px;color:var(--secret)">DM-only fields</span><div class="chips">' + sel.dm.map(function (f) { return '<span class="chip s">' + esc(f) + '</span>'; }).join('') + '</div></div>';
    html += '<div><div class="actions"><button type="button" class="btn primary" data-act="use-template" data-name="' + esc(sel.name) + '">Use this template</button><a class="btn" href="#/wiki">Cancel</a>' +
      (sel.custom ? '<button type="button" class="btn danger" data-act="delete-template" data-id="' + esc(sel.id) + '" style="margin-left:auto">' + (ui.pendingDelete === sel.id ? 'Tap again to delete' : 'Delete template') + '</button>' : '') + '</div></div></section>';
    groupOrder.forEach(function (g) {
      html += '<section class="block"><h2 class="sec-title">' + esc(CATEGORY_LABEL[g] || g) + '</h2><div class="tpl-grid">';
      all.filter(function (t) { return t.group === g; }).forEach(function (t) {
        var n = t.sidebar.length + t.sections.length + t.dm.length;
        html += '<button type="button" class="tpl" data-act="pick-template" data-name="' + esc(t.name) + '" aria-pressed="' + (t.name === sel.name) + '"><b>' + esc(t.name) + '</b><span>' + n + ' fields</span></button>';
      });
      html += '</div></section>';
    });
    html += '<a class="btn quiet" style="min-height:64px;border-style:dashed" href="#/builder">+ Build your own template</a></div>';
    $view.innerHTML = html;
  }

  function renderBuilder() {
    $view.innerHTML = '<div class="page narrow"><form class="form" id="builder-form" novalidate>' +
      '<div><p class="eyebrow">Templates</p><h1 class="page-title">Build your own template</h1></div>' +
      '<div class="field"><label for="b-name">Template name</label><input type="text" id="b-name" placeholder="e.g. Mercenary Company" maxlength="60"></div>' +
      '<div class="field"><label for="b-blurb">What it’s for</label><input type="text" id="b-blurb" placeholder="One line shown when picking a template" maxlength="140"></div>' +
      '<div class="field"><label for="b-side">Sidebar fields</label><textarea id="b-side" placeholder="Captain&#10;Headquarters&#10;Number of blades"></textarea><span class="hint">One per line.</span></div>' +
      '<div class="field"><label for="b-sec">Article sections</label><textarea id="b-sec" placeholder="History&#10;Notable contracts"></textarea><span class="hint">One per line.</span></div>' +
      '<div class="field"><label for="b-dm">DM-only fields</label><textarea id="b-dm" placeholder="Who really pays them"></textarea><span class="hint">One per line. Players never see these.</span></div>' +
      '<div class="sticky-actions"><button type="submit" class="btn primary">Save template</button><a class="btn" href="#/new">Cancel</a></div></form></div>';
  }
  function lines(id) { return uniq(document.getElementById(id).value.split('\n').map(function (s) { return s.trim().slice(0, 60); })); }
  function saveBuilder() {
    var name = document.getElementById('b-name').value.trim();
    if (!name) { toast('Name the template first.'); return document.getElementById('b-name').focus(); }
    if (TEMPLATES.some(function (t) { return t.name.toLowerCase() === name.toLowerCase(); })) return toast('A built-in template already has that name.');
    var row = { name: name, blurb: document.getElementById('b-blurb').value.trim(), sidebar: lines('b-side'), sections: lines('b-sec'), dm: lines('b-dm') };
    if (!row.sections.length) row.sections = ['Overview'];
    sb.from('templates').insert(row).then(function (r) {
      if (r.error) return fail(r.error, r.error.code === '23505' ? 'You already have a template with that name.' : 'Could not save the template.');
      ui.selectedTemplate = name;
      loadWiki().then(function () { toast('Template saved'); go('#/new'); });
    });
  }

  /* ================= Wiki: editor ================= */
  function renderEdit(slug) {
    if (!loaded.wiki) { $view.innerHTML = '<div class="page"><div class="empty">Opening the archive…</div></div>'; return; }
    var isNew = !slug;
    var a, sec = {};
    if (isNew) {
      a = { title: '', template: ui.editTemplate || 'Generic Article', summary: '', fields: {}, sections: [], hidden: false, campaign_id: ui.editCampaign || null };
    } else {
      var found = articleBySlug(slug);
      if (!found) { location.replace('#/wiki'); return; }
      a = clone(found);
      sec = secrets[a.id] || {};
    }
    var tpl = findTemplate(a.template);
    var fieldNames = uniq(tpl.sidebar.concat(Object.keys(a.fields || {})));
    var sectionNames = uniq(tpl.sections.concat((a.sections || []).map(function (s) { return s.h; })));
    var dmNames = uniq(tpl.dm.concat(Object.keys(sec.dm || {})));
    var secMap = {};
    (a.sections || []).forEach(function (s) { secMap[s.h] = s.b; });

    var html = '<div class="page narrow"><form class="form" id="edit-form" novalidate data-slug="' + esc(slug || '') + '" data-template="' + esc(a.template) + '">' +
      '<div><p class="eyebrow">' + (isNew ? 'New ' : 'Editing ') + esc(tpl.name) + '</p><h1 class="page-title">' + (isNew ? 'New article' : esc(a.title)) + '</h1></div>' +
      '<div class="field"><label for="f-title">Title</label><input type="text" id="f-title" required maxlength="120" value="' + esc(a.title) + '" placeholder="e.g. Marloo"></div>' +
      '<div class="field"><label for="f-campaign">Belongs to</label><select id="f-campaign">' + campaignOptions(a.campaign_id, true) + '</select><span class="hint">World lore is shared by every campaign. Campaign articles are only seen by that campaign’s players.</span></div>' +
      '<div class="field"><label for="f-summary">Summary</label><textarea id="f-summary" style="min-height:80px" placeholder="One or two sentences shown under the title">' + esc(a.summary) + '</textarea></div>';
    if (fieldNames.length) {
      html += '<div class="group-box"><h2>Sidebar</h2>';
      fieldNames.forEach(function (n, i) { html += '<div class="field"><label for="fd-' + i + '">' + esc(n) + '</label><input type="text" id="fd-' + i + '" data-field="' + esc(n) + '" value="' + esc((a.fields || {})[n] || '') + '"></div>'; });
      html += '</div>';
    }
    html += '<div class="group-box"><h2>Sections</h2><span class="hint">Link other articles by writing their name in double brackets, like [[Marloo]].</span>';
    sectionNames.forEach(function (n, i) { html += '<div class="field"><label for="sc-' + i + '">' + esc(n) + '</label><textarea id="sc-' + i + '" data-section="' + esc(n) + '">' + esc(secMap[n] || '') + '</textarea></div>'; });
    html += '</div><div class="group-box secret-box"><h2>DM secrets</h2><span class="hint">Stored separately. Players’ accounts can never load these.</span>';
    dmNames.forEach(function (n, i) { html += '<div class="field"><label for="dm-' + i + '">' + esc(n) + '</label><input type="text" id="dm-' + i + '" data-dm="' + esc(n) + '" value="' + esc((sec.dm || {})[n] || '') + '"></div>'; });
    html += '<div class="field"><label for="f-dmnotes">DM notes</label><textarea id="f-dmnotes">' + esc(sec.dm_notes || '') + '</textarea></div>' +
      '<label class="check"><input type="checkbox" id="f-hidden"' + (a.hidden ? ' checked' : '') + '>Hide this whole article from players</label></div>' +
      '<div class="sticky-actions"><button type="submit" class="btn primary" id="save-btn">Save</button><a class="btn" href="' + (isNew ? '#/new' : '#/a/' + encodeURIComponent(slug)) + '">Cancel</a>' +
      (isNew ? '' : '<button type="button" class="btn danger" data-act="delete-article" data-id="' + esc(a.id) + '" style="margin-left:auto">' + (ui.pendingDelete === a.id ? 'Tap again to delete' : 'Delete') + '</button>') +
      '</div></form></div>';
    $view.innerHTML = html;
  }

  function saveEdit(form) {
    var slug = form.getAttribute('data-slug');
    var existing = slug ? articleBySlug(slug) : null;
    var get = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
    var row = { title: get('f-title'), template: form.getAttribute('data-template'), summary: get('f-summary'), fields: {}, sections: [], hidden: !!document.getElementById('f-hidden').checked, campaign_id: document.getElementById('f-campaign').value || null };
    if (!row.title) { toast('Give the article a title first.'); return document.getElementById('f-title').focus(); }
    $view.querySelectorAll('[data-field]').forEach(function (el) { if (el.value.trim()) row.fields[el.getAttribute('data-field')] = el.value.trim(); });
    $view.querySelectorAll('[data-section]').forEach(function (el) { if (el.value.trim()) row.sections.push({ h: el.getAttribute('data-section'), b: el.value.trim() }); });
    var dm = {};
    $view.querySelectorAll('[data-dm]').forEach(function (el) { if (el.value.trim()) dm[el.getAttribute('data-dm')] = el.value.trim(); });
    var dmNotes = get('f-dmnotes');
    var btn = document.getElementById('save-btn');
    btn.disabled = true;

    var write;
    if (existing) {
      write = sb.from('articles').update(row).eq('id', existing.id).select('id, slug').single();
    } else {
      var base = slugify(row.title), s = base, n = 2;
      while (articleBySlug(s)) s = base + '-' + (n++);
      row.slug = s;
      write = sb.from('articles').insert(row).select('id, slug').single();
    }
    write.then(function (r) {
      if (r.error) throw r.error;
      var id = r.data.id, newSlug = r.data.slug;
      var hasSecret = Object.keys(dm).length || dmNotes;
      var next = hasSecret
        ? sb.from('article_secrets').upsert({ article_id: id, dm: dm, dm_notes: dmNotes })
        : (secrets[id] ? sb.from('article_secrets').delete().eq('article_id', id) : Promise.resolve({}));
      return Promise.resolve(next).then(function (r2) {
        if (r2 && r2.error) throw r2.error;
        return loadWiki().then(function () { toast('Saved'); go('#/a/' + encodeURIComponent(newSlug)); });
      });
    }).catch(function (e) { btn.disabled = false; fail(e, 'Could not save. Check your connection and try again.'); });
  }

  /* ================= Wiki: customize ================= */
  function renderCustomize() {
    var p = palette();
    var html = '<div class="page narrow"><div><p class="eyebrow">Settings</p><h1 class="page-title">Customize</h1><p class="note" style="margin:6px 0 0">Changes apply right away, for you and your players.</p></div>';
    html += '<section class="block"><h2 class="sec-title">Themes</h2><div class="two">';
    Object.keys(PRESETS).concat(['Custom']).forEach(function (name) {
      var q = name === 'Custom' ? (look.custom || p) : PRESETS[name];
      html += '<button type="button" class="theme-card" data-act="preset" data-name="' + esc(name) + '" aria-pressed="' + (look.preset === name) + '" style="background:' + q.bg + ';color:' + q.text + '"><span class="swatches"><i style="background:' + q.panel + '"></i><i style="background:' + q.text + '"></i><i style="background:' + q.accent + '"></i></span><b>' + esc(name) + '</b></button>';
    });
    html += '</div></section><section class="block"><h2 class="sec-title">Colors</h2><p class="note" style="margin:0">Tap a swatch to open the color wheel. Changing a color switches you to Custom.</p>';
    [['bg', 'Background', 'The page behind everything'], ['panel', 'Panels', 'Infoboxes, cards and banners'], ['text', 'Text', 'Body copy and headings'], ['accent', 'Accent', 'Links, buttons and highlights']].forEach(function (f) {
      html += '<label class="color-row" for="c-' + f[0] + '"><input type="color" id="c-' + f[0] + '" data-color="' + f[0] + '" value="' + p[f[0]] + '"><span class="meta"><b>' + f[1] + '</b><span>' + f[2] + '</span></span><code id="hex-' + f[0] + '">' + p[f[0]].toUpperCase() + '</code></label>';
    });
    html += '</section><section class="block"><h2 class="sec-title">Heading font</h2><div class="stack">';
    Object.keys(FONTS).forEach(function (name) {
      html += '<button type="button" class="opt" data-act="font" data-name="' + esc(name) + '" aria-pressed="' + (look.font === name) + '"><span style="font-family:' + FONTS[name] + ';font-size:21px;font-weight:700">Avarenth</span><small>' + esc(name) + '</small></button>';
    });
    html += '</div></section><section class="block"><h2 class="sec-title">Corners</h2><div class="two">';
    ['Sharp', 'Rounded'].forEach(function (name) {
      html += '<button type="button" class="opt" data-act="corners" data-name="' + name + '" aria-pressed="' + (look.corners === name) + '" style="justify-content:center;border-radius:' + (name === 'Sharp' ? '3px' : '12px') + '">' + name + '</button>';
    });
    html += '</div></section><div class="actions"><button type="button" class="btn" data-act="reset-look">Reset to Dark ink</button><a class="btn primary" href="#/wiki">Done</a></div></div>';
    $view.innerHTML = html;
  }

  /* ================= Players (DM) ================= */
  function renderMembers() {
    if (!loaded.members) { loadMembers().then(render).catch(function (e) { fail(e); }); $view.innerHTML = '<div class="page"><div class="empty">Loading players…</div></div>'; return; }
    var pending = members.filter(function (m) { return m.role === 'pending'; });
    var rest = members.filter(function (m) { return m.role !== 'pending'; });
    var row = function (m) {
      var you = m.id === uid();
      var tag = m.role === 'dm' ? '<span class="tag ok">DM</span>' : m.role === 'player' ? '<span class="tag plain">Player</span>' : '<span class="tag">Waiting</span>';
      var btn = you || m.role === 'dm' ? '' : m.role === 'pending'
        ? '<button type="button" class="btn small primary" data-act="role" data-id="' + esc(m.id) + '" data-role="player">Approve</button>'
        : '<button type="button" class="btn small" data-act="role" data-id="' + esc(m.id) + '" data-role="pending">Remove access</button>';
      var campRow = '';
      if (m.role === 'player' && campaigns.length) {
        campRow = '<div class="pill-row" style="padding:0 0 10px">' + campaigns.map(function (c) {
          var inIt = memberships.some(function (x) { return x.campaign_id === c.id && x.user_id === m.id; });
          return '<button type="button" class="opt" style="width:auto;min-height:40px;font-family:var(--ui);font-size:13px" data-act="member-camp" data-user="' + esc(m.id) + '" data-camp="' + esc(c.id) + '" aria-pressed="' + inIt + '">' + (inIt ? '✓ ' : '+ ') + esc(c.name) + '</button>';
        }).join('') + '</div>';
      }
      return '<div class="tbl-row" style="border-bottom:' + (campRow ? '0' : '1px solid var(--soft)') + '"><div class="main"><b>' + esc(m.display_name || 'Unnamed') + (you ? ' (you)' : '') + '</b><span>Joined ' + esc(new Date(m.created_at).toLocaleDateString()) + '</span></div>' + tag + btn + '</div>' + (campRow ? campRow + '<div style="border-bottom:1px solid var(--soft)"></div>' : '');
    };
    var html = '<div class="page narrow"><div><p class="eyebrow">Your table</p><h1 class="page-title">Players</h1><p class="note" style="margin:6px 0 0">Send your players the app link. When they create an account, approve them here. Then give them a campaign’s PIN, or tap a campaign under their name to add them yourself.</p></div>';
    html += '<section class="block"><h2 class="sec-title">Waiting for approval<small>' + pending.length + '</small></h2>' + (pending.length ? '<div class="tbl">' + pending.map(row).join('') + '</div>' : '<div class="empty">Nobody is waiting right now.</div>') + '</section>';
    html += '<section class="block"><h2 class="sec-title">At the table</h2><div class="tbl">' + rest.map(row).join('') + '</div></section>';
    html += '<button type="button" class="btn" data-act="reload-members">Refresh</button></div>';
    $view.innerHTML = html;
  }

  /* ================= Characters ================= */
  /* ---------- Character rules (from rules.js and the Mana Guide) ---------- */
  var RULES = window.AVARENTH_RULES || { classes: {}, subLevels: {}, magic: { manaCost: [], mana: {}, charges: {}, fullCasters: [], learnLevel: [], learnCost: [], studyHours: [], spellAbility: {}, startPicks: {}, freePickLevels: [] }, species: {}, backgrounds: {}, coins: {} };
  var ORD = ['Cantrip', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th'];

  function defaultSheet() {
    return {
      species: '', cls: '', subclass: '', background: '', patron: '', level: 1,
      abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
      ac: 10, speed: 30, initBonus: 0,
      hp: { cur: 10, max: 10, temp: 0 }, hd: { used: 0 },
      mana: { cur: 0, max: 0, regen: '', override: false },
      charges: { hm: 0, rc: 0 }, picks: 0, secretPicks: 0, debts: [], tomes: [],
      death: { s: 0, f: 0 }, conditions: [], exhaustion: 0, inspiration: false, oath: '', drawbacks: '',
      saves: {}, skills: {},
      spells: [], items: [], attacks: [], coins: { cp: 0, sp: 0, gp: 0, pp: 0 }, features: [], notes: '', log: []
    };
  }
  function normSheet(s) {
    var d = defaultSheet();
    if (!s || typeof s !== 'object') return d;
    var out = Object.assign(d, s);
    out.abilities = Object.assign(defaultSheet().abilities, s.abilities || {});
    out.hp = Object.assign(defaultSheet().hp, s.hp || {});
    out.hd = Object.assign(defaultSheet().hd, s.hd || {});
    out.mana = Object.assign(defaultSheet().mana, s.mana || {});
    // Sheets made before mana was automatic keep the numbers their owner typed in.
    if (s.mana && s.mana.override === undefined && !s.built && num(s.mana.max, 0) > 0) out.mana.override = true;
    out.charges = Object.assign(defaultSheet().charges, s.charges || {});
    out.coins = Object.assign(defaultSheet().coins, s.coins || {});
    ['saves', 'skills'].forEach(function (k) { if (!out[k] || typeof out[k] !== 'object') out[k] = {}; });
    ['spells', 'items', 'features', 'attacks', 'log', 'debts', 'tomes'].forEach(function (k) { if (!Array.isArray(out[k])) out[k] = []; });
    if (!out.res || typeof out.res !== 'object' || Array.isArray(out.res)) out.res = {};
    out.death = Object.assign({ s: 0, f: 0 }, s.death || {});
    if (!Array.isArray(out.conditions)) out.conditions = [];
    out.exhaustion = Math.max(0, Math.min(6, num(out.exhaustion, 0)));
    out.inspiration = !!out.inspiration;
    return out;
  }
  function mod(score) { return Math.floor((num(score, 10) - 10) / 2); }
  function profBonus(level) { return 2 + Math.floor((Math.max(1, num(level, 1)) - 1) / 4); }
  function charById(id) { for (var i = 0; i < characters.length; i++) if (characters[i].id === id) return characters[i]; return null; }
  function canEditChar(c) { return !!c && (c.owner_id === uid() || isDM()); }

  function classOf(s) { return RULES.classes[s.cls] || null; }
  function devotionLabel(cls) { return (RULES.devotion || {})[cls] || ''; }
  function devotionRequired(cls) { return (RULES.devotionRequired || []).indexOf(cls) >= 0; }
  // Gods are always on offer; Hollow Court lords only when the viewer can read about them.
  var OATH_ONLY = 'Their oath alone';
  function patronOptions(cls) {
    var nature = (RULES.natureOnly || []).indexOf(cls) >= 0;
    var out = (RULES.gods || []).filter(function (g) { return !nature || g.nature; }).map(function (g) { return { name: g.name, about: g.about, domains: g.domains, article: g.article, kind: 'god' }; });
    // Druids and rangers keep to nature: nature gods, and the demons that are nature's shadow. Paladins only swear to demons with a cause.
    (RULES.demons || []).forEach(function (d) { if ((!nature || d.nature) && (cls !== 'Paladin' || d.paladin) && articleByTitle(d.article)) out.push({ name: d.name, about: d.about, article: d.article, kind: 'demon' }); });
    return out;
  }
  function patronInfo(name) { return patronOptions().filter(function (p) { return p.name === name; })[0] || null; }
  /* ---------- Subclasses: the patron decides which fit ---------- */
  var SUB_STEP = { Cleric: 'Domain', Warlock: 'Pact', Sorcerer: 'Origin' };
  function customSub(cls, name) { return customSubs.filter(function (x) { return x.class === cls && x.name === name; })[0] || null; }
  function subclassOptions(cls, patron) {
    var cd = RULES.classes[cls];
    if (!cd) return [];
    var map = patron && patron !== OATH_ONLY ? ((RULES.patronSubclasses || {})[patron] || {})[cls] : null;
    var out = cd.subclasses.filter(function (x) { return !map || map.indexOf(x) >= 0; }).map(function (x) { return { name: x, about: '' }; });
    customSubs.forEach(function (x) {
      if (x.class !== cls) return;
      var ps = x.patrons || [];
      if (!ps.length || (patron && ps.indexOf(patron) >= 0)) out.push({ name: x.name, about: x.about || '', custom: true });
    });
    return out;
  }
  // A patron's Tenets section, from their article.
  function patronTenets(name) {
    var p = patronInfo(name), art = p ? articleByTitle(p.article) : articleByTitle(name);
    var sec = art && (art.sections || []).filter(function (x) { return x.h === 'Tenets'; })[0];
    return sec ? sec.b : '';
  }
  function patronLine(s) {
    if (!s.patron) return '';
    if (s.patron === OATH_ONLY) return 'Sworn to their oath, not a god';
    var p = patronInfo(s.patron), art = p ? articleByTitle(p.article) : articleByTitle(s.patron);
    var label = (devotionLabel(s.cls) === 'Patron' ? 'Pact with ' : 'Serves ') ;
    return label + (art ? '<a class="link" href="#/a/' + encodeURIComponent(art.slug) + '">' + esc(s.patron) + '</a>' : esc(s.patron));
  }
  function isFullCaster(cls) { return RULES.magic.fullCasters.indexOf(cls) >= 0; }
  function casterKind(cls) { return isFullCaster(cls) ? 'full' : (cls === 'Paladin' || cls === 'Ranger') ? 'half' : 'martial'; }
  function listCap(cls) { return isFullCaster(cls) ? 5 : 4; }
  function autoMana(cls, level) { var m = RULES.magic.mana[cls]; return m ? m[0] + m[1] * (Math.max(1, num(level, 1)) - 1) : null; }
  function manaMax(s) { var a = autoMana(s.cls, s.level); return (s.mana.override || a === null) ? num(s.mana.max, 0) : a; }
  function hmMax(cls, level) { var c = RULES.magic.charges[cls]; return c ? c[0].filter(function (l) { return num(level, 1) >= l; }).length : 0; }
  function rcMax(cls, level) { var c = RULES.magic.charges[cls]; return c && c[1] && num(level, 1) >= c[1] ? 1 : 0; }
  function learnableLevel(s) {
    var lvl = num(s.level, 1), top = 0;
    for (var L = 1; L <= 9; L++) {
      if (lvl < RULES.magic.learnLevel[L]) break;
      if (L >= 6 && L <= 8 && !hmMax(s.cls, lvl)) break;
      if (L === 9 && !rcMax(s.cls, lvl)) break;
      top = L;
    }
    return top;
  }
  function spellCost(sp) { return sp.level != null && sp.level !== '' ? (RULES.magic.manaCost[num(sp.level, 0)] || 0) : num(sp.cost, 0); }
  function spellAbilityMod(s, abil) { var a = RULES.magic.spellAbility[s.cls]; return a ? { key: a, mod: abil[a] } : null; }
  function onClassList(sp, cls) { return (sp.classes || []).indexOf(cls) >= 0 && sp.level <= listCap(cls); }
  function hdAvg(die) { return Math.floor(die / 2) + 1; }
  function roll(n, die) { var t = 0; for (var i = 0; i < n; i++) t += 1 + Math.floor(Math.random() * die); return t; }
  function ordinal(L) { return ORD[L] || L; }
  function coinName(k) { return RULES.coins[k] || ({ pp: 'Platinum' })[k] || k; }

  // Everything the sheet shows as a feature: class features up to the current level, subclass levels, species traits, then the owner's own.
  function derivedFeatures(s) {
    var out = [], cd = classOf(s), sp = RULES.species[s.species];
    if (cd) {
      cd.features.forEach(function (f) { if (f[0] <= num(s.level, 1)) out.push({ name: f[1], text: f[2], src: s.cls + ' ' + f[0], ruling: !!f[3] }); });
      var csub = s.subclass ? customSub(s.cls, s.subclass) : null;
      if (csub) (csub.features || []).forEach(function (f) { if (num(f.level, 1) <= num(s.level, 1)) out.push({ name: f.name, text: f.text || '', src: s.subclass + ' ' + num(f.level, 1), sub: true }); });
      else (RULES.subLevels[s.cls] || []).forEach(function (l) {
        if (l <= num(s.level, 1)) out.push({ name: (s.subclass || cd.subclassLabel) + ' feature', text: s.subclass ? 'Your ' + cd.subclassLabel.toLowerCase() + ' grants a feature at level ' + l + '. Add its details below, or ask your DM.' : 'You reach a ' + cd.subclassLabel.toLowerCase() + ' feature at level ' + l + ', once you choose one.', src: s.cls + ' ' + l, sub: true });
      });
    }
    if (sp) {
      if (sp.dark) out.push({ name: 'Darkvision', text: 'See in dim light within ' + sp.dark + ' feet as if it were bright, and in darkness as if dim.', src: s.species });
      sp.traits.forEach(function (t) { out.push({ name: t[0], text: t[1], src: s.species }); });
    }
    return out;
  }

  // What the sheet thinks the player should do next.
  function nextSteps(c, s) {
    var out = [], cd = classOf(s);
    if (!s.cls) out.push(['Pick a class for this character. Tap “Edit sheet”, or start over with the character builder.', '']);
    if (devotionRequired(s.cls) && !s.patron) out.push([(devotionLabel(s.cls) === 'Patron' ? 'Choose the patron you made your pact with' : s.cls === 'Paladin' ? 'Choose the god you serve, or swear to your oath alone' : 'Choose the god you serve') + '. Tap “Edit sheet” to set it.', '']);
    if (cd && !s.subclass && num(s.level, 1) >= cd.subclassLevel) out.push(['Choose your ' + cd.subclassLabel.toLowerCase() + '. Tap “Edit sheet” to set it.', '']);
    if (num(s.secretPicks, 0) > 0) out.push(['You have ' + s.secretPicks + ' Magical Secrets to learn: any class list, no tome needed, half the cost.', 'spells']);
    if (num(s.picks, 0) > 0) out.push(['You have ' + s.picks + ' free spell ' + (s.picks === 1 ? 'pick' : 'picks') + ' from your class list.', 'spells']);
    if (cd && num(s.level, 1) < 20) out.push(['Ready for level ' + (num(s.level, 1) + 1) + '? The level-up guide walks you through it.', 'level']);
    return out;
  }

  function charRow(c, showOwner) {
    var s = normSheet(c.sheet);
    var line = ['Level ' + num(s.level, 1), s.species, s.cls].filter(Boolean).join(' · ');
    return '<a class="row" href="#/c/' + encodeURIComponent(c.id) + '"><span class="row-main"><b>' + esc(c.name) + '</b><span>' + esc(line) + (showOwner ? ' · ' + esc(memberName(c.owner_id)) : '') + '</span></span></a>';
  }

  function renderCharacters() {
    if (!loaded.chars) { $view.innerHTML = '<div class="page"><div class="empty">Loading characters…</div></div>'; return; }
    var html = '<div class="page narrow"><div><p class="eyebrow">Characters</p><h1 class="page-title">' + (isDM() ? 'Every party' : 'Your characters') + '</h1></div>';
    if (ui.newChar) {
      html += '<form class="form" id="newchar-form" novalidate><div class="field"><label for="nc-name">Character name</label><input type="text" id="nc-name" maxlength="80" placeholder="e.g. Kael Vorn"></div>' +
        '<div class="field"><label for="nc-campaign">Campaign</label><select id="nc-campaign">' + campaignOptions(ui.newCharCampaign || (myCampaigns()[0] || {}).id, true, 'No campaign yet') + '</select></div>' +
        '<div class="actions"><button type="submit" class="btn primary">Create blank sheet</button><button type="button" class="btn" data-act="newchar-cancel">Cancel</button></div></form>';
    } else {
      html += '<div class="actions"><a class="btn primary" href="#/build">+ Build a character</a><button type="button" class="btn quiet" data-act="newchar">Blank sheet</button>' + (dmView() ? '<a class="btn quiet" href="#/subclasses">Custom subclasses</a>' : '') + '</div>';
    }
    var groups = myCampaigns().map(function (c) { return { id: c.id, name: c.name + (c.status === 'finished' ? ' (finished)' : '') }; });
    groups.push({ id: null, name: 'No campaign' });
    var any = false;
    groups.forEach(function (g) {
      var list = characters.filter(function (c) { return (c.campaign_id || null) === g.id || (g.id === null && c.campaign_id && !campaignById(c.campaign_id)); });
      if (!list.length) return;
      any = true;
      html += '<section class="block"><h2 class="sec-title">' + esc(g.name) + '</h2><div class="list">' + list.map(function (c) { return charRow(c, isDM() && c.owner_id !== uid()); }).join('') + '</div></section>';
    });
    if (!any) html += '<div class="empty">No characters yet. Tap “Build a character” and the builder will walk you through it.</div>';
    html += '</div>';
    $view.innerHTML = html;
  }

  function createCharacter() {
    var name = document.getElementById('nc-name').value.trim();
    if (!name) { toast('Give your character a name.'); return; }
    var campaignId = document.getElementById('nc-campaign').value || null;
    insertCharacter(name, campaignId, defaultSheet(), true);
  }
  function insertCharacter(name, campaignId, sheet, editAfter) {
    return sb.from('characters').insert({ name: name, owner_id: uid(), sheet: sheet, campaign_id: campaignId }).select('id, owner_id, name, sheet, ddb_url, campaign_id, updated_at').single().then(function (r) {
      if (r.error) return fail(r.error, 'Could not create the character.');
      characters.push(r.data);
      ui.newChar = false;
      ui.sheetEdit = !!editAfter;
      ui.sheetTab = 'Actions';
      go('#/c/' + encodeURIComponent(r.data.id));
    });
  }

  function saveCharSoon(c) {
    var el = document.getElementById('saved');
    if (el) el.textContent = 'Saving…';
    clearTimeout(saveTimers['c' + c.id]);
    saveTimers['c' + c.id] = setTimeout(function () {
      var ddb = /^https:\/\//i.test(c.ddb_url || '') ? c.ddb_url : '';
      sb.from('characters').update({ name: c.name || 'Unnamed', sheet: c.sheet, ddb_url: ddb, campaign_id: c.campaign_id || null }).eq('id', c.id).then(function (r) {
        var el2 = document.getElementById('saved');
        if (r.error) { if (el2) el2.textContent = 'Not saved'; return fail(r.error, 'Could not save the sheet. Your changes are still on screen; try again.'); }
        if (el2) el2.textContent = 'Saved';
      });
    }, 700);
  }

  /* ---------- Character builder ---------- */
  var BUILD_STEPS = ['Name', 'Class', 'Species', 'Background', 'Abilities', 'Skills', 'Spells', 'Review'];
  function buildSteps(b) {
    var out = BUILD_STEPS.slice(), at = 2;
    if (devotionLabel(b.cls)) { out.splice(at, 0, devotionLabel(b.cls)); at++; }
    if (SUB_STEP[b.cls]) out.splice(at, 0, SUB_STEP[b.cls]);
    return out;
  }
  function newBuild() {
    return { step: 0, patron: '', sub: '', oath: '', drawbacks: '', name: '', campaign: (myCampaigns()[0] || {}).id || '', cls: '', species: '', bg: '', method: 'array', assign: {}, rolls: [], pb: { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 }, manual: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 }, plus2: '', plus1: '', skills: [], extra: [], spells: [] };
  }
  function buildBase(b) {
    var out = {};
    ABILITIES.forEach(function (a) {
      var k = a[0];
      out[k] = b.method === 'pointbuy' ? num(b.pb[k], 8) : b.method === 'manual' ? num(b.manual[k], 10) : num(b.assign[k], 0) ? (b.method === 'roll' ? b.rolls : RULES.standardArray)[num(b.assign[k], 0) - 1] : 0;
    });
    return out;
  }
  function buildScores(b) {
    var base = buildBase(b), out = {};
    ABILITIES.forEach(function (a) { var k = a[0]; out[k] = Math.min(20, num(base[k], 0) + (b.plus2 === k ? 2 : 0) + (b.plus1 === k ? 1 : 0)); });
    return out;
  }
  function buildFixedSkills(b) { return uniq((RULES.backgrounds[b.bg] || []).concat((RULES.species[b.species] || {}).skill ? [RULES.species[b.species].skill] : [])); }
  function buildSpellNeeds(b) { var p = RULES.magic.startPicks[casterKind(b.cls)] || [0, 0]; return { cantrips: p[0], first: p[1] }; }
  function buildStepError(b) {
    switch (buildSteps(b)[b.step]) {
      case 'Deity': case 'Patron':
        if (!b.patron && devotionRequired(b.cls)) return 'Choose who you serve.';
        if (b.cls === 'Paladin' && b.patron === OATH_ONLY) {
          if (!String(b.oath || '').trim()) return 'Write your oath.';
          if (!String(b.drawbacks || '').trim()) return 'Write your oath’s drawbacks.';
        }
        return '';
      case 'Domain': case 'Pact': case 'Origin': return b.sub ? '' : 'Choose your ' + RULES.classes[b.cls].subclassLabel.toLowerCase() + '.';
      case 'Name': return b.name.trim() ? '' : 'Give your character a name.';
      case 'Class': return b.cls ? '' : 'Pick a class.';
      case 'Species': return b.species ? '' : 'Pick a species.';
      case 'Background': return b.bg ? '' : 'Pick a background.';
      case 'Abilities':
        var base = buildBase(b);
        if (ABILITIES.some(function (a) { return !num(base[a[0]], 0); })) return 'Give every ability a score.';
        if (b.method === 'pointbuy' && pointsSpent(b) > RULES.pointBuyBudget) return 'You’ve spent more than ' + RULES.pointBuyBudget + ' points.';
        if (!b.plus2 || !b.plus1 || b.plus2 === b.plus1) return 'Pick one ability for +2 and a different one for +1.';
        return '';
      case 'Skills':
        var cd = RULES.classes[b.cls], need = cd.skills.n + ((RULES.species[b.species] || {}).extraSkill || 0);
        return b.skills.length === need ? '' : 'Pick ' + need + ' skills (' + b.skills.length + ' chosen).';
      case 'Spells':
        var n = buildSpellNeeds(b), have = buildSpellCounts(b);
        return have.cantrips <= n.cantrips && have.first <= n.first ? '' : 'Too many spells picked.';
    }
    return '';
  }
  function buildSpellCounts(b) {
    var c = 0, f = 0;
    b.spells.forEach(function (n) { var sp = spellByName(n); if (sp && sp.level === 0) c++; else f++; });
    return { cantrips: c, first: f };
  }
  function pointsSpent(b) { return ABILITIES.reduce(function (t, a) { return t + (RULES.pointBuyCost[num(b.pb[a[0]], 8)] || 0); }, 0); }

  function choiceGrid(items, selected, act) {
    return '<div class="choice-grid">' + items.map(function (it) {
      return '<button type="button" class="choice" data-act="' + act + '" data-val="' + esc(it[0]) + '" aria-pressed="' + (it[0] === selected) + '"><b>' + esc(it[0]) + '</b>' + (it[1] ? '<span>' + esc(it[1]) + '</span>' : '') + '</button>';
    }).join('') + '</div>';
  }

  function renderBuild() {
    var b = ui.build || (ui.build = newBuild());
    if (spells === null && b.step >= 6) { loadSpells().then(render).catch(function (e) { fail(e); }); }
    var steps = buildSteps(b), step = steps[b.step];
    var html = '<div class="page narrow"><p class="crumbs"><a href="#/characters">Characters</a></p><h1 class="page-title">Build a character</h1>' +
      '<ol class="steps">' + steps.map(function (t, i) { return '<li' + (i === b.step ? ' aria-current="step"' : '') + (i < b.step ? ' class="done"' : '') + '>' + t + '</li>'; }).join('') + '</ol>';
    var cd = RULES.classes[b.cls];
    if (step === 'Name') {
      html += '<p class="guide">Start with who they are. You can change the name any time.</p>' +
        '<div class="field"><label for="bd-name">Character name</label><input type="text" id="bd-name" data-build="name" maxlength="80" value="' + esc(b.name) + '" placeholder="e.g. Kael Vorn"></div>' +
        '<div class="field"><label for="bd-camp">Campaign</label><select id="bd-camp" data-build="campaign">' + campaignOptions(b.campaign, true, 'No campaign yet') + '</select></div>';
    } else if (step === 'Class') {
      html += '<p class="guide">Your class is what you do best. It sets your hit points, your skills, how much mana you have and which spells are on your list.</p>' +
        choiceGrid(Object.keys(RULES.classes).map(function (k) { var c = RULES.classes[k], m = RULES.magic.mana[k]; return [k, 'd' + c.hd + ' hit die · ' + (m ? m[0] + ' mana' : 'no mana') + ' · ' + c.primary]; }), b.cls, 'bd-class');
      if (cd) html += classCard(b.cls);
    } else if (step === 'Domain' || step === 'Pact' || step === 'Origin') {
      var sopts = subclassOptions(b.cls, b.patron), scd = RULES.classes[b.cls];
      html += '<p class="guide">' + (step === 'Domain' ? 'Your domain is the part of ' + (b.patron ? esc(b.patron) + '’s' : 'your god’s') + ' power you carry. It decides your domain spells and your Channel Divinity.' :
        step === 'Pact' ? 'What kind of pact did you make' + (b.patron ? ' with ' + esc(b.patron) : '') + '? It decides your extra spells and the gifts your patron gives you.' :
        'Where does your magic come from? Your origin shapes the gifts it gives you.') + '</p>' +
        choiceGrid(sopts.map(function (o) { return [o.name, o.custom ? (o.about || 'Avarenth') : (step === 'Domain' ? 'Domain' : step === 'Pact' ? 'Pact' : 'Origin') + ' from the D&D rules']; }), b.sub, 'bd-sub');
      var csel = b.sub ? customSub(b.cls, b.sub) : null;
      if (csel) html += '<div class="group-box" style="margin-top:12px"><h2>' + esc(csel.name) + '</h2>' + (csel.about ? '<p class="note" style="margin-top:0">' + esc(csel.about) + '</p>' : '') +
        '<div class="tbl">' + (csel.features || []).map(function (f) { return '<div class="tbl-row"><div class="main"><b>Level ' + num(f.level, 1) + ': ' + esc(f.name) + '</b><span>' + esc(f.text || '') + '</span></div></div>'; }).join('') + '</div></div>';
      if (b.patron && scd && sopts.length < scd.subclasses.length) html += '<p class="note">Only the ones ' + esc(b.patron) + ' grants are shown.</p>';
    } else if (step === 'Deity' || step === 'Patron') {
      var opts = patronOptions(b.cls), isPact = step === 'Patron';
      html += '<p class="guide">' + (isPact ? 'A warlock’s power is borrowed. Who did you make your pact with? Gods can bargain too, but most warlocks deal with the lords of the Hollow Court, and every gift comes with a price.' :
        b.cls === 'Druid' ? 'Druids draw on the land itself, but many honor a power of nature: Roselle or Thorum, or their dark shadows. Choose one if yours does, or skip this.' :
        b.cls === 'Paladin' ? 'A paladin’s power comes from their oath. Swear it in a god’s name, to a dark lord with a cause, or to the oath alone.' :
        b.cls === 'Monk' ? 'Some monasteries serve a god, like the monks of the Blooming Isle who serve Roselle. Choose one if your order does, or skip this.' :
        b.cls === 'Ranger' ? 'Some rangers honor a power of the wild or the sea: Roselle or Thorum, or their dark shadows. Choose one if yours does, or skip this.' :
        'Your power comes from the god you serve. ' + (b.cls === 'Cleric' ? 'Your god shapes which domain fits you best.' : 'Your oath is sworn in their name.')) + '</p>' +
        '<h2 class="sec-title">The gods of Akorianism</h2>' + choiceGrid(opts.filter(function (o) { return o.kind === 'god'; }).map(function (o) { return [o.name, o.about + (b.cls === 'Cleric' && o.domains ? ' · fits ' + o.domains : '')]; }), b.patron, 'bd-patron');
      var dem = opts.filter(function (o) { return o.kind === 'demon'; });
      if (dem.length) html += '<h2 class="sec-title" style="margin-top:16px">The Hollow Court</h2>' + (isPact ? '' : '<p class="note">Serving a demon lord is heresy in Doresmere. Talk to your DM before you choose one.</p>') + choiceGrid(dem.map(function (o) { return [o.name, o.about]; }), b.patron, 'bd-patron');
      if (b.cls === 'Paladin') html += '<h2 class="sec-title" style="margin-top:16px">No god</h2>' + choiceGrid([[OATH_ONLY, 'Your power comes from your conviction alone']], b.patron, 'bd-patron');
      if (b.cls === 'Paladin' && b.patron === OATH_ONLY) html += '<h2 class="sec-title" style="margin-top:16px">Your oath</h2><p class="note">With no god behind you, your oath is everything. Write what it demands of you.</p>' +
        '<div class="field"><label for="bd-oath" class="sr">Your oath</label><textarea id="bd-oath" data-build="oath" maxlength="1500" placeholder="I swear to…">' + esc(b.oath || '') + '</textarea></div>' +
        '<h2 class="sec-title" style="margin-top:16px">Its drawbacks</h2><p class="note">What your oath will never allow, and what it costs you.</p>' +
        '<div class="field"><label for="bd-drawbacks" class="sr">Drawbacks</label><textarea id="bd-drawbacks" data-build="drawbacks" maxlength="1500" placeholder="I may never…">' + esc(b.drawbacks || '') + '</textarea></div>';
      else if (b.cls === 'Paladin' && b.patron) {
        var bt = patronTenets(b.patron);
        html += '<h2 class="sec-title" style="margin-top:16px">' + esc(b.patron) + '’s wishes</h2><p class="note">Your oath is to follow them.</p>' + (bt ? '<div class="prose tenets">' + rich(bt) + '</div>' : '<p class="note">Your DM will make them known.</p>');
      }
      if (b.cls !== 'Paladin' && b.patron) {
        var bt2 = patronTenets(b.patron);
        if (bt2) html += '<h2 class="sec-title" style="margin-top:16px">What ' + esc(b.patron) + ' asks of you</h2><div class="prose tenets">' + rich(bt2) + '</div>';
      }
      if (!devotionRequired(b.cls)) html += '<div class="actions"><button type="button" class="btn small quiet" data-act="bd-patron" data-val="">' + (b.patron ? 'Clear my choice' : 'Skip: no god') + '</button></div>';
    } else if (step === 'Species') {
      html += '<p class="guide">Your species shapes your body and some of your gifts. Draconic races are hated in the empire but not forbidden, and elves are rarely seen.</p>' +
        choiceGrid(Object.keys(RULES.species).map(function (k) { var sp = RULES.species[k]; return [k, sp.size + ' · ' + sp.speed + ' ft' + (sp.dark ? ' · darkvision' : '')]; }), b.species, 'bd-species');
      var sp = RULES.species[b.species];
      if (sp) html += '<div class="group-box"><h2>' + esc(b.species) + '</h2><div class="tbl">' + (sp.dark ? '<div class="tbl-row"><div class="main"><b>Darkvision</b><span>' + sp.dark + ' feet</span></div></div>' : '') +
        sp.traits.map(function (t) { return '<div class="tbl-row"><div class="main"><b>' + esc(t[0]) + '</b><span>' + esc(t[1]) + '</span></div></div>'; }).join('') + '</div></div>';
    } else if (step === 'Background') {
      html += '<p class="guide">Your background is the life you had before adventuring. It gives you two skills.</p>' +
        choiceGrid(Object.keys(RULES.backgrounds).map(function (k) { return [k, RULES.backgrounds[k].join(', ')]; }), b.bg, 'bd-bg');
    } else if (step === 'Abilities') {
      html += buildAbilitiesHtml(b, cd);
    } else if (step === 'Skills') {
      var fixed = buildFixedSkills(b), need = cd.skills.n + ((RULES.species[b.species] || {}).extraSkill || 0);
      var pool = (cd.skills.from === 'any' ? SKILLS.map(function (k) { return k[0]; }) : cd.skills.from);
      var extraAny = (RULES.species[b.species] || {}).extraSkill || 0;
      if (extraAny) pool = SKILLS.map(function (k) { return k[0]; });
      html += '<p class="guide">You’re proficient in skills you’ve trained: you add your proficiency bonus to those checks. ' + (fixed.length ? 'You already have <b>' + esc(fixed.join(', ')) + '</b> from your background' + ((RULES.species[b.species] || {}).skill ? ' and species' : '') + '. ' : '') +
        'Pick ' + need + ' more' + (extraAny ? ' (your class picks, plus ' + extraAny + ' of any skill from your species)' : ' from the ' + b.cls + ' list') + '.</p>' +
        '<p class="note">' + b.skills.length + ' of ' + need + ' chosen</p><div class="chips">' + pool.filter(function (k) { return fixed.indexOf(k) < 0; }).map(function (k) {
          var on = b.skills.indexOf(k) >= 0;
          return '<button type="button" class="chip pick" data-act="bd-skill" data-val="' + esc(k) + '" aria-pressed="' + on + '">' + esc(k) + '</button>';
        }).join('') + '</div>';
    } else if (step === 'Spells') {
      html += buildSpellsHtml(b);
    } else {
      html += buildReviewHtml(b);
    }
    var err = buildStepError(b);
    html += '<div class="actions build-nav">' + (b.step > 0 ? '<button type="button" class="btn" data-act="bd-back">Back</button>' : '<a class="btn" href="#/characters">Cancel</a>') +
      (step === 'Review' ? '<button type="button" class="btn primary" data-act="bd-create">Create character</button>' : '<button type="button" class="btn primary" data-act="bd-next">Next</button>') + '</div>' +
      (err && step !== 'Review' ? '<p class="note" style="text-align:right">' + esc(err) + '</p>' : '') + '</div>';
    $view.innerHTML = html;
  }

  function classCard(cls) {
    var cd = RULES.classes[cls], m = RULES.magic.mana[cls], ch = RULES.magic.charges[cls] || [[], 0];
    var saves = cd.saves.map(function (k) { return ABILITIES.filter(function (a) { return a[0] === k; })[0][1]; }).join(', ');
    return '<div class="group-box"><h2>' + esc(cls) + '</h2><div class="vitals sum">' + vital('Hit die', 'd' + cd.hd) + vital('Mana', m ? m[0] + ' +' + m[1] + '/lvl' : '—') + vital('Class list', 'to ' + ordinal(listCap(cls))) + vital(cd.subclassLabel, 'Level ' + cd.subclassLevel) + '</div>' +
      '<div class="tbl" style="margin-top:10px">' +
      '<div class="tbl-row"><div class="main"><b>Saving throws</b><span>' + esc(saves) + '</span></div></div>' +
      '<div class="tbl-row"><div class="main"><b>Armor and weapons</b><span>' + esc(cd.armor + '. ' + cd.weapons + '.' + (cd.tools ? ' ' + cd.tools + '.' : '')) + '</span></div></div>' +
      '<div class="tbl-row"><div class="main"><b>High magic</b><span>' + (ch[0].length ? ch[0].length + ' High Magic ' + (ch[0].length === 1 ? 'Charge' : 'Charges') + ' by level ' + ch[0][ch[0].length - 1] + (ch[1] ? ', and a Reality Channel at ' + ch[1] : '') : 'None: this class never casts above 5th level') + '</span></div></div>' +
      cd.features.filter(function (f) { return f[0] === 1; }).map(function (f) { return '<div class="tbl-row"><div class="main"><b>' + esc(f[1]) + '</b><span>' + esc(f[2]) + '</span></div></div>'; }).join('') + '</div></div>';
  }

  function buildAbilitiesHtml(b, cd) {
    var html = '<p class="guide">Your six abilities. ' + esc(b.cls) + 's lean on <b>' + esc(cd.primary) + '</b>, so put a high score there. Then add +2 to one ability and +1 to another.</p>' +
      '<div class="seg wide" role="group" aria-label="How to set scores">' + [['array', 'Standard array'], ['pointbuy', 'Point buy'], ['roll', 'Rolled at the table'], ['manual', 'Enter my own']].map(function (m) {
        return '<button type="button" data-act="bd-method" data-val="' + m[0] + '" aria-pressed="' + (b.method === m[0]) + '">' + m[1] + '</button>';
      }).join('') + '</div>';
    if (b.method === 'array' || b.method === 'roll') {
      var rolledAll = b.method === 'roll' && b.rolls.length === 6 && b.rolls.every(function (v) { return v >= 3 && v <= 18; });
      var vals = b.method === 'roll' ? (rolledAll ? b.rolls : []) : RULES.standardArray;
      if (b.method === 'roll') {
        html += '<p class="note">Roll 4d6 at the table and drop the lowest die, six times. Type the six totals here, then assign them.</p><div class="roll-in">' +
          [0, 1, 2, 3, 4, 5].map(function (i) { return '<label class="sr" for="bd-r' + i + '">Score ' + (i + 1) + '</label><input type="number" class="input mini" id="bd-r' + i + '" data-bd-roll="' + i + '" min="3" max="18" inputmode="numeric" value="' + (b.rolls[i] || '') + '">'; }).join('') + '</div>';
      } else html += '<p class="note">Assign 15, 14, 13, 12, 10 and 8, one to each ability.</p>';
      if (vals.length) {
        var used = {}; ABILITIES.forEach(function (a) { if (num(b.assign[a[0]], 0)) used[b.assign[a[0]]] = a[0]; });
        html += '<div class="ab-assign">' + ABILITIES.map(function (a) {
          return '<div class="field"><label for="as-' + a[0] + '">' + a[1] + '</label><select id="as-' + a[0] + '" data-assign="' + a[0] + '"><option value="">—</option>' + vals.map(function (v, i) {
            var key = String(i + 1), taken = used[key] && used[key] !== a[0];
            return '<option value="' + key + '"' + (String(b.assign[a[0]]) === key ? ' selected' : '') + (taken ? ' disabled' : '') + '>' + v + '</option>';
          }).join('') + '</select></div>';
        }).join('') + '</div>';
      }
    } else if (b.method === 'pointbuy') {
      html += '<p class="note">' + (RULES.pointBuyBudget - pointsSpent(b)) + ' of ' + RULES.pointBuyBudget + ' points left. Scores run from 8 to 15.</p><div class="tbl">' + ABILITIES.map(function (a) {
        var v = num(b.pb[a[0]], 8);
        return '<div class="tbl-row"><div class="main"><b>' + a[1] + '</b></div><button type="button" class="btn small" data-act="bd-pb" data-ab="' + a[0] + '" data-dir="-1"' + (v <= 8 ? ' disabled' : '') + ' aria-label="Lower ' + a[1] + '">−</button><span class="num" style="min-width:28px;text-align:center">' + v + '</span><button type="button" class="btn small" data-act="bd-pb" data-ab="' + a[0] + '" data-dir="1"' + (v >= 15 ? ' disabled' : '') + ' aria-label="Raise ' + a[1] + '">+</button></div>';
      }).join('') + '</div>';
    } else {
      html += '<div class="ab-assign">' + ABILITIES.map(function (a) { return '<div class="field"><label for="mn-' + a[0] + '">' + a[1] + '</label><input type="number" id="mn-' + a[0] + '" data-manual="' + a[0] + '" min="3" max="20" value="' + num(b.manual[a[0]], 10) + '" inputmode="numeric"></div>'; }).join('') + '</div>';
    }
    var opt = function (cur, other) { return '<option value="">—</option>' + ABILITIES.map(function (a) { return '<option value="' + a[0] + '"' + (cur === a[0] ? ' selected' : '') + (other === a[0] ? ' disabled' : '') + '>' + a[1] + '</option>'; }).join(''); };
    html += '<div class="two"><div class="field"><label for="bd-p2">+2 to</label><select id="bd-p2" data-build="plus2">' + opt(b.plus2, b.plus1) + '</select></div><div class="field"><label for="bd-p1">+1 to</label><select id="bd-p1" data-build="plus1">' + opt(b.plus1, b.plus2) + '</select></div></div>';
    html += '<div id="bd-scores">' + buildScoresHtml(b) + '</div>';
    return html;
  }
  function buildScoresHtml(b) {
    var sc = buildScores(b);
    return '<div class="abilities">' + ABILITIES.map(function (a) { var v = sc[a[0]]; return '<div class="ab"><span class="k">' + a[0] + '</span><span class="mod">' + (v ? signed(mod(v)) : '—') + '</span><span class="score">' + (v || '—') + '</span></div>'; }).join('') + '</div>';
  }

  function buildSpellsHtml(b) {
    var n = buildSpellNeeds(b), have = buildSpellCounts(b);
    if (spells === null) return '<div class="empty">Opening the spell tomes…</div>';
    var list = spells.filter(function (sp) { return sp.status === 'approved' && (sp.classes || []).indexOf(b.cls) >= 0 && sp.level <= 1; });
    var html = '<p class="guide">Pick your starting magic from the ' + esc(b.cls) + ' list: up to <b>' + n.cantrips + ' cantrips</b> (free to cast) and <b>' + n.first + ' 1st-level spells</b> (5 mana each). Everything else you find in tomes as you adventure. You can skip this and pick later.</p>' +
      '<p class="note">' + have.cantrips + ' of ' + n.cantrips + ' cantrips · ' + have.first + ' of ' + n.first + ' 1st-level</p>';
    [0, 1].forEach(function (L) {
      var group = list.filter(function (sp) { return sp.level === L; });
      if (!group.length) { html += '<p class="note">No ' + (L ? '1st-level spells' : 'cantrips') + ' on the ' + esc(b.cls) + ' list.</p>'; return; }
      html += '<h2 class="sec-title" style="margin-top:14px">' + (L ? '1st level' : 'Cantrips') + '</h2><div class="chips">' + group.map(function (sp) {
        var on = b.spells.indexOf(sp.name) >= 0, full = !on && (L ? have.first >= n.first : have.cantrips >= n.cantrips);
        return '<button type="button" class="chip pick" data-act="bd-spell" data-val="' + esc(sp.name) + '" aria-pressed="' + on + '"' + (full ? ' disabled' : '') + ' title="' + esc(sp.school) + '">' + esc(sp.name) + '</button>';
      }).join('') + '</div>';
    });
    return html;
  }

  function buildSheet(b) {
    var cd = RULES.classes[b.cls], sc = buildScores(b), spc = RULES.species[b.species] || {};
    var s = defaultSheet();
    s.built = true; s.cls = b.cls; s.species = b.species; s.background = b.bg; s.level = 1; s.patron = devotionLabel(b.cls) ? b.patron : ''; if (SUB_STEP[b.cls]) s.subclass = b.sub || ''; s.oath = b.cls === 'Paladin' && b.patron === OATH_ONLY ? String(b.oath || '').trim() : ''; s.drawbacks = b.cls === 'Paladin' && b.patron === OATH_ONLY ? String(b.drawbacks || '').trim() : '';
    s.abilities = sc;
    var con = mod(sc.con), dex = mod(sc.dex);
    s.hp.max = s.hp.cur = Math.max(1, cd.hd + con);
    s.speed = spc.speed || 30;
    s.ac = b.cls === 'Barbarian' ? 10 + dex + con : b.cls === 'Monk' ? 10 + dex + mod(sc.wis) : b.species === 'Lizardfolk' ? 13 + dex : 10 + dex;
    s.mana.max = s.mana.cur = autoMana(b.cls, 1) || 0;
    cd.saves.forEach(function (k) { s.saves[k] = true; });
    buildFixedSkills(b).concat(b.skills).forEach(function (k) { s.skills[k] = 1; });
    s.spells = b.spells.map(function (n) { var sp = spellByName(n); return { name: n, level: sp ? sp.level : 0, school: sp ? sp.school : '', source: 'Class' }; });
    s.log = [{ level: 1, text: 'Created with the character builder.' }];
    return s;
  }
  function buildReviewHtml(b) {
    var s = buildSheet(b), cd = RULES.classes[b.cls];
    return '<p class="guide">Here’s ' + esc(b.name) + '. Create the character, then add armor, weapons and gear on the sheet.</p>' +
      '<div class="group-box"><h2>' + esc(b.name) + '</h2><p class="who" style="margin:0 0 10px">Level 1 ' + esc(b.species + ' ' + b.cls) + ' · ' + esc(b.bg) + (s.patron ? ' · ' + (s.patron === OATH_ONLY ? 'sworn to their oath' : (devotionLabel(b.cls) === 'Patron' ? 'pact with ' : 'serves ') + esc(s.patron)) : '') + '</p>' +
      (s.oath ? '<blockquote class="oath">' + esc(s.oath) + '</blockquote>' : '') + (s.drawbacks ? '<p class="note" style="margin:0 0 4px">Drawbacks</p><blockquote class="oath">' + esc(s.drawbacks) + '</blockquote>' : '') +
      '<div class="abilities">' + ABILITIES.map(function (a) { return '<div class="ab"><span class="k">' + a[0] + '</span><span class="mod">' + signed(mod(s.abilities[a[0]])) + '</span><span class="score">' + s.abilities[a[0]] + '</span></div>'; }).join('') + '</div>' +
      '<div class="vitals sum">' + vital('Hit points', s.hp.max) + vital('Mana', s.mana.max) + vital('Armor', s.ac) + vital('Speed', s.speed + ' ft') + '</div>' +
      '<div class="tbl" style="margin-top:10px"><div class="tbl-row"><div class="main"><b>Skills</b><span>' + esc(Object.keys(s.skills).sort().join(', ')) + '</span></div></div>' +
      '<div class="tbl-row"><div class="main"><b>Spells</b><span>' + esc(b.spells.join(', ') || 'None yet') + '</span></div></div>' +
      '<div class="tbl-row"><div class="main"><b>Next</b><span>' + (cd.subclassLevel === 1 ? '' : 'You choose your ' + cd.subclassLabel.toLowerCase() + ' at level ' + cd.subclassLevel + '. ') + 'Add your armor and weapons, and set your armor class if you wear armor.</span></div></div></div></div>';
  }

  /* ---------- Level-up guide ---------- */
  function renderLevelUp(id) {
    if (!loaded.chars) { $view.innerHTML = '<div class="page"><div class="empty">Loading character…</div></div>'; return; }
    var c = charById(id);
    if (!c || !canEditChar(c)) { location.replace('#/characters'); return; }
    var s = c.sheet = normSheet(c.sheet), cd = classOf(s);
    if (!cd) { $view.innerHTML = '<div class="page narrow"><div class="empty">Set a class on the sheet first, so the guide knows what you gain.</div><div class="actions"><a class="btn" href="#/c/' + encodeURIComponent(c.id) + '">Back to the sheet</a></div></div>'; return; }
    if (spells === null) loadSpells().then(render).catch(function () {});
    var cur = num(s.level, 1), nxt = cur + 1;
    if (cur >= 20) { $view.innerHTML = '<div class="page narrow"><div class="empty">' + esc(c.name) + ' is level 20. There’s nowhere higher to go.</div></div>'; return; }
    var L = ui.lvl && ui.lvl.id === c.id ? ui.lvl : (ui.lvl = { id: c.id, hp: 'avg', rolled: null, sub: '', subOther: '', asi: 'two', a: '', b: '', feat: '', spell: '' });
    var con = mod(s.abilities.con), avg = hdAvg(cd.hd);
    var hpGain = Math.max(1, (L.hp === 'roll' && L.rolled ? L.rolled : avg) + con);
    var m = RULES.magic.mana[s.cls], pbNow = profBonus(cur), pbNext = profBonus(nxt);
    var gains = cd.features.filter(function (f) { return f[0] === nxt; });
    var subNow = (RULES.subLevels[s.cls] || []).indexOf(nxt) >= 0;
    var needSub = !s.subclass && nxt >= cd.subclassLevel;
    var isAsi = cd.asi.indexOf(nxt) >= 0;
    var freePick = RULES.magic.freePickLevels.indexOf(nxt) >= 0;
    var hmGain = hmMax(s.cls, nxt) - hmMax(s.cls, cur), rcGain = rcMax(s.cls, nxt) - rcMax(s.cls, cur);
    var learnNow = learnableLevel(Object.assign({}, s, { level: nxt })), learnBefore = learnableLevel(s);

    var html = '<div class="page narrow"><p class="crumbs"><a href="#/c/' + encodeURIComponent(c.id) + '">' + esc(c.name) + '</a></p><h1 class="page-title">Level ' + nxt + ' ' + esc(s.cls) + '</h1>' +
      '<p class="guide">Here’s everything that changes at level ' + nxt + '. Make your choices, then tap “Level up”.</p>';
    html += '<section class="block"><h2 class="sec-title">What you gain</h2><div class="tbl">' +
      (m ? '<div class="tbl-row"><div class="main"><b>+' + m[1] + ' mana</b><span>Your pool grows to ' + autoMana(s.cls, nxt) + '.</span></div></div>' : '') +
      (pbNext > pbNow ? '<div class="tbl-row"><div class="main"><b>Proficiency bonus +' + pbNext + '</b><span>Every skill, save and attack you’re proficient in gets better by 1.</span></div></div>' : '') +
      (hmGain ? '<div class="tbl-row"><div class="main"><b>+1 High Magic Charge</b><span>You now hold ' + hmMax(s.cls, nxt) + '. Each one lets you cast a 6th to 8th-level spell, and they come back on a long rest.</span></div></div>' : '') +
      (rcGain ? '<div class="tbl-row"><div class="main"><b>A Reality Channel</b><span>Once per day, you can cast a 9th-level spell.</span></div></div>' : '') +
      (learnNow > learnBefore ? '<div class="tbl-row"><div class="main"><b>' + ordinal(learnNow) + '-level spells</b><span>You can now learn ' + ordinal(learnNow) + '-level spells' + (learnNow > listCap(s.cls) ? ' from tomes. They aren’t on your class list, so you’ll have to find and pay for them.' : ', from your class list or from tomes.') + '</span></div></div>' : '') +
      gains.map(function (f) { return '<div class="tbl-row"><div class="main"><b>' + esc(f[1]) + (f[3] ? ' <span class="tag" style="font-size:10px">Ask your DM</span>' : '') + '</b><span>' + esc(f[2]) + '</span></div></div>'; }).join('') +
      (function () {
        var cs = s.subclass ? customSub(s.cls, s.subclass) : null;
        if (cs) return (cs.features || []).filter(function (f) { return num(f.level, 0) === nxt; }).map(function (f) { return '<div class="tbl-row"><div class="main"><b>' + esc(f.name) + '</b><span>' + esc(f.text || '') + '</span></div></div>'; }).join('');
        return subNow && !needSub ? '<div class="tbl-row"><div class="main"><b>' + esc(s.subclass || cd.subclassLabel) + ' feature</b><span>Your ' + esc(cd.subclassLabel.toLowerCase()) + ' grants a new feature at this level. Add it under Features once you’ve read it.</span></div></div>' : '';
      })() +
      '</div></section>';

    html += '<section class="block"><h2 class="sec-title">Hit points</h2><p class="note">Each level you gain a hit die (d' + cd.hd + ') plus your Constitution modifier (' + signed(con) + '). Take the average for a safe number, or roll the die at the table.</p>' +
      '<div class="seg wide" role="group" aria-label="Hit points">' + '<button type="button" data-act="lv-hp" data-val="avg" aria-pressed="' + (L.hp === 'avg') + '">Average (' + avg + ')</button><button type="button" data-act="lv-hp" data-val="roll" aria-pressed="' + (L.hp === 'roll') + '">I rolled the d' + cd.hd + '</button></div>' +
      (L.hp === 'roll' ? '<div class="field" style="max-width:220px"><label for="lv-rolled">What did the d' + cd.hd + ' show?</label><input type="number" id="lv-rolled" min="1" max="' + cd.hd + '" inputmode="numeric" value="' + (L.rolled || '') + '"></div>' : '') +
      '<p><b>+' + hpGain + ' hit points</b>, for a new maximum of ' + (num(s.hp.max, 0) + hpGain) + '.</p></section>';

    if (needSub) {
      html += '<section class="block"><h2 class="sec-title">Choose your ' + esc(cd.subclassLabel.toLowerCase()) + '</h2><p class="note">This shapes the rest of your class. Read up on the options, or ask your DM about Avarenth versions.</p>' +
        '<div class="field"><label for="lv-sub">' + esc(cd.subclassLabel) + '</label><select id="lv-sub" data-lv="sub"><option value="">Choose…</option>' + subclassOptions(s.cls, s.patron).map(function (o) { return o.name; }).concat(['Other…']).map(function (x) { return '<option' + (L.sub === x ? ' selected' : '') + '>' + esc(x) + '</option>'; }).join('') + '</select></div>' +
        (L.sub === 'Other…' ? '<div class="field"><label for="lv-subo">Name</label><input type="text" id="lv-subo" data-lv="subOther" maxlength="60" value="' + esc(L.subOther) + '"></div>' : '') + '</section>';
    }
    if (isAsi) {
      var opt = function (cur) { return '<option value="">—</option>' + ABILITIES.map(function (a) { var v = num(s.abilities[a[0]], 10); return '<option value="' + a[0] + '"' + (cur === a[0] ? ' selected' : '') + (v >= 20 ? ' disabled' : '') + '>' + a[1] + ' (' + v + ')</option>'; }).join(''); };
      html += '<section class="block"><h2 class="sec-title">Ability score improvement</h2><p class="note">Raise one ability by 2, two abilities by 1 each, or take a feat instead. Scores can’t go above 20. Even numbers matter most: that’s when a modifier goes up.</p>' +
        '<div class="seg wide" role="group" aria-label="Improvement">' + [['two', '+1 and +1'], ['one', '+2 to one'], ['feat', 'A feat']].map(function (o) { return '<button type="button" data-act="lv-asi" data-val="' + o[0] + '" aria-pressed="' + (L.asi === o[0]) + '">' + o[1] + '</button>'; }).join('') + '</div>' +
        (L.asi === 'feat' ? '<div class="field"><label for="lv-feat">Feat</label><input type="text" id="lv-feat" data-lv="feat" maxlength="60" value="' + esc(L.feat) + '" placeholder="e.g. War Caster"><span class="hint">Check with your DM which feats are allowed.</span></div>'
          : '<div class="two"><div class="field"><label for="lv-a">' + (L.asi === 'one' ? '+2 to' : 'First +1') + '</label><select id="lv-a" data-lv="a">' + opt(L.a) + '</select></div>' + (L.asi === 'two' ? '<div class="field"><label for="lv-b">Second +1</label><select id="lv-b" data-lv="b">' + opt(L.b) + '</select></div>' : '') + '</div>') + '</section>';
    }
    var arcLevel = s.cls === 'Warlock' ? (RULES.magic.arcanum || {})[nxt] : 0;
    if (arcLevel) {
      var arcCand = (spells || []).filter(function (sp) { return sp.status === 'approved' && sp.level === arcLevel && !s.spells.some(function (x) { return x.name === sp.name; }); });
      html += '<section class="block"><h2 class="sec-title">Mystic Arcanum: your patron’s gift</h2><p class="note">Your patron teaches you a ' + ordinal(arcLevel) + '-level spell, no tome needed. It isn’t free. Every gift is a debt your patron will call in, and it leaves a mark on you that grows with each one. Agree the debt and the mark with your DM.</p>' +
        '<div class="field"><label for="lv-arc">Spell</label><select id="lv-arc" data-lv="arc"><option value="">Choose…</option>' + arcCand.map(function (sp) { return '<option' + (L.arc === sp.name ? ' selected' : '') + '>' + esc(sp.name) + '</option>'; }).join('') + '</select></div>' +
        '<div class="field"><label for="lv-debt">What your patron will ask in return</label><input type="text" id="lv-debt" data-lv="debt" maxlength="160" value="' + esc(L.debt || '') + '" placeholder="Leave blank: the DM names it later"></div>' +
        '<div class="field"><label for="lv-mark">The mark it leaves</label><input type="text" id="lv-mark" data-lv="mark" maxlength="160" value="' + esc(L.mark || '') + '" placeholder="e.g. Your reflection lags a moment behind you"></div></section>';
    }
    var secretGain = s.cls === 'Bard' ? num((RULES.magic.secrets || {})[nxt], 0) : 0;
    if (secretGain) html += '<section class="block"><h2 class="sec-title">Magical Secrets</h2><p class="note">You gain ' + secretGain + ' Magical Secrets. Learn them any time from the Spells tab: any class list, no tome needed, at half the learning cost.</p></section>';
    if (freePick) {
      var cand = (spells || []).filter(function (sp) { return sp.status === 'approved' && onClassList(sp, s.cls) && sp.level <= learnNow && !s.spells.some(function (x) { return x.name === sp.name; }); });
      html += '<section class="block"><h2 class="sec-title">A new class spell</h2><p class="note">You learn one spell from your class list for free. Pick it now, or save the pick for later from the sheet.</p>' +
        '<div class="field"><label for="lv-spell">Spell</label><select id="lv-spell" data-lv="spell"><option value="">Save it for later</option>' + [0, 1, 2, 3, 4, 5].map(function (lv) {
          var g = cand.filter(function (sp) { return sp.level === lv; });
          return g.length ? '<optgroup label="' + (lv ? ordinal(lv) + ' level' : 'Cantrips') + '">' + g.map(function (sp) { return '<option' + (L.spell === sp.name ? ' selected' : '') + '>' + esc(sp.name) + '</option>'; }).join('') + '</optgroup>' : '';
        }).join('') + '</select></div></section>';
    }
    var err = levelUpError(L, needSub, isAsi, !!arcLevel);
    html += '<p class="err" ' + (err ? '' : 'hidden') + '>' + esc(err) + '</p><div class="actions"><a class="btn" href="#/c/' + encodeURIComponent(c.id) + '">Cancel</a><button type="button" class="btn primary" data-act="lv-apply">Level up to ' + nxt + '</button></div></div>';
    $view.innerHTML = html;
  }
  function levelUpError(L, needSub, isAsi, needArc) {
    if (L.hp === 'roll' && !L.rolled) return 'Enter what your hit die rolled, or take the average.';
    if (needArc && !L.arc) return 'Choose the spell your patron grants.';
    if (needSub && (!L.sub || (L.sub === 'Other…' && !L.subOther.trim()))) return 'Choose your subclass.';
    if (isAsi) {
      if (L.asi === 'feat' && !L.feat.trim()) return 'Name your feat.';
      if (L.asi === 'one' && !L.a) return 'Pick an ability to raise.';
      if (L.asi === 'two' && (!L.a || !L.b || L.a === L.b)) return 'Pick two different abilities.';
    }
    return '';
  }
  function applyLevelUp(c) {
    var s = c.sheet, cd = classOf(s), L = ui.lvl;
    var cur = num(s.level, 1), nxt = cur + 1;
    var needSub = !s.subclass && nxt >= cd.subclassLevel, isAsi = cd.asi.indexOf(nxt) >= 0;
    var arcLevel = s.cls === 'Warlock' ? (RULES.magic.arcanum || {})[nxt] : 0;
    var err = levelUpError(L, needSub, isAsi, !!arcLevel);
    if (err) return toast(err);
    var conBefore = mod(s.abilities.con);
    var notes = [];
    if (isAsi) {
      if (L.asi === 'feat') { s.features.push({ name: L.feat.trim(), text: 'Feat taken at level ' + nxt + '.' }); notes.push('took the ' + L.feat.trim() + ' feat'); }
      else if (L.asi === 'one') { s.abilities[L.a] = Math.min(20, num(s.abilities[L.a], 10) + 2); notes.push('+2 ' + L.a.toUpperCase()); }
      else { s.abilities[L.a] = Math.min(20, num(s.abilities[L.a], 10) + 1); s.abilities[L.b] = Math.min(20, num(s.abilities[L.b], 10) + 1); notes.push('+1 ' + L.a.toUpperCase() + ', +1 ' + L.b.toUpperCase()); }
    }
    var gain = Math.max(1, (L.hp === 'roll' && L.rolled ? L.rolled : hdAvg(cd.hd)) + conBefore);
    // A higher Constitution raises hit points for every level, past ones included.
    var conAfter = mod(s.abilities.con), retro = (conAfter - conBefore) * cur;
    s.hp.max = num(s.hp.max, 0) + gain + retro;
    s.hp.cur = num(s.hp.cur, 0) + gain + retro;
    notes.unshift('+' + (gain + retro) + ' hit points');
    if (needSub) { s.subclass = L.sub === 'Other…' ? L.subOther.trim() : L.sub; notes.push('chose ' + s.subclass); }
    var before = manaMax(s);
    s.level = nxt;
    var after = manaMax(s);
    if (!s.mana.override) s.mana.cur = num(s.mana.cur, 0) + Math.max(0, after - before);
    if (RULES.magic.freePickLevels.indexOf(nxt) >= 0) {
      var sp = L.spell ? spellByName(L.spell) : null;
      if (sp) { s.spells.push({ name: sp.name, level: sp.level, school: sp.school, source: 'Class' }); notes.push('learned ' + sp.name); }
      else { s.picks = num(s.picks, 0) + 1; notes.push('saved a free spell pick'); }
    }
    if (arcLevel) {
      var asp = spellByName(L.arc);
      if (asp) {
        s.spells.push({ name: asp.name, level: asp.level, school: asp.school, source: 'Patron' });
        s.debts.push({ spell: asp.name, level: nxt, debt: (L.debt || '').trim(), mark: (L.mark || '').trim(), paid: false });
        notes.push('patron granted ' + asp.name + ', at a price');
      }
    }
    var sec = s.cls === 'Bard' ? num((RULES.magic.secrets || {})[nxt], 0) : 0;
    if (sec) { s.secretPicks = num(s.secretPicks, 0) + sec; notes.push('gained ' + sec + ' Magical Secrets'); }
    s.log.push({ level: nxt, text: notes.join('; ') + '.' });
    ui.lvl = null;
    saveCharSoon(c);
    toast(c.name + ' is now level ' + nxt);
    go('#/c/' + encodeURIComponent(c.id));
  }

  /* ---------- The sheet ---------- */
  function renderSheet(id) {
    if (!loaded.chars) { $view.innerHTML = '<div class="page"><div class="empty">Loading character…</div></div>'; return; }
    var c = charById(id);
    if (!c) { $view.innerHTML = '<div class="page narrow"><div class="empty">That character doesn’t exist, or it isn’t yours to see.</div><div class="actions"><a class="btn" href="#/characters">Back to characters</a></div></div>'; return; }
    var s = c.sheet = normSheet(c.sheet);
    if (spells === null) loadSpells().then(function () { if (parseRoute().name === 'c') render(); }).catch(function () {});
    var edit = ui.sheetEdit && canEditChar(c);
    var can = canEditChar(c);
    var cd = classOf(s);
    var pb = profBonus(s.level);
    var abil = {}; ABILITIES.forEach(function (a) { abil[a[0]] = mod(s.abilities[a[0]]); });
    var init = abil.dex + num(s.initBonus, 0);
    var perc = 10 + abil.wis + (num(s.skills['Perception'], 0) * pb);
    var mMax = manaMax(s);
    if (num(s.mana.cur, 0) > mMax) s.mana.cur = mMax;

    var who = ['Level ' + num(s.level, 1), s.species, s.cls, s.subclass ? '(' + s.subclass + ')' : '', s.background ? '· ' + s.background : ''].filter(Boolean).join(' ');
    var html = '<div class="page sheet" data-char="' + esc(c.id) + '">';
    html += '<div class="sheet-head"><div style="min-width:0"><p class="crumbs"><a href="#/characters">Characters</a>' + (c.owner_id !== uid() ? ' · ' + esc(memberName(c.owner_id)) : '') + '</p>';
    if (edit) html += '<div class="field" style="margin-top:6px"><label for="ch-name">Name</label><input type="text" id="ch-name" data-cf="name" value="' + esc(c.name) + '" maxlength="80"></div>';
    else html += '<h1>' + esc(c.name) + '</h1><p class="who" style="margin:4px 0 0">' + esc(who) + '</p>' + (s.patron ? '<p class="who" style="margin:2px 0 0">' + patronLine(s) + '</p>' : '');
    html += '</div><div class="actions">' + (can ? '<span class="saved" id="saved" aria-live="polite"></span>' +
      (cd && num(s.level, 1) < 20 && !edit ? '<a class="btn primary" href="#/level-up/' + encodeURIComponent(c.id) + '">Level up</a>' : '') +
      '<button type="button" class="btn' + (edit ? ' primary' : '') + '" data-act="sheet-edit">' + (edit ? 'Done editing' : 'Edit sheet') + '</button>' : '') +
      (c.ddb_url && /^https:\/\//i.test(c.ddb_url) ? '<a class="btn quiet" href="' + esc(c.ddb_url) + '" target="_blank" rel="noopener noreferrer">D&amp;D Beyond ↗</a>' : '') + '</div></div>';

    if (can && !edit) {
      var steps = nextSteps(c, s).slice(0, 3);
      if (steps.length) html += '<div class="next-steps"><b>Next steps</b><ul>' + steps.map(function (st) {
        var link = st[1] === 'level' ? ' <a href="#/level-up/' + encodeURIComponent(c.id) + '">Open the guide</a>' : st[1] === 'spells' ? ' <button type="button" class="linkish" data-act="sheet-tab" data-tab="Spells">Go to spells</button>' : '';
        return '<li>' + esc(st[0]) + link + '</li>';
      }).join('') + '</ul></div>';
    }

    if (edit) {
      html += '<div class="group-box"><h2>Basics</h2><datalist id="dl-classes">' + Object.keys(RULES.classes).map(function (k) { return '<option value="' + k + '">'; }).join('') + '</datalist>' +
        '<datalist id="dl-species">' + Object.keys(RULES.species).map(function (k) { return '<option value="' + k + '">'; }).join('') + '</datalist>' +
        '<datalist id="dl-subs">' + (cd ? subclassOptions(s.cls, s.patron).map(function (o) { return '<option value="' + esc(o.name) + '">'; }).join('') : '') + '</datalist>' +
        '<datalist id="dl-patrons">' + patronOptions(s.cls).map(function (p) { return p.name; }).concat(s.cls === 'Paladin' ? [OATH_ONLY] : []).map(function (n) { return '<option value="' + esc(n) + '">'; }).join('') + '</datalist>' +
        '<datalist id="dl-bgs">' + Object.keys(RULES.backgrounds).map(function (k) { return '<option value="' + k + '">'; }).join('') + '</datalist><div class="two">' +
        sheetInput('Species', 'species', s.species, '', 'dl-species') + sheetInput('Class', 'cls', s.cls, '', 'dl-classes') +
        sheetInput(cd ? cd.subclassLabel : 'Subclass', 'subclass', s.subclass, '', 'dl-subs') + sheetInput('Background', 'background', s.background, '', 'dl-bgs') +
        (devotionLabel(s.cls) || s.patron ? sheetInput(devotionLabel(s.cls) || 'Deity or patron', 'patron', s.patron, '', 'dl-patrons') : '') +
        sheetInput('Level', 'level', s.level, 'number') + sheetInput('Armor class', 'ac', s.ac, 'number') +
        sheetInput('Speed (ft)', 'speed', s.speed, 'number') + sheetInput('Initiative bonus', 'initBonus', s.initBonus, 'number') +
        '</div><p class="hint">To gain a level, use the level-up guide. It adds hit points, mana and choices for you. Changing the level here doesn’t.</p>' +
        '<div class="field"><label for="ch-camp">Campaign</label><select id="ch-camp" data-cf="campaign_id">' + campaignOptions(c.campaign_id, true, 'No campaign') + '</select></div><div class="field"><label for="ch-ddb">D&amp;D Beyond link (optional)</label><input type="url" id="ch-ddb" data-cf="ddb_url" value="' + esc(c.ddb_url || '') + '" placeholder="https://www.dndbeyond.com/characters/…"></div></div>';
    }

    html += '<div class="abilities">';
    ABILITIES.forEach(function (a) {
      html += '<div class="ab"><span class="k">' + a[0] + '</span><span class="mod">' + signed(abil[a[0]]) + '</span>' +
        (edit ? '<label class="sr" for="ab-' + a[0] + '">' + a[1] + ' score</label><input type="number" id="ab-' + a[0] + '" data-ab="' + a[0] + '" min="1" max="30" value="' + num(s.abilities[a[0]], 10) + '">' : '<span class="score">' + num(s.abilities[a[0]], 10) + '</span>') + '</div>';
    });
    var sa = spellAbilityMod(s, abil);
    html += '</div><div class="vitals">' +
      vital('Armor', num(s.ac, 10)) + vital('Initiative', signed(init)) + vital('Speed', num(s.speed, 30) + ' ft') + vital('Proficiency', signed(pb)) +
      (sa ? vital('Spell save DC', 8 + pb + sa.mod) + vital('Spell attack', signed(pb + sa.mod)) : '') + '</div>';

    var hpPct = Math.max(0, Math.min(100, Math.round(100 * num(s.hp.cur, 0) / Math.max(1, num(s.hp.max, 1)))));
    var mpPct = mMax > 0 ? Math.max(0, Math.min(100, Math.round(100 * num(s.mana.cur, 0) / mMax))) : 0;
    var hdLeft = Math.max(0, num(s.level, 1) - num(s.hd.used, 0));
    html += '<div class="pools">' +
      '<section class="pool" aria-label="Hit points"><div class="pool-top"><span class="k">Hit points</span><span class="v">' + num(s.hp.cur, 0) + ' <small>/ ' + num(s.hp.max, 0) + (num(s.hp.temp, 0) ? ' · ' + num(s.hp.temp, 0) + ' temp' : '') + '</small></span></div>' +
      '<div class="meter" role="img" aria-label="' + hpPct + '% health"><i style="width:' + hpPct + '%"></i></div>' +
      (can ? '<div class="pool-ctl"><label class="sr" for="hp-amt">Amount</label><input type="number" id="hp-amt" min="0" value="1" inputmode="numeric"><button type="button" class="btn small danger" data-act="hp" data-dir="-1">Damage</button><button type="button" class="btn small" data-act="hp" data-dir="1">Heal</button></div>' : '') +
      deathSavesHtml(s, can) +
      (cd ? '<p class="note" style="margin:6px 0 0">Hit dice: ' + hdLeft + ' of ' + num(s.level, 1) + ' (d' + cd.hd + ')' + (can && hdLeft ? ' · <button type="button" class="linkish" data-act="spend-hd">Spend one on a short rest</button>' : '') + '</p>' : '') +
      (edit ? '<div class="pool-edit"><label for="hp-max">Max</label><input type="number" id="hp-max" data-pool="hp.max" value="' + num(s.hp.max, 0) + '"><label for="hp-temp">Temp</label><input type="number" id="hp-temp" data-pool="hp.temp" value="' + num(s.hp.temp, 0) + '"></div>' : '') + '</section>' +
      '<section class="pool" aria-label="Mana"><div class="pool-top"><span class="k">Mana</span><span class="v">' + num(s.mana.cur, 0) + ' <small>/ ' + mMax + '</small></span></div>' +
      '<div class="meter mana" role="img" aria-label="' + mpPct + '% mana"><i style="width:' + mpPct + '%"></i></div>' +
      chargesHtml(s) +
      (can ? '<div class="pool-ctl"><label class="sr" for="mp-amt">Amount</label><input type="number" id="mp-amt" min="0" value="1" inputmode="numeric"><button type="button" class="btn small" data-act="mp" data-dir="-1">Spend</button><button type="button" class="btn small" data-act="mp" data-dir="1">Restore</button></div>' : '') +
      (edit ? '<div class="pool-edit"><label class="check"><input type="checkbox" id="mp-ovr" data-mana-override' + (s.mana.override ? ' checked' : '') + '> Set max by hand</label>' + (s.mana.override ? '<label for="mp-max">Max</label><input type="number" id="mp-max" data-pool="mana.max" value="' + num(s.mana.max, 0) + '">' : '<span class="note">' + (autoMana(s.cls, s.level) !== null ? 'Worked out from class and level.' : 'Set a class to work it out.') + '</span>') + '</div>' : '') + '</section></div>';
    html += resourcesHtml(s, can);
    html += conditionHtml(s, can);
    if (can) html += '<div class="actions rest-row"><button type="button" class="btn" data-act="short-rest">Short rest</button><button type="button" class="btn" data-act="long-rest">Long rest</button><span class="note">A long rest refills everything and gives back half your hit dice.</span></div>';

    var tabs = ['Actions', 'Spells', 'Skills', 'Inventory', 'Features', 'Reputation', 'Record', 'Notes'];
    if (tabs.indexOf(ui.sheetTab) < 0) ui.sheetTab = 'Actions';
    html += '<div class="subtabs" role="tablist">' + tabs.map(function (t) { return '<button type="button" role="tab" data-act="sheet-tab" data-tab="' + t + '" aria-selected="' + (ui.sheetTab === t) + '">' + t + '</button>'; }).join('') + '</div>';
    html += '<div role="tabpanel">' + sheetTab(c, s, edit, can, abil, pb, perc) + '</div>';

    if (edit) html += '<div class="actions" style="justify-content:flex-end"><button type="button" class="btn danger" data-act="delete-char" data-id="' + esc(c.id) + '">' + (ui.pendingDelete === c.id ? 'Tap again to delete' : 'Delete character') + '</button></div>';
    html += '</div>';
    $view.innerHTML = html;
  }
  /* Class resources from the D&D rules: only what this class has at this level. Spell slots are left out: mana replaces them. */
  /* ---------- Conditions, exhaustion, inspiration, death saves, carrying ---------- */
  var CONDITIONS = ['Blinded', 'Charmed', 'Deafened', 'Frightened', 'Grappled', 'Incapacitated', 'Invisible', 'Paralyzed', 'Petrified', 'Poisoned', 'Prone', 'Restrained', 'Stunned', 'Unconscious'];
  var EXHAUSTION = ['None', 'Disadvantage on ability checks', 'Speed halved', 'Disadvantage on attacks and saving throws', 'Hit point maximum halved', 'Speed reduced to 0', 'Death'];
  function pipsOf(n, filled, cls) { var out = ''; for (var i = 0; i < n; i++) out += '<i class="pip ' + cls + (i < filled ? ' on' : '') + '"></i>'; return out; }
  function deathSavesHtml(s, can) {
    if (num(s.hp.cur, 0) > 0) return '';
    var d = s.death, st = d.f >= 3 ? 'Dead.' : d.s >= 3 ? 'Stable. Unconscious, but no longer dying.' : 'Dying. Roll a death save at the start of each turn.';
    return '<div class="death"><div class="death-top"><span class="k">Death saves</span><span class="note">' + esc(st) + '</span></div>' +
      '<div class="death-pips"><span>Successes <span class="pips">' + pipsOf(3, d.s, 'ok') + '</span></span><span>Failures <span class="pips">' + pipsOf(3, d.f, 'bad') + '</span></span></div>' +
      (can && d.f < 3 && d.s < 3 ? '<p class="note" style="margin:0 0 6px">Roll a d20 at the table: 10 or higher is a success.</p><div class="pool-ctl"><button type="button" class="btn small" data-act="death" data-kind="s">Success</button><button type="button" class="btn small" data-act="death" data-kind="f">Failure</button><button type="button" class="btn small" data-act="death" data-kind="nat1">Natural 1</button><button type="button" class="btn small primary" data-act="death" data-kind="nat20">Natural 20</button></div>' : '') +
      (can && (d.s || d.f) ? '<button type="button" class="linkish" data-act="death" data-kind="reset">Clear</button>' : '') + '</div>';
  }
  function conditionHtml(s, can) {
    var active = s.conditions.filter(function (x) { return CONDITIONS.indexOf(x) >= 0; }), ex = s.exhaustion;
    var html = '<section class="pool cond-pool" aria-label="Condition"><div class="pool-top"><span class="k">Condition</span>' +
      (can ? '<button type="button" class="chip pick insp" data-act="inspiration" aria-pressed="' + s.inspiration + '">' + (s.inspiration ? '★ Inspired' : '☆ Inspiration') + '</button>' : (s.inspiration ? '<span class="tag ok">★ Inspired</span>' : '')) + '</div>';
    html += '<div class="res-row"><div class="main"><b>Exhaustion ' + ex + '</b><span>' + esc(ex ? EXHAUSTION.slice(1, ex + 1).join('; ') : 'None') + '</span></div>' +
      (can ? '<button type="button" class="btn small" data-act="exhaustion" data-dir="-1"' + (ex <= 0 ? ' disabled' : '') + ' aria-label="One less exhaustion">−</button><button type="button" class="btn small" data-act="exhaustion" data-dir="1"' + (ex >= 6 ? ' disabled' : '') + ' aria-label="One more exhaustion">+</button>' : '') + '</div>';
    if (can) html += '<div class="chips cond-chips">' + CONDITIONS.map(function (x) { return '<button type="button" class="chip pick" data-act="condition" data-name="' + x + '" aria-pressed="' + (active.indexOf(x) >= 0) + '">' + x + '</button>'; }).join('') + '</div>';
    else html += active.length ? '<div class="chips">' + active.map(function (x) { return '<span class="tag">' + x + '</span>'; }).join('') + '</div>' : '<p class="note" style="margin:6px 0 0">No conditions.</p>';
    return html + '</section>';
  }
  function itemWeight(it) {
    if (typeof it.w === 'number') return it.w;
    var k = String(it.name || '').toLowerCase(), cat = (window.AVARENTH_ITEMS || { items: [] }).items.filter(function (x) { return x.name.toLowerCase() === k; })[0];
    return cat && cat.weight ? cat.weight : 0;
  }
  function carrying(s) {
    var items = s.items.reduce(function (t, it) { return t + itemWeight(it) * Math.max(0, num(it.qty, 1)); }, 0);
    var coins = (num(s.coins.cp, 0) + num(s.coins.sp, 0) + num(s.coins.gp, 0) + num(s.coins.pp, 0)) / 50;
    var sp = RULES.species[s.species] || {}, powerful = (sp.traits || []).some(function (t) { return t[0] === 'Powerful Build'; });
    var cap = num(s.abilities.str, 10) * 15 * (powerful ? 2 : 1) * (sp.size === 'Small' ? 1 : 1);
    return { total: Math.round((items + coins) * 10) / 10, coins: Math.round(coins * 10) / 10, cap: cap, powerful: powerful };
  }
  var FONT_TO_MANA = 5, FONT_FROM_MANA = 6;   // Font of Magic, traded against mana instead of spell slots
  function byLevel(lvl, table) { var v = 0; table.forEach(function (t) { if (lvl >= t[0]) v = t[1]; }); return v; }
  function classResources(s) {
    var L = num(s.level, 1), cha = mod(s.abilities.cha), out = [];
    function add(key, name, max, rest, extra) { if (max === 'unlimited' || max > 0) out.push(Object.assign({ key: key, name: name, max: max, rest: rest }, extra || {})); }
    switch (s.cls) {
      case 'Barbarian': add('rage', 'Rage', L >= 20 ? 'unlimited' : byLevel(L, [[1, 2], [3, 3], [6, 4], [12, 5], [17, 6]]), 'long'); break;
      case 'Bard': add('insp', 'Bardic Inspiration', Math.max(1, cha), L >= 5 ? 'short' : 'long', { note: 'd' + byLevel(L, [[1, 6], [5, 8], [10, 10], [15, 12]]) }); break;
      case 'Cleric': add('cd', 'Channel Divinity', byLevel(L, [[2, 1], [6, 2], [18, 3]]), 'short'); break;
      case 'Druid': add('wild', 'Wild Shape', L >= 20 ? 'unlimited' : (L >= 2 ? 2 : 0), 'short'); break;
      case 'Fighter':
        add('wind', 'Second Wind', 1, 'short', { note: 'heal 1d10 + ' + L });
        add('surge', 'Action Surge', byLevel(L, [[2, 1], [17, 2]]), 'short');
        add('indom', 'Indomitable', byLevel(L, [[9, 1], [13, 2], [17, 3]]), 'long'); break;
      case 'Monk': add('ki', 'Ki', L >= 2 ? L : 0, 'short', { pool: true }); break;
      case 'Paladin':
        add('loh', 'Lay on Hands', 5 * L, 'long', { pool: true, note: 'hit points to heal' });
        add('sense', 'Divine Sense', Math.max(1, 1 + cha), 'long');
        add('cd', 'Channel Divinity', L >= 3 ? 1 : 0, 'short'); break;
      case 'Rogue': add('luck', 'Stroke of Luck', L >= 20 ? 1 : 0, 'short'); break;
      case 'Sorcerer': add('sp', 'Sorcery Points', L >= 2 ? L : 0, 'long', { pool: true, font: true, note: 'Font of Magic: 1 point = ' + FONT_TO_MANA + ' mana, ' + FONT_FROM_MANA + ' mana = 1 point' }); break;
    }
    return out;
  }
  function resourcesHtml(s, can) {
    var list = classResources(s);
    if (!list.length) return '';
    return '<section class="pool res-pool" aria-label="Class resources"><div class="pool-top"><span class="k">' + esc(s.cls) + ' resources</span></div>' + list.map(function (r) {
      var meta = (r.note ? r.note + ' · ' : '') + (r.rest === 'short' ? 'short or long rest' : 'long rest');
      if (r.max === 'unlimited') return '<div class="res-row"><div class="main"><b>' + esc(r.name) + '</b><span>Unlimited</span></div></div>';
      var used = Math.min(r.max, Math.max(0, num(s.res[r.key], 0))), left = r.max - used;
      var shown = r.pool || r.max > 6 ? '<span class="res-num">' + left + ' <small>/ ' + r.max + '</small></span>'
        : '<span class="pips" aria-label="' + left + ' of ' + r.max + ' left">' + Array.apply(null, Array(r.max)).map(function (_, i) { return '<i class="pip' + (i < left ? ' on' : '') + '"></i>'; }).join('') + '</span>';
      var ctl = '';
      if (can) ctl = (r.pool ? '<label class="sr" for="res-amt-' + r.key + '">Amount</label><input type="number" class="input mini" id="res-amt-' + r.key + '" min="1" value="1" inputmode="numeric">' : '') +
        '<button type="button" class="btn small" data-act="res" data-key="' + r.key + '" data-dir="-1"' + (left <= 0 ? ' disabled' : '') + '>Use</button>' +
        '<button type="button" class="btn small quiet" data-act="res" data-key="' + r.key + '" data-dir="1"' + (used <= 0 ? ' disabled' : '') + ' aria-label="Get one ' + esc(r.name) + ' back">+</button>';
      if (can && r.font) ctl += '<div class="font-row"><button type="button" class="btn small" data-act="font-magic" data-dir="to"' + (left <= 0 ? ' disabled' : '') + '>Points → mana</button><button type="button" class="btn small" data-act="font-magic" data-dir="from"' + (used <= 0 ? ' disabled' : '') + '>Mana → points</button></div>';
      return '<div class="res-row"><div class="main"><b>' + esc(r.name) + '</b><span>' + esc(meta) + '</span></div>' + shown + ctl + '</div>';
    }).join('') + '</section>';
  }
  function useResource(c, key, dir) {
    var s = c.sheet, r = classResources(normSheet(s)).filter(function (x) { return x.key === key; })[0];
    if (!r || r.max === 'unlimited') return;
    if (!s.res || typeof s.res !== 'object') s.res = {};
    var amt = 1;
    if (r.pool) { var inp = document.getElementById('res-amt-' + key); amt = Math.max(1, num(inp && inp.value, 1)); }
    var used = Math.max(0, num(s.res[key], 0));
    if (dir < 0) { if (r.max - used < amt) return toast('Only ' + (r.max - used) + ' ' + r.name + ' left.'); used += amt; }
    else used = Math.max(0, used - amt);
    s.res[key] = used;
    render(); saveCharSoon(c);
  }
  // Font of Magic. The amount box is how many sorcery points to trade.
  function fontOfMagic(c, dir) {
    var s = c.sheet, ns = normSheet(s), r = classResources(ns).filter(function (x) { return x.key === 'sp'; })[0];
    if (!r) return;
    if (!s.res || typeof s.res !== 'object') s.res = {};
    var inp = document.getElementById('res-amt-sp'), amt = Math.max(1, num(inp && inp.value, 1));
    var used = Math.max(0, num(s.res.sp, 0)), left = r.max - used, mMax = manaMax(ns), cur = num(s.mana.cur, 0);
    if (dir === 'to') {
      amt = Math.min(amt, left, Math.floor((mMax - cur) / FONT_TO_MANA));
      if (amt <= 0) return toast(left <= 0 ? 'No sorcery points left.' : 'Your mana is already full.');
      s.res.sp = used + amt; s.mana.cur = cur + amt * FONT_TO_MANA;
      toast(amt + ' sorcery point' + (amt === 1 ? '' : 's') + ' → ' + amt * FONT_TO_MANA + ' mana');
    } else {
      amt = Math.min(amt, used, Math.floor(cur / FONT_FROM_MANA));
      if (amt <= 0) return toast(used <= 0 ? 'Your sorcery points are already full.' : 'Not enough mana. It takes ' + FONT_FROM_MANA + ' per point.');
      s.res.sp = used - amt; s.mana.cur = cur - amt * FONT_FROM_MANA;
      toast(amt * FONT_FROM_MANA + ' mana → ' + amt + ' sorcery point' + (amt === 1 ? '' : 's'));
    }
    render(); saveCharSoon(c);
  }
  function shortRest(c) {
    var s = c.sheet, back = classResources(normSheet(s)).filter(function (r) { return r.rest === 'short' && num((s.res || {})[r.key], 0) > 0; });
    if (!s.res || typeof s.res !== 'object') s.res = {};
    back.forEach(function (r) { s.res[r.key] = 0; });
    toast(back.length ? 'Short rest. ' + back.map(function (r) { return r.name; }).join(', ') + ' back.' : 'Short rest. Spend hit dice to heal.');
    render(); saveCharSoon(c);
  }
  function chargesHtml(s) {
    var hm = hmMax(s.cls, s.level), rc = rcMax(s.cls, s.level);
    if (!hm && !rc) return '';
    var pips = function (total, used) { var out = ''; for (var i = 0; i < total; i++) out += '<i class="pip' + (i < total - used ? ' on' : '') + '"></i>'; return out; };
    return '<div class="charges">' + (hm ? '<span>High Magic <span class="pips" aria-label="' + (hm - num(s.charges.hm, 0)) + ' of ' + hm + ' left">' + pips(hm, num(s.charges.hm, 0)) + '</span></span>' : '') +
      (rc ? '<span>Reality Channel <span class="pips" aria-label="' + (rc - num(s.charges.rc, 0)) + ' of ' + rc + ' left">' + pips(rc, num(s.charges.rc, 0)) + '</span></span>' : '') + '</div>';
  }
  function sheetInput(label, key, val, type, list) {
    return '<div class="field"><label for="sf-' + key + '">' + label + '</label><input type="' + (type || 'text') + '" id="sf-' + key + '" data-sf="' + key + '" value="' + esc(val) + '"' + (type === 'number' ? ' inputmode="numeric"' : '') + (list ? ' list="' + list + '"' : '') + '></div>';
  }
  function vital(k, v) { return '<div class="vital"><span class="k">' + k + '</span><span class="v">' + esc(v) + '</span></div>'; }

  function attackLine(s, a, abil, pb) {
    var ab = abil[a.ab] || 0, hit = ab + (a.prof ? pb : 0) + num(a.bonus, 0);
    var dmg = (a.dmg || '').trim();
    var dmgMod = ab + num(a.bonus, 0);
    return { hit: signed(hit), dmg: dmg ? dmg + (dmgMod ? (dmgMod > 0 ? ' + ' : ' − ') + Math.abs(dmgMod) : '') : '' };
  }

  function sheetTab(c, s, edit, can, abil, pb, perc) {
    var html = '';
    if (ui.sheetTab === 'Actions') {
      html += '<section class="block" style="margin-top:12px"><h2 class="sec-title">Attacks</h2><div class="tbl">';
      if (!s.attacks.length) html += '<div class="empty">No attacks yet. Add your weapons below: the sheet works out your bonus to hit and your damage.</div>';
      s.attacks.forEach(function (a, i) {
        var l = attackLine(s, a, abil, pb);
        html += '<div class="tbl-row"><div class="main"><b>' + esc(a.name) + '</b><span>' + esc([l.dmg, a.notes].filter(Boolean).join(' · ')) + '</span></div><span class="num big">' + l.hit + '</span>' +
          (can ? '<button type="button" class="btn small quiet" data-act="rm" data-list="attacks" data-i="' + i + '" aria-label="Remove ' + esc(a.name) + '">✕</button>' : '') + '</div>';
      });
      var sa = spellAbilityMod(s, abil);
      if (sa && s.spells.length) html += '<div class="tbl-row"><div class="main"><b>Spell attack</b><span>Uses ' + sa.key.toUpperCase() + ' · save DC ' + (8 + pb + sa.mod) + '</span></div><span class="num big">' + signed(pb + sa.mod) + '</span></div>';
      html += '</div>';
      if (can) html += '<form class="inline-form attack-form" id="add-attack" novalidate style="margin-top:12px"><div class="field"><label for="at-name">Weapon or attack</label><input type="text" id="at-name" maxlength="60" placeholder="e.g. Longsword"></div>' +
        '<div class="field"><label for="at-ab">Ability</label><select id="at-ab">' + ABILITIES.map(function (a) { return '<option value="' + a[0] + '">' + a[0].toUpperCase() + '</option>'; }).join('') + '</select></div>' +
        '<div class="field"><label for="at-dmg">Damage</label><input type="text" id="at-dmg" maxlength="30" placeholder="1d8 slashing"></div>' +
        '<div class="field"><label for="at-bonus">Magic +</label><input type="number" id="at-bonus" value="0" min="0" max="5" inputmode="numeric"></div>' +
        '<label class="check"><input type="checkbox" id="at-prof" checked> Proficient</label><button type="submit" class="btn primary">Add</button></form>' +
        '<p class="note">Strength for most melee weapons, Dexterity for ranged and finesse weapons.</p>';
      html += '</section>';
      var feats = derivedFeatures(s).filter(function (f) { return !f.sub; });
      if (feats.length) html += '<section class="block"><h2 class="sec-title">Class and species features<small><button type="button" class="linkish" data-act="sheet-tab" data-tab="Features">All features</button></small></h2><div class="tbl">' +
        feats.slice(0, 6).map(function (f) { return '<div class="tbl-row"><div class="main"><b>' + esc(f.name) + '</b><span>' + esc(f.text) + '</span></div></div>'; }).join('') + '</div></section>';
    } else if (ui.sheetTab === 'Spells') {
      html += spellsTabHtml(c, s, edit, can);
    } else if (ui.sheetTab === 'Skills') {
      html += '<section class="block" style="margin-top:12px"><h2 class="sec-title">Saving throws</h2><div class="tbl">';
      ABILITIES.forEach(function (a) {
        var lvl = s.saves[a[0]] ? 1 : 0;
        html += '<div class="tbl-row"><div class="main"><b>' + a[1] + '</b></div>' + profBtn('save', a[0], lvl, can) + '<span class="num">' + signed(abil[a[0]] + lvl * pb) + '</span></div>';
      });
      html += '</div></section><section class="block" style="margin-top:18px"><h2 class="sec-title">Skills<small>Passive Perception ' + perc + '</small></h2><div class="tbl">';
      SKILLS.forEach(function (k) {
        var lvl = num(s.skills[k[0]], 0);
        html += '<div class="tbl-row"><div class="main"><b>' + k[0] + '</b><span>' + k[1].toUpperCase() + '</span></div>' + profBtn('skill', k[0], lvl, can) + '<span class="num">' + signed(abil[k[1]] + lvl * pb) + '</span></div>';
      });
      html += '</div></section>' + (can ? '<p class="note">Tap PROF to cycle: not proficient, proficient, expertise.</p>' : '');
    } else if (ui.sheetTab === 'Inventory') {
      var coinKeys = ['cp', 'sp', 'gp'].concat(num(s.coins.pp, 0) ? ['pp'] : []);
      html += '<div class="coins" style="margin-top:12px">' + coinKeys.map(function (k) {
        return '<div class="vital"><label class="k" for="coin-' + k + '">' + esc(coinName(k)) + '</label>' + (can ? '<input type="number" id="coin-' + k + '" data-coin="' + k + '" min="0" value="' + num(s.coins[k], 0) + '" inputmode="numeric">' : '<span class="v">' + num(s.coins[k], 0) + '</span>') + '</div>';
      }).join('') + '</div>';
      var carry = carrying(s), over = carry.total > carry.cap;
      html += '<div class="carry' + (over ? ' over' : '') + '"><div class="pool-top"><span class="k">Carrying</span><span class="v">' + carry.total + ' <small>/ ' + carry.cap + ' lb</small></span></div>' +
        '<div class="meter" role="img" aria-label="' + Math.min(100, Math.round(100 * carry.total / Math.max(1, carry.cap))) + '% of carrying capacity"><i style="width:' + Math.min(100, Math.round(100 * carry.total / Math.max(1, carry.cap))) + '%"></i></div>' +
        '<p class="note" style="margin:4px 0 0">' + (over ? 'Over capacity: speed drops to 5 feet until you lighten the load.' : 'Strength × 15' + (carry.powerful ? ', doubled for Powerful Build' : '') + '.') + (carry.coins ? ' Coins weigh ' + carry.coins + ' lb.' : '') + '</p></div>';
      html += '<div class="tbl" style="margin-top:12px">';
      if (!s.items.length) html += '<div class="empty">Nothing carried yet.</div>';
      s.items.forEach(function (it, i) {
        var iw = itemWeight(it);
        html += '<div class="tbl-row"><div class="main"><b>' + esc(it.name) + '</b>' + ((it.notes || iw) ? '<span>' + esc([it.notes, iw ? iw + ' lb' + (num(it.qty, 1) > 1 ? ' each' : '') : ''].filter(Boolean).join(' · ')) + '</span>' : '') + '</div>' +
          (edit ? '<label class="sr" for="iw-' + i + '">Weight in pounds</label><input type="number" class="input mini" id="iw-' + i + '" data-iw="' + i + '" value="' + (typeof it.w === 'number' ? it.w : '') + '" placeholder="' + (iw || 'lb') + '" min="0" step="0.25" inputmode="decimal">' : '') +
          (can ? '<button type="button" class="btn small" data-act="qty" data-i="' + i + '" data-dir="-1" aria-label="One fewer ' + esc(it.name) + '">−</button><span class="num" style="min-width:28px;text-align:center">' + num(it.qty, 1) + '</span><button type="button" class="btn small" data-act="qty" data-i="' + i + '" data-dir="1" aria-label="One more ' + esc(it.name) + '">+</button>' : '<span class="num">×' + num(it.qty, 1) + '</span>') +
          (edit ? '<button type="button" class="btn small danger" data-act="rm" data-list="items" data-i="' + i + '">Remove</button>' : '') + '</div>';
      });
      html += '</div>';
      if (can) html += '<form class="inline-form" id="add-item" novalidate style="margin-top:12px"><div class="field"><label for="it-name">Item</label><input type="text" id="it-name" maxlength="80"></div><div class="field"><label for="it-notes">Notes</label><input type="text" id="it-notes" maxlength="120"></div><div class="field"><label for="it-qty">Qty</label><input type="number" id="it-qty" min="1" value="1" inputmode="numeric"></div><div class="field"><label for="it-w">Lb each</label><input type="number" id="it-w" min="0" step="0.25" inputmode="decimal" placeholder="auto"></div><button type="submit" class="btn primary">Add</button></form>';
    } else if (ui.sheetTab === 'Reputation') {
      html += standingTabHtml(c, s);
    } else if (ui.sheetTab === 'Record') {
      var camp = c.campaign_id ? campaignById(c.campaign_id) : null;
      if (!camp) {
        html += '<div class="empty" style="margin-top:12px">This character isn’t in a campaign, so there’s no criminal record to show.</div>';
      } else {
        var mine = crimes.filter(function (x) { return x.campaign_id === camp.id && (x.character_id === c.id || !x.character_id) && (dmView() || !x.dm_only); });
        html += '<div style="margin-top:12px">' + summaryVitals(crimeSummary(mine)) + '</div><div class="tbl" style="margin-top:12px">' +
          (mine.length ? mine.map(function (x) { return crimeRow(x, false); }).join('') : '<div class="empty">A clean record. For now.</div>') + '</div>' +
          '<p class="note" style="margin-top:12px">Includes crimes charged to the whole party. <a href="#/crimes/' + encodeURIComponent(camp.slug) + '">Open the full tracker</a>.</p>';
      }
    } else if (ui.sheetTab === 'Features') {
      if (s.patron && s.cls !== 'Paladin' && s.patron !== OATH_ONLY) {
        var pt = patronTenets(s.patron), pinfo = patronInfo(s.patron), part = pinfo ? articleByTitle(pinfo.article) : null;
        html += '<section class="block" style="margin-top:12px"><h2 class="sec-title">' + (devotionLabel(s.cls) === 'Patron' ? 'Your pact' : 'Who you serve') + '</h2>' +
          '<p class="note" style="margin:0">' + (devotionLabel(s.cls) === 'Patron' ? 'Pact with ' : 'You serve ') + (part ? '<a class="link" href="#/a/' + encodeURIComponent(part.slug) + '">' + esc(s.patron) + '</a>' : esc(s.patron)) + '.</p>' +
          (pt ? '<div class="prose tenets">' + rich(pt) + '</div>' : '') + '</section>';
      }
      if (s.cls === 'Paladin' && s.patron && s.patron !== OATH_ONLY) {
        var st = patronTenets(s.patron);
        html += '<section class="block" style="margin-top:12px"><h2 class="sec-title">Oath</h2><p class="note" style="margin:0">Sworn to ' + esc(s.patron) + '. You follow their wishes.</p>' + (st ? '<div class="prose tenets">' + rich(st) + '</div>' : '') + '</section>';
      } else if ((s.cls === 'Paladin' && s.patron === OATH_ONLY) || s.oath || s.drawbacks) {
        var oathBox = function (key, label, ph) {
          return '<h3 class="kind-h">' + label + '</h3>' + (can
            ? '<div class="field"><label for="ch-' + key + '" class="sr">' + label + '</label><textarea id="ch-' + key + '" data-sf="' + key + '" maxlength="1500" placeholder="' + ph + '">' + esc(s[key] || '') + '</textarea></div>'
            : (s[key] ? '<blockquote class="oath">' + esc(s[key]) + '</blockquote>' : '<div class="empty">Not written yet.</div>'));
        };
        html += '<section class="block" style="margin-top:12px"><h2 class="sec-title">Oath</h2>' + oathBox('oath', 'What it demands', 'I swear to…') + oathBox('drawbacks', 'Its drawbacks', 'I may never…') +
          (can ? '<span class="hint">Saves automatically. Break it, and your DM will know.</span>' : '') + '</section>';
      }
      if (s.cls === 'Warlock' || s.debts.length) {
        html += '<section class="block debts" style="margin-top:12px"><h2 class="sec-title">Patron debts<small>' + s.debts.filter(function (d) { return !d.paid; }).length + ' owed</small></h2><div class="tbl">';
        if (!s.debts.length) html += '<div class="empty">Nothing owed. Yet.</div>';
        s.debts.forEach(function (d, i) {
          html += '<div class="tbl-row"><div class="main"><b>' + esc(d.spell || 'A favor') + (d.paid ? ' <span class="tag ok" style="font-size:10px">Paid</span>' : '') + '</b><span>Owed: ' + esc(d.debt || 'A favor, to be named by the patron') + '</span>' + (d.mark ? '<span>Mark: ' + esc(d.mark) + '</span>' : '') + '</div>' +
            (can ? '<button type="button" class="btn small" data-act="debt-paid" data-i="' + i + '">' + (d.paid ? 'Owed again' : 'Mark paid') + '</button>' : '') + (edit ? '<button type="button" class="btn small danger" data-act="rm" data-list="debts" data-i="' + i + '">Remove</button>' : '') + '</div>';
        });
        html += '</div>';
        if (can) html += '<form class="inline-form" id="add-debt" novalidate style="margin-top:10px"><div class="field"><label for="db-what">Debt</label><input type="text" id="db-what" maxlength="160" placeholder="What the patron asks"></div><div class="field"><label for="db-mark">Mark</label><input type="text" id="db-mark" maxlength="160"></div><button type="submit" class="btn">Add debt</button></form>';
        html += '</section>';
      }
      html += '<div class="stack" style="margin-top:12px">';
      var all = derivedFeatures(s);
      all.forEach(function (f) {
        html += '<section class="section feat"><h2>' + esc(f.name) + (f.ruling ? ' <span class="tag" style="font-size:10px">Ask your DM</span>' : '') + '<small>' + esc(f.src) + '</small></h2><div class="prose">' + rich(f.text) + '</div></section>';
      });
      s.features.forEach(function (f, i) {
        html += '<section class="section feat"><h2>' + esc(f.name) + '<small>Added' + (edit ? ' <button type="button" class="btn small danger" data-act="rm" data-list="features" data-i="' + i + '">Remove</button>' : '') + '</small></h2><div class="prose">' + rich(f.text) + '</div></section>';
      });
      if (!all.length && !s.features.length) html += '<div class="empty">No features yet. Set a class and species to fill these in.</div>';
      html += '</div>';
      if (all.some(function (f) { return f.ruling; })) html += '<p class="note">“Ask your DM” marks features written around 5e spell slots. Your DM decides how they work with mana.</p>';
      if (can) html += '<form class="form" id="add-feature" novalidate style="margin-top:12px"><div class="field"><label for="ft-name">Add a feature, feat or trait</label><input type="text" id="ft-name" maxlength="80"></div><div class="field"><label for="ft-text">Description</label><textarea id="ft-text"></textarea></div><div class="actions"><button type="submit" class="btn primary">Add feature</button></div></form>';
      if (s.log.length) html += '<section class="block"><h2 class="sec-title">Level history</h2><div class="tbl">' + s.log.slice().reverse().map(function (l) { return '<div class="tbl-row"><div class="main"><b>Level ' + l.level + '</b><span>' + esc(l.text) + '</span></div></div>'; }).join('') + '</div></section>';
    } else {
      html += '<div class="field" style="margin-top:12px"><label for="ch-notes">Notes</label>' + (can ? '<textarea id="ch-notes" data-sf="notes" style="min-height:240px" placeholder="Backstory, goals, people you’ve met, things to remember…">' + esc(s.notes) + '</textarea><span class="hint">Saves automatically.</span>' : '<div class="prose">' + (s.notes ? rich(s.notes) : '<p class="note">No notes.</p>') + '</div>') + '</div>';
    }
    return html;
  }

  function spellsTabHtml(c, s, edit, can) {
    var cap = listCap(s.cls), top = learnableLevel(s);
    var html = '<div class="vitals sum" style="margin-top:12px">' + vital('Class list', s.cls ? 'to ' + ordinal(cap) : '—') + vital('Can learn', top ? 'to ' + ordinal(top) : 'cantrips') + vital('Free picks', num(s.picks, 0)) + vital('Known', s.spells.length) + '</div>';
    var known = s.spells.map(function (sp, i) { return { sp: sp, i: i, lv: sp.level != null && sp.level !== '' ? num(sp.level, 0) : -1 }; }).sort(function (a, b) { return a.lv - b.lv || String(a.sp.name).localeCompare(b.sp.name); });
    if (!known.length) html += '<div class="empty" style="margin-top:12px">No spells yet.' + (can ? ' Tap “Learn a spell” to pick from your class list or tomes you’ve found.' : '') + '</div>';
    var lastLv = null;
    known.forEach(function (o) {
      var sp = o.sp, cost = spellCost(sp), lv = o.lv;
      if (lv !== lastLv) { html += '<h2 class="sec-title" style="margin-top:16px">' + (lv < 0 ? 'Other' : lv === 0 ? 'Cantrips' : ordinal(lv) + ' level') + '</h2>'; lastLv = lv; }
      var art = articleByTitle(sp.name || '');
      var nameHtml = art ? '<a class="link" href="#/a/' + encodeURIComponent(art.slug) + '">' + esc(sp.name) + '</a>' : esc(sp.name);
      var needs = lv >= 6 && lv <= 8 ? ' + 1 High Magic Charge' : lv === 9 ? ' + Reality Channel' : '';
      var blocked = num(s.mana.cur, 0) < cost || (lv >= 6 && lv <= 8 && hmMax(s.cls, s.level) - num(s.charges.hm, 0) <= 0) || (lv === 9 && rcMax(s.cls, s.level) - num(s.charges.rc, 0) <= 0);
      html += '<div class="tbl-row"><div class="main"><b>' + nameHtml + '</b><span>' + (cost ? cost + ' mana' : 'Free') + needs + (sp.school ? ' · ' + esc(sp.school) : '') + (sp.notes ? ' · ' + esc(sp.notes) : '') + '</span></div><span class="src ' + esc(sp.source) + '">' + esc(sp.source) + '</span>' +
        (edit ? '<button type="button" class="btn small danger" data-act="rm" data-list="spells" data-i="' + o.i + '" aria-label="Remove ' + esc(sp.name) + '">Remove</button>'
          : can ? '<button type="button" class="btn small" data-act="cast" data-i="' + o.i + '"' + (blocked ? ' disabled' : '') + '>Cast</button>' : '') + '</div>';
    });
    if (can) {
      html += '<div class="actions" style="margin-top:14px"><button type="button" class="btn' + (ui.spellPick ? '' : ' primary') + '" data-act="pick-toggle">' + (ui.spellPick ? 'Close' : 'Learn a spell') + '</button></div>';
      if (ui.spellPick) html += pickerHtml(s);
    }
    html += '<p class="note" style="margin-top:12px">Class spells come from your class list. Tome spells are ones you found, studied and paid to learn. See the <a href="#/a/mana-guide">Mana Guide</a>.</p>';
    return html;
  }

  function pickerHtml(s) {
    if (spells === null) return '<div class="empty">Opening the spell tomes…</div>';
    var P = ui.pick || (ui.pick = { mode: 'class', q: '', pay: true });
    var top = learnableLevel(s), cap = listCap(s.cls);
    var knownNames = s.spells.map(function (x) { return x.name; });
    var q = P.q.trim().toLowerCase();
    if (P.mode === 'secret' && !num(s.secretPicks, 0)) P.mode = 'class';
    var ownedT = (s.tomes || []).map(function (t) { return t.name; });
    var pool = spells.filter(function (sp) {
      if (sp.status !== 'approved' || knownNames.indexOf(sp.name) >= 0) return false;
      if (q && sp.name.toLowerCase().indexOf(q) < 0) return false;
      return P.mode === 'class' ? onClassList(sp, s.cls) : P.mode === 'tome' ? (ownedT.indexOf(sp.name) >= 0 || !onClassList(sp, s.cls)) : !onClassList(sp, s.cls);
    }).sort(function (a, b) { return (ownedT.indexOf(b.name) >= 0) - (ownedT.indexOf(a.name) >= 0); }).slice(0, 60);
    var html = '<div class="group-box picker"><h2>Learn a spell</h2>' +
      '<div class="seg wide" role="group" aria-label="Where from"><button type="button" data-act="pick-mode" data-val="class" aria-pressed="' + (P.mode === 'class') + '">My class list</button><button type="button" data-act="pick-mode" data-val="tome" aria-pressed="' + (P.mode === 'tome') + '">A tome I found</button>' + (num(s.secretPicks, 0) ? '<button type="button" data-act="pick-mode" data-val="secret" aria-pressed="' + (P.mode === 'secret') + '">Magical Secrets (' + s.secretPicks + ')</button>' : '') + '</div>' +
      '<p class="note">' + (P.mode === 'secret' ? 'A spell from any class list, learned through song and story: no tome needed, at half the learning cost.' : P.mode === 'class' ? 'Spells on the ' + esc(s.cls || 'class') + ' list, up to ' + ordinal(cap) + ' level. Use a free pick if you have one; otherwise it costs gold and study time, like a tome.' : 'Tomes in your pack come first. You can learn up to ' + (top ? ordinal(top) + ' level' : 'cantrips') + ' right now. It costs gold and study time; check with your DM that you have the tome.') + '</p>' +
      '<label class="search"><span class="sr">Search spells</span>' + SEARCH_ICON + '<input id="pick-q" type="search" placeholder="Search spells…" value="' + esc(P.q) + '" autocomplete="off"></label>' +
      '<label class="check" style="margin:8px 0"><input type="checkbox" id="pick-pay"' + (P.pay ? ' checked' : '') + '> Pay the learning cost from my ' + esc(coinName('gp')) + '</label><div class="tbl">';
    if (!pool.length) html += '<div class="empty">No spells match.</div>';
    pool.forEach(function (sp) {
      var ok = sp.level === 0 || sp.level <= top;
      var free = P.mode === 'class' && num(s.picks, 0) > 0;
      var costGp = RULES.magic.learnCost[sp.level] / (P.mode === 'secret' ? 2 : 1), hrs = RULES.magic.studyHours[sp.level];
      html += '<div class="tbl-row"><div class="main"><b>' + esc(sp.name) + (ownedT.indexOf(sp.name) >= 0 ? ' <span class="tag ok" style="font-size:10px">In your pack</span>' : '') + '</b><span>' + esc(levelText(sp.level) + ' · ' + sp.school) + ' · ' + (free ? 'free pick' : costGp + ' gp, ' + (hrs < 1 ? '30 min' : hrs + (hrs === 1 ? ' hour' : ' hours'))) + '</span></div>' + rarityTag(sp.rarity) +
        (ok ? '<button type="button" class="btn small primary" data-act="learn" data-name="' + esc(sp.name) + '" data-src="' + (P.mode === 'class' ? 'Class' : P.mode === 'secret' ? 'Secret' : 'Tome') + '">' + (free ? 'Take' : 'Learn') + '</button>' : '<span class="note">Level ' + RULES.magic.learnLevel[sp.level] + (sp.level >= 6 && !hmMax(s.cls, 20) ? ' · never' : '') + '</span>') + '</div>';
    });
    return html + '</div></div>';
  }

  function learnSpell(c, name, src) {
    var s = c.sheet, sp = spellByName(name);
    if (!sp) return;
    if (sp.level > learnableLevel(s) && sp.level > 0) return toast('You can’t learn ' + ordinal(sp.level) + '-level spells yet.');
    var free = src === 'Class' && num(s.picks, 0) > 0;
    var msg = 'Learned ' + sp.name;
    if (src === 'Secret') { if (!num(s.secretPicks, 0)) return; s.secretPicks = num(s.secretPicks, 0) - 1; }
    if (free) { s.picks = num(s.picks, 0) - 1; msg += ' (free pick)'; }
    else if (ui.pick && ui.pick.pay) {
      var cost = RULES.magic.learnCost[sp.level] / (src === 'Secret' ? 2 : 1);
      if (num(s.coins.gp, 0) < cost) return toast('You need ' + cost + ' ' + coinName('gp') + ' to learn it. Untick “Pay the learning cost” if your DM settles it another way.');
      s.coins.gp = num(s.coins.gp, 0) - cost; msg += ' for ' + cost + ' gp';
    }
    s.spells.push({ name: sp.name, level: sp.level, school: sp.school, source: src });
    toast(msg);
    render(); saveCharSoon(c);
  }
  function castSpell(c, i) {
    var s = c.sheet, sp = s.spells[i];
    if (!sp) return;
    var cost = spellCost(sp), lv = sp.level != null && sp.level !== '' ? num(sp.level, 0) : 0;
    if (num(s.mana.cur, 0) < cost) return toast('Not enough mana.');
    if (lv >= 6 && lv <= 8) { if (hmMax(s.cls, s.level) - num(s.charges.hm, 0) <= 0) return toast('No High Magic Charges left. They come back on a long rest.'); s.charges.hm = num(s.charges.hm, 0) + 1; }
    if (lv === 9) { if (rcMax(s.cls, s.level) - num(s.charges.rc, 0) <= 0) return toast('Your Reality Channel is spent until your next long rest.'); s.charges.rc = num(s.charges.rc, 0) + 1; }
    s.mana.cur = num(s.mana.cur, 0) - cost;
    toast('Cast ' + sp.name + (cost ? ' (−' + cost + ' mana)' : ''));
    render(); saveCharSoon(c);
  }
  function longRest(c) {
    var s = c.sheet;
    s.hp.cur = num(s.hp.max, 0); s.hp.temp = 0;
    s.mana.cur = manaMax(s);
    s.charges.hm = 0; s.charges.rc = 0;
    s.res = {};
    s.death = { s: 0, f: 0 };
    if (num(s.exhaustion, 0) > 0) s.exhaustion = num(s.exhaustion, 0) - 1;
    s.hd.used = Math.max(0, num(s.hd.used, 0) - Math.max(1, Math.floor(num(s.level, 1) / 2)));
    toast('Rested. Hit points, mana, charges and class resources restored.');
    render(); saveCharSoon(c);
  }
  function spendHitDie(c) {
    var s = c.sheet, cd = classOf(s);
    if (!cd || num(s.hd.used, 0) >= num(s.level, 1)) return;
    s.hd.used = num(s.hd.used, 0) + 1;
    toast('Hit die spent. Roll a d' + cd.hd + ' ' + signed(mod(s.abilities.con)) + ' at the table, then enter the total and tap Heal.');
    render(); saveCharSoon(c);
  }
  function profBtn(kind, key, lvl, can) {
    var label = lvl === 2 ? 'EXP' : lvl === 1 ? 'PROF' : '—';
    var aria = (lvl === 2 ? 'Expertise' : lvl === 1 ? 'Proficient' : 'Not proficient') + ' in ' + key;
    if (!can) return '<span class="prof" data-level="' + lvl + '" aria-label="' + esc(aria) + '">' + label + '</span>';
    return '<button type="button" class="prof" data-level="' + lvl + '" data-act="prof" data-kind="' + kind + '" data-key="' + esc(key) + '" aria-label="' + esc(aria) + '. Tap to change.">' + label + '</button>';
  }

  /* ================= Criminal record ================= */
  var SEVERITIES = ['Minor', 'Moderate', 'Serious', 'Major', 'Royal', 'Imperial'];
  var CRIME_STATUS = ['Unknown', 'Suspected', 'Wanted', 'Cleared'];

  // Totals for a set of entries. Cleared entries no longer count.
  function crimeSummary(list) {
    var active = list.filter(function (c) { return c.status !== 'Cleared'; });
    var bounty = 0, wanted = 0, suspected = 0, worst = -1;
    active.forEach(function (c) {
      bounty += num(c.bounty, 0);
      if (c.status === 'Wanted') wanted++;
      if (c.status === 'Suspected') suspected++;
      worst = Math.max(worst, SEVERITIES.indexOf(c.severity));
    });
    var status = wanted ? 'Wanted' : suspected ? 'Suspected' : active.length ? 'Unknown to the law' : 'Clean';
    return { bounty: bounty, wanted: wanted, worst: worst >= 0 ? SEVERITIES[worst] : 'None', status: status, count: active.length };
  }
  function sevTag(s) {
    var i = SEVERITIES.indexOf(s);
    var cls = i <= 0 ? 'plain' : i === 1 ? 'warn' : '';
    return '<span class="tag ' + cls + '"' + (i >= 3 ? ' style="background:var(--secret-bg)"' : '') + '>' + esc(s) + '</span>';
  }
  function crimeStatusTag(s) {
    var cls = s === 'Cleared' ? 'ok' : s === 'Unknown' ? 'plain' : s === 'Suspected' ? 'warn' : '';
    return '<span class="tag ' + cls + '">' + esc(s) + '</span>';
  }
  function campaignChars(campId) { return characters.filter(function (c) { return c.campaign_id === campId; }); }
  function charName(id) { var c = charById(id); return c ? c.name : 'Unknown character'; }

  function crimeRow(c, dm) {
    var who = c.character_id ? charName(c.character_id) : 'Whole party';
    var meta = [who, c.location, c.kind === 'contraband' ? 'Qty ' + num(c.quantity, 1) : '', c.notes].filter(Boolean).map(esc).join(' · ');
    var html = '<div class="tbl-row" style="flex-wrap:wrap"><div class="main" style="min-width:160px"><b>' + esc(c.title) + (c.dm_only ? ' <span class="tag" style="font-size:10px">DM only</span>' : '') + '</b><span>' + meta + '</span></div>' +
      '<span class="pill-row" style="align-items:center">' + sevTag(c.severity) + crimeStatusTag(c.status) + (num(c.bounty, 0) ? '<span class="num">' + num(c.bounty, 0) + ' gp</span>' : '') + '</span>';
    if (dm) {
      html += '<span class="pill-row" style="width:100%;padding-top:4px"><label class="sr" for="cs-' + c.id + '">Status</label><select class="input" id="cs-' + c.id + '" data-crime-status="' + esc(c.id) + '" style="width:auto;min-height:38px;font-size:14px;padding:4px 8px">' +
        CRIME_STATUS.map(function (s) { return '<option' + (s === c.status ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select>' +
        '<label class="sr" for="cb-' + c.id + '">Bounty</label><input type="number" class="input" id="cb-' + c.id + '" data-crime-bounty="' + esc(c.id) + '" min="0" value="' + num(c.bounty, 0) + '" style="width:96px;min-height:38px;font-size:14px;padding:4px 8px" inputmode="numeric" aria-label="Bounty in gold">' +
        '<button type="button" class="btn small danger" data-act="delete-crime" data-id="' + esc(c.id) + '">' + (ui.pendingDelete === c.id ? 'Tap again' : 'Remove') + '</button></span>';
    }
    return html + '</div>';
  }

  function summaryVitals(s) {
    return '<div class="vitals sum">' + vital('Status', s.status) + vital('Bounty', s.bounty + ' gp') + vital('Warrants', s.wanted) + vital('Worst', s.worst) + '</div>';
  }

  function renderCrimes(slug) {
    if (!loaded.wiki) { $view.innerHTML = '<div class="page"><div class="empty">Opening the archive…</div></div>'; return; }
    var camp = campaignBySlug(slug);
    if (!camp || !(isDM() || myCampaigns().indexOf(camp) >= 0)) { location.replace('#/wiki'); return; }
    var dm = dmView();
    var all = crimes.filter(function (c) { return c.campaign_id === camp.id && (dm || !c.dm_only); });
    var party = campaignChars(camp.id).filter(function (ch) { return isDM() || ch.owner_id === uid(); });
    var filter = ui.crimeFilter || 'all';
    var shown = all.filter(function (c) { return filter === 'all' || (filter === 'party' ? !c.character_id : c.character_id === filter); });

    var html = '<section class="hero"><div class="hero-in"><p class="crumbs"><a href="#/wiki">Avarenth</a> › <a href="#/campaign/' + encodeURIComponent(camp.slug) + '">' + esc(camp.name) + '</a></p><h1>Criminal Record</h1></div></section><div class="page">';
    html += '<section class="block"><h2 class="sec-title">The party<small>' + (dm ? 'Everything on record' : 'What you know') + '</small></h2>' + summaryVitals(crimeSummary(all)) + '</section>';
    if (party.length) {
      html += '<section class="block"><h2 class="sec-title">Members<small>Includes whole-party crimes</small></h2><div class="tbl">';
      party.forEach(function (ch) {
        var s = crimeSummary(all.filter(function (c) { return !c.character_id || c.character_id === ch.id; }));
        html += '<div class="tbl-row"><div class="main"><b>' + esc(ch.name) + '</b><span>Worst: ' + esc(s.worst) + ' · ' + s.count + ' active</span></div>' + crimeStatusTag(s.status === 'Unknown to the law' ? 'Unknown' : s.status === 'Clean' ? 'Cleared' : s.status) + '<span class="num">' + s.bounty + ' gp</span></div>';
      });
      html += '</div></section>';
    }
    html += '<div class="pill-row" role="group" aria-label="Show entries for">' +
      [['all', 'Everything'], ['party', 'Whole party']].concat(party.map(function (ch) { return [ch.id, ch.name]; })).map(function (f) {
        return '<button type="button" class="opt" style="width:auto;min-height:40px;font-family:var(--ui);font-size:13px" data-act="crime-filter" data-f="' + esc(f[0]) + '" aria-pressed="' + (filter === f[0]) + '">' + esc(f[1]) + '</button>';
      }).join('') + '</div>';
    ['crime', 'contraband'].forEach(function (k) {
      var list = shown.filter(function (c) { return c.kind === k; });
      html += '<section class="block"><h2 class="sec-title">' + (k === 'crime' ? 'Crimes' : 'Contraband') + '<small>' + list.length + '</small></h2>' +
        (list.length ? '<div class="tbl">' + list.map(function (c) { return crimeRow(c, dm); }).join('') + '</div>' : '<div class="empty">' + (k === 'crime' ? 'No crimes on record.' : 'No contraband on record.') + '</div>') + '</section>';
    });
    if (dm) {
      html += '<form class="form group-box" id="crime-form" novalidate data-camp="' + esc(camp.id) + '"><h2>Log an entry</h2>' +
        '<div class="two"><div class="field"><label for="cr-kind">Type</label><select id="cr-kind"><option value="crime">Crime</option><option value="contraband">Contraband</option></select></div>' +
        '<div class="field"><label for="cr-who">Who</label><select id="cr-who"><option value="">Whole party</option>' + campaignChars(camp.id).map(function (ch) { return '<option value="' + esc(ch.id) + '">' + esc(ch.name) + '</option>'; }).join('') + '</select></div></div>' +
        '<div class="field"><label for="cr-title">Crime or item</label><input type="text" id="cr-title" maxlength="80" placeholder="e.g. Theft, Spider eggs"></div>' +
        '<div class="field"><label for="cr-loc">Where</label><input type="text" id="cr-loc" maxlength="80" placeholder="e.g. Marloo"></div>' +
        '<div class="two"><div class="field"><label for="cr-sev">Severity</label><select id="cr-sev">' + SEVERITIES.map(function (s) { return '<option>' + s + '</option>'; }).join('') + '</select></div>' +
        '<div class="field"><label for="cr-status">Authorities</label><select id="cr-status">' + CRIME_STATUS.map(function (s) { return '<option>' + s + '</option>'; }).join('') + '</select></div>' +
        '<div class="field"><label for="cr-bounty">Bounty (gp)</label><input type="number" id="cr-bounty" min="0" value="0" inputmode="numeric"></div>' +
        '<div class="field"><label for="cr-qty">Quantity</label><input type="number" id="cr-qty" min="0" value="1" inputmode="numeric"></div></div>' +
        '<div class="field"><label for="cr-notes">Notes</label><input type="text" id="cr-notes" maxlength="200"></div>' +
        '<label class="check"><input type="checkbox" id="cr-dm">DM only (players never see this entry)</label>' +
        '<div class="actions"><button type="submit" class="btn primary">Add to record</button></div></form>';
      html += '<p class="note">Grading and punishments are in the <a href="#/a/crime-and-punishment">Crime and Punishment</a> article.</p>';
    }
    html += '</div>';
    $view.innerHTML = html;
  }

  function saveCrime(form) {
    var title = document.getElementById('cr-title').value.trim();
    if (!title) { toast('Name the crime or item first.'); return document.getElementById('cr-title').focus(); }
    var row = {
      campaign_id: form.getAttribute('data-camp'),
      character_id: document.getElementById('cr-who').value || null,
      kind: document.getElementById('cr-kind').value,
      title: title,
      location: document.getElementById('cr-loc').value.trim(),
      severity: document.getElementById('cr-sev').value,
      status: document.getElementById('cr-status').value,
      bounty: Math.max(0, num(document.getElementById('cr-bounty').value, 0)),
      quantity: Math.max(0, num(document.getElementById('cr-qty').value, 1)),
      notes: document.getElementById('cr-notes').value.trim(),
      dm_only: document.getElementById('cr-dm').checked
    };
    sb.from('crimes').insert(row).then(function (r) {
      if (r.error) return fail(r.error, 'Could not add that entry.');
      loadCrimes().then(function () { toast('Added to the record'); render(); });
    });
  }

  function updateCrime(id, patch) {
    sb.from('crimes').update(patch).eq('id', id).then(function (r) {
      if (r.error) return fail(r.error, 'Could not update that entry.');
      loadCrimes().then(render);
    });
  }

  /* ================= Maps ================= */
  function mapById(id) { for (var i = 0; i < maps.length; i++) if (maps[i].id === id) return maps[i]; return null; }
  function mapsFor(campId) { return maps.filter(function (m) { return (m.campaign_id || null) === (campId || null) && (dmView() || m.visible_to_players); }); }
  function mapList(list) {
    return '<div class="list">' + list.map(function (m) {
      return '<a class="row" href="#/map/' + encodeURIComponent(m.id) + '"><span class="row-main"><b>' + esc(m.name) + '</b><span>Map' + (dmView() && !m.visible_to_players ? ' · hidden from players' : '') + '</span></span></a>';
    }).join('') + '</div>';
  }
  function mapImageUrl(path) {
    var hit = mapUrls[path];
    if (hit && hit.until > Date.now()) return Promise.resolve(hit.url);
    return sb.storage.from('maps').createSignedUrl(path, 3600).then(function (r) {
      if (r.error) throw r.error;
      mapUrls[path] = { url: r.data.signedUrl, until: Date.now() + 50 * 60 * 1000 };
      return r.data.signedUrl;
    });
  }

  function markerLabel(mk) {
    if (mk.kind === 'party') return 'The party';
    if (mk.kind === 'character') return charName(mk.character_id);
    return mk.label || 'Pin';
  }

  function renderMap(id) {
    if (!loaded.wiki || !loaded.maps) { $view.innerHTML = '<div class="page"><div class="empty">Unrolling the map…</div></div>'; return; }
    var m = mapById(id);
    if (!m) { $view.innerHTML = '<div class="page narrow"><div class="empty">That map doesn’t exist, or it isn’t shared with you.</div><div class="actions"><a class="btn" href="#/wiki">Back</a></div></div>'; return; }
    var camp = m.campaign_id ? campaignById(m.campaign_id) : null;
    var dm = dmView();
    var zoom = ui.mapZoom || 1;
    var list = markers[m.id];
    if (!list || grids[m.id] === undefined) {
      $view.innerHTML = '<div class="page"><div class="empty">Unrolling the map…</div></div>';
      Promise.all([list ? null : loadMarkers(m.id), ensureGrid(m.id)]).then(function () { if (parseRoute().arg === m.id) render(); }).catch(function (e) { fail(e); });
      return;
    }
    var hiddenKind = function (mk) { return mk.kind === 'stop' || mk.kind === 'toll' || mk.kind === 'ruin'; };
    var stopCount = list.filter(hiddenKind).length;
    list = list.filter(function (mk) { return !hiddenKind(mk) || (dm && ui.showTowns) || (!dm && mk.kind === 'ruin' && mk.info && mk.info.found); });
    if (!dm) list = list.filter(function (mk) { return mk.kind === 'place' || (mk.kind === 'ruin' && mk.info && mk.info.found) || (m.show_markers && mk.kind !== 'toll' && mk.kind !== 'ruin'); });
    var placing = ui.placing && ui.placing.mapId === m.id ? ui.placing : null;
    var chars = camp ? campaignChars(camp.id) : characters;
    // The journey (if any) that uses this map.
    var tcamp = null, tstate = null;
    Object.keys(travel).forEach(function (cid) { var c0 = campaignById(cid); if (!tstate && travel[cid].map_id === m.id && c0 && (dm || myCampaigns().indexOf(c0) >= 0)) { tstate = travel[cid]; tcamp = c0; } });
    if (!tstate && camp && travel[camp.id]) { tstate = travel[camp.id]; tcamp = camp; }
    var showRoute = tstate && tstate.map_id === m.id && tstate.dest_x != null && (dm || m.show_markers);

    var html = '<div class="page" style="gap:16px"><div><p class="crumbs"><a href="#/wiki">Avarenth</a>' + (camp ? ' › <a href="#/campaign/' + encodeURIComponent(camp.slug) + '">' + esc(camp.name) + '</a>' : '') + '</p><h1 class="page-title">' + esc(m.name) + '</h1></div>';
    if (dm) {
      html += '<div class="actions"><button type="button" class="btn small' + (placing && placing.kind === 'party' ? ' primary' : '') + '" data-act="place" data-kind="party">Move party</button>' +
        (chars.length ? '<label class="sr" for="place-char">Move a character</label><select class="input" id="place-char" style="width:auto;min-height:36px;font-size:13px;padding:4px 8px"><option value="">Move character…</option>' + chars.map(function (c) { return '<option value="' + esc(c.id) + '">' + esc(c.name) + '</option>'; }).join('') + '</select>' : '') +
        '<button type="button" class="btn small' + (placing && placing.kind === 'place' ? ' primary' : '') + '" data-act="place" data-kind="place">+ Pin</button>' +
        '<button type="button" class="btn small' + (placing && placing.kind === 'toll' ? ' primary' : '') + '" data-act="place" data-kind="toll">+ Toll</button>' +
        '<button type="button" class="btn small' + (placing && placing.kind === 'ruin' ? ' primary' : '') + '" data-act="place" data-kind="ruin">+ Ruin</button>' +
        (tcamp ? '<button type="button" class="btn small' + (placing && placing.kind === 'dest' ? ' primary' : '') + '" data-act="place" data-kind="dest">Set destination</button>' : '') +
        '<button type="button" class="btn small' + (placing && placing.kind && placing.kind.indexOf('cal') === 0 ? ' primary' : '') + '" data-act="place" data-kind="cal1">Calibrate scale</button>' +
        (stopCount ? '<button type="button" class="btn small' + (ui.showTowns ? ' primary' : '') + '" data-act="show-towns" aria-pressed="' + !!ui.showTowns + '">' + (ui.showTowns ? 'Hide' : 'Show') + ' towns, tolls & ruins (' + stopCount + ')</button>' : '') +
        '<a class="btn small" href="#/map-edit/' + encodeURIComponent(m.id) + '">Edit map</a></div>' +
        (Number(m.miles_across) ? '<p class="note" style="margin:0">Scale: ' + Math.round(Number(m.miles_across)) + ' miles across.</p>' : '');
      if (tstate && tstate.map_id === m.id) html += '<div class="actions"><span class="tag plain" style="font-size:13px">Day ' + tstate.day + '</span><button type="button" class="btn small primary" data-act="next-day" data-camp="' + esc(tcamp.id) + '">Next day →</button><a class="btn small quiet" href="#/travel/' + encodeURIComponent(tcamp.slug) + '">Journey</a></div>';
      if (tstate && tstate.map_id === m.id) html += arrivalBlock(tcamp, true);
      else if (tcamp && !Number(m.miles_across)) html += '<p class="note" style="margin:0">Tip: set this map’s width in miles under Edit map so travel can be measured.</p>';
      if (placing) html += '<div class="empty" style="padding:10px 14px;border-style:solid;border-color:var(--accent);color:var(--text)">Tap the map to place <b>' + esc(placing.kind === 'party' ? 'the party' : placing.kind === 'dest' ? 'the destination' : placing.kind === 'cal1' ? 'one end of the scale bar (e.g. the 0)' : placing.kind === 'cal2' ? 'the other end of the scale bar' : placing.kind === 'character' ? charName(placing.characterId) : placing.kind === 'shop' ? (shopById(placing.shopId) || {}).name || 'the shop' : placing.kind === 'newshop' ? 'the new shop' : placing.kind === 'toll' ? 'the toll (on the bridge itself)' : placing.kind === 'ruin' ? 'the ruin' : placing.markerId ? 'this marker' : 'a new pin') + '</b>. <button type="button" class="btn small quiet" data-act="place-cancel">Cancel</button></div>';
    }
    html += '<div class="map-frame" id="map-frame"><div class="map-inner" id="map-inner" style="width:' + (zoom * 100) + '%"' + (placing ? ' data-placing="1"' : '') + '>' +
      '<img id="map-img" alt="' + esc(m.name) + '" draggable="false" style="aspect-ratio:' + (m.width && m.height ? m.width + '/' + m.height : 'auto') + '">';
    if (!dm && !m.show_markers && !(tstate && tstate.map_id === m.id)) {} // nothing extra for players
    if (showRoute) {
      var pmk = list.filter(function (mk) { return mk.kind === 'party'; })[0];
      var jr = pmk && grids[m.id] ? journey(tstate) : null;
      if (jr && jr.route) html += '<svg class="route" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true"><polyline points="' + jr.route.pts.filter(function (pt, i, a) { return i % 2 === 0 || i === a.length - 1; }).map(function (pt) { return (pt.x * 1000).toFixed(1) + ',' + (pt.y * 1000).toFixed(1); }).join(' ') + '" vector-effect="non-scaling-stroke"></polyline></svg>';
      else if (pmk) html += '<svg class="route" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true"><line x1="' + (pmk.x * 1000) + '" y1="' + (pmk.y * 1000) + '" x2="' + (tstate.dest_x * 1000) + '" y2="' + (tstate.dest_y * 1000) + '" vector-effect="non-scaling-stroke"></line></svg>';
      html += '<span class="dest" style="left:' + (tstate.dest_x * 100) + '%;top:' + (tstate.dest_y * 100) + '%"><span>' + esc(tstate.dest_label || 'Destination') + '</span></span>';
    }
    list.forEach(function (mk) {
      html += '<button type="button" class="pin pin-' + mk.kind + (ui.selectedMarker === mk.id ? ' sel' : '') + '" style="left:' + (mk.x * 100) + '%;top:' + (mk.y * 100) + '%" data-act="marker" data-id="' + esc(mk.id) + '" aria-label="' + esc(markerLabel(mk)) + '"><span>' + esc(markerLabel(mk)) + '</span></button>';
    });
    if (dm && loaded.shops) shops.filter(function (sp) { return sp.map_id === m.id && sp.map_x != null; }).forEach(function (sp) {
      html += '<button type="button" class="pin pin-shop' + (ui.selectedShop === sp.id ? ' sel' : '') + '" style="left:' + (sp.map_x * 100) + '%;top:' + (sp.map_y * 100) + '%" data-act="shop-pin" data-id="' + esc(sp.id) + '" aria-label="Shop: ' + esc(sp.name) + '"><span>' + esc(sp.name) + '</span></button>';
    });
    html += '</div></div><div class="actions" style="justify-content:flex-end"><button type="button" class="btn small" data-act="zoom" data-dir="-1" aria-label="Zoom out">−</button><span class="note">' + Math.round(zoom * 100) + '%</span><button type="button" class="btn small" data-act="zoom" data-dir="1" aria-label="Zoom in">+</button></div>';

    var sel = ui.selectedMarker ? list.filter(function (mk) { return mk.id === ui.selectedMarker; })[0] : null;
    if (ui.scale && ui.scale.mapId === m.id && ui.scale.b) {
      html += '<form class="form group-box" id="scale-form" novalidate><h2>Set the scale</h2><div class="field"><label for="sc-miles">How many miles between those two points?</label><input type="number" id="sc-miles" min="0" step="1" value="50" inputmode="decimal"></div>' +
        '<div class="actions"><button type="submit" class="btn primary">Save scale</button><button type="button" class="btn" data-act="scale-cancel">Cancel</button></div></form>';
    } else if (ui.pendingPin && ui.pendingPin.mapId === m.id) {
      html += '<form class="form group-box" id="pin-form" novalidate><h2>' + (ui.pendingPin.markerId ? 'Edit pin' : 'New pin') + '</h2>' +
        '<div class="field"><label for="pin-label">Name</label><input type="text" id="pin-label" maxlength="60" value="' + esc(ui.pendingPin.label || '') + '" placeholder="e.g. Marloo"></div>' +
        '<div class="field"><label for="pin-article">Links to article (optional)</label><input type="text" id="pin-article" list="pin-articles" value="' + esc(ui.pendingPin.articleTitle || '') + '" placeholder="Start typing a title"><datalist id="pin-articles">' + visibleArticles().map(function (a) { return '<option value="' + esc(a.title) + '"></option>'; }).join('') + '</datalist></div>' +
        '<div class="field"><label for="pin-map">Opens map (optional)</label><select id="pin-map"><option value="">None</option>' + maps.filter(function (x) { return x.id !== m.id; }).map(function (x) { return '<option value="' + esc(x.id) + '"' + (ui.pendingPin.targetMapId === x.id ? ' selected' : '') + '>' + esc(x.name) + '</option>'; }).join('') + '</select></div>' +
        '<div class="actions"><button type="submit" class="btn primary">Save pin</button><button type="button" class="btn" data-act="pin-cancel">Cancel</button></div></form>';
    } else if (dm && ui.selectedShop && shopById(ui.selectedShop) && shopById(ui.selectedShop).map_id === m.id) {
      var ssel = shopById(ui.selectedShop);
      html += '<section class="group-box"><h2>' + esc(ssel.name) + '</h2><p class="note" style="margin:0">' + esc([ssel.kind, ssel.keeper.replace(/\[\[|\]\]/g, '')].filter(Boolean).join(' · ')) + ' · ' + (ssel.stock || []).length + ' items</p><div class="actions">' +
        '<a class="btn small primary" href="#/shop/' + encodeURIComponent(ssel.id) + '">Open shop</a><button type="button" class="btn small" data-act="shop-place" data-id="' + esc(ssel.id) + '">Move</button>' +
        '<button type="button" class="btn small" data-act="shop-unpin" data-id="' + esc(ssel.id) + '">Take off map</button><button type="button" class="btn small quiet" data-act="shop-close">Close</button></div></section>';
    } else if (sel && sel.kind === 'ruin' && dm) {
      var ri = sel.info || {};
      html += '<form class="form group-box" id="ruin-form" novalidate data-id="' + esc(sel.id) + '"><h2>' + esc(sel.label || 'Ruin') + '</h2>' +
        '<p class="note" style="margin:0 0 8px">' + (ri.found ? 'The party has found this. Players see the pin.' : 'Only you see this until the party stops here.') + ' When their road passes close by, the day stops to ask whether they explore it.</p>' +
        '<div class="field"><label for="ru-name">Name</label><input type="text" id="ru-name" maxlength="80" value="' + esc(sel.label || '') + '"></div>' +
        '<div class="field"><label for="ru-desc">What’s there (only you see this)</label><textarea id="ru-desc" rows="4" maxlength="2000">' + esc(ri.desc || '') + '</textarea></div>' +
        '<label class="check"><input type="checkbox" id="ru-found"' + (ri.found ? ' checked' : '') + '> Found: players can see it</label>' +
        '<div class="actions"><button type="submit" class="btn primary">Save ruin</button><button type="button" class="btn small" data-act="marker-move" data-id="' + esc(sel.id) + '">Move</button>' +
        '<button type="button" class="btn small danger" data-act="marker-delete" data-id="' + esc(sel.id) + '">' + (ui.pendingDelete === sel.id ? 'Tap again' : 'Remove') + '</button><button type="button" class="btn small quiet" data-act="marker-close">Close</button></div></form>';
    } else if (sel && sel.kind === 'ruin') {
      html += '<div class="group-box"><h2 style="margin:0 0 4px">' + esc(sel.label || 'A ruin') + '</h2><p class="note" style="margin:0">The party found this place.</p><div class="actions"><button type="button" class="btn small quiet" data-act="marker-close">Close</button></div></div>';
    } else if (sel && sel.kind === 'toll' && dm) {
      var tl = tollOf(sel);
      html += '<form class="form group-box" id="toll-form" novalidate data-id="' + esc(sel.id) + '"><h2>' + esc(sel.label || 'Toll') + '</h2>' +
        '<p class="note" style="margin:0 0 8px">Only you see tolls. When the party’s road crosses one, the day stops to ask whether they pay.</p>' +
        '<div class="field"><label for="tl-name">Name</label><input type="text" id="tl-name" maxlength="60" value="' + esc(sel.label || '') + '" placeholder="e.g. Crownsgate bridge"></div>' +
        '<div class="two"><div class="field"><label for="tl-foot">Each on foot (cp)</label><input type="number" id="tl-foot" min="0" step="1" value="' + tl.foot + '" inputmode="numeric"></div>' +
        '<div class="field"><label for="tl-mount">Each riding or with a cart (cp)</label><input type="number" id="tl-mount" min="0" step="1" value="' + tl.mount + '" inputmode="numeric"></div></div>' +
        '<p class="note" style="margin:0">' + esc(coinName('cp')) + ': 1 cp. ' + esc(coinName('sp')) + ': 10 cp.</p>' +
        '<div class="actions"><button type="submit" class="btn primary">Save toll</button><button type="button" class="btn small" data-act="marker-move" data-id="' + esc(sel.id) + '">Move</button>' +
        '<button type="button" class="btn small danger" data-act="marker-delete" data-id="' + esc(sel.id) + '">' + (ui.pendingDelete === sel.id ? 'Tap again' : 'Remove') + '</button><button type="button" class="btn small quiet" data-act="marker-close">Close</button></div></form>';
    } else if (sel) {
      var art = null;
      if (sel.article_slug) art = articleBySlug(sel.article_slug);
      var tm = sel.target_map_id ? mapById(sel.target_map_id) : null;
      html += '<section class="group-box"><h2>' + esc(markerLabel(sel)) + '</h2><div class="actions">' +
        (art && (dm || !art.hidden) ? '<a class="btn small" href="#/a/' + encodeURIComponent(art.slug) + '">Read article</a>' : '') +
        (tm && (dm || tm.visible_to_players) ? '<a class="btn small" href="#/map/' + encodeURIComponent(tm.id) + '">Open ' + esc(tm.name) + '</a>' : '') +
        (dm ? '<button type="button" class="btn small" data-act="marker-move" data-id="' + esc(sel.id) + '">Move</button>' + (sel.kind === 'place' ? '<button type="button" class="btn small" data-act="pin-edit" data-id="' + esc(sel.id) + '">Edit</button>' : '') + '<button type="button" class="btn small danger" data-act="marker-delete" data-id="' + esc(sel.id) + '">' + (ui.pendingDelete === sel.id ? 'Tap again' : 'Remove') + '</button>' : '') +
        '<button type="button" class="btn small quiet" data-act="marker-close">Close</button></div>' +
        (dm && art && art.template === 'Settlement' && loaded.shops ? '<p class="eyebrow" style="margin:10px 0 4px;font-size:11px">Shops in ' + esc(art.title) + '</p>' + shopRows(shopsAt(art.id)) +
          '<div class="actions"><button type="button" class="btn small" data-act="new-shop" data-place="' + esc(art.id) + '" data-campaign="' + esc(art.campaign_id || m.campaign_id || '') + '">+ Shop in ' + esc(art.title) + '</button></div>' : '') + '</section>';
    }

    if (dm && loaded.shops) html += mapShopsSection(m);
    var people = list.filter(function (mk) { return mk.kind !== 'place' && mk.kind !== 'stop' && mk.kind !== 'toll' && mk.kind !== 'ruin'; });
    if (dm || m.show_markers) {
      html += '<section class="block"><h2 class="sec-title">Who’s here<small>' + (dm ? (m.show_markers ? 'Players can see these' : 'Only you can see these') : '') + '</small></h2>' +
        (people.length ? '<div class="pill-row">' + people.map(function (mk) { return '<button type="button" class="opt" style="width:auto;min-height:40px;font-family:var(--ui);font-size:13px" data-act="marker" data-id="' + esc(mk.id) + '">' + esc(markerLabel(mk)) + '</button>'; }).join('') + '</div>' : '<div class="empty">Nobody placed on this map yet.' + (dm ? ' Use “Move party” or pick a character above, then tap the map.' : '') + '</div>') + '</section>';
    }
    html += '</div>';
    $view.innerHTML = html;
    var frame = document.getElementById('map-frame');
    if (frame && ui.mapScroll && ui.mapScroll.id === m.id) { frame.scrollLeft = ui.mapScroll.left; frame.scrollTop = ui.mapScroll.top; }
    mapImageUrl(m.image_path).then(function (url) { var img = document.getElementById('map-img'); if (img) img.src = url; }).catch(function (e) { fail(e, 'Could not load the map image.'); });
  }

  function placeAt(m, x, y) {
    var p = ui.placing;
    ui.placing = null;
    if (p.kind === 'cal1') { ui.scale = { mapId: m.id, a: { x: x, y: y } }; ui.placing = { mapId: m.id, kind: 'cal2' }; return render(); }
    if (p.kind === 'cal2') { ui.scale.b = { x: x, y: y }; return render(); }
    if (p.kind === 'dest') {
      var tc = null;
      Object.keys(travel).forEach(function (cid) { if (!tc && travel[cid].map_id === m.id) tc = cid; });
      if (!tc && m.campaign_id && travel[m.campaign_id]) tc = m.campaign_id;
      if (!tc) return toast('This map isn’t part of a campaign journey.');
      var near = (markers[m.id] || []).filter(function (mk) { return mk.kind === 'place' || mk.kind === 'stop'; }).sort(function (a, b) { return Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y); })[0];
      var label = near && Math.hypot(near.x - x, near.y - y) < 0.04 ? near.label : (travel[tc].dest_label || '');
      if (near && label === near.label) { x = near.x; y = near.y; }
      return saveTravel(tc, { map_id: m.id, dest_x: x, dest_y: y, dest_label: label }).then(function () { toast('Destination set'); render(); });
    }
    if (p.kind === 'shop') {
      var psh = shopById(p.shopId);
      if (!psh) return render();
      return sb.from('shops').update({ map_id: m.id, map_x: x, map_y: y }).eq('id', psh.id).then(function (r) {
        if (r.error) return fail(r.error, 'Could not pin the shop.');
        psh.map_id = m.id; psh.map_x = x; psh.map_y = y; ui.selectedShop = psh.id; toast('Shop pinned'); render();
      });
    }
    if (p.kind === 'newshop') {
      var npl = settlementForMap(m);
      ui.newShop = { place: npl ? npl.id : '', campaign: m.campaign_id || (npl && npl.campaign_id) || '', map_id: m.id, x: x, y: y };
      return go('#/shop-edit/new');
    }
    if (p.kind === 'place' && !p.markerId) { ui.pendingPin = { mapId: m.id, x: x, y: y }; ui.selectedMarker = null; return render(); }
    if (p.kind === 'ruin' && !p.markerId) {
      ui.showTowns = true;
      return sb.from('map_markers').insert({ map_id: m.id, kind: 'ruin', label: 'A ruin', info: { desc: '', found: false }, x: x, y: y }).select('id').single().then(function (r) {
        if (r.error) return fail(r.error, 'Could not place the ruin.');
        ui.selectedMarker = r.data.id;
        loadMarkers(m.id).then(function () { toast('Ruin placed. Name it and describe it below.'); render(); });
      });
    }
    if (p.kind === 'toll' && !p.markerId) {
      ui.showTowns = true;
      return sb.from('map_markers').insert({ map_id: m.id, kind: 'toll', label: 'Toll bridge', toll: { foot: TOLL_DEFAULT.foot, mount: TOLL_DEFAULT.mount }, x: x, y: y }).select('id').single().then(function (r) {
        if (r.error) return fail(r.error, 'Could not place the toll.');
        ui.selectedMarker = r.data.id;
        loadMarkers(m.id).then(function () { toast('Toll placed. Name it and set the price below.'); render(); });
      });
    }
    var list = markers[m.id] || [];
    var existing = p.markerId ? list.filter(function (mk) { return mk.id === p.markerId; })[0]
      : list.filter(function (mk) { return mk.kind === p.kind && (p.kind !== 'character' || mk.character_id === p.characterId); })[0];
    var op = existing
      ? sb.from('map_markers').update({ x: x, y: y }).eq('id', existing.id)
      : sb.from('map_markers').insert({ map_id: m.id, kind: p.kind, character_id: p.kind === 'character' ? p.characterId : null, x: x, y: y });
    op.then(function (r) {
      if (r.error) return fail(r.error, 'Could not place that marker.');
      loadMarkers(m.id).then(function () { toast('Placed'); render(); });
    });
  }

  function saveScale() {
    var sc = ui.scale, m = mapById(sc.mapId);
    var miles = Number(document.getElementById('sc-miles').value);
    if (!(miles > 0)) return toast('Enter the miles the scale bar shows.');
    var ratio = m.width && m.height ? m.height / m.width : 1;
    var dx = sc.b.x - sc.a.x, dy = (sc.b.y - sc.a.y) * ratio;
    var span = Math.sqrt(dx * dx + dy * dy);
    if (span < 0.005) return toast('Those two taps were too close together. Try again, zoomed in.');
    var across = Math.round(miles / span);
    sb.from('maps').update({ miles_across: across }).eq('id', m.id).then(function (r) {
      if (r.error) return fail(r.error, 'Could not save the scale.');
      ui.scale = null;
      loadMaps().then(function () { toast('Scale set: ' + across + ' miles across'); render(); });
    });
  }

  function savePin() {
    var pp = ui.pendingPin;
    var m = mapById(pp.mapId);
    var label = document.getElementById('pin-label').value.trim();
    var artTitle = document.getElementById('pin-article').value.trim();
    var art = artTitle ? articleByTitle(artTitle) : null;
    if (artTitle && !art) return toast('No article with that exact title. Pick one from the list or leave it empty.');
    if (!label && art) label = art.title;
    if (!label) { toast('Give the pin a name.'); return document.getElementById('pin-label').focus(); }
    var row = { label: label, article_slug: art ? art.slug : null, target_map_id: document.getElementById('pin-map').value || null };
    var op = pp.markerId
      ? sb.from('map_markers').update(row).eq('id', pp.markerId)
      : sb.from('map_markers').insert(Object.assign({ map_id: m.id, kind: 'place', x: pp.x, y: pp.y }, row));
    op.then(function (r) {
      if (r.error) return fail(r.error, 'Could not save the pin.');
      ui.pendingPin = null;
      loadMarkers(m.id).then(function () { toast('Pin saved'); render(); });
    });
  }

  function renderMapEdit(id) {
    if (id && !loaded.maps) { $view.innerHTML = '<div class="page"><div class="empty">Opening the archive…</div></div>'; return; }
    var m = id ? mapById(id) : null;
    if (id && !m) { location.replace('#/wiki'); return; }
    var campId = m ? m.campaign_id : (ui.mapCampaign || null);
    $view.innerHTML = '<div class="page narrow"><form class="form" id="map-form" novalidate data-id="' + esc(m ? m.id : '') + '">' +
      '<div><p class="eyebrow">' + (m ? 'Edit map' : 'New map') + '</p><h1 class="page-title">' + (m ? esc(m.name) : 'Add a map') + '</h1></div>' +
      '<div class="field"><label for="mp-name">Name</label><input type="text" id="mp-name" maxlength="80" value="' + esc(m ? m.name : '') + '" placeholder="e.g. The Dornish Isles, Marloo"></div>' +
      '<div class="field"><label for="mp-file">' + (m ? 'Replace image (optional)' : 'Map image') + '</label><input type="file" id="mp-file" accept="image/png,image/jpeg,image/webp" class="input"><span class="hint">PNG, JPG or WebP, like an Inkarnate export. Big images are shrunk to 4096 px to save space.</span></div>' +
      '<div class="field"><label for="mp-miles">Width in miles</label><input type="number" id="mp-miles" min="0" step="1" value="' + esc(m ? (Number(m.miles_across) || '') : '') + '" placeholder="e.g. 300" inputmode="decimal"><span class="hint">How far it is from the left edge of the map to the right edge. Used to measure travel.</span></div>' +
      '<div class="field"><label for="mp-camp">Belongs to</label><select id="mp-camp">' + campaignOptions(campId, true, 'World map') + '</select></div>' +
      '<label class="check"><input type="checkbox" id="mp-visible"' + (!m || m.visible_to_players ? ' checked' : '') + '>Players can see this map</label>' +
      '<label class="check"><input type="checkbox" id="mp-markers"' + (m && m.show_markers ? ' checked' : '') + '>Players can see where the party and characters are</label>' +
      '<p class="err" id="mp-err" role="alert" hidden></p>' +
      '<div class="sticky-actions"><button type="submit" class="btn primary" id="mp-save">Save map</button><a class="btn" href="' + (m ? '#/map/' + encodeURIComponent(m.id) : '#/wiki') + '">Cancel</a>' +
      (m ? '<button type="button" class="btn danger" data-act="delete-map" data-id="' + esc(m.id) + '" style="margin-left:auto">' + (ui.pendingDelete === m.id ? 'Tap again to delete' : 'Delete') + '</button>' : '') + '</div></form></div>';
  }

  // Shrink to at most 4096 px on the long side and re-encode, so maps stay well inside the free storage.
  function prepareImage(file) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        var scale = Math.min(1, 4096 / Math.max(img.naturalWidth, img.naturalHeight));
        var w = Math.round(img.naturalWidth * scale), h = Math.round(img.naturalHeight * scale);
        var cv = document.createElement('canvas');
        cv.width = w; cv.height = h;
        cv.getContext('2d').drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        cv.toBlob(function (blob) {
          if (blob && blob.type === 'image/webp') return resolve({ blob: blob, w: w, h: h, ext: 'webp', type: 'image/webp' });
          cv.toBlob(function (jpg) { jpg ? resolve({ blob: jpg, w: w, h: h, ext: 'jpg', type: 'image/jpeg' }) : reject(new Error('Could not read that image.')); }, 'image/jpeg', 0.88);
        }, 'image/webp', 0.88);
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('That file isn’t an image this browser can read.')); };
      img.src = url;
    });
  }

  function saveMap(form) {
    var id = form.getAttribute('data-id');
    var name = document.getElementById('mp-name').value.trim();
    var file = document.getElementById('mp-file').files[0];
    var $err = document.getElementById('mp-err');
    var show = function (msg) { $err.textContent = msg; $err.hidden = false; btn.disabled = false; btn.textContent = 'Save map'; };
    var btn = document.getElementById('mp-save');
    if (!name) return show('Give the map a name.');
    if (!id && !file) return show('Choose a map image.');
    var row = { name: name, campaign_id: document.getElementById('mp-camp').value || null, visible_to_players: document.getElementById('mp-visible').checked, show_markers: document.getElementById('mp-markers').checked, miles_across: Math.max(0, Number(document.getElementById('mp-miles').value) || 0) };
    btn.disabled = true; btn.textContent = file ? 'Uploading…' : 'Saving…';
    var mapId = id || (window.crypto && crypto.randomUUID ? crypto.randomUUID() : null);
    if (!mapId) return show('This browser is too old to upload maps.');
    var old = id ? mapById(id) : null;
    var step = file ? prepareImage(file).then(function (img) {
      var path = mapId + '-' + Date.now() + '.' + img.ext;
      return sb.storage.from('maps').upload(path, img.blob, { contentType: img.type, upsert: false }).then(function (r) {
        if (r.error) throw r.error;
        row.image_path = path; row.width = img.w; row.height = img.h;
      });
    }) : Promise.resolve();
    step.then(function () {
      return id ? sb.from('maps').update(row).eq('id', id) : sb.from('maps').insert(Object.assign({ id: mapId }, row));
    }).then(function (r) {
      if (r.error) throw r.error;
      if (old && row.image_path && old.image_path) sb.storage.from('maps').remove([old.image_path]);
      return loadMaps();
    }).then(function () { toast('Map saved'); go('#/map/' + encodeURIComponent(mapId)); })
      .catch(function (e) { console.error(e); show(e && e.message ? e.message : 'Could not save the map.'); });
  }

  /* ================= Spell tomes ================= */
  var RARITIES = ['Common', 'Uncommon', 'Rare', 'Very Rare', 'Legendary'];
  var SPELL_CLASSES = ['Artificer', 'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'];
  var SCHOOLS = ['Abjuration', 'Conjuration', 'Divination', 'Enchantment', 'Evocation', 'Illusion', 'Necromancy', 'Transmutation'];
  var SPELL_COLS = 'name, level, school, classes, book, ritual, concentration, rarity, notes, homebrew, status, submitted_by, casting_time, spell_range, components, duration, description, dm_note, created_at';
  function loadSpells() {
    return sb.from('spells').select(SPELL_COLS).order('level').order('name').then(function (r) {
      if (r.error) throw r.error;
      spells = r.data || [];
    });
  }
  function spellByName(n) { return (spells || []).filter(function (x) { return x.name === n; })[0] || null; }
  function pendingSpells() { return (spells || []).filter(function (x) { return x.status === 'pending'; }); }
  function rarityTag(r) { return '<span class="tag rar rar-' + String(r || '').toLowerCase().replace(/\s+/g, '-') + '">' + esc(r) + '</span>'; }
  function levelText(l) { return Number(l) === 0 ? 'Cantrip' : 'Level ' + l; }
  function filteredSpells() {
    var f = ui.spellFilter, q = f.q.trim().toLowerCase();
    return (spells || []).filter(function (sp) {
      if (sp.status !== 'approved') return false;
      if (q && sp.name.toLowerCase().indexOf(q) < 0) return false;
      if (f.rarity && sp.rarity !== f.rarity) return false;
      if (f.level !== '' && String(sp.level) !== f.level) return false;
      if (f.cls === '_tome' ? (sp.classes || []).length : (f.cls && (sp.classes || []).indexOf(f.cls) < 0)) return false;
      if (f.school && sp.school !== f.school) return false;
      if (f.src === 'official' && sp.homebrew) return false;
      if (f.src === 'homebrew' && !sp.homebrew) return false;
      return true;
    });
  }
  // The rules text a homebrew spell carries (official spells only link to their book).
  function spellDetails(sp) {
    var bits = [['Casting time', sp.casting_time], ['Range', sp.spell_range], ['Components', sp.components], ['Duration', sp.duration]].filter(function (x) { return x[1]; });
    return (bits.length ? '<span>' + bits.map(function (x) { return esc(x[0]) + ': ' + esc(x[1]); }).join(' · ') + '</span>' : '') +
      (sp.description ? '<span class="spell-desc">' + esc(sp.description) + '</span>' : '');
  }
  function spellMeta(sp) {
    return [levelText(sp.level), sp.school].concat(sp.ritual ? ['ritual'] : []).concat(sp.concentration ? ['concentration'] : []).join(' · ');
  }
  function spellListHtml() {
    var list = filteredSpells(), dm = dmView();
    var counts = {};
    list.forEach(function (sp) { counts[sp.rarity] = (counts[sp.rarity] || 0) + 1; });
    var html = '<p class="note" style="margin:0 0 10px">' + list.length + (list.length === 1 ? ' spell' : ' spells') +
      (list.length ? ': ' + RARITIES.filter(function (r) { return counts[r]; }).map(function (r) { return counts[r] + ' ' + r.toLowerCase(); }).join(', ') : '') + '</p>';
    if (!list.length) return html + '<div class="empty">No spells match those filters.</div>';
    html += '<div class="tbl">' + list.map(function (sp) {
      var cls = (sp.classes || []).length ? sp.classes.join(', ') : 'Tome only';
      var src = sp.homebrew ? 'Homebrew' + (sp.submitted_by ? ' by ' + memberName(sp.submitted_by) : '') : sp.book;
      var right = dm ? '<div class="spell-right"><label class="sr" for="rar-' + esc(sp.name) + '">Rarity of ' + esc(sp.name) + '</label><select class="input rar-sel" id="rar-' + esc(sp.name) + '" data-spell-rarity="' + esc(sp.name) + '">' +
        RARITIES.map(function (r) { return '<option' + (r === sp.rarity ? ' selected' : '') + '>' + r + '</option>'; }).join('') + '</select>' +
        (sp.homebrew ? '<a class="btn small quiet" href="#/spell-edit/' + encodeURIComponent(sp.name) + '">Edit</a>' : '') + '</div>' : rarityTag(sp.rarity);
      return '<div class="tbl-row"><div class="main"><b>' + esc(sp.name) + (sp.homebrew ? ' <span class="tag plain" style="font-size:10px">Homebrew</span>' : '') + '</b><span>' + esc(spellMeta(sp)) + '</span><span>' + esc(cls) + ' · ' + esc(src) + '</span>' +
        (sp.homebrew ? spellDetails(sp) : '') + (sp.notes ? '<span>' + esc(sp.notes) + '</span>' : '') + '</div>' + right + '</div>';
    }).join('') + '</div>';
    return html;
  }
  function reviewHtml() {
    var list = pendingSpells();
    if (!list.length) return '';
    return '<section class="block"><h2 class="sec-title">Waiting for your review<small>' + list.length + '</small></h2><div class="tbl">' + list.map(function (sp) {
      var id = 'rv-' + esc(sp.name);
      return '<div class="tbl-row review"><div class="main"><b>' + esc(sp.name) + '</b><span>' + esc(spellMeta(sp)) + ' · from ' + esc(memberName(sp.submitted_by)) + '</span>' +
        '<span>' + esc((sp.classes || []).join(', ') || 'No classes picked') + ' · suggested ' + esc(sp.rarity.toLowerCase()) + '</span>' + spellDetails(sp) +
        '<div class="review-actions"><label class="sr" for="' + id + '-rar">Rarity</label><select class="input rar-sel" id="' + id + '-rar" data-review-rarity="' + esc(sp.name) + '">' +
        RARITIES.map(function (r) { return '<option' + (r === sp.rarity ? ' selected' : '') + '>' + r + '</option>'; }).join('') + '</select>' +
        '<button type="button" class="btn small primary" data-act="spell-approve" data-name="' + esc(sp.name) + '">Approve</button>' +
        '<a class="btn small" href="#/spell-edit/' + encodeURIComponent(sp.name) + '">Edit</a></div>' +
        '<div class="review-actions"><label class="sr" for="' + id + '-note">Note to the player</label><input type="text" class="input" id="' + id + '-note" maxlength="300" placeholder="Note if you send it back, e.g. too strong for 2nd level">' +
        '<button type="button" class="btn small" data-act="spell-return" data-name="' + esc(sp.name) + '">Send back</button></div></div></div>';
    }).join('') + '</div></section>';
  }
  function mySubmissionsHtml() {
    var mine = (spells || []).filter(function (x) { return x.homebrew && x.submitted_by === uid(); });
    if (!mine.length) return '';
    var label = { pending: '<span class="tag">Waiting for the DM</span>', returned: '<span class="tag">Sent back</span>', approved: '<span class="tag ok">Approved</span>' };
    return '<section class="block"><h2 class="sec-title">Your homebrew<small>' + mine.length + '</small></h2><div class="tbl">' + mine.map(function (sp) {
      return '<div class="tbl-row"><div class="main"><b>' + esc(sp.name) + '</b><span>' + esc(spellMeta(sp)) + '</span>' +
        (sp.status === 'returned' && sp.dm_note ? '<span class="err" style="margin:0">DM: ' + esc(sp.dm_note) + '</span>' : '') + '</div>' +
        label[sp.status] + (sp.status !== 'approved' ? '<a class="btn small quiet" href="#/spell-edit/' + encodeURIComponent(sp.name) + '">' + (sp.status === 'returned' ? 'Fix and resend' : 'Edit') + '</a>' : '') + '</div>';
    }).join('') + '</div></section>';
  }
  function renderSpells() {
    if (spells === null) {
      $view.innerHTML = '<div class="page"><div class="empty">Opening the spell tomes…</div></div>';
      loadSpells().then(function () { if (['spells', 'spell-new', 'spell-edit'].indexOf(parseRoute().name) >= 0) render(); }).catch(function (e) { fail(e, 'Could not load the spells.'); });
      return;
    }
    var f = ui.spellFilter;
    var sel = function (id, key, label, opts, all) {
      return '<div class="field"><label for="' + id + '">' + label + '</label><select id="' + id + '" data-spell-filter="' + key + '"><option value="">' + all + '</option>' +
        opts.map(function (o) { var v = Array.isArray(o) ? o[0] : o, t = Array.isArray(o) ? o[1] : o; return '<option value="' + esc(v) + '"' + (String(f[key]) === String(v) ? ' selected' : '') + '>' + esc(t) + '</option>'; }).join('') + '</select></div>';
    };
    var levels = [];
    for (var i = 0; i <= 9; i++) levels.push([String(i), levelText(i)]);
    var html = '<section class="hero"><div class="hero-in"><p class="eyebrow">Magic</p><h1>Spell Tomes</h1>' +
      '<p class="crumbs">Each class list stops at 5th level for full casters and 4th for everyone else. Anything beyond that has to be found in a tome. Rarity is how hard that tome is to find. See <a href="#/a/spell-tomes">Spell Tomes</a>.</p></div></section><div class="page">';
    html += '<div class="actions"><a class="btn' + (dmView() ? '' : ' primary') + '" href="#/spell-new">+ Homebrew spell</a></div>';
    if (dmView()) html += reviewHtml();
    else html += mySubmissionsHtml();
    html += '<label class="search"><span class="sr">Search spells</span>' + SEARCH_ICON + '<input id="spell-search" type="search" placeholder="Search spells…" value="' + esc(f.q) + '" autocomplete="off"></label>';
    html += '<div class="filters-grid">' + sel('sp-rarity', 'rarity', 'Rarity', RARITIES, 'Any rarity') + sel('sp-level', 'level', 'Level', levels, 'Any level') +
      sel('sp-class', 'cls', 'Class list', SPELL_CLASSES.concat([['_tome', 'Tome only']]), 'Any class') + sel('sp-school', 'school', 'School', SCHOOLS, 'Any school') +
      sel('sp-src', 'src', 'Source', [['official', 'Official'], ['homebrew', 'Homebrew']], 'Any source') + '</div>';
    if (dmView()) html += '<p class="note" style="margin:0">Change a spell’s rarity right in the list. It saves straight away.</p>';
    html += '<section class="block"><div id="spell-list">' + spellListHtml() + '</div></section></div>';
    $view.innerHTML = html;
  }
  function setSpellRarity(name, rarity) {
    var sp = spellByName(name);
    if (!sp || RARITIES.indexOf(rarity) < 0) return;
    var before = sp.rarity;
    sp.rarity = rarity;
    sb.from('spells').update({ rarity: rarity, updated_at: new Date().toISOString() }).eq('name', name).then(function (r) {
      if (r.error) { sp.rarity = before; fail(r.error, 'Could not change that rarity.'); render(); return; }
      toast(name + ' is now ' + rarity.toLowerCase());
    });
  }

  /* Homebrew spells: players write them, the DM approves, sends back or edits them. */
  function renderSpellForm(name) {
    if (spells === null) return renderSpells();
    var sp = name ? spellByName(name) : null;
    if (name && !sp) { location.replace('#/spells'); return; }
    var dm = dmView();
    if (sp && !dm && (sp.submitted_by !== uid() || sp.status === 'approved')) { location.replace('#/spells'); return; }
    var v = sp || { name: '', level: 1, school: 'Evocation', classes: [], ritual: false, concentration: false, rarity: 'Common', casting_time: '1 action', spell_range: '', components: '', duration: 'Instantaneous', description: '' };
    var opt = function (list, cur) { return list.map(function (o) { var val = Array.isArray(o) ? o[0] : o, t = Array.isArray(o) ? o[1] : o; return '<option value="' + esc(val) + '"' + (String(val) === String(cur) ? ' selected' : '') + '>' + esc(t) + '</option>'; }).join(''); };
    var levels = [];
    for (var i = 0; i <= 9; i++) levels.push([i, levelText(i)]);
    var html = '<div class="page narrow"><p class="crumbs"><a href="#/spells">Spells</a></p><h1 class="page-title">' + (sp ? 'Edit ' + esc(sp.name) : 'New homebrew spell') + '</h1>' +
      (sp && sp.status === 'returned' && sp.dm_note ? '<p class="err">DM: ' + esc(sp.dm_note) + '</p>' : '') +
      (!dm ? '<p class="note">Your DM reviews every homebrew spell before it joins the tome list. You can edit it until then.</p>' : '') +
      '<form class="form" id="spell-form" novalidate data-name="' + esc(sp ? sp.name : '') + '">' +
      '<div class="field"><label for="hb-name">Name</label><input type="text" id="hb-name" maxlength="80" value="' + esc(v.name) + '" required></div>' +
      '<div class="two"><div class="field"><label for="hb-level">Level</label><select id="hb-level">' + opt(levels, v.level) + '</select></div>' +
      '<div class="field"><label for="hb-school">School</label><select id="hb-school">' + opt(SCHOOLS, v.school) + '</select></div></div>' +
      '<div class="field"><span class="lbl">Classes that learn it</span><div class="chips">' + SPELL_CLASSES.map(function (c) {
        return '<label class="chip check"><input type="checkbox" data-hb-class value="' + c + '"' + ((v.classes || []).indexOf(c) >= 0 ? ' checked' : '') + '> ' + c + '</label>';
      }).join('') + '</div><span class="hint">Leave all empty if anyone can learn it from the tome.</span></div>' +
      '<div class="two"><div class="field"><label for="hb-time">Casting time</label><input type="text" id="hb-time" maxlength="60" value="' + esc(v.casting_time) + '"></div>' +
      '<div class="field"><label for="hb-range">Range</label><input type="text" id="hb-range" maxlength="60" value="' + esc(v.spell_range) + '" placeholder="e.g. 60 feet"></div>' +
      '<div class="field"><label for="hb-comp">Components</label><input type="text" id="hb-comp" maxlength="120" value="' + esc(v.components) + '" placeholder="e.g. V, S, M (a pinch of ash)"></div>' +
      '<div class="field"><label for="hb-dur">Duration</label><input type="text" id="hb-dur" maxlength="60" value="' + esc(v.duration) + '"></div></div>' +
      '<div class="chips" style="margin-bottom:12px"><label class="chip check"><input type="checkbox" id="hb-conc"' + (v.concentration ? ' checked' : '') + '> Concentration</label><label class="chip check"><input type="checkbox" id="hb-ritual"' + (v.ritual ? ' checked' : '') + '> Ritual</label></div>' +
      '<div class="field"><label for="hb-desc">What it does</label><textarea id="hb-desc" maxlength="6000" style="min-height:180px">' + esc(v.description) + '</textarea></div>' +
      '<div class="field"><label for="hb-rar">' + (dm ? 'Rarity' : 'Rarity you’d suggest') + '</label><select id="hb-rar">' + opt(RARITIES, v.rarity) + '</select></div>' +
      '<p class="err" id="hb-err" hidden></p>' +
      '<div class="actions"><button type="submit" class="btn primary">' + (dm ? (sp ? 'Save' : 'Add spell') : (sp ? 'Save and resend' : 'Send to the DM')) + '</button>' +
      (sp ? '<button type="button" class="btn" data-act="spell-delete" data-name="' + esc(sp.name) + '">' + (dm ? 'Delete spell' : 'Withdraw') + '</button>' : '') + '</div></form></div>';
    $view.innerHTML = html;
  }
  function saveSpellForm(form) {
    var old = form.getAttribute('data-name');
    var $err = document.getElementById('hb-err');
    var show = function (m) { $err.textContent = m; $err.hidden = false; };
    var dm = dmView();
    var row = {
      name: document.getElementById('hb-name').value.trim().replace(/\s+/g, ' ').slice(0, 80),
      level: Number(document.getElementById('hb-level').value) || 0,
      school: document.getElementById('hb-school').value,
      classes: Array.prototype.map.call(form.querySelectorAll('[data-hb-class]:checked'), function (x) { return x.value; }),
      casting_time: document.getElementById('hb-time').value.trim(),
      spell_range: document.getElementById('hb-range').value.trim(),
      components: document.getElementById('hb-comp').value.trim(),
      duration: document.getElementById('hb-dur').value.trim(),
      concentration: document.getElementById('hb-conc').checked,
      ritual: document.getElementById('hb-ritual').checked,
      description: document.getElementById('hb-desc').value.trim(),
      rarity: document.getElementById('hb-rar').value,
      book: 'Homebrew', homebrew: true, updated_at: new Date().toISOString()
    };
    if (!row.name) return show('Give the spell a name.');
    if (!row.description) return show('Describe what the spell does.');
    if ((!old || old.toLowerCase() !== row.name.toLowerCase()) && (spells || []).some(function (x) { return x.name.toLowerCase() === row.name.toLowerCase(); })) return show('There’s already a spell called that.');
    var existing = old ? spellByName(old) : null;
    if (!dm) { row.status = 'pending'; row.dm_note = ''; row.submitted_by = uid(); }
    else if (!existing) { row.status = 'approved'; row.submitted_by = uid(); }
    var op = existing ? sb.from('spells').update(row).eq('name', old) : sb.from('spells').insert(row);
    op.then(function (r) {
      if (r.error) return show(r.error.code === '23505' ? 'There’s already a spell called that.' : (r.error.message || 'Could not save the spell.'));
      toast(dm ? 'Spell saved' : 'Sent to the DM for review');
      return loadSpells().then(function () { go('#/spells'); });
    });
  }
  function reviewSpell(name, approve) {
    var sp = spellByName(name);
    if (!sp) return;
    var patch = { updated_at: new Date().toISOString() };
    if (approve) {
      var rs = document.querySelector('[data-review-rarity="' + CSS.escape(name) + '"]');
      patch.status = 'approved'; patch.dm_note = ''; patch.rarity = rs ? rs.value : sp.rarity;
    } else {
      var note = document.getElementById('rv-' + name + '-note');
      patch.status = 'returned'; patch.dm_note = note ? note.value.trim().slice(0, 300) : '';
    }
    sb.from('spells').update(patch).eq('name', name).then(function (r) {
      if (r.error) return fail(r.error, 'Could not update that spell.');
      Object.assign(sp, patch);
      toast(approve ? name + ' added to the tomes' : name + ' sent back');
      render();
    });
  }
  function deleteSpell(name) {
    var sp = spellByName(name);
    if (!sp) return;
    if (ui.pendingDelete !== 'spell:' + name) { ui.pendingDelete = 'spell:' + name; toast('Tap again to confirm'); return; }
    ui.pendingDelete = null;
    sb.from('spells').delete().eq('name', name).then(function (r) {
      if (r.error) return fail(r.error, 'Could not remove that spell.');
      spells = spells.filter(function (x) { return x.name !== name; });
      toast(dmView() ? 'Spell deleted' : 'Spell withdrawn');
      go('#/spells');
    });
  }

  /* ================= Reputation ================= */
  // Standing is a step count from Neutral. A character starts where their class, species, background and faith put them
  // (RULES.factionStart); the DM's changes are stored as a shift on top of that.
  var STANDINGS = ['Hostile', 'Cold', 'Neutral', 'Friendly', 'Allied', 'Devoted'];
  var STANDING_MEANS = { Hostile: 'They want you gone, or dead.', Cold: 'Distrusted. Expect closed doors.', Neutral: 'Just another face.', Friendly: 'They’ll hear you out and do small favors.', Allied: 'Trusted. Real help, real secrets.', Devoted: 'One of their own.' };
  var reputation = [];

  function loadReputation() {
    return sb.from('reputation').select('character_id, faction_id, shift, note').then(function (r) {
      if (r.error) throw r.error;
      reputation = r.data || [];
    });
  }
  function articleById(id) { return articles.filter(function (a) { return a.id === id; })[0] || null; }
  function factionsFor(campId) {
    return visibleArticles().filter(function (a) { return a.template === 'Organization' && (!a.campaign_id || a.campaign_id === campId); })
      .sort(function (a, b) { return String(a.title).localeCompare(b.title); });
  }
  function standingTag(st) { return '<span class="tag st st-' + String(st).toLowerCase() + '">' + esc(st) + '</span>'; }
  function faithGroup(patron) {
    if (!patron) return null;
    if ((RULES.gods || []).some(function (g) { return g.name === patron && g.good; })) return 'good';
    if ((RULES.demons || []).some(function (d) { return d.name === patron; })) return 'demon';
    return null;
  }
  // Where a character starts with a faction, and why.
  function startStanding(s, fac) {
    var rule = (RULES.factionStart || {})[fac.slug] || {}, pts = 0, why = [];
    function add(n, label) { if (n) { pts += n; why.push(label + ' ' + (n > 0 ? '+' : '−') + Math.abs(n)); } }
    if (rule.base) add(rule.base, 'Everyone');
    if (rule.cls && s.cls) add(rule.cls[s.cls] || 0, s.cls);
    if (rule.species && s.species) add(rule.species[s.species] || 0, s.species);
    if ((RULES.draconic || []).indexOf(s.species) >= 0 && (RULES.draconicFactions || []).indexOf(fac.slug) < 0) add(-1, 'Wary of draconic races');
    if (rule.bg && s.background) add(rule.bg[s.background] || 0, s.background);
    if (rule.faith && s.patron) {
      var f = rule.faith[s.patron] !== undefined ? rule.faith[s.patron] : (rule.faith[faithGroup(s.patron)] || 0);
      add(f, s.patron);
    }
    return { pts: Math.max(-2, Math.min(2, pts)), why: why };
  }
  function repRow(charId, factionId) { return reputation.filter(function (x) { return x.character_id === charId && x.faction_id === factionId; })[0] || null; }
  function standingFor(c, fac) {
    var st = startStanding(normSheet(c.sheet), fac), row = repRow(c.id, fac.id), shift = row ? num(row.shift, 0) : 0;
    var idx = Math.max(0, Math.min(5, st.pts + shift + 2));
    return { name: STANDINGS[idx], idx: idx, start: STANDINGS[st.pts + 2], startPts: st.pts, shift: shift, why: st.why };
  }
  function standingSelect(c, fac, st, id) {
    return '<select class="input rar-sel st-sel st-' + st.name.toLowerCase() + '"' + (id ? ' id="' + id + '"' : '') + ' data-rep="' + esc(c.id + '|' + fac.id) + '" aria-label="' + esc(c.name) + '’s standing with ' + esc(fac.title) + '">' +
      STANDINGS.map(function (x) { return '<option' + (x === st.name ? ' selected' : '') + '>' + x + '</option>'; }).join('') + '</select>';
  }
  function standingWhy(st) {
    var bits = [];
    bits.push(st.why.length ? 'Started ' + st.start + ' (' + st.why.join(', ') + ')' : 'Started Neutral');
    if (st.shift) bits.push((st.shift > 0 ? 'risen ' : 'fallen ') + Math.abs(st.shift) + ' since');
    return bits.join(', ');
  }

  function renderReputation(slug) {
    if (!loaded.wiki || !loaded.chars) { $view.innerHTML = '<div class="page"><div class="empty">Opening…</div></div>'; return; }
    var camp = campaignBySlug(slug);
    if (!camp) { location.replace('#/wiki'); return; }
    var chars = campaignChars(camp.id), facs = factionsFor(camp.id);
    var q = (ui.repQuery || '').trim().toLowerCase();
    var html = '<div class="page"><p class="crumbs"><a href="#/campaign/' + encodeURIComponent(camp.slug) + '">' + esc(camp.name) + '</a></p><h1 class="page-title">Reputation</h1>' +
      '<p class="note">Every character starts somewhere with each faction, based on class, species, background and faith. Change a standing here or on their sheet. Players see theirs on the Reputation tab.</p>' +
      '<label class="search"><span class="sr">Find a faction</span>' + SEARCH_ICON + '<input id="rep-q" type="search" placeholder="Find a faction…" value="' + esc(ui.repQuery || '') + '" autocomplete="off"></label>';
    if (!chars.length) html += '<div class="empty">No characters in this campaign yet.</div>';
    else facs.filter(function (a) { return !q || a.title.toLowerCase().indexOf(q) >= 0; }).forEach(function (a) {
      html += '<section class="block rep-block"><h2 class="sec-title">' + esc(a.title) + (a.hidden ? '<small>Hidden</small>' : '') + '</h2><div class="tbl">' + chars.map(function (c) {
        var st = standingFor(c, a);
        return '<div class="tbl-row"><div class="main"><b>' + esc(c.name) + '</b><span>' + esc(standingWhy(st)) + '</span></div>' + standingSelect(c, a, st, 'rp-' + c.id + a.id) + '</div>';
      }).join('') + '</div></section>';
    });
    html += '</div>';
    $view.innerHTML = html;
  }
  // The DM picks the standing they want; we store how far that is from where the character started.
  function setStanding(charId, factionId, standing) {
    var c = charById(charId), fac = articleById(factionId), idx = STANDINGS.indexOf(standing);
    if (!c || !fac || idx < 0) return;
    var shift = idx - 2 - startStanding(normSheet(c.sheet), fac).pts;
    sb.from('reputation').upsert({ character_id: charId, faction_id: factionId, shift: shift, updated_at: new Date().toISOString() }).then(function (r) {
      if (r.error) return fail(r.error, 'Could not save that standing.');
      var row = repRow(charId, factionId);
      if (row) row.shift = shift; else reputation.push({ character_id: charId, faction_id: factionId, shift: shift, note: '' });
      toast(c.name + ' is now ' + standing + ' with ' + fac.title);
      render();
    });
  }
  function standingTabHtml(c, s) {
    var facs = factionsFor(c.campaign_id || null), dm = dmView();
    var html = '<section class="block" style="margin-top:12px"><h2 class="sec-title">Reputation</h2><p class="note" style="margin-top:0">How each faction sees you. You start where your class, people, past and faith put you. Your deeds move it from there.</p>';
    if (!facs.length) return html + '<div class="empty">No factions known yet.</div></section>';
    var rows = facs.map(function (a) { return { a: a, st: standingFor(c, a) }; });
    // Strongest feelings first, either way.
    rows.sort(function (x, y) { return Math.abs(y.st.idx - 2) - Math.abs(x.st.idx - 2) || String(x.a.title).localeCompare(y.a.title); });
    html += '<div class="tbl">' + rows.map(function (r) {
      return '<div class="tbl-row"><div class="main"><b><a class="link" href="#/a/' + encodeURIComponent(r.a.slug) + '">' + esc(r.a.title) + '</a></b><span>' + esc(STANDING_MEANS[r.st.name]) + ' ' + esc(standingWhy(r.st)) + '.</span></div>' +
        (dm ? standingSelect(c, r.a, r.st) : standingTag(r.st.name)) + '</div>';
    }).join('') + '</div></section>';
    var tomes = s.tomes || [];
    if (tomes.length) html += '<section class="block"><h2 class="sec-title">Tomes in your pack<small>' + tomes.length + '</small></h2><div class="tbl">' + tomes.map(function (t) {
      var learned = s.spells.some(function (x) { return x.name === t.name; });
      return '<div class="tbl-row"><div class="main"><b>' + esc(t.name) + '</b><span>' + esc([t.from ? 'From ' + t.from : '', t.paid ? t.paid + ' gp' : ''].filter(Boolean).join(' · ')) + '</span></div>' + (learned ? '<span class="tag ok">Learned</span>' : '<span class="tag plain">Not learned yet</span>') + '</div>';
    }).join('') + '</div></section>';
    return html;
  }

  /* ================= Custom subclasses (DM) ================= */
  function renderSubclasses(id) {
    var classes = Object.keys(RULES.classes);
    if (ui.subEdit) return renderSubclassForm();
    var html = '<div class="page narrow"><p class="crumbs"><a href="#/characters">Characters</a></p><h1 class="page-title">Custom subclasses</h1>' +
      '<p class="note">Your own domains, pacts, oaths and the rest. They appear in the builder and at level-up next to the D&D ones, for the patrons you choose, and their features land on the sheet at the right levels.</p>' +
      '<div class="actions"><button type="button" class="btn primary" data-act="sub-new">+ New subclass</button></div>';
    var any = false;
    classes.forEach(function (cls) {
      var list = customSubs.filter(function (x) { return x.class === cls; });
      if (!list.length) return;
      any = true;
      html += '<section class="block"><h2 class="sec-title">' + esc(cls) + '<small>' + esc(RULES.classes[cls].subclassLabel) + '</small></h2><div class="list">' + list.map(function (x) {
        var ps = (x.patrons || []).length ? 'Granted by ' + x.patrons.join(', ') : 'Any patron, or none';
        return '<button type="button" class="row" data-act="sub-edit" data-id="' + esc(x.id) + '" style="text-align:left;width:100%"><span class="row-main"><b>' + esc(x.name) + '</b><span>' + esc(ps + ' · ' + (x.features || []).length + ' features') + '</span></span></button>';
      }).join('') + '</div></section>';
    });
    if (!any) html += '<div class="empty">No custom subclasses yet.</div>';
    $view.innerHTML = html + '</div>';
  }
  function renderSubclassForm() {
    var e = ui.subEdit, cd = RULES.classes[e.class] || {};
    var patrons = (RULES.gods || []).map(function (g) { return g.name; }).concat((RULES.demons || []).map(function (d) { return d.name; }));
    if (e.class === 'Paladin') patrons.push(OATH_ONLY);
    var html = '<div class="page narrow"><form class="form" id="sub-form" novalidate><div><p class="eyebrow">' + (e.id ? 'Edit' : 'New') + ' subclass</p><h1 class="page-title">' + esc(e.name || 'A subclass of your own') + '</h1></div>' +
      '<div class="two"><div class="field"><label for="sb-class">Class</label><select id="sb-class" data-subf="class">' + Object.keys(RULES.classes).map(function (k) { return '<option' + (k === e.class ? ' selected' : '') + '>' + k + '</option>'; }).join('') + '</select><span class="hint">' + esc(cd.subclassLabel || '') + ', chosen at level ' + (cd.subclassLevel || 3) + '</span></div>' +
      '<div class="field"><label for="sb-name">Name</label><input type="text" id="sb-name" data-subf="name" maxlength="80" value="' + esc(e.name) + '" placeholder="e.g. Oath of the Tide"></div></div>' +
      '<div class="field"><label for="sb-about">What it is</label><textarea id="sb-about" data-subf="about" maxlength="800">' + esc(e.about) + '</textarea></div>' +
      '<div class="field"><span class="lbl">Granted by</span><p class="note" style="margin:0 0 6px">Tick none and anyone can take it.</p><div class="chips">' + patrons.map(function (n) {
        return '<button type="button" class="chip pick" data-act="sub-patron" data-name="' + esc(n) + '" aria-pressed="' + (e.patrons.indexOf(n) >= 0) + '">' + esc(n) + '</button>';
      }).join('') + '</div></div>' +
      '<div class="field"><span class="lbl">Features</span><p class="note" style="margin:0 0 6px">D&D gives ' + esc(e.class) + ' subclass features at levels ' + (RULES.subLevels[e.class] || []).join(', ') + '.</p>' +
      e.features.map(function (f, i) {
        return '<div class="group-box sub-feat"><div class="two"><div class="field"><label for="sf-l' + i + '">Level</label><input type="number" id="sf-l' + i + '" data-subfeat="level" data-i="' + i + '" min="1" max="20" value="' + num(f.level, 1) + '" inputmode="numeric"></div>' +
          '<div class="field"><label for="sf-n' + i + '">Feature</label><input type="text" id="sf-n' + i + '" data-subfeat="name" data-i="' + i + '" maxlength="80" value="' + esc(f.name) + '"></div></div>' +
          '<div class="field"><label for="sf-t' + i + '">What it does</label><textarea id="sf-t' + i + '" data-subfeat="text" data-i="' + i + '" maxlength="1500">' + esc(f.text) + '</textarea></div>' +
          '<button type="button" class="btn small quiet" data-act="sub-feat-rm" data-i="' + i + '">Remove</button></div>';
      }).join('') +
      '<button type="button" class="btn small" data-act="sub-feat-add">+ Add a feature</button></div>' +
      '<div class="actions"><button type="submit" class="btn primary">Save</button><button type="button" class="btn" data-act="sub-cancel">Cancel</button>' +
      (e.id ? '<button type="button" class="btn danger" data-act="sub-delete" data-id="' + esc(e.id) + '">' + (ui.pendingDelete === 'sub:' + e.id ? 'Tap again to delete' : 'Delete') + '</button>' : '') + '</div></form></div>';
    $view.innerHTML = html;
  }
  function saveSubclass() {
    var e = ui.subEdit;
    if (!e) return;
    e.name = String(e.name || '').trim();
    if (!e.name) return toast('Give it a name.');
    var feats = e.features.filter(function (f) { return String(f.name || '').trim(); }).map(function (f) { return { level: Math.max(1, Math.min(20, num(f.level, 1))), name: String(f.name).trim(), text: String(f.text || '').trim() }; })
      .sort(function (a, b) { return a.level - b.level; });
    var row = { class: e.class, name: e.name, about: String(e.about || '').trim(), patrons: e.patrons, features: feats };
    var op = e.id ? sb.from('custom_subclasses').update(row).eq('id', e.id) : sb.from('custom_subclasses').insert(row);
    op.then(function (r) {
      if (r.error) return fail(r.error, r.error.code === '23505' ? 'That class already has a subclass with that name.' : 'Could not save it.');
      return loadCustomSubs().then(function () { ui.subEdit = null; toast('Saved'); render(); });
    });
  }

  /* ================= Shops (DM only) ================= */
  // The DM opens a shop when the party walks in, picks who's buying, and the app does the money, the stock and the sheet.
  var ITEMS = window.AVARENTH_ITEMS || { items: [], shopKinds: {}, placeTags: {}, sizes: ['Hamlet', 'Village', 'Town', 'City', 'Capital'] };
  var SIZES = ITEMS.sizes;
  var KIND_LABEL = { sw: 'Simple weapons', mw: 'Martial weapons', rw: 'Ranged weapons', am: 'Ammunition', la: 'Light armor', ma: 'Medium armor', ha: 'Heavy armor', sh: 'Shields', g: 'Gear', c: 'Clothing', f: 'Food & drink', s: 'Services', t: 'Artisan’s tools', k: 'Kits', gm: 'Games', i: 'Instruments', p: 'Potions & alchemy', fo: 'Spellcasting', h: 'Holy goods', m: 'Mounts & animals', tk: 'Tack', v: 'Vehicles', b: 'Boats', x: 'Contraband', z: 'Oddities & other' };
  var KIND_ORDER = ['s', 'f', 'g', 'c', 'sw', 'mw', 'rw', 'am', 'la', 'ma', 'ha', 'sh', 'p', 'fo', 'h', 't', 'k', 'gm', 'i', 'm', 'tk', 'v', 'b', 'x', 'z'];
  var WEAPON_ARMOR = ['sw', 'mw', 'rw', 'am', 'la', 'ma', 'ha', 'sh'];
  var SELL_MULT = { Hostile: null, Cold: 1.25, Neutral: 1, Friendly: 0.95, Allied: 0.9, Devoted: 0.8 };   // what they charge
  var BUY_MULT = { Hostile: null, Cold: 0.4, Neutral: 0.5, Friendly: 0.55, Allied: 0.6, Devoted: 0.65 };  // what they pay for your goods
  var RECOG_DC = 15;
  var shops = [], places = [];

  function loadShops() {
    if (!isDM()) { loaded.shops = true; return Promise.resolve(); }
    return Promise.all([
      sb.from('shops').select('*').order('name'),
      sb.from('places').select('article_id, size, tags, price_mod')
    ]).then(function (rs) {
      if (rs[0].error) throw rs[0].error;
      if (rs[1].error) throw rs[1].error;
      shops = rs[0].data || []; places = rs[1].data || []; loaded.shops = true;
    });
  }
  function fnum(v, d) { var n = parseFloat(v); return isNaN(n) ? d : n; }
  function shopById(id) { return shops.filter(function (s) { return s.id === id; })[0] || null; }
  function itemByName(n) { var k = String(n || '').toLowerCase(); return ITEMS.items.filter(function (i) { return i.name.toLowerCase() === k; })[0] || null; }
  function placeOf(articleId) {
    var p = places.filter(function (x) { return x.article_id === articleId; })[0];
    return p || { article_id: articleId, size: 2, tags: [], price_mod: 1, unset: true };
  }
  function hasTag(p, t) { return (p.tags || []).indexOf(t) >= 0; }
  function settlementsFor(campId) {
    return articles.filter(function (a) { return (a.template === 'Settlement' || places.some(function (x) { return x.article_id === a.id; }) || shops.some(function (x) { return x.place_id === a.id; })) && (!campId || !a.campaign_id || a.campaign_id === campId); })
      .sort(function (a, b) { return String(a.title).localeCompare(b.title); });
  }
  function shopsAt(placeId) { return shops.filter(function (s) { return s.place_id === placeId && !isWanderer(s); }); }

  /* ---------- Money ---------- */
  function toCp(gp) { return Math.max(0, Math.round(fnum(gp, 0) * 100)); }
  function money(cp) {
    cp = Math.round(cp);
    if (cp <= 0) return 'free';
    var g = Math.floor(cp / 100), s = Math.floor((cp % 100) / 10), c = cp % 10, out = [];
    if (g) out.push(g.toLocaleString() + ' gp'); if (s) out.push(s + ' sp'); if (c) out.push(c + ' cp');
    return out.join(' ');
  }
  // Shopkeepers quote round numbers: whole gold over 10 gp, silver over 1 gp.
  function niceCp(cp) { cp = Math.max(1, Math.round(cp)); return cp >= 1000 ? Math.round(cp / 100) * 100 : cp >= 100 ? Math.round(cp / 10) * 10 : cp; }
  function walletCp(s) { var c = s.coins || {}; return num(c.cp, 0) + num(c.sp, 0) * 10 + num(c.gp, 0) * 100 + num(c.pp, 0) * 1000; }
  // Pays out of the purse and makes change. Platinum is only broken if it has to be.
  function setWallet(s, total) {
    var pp = Math.min(num(s.coins.pp, 0), Math.floor(total / 1000)), rest = total - pp * 1000;
    s.coins.pp = pp; s.coins.gp = Math.floor(rest / 100); rest %= 100; s.coins.sp = Math.floor(rest / 10); s.coins.cp = rest % 10;
  }

  /* ---------- Stocking ---------- */
  function rint(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  // A wandering merchant carries a handful of oddities and a few random useful things, at whatever price he feels like today.
  function wanderStock(shop) {
    function pick(list, n) { list = list.slice(); var out = []; while (list.length && out.length < n) out.push(list.splice(Math.floor(Math.random() * list.length), 1)[0]); return out; }
    var odd = ITEMS.items.filter(function (it) { return it.kind === 'z'; });
    var T = (ITEMS.trades || {})[(shop && shop.trade) || ''] || null;
    if (T && (T.base || T.extra)) {
      var rows = [];
      if (T.base) rows = stockFor({ kind: T.base, place_id: null }).filter(function (r) { return r.k !== 's' && r.k !== 'z'; });
      (T.extra || []).forEach(function (n) {
        var it = itemByName(n); if (!it || rows.some(function (r) { return r.n === n; })) return;
        rows.push({ n: it.name, k: it.kind, p: niceCp(it.price * (0.85 + Math.random() * 0.4) * 100) / 100, q: it.kind === 'z' ? 1 : rint(1, 3) });
      });
      rows = pick(rows, Math.min(rows.length, rint(6, 12)));
      rows.forEach(function (r) { if (r.q && r.q > 3) r.q = rint(1, 3); });
      var on = T.odd || [0, 1];
      pick(odd.filter(function (it) { return !rows.some(function (r) { return r.n === it.name; }); }), rint(on[0], on[1])).forEach(function (it) { rows.push({ n: it.name, k: it.kind, p: niceCp(it.price * (0.6 + Math.random() * 1.2) * 100) / 100, q: 1 }); });
      return rows;
    }
    var useful = ITEMS.items.filter(function (it) { return ['s', 'v', 'b', 'm', 'x', 'z'].indexOf(it.kind) < 0 && it.tags.indexOf('magic') < 0 && it.price <= 100; });
    var out = [];
    pick(odd, rint(5, 9)).forEach(function (it) { out.push({ n: it.name, k: it.kind, p: niceCp(it.price * (0.6 + Math.random() * 1.2) * 100) / 100, q: 1 }); });
    pick(useful, rint(3, 7)).forEach(function (it) { out.push({ n: it.name, k: it.kind, p: niceCp(it.price * (0.8 + Math.random() * 0.8) * 100) / 100, q: rint(1, 3) }); });
    return out;
  }
  function isWanderer(shop) { return !!(ITEMS.shopKinds[shop.kind] || {}).wander; }
  function savedWanderers(campId) { return shops.filter(function (s) { return isWanderer(s) && s.saved !== false && (!s.campaign_id || s.campaign_id === campId); }); }
  function rpick(list) { return list[Math.floor(Math.random() * list.length)]; }
  function aAn(w) { return /^[aeiou]/i.test(w) ? 'an' : 'a'; }
  function randomWanderer(campId) {
    var races = ITEMS.wanderRaces || { Human: ['Aldous'] }, race = rpick(Object.keys(races)), name = rpick(races[race]);
    var trade = rpick(Object.keys(ITEMS.trades || { 'Curio dealer': {} })), quirk = rpick(ITEMS.quirks || ['']);
    var row = { campaign_id: campId, kind: 'Wandering merchant', trade: trade, saved: false, watch: 0,
      name: name + '\u2019s ' + rpick(['Cart', 'Wagon', 'Wares', 'Pack', 'Stall', 'Caravan', 'Goods']),
      keeper: name + ', ' + aAn(race) + ' ' + race.toLowerCase() + ' ' + trade.toLowerCase(), notes: quirk, stocked_at: new Date().toISOString() };
    row.stock = wanderStock(row);
    return row;
  }
  // Meeting a wandering merchant on the road: every saved one, and one brand-new stranger, are equally likely.
  function meetWanderer(campId) {
    var pool = savedWanderers(campId), i = Math.floor(Math.random() * (pool.length + 1));
    if (i < pool.length) {
      var w = pool[i]; w.stock = stockFor(w); w.stocked_at = new Date().toISOString();
      return saveShop(w).then(function () { toast('It\u2019s ' + (String(w.keeper || w.name).replace(/\[\[|\]\]/g, '').split(',')[0]) + ', with new wares'); go('#/shop/' + encodeURIComponent(w.id)); });
    }
    var stale = shops.filter(function (s) { return isWanderer(s) && s.saved === false && s.campaign_id === campId; }).map(function (s) { return s.id; });
    var clear = stale.length ? sb.from('shops').delete().in('id', stale) : Promise.resolve({});
    return clear.then(function (r) {
      if (r && r.error) throw r.error;
      shops = shops.filter(function (s) { return stale.indexOf(s.id) < 0; });
      return sb.from('shops').insert(randomWanderer(campId)).select('*').single();
    }).then(function (r) {
      if (r.error) throw r.error;
      shops.push(r.data); toast('A stranger on the road'); go('#/shop/' + encodeURIComponent(r.data.id));
    }).catch(function (e) { fail(e, 'Could not find a merchant.'); render(); });
  }
  function meetButton(campId, primary, label) { return '<button type="button" class="btn small' + (primary ? ' primary' : '') + '" data-act="meet-wanderer" data-campaign="' + esc(campId) + '">' + (label || 'Meet a wandering merchant') + '</button>'; }
  // The journey's day count is the shop's clock.
  function gameDay(shop) {
    var t = shop && shop.campaign_id && travel[shop.campaign_id];
    if (!t) { var k = Object.keys(travel)[0]; t = k ? travel[k] : null; }
    return t ? num(t.day, 1) : null;
  }
  // While the party is away, the shelves move: things sell out, some come back, new goods arrive and prices drift.
  function driftStock(shop, days) {
    var fresh = stockFor(shop), by = {}, p = Math.min(1, days / 10), log = { out: 0, back: 0, gone: 0, added: 0 };
    fresh.forEach(function (r) { by[r.n] = r; });
    var out = [];
    (shop.stock || []).forEach(function (r) {
      if (r.used || r.q === null || r.q === undefined) { out.push(r); return; }
      var f = by[r.n], q = num(r.q, 0);
      if (!f && Math.random() < 0.5 * p) { log.gone++; return; }
      if (q <= 0) { if (f && Math.random() < 0.3 + 0.5 * p) { q = f.q; log.back++; } }
      else { q = Math.max(0, Math.round(q * (1 + (Math.random() * 2 - 1) * (0.3 + 0.5 * p)))); if (q === 0) log.out++; }
      var price = Number(r.p) * (1 + (Math.random() * 2 - 1) * 0.06 * Math.min(1, days / 5));
      if (f && Math.random() < 0.3 * p) price = Number(f.p);
      out.push({ n: r.n, k: r.k, p: niceCp(price * 100) / 100, q: q });
    });
    var have = {}; out.forEach(function (r) { have[r.n] = 1; });
    fresh.forEach(function (f) { if (!have[f.n] && Math.random() < 0.15 + 0.35 * p) { out.push(f); log.added++; } });
    shop.stock = out;
    return log;
  }
  /* ---------- Second-hand goods: what the party sells stays on the shelf until someone buys it ---------- */
  var USED_RATE = 0.04, IMP_RATE = 0.01;   // chance a day that someone else buys it
  var USED_MOVE = 0.3;                      // chance an ordinary piece turns up in another shop when it's bought; important ones always do
  function onShelf(row, day) { return !(row.hold != null && day != null && row.hold > day); }
  // Runs over every shop in the campaign. Each piece keeps its own clock, so it doesn't matter which shop is opened.
  function marketTick(campId) {
    var t = campId && travel[campId]; if (!t || !dmView()) return;
    var day = num(t.day, 1), news = ui.marketNews = ui.marketNews || {}, dirty = {};
    var pool = shops.filter(function (sh) { return !isWanderer(sh) && sh.campaign_id === campId; });
    function say(id, txt) { (news[id] = news[id] || []).push(txt); }
    pool.forEach(function (sh) {
      (sh.stock || []).slice().forEach(function (r) {
        if (!r.used) return;
        if (r.hold != null && r.hold > day) return;
        if (r.hold != null && !r.arrived) { r.arrived = true; dirty[sh.id] = sh; say(sh.id, 'New in: ' + r.n + (r.came ? ', which turned up from ' + r.came : '') + '.'); }
        var seen = r.seen == null ? day : num(r.seen, day), gap = day - seen;
        if (r.seen !== day) { r.seen = day; dirty[sh.id] = sh; }
        if (gap <= 0) return;
        var chance = 1 - Math.pow(1 - (r.imp ? IMP_RATE : USED_RATE), gap);
        if (Math.random() >= chance) return;
        sh.stock.splice(sh.stock.indexOf(r), 1); dirty[sh.id] = sh;
        var others = pool.filter(function (o) { return o.id !== sh.id; });
        if (others.length && (r.imp || Math.random() < USED_MOVE)) {
          var fits = others.filter(function (o) { return ((ITEMS.shopKinds[o.kind] || {}).kinds || []).indexOf(r.k) >= 0; });
          if (!fits.length) fits = others.filter(function (o) { return o.kind === sh.kind; });
          if (!fits.length) fits = others;
          var to = fits[Math.floor(Math.random() * fits.length)], hold = day + rint(3, 12);
          var moved = Object.assign({}, r, { hold: hold, seen: hold, arrived: false, came: sh.name, hops: num(r.hops, 0) + 1 });
          (to.stock = to.stock || []).push(moved); dirty[to.id] = to;
          say(sh.id, r.n + (r.by ? ' (sold here by ' + r.by + ')' : '') + ' was bought by someone passing through. It will turn up at ' + to.name + ' around day ' + hold + '.');
        } else say(sh.id, r.n + (r.by ? ' (sold here by ' + r.by + ')' : '') + ' was bought, and it’s gone for good.');
      });
    });
    Object.keys(dirty).forEach(function (k) { saveShop(dirty[k]); });
  }
  function toggleImportant(shop, i) {
    var r = (shop.stock || [])[i]; if (!r) return;
    r.imp = !r.imp; saveShop(shop, r.imp ? 'Marked important: it sells slowly and never vanishes' : 'No longer marked important'); render();
  }
  function usedGoodsSection(campId) {
    var day = travel[campId] ? num(travel[campId].day, 1) : null, rows = [];
    shops.filter(function (sh) { return sh.campaign_id === campId; }).forEach(function (sh) {
      (sh.stock || []).forEach(function (r) { if (r.used) rows.push({ r: r, sh: sh }); });
    });
    if (!rows.length) return '';
    rows.sort(function (a, b) { return (b.r.imp ? 1 : 0) - (a.r.imp ? 1 : 0) || a.r.n.localeCompare(b.r.n); });
    return '<section class="block"><h2 class="sec-title">Second-hand goods<small>What the party has sold, and where it is now</small></h2><div class="tbl">' + rows.map(function (x) {
      var away = !onShelf(x.r, day);
      return '<a class="tbl-row" href="#/shop/' + encodeURIComponent(x.sh.id) + '" style="color:inherit;text-decoration:none"><div class="main"><b>' + (x.r.imp ? '★ ' : '') + esc(x.r.n) + '</b><span>' + esc(away ? 'On its way to ' + x.sh.name + ' (day ' + x.r.hold + ')' : 'At ' + x.sh.name) + (x.r.by ? ' · sold by ' + esc(x.r.by) : '') + (x.r.hops ? ' · changed hands ' + x.r.hops + (x.r.hops === 1 ? ' time' : ' times') : '') + '</span></div></a>';
    }).join('') + '</div><p class="note" style="margin:6px 0 0">Anything the party sells stays on the shelf until someone buys it. Most of it is bought within a few weeks; now and then it turns up in another shop. ★ Important pieces sell slowly, and when they do sell they always turn up somewhere else.</p></section>';
  }

  // Opening a shop: empty shelves get stocked, and shelves left alone for a couple of days or more drift.
  function freshenShop(shop) {
    if (!dmView() || isWanderer(shop)) return;
    var day = gameDay(shop);
    ui.shopNews = ui.shopNews || {};
    delete ui.shopNews[shop.id];
    if (!(shop.stock || []).length) {
      shop.stock = stockFor(shop); shop.stocked_at = new Date().toISOString(); shop.stock_day = day;
      ui.shopNews[shop.id] = 'Stocked for the first time' + (day != null ? ' (day ' + day + ')' : '') + '.';
      saveShop(shop); return;
    }
    if (day == null) return;
    if (shop.stock_day == null) { shop.stock_day = day; saveShop(shop); return; }
    var gap = day - num(shop.stock_day, day);
    if (gap >= 2) {
      var lg = driftStock(shop, gap); shop.stock_day = day;
      var bits = [];
      if (lg.out) bits.push(lg.out + ' sold out');
      if (lg.gone) bits.push(lg.gone + ' gone for good');
      if (lg.back) bits.push(lg.back + ' back in');
      if (lg.added) bits.push(lg.added + ' new');
      ui.shopNews[shop.id] = gap + ' days since anyone looked: ' + (bits.length ? bits.join(', ') + ', and prices have moved.' : 'counts and prices have moved a little.');
      saveShop(shop);
    } else if (gap < 0) { shop.stock_day = day; saveShop(shop); }
  }
  function stockFor(shop) {
    var K = ITEMS.shopKinds[shop.kind] || ITEMS.shopKinds['General store'];
    if (K.wander) return wanderStock(shop);
    var p = shop.place_id ? placeOf(shop.place_id) : { size: 2, tags: [], price_mod: 1 };
    var size = Math.max(0, Math.min(4, num(p.size, 2))), eff = size + (hasTag(p, 'trade') ? 1 : 0);
    var armed = hasTag(p, 'forge') || hasTag(p, 'military');
    var out = [];
    ITEMS.items.forEach(function (it) {
      var extra = (K.extra || []).indexOf(it.name) >= 0;
      var inShop = extra || (K.kinds || []).indexOf(it.kind) >= 0 || (K.tags || []).some(function (t) { return it.tags.indexOf(t) >= 0; });
      if (!inShop) return;
      if (!extra && (K.skipKinds || []).indexOf(it.kind) >= 0) return;
      var magicOk = K.magicFrom && eff >= K.magicFrom && it.tags.indexOf('magic') >= 0;
      if (!extra && !magicOk && (K.skipTags || []).some(function (t) { return it.tags.indexOf(t) >= 0; })) return;
      if (it.kind === 'x' && !K.fence) return;
      if (it.tags.indexOf('shady') >= 0 && !K.fence && eff < 3) return;
      if (it.size > eff) return;
      if (it.tags.indexOf('sea') >= 0 && !hasTag(p, 'port')) return;
      if (it.tags.indexOf('river') >= 0 && it.kind === 'b' && !hasTag(p, 'river') && !hasTag(p, 'port')) return;
      if (hasTag(p, 'mining') && !armed && WEAPON_ARMOR.indexOf(it.kind) >= 0 && it.tags.indexOf('mining') < 0) return;
      var chance = [0.45, 0.55, 0.7, 0.85, 0.97][size];
      if (K.fence) chance *= it.kind === 'x' ? 1.6 : 0.3;
      if (it.kind === 's') chance = 1;
      function boost(tag, itTag, x) { if (hasTag(p, tag) && it.tags.indexOf(itTag) >= 0) chance *= x; }
      boost('mining', 'mining', 1.6); boost('port', 'nautical', 1.5); boost('farming', 'farm', 1.4); boost('farming', 'luxury', 0.5);
      boost('frontier', 'survival', 1.5); boost('frontier', 'luxury', 0.4); boost('holy', 'holy', 1.5); boost('forge', 'metal', 1.4);
      if (hasTag(p, 'military') && WEAPON_ARMOR.indexOf(it.kind) >= 0) chance *= 1.5;
      if (hasTag(p, 'trade')) chance *= 1.15;
      if (it.size === eff && it.size > 0) chance *= 0.6;   // the best a place can carry is rarer
      if (Math.random() > chance) return;
      var price = it.price * [1.3, 1.15, 1, 0.95, 0.9][size] * fnum(p.price_mod, 1) * (0.92 + Math.random() * 0.16);
      function pm(tag, itTag, x) { if (hasTag(p, tag) && (!itTag || it.tags.indexOf(itTag) >= 0 || it.kind === itTag)) price *= x; }
      pm('trade', null, 0.9); pm('remote', null, 1.25); pm('frontier', null, 1.15); pm('farming', 'farm', 0.8); pm('farming', 'f', 0.8);
      pm('mining', 'mining', 0.85); pm('port', 'nautical', 0.9); pm('holy', 'holy', 0.9);
      if (hasTag(p, 'forge') && WEAPON_ARMOR.indexOf(it.kind) >= 0) price *= 0.85;
      if (K.fence) price *= it.kind === 'x' ? 1 : 0.7;   // stolen goods go cheap
      var f = [0.4, 0.6, 1, 1.5, 2][size], q;
      if (it.kind === 's') q = null;
      else if (it.price < 0.1) q = Math.max(1, Math.round(rint(10, 40) * f));
      else if (it.price < 1) q = Math.max(1, Math.round(rint(4, 15) * f));
      else if (it.price < 10) q = Math.max(1, Math.round(rint(2, 8) * f));
      else if (it.price < 100) q = Math.max(1, Math.round(rint(1, 4) * f));
      else if (it.price < 1000) q = rint(1, 2);
      else q = 1;
      if (K.fence && q) q = Math.max(1, Math.ceil(q / 2));
      out.push({ n: it.name, k: it.kind, p: niceCp(price * 100) / 100, q: q });
    });
    return out;
  }

  /* ---------- Who's at the counter ---------- */
  function shopStanding(shop, c) {
    var fac = shop.faction_id ? articleById(shop.faction_id) : null;
    if (fac) return Object.assign({ fac: fac }, standingFor(c, fac));
    var st = startStanding(normSheet(c.sheet), { slug: 'townsfolk' });
    return { fac: null, name: STANDINGS[st.pts + 2], idx: st.pts + 2, why: st.why, shift: 0, start: STANDINGS[st.pts + 2] };
  }
  function openCrimes(shop, c) {
    return crimes.filter(function (x) {
      return (!shop.campaign_id || x.campaign_id === shop.campaign_id) && (x.character_id === c.id || !x.character_id) && (x.status === 'Wanted' || x.status === 'Suspected');
    });
  }
  // What they must roll on a d20 to slip past the keeper, by their worst crime.
  var SLIP_TARGET = { Minor: 8, Moderate: 10, Serious: 12, Major: 14, Royal: 16, Imperial: 18 };
  // How a keeper who knows them reacts: by crime, and harsher when the crime happened in his own town.
  var REACTIONS = {
    away: [['ignore', 'hush', 'guards'], ['hush', 'refuse', 'guards'], ['refuse', 'guards']],
    local: [['hush', 'refuse', 'guards'], ['refuse', 'guards'], ['guards']]
  };
  var REACTION_TEXT = { ignore: 'and doesn’t care.', hush: 'and raises his prices to keep quiet.', refuse: 'and refuses to serve them.', guards: 'and calls the guards.' };
  function notoriety(shop, c) {
    var list = openCrimes(shop, c);
    if (!list.length) return null;
    var place = shop.place_id ? articleById(shop.place_id) : null, pname = place ? place.title.toLowerCase() : '';
    var worst = 0, local = false;
    list.forEach(function (x) {
      worst = Math.max(worst, SEVERITIES.indexOf(x.severity));
      if (pname && String(x.location || '').toLowerCase().indexOf(pname) >= 0) local = true;
    });
    var sev = SEVERITIES[worst];
    return { worst: worst, severity: sev, local: local, target: SLIP_TARGET[sev] || 12, list: list };
  }
  function shopKey(shop, c) { return shop.id + '|' + (c ? c.id : ''); }
  function recogMult(shop, c) {
    var r = (ui.recog || {})[shopKey(shop, c)];
    if (!r || !r.hit) return { blocked: false, sell: 1, buy: 1 };
    if (r.mode === 'hush') return { blocked: false, sell: 1.5, buy: 0.5, hush: true };
    if (r.mode === 'ignore') return { blocked: false, sell: 1, buy: 1 };
    return { blocked: true, guards: r.mode === 'guards', sell: 1, buy: 1 };
  }
  function priceFor(shop, c, row) {
    var cp = toCp(row.p);
    if (!c) return cp;
    var st = shopStanding(shop, c), m = SELL_MULT[st.name], r = recogMult(shop, c);
    if (m === null) return null;
    return niceCp(cp * m * r.sell);
  }
  function offerFor(shop, c, itemName) {
    var it = itemByName(itemName), K = ITEMS.shopKinds[shop.kind] || {};
    var row = (shop.stock || []).filter(function (x) { return x.n.toLowerCase() === String(itemName).toLowerCase(); })[0];
    var base = it ? it.price : row ? row.p : null;
    if (base === null) return null;
    var st = shopStanding(shop, c), m = BUY_MULT[st.name], r = recogMult(shop, c);
    if (m === null) return null;
    if (K.fence) m *= 0.6;
    return niceCp(toCp(base) * m * r.buy);
  }

  /* ---------- Pages ---------- */
  function placeSummary(p) {
    return SIZES[num(p.size, 2)] + ((p.tags || []).length ? ' · ' + p.tags.join(', ') : '') + (fnum(p.price_mod, 1) !== 1 ? ' · prices ×' + fnum(p.price_mod, 1) : '');
  }
  function placeSettings(a) {
    var p = placeOf(a.id);
    return '<div class="group-box place-box"><p class="eyebrow" style="margin:0 0 6px;font-size:11px">How big, and what it’s known for</p>' +
      '<div class="two"><div class="field"><label for="pl-size-' + esc(a.id) + '">Size</label><select id="pl-size-' + esc(a.id) + '" data-place="' + esc(a.id) + '" data-pfield="size">' + SIZES.map(function (s, i) { return '<option value="' + i + '"' + (i === num(p.size, 2) ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select></div>' +
      '<div class="field"><label for="pl-mod-' + esc(a.id) + '">Price level</label><select id="pl-mod-' + esc(a.id) + '" data-place="' + esc(a.id) + '" data-pfield="price_mod">' + [[0.8, 'Cheap (×0.8)'], [0.9, 'Low (×0.9)'], [1, 'Normal'], [1.1, 'High (×1.1)'], [1.25, 'Steep (×1.25)'], [1.5, 'Gouging (×1.5)']].map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === fnum(p.price_mod, 1) ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select></div></div>' +
      '<div class="chips" role="group" aria-label="Known for">' + Object.keys(ITEMS.placeTags).map(function (t) {
        return '<button type="button" class="chip pick" data-act="place-tag" data-place="' + esc(a.id) + '" data-tag="' + t + '" aria-pressed="' + hasTag(p, t) + '" title="' + esc(ITEMS.placeTags[t].about) + '">' + t + '</button>';
      }).join('') + '</div>' + (p.unset ? '<p class="note" style="margin:6px 0 0">Not set yet: shops here stock like a plain town.</p>' : '') + '</div>';
  }
  function shopRows(list) {
    if (!list.length) return '<div class="empty">No shops here yet.</div>';
    return '<div class="list">' + list.map(function (s) {
      var f = s.faction_id ? articleById(s.faction_id) : null;
      return '<a class="row" href="#/shop/' + encodeURIComponent(s.id) + '"><span class="row-main"><b>' + esc(s.name) + '</b><span>' + esc([s.trade && isWanderer(s) ? s.trade : s.kind, String(s.keeper || '').replace(/\[\[|\]\]/g, ''), f ? f.title : ''].filter(Boolean).join(' · ')) + '</span></span><span class="tag plain">' + (s.stock || []).length + ' items</span></a>';
    }).join('') + '</div>';
  }
  function placeShopsBlock(a, campId) {
    return '<section class="block shops-block"><h2 class="sec-title"><a class="link" href="#/a/' + encodeURIComponent(a.slug) + '">' + esc(a.title) + '</a><small>' + esc(placeSummary(placeOf(a.id))) + '</small></h2>' +
      placeSettings(a) + shopRows(shopsAt(a.id)) +
      '<div class="actions"><button type="button" class="btn small" data-act="new-shop" data-place="' + esc(a.id) + '" data-campaign="' + esc(campId || a.campaign_id || '') + '">+ Shop in ' + esc(a.title) + '</button></div></section>';
  }
  // Shown on a settlement's article, to the DM only.
  function articleShopsHtml(a) {
    if (!dmView() || a.template !== 'Settlement' || !loaded.shops) return '';
    return '<section class="secret shops-secret"><h2>SHOPS (DM)</h2>' + placeSettings(a) + shopRows(shopsAt(a.id)) +
      '<div class="actions"><button type="button" class="btn small" data-act="new-shop" data-place="' + esc(a.id) + '" data-campaign="' + esc(a.campaign_id || '') + '">+ Add a shop</button></div><span class="note">Players never see shops. Open one when they walk in.</span></section>';
  }

  // Which settlement a map shows: a pin elsewhere that opens this map, or the map's name.
  function settlementForMap(m) {
    var hit = null;
    Object.keys(markers).forEach(function (mid) {
      (markers[mid] || []).forEach(function (mk) {
        if (!hit && mk.target_map_id === m.id && mk.article_slug) { var a = articleBySlug(mk.article_slug); if (a && a.template === 'Settlement') hit = a; }
      });
    });
    if (hit) return hit;
    function bare(t) { return String(t || '').toLowerCase().replace(/[^a-z0-9]/g, ''); }
    var name = bare(m.name);
    return settlementsFor(null).filter(function (a) { return bare(a.title) && name.indexOf(bare(a.title)) >= 0; })
      .sort(function (a, b) { return b.title.length - a.title.length; })[0] || null;
  }
  function mapShopsSection(m) {
    var pl = settlementForMap(m);
    var here = shops.filter(function (sp) { return sp.map_id === m.id; });
    var loose = pl ? shopsAt(pl.id).filter(function (sp) { return sp.map_id !== m.id; }) : [];
    if (!pl && !here.length) return '';
    var html = '<section class="block"><h2 class="sec-title">Shops' + (pl ? ' in ' + esc(pl.title) : '') + '<small>Only you see these</small></h2>';
    if (here.length) html += '<div class="pill-row">' + here.map(function (sp) { return '<button type="button" class="opt" style="width:auto;min-height:40px;font-family:var(--ui);font-size:13px" data-act="shop-pin" data-id="' + esc(sp.id) + '">' + esc(sp.name) + '</button>'; }).join('') + '</div>';
    if (loose.length) html += '<p class="note" style="margin:10px 0 4px">Not on this map yet:</p><div class="tbl">' + loose.map(function (sp) {
      return '<div class="tbl-row"><div class="main"><b>' + esc(sp.name) + '</b><span>' + esc(sp.kind) + '</span></div><a class="btn small quiet" href="#/shop/' + encodeURIComponent(sp.id) + '">Open</a><button type="button" class="btn small" data-act="shop-place" data-id="' + esc(sp.id) + '">Pin it</button></div>';
    }).join('') + '</div>';
    if (!here.length && !loose.length) html += '<div class="empty">No shops here yet.</div>';
    return html + '<div class="actions"><button type="button" class="btn small primary" data-act="place" data-kind="newshop">+ New shop on the map</button></div></section>';
  }
  function renderShops(slug) {
    if (!loaded.wiki || !loaded.shops) { $view.innerHTML = '<div class="page"><div class="empty">Opening the market…</div></div>'; return; }
    var camp = campaignBySlug(slug);
    if (!camp) { location.replace('#/wiki'); return; }
    var q = (ui.shopQuery || '').trim().toLowerCase();
    var setts = settlementsFor(camp.id).filter(function (a) { return !q || a.title.toLowerCase().indexOf(q) >= 0 || shopsAt(a.id).some(function (s) { return s.name.toLowerCase().indexOf(q) >= 0; }); });
    var html = '<div class="page"><p class="crumbs"><a href="#/campaign/' + encodeURIComponent(camp.slug) + '">' + esc(camp.name) + '</a></p><h1 class="page-title">Shops</h1>' +
      '<p class="note">Only you see these. When the party walks into a shop, open it, pick who’s buying, and tap Sell. Coins and gear update on their sheet.</p>' +
      '<label class="search"><span class="sr">Find a place or shop</span>' + SEARCH_ICON + '<input id="shop-q" type="search" placeholder="Find a place or shop…" value="' + esc(ui.shopQuery || '') + '" autocomplete="off"></label>';
    if (!setts.length) html += '<div class="empty">No settlements' + (q ? ' match' : ' yet. Write a Settlement article first') + '.</div>';
    // Grouped by district, each place folded so 100 towns stay readable.
    var byReg = {};
    setts.forEach(function (a) { var rg = String((a.fields || {}).Region || 'Elsewhere').replace(/\[\[|\]\]/g, ''); (byReg[rg] = byReg[rg] || []).push(a); });
    Object.keys(byReg).sort().forEach(function (rg) {
      var list = byReg[rg], n = list.reduce(function (t, a) { return t + shopsAt(a.id).length; }, 0);
      html += '<details class="folder shop-reg"' + (q ? ' open' : '') + '><summary><span>' + esc(rg) + '</span><small>' + list.length + ' places · ' + n + ' shops</small></summary>';
      list.forEach(function (a) {
        var hs = shopsAt(a.id);
        html += '<details class="shop-place"' + (q ? ' open' : '') + '><summary><b>' + esc(a.title) + '</b><small>' + esc(placeSummary(placeOf(a.id))) + ' · ' + hs.length + (hs.length === 1 ? ' shop' : ' shops') + '</small></summary>' + placeShopsBlock(a, camp.id) + '</details>';
      });
      html += '</details>';
    });
    var wand = shops.filter(function (s) { return isWanderer(s) && s.saved !== false && (!s.campaign_id || s.campaign_id === camp.id) && (!q || s.name.toLowerCase().indexOf(q) >= 0 || String(s.keeper || '').toLowerCase().indexOf(q) >= 0); });
    html += '<section class="block shops-block"><h2 class="sec-title">Wandering merchants<small>On the road, not in a town</small></h2>' +
      (wand.length ? shopRows(wand) : '<div class="empty">No wandering merchants yet.</div>') +
      '<div class="actions">' + meetButton(camp.id, true) + '<button type="button" class="btn small" data-act="new-shop" data-kind="Wandering merchant" data-campaign="' + esc(camp.id) + '">+ Make one yourself</button></div>' +
      '<p class="note" style="margin:6px 0 0">Meet a wandering merchant picks one of these or a brand-new stranger, all equally likely, with fresh wares. Keep the strangers you like.</p></section>';
    if (ui.marketTicked !== camp.id) { ui.marketTicked = camp.id; marketTick(camp.id); }
    html += usedGoodsSection(camp.id);
    var loose = shops.filter(function (s) { return !isWanderer(s) && (!s.place_id || !articleById(s.place_id)) && (!s.campaign_id || s.campaign_id === camp.id); });
    if (loose.length) html += '<section class="block"><h2 class="sec-title">Shops with no place</h2>' + shopRows(loose) + '</section>';
    $view.innerHTML = html + '</div>';
  }

  function renderShop(id) {
    if (!loaded.wiki || !loaded.shops || !loaded.chars) { $view.innerHTML = '<div class="page"><div class="empty">Opening the shop…</div></div>'; return; }
    var shop = shopById(id);
    if (!shop) { $view.innerHTML = '<div class="page narrow"><div class="empty">That shop is gone.</div></div>'; return; }
    if (ui.freshened !== shop.id) { ui.freshened = shop.id; if (ui.marketNews) delete ui.marketNews[shop.id]; marketTick(shop.campaign_id); freshenShop(shop); }
    var place = shop.place_id ? articleById(shop.place_id) : null, camp = shop.campaign_id ? campaignById(shop.campaign_id) : null;
    var K = ITEMS.shopKinds[shop.kind] || {};
    var chars = camp ? campaignChars(camp.id) : characters;
    ui.shopChar = ui.shopChar || {};
    var cid = ui.shopChar[shop.id], c = cid ? charById(cid) : null;
    var s = c ? normSheet(c.sheet) : null;
    var qty = Math.max(1, num(ui.shopQty, 1));
    var html = '<section class="hero"><div class="hero-in"><p class="crumbs">' + (camp ? '<a href="#/shops/' + encodeURIComponent(camp.slug) + '">Shops</a>' : '') + (place ? ' › <a href="#/a/' + encodeURIComponent(place.slug) + '">' + esc(place.title) + '</a>' : '') + '</p><h1>' + esc(shop.name) + '</h1>' +
      '<p class="crumbs">' + [esc(shop.trade && isWanderer(shop) ? 'Wandering merchant · ' + shop.trade : shop.kind), shop.keeper ? inline(shop.keeper) : '', shop.faction_id ? factionLinkHtml(shop.faction_id) : '', place ? esc(placeSummary(placeOf(place.id))) : ''].filter(Boolean).join(' · ') + '</p></div></section><div class="page">';
    if (isWanderer(shop) && shop.saved === false) html += '<div class="group-box new-face"><p class="eyebrow" style="margin:0 0 4px;font-size:11px">A stranger on the road</p><p style="margin:0 0 8px">Like this one? Keep them and they can turn up again. Otherwise they\u2019re gone the next time you meet someone new.</p><div class="actions" style="margin:0"><button type="button" class="btn small primary" data-act="shop-keep" data-id="' + esc(shop.id) + '">Keep this merchant</button>' + (shop.campaign_id ? meetButton(shop.campaign_id, false, 'Someone else') : '') + '</div></div>';
    if (shop.notes) html += '<div class="prose">' + rich(shop.notes) + '</div>';
    if (ui.shopNews && ui.shopNews[shop.id]) html += '<p class="note shop-news">' + esc(ui.shopNews[shop.id]) + '</p>';
    if (ui.marketNews && (ui.marketNews[shop.id] || []).length) html += ui.marketNews[shop.id].map(function (t) { return '<p class="note shop-news">' + esc(t) + '</p>'; }).join('');
    else if (shop.stock_day != null && !isWanderer(shop)) html += '<p class="note shop-news">Shelves as of day ' + esc(shop.stock_day) + '. Come back after 2 days or more and they’ll have changed.</p>';
    var smap = shop.map_id ? mapById(shop.map_id) : null;
    html += '<div class="actions">' + (smap ? '<a class="btn" href="#/map/' + encodeURIComponent(smap.id) + '">On the ' + esc(smap.name) + ' map</a>' : '') + '<a class="btn" href="#/shop-edit/' + encodeURIComponent(shop.id) + '">Edit shop</a><button type="button" class="btn' + ((shop.stock || []).length ? '' : ' primary') + '" data-act="shop-stock" data-id="' + esc(shop.id) + '">' + ((shop.stock || []).length ? (ui.pendingDelete === 'restock:' + shop.id ? 'Tap again to replace the stock' : 'Restock') : 'Stock it') + '</button>' +
      '<button type="button" class="btn quiet" data-act="shop-edit-toggle" aria-pressed="' + !!ui.shopEdit + '">' + (ui.shopEdit ? 'Done editing' : 'Edit stock') + '</button></div>';

    // Customer
    html += '<section class="block group-box counter"><div class="two"><div class="field"><label for="shop-char">At the counter</label><select id="shop-char" data-shop-char="' + esc(shop.id) + '"><option value="">Nobody (just looking)</option>' +
      chars.map(function (x) { return '<option value="' + esc(x.id) + '"' + (c && x.id === c.id ? ' selected' : '') + '>' + esc(x.name) + '</option>'; }).join('') + '</select></div>' +
      '<div class="field"><label for="shop-qty">How many</label><input type="number" id="shop-qty" min="1" value="' + qty + '" inputmode="numeric"></div></div>';
    if (c) {
      var st = shopStanding(shop, c), rm = recogMult(shop, c);
      html += '<p class="counter-line"><b>' + money(walletCp(s)) + '</b> in their purse · ' + standingTag(st.name) + ' ' + (st.fac ? 'with ' + esc(st.fac.title) : 'with the townsfolk') +
        (SELL_MULT[st.name] === null ? ' · <b>won’t deal with them</b>' : SELL_MULT[st.name] !== 1 ? ' · prices ×' + SELL_MULT[st.name] : '') + '</p>';
      if (st.why.length) html += '<p class="note" style="margin:0">' + esc(standingWhy(st)) + '</p>';
      if (K.fence) html += '<p class="note" style="margin:6px 0 0">A fence doesn’t care who you are.</p>';
      else {
        var nt = notoriety(shop, c), key = shopKey(shop, c);
        if (nt && !(ui.recog || {})[key]) autoRecog(shop, c, nt);
        var rr = (ui.recog || {})[key];
        if (!nt) html += '<p class="note" style="margin:6px 0 0">Nothing on the law’s books. Nobody to recognize.</p>';
        else {
          html += '<div class="recog"><p style="margin:6px 0 0"><span class="tag">' + (nt.list.some(function (x) { return x.status === 'Wanted'; }) ? 'Wanted' : 'Suspected') + '</span> <span class="note">' + esc(nt.severity) + ' crime' + (nt.local ? ', committed in this town' : '') + '.</span></p>' +
            '<label class="check" style="margin-top:6px"><input type="checkbox" id="shop-disguise" data-shop="' + esc(shop.id) + '"' + (rr && rr.disguised ? ' checked' : '') + '> Disguised (checks again, harder to spot)</label>';
          if (rr) {
            html += '<p class="recog-res ' + (rr.hit ? 'hit' : 'miss') + '">' + (rr.hit ? 'The keeper recognizes them, ' + REACTION_TEXT[rr.mode || 'refuse'] : 'No sign of recognition.') + '</p>';
            if (rr.hit) html += '<p class="note" style="margin:6px 0 2px">Change his reaction:</p><div class="seg wide" role="group" aria-label="What the keeper does">' + [['ignore', 'Doesn’t care'], ['hush', 'Raises prices (×1.5)'], ['refuse', 'Refuses'], ['guards', 'Calls the guards']].map(function (o) {
              return '<button type="button" data-act="shop-recog-mode" data-id="' + esc(shop.id) + '" data-mode="' + o[0] + '" aria-pressed="' + ((rr.mode || 'refuse') === o[0]) + '">' + o[1] + '</button>';
            }).join('') + '</div>';
          }
          html += '</div>';
        }
      }
      if (rm.blocked) html += '<p class="recog-res hit">' + (rm.guards ? 'The guards are on their way. No trade.' : 'No sale. The keeper won’t deal with them.') + '</p>';
    }
    html += '</section>';

    // Stock
    var stock = (shop.stock || []).slice(), today = gameDay(shop), coming = 0;
    var groups = {};
    stock.forEach(function (row, i) { if (!onShelf(row, today)) { coming++; return; } var k = KIND_LABEL[row.k] ? row.k : 'z'; (groups[k] = groups[k] || []).push({ row: row, i: i }); });
    html += '<section class="block"><h2 class="sec-title">For sale<small>' + (stock.length - coming) + ' items</small></h2>';
    if (coming) html += '<p class="note" style="margin:0 0 8px">' + coming + (coming === 1 ? ' second-hand piece is' : ' second-hand pieces are') + ' on the way here. Shoppers can’t see ' + (coming === 1 ? 'it' : 'them') + ' yet.</p>';
    if (!stock.length) html += '<div class="empty">Empty shelves. Tap “Stock it” to fill them for a ' + esc(place ? SIZES[num(placeOf(place.id).size, 2)].toLowerCase() : 'town') + '.</div>';
    var blocked = c ? recogMult(shop, c).blocked : false;
    KIND_ORDER.forEach(function (k) {
      if (!groups[k]) return;
      html += '<h3 class="kind-h">' + esc(KIND_LABEL[k]) + '</h3><div class="tbl">' + groups[k].sort(function (a, b) { return a.row.n.localeCompare(b.row.n); }).map(function (g) {
        var row = g.row, price = priceFor(shop, c, row), out = row.q !== null && row.q !== undefined && num(row.q, 0) <= 0;
        var left = row.q === null || row.q === undefined ? '' : ' · ' + num(row.q, 0) + ' left';
        if (ui.shopEdit) return '<div class="tbl-row stock-row"><div class="main"><b>' + esc(row.n) + '</b></div>' +
          '<label class="sr" for="sp-' + g.i + '">Price in gp</label><input type="number" class="input mini" id="sp-' + g.i + '" data-shop-row="' + g.i + '" data-sfield="p" data-id="' + esc(shop.id) + '" value="' + row.p + '" min="0" step="0.01" inputmode="decimal">' +
          '<label class="sr" for="sq-' + g.i + '">How many</label><input type="number" class="input mini" id="sq-' + g.i + '" data-shop-row="' + g.i + '" data-sfield="q" data-id="' + esc(shop.id) + '" value="' + (row.q === null || row.q === undefined ? '' : row.q) + '" placeholder="∞" min="0" inputmode="numeric">' +
          '<button type="button" class="btn small quiet" data-act="shop-rm" data-id="' + esc(shop.id) + '" data-i="' + g.i + '" aria-label="Remove ' + esc(row.n) + '">✕</button></div>';
        var cant = !c || price === null || blocked || out || walletCp(s) < price * (row.q === null || row.q === undefined ? qty : Math.min(qty, num(row.q, 0)) || qty);
        var used = row.used ? ' · second-hand' + (row.by ? ', sold by ' + esc(row.by) : '') + (row.came ? ', came from ' + esc(row.came) : '') : '';
        return '<div class="tbl-row"><div class="main"><b>' + (row.imp ? '★ ' : '') + esc(row.n) + '</b><span>' + (price === null ? 'Not to them' : money(price)) + (c && price !== null && price !== toCp(row.p) ? ' <s class="note">' + money(toCp(row.p)) + '</s>' : '') + left + used + '</span></div>' +
          (row.used ? '<button type="button" class="btn small quiet" data-act="shop-imp" data-id="' + esc(shop.id) + '" data-i="' + g.i + '" aria-pressed="' + !!row.imp + '" title="Important pieces sell slowly and resurface elsewhere">' + (row.imp ? '★ Important' : '☆ Important') + '</button>' : '') +
          (out ? '<span class="tag plain">Sold out</span>' : c ? '<button type="button" class="btn small primary" data-act="shop-sell" data-id="' + esc(shop.id) + '" data-i="' + g.i + '"' + (cant ? ' disabled' : '') + '>Sell' + (qty > 1 ? ' ' + qty : '') + '</button>' : '') + '</div>';
      }).join('') + '</div>';
    });
    if (ui.shopEdit) html += '<datalist id="dl-items">' + ITEMS.items.map(function (i) { return '<option value="' + esc(i.name) + '">'; }).join('') + '</datalist>' +
      '<form class="inline-form" id="shop-add" novalidate data-id="' + esc(shop.id) + '" style="margin-top:10px"><div class="field"><label for="sa-name">Add an item</label><input type="text" id="sa-name" list="dl-items" maxlength="80" placeholder="From the list, or anything"></div>' +
      '<div class="field"><label for="sa-price">Price (gp)</label><input type="number" id="sa-price" min="0" step="0.01" inputmode="decimal" placeholder="List price"></div><div class="field"><label for="sa-qty">How many</label><input type="number" id="sa-qty" min="0" inputmode="numeric" placeholder="∞"></div><button type="submit" class="btn primary">Add</button></form>';
    html += '</section>';

    // Buying from the customer
    if (c && !ui.shopEdit) {
      var inv = s.items.filter(function (it) { return num(it.qty, 1) > 0; });
      html += '<section class="block"><h2 class="sec-title">Buy from ' + esc(c.name) + '<small>' + (K.fence ? 'fences pay little' : 'about half value') + '</small></h2>';
      if (!inv.length) html += '<div class="empty">Nothing in their pack to sell.</div>';
      else html += '<div class="tbl">' + inv.map(function (it) {
        var i = s.items.indexOf(it), off = offerFor(shop, c, it.name);
        return '<div class="tbl-row"><div class="main"><b>' + esc(it.name) + '</b><span>×' + num(it.qty, 1) + (off ? ' · offers ' + money(off) + ' each' : ' · not on the list, name a price') + '</span></div>' +
          '<label class="sr" for="bo-' + i + '">Offer in gp</label><input type="number" class="input mini" id="bo-' + i + '" min="0" step="0.01" inputmode="decimal" value="' + (off ? off / 100 : '') + '" placeholder="gp">' +
          '<button type="button" class="btn small" data-act="shop-buy" data-id="' + esc(shop.id) + '" data-i="' + i + '"' + (blocked ? ' disabled' : '') + '>Buy 1</button></div>';
      }).join('') + '</div>';
      html += '</section>';
    }

    // Ledger
    var led = shop.ledger || [];
    if (led.length) html += '<section class="block"><h2 class="sec-title">Recent sales<small>' + led.length + '</small></h2><div class="tbl">' + led.slice(0, 12).map(function (l) {
      return '<div class="tbl-row"><div class="main"><b>' + esc(l.who) + (l.dir === 'bought' ? ' sold ' : ' bought ') + esc(l.qty > 1 ? l.qty + '× ' + l.what : l.what) + '</b><span>' + esc(new Date(l.at).toLocaleDateString()) + '</span></div><span class="num">' + money(l.cp) + '</span></div>';
    }).join('') + '</div></section>';
    $view.innerHTML = html + '</div>';
  }
  function factionLinkHtml(id) { var a = articleById(id); return a ? '<a class="link" href="#/a/' + encodeURIComponent(a.slug) + '">' + esc(a.title) + '</a>' : ''; }

  function renderShopEdit(id) {
    if (!loaded.wiki || !loaded.shops) { $view.innerHTML = '<div class="page"><div class="empty">Opening…</div></div>'; return; }
    var shop = id && id !== 'new' ? shopById(id) : null;
    if (id && id !== 'new' && !shop) { location.replace('#/wiki'); return; }
    var ns = ui.newShop || {};
    var v = shop || { name: '', kind: ns.kind || 'General store', place_id: ns.place || '', campaign_id: ns.campaign || '', faction_id: '', keeper: '', notes: '', watch: 0 };
    var facs = factionsFor(v.campaign_id || null), setts = settlementsFor(v.campaign_id || null);
    $view.innerHTML = '<div class="page narrow"><form class="form" id="shop-form" novalidate data-id="' + esc(shop ? shop.id : '') + '"><div><p class="eyebrow">' + (shop ? 'Edit' : 'New') + ' shop</p><h1 class="page-title">' + (shop ? esc(shop.name) : 'Open a shop') + '</h1></div>' +
      '<div class="field"><label for="sh-name">Name</label><input type="text" id="sh-name" maxlength="80" value="' + esc(v.name) + '" placeholder="e.g. The Bent Nail"></div>' +
      '<div class="two"><div class="field"><label for="sh-kind">Kind</label><select id="sh-kind">' + Object.keys(ITEMS.shopKinds).map(function (k) { return '<option' + (k === v.kind ? ' selected' : '') + '>' + k + '</option>'; }).join('') + '</select><span class="hint" id="sh-kind-hint">' + esc((ITEMS.shopKinds[v.kind] || {}).about || '') + '</span></div>' +
      '<div class="field"><label for="sh-place">Where</label><select id="sh-place"><option value="">Nowhere in particular</option>' + setts.map(function (a) { return '<option value="' + esc(a.id) + '"' + (a.id === v.place_id ? ' selected' : '') + '>' + esc(a.title) + '</option>'; }).join('') + '</select></div></div>' +
      '<div class="field"><label for="sh-trade">Trade</label><select id="sh-trade"><option value="">Not a wandering merchant</option>' + Object.keys(ITEMS.trades || {}).map(function (k) { return '<option' + (k === v.trade ? ' selected' : '') + '>' + esc(k) + '</option>'; }).join('') + '</select><span class="hint">Only for wandering merchants: decides what they carry.</span></div>' +
      '<div class="field"><label for="sh-keeper">Keeper</label><input type="text" id="sh-keeper" maxlength="120" value="' + esc(v.keeper) + '" placeholder="e.g. [[Old Brannoc]], a one-eyed smith"><span class="hint">Use [[Name]] to link an NPC article.</span></div>' +
      '<div class="two"><div class="field"><label for="sh-fac">Answers to</label><select id="sh-fac"><option value="">Nobody (townsfolk)</option>' + facs.map(function (a) { return '<option value="' + esc(a.id) + '"' + (a.id === v.faction_id ? ' selected' : '') + '>' + esc(a.title) + '</option>'; }).join('') + '</select><span class="hint">Standing with this faction sets prices.</span></div>' +
      '</div>' +
      '<div class="field"><label for="sh-notes">Notes</label><textarea id="sh-notes" maxlength="2000">' + esc(v.notes) + '</textarea></div>' +
      '<div class="actions"><button type="submit" class="btn primary">' + (shop ? 'Save' : 'Open the shop') + '</button><a class="btn" href="' + (shop ? '#/shop/' + encodeURIComponent(shop.id) : 'javascript:history.back()') + '">Cancel</a>' +
      (shop ? '<button type="button" class="btn danger" data-act="shop-delete" data-id="' + esc(shop.id) + '">' + (ui.pendingDelete === 'shop:' + shop.id ? 'Tap again to delete' : 'Delete') + '</button>' : '') + '</div></form></div>';
  }
  function saveShopForm(form) {
    var id = form.getAttribute('data-id'), ns = ui.newShop || {};
    var row = {
      name: document.getElementById('sh-name').value.trim().slice(0, 80), kind: document.getElementById('sh-kind').value,
      place_id: document.getElementById('sh-place').value || null, faction_id: document.getElementById('sh-fac').value || null,
      keeper: document.getElementById('sh-keeper').value.trim().slice(0, 120), watch: 0, trade: (document.getElementById('sh-trade') || {}).value || null,
      notes: document.getElementById('sh-notes').value.trim().slice(0, 2000)
    };
    if (!row.name) return toast('Give the shop a name.');
    if (!id) {
      var pa = row.place_id ? articleById(row.place_id) : null;
      row.campaign_id = ns.campaign || (pa && pa.campaign_id) || null;
      if (ns.map_id) { row.map_id = ns.map_id; row.map_x = ns.x; row.map_y = ns.y; }
    }
    var op = id ? sb.from('shops').update(row).eq('id', id).select('*').single() : sb.from('shops').insert(row).select('*').single();
    op.then(function (r) {
      if (r.error) return fail(r.error, 'Could not save the shop.');
      var i = shops.map(function (x) { return x.id; }).indexOf(r.data.id);
      if (i >= 0) shops[i] = r.data; else shops.push(r.data);
      ui.newShop = null;
      // A brand-new shop gets stocked straight away.
      if (!id) { r.data.stock = stockFor(r.data); r.data.stocked_at = new Date().toISOString(); r.data.stock_day = gameDay(r.data); saveShop(r.data, 'Opened and stocked'); }
      else toast('Saved');
      go('#/shop/' + encodeURIComponent(r.data.id));
    });
  }
  function saveShop(shop, msg) {
    return sb.from('shops').update({ stock: shop.stock, ledger: shop.ledger || [], stocked_at: shop.stocked_at || null, stock_day: shop.stock_day == null ? null : shop.stock_day }).eq('id', shop.id).then(function (r) {
      if (r.error) return fail(r.error, 'Could not save the shop.');
      if (msg) toast(msg);
    });
  }
  function savePlace(articleId, patch) {
    var p = placeOf(articleId), row = { article_id: articleId, size: num(p.size, 2), tags: (p.tags || []).slice(), price_mod: fnum(p.price_mod, 1), updated_at: new Date().toISOString() };
    Object.assign(row, patch);
    sb.from('places').upsert(row).then(function (r) {
      if (r.error) return fail(r.error, 'Could not save that.');
      var i = places.map(function (x) { return x.article_id; }).indexOf(articleId);
      if (i >= 0) places[i] = row; else places.push(row);
      render();
    });
  }
  function ledgerAdd(shop, entry) {
    shop.ledger = [Object.assign({ at: new Date().toISOString() }, entry)].concat(shop.ledger || []).slice(0, 60);
  }
  function shopSell(shop, i) {
    var c = charById(ui.shopChar && ui.shopChar[shop.id]), row = (shop.stock || [])[i];
    if (!c || !row) return;
    var s = normSheet(c.sheet), each = priceFor(shop, c, row);
    if (each === null || recogMult(shop, c).blocked) return toast('They won’t sell to ' + c.name + '.');
    var limited = row.q !== null && row.q !== undefined;
    var q = Math.max(1, num(ui.shopQty, 1));
    if (limited) q = Math.min(q, num(row.q, 0));
    if (q <= 0) return toast('Sold out.');
    var cost = each * q, have = walletCp(s);
    if (have < cost) return toast(c.name + ' is ' + money(cost - have) + ' short.');
    setWallet(s, have - cost);
    if (row.k !== 's') {
      var mine = s.items.filter(function (it) { return it.name.toLowerCase() === row.n.toLowerCase(); })[0];
      if (mine) mine.qty = num(mine.qty, 1) + q; else s.items.push({ name: row.n, notes: '', qty: q });
    }
    if (limited) row.q = num(row.q, 0) - q;
    if (row.used && num(row.q, 0) <= 0) shop.stock.splice(i, 1);
    c.sheet = s;
    ledgerAdd(shop, { who: c.name, what: row.n, qty: q, cp: cost, dir: 'sold' });
    saveCharSoon(c);
    saveShop(shop, c.name + ' paid ' + money(cost));
    render();
  }
  function shopBuy(shop, i) {
    var c = charById(ui.shopChar && ui.shopChar[shop.id]);
    if (!c) return;
    var s = normSheet(c.sheet), it = s.items[i];
    if (!it || num(it.qty, 1) <= 0) return;
    if (recogMult(shop, c).blocked) return toast('They won’t deal with ' + c.name + '.');
    var inp = document.getElementById('bo-' + i), cp = toCp(inp ? inp.value : 0);
    if (!cp) return toast('Name a price first.');
    setWallet(s, walletCp(s) + cp);
    it.qty = num(it.qty, 1) - 1;
    if (it.qty <= 0) s.items.splice(i, 1);
    // It goes on the shelf at about list price.
    var cat = itemByName(it.name), row = (shop.stock || []).filter(function (x) { return x.n.toLowerCase() === it.name.toLowerCase(); })[0];
    if (row) { if (row.q !== null && row.q !== undefined) row.q = num(row.q, 0) + 1; }
    else (shop.stock = shop.stock || []).push({ n: it.name, k: cat ? cat.kind : 'z', p: cat ? cat.price : Math.round(cp * 2) / 100, q: 1, used: true, by: c.name, seen: gameDay(shop) });
    c.sheet = s;
    ledgerAdd(shop, { who: c.name, what: it.name, qty: 1, cp: cp, dir: 'bought' });
    saveCharSoon(c);
    saveShop(shop, 'Paid ' + c.name + ' ' + money(cp));
    render();
  }
  // The check runs on its own when a wanted face walks in: they roll a d20 to slip past, against a target set by their worst crime.
  // A crime in this town gives the keeper advantage (they keep the worse of two); a disguise gives them advantage. Only the outcome is shown.
  function autoRecog(shop, c, nt, disguised) {
    var a = 1 + Math.floor(Math.random() * 20), b = 1 + Math.floor(Math.random() * 20);
    var edge = (disguised ? 1 : 0) - (nt.local ? 1 : 0);
    var d = edge > 0 ? Math.max(a, b) : edge < 0 ? Math.min(a, b) : a;
    var hit = d < nt.target;
    var tier = nt.worst <= 0 ? 0 : nt.worst === 1 ? 1 : 2;
    var opts = REACTIONS[nt.local ? 'local' : 'away'][tier];
    ui.recog = ui.recog || {};
    ui.recog[shopKey(shop, c)] = { hit: hit, mode: hit ? opts[Math.floor(Math.random() * opts.length)] : 'ignore', disguised: !!disguised };
  }
  function shopRecog(shop, hit) {
    var c = charById(ui.shopChar && ui.shopChar[shop.id]);
    if (!c) return;
    ui.recog = ui.recog || {};
    ui.recog[shopKey(shop, c)] = { hit: !!hit, mode: hit ? 'refuse' : 'ignore' };
    render();
  }

  /* ================= Travel ================= */
  // Rules are a grid: miles per day for each terrain and way of traveling, times a pace multiplier.
  function rulesOf(t) {
    var r = (t && t.rules) || {}, out;
    if (Array.isArray(r.modes) && r.speeds) {
      out = { modes: r.modes.map(String), terrains: (r.terrains || []).map(String), speeds: r.speeds, paces: r.paces || { Normal: 1 }, ground: groundOf(r, r.terrains || []) };
    } else {
      // Older shape (mode miles x terrain multiplier): turn it into a grid.
      var modes = Object.keys(r.modes || { Walking: 24 }), terrains = Object.keys(r.terrains || { Plains: 1 }), speeds = {};
      terrains.forEach(function (tn) { speeds[tn] = {}; modes.forEach(function (mn) { speeds[tn][mn] = Math.round(Number(r.modes[mn] || 0) * Number(r.terrains[tn] || 1) * 10) / 10; }); });
      out = { modes: modes, terrains: terrains, speeds: speeds, paces: r.paces || { Normal: 1 }, ground: groundOf(r, terrains) };
    }
    out.boats = boatsOf(r);
    out.airships = airshipsOf(r);
    // The party's own ships, with whatever is fitted to them, travel as modes of their own.
    if (t && t.campaign_id && typeof holdings !== 'undefined') holdings.forEach(function (h) {
      if (h.campaign_id !== t.campaign_id || (h.kind !== 'ship' && h.kind !== 'airship') || holdMode(h).mode !== 'party' || cantSail(h)) return;
      var d = h.data || {}, st = shipStats(h);
      if (h.kind === 'ship') {
        var b = out.boats.filter(function (x) { return x.name === d.vessel; })[0]; if (!b) return;
        var cr = statOf(h) && statOf(h).cond === 'Crippled' ? 0.5 : 1;
        out.boats.push({ name: h.name, mi: Math.round(b.mi * (1 + st.speed) * cr * 10) / 10, river: st.river && (!b.river || b.river === 'b') ? st.river : b.river, sea: b.sea, weather: st.weather, own: true });
      } else {
        var a = out.airships.filter(function (x) { return x.name === (d.vessel || 'Airship'); })[0] || out.airships[0]; if (!a) return;
        var cra = statOf(h) && statOf(h).cond === 'Crippled' ? 0.5 : 1;
        out.airships.push({ name: h.name, mi: Math.round(a.mi * (1 + st.speed) * cra * 10) / 10, ceiling: a.ceiling + st.ceiling, storm: st.storm > 0, own: true });
      }
    });
    out.skies = r.skies && Object.keys(r.skies).length ? r.skies : Object.assign({}, DEFAULT_SKY);
    out.weathers = r.weathers && Object.keys(r.weathers).length ? r.weathers : Object.assign({}, DEFAULT_WEATHER);
    var cur = r.current || {};
    out.current = { down: cur.down != null ? Number(cur.down) : 1.5, up: cur.up != null ? Number(cur.up) : 0.5 };
    return out;
  }
  /* Boats. river = the smallest river it fits on ('s' stream, 'v' river, 'b' great river; '' stays off rivers).
     sea = how far out it can go ('c' coastal only, 'd' deep water too; '' stays off the sea). */
  var DEFAULT_BOATS = [
    { name: 'Rowboat', mi: 18, river: 's', sea: 'c' },
    { name: 'River barge', mi: 24, river: 'v', sea: 'c' },
    { name: 'Cog', mi: 48, river: 'b', sea: 'd' },
    { name: 'Sailing ship', mi: 72, river: 'b', sea: 'd' },
    { name: 'Galley', mi: 96, river: 'b', sea: 'd' }
  ];
  var DEFAULT_WEATHER = { 'Fair': 1, 'Strong winds': 1.25, 'Rough seas': 0.75, 'Storm': 0.5 };
  /* Airships fly over anything lower than their ceiling (metres) and go round anything higher. A storm grounds them. */
  var DEFAULT_AIRSHIPS = [{ name: 'Airship', mi: 80, ceiling: 1000 }];
  var DEFAULT_SKY = { 'Fair': 1, 'Tailwind': 1.5, 'Headwind': 0.5, 'Storm': 0 };
  function airshipsOf(r) {
    if (!Array.isArray(r.airships)) return DEFAULT_AIRSHIPS.map(function (a) { return Object.assign({}, a); });
    return r.airships.filter(function (a) { return a && a.name; }).map(function (a) { return { name: String(a.name), mi: Number(a.mi) || 0, ceiling: Number(a.ceiling) || 1000 }; });
  }
  function airOf(t) { return t ? rulesOf(t).airships.filter(function (a) { return a.name === t.mode; })[0] || null : null; }
  // A grid of 'a' (can fly over) and 'x' (too high) for one ceiling.
  function airCells(grid, ceiling) {
    grid.air = grid.air || {};
    if (grid.air[ceiling]) return grid.air[ceiling];
    var n = grid.w * grid.h, out = new Array(n);
    for (var i = 0; i < n; i++) out[i] = grid.height && grid.height[i] >= ceiling ? 'x' : 'a';
    return (grid.air[ceiling] = out);
  }
  var WATER_NAMES = { s: 'Stream', v: 'River', b: 'Great river', c: 'Coastal water', d: 'Deep water' };
  var RIVER_FIT = [['s', 'Streams and up'], ['v', 'Rivers and up'], ['b', 'Great rivers only'], ['', 'Not on rivers']];
  var SEA_FIT = [['c', 'Coastal only'], ['d', 'Coastal and deep'], ['', 'Not at sea']];
  function boatsOf(r) {
    if (!Array.isArray(r.boats)) return DEFAULT_BOATS.map(function (b) { return Object.assign({}, b); });
    return r.boats.filter(function (b) { return b && b.name; }).map(function (b) {
      return { name: String(b.name), mi: Number(b.mi) || 0, river: ['s', 'v', 'b'].indexOf(b.river) >= 0 ? b.river : '', sea: ['c', 'd'].indexOf(b.sea) >= 0 ? b.sea : '' };
    });
  }
  function boatOf(t) { return t ? rulesOf(t).boats.filter(function (b) { return b.name === t.mode; })[0] || null : null; }
  function weatherMul(t, r) { r = r || rulesOf(t); var air = airOf(t), tab = air ? r.skies : r.weathers, v = Number(tab[t.weather]); v = isFinite(v) && t.weather in tab ? v : 1; if (air && air.storm && v === 0) return 0.5; var bt = air ? null : boatOf(t); if (bt && bt.weather && v < 1) v = bt.weather >= 2 ? 1 : 1 - (1 - v) / 2; return v; }
  function groundName(t, c) { return airOf(t) ? 'Air' : boatOf(t) ? WATER_NAMES[c] || c : rulesOf(t).ground[c] || c; }
  var GROUND_NAMES = { R: 'Main roads', r: 'Other roads', g: 'Open land', f: 'Forest', m: 'Mountains' };
  var GROUND_KEYS = ['R', 'r', 'g', 'f', 'm'];
  function groundOf(r, terrains) {
    var gmap = Object.assign({ R: 'Major Road', r: 'Normal Road', g: 'Rough Terrain', f: 'Rough Terrain', m: 'Mountain or Swamp' }, r.ground || {});
    Object.keys(gmap).forEach(function (k) { if (terrains.length && terrains.indexOf(gmap[k]) < 0) gmap[k] = terrains[Math.min(terrains.length - 1, k === 'r' || k === 'R' ? 0 : terrains.length - 1)]; });
    return gmap;
  }
  function milesPerDay(t) {
    var r = rulesOf(t), boat = boatOf(t), air = airOf(t);
    if (air) return Math.round(air.mi * weatherMul(t, r) * 10) / 10;
    if (boat) return Math.round(boat.mi * weatherMul(t, r) * 10) / 10;
    var base = Number(((r.speeds[t.terrain] || {})[t.mode]) || 0);
    return Math.round(base * Number(r.paces[t.pace] || 1) * 10) / 10;
  }
  function partySize(t) { return num(t.party_size, 0) || campaignChars(t.campaign_id).length; }
  function foodPerDay(t) { return Math.round(partySize(t) * Number(t.food_per_person || 0) * 10) / 10; }
  function fmtMiles(n) { return (Math.round(n * 10) / 10) + ' mi'; }
  function partyMarker(mapId) { return (markers[mapId] || []).filter(function (mk) { return mk.kind === 'party'; })[0] || null; }
  function mapDistance(m, ax, ay, bx, by) {
    var mi = Number(m.miles_across || 0);
    var ratio = m.width && m.height ? m.height / m.width : 1;
    var dx = (bx - ax) * mi, dy = (by - ay) * mi * ratio;
    return Math.sqrt(dx * dx + dy * dy);
  }
  /* Terrain grid route-finding. Land cells: '.' water, 'R' main road (capital to a noble seat), 'r' other road, 'g' open land, 'f' forest, 'm' mountains.
     Water layer (same size): '-' none, 's' stream, 'v' river, 'b' great river or lake, 'c' coastal sea, 'd' deep sea. */
  function decodeRle(rle, n, fill) {
    var cells = new Array(n), i = 0, re = /(\d*)(\D)/g, m;
    while ((m = re.exec(rle)) && i < n) { var k = m[1] ? parseInt(m[1], 10) : 1; for (var j = 0; j < k && i < n; j++) cells[i++] = m[2]; }
    while (i < n) cells[i++] = fill;
    return cells;
  }
  function ensureGrid(mapId) {
    if (!mapId || grids[mapId] !== undefined) return Promise.resolve();
    return sb.from('maps').select('travel_grid').eq('id', mapId).maybeSingle().then(function (r) {
      var tg = r.data && r.data.travel_grid;
      if (!tg || !tg.rle || !tg.w || !tg.h) { grids[mapId] = false; return; }
      var g = { w: tg.w, h: tg.h, cells: decodeRle(tg.rle, tg.w * tg.h, '.') };
      if (tg.water && tg.water.rle) {
        g.water = decodeRle(tg.water.rle, tg.w * tg.h, '-');
        g.seaDist = seaDistance(g);
      }
      grids[mapId] = g;
      // Height layer, if the map has one: run-length letters, A = sea level, each letter one step (metres) higher.
      return fetch('heights/' + mapId + '.json').then(function (res) { return res.ok ? res.json() : null; }).then(function (ht) {
        if (!ht || !ht.rle || ht.w !== g.w || ht.h !== g.h) return;
        var HL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', step = Number(ht.step) || 30;
        var hc = decodeRle(ht.rle, g.w * g.h, 'A');
        g.height = new Float32Array(g.w * g.h);
        for (var hi = 0; hi < hc.length; hi++) g.height[hi] = Math.max(0, HL.indexOf(hc[hi])) * step;
      }).catch(function () {});
    });
  }
  // Steps along the water from each river cell to the sea, so a boat knows which way is downstream.
  function seaDistance(g) {
    var W = g.w, H = g.h, wa = g.water, d = new Int32Array(W * H).fill(-1), q = [], head = 0;
    var river = function (c) { return c === 's' || c === 'v' || c === 'b'; };
    for (var i = 0; i < wa.length; i++) if (wa[i] === 'c' || wa[i] === 'd') { d[i] = 0; q.push(i); }
    while (head < q.length) {
      var at = q[head++], x = at % W, y = (at / W) | 0;
      for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
        var nx = x + dx, ny = y + dy;
        if ((dx || dy) && nx >= 0 && ny >= 0 && nx < W && ny < H) {
          var j = ny * W + nx;
          if (d[j] < 0 && river(wa[j])) { d[j] = d[at] + 1; q.push(j); }
        }
      }
    }
    return d;
  }
  // Fastest path (in days) for the current way of traveling. Returns points, legs, miles and days.
  function findRoute(m, grid, t, ax, ay, bx, by) {
    var r = rulesOf(t), boat = boatOf(t), air = airOf(t);
    if (boat && !grid.water) return null;
    var key = [m.id, t.mode, t.pace, t.weather, JSON.stringify(air || ''), JSON.stringify(rulesOf(t).speeds[t.terrain] || ''), JSON.stringify((t.rules || {}).ground || ''), JSON.stringify(boat || ''), JSON.stringify(r.current), ax.toFixed(4), ay.toFixed(4), bx.toFixed(4), by.toFixed(4)].join('|');
    if (routeCache[key] !== undefined) return routeCache[key];
    var W = grid.w, H = grid.h, cells = air ? airCells(grid, air.ceiling) : boat ? grid.water : grid.cells;
    var speedOf, flow = function () { return 1; }, fastest;
    if (air) {
      var ami = air.mi * weatherMul(t, r);
      speedOf = function (c) { return c === 'a' ? ami : 0; };
      fastest = ami;
    } else if (boat) {
      var RANK = { s: 1, v: 2, b: 3, c: 1, d: 2 }, base = boat.mi * weatherMul(t, r);
      speedOf = function (c) {
        if (c === 's' || c === 'v' || c === 'b') return boat.river && RANK[c] >= RANK[boat.river] ? base : 0;
        if (c === 'c' || c === 'd') return boat.sea && RANK[c] <= RANK[boat.sea] ? base : 0;
        return 0;
      };
      var sd = grid.seaDist, down = r.current.down || 1, up = r.current.up || 1;
      // Current only runs on streams and rivers; great rivers, lakes and the lagoon are wide and slow.
      var runs = function (c) { return c === 's' || c === 'v'; };
      flow = function (i, j) { var a = sd[i], b2 = sd[j]; if (a < 0 || b2 < 0 || a === b2 || !(runs(cells[i]) || runs(cells[j]))) return 1; return b2 < a ? down : up; };
      fastest = base * Math.max(1, down);
    } else {
      var paceMul = Number(r.paces[t.pace] || 1), speed = {};
      GROUND_KEYS.forEach(function (c) { speed[c] = Number(((r.speeds[r.ground[c]] || {})[t.mode]) || 0) * paceMul; });
      speedOf = function (c) { return speed[c] || 0; };
      fastest = Math.max(speed.R, speed.r, speed.g, speed.f, speed.m);
    }
    if (!(fastest > 0)) return (routeCache[key] = null);
    var cellMiles = Number(m.miles_across) / W;
    var idx = function (x, y) { return Math.max(0, Math.min(H - 1, Math.floor(y * H))) * W + Math.max(0, Math.min(W - 1, Math.floor(x * W))); };
    var passable = function (i) { return speedOf(cells[i]) > 0; };
    var snap = function (i) {
      if (passable(i)) return i;
      var x0 = i % W, y0 = (i / W) | 0;
      for (var rad = 1; rad < 12; rad++) for (var dy = -rad; dy <= rad; dy++) for (var dx = -rad; dx <= rad; dx++) {
        var x = x0 + dx, y = y0 + dy;
        if (x >= 0 && y >= 0 && x < W && y < H && passable(y * W + x)) return y * W + x;
      }
      return -1;
    };
    var s0 = snap(idx(ax, ay)), g0 = snap(idx(bx, by));
    if (s0 < 0 || g0 < 0) return (routeCache[key] = null);
    var stepDays = function (i, j, miles) { return (miles / 2 / speedOf(cells[i]) + miles / 2 / speedOf(cells[j])) / flow(i, j); };
    var dist = new Float64Array(W * H).fill(Infinity), prev = new Int32Array(W * H).fill(-1);
    var heap = [], push = function (d, i) { heap.push([d, i]); var k = heap.length - 1; while (k > 0) { var p = (k - 1) >> 1; if (heap[p][0] <= heap[k][0]) break; var tmp = heap[p]; heap[p] = heap[k]; heap[k] = tmp; k = p; } };
    var pop = function () { var top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; var k = 0; for (;;) { var l = 2 * k + 1, rr = l + 1, sm = k; if (l < heap.length && heap[l][0] < heap[sm][0]) sm = l; if (rr < heap.length && heap[rr][0] < heap[sm][0]) sm = rr; if (sm === k) break; var tmp = heap[sm]; heap[sm] = heap[k]; heap[k] = tmp; k = sm; } } return top; };
    var gx = g0 % W, gy = (g0 / W) | 0;
    var hEst = function (i) { var x = i % W, y = (i / W) | 0; return Math.hypot(x - gx, y - gy) * cellMiles / fastest; };
    dist[s0] = 0; push(hEst(s0), s0);
    var D8 = [[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [1, 1, Math.SQRT2], [1, -1, Math.SQRT2], [-1, 1, Math.SQRT2], [-1, -1, Math.SQRT2]];
    while (heap.length) {
      var cur = pop(), i = cur[1];
      if (i === g0) break;
      if (cur[0] - hEst(i) > dist[i] + 1e-9) continue;
      var x = i % W, y = (i / W) | 0;
      for (var d = 0; d < 8; d++) {
        var nx = x + D8[d][0], ny = y + D8[d][1];
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        var j = ny * W + nx;
        if (!passable(j)) continue;
        var cost = stepDays(i, j, D8[d][2] * cellMiles);
        if (dist[i] + cost < dist[j]) { dist[j] = dist[i] + cost; prev[j] = i; push(dist[j] + hEst(j), j); }
      }
    }
    if (!isFinite(dist[g0])) return (routeCache[key] = null);
    var path = [];
    for (var at = g0; at >= 0; at = prev[at]) path.push(at);
    path.reverse();
    var pts = path.map(function (c) { return { x: ((c % W) + 0.5) / W, y: (((c / W) | 0) + 0.5) / H, c: cells[c] }; });
    pts[0] = { x: ax, y: ay, c: pts[0].c };
    pts[pts.length - 1] = { x: bx, y: by, c: pts[pts.length - 1].c };
    var ratio = m.width && m.height ? m.height / m.width : 1;
    var totalMiles = 0, totalDays = 0, legs = [];
    for (var k = 1; k < pts.length; k++) {
      var mi = Math.hypot(pts[k].x - pts[k - 1].x, (pts[k].y - pts[k - 1].y) * ratio) * Number(m.miles_across);
      var dd = stepDays(path[k - 1], path[k], mi);
      legs.push({ miles: mi, days: dd, ground: pts[k].c });
      totalMiles += mi; totalDays += dd;
    }
    return (routeCache[key] = { pts: pts, legs: legs, miles: totalMiles, days: totalDays });
  }

  // Where the journey stands: distance left and days to go, when the map has a scale.
  function journey(t) {
    var out = { mpd: milesPerDay(t), map: t.map_id ? mapById(t.map_id) : null, party: null, remaining: null, days: null, problem: '' };
    if (!out.map) { out.problem = 'No travel map chosen yet.'; return out; }
    out.party = partyMarker(out.map.id);
    if (!out.party) { out.problem = 'The party isn’t placed on ' + out.map.name + ' yet.'; return out; }
    if (t.dest_x == null) { out.problem = 'No destination set.'; return out; }
    if (!Number(out.map.miles_across)) { out.problem = 'Set how many miles wide ' + out.map.name + ' is to measure distance.'; return out; }
    var grid = grids[out.map.id];
    if (grid) {
      out.route = findRoute(out.map, grid, t, out.party.x, out.party.y, t.dest_x, t.dest_y);
      if (out.route) {
        out.remaining = out.route.miles;
        out.days = out.route.miles < 0.1 ? 0 : Math.ceil(out.route.days - 0.02);
        out.byMap = true;
        return out;
      }
      out.problem = airOf(t) ? (weatherMul(t) <= 0 ? 'Grounded: the airship can’t fly in a ' + String(t.weather || 'storm').toLowerCase() + '. Wait it out.' : 'No way through for the airship: the ground is too high all round.') : boatOf(t) ? (grid.water ? 'No water route a ' + t.mode.toLowerCase() + ' can take from the party to the destination.' : 'Claude hasn’t read the water on ' + out.map.name + ' yet.')
        : 'No path over land for ' + t.mode.toLowerCase() + ' from the party to the destination.';
      if (airOf(t)) return out;
    }
    out.remaining = mapDistance(out.map, out.party.x, out.party.y, t.dest_x, t.dest_y);
    out.days = out.mpd > 0 ? Math.ceil(Math.max(0, out.remaining - 0.05) / out.mpd) : null;
    return out;
  }
  function ensureTravelMarkers(t) {
    if (!t || !t.map_id) return Promise.resolve();
    return Promise.all([markers[t.map_id] ? null : loadMarkers(t.map_id), ensureGrid(t.map_id)]);
  }

  function journeySummary(camp) {
    var t = travel[camp.id];
    if (!t) return '';
    if (t.map_id && (!markers[t.map_id] || grids[t.map_id] === undefined)) {
      ensureTravelMarkers(t).then(function () { if (parseRoute().name === 'campaign') render(); }).catch(function () {});
      return '<section class="block"><h2 class="sec-title">Journey · Day ' + t.day + '</h2><div class="empty">Checking the road…</div></section>';
    }
    var j = journey(t);
    var arr = arrivalBlock(camp);
    var line = airOf(t) ? t.mode + ' · ' + (t.weather || 'Fair') + ' · ' + fmtMiles(j.mpd) + ' a day by air' : boatOf(t) ? t.mode + ' · ' + (t.weather || 'Fair') + (j.byMap ? ' · route over water' : ' · ' + fmtMiles(j.mpd) + ' a day')
      : j.byMap ? t.mode + ' · ' + t.pace + ' pace · terrain from the map' : t.mode + ' · ' + t.pace + ' pace · ' + t.terrain + ' · ' + fmtMiles(j.mpd) + ' a day';
    var dest = j.remaining != null ? (j.remaining < 0.1 ? 'Arrived' + (t.dest_label ? ' at ' + t.dest_label : '') : fmtMiles(j.remaining) + ' to ' + (t.dest_label || 'destination') + ' · about ' + j.days + (j.days === 1 ? ' day' : ' days')) : '';
    return '<section class="block"><h2 class="sec-title">Journey · Day ' + t.day + '<small><a class="btn small quiet" href="#/travel/' + encodeURIComponent(camp.slug) + '">Open journey</a></small></h2>' +
      '<div class="tbl"><div class="tbl-row"><div class="main"><b>' + esc(dest || (dmView() ? j.problem : 'On the road')) + '</b><span>' + esc(line) + '</span></div>' +
      (j.map && (dmView() || j.map.visible_to_players) ? '<a class="btn small" href="#/map/' + encodeURIComponent(j.map.id) + '">Map</a>' : '') + '</div></div></section>' + arr;
  }

  /* ---------- Day and night rolls: the table rolls, the app reads the result ---------- */
  var TRAVEL_EVENTS = window.AVARENTH_TRAVEL || { bad: [], neutral: [], good: [] };
  function watchTier(d20) { return d20 === 1 ? 'disaster' : d20 === 20 ? 'legendary' : d20 <= 5 ? 'bad' : d20 >= 15 ? 'good' : 'neutral'; }
  var TIER_LABEL = { disaster: 'Natural 1: disaster', bad: 'Bad', neutral: 'Neutral', good: 'Good', legendary: 'Natural 20: legendary' };
  function watchState(campId, w) {
    ui.watch = ui.watch || {}; var k = campId + '|' + w;
    return (ui.watch[k] = ui.watch[k] || { who: '', d20: '', d100: '' });
  }
  /* Where the party is decides which list the d100 reads: 1 to 60 the region's, 61 to 100 the all-isles list. */
  var REGION_LABEL = { west: 'The West', mournfells: 'The Mournfells', north: 'The North', central: 'The Central District', capital: 'The Crown Lands', south: 'The South and the coast', sea: 'At sea' };
  function autoRegion(campId) {
    var t = travel[campId]; if (!t || !t.map_id) return null;
    var pm = partyMarker(t.map_id); if (!pm) return null;
    var g = grids[t.map_id];
    if (g) {
      var cx = Math.min(g.w - 1, Math.max(0, Math.floor(pm.x * g.w))), cy = Math.min(g.h - 1, Math.max(0, Math.floor(pm.y * g.h))), i = cy * g.w + cx;
      var wat = g.water ? g.water[i] : '-';
      if ((boatOf(t) || airOf(t)) && (wat === 'c' || wat === 'd')) return 'sea';
      if (g.cells[i] === 'm' && pm.x > 0.36 && pm.x < 0.66 && pm.y > 0.36 && pm.y < 0.6) return 'mournfells';
    } else if (boatOf(t)) return 'sea';
    var best = null, bd = Infinity;
    (markers[t.map_id] || []).forEach(function (mk) {
      if ((mk.kind !== 'place' && mk.kind !== 'stop') || !mk.article_slug) return;
      var a = articleBySlug(mk.article_slug), reg = a && a.fields && (a.fields.Region || a.fields.District || '');
      if (!reg) return;
      var d = Math.hypot(mk.x - pm.x, mk.y - pm.y);
      if (d < bd) { bd = d; best = String(reg); }
    });
    if (!best) return null;
    return /west/i.test(best) ? 'west' : /central/i.test(best) ? 'central' : /capital|crown/i.test(best) ? 'capital' : /north/i.test(best) ? 'north' : /south/i.test(best) ? 'south' : null;
  }
  function watchRegion(campId) { var pick = (ui.regionPick || {})[campId]; return pick || autoRegion(campId); }
  function watchResult(campId, w) {
    var st = watchState(campId, w), d20 = parseInt(st.d20, 10), d100 = parseInt(st.d100, 10);
    if (!(d20 >= 1 && d20 <= 20)) return null;
    var tier = watchTier(d20), ok = d100 >= 1 && d100 <= 100, ev = null, from = null;
    var reg = watchRegion(campId), regs = TRAVEL_EVENTS.regions || {}, isl = TRAVEL_EVENTS.isles;
    if (ok && (tier === 'bad' || tier === 'neutral' || tier === 'good') && isl) {
      var list;
      if (d100 <= 60 && reg && regs[reg]) { list = regs[reg][w][tier] || []; ev = list[Math.floor((d100 - 1) * list.length / 60)] || null; from = REGION_LABEL[reg]; }
      else if (d100 > 60) { list = isl[w][tier] || []; ev = list[Math.floor((d100 - 61) * list.length / 40)] || null; from = 'Anywhere on the isles'; }
    }
    if (ok && !ev) {
      var old = TRAVEL_EVENTS[tier] || [];
      ev = old[old.length === 100 ? d100 - 1 : Math.floor((d100 - 1) * old.length / 100)] || null;
    }
    return { tier: tier, d20: d20, d100: ok ? d100 : null, text: ev, from: from };
  }
  function watchResultHtml(campId, w) {
    var r = watchResult(campId, w);
    if (!r) return '<p class="note" style="margin:0">Enter their d20.</p>';
    var html = '<p style="margin:0 0 4px"><span class="tag tier-' + r.tier + '">' + TIER_LABEL[r.tier] + '</span></p>';
    if (r.text) {
      var parts = String(r.text).split(' Play: ');
      html += '<p class="watch-ev">' + esc(parts[0]) + '</p>' + (parts[1] && dmView() ? '<p class="note watch-play" style="margin:4px 0 0"><b>Play:</b> ' + esc(parts.slice(1).join(' Play: ')) + '</p>' : '') + (r.from ? '<p class="note" style="margin:4px 0 0;font-size:12px">' + esc(r.from) + '</p>' : '');
    } else html += '<p class="note" style="margin:0">Now they roll a d100.</p>';
    return html;
  }
  function watchBlock(camp) {
    var chars = campaignChars(camp.id);
    return '<section class="block"><h2 class="sec-title">Day and night<small>Rolled at the table</small></h2>' +
      '<p class="note" style="margin:0 0 8px">Someone rolls a d20 for the day and someone for the night. 5 or lower is bad, 15 or higher is good, anything else is neutral, and a natural 1 or 20 is a disaster or something legendary. Then they roll a d100 for what happens.</p>' +
      (dmView() ? (function () {
        var auto = autoRegion(camp.id), pick = (ui.regionPick || {})[camp.id] || '';
        return '<div class="field" style="margin:0 0 8px"><label for="wt-region">Where they are</label><select id="wt-region" data-camp="' + esc(camp.id) + '"><option value="">' + esc(auto ? 'Worked out from the map: ' + REGION_LABEL[auto] : 'Not sure: use the all-isles lists') + '</option>' +
          Object.keys(REGION_LABEL).map(function (k) { return '<option value="' + k + '"' + (pick === k ? ' selected' : '') + '>' + esc(REGION_LABEL[k]) + '</option>'; }).join('') + '</select></div>';
      })() : '') +
      ['Day', 'Night'].map(function (W) {
        var w = W.toLowerCase(), st = watchState(camp.id, w);
        return '<div class="group-box watch-box"><p class="eyebrow" style="margin:0 0 6px;font-size:11px">' + W + '</p>' +
          '<div class="two"><div class="field"><label for="wt-who-' + w + '">Who rolls</label><select id="wt-who-' + w + '" data-watch="' + w + '" data-wfield="who" data-camp="' + esc(camp.id) + '"><option value="">Someone</option>' +
          chars.map(function (c) { return '<option value="' + esc(c.id) + '"' + (c.id === st.who ? ' selected' : '') + '>' + esc(c.name) + '</option>'; }).join('') + '</select></div>' +
          '<div class="two"><div class="field"><label for="wt-d20-' + w + '">d20</label><input type="number" id="wt-d20-' + w + '" min="1" max="20" inputmode="numeric" value="' + esc(st.d20) + '" data-watch="' + w + '" data-wfield="d20" data-camp="' + esc(camp.id) + '"></div>' +
          '<div class="field"><label for="wt-d100-' + w + '">d100</label><input type="number" id="wt-d100-' + w + '" min="1" max="100" inputmode="numeric" value="' + esc(st.d100) + '" data-watch="' + w + '" data-wfield="d100" data-camp="' + esc(camp.id) + '"></div></div></div>' +
          '<div id="wt-res-' + w + '">' + watchResultHtml(camp.id, w) + '</div>' +
          '<div class="actions"><button type="button" class="btn small" data-act="log-watch" data-watch="' + w + '" data-camp="' + esc(camp.id) + '">Add to journey log</button><button type="button" class="btn small quiet" data-act="clear-watch" data-watch="' + w + '" data-camp="' + esc(camp.id) + '">Clear</button></div></div>';
      }).join('') + '<div class="actions">' + meetButton(camp.id, false) + '</div></section>';
  }
  function logWatch(campId, w) {
    var t = travel[campId], r = watchResult(campId, w), st = watchState(campId, w);
    if (!t) return;
    if (!r || !r.text) return toast('Enter both rolls first.');
    var who = st.who ? charById(st.who) : null;
    var text = (w === 'day' ? 'Day' : 'Night') + (who ? ' (' + who.name + ' rolled ' + r.d20 + ')' : ' (rolled ' + r.d20 + ')') + ': ' + String(r.text).split(' Play: ')[0];
    sb.from('travel_log').insert({ campaign_id: campId, day: t.day, miles: 0, food_used: 0, map_id: t.map_id || null, text: text }).then(function (res) {
      if (res.error) throw res.error;
      ui.watch[campId + '|' + w] = { who: st.who, d20: '', d100: '' };
      return loadTravel();
    }).then(function () { toast('Logged'); render(); }).catch(function (e) { fail(e, 'Could not log that.'); });
  }

  function renderTravel(slug) {
    if (!loaded.wiki) { $view.innerHTML = '<div class="page"><div class="empty">Opening the archive…</div></div>'; return; }
    var camp = campaignBySlug(slug);
    if (!camp || !(isDM() || myCampaigns().indexOf(camp) >= 0)) { location.replace('#/wiki'); return; }
    var t = travel[camp.id];
    if (!t) { $view.innerHTML = '<div class="page"><div class="empty">Loading the journey…</div></div>'; return; }
    if (t.map_id && (!markers[t.map_id] || grids[t.map_id] === undefined)) { ensureTravelMarkers(t).then(render).catch(function (e) { fail(e); }); $view.innerHTML = '<div class="page"><div class="empty">Loading the journey…</div></div>'; return; }
    var dm = dmView();
    var r = rulesOf(t);
    var j = journey(t);
    var log = travelLog.filter(function (l) { return l.campaign_id === camp.id; });
    var sel = function (id, key, opts) {
      if (!dm) return '<div class="vital"><span class="k">' + key + '</span><span class="v" style="font-size:17px">' + esc(t[key.toLowerCase()]) + '</span></div>';
      return '<div class="field"><label for="' + id + '">' + key + '</label><select id="' + id + '" data-travel="' + key.toLowerCase() + '">' + (Array.isArray(opts) ? opts : Object.keys(opts)).map(function (k) { return '<option' + (k === t[key.toLowerCase()] ? ' selected' : '') + '>' + esc(k) + '</option>'; }).join('') + '</select></div>';
    };
    var html = '<section class="hero"><div class="hero-in"><p class="crumbs"><a href="#/wiki">Avarenth</a> › <a href="#/campaign/' + encodeURIComponent(camp.slug) + '">' + esc(camp.name) + '</a></p><h1>Day ' + t.day + '</h1></div></section><div class="page">';
    if (dm) html += '<div class="actions"><button type="button" class="btn primary" data-act="next-day" data-camp="' + esc(camp.id) + '">Next day →</button><button type="button" class="btn" data-act="undo-day" data-camp="' + esc(camp.id) + '"' + (log.length ? '' : ' disabled') + '>Undo last entry</button></div>';
    html += arrivalBlock(camp);
    if (dm) html += watchBlock(camp);
    var gridOn = j.map && grids[j.map.id];
    var boat = boatOf(t), air = airOf(t);
    var modeSel = dm ? '<div class="field"><label for="tr-mode">Mode</label><select id="tr-mode" data-travel="mode"><optgroup label="Over land">' +
      r.modes.map(function (k) { return '<option' + (k === t.mode ? ' selected' : '') + '>' + esc(k) + '</option>'; }).join('') + '</optgroup>' +
      (r.boats.some(function (b) { return b.own; }) || r.airships.some(function (a) { return a.own; }) ? '<optgroup label="Your own">' + r.boats.concat(r.airships).filter(function (b) { return b.own; }).map(function (b) { return '<option' + (b.name === t.mode ? ' selected' : '') + '>' + esc(b.name) + '</option>'; }).join('') + '</optgroup>' : '') +
      (r.boats.length ? '<optgroup label="By boat">' + r.boats.filter(function (b) { return !b.own; }).map(function (b) { return '<option' + (b.name === t.mode ? ' selected' : '') + '>' + esc(b.name) + '</option>'; }).join('') + '</optgroup>' : '') +
      (r.airships.length ? '<optgroup label="By air">' + r.airships.filter(function (a) { return !a.own; }).map(function (a) { return '<option' + (a.name === t.mode ? ' selected' : '') + '>' + esc(a.name) + '</option>'; }).join('') + '</optgroup>' : '') + '</select></div>'
      : sel('tr-mode', 'Mode', r.modes);
    var fitText = function (b) {
      var riv = { s: 'any river or stream', v: 'rivers and great rivers', b: 'great rivers only' }[b.river], sea = { c: 'coastal water', d: 'coastal and deep water' }[b.sea];
      return [riv ? 'fits ' + riv : 'stays off rivers', sea ? 'sails ' + sea : 'stays off the sea'].join(', ');
    };
    html += '<section class="block"><h2 class="sec-title">How they’re traveling<small>' + (air ? fmtMiles(j.mpd) + ' a day by air' : boat ? fmtMiles(j.mpd) + ' a day before current' : gridOn ? 'Terrain read from the map' : fmtMiles(j.mpd) + ' a day') + '</small></h2><div class="' + (dm ? 'two' : 'vitals') + '"' + (dm ? '' : ' style="grid-template-columns:repeat(3,minmax(0,1fr))"') + '>' +
      modeSel + (air ? sel('tr-weather', 'Weather', r.skies) : boat ? sel('tr-weather', 'Weather', r.weathers) : sel('tr-pace', 'Pace', r.paces)) + (gridOn || boat || air ? '' : sel('tr-terrain', 'Terrain', r.terrains)) + '</div>' +
      (air ? '<p class="note" style="margin:0">The ' + esc(air.name.toLowerCase()) + ' flies over anything lower than ' + air.ceiling + ' m and goes round anything higher.' + (gridOn && !grids[j.map.id].height ? ' (The heights for ' + esc(j.map.name) + ' aren’t loaded, so it flies straight.)' : '') + (air.storm ? ' Its storm keel lets it fly through storms at half speed.' : ' A storm grounds it.') + '</p>'
        : boat ? '<p class="note" style="margin:0">A ' + esc(boat.name.toLowerCase()) + ' ' + esc(fitText(boat)) + '. Downstream is ×' + r.current.down + ', upstream ×' + r.current.up + '.' + (gridOn && grids[j.map.id].water ? ' The route follows water it can use on ' + esc(j.map.name) + '.' : '') + '</p>'
        : gridOn ? '<p class="note" style="margin:0">The route follows the roads on ' + esc(j.map.name) + ' and each day’s distance uses the ground they actually cross: ' + GROUND_KEYS.map(function (c) { return GROUND_NAMES[c].toLowerCase() + ' as ' + esc(r.ground[c]); }).join(', ') + '.</p>'
        : (dm ? '<p class="note" style="margin:0">Change terrain as they move from road to forest to hills. Each day uses whatever is set when you tap Next day.</p>' : '')) + '</section>';

    html += '<section class="block"><h2 class="sec-title">Destination</h2>';
    if (dm) {
      var travelMaps = maps.filter(function (x) { return !x.campaign_id || x.campaign_id === camp.id; });
      html += '<div class="field"><label for="tr-map">Travel map</label><select id="tr-map" data-travel="map_id"><option value="">Choose a map…</option>' + travelMaps.map(function (x) { return '<option value="' + esc(x.id) + '"' + (x.id === t.map_id ? ' selected' : '') + '>' + esc(x.name) + (Number(x.miles_across) ? ' (' + x.miles_across + ' mi across)' : ' (no scale yet)') + '</option>'; }).join('') + '</select></div>' +
        '<div class="field"><label for="tr-dest">Destination name</label><input type="text" id="tr-dest" data-travel-text="dest_label" maxlength="60" value="' + esc(t.dest_label) + '" placeholder="e.g. Loreaon"></div>';
    }
    if (j.remaining != null) {
      html += '<div class="vitals sum">' + vital('Heading to', t.dest_label || 'Destination') + vital('Distance left', j.remaining < 0.1 ? 'Arrived' : fmtMiles(j.remaining)) + vital('Days to go', j.remaining < 0.1 ? 0 : (j.days == null ? '—' : j.days)) + (j.byMap ? vital('Route', airOf(t) ? 'By air' : boat ? 'By water' : 'Along roads') : vital('Per day', fmtMiles(j.mpd))) + '</div>';
    } else {
      html += '<div class="empty">' + esc(dm ? j.problem : 'No destination shared yet.') + '</div>';
    }
    if (dm && j.map) html += '<div class="actions"><a class="btn" href="#/map/' + encodeURIComponent(j.map.id) + '">Open map to set the party or destination</a>' + (t.dest_x != null ? '<button type="button" class="btn small" data-act="clear-dest" data-camp="' + esc(camp.id) + '">Clear destination</button>' : '') + '</div>';
    html += '</section>';

    var fpd = foodPerDay(t);
    var foodDays = fpd > 0 ? Math.floor(Number(t.food || 0) / fpd) : null;
    html += '<section class="block"><h2 class="sec-title">Supplies<small>' + (fpd ? fpd + ' food a day' : 'No food use set') + '</small></h2>' +
      '<div class="vitals sum">' + vital('Food', Math.round(Number(t.food || 0) * 10) / 10) + vital('Lasts', foodDays == null ? '—' : foodDays + (foodDays === 1 ? ' day' : ' days')) + vital('Party', partySize(t) + (num(t.party_size, 0) ? '' : ' (auto)')) + vital('Each eats', Number(t.food_per_person || 0) + '/day') + '</div>' +
      (foodDays != null && foodDays <= 2 ? '<p class="err" style="margin:0">' + (foodDays === 0 ? 'Out of food.' : 'Food is running low.') + '</p>' : '');
    if (dm) {
      html += '<form class="two" id="food-form" novalidate data-camp="' + esc(camp.id) + '" style="align-items:start">' +
        '<div class="field"><label for="fd-food">Food on hand</label><input type="number" id="fd-food" min="0" step="1" value="' + Number(t.food || 0) + '" inputmode="decimal"></div>' +
        '<div class="field"><label for="fd-size">Party size</label><input type="number" id="fd-size" min="0" step="1" value="' + num(t.party_size, 0) + '" inputmode="numeric"><span class="hint">0 = count characters in the campaign.</span></div>' +
        '<div class="field"><label for="fd-per">Food per person a day</label><input type="number" id="fd-per" min="0" step="0.5" value="' + Number(t.food_per_person || 0) + '" inputmode="decimal"></div>' +
        '<div class="field"><button type="submit" class="btn">Update supplies</button></div></form>';
    }
    html += '</section>';
    html += '<section class="block"><h2 class="sec-title">Journey log<small>' + log.length + ' entries</small></h2>' +
      (log.length ? '<div class="tbl">' + log.map(function (l) { return '<div class="tbl-row"><div class="main"><b>Day ' + l.day + '</b><span>' + esc(l.text) + '</span></div>' + (Number(l.miles) ? '<span class="num">' + fmtMiles(Number(l.miles)) + '</span>' : '') + '</div>'; }).join('') + '</div>' : '<div class="empty">Nothing logged yet. Each “Next day” adds an entry.</div>') + '</section>';

    if (dm) {
      html += '<form class="form group-box" id="rules-form" novalidate data-camp="' + esc(camp.id) + '"><h2>Travel rules</h2>' +
        '<div class="two"><div class="field"><label for="ru-modes">Ways to travel</label><textarea id="ru-modes" style="min-height:120px">' + esc(r.modes.join('\n')) + '</textarea><span class="hint">One per line.</span></div>' +
        '<div class="field"><label for="ru-terrains">Terrain</label><textarea id="ru-terrains" style="min-height:120px">' + esc(r.terrains.join('\n')) + '</textarea><span class="hint">One per line.</span></div></div>' +
        '<div class="field"><span class="lbl">Miles per day</span><div class="grid-wrap"><table class="grid"><thead><tr><th scope="col">Terrain</th>' + r.modes.map(function (mn) { return '<th scope="col">' + esc(mn) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        r.terrains.map(function (tn, ti) {
          return '<tr><th scope="row">' + esc(tn) + '</th>' + r.modes.map(function (mn, mi) {
            return '<td><input type="number" class="input" min="0" step="1" data-speed-t="' + esc(tn) + '" data-speed-m="' + esc(mn) + '" value="' + esc(((r.speeds[tn] || {})[mn]) != null ? r.speeds[tn][mn] : '') + '" aria-label="' + esc(mn + ' on ' + tn) + '" inputmode="decimal"></td>';
          }).join('') + '</tr>';
        }).join('') + '</tbody></table></div><span class="hint">Renamed or added a row or column? Save once and the grid updates.</span></div>' +
        '<div class="field"><span class="lbl">On maps Claude has read, ground counts as</span><div class="two">' + GROUND_KEYS.map(function (c) {
          return '<div class="field"><label for="gr-' + c + '">' + GROUND_NAMES[c] + '</label><select id="gr-' + c + '" data-ground="' + c + '">' + r.terrains.map(function (tn) { return '<option' + (tn === r.ground[c] ? ' selected' : '') + '>' + esc(tn) + '</option>'; }).join('') + '</select></div>';
        }).join('') + '</div></div>' +
        '<div class="field"><span class="lbl">Paces (multiplier)</span>';
      Object.keys(r.paces).concat(['']).forEach(function (k, i) {
        html += '<div class="two" style="margin-bottom:6px"><label class="sr" for="pn' + i + '">Pace name</label><input type="text" class="input" id="pn' + i + '" data-pace-name value="' + esc(k) + '" placeholder="' + (k ? '' : 'Add new…') + '" maxlength="30">' +
          '<label class="sr" for="pv' + i + '">Multiplier</label><input type="number" class="input" id="pv' + i + '" data-pace-val step="0.05" min="0" value="' + (k ? esc(r.paces[k]) : '') + '" placeholder="multiplier" inputmode="decimal"></div>';
      });
      html += '</div>';
      var opt = function (list, v) { return list.map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === v ? ' selected' : '') + '>' + o[1] + '</option>'; }).join(''); };
      html += '<div class="field"><span class="lbl">Boats</span><div class="grid-wrap"><table class="grid"><thead><tr><th scope="col">Boat</th><th scope="col">Miles a day</th><th scope="col">Rivers</th><th scope="col">Sea</th></tr></thead><tbody>' +
        r.boats.filter(function (b) { return !b.own; }).concat([{ name: '', mi: '', river: 's', sea: 'c' }]).map(function (b, i) {
          return '<tr data-boat><td><input type="text" class="input" data-boat-name value="' + esc(b.name) + '" placeholder="' + (b.name ? '' : 'Add a boat…') + '" maxlength="30" aria-label="Boat name"></td>' +
            '<td><input type="number" class="input" data-boat-mi min="0" step="1" value="' + esc(b.mi) + '" aria-label="Miles a day" inputmode="decimal"></td>' +
            '<td><select class="input" data-boat-river aria-label="Rivers it fits">' + opt(RIVER_FIT, b.river) + '</select></td>' +
            '<td><select class="input" data-boat-sea aria-label="How far out to sea">' + opt(SEA_FIT, b.sea) + '</select></td></tr>';
        }).join('') + '</tbody></table></div><span class="hint">Clear a boat’s name to remove it.</span></div>' +
        '<div class="field"><span class="lbl">Weather on the water (multiplier)</span>';
      Object.keys(r.weathers).concat(['']).forEach(function (k, i) {
        html += '<div class="two" style="margin-bottom:6px"><label class="sr" for="wn' + i + '">Weather</label><input type="text" class="input" id="wn' + i + '" data-weather-name value="' + esc(k) + '" placeholder="' + (k ? '' : 'Add new…') + '" maxlength="30">' +
          '<label class="sr" for="wv' + i + '">Multiplier</label><input type="number" class="input" id="wv' + i + '" data-weather-val step="0.05" min="0" value="' + (k ? esc(r.weathers[k]) : '') + '" placeholder="multiplier" inputmode="decimal"></div>';
      });
      html += '</div><div class="field"><span class="lbl">Airships</span><div class="grid-wrap"><table class="grid"><thead><tr><th scope="col">Airship</th><th scope="col">Miles a day</th><th scope="col">Ceiling (m)</th></tr></thead><tbody>' +
        r.airships.filter(function (a) { return !a.own; }).concat([{ name: '', mi: '', ceiling: '' }]).map(function (a) {
          return '<tr data-air><td><input type="text" class="input" data-air-name value="' + esc(a.name) + '" placeholder="' + (a.name ? '' : 'Add an airship…') + '" maxlength="30" aria-label="Airship name"></td>' +
            '<td><input type="number" class="input" data-air-mi min="0" step="1" value="' + esc(a.mi) + '" aria-label="Miles a day" inputmode="decimal"></td>' +
            '<td><input type="number" class="input" data-air-ceil min="0" step="50" value="' + esc(a.ceiling) + '" aria-label="Highest ground it can clear, in metres" inputmode="numeric"></td></tr>';
        }).join('') + '</tbody></table></div><span class="hint">It flies over any ground lower than its ceiling and goes round anything higher. Clear a name to remove it.</span></div>' +
        '<div class="field"><span class="lbl">Weather in the sky (multiplier; 0 grounds them)</span>';
      Object.keys(r.skies).concat(['']).forEach(function (k, i) {
        html += '<div class="two" style="margin-bottom:6px"><label class="sr" for="sn' + i + '">Sky weather</label><input type="text" class="input" id="sn' + i + '" data-sky-name value="' + esc(k) + '" placeholder="' + (k ? '' : 'Add new…') + '" maxlength="30">' +
          '<label class="sr" for="sv' + i + '">Multiplier</label><input type="number" class="input" id="sv' + i + '" data-sky-val step="0.05" min="0" value="' + (k ? esc(r.skies[k]) : '') + '" placeholder="multiplier" inputmode="decimal"></div>';
      });
      html += '</div><div class="two"><div class="field"><label for="cu-down">Downstream (multiplier)</label><input type="number" id="cu-down" step="0.05" min="0" value="' + r.current.down + '" inputmode="decimal"></div>' +
        '<div class="field"><label for="cu-up">Upstream (multiplier)</label><input type="number" id="cu-up" step="0.05" min="0" value="' + r.current.up + '" inputmode="decimal"></div></div>';
      html += '<div class="actions"><button type="submit" class="btn primary">Save rules</button></div></form>';
    }
    html += '</div>';
    $view.innerHTML = html;
  }

  function saveTravel(campId, patch) {
    Object.assign(travel[campId], patch);
    return sb.from('travel_state').update(patch).eq('campaign_id', campId).then(function (r) {
      if (r.error) { fail(r.error, 'Could not update the journey.'); return loadTravel().then(render); }
    });
  }

  /* ---------- Towns on the road: stop or go through ---------- */
  var STOP_MILES = 2;   // how close the road has to come to a town for the party to meet it
  function townsOn(mapId) { return (markers[mapId] || []).filter(function (mk) { return mk.kind === 'stop' || mk.kind === 'place'; }); }

  /* ---------- Tolls on the road ---------- */
  var TOLL_MILES = 1;   // how close the road has to pass a toll to cross it
  var TOLL_DEFAULT = { foot: 1, mount: 10 };   // copper a head on foot; a head riding or with a cart
  function tollOf(mk) { var t = mk && mk.toll || {}; return { foot: Math.max(0, num(t.foot, TOLL_DEFAULT.foot)), mount: Math.max(0, num(t.mount, TOLL_DEFAULT.mount)) }; }
  function mounted(t) { return /horse|ride|riding|mount|cart|wagon|pony|carriage/i.test(String(t.mode || '')); }
  function tollCost(t, mk) { var tl = tollOf(mk); return (mounted(t) ? tl.mount : tl.foot) * partySize(t); }
  // Splits a toll across purses: even shares, with anyone short covered by whoever has the most left. Null if they can't cover it between them.
  function tollShares(chars, total, payer) {
    if (total <= 0) return [];
    if (payer) { var pc = chars.filter(function (c) { return c.id === payer; })[0]; return pc && walletCp(pc.sheet) >= total ? [{ c: pc.id, cp: total }] : null; }
    var have = chars.map(function (c) { return { c: c.id, left: walletCp(c.sheet), cp: 0 }; });
    if (!have.length || have.reduce(function (a, h) { return a + h.left; }, 0) < total) return null;
    var owed = total;
    while (owed > 0) {
      var able = have.filter(function (h) { return h.left > 0; });
      var each = Math.max(1, Math.floor(owed / able.length));
      able.forEach(function (h) { if (owed <= 0) return; var take = Math.min(each, h.left, owed); h.cp += take; h.left -= take; owed -= take; });
    }
    return have.filter(function (h) { return h.cp > 0; }).map(function (h) { return { c: h.c, cp: h.cp }; });
  }
  function dayTolls(t, j, mv) {
    var m = j.map, ratio = m.width && m.height ? m.height / m.width : 1, W = Number(m.miles_across), hits = [];
    (markers[m.id] || []).filter(function (mk) { return mk.kind === 'toll'; }).forEach(function (tw) {
      if (mapMiles(m, j.party.x, j.party.y, tw.x, tw.y) <= TOLL_MILES) return;
      var best = null;
      for (var i = 1; i < mv.path.length; i++) {
        var a = mv.path[i - 1], b = mv.path[i];
        var ax = a.x * W, ay = a.y * ratio * W, bx = b.x * W, by = b.y * ratio * W, px = tw.x * W, py = tw.y * ratio * W;
        var vx = bx - ax, vy = by - ay, len2 = vx * vx + vy * vy, u = len2 ? Math.max(0, Math.min(1, ((px - ax) * vx + (py - ay) * vy) / len2)) : 0;
        var dist = Math.hypot(ax + vx * u - px, ay + vy * u - py);
        if (!best || dist < best.dist) best = { dist: dist, d: a.d + (b.d - a.d) * u };
      }
      if (best && best.dist <= TOLL_MILES) hits.push({ toll: true, id: tw.id, label: tw.label || 'Toll', cp: tollCost(t, tw), x: tw.x, y: tw.y, d: Math.max(0.005, best.d) });
    });
    return hits;
  }
  function tollDecide(how) {
    var s = ui.stopAsk; if (!s) return;
    var tw = s.list[s.i], t = travel[s.campId];
    var rec = { label: tw.label, how: how, cp: tw.cp };
    if (how === 'paid') {
      var sel = document.getElementById('toll-payer'), payer = sel ? sel.value : '';
      var shares = tollShares(campaignChars(s.campId), tw.cp, payer);
      if (!shares) return toast(payer ? 'They don’t have enough on them.' : 'The party doesn’t have enough between them.');
      rec.shares = shares; rec.payer = payer;
    }
    (s.tolls = s.tolls || []).push(rec);
    s.i++;
    if (s.i < s.list.length) return drawStopAsk();
    ui.stopAsk = null; drawStopAsk();
    nextDay(s.campId, { decided: true, passed: s.passed, tolls: s.tolls });
  }
  function saveToll(form) {
    var id = form.getAttribute('data-id');
    var patch = { label: document.getElementById('tl-name').value.trim().slice(0, 60) || 'Toll', toll: { foot: Math.max(0, Math.round(num(document.getElementById('tl-foot').value, 0))), mount: Math.max(0, Math.round(num(document.getElementById('tl-mount').value, 0))) } };
    sb.from('map_markers').update(patch).eq('id', id).then(function (r) {
      if (r.error) return fail(r.error, 'Could not save the toll.');
      Object.keys(markers).forEach(function (k) { (markers[k] || []).forEach(function (mk) { if (mk.id === id) Object.assign(mk, patch); }); });
      ui.selectedMarker = null; toast('Toll saved'); rememberMapScroll(); render();
    });
  }
  function saveRuin(form) {
    var id = form.getAttribute('data-id');
    var patch = { label: document.getElementById('ru-name').value.trim().slice(0, 80) || 'A ruin', info: { desc: document.getElementById('ru-desc').value.trim().slice(0, 2000), found: document.getElementById('ru-found').checked } };
    sb.from('map_markers').update(patch).eq('id', id).then(function (r) {
      if (r.error) return fail(r.error, 'Could not save the ruin.');
      Object.keys(markers).forEach(function (k) { (markers[k] || []).forEach(function (mk) { if (mk.id === id) Object.assign(mk, patch); }); });
      ui.selectedMarker = null; toast('Ruin saved'); rememberMapScroll(); render();
    });
  }
  function midLabel(l) { return String(l || '').replace(/^(A|An|The) /, function (w) { return w.toLowerCase(); }); }
  function dayRuins(t, j, mv) {
    var m = j.map, ratio = m.width && m.height ? m.height / m.width : 1, W = Number(m.miles_across), hits = [];
    (markers[m.id] || []).filter(function (mk) { return mk.kind === 'ruin'; }).forEach(function (rw) {
      if (mapMiles(m, j.party.x, j.party.y, rw.x, rw.y) <= STOP_MILES) return;
      var best = null;
      for (var i = 1; i < mv.path.length; i++) {
        var a = mv.path[i - 1], b = mv.path[i];
        var ax = a.x * W, ay = a.y * ratio * W, bx = b.x * W, by = b.y * ratio * W, px = rw.x * W, py = rw.y * ratio * W;
        var vx = bx - ax, vy = by - ay, len2 = vx * vx + vy * vy, u = len2 ? Math.max(0, Math.min(1, ((px - ax) * vx + (py - ay) * vy) / len2)) : 0;
        var dist = Math.hypot(ax + vx * u - px, ay + vy * u - py);
        if (!best || dist < best.dist) best = { dist: dist, d: a.d + (b.d - a.d) * u };
      }
      if (best && best.dist <= STOP_MILES) hits.push({ ruin: true, id: rw.id, label: rw.label || 'A ruin', desc: (rw.info || {}).desc || '', found: !!(rw.info || {}).found, x: rw.x, y: rw.y, d: Math.max(0.01, best.d) });
    });
    return hits;
  }
  // They found the ruin: players can see its pin from now on.
  function findRuin(id) {
    var mk = null; Object.keys(markers).forEach(function (k) { (markers[k] || []).forEach(function (x) { if (x.id === id) mk = x; }); });
    if (!mk || (mk.info && mk.info.found)) return Promise.resolve();
    var info = Object.assign({}, mk.info || {}, { found: true });
    return sb.from('map_markers').update({ info: info }).eq('id', id).then(function (r) { if (r.error) throw r.error; mk.info = info; });
  }
  // Takes the toll out of their purses (or puts it back, sign -1). Returns the saves.
  function moveCoins(shares, sign) {
    return (shares || []).map(function (sh) {
      var c = characters.filter(function (x) { return x.id === sh.c; })[0]; if (!c) return null;
      setWallet(c.sheet, Math.max(0, walletCp(c.sheet) - sign * sh.cp));
      return sb.from('characters').update({ sheet: c.sheet }).eq('id', c.id);
    }).filter(Boolean);
  }
  function mapMiles(m, ax, ay, bx, by) { var ratio = m.width && m.height ? m.height / m.width : 1; return Math.hypot(bx - ax, (by - ay) * ratio) * Number(m.miles_across); }
  // One day's movement (or part of one): where they end up, how far, over what ground, and the path walked with the day-fraction at each point.
  function dayMove(t, j, budget) {
    var out = { miles: 0, byGround: {}, path: [], arrived: false };
    if (j.byMap && j.route) {
      var pts = j.route.pts, legs = j.route.legs, left = budget, used = 0, pos = pts[0];
      out.path.push({ x: pos.x, y: pos.y, d: 0 });
      for (var k = 0; k < legs.length && left > 1e-9; k++) {
        var lg = legs[k], frac = Math.min(1, left / lg.days);
        pos = { x: pts[k].x + (pts[k + 1].x - pts[k].x) * frac, y: pts[k].y + (pts[k + 1].y - pts[k].y) * frac };
        out.miles += lg.miles * frac; left -= lg.days * frac; used += lg.days * frac;
        var gname = groundName(t, lg.ground);
        out.byGround[gname] = (out.byGround[gname] || 0) + lg.miles * frac;
        out.path.push({ x: pos.x, y: pos.y, d: used });
      }
      out.arrived = left > 1e-9;
      if (out.arrived) pos = { x: t.dest_x, y: t.dest_y };
      out.pos = pos;
    } else {
      var step = Math.min(j.mpd * budget, j.remaining), f = step / j.remaining;
      out.arrived = step >= j.remaining - 0.05;
      out.pos = out.arrived ? { x: t.dest_x, y: t.dest_y } : { x: j.party.x + (t.dest_x - j.party.x) * f, y: j.party.y + (t.dest_y - j.party.y) * f };
      out.miles = step;
      out.path = [{ x: j.party.x, y: j.party.y, d: 0 }, { x: out.pos.x, y: out.pos.y, d: j.mpd > 0 ? step / j.mpd : 0 }];
    }
    return out;
  }
  // Towns the day's road comes within reach of, in the order they meet them. Leaves out where they start and where they're headed.
  function dayTowns(t, j, mv) {
    var m = j.map, ratio = m.width && m.height ? m.height / m.width : 1, W = Number(m.miles_across), hits = [];
    var destTown = nearTown(m.id, t.dest_x, t.dest_y);
    townsOn(m.id).forEach(function (tw) {
      if (mapMiles(m, j.party.x, j.party.y, tw.x, tw.y) <= STOP_MILES) return;
      if (destTown && destTown.id === tw.id) return;
      var best = null;
      for (var i = 1; i < mv.path.length; i++) {
        var a = mv.path[i - 1], b = mv.path[i];
        var ax = a.x * W, ay = a.y * ratio * W, bx = b.x * W, by = b.y * ratio * W, px = tw.x * W, py = tw.y * ratio * W;
        var vx = bx - ax, vy = by - ay, len2 = vx * vx + vy * vy, u = len2 ? Math.max(0, Math.min(1, ((px - ax) * vx + (py - ay) * vy) / len2)) : 0;
        var dist = Math.hypot(ax + vx * u - px, ay + vy * u - py);
        if (!best || dist < best.dist) best = { dist: dist, d: a.d + (b.d - a.d) * u, miles: 0 };
      }
      if (best && best.dist <= STOP_MILES) hits.push({ id: tw.id, label: tw.label, slug: tw.article_slug || '', x: tw.x, y: tw.y, d: Math.max(0.01, best.d) });
    });
    return hits.sort(function (a, b) { return a.d - b.d; });
  }
  function nearTown(mapId, x, y) {
    var m = mapById(mapId); if (!m || x == null || !Number(m.miles_across)) return null;
    var best = null, bd = Infinity;
    townsOn(mapId).forEach(function (tw) { var d = mapMiles(m, x, y, tw.x, tw.y); if (d < bd) { bd = d; best = tw; } });
    return bd <= STOP_MILES ? best : null;
  }
  function townWhat(slug) {
    var a = slug ? articleBySlug(slug) : null;
    if (!a) return '';
    return (a.fields && a.fields.Type ? String(a.fields.Type).replace(/\[\[|\]\]/g, '') + ' · ' : '') + String(a.summary || '').replace(/\[\[|\]\]/g, '');
  }
  function drawStopAsk() {
    var box = document.getElementById('stop-ask');
    var s = ui.stopAsk;
    if (!s) { if (box) box.remove(); return; }
    if (!box) { box = document.createElement('div'); box.id = 'stop-ask'; box.className = 'ask-wrap'; document.body.appendChild(box); }
    var tw = s.list[s.i], t = travel[s.campId];
    var when = tw.d < 0.34 ? 'early in the day' : tw.d < 0.67 ? 'around midday' : 'late in the day';
    var step = s.list.length > 1 ? ' · ' + (s.i + 1) + ' of ' + s.list.length : '';
    if (tw.ruin) {
      box.innerHTML = '<div class="ask" role="dialog" aria-modal="true" aria-labelledby="ask-h"><p class="eyebrow" style="margin:0 0 4px;font-size:11px">Day ' + t.day + step + '</p>' +
        '<h2 id="ask-h">' + esc(tw.label) + '</h2><p class="note" style="margin:0 0 6px">Their road passes close to it ' + when + '.' + (tw.found ? ' They have been here before.' : ' They don’t know it’s there.') + '</p>' +
        (tw.desc ? '<p style="margin:0 0 10px;white-space:pre-line">' + esc(tw.desc) + '</p>' : '') +
        '<div class="actions" style="margin:0"><button type="button" class="btn primary" data-act="town-stop">Stop and explore</button><button type="button" class="btn" data-act="town-pass">Walk on by</button><button type="button" class="btn quiet" data-act="town-cancel">Cancel</button></div>' +
        '<p class="note" style="margin:8px 0 0">Only you see this. If they stop, the day ends there and the pin shows up for players.</p></div>';
      return;
    }
    if (tw.toll) {
      var chars = campaignChars(s.campId), purse = chars.reduce(function (a, c) { return a + walletCp(c.sheet); }, 0);
      box.innerHTML = '<div class="ask" role="dialog" aria-modal="true" aria-labelledby="ask-h"><p class="eyebrow" style="margin:0 0 4px;font-size:11px">Day ' + t.day + step + '</p>' +
        '<h2 id="ask-h">Toll at ' + esc(tw.label) + '</h2><p class="note" style="margin:0 0 6px">They reach it ' + when + '.</p>' +
        '<p style="margin:0 0 10px">The toll is <b>' + esc(money(tw.cp)) + '</b>: ' + partySize(t) + ' ' + (mounted(t) ? 'riding' : 'on foot') + '.</p>' +
        (chars.length ? '<div class="field" style="margin:0 0 10px"><label for="toll-payer">Who pays</label><select id="toll-payer"><option value="">Split across the party</option>' +
          chars.map(function (c) { var w = walletCp(c.sheet); return '<option value="' + esc(c.id) + '">' + esc(c.name) + ' (' + esc(w > 0 ? money(w) : 'no coin') + ')</option>'; }).join('') + '</select><p class="note" style="margin:4px 0 0">' + esc(purse > 0 ? money(purse) : 'No coin') + ' between them.</p></div>' : '') +
        '<div class="actions" style="margin:0"><button type="button" class="btn primary" data-act="toll-pay">Pay</button><button type="button" class="btn" data-act="toll-talk">Talk their way past</button><button type="button" class="btn" data-act="toll-around">Go around</button><button type="button" class="btn quiet" data-act="town-cancel">Cancel</button></div>' +
        '<p class="note" style="margin:8px 0 0">Talking past or going around: you run it at the table. The log just notes it.</p></div>';
      return;
    }
    box.innerHTML = '<div class="ask" role="dialog" aria-modal="true" aria-labelledby="ask-h"><p class="eyebrow" style="margin:0 0 4px;font-size:11px">Day ' + t.day + step + '</p>' +
      '<h2 id="ask-h">The road reaches ' + esc(tw.label) + '</h2><p class="note" style="margin:0 0 6px">They get there ' + when + '.' + (s.passed.length ? ' Already went through ' + esc(s.passed.join(', ')) + '.' : '') + '</p>' +
      (townWhat(tw.slug) ? '<p style="margin:0 0 10px">' + esc(townWhat(tw.slug)) + '</p>' : '') +
      '<p style="margin:0 0 12px"><b>Are they stopping or going through?</b></p>' +
      '<div class="actions" style="margin:0"><button type="button" class="btn primary" data-act="town-stop">Stop here</button><button type="button" class="btn" data-act="town-pass">Go through</button><button type="button" class="btn quiet" data-act="town-cancel">Cancel</button></div></div>';
  }
  function townDecide(stop) {
    var s = ui.stopAsk; if (!s) return;
    var tw = s.list[s.i];
    if (stop) { ui.stopAsk = null; drawStopAsk(); return nextDay(s.campId, { decided: true, passed: s.passed, stop: tw, tolls: s.tolls }); }
    if (!tw.ruin) s.passed.push(tw.label);
    s.i++;
    if (s.i < s.list.length) return drawStopAsk();
    ui.stopAsk = null; drawStopAsk();
    nextDay(s.campId, { decided: true, passed: s.passed, tolls: s.tolls });
  }
  // They found it: the page opens up to players.
  function discover(slug) {
    var a = slug ? articleBySlug(slug) : null;
    if (!a || !a.hidden) return Promise.resolve();
    return sb.from('articles').update({ hidden: false }).eq('id', a.id).then(function (r) { if (r.error) throw r.error; a.hidden = false; });
  }

  function tollText(tolls) {
    return (tolls || []).map(function (tl) {
      if (tl.how === 'paid') { var who = tl.payer ? charName(tl.payer) : ''; return ' Paid ' + money(tl.cp) + ' toll at ' + tl.label + (who ? ' (' + who + ' paid)' : '') + '.'; }
      return tl.how === 'talked' ? ' Talked their way past the toll at ' + tl.label + '.' : ' Went around the toll at ' + tl.label + '.';
    }).join('');
  }
  function nextDay(campId, opt) {
    opt = opt || {};
    var t = travel[campId];
    ensureTravelMarkers(t).then(function () {
      var j = journey(t);
      var day = t.day;
      var entry = { campaign_id: campId, day: day, miles: 0, map_id: t.map_id || null };
      var moveOp = Promise.resolve({}), arrival, moving = j.remaining != null && j.remaining >= 0.1 && ((j.byMap && j.route) || j.mpd > 0);
      if (moving) {
        var mv = dayMove(t, j, opt.stop ? opt.stop.d : 1);
        if (!opt.decided) {
          var towns = dayTowns(t, j, mv).concat(dayTolls(t, j, mv), dayRuins(t, j, mv)).sort(function (a, b) { return a.d - b.d; });
          if (towns.length) { ui.stopAsk = { campId: campId, list: towns, i: 0, passed: [], tolls: [] }; drawStopAsk(); render(); return; }
        }
        var pos = opt.stop ? { x: opt.stop.x, y: opt.stop.y } : mv.pos, arrived = !opt.stop && mv.arrived;
        var mix = Object.keys(mv.byGround).sort(function (a, b) { return mv.byGround[b] - mv.byGround[a]; }).filter(function (k2) { return mv.byGround[k2] >= 0.5; })
          .map(function (k2) { return k2.toLowerCase() + ' (' + fmtMiles(mv.byGround[k2]) + ')'; });
        entry.miles = Math.round(mv.miles * 10) / 10;
        entry.from_x = j.party.x; entry.from_y = j.party.y; entry.to_x = pos.x; entry.to_y = pos.y;
        entry.text = 'Traveled ' + fmtMiles(mv.miles) + ' by ' + t.mode.toLowerCase() + (boatOf(t) || airOf(t) ? ' in ' + (t.weather || 'Fair').toLowerCase() + ' weather' : j.byMap ? ' at a ' + t.pace.toLowerCase() + ' pace' : ' through ' + t.terrain.toLowerCase() + ' at a ' + t.pace.toLowerCase() + ' pace') + (mix.length ? ': ' + mix.join(', ') : '') + '.' +
          ((opt.passed || []).length ? ' Went through ' + opt.passed.join(', ') + '.' : '') +
          tollText(opt.tolls) +
          (opt.stop ? ' Stopped at ' + midLabel(opt.stop.label) + '.' : arrived ? ' Arrived' + (t.dest_label ? ' at ' + t.dest_label : '') + '.' : '');
        moveOp = sb.from('map_markers').update({ x: pos.x, y: pos.y }).eq('id', j.party.id);
        var town = opt.stop || (arrived ? nearTown(j.map.id, t.dest_x, t.dest_y) : null);
        arrival = town ? { label: town.label, slug: town.slug || town.article_slug || '', day: day + 1, ruin: town.ruin ? town.id : undefined } : (arrived && t.dest_label ? { label: t.dest_label, slug: '', day: day + 1 } : null);
      } else {
        entry.text = j.remaining != null && j.remaining < 0.1 ? 'Stayed' + (t.arrival ? ' in ' + t.arrival.label : t.dest_label ? ' at ' + t.dest_label : '') + '.' : 'A day passed.';
      }
      var need = foodPerDay(t), have = Number(t.food || 0);
      var used = Math.min(need, have);
      entry.food_used = used;
      if (need > 0) entry.text += used < need ? ' Ran out of food (short ' + (Math.round((need - used) * 10) / 10) + ').' : ' Ate ' + used + ' food, ' + (Math.round((have - used) * 10) / 10) + ' left.';
      var patch = { day: day + 1, food: Math.round((have - used) * 10) / 10 };
      if (moving) patch.arrival = arrival;
      var paid = [];
      (opt.tolls || []).forEach(function (tl) { (tl.shares || []).forEach(function (sh) { paid.push(sh); }); });
      if (paid.length) entry.paid = paid;
      return moveOp.then(function (r) {
        if (r.error) throw r.error;
        return Promise.all(moveCoins(paid, 1));
      }).then(function (res) {
        (res || []).forEach(function (r) { if (r && r.error) throw r.error; });
        return sb.from('travel_log').insert(entry);
      }).then(function (r) {
        if (r.error) throw r.error;
        return sb.from('travel_state').update(patch).eq('campaign_id', campId);
      }).then(function (r) {
        if (r.error) throw r.error;
        return arrival ? (arrival.ruin ? findRuin(arrival.ruin) : discover(arrival.slug)) : null;
      }).then(function () {
        return Promise.all([loadTravel(), t.map_id ? loadMarkers(t.map_id) : null]);
      }).then(function () { toast(arrival ? 'Arrived at ' + midLabel(arrival.label) : 'Day ' + (day + 1)); render(); });
    }).catch(function (e) { fail(e, 'Could not advance the day.'); });
  }

  // What the party knows about the town they just stopped in. The DM also gets the shops to pick from.
  function arrivalBlock(camp, compact) {
    var t = travel[camp.id], ar = t && t.arrival;
    if (!ar) return '';
    var dm = dmView(), a = ar.slug ? articleBySlug(ar.slug) : null, known = a && (dm || !a.hidden);
    if (ar.ruin) {
      var rm = null; Object.keys(markers).forEach(function (k) { (markers[k] || []).forEach(function (x) { if (x.id === ar.ruin) rm = x; }); });
      return '<section class="block arrival"><h2 class="sec-title">They stopped at ' + esc(midLabel(ar.label)) + '<small>Day ' + esc(ar.day) + '</small></h2><div class="group-box">' +
        (dm && rm && rm.info && rm.info.desc ? '<p style="margin:0;white-space:pre-line">' + esc(rm.info.desc) + '</p>' : '<p class="note" style="margin:0">A place off the road, not a town.</p>') +
        (dm && !compact ? '<div class="actions"><button type="button" class="btn small quiet" data-act="arr-leave" data-camp="' + esc(camp.id) + '">Done here</button></div>' : '') + '</div></section>';
    }
    var facts = known ? ['Type', 'Region', 'Holder', 'Ruler', 'Population'].filter(function (k) { return a.fields && a.fields[k]; }).map(function (k) { return '<span><b>' + esc(k) + ':</b> ' + inline(String(a.fields[k])) + '</span>'; }) : [];
    var html = '<section class="block arrival"><h2 class="sec-title">You’ve arrived at ' + esc(ar.label) + '<small>Day ' + esc(ar.day) + '</small></h2><div class="group-box">' +
      (known ? (a.summary ? '<p style="margin:0 0 6px">' + inline(a.summary) + '</p>' : '') + (facts.length ? '<p class="arr-facts">' + facts.join('') + '</p>' : '') + '<div class="actions" style="margin:6px 0 0"><a class="btn small" href="#/a/' + encodeURIComponent(a.slug) + '">Read about ' + esc(a.title) + '</a></div>'
        : '<p class="note" style="margin:0">' + (dm ? 'No wiki page for ' + esc(ar.label) + ' yet.' : 'Nothing written about this place yet.') + '</p>');
    if (dm && !compact) {
      if (a) html += '<p class="note" style="margin:8px 0 0">' + (a.hidden ? 'Players can’t see this page.' : 'Players can see this page now.') + ' <button type="button" class="btn small quiet" data-act="arr-hide" data-id="' + esc(a.id) + '">' + (a.hidden ? 'Show it to them' : 'Hide it again') + '</button></p>';
      if (a && loaded.shops) {
        var here = shopsAt(a.id);
        html += '<p class="eyebrow" style="margin:12px 0 4px;font-size:11px">Shops here · tap one to open it</p>' + (here.length ? shopRows(here) : '<div class="empty">No shops written for ' + esc(a.title) + ' yet.</div>') +
          '<div class="actions"><button type="button" class="btn small" data-act="new-shop" data-place="' + esc(a.id) + '" data-campaign="' + esc(camp.id) + '">+ Add a shop</button>' + meetButton(camp.id, false) + '</div>';
      }
      html += '<div class="actions"><button type="button" class="btn small quiet" data-act="arr-leave" data-camp="' + esc(camp.id) + '">Done in town</button></div>';
    }
    return html + '</div></section>';
  }

  function undoDay(campId) {
    var last = travelLog.filter(function (l) { return l.campaign_id === campId; })[0];
    if (!last) return;
    var steps = [];
    if (last.paid && last.paid.length) steps = steps.concat(moveCoins(last.paid, -1));
    if (last.map_id && last.from_x != null) {
      var pm = partyMarker(last.map_id);
      if (pm) steps.push(sb.from('map_markers').update({ x: last.from_x, y: last.from_y }).eq('id', pm.id));
    }
    Promise.all(steps).then(function (res) {
      res.forEach(function (r) { if (r.error) throw r.error; });
      return sb.from('travel_log').delete().eq('id', last.id);
    }).then(function (r) {
      if (r.error) throw r.error;
      var up = { day: last.day, food: Number(travel[campId].food || 0) + Number(last.food_used || 0) };
      if (last.from_x != null) up.arrival = null;
      return sb.from('travel_state').update(up).eq('campaign_id', campId);
    }).then(function (r) {
      if (r.error) throw r.error;
      return Promise.all([loadTravel(), last.map_id ? loadMarkers(last.map_id) : null]);
    }).then(function () { toast(Number(last.miles) || last.from_x != null || Number(last.food_used) ? 'Back to day ' + last.day : 'Removed the last entry'); render(); })
      .catch(function (e) { fail(e, 'Could not undo the last day.'); });
  }

  function saveRules(form) {
    var campId = form.getAttribute('data-camp');
    var t = travel[campId];
    var old = rulesOf(t);
    var lines2 = function (id) { return uniq(document.getElementById(id).value.split('\n').map(function (x) { return x.trim().slice(0, 30); })); };
    var modes = lines2('ru-modes'), terrains = lines2('ru-terrains');
    if (!modes.length || !terrains.length) return toast('Keep at least one way to travel and one terrain.');
    var speeds = {};
    terrains.forEach(function (tn) { speeds[tn] = {}; modes.forEach(function (mn) { speeds[tn][mn] = Number(((old.speeds[tn] || {})[mn]) || 0); }); });
    form.querySelectorAll('[data-speed-t]').forEach(function (inp) {
      var tn = inp.getAttribute('data-speed-t'), mn = inp.getAttribute('data-speed-m');
      if (speeds[tn] && mn in speeds[tn]) speeds[tn][mn] = Math.max(0, Number(inp.value) || 0);
    });
    var paces = {};
    var pn = form.querySelectorAll('[data-pace-name]'), pv = form.querySelectorAll('[data-pace-val]');
    pn.forEach(function (n, i) { var k = n.value.trim().slice(0, 30), v = Number(pv[i].value); if (k && isFinite(v) && v >= 0) paces[k] = Math.round(v * 100) / 100; });
    if (!Object.keys(paces).length) paces = { Normal: 1 };
    var ground = {};
    form.querySelectorAll('[data-ground]').forEach(function (sl) { ground[sl.getAttribute('data-ground')] = sl.value; });
    var boats = [];
    form.querySelectorAll('[data-boat]').forEach(function (row) {
      var name = row.querySelector('[data-boat-name]').value.trim().slice(0, 30);
      if (!name || modes.indexOf(name) >= 0 || boats.some(function (b) { return b.name === name; })) return;
      boats.push({ name: name, mi: Math.max(0, Number(row.querySelector('[data-boat-mi]').value) || 0), river: row.querySelector('[data-boat-river]').value, sea: row.querySelector('[data-boat-sea]').value });
    });
    var weathers = {};
    var wn = form.querySelectorAll('[data-weather-name]'), wv = form.querySelectorAll('[data-weather-val]');
    wn.forEach(function (n, i) { var k = n.value.trim().slice(0, 30), v = Number(wv[i].value); if (k && isFinite(v) && v >= 0) weathers[k] = Math.round(v * 100) / 100; });
    if (!Object.keys(weathers).length) weathers = { Fair: 1 };
    var current = { down: Math.max(0, Number(document.getElementById('cu-down').value) || 1), up: Math.max(0, Number(document.getElementById('cu-up').value) || 1) };
    var airships = [];
    form.querySelectorAll('[data-air]').forEach(function (row) {
      var name = row.querySelector('[data-air-name]').value.trim().slice(0, 30);
      if (!name || modes.indexOf(name) >= 0 || boats.some(function (b) { return b.name === name; }) || airships.some(function (a) { return a.name === name; })) return;
      airships.push({ name: name, mi: Math.max(0, Number(row.querySelector('[data-air-mi]').value) || 0), ceiling: Math.max(0, Number(row.querySelector('[data-air-ceil]').value) || 1000) });
    });
    var skies = {};
    var sn = form.querySelectorAll('[data-sky-name]'), sv = form.querySelectorAll('[data-sky-val]');
    sn.forEach(function (n, i) { var k = n.value.trim().slice(0, 30), v = Number(sv[i].value); if (k && isFinite(v) && v >= 0) skies[k] = Math.round(v * 100) / 100; });
    if (!Object.keys(skies).length) skies = { Fair: 1 };
    var patch = { rules: { modes: modes, terrains: terrains, speeds: speeds, paces: paces, ground: ground, boats: boats, weathers: weathers, current: current, airships: airships, skies: skies } };
    var isAir = airships.some(function (a) { return a.name === t.mode; });
    if (modes.indexOf(t.mode) < 0 && !boats.some(function (b) { return b.name === t.mode; }) && !isAir) patch.mode = modes[0];
    if (!(t.weather in (isAir ? skies : weathers))) patch.weather = Object.keys(isAir ? skies : weathers)[0];
    if (terrains.indexOf(t.terrain) < 0) patch.terrain = terrains[0];
    if (!(t.pace in paces)) patch.pace = Object.keys(paces)[0];
    saveTravel(campId, patch).then(function () { toast('Rules saved'); render(); });
  }

  function saveFood(form) {
    var campId = form.getAttribute('data-camp');
    saveTravel(campId, {
      food: Math.max(0, Number(document.getElementById('fd-food').value) || 0),
      party_size: Math.max(0, num(document.getElementById('fd-size').value, 0)),
      food_per_person: Math.max(0, Number(document.getElementById('fd-per').value) || 0)
    }).then(function () { toast('Supplies updated'); render(); });
  }

  /* ================= Live updates ================= */
  var liveChannel = null;
  function busy() {
    var r = parseRoute();
    if (['edit', 'builder', 'customize', 'campaign-edit', 'map-edit', 'spell-new', 'spell-edit', 'build', 'level-up', 'shop-edit'].indexOf(r.name) >= 0) return true;
    if (ui.pendingPin || ui.placing || ui.holdEdit) return true;
    var a = document.activeElement;
    return !!(a && $view.contains(a) && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName));
  }
  function liveRefresh(job) {
    clearTimeout(liveRefresh.t);
    liveRefresh.jobs = (liveRefresh.jobs || []).concat([job]);
    liveRefresh.t = setTimeout(function () {
      var jobs = liveRefresh.jobs; liveRefresh.jobs = [];
      Promise.all(jobs.map(function (fn) { return fn(); })).then(function () {
        if (!busy()) { rememberMapScroll(); render(); }
      }).catch(function () {});
    }, 300);
  }
  function startLive() {
    if (liveChannel || !sb.channel) return;
    liveChannel = sb.channel('avarenth-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'map_markers' }, function (p) {
        var mid = (p.new && p.new.map_id) || (p.old && p.old.map_id);
        liveRefresh(function () { return mid && markers[mid] ? loadMarkers(mid) : Object.keys(markers).length ? Promise.all(Object.keys(markers).map(loadMarkers)) : null; });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'travel_state' }, function () { liveRefresh(loadTravel); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'travel_log' }, function () { liveRefresh(loadTravel); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'crimes' }, function () { liveRefresh(loadCrimes); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reputation' }, function () { liveRefresh(loadReputation); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'holdings' }, function () { if (loaded.holdings) liveRefresh(loadHoldings); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'estates' }, function () { if (loaded.holdings) liveRefresh(loadHoldings); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'custom_subclasses' }, function () { liveRefresh(loadCustomSubs); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'spells' }, function () { if (spells !== null || isDM()) liveRefresh(loadSpells); })
      .subscribe();
  }
  function stopLive() { if (liveChannel) { sb.removeChannel(liveChannel); liveChannel = null; } }

  /* ================= Holdings: ships, caravans, manors, castles, lordships ================= */
  // One loyalty score per crew (and per garrison), 1–10, kept DM-only in holding_secrets. Players see a mood word.
  // Payday comes every 28 days on the travel day counter. The table rolls a d20 for anything out trading.
  var holdings = [], holdSecrets = {}, estates = {};
  var PAY_EVERY = 28;
  var HOLD_KINDS = [['ship', 'Ship'], ['airship', 'Airship'], ['caravan', 'Wagons'], ['manor', 'Manor'], ['castle', 'Castle'], ['town', 'Town lordship'], ['workshop', 'Workshop'], ['vassal', 'Sworn lord (vassal)'], ['siege', 'Siege engine']];
  var HOLD_LABEL = {}; HOLD_KINDS.forEach(function (k) { HOLD_LABEL[k[0]] = k[1]; });
  var HOLD_LAND = { manor: 1, castle: 1, town: 1, workshop: 1 };
  var HOLD_MOVES = { ship: 1, airship: 1, caravan: 1, siege: 1 };
  // crew, wages a month (whole crew), upkeep a month, income (land) or trade profit (movers) a month, mooring a day
  var VESSEL_DEF = {
    'Rowboat': { crew: 1, wages: 6, upkeep: 1, income: 15, moor: 0.1 },
    'River barge': { crew: 3, wages: 20, upkeep: 5, income: 60, moor: 0.3 },
    'Cog': { crew: 10, wages: 60, upkeep: 15, income: 250, moor: 0.5 },
    'Sailing ship': { crew: 20, wages: 120, upkeep: 30, income: 500, moor: 0.5 },
    'Galley': { crew: 80, wages: 480, upkeep: 60, income: 900, moor: 1 },
    'Airship': { crew: 10, wages: 150, upkeep: 50, income: 1200, moor: 2 }
  };
  var HOLD_DEF = {
    ship: { crew: 10, wages: 60, upkeep: 15, income: 250, moor: 0.5 },
    airship: VESSEL_DEF.Airship,
    caravan: { crew: 6, wages: 50, upkeep: 10, income: 200, moor: 0.2 },
    manor: { crew: 5, wages: 10, upkeep: 5, income: 50 },
    castle: { crew: 20, wages: 40, upkeep: 30, income: 150 },
    town: { crew: 40, wages: 100, upkeep: 50, income: 400 },
    workshop: { crew: 3, wages: 10, upkeep: 5, income: 40 },
    vassal: { crew: 0, wages: 0, upkeep: 0, income: 60 },
    siege: { crew: 10, wages: 0, upkeep: 5, income: 0, moor: 0 }
  };
  var WEALTH = [['Wretched', 0.25], ['Poor', 0.5], ['Modest', 1], ['Rich', 1.5], ['Thriving', 2]];
  // What an owner can build on their land. Costs and days must match holding_order() in the database.
  var BUILDINGS = [
    { n: 'Market', cost: 800, days: 45, inc: 50, up: 5, what: '+50 gp a month' },
    { n: 'Mill', cost: 300, days: 30, inc: 20, up: 2, what: '+20 gp a month' },
    { n: 'Toll bridge', cost: 500, days: 30, inc: 30, up: 2, what: '+30 gp a month' },
    { n: 'Port', cost: 1500, days: 90, inc: 40, up: 10, what: '+40 gp a month, and your ships moor free' },
    { n: 'Chapel', cost: 600, days: 45, up: 3, calm: 1, what: 'Unrest eases 1 more each month' },
    { n: 'Granary', cost: 400, days: 30, up: 2, stores: 1, what: 'Bad harvests and sickness hit half as hard' },
    { n: 'Watchtower', cost: 200, days: 20, up: 1, def: 1, what: 'Defense +1' },
    { n: 'Walls', cost: 2500, days: 120, up: 10, def: 2, what: 'Defense +2' },
    { n: 'Barracks', cost: 700, days: 40, up: 5, order: 1, what: 'Soldiers count double for keeping order' }
  ];
  var BUILD = {}; BUILDINGS.forEach(function (b) { BUILD[b.n] = b; });
  var TAX = { Low: { mul: 0.75, unrest: -1 }, Normal: { mul: 1, unrest: 0 }, High: { mul: 1.25, unrest: 1 }, Crushing: { mul: 1.5, unrest: 2 } };
  var POP_DEF = { manor: 200, castle: 500, town: 3000 };
  var GAINED = { Bought: { crew: 5, unrest: 2 }, Granted: { crew: 5, unrest: 2 }, Inherited: { crew: 6, unrest: 2 }, Taken: { crew: 3, unrest: 6 } };
  function folkOf(u) { u = num(u, 0); return u >= 10 ? { w: 'In revolt', mul: 0 } : u >= 8 ? { w: 'Rioting', mul: 0.5 } : u >= 6 ? { w: 'Angry', mul: 0.75 } : u >= 4 ? { w: 'Uneasy', mul: 0.9 } : { w: 'Content', mul: 1 }; }
  function folkTag(u) { var f = folkOf(u), cls = { Content: 'tier-good', Uneasy: 'tier-neutral', Angry: 'warn', Rioting: 'tier-bad', 'In revolt': 'tier-disaster' }[f.w]; return '<span class="tag ' + cls + '">' + esc(f.w) + '</span>'; }
  function hasPeople(h) { return h.kind === 'manor' || h.kind === 'castle' || h.kind === 'town'; }
  // Buildings standing today: the ones marked built, plus any project whose finish day has come.
  function builtOf(h) {
    var d = h.data || {}, t = travel[h.campaign_id], day = t ? t.day : 0, out = {};
    Object.keys(d.extras || {}).forEach(function (k) { if (d.extras[k]) out[k] = true; });
    (d.projects || []).forEach(function (p) { if (num(p.done, 0) <= day) out[p.name] = true; });
    return out;
  }
  function buildSum(h, key) { var b = builtOf(h), n = 0; Object.keys(b).forEach(function (k) { n += Number((BUILD[k] || {})[key] || 0); }); return n; }
  function defenseOf(h) {
    var d = h.data || {}, s = num(d.soldiers, 0), eng = 0;
    if (d.at) holdingsFor(h.campaign_id).forEach(function (x) { if (x.kind === 'siege' && holdMode(x).mode === 'moored' && holdMode(x).at === d.at && !shipStats(x).fitting.length) eng += shipStats(x).def; });
    return buildSum(h, 'def') + (s >= 10 ? 1 : 0) + (s >= 40 ? 1 : 0) + eng;
  }
  function upkeepOf(h) {
    var d = h.data || {};
    if (h.kind === 'caravan') return Math.round(num(d.wagons, 1) * WAGON.feed * Math.max(0, 1 + shipStats(h).upkeep));
    if (h.kind === 'ship' || h.kind === 'airship' || h.kind === 'siege') return Math.round(Number(d.upkeep || 0) * Math.max(0, 1 + shipStats(h).upkeep));
    return Number(d.upkeep || 0) + (hasPeople(h) ? buildSum(h, 'up') : 0);
  }
  function titleOf(h) { var d = h.data || {}; if (d.title) return d.title; return h.kind === 'castle' ? 'Knight of ' + h.name : h.kind === 'town' ? 'Baron of ' + (d.at || h.name) : h.kind === 'manor' ? 'Lord of ' + h.name : ''; }
  // The table's d20 for a land holding's month. raid: averted at that defense. stores: a granary halves it.
  var HOLD_EVENTS = [null,
    { t: 'Fire in the hall or the barns. A quarter of the coffer goes on rebuilding.', cofPct: -0.25, unrest: 1 },
    { t: 'Raiders hit the outlying farms and carry off what they can.', inc: -0.3, unrest: 1, raid: 2, safe: 'Raiders came close, saw the defenses, and went elsewhere.' },
    { t: 'Sickness in the villages. Some die, and the rest work slow.', pop: -0.05, inc: -0.25, unrest: 1, stores: 1 },
    { t: 'A bad harvest. Bellies will be thin this winter.', inc: -0.5, unrest: 1, stores: 1 },
    { t: 'Two villages are feuding over a field boundary. Someone has to judge it, and both sides expect to win.', unrest: 1 },
    { t: 'The steward has been helping himself to the coffer.', cofPct: -0.1, onlyIf: 'restless', safe: 'The steward finds a mistake in the books. Nothing missing, this time.' },
    { t: 'A tax collector was beaten and left in a ditch.', unrest: 1, onlyIf: 'hightax', safe: 'Grumbling about the tax, nothing more.' },
    { t: 'The folk send a petition: a bridge, a judgement, a lighter tax. Granting it would ease them.' },
    { t: 'A stranger arrives asking for shelter and work, and won’t say where from.' },
    { t: 'A quiet month.' }, { t: 'A quiet month.' },
    { t: 'A wedding at the hall. The lord is expected to pay for the ale.', cof: -20, unrest: -1 },
    { t: 'Travelling merchants stop a while. Trade is brisk.', inc: 0.1 },
    { t: 'New families settle on empty land.', pop: 0.05 },
    { t: 'A good harvest. The barns are full.', inc: 0.25 },
    { t: 'Busy market days all month.', inc: 0.25 },
    { t: 'A skilled craftsman settles here and takes on apprentices.', inc: 0.1, unrest: -1 },
    { t: 'Ploughmen turn up an old coin hoard.', hoard: 100 },
    { t: 'A festival day. Everyone remembers why they like it here.', unrest: -2 },
    { t: 'A great month: a vein of ore, a rich patron, or a royal favour.', inc: 1, prosper: 1 }
  ];
  var SOLDIER_WAGE = 6;
  var TRADE_ROLL = {
    sea: [[1, 0, 'Disaster'], [5, 0.25, 'Poor run'], [14, 1, 'Fair run'], [19, 1.5, 'Good run'], [20, 2.5, 'Windfall']],
    caravan: [[2, 0, 'Ambushed'], [6, 0.25, 'Poor run'], [14, 1, 'Fair run'], [19, 1.5, 'Good run'], [20, 2.5, 'Windfall']]
  };
  var FINISH_DAYS = { ship: 5, airship: 3, caravan: 3 };

  function loadHoldings() {
    return Promise.all([
      sb.from('holdings').select('id, campaign_id, name, kind, data, owner_char, created_at').order('created_at'),
      sb.from('estates').select('campaign_id, treasury, payday, ledger'),
      isDM() ? sb.from('holding_secrets').select('holding_id, dm') : Promise.resolve({ data: [] })
    ]).then(function (res) {
      res.forEach(function (r) { if (r.error) throw r.error; });
      holdings = res[0].data || [];
      estates = {}; (res[1].data || []).forEach(function (e) { estates[e.campaign_id] = e; });
      holdSecrets = {}; (res[2].data || []).forEach(function (s) { holdSecrets[s.holding_id] = s.dm || {}; });
      loaded.holdings = true;
    });
  }
  function holdingById(id) { return holdings.filter(function (h) { return h.id === id; })[0] || null; }
  function holdingsFor(campId) { return holdings.filter(function (h) { return h.campaign_id === campId; }); }
  function gp(n) { n = Math.round(Number(n || 0) * 100) / 100; return (n < 0 ? '−' : '') + Math.abs(n).toLocaleString() + ' gp'; }
  function band(l) { l = num(l, 5); return l >= 8 ? 'Loyal' : l >= 5 ? 'Steady' : l >= 3 ? 'Restless' : 'Treacherous'; }
  var MOOD = { Loyal: 'Devoted', Steady: 'Content', Restless: 'Grumbling', Treacherous: 'Mutinous' };
  var GRACE = { Loyal: 3, Steady: 2, Restless: 0, Treacherous: 0 };
  var SKIM = { Loyal: 0, Steady: 0, Restless: 0.25, Treacherous: 0.5 };
  function moodTag(word) { var cls = { Devoted: 'tier-good', Content: 'tier-neutral', Grumbling: 'warn', Mutinous: 'tier-disaster' }[word] || 'plain'; return '<span class="tag ' + cls + '">' + esc(word) + '</span>'; }
  function loyOf(h, unit) { var s = holdSecrets[h.id] || {}; return Math.max(1, Math.min(10, num(s[unit], 5))); }
  function unitOf(h, unit) { var u = ((h.data || {}).units || {})[unit] || {}; return { owed: Number(u.owed || 0), missed: num(u.missed, 0), hurt: num(u.hurt, 0), streak: num(u.streak, 0) }; }
  function unitWages(h, unit) {
    var d = h.data || {};
    if (unit === 'garrison') return num(d.soldiers, 0) * Number(d.soldier_wage != null ? d.soldier_wage : SOLDIER_WAGE);
    if (h.kind === 'caravan') return num(d.wagons, 1) * WAGON.driver + num(d.guards, 0) * WAGON.guard;
    if (h.kind === 'siege') return Math.round(num(d.crew, (SIEGE[vesselName(h)] || {}).crew || 10) * SIEGE_WAGE * (1 + shipStats(h).wages));
    if (h.kind === 'ship' || h.kind === 'airship') { var ss = shipStats(h); return Math.round(Number(d.wages || 0) * (1 + ss.marines + ss.wages)) + (h.kind === 'airship' && d.dwarves ? 30 : 0); }
    return Number(d.wages || 0);
  }
  function unitsOf(h) { var d = h.data || {}, u = ['crew']; if (HOLD_LAND[h.kind] && num(d.soldiers, 0) > 0) u.push('garrison'); return u; }
  function unitName(h, unit) { return unit === 'garrison' ? 'Garrison' : h.kind === 'vassal' ? 'The lord himself' : HOLD_LAND[h.kind] ? 'Household' : 'Crew'; }
  var FAVOR = [[-3, 'Declared a rebel'], [-2, 'Angry'], [-1, 'Displeased'], [0, 'In good standing'], [1, 'Trusted'], [2, 'Favoured']];
  function favorWord(f) { f = Math.max(-3, Math.min(2, num(f, 0))); return FAVOR.filter(function (x) { return x[0] === f; })[0][1]; }
  function favorTag(f) { f = num(f, 0); return '<span class="tag ' + (f >= 1 ? 'tier-good' : f === 0 ? 'tier-neutral' : f === -1 ? 'warn' : f === -2 ? 'tier-bad' : 'tier-disaster') + '">' + esc(favorWord(f)) + '</span>'; }
  var SCUTAGE = 20, LEVY_FEED = 3;
  function wealthMul(w) { for (var i = 0; i < WEALTH.length; i++) if (WEALTH[i][0] === w) return WEALTH[i][1]; return 1; }
  function vesselOf(h) {
    var d = h.data || {}, t = travel[h.campaign_id], r = t ? rulesOf(t) : null;
    if (!r) return null;
    if (h.kind === 'airship') return r.airships.filter(function (a) { return a.name === d.vessel; })[0] || r.airships[0] || null;
    if (h.kind === 'ship') return r.boats.filter(function (b) { return b.name === d.vessel; })[0] || null;
    return null;
  }
  // Where a mover actually is today: a ship that has finished coming home counts as moored there.
  // Price and build time for a new commission. Matches the Ships and Commissions page.
  var COMMISSION = { 'Rowboat': [50, 2], 'River barge': [3000, 30], 'Cog': [8000, 60], 'Sailing ship': [10000, 90], 'Galley': [30000, 180], 'Airship': [60000, 360], caravan: [150, 3] };
  function commissionOf(kind, vessel) { if (kind === 'siege') { var se = SIEGE[vessel || 'Battering ram']; return se ? [se.price, se.days] : null; } return COMMISSION[kind === 'caravan' ? 'caravan' : vessel] || null; }
  // The table's d20 each month an airship is on the slips: the dwarves and gnomes have to share a yard.
  function yardRoll(r) { return r <= 2 ? { days: 60, t: 'The dwarves and gnomes fell out and the yard stood empty all month. The work is set back two months.' } : r <= 6 ? { days: 14, t: 'Arguments in the yard. Work went slowly.' } : r >= 20 ? { days: -30, t: 'The two crews found a rhythm. The work is a month ahead.' } : r >= 17 ? { days: -7, t: 'A good month in the yard.' } : { days: 0, t: 'The work goes on.' }; }
  function holdMode(h) {
    var d = h.data || {}, t = travel[h.campaign_id], day = t ? t.day : 0;
    if (d.mode === 'building') return num(d.ready, 0) > day ? { mode: 'building', at: d.yard || '', since: day, free: false } : { mode: 'moored', at: d.yard || d.at || '', since: num(d.ready, day), free: false };
    if (d.mode === 'returning' && num(d.ret_day, 0) <= day) return { mode: 'moored', at: d.ret_to || d.at || '', since: num(d.ret_day, day), free: !!d.ret_free };
    return { mode: d.mode || (HOLD_MOVES[h.kind] ? 'party' : 'home'), at: d.at || '', since: num(d.moor_since, day), free: !!d.moor_free };
  }
  /* Fittings go in slots, one per slot, plus weapon mounts by size. pct = cost as a share of the vehicle's new price.
     profit/speed/upkeep are fractions; def softens bad rolls (and guards holdings for siege engines); fight helps raids and crown pay;
     attack is a siege engine's weight against walls; luck lifts rolls of 3 or less by one; weather halves foul-weather slowdowns. */
  var SLOT_NAMES = { hull: 'Hull', rigging: 'Rigging', deck: 'Deck', figurehead: 'Figurehead', keel: 'Keel', weapon: 'Weapons', wheels: 'Wheels', body: 'Body', team: 'Team', cover: 'Covering', frame: 'Frame', crew: 'Crew' };
  var SLOTS = { ship: ['hull', 'rigging', 'deck', 'figurehead', 'weapon'], airship: ['hull', 'rigging', 'deck', 'figurehead', 'keel', 'weapon'], caravan: ['wheels', 'body', 'team', 'weapon'], siege: ['cover', 'frame', 'crew'] };
  var ATTACH = [
    { n: 'Reinforced hull', slot: 'hull', on: 'ship air', pct: 15, days: 21, def: 1, what: 'Defense +1' },
    { n: 'Copper sheathing', slot: 'hull', on: 'ship', pct: 15, days: 21, speed: 0.05, upkeep: -0.25, what: '5% faster, a quarter less upkeep' },
    { n: 'Shallow draft', slot: 'hull', on: 'ship', pct: 15, days: 21, river: 'v', what: 'Can go up ordinary rivers' },
    { n: 'Armoured gondola', slot: 'hull', on: 'air', pct: 15, days: 30, def: 2, speed: -0.1, what: 'Defense +2, 10% slower' },
    { n: 'New rigging', slot: 'rigging', on: 'ship', pct: 10, days: 14, speed: 0.15, what: '15% faster' },
    { n: 'Heavy canvas', slot: 'rigging', on: 'ship', pct: 10, days: 14, weather: 1, what: 'Rough weather slows it half as much' },
    { n: 'Gnome trim-vanes', slot: 'rigging', on: 'air', pct: 12, days: 30, speed: 0.15, what: '15% faster. Gnome work' },
    { n: 'Extra hold', slot: 'deck', on: 'ship air', pct: 10, days: 14, profit: 0.25, speed: -0.1, what: '+25% trade profit, 10% slower' },
    { n: 'Passenger cabins', slot: 'deck', on: 'ship air', pct: 10, days: 14, profit: 0.1, what: '+10% profit, and the odd interesting passenger' },
    { n: 'Marine berths', slot: 'deck', on: 'ship air', pct: 5, days: 7, marines: 0.5, fight: 2, what: 'Half again as many crew, as marines. Fight +2' },
    { n: 'Blessed figurehead', slot: 'figurehead', on: 'ship air', pct: 2, days: 3, grace: 1, what: 'The crew wait out one more missed payday' },
    { n: 'Fearsome figurehead', slot: 'figurehead', on: 'ship air', pct: 2, days: 3, fight: 1, what: 'Fight +1. Enemies hesitate' },
    { n: 'Lucky figurehead', slot: 'figurehead', on: 'ship air', pct: 2, days: 3, luck: 1, what: 'Rolls of 3 or less count one higher' },
    { n: 'Second lift rune', slot: 'keel', on: 'air', pct: 20, days: 60, ceiling: 500, what: 'Flies 500 m higher. Dwarf work' },
    { n: 'Storm keel', slot: 'keel', on: 'air', pct: 15, days: 45, storm: 1, what: 'Flies through storms at half speed' },
    { n: 'Ballista', slot: 'weapon', on: 'ship air', pct: 5, days: 10, def: 1, fight: 1, what: 'Defense +1, fight +1' },
    { n: 'Scorpions', slot: 'weapon', on: 'ship air wagon', pct: 4, days: 7, def: 2, what: 'Defense +2. Keeps boarders off' },
    { n: 'Fire pots', slot: 'weapon', on: 'ship air', pct: 4, days: 7, fight: 2, what: 'Fight +2' },
    { n: 'Ram', slot: 'weapon', on: 'ship', pct: 8, days: 14, fight: 1, one: 1, what: 'Fight +1. One, on the bow' },
    { n: 'Iron-rimmed wheels', slot: 'wheels', on: 'wagon', pct: 10, days: 3, profit: 0.1, what: '+10% profit: more runs, fewer breakdowns' },
    { n: 'Covered wagons', slot: 'body', on: 'wagon', pct: 10, days: 3, profit: 0.15, what: '+15% profit: cargo stays dry' },
    { n: 'War wagons', slot: 'body', on: 'wagon', pct: 30, days: 7, def: 2, profit: -0.2, what: 'Defense +2, 20% less cargo. Can mount scorpions' },
    { n: 'Oxen', slot: 'team', on: 'wagon', pct: 0, days: 1, upkeep: -0.5, profit: -0.05, what: 'Half the feed, a little slower' },
    { n: 'Heavy horses', slot: 'team', on: 'wagon', pct: 30, days: 1, upkeep: 0.5, profit: 0.1, what: '+10% profit, half again the feed' },
    { n: 'Hide covering', slot: 'cover', on: 'siege', pct: 10, days: 3, def: 1, what: 'Fire won’t take it. Defense +1' },
    { n: 'Heavier counterweight', slot: 'frame', on: 'throw', pct: 20, days: 7, attack: 1, what: 'Attack +1: throws further and harder' },
    { n: 'Iron-shod head', slot: 'frame', on: 'Battering ram', pct: 20, days: 5, attack: 1, what: 'Attack +1' },
    { n: 'Extra storey', slot: 'frame', on: 'Siege tower', pct: 25, days: 7, attack: 1, what: 'Attack +1: tops higher walls' },
    { n: 'Trained engineers', slot: 'crew', on: 'siege', pct: 15, days: 7, attack: 1, wages: 0.5, what: 'Attack +1, half again the wages' }
  ];
  var ATT = {}; ATTACH.forEach(function (a) { ATT[a.n] = a; });
  // What the class of vessel is good at before anything is fitted.
  var CLASS_BONUS = {
    'Rowboat': { freeMoor: 1, what: 'Small and handy: moors free anywhere' },
    'River barge': { profit: 0.15, what: 'River trader: +15% trade profit' },
    'Cog': { profit: 0.15, what: 'Built for trade: +15% trade profit' },
    'Sailing ship': { weather: 1, what: 'Ocean-goer: rough weather slows it half as much' },
    'Galley': { fight: 2, what: 'Built for war: fight +2' },
    'Airship': { def: 1, what: 'Out of reach: defense +1' }
  };
  var MOUNTS = { 'Rowboat': 0, 'River barge': 1, 'Cog': 2, 'Sailing ship': 3, 'Galley': 4, 'Airship': 2 };
  // Siege engines: attack against walls, defense when stationed at a holding, crew, price and days to build, miles a day hauled (0 = built where it stands).
  var SIEGE = {
    'Battering ram': { attack: 3, def: 0, crew: 10, price: 300, days: 7, mi: 12, what: 'Breaks gates' },
    'Siege tower': { attack: 3, def: 0, crew: 20, price: 800, days: 14, mi: 6, what: 'Puts men on the walls' },
    'Catapult': { attack: 2, def: 1, crew: 6, price: 500, days: 10, mi: 12, throw: 1, what: 'Batters walls from range' },
    'Mangonel': { attack: 2, def: 2, crew: 6, price: 400, days: 10, mi: 12, throw: 1, what: 'Throws stones at men as well as walls' },
    'Trebuchet': { attack: 5, def: 2, crew: 12, price: 1500, days: 30, mi: 0, throw: 1, what: 'Brings walls down. Built where it stands' },
    'Ballista cart': { attack: 1, def: 2, crew: 4, price: 300, days: 7, mi: 18, what: 'Picks men off walls and decks' }
  };
  var SIEGE_WAGE = 6;
  function vesselName(h) { var d = h.data || {}; return d.vessel || (h.kind === 'airship' ? 'Airship' : h.kind === 'siege' ? 'Battering ram' : h.kind === 'ship' ? 'Cog' : ''); }
  function attachFits(h, a) {
    var on = ' ' + a.on + ' ', v = vesselName(h);
    if (h.kind === 'ship') return on.indexOf(' ship ') >= 0;
    if (h.kind === 'airship') return on.indexOf(' air ') >= 0;
    if (h.kind === 'caravan') return on.indexOf(' wagon ') >= 0 && (a.n !== 'Scorpions' || fitIn(h, 'body') === 'War wagons');
    if (h.kind === 'siege') return a.on === 'siege' || a.on === v || (a.on === 'throw' && SIEGE[v] && SIEGE[v].throw);
    return false;
  }
  function slotsOf(h) { return SLOTS[h.kind] || []; }
  function mountsOf(h) { return h.kind === 'caravan' ? (fitIn(h, 'body') === 'War wagons' ? 1 : 0) : MOUNTS[vesselName(h)] || 0; }
  function fitIn(h, slot) { var f = ((h.data || {}).fits || []).filter(function (x) { return (ATT[x.name] || {}).slot === slot; })[0]; return f ? f.name : ''; }
  function hullPrice(h) {
    if (h.kind === 'caravan') return WAGON.price * num((h.data || {}).wagons, 1);
    if (h.kind === 'siege') return (SIEGE[vesselName(h)] || {}).price || 300;
    var c = commissionOf(h.kind, vesselName(h)); return c ? c[0] : 8000;
  }
  function attachCost(h, a) { return Math.max(a.pct ? 1 : 0, Math.round(hullPrice(h) * a.pct / 100)); }
  // Fitted attachments (done) plus the class bonus, summed. Wagons also get defense from their guards.
  function shipStats(h) {
    var d = h.data || {}, t = travel[h.campaign_id], day = t ? t.day : 0, v = vesselName(h);
    var out = { list: [], fitting: [], profit: 0, speed: 0, upkeep: 0, def: 0, fight: 0, marines: 0, grace: 0, ceiling: 0, storm: 0, river: '', luck: 0, weather: 0, attack: 0, wages: 0, freeMoor: 0, cls: '' };
    var KEYS = ['profit', 'speed', 'upkeep', 'def', 'fight', 'marines', 'grace', 'ceiling', 'storm', 'luck', 'weather', 'attack', 'wages', 'freeMoor'];
    var cb = (h.kind === 'ship' || h.kind === 'airship') ? CLASS_BONUS[v] : null;
    if (cb) { KEYS.forEach(function (k) { if (cb[k]) out[k] += cb[k]; }); out.cls = cb.what; }
    if (h.kind === 'siege' && SIEGE[v]) { out.attack += SIEGE[v].attack; out.def += SIEGE[v].def; out.cls = SIEGE[v].what; }
    (d.fits || []).forEach(function (f) {
      var a = ATT[f.name]; if (!a) return;
      if (num(f.done, 0) > day) { out.fitting.push(f); return; }
      out.list.push(a.n);
      KEYS.forEach(function (k) { if (a[k]) out[k] += a[k]; });
      if (a.river) out.river = a.river;
    });
    if (h.kind === 'caravan') { var w = num(d.wagons, 1), g = num(d.guards, 0); out.def += g >= w ? 2 : g > 0 ? 1 : 0; out.fight += g > 0 ? 1 : 0; }
    return out;
  }
  // Wagons are bought one at a time; their costs and takings follow the count.
  var WAGON = { price: 150, days: 3, driver: 6, guard: 10, feed: 3, profit: 50, min: 3 };
  // A ship in the king's pay: 3% of its price a month, more for a fighting ship.
  function crownPay(h) { return Math.round(hullPrice(h) * 0.03 * (1 + 0.1 * shipStats(h).fight)); }
  var RAID_ROLL = [[3, 0, 'Took a beating'], [8, 0, 'Nothing worth taking'], [14, 1.5, 'Took a prize'], [19, 2.5, 'A fat prize'], [99, 4, 'A treasure ship']];
  function cantSail(h) {
    var d = h.data || {};
    if (h.kind === 'airship' && !d.gnome) return 'Grounded: no gnome first mate or technician aboard.';
    if (shipStats(h).fitting.length) return 'In the yard: ' + shipStats(h).fitting.map(function (f) { return f.name.toLowerCase(); }).join(', ') + ' being fitted.';
    var tt = travel[h.campaign_id]; if (d.repair && num(d.repair.done, 0) > (tt ? tt.day : 0)) return 'In the yard for repairs.';
    var so = statOf(h); if (so && so.hp <= 0) return so.cond + ': needs ' + (h.kind === 'airship' ? 'dwarf shipwrights' : 'a yard') + ' before it can go anywhere.';
    if ((h.kind === 'ship' || h.kind === 'airship') && d.hull && !so) return 'Hull damaged: needs a dwarf shipwright' + (h.kind === 'ship' ? ' or a dry dock' : '') + ' before it can go out.';
    return '';
  }
  function baseIncome(h) {
    var d = h.data || {};
    if (h.kind === 'caravan') return num(d.wagons, 1) >= WAGON.min ? num(d.wagons, 1) * (d.wagon_profit != null ? Number(d.wagon_profit) : WAGON.profit) * Math.max(0, 1 + shipStats(h).profit) : 0;
    if (h.kind === 'siege') return 0;
    if (h.kind === 'ship' || h.kind === 'airship') return Number(d.income || 0) * (1 + shipStats(h).profit);
    if (!HOLD_LAND[h.kind]) return Number(d.income || 0);
    var inc = Number(d.income || 0) * wealthMul(d.wealth || 'Modest');
    if (!hasPeople(h)) return inc;
    inc += buildSum(h, 'inc');
    return inc * (TAX[d.tax || 'Normal'] || TAX.Normal).mul * folkOf(d.unrest).mul;
  }
  function tradeRoll(h, d20) {
    var tab = TRADE_ROLL[h.kind === 'caravan' ? 'caravan' : 'sea'], ss = shipStats(h), def = ss.def;
    if (ss.luck && d20 <= 3) d20 += ss.luck;
    if (def && d20 <= 5) d20 = Math.min(6, d20 + def);
    for (var i = 0; i < tab.length; i++) if (d20 <= tab[i][0]) return { mul: tab[i][1], label: tab[i][2] };
    return { mul: 1, label: 'Fair run' };
  }
  // Days for a mover to get from one place to another, using the travel map's routes when they're loaded.
  function holdTravelDays(h, from, to) {
    var t = travel[h.campaign_id]; if (!t || !from || !to) return null;
    var m = t.map_id ? mapById(t.map_id) : null; if (!m || !Number(m.miles_across)) return null;
    if (from.x === to.x && from.y === to.y) return 0;
    var r = rulesOf(t), t2 = Object.assign({}, t), v = vesselOf(h), speed;
    if (h.kind === 'caravan') {
      var wm = r.modes.filter(function (k) { return /wagon|cart|caravan/i.test(k); })[0] || r.modes[0];
      t2.mode = wm; t2.pace = r.paces.Normal != null ? 'Normal' : Object.keys(r.paces)[0];
      speed = Number(((r.speeds['Normal Road'] || {})[wm]) || 18);
    } else {
      if (!v) return null;
      t2.mode = v.name; t2.weather = 'Fair'; speed = Number(v.mi || 24);
    }
    var grid = grids[m.id], route = grid ? findRoute(m, grid, t2, from.x, from.y, to.x, to.y) : null;
    if (route) return Math.ceil(route.days - 0.02);
    return Math.ceil(mapDistance(m, from.x, from.y, to.x, to.y) / Math.max(1, speed));
  }
  function placeByLabel(campId, label) {
    var t = travel[campId]; if (!t || !t.map_id || !label) return null;
    return townsOn(t.map_id).filter(function (tw) { return tw.label === label; })[0] || null;
  }
  function holdPlaces(campId) {
    var t = travel[campId]; if (!t || !t.map_id) return [];
    return townsOn(t.map_id).map(function (tw) { return tw.label; }).filter(Boolean).sort();
  }
  function estateOf(campId) { return estates[campId] || { campaign_id: campId, treasury: 0, payday: null, ledger: [] }; }
  function paydayDue(campId) {
    var e = estates[campId], t = travel[campId];
    return !!(e && e.payday != null && t && t.day >= e.payday && holdingsFor(campId).length);
  }
  function saveHolding(h, patch, secret) {
    var d = Object.assign({}, h.data || {}, patch || {});
    unitsOf({ kind: h.kind, data: d }).concat(['crew']).forEach(function (u) {
      var l = secret && secret[u] != null ? secret[u] : loyOf(h, u);
      d[u === 'crew' ? 'mood' : 'gmood'] = MOOD[band(l)];
    });
    var ops = [sb.from('holdings').update({ name: h.name, data: d, owner_char: h.owner_char || null }).eq('id', h.id)];
    if (secret) ops.push(sb.from('holding_secrets').upsert({ holding_id: h.id, dm: Object.assign({}, holdSecrets[h.id] || {}, secret) }));
    return Promise.all(ops).then(function (res) {
      res.forEach(function (r) { if (r.error) throw r.error; });
      h.data = d; if (secret) holdSecrets[h.id] = Object.assign({}, holdSecrets[h.id] || {}, secret);
    });
  }

  function cofferOf(h) { return Math.round(Number((h.data || {}).coffer || 0) * 100) / 100; }
  function ownerName(h) { var c = h.owner_char ? charById(h.owner_char) : null; return c ? c.name + '’s' : h.owner_char ? 'Personal' : 'Party'; }
  function canTouch(h) { if (isDM()) return true; if (!h.owner_char) return true; var c = charById(h.owner_char); return !!(c && c.owner_id === uid()); }
  // Where you have to be to get at a holding's coffer. Null means they're there (or it's with them).
  function holdAway(h) {
    var st = holdMode(h), d = h.data || {}, t = travel[h.campaign_id];
    if (st.mode === 'party') return null;
    if (st.mode === 'trading' || st.mode === 'raiding' || st.mode === 'crown') return 'It’s away ' + ({ trading: 'trading', raiding: 'raiding', crown: 'in the king’s service' })[st.mode] + '. Call it home first.';
    if (st.mode === 'returning') return 'It’s on its way home.';
    var place = HOLD_LAND[h.kind] ? d.at : st.at;
    if (!place) return null;
    var here = '';
    if (t && t.map_id) { var pm = partyMarker(t.map_id), tw = pm ? nearTown(t.map_id, pm.x, pm.y) : null; here = tw ? tw.label : ''; }
    if (!here && t && t.arrival) here = t.arrival.label;
    return here === place ? null : 'You have to be at ' + place + ' to get at the coffer.';
  }
  function holdMoney(h, dir) {
    var box = document.getElementById('hc-' + h.id), amt = box ? Math.round(parseFloat(box.value) * 100) / 100 : NaN;
    if (!(amt > 0)) return toast('Enter an amount in gp.');
    var away = holdAway(h);
    if (away && !dmView()) return toast(away);
    var t = travel[h.campaign_id], day = t ? t.day : 0, delta = dir === 'out' ? amt : -amt;
    var c = h.owner_char ? charById(h.owner_char) : null;
    if (dir === 'out' && amt > cofferOf(h)) return toast('There’s only ' + gp(cofferOf(h)) + ' in the coffer.');
    if (dir === 'in' && c && walletCp(c.sheet) < amt * 100) return toast(c.name + ' doesn’t have ' + gp(amt) + '.');
    if (dir === 'in' && !h.owner_char && Number(estateOf(h.campaign_id).treasury || 0) < amt) return toast('The party treasury doesn’t have ' + gp(amt) + '.');
    sb.rpc('holding_collect', { hid: h.id, amount: delta, day: day }).then(function (r) {
      if (r.error) throw r.error;
      if (c) { setWallet(c.sheet, Math.max(0, walletCp(c.sheet) + delta * 100)); return sb.from('characters').update({ sheet: c.sheet }).eq('id', c.id); }
    }).then(function (r) {
      if (r && r.error) throw r.error;
      return loadHoldings();
    }).then(function () { toast((dir === 'out' ? 'Took ' : 'Put in ') + gp(amt) + (c ? (dir === 'out' ? ' for ' : ' from ') + c.name : dir === 'out' ? ' for the party' : ' from the party')); render(); })
      .catch(function (err) { fail(err, String(err && err.message || '').indexOf('Not') === 0 ? err.message : 'Could not move that money.'); });
  }
  function holdStatusText(h) {
    var d = h.data || {}, st = holdMode(h), t = travel[h.campaign_id], day = t ? t.day : 0, bits = [];
    if (HOLD_LAND[h.kind]) {
      bits.push((d.wealth || 'Modest') + (d.at ? ' · ' + d.at : ''));
    } else if (st.mode === 'party') bits.push('With the party');
    else if (st.mode === 'trading') bits.push('Out trading' + (d.port ? ' from ' + d.port : ''));
    else if (st.mode === 'raiding') bits.push('Out raiding under the king’s letter' + (d.port ? ', from ' + d.port : ''));
    else if (st.mode === 'crown') bits.push('In the king’s service' + (d.port ? ' out of ' + d.port : ''));
    else if (st.mode === 'building') { var lb = num(d.ready, day) - day; bits.push('Being built' + (d.yard ? ' at ' + d.yard : '') + ', ready in ' + lb + (lb === 1 ? ' day' : ' days')); }
    else if (st.mode === 'returning') { var left = num(d.ret_day, day) - day; bits.push('Coming home to ' + (d.ret_to || 'port') + ', ' + left + (left === 1 ? ' day' : ' days')); }
    else if (st.mode === 'moored' && h.kind === 'siege') bits.push('Stationed at ' + (st.at || '?') + ' (adds its defense there)');
    else if (st.mode === 'moored') bits.push('Moored at ' + (st.at || 'port') + (st.free ? ' (own holding, free)' : ''));
    if (h.kind === 'ship' || h.kind === 'airship') bits.unshift(d.vessel || (h.kind === 'airship' ? 'Airship' : 'Ship'));
    else if (h.kind === 'siege') bits.unshift(vesselName(h));
    else if (h.kind === 'caravan') bits.unshift(num(d.wagons, 1) + (num(d.wagons, 1) === 1 ? ' wagon' : ' wagons') + (num(d.guards, 0) ? ', ' + num(d.guards, 0) + ' guards' : ''));
    else bits.unshift(HOLD_LABEL[h.kind]);
    return bits.join(' · ');
  }
  function holdMonthLine(h) {
    var d = h.data || {}, st = holdMode(h), parts = [];
    var inc = baseIncome(h);
    if (HOLD_LAND[h.kind]) parts.push('Earns ~' + gp(Math.round(inc)));
    else if (h.kind === 'vassal') parts.push('Pays ~' + gp(inc) + ' in dues');
    else if (st.mode === 'trading') parts.push(inc ? 'Trades for ~' + gp(Math.round(inc)) + ' on a fair run' : 'Too few wagons to trade (' + WAGON.min + ' needed)');
    else if (st.mode === 'raiding') parts.push('Raids: anything from a beating to ~' + gp(Math.round(Number(d.income || 0) * 4)));
    else if (st.mode === 'crown') parts.push('The crown pays ' + gp(crownPay(h)));
    var wages = unitsOf(h).reduce(function (s, u) { return s + unitWages(h, u); }, 0);
    if (wages || h.kind !== 'vassal') parts.push('Wages ' + gp(wages));
    if (upkeepOf(h)) parts.push('Upkeep ' + gp(upkeepOf(h)));
    if (HOLD_MOVES[h.kind] && st.mode === 'moored' && !st.free && holdMoorRate(h) > 0) parts.push('Mooring ' + gp(holdMoorRate(h)) + '/day');
    return parts.join(' · ') + ' a month';
  }
  function holdMoorRate(h) { var d = h.data || {}; if (shipStats(h).freeMoor) return 0; return Number(d.moor != null ? d.moor : (HOLD_DEF[h.kind] || {}).moor || 0); }

  function renderHoldings(slug) {
    if (!loaded.wiki) { $view.innerHTML = '<div class="page"><div class="empty">Opening the archive…</div></div>'; return; }
    var camp = campaignBySlug(slug);
    if (!camp || !(isDM() || myCampaigns().indexOf(camp) >= 0)) { location.replace('#/wiki'); return; }
    if (!loaded.holdings) { loadHoldings().then(render).catch(function (e) { fail(e); }); $view.innerHTML = '<div class="page"><div class="empty">Loading holdings…</div></div>'; return; }
    var t = travel[camp.id];
    if (t && t.map_id && (!markers[t.map_id] || grids[t.map_id] === undefined)) { ensureTravelMarkers(t).then(render).catch(function (e) { fail(e); }); $view.innerHTML = '<div class="page"><div class="empty">Loading holdings…</div></div>'; return; }
    var dm = dmView(), e = estateOf(camp.id), list = holdingsFor(camp.id), day = t ? t.day : 0;
    var html = '<section class="hero"><div class="hero-in"><p class="crumbs"><a href="#/wiki">Avarenth</a> › <a href="#/campaign/' + encodeURIComponent(camp.slug) + '">' + esc(camp.name) + '</a></p><h1>Holdings</h1></div></section><div class="page">';
    var due = paydayDue(camp.id), left = e.payday != null ? e.payday - day : null;
    html += '<section class="block"><h2 class="sec-title">Party treasury<small>' + (e.payday == null ? 'No payday set' : due ? 'Payday is due' : 'Payday in ' + left + (left === 1 ? ' day' : ' days')) + '</small></h2>' +
      '<div class="vitals sum">' + vital('Treasury', gp(e.treasury)) + vital('Holdings', list.length) + vital('Next payday', e.payday == null ? '—' : 'Day ' + e.payday) + '</div>' +
      (Number(e.treasury) < 0 ? '<p class="err" style="margin:0">In debt.</p>' : '');
    if (dm) html += '<form class="two" id="estate-form" novalidate data-camp="' + esc(camp.id) + '" style="align-items:end">' +
      '<div class="field"><label for="es-amt">Put in (+) or take out (−), gp</label><input type="number" id="es-amt" step="1" inputmode="decimal" placeholder="e.g. 500 or -120"></div>' +
      '<div class="field"><label for="es-note">What for</label><input type="text" id="es-note" maxlength="80" placeholder="e.g. Loot from the wreck"></div>' +
      '<div class="field"><button type="submit" class="btn">Update treasury</button></div></form>';
    html += '</section>';

    if (dm && due) html += paydayHtml(camp, list);

    var gar = 0, lev = 0, vas = 0;
    list.forEach(function (h) { var d = h.data || {}; if (hasPeople(h)) { gar += num(d.soldiers, 0); lev += d.levy ? num(d.levy.n, 0) : 0; } if (h.kind === 'vassal') vas += num(d.soldiers, 0); });
    if (gar + lev + vas) html += '<section class="block"><h2 class="sec-title">Forces<small>' + (gar + lev + vas) + ' in all</small></h2><div class="vitals sum">' + vital('Garrisons', gar) + vital('Levies', lev) + vital('Vassals can bring', vas) + '</div></section>';
    html += '<section class="block"><h2 class="sec-title">What they own<small>' + list.length + '</small></h2>';
    if (!list.length) html += '<div class="empty">' + (dm ? 'Nothing yet. Add a ship, caravan, manor, castle, lordship or workshop when the party gets one.' : 'Nothing you can see is owned yet.') + '</div>';
    list.forEach(function (h) { html += ui.holdEdit === h.id && dm ? holdFormHtml(camp, h) : holdCardHtml(camp, h); });
    if (dm) {
      if (ui.holdEdit === 'new') html += holdFormHtml(camp, null);
      else html += '<div class="actions"><button type="button" class="btn" data-act="hold-new">+ Add a holding</button></div>';
    }
    html += '</section>';

    var ledger = (e.ledger || []).filter(function (l) { return dm || !l.dm; }).slice(-15).reverse();
    html += '<section class="block"><h2 class="sec-title">Ledger<small>' + (e.ledger || []).length + ' entries</small></h2>' +
      (ledger.length ? '<div class="tbl">' + ledger.map(function (l) {
        return '<div class="tbl-row"><div class="main"><b>Day ' + esc(l.day) + ' · ' + esc(l.text) + '</b>' + ((l.lines || []).length ? '<span>' + esc(l.lines.join(' · ')) + '</span>' : '') + '</div>' + (l.dm ? '' : '<span class="tag ' + (Number(l.amt) < 0 ? 'tier-bad' : 'ok') + '">' + (Number(l.amt) >= 0 ? '+' : '') + esc(gp(l.amt)) + '</span>') + '</div>';
      }).join('') + '</div>' : '<div class="empty">Nothing recorded yet.</div>') + '</section>';
    html += '<p class="note">' + (dm ? 'Loyalty numbers are only shown to you. Players see the mood. Wages buy steadiness; deeds buy devotion.' : 'Crews and households have moods. Keep them paid and treat them well.') + '</p></div>';
    $view.innerHTML = html;
  }

  function holdCardHtml(camp, h) {
    var dm = dmView(), d = h.data || {}, st = holdMode(h), warn = cantSail(h);
    var moods = unitsOf(h).map(function (u) {
      var word = dm ? MOOD[band(loyOf(h, u))] : (u === 'crew' ? d.mood : d.gmood) || 'Content', uu = unitOf(h, u);
      var crewN = u === 'garrison' ? num(d.soldiers, 0) : num(d.crew, 0);
      return '<div class="tbl-row"><div class="main"><b>' + esc(unitName(h, u)) + (crewN ? ' of ' + crewN : '') + '</b><span>' +
        esc([dm ? 'Loyalty ' + loyOf(h, u) + '/10 (' + band(loyOf(h, u)) + ')' : '', uu.owed ? 'Owed ' + gp(uu.owed) + ' (' + uu.missed + ' missed)' : 'Paid up'].filter(Boolean).join(' · ')) + '</span></div>' +
        moodTag(word) + (dm ? '<button type="button" class="btn small quiet" data-act="hold-loy" data-id="' + esc(h.id) + '" data-unit="' + u + '" data-d="-1" aria-label="Lower loyalty">−</button><button type="button" class="btn small quiet" data-act="hold-loy" data-id="' + esc(h.id) + '" data-unit="' + u + '" data-d="1" aria-label="Raise loyalty">+</button>' : '') + '</div>';
    }).join('');
    var html = '<div class="group-box" style="margin-bottom:12px"><h2 style="margin-top:0">' + esc(h.name || HOLD_LABEL[h.kind]) + '</h2>' +
      '<p class="note" style="margin:0 0 6px">' + esc(holdStatusText(h)) + '</p>' +
      '<p class="note" style="margin:0 0 6px">' + esc(holdMonthLine(h)) + '</p>' +
      (warn ? '<p class="err" style="margin:0 0 6px">' + esc(warn) + '</p>' : '') + statHtml(h) + fitHtml(h) +
      '<div class="vitals sum">' + vital('Owner', ownerName(h).replace(/’s$/, '')) + vital('Coffer', gp(cofferOf(h))) + '</div>' + landHtml(h) +
      (HOLD_LAND[h.kind] && dm ? '<p class="note" style="margin:0 0 6px">Prosperity ' + (num(d.prosper, 0) > 0 ? '+' : '') + num(d.prosper, 0) + ' of ±3 toward the next step.</p>' : '') +
      '<div class="tbl">' + moods + '</div>' + (d.notes ? '<p class="note">' + esc(d.notes) + '</p>' : '');
    var reps = (d.reports || []).slice().reverse();
    if (reps.length) html += '<div class="report"><p class="note" style="margin:8px 0 2px"><b>Latest report, day ' + esc(reps[0].day) + '</b></p><p class="note" style="margin:0">' + esc((reps[0].text || []).join(' ')) + '</p>' +
      (reps.length > 1 ? '<details><summary class="note">Earlier reports</summary>' + reps.slice(1).map(function (rp) { return '<p class="note" style="margin:6px 0 0"><b>Day ' + esc(rp.day) + ':</b> ' + esc((rp.text || []).join(' ')) + '</p>'; }).join('') + '</details>' : '') + '</div>';
    if (canTouch(h)) {
      var away = holdAway(h);
      html += '<div class="actions tight" style="flex-wrap:wrap;align-items:center"><input class="input mini" type="number" min="0" step="1" inputmode="decimal" id="hc-' + esc(h.id) + '" placeholder="gp" aria-label="Amount for ' + esc(h.name) + '">' +
        '<button type="button" class="btn small" data-act="hold-cash" data-dir="out" data-id="' + esc(h.id) + '"' + (away && !dm ? ' disabled' : '') + '>Collect</button>' +
        '<button type="button" class="btn small" data-act="hold-cash" data-dir="in" data-id="' + esc(h.id) + '"' + (away && !dm ? ' disabled' : '') + '>Put in</button></div>' +
        (away ? '<p class="note" style="margin:0">' + esc(away) + (dm ? ' (You can still move it as DM.)' : '') + '</p>' : '');
    }
    if (dm) {
      var acts = [];
      if (HOLD_MOVES[h.kind] && st.mode !== 'building') {
        var places = holdPlaces(camp.id), pick = '<select class="input rar-sel" id="hp-' + esc(h.id) + '" aria-label="Where">' + places.map(function (p) { return '<option' + (p === (d.at || d.port) ? ' selected' : '') + '>' + esc(p) + '</option>'; }).join('') + '</select>';
        if (st.mode === 'party' || st.mode === 'moored') {
          if (!warn && h.kind !== 'siege') acts.push('<button type="button" class="btn small" data-act="hold-mode" data-id="' + esc(h.id) + '" data-mode="trading">Send trading from…</button>');
          if (!warn && d.marque) acts.push('<button type="button" class="btn small" data-act="hold-mode" data-id="' + esc(h.id) + '" data-mode="raiding">Send raiding from…</button>');
          if (!warn && d.commission) acts.push('<button type="button" class="btn small" data-act="hold-mode" data-id="' + esc(h.id) + '" data-mode="crown">Into the king’s service at…</button>');
          if (st.mode === 'party') acts.push('<button type="button" class="btn small" data-act="hold-mode" data-id="' + esc(h.id) + '" data-mode="moored">' + (h.kind === 'caravan' ? 'Stable at…' : h.kind === 'siege' ? 'Station at…' : 'Moor at…') + '</button>');
          else acts.push('<button type="button" class="btn small" data-act="hold-mode" data-id="' + esc(h.id) + '" data-mode="party">Rejoin the party</button>');
        } else if (st.mode === 'trading' || st.mode === 'raiding' || st.mode === 'crown') acts.push('<button type="button" class="btn small" data-act="hold-mode" data-id="' + esc(h.id) + '" data-mode="recall">Call home to…</button>');
        else if (st.mode === 'returning') acts.push('<span class="note">On its way.</span>');
        if (places.length && st.mode !== 'returning') acts.unshift('<label class="note" style="display:flex;gap:6px;align-items:center">' + pick + '<span><input type="checkbox" id="hf-' + esc(h.id) + '"> Our holding (free)</span></label>');
      }
      acts.push('<button type="button" class="btn small quiet" data-act="hold-edit" data-id="' + esc(h.id) + '">Edit</button>');
      html += '<div class="actions tight" style="flex-wrap:wrap">' + acts.join('') + '</div>';
    }
    return html + '</div>';
  }

  /* Stat blocks for running vehicles in ordinary combat: one hull, with AC, hit points and a damage threshold
     (a hit that deals less than the threshold does nothing). Weapons fitted to it become its attacks. */
  var STATS = {
    'Rowboat': { ac: 11, hp: 50, dt: 0 }, 'River barge': { ac: 13, hp: 100, dt: 10 }, 'Cog': { ac: 14, hp: 250, dt: 15 },
    'Sailing ship': { ac: 15, hp: 300, dt: 15 }, 'Galley': { ac: 15, hp: 500, dt: 20 }, 'Airship': { ac: 13, hp: 300, dt: 15 },
    wagon: { ac: 12, hp: 50, dt: 0 }, warwagon: { ac: 15, hp: 80, dt: 10 },
    'Battering ram': { ac: 15, hp: 100, dt: 10, atk: { n: 'Ram', hit: 8, dmg: '3d10 bludgeoning', range: 'reach 5 ft.', note: 'Against gates and doors' } },
    'Siege tower': { ac: 15, hp: 200, dt: 10, atk: null, note: 'Carries 20 up to the wall top under cover' },
    'Catapult': { ac: 15, hp: 100, dt: 10, atk: { n: 'Stone', hit: 5, dmg: '4d10 bludgeoning', dice: 4, range: '150/600 ft.' } },
    'Mangonel': { ac: 15, hp: 100, dt: 10, atk: { n: 'Stone', hit: 5, dmg: '5d10 bludgeoning', dice: 5, range: '200/800 ft. (not within 60 ft.)' } },
    'Trebuchet': { ac: 15, hp: 150, dt: 10, atk: { n: 'Great stone', hit: 5, dmg: '8d10 bludgeoning', dice: 8, range: '300/1,200 ft. (not within 60 ft.)' } },
    'Ballista cart': { ac: 15, hp: 50, dt: 10, atk: { n: 'Bolt', hit: 6, dmg: '3d10 piercing', range: '120/480 ft.' } }
  };
  var WEAPON_ATK = {
    'Ballista': { hit: 6, dmg: '3d10 piercing', range: '120/480 ft.', crew: 3 },
    'Scorpions': { hit: 5, dmg: '2d10 piercing', range: '100/400 ft.', crew: 2, note: 'Two shots a round at anyone boarding' },
    'Fire pots': { hit: 4, dmg: '2d6 fire', range: '60 ft.', crew: 2, note: 'Sets the target alight: 1d6 fire each round until put out' },
    'Ram': { hit: 8, dmg: '4d10 bludgeoning', range: 'ramming', crew: 0, note: 'Ignores the damage threshold. The rammer takes half' }
  };
  var HULL_BONUS = { 'Reinforced hull': { ac: 1, hp: 0.2 }, 'Armoured gondola': { ac: 2 }, 'War wagons': {}, 'Hide covering': { note: 'Fire can’t take hold' }, 'Copper sheathing': { note: '+1 AC against rams' } };
  function statOf(h) {
    var d = h.data || {}, v = vesselName(h), base = h.kind === 'caravan' ? (fitIn(h, 'body') === 'War wagons' ? STATS.warwagon : STATS.wagon) : STATS[v];
    if (!base) return null;
    var st = shipStats(h), ac = base.ac, hpMul = 1, notes = [], atks = [];
    st.list.forEach(function (n) { var b = HULL_BONUS[n]; if (!b) return; ac += b.ac || 0; hpMul += b.hp || 0; if (b.note) notes.push(b.note); });
    var each = Math.round(base.hp * hpMul), max = h.kind === 'caravan' ? each * num(d.wagons, 1) : each;
    if (base.atk) {
      var a = Object.assign({}, base.atk), extra = st.attack - ((SIEGE[v] || {}).attack || 0) - (st.list.indexOf('Trained engineers') >= 0 ? 1 : 0);
      if (a.dice && extra > 0) a.dmg = (a.dice + extra) + 'd10 bludgeoning';
      else if (v === 'Battering ram' && extra > 0) a.dmg = (3 + extra) + 'd10 bludgeoning';
      if (st.list.indexOf('Trained engineers') >= 0) a.hit += 2;
      atks.push(a);
    }
    (d.fits || []).forEach(function (f) {
      var w = WEAPON_ATK[f.name]; if (!w || st.list.indexOf(f.name) < 0) return;
      atks.push(Object.assign({ n: f.name }, w));
    });
    if (base.note) notes.push(base.note);
    var hp = d.hp == null ? max : Math.max(0, Math.min(max, num(d.hp, max)));
    return { ac: ac, max: max, each: each, hp: hp, dt: base.dt, atks: atks, notes: notes, cond: condOf(h, hp, max) };
  }
  function condOf(h, hp, max) {
    if (hp <= 0) return h.kind === 'ship' ? 'Sinking' : h.kind === 'airship' ? 'Crashed' : 'Wrecked';
    return hp < max * 0.25 ? 'Crippled' : hp < max * 0.75 ? 'Damaged' : 'Sound';
  }
  // How much a crew can patch in a day of rest, and how far. Dwarf hull-wrights aboard an airship mend it fully, and twice as fast.
  function patchOf(h) {
    var s = statOf(h); if (!s) return null;
    var dw = h.kind === 'airship' && (h.data || {}).dwarves;
    return { per: Math.max(1, Math.round(s.max * (dw ? 0.2 : 0.1))), cap: dw ? s.max : Math.round(s.max * 0.75), dwarves: dw };
  }
  function repairCost(h) { var s = statOf(h); if (!s || s.hp >= s.max) return { gp: 0, days: 0 }; var miss = s.max - s.hp; return { gp: Math.round(hullPrice(h) / s.max * miss * 0.5), days: Math.max(1, Math.ceil(miss / (s.max / 10))) }; }
  function statHtml(h) {
    var s = statOf(h); if (!s) return '';
    var dm = dmView(), d = h.data || {}, t = travel[h.campaign_id], day = t ? t.day : 0;
    var html = '<div class="tbl" style="margin-bottom:6px"><div class="tbl-row" style="flex-wrap:wrap"><div class="main"><b>AC ' + s.ac + ' · HP ' + s.hp + '/' + s.max + (s.dt ? ' · Threshold ' + s.dt : '') + '</b><span>' +
      esc((h.kind === 'caravan' ? 'Each wagon AC ' + s.ac + ', ' + s.each + ' HP. ' : '') + (s.notes.length ? s.notes.join('. ') + '.' : '')) + '</span></div><span class="tag ' + ({ Sound: 'tier-good', Damaged: 'warn', Crippled: 'tier-bad' })[s.cond] + (s.hp <= 0 ? ' tier-disaster' : '') + '">' + esc(s.cond) + '</span></div>';
    s.atks.forEach(function (a) {
      html += '<div class="tbl-row"><div class="main"><b>' + esc(a.n) + '</b><span>' + esc('+' + a.hit + ' to hit, ' + a.range + ', ' + a.dmg + (a.crew ? '. Crew ' + a.crew : '') + (a.note ? '. ' + a.note : '')) + '</span></div></div>';
    });
    html += '</div>';
    if (d.repair && num(d.repair.done, 0) > day) html += '<p class="note" style="margin:0 0 6px">In the yard for repairs, done in ' + (num(d.repair.done, 0) - day) + ' days.</p>';
    if (dm) {
      var pt = patchOf(h), rc = repairCost(h);
      html += '<div class="actions tight" style="flex-wrap:wrap;align-items:center"><input class="input mini" type="number" min="1" step="1" inputmode="numeric" id="hhp-' + esc(h.id) + '" placeholder="HP" aria-label="Hit points">' +
        '<button type="button" class="btn small" data-act="hold-hp" data-dir="-1" data-id="' + esc(h.id) + '">Damage</button><button type="button" class="btn small" data-act="hold-hp" data-dir="1" data-id="' + esc(h.id) + '">Heal</button>' +
        (s.hp < pt.cap ? '<button type="button" class="btn small quiet" data-act="hold-patch" data-id="' + esc(h.id) + '">Crew patch a day (+' + Math.min(pt.per, pt.cap - s.hp) + ')</button>' : '') +
        (rc.gp ? '<button type="button" class="btn small quiet" data-act="hold-repair" data-id="' + esc(h.id) + '">' + (h.kind === 'airship' ? 'Dwarf shipwrights' : 'Yard') + ' repair: ' + gp(rc.gp) + ', ' + rc.days + 'd</button>' : '') + '</div>' +
        '<p class="note" style="margin:0 0 6px">The crew can patch ' + pt.per + ' HP a day at rest, up to ' + (pt.dwarves ? 'full' : 'three-quarters') + '.' + (h.kind === 'airship' && !pt.dwarves ? ' Trained dwarves aboard would mend it fully, twice as fast.' : '') + ' Past that it needs a yard.</p>';
    }
    return html;
  }
  function holdHp(h, mode) {
    var s = statOf(h); if (!s) return;
    var t = travel[h.campaign_id], day = t ? t.day : 0, patch = {}, msg;
    if (mode === 'patch') { var pt = patchOf(h); patch.hp = Math.min(pt.cap, s.hp + pt.per); msg = h.name + ' patched to ' + patch.hp + ' HP'; }
    else if (mode === 'repair') {
      var rc = repairCost(h), pel = document.getElementById('hfitpay-' + h.id), pay = pel ? pel.checked : true;
      if (pay && cofferOf(h) < rc.gp) return toast('The coffer needs ' + gp(rc.gp) + ' for that.');
      patch.hp = s.max; patch.repair = { done: day + rc.days, gp: rc.gp }; if (pay) patch.coffer = cofferOf(h) - rc.gp;
      msg = h.name + ' goes in for repairs: ' + rc.days + ' days';
    } else {
      var n = num((document.getElementById('hhp-' + h.id) || {}).value, 0); if (n < 1) return toast('How many HP?');
      if (mode < 0 && s.dt && n < s.dt) return toast('Under the damage threshold (' + s.dt + '): no effect.');
      patch.hp = Math.max(0, Math.min(s.max, s.hp + mode * n));
      msg = h.name + ': ' + patch.hp + '/' + s.max + ' HP, ' + condOf(h, patch.hp, s.max).toLowerCase();
    }
    saveHolding(h, patch).then(function () { toast(msg); render(); }).catch(function (e) { fail(e); });
  }
  // Hit the hull for a share of its max HP (trade disasters, raids gone wrong). Returns a line for the report.
  function hullHit(h, d, share) {
    var s = statOf({ kind: h.kind, campaign_id: h.campaign_id, data: d }); if (!s) return '';
    var lost = Math.round(s.max * share); d.hp = Math.max(0, s.hp - lost);
    return ' The hull took ' + lost + ' damage (' + d.hp + '/' + s.max + ' HP).';
  }
  function fitHtml(h) {
    if (!SLOTS[h.kind]) return '';
    var d = h.data || {}, st = shipStats(h), t = travel[h.campaign_id], day = t ? t.day : 0, bits = [], dm = dmView();
    if (st.speed) bits.push((st.speed > 0 ? '+' : '') + Math.round(st.speed * 100) + '% speed');
    if (st.profit) bits.push((st.profit > 0 ? '+' : '') + Math.round(st.profit * 100) + '% profit');
    if (st.ceiling) bits.push('ceiling +' + st.ceiling + ' m');
    if (st.storm) bits.push('flies in storms');
    if (st.marines) bits.push(Math.round(num(d.crew, 0) * st.marines) + ' marines');
    if (h.kind === 'siege') { var se = SIEGE[vesselName(h)] || {}; bits.push('attack ' + st.attack); bits.push(se.mi ? 'hauled ' + se.mi + ' mi a day' : 'built where it stands'); }
    if (st.def) bits.push('defense ' + st.def);
    if (st.fight) bits.push('fight ' + st.fight);
    var royal = [d.marque ? 'letter of marque' : '', d.commission ? 'king’s commission' : ''].filter(Boolean);
    var html = '<p class="note" style="margin:0 0 6px">' + (st.cls ? '<b>' + esc(st.cls) + '.</b> ' : '') + (bits.length ? esc(bits.join(' · ')) + '. ' : '') + (royal.length ? 'Holds a ' + esc(royal.join(' and a ')) + '.' : '') + '</p>';
    var fits = d.fits || [], rows = [];
    slotsOf(h).forEach(function (slot) {
      var here = fits.filter(function (f) { return (ATT[f.name] || {}).slot === slot; });
      var cap = slot === 'weapon' ? mountsOf(h) : 1;
      if (!cap) return;
      var label = SLOT_NAMES[slot] + (slot === 'weapon' ? ' (' + here.length + ' of ' + cap + ')' : '');
      var have = here.map(function (f) { var l = num(f.done, 0) - day; return esc(f.name) + (l > 0 ? ' <span class="note">(' + l + (l === 1 ? ' day' : ' days') + ')</span>' : '') + (dm ? ' <button type="button" class="btn small quiet" data-act="hold-unfit" data-id="' + esc(h.id) + '" data-name="' + esc(f.name) + '" aria-label="Strip ' + esc(f.name) + '">✕</button>' : ''); }).join(', ');
      var pick = '';
      if (dm && here.length < cap) {
        var opts = ATTACH.filter(function (a) { return a.slot === slot && attachFits(h, a) && !(a.one && here.some(function (f) { return f.name === a.n; })); });
        if (opts.length) pick = '<select class="input" style="flex:1 1 160px;min-width:0;max-width:100%" id="hfit-' + esc(h.id) + '-' + slot + '" aria-label="' + esc(SLOT_NAMES[slot]) + '">' + opts.map(function (a) { return '<option value="' + esc(a.n) + '">' + esc(a.n + ' · ' + (attachCost(h, a) ? attachCost(h, a).toLocaleString() + ' gp' : 'swap') + ' · ' + a.days + 'd · ' + a.what) + '</option>'; }).join('') + '</select><button type="button" class="btn small" data-act="hold-fit" data-id="' + esc(h.id) + '" data-slot="' + slot + '">Fit</button>';
      }
      if (!have && !pick) return;
      rows.push('<div class="tbl-row" style="flex-wrap:wrap;gap:6px"><div class="main" style="flex:1 1 100%"><b>' + esc(label) + '</b><span>' + (have || 'Empty') + '</span></div>' + pick + '</div>');
    });
    if (rows.length) html += '<div class="tbl" style="margin-bottom:6px">' + rows.join('') + '</div>' + (dm ? '<label class="note"><input type="checkbox" id="hfitpay-' + esc(h.id) + '" checked> Pay for fittings from the coffer</label>' : '');
    return html;
  }
  function holdFit(h, slot, strip) {
    var d = h.data || {}, fits = (d.fits || []).slice(), t = travel[h.campaign_id], day = t ? t.day : 0, patch = {};
    if (strip) {
      fits = fits.filter(function (f, i) { return !(f.name === strip && i === fits.map(function (x) { return x.name; }).lastIndexOf(strip)); });
      return saveHolding(h, { fits: fits }).then(function () { toast(strip + ' stripped from ' + h.name); render(); }).catch(function (e) { fail(e); });
    }
    var name = (document.getElementById('hfit-' + h.id + '-' + slot) || {}).value, a = ATT[name]; if (!a) return;
    var cost = attachCost(h, a), pay = (document.getElementById('hfitpay-' + h.id) || {}).checked;
    if (pay && cofferOf(h) < cost) return toast('The coffer needs ' + gp(cost) + ' for that.');
    fits.push({ name: a.n, start: day, done: day + a.days, cost: cost });
    patch.fits = fits; if (pay && cost) patch.coffer = cofferOf(h) - cost;
    saveHolding(h, patch).then(function () { toast(a.n + ' going onto ' + h.name + ', ready in ' + a.days + (a.days === 1 ? ' day' : ' days')); render(); }).catch(function (e) { fail(e); });
  }
  function fealtyHtml(h) {
    var d = h.data || {}, html = '', dm = dmView(), touch = canTouch(h);
    if (h.kind === 'vassal') {
      var lh = d.liege_hid ? holdingById(d.liege_hid) : null;
      return '<p class="note" style="margin:6px 0">Sworn to ' + esc(lh ? lh.name : 'you') + (d.at ? ' · seat at ' + esc(d.at) : '') + ' · can bring ' + num(d.soldiers, 0) + ' soldiers.</p>';
    }
    if (d.liege) {
      html += '<div class="tbl"><div class="tbl-row"><div class="main"><b>Holds it from ' + esc(d.liege) + '</b><span>' + esc(num(d.dues, 10) + '% of income in dues' + (Number(d.dues_owed || 0) ? ' · owes ' + gp(d.dues_owed) : '')) + '</span></div>' + favorTag(d.favor) + '</div></div>';
      if (d.call) {
        html += '<p class="err" style="margin:6px 0 0">' + esc(d.liege) + ' calls for ' + d.call.n + ' soldiers. Answer before payday or lose standing.</p>';
        if (touch) html += '<div class="actions tight" style="flex-wrap:wrap"><button type="button" class="btn small" data-act="hold-answer" data-id="' + esc(h.id) + '">Send them</button><button type="button" class="btn small" data-act="hold-scutage" data-id="' + esc(h.id) + '">Pay shield money (' + gp(d.call.n * SCUTAGE) + ')</button></div>';
      } else if (d.answered) html += '<p class="note" style="margin:6px 0 0">' + esc(d.answered.how === 'sent' ? d.answered.n + ' soldiers sent to ' + d.liege + '.' : 'Shield money paid to ' + d.liege + '.') + '</p>';
      if (dm && !d.call) html += '<div class="actions tight" style="align-items:center"><input class="input mini" type="number" min="1" step="1" inputmode="numeric" id="hcall-' + esc(h.id) + '" placeholder="men" aria-label="Soldiers called for"><button type="button" class="btn small quiet" data-act="hold-call" data-id="' + esc(h.id) + '">Liege calls for soldiers</button></div>';
    }
    var cap = Math.floor(num(d.pop, POP_DEF[h.kind]) * 0.1);
    if (d.levy) html += '<p class="note" style="margin:6px 0 0"><b>' + num(d.levy.n, 0) + ' levied folk under arms</b> since day ' + esc(d.levy.day) + '. They cost ' + LEVY_FEED + ' gp each a month to feed, the fields go short of hands, and the folk resent it.</p>';
    if (touch) html += '<div class="actions tight" style="align-items:center;flex-wrap:wrap">' + (d.levy ? '<button type="button" class="btn small" data-act="hold-disband" data-id="' + esc(h.id) + '">Send the levy home</button>' :
      '<input class="input mini" type="number" min="1" max="' + cap + '" step="1" inputmode="numeric" id="hlevy-' + esc(h.id) + '" placeholder="up to ' + cap + '" aria-label="How many to levy"><button type="button" class="btn small" data-act="hold-levy" data-id="' + esc(h.id) + '">Raise a levy</button>') + '</div>';
    return html;
  }
  function landHtml(h) {
    if (h.kind === 'vassal') return fealtyHtml(h);
    if (!hasPeople(h)) return '';
    var d = h.data || {}, t = travel[h.campaign_id], day = t ? t.day : 0, built = Object.keys(builtOf(h));
    var going = (d.projects || []).filter(function (p) { return num(p.done, 0) > day; });
    var html = '<p class="note" style="margin:6px 0"><b>' + esc(titleOf(h)) + '</b>' + (d.gained ? ' · ' + esc(d.gained) : '') + '</p>' +
      '<div class="tbl"><div class="tbl-row"><div class="main"><b>The folk</b><span>' + esc(num(d.pop, POP_DEF[h.kind]).toLocaleString() + ' people · ' + (d.tax || 'Normal') + ' tax · defense ' + defenseOf(h) + (dmView() ? ' · unrest ' + num(d.unrest, 2) + '/10' : '')) + '</span></div>' + folkTag(d.unrest) + '</div></div>';
    html += '<p class="note" style="margin:6px 0 0">' + (built.length ? 'Standing: ' + esc(built.join(', ')) + '.' : 'Nothing built yet.') +
      (going.length ? ' Being built: ' + esc(going.map(function (p) { var l = num(p.done, 0) - day; return p.name + ' (' + l + (l === 1 ? ' day' : ' days') + ')'; }).join(', ')) + '.' : '') + '</p>';
    if (canTouch(h)) {
      var can = BUILDINGS.filter(function (b) { return built.indexOf(b.n) < 0 && !going.some(function (p) { return p.name === b.n; }); });
      html += '<div class="actions tight" style="flex-wrap:wrap;align-items:center;margin-top:6px">' +
        '<select class="input rar-sel" id="htax-' + esc(h.id) + '" aria-label="Tax rate">' + Object.keys(TAX).map(function (k) { return '<option' + (k === (d.tax || 'Normal') ? ' selected' : '') + '>' + k + '</option>'; }).join('') + '</select>' +
        '<button type="button" class="btn small" data-act="hold-tax" data-id="' + esc(h.id) + '">Set tax</button>' +
        (can.length ? '<select class="input rar-sel" id="hbuild-' + esc(h.id) + '" aria-label="Build">' + can.map(function (b) { return '<option value="' + esc(b.n) + '">' + esc(b.n + ' · ' + b.cost.toLocaleString() + ' gp · ' + b.days + ' days') + '</option>'; }).join('') + '</select>' +
          '<button type="button" class="btn small" data-act="hold-build" data-id="' + esc(h.id) + '">Build</button>' : '') + '</div>' +
        '<p class="note" style="margin:4px 0 0">Orders go by letter, so you don’t have to be there. Building is paid from the coffer up front. Low tax eases the folk, high tax angers them.</p>';
    }
    return html + fealtyHtml(h);
  }
  function holdOrder(h, what) {
    var el = document.getElementById(({ tax: 'htax-', build: 'hbuild-', levy: 'hlevy-' })[what] + h.id), arg = el ? el.value : what;
    if (!arg) return toast(what === 'levy' ? 'How many?' : 'Pick one first.');
    if (what === 'call') {
      var cn = num((document.getElementById('hcall-' + h.id) || {}).value, 0);
      if (cn < 1) return toast('How many soldiers does the liege want?');
      return saveHolding(h, { call: { n: cn, day: (travel[h.campaign_id] || {}).day || 0 } }).then(function () { toast((h.data.liege || 'The liege') + ' calls for ' + cn + ' soldiers'); render(); }).catch(function (err) { fail(err); });
    }
    var t = travel[h.campaign_id], day = t ? t.day : 0;
    if (what === 'build' && BUILD[arg] && cofferOf(h) < BUILD[arg].cost) return toast('The coffer needs ' + gp(BUILD[arg].cost) + ' for that.');
    sb.rpc('holding_order', { hid: h.id, what: what, arg: arg, day: day }).then(function (r) {
      if (r.error) throw r.error;
      return loadHoldings();
    }).then(function () { toast(({ tax: h.name + ': tax set to ' + String(arg).toLowerCase(), build: 'Work on the ' + String(arg).toLowerCase() + ' at ' + h.name + ' has begun', levy: arg + ' folk levied at ' + h.name, disband: 'The levy at ' + h.name + ' goes home', answer: 'Soldiers sent to ' + (h.data.liege || 'the liege'), scutage: 'Shield money paid' })[what]); render(); })
      .catch(function (err) { fail(err, String(err && err.message || '').indexOf('Not') === 0 ? err.message : 'Could not send that order.'); });
  }
  function holdFormHtml(camp, h) {
    var isNew = !h, kind = h ? h.kind : (ui.holdKind || 'ship'), d = h ? h.data || {} : {}, t = travel[camp.id], r = t ? rulesOf(t) : null;
    var vname = d.vessel || ui.holdVessel || (kind === 'airship' ? 'Airship' : kind === 'siege' ? 'Battering ram' : 'Cog');
    var def = (kind === 'ship' || kind === 'airship') && VESSEL_DEF[vname] ? VESSEL_DEF[vname] : HOLD_DEF[kind];
    var v = function (k) { return d[k] != null ? d[k] : def[k] != null ? def[k] : ''; };
    var numF = function (id, label, val, step, hint) { return '<div class="field"><label for="' + id + '">' + label + '</label><input type="number" id="' + id + '" min="0" step="' + (step || 1) + '" value="' + esc(val) + '" inputmode="decimal">' + (hint ? '<span class="hint">' + hint + '</span>' : '') + '</div>'; };
    var html = '<form class="form group-box" id="hold-form" novalidate data-camp="' + esc(camp.id) + '" data-id="' + esc(h ? h.id : '') + '" style="margin-bottom:12px"><h2>' + (isNew ? 'New holding' : 'Edit ' + esc(h.name)) + '</h2>';
    if (isNew) html += '<div class="field"><label for="hd-kind">Kind</label><select id="hd-kind">' + HOLD_KINDS.map(function (k) { return '<option value="' + k[0] + '"' + (k[0] === kind ? ' selected' : '') + '>' + k[1] + '</option>'; }).join('') + '</select></div>';
    html += '<div class="field"><label for="hd-name">Name</label><input type="text" id="hd-name" maxlength="60" value="' + esc(h ? h.name : ui.holdDraftName || '') + '" placeholder="e.g. The Salt Hen"></div><div class="two">' +
      '<div class="field"><label for="hd-owner">Owner</label><select id="hd-owner"><option value="">The party</option>' + campaignChars(camp.id).map(function (c) { return '<option value="' + esc(c.id) + '"' + (h && h.owner_char === c.id ? ' selected' : '') + '>' + esc(c.name) + '</option>'; }).join('') + '</select><span class="hint">Personal holdings are only seen by their owner and you.</span></div>' +
      numF('hd-coffer', isNew ? 'Starting coffer, gp' : 'Coffer, gp', h ? cofferOf(h) : 0, 1, 'Wages and upkeep come out of this.');
    if (kind === 'ship' && r) html += '<div class="field"><label for="hd-vessel">Vessel</label><select id="hd-vessel">' + r.boats.filter(function (b) { return !b.own; }).map(function (b) { return '<option' + (b.name === vname ? ' selected' : '') + '>' + esc(b.name) + '</option>'; }).join('') + '</select></div>';
    if (kind === 'siege') html += '<div class="field"><label for="hd-vessel">Engine</label><select id="hd-vessel">' + Object.keys(SIEGE).map(function (k) { return '<option' + (k === (d.vessel || ui.holdVessel || 'Battering ram') ? ' selected' : '') + '>' + esc(k) + '</option>'; }).join('') + '</select><span class="hint">' + esc(Object.keys(SIEGE).map(function (k) { return k + ': ' + SIEGE[k].what.toLowerCase(); }).join('. ')) + '.</span></div>' +
      numF('hd-crew', 'Crew', d.crew != null ? d.crew : (SIEGE[d.vessel || ui.holdVessel || 'Battering ram'] || {}).crew, 1, SIEGE_WAGE + ' gp a month each.') + numF('hd-upkeep', 'Upkeep a month, gp', v('upkeep'));
    if (kind === 'airship' && r) html += '<div class="field"><label for="hd-vessel">Airship</label><select id="hd-vessel">' + r.airships.filter(function (a) { return !a.own; }).map(function (a) { return '<option' + (a.name === vname ? ' selected' : '') + '>' + esc(a.name) + '</option>'; }).join('') + '</select></div>';
    var others = holdingsFor(camp.id).filter(function (x) { return (!h || x.id !== h.id) && hasPeople(x); });
    if (kind === 'vassal') html += numF('hd-income', 'Dues he pays a month, gp', v('income'), 1, 'He holds back some if he’s restless.') + numF('hd-vsold', 'Soldiers he can bring', num(d.soldiers, 0)) +
      '<div class="field"><label for="hd-at">His seat</label><input type="text" id="hd-at" maxlength="60" value="' + esc(d.at || '') + '" placeholder="e.g. Dyer’s Ford"></div>' +
      '<div class="field"><label for="hd-lh">Sworn to</label><select id="hd-lh"><option value="">(dues wait in his coffer)</option>' + others.map(function (x) { return '<option value="' + esc(x.id) + '"' + (x.id === d.liege_hid ? ' selected' : '') + '>' + esc(x.name) + '</option>'; }).join('') + '</select><span class="hint">His dues go into that holding’s coffer.</span></div>';
    else if (kind === 'siege') html += '';
    else if (kind === 'caravan') html += numF('hd-wagons', 'Wagons', num(d.wagons, 1), 1, 'About ' + WAGON.price + ' gp each with two draught horses. ' + WAGON.min + ' or more can trade.') +
      numF('hd-guards', 'Guards', num(d.guards, 0), 1, WAGON.guard + ' gp a month each. One per wagon turns ambushes into poor runs.') +
      numF('hd-wprofit', 'Profit per wagon on a fair run, gp', d.wagon_profit != null ? d.wagon_profit : WAGON.profit);
    else html += numF('hd-crew', HOLD_LAND[kind] ? 'Household' : 'Crew', v('crew')) + numF('hd-wages', 'Wages a month (all of them), gp', v('wages')) + numF('hd-upkeep', 'Upkeep a month, gp', v('upkeep')) +
      numF('hd-income', HOLD_LAND[kind] ? 'Base income a month, gp' : 'Trade profit on a fair run, gp', v('income'), 1, HOLD_LAND[kind] ? 'Times the area’s wealth, plus extras.' : 'The d20 on payday scales this.');
    if (HOLD_MOVES[kind] && isNew) {
      var cm = commissionOf(kind, vname), tday = t ? t.day : 0;
      html += '<div class="field"><label class="check"><input type="checkbox" id="hd-comm"> Commissioned: still being built</label><span class="hint">' + (cm ? 'New, about ' + cm[0].toLocaleString() + ' gp and ' + cm[1] + ' days. ' : '') + 'No wages or upkeep until it’s done.</span></div>' +
        numF('hd-ready', 'Ready on day', tday + (cm ? cm[1] : 30)) + '<div class="field"><label for="hd-yard">Built at</label><input type="text" id="hd-yard" maxlength="60" placeholder="e.g. Keelhaven"></div>';
    }
    if (HOLD_MOVES[kind]) html += numF('hd-moor', kind === 'caravan' ? 'Stabling a day, gp' : 'Mooring a day, gp', v('moor'), 0.1, 'Free at your own holding.');
    if (HOLD_LAND[kind]) {
      html += '<div class="field"><label for="hd-wealth">Area wealth</label><select id="hd-wealth">' + WEALTH.map(function (w) { return '<option' + (w[0] === (d.wealth || 'Modest') ? ' selected' : '') + '>' + w[0] + '</option>'; }).join('') + '</select><span class="hint">Shifts on its own over time with how it’s run.</span></div>' +
        '<div class="field"><label for="hd-at">Where</label><input type="text" id="hd-at" maxlength="60" value="' + esc(d.at || '') + '" list="hd-places" placeholder="e.g. Marloo"><datalist id="hd-places">' + holdPlaces(camp.id).map(function (p) { return '<option value="' + esc(p) + '">'; }).join('') + '</datalist></div>';
      if (kind !== 'workshop') html += numF('hd-soldiers', 'Garrison soldiers', num(d.soldiers, 0)) + numF('hd-swage', 'Pay a soldier a month, gp', d.soldier_wage != null ? d.soldier_wage : SOLDIER_WAGE);
    }
    html += '</div>';
    if (POP_DEF[kind]) {
      html += '<div class="two"><div class="field"><label for="hd-liege">Liege (who they hold it from)</label><input type="text" id="hd-liege" maxlength="60" list="hd-lieges" value="' + esc(d.liege || '') + '" placeholder="e.g. House Marloo, or one of yours"><datalist id="hd-lieges">' +
        others.map(function (x) { return '<option value="' + esc(x.name) + '">'; }).concat(articles.filter(function (a) { return a.template === 'Organization' && (!a.campaign_id || a.campaign_id === camp.id); }).map(function (a) { return '<option value="' + esc(a.title) + '">'; })).join('') + '</datalist><span class="hint">Leave blank if they answer to no one. Pick one of your own holdings to make this one its vassal.</span></div>' +
        numF('hd-dues', 'Dues, % of income', d.dues != null ? d.dues : 10) +
        (isNew ? '' : '<div class="field"><label for="hd-favor">Standing with the liege</label><select id="hd-favor">' + FAVOR.map(function (x) { return '<option value="' + x[0] + '"' + (x[0] === num(d.favor, 0) ? ' selected' : '') + '>' + x[1] + '</option>'; }).join('') + '</select></div>') + '</div>';
      html += '<div class="two">' + (isNew ? '<div class="field"><label for="hd-gained">How they got it</label><select id="hd-gained">' + Object.keys(GAINED).map(function (g) { return '<option>' + g + '</option>'; }).join('') + '</select><span class="hint">Taken by force starts angry, with a wary household.</span></div>' : '') +
        '<div class="field"><label for="hd-title">Title it carries</label><input type="text" id="hd-title" maxlength="60" value="' + esc(d.title || '') + '" placeholder="' + esc(h ? titleOf(h) : kind === 'castle' ? 'Knight of …' : kind === 'town' ? 'Baron of …' : 'Lord of …') + '"></div>' +
        numF('hd-pop', 'Population', d.pop != null ? d.pop : POP_DEF[kind]) +
        (isNew ? '' : numF('hd-unrest', 'Unrest, 0–10', num(d.unrest, 2), 1, '4+ uneasy, 6+ angry, 8+ rioting, 10 in revolt.')) + '</div>' +
        '<div class="field"><span class="k">Already standing when they got it</span>' + BUILDINGS.map(function (b) { return '<label class="check"><input type="checkbox" data-extra="' + esc(b.n) + '"' + ((d.extras || {})[b.n] ? ' checked' : '') + '> ' + b.n + ' <span class="note">(' + esc(b.what) + ')</span></label>'; }).join('') + '</div>';
    }
    if (kind === 'ship' || kind === 'airship') html += '<label class="check"><input type="checkbox" id="hd-marque"' + (d.marque ? ' checked' : '') + '> Letter of marque from the king (may raid his enemies)</label>' +
      '<label class="check"><input type="checkbox" id="hd-commission"' + (d.commission ? ' checked' : '') + '> The king’s commission (may serve the crown for pay)</label>';
    if (kind === 'airship') html += '<label class="check"><input type="checkbox" id="hd-gnome"' + (d.gnome ? ' checked' : '') + '> A gnome first mate or technician is aboard</label>';
    if (kind === 'airship') html += '<label class="check"><input type="checkbox" id="hd-dwarves"' + (d.dwarves ? ' checked' : '') + '> Trained dwarf hull-wrights aboard (+30 gp a month; they can mend the hull fully)</label>';
    var loyF = function (unit, label) { if (isNew && POP_DEF[kind]) return ''; var l = h ? loyOf(h, unit) : 5; return '<div class="field"><label for="hd-loy-' + unit + '">' + label + ' loyalty (only you see this)</label><select id="hd-loy-' + unit + '">' + [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (n) { return '<option value="' + n + '"' + (n === l ? ' selected' : '') + '>' + n + ' · ' + band(n) + '</option>'; }).join('') + '</select></div>'; };
    html += '<div class="two">' + loyF('crew', HOLD_LAND[kind] ? 'Household' : 'Crew') + (HOLD_LAND[kind] && kind !== 'workshop' ? loyF('garrison', 'Garrison') : '') + '</div>';
    html += '<div class="field"><label for="hd-notes">Notes (players see these)</label><textarea id="hd-notes" rows="2" maxlength="400">' + esc(d.notes || '') + '</textarea></div>';
    html += '<div class="actions"><button type="submit" class="btn primary">' + (isNew ? 'Add holding' : 'Save') + '</button><button type="button" class="btn" data-act="hold-cancel">Cancel</button>' +
      (h ? '<button type="button" class="btn quiet" data-act="hold-del" data-id="' + esc(h.id) + '">' + (ui.holdDel === h.id ? 'Tap again to remove' : 'Remove') + '</button>' : '') + '</div></form>';
    return html;
  }

  function saveHoldForm(f) {
    var campId = f.getAttribute('data-camp'), id = f.getAttribute('data-id'), h = id ? holdingById(id) : null;
    var val = function (k) { var el = document.getElementById(k); return el ? el.value : null; };
    var kind = h ? h.kind : val('hd-kind') || 'ship';
    var name = (val('hd-name') || '').trim().slice(0, 60) || HOLD_LABEL[kind];
    var d = Object.assign({}, h ? h.data : {});
    var n = function (k, fallback) { var x = parseFloat(val(k)); return isNaN(x) ? fallback : Math.max(0, x); };
    if (val('hd-vessel') != null) d.vessel = val('hd-vessel');
    if (val('hd-crew') != null) { d.crew = n('hd-crew', 0); d.wages = n('hd-wages', 0); d.upkeep = n('hd-upkeep', 0); }
    if (val('hd-income') != null) d.income = n('hd-income', 0);
    if (val('hd-moor') != null) d.moor = n('hd-moor', 0);
    if (val('hd-wealth') != null) d.wealth = val('hd-wealth');
    if (val('hd-at') != null) d.at = val('hd-at').trim().slice(0, 60);
    if (val('hd-soldiers') != null) { d.soldiers = Math.round(n('hd-soldiers', 0)); d.soldier_wage = n('hd-swage', SOLDIER_WAGE); }
    if (val('hd-vsold') != null) d.soldiers = Math.round(n('hd-vsold', 0));
    if (val('hd-lh') != null) d.liege_hid = val('hd-lh') || null;
    if (val('hd-liege') != null) {
      d.liege = val('hd-liege').trim().slice(0, 60);
      var lh = d.liege ? holdingsFor(campId).filter(function (x) { return x.name === d.liege && (!h || x.id !== h.id); })[0] : null;
      d.liege_hid = lh ? lh.id : null;
      d.dues = Math.min(100, n('hd-dues', 10));
    }
    if (val('hd-favor') != null) d.favor = num(val('hd-favor'), 0);
    var ex = f.querySelectorAll('[data-extra]'); if (ex.length) { d.extras = {}; Array.prototype.forEach.call(ex, function (c) { if (c.checked) d.extras[c.getAttribute('data-extra')] = true; }); }
    if (document.getElementById('hd-gnome')) d.gnome = document.getElementById('hd-gnome').checked;
    if (document.getElementById('hd-dwarves')) d.dwarves = document.getElementById('hd-dwarves').checked;
    d.hull = false;
    if (document.getElementById('hd-marque')) d.marque = document.getElementById('hd-marque').checked;
    if (document.getElementById('hd-commission')) d.commission = document.getElementById('hd-commission').checked;
    if (val('hd-wagons') != null) { d.wagons = Math.max(1, Math.round(n('hd-wagons', 1))); d.guards = Math.round(n('hd-guards', 0)); d.wagon_profit = n('hd-wprofit', WAGON.profit); d.crew = d.wagons; }
    d.notes = (val('hd-notes') || '').slice(0, 400);
    d.coffer = n('hd-coffer', 0);
    var owner = val('hd-owner') || null;
    if (val('hd-title') != null) d.title = val('hd-title').trim().slice(0, 60);
    if (val('hd-pop') != null) d.pop = Math.round(n('hd-pop', 0));
    if (val('hd-unrest') != null) d.unrest = Math.max(0, Math.min(10, Math.round(n('hd-unrest', 2))));
    var gained = val('hd-gained');
    if (gained && GAINED[gained]) { d.gained = gained; d.unrest = GAINED[gained].unrest; d.tax = 'Normal'; }
    if (!h && HOLD_MOVES[kind]) d.mode = 'party';
    if (!h && document.getElementById('hd-comm') && document.getElementById('hd-comm').checked) { d.mode = 'building'; d.ready = Math.round(n('hd-ready', 0)); d.yard = (val('hd-yard') || '').trim().slice(0, 60); d.at = d.yard; }
    var secret = { crew: num(val('hd-loy-crew'), gained && GAINED[gained] ? GAINED[gained].crew : 5) }; if (val('hd-loy-garrison') != null) secret.garrison = num(val('hd-loy-garrison'), 5);
    if (!h && gained && GAINED[gained]) { secret.crew = GAINED[gained].crew; secret.garrison = GAINED[gained].crew; }
    var t = travel[campId], e = estateOf(campId);
    var first = !h ? sb.from('holdings').insert({ campaign_id: campId, kind: kind, name: name, data: {} }).select('id, campaign_id, name, kind, data, owner_char, created_at').single() : Promise.resolve({ data: h });
    first.then(function (r) {
      if (r.error) throw r.error;
      var row = r.data; if (!h) holdings.push(row);
      row.name = name; row.owner_char = owner;
      return saveHolding(row, d, secret);
    }).then(function () {
      if (e.payday == null) return sb.from('estates').upsert({ campaign_id: campId, treasury: Number(e.treasury || 0), payday: (t ? t.day : 1) + PAY_EVERY, ledger: e.ledger || [] });
    }).then(function (r) {
      if (r && r.error) throw r.error;
      ui.holdEdit = null; ui.holdDel = null;
      return loadHoldings();
    }).then(function () { toast(h ? 'Saved ' + name : 'Added ' + name); render(); })
      .catch(function (err) { fail(err, 'Could not save that holding.'); });
  }

  function holdSetMode(h, mode) {
    var d = h.data || {}, st = holdMode(h), t = travel[h.campaign_id], day = t ? t.day : 0;
    var pick = document.getElementById('hp-' + h.id), place = pick ? pick.value : '', free = !!(document.getElementById('hf-' + h.id) || {}).checked;
    var patch = {};
    if ((mode === 'trading' || mode === 'raiding' || mode === 'crown' || mode === 'moored' || mode === 'recall') && !place) return toast('Put some towns on the travel map first.');
    if (mode === 'trading' || mode === 'raiding' || mode === 'crown') { patch = { mode: mode, port: place, at: place }; }
    else if (mode === 'moored') { patch = { mode: 'moored', at: place, moor_since: day, moor_free: free }; }
    else if (mode === 'party') { patch = { mode: 'party' }; }
    else if (mode === 'recall') {
      var from = placeByLabel(h.campaign_id, d.port), to = placeByLabel(h.campaign_id, place);
      var days = holdTravelDays(h, from, to);
      if (days == null) days = 7;
      days += FINISH_DAYS[h.kind] || 3;
      patch = { mode: 'returning', ret_to: place, ret_day: day + days, ret_free: free, at: place, moor_since: day + days, moor_free: free };
    }
    if (st.mode === 'moored' && d.mode === 'returning') patch.moor_since = patch.moor_since != null ? patch.moor_since : st.since;
    saveHolding(h, patch).then(function () {
      toast(mode === 'recall' ? h.name + ' will be home in ' + (patch.ret_day - day) + ' days' : mode === 'trading' ? h.name + ' is out trading' : mode === 'raiding' ? h.name + ' is out raiding' : mode === 'crown' ? h.name + ' is in the king’s service' : mode === 'moored' ? h.name + ' is moored at ' + place : h.name + ' is with the party');
      render();
    }).catch(function (err) { fail(err, 'Could not change that.'); });
  }

  function paydayHtml(camp, list) {
    var html = '<section class="block"><h2 class="sec-title">Payday<small>Every ' + PAY_EVERY + ' days</small></h2><p class="note" style="margin-top:0">Each holding pays its own people and upkeep from its coffer. If the coffer runs short, someone goes unpaid. Hold wages only if the owner has ordered it. Anything out trading needs the table’s d20.</p><form id="payday-form" novalidate data-camp="' + esc(camp.id) + '"><div class="tbl">';
    list.forEach(function (h) {
      var st = holdMode(h);
      html += '<div class="tbl-row"><div class="main"><b>' + esc(h.name) + '</b><span>' + esc(ownerName(h) + ' · coffer ' + gp(cofferOf(h))) + '</span></div></div>';
      unitsOf(h).forEach(function (u) {
        var uu = unitOf(h, u), w = unitWages(h, u);
        if ((!w && !uu.owed) || st.mode === 'building') return;
        html += '<div class="tbl-row"><div class="main"><b>' + esc(unitName(h, u)) + '</b><span>' + esc(gp(w) + ' due' + (uu.owed ? ', ' + gp(uu.owed) + ' owed' : '') + ' · ' + band(loyOf(h, u))) + '</span></div>' +
          '<select class="input rar-sel" data-pay="' + esc(h.id + '|' + u) + '" aria-label="Wages for ' + esc(h.name) + ' ' + esc(unitName(h, u)) + '"><option value="auto">Pay from coffer</option><option value="skip">Hold wages</option></select></div>';
      });
      if (hasPeople(h)) html += '<div class="tbl-row"><div class="main"><b>How the month went</b><span>d20 · leave blank for a quiet month</span></div><input class="input mini" type="number" min="1" max="20" inputmode="numeric" data-hroll="' + esc(h.id) + '" placeholder="d20"></div>';
      if (st.mode === 'building' && h.kind === 'airship') html += '<div class="tbl-row"><div class="main"><b>The yard this month</b><span>d20 · 1–2 the crews fall out, 20 a month ahead</span></div><input class="input mini" type="number" min="1" max="20" inputmode="numeric" data-yroll="' + esc(h.id) + '" placeholder="d20"></div>';
      if (HOLD_MOVES[h.kind] && st.mode === 'raiding') html += '<div class="tbl-row"><div class="main"><b>Raid roll</b><span>1–3 a beating, 20 a treasure ship · fight +' + Math.floor(shipStats(h).fight / 2) + '</span></div><input class="input mini" type="number" min="1" max="20" inputmode="numeric" data-troll="' + esc(h.id) + '" placeholder="d20"></div>';
      if (HOLD_MOVES[h.kind] && st.mode === 'trading' && baseIncome(h) > 0) html += '<div class="tbl-row"><div class="main"><b>Trade roll</b><span>' + (h.kind === 'caravan' ? '1–2 ambushed' : '1 disaster') + ', 20 windfall</span></div><input class="input mini" type="number" min="1" max="20" inputmode="numeric" data-troll="' + esc(h.id) + '" placeholder="d20"></div>';
    });
    return html + '</div><div class="actions"><button type="submit" class="btn primary">Settle payday</button></div></form></section>';
  }

  function settlePayday(f) {
    var campId = f.getAttribute('data-camp'), e = estateOf(campId), t = travel[campId], day = t ? t.day : 0;
    var list = holdingsFor(campId), missingRoll = null, rolls = {};
    list.forEach(function (h) {
      var el = f.querySelector('[data-troll="' + h.id + '"]');
      if (el) { var r = num(el.value, 0); if (r < 1 || r > 20) missingRoll = missingRoll || h.name; rolls[h.id] = r; }
    });
    if (missingRoll) return toast('Enter the d20 for ' + missingRoll + '.');
    var periodStart = Number(e.payday) - PAY_EVERY, jobs = [], summary = [], transfers = [], done = {};
    list.forEach(function (h) {
      var d = clone(h.data || {}), st = holdMode(h), secret = {}, rep = [], cof = cofferOf(h), start = cof, short = false;
      d.units = d.units || {};
      if (d.mode === 'returning' && st.mode === 'moored') { d.mode = 'moored'; d.at = st.at; d.moor_since = st.since; d.moor_free = st.free; }
      if (d.mode === 'building' && st.mode === 'moored') { d.mode = 'moored'; d.at = st.at; d.moor_since = st.since; d.moor_free = false; rep.push('Finished and afloat at ' + (st.at || 'the yard') + '. The crew now draw wages.'); }
      if (st.mode === 'building') {
        var yr = f.querySelector('[data-yroll="' + h.id + '"]'), yv = yr ? num(yr.value, 0) : 0;
        if (yv >= 1 && yv <= 20) { var yy = yardRoll(yv); d.ready = Math.max(day + 1, num(d.ready, day) + yy.days); rep.push(yy.t); }
        var lb = num(d.ready, day) - day; rep.push('Ready in about ' + lb + (lb === 1 ? ' day.' : ' days.'));
        d.reports = (d.reports || []).concat([{ day: day, text: rep }]).slice(-6);
        done[h.id] = { h: h, d: d, secret: {}, start: start };
        return;
      }
      var crewBand = band(loyOf(h, 'crew'));
      // Money in first: the month's income or the trading run.
      var inc = 0, ev = null, unrest = num(d.unrest, 2), evUnrest = 0, crewMod = 0;
      if (hasPeople(h)) {
        // Finished buildings first, so they count this month.
        var still = [];
        (d.projects || []).forEach(function (p) { if (num(p.done, 0) <= day) { d.extras = d.extras || {}; d.extras[p.name] = true; rep.push('The ' + p.name.toLowerCase() + ' is finished.'); } else still.push(p); });
        d.projects = still;
        var hr = f.querySelector('[data-hroll="' + h.id + '"]'), roll = hr ? num(hr.value, 0) : 0;
        if (roll >= 1 && roll <= 20) ev = HOLD_EVENTS[roll];
      }
      if (HOLD_LAND[h.kind]) {
        inc = baseIncome({ kind: h.kind, campaign_id: h.campaign_id, data: d });
        if (ev) {
          var half = ev.stores && builtOf({ campaign_id: h.campaign_id, data: d }).Granary ? 0.5 : 1;
          var hit = (ev.onlyIf === 'restless' && GRACE[crewBand] > 0) || (ev.onlyIf === 'hightax' && !/High|Crushing/.test(d.tax || '')) || (ev.raid && defenseOf({ campaign_id: h.campaign_id, data: d }) >= ev.raid);
          if (hit) rep.push(ev.safe || ev.t);
          else {
            rep.push(ev.t + (half < 1 ? ' The granary softens it.' : ''));
            if (ev.inc) inc *= Math.max(0, 1 + ev.inc * (ev.inc < 0 ? half : 1));
            if (ev.cofPct) cof += cof * ev.cofPct;
            if (ev.cof) cof += ev.cof;
            if (ev.hoard) cof += ev.hoard * wealthMul(d.wealth || 'Modest');
            if (ev.pop) d.pop = Math.round(num(d.pop, POP_DEF[h.kind]) * (1 + ev.pop * (ev.pop < 0 ? half : 1)));
            if (ev.unrest) evUnrest += ev.unrest;
            if (ev.prosper) d.prosper = num(d.prosper, 0) + ev.prosper;
          }
        } else if (hasPeople(h)) rep.push('A quiet month.');
        if (hasPeople(h) && d.levy) inc *= Math.max(0.1, 1 - 2 * num(d.levy.n, 0) / Math.max(1, num(d.pop, POP_DEF[h.kind])));
        inc = Math.round(inc); cof = Math.round(cof);
        if (inc) rep.push('Brought in ' + gp(inc) + '.');
      }
      else if (h.kind === 'vassal') { inc = Number(d.income || 0); }
      else if (st.mode === 'crown') { inc = crownPay(h); rep.push('In the king’s service: the crown paid ' + gp(inc) + '.'); }
      else if (rolls[h.id] && st.mode === 'raiding') {
        var rr0 = rolls[h.id] <= 3 ? rolls[h.id] + shipStats(h).luck : rolls[h.id];
        var rr = Math.min(20, rr0 + Math.floor(shipStats(h).fight / 2)), rx = RAID_ROLL.filter(function (x) { return rr <= x[0]; })[0];
        inc = Number(d.income || 0) * rx[1];
        if (rx[0] === 3) { crewMod -= 1; rep.push('Took a beating: the crew are shaken and nothing was taken.' + hullHit(h, d, 0.25)); }
        else rep.push(rx[2] + (inc ? ': ' + gp(inc) + ' in prize money.' : '.'));
        if (rx[1] >= 2.5) { crewMod += 1; rep.push('The crew drank to their shares.'); }
      }
      else if (rolls[h.id]) {
        var tr = tradeRoll(h, rolls[h.id]); inc = baseIncome({ kind: h.kind, campaign_id: h.campaign_id, data: d }) * tr.mul;
        rep.push(tr.mul === 0 ? (h.kind === 'caravan' ? 'Ambushed on the road. Nothing made this month.' : 'Disaster at sea. Nothing made this month.') + hullHit(h, d, 0.25) : tr.label + ': made ' + gp(inc) + '.');
      }
      var levyN = hasPeople(h) && d.levy ? num(d.levy.n, 0) : 0;
      if (levyN) {
        evUnrest += 1;
        rep.push(levyN + ' levied folk are under arms: the fields are short of hands, and they need feeding.');
      }
      if (inc > 0 && SKIM[crewBand]) { var lost = inc * SKIM[crewBand]; inc -= lost; d.skimmed = Number(d.skimmed || 0) + lost; if (h.kind === 'vassal') rep.push('He held back some of what he owes.'); }
      // Dues to a liege come out of the month's takings. A sworn lord's whole payment is his dues.
      if (h.kind === 'vassal') {
        if (d.liege_hid) { transfers.push({ to: d.liege_hid, amt: Math.round(inc), from: h.name }); rep.push('Sent ' + gp(Math.round(inc)) + ' in dues.'); inc = 0; }
        else if (inc) rep.push('Paid ' + gp(Math.round(inc)) + ' in dues, waiting here for you to collect.');
      }
      cof += inc;
      if (hasPeople(h) && d.liege) {
        var fav = num(d.favor, 0), due = Math.round(inc * Number(d.dues != null ? d.dues : 10) / 100), owedD = Number(d.dues_owed || 0);
        if (cof >= due + owedD) {
          cof -= due + owedD; d.dues_owed = 0; d.dstreak = num(d.dstreak, 0) + 1;
          rep.push('Dues to ' + d.liege + ': ' + gp(due + owedD) + (owedD ? ', back dues too.' : '.'));
          if (d.dstreak >= 3 && fav < 1) { fav += 1; d.dstreak = 0; }
          if (d.liege_hid) transfers.push({ to: d.liege_hid, amt: due + owedD, from: h.name });
        } else {
          d.dues_owed = owedD + due; d.dstreak = 0; fav -= 1;
          rep.push('Could not pay ' + d.liege + ' their dues. Owed ' + gp(d.dues_owed) + '.');
        }
        if (d.call) { fav -= 2; rep.push('The summons from ' + d.liege + ' for ' + d.call.n + ' soldiers went unanswered.'); d.call = null; }
        if (d.answered) { if (d.answered.how === 'sent') fav += 1; rep.push(d.answered.how === 'sent' ? d.answered.n + ' soldiers answered the summons. It was noticed.' : 'Shield money paid in place of ' + d.answered.n + ' soldiers.'); d.answered = null; }
        fav = Math.max(-3, Math.min(2, fav));
        if (fav !== num(d.favor, 0)) rep.push(fav <= -3 ? d.liege + ' has declared you a rebel.' : 'Standing with ' + d.liege + ': ' + favorWord(fav).toLowerCase() + '.');
        d.favor = fav;
      }
      // Then upkeep and mooring.
      var costs = upkeepOf(h) + levyN * LEVY_FEED;
      if (HOLD_MOVES[h.kind] && d.mode === 'moored' && !d.moor_free) {
        var mdays = Math.max(0, Number(e.payday) - Math.max(num(d.moor_since, periodStart), periodStart));
        if (mdays) { costs += mdays * holdMoorRate(h); rep.push('Mooring at ' + (d.at || 'port') + ', ' + mdays + ' days.'); }
      }
      if (costs) {
        if (cof >= costs) { cof -= costs; rep.push('Upkeep paid: ' + gp(costs) + '.'); }
        else { rep.push('Upkeep came up ' + gp(costs - cof) + ' short. Things are being let go.'); cof = 0; short = true; }
      }
      // Then the people, crew before garrison. Pay back what's owed if the coffer stretches to it.
      unitsOf(h).forEach(function (u) {
        var sel = f.querySelector('[data-pay="' + h.id + '|' + u + '"]'), held = sel && sel.value === 'skip';
        var uu = unitOf(h, u), w = unitWages(h, u), l = loyOf(h, u), had = uu.owed, nm = unitName(h, u);
        if (!w && !had) { secret[u] = l; d.units[u] = uu; return; }
        if (!held && cof >= w + had) {
          cof -= w + had;
          if (had > 0) { l += 1; rep.push(nm + ' paid, back pay too. They noticed.'); } else rep.push(nm + ' paid.');
          uu.streak = had > 0 ? 0 : uu.streak + 1; uu.owed = 0; uu.missed = 0; uu.hurt = 0;
          if (uu.streak >= 3 && l < 7) { l += 1; uu.streak = 0; }
        } else if (!held && cof >= w) {
          cof -= w; uu.streak = 0; rep.push(nm + ' paid this month. Still owed ' + gp(had) + '.');
        } else {
          var paid = held ? 0 : Math.max(0, cof); cof -= paid;
          uu.owed += w - paid; uu.missed += 1; uu.streak = 0;
          if (uu.missed > GRACE[band(l)] + (u === 'crew' ? shipStats(h).grace : 0)) { uu.hurt += 1; l -= uu.hurt; }
          rep.push(nm + (held ? ' not paid, on your orders.' : paid ? ' only got ' + gp(paid) + '. The coffer is empty.' : ' went unpaid. The coffer is empty.') + ' Owed ' + gp(uu.owed) + '.');
          if (u === 'crew') short = true;
        }
        if (u === 'crew') l += crewMod;
        l = Math.max(1, Math.min(10, l));
        secret[u] = l; d.units[u] = uu;
        if (u === 'crew') crewBand = band(l);
        rep.push(nm + ' seem ' + MOOD[band(l)].toLowerCase() + '.');
      });
      if (hasPeople(h)) {
        var keep = num(d.soldiers, 0) * (builtOf({ campaign_id: h.campaign_id, data: d }).Barracks ? 2 : 1);
        var garUnpaid = (d.units.garrison || {}).missed > 0 && unitOf({ data: d }, 'garrison').owed > 0;
        var du = evUnrest + (TAX[d.tax || 'Normal'] || TAX.Normal).unrest - buildSum({ campaign_id: h.campaign_id, data: d }, 'calm') + (keep >= num(d.pop, POP_DEF[h.kind]) / 50 ? -1 : 0) + (short ? 1 : 0) + (garUnpaid ? 1 : 0);
        var was = folkOf(unrest).w; unrest = Math.max(0, Math.min(10, unrest + du)); d.unrest = unrest;
        var now = folkOf(unrest).w;
        rep.push(now === 'In revolt' ? 'The folk have risen and hold the place against you.' : now !== was ? 'The folk are ' + now.toLowerCase() + ' now.' : 'The folk are ' + now.toLowerCase() + '.');
      }
      if (HOLD_LAND[h.kind]) {
        var p = num(d.prosper, 0);
        p += crewBand === 'Treacherous' ? -2 : crewBand === 'Restless' || short ? -1 : 1;
        if (hasPeople(h) && unrest >= 6) p -= 1;
        var wi = WEALTH.map(function (w) { return w[0]; }).indexOf(d.wealth || 'Modest');
        if (p >= 3 && wi < WEALTH.length - 1) { d.wealth = WEALTH[wi + 1][0]; p = 0; rep.push('The place is doing well: now ' + d.wealth.toLowerCase() + '.'); }
        else if (p <= -3 && wi > 0) { d.wealth = WEALTH[wi - 1][0]; p = 0; rep.push('The place is slipping: now ' + d.wealth.toLowerCase() + '.'); }
        d.prosper = Math.max(-3, Math.min(3, p));
      }
      cof = Math.round(cof * 100) / 100;
      d.coffer = cof;
      rep.push('Coffer: ' + gp(cof) + '.');
      d.reports = (d.reports || []).concat([{ day: day, text: rep }]).slice(-6);
      done[h.id] = { h: h, d: d, secret: secret, start: start };
    });
    // Dues land in the liege holding's coffer, and go in its report.
    transfers.forEach(function (tr) {
      var tgt = done[tr.to]; if (!tgt || !tr.amt) return;
      tgt.d.coffer = Math.round((Number(tgt.d.coffer || 0) + tr.amt) * 100) / 100;
      var last = tgt.d.reports[tgt.d.reports.length - 1]; last.text.splice(last.text.length - 1, 0, 'Dues from ' + tr.from + ': ' + gp(tr.amt) + '.');
      last.text[last.text.length - 1] = 'Coffer: ' + gp(tgt.d.coffer) + '.';
    });
    Object.keys(done).forEach(function (k) { var x = done[k]; summary.push(x.h.name + ' ' + gp(x.start) + ' → ' + gp(x.d.coffer)); jobs.push(function () { return saveHolding(x.h, x.d, x.secret); }); });
    var ledger = (e.ledger || []).concat([{ day: day, text: 'Payday', amt: 0, lines: summary, dm: true }]).slice(-200);
    Promise.all(jobs.map(function (j) { return j(); })).then(function () {
      return sb.from('estates').upsert({ campaign_id: campId, treasury: Number(e.treasury || 0), payday: Number(e.payday) + PAY_EVERY, ledger: ledger });
    }).then(function (r) {
      if (r.error) throw r.error;
      return loadHoldings();
    }).then(function () { toast('Payday settled. Reports sent.'); render(); })
      .catch(function (err) { fail(err, 'Could not settle payday.'); });
  }

  function saveEstateForm(f) {
    var campId = f.getAttribute('data-camp'), e = estateOf(campId), t = travel[campId];
    var amt = parseFloat(document.getElementById('es-amt').value), note = document.getElementById('es-note').value.trim().slice(0, 80);
    if (isNaN(amt) || !amt) return toast('Enter an amount.');
    var ledger = (e.ledger || []).concat([{ day: t ? t.day : 0, text: note || (amt > 0 ? 'Put in' : 'Taken out'), amt: amt }]).slice(-200);
    sb.from('estates').upsert({ campaign_id: campId, treasury: Math.round((Number(e.treasury || 0) + amt) * 100) / 100, payday: e.payday != null ? e.payday : (t ? t.day : 1) + PAY_EVERY, ledger: ledger }).then(function (r) {
      if (r.error) throw r.error;
      return loadHoldings();
    }).then(function () { toast('Treasury updated'); render(); }).catch(function (err) { fail(err, 'Could not update the treasury.'); });
  }

  function holdLoyalty(h, unit, delta) {
    var l = Math.max(1, Math.min(10, loyOf(h, unit) + delta)), s = {}; s[unit] = l;
    saveHolding(h, {}, s).then(function () { toast(unitName(h, unit) + ' of ' + h.name + ': ' + l + '/10, ' + band(l)); render(); }).catch(function (err) { fail(err); });
  }
  function holdDelete(h) {
    if (ui.holdDel !== h.id) { ui.holdDel = h.id; return render(); }
    sb.from('holdings').delete().eq('id', h.id).then(function (r) {
      if (r.error) throw r.error;
      ui.holdDel = null; ui.holdEdit = null;
      return loadHoldings();
    }).then(function () { toast('Removed ' + h.name); render(); }).catch(function (err) { fail(err); });
  }

  /* ================= Events ================= */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]');
    if (!el) return;
    var act = el.getAttribute('data-act');
    var c = currentChar();
    switch (act) {
      case 'signout': sb.auth.signOut(); break;
      case 'recheck': loadProfile().then(function () { if (isMember()) return loadAll().then(startLive); }).then(render).catch(function (err) { fail(err); }); break;
      case 'authmode': ui.authMode = el.getAttribute('data-mode'); renderAuth(); break;
      case 'hold-new': ui.holdEdit = 'new'; ui.holdKind = 'ship'; ui.holdVessel = null; ui.holdDraftName = ''; ui.holdDel = null; render(); break;
      case 'hold-edit': ui.holdEdit = el.getAttribute('data-id'); ui.holdDel = null; render(); break;
      case 'hold-cancel': ui.holdEdit = null; ui.holdDel = null; render(); break;
      case 'hold-del': var hdel = holdingById(el.getAttribute('data-id')); if (hdel) holdDelete(hdel); break;
      case 'hold-loy': var hloy = holdingById(el.getAttribute('data-id')); if (hloy) holdLoyalty(hloy, el.getAttribute('data-unit'), num(el.getAttribute('data-d'), 0)); break;
      case 'hold-tax': var htx = holdingById(el.getAttribute('data-id')); if (htx) holdOrder(htx, 'tax'); break;
      case 'hold-build': var hbd = holdingById(el.getAttribute('data-id')); if (hbd) holdOrder(hbd, 'build'); break;
      case 'hold-levy': case 'hold-disband': case 'hold-answer': case 'hold-scutage': case 'hold-call':
        var hfe = holdingById(el.getAttribute('data-id')); if (hfe) holdOrder(hfe, act.slice(5)); break;
      case 'hold-fit': case 'hold-unfit': var hft = holdingById(el.getAttribute('data-id')); if (hft) holdFit(hft, el.getAttribute('data-slot'), act === 'hold-unfit' ? el.getAttribute('data-name') : ''); break;
      case 'hold-hp': case 'hold-patch': case 'hold-repair': var hhp = holdingById(el.getAttribute('data-id')); if (hhp) holdHp(hhp, act === 'hold-hp' ? num(el.getAttribute('data-dir'), -1) : act.slice(5)); break;
      case 'hold-cash': var hca = holdingById(el.getAttribute('data-id')); if (hca) holdMoney(hca, el.getAttribute('data-dir')); break;
      case 'hold-mode': var hmo = holdingById(el.getAttribute('data-id')); if (hmo) holdSetMode(hmo, el.getAttribute('data-mode')); break;
      case 'preview':
        preview = el.getAttribute('data-mode');
        writeLocal('avarenth-preview', preview);
        render();
        break;
      case 'filter':
        ui.filters = ui.filters || {}; ui.subs = ui.subs || {};
        ui.filters[el.getAttribute('data-scope')] = el.getAttribute('aria-pressed') === 'true' ? null : (el.getAttribute('data-group') || null);
        ui.subs[el.getAttribute('data-scope')] = null;
        render(); keepBrowserInView(el.getAttribute('data-scope')); break;
      case 'subfilter':
        ui.subs = ui.subs || {};
        ui.subs[el.getAttribute('data-scope')] = el.getAttribute('data-type') || null;
        render(); keepBrowserInView(el.getAttribute('data-scope')); break;
      case 'filter-home':
        ui.filters = ui.filters || {};
        ui.filters[el.getAttribute('data-scope')] = el.getAttribute('data-group');
        go(el.getAttribute('data-target') || '#/wiki'); break;
      case 'new-shop': ui.newShop = { place: el.getAttribute('data-place') || '', campaign: el.getAttribute('data-campaign') || '', kind: el.getAttribute('data-kind') || '' }; go('#/shop-edit/new'); break;
      case 'shop-stock':
        var stk = shopById(el.getAttribute('data-id'));
        if (!stk) return;
        if ((stk.stock || []).length && ui.pendingDelete !== 'restock:' + stk.id) { ui.pendingDelete = 'restock:' + stk.id; el.textContent = 'Tap again to replace the stock'; return; }
        ui.pendingDelete = null; stk.stock = stockFor(stk); stk.stocked_at = new Date().toISOString(); stk.stock_day = gameDay(stk);
        saveShop(stk, 'Stocked: ' + stk.stock.length + ' items'); render(); break;
      case 'meet-wanderer': el.disabled = true; meetWanderer(el.getAttribute('data-campaign')); break;
      case 'shop-keep':
        var skp = shopById(el.getAttribute('data-id'));
        if (!skp) return;
        sb.from('shops').update({ saved: true }).eq('id', skp.id).then(function (r) { if (r.error) return fail(r.error, 'Could not keep them.'); skp.saved = true; toast('Kept. They\u2019ll be back.'); render(); });
        break;
      case 'shop-edit-toggle': ui.shopEdit = !ui.shopEdit; render(); break;
      case 'shop-rm':
        var srm = shopById(el.getAttribute('data-id'));
        if (!srm) return;
        srm.stock.splice(num(el.getAttribute('data-i'), -1), 1); saveShop(srm); render(); break;
      case 'shop-sell': var ss1 = shopById(el.getAttribute('data-id')); if (ss1) shopSell(ss1, num(el.getAttribute('data-i'), -1)); break;
      case 'shop-buy': var sb1 = shopById(el.getAttribute('data-id')); if (sb1) shopBuy(sb1, num(el.getAttribute('data-i'), -1)); break;
      case 'shop-imp': var si1 = shopById(el.getAttribute('data-id')); if (si1) toggleImportant(si1, num(el.getAttribute('data-i'), -1)); break;
      case 'shop-recog': var sr1 = shopById(el.getAttribute('data-id')); if (sr1) shopRecog(sr1, el.getAttribute('data-hit') === '1'); break;
      case 'shop-recog-mode':
        var sr2 = shopById(el.getAttribute('data-id')), rc2 = sr2 && charById((ui.shopChar || {})[sr2.id]);
        if (rc2 && ui.recog && ui.recog[shopKey(sr2, rc2)]) { ui.recog[shopKey(sr2, rc2)].mode = el.getAttribute('data-mode'); render(); }
        break;
      case 'shop-delete':
        var sdid = el.getAttribute('data-id'), sdel = shopById(sdid);
        if (ui.pendingDelete !== 'shop:' + sdid) { ui.pendingDelete = 'shop:' + sdid; el.textContent = 'Tap again to delete'; return; }
        sb.from('shops').delete().eq('id', sdid).then(function (r) {
          if (r.error) return fail(r.error, 'Could not delete the shop.');
          shops = shops.filter(function (x) { return x.id !== sdid; }); ui.pendingDelete = null;
          var sdc = sdel && sdel.campaign_id ? campaignById(sdel.campaign_id) : null;
          toast('Shop closed for good'); go(sdc ? '#/shops/' + encodeURIComponent(sdc.slug) : '#/wiki');
        });
        break;
      case 'place-tag':
        var ptid = el.getAttribute('data-place'), ptag = el.getAttribute('data-tag'), ptags = (placeOf(ptid).tags || []).slice();
        if (ptags.indexOf(ptag) >= 0) ptags.splice(ptags.indexOf(ptag), 1); else ptags.push(ptag);
        savePlace(ptid, { tags: ptags }); break;
      case 'spell-approve': return reviewSpell(el.getAttribute('data-name'), true);
      case 'spell-return': return reviewSpell(el.getAttribute('data-name'), false);
      case 'spell-delete': return deleteSpell(el.getAttribute('data-name'));
      case 'new-article': ui.editCampaign = el.getAttribute('data-campaign') || null; go('#/new'); break;
      case 'crime-filter': ui.crimeFilter = el.getAttribute('data-f'); render(); break;
      case 'next-day': el.disabled = true; rememberMapScroll(); nextDay(el.getAttribute('data-camp')); break;
      case 'show-towns': ui.showTowns = !ui.showTowns; rememberMapScroll(); render(); break;
      case 'town-stop': townDecide(true); break;
      case 'town-pass': townDecide(false); break;
      case 'town-cancel': ui.stopAsk = null; drawStopAsk(); render(); break;
      case 'toll-pay': tollDecide('paid'); break;
      case 'toll-talk': tollDecide('talked'); break;
      case 'toll-around': tollDecide('around'); break;
      case 'arr-leave': saveTravel(el.getAttribute('data-camp'), { arrival: null }).then(render); break;
      case 'arr-hide': (function () { var a = articleById(el.getAttribute('data-id')); if (!a) return; var h = !a.hidden; sb.from('articles').update({ hidden: h }).eq('id', a.id).then(function (r) { if (r.error) return fail(r.error); a.hidden = h; toast(h ? 'Hidden from players' : 'Players can see it'); render(); }); })(); break;
      case 'undo-day': el.disabled = true; undoDay(el.getAttribute('data-camp')); break;
      case 'log-watch': el.disabled = true; logWatch(el.getAttribute('data-camp'), el.getAttribute('data-watch')); break;
      case 'clear-watch': ui.watch = ui.watch || {}; ui.watch[el.getAttribute('data-camp') + '|' + el.getAttribute('data-watch')] = { who: '', d20: '', d100: '' }; render(); break;
      case 'clear-dest': saveTravel(el.getAttribute('data-camp'), { dest_x: null, dest_y: null }).then(render); break;
      case 'delete-crime':
        var crid = el.getAttribute('data-id');
        if (ui.pendingDelete !== crid) { ui.pendingDelete = crid; el.textContent = 'Tap again'; return; }
        sb.from('crimes').delete().eq('id', crid).then(function (r) {
          if (r.error) return fail(r.error, 'Could not remove that entry.');
          ui.pendingDelete = null;
          loadCrimes().then(function () { toast('Removed'); render(); });
        });
        break;
      case 'new-map': ui.mapCampaign = el.getAttribute('data-campaign') || null; go('#/map-edit'); break;
      case 'place':
        ui.placing = { mapId: parseRoute().arg, kind: el.getAttribute('data-kind') };
        ui.pendingPin = null; ui.selectedMarker = null;
        render(); break;
      case 'place-cancel': ui.placing = null; ui.scale = null; render(); break;
      case 'scale-cancel': ui.scale = null; render(); break;
      case 'zoom':
        var fr = document.getElementById('map-frame');
        var steps = [1, 1.5, 2, 3, 4];
        var zi = Math.max(0, steps.indexOf(ui.mapZoom || 1));
        var nz = steps[Math.max(0, Math.min(steps.length - 1, zi + num(el.getAttribute('data-dir'), 1)))];
        if (fr) {
          var ratio = nz / (ui.mapZoom || 1);
          ui.mapScroll = { id: parseRoute().arg, left: (fr.scrollLeft + fr.clientWidth / 2) * ratio - fr.clientWidth / 2, top: (fr.scrollTop + fr.clientHeight / 2) * ratio - fr.clientHeight / 2 };
        }
        ui.mapZoom = nz; render(); break;
      case 'sub-new': ui.subEdit = { id: null, class: 'Paladin', name: '', about: '', patrons: [], features: [] }; render(); break;
      case 'sub-edit':
        var se = customSubs.filter(function (x) { return x.id === el.getAttribute('data-id'); })[0];
        if (se) { ui.subEdit = { id: se.id, class: se.class, name: se.name, about: se.about || '', patrons: (se.patrons || []).slice(), features: (se.features || []).map(function (f) { return Object.assign({}, f); }) }; render(); }
        break;
      case 'sub-cancel': ui.subEdit = null; render(); break;
      case 'sub-patron':
        if (!ui.subEdit) return;
        var spn = el.getAttribute('data-name'), spi = ui.subEdit.patrons.indexOf(spn);
        if (spi >= 0) ui.subEdit.patrons.splice(spi, 1); else ui.subEdit.patrons.push(spn);
        el.setAttribute('aria-pressed', spi < 0); break;
      case 'sub-feat-add':
        if (!ui.subEdit) return;
        var nextL = (RULES.subLevels[ui.subEdit.class] || [3]).filter(function (l) { return !ui.subEdit.features.some(function (f) { return num(f.level, 0) === l; }); })[0] || 3;
        ui.subEdit.features.push({ level: nextL, name: '', text: '' }); render(); break;
      case 'sub-feat-rm': if (ui.subEdit) { ui.subEdit.features.splice(num(el.getAttribute('data-i'), -1), 1); render(); } break;
      case 'sub-delete':
        var sdid2 = el.getAttribute('data-id');
        if (ui.pendingDelete !== 'sub:' + sdid2) { ui.pendingDelete = 'sub:' + sdid2; el.textContent = 'Tap again to delete'; return; }
        sb.from('custom_subclasses').delete().eq('id', sdid2).then(function (r) {
          if (r.error) return fail(r.error, 'Could not delete it.');
          ui.pendingDelete = null; ui.subEdit = null; loadCustomSubs().then(function () { toast('Deleted'); render(); });
        });
        break;
      case 'shop-pin':
        if (ui.placing) return;
        ui.selectedShop = el.getAttribute('data-id'); ui.selectedMarker = null; ui.pendingPin = null;
        rememberMapScroll(); render(); break;
      case 'shop-close': ui.selectedShop = null; rememberMapScroll(); render(); break;
      case 'shop-place':
        ui.placing = { mapId: parseRoute().arg, kind: 'shop', shopId: el.getAttribute('data-id') };
        ui.selectedShop = null; ui.selectedMarker = null; rememberMapScroll(); render(); break;
      case 'shop-unpin':
        var sup = shopById(el.getAttribute('data-id'));
        if (!sup) return;
        sb.from('shops').update({ map_id: null, map_x: null, map_y: null }).eq('id', sup.id).then(function (r) {
          if (r.error) return fail(r.error, 'Could not do that.');
          sup.map_id = null; sup.map_x = null; sup.map_y = null; ui.selectedShop = null; render();
        });
        break;
      case 'marker':
        if (ui.placing) return;
        ui.selectedShop = null;
        ui.selectedMarker = el.getAttribute('data-id'); ui.pendingPin = null; ui.pendingDelete = null;
        rememberMapScroll(); render(); break;
      case 'marker-close': ui.selectedMarker = null; rememberMapScroll(); render(); break;
      case 'marker-move':
        ui.placing = { mapId: parseRoute().arg, kind: 'move', markerId: el.getAttribute('data-id') };
        ui.selectedMarker = null; rememberMapScroll(); render(); break;
      case 'pin-edit':
        var pm = (markers[parseRoute().arg] || []).filter(function (x) { return x.id === el.getAttribute('data-id'); })[0];
        if (!pm) return;
        var pa = pm.article_slug ? articleBySlug(pm.article_slug) : null;
        ui.pendingPin = { mapId: pm.map_id, markerId: pm.id, label: pm.label, articleTitle: pa ? pa.title : '', targetMapId: pm.target_map_id };
        ui.selectedMarker = null; rememberMapScroll(); render(); break;
      case 'pin-cancel': ui.pendingPin = null; rememberMapScroll(); render(); break;
      case 'marker-delete':
        var mkid = el.getAttribute('data-id');
        if (ui.pendingDelete !== mkid) { ui.pendingDelete = mkid; el.textContent = 'Tap again'; return; }
        sb.from('map_markers').delete().eq('id', mkid).then(function (r) {
          if (r.error) return fail(r.error, 'Could not remove that marker.');
          ui.pendingDelete = null; ui.selectedMarker = null;
          rememberMapScroll();
          loadMarkers(parseRoute().arg).then(render);
        });
        break;
      case 'delete-map':
        var dmid = el.getAttribute('data-id');
        if (ui.pendingDelete !== dmid) { ui.pendingDelete = dmid; el.textContent = 'Tap again to delete'; return; }
        var dm0 = mapById(dmid);
        sb.from('maps').delete().eq('id', dmid).then(function (r) {
          if (r.error) return fail(r.error, 'Could not delete the map.');
          if (dm0 && dm0.image_path) sb.storage.from('maps').remove([dm0.image_path]);
          ui.pendingDelete = null;
          loadMaps().then(function () { toast('Map deleted'); go('#/wiki'); });
        });
        break;
      case 'newchar-in': ui.newChar = true; ui.newCharCampaign = el.getAttribute('data-campaign'); go('#/characters'); break;
      case 'delete-campaign':
        var cpid = el.getAttribute('data-id');
        if (ui.pendingDelete !== cpid) { ui.pendingDelete = cpid; el.textContent = 'Tap again to delete'; return; }
        sb.from('campaigns').delete().eq('id', cpid).then(function (r) {
          if (r.error) return fail(r.error, 'Could not delete the campaign.');
          ui.pendingDelete = null;
          Promise.all([loadWiki(), loadCharacters()]).then(function () { toast('Campaign deleted'); go('#/wiki'); });
        });
        break;
      case 'member-camp':
        var mu = el.getAttribute('data-user'), mc = el.getAttribute('data-camp');
        var op = el.getAttribute('aria-pressed') === 'true'
          ? sb.from('campaign_members').delete().eq('campaign_id', mc).eq('user_id', mu)
          : sb.from('campaign_members').insert({ campaign_id: mc, user_id: mu });
        op.then(function (r) {
          if (r.error) return fail(r.error, 'Could not change that player’s campaigns.');
          loadWiki().then(renderMembers);
        });
        break;
      case 'jump': var t = document.getElementById(el.getAttribute('data-target')); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); break;
      case 'pick-template': ui.selectedTemplate = el.getAttribute('data-name'); ui.pendingDelete = null; renderNew(); break;
      case 'use-template': ui.editTemplate = el.getAttribute('data-name'); go('#/edit'); break;
      case 'delete-template':
        var tid = el.getAttribute('data-id');
        if (ui.pendingDelete !== tid) { ui.pendingDelete = tid; el.textContent = 'Tap again to delete'; return; }
        sb.from('templates').delete().eq('id', tid).then(function (r) {
          if (r.error) return fail(r.error, 'Could not delete the template.');
          ui.pendingDelete = null; ui.selectedTemplate = 'Organization';
          loadWiki().then(function () { toast('Template deleted'); renderNew(); });
        });
        break;
      case 'delete-article':
        var aid = el.getAttribute('data-id');
        if (ui.pendingDelete !== aid) { ui.pendingDelete = aid; el.textContent = 'Tap again to delete'; return; }
        sb.from('articles').delete().eq('id', aid).then(function (r) {
          if (r.error) return fail(r.error, 'Could not delete the article.');
          ui.pendingDelete = null;
          loadWiki().then(function () { toast('Deleted'); go('#/wiki'); });
        });
        break;
      case 'preset':
        var name = el.getAttribute('data-name');
        if (name === 'Custom' && !look.custom) look.custom = clone(palette());
        look.preset = name; applyTheme(); saveLookSoon(); renderCustomize(); break;
      case 'font': look.font = el.getAttribute('data-name'); applyTheme(); saveLookSoon(); renderCustomize(); break;
      case 'corners': look.corners = el.getAttribute('data-name'); applyTheme(); saveLookSoon(); renderCustomize(); break;
      case 'reset-look': look = clone(DEFAULT_LOOK); applyTheme(); saveLookSoon(); renderCustomize(); break;
      case 'role':
        sb.rpc('set_member_role', { target: el.getAttribute('data-id'), new_role: el.getAttribute('data-role') }).then(function (r) {
          if (r.error) return fail(r.error, 'Could not change that player’s access.');
          loadMembers().then(function () { toast(el.getAttribute('data-role') === 'player' ? 'Approved' : 'Access removed'); renderMembers(); });
        });
        break;
      case 'reload-members': loadMembers().then(renderMembers).catch(function (err) { fail(err); }); break;
      case 'newchar': ui.newChar = true; renderCharacters(); var f = document.getElementById('nc-name'); if (f) f.focus(); break;
      case 'newchar-cancel': ui.newChar = false; renderCharacters(); break;
      case 'sheet-edit': ui.sheetEdit = !ui.sheetEdit; ui.pendingDelete = null; render(); break;
      case 'sheet-tab': ui.sheetTab = el.getAttribute('data-tab'); render(); break;
      case 'hp': case 'mp':
        if (!c) return;
        var amt = Math.max(0, num(document.getElementById(act === 'hp' ? 'hp-amt' : 'mp-amt').value, 0));
        var dir = num(el.getAttribute('data-dir'), 1);
        if (act === 'hp') {
          var hp = c.sheet.hp;
          var wasDown = num(hp.cur, 0) <= 0;
          c.sheet.death = Object.assign({ s: 0, f: 0 }, c.sheet.death || {});
          if (dir < 0) {
            var fromTemp = Math.min(num(hp.temp, 0), amt); hp.temp = num(hp.temp, 0) - fromTemp; hp.cur = Math.max(0, num(hp.cur, 0) - (amt - fromTemp));
            if (wasDown && amt - fromTemp > 0) { c.sheet.death.f = Math.min(3, c.sheet.death.f + 1); toast('Hit while down: one failed death save. A critical hit is two.'); }
          } else {
            hp.cur = Math.min(num(hp.max, 0), num(hp.cur, 0) + amt);
            if (wasDown && hp.cur > 0) c.sheet.death = { s: 0, f: 0 };
          }
        } else {
          var mp = c.sheet.mana;
          mp.cur = Math.max(0, Math.min(num(mp.max, 0), num(mp.cur, 0) + dir * amt));
        }
        render(); saveCharSoon(c); break;
      case 'hp-full': if (!c) return; c.sheet.hp.cur = num(c.sheet.hp.max, 0); render(); saveCharSoon(c); break;
      case 'mp-full': if (!c) return; c.sheet.mana.cur = num(c.sheet.mana.max, 0); render(); saveCharSoon(c); break;
      case 'cast': if (c) castSpell(c, num(el.getAttribute('data-i'), -1)); break;
      case 'learn': if (c) learnSpell(c, el.getAttribute('data-name'), el.getAttribute('data-src')); break;
      case 'pick-toggle': ui.spellPick = !ui.spellPick; render(); break;
      case 'pick-mode': ui.pick = Object.assign(ui.pick || { q: '', pay: true }, { mode: el.getAttribute('data-val') }); render(); break;
      case 'long-rest': if (c) longRest(c); break;
      case 'short-rest': if (c) shortRest(c); break;
      case 'font-magic': if (c) fontOfMagic(c, el.getAttribute('data-dir')); break;
      case 'inspiration': if (!c) return; c.sheet.inspiration = !c.sheet.inspiration; render(); saveCharSoon(c); break;
      case 'exhaustion': if (!c) return; c.sheet.exhaustion = Math.max(0, Math.min(6, num(c.sheet.exhaustion, 0) + num(el.getAttribute('data-dir'), 1))); render(); saveCharSoon(c); break;
      case 'condition':
        if (!c) return;
        if (!Array.isArray(c.sheet.conditions)) c.sheet.conditions = [];
        var cn = el.getAttribute('data-name'), ci = c.sheet.conditions.indexOf(cn);
        if (ci >= 0) c.sheet.conditions.splice(ci, 1); else c.sheet.conditions.push(cn);
        render(); saveCharSoon(c); break;
      case 'death':
        if (!c) return;
        var dsv = c.sheet.death = Object.assign({ s: 0, f: 0 }, c.sheet.death || {}), dk = el.getAttribute('data-kind');
        if (dk === 'reset') dsv.s = dsv.f = 0;
        else if (dk === 's') dsv.s = Math.min(3, dsv.s + 1);
        else if (dk === 'f') dsv.f = Math.min(3, dsv.f + 1);
        else if (dk === 'nat1') { dsv.f = Math.min(3, dsv.f + 2); toast('Natural 1: two failures.'); }
        else if (dk === 'nat20') { c.sheet.hp.cur = 1; c.sheet.death = { s: 0, f: 0 }; toast('Natural 20! Back up with 1 hit point.'); }
        render(); saveCharSoon(c); break;
      case 'res': if (c) useResource(c, el.getAttribute('data-key'), num(el.getAttribute('data-dir'), -1)); break;
      case 'debt-paid': if (c) { var dd = c.sheet.debts[num(el.getAttribute('data-i'), -1)]; if (dd) { dd.paid = !dd.paid; render(); saveCharSoon(c); } } break;
      case 'spend-hd': if (c) spendHitDie(c); break;
      case 'bd-class': case 'bd-species': case 'bd-bg':
        var bb = ui.build, val = el.getAttribute('data-val');
        if (act === 'bd-class') { if (bb.cls !== val) { bb.skills = []; bb.spells = []; bb.patron = ''; bb.sub = ''; } bb.cls = val; }
        else if (act === 'bd-species') { if (bb.species !== val) bb.skills = []; bb.species = val; }
        else { if (bb.bg !== val) bb.skills = []; bb.bg = val; }
        render(); break;
      case 'bd-patron':
        ui.build.patron = el.getAttribute('data-val');
        if (ui.build.sub && !subclassOptions(ui.build.cls, ui.build.patron).some(function (o) { return o.name === ui.build.sub; })) ui.build.sub = '';
        render(); break;
      case 'bd-sub': ui.build.sub = el.getAttribute('data-val'); render(); break;
      case 'bd-next':
        var berr = buildStepError(ui.build);
        if (berr) return toast(berr);
        ui.build.step = Math.min(buildSteps(ui.build).length - 1, ui.build.step + 1); render(); window.scrollTo(0, 0); break;
      case 'bd-back': ui.build.step = Math.max(0, ui.build.step - 1); render(); window.scrollTo(0, 0); break;
      case 'bd-method': ui.build.method = el.getAttribute('data-val'); ui.build.assign = {}; render(); break;
      case 'bd-pb':
        var k = el.getAttribute('data-ab'), v = num(ui.build.pb[k], 8) + num(el.getAttribute('data-dir'), 1);
        if (v >= 8 && v <= 15) { ui.build.pb[k] = v; if (pointsSpent(ui.build) > RULES.pointBuyBudget) { ui.build.pb[k] = v - 1; toast('Out of points.'); } }
        render(); break;
      case 'bd-skill': case 'bd-spell':
        var listKey = act === 'bd-skill' ? 'skills' : 'spells', item = el.getAttribute('data-val'), arr = ui.build[listKey], at = arr.indexOf(item);
        if (at >= 0) arr.splice(at, 1);
        else {
          if (act === 'bd-skill') { var cdb = RULES.classes[ui.build.cls], needS = cdb.skills.n + ((RULES.species[ui.build.species] || {}).extraSkill || 0); if (arr.length >= needS) return toast('That’s all your skills. Untick one to swap.'); }
          arr.push(item);
        }
        render(); break;
      case 'bd-create':
        var b2 = ui.build;
        if (!b2 || !b2.cls) return;
        insertCharacter(b2.name.trim(), b2.campaign || null, buildSheet(b2), false).then(function () { ui.build = null; });
        break;
      case 'lv-hp': ui.lvl.hp = el.getAttribute('data-val'); render(); break;
      case 'lv-asi': ui.lvl.asi = el.getAttribute('data-val'); ui.lvl.a = ''; ui.lvl.b = ''; render(); break;
      case 'lv-apply': var lc2 = charById(parseRoute().arg); if (lc2) applyLevelUp(lc2); break;
      case 'prof':
        if (!c) return;
        var key = el.getAttribute('data-key');
        if (el.getAttribute('data-kind') === 'save') c.sheet.saves[key] = !c.sheet.saves[key];
        else c.sheet.skills[key] = (num(c.sheet.skills[key], 0) + 1) % 3;
        render(); saveCharSoon(c); break;
      case 'qty':
        if (!c) return;
        var it = c.sheet.items[num(el.getAttribute('data-i'), -1)];
        if (!it) return;
        it.qty = Math.max(0, num(it.qty, 1) + num(el.getAttribute('data-dir'), 1));
        render(); saveCharSoon(c); break;
      case 'rm':
        if (!c) return;
        var list = c.sheet[el.getAttribute('data-list')];
        if (Array.isArray(list)) list.splice(num(el.getAttribute('data-i'), -1), 1);
        render(); saveCharSoon(c); break;
      case 'delete-char':
        var cid = el.getAttribute('data-id');
        if (ui.pendingDelete !== cid) { ui.pendingDelete = cid; el.textContent = 'Tap again to delete'; return; }
        sb.from('characters').delete().eq('id', cid).then(function (r) {
          if (r.error) return fail(r.error, 'Could not delete the character.');
          characters = characters.filter(function (x) { return x.id !== cid; });
          ui.pendingDelete = null; ui.sheetEdit = false;
          toast('Character deleted'); go('#/characters');
        });
        break;
    }
  });

  function rememberMapScroll() {
    var fr = document.getElementById('map-frame');
    if (fr) ui.mapScroll = { id: parseRoute().arg, left: fr.scrollLeft, top: fr.scrollTop };
  }

  document.addEventListener('toggle', function (e) {
    var d = e.target;
    if (d && d.getAttribute && d.hasAttribute('data-folder')) { ui.openFolders = ui.openFolders || {}; ui.openFolders[d.getAttribute('data-folder')] = d.open; }
  }, true);

  // Tapping the map while placing a marker.
  document.addEventListener('click', function (e) {
    var inner = e.target.closest('#map-inner');
    if (!inner || !ui.placing || e.target.closest('.pin')) return;
    var m = mapById(parseRoute().arg);
    if (!m) return;
    var rect = inner.getBoundingClientRect();
    var x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    var y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    rememberMapScroll();
    placeAt(m, x, y);
  });

  function currentChar() {
    var r = parseRoute();
    return r.name === 'c' ? charById(r.arg) : null;
  }

  document.addEventListener('input', function (e) {
    var t = e.target;
    if (t.hasAttribute && t.hasAttribute('data-watch')) {
      var wcamp = t.getAttribute('data-camp'), ww = t.getAttribute('data-watch');
      watchState(wcamp, ww)[t.getAttribute('data-wfield')] = t.value;
      var wres = document.getElementById('wt-res-' + ww);
      if (wres) wres.innerHTML = watchResultHtml(wcamp, ww);
      return;
    }
    if (t.id === 'home-search') {
      ui.homeQuery = t.value;
      var pos = t.selectionStart;
      renderHome();
      var s = document.getElementById('home-search');
      s.focus();
      try { s.setSelectionRange(pos, pos); } catch (err) {}
      return;
    }
    if (t.id === 'shop-q') {
      ui.shopQuery = t.value; var spos = t.selectionStart; render();
      var sq = document.getElementById('shop-q'); if (sq) { sq.focus(); try { sq.setSelectionRange(spos, spos); } catch (err) {} }
      return;
    }
    if (t.id === 'rep-q') {
      ui.repQuery = t.value; var rpos = t.selectionStart; render();
      var rq = document.getElementById('rep-q'); if (rq) { rq.focus(); try { rq.setSelectionRange(rpos, rpos); } catch (err) {} }
      return;
    }
    if (t.id === 'spell-search') {
      ui.spellFilter.q = t.value;
      var box = document.getElementById('spell-list');
      if (box) box.innerHTML = spellListHtml();
      return;
    }
    if (t.id === 'camp-search') {
      ui.campQuery = t.value;
      var cpos = t.selectionStart;
      render();
      var cs = document.getElementById('camp-search');
      cs.focus();
      try { cs.setSelectionRange(cpos, cpos); } catch (err) {}
      return;
    }
    if (t.hasAttribute('data-color')) {
      var key = t.getAttribute('data-color');
      var base = clone(palette());
      base[key] = t.value;
      look.custom = base; look.preset = 'Custom';
      applyTheme();
      var hex = document.getElementById('hex-' + key);
      if (hex) hex.textContent = t.value.toUpperCase();
      $view.querySelectorAll('.theme-card').forEach(function (card) {
        var on = card.getAttribute('data-name') === 'Custom';
        card.setAttribute('aria-pressed', on ? 'true' : 'false');
        if (on) { card.style.background = base.bg; card.style.color = base.text; var is = card.querySelectorAll('i'); is[0].style.background = base.panel; is[1].style.background = base.text; is[2].style.background = base.accent; }
      });
      saveLookSoon();
      return;
    }
    if (ui.subEdit && t.hasAttribute('data-subf') && t.tagName !== 'SELECT') { ui.subEdit[t.getAttribute('data-subf')] = t.value; return; }
    if (ui.subEdit && t.hasAttribute('data-subfeat')) { var sfi = ui.subEdit.features[num(t.getAttribute('data-i'), -1)]; if (sfi) sfi[t.getAttribute('data-subfeat')] = t.value; return; }
    if (t.getAttribute('data-build') === 'oath' && ui.build) { ui.build.oath = t.value; return; }
    if (t.getAttribute('data-build') === 'drawbacks' && ui.build) { ui.build.drawbacks = t.value; return; }
    if (t.getAttribute('data-build') === 'name' && ui.build) { ui.build.name = t.value; var hint = document.querySelector('.build-nav + .note'); if (hint) hint.hidden = !!t.value.trim(); return; }
    if (t.hasAttribute('data-manual') && ui.build) { ui.build.manual[t.getAttribute('data-manual')] = Math.max(3, Math.min(20, num(t.value, 10))); var sbx = document.getElementById('bd-scores'); if (sbx) sbx.innerHTML = buildScoresHtml(ui.build); return; }
    if (ui.lvl && t.hasAttribute('data-lv') && t.tagName === 'INPUT') { ui.lvl[t.getAttribute('data-lv')] = t.value; return; }
    if (t.id === 'pick-q') {
      ui.pick.q = t.value;
      var pc = currentChar(), ppos = t.selectionStart;
      if (pc) { render(); var pq = document.getElementById('pick-q'); if (pq) { pq.focus(); try { pq.setSelectionRange(ppos, ppos); } catch (err) {} } }
      return;
    }
    var c = currentChar();
    if (!c || !canEditChar(c)) return;
    var s = c.sheet;
    if (t.hasAttribute('data-cf')) { c[t.getAttribute('data-cf')] = t.value; saveCharSoon(c); }
    else if (t.hasAttribute('data-sf')) {
      var k = t.getAttribute('data-sf');
      s[k] = t.type === 'number' ? num(t.value, 0) : t.value;
      saveCharSoon(c);
    } else if (t.hasAttribute('data-ab')) { s.abilities[t.getAttribute('data-ab')] = Math.max(1, Math.min(30, num(t.value, 10))); saveCharSoon(c); }
    else if (t.hasAttribute('data-pool')) {
      var path = t.getAttribute('data-pool').split('.');
      s[path[0]][path[1]] = path[1] === 'regen' ? t.value : Math.max(0, num(t.value, 0));
      if (path[1] === 'max') s[path[0]].cur = Math.min(num(s[path[0]].cur, 0), num(s[path[0]].max, 0));
      saveCharSoon(c);
    } else if (t.hasAttribute('data-coin')) { s.coins[t.getAttribute('data-coin')] = Math.max(0, num(t.value, 0)); saveCharSoon(c); }
  });

  // Recalculate derived numbers once a field is finished.
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.hasAttribute && t.hasAttribute('data-watch')) { watchState(t.getAttribute('data-camp'), t.getAttribute('data-watch'))[t.getAttribute('data-wfield')] = t.value; return; }
    if (t.id === 'hd-kind') { ui.holdKind = t.value; ui.holdVessel = null; ui.holdDraftName = (document.getElementById('hd-name') || {}).value || ''; return render(); }
    if (t.id === 'hd-vessel' && ui.holdEdit === 'new') { ui.holdVessel = t.value; ui.holdDraftName = (document.getElementById('hd-name') || {}).value || ''; return render(); }
    if (t.id === 'wt-region') {
      ui.regionPick = ui.regionPick || {}; ui.regionPick[t.getAttribute('data-camp')] = t.value;
      ['day', 'night'].forEach(function (w2) { var rb = document.getElementById('wt-res-' + w2); if (rb) rb.innerHTML = watchResultHtml(t.getAttribute('data-camp'), w2); });
      return;
    }
    if (t.hasAttribute('data-spell-filter')) {
      ui.spellFilter[t.getAttribute('data-spell-filter')] = t.value;
      var sbox = document.getElementById('spell-list');
      if (sbox) sbox.innerHTML = spellListHtml();
      return;
    }
    if (t.hasAttribute('data-build') && ui.build) { ui.build[t.getAttribute('data-build')] = t.value; if (t.tagName === 'SELECT') render(); return; }
    if (t.hasAttribute('data-assign') && ui.build) { ui.build.assign[t.getAttribute('data-assign')] = t.value; return render(); }
    if (ui.lvl && t.hasAttribute('data-lv')) { ui.lvl[t.getAttribute('data-lv')] = t.value; if (t.tagName === 'SELECT') render(); return; }
    if (t.id === 'pick-pay' && ui.pick) { ui.pick.pay = t.checked; return; }
    if (t.hasAttribute('data-mana-override')) { var oc = currentChar(); if (oc) { oc.sheet.mana.override = t.checked; if (t.checked) oc.sheet.mana.max = manaMax(Object.assign({}, oc.sheet, { mana: Object.assign({}, oc.sheet.mana, { override: false }) })); saveCharSoon(oc); render(); } return; }
    if (t.hasAttribute('data-rep')) { var rp = t.getAttribute('data-rep').split('|'); return setStanding(rp[0], rp[1], t.value); }
    if (t.hasAttribute('data-shop-char')) { ui.shopChar = ui.shopChar || {}; ui.shopChar[t.getAttribute('data-shop-char')] = t.value; return render(); }
    if (t.id === 'shop-qty') { ui.shopQty = Math.max(1, num(t.value, 1)); return render(); }
    if (t.id === 'shop-disguise') {
      var dsh = shopById(t.getAttribute('data-shop')), dch = dsh && charById((ui.shopChar || {})[dsh.id]), dnt = dch && notoriety(dsh, dch);
      if (dnt) { autoRecog(dsh, dch, dnt, t.checked); render(); }
      return;
    }
    if (t.id === 'sh-kind') { var skh = document.getElementById('sh-kind-hint'); if (skh) skh.textContent = (ITEMS.shopKinds[t.value] || {}).about || ''; return; }
    if (t.hasAttribute('data-shop-row')) {
      var srow = shopById(t.getAttribute('data-id')), sri = num(t.getAttribute('data-shop-row'), -1), sf = t.getAttribute('data-sfield');
      if (!srow || !srow.stock[sri]) return;
      srow.stock[sri][sf] = sf === 'p' ? Math.max(0, Math.round(fnum(t.value, 0) * 100) / 100) : (t.value === '' ? null : Math.max(0, num(t.value, 0)));
      return saveShop(srow, 'Saved');
    }
    if (t.hasAttribute('data-place')) {
      var pf = t.getAttribute('data-pfield'), pp = {};
      pp[pf] = pf === 'size' ? num(t.value, 2) : fnum(t.value, 1);
      return savePlace(t.getAttribute('data-place'), pp);
    }
    if (ui.subEdit && t.id === 'sb-class') { ui.subEdit.class = t.value; if (t.value !== 'Paladin') ui.subEdit.patrons = ui.subEdit.patrons.filter(function (n) { return n !== OATH_ONLY; }); render(); return; }
    if (t.hasAttribute('data-bd-roll') && ui.build) {
      var bri = num(t.getAttribute('data-bd-roll'), 0), brv = num(t.value, 0);
      ui.build.rolls = (ui.build.rolls || []).slice(); while (ui.build.rolls.length < 6) ui.build.rolls.push(0);
      ui.build.rolls[bri] = brv >= 3 && brv <= 18 ? brv : 0; ui.build.assign = {};
      if (ui.build.rolls.every(function (v) { return v; })) render();
      return;
    }
    if (t.id === 'lv-rolled' && ui.lvl) {
      var lrc = charById(parseRoute().arg), lrd = lrc ? classOf(normSheet(lrc.sheet)) : null, lrv = num(t.value, 0);
      ui.lvl.rolled = lrd && lrv >= 1 && lrv <= lrd.hd ? lrv : 0; render(); return;
    }
    if (t.hasAttribute('data-iw')) {
      var wc = currentChar(), wi = wc && wc.sheet.items[num(t.getAttribute('data-iw'), -1)];
      if (!wi) return;
      if (t.value === '') delete wi.w; else wi.w = Math.max(0, parseFloat(t.value) || 0);
      saveCharSoon(wc); return;
    }
    if (t.hasAttribute('data-spell-rarity')) return setSpellRarity(t.getAttribute('data-spell-rarity'), t.value);
    if (t.hasAttribute('data-crime-status')) return updateCrime(t.getAttribute('data-crime-status'), { status: t.value });
    if (t.hasAttribute('data-travel') || t.hasAttribute('data-travel-text')) {
      var tcamp = campaignBySlug(parseRoute().arg);
      if (!tcamp) return;
      var key = t.getAttribute('data-travel') || t.getAttribute('data-travel-text');
      var patch = {}; patch[key] = key === 'map_id' ? (t.value || null) : t.value.trim();
      if (key === 'map_id') { patch.dest_x = null; patch.dest_y = null; }
      return saveTravel(tcamp.id, patch).then(function () { return ensureTravelMarkers(travel[tcamp.id]); }).then(render);
    }
    if (t.hasAttribute('data-crime-bounty')) return updateCrime(t.getAttribute('data-crime-bounty'), { bounty: Math.max(0, num(t.value, 0)) });
    if (t.id === 'place-char' && t.value) {
      ui.placing = { mapId: parseRoute().arg, kind: 'character', characterId: t.value };
      ui.pendingPin = null; ui.selectedMarker = null;
      rememberMapScroll(); return render();
    }
    if (currentChar() && (t.hasAttribute('data-ab') || t.hasAttribute('data-pool') || (t.hasAttribute('data-sf') && (t.type === 'number' || ['cls', 'species', 'subclass'].indexOf(t.getAttribute('data-sf')) >= 0)))) {
      // Wait until the tap that moved focus has finished (so its click isn't lost), then redraw and put focus back.
      setTimeout(function () {
        var active = document.activeElement && document.activeElement.id;
        render();
        var again = active ? document.getElementById(active) : null;
        if (again) again.focus();
      }, 200);
    }
  });

  document.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target, c = currentChar();
    switch (f.id) {
      case 'auth-form': return submitAuth();
      case 'edit-form': return saveEdit(f);
      case 'builder-form': return saveBuilder();
      case 'newchar-form': return createCharacter();
      case 'campaign-form': return saveCampaign(f);
      case 'crime-form': return saveCrime(f);
      case 'rules-form': return saveRules(f);
      case 'spell-form': return saveSpellForm(f);
      case 'sub-form': return saveSubclass();
      case 'shop-form': return saveShopForm(f);
      case 'shop-add':
        var sadd = shopById(f.getAttribute('data-id')), san = document.getElementById('sa-name').value.trim().slice(0, 80);
        if (!sadd || !san) return toast('Name the item.');
        var scat = itemByName(san), sap = document.getElementById('sa-price').value, saq = document.getElementById('sa-qty').value;
        var sprice = sap === '' ? (scat ? scat.price : null) : fnum(sap, 0);
        if (sprice === null) return toast('That one’s not on the list. Give it a price.');
        (sadd.stock = sadd.stock || []).push({ n: scat ? scat.name : san, k: scat ? scat.kind : 'z', p: Math.round(sprice * 100) / 100, q: saq === '' ? null : Math.max(0, num(saq, 0)) });
        saveShop(sadd, 'Added'); render();
        var nsa = document.getElementById('sa-name'); if (nsa) nsa.focus();
        return;
      case 'food-form': return saveFood(f);
      case 'scale-form': return saveScale();
      case 'pin-form': return savePin();
      case 'toll-form': return saveToll(f);
      case 'hold-form': return saveHoldForm(f);
      case 'estate-form': return saveEstateForm(f);
      case 'payday-form': return settlePayday(f);
      case 'ruin-form': return saveRuin(f);
      case 'map-form': return saveMap(f);
      case 'join-form': return submitJoin();
      case 'account-form':
        var name = document.getElementById('acc-name').value.trim().slice(0, 60);
        return sb.from('profiles').update({ display_name: name }).eq('id', uid()).then(function (r) {
          if (r.error) return fail(r.error, 'Could not save your name.');
          profile.display_name = name; toast('Saved'); renderAccount();
        });
      case 'add-spell':
        if (!c) return;
        var sn = document.getElementById('sp-name').value.trim();
        if (!sn) return toast('Name the spell first.');
        c.sheet.spells.push({ name: sn, source: document.getElementById('sp-src').value, cost: Math.max(0, num(document.getElementById('sp-cost').value, 0)), notes: '' });
        render(); saveCharSoon(c); var n1 = document.getElementById('sp-name'); if (n1) n1.focus(); return;
      case 'add-debt':
        if (!c) return;
        var dw = document.getElementById('db-what').value.trim(), dm2 = document.getElementById('db-mark').value.trim();
        if (!dw && !dm2) return toast('Describe the debt first.');
        c.sheet.debts.push({ spell: '', level: num(c.sheet.level, 1), debt: dw, mark: dm2, paid: false });
        render(); saveCharSoon(c); return;
      case 'add-attack':
        if (!c) return;
        var an = document.getElementById('at-name').value.trim();
        if (!an) return toast('Name the attack first.');
        c.sheet.attacks.push({ name: an, ab: document.getElementById('at-ab').value, dmg: document.getElementById('at-dmg').value.trim(), bonus: Math.max(0, num(document.getElementById('at-bonus').value, 0)), prof: document.getElementById('at-prof').checked });
        render(); saveCharSoon(c); return;
      case 'add-item':
        if (!c) return;
        var iname = document.getElementById('it-name').value.trim();
        if (!iname) return toast('Name the item first.');
        var iwv = document.getElementById('it-w') ? document.getElementById('it-w').value : '';
        var newItem = { name: iname, notes: document.getElementById('it-notes').value.trim(), qty: Math.max(1, num(document.getElementById('it-qty').value, 1)) };
        if (iwv !== '' && !isNaN(parseFloat(iwv))) newItem.w = Math.max(0, parseFloat(iwv));
        c.sheet.items.push(newItem);
        render(); saveCharSoon(c); var n2 = document.getElementById('it-name'); if (n2) n2.focus(); return;
      case 'add-feature':
        if (!c) return;
        var fname = document.getElementById('ft-name').value.trim();
        if (!fname) return toast('Name the feature first.');
        c.sheet.features.push({ name: fname, text: document.getElementById('ft-text').value.trim() });
        render(); saveCharSoon(c); return;
    }
  });

  window.addEventListener('hashchange', function () {
    ui.pendingDelete = null;
    var r = parseRoute();
    if (r.name !== 'c') ui.sheetEdit = false;
    if (r.name !== 'characters') { ui.newChar = false; ui.newCharCampaign = null; }
    if (r.name !== 'new' && r.name !== 'edit') ui.editCampaign = null;
    if (r.name !== 'campaign') ui.campQuery = '';
    if (r.name !== 'crimes') ui.crimeFilter = null;
    if (r.name !== 'map-edit') ui.mapCampaign = ui.mapCampaign && r.name === 'map-edit' ? ui.mapCampaign : null;
    ui.placing = null; ui.pendingPin = null; ui.selectedMarker = null; ui.scale = null;
    if (r.name !== 'map' || !ui.mapScroll || ui.mapScroll.id !== r.arg) { ui.mapZoom = 1; ui.mapScroll = null; }
    render();
    window.scrollTo(0, 0);
  });

  // Pick up changes made elsewhere (another device, or Claude) when the app comes back into view.
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState !== 'visible' || !isMember()) return;
    var r = parseRoute();
    if (['edit', 'builder', 'customize', 'c'].indexOf(r.name) >= 0) return;
    loadAll().then(render).catch(function () {});
  });

  /* ================= Boot ================= */
  try { var cached = readLocal('avarenth-look'); if (cached) look = normalizeLook(JSON.parse(cached)); } catch (e) {}
  applyTheme();

  if (!window.supabase || !cfg.supabaseUrl) { render(); return; }
  sb = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });

  var booted = null;
  function onSession(s) {
    var prev = uid();
    session = s;
    if (!s) { stopLive(); profile = null; articles = []; secrets = {}; characters = []; members = []; spells = null; loaded = { wiki: false, chars: false, members: false }; render(); return; }
    if (prev === s.user.id && booted) return;
    booted = loadProfile()
      .then(function () { render(); if (isMember()) return loadAll().then(startLive); })
      .then(render)
      .catch(function (e) { fail(e, 'Could not reach the archive. If the app sat unused for a week, the DM may need to resume it in Supabase.'); render(); });
  }
  sb.auth.getSession().then(function (r) { onSession(r.data.session); });
  sb.auth.onAuthStateChange(function (event, s) {
    if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') onSession(s);
    else if (s) session = s;
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('./sw.js').catch(function () {}); });
  }
})();
