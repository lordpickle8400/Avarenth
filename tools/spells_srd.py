"""Pull every spell's text out of the SRD 5.2.1 spells chapter (CC-BY-4.0) and rewrite spell slots as Avarenth mana.
Usage: python3 spells_srd.py <srd md dir> <out.json>
Output: {normalized name: {name, casting_time, range, components, duration, description}}.
The description is plain text: paragraphs split by a blank line, list items starting with '- '."""
import re, json, sys, html

MD, OUT = sys.argv[1], sys.argv[2]
COST = {1: 5, 2: 10, 3: 18, 4: 28, 5: 40, 6: 60, 7: 85, 8: 110, 9: 150}
ORD = {1: '1st', 2: '2nd', 3: '3rd', 4: '4th', 5: '5th', 6: '6th', 7: '7th', 8: '8th', 9: '9th'}

text = open(MD + '/spells.md').read()
text = text[text.index('## Spell Descriptions') if '## Spell Descriptions' in text else 0:]

def plain(s):
    s = html.unescape(re.sub(r'<[^>]+>', '', s))
    s = re.sub(r'\*\*([^*]+)\*\*', r'\1', s)
    s = re.sub(r'(?<![A-Za-z0-9])_([^_]+)_(?![A-Za-z0-9])', r'\1', s)
    return s.strip()

def mana(n):
    return 'the %d mana of %s %s-level spell' % (COST[n], 'an' if n == 8 else 'a', ORD[n])

def rng(a, b, sep='–'):
    return 'mana for level %d%s%d (%d%s%d)' % (a, sep, b, COST[a], sep, COST[b])

def upcast_lead(level):
    steps = ', '.join('%s %d' % (ORD[l], COST[l]) for l in range(level + 1, 10))
    return ('Spending More Mana. You can cast this as a higher-level spell by paying that level\'s cost (%s). '
            '6th to 8th level also needs a High Magic Charge, 9th a Reality Channel.' % steps) if level < 9 else ''

def fix_slots(t):
    t = re.sub(r'for each spell slot level above (\d)', r'for each level above \1 you pay for', t)
    t = re.sub(r'for each slot level above (\d)', r'for each level above \1 you pay for', t)
    t = re.sub(r'(?:a |the )?spell slot of level (\d)[–-](\d)', lambda m: rng(int(m.group(1)), int(m.group(2))), t)
    t = re.sub(r'(?:a |the )?spell slot of level (\d)\+', lambda m: 'mana for level %s or higher (%d+)' % (m.group(1), COST[int(m.group(1))]), t)
    t = re.sub(r'(?:a |the )?spell slot of level (\d)\b', lambda m: 'mana for level %s (%d)' % (m.group(1), COST[int(m.group(1))]), t)
    t = re.sub(r'(?:a |an )?level (\d)[–-](\d) (?:spell )?slot', lambda m: rng(int(m.group(1)), int(m.group(2))), t)
    t = re.sub(r'(?:a |an )?level (\d) or (\d) (?:spell )?slot', lambda m: rng(int(m.group(1)), int(m.group(2)), ' or '), t)
    t = re.sub(r'\b(?:a |an )?level (\d)\+? spell slot', lambda m: mana(int(m.group(1))), t)
    t = re.sub(r'\(level (\d)[–-](\d) slot\)', lambda m: '(%d–%d mana)' % (COST[int(m.group(1))], COST[int(m.group(2))]), t)
    t = re.sub(r'\(level (\d) slot\)', lambda m: '(%d mana)' % COST[int(m.group(1))], t)
    t = re.sub(r'(?:a |the )?spell slot of level (\d)', lambda m: 'the mana of a level %s spell' % m.group(1), t)
    t = re.sub(r'(?:a |the )?spell slot of levels? ', 'the mana of a spell of level ', t)
    t = re.sub(r'\bspell slot\'s level\b', 'level you paid for', t)
    t = re.sub(r'\bthe slot\'s level\b', 'the level you paid for', t)
    t = re.sub(r'\bslot level\b', 'level you paid for', t)
    t = re.sub(r'\bthe slot is still expended', 'the mana is still spent', t)
    t = re.sub(r'\bthe slot isn\'t expended', 'the mana isn\'t spent', t)
    t = re.sub(r'\bexpend(s|ed|ing)? (?:a |the )?spell slots?', lambda m: 'spend' + (m.group(1) or '') + ' mana', t)
    t = re.sub(r'\buse (?:a |the )?spell slot', 'spend mana', t)
    t = re.sub(r'\b(?:a |the )?spell slots?\b', 'mana', t)
    t = re.sub(r'\blevel (\d) slots?\b', lambda m: '%d mana' % COST[int(m.group(1))], t)
    t = t.replace('higher-level mana', 'more mana').replace('the level of the slot expended', 'the level you paid for')
    return t

spells = {}
cur = None
for chunk in re.split(r'^(?=#### )', text, flags=re.M):
    m = re.match(r'#### (.+)\n', chunk)
    if not m: continue
    title, body = m.group(1).strip(), chunk[m.end():]
    if '**Casting Time:**' not in body:
        if cur:  # a stat block heading (Traits, Actions...) inside the previous spell
            cur['_extra'].append('\n' + title.upper() + '\n' + body)
        continue
    cur = {'name': title, '_body': body, '_extra': []}
    spells[title] = cur

out = {}
for name, s in spells.items():
    body = s['_body'] + ''.join(s['_extra'])
    head = re.search(r'^_(.+?)_\s*$', body, re.M)
    hl = head.group(1) if head else ''
    lm = re.match(r'Level (\d)', hl)
    level = int(lm.group(1)) if lm else 0
    f = dict(re.findall(r'\*\*(Casting Time|Range|Components|Duration):\*\* (.+)', body))
    rest = body[head.end():] if head else body
    rest = re.sub(r'\*\*(Casting Time|Range|Components|Duration):\*\* .+\n', '', rest)
    rest = rest.replace('_Using a Higher-Level Spell Slot._', '\n\n_Using a Higher-Level Spell Slot._')
    paras, lst = [], []
    for raw in re.split(r'\n\s*\n', rest):
        lines = [l.rstrip() for l in raw.strip().split('\n') if l.strip()]
        if not lines: continue
        if all(l.startswith('|') for l in lines):
            rows = [[plain(c) for c in l.strip('|').split('|')] for l in lines]
            rows = [r for r in rows if not all(re.fullmatch(r':?-{2,}:?', c) for c in r)]
            paras.append('\n'.join(' | '.join(r) for r in rows)); continue
        buf = []
        for l in lines:
            if re.match(r'^\s*[-*] ', l):
                if buf: paras.append(plain(' '.join(buf))); buf = []
                paras.append('- ' + plain(re.sub(r'^\s*[-*] ', '', l)))
            else: buf.append(l)
        if buf: paras.append(plain(' '.join(buf)))
    # Merge consecutive list items into one block.
    merged = []
    for p in paras:
        if p.startswith('- ') and merged and merged[-1].startswith('- '): merged[-1] += '\n' + p
        else: merged.append(p)
    desc = []
    for p in merged:
        if p.startswith('Using a Higher-Level Spell Slot.'):
            rest_p = fix_slots(p[len('Using a Higher-Level Spell Slot.'):].strip())
            desc.append(upcast_lead(level) + ' ' + rest_p)
        else:
            desc.append(fix_slots(p))
    d = '\n\n'.join(desc)
    out[name.lower()] = {'name': name, 'level': level, 'casting_time': plain(f.get('Casting Time', '')), 'range': plain(f.get('Range', '')),
                         'components': plain(f.get('Components', '')), 'duration': plain(f.get('Duration', '')), 'description': d}

json.dump(out, open(OUT, 'w'), ensure_ascii=False, separators=(',', ':'))
left = [(k, re.findall(r'.{0,60}slot.{0,60}', v['description'])) for k, v in out.items() if 'slot' in v['description'].lower()]
print(len(out), 'spells;', len(left), 'still mention slots')
for k, l in left: print(' ', k, l)
