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
    dino: { x: 0, y: 0, w: 0, h: 0, vy: 0, onGround: true },
    groundY: 0,
    virtual: { w: 160, h: 64, scale: 1 },
  });

  const resetGame = useCallback(() => {
    setScore(0);
    const s = stateRef.current;
    s.obstacles = [];
    s.spawnTimer = 0;
    const v = s.virtual || { w: 160, h: 64, scale: 1 };
    s.dino = { x: Math.max(6, Math.floor(v.w * 0.12)), y: (v.h - 5) - Math.max(4, Math.floor(v.h * 0.28)), w: Math.max(4, Math.floor(v.h * 0.28)), h: Math.max(4, Math.floor(v.h * 0.28)), vy: 0, onGround: true };
  }, []);

  // Resize canvas responsively to container
  useEffect(() => {
    const updateSize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;
      const containerW = Math.floor(container.clientWidth * 0.96);
      const maxW = Math.min(640, containerW);
      const ratio = 0.45; // height ratio (taller canvas so dino has more room)

      // Base virtual grid width (in virtual pixels). We'll shrink it if container is smaller
      const BASE_VIRTUAL_W = 160;

      // If the container is narrower than the base virtual width, reduce the virtual width
      const VIRTUAL_W = containerW < BASE_VIRTUAL_W ? Math.max(64, Math.floor(containerW * 0.9)) : BASE_VIRTUAL_W;

      // compute integer scale so virtual pixels map to crisp screen pixels
      // allow a larger fraction so the game area is more prominent on phone
      const MAX_FRACTION = 0.98;
      const targetAvailable = Math.floor(containerW * MAX_FRACTION);
      const scale = Math.max(1, Math.floor(targetAvailable / VIRTUAL_W));
      const cssW = Math.min(VIRTUAL_W * scale, targetAvailable);
      const cssH = Math.max(140, Math.floor(cssW * ratio));

      const virtualH = Math.max(56, Math.floor(cssH / scale));

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
      stateRef.current.groundY = virtualH - 5;
      // make the dino smaller relative to the virtual height so it fits better
      stateRef.current.dino.w = Math.max(4, Math.floor(virtualH * 0.28));
      stateRef.current.dino.h = stateRef.current.dino.w;
      stateRef.current.dino.x = Math.max(8, Math.floor(VIRTUAL_W * 0.12));
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

    const spawnObstacle = (W, H, speed) => {
      // smaller obstacles so they don't overwhelm the scene on small grids
      const w = Math.max(4, Math.floor(6 + Math.random() * (W * 0.04)));
      const h = Math.max(4, Math.floor(6 + Math.random() * (H * 0.12)));
      stateRef.current.obstacles.push({ x: W + 8, w, h, speed });
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

      // background (fill by virtual pixels)
      ctx.fillStyle = theme?.cellBg || '#f7f7f7';
      ctx.fillRect(0, 0, W, H);

      // ground
      ctx.fillStyle = theme?.cellBorder || 'rgba(0,0,0,0.12)';
      ctx.fillRect(0, s.groundY, W, 1);

      // update dino
      const d = s.dino;
      if (running) {
        d.vy += gravity * (dt / 16);
        d.y += d.vy * (dt / 16);
      }
      // prevent dino from leaving the top of the virtual canvas
      if (d.y < 0) { d.y = 0; d.vy = Math.max(0, d.vy); }
      if (d.y >= s.groundY - d.h) { d.y = s.groundY - d.h; d.vy = 0; d.onGround = true; }

      // draw dino (white at night/dark, dark during day)
      ctx.fillStyle = theme?.isDark ? '#ffffff' : '#111111';
      ctx.fillRect(d.x, d.y, d.w, d.h);

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
        ctx.fillStyle = theme?.isDark ? '#ffffff' : '#111111';
        ctx.fillRect(o.x, s.groundY - o.h, o.w, o.h);
        // scoring when passes dino
        if (!o.scored && o.x + o.w < d.x) { o.scored = true; if (running) setScore(v => v + 1); }
        // remove off-screen
        if (o.x + o.w < -50) s.obstacles.splice(i, 1);
        // collision: use a reduced hitbox so obstacles are effectively lower
        const collisionScale = 0.6; // fraction of obstacle height used for collision
        const collisionTop = s.groundY - Math.floor(o.h * collisionScale);
        if (d.x < o.x + o.w && d.x + d.w > o.x && d.y < s.groundY && d.y + d.h > collisionTop) {
          // collided
          setRunning(false);
        }
      }

      // HUD (matches foreground) — font size is virtual-pixel based
      ctx.fillStyle = theme?.isDark ? '#ffffff' : '#111111';
      ctx.font = '8px monospace';
      ctx.fillText(`Score: ${score}`, 6, 10);
      ctx.fillText(`Best: ${best}`, 6, 18);

      s.raf = requestAnimationFrame(loop);
    };

    if (running) { stateRef.current.lastTime = 0; stateRef.current.raf = requestAnimationFrame(loop); }
    if (!running && stateRef.current.raf) { cancelAnimationFrame(stateRef.current.raf); stateRef.current.raf = null; }

    return () => { if (effectState.raf) cancelAnimationFrame(effectState.raf); };
  }, [running, score, best, theme]);

  // controls: key and touch
  useEffect(() => {
    const doJump = () => {
      const d = stateRef.current.dino;
      if (!running) { setRunning(true); return; }
      if (d.onGround) { d.vy = -Math.max(4, Math.floor(d.h * 0.6)); d.onGround = false; }
    };
    const onKey = (e) => {
      if (e.key === ' ' || e.key === 'ArrowUp') { e.preventDefault(); doJump(); }
    };
    const onClick = (e) => { doJump(); };
    window.addEventListener('keydown', onKey);
    const canvas = canvasRef.current;
    canvas && canvas.addEventListener('pointerdown', onClick);
    return () => { window.removeEventListener('keydown', onKey); canvas && canvas.removeEventListener('pointerdown', onClick); };
  }, [running]);

  const start = () => { resetGame(); setRunning(true); };
  const reset = () => { resetGame(); setRunning(false); };

  return (
    <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <canvas ref={canvasRef} style={{ marginTop: 8, borderRadius: 8, width: '100%', maxWidth: 560 }} />
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button onClick={start} style={theme?.smallBtn}>Start</button>
        <button onClick={reset} style={theme?.smallBtn}>Reset</button>
      </div>
      <div style={{ marginTop: 8, color: theme?.subColor }}>Tip: press Space or tap the canvas to jump</div>
    </div>
  );
};

export default Dinosaur;
