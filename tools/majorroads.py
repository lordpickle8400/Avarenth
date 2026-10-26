import json, heapq, sys
import numpy as np
from PIL import Image
SP = sys.argv[1]
g = np.load(SP + '/grid.npy')  # (192,256) chars
H, W = g.shape
cap = (1637, 710)
nobles = {'Stonehelm (north)': (1745, 406), 'Central seat': (930, 386), 'Marloo (west)': (425, 928), 'Crisfey (south)': (1565, 907)}
def cell(p): return (p[1] // 8, p[0] // 8)
def snap(c):
    y0, x0 = c
    best = None
    for r in range(0, 8):
        for y in range(y0 - r, y0 + r + 1):
            for x in range(x0 - r, x0 + r + 1):
                if 0 <= y < H and 0 <= x < W and g[y, x] == 'r':
                    d = (y - y0) ** 2 + (x - x0) ** 2
                    if best is None or d < best[0]: best = (d, (y, x))
        if best: return best[1]
    return c
def path(a, b):
    dist = {a: 0}; prev = {}; pq = [(0, a)]
    while pq:
        d, u = heapq.heappop(pq)
        if u == b: break
        if d > dist[u]: continue
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                if not (dy or dx): continue
                v = (u[0] + dy, u[1] + dx)
                if not (0 <= v[0] < H and 0 <= v[1] < W): continue
                c = g[v]
                if c == '.': continue
                step = (1.414 if dy and dx else 1) * (1 if c == 'r' else 25)
                nd = d + step
                if nd < dist.get(v, 1e18): dist[v] = nd; prev[v] = u; heapq.heappush(pq, (nd, v))
    out = [b]
    while out[-1] != a: out.append(prev[out[-1]])
    return out[::-1]
major = np.zeros_like(g, dtype=bool)
s = snap(cell(cap))
for name, p in nobles.items():
    pp = path(s, snap(cell(p)))
    off = sum(1 for c in pp if g[c] != 'r')
    print(name, 'cells', len(pp), 'off-road', off)
    for c in pp:
        if g[c] == 'r': major[c] = True
g2 = g.copy(); g2[major] = 'R'
print('major cells', major.sum(), 'of road', (g == 'r').sum())
flat = g2.ravel(); rle = []; prev = None; cnt = 0
for ch in flat:
    if ch == prev: cnt += 1
    else:
        if prev is not None: rle.append((str(cnt) if cnt > 1 else '') + prev)
        prev, cnt = ch, 1
rle.append((str(cnt) if cnt > 1 else '') + prev)
json.dump({'rle': ''.join(rle)}, open(SP + '/grid2.json', 'w'))
np.save(SP + '/grid2.npy', g2)
img = np.array(Image.open(sys.argv[2]).convert('RGB').resize((W * 4, H * 4))).astype(float) * 0.6
big = np.repeat(np.repeat(g2, 4, 0), 4, 1)
img[big == 'r'] = (255, 220, 0); img[big == 'R'] = (255, 40, 40)
Image.fromarray(img.astype(np.uint8)).save(SP + '/roads.png')
