"""Build the boat-travel water layer for the Dornish Isles map.

Cells (same 256x192 grid as the land layer):
  '-' no water, 'd' deep sea, 'c' coastal sea (within ~12 mi of land),
  'b' big water (Loreaon's river and lake, Marloo lagoon), 'v' river, 's' stream.
"""
import json
import sys

import numpy as np
from scipy import ndimage as nd
from PIL import Image

SP = sys.argv[1]
W, H, CELL = 256, 192, 8
MI_PER_PX = 497 / 2048
COAST_PX = 12 / MI_PER_PX

inland = np.load(SP + '/inland2.npy')
sea = (np.load(SP + '/coastal.npy') | np.load(SP + '/deep.npy')) & ~inland
land = ~(sea | inland)

# Open sea runs off the edges of the map: the frame line, the legend box drawn over the water,
# and the Coralyn marker (the sea elves live under the water) are all just sea.
yy, xx = np.ogrid[:land.shape[0], :land.shape[1]]
open_sea = np.zeros_like(land)
open_sea[:2, :] = True
open_sea[:1400, :2] = True
open_sea[:1400, -2:] = True
open_sea[:560, :340] = True
open_sea[:130, :420] = True
open_sea |= (yy - 296) ** 2 + (xx - 457) ** 2 < 45 ** 2
land &= ~open_sea
inland &= ~open_sea
sea |= open_sea

# Leave out the legend box and the southern landmass, which isn't part of the Isles.
cut = np.zeros_like(inland)
cut[:560, :340] = True
cut[1110:, 800:] = True
inland &= ~cut

# Coastal vs deep by distance from land.
d_land = nd.distance_transform_edt(~land)
coastal = sea & (d_land <= COAST_PX)
deep = sea & ~coastal

# Bridges and fords break the drawn rivers into pieces; close small gaps before grouping.
lab, n = nd.label(nd.binary_dilation(inland, iterations=5), structure=np.ones((3, 3)))
lab = np.where(inland, lab, 0)
def comp_at(x, y, r=25):
    win = lab[y - r:y + r, x - r:x + r]
    ids, counts = np.unique(win[win > 0], return_counts=True)
    return int(ids[np.argmax(counts)]) if len(ids) else 0

loreaon = comp_at(1632, 712)
marloo = comp_at(340, 860)
print('components', n, 'loreaon', loreaon, 'marloo', marloo)

tier = np.zeros(inland.shape, np.uint8)  # 1 stream, 2 river, 3 big
# Default: lower half of each river (by distance along the water from the sea) is a river, upper half a stream.
mouth = inland & nd.binary_dilation(sea, iterations=3)
for cid in range(1, n + 1):
    m = lab == cid
    if m.sum() < 40:
        continue
    seeds = m & mouth
    if not seeds.any():
        tier[m] = 1
        continue
    # geodesic distance from the mouth, via repeated dilation inside the component
    dist = np.full(m.shape, -1, np.int32)
    front = seeds.copy(); dist[front] = 0; step = 0
    ys, xs = np.nonzero(m)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    mm = m[y0:y1, x0:x1]; fr = front[y0:y1, x0:x1]; dd = dist[y0:y1, x0:x1]; seen = fr.copy()
    while fr.any():
        step += 1
        fr = nd.binary_dilation(fr, structure=np.ones((3, 3))) & mm & ~seen
        dd[fr] = step; seen |= fr
    far = dd.max()
    t = np.where(dd >= 0, np.where(dd <= far * 0.5, 2, 1), 1)
    tier[y0:y1, x0:x1][mm] = t[mm]

tier[lab == loreaon] = 3          # Loreaon's trade river and lake: seagoing ships all the way up
tier[lab == marloo] = np.maximum(tier[lab == marloo], 2)  # barges up the Hydra's Hold river to Hogshead
lagoon = (lab == marloo) & (nd.distance_transform_edt(lab == marloo) >= 12)
lagoon = nd.binary_dilation(lagoon, iterations=14) & (lab == marloo)
tier[lagoon] = 3

# Down to cells. Rivers win over sea in a mixed cell only if the cell is mostly land.
grid = np.full((H, W), '-', dtype='<U1')
def frac(mask):
    return mask.reshape(H, CELL, W, CELL).mean(axis=(1, 3))
f_deep, f_coast = frac(deep), frac(coastal)
f_t = {k: frac(tier == k) for k in (1, 2, 3)}
seaf = f_deep + f_coast
grid[seaf >= 0.35] = 'c'
grid[(seaf >= 0.35) & (f_deep > f_coast)] = 'd'
for k, ch in ((1, 's'), (2, 'v'), (3, 'b')):
    grid[(f_t[k] > 0) & (seaf < 0.35)] = ch
# a bigger class wins where they meet in one cell
for k, ch in ((2, 'v'), (3, 'b')):
    grid[(f_t[k] > 0) & (seaf < 0.35)] = ch

# Make sure every river reaches the sea on the grid: river cells touching sea cells are fine by 8-neighbour moves.
rle, prev, cnt = [], None, 0
for ch in grid.ravel():
    if ch == prev:
        cnt += 1
    else:
        if prev is not None:
            rle.append((str(cnt) if cnt > 1 else '') + prev)
        prev, cnt = ch, 1
rle.append((str(cnt) if cnt > 1 else '') + prev)
rle = ''.join(rle)
json.dump({'w': W, 'h': H, 'rle': rle}, open(SP + '/water.json', 'w'))
print('rle length', len(rle), {c: int((grid == c).sum()) for c in '-dcbvs'})

img = np.array(Image.open(sys.argv[2]).convert('RGB').resize((W * 4, H * 4))).astype(float) * 0.55
col = {'d': (25, 45, 140), 'c': (90, 190, 240), 'b': (255, 0, 190), 'v': (255, 220, 0), 's': (120, 255, 120)}
big = np.repeat(np.repeat(grid, 4, 0), 4, 1)
for ch, c in col.items():
    m = big == ch
    img[m] = img[m] * 0.25 + np.array(c) * 0.75
Image.fromarray(img.astype(np.uint8)).save(SP + '/water_grid.png')
