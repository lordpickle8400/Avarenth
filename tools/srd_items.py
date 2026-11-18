"""Build gear.json for the Avarenth app from the SRD 5.2.1 equipment and magic items chapters (CC-BY-4.0).
Usage: python3 srd_items.py <srd md dir> <out.json>"""
import re, json, sys, html as H

MD, OUT = sys.argv[1], sys.argv[2]
eq = open(MD + '/equipment.md').read()
mi = open(MD + '/magic-items.md').read()

def clean(s):
    s = H.unescape(re.sub(r'<[^>]+>', '', s))
    s = re.sub(r'\*\*([^*]+)\*\*', r'\1', s)
    s = re.sub(r'(?<![A-Za-z0-9])_([^_]+)_(?![A-Za-z0-9])', r'\1', s)
    return re.sub(r'\s+', ' ', s).strip()

def table_after(text, title):
    i = text.index(title)
    t = text[text.index('<table', i):text.index('</table>', i)]
    rows, group = [], ''
    for tr in re.findall(r'<tr>(.*?)</tr>', t, re.S):
        g = re.search(r'<th colspan="\d+">(.*?)</th>', tr, re.S)
        if g: group = clean(g.group(1)); continue
        cells = [clean(c) for c in re.findall(r'<td[^>]*>(.*?)</td>', tr, re.S)]
        if cells: rows.append((group, cells))
    return rows

def lb(s):
    m = re.match(r'([\d.]+)\s*lb', s.replace(',', ''))
    if m: return float(m.group(1))
    m = re.match(r'([\d/]+)\s*lb', s)
    if m and '/' in m.group(1): a, b = m.group(1).split('/'); return float(a) / float(b)
    return 0

def paras(body):
    out = []
    for p in re.split(r'\n\s*\n', body.strip()):
        p = p.strip()
        if not p or p.startswith('<table') or p.startswith('|'): continue
        if '<table' in p: p = p[:p.index('<table')]
        p = clean(p)
        if p and not p.startswith('**') and p != '': out.append(p)
    return '\n\n'.join(x for x in out if x)

def sections(text, level):
    pat = re.compile(r'^' + '#' * level + r' (.+)$', re.M)
    ms = list(pat.finditer(text))
    return [(m.group(1).strip(), text[m.end():(ms[j + 1].start() if j + 1 < len(ms) else len(text))]) for j, m in enumerate(ms)]

out = {'source': 'System Reference Document 5.2.1 (CC-BY-4.0)', 'weapons': [], 'armor': [], 'gear': [], 'tools': [], 'packs': {}, 'magic': [], 'props': {}, 'mastery': {}}

# Weapon properties and mastery properties
wp = eq[eq.index('### Properties'):eq.index('### Mastery Properties')]
for name, txt in re.findall(r'\*\*([A-Za-z ]+)\.\*\* (.+)', wp): out['props'][name] = clean(txt)
mp = eq[eq.index('### Mastery Properties'):eq.index('**Weapons**')]
for name, txt in re.findall(r'\*\*([A-Za-z ]+)\.\*\* (.+)', mp): out['mastery'][name] = clean(txt)

for group, c in table_after(eq, '**Weapons**'):
    name, dmg, props, mastery, w, cost = c[:6]
    m = re.match(r'(\S+)\s+(\w+)', dmg)
    out['weapons'].append({'name': name, 'cat': group.replace(' Weapons', ''), 'dmg': m.group(1) if m else dmg, 'type': m.group(2) if m else '',
                           'props': [p.strip() for p in props.split(',') if p.strip() and p.strip() != '—'], 'mastery': mastery, 'w': lb(w), 'cost': cost})

for group, c in table_after(eq, '**Armor**\n'):
    name, ac, strn, stealth, w, cost = c[:6]
    cat = group.split(' (')[0].replace(' Armor', '')
    base = re.match(r'\+?(\d+)', ac)
    dex = 'full' if 'Dex modifier' in ac and 'max' not in ac else 'max2' if 'max 2' in ac else 'none'
    out['armor'].append({'name': name, 'cat': cat, 'ac': int(base.group(1)) if base else 0, 'shield': cat == 'Shield', 'dex': 'none' if cat in ('Shield', 'Heavy') else dex,
                         'str': int(re.sub(r'\D', '', strn)) if re.search(r'\d', strn) else 0, 'stealth': stealth == 'Disadvantage', 'w': lb(w), 'cost': cost, 'acText': ac})

# Adventuring gear: table for weight and cost, sections for what it does
desc = {n.split(' (')[0]: b for n, b in sections(eq[eq.index('## Adventuring Gear'):eq.index('## Mounts and Vehicles')], 4)}
for group, c in table_after(eq, '**Adventuring Gear**'):
    name, w, cost = c[:3]
    base = name.split(' (')[0]
    out['gear'].append({'name': name, 'w': lb(w), 'cost': cost, 'text': paras(desc.get(base, desc.get(name, '')))})
    m = re.search(r'contains the following items: (.+?)\.', desc.get(base, ''))
    if base.endswith('Pack') and m: out['packs'][base] = [clean(x) for x in re.split(r',\s*(?:and\s+)?|\s+and\s+', m.group(1)) if x.strip()]
# Ammunition, focuses and holy symbols come from their own small tables
for title, label in [('**Ammunition**', ''), ('**Arcane Focuses**', 'arcane focus'), ('**Druidic Focuses**', 'druidic focus'), ('**Holy Symbols**', 'holy symbol')]:
    if title in eq:
        for group, c in table_after(eq, title):
            if len(c) < 3: continue
            nm = re.sub(r'\s*\((also a Quarterstaff|worn or held|held|borne on fabric or a Shield)\)', '', c[0]).strip()
            if label: out['gear'].append({'name': nm + ' (' + label + ')', 'w': lb(c[-2]), 'cost': c[-1], 'text': 'Spellcasting focus.' + (' Also a Quarterstaff.' if 'Quarterstaff' in c[0] else '')})
            else: out['gear'].append({'name': nm, 'qty': int(re.sub(r'\D', '', c[1]) or 1), 'w': lb(c[-2]), 'cost': c[-1], 'text': 'Comes in a bundle of ' + c[1] + '; stored in a ' + c[2] + '.'})
out['gear'] = [g for g in out['gear'] if g['name'] not in ('Ammunition',)]
# Tools
tp = eq[eq.index('#### Artisan\'s Tools'):eq.index('## Adventuring Gear')]
for name, cost, body in re.findall(r'\*\*([^*]+?) \(([^)]+)\)\*\*\s*\n(.*?)(?=\n\*\*[^*]+? \([^)]+\)\*\*|\n#### |\Z)', tp, re.S):
    w = re.search(r'\*\*Weight:\*\* ([^\n*]+)', body)
    lines = [clean(l) for l in body.strip().split('\n') if l.strip()]
    out['tools'].append({'name': name.strip(), 'cost': cost, 'w': lb(w.group(1)) if w else 0, 'text': '\n'.join(lines)})

# Starting equipment by class (the SRD's "Choose A or B" lines), plus our own for the two non-SRD classes
cl = open(MD + '/classes.md').read()
out['startClass'] = {}
for cname, body in sections(cl, 2):
    m = re.search(r'<td>Starting Equipment</td>\s*<td>(.*?)</td>', body, re.S)
    if m: out['startClass'][cname] = clean(m.group(1))
out['startClass']['Artificer'] = "Choose A or B: (A) Studded Leather Armor, Dagger, Thieves' Tools, Tinker's Tools, Dungeoneer's Pack, and 16 GP; or (B) 150 GP"
out['startClass']['Blood Hunter'] = "Choose A or B: (A) Chain Shirt, Longsword, Light Crossbow, 20 Bolts, Alchemist's Supplies, Explorer's Pack, and 10 GP; or (B) 125 GP"

# Magic items
for name, body in sections(mi[mi.index('## Magic Items A–Z') if '## Magic Items A–Z' in mi else mi.index('#### '):], 4):
    hm = re.search(r'^_(.+?)_\s*$', body, re.M)
    head = clean(hm.group(1)) if hm else ''
    rest = body[hm.end():] if hm else body
    rar = re.search(r'(Common|Uncommon|Rare|Very Rare|Legendary|Artifact|Varies)', head)
    out['magic'].append({'name': name, 'kind': head.split(',')[0], 'rarity': rar.group(1) if rar else '', 'attune': 'Requires Attunement' in head, 'head': head, 'text': paras(rest)})

# Actions in combat and a few other glossary rules the sheet links to
gl = open(MD + '/rules-glossary.md').read()
out['actions'] = {}
for name, body in sections(gl, 4):
    m = re.match(r'(.+?) \[Action\]$', name)
    if m: out['actions'][m.group(1)] = paras(re.sub(r'_See also_.*', '', body))
    elif name in ('Opportunity Attacks', 'Unarmed Strike', 'Grappling', 'Shove', 'Two-Weapon Fighting'): out['actions'][name] = paras(re.sub(r'_See also_.*', '', body))

json.dump(out, open(OUT, 'w'), ensure_ascii=False, separators=(',', ':'))
print({k: len(v) for k, v in out.items() if k != 'source'})
