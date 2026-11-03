"""One-time source-preserving vector trace. Tools: Pillow, numpy, vtracer (not app dependencies).
Usage: PYTHONPATH=/tmp/lms-logo-tools python3 scripts/brand/vectorize-logo.py /path/IMG_4590.PNG
"""
from pathlib import Path
from PIL import Image
import numpy as np
import vtracer
import xml.etree.ElementTree as ET
import sys, tempfile, json, hashlib

source = Path(sys.argv[1])
a = np.asarray(Image.open(source).convert('RGBA'))
y, x = np.indices(a.shape[:2])
# Restrict segmentation to the supplied artwork. Alpha/channel thresholds reject
# fringe compression pixels; the original font outlines are traced, not substituted.
opaque = a[:,:,3] > 150
masks = {
 'wordmark': opaque & (x >= 540) & (a[:,:,0] < 60) & (a[:,:,1] < 60),
 'plum': opaque & (x < 560) & (a[:,:,0] > a[:,:,1].astype(int) + 35) & (a[:,:,2] < 130),
 'silver': opaque & (x < 560) & (a[:,:,0] > 130) & (a[:,:,1] > 130),
}
paths={}
with tempfile.TemporaryDirectory() as tmp:
 for name, mask in masks.items():
  im=Image.fromarray(np.where(mask,0,255).astype('uint8')).convert('RGB')
  src=f'{tmp}/{name}.png'; out=f'{tmp}/{name}.svg'; im.save(src)
  vtracer.convert_image_to_svg_py(src,out,colormode='binary',mode='spline',filter_speckle=20,corner_threshold=60,length_threshold=4,splice_threshold=45,path_precision=2)
  root=ET.parse(out).getroot()
  elements=[]
  for node in root:
   if node.tag.endswith('path'):
    # Keep local path transforms to avoid rounding additional coordinates.
    attrs={k:v for k,v in node.attrib.items() if k in ['d','transform']}
    elements.append(attrs)
  paths[name]=elements

def group(name,fill):
 return '<g fill="'+fill+'">'+''.join('<path '+' '.join(k+'="'+v+'"' for k,v in p.items())+'/>' for p in paths[name])+'</g>'
# Main opaque silhouette bounds; deliberately trim the transparent source padding.
mask=np.logical_or.reduce(list(masks.values())); ys,xs=np.where(mask)
bounds=[int(xs.min()),int(ys.min()),int(xs.max()-xs.min()+1),int(ys.max()-ys.min()+1)]
mark=masks['plum']|masks['silver']; ys,xs=np.where(mark)
mark_bounds=[int(xs.min()),int(ys.min()),int(xs.max()-xs.min()+1),int(ys.max()-ys.min()+1)]
base='<svg xmlns="http://www.w3.org/2000/svg" viewBox="'+' '.join(map(str,bounds))+'">'
mark_svg=group('plum','#680a34')+group('silver','#bfbebf')
for name,color in [('logo','#020309'),('logo-dark','#ffffff')]:
 Path(f'public/brand/{name}.svg').write_text(base+mark_svg+group('wordmark',color)+'</svg>\n')
Path('public/brand/mark.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="'+' '.join(map(str,mark_bounds))+'">'+mark_svg+'</svg>\n')
Path('src/features/public-shell/supplied-logo-artwork.ts').write_text('// Traced from owner-supplied IMG_4590.PNG by scripts/brand/vectorize-logo.py.\nexport const suppliedLogo = '+json.dumps({'bounds':bounds,'markBounds':mark_bounds,'paths':paths},ensure_ascii=False,separators=(',',':'))+' as const;\n')
Path('public/brand/source-provenance.json').write_text(json.dumps({'source':'IMG_4590.PNG','sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'dimensions':[a.shape[1],a.shape[0]],'bounds':bounds,'markBounds':mark_bounds,'method':'Alpha/color segmentation; spline paths; flat median colors; no embedded raster; dark variant white wordmark'},indent=2)+'\n')
print({ 'bounds':bounds,'markBounds':mark_bounds,'paths':{k:len(v) for k,v in paths.items()} })
