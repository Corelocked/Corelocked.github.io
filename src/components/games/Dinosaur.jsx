import React, { useRef, useEffect, useState, useCallback } from 'react';
import { getHighscore, setHighscore } from '../../utils/highscores';
import { useGameTheme } from './gameTheme';

const Dinosaur = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const theme = useGameTheme();

  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  useEffect(() => { try { setBest(getHighscore('dino') || 0); } catch (e) {} }, []);
  useEffect(() => { if (score > best) { setBest(score); try { setHighscore('dino', score); } catch (e) {} } }, [score, best]);

  // Game internals (positions are in virtual "pixels" — see resize logic)
  const stateRef = useRef({
    raf: null,
    lastTime: 0,
    spawnTimer: 0,
    obstacles: [],
    dino: { x: 0, y: 0, w: 0, h: 0, vy: 0, onGround: true, crouching: false },
    groundY: 0,
    virtual: { w: 160, h: 64, scale: 1 },
  });

  const resetGame = useCallback(() => {
    setScore(0);
    const s = stateRef.current;
    s.obstacles = [];
    s.spawnTimer = 0;
    const v = s.virtual || { w: 160, h: 64, scale: 1 };
    s.dino = { x: Math.max(12, Math.floor(v.w * 0.12)), y: (v.h - 8) - Math.max(6, Math.floor(v.h * 0.14)), w: Math.max(6, Math.floor(v.h * 0.14)), h: Math.max(6, Math.floor(v.h * 0.14)), vy: 0, onGround: true, crouching: false };
  }, []);

  // Resize canvas responsively to container
  useEffect(() => {
    const updateSize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;
      const containerW = Math.floor(container.clientWidth * 0.98);
      const containerH = Math.floor(container.clientHeight * 0.75); // use more available height

      // Base virtual grid width (in virtual pixels)
      const BASE_VIRTUAL_W = 100; // reduced to make canvas larger

      // Scene zoom: values >1 make the virtual world wider (effectively zoom out)
      const SCENE_ZOOM = 1.6; // keep at 1.6 as requested

      // Virtual world width
      const VIRTUAL_W = Math.floor(BASE_VIRTUAL_W * SCENE_ZOOM);

      // Compute scale to fit container width
      const scaleByWidth = Math.max(1, Math.floor(containerW * 0.98 / VIRTUAL_W));
      
      // Use the scale to determine CSS dimensions - wide horizontal ratio like Chrome dino
      const cssW = VIRTUAL_W * scaleByWidth;
      const cssH = Math.min(containerH, Math.floor(cssW * 0.28)); // wide horizontal ratio

      const virtualH = Math.max(50, Math.floor(cssH / scaleByWidth));
      const scale = scaleByWidth;

      const DPR = window.devicePixelRatio || 1;

      // set CSS size (what the user sees)
      canvas.style.width = cssW + 'px';
      canvas.style.height = cssH + 'px';

      // backing store in device pixels
      canvas.width = Math.floor(cssW * DPR);
      canvas.height = Math.floor(cssH * DPR);

      const ctx = canvas.getContext('2d');
      // nearest-neighbor for crisp pixel art
      ctx.imageSmoothingEnabled = false;
      // map virtual pixels to device pixels: virtual unit -> (scale * DPR) device pixels
      ctx.setTransform(scale * DPR, 0, 0, scale * DPR, 0, 0);

      // store virtual/grid info
      stateRef.current.virtual = { w: VIRTUAL_W, h: virtualH, scale };

      // ground and dino sized in virtual pixels
      stateRef.current.groundY = virtualH - 8;
      // dino size relative to virtual height - smaller
      stateRef.current.dino.w = Math.max(6, Math.floor(virtualH * 0.14));
      stateRef.current.dino.h = stateRef.current.dino.w;
      stateRef.current.dino.x = Math.max(12, Math.floor(VIRTUAL_W * 0.12));
      stateRef.current.dino.y = stateRef.current.groundY - stateRef.current.dino.h;
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Main loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    // capture ref snapshot for safe cleanup (avoids eslint hook warning)
    const effectState = stateRef.current;

    const gravity = 0.9;

    // Generic sprite renderer using tiny pixel matrices.
    const drawSprite = (ctx, x, y, sprite, pixelSize, palette) => {
      for (let row = 0; row < sprite.length; row++) {
        const line = sprite[row];
        for (let col = 0; col < line.length; col++) {
          const key = line[col];
          if (key === '.') continue;
          ctx.fillStyle = palette[key] || palette.default;
          ctx.fillRect(x + col * pixelSize, y + row * pixelSize, pixelSize, pixelSize);
        }
      }
    };

    // Better dinosaur model (2 run frames + crouch) with contrast details.
    const drawDino = (ctx, x, y, w, h, crouching, color, frame = 0) => {
      const runA = [
        '....XX......',
        '...XXXX.....',
        '..XXXXXXX...',
        '..XXXXEXX...',
        '..XXXXXXX...',
        '.XXXXXXXXX..',
        'XXXXXXXXXXXX',
        '.XXXXXX.....',
        '.XXXXXXXX...',
        '...XX..XX...',
        '..XX....XX..',
        '..X......X..',
      ];
      const runB = [
        '....XX......',
        '...XXXX.....',
        '..XXXXXXX...',
        '..XXXXEXX...',
        '..XXXXXXX...',
        '.XXXXXXXXX..',
        'XXXXXXXXXXXX',
        '.XXXXXX.....',
        '.XXXXXXXX...',
        '..XX..XX....',
        '..X....X....',
        '.X......XX..',
      ];
      const crouch = [
        '............',
        '............',
        '.XXXXXX.....',
        'XXXXXXXXX...',
        'XXXXEXXXXX..',
        'XXXXXXXXXXXX',
        '.XXXXXXXXXXX',
        '..XXXXXXXXX.',
        '..XX....XX..',
        '..X......X..',
      ];

      const sprite = crouching ? crouch : (frame ? runB : runA);
      const spriteW = sprite[0].length;
      const spriteH = sprite.length;
      const pxSize = Math.max(1, Math.floor(Math.min(w / spriteW, h / spriteH)));
      const drawX = Math.floor(x);
      const drawY = Math.floor(y + h - spriteH * pxSize);
      const palette = {
        X: color,
        E: theme?.isDark ? '#0b0b0b' : '#f9fafb',
        default: color,
      };
      drawSprite(ctx, drawX, drawY, sprite, pxSize, palette);
    };

    // Cactus model with two variants for visual variety.
    const drawCactus = (ctx, x, y, w, h, color, variant = 0) => {
      const cactusA = [
        '...XX...',
        '...XX...',
        '.XXXX...',
        '.XX.XX..',
        '.XX.XX..',
        '.XXXX...',
        '...XX...',
        '...XX...',
        '...XX...',
        '..XXXX..',
      ];
      const cactusB = [
        '..XX....',
        '..XX....',
        '..XX.XX.',
        '.XXXXXX.',
        '.XX..XX.',
        '.XXXXXX.',
        '...XX...',
        '...XX...',
        '..XXXX..',
      ];
      const sprite = variant ? cactusB : cactusA;
      const spriteW = sprite[0].length;
      const spriteH = sprite.length;
      const pxSize = Math.max(1, Math.floor(Math.min(w / spriteW, h / spriteH)));
      const drawX = Math.floor(x);
      const drawY = Math.floor(y + h - spriteH * pxSize);
      drawSprite(ctx, drawX, drawY, sprite, pxSize, { X: color, default: color });
    };

    // Bird model with deterministic wing flapping.
    const drawBird = (ctx, x, y, w, h, color, frame = 0) => {
      const birdUp = [
        '...XX......',
        '..XXXX.....',
        '.XXEXXX....',
        'XXXXXXXX...',
        '..XXXXXXX..',
        '....XXX....',
      ];
      const birdDown = [
        '...........',
        '.XX..XX....',
        'XXXXXXXXX..',
        '.XXEXXXXX..',
        '..XXXXXX...',
        '...XX.XX...',
      ];
      const sprite = frame ? birdDown : birdUp;
      const spriteW = sprite[0].length;
      const spriteH = sprite.length;
      const pxSize = Math.max(1, Math.floor(Math.min(w / spriteW, h / spriteH)));
      const drawX = Math.floor(x);
      const drawY = Math.floor(y + h - spriteH * pxSize);
      drawSprite(ctx, drawX, drawY, sprite, pxSize, {
        X: color,
        E: theme?.isDark ? '#0b0b0b' : '#f9fafb',
        default: color,
      });
    };

    const spawnObstacle = (W, H, speed) => {
      // Randomly spawn ground or flying obstacles
      const isFlying = Math.random() > 0.6; // 40% chance of flying obstacle
      
      if (isFlying) {
        // Flying obstacle (bird/pterodactyl)
        const w = Math.max(4, Math.floor(5 + Math.random() * (W * 0.025)));
        const h = Math.max(3, Math.floor(4 + Math.random() * (W * 0.02)));
        const flyHeight = Math.floor(H * 0.35 + Math.random() * (H * 0.15)); // fly at mid-height
        const spawnX = W + Math.floor(W * 0.5);
        stateRef.current.obstacles.push({ x: spawnX, w, h, speed, y: flyHeight, isFlying: true });
      } else {
        // Ground obstacle (cactus)
        const w = Math.max(3, Math.floor(4 + Math.random() * (W * 0.03)));
        const h = Math.max(4, Math.floor(5 + Math.random() * (H * 0.12)));
        const spawnX = W + Math.floor(W * 0.5);
        stateRef.current.obstacles.push({ x: spawnX, w, h, speed, isFlying: false });
      }
    };

    const loop = (ts) => {
      const s = stateRef.current;
      if (!s.lastTime) s.lastTime = ts;
      const dt = Math.min(32, ts - s.lastTime);
      s.lastTime = ts;

      // use virtual grid sizes and ensure clear in device pixels
      const DPR = window.devicePixelRatio || 1;
      const { w: V_W, h: V_H, scale } = stateRef.current.virtual || { w: 160, h: 64, scale: 1 };
      // clear full backing store (device pixels)
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // ensure nearest-neighbor and set transform so 1 virtual unit == (scale*DPR) device pixels
      ctx.imageSmoothingEnabled = false;
      ctx.setTransform(scale * DPR, 0, 0, scale * DPR, 0, 0);
      const W = V_W;
      const H = V_H;

      // Background layers (sky + horizon) for a richer UI.
      const skyTop = theme?.isDark ? '#0a1328' : '#d7ecff';
      const skyBottom = theme?.isDark ? '#1a2f5a' : '#f6fbff';
      const horizon = theme?.isDark ? '#2f4b75' : '#c8ddf3';
      const groundFill = theme?.isDark ? '#22343d' : '#d3d9bf';
      const lineColor = theme?.isDark ? '#5e7487' : '#a2a886';

      ctx.fillStyle = skyTop;
      ctx.fillRect(0, 0, W, Math.floor(H * 0.55));
      ctx.fillStyle = skyBottom;
      ctx.fillRect(0, Math.floor(H * 0.55), W, Math.floor(H * 0.25));
      ctx.fillStyle = horizon;
      ctx.fillRect(0, Math.floor(H * 0.8), W, Math.floor(H * 0.08));

      if (theme?.isDark) {
        for (let i = 0; i < 18; i++) {
          const sx = (i * 17 + 7) % W;
          const sy = (i * 11 + 5) % Math.max(8, Math.floor(H * 0.45));
          ctx.fillStyle = i % 3 === 0 ? '#dce8ff' : '#8fb0e0';
          ctx.fillRect(sx, sy, 1, 1);
        }
      } else {
        ctx.fillStyle = '#f9d66a';
        ctx.fillRect(W - 18, 6, 8, 8);
      }

      // Ground strip
      ctx.fillStyle = groundFill;
      ctx.fillRect(0, s.groundY, W, H - s.groundY);
      ctx.fillStyle = lineColor;
      ctx.fillRect(0, s.groundY, W, 2);

      // update dino
      const d = s.dino;
      if (running) {
        d.vy += gravity * (dt / 16);
        d.y += d.vy * (dt / 16);
      }
      // prevent dino from leaving the top of the virtual canvas
      if (d.y < 0) { d.y = 0; d.vy = Math.max(0, d.vy); }
      if (d.y >= s.groundY - d.h) { d.y = s.groundY - d.h; d.vy = 0; d.onGround = true; }

      const framePhase = Math.floor(ts / 120) % 2;

      // draw dino (white at night/dark during day)
      const dinoColor = theme?.isDark ? '#ffffff' : '#111111';
      drawDino(ctx, d.x, d.y, d.w, d.h, d.crouching && d.onGround, dinoColor, framePhase);

      // spawn obstacles based on timer
      if (running) {
        s.spawnTimer += dt;
        const spawnInterval = Math.max(700 - Math.floor(score / 2), 300);
        if (s.spawnTimer > spawnInterval) { spawnObstacle(W, H, Math.max(2, 3 + Math.floor(score / 200))); s.spawnTimer = 0; }
      }

      // update obstacles
      for (let i = s.obstacles.length - 1; i >= 0; i--) {
        const o = s.obstacles[i];
        o.x -= (o.speed * (dt / 16));
        // obstacles use matching foreground color (invert for night)
        const obstacleColor = theme?.isDark ? '#ffffff' : '#111111';
        
        if (o.isFlying) {
          // Draw bird at its y position
          drawBird(ctx, o.x, o.y, o.w, o.h, obstacleColor, framePhase);
        } else {
          // Draw cactus
          drawCactus(ctx, o.x, s.groundY - o.h, o.w, o.h, obstacleColor, i % 2);
        }
        
        // scoring when passes dino
        if (!o.scored && o.x + o.w < d.x) { o.scored = true; if (running) setScore(v => v + 1); }
        // remove off-screen (extend buffer for longer world)
        if (o.x + o.w < -Math.floor(W * 0.25)) s.obstacles.splice(i, 1);
        
        // collision: check based on obstacle type and dino state
        const collisionScale = 0.6; // fraction of obstacle height used for collision
        let collided = false;
        
        if (o.isFlying) {
          // Flying obstacle collision
          const oTop = o.y;
          const oBottom = o.y + o.h;
          const dTop = d.crouching && d.onGround ? s.groundY - Math.floor(d.h * 0.5) : d.y;
          const dBottom = d.crouching && d.onGround ? s.groundY : d.y + d.h;
          const dWidth = d.crouching && d.onGround ? Math.floor(d.w * 1.3) : d.w;
          
          if (d.x < o.x + o.w && d.x + dWidth > o.x && dTop < oBottom && dBottom > oTop) {
            collided = true;
          }
        } else {
          // Ground obstacle collision
          const collisionTop = s.groundY - Math.floor(o.h * collisionScale);
          const dTop = d.crouching && d.onGround ? s.groundY - Math.floor(d.h * 0.5) : d.y;
          const dBottom = d.crouching && d.onGround ? s.groundY : d.y + d.h;
          const dWidth = d.crouching && d.onGround ? Math.floor(d.w * 1.3) : d.w;
          
          if (d.x < o.x + o.w && d.x + dWidth > o.x && dTop < s.groundY && dBottom > collisionTop) {
            collided = true;
          }
        }
        
        if (collided) {
          setRunning(false);
        }
      }

      // HUD (matches foreground) with subtle labels.
      ctx.fillStyle = theme?.isDark ? '#ffffff' : '#111111';
      ctx.font = '6px monospace';
      ctx.textBaseline = 'top';
      ctx.fillStyle = theme?.isDark ? 'rgba(10, 15, 28, 0.8)' : 'rgba(255, 255, 255, 0.78)';
      ctx.fillRect(4, 4, 46, 10);
      ctx.fillRect(W - 50, 4, 46, 10);
      ctx.fillStyle = theme?.isDark ? '#e8f0ff' : '#1f2937';
      // Score on left
      ctx.textAlign = 'left';
      ctx.fillText(`Score: ${score}`, 8, 8);
      // Best score on right
      ctx.textAlign = 'right';
      ctx.fillText(`Best: ${best}`, W - 8, 8);
      // restore defaults
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';

      s.raf = requestAnimationFrame(loop);
    };

    if (running) { stateRef.current.lastTime = 0; stateRef.current.raf = requestAnimationFrame(loop); }
    if (!running && stateRef.current.raf) { cancelAnimationFrame(stateRef.current.raf); stateRef.current.raf = null; }

    return () => { if (effectState.raf) cancelAnimationFrame(effectState.raf); };
  }, [running, score, best, theme]);

  const jump = useCallback(() => {
    const d = stateRef.current.dino;
    if (!running) { setRunning(true); return; }
    if (d.onGround && !d.crouching) { d.vy = -Math.max(6, Math.floor(d.h * 1.1)); d.onGround = false; }
  }, [running]);

  const startCrouch = useCallback(() => {
    const d = stateRef.current.dino;
    if (running && d.onGround) {
      d.crouching = true;
    }
  }, [running]);

  const stopCrouch = useCallback(() => {
    const d = stateRef.current.dino;
    if (running) {
      d.crouching = false;
    }
  }, [running]);

  // controls: key and touch
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === ' ' || e.key === 'ArrowUp') { e.preventDefault(); jump(); }
      if (e.key === 'ArrowDown') { e.preventDefault(); startCrouch(); }
    };
    
    const onKeyUp = (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); stopCrouch(); }
    };
    
    const onClick = (e) => { jump(); };
    
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    const canvas = canvasRef.current;
    canvas && canvas.addEventListener('pointerdown', onClick);
    return () => { 
      window.removeEventListener('keydown', onKeyDown); 
      window.removeEventListener('keyup', onKeyUp);
      canvas && canvas.removeEventListener('pointerdown', onClick); 
    };
  }, [running, jump, startCrouch, stopCrouch]);

  const start = () => { resetGame(); setRunning(true); };
  const reset = () => { resetGame(); setRunning(false); };

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '8px', gap: 10 }}>
      <canvas ref={canvasRef} style={{ marginTop: 0, borderRadius: 10, border: `1px solid ${theme?.cellBorder || '#333'}`, boxShadow: theme?.isDark ? '0 10px 20px rgba(0,0,0,0.35)' : '0 10px 20px rgba(0,0,0,0.12)' }} />

      <div style={{ display: 'flex', gap: 10, marginTop: 8, padding: '6px 10px', borderRadius: 999, background: theme?.isDark ? 'rgba(15,23,42,0.45)' : 'rgba(255,255,255,0.72)', border: `1px solid ${theme?.cellBorder || '#333'}` }}>
        <button onClick={start} style={{ ...theme?.smallBtn, fontWeight: 700, padding: '8px 14px' }}>Start</button>
        <button onClick={reset} style={{ ...theme?.smallBtn, fontWeight: 700, padding: '8px 14px' }}>Reset</button>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 12, display: 'flex', justifyContent: 'center', gap: 18, pointerEvents: 'none' }}>
        <button 
          onClick={jump}
          style={{
            ...theme?.smallBtn,
            pointerEvents: 'auto',
            padding: '20px 36px',
            fontSize: '20px',
            fontWeight: '800',
            minWidth: '130px',
            borderRadius: 999,
            boxShadow: '0 8px 20px rgba(0,0,0,0.38)'
          }}
        >
          ↑ Jump
        </button>
        <button 
          onPointerDown={startCrouch}
          onPointerUp={stopCrouch}
          onPointerLeave={stopCrouch}
          style={{
            ...theme?.smallBtn,
            pointerEvents: 'auto',
            padding: '20px 36px',
            fontSize: '20px',
            fontWeight: '800',
            minWidth: '130px',
            borderRadius: 999,
            boxShadow: '0 8px 20px rgba(0,0,0,0.38)'
          }}
        >
          ↓ Crouch
        </button>
      </div>

      <div style={{ marginTop: 8, fontSize: '11px', color: theme?.subColor, background: theme?.isDark ? 'rgba(15,23,42,0.4)' : 'rgba(255,255,255,0.65)', border: `1px solid ${theme?.cellBorder || '#333'}`, borderRadius: 999, padding: '4px 10px' }}>Tip: Space/tap to jump, Down arrow to crouch</div>
    </div>
  );
};

export default Dinosaur;
