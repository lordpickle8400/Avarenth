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
    T('People', 'Culture', 'How a group lives: customs, values, food, names.', ['Region', 'Language', 'Religion'], ['Customs', 'Values', 'Food & dress', 'Naming'], ['Tensions']),
    T('People', 'Rank / Title', 'A position someone can hold, and what comes with it.', ['Organization', 'Held by', 'Succession'], ['Duties', 'Privileges', 'History'], ['Who really holds power']),
    T('Places', 'Settlement', 'Cities, towns and villages, districts and all.', ['Region', 'Population', 'Ruler', 'Factions present', 'Status'], ['Overview', 'Districts', 'Government', 'Trade', 'Notable places'], ['Hidden factions', 'Plot hooks']),
    T('Places', 'Location', 'A single place: a tavern, temple, ruin or fortress.', ['Type', 'Settlement', 'Owner', 'Status'], ['Description', 'History', 'Who you find there'], ['Traps & secrets']),
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
  var CATEGORY_LABEL = { 'People': 'People', 'Places': 'Geography', 'Groups': 'Organizations', 'Lore & Magic': 'Lore & Magic', 'Things': 'Items', 'History': 'History', 'Campaign & Novel': 'Campaign & Novel', 'General': 'General', 'Your templates': 'Your templates' };
  var CAT_ORDER = ['Places', 'Groups', 'Lore & Magic', 'People', 'Things', 'History', 'Campaign & Novel', 'Your templates', 'General'];

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
  var ui = { filters: {}, spellFilter: { q: '', rarity: '', level: '', cls: '', school: '', src: '' }, homeQuery: '', pendingDelete: null, sheetEdit: false, sheetTab: 'Spells', authMode: 'signin', selectedTemplate: 'Organization', newChar: false };
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
    return TEMPLATES.concat(customTemplates.map(function (t) { return Object.assign({}, t, { group: 'Your templates', custom: true }); }));
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
      var html = links(esc(p.trim()).replace(/\n/g, '<br>'));
      return html ? '<p>' + html + '</p>' : '';
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
    return sb.from('map_markers').select('id, map_id, kind, character_id, label, x, y, article_slug, target_map_id').eq('map_id', mapId).then(function (r) {
      if (r.error) throw r.error;
      markers[mapId] = r.data || [];
    });
  }
  function loadTravel() {
    return Promise.all([
      sb.from('travel_state').select('campaign_id, day, map_id, dest_x, dest_y, dest_label, mode, pace, terrain, rules, food, party_size, food_per_person'),
      sb.from('travel_log').select('id, campaign_id, day, text, miles, map_id, from_x, from_y, to_x, to_y, food_used, created_at').order('created_at', { ascending: false }).limit(500)
    ]).then(function (res) {
      res.forEach(function (r) { if (r.error) throw r.error; });
      travel = {};
      (res[0].data || []).forEach(function (t) { travel[t.campaign_id] = t; });
      travelLog = res[1].data || [];
    });
  }
  function loadAll() { return Promise.all([loadWiki(), loadCharacters(), loadMembers(), loadCrimes(), loadMaps(), loadTravel(), isDM() ? loadSpells() : null]); }
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
    var section = ({ wiki: 'wiki', a: 'wiki', 'new': 'wiki', edit: 'wiki', builder: 'wiki', customize: 'wiki', campaign: 'wiki', 'campaign-edit': 'wiki', join: 'wiki', crimes: 'wiki', travel: 'wiki', map: 'wiki', 'map-edit': 'wiki', characters: 'characters', c: 'characters', spells: 'spells', 'spell-new': 'spells', 'spell-edit': 'spells', members: 'members' })[r.name] || '';
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
    var dmOnly = ['new', 'edit', 'builder', 'customize', 'members', 'campaign-edit', 'map-edit'];
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

  // Categories plus the article list for one scope (the world, or one campaign).
  function articleBrowser(list, scope, emptyText) {
    var filter = (ui.filters || {})[scope] || null;
    var groups = {};
    list.forEach(function (a) { var g = findTemplate(a.template).group; groups[g] = (groups[g] || 0) + 1; });
    var cats = CAT_ORDER.filter(function (g) { return groups[g]; });
    var shown = list.filter(function (a) { return !filter || findTemplate(a.template).group === filter; });
    var html = '';
    if (cats.length > 1) {
      html += '<section class="block"><h2 class="sec-title">Categories</h2><div class="cats">';
      cats.forEach(function (g) {
        html += '<button type="button" class="cat" data-act="filter" data-scope="' + esc(scope) + '" data-group="' + esc(g) + '" aria-pressed="' + (filter === g) + '"><b>' + esc(CATEGORY_LABEL[g] || g) + '</b><span>' + groups[g] + (groups[g] === 1 ? ' article' : ' articles') + '</span></button>';
      });
      html += '</div></section>';
    }
    html += '<section class="block"><h2 class="sec-title">' + (filter ? esc(CATEGORY_LABEL[filter] || filter) + '<small><button type="button" class="btn small quiet" data-act="filter" data-scope="' + esc(scope) + '" data-group="">Show all</button></small>' : 'Articles<small>' + shown.length + ' total</small>') + '</h2>';
    html += shown.length ? '<div class="list">' + shown.map(function (a) { return articleRow(a, false); }).join('') + '</div>' : '<div class="empty">' + esc(emptyText) + '</div>';
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
    if (cq) {
      var hits = list.concat(world).filter(function (a) { return String(a.title || '').toLowerCase().indexOf(cq) >= 0; });
      html += '<section class="block"><h2 class="sec-title">Search results<small>' + hits.length + '</small></h2>' +
        (hits.length ? '<div class="list">' + hits.map(function (a) { return articleRow(a, true); }).join('') + '</div>' : '<div class="empty">Nothing matches that search.</div>') + '</section>';
    } else {
      html += articleBrowser(list, 'c-' + camp.id, dmView() ? 'No articles in this campaign yet.' : 'Nothing has been revealed in this campaign yet.');
      html += articleBrowser(world, 'cw-' + camp.id, 'No world lore yet.').replace('<h2 class="sec-title">Categories</h2>', '<h2 class="sec-title">World reference</h2>').replace(/>Articles<small>/, '>World lore<small>');
    }
    var record = crimeSummary(crimes.filter(function (c) { return c.campaign_id === camp.id && (dmView() || !c.dm_only); }));
    html += '<section class="block"><h2 class="sec-title">Criminal Record<small><a class="btn small quiet" href="#/crimes/' + encodeURIComponent(camp.slug) + '">Open tracker</a></small></h2>' + summaryVitals(record) + '</section>';
    var cmaps = mapsFor(camp.id);
    html += '<section class="block"><h2 class="sec-title">Maps' + (dmView() ? '<small><button type="button" class="btn small quiet" data-act="new-map" data-campaign="' + esc(camp.id) + '">+ Add map</button></small>' : '') + '</h2>' +
      (cmaps.length ? mapList(cmaps) : '<div class="empty">' + (dmView() ? 'No maps yet. Tap “Add map” to upload one.' : 'No maps shared yet.') + '</div>') + '</section>';
    html += '<section class="block"><h2 class="sec-title">' + (isDM() ? 'Party' : 'Your characters here') + '<small><button type="button" class="btn small quiet" data-act="newchar-in" data-campaign="' + esc(camp.id) + '">+ New character</button></small></h2>';
    html += party.length ? '<div class="list">' + party.map(function (c) { return charRow(c, isDM() && c.owner_id !== uid()); }).join('') + '</div>' : '<div class="empty">No characters in this campaign yet.</div>';
    html += '</section></div>';
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
  function defaultSheet() {
    return {
      species: '', cls: '', subclass: '', background: '', level: 1,
      abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
      ac: 10, speed: 30, initBonus: 0,
      hp: { cur: 10, max: 10, temp: 0 },
      mana: { cur: 0, max: 0, regen: '' },
      saves: {}, skills: {},
      spells: [], items: [], coins: { cp: 0, sp: 0, gp: 0, pp: 0 }, features: [], notes: ''
    };
  }
  function normSheet(s) {
    var d = defaultSheet();
    s = s && typeof s === 'object' ? s : {};
    var out = Object.assign(d, s);
    out.abilities = Object.assign(defaultSheet().abilities, s.abilities || {});
    out.hp = Object.assign(defaultSheet().hp, s.hp || {});
    out.mana = Object.assign(defaultSheet().mana, s.mana || {});
    out.coins = Object.assign(defaultSheet().coins, s.coins || {});
    ['saves', 'skills'].forEach(function (k) { if (!out[k] || typeof out[k] !== 'object') out[k] = {}; });
    ['spells', 'items', 'features'].forEach(function (k) { if (!Array.isArray(out[k])) out[k] = []; });
    return out;
  }
  function mod(score) { return Math.floor((num(score, 10) - 10) / 2); }
  function profBonus(level) { return 2 + Math.floor((Math.max(1, num(level, 1)) - 1) / 4); }
  function charById(id) { for (var i = 0; i < characters.length; i++) if (characters[i].id === id) return characters[i]; return null; }
  function canEditChar(c) { return !!c && (c.owner_id === uid() || isDM()); }

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
        '<div class="actions"><button type="submit" class="btn primary">Create</button><button type="button" class="btn" data-act="newchar-cancel">Cancel</button></div></form>';
    } else {
      html += '<div class="actions"><button type="button" class="btn primary" data-act="newchar">+ New character</button></div>';
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
    if (!any) html += '<div class="empty">No characters yet. Tap “New character” to make one.</div>';
    html += '</div>';
    $view.innerHTML = html;
  }

  function createCharacter() {
    var name = document.getElementById('nc-name').value.trim();
    if (!name) { toast('Give your character a name.'); return; }
    var campaignId = document.getElementById('nc-campaign').value || null;
    sb.from('characters').insert({ name: name, owner_id: uid(), sheet: defaultSheet(), campaign_id: campaignId }).select('id, owner_id, name, sheet, ddb_url, campaign_id, updated_at').single().then(function (r) {
      if (r.error) return fail(r.error, 'Could not create the character.');
      characters.push(r.data);
      ui.newChar = false;
      ui.sheetEdit = true;
      ui.sheetTab = 'Spells';
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

  function renderSheet(id) {
    if (!loaded.chars) { $view.innerHTML = '<div class="page"><div class="empty">Loading character…</div></div>'; return; }
    var c = charById(id);
    if (!c) { $view.innerHTML = '<div class="page narrow"><div class="empty">That character doesn’t exist, or it isn’t yours to see.</div><div class="actions"><a class="btn" href="#/characters">Back to characters</a></div></div>'; return; }
    var s = c.sheet = normSheet(c.sheet);
    var edit = ui.sheetEdit && canEditChar(c);
    var can = canEditChar(c);
    var pb = profBonus(s.level);
    var abil = {}; ABILITIES.forEach(function (a) { abil[a[0]] = mod(s.abilities[a[0]]); });
    var init = abil.dex + num(s.initBonus, 0);
    var perc = 10 + abil.wis + (num(s.skills['Perception'], 0) * pb);

    var who = ['Level ' + num(s.level, 1), s.species, s.cls, s.subclass ? '(' + s.subclass + ')' : '', s.background ? '· ' + s.background : ''].filter(Boolean).join(' ');
    var html = '<div class="page sheet" data-char="' + esc(c.id) + '">';
    html += '<div class="sheet-head"><div style="min-width:0"><p class="crumbs"><a href="#/characters">Characters</a>' + (c.owner_id !== uid() ? ' · ' + esc(memberName(c.owner_id)) : '') + '</p>';
    if (edit) {
      html += '<div class="field" style="margin-top:6px"><label for="ch-name">Name</label><input type="text" id="ch-name" data-cf="name" value="' + esc(c.name) + '" maxlength="80"></div>';
    } else {
      html += '<h1>' + esc(c.name) + '</h1><p class="who" style="margin:4px 0 0">' + esc(who) + '</p>';
    }
    html += '</div><div class="actions">' + (can ? '<span class="saved" id="saved" aria-live="polite"></span><button type="button" class="btn' + (edit ? ' primary' : '') + '" data-act="sheet-edit">' + (edit ? 'Done editing' : 'Edit sheet') + '</button>' : '') +
      (c.ddb_url && /^https:\/\//i.test(c.ddb_url) ? '<a class="btn quiet" href="' + esc(c.ddb_url) + '" target="_blank" rel="noopener noreferrer">D&amp;D Beyond ↗</a>' : '') + '</div></div>';

    if (edit) {
      html += '<div class="group-box"><h2>Basics</h2><div class="two">' +
        sheetInput('Species', 'species', s.species) + sheetInput('Class', 'cls', s.cls) +
        sheetInput('Subclass', 'subclass', s.subclass) + sheetInput('Background', 'background', s.background) +
        sheetInput('Level', 'level', s.level, 'number') + sheetInput('Armor class', 'ac', s.ac, 'number') +
        sheetInput('Speed (ft)', 'speed', s.speed, 'number') + sheetInput('Initiative bonus', 'initBonus', s.initBonus, 'number') +
        '</div><div class="field"><label for="ch-camp">Campaign</label><select id="ch-camp" data-cf="campaign_id">' + campaignOptions(c.campaign_id, true, 'No campaign') + '</select></div><div class="field"><label for="ch-ddb">D&amp;D Beyond link (optional)</label><input type="url" id="ch-ddb" data-cf="ddb_url" value="' + esc(c.ddb_url || '') + '" placeholder="https://www.dndbeyond.com/characters/…"></div></div>';
    }

    html += '<div class="abilities">';
    ABILITIES.forEach(function (a) {
      html += '<div class="ab"><span class="k">' + a[0] + '</span><span class="mod">' + signed(abil[a[0]]) + '</span>' +
        (edit ? '<label class="sr" for="ab-' + a[0] + '">' + a[1] + ' score</label><input type="number" id="ab-' + a[0] + '" data-ab="' + a[0] + '" min="1" max="30" value="' + num(s.abilities[a[0]], 10) + '">' : '<span class="score">' + num(s.abilities[a[0]], 10) + '</span>') + '</div>';
    });
    html += '</div><div class="vitals">' +
      vital('Armor', num(s.ac, 10)) + vital('Initiative', signed(init)) + vital('Speed', num(s.speed, 30) + ' ft') + vital('Proficiency', signed(pb)) + '</div>';

    var hpPct = Math.max(0, Math.min(100, Math.round(100 * num(s.hp.cur, 0) / Math.max(1, num(s.hp.max, 1)))));
    var mpPct = num(s.mana.max, 0) > 0 ? Math.max(0, Math.min(100, Math.round(100 * num(s.mana.cur, 0) / num(s.mana.max, 1)))) : 0;
    html += '<div class="pools">' +
      '<section class="pool" aria-label="Hit points"><div class="pool-top"><span class="k">Hit points</span><span class="v">' + num(s.hp.cur, 0) + ' <small>/ ' + num(s.hp.max, 0) + (num(s.hp.temp, 0) ? ' · ' + num(s.hp.temp, 0) + ' temp' : '') + '</small></span></div>' +
      '<div class="meter" role="img" aria-label="' + hpPct + '% health"><i style="width:' + hpPct + '%"></i></div>' +
      (can ? '<div class="pool-ctl"><label class="sr" for="hp-amt">Amount</label><input type="number" id="hp-amt" min="0" value="1" inputmode="numeric"><button type="button" class="btn small danger" data-act="hp" data-dir="-1">Damage</button><button type="button" class="btn small" data-act="hp" data-dir="1">Heal</button><button type="button" class="btn small quiet" data-act="hp-full">Full</button></div>' : '') +
      (edit ? '<div class="pool-edit"><label for="hp-max">Max</label><input type="number" id="hp-max" data-pool="hp.max" value="' + num(s.hp.max, 0) + '"><label for="hp-temp">Temp</label><input type="number" id="hp-temp" data-pool="hp.temp" value="' + num(s.hp.temp, 0) + '"></div>' : '') + '</section>' +
      '<section class="pool" aria-label="Mana"><div class="pool-top"><span class="k">Mana</span><span class="v">' + num(s.mana.cur, 0) + ' <small>/ ' + num(s.mana.max, 0) + '</small></span></div>' +
      '<div class="meter mana" role="img" aria-label="' + mpPct + '% mana"><i style="width:' + mpPct + '%"></i></div>' +
      (s.mana.regen && !edit ? '<span class="note">Regenerates: ' + esc(s.mana.regen) + '</span>' : '') +
      (can ? '<div class="pool-ctl"><label class="sr" for="mp-amt">Amount</label><input type="number" id="mp-amt" min="0" value="1" inputmode="numeric"><button type="button" class="btn small" data-act="mp" data-dir="-1">Spend</button><button type="button" class="btn small" data-act="mp" data-dir="1">Restore</button><button type="button" class="btn small quiet" data-act="mp-full">Full</button></div>' : '') +
      (edit ? '<div class="pool-edit"><label for="mp-max">Max</label><input type="number" id="mp-max" data-pool="mana.max" value="' + num(s.mana.max, 0) + '"><label for="mp-regen">Regen</label><input type="text" id="mp-regen" data-pool="mana.regen" value="' + esc(s.mana.regen) + '" placeholder="e.g. 2 per round" style="width:160px;text-align:left"></div>' : '') + '</section></div>';

    var tabs = ['Spells', 'Skills', 'Inventory', 'Features', 'Record', 'Notes'];
    html += '<div class="subtabs" role="tablist">' + tabs.map(function (t) { return '<button type="button" role="tab" data-act="sheet-tab" data-tab="' + t + '" aria-selected="' + (ui.sheetTab === t) + '">' + t + '</button>'; }).join('') + '</div>';
    html += '<div role="tabpanel">' + sheetTab(c, s, edit, can, abil, pb, perc) + '</div>';

    if (edit) html += '<div class="actions" style="justify-content:flex-end"><button type="button" class="btn danger" data-act="delete-char" data-id="' + esc(c.id) + '">' + (ui.pendingDelete === c.id ? 'Tap again to delete' : 'Delete character') + '</button></div>';
    html += '</div>';
    $view.innerHTML = html;
  }
  function sheetInput(label, key, val, type) {
    return '<div class="field"><label for="sf-' + key + '">' + label + '</label><input type="' + (type || 'text') + '" id="sf-' + key + '" data-sf="' + key + '" value="' + esc(val) + '"' + (type === 'number' ? ' inputmode="numeric"' : '') + '></div>';
  }
  function vital(k, v) { return '<div class="vital"><span class="k">' + k + '</span><span class="v">' + esc(v) + '</span></div>'; }

  function sheetTab(c, s, edit, can, abil, pb, perc) {
    var html = '';
    if (ui.sheetTab === 'Spells') {
      var ordered = s.spells.map(function (sp, i) { return { sp: sp, i: i }; }).sort(function (a, b) { return SPELL_SOURCES.indexOf(a.sp.source) - SPELL_SOURCES.indexOf(b.sp.source); });
      html += '<div class="tbl">';
      if (!ordered.length) html += '<div class="empty" style="margin-top:12px">No spells yet.' + (can ? ' Tap “Edit sheet” to add class spells, Universal spells and tomes you find.' : '') + '</div>';
      ordered.forEach(function (o) {
        var sp = o.sp, cost = num(sp.cost, 0);
        var art = articleByTitle(sp.name || '');
        var nameHtml = art ? '<a class="link" href="#/a/' + encodeURIComponent(art.slug) + '">' + esc(sp.name) + '</a>' : esc(sp.name);
        html += '<div class="tbl-row"><div class="main"><b>' + nameHtml + '</b><span>' + cost + ' mana' + (sp.notes ? ' · ' + esc(sp.notes) : '') + '</span></div><span class="src ' + esc(sp.source) + '">' + esc(sp.source) + '</span>' +
          (edit ? '<button type="button" class="btn small danger" data-act="rm" data-list="spells" data-i="' + o.i + '" aria-label="Remove ' + esc(sp.name) + '">Remove</button>'
            : can ? '<button type="button" class="btn small" data-act="cast" data-i="' + o.i + '"' + (num(s.mana.cur, 0) < cost ? ' disabled' : '') + '>Cast</button>' : '') + '</div>';
      });
      html += '</div>';
      if (edit) html += '<form class="inline-form" id="add-spell" novalidate style="margin-top:12px"><div class="field"><label for="sp-name">Spell</label><input type="text" id="sp-name" maxlength="80"></div><div class="field"><label for="sp-src">Source</label><select id="sp-src">' + SPELL_SOURCES.map(function (x) { return '<option>' + x + '</option>'; }).join('') + '</select></div><div class="field"><label for="sp-cost">Mana</label><input type="number" id="sp-cost" min="0" value="1" inputmode="numeric"></div><button type="submit" class="btn primary">Add</button></form>';
      html += '<p class="note" style="margin-top:12px">Class spells come from your class list, Universal spells are shared by everyone, and Tome spells are ones you found in the world. Spell names that match a wiki article link to it.</p>';
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
      html += '</div></section>';
    } else if (ui.sheetTab === 'Inventory') {
      html += '<div class="coins" style="margin-top:12px">' + ['cp', 'sp', 'gp', 'pp'].map(function (k) {
        return '<div class="vital"><label class="k" for="coin-' + k + '">' + k + '</label>' + (can ? '<input type="number" id="coin-' + k + '" data-coin="' + k + '" min="0" value="' + num(s.coins[k], 0) + '" inputmode="numeric">' : '<span class="v">' + num(s.coins[k], 0) + '</span>') + '</div>';
      }).join('') + '</div><div class="tbl" style="margin-top:12px">';
      if (!s.items.length) html += '<div class="empty">Nothing carried yet.</div>';
      s.items.forEach(function (it, i) {
        html += '<div class="tbl-row"><div class="main"><b>' + esc(it.name) + '</b>' + (it.notes ? '<span>' + esc(it.notes) + '</span>' : '') + '</div>' +
          (can ? '<button type="button" class="btn small" data-act="qty" data-i="' + i + '" data-dir="-1" aria-label="One fewer ' + esc(it.name) + '">−</button><span class="num" style="min-width:28px;text-align:center">' + num(it.qty, 1) + '</span><button type="button" class="btn small" data-act="qty" data-i="' + i + '" data-dir="1" aria-label="One more ' + esc(it.name) + '">+</button>' : '<span class="num">×' + num(it.qty, 1) + '</span>') +
          (edit ? '<button type="button" class="btn small danger" data-act="rm" data-list="items" data-i="' + i + '">Remove</button>' : '') + '</div>';
      });
      html += '</div>';
      if (can) html += '<form class="inline-form" id="add-item" novalidate style="margin-top:12px"><div class="field"><label for="it-name">Item</label><input type="text" id="it-name" maxlength="80"></div><div class="field"><label for="it-notes">Notes</label><input type="text" id="it-notes" maxlength="120"></div><div class="field"><label for="it-qty">Qty</label><input type="number" id="it-qty" min="1" value="1" inputmode="numeric"></div><button type="submit" class="btn primary">Add</button></form>';
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
      html += '<div class="stack" style="margin-top:12px">';
      if (!s.features.length) html += '<div class="empty">No features or traits yet.</div>';
      s.features.forEach(function (f, i) {
        html += '<section class="section" style="padding-bottom:12px;border-bottom:1px solid var(--soft)"><h2 style="font-size:19px;border:0;padding:0;display:flex;justify-content:space-between;gap:8px;align-items:center">' + esc(f.name) + (edit ? '<button type="button" class="btn small danger" data-act="rm" data-list="features" data-i="' + i + '">Remove</button>' : '') + '</h2><div class="prose">' + rich(f.text) + '</div></section>';
      });
      html += '</div>';
      if (edit) html += '<form class="form" id="add-feature" novalidate style="margin-top:12px"><div class="field"><label for="ft-name">Feature or trait</label><input type="text" id="ft-name" maxlength="80"></div><div class="field"><label for="ft-text">Description</label><textarea id="ft-text"></textarea></div><div class="actions"><button type="submit" class="btn primary">Add feature</button></div></form>';
    } else {
      html += '<div class="field" style="margin-top:12px"><label for="ch-notes">Notes</label>' + (can ? '<textarea id="ch-notes" data-sf="notes" style="min-height:240px" placeholder="Backstory, goals, people you’ve met, things to remember…">' + esc(s.notes) + '</textarea><span class="hint">Saves automatically.</span>' : '<div class="prose">' + (s.notes ? rich(s.notes) : '<p class="note">No notes.</p>') + '</div>') + '</div>';
    }
    return html;
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
    if (!dm) list = list.filter(function (mk) { return mk.kind === 'place' || m.show_markers; });
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
        (tcamp ? '<button type="button" class="btn small' + (placing && placing.kind === 'dest' ? ' primary' : '') + '" data-act="place" data-kind="dest">Set destination</button>' : '') +
        '<button type="button" class="btn small' + (placing && placing.kind && placing.kind.indexOf('cal') === 0 ? ' primary' : '') + '" data-act="place" data-kind="cal1">Calibrate scale</button>' +
        '<a class="btn small" href="#/map-edit/' + encodeURIComponent(m.id) + '">Edit map</a></div>' +
        (Number(m.miles_across) ? '<p class="note" style="margin:0">Scale: ' + Math.round(Number(m.miles_across)) + ' miles across.</p>' : '');
      if (tstate && tstate.map_id === m.id) html += '<div class="actions"><span class="tag plain" style="font-size:13px">Day ' + tstate.day + '</span><button type="button" class="btn small primary" data-act="next-day" data-camp="' + esc(tcamp.id) + '">Next day →</button><a class="btn small quiet" href="#/travel/' + encodeURIComponent(tcamp.slug) + '">Journey</a></div>';
      else if (tcamp && !Number(m.miles_across)) html += '<p class="note" style="margin:0">Tip: set this map’s width in miles under Edit map so travel can be measured.</p>';
      if (placing) html += '<div class="empty" style="padding:10px 14px;border-style:solid;border-color:var(--accent);color:var(--text)">Tap the map to place <b>' + esc(placing.kind === 'party' ? 'the party' : placing.kind === 'dest' ? 'the destination' : placing.kind === 'cal1' ? 'one end of the scale bar (e.g. the 0)' : placing.kind === 'cal2' ? 'the other end of the scale bar' : placing.kind === 'character' ? charName(placing.characterId) : placing.markerId ? 'this marker' : 'a new pin') + '</b>. <button type="button" class="btn small quiet" data-act="place-cancel">Cancel</button></div>';
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
    } else if (sel) {
      var art = null;
      if (sel.article_slug) art = articleBySlug(sel.article_slug);
      var tm = sel.target_map_id ? mapById(sel.target_map_id) : null;
      html += '<section class="group-box"><h2>' + esc(markerLabel(sel)) + '</h2><div class="actions">' +
        (art && (dm || !art.hidden) ? '<a class="btn small" href="#/a/' + encodeURIComponent(art.slug) + '">Read article</a>' : '') +
        (tm && (dm || tm.visible_to_players) ? '<a class="btn small" href="#/map/' + encodeURIComponent(tm.id) + '">Open ' + esc(tm.name) + '</a>' : '') +
        (dm ? '<button type="button" class="btn small" data-act="marker-move" data-id="' + esc(sel.id) + '">Move</button>' + (sel.kind === 'place' ? '<button type="button" class="btn small" data-act="pin-edit" data-id="' + esc(sel.id) + '">Edit</button>' : '') + '<button type="button" class="btn small danger" data-act="marker-delete" data-id="' + esc(sel.id) + '">' + (ui.pendingDelete === sel.id ? 'Tap again' : 'Remove') + '</button>' : '') +
        '<button type="button" class="btn small quiet" data-act="marker-close">Close</button></div></section>';
    }

    var people = list.filter(function (mk) { return mk.kind !== 'place'; });
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
      var near = (markers[m.id] || []).filter(function (mk) { return mk.kind === 'place'; }).sort(function (a, b) { return Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y); })[0];
      var label = near && Math.hypot(near.x - x, near.y - y) < 0.04 ? near.label : (travel[tc].dest_label || '');
      if (near && label === near.label) { x = near.x; y = near.y; }
      return saveTravel(tc, { map_id: m.id, dest_x: x, dest_y: y, dest_label: label }).then(function () { toast('Destination set'); render(); });
    }
    if (p.kind === 'place' && !p.markerId) { ui.pendingPin = { mapId: m.id, x: x, y: y }; ui.selectedMarker = null; return render(); }
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
  function weatherMul(t, r) { return Number((r || rulesOf(t)).weathers[t.weather] || 1); }
  function groundName(t, c) { return boatOf(t) ? WATER_NAMES[c] || c : rulesOf(t).ground[c] || c; }
  var GROUND_NAMES = { R: 'Main roads', r: 'Other roads', g: 'Open land', f: 'Forest', m: 'Mountains' };
  var GROUND_KEYS = ['R', 'r', 'g', 'f', 'm'];
  function groundOf(r, terrains) {
    var gmap = Object.assign({ R: 'Major Road', r: 'Normal Road', g: 'Rough Terrain', f: 'Rough Terrain', m: 'Mountain or Swamp' }, r.ground || {});
    Object.keys(gmap).forEach(function (k) { if (terrains.length && terrains.indexOf(gmap[k]) < 0) gmap[k] = terrains[Math.min(terrains.length - 1, k === 'r' || k === 'R' ? 0 : terrains.length - 1)]; });
    return gmap;
  }
  function milesPerDay(t) {
    var r = rulesOf(t), boat = boatOf(t);
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
    var r = rulesOf(t), boat = boatOf(t);
    if (boat && !grid.water) return null;
    var key = [m.id, t.mode, t.pace, t.weather, JSON.stringify(rulesOf(t).speeds[t.terrain] || ''), JSON.stringify((t.rules || {}).ground || ''), JSON.stringify(boat || ''), JSON.stringify(r.current), ax.toFixed(4), ay.toFixed(4), bx.toFixed(4), by.toFixed(4)].join('|');
    if (routeCache[key] !== undefined) return routeCache[key];
    var W = grid.w, H = grid.h, cells = boat ? grid.water : grid.cells;
    var speedOf, flow = function () { return 1; }, fastest;
    if (boat) {
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
      out.problem = boatOf(t) ? (grid.water ? 'No water route a ' + t.mode.toLowerCase() + ' can take from the party to the destination.' : 'Claude hasn’t read the water on ' + out.map.name + ' yet.')
        : 'No path over land for ' + t.mode.toLowerCase() + ' from the party to the destination.';
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
    var line = boatOf(t) ? t.mode + ' · ' + (t.weather || 'Fair') + (j.byMap ? ' · route over water' : ' · ' + fmtMiles(j.mpd) + ' a day')
      : j.byMap ? t.mode + ' · ' + t.pace + ' pace · terrain from the map' : t.mode + ' · ' + t.pace + ' pace · ' + t.terrain + ' · ' + fmtMiles(j.mpd) + ' a day';
    var dest = j.remaining != null ? (j.remaining < 0.1 ? 'Arrived' + (t.dest_label ? ' at ' + t.dest_label : '') : fmtMiles(j.remaining) + ' to ' + (t.dest_label || 'destination') + ' · about ' + j.days + (j.days === 1 ? ' day' : ' days')) : '';
    return '<section class="block"><h2 class="sec-title">Journey · Day ' + t.day + '<small><a class="btn small quiet" href="#/travel/' + encodeURIComponent(camp.slug) + '">Open journey</a></small></h2>' +
      '<div class="tbl"><div class="tbl-row"><div class="main"><b>' + esc(dest || (dmView() ? j.problem : 'On the road')) + '</b><span>' + esc(line) + '</span></div>' +
      (j.map && (dmView() || j.map.visible_to_players) ? '<a class="btn small" href="#/map/' + encodeURIComponent(j.map.id) + '">Map</a>' : '') + '</div></div></section>';
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
    if (dm) html += '<div class="actions"><button type="button" class="btn primary" data-act="next-day" data-camp="' + esc(camp.id) + '">Next day →</button><button type="button" class="btn" data-act="undo-day" data-camp="' + esc(camp.id) + '"' + (log.length ? '' : ' disabled') + '>Undo last day</button></div>';
    var gridOn = j.map && grids[j.map.id];
    var boat = boatOf(t);
    var modeSel = dm ? '<div class="field"><label for="tr-mode">Mode</label><select id="tr-mode" data-travel="mode"><optgroup label="Over land">' +
      r.modes.map(function (k) { return '<option' + (k === t.mode ? ' selected' : '') + '>' + esc(k) + '</option>'; }).join('') + '</optgroup>' +
      (r.boats.length ? '<optgroup label="By boat">' + r.boats.map(function (b) { return '<option' + (b.name === t.mode ? ' selected' : '') + '>' + esc(b.name) + '</option>'; }).join('') + '</optgroup>' : '') + '</select></div>'
      : sel('tr-mode', 'Mode', r.modes);
    var fitText = function (b) {
      var riv = { s: 'any river or stream', v: 'rivers and great rivers', b: 'great rivers only' }[b.river], sea = { c: 'coastal water', d: 'coastal and deep water' }[b.sea];
      return [riv ? 'fits ' + riv : 'stays off rivers', sea ? 'sails ' + sea : 'stays off the sea'].join(', ');
    };
    html += '<section class="block"><h2 class="sec-title">How they’re traveling<small>' + (boat ? fmtMiles(j.mpd) + ' a day before current' : gridOn ? 'Terrain read from the map' : fmtMiles(j.mpd) + ' a day') + '</small></h2><div class="' + (dm ? 'two' : 'vitals') + '"' + (dm ? '' : ' style="grid-template-columns:repeat(3,minmax(0,1fr))"') + '>' +
      modeSel + (boat ? sel('tr-weather', 'Weather', r.weathers) : sel('tr-pace', 'Pace', r.paces)) + (gridOn || boat ? '' : sel('tr-terrain', 'Terrain', r.terrains)) + '</div>' +
      (boat ? '<p class="note" style="margin:0">A ' + esc(boat.name.toLowerCase()) + ' ' + esc(fitText(boat)) + '. Downstream is ×' + r.current.down + ', upstream ×' + r.current.up + '.' + (gridOn && grids[j.map.id].water ? ' The route follows water it can use on ' + esc(j.map.name) + '.' : '') + '</p>'
        : gridOn ? '<p class="note" style="margin:0">The route follows the roads on ' + esc(j.map.name) + ' and each day’s distance uses the ground they actually cross: ' + GROUND_KEYS.map(function (c) { return GROUND_NAMES[c].toLowerCase() + ' as ' + esc(r.ground[c]); }).join(', ') + '.</p>'
        : (dm ? '<p class="note" style="margin:0">Change terrain as they move from road to forest to hills. Each day uses whatever is set when you tap Next day.</p>' : '')) + '</section>';

    html += '<section class="block"><h2 class="sec-title">Destination</h2>';
    if (dm) {
      var travelMaps = maps.filter(function (x) { return !x.campaign_id || x.campaign_id === camp.id; });
      html += '<div class="field"><label for="tr-map">Travel map</label><select id="tr-map" data-travel="map_id"><option value="">Choose a map…</option>' + travelMaps.map(function (x) { return '<option value="' + esc(x.id) + '"' + (x.id === t.map_id ? ' selected' : '') + '>' + esc(x.name) + (Number(x.miles_across) ? ' (' + x.miles_across + ' mi across)' : ' (no scale yet)') + '</option>'; }).join('') + '</select></div>' +
        '<div class="field"><label for="tr-dest">Destination name</label><input type="text" id="tr-dest" data-travel-text="dest_label" maxlength="60" value="' + esc(t.dest_label) + '" placeholder="e.g. Loreaon"></div>';
    }
    if (j.remaining != null) {
      html += '<div class="vitals sum">' + vital('Heading to', t.dest_label || 'Destination') + vital('Distance left', j.remaining < 0.1 ? 'Arrived' : fmtMiles(j.remaining)) + vital('Days to go', j.remaining < 0.1 ? 0 : (j.days == null ? '—' : j.days)) + (j.byMap ? vital('Route', boat ? 'By water' : 'Along roads') : vital('Per day', fmtMiles(j.mpd))) + '</div>';
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
        r.boats.concat([{ name: '', mi: '', river: 's', sea: 'c' }]).map(function (b, i) {
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

  function nextDay(campId) {
    var t = travel[campId];
    ensureTravelMarkers(t).then(function () {
      var j = journey(t);
      var day = t.day;
      var entry = { campaign_id: campId, day: day, miles: 0, map_id: t.map_id || null };
      var moveOp = Promise.resolve({});
      if (j.byMap && j.route && j.remaining >= 0.1) {
        var budget = 1, miles = 0, byGround = {}, pts = j.route.pts, legs = j.route.legs, pos = pts[0];
        for (var k = 0; k < legs.length && budget > 1e-9; k++) {
          var lg = legs[k], frac = Math.min(1, budget / lg.days);
          pos = { x: pts[k].x + (pts[k + 1].x - pts[k].x) * frac, y: pts[k].y + (pts[k + 1].y - pts[k].y) * frac };
          miles += lg.miles * frac; budget -= lg.days * frac;
          var gname = groundName(t, lg.ground);
          byGround[gname] = (byGround[gname] || 0) + lg.miles * frac;
        }
        var arrivedR = budget > 1e-9;
        if (arrivedR) pos = { x: t.dest_x, y: t.dest_y };
        var mix = Object.keys(byGround).sort(function (a, b) { return byGround[b] - byGround[a]; }).filter(function (k2) { return byGround[k2] >= 0.5; })
          .map(function (k2) { return k2.toLowerCase() + ' (' + fmtMiles(byGround[k2]) + ')'; });
        entry.miles = Math.round(miles * 10) / 10;
        entry.from_x = j.party.x; entry.from_y = j.party.y; entry.to_x = pos.x; entry.to_y = pos.y;
        entry.text = 'Traveled ' + fmtMiles(miles) + ' by ' + t.mode.toLowerCase() + (boatOf(t) ? ' in ' + (t.weather || 'Fair').toLowerCase() + ' weather' : ' at a ' + t.pace.toLowerCase() + ' pace') + (mix.length ? ': ' + mix.join(', ') : '') + '.' + (arrivedR ? ' Arrived' + (t.dest_label ? ' at ' + t.dest_label : '') + '.' : '');
        moveOp = sb.from('map_markers').update({ x: pos.x, y: pos.y }).eq('id', j.party.id);
      } else if (j.remaining != null && j.mpd > 0 && j.remaining >= 0.1) {
        var step = Math.min(j.mpd, j.remaining);
        var f = step / j.remaining;
        var nx = j.party.x + (t.dest_x - j.party.x) * f, ny = j.party.y + (t.dest_y - j.party.y) * f;
        var arrived = step >= j.remaining - 0.05;
        if (arrived) { nx = t.dest_x; ny = t.dest_y; }
        entry.miles = Math.round(step * 10) / 10;
        entry.from_x = j.party.x; entry.from_y = j.party.y; entry.to_x = nx; entry.to_y = ny;
        entry.text = 'Traveled ' + fmtMiles(step) + ' by ' + t.mode.toLowerCase() + (boatOf(t) ? ' in ' + (t.weather || 'Fair').toLowerCase() + ' weather.' : ' through ' + t.terrain.toLowerCase() + ' at a ' + t.pace.toLowerCase() + ' pace.') + (arrived ? ' Arrived' + (t.dest_label ? ' at ' + t.dest_label : '') + '.' : '');
        moveOp = sb.from('map_markers').update({ x: nx, y: ny }).eq('id', j.party.id);
      } else {
        entry.text = j.remaining != null && j.remaining < 0.1 ? 'Stayed' + (t.dest_label ? ' at ' + t.dest_label : '') + '.' : 'A day passed.';
      }
      var need = foodPerDay(t), have = Number(t.food || 0);
      var used = Math.min(need, have);
      entry.food_used = used;
      if (need > 0) entry.text += used < need ? ' Ran out of food (short ' + (Math.round((need - used) * 10) / 10) + ').' : ' Ate ' + used + ' food, ' + (Math.round((have - used) * 10) / 10) + ' left.';
      return moveOp.then(function (r) {
        if (r.error) throw r.error;
        return sb.from('travel_log').insert(entry);
      }).then(function (r) {
        if (r.error) throw r.error;
        return sb.from('travel_state').update({ day: day + 1, food: Math.round((have - used) * 10) / 10 }).eq('campaign_id', campId);
      }).then(function (r) {
        if (r.error) throw r.error;
        return Promise.all([loadTravel(), t.map_id ? loadMarkers(t.map_id) : null]);
      }).then(function () { toast('Day ' + (day + 1)); render(); });
    }).catch(function (e) { fail(e, 'Could not advance the day.'); });
  }

  function undoDay(campId) {
    var last = travelLog.filter(function (l) { return l.campaign_id === campId; })[0];
    if (!last) return;
    var steps = [];
    if (last.map_id && last.from_x != null) {
      var pm = partyMarker(last.map_id);
      if (pm) steps.push(sb.from('map_markers').update({ x: last.from_x, y: last.from_y }).eq('id', pm.id));
    }
    Promise.all(steps).then(function (res) {
      res.forEach(function (r) { if (r.error) throw r.error; });
      return sb.from('travel_log').delete().eq('id', last.id);
    }).then(function (r) {
      if (r.error) throw r.error;
      return sb.from('travel_state').update({ day: last.day, food: Number(travel[campId].food || 0) + Number(last.food_used || 0) }).eq('campaign_id', campId);
    }).then(function (r) {
      if (r.error) throw r.error;
      return Promise.all([loadTravel(), last.map_id ? loadMarkers(last.map_id) : null]);
    }).then(function () { toast('Back to day ' + last.day); render(); })
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
    var patch = { rules: { modes: modes, terrains: terrains, speeds: speeds, paces: paces, ground: ground, boats: boats, weathers: weathers, current: current } };
    if (modes.indexOf(t.mode) < 0 && !boats.some(function (b) { return b.name === t.mode; })) patch.mode = modes[0];
    if (!(t.weather in weathers)) patch.weather = Object.keys(weathers)[0];
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
    if (['edit', 'builder', 'customize', 'campaign-edit', 'map-edit', 'spell-new', 'spell-edit'].indexOf(r.name) >= 0) return true;
    if (ui.pendingPin || ui.placing) return true;
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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'spells' }, function () { if (spells !== null || isDM()) liveRefresh(loadSpells); })
      .subscribe();
  }
  function stopLive() { if (liveChannel) { sb.removeChannel(liveChannel); liveChannel = null; } }

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
      case 'preview':
        preview = el.getAttribute('data-mode');
        writeLocal('avarenth-preview', preview);
        render();
        break;
      case 'filter':
        ui.filters = ui.filters || {};
        ui.filters[el.getAttribute('data-scope')] = el.getAttribute('aria-pressed') === 'true' ? null : (el.getAttribute('data-group') || null);
        render(); break;
      case 'filter-home':
        ui.filters = ui.filters || {};
        ui.filters[el.getAttribute('data-scope')] = el.getAttribute('data-group');
        go(el.getAttribute('data-target') || '#/wiki'); break;
      case 'spell-approve': return reviewSpell(el.getAttribute('data-name'), true);
      case 'spell-return': return reviewSpell(el.getAttribute('data-name'), false);
      case 'spell-delete': return deleteSpell(el.getAttribute('data-name'));
      case 'new-article': ui.editCampaign = el.getAttribute('data-campaign') || null; go('#/new'); break;
      case 'crime-filter': ui.crimeFilter = el.getAttribute('data-f'); render(); break;
      case 'next-day': el.disabled = true; rememberMapScroll(); nextDay(el.getAttribute('data-camp')); break;
      case 'undo-day': el.disabled = true; undoDay(el.getAttribute('data-camp')); break;
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
      case 'marker':
        if (ui.placing) return;
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
          if (dir < 0) { var fromTemp = Math.min(num(hp.temp, 0), amt); hp.temp = num(hp.temp, 0) - fromTemp; hp.cur = Math.max(0, num(hp.cur, 0) - (amt - fromTemp)); }
          else hp.cur = Math.min(num(hp.max, 0), num(hp.cur, 0) + amt);
        } else {
          var mp = c.sheet.mana;
          mp.cur = Math.max(0, Math.min(num(mp.max, 0), num(mp.cur, 0) + dir * amt));
        }
        render(); saveCharSoon(c); break;
      case 'hp-full': if (!c) return; c.sheet.hp.cur = num(c.sheet.hp.max, 0); render(); saveCharSoon(c); break;
      case 'mp-full': if (!c) return; c.sheet.mana.cur = num(c.sheet.mana.max, 0); render(); saveCharSoon(c); break;
      case 'cast':
        if (!c) return;
        var sp = c.sheet.spells[num(el.getAttribute('data-i'), -1)];
        if (!sp) return;
        var cost = num(sp.cost, 0);
        if (num(c.sheet.mana.cur, 0) < cost) return toast('Not enough mana.');
        c.sheet.mana.cur = num(c.sheet.mana.cur, 0) - cost;
        toast('Cast ' + sp.name + (cost ? ' (−' + cost + ' mana)' : ''));
        render(); saveCharSoon(c); break;
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
    if (t.id === 'home-search') {
      ui.homeQuery = t.value;
      var pos = t.selectionStart;
      renderHome();
      var s = document.getElementById('home-search');
      s.focus();
      try { s.setSelectionRange(pos, pos); } catch (err) {}
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
    if (t.hasAttribute('data-spell-filter')) {
      ui.spellFilter[t.getAttribute('data-spell-filter')] = t.value;
      var sbox = document.getElementById('spell-list');
      if (sbox) sbox.innerHTML = spellListHtml();
      return;
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
    if (currentChar() && (t.hasAttribute('data-ab') || t.hasAttribute('data-pool') || (t.hasAttribute('data-sf') && t.type === 'number'))) {
      var id = t.id;
      render();
      var again = document.getElementById(id);
      if (again) again.focus();
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
      case 'food-form': return saveFood(f);
      case 'scale-form': return saveScale();
      case 'pin-form': return savePin();
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
      case 'add-item':
        if (!c) return;
        var iname = document.getElementById('it-name').value.trim();
        if (!iname) return toast('Name the item first.');
        c.sheet.items.push({ name: iname, notes: document.getElementById('it-notes').value.trim(), qty: Math.max(1, num(document.getElementById('it-qty').value, 1)) });
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
