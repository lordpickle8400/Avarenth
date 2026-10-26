"""Collect every spell a class can get from its official class and subclass features."""
import json, os, re, sys
D = sys.argv[1]
spells = json.load(open('work/spells_rated.json'))
by = {s['name'].lower(): s for s in spells}
SCH = {'A': 'Abjuration', 'C': 'Conjuration', 'D': 'Divination', 'E': 'Enchantment', 'V': 'Evocation', 'I': 'Illusion', 'N': 'Necromancy', 'T': 'Transmutation'}
def match_filter(f):
    parts = dict(p.split('=', 1) for p in f.split('|') if '=' in p)
    out = []
    for s in spells:
        if 'level' in parts and str(s['level']) not in parts['level'].split(';'): continue
        if 'class' in parts and not any(c.lower() in [x.lower() for x in s['classes']] for c in parts['class'].split(';')): continue
        if 'school' in parts and s['school'] not in [SCH.get(x.upper(), x) for x in parts['school'].split(';')]: continue
        out.append(s['name'])
    return out
WHOLE_LISTS = {'Fighter', 'Rogue'}  # Eldritch Knight and Arcane Trickster cast from the wizard list
def collect(node, acc, cls=''):
    if isinstance(node, str):
        n = re.sub(r'#.*$', '', node.split('|')[0]).strip().lower()
        if n in by: acc.add(by[n]['name'])
    elif isinstance(node, list):
        for x in node: collect(x, acc, cls)
    elif isinstance(node, dict):
        for k, v in node.items():
            if k in ('all', 'choose') and isinstance(v, str):
                if cls in WHOLE_LISTS: acc.update(match_filter(v))
            elif k in ('choose',) and isinstance(v, dict) and 'from' in v: collect(v['from'], acc, cls)
            elif k in ('ability', 'resourceName', 'name'): continue
            else: collect(v, acc, cls)
grants = {}
for fn in os.listdir(os.path.join(D, 'class')):
    if not fn.startswith('class-') or fn in ('class-mystic.json', 'class-sidekick.json'): continue
    d = json.load(open(os.path.join(D, 'class', fn)))
    for c in d.get('class', []):
        acc = grants.setdefault(c['name'], set())
        for a in c.get('additionalSpells', []) or []: collect(a, acc, c['name'])
    for sc in d.get('subclass', []):
        acc = grants.setdefault(sc['className'], set())
        for a in sc.get('additionalSpells', []) or []: collect(a, acc, sc['className'])
FT = {'ED': 'Monk', 'EI': 'Warlock', 'FS:P': 'Paladin', 'FS:R': 'Ranger', 'FS:F': 'Fighter'}
for o in json.load(open(os.path.join(D, 'optionalfeatures.json')))['optionalfeature']:
    for ft in o.get('featureType', []):
        if ft in FT:
            acc = grants.setdefault(FT[ft], set())
            for a in o.get('additionalSpells', []) or []: collect(a, acc, FT[ft])
new = {}
for cls, names in grants.items():
    add = sorted(n for n in names if cls not in by[n.lower()]['classes'])
    if add: new[cls] = add
json.dump(new, open('work/subclass_grants.json', 'w'), indent=1)
for k, v in sorted(new.items()): print(k, len(v), v[:12])
