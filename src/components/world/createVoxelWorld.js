import * as THREE from 'three';
import { canWalk, destinations } from './destinations';

export default function createVoxelWorld(host, callbacks) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#bed2c1');
  scene.fog = new THREE.Fog('#bed2c1', 48, 115);
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-label', 'Walkable voxel portfolio. Use WASD to walk, drag to look, and E to interact.');
  canvas.tabIndex = -1;
  host.appendChild(canvas);

  const camera = new THREE.PerspectiveCamera(49, 1, 0.1, 180);
  camera.rotation.order = 'YXZ';
  camera.position.set(35, 31, 43);
  camera.lookAt(-6, 0, 0);
  const ambient = new THREE.HemisphereLight('#f5f4d6', '#6b7950', 2.5);
  scene.add(ambient);
  const sun = new THREE.DirectionalLight('#fff0c1', 3.0);
  sun.position.set(-18, 35, 20);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -35, right: 35, top: 35, bottom: -35, near: 1, far: 100 });
  sun.shadow.normalBias = 0.035;
  scene.add(sun);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const materials = new Set();
  const textures = new Set();
  const batches = new Map();
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

  const grass = material('#718b44', true);
  const grassLight = material('#809851', true);
  const dirt = material('#886548', true);
  const stone = material('#858c7d', true);
  const stoneLight = material('#abb09a', true);
  const path = material('#c8b88c', true);
  const pathLight = material('#d4c49a', true);
  const wood = material('#8c6342', true);
  const timber = material('#554936', true);
  const planks = material('#bb9262', true);
  const cream = material('#dfd4b7', true);
  const roof = material('#596c58', true);
  const terracotta = material('#ad7056', true);
  const leaves = [material('#547848', true), material('#61864b', true), material('#789654', true)];
  const gold = material('#e3b84e');
  const dark = material('#354536');
  const purple = material('#827393');
  const red = material('#bb6d54');
  const white = material('#f6eed2');
  const water = material('#6ca5a0');
  const glow = new THREE.MeshBasicMaterial({ color: '#ffe7a1' });
  materials.add(glow);

  function block(x, y, z, w, h, d, mat, solid = false) {
    if (!batches.has(mat)) batches.set(mat, []);
    batches.get(mat).push([x, y, z, w, h, d]);
    if (solid) obstacles.push({ x, z, w, d });
  }

  // Each material is drawn as one instanced batch, including the terrain tiles.
  for (let x = -23; x <= 23; x++) {
    for (let z = -22; z <= 22; z++) {
      if (Math.abs(x) + Math.abs(z) > 39) continue;
      const onPath = Math.abs(x) < 2 || Math.abs(z - 1) < 2 || Math.abs(z - 11) < 2
        || ((Math.abs(x - 11) < 2 || Math.abs(x + 11) < 2) && z > -7 && z < 13);
      block(x, -0.22, z, 1, 0.44, 1, onPath ? (random() > 0.45 ? path : pathLight) : (random() > 0.3 ? grass : grassLight));
      const edge = Math.abs(x) === 23 || Math.abs(z) === 22 || Math.abs(x) + Math.abs(z) === 39;
      if (edge) {
        block(x, -1.2, z, 1, 1.6, 1, dirt);
        block(x * 0.98, -2.5, z * 0.98, 1, 1 + random() * 0.8, 1, stone);
      }
    }
  }
  block(0, -1.8, 0, 43, 2.5, 39, dirt);
  block(0, -3.6, 0, 38, 1.8, 35, stone);
  block(0, -4.9, 0, 30, 1, 29, stone);

  function sign(text, x, y, z, width = 4, subtitle = '') {
    const tile = document.createElement('canvas');
    tile.width = 768; tile.height = subtitle ? 224 : 160;
    const ctx = tile.getContext('2d');
    ctx.fillStyle = '#293c31'; ctx.fillRect(0, 0, tile.width, tile.height);
    ctx.strokeStyle = '#b7b47b'; ctx.lineWidth = 8; ctx.strokeRect(12, 12, 744, tile.height - 24);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#f8f1d6'; ctx.font = '46px Minecraft, monospace';
    ctx.fillText(text.toUpperCase(), 384, subtitle ? 84 : 83, 700);
    if (subtitle) { ctx.font = '24px Minecraft, monospace'; ctx.fillStyle = '#bed098'; ctx.fillText(subtitle, 384, 157, 700); }
    const texture = new THREE.CanvasTexture(tile);
    texture.colorSpace = THREE.SRGBColorSpace;
    textures.add(texture);
    const mat = new THREE.MeshBasicMaterial({ map: texture });
    materials.add(mat);
    const board = new THREE.Mesh(geometry, [timber, timber, timber, timber, mat, timber]);
    board.position.set(x, y, z); board.scale.set(width, width * tile.height / 768, 0.13);
    scene.add(board);
  }

  function lamp(x, z) {
    block(x, 1.1, z, 0.18, 2.2, 0.18, timber, true);
    block(x, 2.4, z, 0.55, 0.55, 0.55, glow);
    block(x, 2.75, z, 0.75, 0.15, 0.75, dark);
    block(x, 2.07, z, 0.65, 0.12, 0.65, dark);
    const light = new THREE.PointLight('#ffd58a', 0, 9, 2);
    light.position.set(x,2.5,z); lanterns.push(light); scene.add(light);
  }

  function tree(x, z, height = 4.8) {
    block(x, height / 2, z, 0.8, height, 0.8, timber, true);
    block(x, height - 0.4, z, 3.9, 1.6, 3.5, leaves[0]);
    block(x - 0.45, height + 0.8, z + 0.1, 3.1, 1.3, 3.0, leaves[1]);
    block(x + 0.2, height + 1.7, z, 1.9, 0.8, 2.1, leaves[2]);
  }

  [[-19,-14,5],[-19,-4,6],[-21,7,4],[-17,17,5],[19,-13,6],[21,-3,4],[20,13,5],[-9,-19,4],[12,-18,5],[16,19,4],[-3,20,4]].forEach(([x,z,h]) => tree(x,z,h));
  [[-3,6],[3,6],[-6,1],[6,1],[-16,-3],[16,-3],[-3,-10],[3,-10],[-15,11],[15,11]].forEach(([x,z]) => lamp(x,z));

  function building(x, z, roofMat, name, sub) {
    block(x, 0.08, z, 7.6, 0.16, 5.6, stoneLight);
    block(x, 1.8, z - 2.4, 7.2, 3.6, 0.4, cream, true);
    block(x - 3.4, 1.6, z, 0.4, 3.2, 5, planks, true);
    block(x + 3.4, 1.6, z, 0.4, 3.2, 5, planks, true);
    [-3.5, 3.5].forEach(dx => {
      block(x + dx, 1.8, z + 2.45, 0.45, 3.6, 0.45, timber, true);
      block(x + dx, 1.8, z - 2.45, 0.45, 3.6, 0.45, timber);
    });
    for (let level = 0; level < 4; level++) block(x, 3.6 + level * 0.55, z, 8.2 - level * 1.6, 0.55, 6.2, roofMat);
    block(x, 2.1, z - 2.13, 2.4, 1.3, 0.15, dark);
    sign(name, x, 3.1, z + 3.16, 5.4, sub);
  }

  building(-11, -8, roof, 'My work', '');
  building(11, -8, terracotta, 'About me', '');
  // Monitors and workbenches in the project workshop.
  [-13.2, -10.9, -8.6].forEach((x, i) => {
    block(x, 0.8, -8, 1.8, 1.4, 1.2, planks, true);
    block(x, 1.65, -8, 0.2, 0.6, 0.2, dark);
    block(x, 2.0, -8, 1.55, 0.9, 0.15, dark);
    block(x, 2.0, -7.91, 1.3, 0.65, 0.04, [leaves[2], water, purple][i]);
  });
  sign('Lakbay / Pitaka / BlogShark', -11, 1.0, -5.3, 5.5);
  // Cabin shelves and a tiny block character.
  for (let y = 0.5; y < 2.5; y += 0.7) {
    block(13, y, -9.8, 2, 0.12, 0.5, wood);
    [0,1,2,3].forEach(i => block(12.3 + i * 0.4, y + 0.25, -9.8, 0.25, 0.4, 0.35, [purple, red, leaves[1], gold][i]));
  }
  block(10, 0.5, -7, 0.65, 1, 0.45, dark, true);
  block(10, 1.3, -7, 1, 0.9, 0.55, leaves[1]);
  block(10, 2.1, -7, 0.7, 0.7, 0.7, planks);
  block(10, 2.48, -7.06, 0.76, 0.18, 0.8, timber);
  block(9.84, 2.15, -6.64, 0.09, 0.09, 0.04, dark);
  block(10.16, 2.15, -6.64, 0.09, 0.09, 0.04, dark);

  // Achievement gallery: framed plaques and a block-built trophy.
  block(0, 2.3, -16, 10, 4.6, 0.6, stone, true);
  block(0, 4.7, -16, 10.6, 0.25, 1, stoneLight);
  [-4.6,4.6].forEach(x => block(x, 2.5, -15.8, 0.65, 5, 1, stoneLight));
  [-3,0,3].forEach((x,i) => {
    block(x, 2.35, -15.6, 2.4, 2.4, 0.3, timber);
    block(x, 2.35, -15.4, 2.1, 2.1, 0.16, i === 1 ? gold : cream);
    sign(['C#', 'INABEL 2026', 'POWER BI'][i], x, 1.6, -15.25, 1.9);
    block(x, 2.7, -15.22, 0.65, 0.65, 0.15, i === 1 ? white : gold);
  });
  sign('Achievements', 0, 4.1, -15.5, 6.8);
  block(0, 0.5, -13.5, 1.7, 1, 1.7, stoneLight, true);
  block(0, 1.1, -13.5, 1.1, 0.22, 1.1, timber);
  block(0, 1.4, -13.5, 0.25, 0.6, 0.25, gold);
  block(0, 1.9, -13.5, 0.85, 0.65, 0.7, gold);
  [-0.6,0.6].forEach(x => block(x, 2, -13.5, 0.3, 0.4, 0.25, gold));

  // Crafting pavilion.
  [-14.7,-9.3].forEach(x => block(x, 1.75, 5, 0.35, 3.5, 0.35, timber, true));
  block(-12, 3.6, 5, 6.5, 0.4, 4, roof);
  block(-12, 0.75, 5, 3.5, 1.5, 1.7, wood, true);
  block(-12, 1.55, 5, 3.7, 0.18, 1.9, planks);
  for (let i=0;i<3;i++) for (let j=0;j<3;j++) block(-12.65+i*0.65, 1.66, 4.5+j*0.5, 0.55, 0.04, 0.4, timber);
  sign('What I use', -12, 2.9, 7.04, 5.7);

  // Open-air library.
  block(12, 1.5, 4, 5.7, 3, 0.7, timber, true);
  for (let row=0;row<3;row++) {
    block(12, 0.15 + row, 4.3, 5.7, 0.15, 1, planks);
    for (let i=0;i<12;i++) block(9.5+i*0.45, 0.6+row, 4.4, 0.33, 0.65, 0.6, [red,purple,leaves[1],cream][i%4]);
  }
  block(12, 3.2, 4, 6.4, 0.3, 1.8, roof);
  sign('My resume', 12, 3.85, 4.55, 5.5);
  block(12, 0.65, 6.5, 1.8, 1.3, 1.2, wood, true);
  block(12, 1.35, 6.5, 1.4, 0.12, 0.9, cream);

  // Post office and arcade awnings.
  building(6, 14, terracotta, 'Let’s talk', '');
  block(6, 1.05, 14.3, 1.1, 2.1, 1, dark, true);
  block(6, 1.7, 14.85, 0.7, 0.12, 0.05, gold);
  block(6, 2.2, 14.3, 1.3, 0.18, 1.1, gold);
  [-11.7,-6.3].forEach(x => block(x, 1.6, 14, 0.3, 3.2, 0.3, timber, true));
  for (let i=0;i<6;i++) block(-11.5+i, 3.4, 14, 1, 0.3, 4.4, i%2 ? cream : purple);
  [-10.3,-7.7].forEach(x => {
    block(x, 1, 14, 1.3, 2, 1, purple, true);
    block(x, 2.05, 14, 1.4, 0.25, 1.1, timber);
    block(x, 1.55, 14.53, 1, 0.65, 0.05, dark);
    block(x, 1.5, 14.57, 0.25, 0.25, 0.04, gold);
  });
  sign('Games', -9, 2.85, 16.25, 5.5);

  // The garden wall displays the same saved contribution data as its field guide.
  block(18,1.8,-1,7.2,3.6,0.4,timber,true);
  block(18,1.8,-.76,6.8,3.2,0.12,dark);
  sign('My GitHub',18,4,-.7,6.7,'CORELOCKED');
  block(18,.3,.1,7.5,.6,1.3,stoneLight,true);
  [15,16,20,21].forEach(x=>{
    block(x,.8,.1,.3,.8,.3,leaves[0]);
    block(x,1.25,.1,.65,.4,.65,leaves[2]);
  });
  const gardenMaterial=material('#ffffff');
  const garden=new THREE.InstancedMesh(geometry,gardenMaterial,53*7);
  const gardenTransform=new THREE.Object3D();
  for(let week=0;week<53;week++)for(let day=0;day<7;day++){
    const index=week*7+day;
    gardenTransform.position.set(14.82+week*.122,2.5-day*.23,-.61);
    gardenTransform.scale.set(.105,.195,.12);gardenTransform.updateMatrix();
    garden.setMatrixAt(index,gardenTransform.matrix);garden.setColorAt(index,new THREE.Color('#455440'));
  }
  scene.add(garden);

  // Fountain and planted borders around the plaza.
  block(0, 0.27, -3, 4, 0.55, 4, stoneLight, true);
  block(0, 0.57, -3, 3.4, 0.15, 3.4, water);
  block(0, 1.0, -3, 0.9, 1.0, 0.9, stone);
  block(0, 1.6, -3, 2, 0.25, 2, stoneLight);
  block(0, 1.77, -3, 1.7, 0.12, 1.7, water);
  for (let i = 0; i < 150; i++) {
    const x = Math.round(random()*42-21), z = Math.round(random()*40-20);
    if (Math.abs(x)<3 || Math.abs(z-1)<3 || Math.abs(z-11)<3 || destinations.some(s=>Math.hypot(s.x-x,s.z-z)<5)) continue;
    block(x, 0.18, z, 0.1, 0.35, 0.1, leaves[0]);
    if (i%3 === 0) block(x, 0.4, z, 0.3, 0.22, 0.3, [white,gold,red][i%7%3]);
  }
  // A pond tucked along the western bank.
  block(-18, 0.03, 4, 5, 0.08, 6, water, true);
  for (let z=2;z<=6;z++) block(-17, 0.14, z, 1.8, 0.18, 0.9, planks);
  [[-19,2],[-18,6],[-20,5]].forEach(([x,z])=>block(x, 0.12, z, 0.65, 0.1, 0.65, leaves[0]));

  // Distant cloud blocks give the island a visible silhouette.
  [[-33,20,-32],[28,23,-40],[-35,26,10],[38,18,0]].forEach(([x,y,z])=>{
    block(x,y,z,10,1.5,4,white); block(x+2,y+1,z,5,1.5,3,white);
  });

  const dummy = new THREE.Object3D();
  batches.forEach((blocks, mat) => {
    const mesh = new THREE.InstancedMesh(geometry, mat, blocks.length);
    blocks.forEach(([x,y,z,w,h,d], i) => {
      dummy.position.set(x,y,z); dummy.scale.set(w,h,d); dummy.updateMatrix(); mesh.setMatrixAt(i,dummy.matrix);
    });
    mesh.castShadow = true; mesh.receiveShadow = true;
    mesh.computeBoundingSphere(); scene.add(mesh);
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

  let running = false, disposed = false, frame = 0, last = performance.now(), lastReport = 0;
  let yaw = 0, pitch = 0, jumpHeight = 0, jumpVelocity = 0, nearest = null, locked = false;
  let drag = null;
  const keys = new Set();
  const touch = { x: 0, z: 0 };
  const position = { x: 0, z: 12 };

  function render() { if (!disposed) renderer.render(scene, camera); }
  function resize() {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    camera.aspect = width / height; camera.updateProjectionMatrix();
    renderer.setSize(width, height); render();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();

  function clearInput() { keys.clear(); touch.x = touch.z = 0; drag = null; }
  function unlock() { if (document.pointerLockElement === canvas) document.exitPointerLock(); }
  function pause() { running = false; canvas.tabIndex = -1; clearInput(); unlock(); callbacks.onPause(); }
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
    if (!running || event.ctrlKey || event.metaKey || event.altKey || event.target.closest?.('button, a, input, textarea, select, dialog')) return;
    if (['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','KeyE','ShiftLeft','ShiftRight','Escape','KeyM'].includes(event.code)) event.preventDefault();
    keys.add(event.code);
    if (event.code === 'Escape') pause();
    if (event.code === 'KeyE' && !event.repeat) interact();
    if (event.code === 'KeyM' && !event.repeat) { pause(); callbacks.onGuide(); }
    if (event.code === 'Space' && !event.repeat) jump();
  }
  const keyup = event => keys.delete(event.code);
  function pointerdown(event) {
    if (!running || document.pointerLockElement === canvas) return;
    drag = { x: event.clientX, y: event.clientY, moved: 0, id: event.pointerId };
    canvas.setPointerCapture(event.pointerId); canvas.focus();
  }
  function pointermove(event) {
    if (!running) return;
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
  const click = () => { if (running && document.pointerLockElement === canvas) interact(); };
  function lockchange() {
    const wasLocked = locked; locked = document.pointerLockElement === canvas;
    if (wasLocked && !locked && running) pause();
  }
  const visibility = () => { if (document.hidden && running) pause(); };
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
    frame = requestAnimationFrame(tick);
    const dt = Math.min((now-last)/1000,0.04); last = now;
    if (!running) return;
    let forward = Number(keys.has('KeyW') || keys.has('ArrowUp')) - Number(keys.has('KeyS') || keys.has('ArrowDown')) + touch.z;
    let side = Number(keys.has('KeyD')) - Number(keys.has('KeyA')) + touch.x;
    if (keys.has('ArrowLeft')) yaw += dt * 1.8;
    if (keys.has('ArrowRight')) yaw -= dt * 1.8;
    const length = Math.max(1, Math.hypot(forward,side)); forward /= length; side /= length;
    const speed = (keys.has('ShiftLeft') || keys.has('ShiftRight') ? 7 : 4.5) * dt;
    const dx = (-Math.sin(yaw)*forward+Math.cos(yaw)*side)*speed;
    const dz = (-Math.cos(yaw)*forward-Math.sin(yaw)*side)*speed;
    if (canWalk(position.x+dx,position.z,obstacles)) position.x += dx;
    if (canWalk(position.x,position.z+dz,obstacles)) position.z += dz;
    if (jumpHeight > 0 || jumpVelocity > 0) {
      jumpVelocity -= 13*dt; jumpHeight = Math.max(0,jumpHeight+jumpVelocity*dt);
      if (jumpHeight === 0) jumpVelocity = 0;
    }
    camera.position.set(position.x,1.85+jumpHeight,position.z);
    camera.rotation.set(pitch,yaw,0,'YXZ');
    const target = destinations.find(s => {
      const dx = s.x-position.x, dz = s.z+3.8-position.z;
      const distance = Math.hypot(dx,dz);
      return distance < 4.7 && (distance < 1.6 || (-Math.sin(yaw)*dx-Math.cos(yaw)*dz)/distance > -0.15);
    }) || null;
    if (target?.id !== nearest?.id) { nearest=target; callbacks.onNearby(target); }
    if (now-lastReport>120) { lastReport=now; callbacks.onPosition({ ...position, yaw }); }
    render();
  }
  frame=requestAnimationFrame(tick);

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
      lanterns.forEach(light=>{light.intensity=(1-daylight)*12;});
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
      running=true; canvas.tabIndex=0; clearInput(); canvas.focus(); requestLock();
    },
    pause() { running=false; canvas.tabIndex=-1; clearInput(); unlock(); },
    move(x,z) { touch.x=x; touch.z=z; },
    jump, interact,
    travel(id) {
      const station=destinations.find(s=>s.id===id);
      if (!station) return;
      position.x=station.x; position.z=station.z+5.4; yaw=0; pitch=0; jumpHeight=0; jumpVelocity=0;
      camera.position.set(position.x,1.85,position.z); camera.rotation.set(0,0,0); render();
    },
    dispose() {
      disposed=true; running=false; unlock(); cancelAnimationFrame(frame); observer.disconnect();
      window.removeEventListener('keydown',keydown); window.removeEventListener('keyup',keyup); window.removeEventListener('blur',blur);
      document.removeEventListener('pointerlockchange',lockchange); document.removeEventListener('visibilitychange',visibility);
      canvas.removeEventListener('pointerdown',pointerdown); canvas.removeEventListener('pointermove',pointermove);
      canvas.removeEventListener('pointerup',pointerup); canvas.removeEventListener('pointercancel',pointercancel);
      canvas.removeEventListener('click',click); canvas.removeEventListener('webglcontextlost',contextLost);
      scene.traverse(object=>{ if (object.isInstancedMesh) object.dispose(); });
      geometry.dispose(); starGeometry.dispose(); materials.forEach(mat=>mat.dispose()); textures.forEach(texture=>texture.dispose());
      renderer.dispose(); canvas.remove();
    },
  };
}
