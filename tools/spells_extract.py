import json, sys, os
D = sys.argv[1]
idx = json.load(open(os.path.join(D, 'index.json')))
src = json.load(open(os.path.join(D, 'sources.json')))
SCHOOL = {'A': 'Abjuration', 'C': 'Conjuration', 'D': 'Divination', 'E': 'Enchantment', 'V': 'Evocation', 'I': 'Illusion', 'N': 'Necromancy', 'T': 'Transmutation'}
BOOK = {'PHB': "Player's Handbook", 'XPHB': "Player's Handbook (2024)", 'XGE': "Xanathar's Guide", 'TCE': "Tasha's Cauldron", 'EGW': "Explorer's Guide to Wildemount", 'FTD': "Fizban's Treasury", 'SCC': 'Strixhaven', 'AI': 'Acquisitions Incorporated', 'AAG': "Astral Adventurer's Guide", 'BMT': 'Book of Many Things', 'GGR': "Guildmasters' Guide to Ravnica", 'IDRotF': 'Rime of the Frostmaiden', 'LLK': 'Lost Laboratory of Kwalish', 'SatO': 'Sigil and the Outlands', 'AitFR-AVT': 'Adventures in the Forgotten Realms', 'AU': 'Arcana Unleashed', 'EFA': 'Eberron: Forge of the Artificer', 'FRHoF': 'Heroes of Faerûn'}
PREF = ['PHB', 'XGE', 'TCE', 'XPHB']
spells = {}
for code, fn in idx.items():
    for s in json.load(open(os.path.join(D, fn))).get('spell', []):
        name = s['name']
        cls = set()
        entry = (src.get(code) or {}).get(name) or {}
        for c in entry.get('class', []) or []:
            cls.add(c['name'])
        for c in entry.get('classVariant', []) or []:
            cls.add(c['name'])
        dur = s.get('duration') or []
        rec = {'name': name, 'level': s.get('level', 0), 'school': SCHOOL.get(s.get('school'), s.get('school')),
               'source': code, 'book': BOOK.get(code, code), 'ritual': bool((s.get('meta') or {}).get('ritual')),
               'concentration': any(d.get('concentration') for d in dur), 'classes': sorted(cls)}
        key = name.lower()
        old = spells.get(key)
        if old is None:
            spells[key] = rec
        else:
            # keep the 2014 printing as the main entry, but merge class lists
            rank = lambda r: PREF.index(r['source']) if r['source'] in PREF else 2.5
            keep, other = (old, rec) if rank(old) <= rank(rec) else (rec, old)
            keep['classes'] = sorted(set(keep['classes']) | set(other['classes']))
            spells[key] = keep
out = sorted(spells.values(), key=lambda r: (r['level'], r['name']))
json.dump(out, open(sys.argv[2], 'w'), indent=0)
from collections import Counter
print(len(out), Counter(r['source'] for r in out))
print(Counter(r['level'] for r in out))
print('no classes:', [r['name'] for r in out if not r['classes']][:40])
