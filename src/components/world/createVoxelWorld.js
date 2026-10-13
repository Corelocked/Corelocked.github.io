import * as THREE from 'three';
import { arrivalPosition, canWalk, destinationPoint, destinations, islandBounds, isWorldPath } from './destinations';
import { pixelPaths } from './pixelIcons';
import { projects } from '../../data/projects';
import { currentStack } from '../../data/currentStack';
import { skinGeometry, petGeometry } from './skinGeometry';
import corelockedSkin from '../../assets/skins/corelocked.png';
import kmbapSkin from '../../assets/skins/kmbap.png';
import playerSkin from '../../assets/skins/player.png';
import whiteCatSkin from '../../assets/skins/cat-white.png';
import brownCatSkin from '../../assets/skins/cat-tabby.png';
import dogSkin from '../../assets/skins/wolf-wolf_chestnut_tame.png';
import spottedDogSkin from '../../assets/skins/wolf-wolf_spotted_tame.png';
import catCollarSkin from '../../assets/skins/cat-cat_collar.png';
import dogCollarSkin from '../../assets/skins/wolf-wolf_collar.png';
import portrait from '../../assets/images/Hero-512.png';
import award from '../../assets/images/inabel-awards-2026-innsight.jpg';
import csharp from '../../assets/images/certificates/dometrain-csharp-certificate.jpg';
import powerbi from '../../assets/images/certificates/simplilearn-powerbi-certificate.jpg';

export default function createVoxelWorld(host, callbacks) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#bed2c1');
  scene.fog = new THREE.Fog('#bed2c1', 65, 150);
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  // The buildings and sun position are static; reuse their shadow map while walking.
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-label', 'Walkable voxel portfolio. Use WASD to walk, drag to look, and E to interact.');
  canvas.tabIndex = -1;
  host.appendChild(canvas);

  const camera = new THREE.PerspectiveCamera(49, 1, 0.1, 180);
  camera.rotation.order = 'YXZ';
  camera.position.set(54, 46, 65);
  camera.lookAt(0, 0, 0);
  const ambient = new THREE.HemisphereLight('#f5f4d6', '#6b7950', 2.5);
  scene.add(ambient);
  const sun = new THREE.DirectionalLight('#fff0c1', 3.0);
  sun.position.set(-28, 52, 30);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -52, right: 52, top: 52, bottom: -52, near: 1, far: 150 });
  sun.shadow.normalBias = 0.035;
  scene.add(sun);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const panelGeometry = new THREE.PlaneGeometry(1, 1);
  const groundGeometry = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
  const materials = new Set();
  const textures = new Set();
  const pendingImages = new Set();
  const characterGeometry = skinGeometry();
  const armGeometry = skinGeometry(true,4);
  const catGeometry = petGeometry(false), dogGeometry = petGeometry(true);
  const batches = new Map();
  const groundTiles = new Map();
  const pondTiles = [];
  const inPond = (x,z) => Math.abs(x+27)<=3.5 && Math.abs(z-6)<=4.5 && Math.abs(x+27)+Math.abs(z-6)<=6.5;
  const obstacles = [];
  const lanterns = [];
  let seed = 42;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };

  function material(color, pixel = false) {
    let map = null;
    if (pixel) {
      const tile = document.createElement('canvas');
      tile.width = tile.height = 16;
      const ctx = tile.getContext('2d');
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 16, 16);
      for (let i = 0; i < 85; i++) {
        ctx.fillStyle = random() > 0.5 ? 'rgba(255,255,235,0.10)' : 'rgba(15,24,8,0.10)';
        ctx.fillRect(Math.floor(random() * 16), Math.floor(random() * 16), 1 + Math.floor(random() * 3), 1);
      }
      map = new THREE.CanvasTexture(tile);
      map.magFilter = THREE.NearestFilter;
      map.minFilter = THREE.NearestFilter;
      map.colorSpace = THREE.SRGBColorSpace;
      textures.add(map);
    }
    const mat = new THREE.MeshLambertMaterial({ color: map ? '#ffffff' : color, map });
    materials.add(mat);
    return mat;
  }

  const grass = material('#72866a', true);
  const grassLight = material('#85967a', true);
  const dirt = material('#886548', true);
  const stone = material('#858c7d', true);
  const stoneLight = material('#abb09a', true);
  const path = material('#aaa99e', true);
  const pathLight = material('#c4c1b4', true);
  const wood = material('#8c6342', true);
  const timber = material('#5a4238', true);
  const planks = material('#bb9262', true);
  const cream = material('#dfd4b7', true);
  const roof = material('#414f52', true);
  const roofTile = material('#637071', true);
  const vermilion = material('#a64c48', true);
  const blossoms = [material('#e5a5ba', true), material('#f3bfce', true), material('#f9dbe2', true)];
  const leaves = [material('#547848', true), material('#61864b', true), material('#789654', true)];
  const gold = material('#e3b84e');
  const dark = material('#354536');
  const purple = material('#827393');
  const red = material('#bb6d54');
  const white = material('#f6eed2');
  const water = material('#6ca5a0');
  const glow = new THREE.MeshBasicMaterial({ color: '#ffe7a1' });
  materials.add(glow);

  let station = null;
  function block(x, y, z, w, h, d, mat, solid = false) {
    const yaw = station?.yaw || 0;
    if (station) ({ x, z } = destinationPoint(station, x - station.modelX, z - station.modelZ));
    if (!batches.has(mat)) batches.set(mat, []);
    batches.get(mat).push([x, y, z, w, h, d, yaw]);
    if (solid) obstacles.push({ x, z, w, d, yaw });
  }

  // Interior ground tiles only need their visible top face; keep cubes along the cliff.
  for (let x = -islandBounds.x; x <= islandBounds.x; x++) {
    for (let z = -islandBounds.z; z <= islandBounds.z; z++) {
      if (Math.abs(x) + Math.abs(z) > islandBounds.diagonal) continue;
      if (inPond(x,z)) { pondTiles.push([x,z]); continue; }
      const onPath = isWorldPath(x, z);
      const tileMaterial = onPath ? (random() > 0.45 ? path : pathLight) : (random() > 0.3 ? grass : grassLight);
      const edge = Math.abs(x) === islandBounds.x || Math.abs(z) === islandBounds.z || Math.abs(x) + Math.abs(z) === islandBounds.diagonal;
      if (edge) {
        block(x, -0.22, z, 1, 0.44, 1, tileMaterial);
        block(x, -1.2, z, 1, 1.6, 1, dirt);
        block(x * 0.98, -2.5, z * 0.98, 1, 1 + random() * 0.8, 1, stone);
      } else {
        if (!groundTiles.has(tileMaterial)) groundTiles.set(tileMaterial, []);
        groundTiles.get(tileMaterial).push([x,z]);
      }
    }
  }
  block(0, -1.8, 0, 61, 2.5, 55, dirt);
  block(0, -3.6, 0, 55, 1.8, 49, stone);
  block(0, -4.9, 0, 45, 1, 43, stone);

  function canvasPanel(tile, x, y, z, width, height) {
    block(x,y,z,width,height,0.13,timber);
    z += 0.071;
    if (station) ({ x, z } = destinationPoint(station, x - station.modelX, z - station.modelZ));
    const texture = new THREE.CanvasTexture(tile);
    texture.colorSpace = THREE.SRGBColorSpace;
    textures.add(texture);
    const mat = new THREE.MeshBasicMaterial({ map: texture });
    materials.add(mat);
    const board = new THREE.Mesh(panelGeometry, mat);
    board.position.set(x, y, z); board.scale.set(width, height, 1);
    board.rotation.y = station?.yaw || 0;
    scene.add(board);
    return texture;
  }

  function sign(text, x, y, z, width = 4, subtitle = '') {
    const main = text === station?.name;
    const tile = document.createElement('canvas');
    tile.width=1024; tile.height=subtitle ? 248 : 192;
    const ctx=tile.getContext('2d');
    ctx.fillStyle='#5a4238'; ctx.fillRect(0,0,1024,tile.height);
    ctx.fillStyle='#eddfbf'; ctx.fillRect(14,14,996,tile.height-28);
    ctx.strokeStyle='#ac7955'; ctx.lineWidth=2; ctx.strokeRect(24,24,976,tile.height-48);
    if (main) {
      ctx.fillStyle='#a64c48'; ctx.fillRect(46,46,100,100);
      ctx.save(); ctx.translate(60,60); ctx.scale(3,3); ctx.fillStyle='#fff0d6';
      ctx.fill(new Path2D(pixelPaths[station.icon]),'evenodd'); ctx.restore();
      [-0.34,0.34].forEach(offset => block(x+width*offset,y+width*tile.height/2048+0.15,z,0.055,0.32,0.055,timber));
    }
    ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillStyle='#3f302b';
    ctx.font='58px Minecraft, monospace'; ctx.fillText(text,main ? 567 : 512,97,main ? 790 : 910);
    if (subtitle) {ctx.font='28px Minecraft, monospace'; ctx.fillStyle='#775846'; ctx.fillText(subtitle,main ? 567 : 512,183,790);}
    canvasPanel(tile,x,y,z,width,width*tile.height/1024);
  }

  function framedImage(src, title, x, y, z, width, height) {
    const tile=document.createElement('canvas'); tile.width=768; tile.height=Math.round(768*height/width);
    const ctx=tile.getContext('2d'), h=tile.height;
    ctx.fillStyle='#eadfc8'; ctx.fillRect(0,0,768,h);
    ctx.strokeStyle='#aa8052'; ctx.lineWidth=18; ctx.strokeRect(9,9,750,h-18);
    ctx.fillStyle='#493a31'; ctx.textAlign='center'; ctx.font='32px Minecraft, monospace';
    ctx.fillText(title,384,h-30,694);
    const texture=canvasPanel(tile,x,y,z,width,height);
    const picture=new Image(); pendingImages.add(picture);
    picture.onload=()=>{
      pendingImages.delete(picture);
      if (disposed) return;
      const scale=Math.min(696/picture.naturalWidth,(h-110)/picture.naturalHeight);
      const w=picture.naturalWidth*scale, imageHeight=picture.naturalHeight*scale;
      ctx.drawImage(picture,(768-w)/2,30+(h-110-imageHeight)/2,w,imageHeight);
      texture.needsUpdate=true; render();
    };
    picture.onerror=()=>pendingImages.delete(picture);
    picture.src=src;
  }

  function skinMaterial(src, color = '#ffffff') {
    const texture = new THREE.Texture();
    texture.magFilter = texture.minFilter = THREE.NearestFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.generateMipmaps = false;
    textures.add(texture);
    const mat = new THREE.MeshLambertMaterial({ map: texture, color, alphaTest: 0.5 });
    materials.add(mat);
    const picture = new Image(); pendingImages.add(picture);
    picture.onload = () => {
      pendingImages.delete(picture);
      if (disposed) return;
      texture.image = picture; texture.needsUpdate = true;
      renderer.shadowMap.needsUpdate = true; render();
    };
    picture.onerror = () => pendingImages.delete(picture);
    picture.src = src;
    return mat;
  }
  const playerMaterial = skinMaterial(playerSkin);
  function nameTag(name,x,y,z,width=1.5) {
    const label = document.createElement('canvas'); label.width=256; label.height=48;
    const ctx = label.getContext('2d');
    ctx.fillStyle='rgba(20,30,24,0.7)';ctx.fillRect(0,0,256,48);
    ctx.fillStyle='#fff6de';ctx.font='24px Minecraft, monospace';ctx.textAlign='center';ctx.fillText(name,128,32);
    const texture = new THREE.CanvasTexture(label); texture.colorSpace=THREE.SRGBColorSpace; textures.add(texture);
    const labelMaterial = new THREE.SpriteMaterial({map:texture,transparent:true}); materials.add(labelMaterial);
    const tag = new THREE.Sprite(labelMaterial);tag.position.set(x,y,z);tag.scale.set(width,width*48/256,1);scene.add(tag);
  }
  function character(mat, name, x, y, z, facing = 0) {
    if (station) ({x,z} = destinationPoint(station,x-station.modelX,z-station.modelZ));
    const mesh = new THREE.Mesh(characterGeometry,mat);
    mesh.position.set(x,y,z); mesh.rotation.y = station?.yaw || facing;
    mesh.castShadow = mesh.receiveShadow = true; scene.add(mesh);
    obstacles.push({x,z,w:0.8,d:0.5,yaw:mesh.rotation.y});
    nameTag(name,x,y+2.3,z);
  }
  const catCollar = skinMaterial(catCollarSkin,'#c52c35');
  const dogCollar = skinMaterial(dogCollarSkin,'#327cdb');
  function pet(dog, skin, x, y, z, facing=0) {
    if (station) ({x,z}=destinationPoint(station,x-station.modelX,z-station.modelZ));
    const geometry=dog ? dogGeometry : catGeometry;
    const mesh=new THREE.Mesh(geometry,skinMaterial(skin));
    mesh.position.set(x,y,z); mesh.rotation.y=(station?.yaw || 0)+facing;
    mesh.castShadow=mesh.receiveShadow=true; scene.add(mesh);
    const collar=new THREE.Mesh(geometry,dog ? dogCollar : catCollar);
    collar.scale.setScalar(1.006); mesh.add(collar);
    obstacles.push({x,z,w:0.5,d:1.3,yaw:mesh.rotation.y});
  }
  const playerArm = new THREE.Mesh(armGeometry,playerMaterial);
  playerArm.position.set(0.6,-0.68,-0.95); playerArm.rotation.set(-1,0,Math.PI); playerArm.scale.setScalar(0.85);
  playerArm.visible=false; camera.add(playerArm); scene.add(camera);

  function desk(x, z, width = 1.8) {
    block(x,1.1,z,width,0.16,1.15,planks,true);
    [-1,1].forEach(side => [-0.42,0.42].forEach(dz => block(x+side*(width/2-0.15),0.64,z+dz,0.14,0.95,0.14,timber)));
    block(x,0.9,z-0.4,width-0.2,0.3,0.28,wood);
    block(x,0.9,z-0.24,0.25,0.055,0.05,gold);
  }

  function book(x, y, z, color, height = 0.6) {
    block(x,y,z,0.3,height,0.52,color);
    block(x,y,z+0.27,0.23,height-0.09,0.025,cream);
    block(x,y+height*0.27,z+0.29,0.25,0.025,0.025,gold);
    block(x,y-height*0.27,z+0.29,0.25,0.025,0.025,gold);
  }

  function bonsai(x, y, z) {
    block(x,y+0.12,z,0.6,0.24,0.42,vermilion);
    block(x,y+0.38,z,0.09,0.4,0.09,timber);
    block(x-0.14,y+0.57,z,0.65,0.25,0.45,leaves[1]);
    block(x+0.14,y+0.74,z,0.4,0.2,0.36,leaves[2]);
  }

  function lamp(x, z) {
    block(x, 0.15, z, 0.85, 0.3, 0.85, stone, true);
    block(x, 1.1, z, 0.35, 1.9, 0.35, stoneLight, true);
    block(x, 2.07, z, 0.8, 0.16, 0.8, stone);
    block(x, 2.4, z, 0.5, 0.5, 0.5, glow);
    [-0.32,0.32].forEach(dx => [-0.32,0.32].forEach(dz => block(x+dx,2.4,z+dz,0.12,0.55,0.12,stone)));
    block(x, 2.75, z, 1.1, 0.2, 1.1, roof);
    block(x, 2.94, z, 0.65, 0.18, 0.65, roof);
    block(x, 3.1, z, 0.25, 0.2, 0.25, stoneLight);
    lanterns.push(new THREE.Vector3(x,2.5,z));
  }

  function cherryTree(x, z, height = 4.8) {
    block(x, height / 2, z, 0.8, height, 0.8, timber, true);
    block(x, height - 1.1, z, 3.4, 0.45, 0.5, timber);
    block(x, height - 0.4, z, 5.2, 1.4, 4.6, blossoms[0]);
    block(x - 0.55, height + 0.65, z + 0.15, 4.5, 1.0, 4.1, blossoms[1]);
    block(x + 0.2, height + 1.4, z, 2.9, 0.65, 2.8, blossoms[2]);
    block(x - 2.3, height - 0.75, z + 0.7, 1.3, 1.0, 1.8, blossoms[1]);
    block(x + 2.2, height - 0.65, z - 0.5, 1.2, 0.9, 1.7, blossoms[2]);
    for (let i=0;i<18;i++) {
      const px=x+(random()-.5)*7, pz=z+(random()-.5)*6;
      if (inPond(px,pz)) continue;
      block(px,0.025,pz,0.16+random()*.18,0.035,0.13,blossoms[i%3]);
    }
  }

  [[-28,-21,5],[-29,-6,6],[-31,11,5],[-25,25,5],[29,-20,6],[32,-5,5],[30,20,5],[-14,-29,5],[18,-28,5],[24,28,5],[-5,30,5],[-7,13,5],[7,13,5],[-7,24,5],[5,28,5]].forEach(([x,z,h]) => cherryTree(x,z,h));
  [[-4,5],[4,5]].forEach(([x,z]) => lamp(x,z));
  destinations.forEach(place => { const point=destinationPoint(place,-2.8,6); lamp(point.x,point.z); });

  // A clear approach through the torii leads straight to the fountain courtyard.
  [-4,4].forEach(x => {
    block(x,0.18,20,1.15,0.36,1.15,stone,true);
    block(x,3.1,20,0.7,6.2,0.7,vermilion,true);
    block(x,0.65,20,0.82,0.9,0.82,timber);
  });
  block(0,4.9,20,9.5,0.45,0.5,vermilion);
  block(0,6.1,20,10.4,0.55,0.85,vermilion);
  block(0,6.48,20,11,0.25,1.05,roof);
  [-5.1,5.1].forEach(x => block(x,6.65,20,1.2,0.25,1.05,roof));
  block(0,5.5,20,0.3,0.9,0.45,vermilion);

  function shrineRoof(x, y, z, width, depth) {
    block(x,y-0.22,z,width-0.4,0.24,depth-0.4,timber);
    for (let tier=0;tier<4;tier++) {
      const w=width*(1-tier*0.17), d=depth*(1-tier*0.18), top=y+tier*0.32;
      block(x,top,z,w,0.32,d,roof);
      [-1,1].forEach(side => {
        block(x,top+0.08,z+side*d/2,w,0.15,0.16,roofTile);
        for (let offset=-w/2+0.3;offset<w/2;offset+=0.6) block(x+offset,top+0.2,z+side*(d/2-0.22),0.1,0.12,0.55,roofTile);
      });
    }
    [-1,1].forEach(sx => [-1,1].forEach(sz => block(x+sx*(width/2-0.35),y+0.3,z+sz*(depth/2-0.3),1.0,0.22,0.8,roof)));
    block(x,y+1.2,z,width*0.48,0.24,0.5,roofTile);
    [-1,1].forEach(side => block(x+side*width*0.24,y+1.37,z,0.3,0.3,0.55,roof));
  }

  function shojiPanel(x, y, z, width, height) {
    block(x,y,z,width,height,0.12,cream,true);
    [-1,1].forEach(side => block(x+side*width/2,y,z+0.08,0.12,height+0.12,0.12,timber));
    for (let i=0;i<=4;i++) block(x,y-height/2+i*height/4,z+0.08,width,0.07,0.1,timber);
    [-0.25,0,0.25].forEach(offset => block(x+width*offset,y,z+0.08,0.05,height,0.1,wood));
  }

  function building(x, z, name) {
    block(x,0.08,z,8.4,0.16,6.5,stone);
    block(x,0.19,z+0.15,7.8,0.12,6.4,planks);
    for (let dx=-3.6;dx<=3.6;dx+=0.45) block(x+dx,0.26,z+0.15,0.025,0.02,6.3,wood);
    block(x,0.07,z+3.85,3,0.14,1.1,stoneLight);
    block(x,0.14,z+3.45,3.3,0.14,0.55,planks);
    block(x, 1.8, z - 2.4, 7.2, 3.6, 0.4, cream, true);
    block(x - 3.4, 1.6, z, 0.4, 3.2, 5, planks, true);
    block(x + 3.4, 1.6, z, 0.4, 3.2, 5, planks, true);
    [-3.5,3.5].forEach(dx => {
      [-2.45,2.65].forEach(dz => {
        block(x+dx,1.8,z+dz,0.38,3.6,0.38,timber,true);
        block(x+dx,0.4,z+dz,0.55,0.3,0.55,stoneLight);
        block(x+dx,3.15,z+dz,0.7,0.2,0.7,wood);
      });
      block(x+dx*1.06,1.8,z,0.12,2.3,4.2,cream);
      for (let dz=-2;dz<=2;dz+=0.5) block(x+dx*1.09,1.8,z+dz,0.12,2.4,0.06,timber);
      [0.65,1.4,2.2,2.95].forEach(y => block(x+dx*1.09,y,z,0.12,0.08,4.2,timber));
    });
    [-2.3,0,2.3].forEach(dx => shojiPanel(x+dx,1.85,z-2.12,2.05,2.35));
    [-2.5,2.5].forEach(dx => {
      shojiPanel(x+dx,1.7,z+2.45,1.45,2.25);
      block(x+dx,0.95,z+3.3,1.8,0.14,0.14,timber,true);
      [-0.7,0.7].forEach(offset => block(x+dx+offset,0.62,z+3.3,0.12,0.8,0.12,timber,true));
    });
    block(x,3.25,z+2.65,7.7,0.26,0.35,vermilion);
    shrineRoof(x,3.7,z,9.1,7.3);
    sign(name,x,3.05,z+3.82,3.9);
  }

  station = destinations.find(place => place.id === 'projects');
  building(-11, -8, 'My work');
  // Actual portfolio artwork gives every workstation its own identity.
  [-13.2, -10.9, -8.6].forEach((x, i) => {
    const project=projects.find(item=>item.slug===['lakbay','pitaka','blogshark'][i]);
    desk(x,-8);
    block(x,1.24,-8.15,0.65,0.08,0.35,dark);
    block(x,1.51,-8.22,0.13,0.5,0.12,dark);
    block(x,1.94,-8.2,1.67,1.06,0.18,dark);
    framedImage(project.image,project.title,x,1.94,-8.08,1.5,0.9);
    block(x,1.22,-7.62,0.9,0.07,0.28,dark);
    for (let key=0;key<8;key++) block(x-0.37+key*0.1,1.27,-7.62,0.055,0.025,0.17,cream);
    block(x+0.62,1.24,-7.6,0.16,0.09,0.23,stoneLight);
  });
  station = destinations.find(place => place.id === 'about');
  building(11, -8, 'About me');
  // Cabin shelves and my Minecraft character.
  for (let y = 0.5; y < 2.5; y += 0.7) {
    block(13, y, -9.8, 2, 0.12, 0.5, wood);
    [0,1,2,3].forEach(i => book(12.3+i*0.4,y+0.28,-9.8,[purple,red,leaves[1],gold][i],0.44));
  }
  character(skinMaterial(corelockedSkin),'Corelocked',10,0.27,-7);
  pet(false,whiteCatSkin,10.95,0.27,-6.35);
  framedImage(portrait,'Cedric Palapuz',10.2,2.05,-9.78,1.35,1.75);
  desk(12.3,-6.8,1.7);
  bonsai(12.7,1.2,-6.9);
  book(11.8,1.48,-6.8,purple,0.55);

  // Achievement gallery: framed plaques and a block-built trophy.
  station = destinations.find(place => place.id === 'certificates');
  block(0, 2.3, -16, 10, 4.6, 0.6, stone, true);
  shrineRoof(0,5.0,-16,11.4,3.3);
  [-4.6,4.6].forEach(x => {
    block(x,2.5,-15.8,0.5,5,0.6,timber,true);
    block(x,0.22,-15.8,0.85,0.44,1,stoneLight);
  });
  [-3,0,3].forEach((x,i) => {
    block(x, 2.35, -15.6, 2.4, 2.4, 0.3, timber);
    framedImage([csharp,award,powerbi][i],['C#','Inabel 2026','Power BI'][i],x,2.35,-15.36,2.15,2.1);
  });
  sign('Achievements',0,4.25,-14.18,4.8);
  const trophyX=6.5;
  block(trophyX, 0.5, -13.5, 1.7, 1, 1.7, stoneLight, true);
  block(trophyX, 1.1, -13.5, 1.1, 0.22, 1.1, timber);
  block(trophyX, 1.4, -13.5, 0.25, 0.6, 0.25, gold);
  block(trophyX, 1.9, -13.5, 0.85, 0.65, 0.7, gold);
  [-0.6,0.6].forEach(x => {
    block(trophyX+x,2,-13.5,0.18,0.55,0.25,gold);
    block(trophyX+x*0.8,2.25,-13.5,0.38,0.15,0.25,gold);
    block(trophyX+x*0.8,1.75,-13.5,0.38,0.15,0.25,gold);
  });
  sign('Inabel 2026',trophyX,0.6,-12.6,1.35);

  // Crafting pavilion.
  station = destinations.find(place => place.id === 'skills');
  block(-12,0.1,5,6.8,0.2,5.2,stoneLight);
  block(-12,0.22,5,6.4,0.12,4.8,planks);
  [-14.7,-9.3].forEach(x => [3.3,6.7].forEach(z => {
    block(x,1.75,z,0.35,3.5,0.35,timber,true);
    block(x,0.35,z,0.6,0.3,0.6,stone);
  }));
  block(-12,3.2,6.7,5.8,0.22,0.35,vermilion);
  shrineRoof(-12,3.6,5,7.3,5.5);
  desk(-12,5,3.7);
  block(-12.4,1.23,5.15,1.35,0.1,0.8,dark);
  block(-12.4,1.62,4.88,1.35,0.68,0.1,dark);
  sign(`{ ${currentStack[currentStack.length-1]} }`,-12.4,1.64,4.96,1.15);
  for (let key=0;key<9;key++) block(-12.92+key*0.13,1.3,5.2,0.075,0.025,0.3,stoneLight);
  book(-10.95,1.52,4.85,purple,0.64);
  book(-11.32,1.48,4.85,red,0.56);
  bonsai(-13.35,1.21,4.8);
  currentStack.slice(0,-1).forEach((label,i) => {
    const x=-13.65+(i%3)*1.65, y=2.82-Math.floor(i/3)*0.52;
    block(x,y,3.35,1.5,0.44,0.15,timber);
    sign(label,x,y,3.46,1.35);
  });
  sign('What I use',-12,2.98,7.9,3.9);

  // Open-air library.
  station = destinations.find(place => place.id === 'resume');
  block(12,0.1,5,7.2,0.2,5.2,stoneLight);
  block(12,0.22,5,6.8,0.12,4.8,planks);
  [8.9,15.1].forEach(x => [3.1,6.9].forEach(z => {
    block(x,1.85,z,0.35,3.7,0.35,timber,true);
    block(x,0.38,z,0.6,0.3,0.6,stone);
  }));
  block(12, 1.5, 4, 5.7, 3, 0.7, timber, true);
  for (let row=0;row<3;row++) {
    block(12, 0.15 + row, 4.3, 5.7, 0.15, 1, planks);
    for (let i=0;i<12;i++) book(9.5+i*0.45,0.6+row,4.4,[red,purple,leaves[1],wood][i%4],0.54+(i%3)*0.07);
  }
  block(12,3.35,6.9,6.6,0.22,0.35,vermilion);
  shrineRoof(12,3.8,5,7.8,5.8);
  sign('My resume',12,3.1,8.05,3.9);
  block(12, 0.65, 6.5, 1.8, 1.3, 1.2, wood, true);
  block(12,1.35,6.5,1.5,0.08,1,red);
  [-0.36,0.36].forEach(offset => {
    block(12+offset,1.42,6.5,0.66,0.08,0.88,cream);
    for (let line=0;line<5;line++) block(12+offset,1.468,6.22+line*0.13,0.46,0.014,0.025,wood);
  });
  block(12,1.47,6.5,0.055,0.025,0.92,timber);
  sign('Cedric Palapuz',12,0.8,7.16,1.4);

  // Post office and arcade awnings.
  station = destinations.find(place => place.id === 'contact');
  building(6, 14, 'Let’s talk');
  desk(6,14,3.2);
  block(5.65,1.22,14.15,0.9,0.06,0.65,cream);
  block(5.92,1.255,13.97,0.16,0.025,0.14,vermilion);
  for (let line=0;line<3;line++) block(5.5,1.257,14.05+line*0.12,0.35,0.02,0.025,timber);
  block(6.4,1.29,14.1,0.19,0.2,0.19,dark);
  block(6.4,1.56,14.1,0.045,0.5,0.045,wood);
  bonsai(7.05,1.2,13.92);
  block(8.3,0.67,13.3,0.22,1.25,0.22,timber,true);
  block(8.3,1.6,13.3,0.9,0.95,0.7,vermilion,true);
  block(8.3,2.13,13.3,1.1,0.18,0.9,roof);
  block(8.3,1.8,13.67,0.6,0.1,0.035,dark);
  sign('Letters',8.3,1.47,13.7,0.65);
  station = destinations.find(place => place.id === 'arcade');
  block(-9,0.1,14,7.1,0.2,5.4,stoneLight);
  block(-9,0.22,14,6.7,0.12,5,planks);
  [-11.9,-6.1].forEach(x => [12.1,15.9].forEach(z => block(x,1.75,z,0.35,3.5,0.35,timber,true)));
  shojiPanel(-9,1.8,11.95,5.5,2.5);
  block(-9,3.15,15.9,6.3,0.25,0.35,vermilion);
  shrineRoof(-9,3.6,14,7.6,5.8);
  [-11,-9,-7].forEach((x,i) => {
    block(x,1.25,14,1.45,2.2,0.9,[leaves[0],wood,purple][i],true);
    block(x,2.42,14,1.6,0.16,1.05,timber);
    block(x,1.78,14.48,1.26,1.0,0.08,dark);
    const tile=document.createElement('canvas'); tile.width=512; tile.height=448;
    const ctx=tile.getContext('2d'); ctx.fillStyle='#1e302c'; ctx.fillRect(0,0,512,448);
    ctx.fillStyle=['#b5d597','#deb16f','#c0afd4'][i]; ctx.font='32px Minecraft, monospace'; ctx.textAlign='center';
    ctx.fillText(['Ore Rush','Crafting Bench','Creeper Sweep'][i],256,52,476);
    for (let row=0;row<5;row++) for (let col=0;col<7;col++) {
      ctx.fillStyle=(row+col+i)%3===0 ? ['#70bcd0','#ca9f67','#91b46d'][i] : '#3e5550';
      ctx.fillRect(59+col*57,108+row*57,47,47);
    }
    canvasPanel(tile,x,1.78,14.55,1.14,0.92);
    block(x,1.16,14.6,1.5,0.14,0.55,timber);
    block(x-0.38,1.33,14.67,0.07,0.23,0.07,dark);
    block(x-0.38,1.47,14.67,0.18,0.14,0.18,red);
    [0.12,0.4].forEach(offset=>block(x+offset,1.26,14.66,0.15,0.08,0.15,offset<0.2 ? gold : leaves[2]));
  });
  sign('Games',-9,2.98,17.05,3.5);

  // The garden wall displays the same saved contribution data as its field guide.
  station = destinations.find(place => place.id === 'github');
  block(18,1.8,-1,7.2,3.6,0.4,timber,true);
  [14.2,21.8].forEach(x => {
    block(x,2.2,-1,0.4,4.4,0.55,timber,true);
    block(x,0.22,-1,0.7,0.44,0.85,stoneLight);
  });
  shrineRoof(18,4.65,-1,8.6,2.8);
  block(18,1.8,-.76,6.8,3.2,0.12,dark);
  sign('My GitHub',18,3.68,.55,4.8,'CORELOCKED');
  block(18,.3,.1,7.5,.6,1.3,stoneLight,true);
  [15,16,20,21].forEach(x=>{
    block(x,.8,.1,.3,.8,.3,leaves[0]);
    block(x,1.25,.1,.65,.4,.65,leaves[2]);
  });
  const gardenMaterial=material('#ffffff');
  const garden=new THREE.InstancedMesh(geometry,gardenMaterial,53*7);
  garden.position.set(station.x,0,station.z); garden.rotation.y=station.yaw;
  const gardenTransform=new THREE.Object3D();
  for(let week=0;week<53;week++)for(let day=0;day<7;day++){
    const index=week*7+day;
    gardenTransform.position.set(-3.18+week*.122,2.5-day*.23,.39);
    gardenTransform.scale.set(.105,.195,.12);gardenTransform.updateMatrix();
    garden.setMatrixAt(index,gardenTransform.matrix);garden.setColorAt(index,new THREE.Color('#455440'));
  }
  scene.add(garden);
  station = null;

  // Fountain and planted borders around the plaza.
  block(0, 0.27, 0, 4, 0.55, 4, stoneLight, true);
  block(0, 0.57, 0, 3.4, 0.15, 3.4, water);
  block(0, 1.0, 0, 0.9, 1.0, 0.9, stone);
  block(0, 1.6, 0, 2, 0.25, 2, stoneLight);
  block(0, 1.77, 0, 1.7, 0.12, 1.7, water);
  for (let i = 0; i < 200; i++) {
    const x = Math.round(random()*66-33), z = Math.round(random()*62-31);
    if (inPond(x,z) || Math.abs(x)+Math.abs(z)>islandBounds.diagonal-2 || isWorldPath(x,z) || destinations.some(s=>Math.hypot(s.x-x,s.z-z)<6)) continue;
    block(x, 0.18, z, 0.1, 0.35, 0.1, leaves[0]);
    if (i%3 === 0) block(x, 0.4, z, 0.3, 0.22, 0.3, [white,gold,red][i%7%3]);
  }
  // Recess the pond into the terrain, with a stone bank and a clear bridge crossing.
  pondTiles.forEach(([x,z]) => {
    block(x,-0.5,z,1,0.3,1,stone);
    block(x,-0.13,z,1,0.06,1,water,Math.abs(x+27)>1);
    [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dx,dz]) => {
      if (!inPond(x+dx,z+dz)) block(x+dx*0.5,-0.1,z+dz*0.5,dx ? 0.35 : 1,0.4,dz ? 0.35 : 1,stoneLight);
    });
  });
  for (let z=1;z<=11;z++) block(-27,0.06,z,2.7,0.12,0.94,planks);
  [-28.45,-25.55].forEach(x => {
    block(x,0.72,6,0.15,0.15,10.6,vermilion,true);
    [1,3.5,6,8.5,11].forEach(z => {
      block(x,0.4,z,0.18,0.9,0.18,vermilion,true);
      block(x,0.9,z,0.28,0.12,0.28,timber);
    });
  });
  [[-29,4],[-25,8],[-29,7]].forEach(([x,z])=>block(x,-0.07,z,0.55,0.04,0.5,leaves[0]));
  block(-29,-0.015,4,0.2,0.07,0.2,blossoms[1]);
  character(skinMaterial(kmbapSkin),'kmbap',-29.5,0,12.5,Math.PI*0.7);
  pet(true,dogSkin,-28.2,0,12.7,Math.PI*0.7);
  pet(false,brownCatSkin,-30.5,0,12.7,Math.PI*0.7);
  pet(true,spottedDogSkin,-29.5,0,14.5,Math.PI*0.7);

  // Distant cloud blocks give the island a visible silhouette.
  [[-33,20,-32],[28,23,-40],[-35,26,10],[38,18,0]].forEach(([x,y,z])=>{
    block(x*1.5,y,z*1.5,10,1.5,4,white); block(x*1.5+2,y+1,z*1.5,5,1.5,3,white);
  });

  const dummy = new THREE.Object3D();
  batches.forEach((blocks, mat) => {
    const mesh = new THREE.InstancedMesh(geometry, mat, blocks.length);
    blocks.forEach(([x,y,z,w,h,d,yaw], i) => {
      dummy.position.set(x,y,z); dummy.scale.set(w,h,d); dummy.rotation.y=yaw; dummy.updateMatrix(); mesh.setMatrixAt(i,dummy.matrix);
    });
    mesh.castShadow = true; mesh.receiveShadow = true;
    mesh.computeBoundingSphere(); scene.add(mesh);
  });
  dummy.rotation.set(0,0,0); dummy.scale.set(1,1,1);
  groundTiles.forEach((tiles,mat) => {
    const mesh = new THREE.InstancedMesh(groundGeometry,mat,tiles.length);
    tiles.forEach(([x,z],i) => { dummy.position.set(x,0,z); dummy.updateMatrix(); mesh.setMatrixAt(i,dummy.matrix); });
    mesh.receiveShadow=true; mesh.computeBoundingSphere(); scene.add(mesh);
  });

  const starGeometry=new THREE.BufferGeometry();
  const starPositions=[];
  for(let i=0;i<220;i++){
    const angle=random()*Math.PI*2, elevation=.18+random()*1.2;
    starPositions.push(Math.cos(angle)*Math.cos(elevation)*80,Math.sin(elevation)*80,Math.sin(angle)*Math.cos(elevation)*80);
  }
  starGeometry.setAttribute('position',new THREE.Float32BufferAttribute(starPositions,3));
  const starMaterial=new THREE.PointsMaterial({color:'#e2ebff',size:.25,transparent:true,opacity:0,fog:false});
  materials.add(starMaterial);
  const stars=new THREE.Points(starGeometry,starMaterial);scene.add(stars);
  const moonMaterial=new THREE.MeshBasicMaterial({color:'#e4ebcd',fog:false});materials.add(moonMaterial);
  const moon=new THREE.Mesh(geometry,moonMaterial);moon.position.set(28,35,-50);moon.scale.set(4,4,.8);moon.visible=false;scene.add(moon);
  const sunDisc=new THREE.Mesh(geometry,glow);sunDisc.position.set(-32,42,-48);sunDisc.scale.set(5,5,1);scene.add(sunDisc);
  // Keep every lantern visible, but only calculate light from the nearest four.
  const lanternLights=Array.from({length:4},()=>{
    const light=new THREE.PointLight('#ffd58a',0,9,2); scene.add(light); return light;
  });
  scene.traverse(object => {
    if (object.isMesh || object.isPoints) { object.updateMatrix(); object.matrixAutoUpdate=false; }
  });

  let running = false, disposed = false, frame = 0, last = performance.now(), lastReport = 0;
  let viewDirty = true;
  let yaw = 0, pitch = 0, jumpHeight = 0, jumpVelocity = 0, nearest = null, locked = false;
  let drag = null;
  const altKeys = new Set();
  let restoreLock = false, altUnlockPending = false;
  const keys = new Set();
  const touch = { x: 0, z: 0 };
  const position = { ...arrivalPosition };

  function render() {
    if (disposed || document.hidden) return;
    const nearestLanterns=[...lanterns].sort((a,b)=>a.distanceToSquared(camera.position)-b.distanceToSquared(camera.position));
    lanternLights.forEach((light,i)=>light.position.copy(nearestLanterns[i]));
    renderer.render(scene,camera);
  }
  function resize() {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    camera.aspect = width / height; camera.updateProjectionMatrix();
    playerArm.position.x=camera.aspect*0.36; playerArm.updateMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1,1.5,Math.sqrt(1920*1080/(width*height))));
    renderer.setSize(width, height); render();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();

  function clearInput() { keys.clear(); touch.x = touch.z = 0; drag = null; }
  function unlock() { if (document.pointerLockElement === canvas) document.exitPointerLock(); }
  function stop() { running=false; cancelAnimationFrame(frame); frame=0; canvas.tabIndex=-1; playerArm.visible=false; clearInput(); altKeys.clear(); restoreLock=false; altUnlockPending=false; unlock(); render(); }
  function pause() { stop(); callbacks.onPause(); }
  function interact() { if (running && nearest) { pause(); callbacks.onInteract(nearest.id); } }
  function jump() { if (running && jumpHeight === 0) jumpVelocity = 5; }
  function requestLock() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    try { const request = canvas.requestPointerLock?.(); request?.catch(() => {}); } catch { /* Drag-to-look remains available when pointer lock is unavailable. */ }
  }
  function look(dx,dy) {
    yaw -= dx * 0.0025; pitch = Math.max(-1.1, Math.min(1.1, pitch - dy * 0.0025));
  }
  function keydown(event) {
    if (running && (event.code === 'AltLeft' || event.code === 'AltRight')) {
      event.preventDefault();
      if (!altKeys.size) {
        clearInput(); restoreLock=document.pointerLockElement===canvas;
        altUnlockPending=restoreLock; unlock();
      }
      altKeys.add(event.code); return;
    }
    if (!running || event.ctrlKey || event.metaKey || event.altKey || event.target.closest?.('button, a, input, textarea, select, dialog')) return;
    if (['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','KeyE','ShiftLeft','ShiftRight','Escape','KeyM'].includes(event.code)) event.preventDefault();
    keys.add(event.code);
    if (event.code === 'Escape') pause();
    if (event.code === 'KeyE' && !event.repeat) interact();
    if (event.code === 'KeyM' && !event.repeat) { pause(); callbacks.onGuide(); }
    if (event.code === 'Space' && !event.repeat) jump();
  }
  function keyup(event) {
    keys.delete(event.code);
    if (!altKeys.delete(event.code)) return;
    event.preventDefault();
    if (!altKeys.size && running && restoreLock && !altUnlockPending) {
      restoreLock=false; canvas.focus(); requestLock();
    }
  }
  function pointerdown(event) {
    if (!running || altKeys.size || document.pointerLockElement === canvas) return;
    drag = { x: event.clientX, y: event.clientY, moved: 0, id: event.pointerId };
    canvas.setPointerCapture(event.pointerId); canvas.focus();
  }
  function pointermove(event) {
    if (!running || altKeys.size) return;
    if (document.pointerLockElement === canvas) { look(event.movementX,event.movementY); return; }
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
    drag.moved += Math.abs(dx)+Math.abs(dy); look(dx,dy); drag.x=event.clientX; drag.y=event.clientY;
  }
  function pointerup(event) {
    if (drag?.id !== event.pointerId) return;
    const tapped = drag.moved < 5;
    drag = null;
    if (tapped) interact();
  }
  const pointercancel = () => { drag = null; };
  const click = () => { if (running && !altKeys.size && document.pointerLockElement === canvas) interact(); };
  function lockchange() {
    const wasLocked = locked; locked = document.pointerLockElement === canvas;
    if (locked && altKeys.size) { restoreLock=true; altUnlockPending=true; unlock(); return; }
    if (!locked && altUnlockPending) {
      altUnlockPending=false;
      if (!altKeys.size && running && restoreLock) { restoreLock=false; canvas.focus(); requestLock(); }
      return;
    }
    if (wasLocked && !locked && running) pause();
  }
  const visibility = () => { if (document.hidden && running) pause(); else if (!document.hidden) render(); };
  const blur = () => { if (running) pause(); else clearInput(); };
  const contextLost = event => { event.preventDefault(); pause(); callbacks.onError(); };
  window.addEventListener('keydown',keydown); window.addEventListener('keyup',keyup);
  window.addEventListener('blur',blur);
  document.addEventListener('pointerlockchange',lockchange);
  document.addEventListener('visibilitychange',visibility);
  canvas.addEventListener('pointerdown',pointerdown); canvas.addEventListener('pointermove',pointermove);
  canvas.addEventListener('pointerup',pointerup); canvas.addEventListener('pointercancel',pointercancel);
  canvas.addEventListener('click',click); canvas.addEventListener('webglcontextlost',contextLost);

  function tick(now) {
    frame = 0;
    if (!running || disposed) return;
    frame = requestAnimationFrame(tick);
    const dt = Math.min((now-last)/1000,0.04); last = now;
    let forward = Number(keys.has('KeyW') || keys.has('ArrowUp')) - Number(keys.has('KeyS') || keys.has('ArrowDown')) + touch.z;
    let side = Number(keys.has('KeyD')) - Number(keys.has('KeyA')) + touch.x;
    if (keys.has('ArrowLeft')) yaw += dt * 1.8;
    if (keys.has('ArrowRight')) yaw -= dt * 1.8;
    const length = Math.max(1, Math.hypot(forward,side)); forward /= length; side /= length;
    const speed = (keys.has('ShiftLeft') || keys.has('ShiftRight') ? 7 : 4.5) * dt;
    const dx = (-Math.sin(yaw)*forward+Math.cos(yaw)*side)*speed;
    const dz = (-Math.cos(yaw)*forward-Math.sin(yaw)*side)*speed;
    if (dx && canWalk(position.x+dx,position.z,obstacles)) position.x += dx;
    if (dz && canWalk(position.x,position.z+dz,obstacles)) position.z += dz;
    if (jumpHeight > 0 || jumpVelocity > 0) {
      jumpVelocity -= 13*dt; jumpHeight = Math.max(0,jumpHeight+jumpVelocity*dt);
      if (jumpHeight === 0) jumpVelocity = 0;
    }
    if (!viewDirty && camera.position.x===position.x && camera.position.y===1.85+jumpHeight && camera.position.z===position.z && camera.rotation.x===pitch && camera.rotation.y===yaw) return;
    viewDirty=false;
    camera.position.set(position.x,1.85+jumpHeight,position.z);
    camera.rotation.set(pitch,yaw,0,'YXZ');
    const target = destinations.find(s => {
      const entrance = destinationPoint(s,0,3.8);
      const dx = entrance.x-position.x, dz = entrance.z-position.z;
      const distance = Math.hypot(dx,dz);
      return distance < 4.7 && (distance < 1.6 || (-Math.sin(yaw)*dx-Math.cos(yaw)*dz)/distance > -0.15);
    }) || null;
    if (target?.id !== nearest?.id) { nearest=target; callbacks.onNearby(target); }
    if (now-lastReport>120) { lastReport=now; callbacks.onPosition({ ...position, yaw }); }
    render();
  }

  return {
    setLighting(daylight) {
      scene.background.set('#111c35').lerp(new THREE.Color('#bed2c1'),daylight);
      scene.fog.color.copy(scene.background);
      ambient.color.set('#889bc9').lerp(new THREE.Color('#f5f4d6'),daylight);
      ambient.groundColor.set('#293348').lerp(new THREE.Color('#6b7950'),daylight);
      ambient.intensity=.85+daylight*1.65;
      sun.color.set('#aac6ff').lerp(new THREE.Color('#fff0c1'),daylight);
      sun.intensity=.45+daylight*2.55;
      starMaterial.opacity=1-daylight;moon.visible=daylight<.35;sunDisc.visible=daylight>.35;
      lanternLights.forEach(light=>{light.intensity=(1-daylight)*12;});
      render();
    },
    setContributions(weeks=[]) {
      const shades=['#455440','#a3c47c','#769c4f','#4d793b','#c7e991'];
      for(let i=0;i<53*7;i++)garden.setColorAt(i,new THREE.Color(shades[0]));
      weeks.slice(0,53).forEach((week,index)=>week.contributionDays.forEach(day=>{
        if(day.weekday<0||day.weekday>6)return;
        const n=day.contributionCount,level=n<=0?0:n<=2?1:n<=5?2:n<=9?3:4;
        garden.setColorAt(index*7+day.weekday,new THREE.Color(shades[level]));
      }));
      garden.instanceColor.needsUpdate=true;render();
    },
    start() {
      camera.fov=68; camera.updateProjectionMatrix();
      viewDirty=true; lastReport=0;
      last=performance.now(); if (!frame) frame=requestAnimationFrame(tick);
      running=true; playerArm.visible=true; canvas.tabIndex=0; clearInput(); canvas.focus(); requestLock();
    },
    pause: stop,
    move(x,z) { touch.x=x; touch.z=z; },
    jump, interact,
    travel(id) {
      const station=destinations.find(s=>s.id===id);
      if (!station) return;
      Object.assign(position,destinationPoint(station)); yaw=station.yaw; pitch=0; jumpHeight=0; jumpVelocity=0;
      camera.position.set(position.x,1.85,position.z); camera.rotation.set(0,yaw,0); render();
    },
    dispose() {
      disposed=true; running=false; unlock(); cancelAnimationFrame(frame); observer.disconnect();
      window.removeEventListener('keydown',keydown); window.removeEventListener('keyup',keyup); window.removeEventListener('blur',blur);
      document.removeEventListener('pointerlockchange',lockchange); document.removeEventListener('visibilitychange',visibility);
      canvas.removeEventListener('pointerdown',pointerdown); canvas.removeEventListener('pointermove',pointermove);
      canvas.removeEventListener('pointerup',pointerup); canvas.removeEventListener('pointercancel',pointercancel);
      canvas.removeEventListener('click',click); canvas.removeEventListener('webglcontextlost',contextLost);
      scene.traverse(object=>{ if (object.isInstancedMesh) object.dispose(); });
      pendingImages.forEach(picture=>{ picture.onload=null; picture.onerror=null; picture.src=''; }); pendingImages.clear();
      geometry.dispose(); panelGeometry.dispose(); groundGeometry.dispose(); starGeometry.dispose(); characterGeometry.dispose(); armGeometry.dispose(); catGeometry.dispose(); dogGeometry.dispose(); materials.forEach(mat=>mat.dispose()); textures.forEach(texture=>texture.dispose());
      renderer.dispose(); canvas.remove();
    },
  };
}
