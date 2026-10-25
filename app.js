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
    T('Places', 'Settlement', 'Cities, towns and villages, districts and all.', ['Region', 'Population', 'Ruler', 'Factions present'], ['Overview', 'Districts', 'Government', 'Trade', 'Notable places'], ['Hidden factions', 'Plot hooks']),
    T('Places', 'Location', 'A single place: a tavern, temple, ruin or fortress.', ['Type', 'Settlement', 'Owner'], ['Description', 'History', 'Who you find there'], ['Traps & secrets']),
    T('Places', 'Region', 'Islands, coasts, forests and seas.', ['Climate', 'Terrain', 'Settlements'], ['Geography', 'Wildlife', 'Dangers'], ['Undiscovered places']),
    T('Places', 'Country', 'Realms, empires and kingdoms.', ['Capital', 'Ruler', 'Government', 'Allies', 'Enemies'], ['Overview', 'History', 'Politics', 'Military', 'Economy'], ['Coming conflicts']),
    T('Groups', 'Organization', 'Factions, guilds, cults, noble houses and conspiracies.', ['Type', 'Leader', 'Members', 'Seat of power', 'Goal', 'Allies', 'Rivals'], ['Goals', 'Methods', 'History', 'Structure', 'Relations'], ['Secret agenda', 'Infiltrators']),
    T('Groups', 'Religion', 'Faiths, their gods and their followers.', ['Deities', 'Holy site', 'Clergy'], ['Beliefs', 'Rituals', 'Holy days', 'Schisms'], ['What is actually true']),
    T('Lore & Magic', 'Spell', 'One spell, built for your mana and tome systems.', ['School', 'Mana cost', 'Casting time', 'Range', 'Class access', 'Tome location'], ['Effect', 'Tradition variants', 'Lore'], ['Which faction guards the tome']),
    T('Lore & Magic', 'Magic System', 'How magic works, what it costs, who can use it.', ['Source', 'Practitioners', 'Limits', 'Replaces'], ['How it works', 'Costs', 'Learning'], ['Hidden rules']),
    T('Lore & Magic', 'Myth / Legend', 'Stories people tell, true or not.', ['Origin', 'Told by'], ['The story', 'Variations', 'Influence'], ['What really happened']),
    T('Lore & Magic', 'Tradition', 'Festivals, rites and customs.', ['Culture', 'When'], ['Origins', 'Practice', 'Meaning'], []),
    T('Lore & Magic', 'Language', 'How a people speak and write.', ['Speakers', 'Script', 'Family'], ['Sound & feel', 'Common phrases', 'Naming'], []),
    T('Things', 'Item', 'Weapons, relics, artifacts and trinkets.', ['Type', 'Rarity', 'Owner', 'Location'], ['Description', 'History', 'Properties'], ['Curse or hidden power']),
    T('Things', 'Ship', 'Vessels that sail the isles.', ['Class', 'Captain', 'Home port', 'Crew'], ['Description', 'History', 'Notable voyages'], ['Hidden cargo']),
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
  var preview = readLocal('avarenth-preview') === 'player' ? 'player' : 'dm';
  var ui = { homeFilter: null, homeQuery: '', pendingDelete: null, sheetEdit: false, sheetTab: 'Spells', authMode: 'signin', selectedTemplate: 'Organization', newChar: false };
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
    return String(text || '').split(/\n\s*\n/).map(function (p) {
      var html = esc(p.trim()).replace(/\n/g, '<br>');
      html = html.replace(/\[\[([^\]]+)\]\]/g, function (_, name) {
        var target = articleByTitle(unescapeName(name));
        if (target) return '<a class="link" href="#/a/' + encodeURIComponent(target.slug) + '">' + name + '</a>';
        return '<span class="missing">' + name + '</span>';
      });
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
      sb.from('articles').select('id, slug, title, template, summary, fields, sections, hidden, updated_at').order('updated_at', { ascending: false }),
      sb.from('templates').select('id, name, blurb, sidebar, sections, dm').order('name'),
      sb.from('settings').select('look').eq('id', 1).maybeSingle()
    ];
    if (isDM()) jobs.push(sb.from('article_secrets').select('article_id, dm, dm_notes'));
    return Promise.all(jobs).then(function (res) {
      res.forEach(function (r) { if (r.error) throw r.error; });
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
    return sb.from('characters').select('id, owner_id, name, sheet, ddb_url, updated_at').order('name').then(function (r) {
      if (r.error) throw r.error;
      characters = r.data || [];
      loaded.chars = true;
    });
  }
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
    var section = ({ wiki: 'wiki', a: 'wiki', 'new': 'wiki', edit: 'wiki', builder: 'wiki', customize: 'wiki', characters: 'characters', c: 'characters', members: 'members' })[r.name] || '';
    var tabs = [['wiki', 'Wiki'], ['characters', 'Characters']];
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
    var dmOnly = ['new', 'edit', 'builder', 'customize', 'members'];
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
      '<h1>AVARENTH</h1><p class="eyebrow sub">The Dornish Isles</p>' +
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
  function renderHome() {
    if (!loaded.wiki) { $view.innerHTML = '<div class="page"><div class="empty">Opening the archive…</div></div>'; return; }
    var list = visibleArticles();
    var groups = {};
    list.forEach(function (a) { var g = findTemplate(a.template).group; groups[g] = (groups[g] || 0) + 1; });
    var cats = CAT_ORDER.filter(function (g) { return groups[g]; });
    var q = ui.homeQuery.toLowerCase();
    var shown = list.filter(function (a) {
      if (ui.homeFilter && findTemplate(a.template).group !== ui.homeFilter) return false;
      if (q && String(a.title || '').toLowerCase().indexOf(q) < 0) return false;
      return true;
    });

    var html = '<section class="hero"><div class="hero-in"><p class="eyebrow">The Dornish Isles</p><h1>Avarenth</h1>' +
      (isDM() ? '<p class="crumbs">' + (dmView() ? 'DM view: everything, secrets included' : 'Player preview: what your table sees') + '</p>' : '') +
      '</div></section><div class="page">';
    if (dmView()) {
      html += '<div class="actions"><a class="btn primary" href="#/new">+ New article</a><a class="btn" href="#/customize">Customize</a></div>';
    }
    html += '<label class="search"><span class="sr">Search articles</span>' + SEARCH_ICON +
      '<input id="home-search" type="search" placeholder="Search Marloo, factions, spells…" value="' + esc(ui.homeQuery) + '" autocomplete="off"></label>';
    if (cats.length) {
      html += '<section class="block"><h2 class="sec-title">Categories</h2><div class="cats">';
      cats.forEach(function (g) {
        html += '<button type="button" class="cat" data-act="filter" data-group="' + esc(g) + '" aria-pressed="' + (ui.homeFilter === g) + '"><b>' + esc(CATEGORY_LABEL[g] || g) + '</b><span>' + groups[g] + (groups[g] === 1 ? ' article' : ' articles') + '</span></button>';
      });
      html += '</div></section>';
    }
    html += '<section class="block"><h2 class="sec-title">' + (ui.homeFilter ? esc(CATEGORY_LABEL[ui.homeFilter] || ui.homeFilter) + '<small><button type="button" class="btn small quiet" data-act="filter" data-group="">Show all</button></small>' : 'Latest Articles<small>' + shown.length + ' total</small>') + '</h2>';
    if (!shown.length) {
      html += '<div class="empty">' + (list.length ? 'Nothing matches that search.' : (dmView() ? 'No articles yet. Tap “New article” and pick a template to start.' : 'Nothing has been revealed yet.')) + '</div>';
    } else {
      html += '<div class="list">';
      shown.forEach(function (a) {
        html += '<a class="row" href="#/a/' + encodeURIComponent(a.slug) + '"><span class="row-main"><b>' + esc(a.title || 'Untitled') + '</b><span>' + esc(a.template) + '</span></span>' +
          (a.hidden && dmView() ? '<span class="tag">Hidden</span>' : '') + '</a>';
      });
      html += '</div>';
    }
    html += '</section></div>';
    $view.innerHTML = html;
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

    var html = '<section class="hero"><div class="hero-in"><p class="crumbs"><a href="#/wiki">Avarenth</a> › <button type="button" class="btn small quiet" style="min-height:0;padding:0;border:0;font-size:12px" data-act="filter-home" data-group="' + esc(tpl.group) + '">' + esc(CATEGORY_LABEL[tpl.group] || tpl.group) + '</button></p><h1>' + esc(a.title) + '</h1></div></section><div class="page">';
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
    var isNew = !slug;
    var a, sec = {};
    if (isNew) {
      a = { title: '', template: ui.editTemplate || 'Generic Article', summary: '', fields: {}, sections: [], hidden: false };
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
    var row = { title: get('f-title'), template: form.getAttribute('data-template'), summary: get('f-summary'), fields: {}, sections: [], hidden: !!document.getElementById('f-hidden').checked };
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
      html += '<button type="button" class="opt" data-act="font" data-name="' + esc(name) + '" aria-pressed="' + (look.font === name) + '"><span style="font-family:' + FONTS[name] + ';font-size:21px;font-weight:700">Dornish Isles</span><small>' + esc(name) + '</small></button>';
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
      return '<div class="tbl-row"><div class="main"><b>' + esc(m.display_name || 'Unnamed') + (you ? ' (you)' : '') + '</b><span>Joined ' + esc(new Date(m.created_at).toLocaleDateString()) + '</span></div>' + tag + btn + '</div>';
    };
    var html = '<div class="page narrow"><div><p class="eyebrow">Your table</p><h1 class="page-title">Players</h1><p class="note" style="margin:6px 0 0">Send your players the app link. When they create an account, approve them here.</p></div>';
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

  function renderCharacters() {
    if (!loaded.chars) { $view.innerHTML = '<div class="page"><div class="empty">Loading characters…</div></div>'; return; }
    var mine = characters.filter(function (c) { return c.owner_id === uid(); });
    var others = characters.filter(function (c) { return c.owner_id !== uid(); });
    var row = function (c, showOwner) {
      var s = normSheet(c.sheet);
      var line = ['Level ' + num(s.level, 1), s.species, s.cls].filter(Boolean).join(' · ');
      return '<a class="row" href="#/c/' + encodeURIComponent(c.id) + '"><span class="row-main"><b>' + esc(c.name) + '</b><span>' + esc(line) + (showOwner ? ' · ' + esc(memberName(c.owner_id)) : '') + '</span></span></a>';
    };
    var html = '<div class="page narrow"><div><p class="eyebrow">Characters</p><h1 class="page-title">' + (isDM() ? 'The party' : 'Your characters') + '</h1></div>';
    if (ui.newChar) {
      html += '<form class="form" id="newchar-form" novalidate><div class="field"><label for="nc-name">Character name</label><input type="text" id="nc-name" maxlength="80" placeholder="e.g. Kael Vorn" autofocus></div><div class="actions"><button type="submit" class="btn primary">Create</button><button type="button" class="btn" data-act="newchar-cancel">Cancel</button></div></form>';
    } else {
      html += '<div class="actions"><button type="button" class="btn primary" data-act="newchar">+ New character</button></div>';
    }
    html += '<section class="block"><h2 class="sec-title">' + (isDM() ? 'Yours (NPCs and spares)' : 'Yours') + '</h2>' + (mine.length ? '<div class="list">' + mine.map(function (c) { return row(c, false); }).join('') + '</div>' : '<div class="empty">No characters yet. Tap “New character” to make one.</div>') + '</section>';
    if (isDM()) html += '<section class="block"><h2 class="sec-title">Players’ characters</h2>' + (others.length ? '<div class="list">' + others.map(function (c) { return row(c, true); }).join('') + '</div>' : '<div class="empty">Your players haven’t made characters yet.</div>') + '</section>';
    html += '</div>';
    $view.innerHTML = html;
  }

  function createCharacter() {
    var name = document.getElementById('nc-name').value.trim();
    if (!name) { toast('Give your character a name.'); return; }
    sb.from('characters').insert({ name: name, owner_id: uid(), sheet: defaultSheet() }).select('id, owner_id, name, sheet, ddb_url, updated_at').single().then(function (r) {
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
      sb.from('characters').update({ name: c.name || 'Unnamed', sheet: c.sheet, ddb_url: ddb }).eq('id', c.id).then(function (r) {
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
        '</div><div class="field"><label for="ch-ddb">D&amp;D Beyond link (optional)</label><input type="url" id="ch-ddb" data-cf="ddb_url" value="' + esc(c.ddb_url || '') + '" placeholder="https://www.dndbeyond.com/characters/…"></div></div>';
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

    var tabs = ['Spells', 'Skills', 'Inventory', 'Features', 'Notes'];
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

  /* ================= Events ================= */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]');
    if (!el) return;
    var act = el.getAttribute('data-act');
    var c = currentChar();
    switch (act) {
      case 'signout': sb.auth.signOut(); break;
      case 'recheck': loadProfile().then(function () { if (isMember()) return Promise.all([loadWiki(), loadCharacters(), loadMembers()]); }).then(render).catch(function (err) { fail(err); }); break;
      case 'authmode': ui.authMode = el.getAttribute('data-mode'); renderAuth(); break;
      case 'preview':
        preview = el.getAttribute('data-mode');
        writeLocal('avarenth-preview', preview);
        render();
        break;
      case 'filter': ui.homeFilter = el.getAttribute('aria-pressed') === 'true' ? null : (el.getAttribute('data-group') || null); renderHome(); break;
      case 'filter-home': ui.homeFilter = el.getAttribute('data-group'); go('#/wiki'); break;
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
    if (r.name !== 'characters') ui.newChar = false;
    render();
    window.scrollTo(0, 0);
  });

  // Pick up changes made elsewhere (another device, or Claude) when the app comes back into view.
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState !== 'visible' || !isMember()) return;
    var r = parseRoute();
    if (['edit', 'builder', 'customize', 'c'].indexOf(r.name) >= 0) return;
    Promise.all([loadWiki(), loadCharacters(), loadMembers()]).then(render).catch(function () {});
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
    if (!s) { profile = null; articles = []; secrets = {}; characters = []; members = []; loaded = { wiki: false, chars: false, members: false }; render(); return; }
    if (prev === s.user.id && booted) return;
    booted = loadProfile()
      .then(function () { render(); if (isMember()) return Promise.all([loadWiki(), loadCharacters(), loadMembers()]); })
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
