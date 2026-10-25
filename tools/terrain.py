# Reads an Inkarnate-style map image and writes a compact terrain grid (grid.json) for route-finding.
# Usage: python3 tools/terrain.py map.jpg 256   ->  grid.json, grid.png (preview)
# Cells: "." water, "r" road, "g" open land, "f" forest, "m" mountains. Store grid.json in maps.travel_grid.
# Tuned for the Dornish Isles map; other art styles may need the color thresholds adjusted.
import sys, json
from PIL import Image, ImageFilter
import numpy as np
src=sys.argv[1]; GW=int(sys.argv[2]) if len(sys.argv)>2 else 256
im=Image.open(src).convert('RGB')
W,H=im.size; GH=round(GW*H/W)
rgb=np.asarray(im).astype(np.int32)
hsv=np.asarray(im.convert('HSV')).astype(np.int32); Hh,S,V=hsv[...,0],hsv[...,1],hsv[...,2]
R,G,B=rgb[...,0],rgb[...,1],rgb[...,2]
gray=np.asarray(im.convert('L')).astype(np.float32)
# local texture: std dev in a 9px window
from numpy.lib.stride_tricks import sliding_window_view
def boxmean(a,k):
    c=np.cumsum(np.cumsum(np.pad(a,((k,k),(k,k)),mode='edge'),0),1)
    s=c[2*k:,2*k:]-c[:-2*k,2*k:]-c[2*k:,:-2*k]+c[:-2*k,:-2*k]
    return s[:a.shape[0],:a.shape[1]]/(2*k)**2
m1=boxmean(gray,5); m2=boxmean(gray*gray,5); std=np.sqrt(np.maximum(m2-m1*m1,0))
road=(Hh>=20)&(Hh<=40)&(S>140)&(V>165)
water=(Hh>=80)&(Hh<=185)&(S>25)
forest=(~water)&(V<100)&(S>90)&(Hh>=28)&(Hh<=52)
land=~water
peak=(S<95)&(V>135)&land
cy,cx=H/GH,W/GW
def cellfrac(mask):
    out=np.zeros((GH,GW))
    for gy in range(GH):
        y0,y1=int(gy*cy),int((gy+1)*cy)
        for gx in range(GW):
            x0,x1=int(gx*cx),int((gx+1)*cx)
            out[gy,gx]=mask[y0:y1,x0:x1].mean()
    return out
rd=cellfrac(road); wt=cellfrac(water); fr=cellfrac(forest); pk=cellfrac(peak)
# smooth peak density over 5x5 cells so scattered peaks read as one mountain range
pad=np.pad(pk,2,mode='edge'); pks=sum(pad[dy:dy+GH,dx:dx+GW] for dy in range(5) for dx in range(5))/25
wpad=np.pad(wt,1,mode='edge'); nearwater=sum(wpad[dy:dy+GH,dx:dx+GW] for dy in range(3) for dx in range(3))/9
g=np.full((GH,GW),'g')
g[fr>0.35]='f'
g[(pks>0.075)&(nearwater<0.15)]='m'
g[wt>0.55]='.'
isroad=(rd*cx*cy>=2)&(wt<=0.8)
# drop isolated road specks (gold flecks in the mountain art)
rp=np.pad(isroad,1); nb=sum(rp[dy:dy+GH,dx:dx+GW].astype(int) for dy in range(3) for dx in range(3))-isroad
isroad&=nb>=1
g[isroad]='r'
cells=g.tolist()
g=np.array(cells)
# legend/compass box in the top-left: mark as water so routes ignore it
lx,ly=int(330/W*GW),int(530/H*GH)
g[:ly,:lx]='.'
g[:int(330/H*GH), int(1680/W*GW):]='.'  # compass rose
np.save('grid.npy',g)
pal={'.':(20,40,80),'g':(150,150,90),'f':(30,110,40),'m':(140,120,110),'r':(255,210,0)}
img=np.zeros((GH,GW,3),np.uint8)
for k,v in pal.items(): img[g==k]=v
Image.fromarray(img).resize((GW*4,GH*4),Image.NEAREST).save('grid.png')
s=''.join(''.join(r) for r in g)
# run-length encode: "<count><char>"
out=[];i=0
while i<len(s):
    j=i
    while j<len(s) and s[j]==s[i]: j+=1
    out.append((str(j-i) if j-i>1 else '')+s[i]); i=j
rle=''.join(out)
json.dump({'w':GW,'h':GH,'rle':rle},open('grid.json','w'))
print(GW,GH,'cells',len(s),'rle bytes',len(rle), {k:int((g==k).sum()) for k in pal})
