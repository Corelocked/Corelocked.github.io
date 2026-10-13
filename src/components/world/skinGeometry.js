import { BoxGeometry } from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

function skinBox(w, h, d, u, v, padding = 0, textureHeight = 64) {
  const box = new BoxGeometry((w + padding) / 16, (h + padding) / 16, (d + padding) / 16);
  const faces = [[u, v+d, d, h], [u+d+w, v+d, d, h], [u+d, v, w, d], [u+d+w, v, w, d], [u+d, v+d, w, h], [u+2*d+w, v+d, w, h]];
  faces.forEach(([x,y,width,height], face) => {
    for (let corner=0;corner<4;corner++) {
      box.attributes.uv.setXY(face*4+corner, (x+(corner%2)*width)/64, 1-(y+Math.floor(corner/2)*height)/textureHeight);
    }
  });
  return box;
}

export function skinGeometry(armOnly = false, armWidth = 3) {
  const parts = armOnly ? [[armWidth,12,4,40,16,40,32,0,0]] : [
    [8,8,8,0,0,32,0,0,28],
    [8,12,4,16,16,16,32,0,18],
    [armWidth,12,4,40,16,40,32,-4-armWidth/2,18],
    [armWidth,12,4,32,48,48,48,4+armWidth/2,18],
    [4,12,4,0,16,0,32,-2,6],
    [4,12,4,16,48,0,48,2,6],
  ];
  const boxes = parts.flatMap(([w,h,d,u,v,outerU,outerV,x,y]) => [
    skinBox(w,h,d,u,v).translate(x/16,y/16,0),
    skinBox(w,h,d,outerU,outerV,w===8 && h===8 ? 1 : 0.5).translate(x/16,y/16,0),
  ]);
  const merged = mergeGeometries(boxes);
  boxes.forEach(box => box.dispose());
  return merged;
}

// Vanilla cat/wolf cuboids and atlas regions, posed facing local +Z.
export function petGeometry(dog) {
  const parts = dog ? [
    [6,6,4,0,0,0,10.5,7], [3,3,4,0,10,0,9,10],
    [2,2,1,16,14,-2,14.5,6.5], [2,2,1,16,14,2,14.5,6.5],
    [6,9,6,18,14,0,10,-2,Math.PI/2], [8,6,7,21,0,0,10,3,Math.PI/2],
    ...[-1.5,1.5].flatMap(x=>[-7,4].map(z=>[2,8,2,0,18,x,4,z])),
    [2,8,2,9,18,0,12,-10,-0.8],
  ] : [
    [5,4,5,0,0,0,9,9.5], [3,2,2,0,24,0,8.016,12],
    [1,1,2,0,10,-1.5,11.5,8], [1,1,2,6,10,1.5,11.5,8],
    [4,16,6,20,0,0,7,-1,Math.PI/2],
    ...[-1.1,1.1].map(x=>[2,6,2,8,13,x,3,-7]),
    ...[-1.2,1.2].map(x=>[2,10,2,40,0,x,5.2,4]),
    [1,8,1,0,15,0,8,-9,-0.5], [1,8,1,4,15,0,14.5,-11.6,-0.25],
  ];
  const boxes=parts.map(([w,h,d,u,v,x,y,z,rotation=0])=>skinBox(w,h,d,u,v,0,32).rotateX(rotation).translate(x/16,y/16,z/16));
  const merged=mergeGeometries(boxes);
  boxes.forEach(box=>box.dispose());
  return merged;
}
