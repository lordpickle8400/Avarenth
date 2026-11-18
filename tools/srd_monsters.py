"""Build monsters.json for the Avarenth app from the SRD 5.2.1 monsters and animals chapters (CC-BY-4.0).
Usage: python3 srd_monsters.py <srd md dir> <out.json>"""
import re, json, sys, html as H

MD, OUT = sys.argv[1], sys.argv[2]
SECS = ['Traits', 'Actions', 'Bonus Actions', 'Reactions', 'Legendary Actions']

def clean(s):
    s = H.unescape(re.sub(r'<br\s*/?>', '', s))
    s = s.replace('&emsp;', '').replace(' ', '')
    s = re.sub(r'<[^>]+>', '', s)
    return re.sub(r'[ \t]+', ' ', s).strip()

def inline(s):
    """Keep _italic_ and **bold** markers as simple tags the app can show: [[i]]..[[/i]]"""
    s = clean(s)
    s = re.sub(r'\*\*_?([^*]+?)_?\*\*', r'\1', s)
    s = re.sub(r'(?<![A-Za-z0-9])_([^_]+)_(?![A-Za-z0-9])', r'«\1»', s)
    return s

def parse_block(name, body, group):
    m = re.search(r'^_([^_\n]+)_\s*$', body, re.M)
    if not m: return None
    head = clean(m.group(1))
    hm = re.match(r'(Tiny|Small|Medium|Large|Huge|Gargantuan|Small or Medium|Medium or Small)\s+(.+?),\s*(.+)$', head)
    mon = {'name': name, 'group': group, 'size': hm.group(1) if hm else '', 'type': hm.group(2) if hm else head, 'align': hm.group(3) if hm else ''}
    f = lambda k: (re.search(r'\*\*' + k + r'\*\* ([^\n]+)', body) or [None, ''])[1]
    ac = f('AC'); mon['ac'] = clean(re.split(r'\*\*Initiative\*\*', ac)[0])
    ini = re.search(r'\*\*Initiative\*\* ([^<\n]+)', body); mon['init'] = clean(ini.group(1)) if ini else ''
    mon['hp'] = clean(f('HP')); mon['speed'] = clean(f('Speed'))
    for k, key in [('Skills', 'skills'), ('Senses', 'senses'), ('Languages', 'langs'), ('Resistances', 'res'), ('Immunities', 'imm'), ('Vulnerabilities', 'vuln'), ('Gear', 'gear')]:
        v = clean(f(k))
        if v: mon[key] = v
    cr = clean(f('CR'))
    cm = re.match(r'([\d/]+)\s*\((.*)\)', cr)
    mon['cr'] = cm.group(1) if cm else cr
    mon['xp'] = cm.group(2) if cm else ''
    # ability table: STR score mod save ...
    ab = {}
    for k, sc, md, sv in re.findall(r'<td><strong>(STR|DEX|CON|INT|WIS|CHA)</strong></td>\s*<td>([^<]*)</td>\s*<td>([^<]*)</td>\s*<td>([^<]*)</td>', body):
        nums = re.findall(r'[+\-−]?\d+', ' '.join([sc, md, sv]))
        if not nums: continue
        score = int(nums[0]); mod_ = (score - 10) // 2
        signs = [x.replace('−', '-') for x in nums[1:]] + ['', '']
        ab[k.lower()] = [score, '%+d' % mod_, signs[1] if len(nums) > 2 else signs[0] or '%+d' % mod_]
    mon['abil'] = ab
    # sections
    parts = re.split(r'^#{3,4} (Traits|Actions|Bonus Actions|Reactions|Legendary Actions)\s*$', body, flags=re.M)
    secs = {}
    for i in range(1, len(parts), 2):
        title, txt = parts[i], parts[i + 1]
        txt = re.sub(r'<hr\s*/?>', '', txt)
        items, intro = [], ''
        for para in re.split(r'\n\s*\n', txt.strip()):
            para = para.strip()
            if not para: continue
            im = re.match(r'\*\*_(.+?)\._\*\*\s*(.*)', para, re.S)
            if im: items.append([clean(im.group(1)), inline(im.group(2)).replace('\n', ' ')])
            elif items: items[-1][1] += '\n' + inline(para).replace('\n', ' ')
            else: intro = (intro + ' ' + inline(para)).strip()
        secs[title] = {'intro': intro, 'list': items} if intro else items
    mon['secs'] = secs
    return mon

out = []
mz = open(MD + '/monsters-A-Z.md').read()
for gm in re.finditer(r'^## (.+)$', mz, re.M):
    pass
groups = list(re.finditer(r'^## (.+)$', mz, re.M))
for gi, g in enumerate(groups):
    gbody = mz[g.end():(groups[gi + 1].start() if gi + 1 < len(groups) else len(mz))]
    blocks = list(re.finditer(r'^### (.+)$', gbody, re.M))
    for bi, bm in enumerate(blocks):
        body = gbody[bm.end():(blocks[bi + 1].start() if bi + 1 < len(blocks) else len(gbody))]
        mon = parse_block(bm.group(1).strip(), body, g.group(1).strip())
        if mon: out.append(mon)
an = open(MD + '/animals.md').read()
heads = list(re.finditer(r'^## (.+)$', an, re.M))
for i, h in enumerate(heads):
    body = an[h.end():(heads[i + 1].start() if i + 1 < len(heads) else len(an))]
    mon = parse_block(h.group(1).strip(), body, 'Animals')
    if mon: out.append(mon)
json.dump({'source': 'System Reference Document 5.2.1 (CC-BY-4.0)', 'monsters': out}, open(OUT, 'w'), ensure_ascii=False, separators=(',', ':'))
print(len(out), 'monsters')
bad = [m['name'] for m in out if len(m['abil']) != 6 or not m['hp']]
print('missing stats:', bad[:20], len(bad))
