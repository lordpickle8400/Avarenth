"""Build srd.json for the Avarenth app from the SRD 5.2.1 markdown (CC-BY-4.0).
Output is structured blocks only (no HTML from the source), so the app escapes everything it shows."""
import re, json, sys, html
MD = sys.argv[1]
OUT = sys.argv[2]

def strip_tags(s):
    return html.unescape(re.sub(r'<[^>]+>', '', s)).strip()

def blocks(text):
    """Markdown-ish text -> list of blocks: ['p', str] | ['ul', [str]] | ['table', head, rows] | ['h', str]."""
    out, para, lst = [], [], []
    lines = text.split('\n')
    i = 0
    def flush():
        nonlocal para, lst
        if para: out.append(['p', ' '.join(para).strip()]); para = []
        if lst: out.append(['ul', lst]); lst = []
    while i < len(lines):
        ln = lines[i].rstrip()
        if ln.strip().startswith('<table'):
            flush()
            buf = []
            while i < len(lines) and '</table>' not in lines[i]:
                buf.append(lines[i]); i += 1
            buf.append(lines[i] if i < len(lines) else '')
            t = '\n'.join(buf)
            head = [strip_tags(c) for c in re.findall(r'<th[^>]*>(.*?)</th>', t, re.S)]
            rows = []
            for tr in re.findall(r'<tr>(.*?)</tr>', re.sub(r'<thead>.*?</thead>', '', t, flags=re.S), re.S):
                cells = [strip_tags(c) for c in re.findall(r'<td[^>]*>(.*?)</td>', tr, re.S)]
                if cells: rows.append(cells)
            out.append(['table', head, rows])
            i += 1; continue
        if ln.startswith('|'):
            flush()
            rows = []
            while i < len(lines) and lines[i].startswith('|'):
                cells = [c.strip() for c in lines[i].strip().strip('|').split('|')]
                if not all(re.fullmatch(r':?-{2,}:?', c) for c in cells): rows.append(cells)
                i += 1
            if rows: out.append(['table', rows[0], rows[1:]])
            continue
        if re.match(r'^#{4,6} ', ln):
            flush(); out.append(['h', re.sub(r'^#+ ', '', ln).strip()])
        elif re.match(r'^\s*[-*] ', ln):
            if para: out.append(['p', ' '.join(para).strip()]); para = []
            lst.append(re.sub(r'^\s*[-*] ', '', ln).strip())
        elif not ln.strip():
            flush()
        else:
            if lst: out.append(['ul', lst]); lst = []
            para.append(strip_tags(ln.strip()))
        i += 1
    flush()
    return out

def sections(text, level):
    """Split text on headings of exactly `level` #'s -> list of (title, body)."""
    pat = re.compile(r'^' + '#' * level + r' (.+)$', re.M)
    ms = list(pat.finditer(text))
    res = []
    for j, m in enumerate(ms):
        end = ms[j + 1].start() if j + 1 < len(ms) else len(text)
        res.append((m.group(1).strip(), text[m.end():end]))
    return res

srd = {'source': 'System Reference Document 5.2.1 by Wizards of the Coast LLC, CC-BY-4.0 (creativecommons.org/licenses/by/4.0). Structured for the Avarenth app.',
       'feats': [], 'backgrounds': {}, 'species': {}, 'classes': {}, 'subclasses': {}, 'options': {}}

# Feats
feats = open(MD + '/feats.md').read()
for cat, body in sections(feats, 3):
    if not cat.endswith('Feats'): continue
    for name, fb in sections(body, 4):
        b = blocks(fb)
        kind = b[0][1].strip('_') if b and b[0][0] == 'p' and b[0][1].startswith('_') else ''
        if kind: b = b[1:]
        pre = re.search(r'Prerequisite: ([^)]+)', kind)
        srd['feats'].append({'name': name, 'category': cat.replace(' Feats', ''), 'prereq': pre.group(1) if pre else '', 'kind': kind, 'text': b})

# Backgrounds and species
orig = open(MD + '/character-origins.md').read()
bgpart = orig[orig.index('### Background Descriptions'):orig.index('## Character Species')]
for name, body in sections(bgpart, 4):
    f = dict(re.findall(r'\*\*([^*:]+):\*\* (.+)', body))
    clean = lambda v: re.sub(r'\s*\(see "[^"]+"\)', '', v.replace('_', '')).strip()
    srd['backgrounds'][name] = {'abilities': clean(f.get('Ability Scores', '')), 'feat': clean(f.get('Feat', '')),
                                'skills': clean(f.get('Skill Proficiencies', '')), 'tool': clean(f.get('Tool Proficiency', '')), 'equipment': clean(f.get('Equipment', ''))}
sppart = orig[orig.index('### Species Descriptions'):]
for name, body in sections(sppart, 4):
    f = dict(re.findall(r'\*\*(Creature Type|Size|Speed):\*\* (.+)', body))
    rest = re.sub(r'\*\*(Creature Type|Size|Speed):\*\* .+\n', '', body)
    srd['species'][name] = {'type': f.get('Creature Type', ''), 'size': f.get('Size', ''), 'speed': f.get('Speed', ''), 'text': blocks(rest)}

# Classes: full feature text, subclasses, option lists (Metamagic, Invocations)
cls = open(MD + '/classes.md').read()
for cname, cbody in sections(cls, 2):
    feats_by = []
    for title, body in sections(cbody, 3):
        if title == cname + ' Class Features':
            for ft, fb in sections(body, 4):
                m = re.match(r'Level (\d+): (.+)', ft)
                if m: feats_by.append([int(m.group(1)), m.group(2).strip(), blocks(fb)])
        elif title.startswith(cname + ' Subclass: '):
            sname = title.split(': ', 1)[1]
            head = body.split('\n#### ', 1)[0]
            hb = blocks(head)
            tag = hb[0][1].strip('_') if hb and hb[0][0] == 'p' and hb[0][1].startswith('_') else ''
            about = ' '.join(x[1] for x in hb[1 if tag else 0:] if x[0] == 'p')
            sf = []
            for ft, fb in sections(body, 4):
                m = re.match(r'Level (\d+): (.+)', ft)
                if m: sf.append([int(m.group(1)), m.group(2).strip(), blocks(fb)])
            srd['subclasses'][cname] = {'name': sname, 'tagline': tag, 'about': about, 'features': sf}
        elif title.endswith(' Options'):
            srd['options'][title.replace(' Options', '')] = [{'name': n, 'text': blocks(b)} for n, b in sections(body, 4)]
    if feats_by: srd['classes'][cname] = feats_by

json.dump(srd, open(OUT, 'w'), ensure_ascii=False, separators=(',', ':'))
print('feats', len(srd['feats']), [f['name'] for f in srd['feats']])
print('backgrounds', list(srd['backgrounds']))
print('species', list(srd['species']))
print('classes', {k: len(v) for k, v in srd['classes'].items()})
print('subclasses', {k: (v['name'], len(v['features'])) for k, v in srd['subclasses'].items()})
print('options', {k: len(v) for k, v in srd['options'].items()})
