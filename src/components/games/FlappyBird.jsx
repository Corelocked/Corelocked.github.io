import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getHighscore, setHighscore } from '../../utils/highscores';
import { useGameTheme } from './gameTheme';

const FlappyBird = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const theme = useGameTheme();

  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  useEffect(() => {
    try {
      setBest(getHighscore('flappy') || 0);
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (score > best) {
      setBest(score);
      try {
        setHighscore('flappy', score);
      } catch (e) {}
    }
  }, [score, best]);

  const stateRef = useRef({
    raf: null,
    lastTime: 0,
    bird: { x: 0, y: 0, vy: 0, r: 3 },
    pipes: [],
    spawnTimer: 0,
    gravity: 0.24,
    flapImpulse: -4.25,
    speed: 1.45,
    gap: 34,
    groundH: 12,
    virtual: { w: 96, h: 168, scale: 1 },
  });

  const resetGame = useCallback(() => {
    const s = stateRef.current;
    const v = s.virtual || { w: 96, h: 168, scale: 1 };

    setScore(0);
    setGameOver(false);
    s.lastTime = 0;
    s.spawnTimer = 0;
    s.pipes = [];
    s.bird = {
      x: Math.floor(v.w * 0.32),
      y: Math.floor(v.h * 0.42),
      vy: 0,
      r: Math.max(3, Math.floor(v.h * 0.022)),
    };
  }, []);

  useEffect(() => {
    const updateSize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const VIRTUAL_W = 96;
      const VIRTUAL_H = 168;
      const availW = Math.floor(container.clientWidth * 0.96);
      const availH = Math.floor(container.clientHeight * 0.86);

      const scaleByW = Math.max(1, Math.floor(availW / VIRTUAL_W));
      const scaleByH = Math.max(1, Math.floor(availH / VIRTUAL_H));
      const scale = Math.max(1, Math.min(scaleByW, scaleByH));

      const cssW = VIRTUAL_W * scale;
      const cssH = VIRTUAL_H * scale;
      const dpr = window.devicePixelRatio || 1;

      canvas.style.width = cssW + 'px';
      canvas.style.height = cssH + 'px';
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);

      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0);

      stateRef.current.virtual = { w: VIRTUAL_W, h: VIRTUAL_H, scale };
      stateRef.current.gap = Math.max(30, Math.floor(VIRTUAL_H * 0.2));
      stateRef.current.groundH = Math.max(10, Math.floor(VIRTUAL_H * 0.075));
      stateRef.current.bird.r = Math.max(3, Math.floor(VIRTUAL_H * 0.022));

      if (!running) {
        stateRef.current.bird.x = Math.floor(VIRTUAL_W * 0.32);
        stateRef.current.bird.y = Math.floor(VIRTUAL_H * 0.42);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [running]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const effectState = stateRef.current;

    const drawBird = (x, y, r, flapFrame, isDark) => {
      const body = isDark ? '#ffe08a' : '#f59e0b';
      const wing = isDark ? '#facc15' : '#d97706';
      const beak = '#fb923c';
      const eye = isDark ? '#0a0a0a' : '#111827';
      const px = Math.max(1, Math.floor(r * 0.55));
      const bx = Math.floor(x - px * 2.5);
      const by = Math.floor(y - px * 2.5);

      ctx.fillStyle = body;
      ctx.fillRect(bx + px, by + px, px * 4, px * 3);
      ctx.fillRect(bx + px * 2, by, px * 2, px);

      ctx.fillStyle = wing;
      if (flapFrame) {
        ctx.fillRect(bx + px * 2, by + px * 2, px * 2, px * 2);
      } else {
        ctx.fillRect(bx + px * 1, by + px * 1, px * 2, px * 2);
      }

      ctx.fillStyle = beak;
      ctx.fillRect(bx + px * 5, by + px * 2, px, px);
      ctx.fillStyle = eye;
      ctx.fillRect(bx + px * 3, by + px, px, px);
    };

    const drawPipe = (x, topH, pipeW, h, gap, groundH, isDark) => {
      const pipe = isDark ? '#22c55e' : '#16a34a';
      const shade = isDark ? '#4ade80' : '#15803d';
      const capH = 4;

      const gapBottom = topH + gap;
      const floorY = h - groundH;

      ctx.fillStyle = pipe;
      ctx.fillRect(x, 0, pipeW, topH);
      ctx.fillRect(x - 1, topH - capH, pipeW + 2, capH);
      ctx.fillRect(x, gapBottom, pipeW, floorY - gapBottom);
      ctx.fillRect(x - 1, gapBottom, pipeW + 2, capH);

      ctx.fillStyle = shade;
      ctx.fillRect(x + Math.floor(pipeW * 0.68), 0, Math.max(1, Math.floor(pipeW * 0.2)), topH);
      ctx.fillRect(x + Math.floor(pipeW * 0.68), gapBottom, Math.max(1, Math.floor(pipeW * 0.2)), floorY - gapBottom);
    };

    const spawnPipe = (w, h, gap, groundH) => {
      const pipeW = Math.max(11, Math.floor(w * 0.19));
      const minTop = Math.max(18, Math.floor(h * 0.12));
      const maxTop = Math.max(minTop + 1, h - groundH - gap - 18);
      const topH = minTop + Math.floor(Math.random() * (maxTop - minTop + 1));
      stateRef.current.pipes.push({ x: w + 8, topH, w: pipeW, passed: false });
    };

    const loop = (ts) => {
      const s = stateRef.current;
      if (!s.lastTime) s.lastTime = ts;
      const dt = Math.min(32, ts - s.lastTime);
      s.lastTime = ts;

      const dpr = window.devicePixelRatio || 1;
      const { w, h, scale } = s.virtual || { w: 96, h: 168, scale: 1 };
      const groundY = h - s.groundH;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false;
      ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0);

      const isDark = !!theme?.isDark;
      const sky = isDark ? '#274690' : '#4cc9f0';
      const cloud = isDark ? '#9db4ff' : '#d9f4ff';
      const ground = isDark ? '#264653' : '#7ac943';
      const groundEdge = isDark ? '#3f7f7a' : '#4d9f2a';

      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < 4; i++) {
        const cx = (i * 33 + Math.floor(ts / 70)) % (w + 24) - 24;
        const cy = 16 + i * 18;
        ctx.fillStyle = cloud;
        ctx.fillRect(cx, cy, 10, 4);
        ctx.fillRect(cx + 2, cy - 2, 6, 2);
      }

      ctx.fillStyle = ground;
      ctx.fillRect(0, groundY, w, s.groundH);
      ctx.fillStyle = groundEdge;
      ctx.fillRect(0, groundY, w, 2);

      if (running && !gameOver) {
        s.bird.vy += s.gravity * (dt / 16);
        s.bird.y += s.bird.vy * (dt / 16);

        s.spawnTimer += dt;
        const spawnEvery = Math.max(1080 - score * 4, 700);
        if (s.spawnTimer >= spawnEvery) {
          spawnPipe(w, h, s.gap, s.groundH);
          s.spawnTimer = 0;
        }

        for (let i = s.pipes.length - 1; i >= 0; i--) {
          const p = s.pipes[i];
          p.x -= s.speed * (dt / 16);
          if (!p.passed && p.x + p.w < s.bird.x) {
            p.passed = true;
            setScore(v => v + 1);
          }
          if (p.x + p.w < -8) s.pipes.splice(i, 1);
        }

        const birdTop = s.bird.y - s.bird.r;
        const birdBottom = s.bird.y + s.bird.r;
        const birdLeft = s.bird.x - s.bird.r;
        const birdRight = s.bird.x + s.bird.r;

        if (birdTop < 0 || birdBottom > groundY) {
          setGameOver(true);
          setRunning(false);
        }

        for (let i = 0; i < s.pipes.length; i++) {
          const p = s.pipes[i];
          const overlapX = birdRight > p.x && birdLeft < p.x + p.w;
          const gapTop = p.topH;
          const gapBottom = p.topH + s.gap;
          const hitGap = birdTop < gapTop || birdBottom > gapBottom;
          if (overlapX && hitGap) {
            setGameOver(true);
            setRunning(false);
            break;
          }
        }
      }

      const flapFrame = Math.floor(ts / 110) % 2;
      for (let i = 0; i < s.pipes.length; i++) {
        const p = s.pipes[i];
        drawPipe(p.x, p.topH, p.w, h, s.gap, s.groundH, isDark);
      }
      drawBird(s.bird.x, s.bird.y, s.bird.r, flapFrame, isDark);

      s.raf = requestAnimationFrame(loop);
    };

    if (running && !gameOver) {
      stateRef.current.lastTime = 0;
      stateRef.current.raf = requestAnimationFrame(loop);
    }
    if ((!running || gameOver) && stateRef.current.raf) {
      cancelAnimationFrame(stateRef.current.raf);
      stateRef.current.raf = null;
    }

    return () => {
      if (effectState.raf) cancelAnimationFrame(effectState.raf);
    };
  }, [running, gameOver, score, best, theme]);

  const flap = useCallback(() => {
    if (gameOver) return;
    if (!running) {
      resetGame();
      setRunning(true);
      return;
    }
    stateRef.current.bird.vy = stateRef.current.flapImpulse;
  }, [running, gameOver, resetGame]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    const onKeyDown = e => {
      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        flap();
      }
    };

    const onPointer = () => flap();
    window.addEventListener('keydown', onKeyDown);
    const canvas = canvasRef.current;
    if (canvas) canvas.addEventListener('pointerdown', onPointer);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      if (canvas) canvas.removeEventListener('pointerdown', onPointer);
    };
  }, [flap]);

  const start = () => {
    resetGame();
    setRunning(true);
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '4px 6px',
        gap: 6,
      }}
    >
      <div style={{ position: 'relative', display: 'inline-flex' }}>
        <canvas
          ref={canvasRef}
          style={{
            borderRadius: 12,
            border: `1px solid ${theme?.cellBorder || '#333'}`,
            boxShadow: theme?.isDark ? '0 12px 24px rgba(0,0,0,0.36)' : '0 12px 24px rgba(0,0,0,0.16)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            right: 8,
            display: 'flex',
            justifyContent: 'space-between',
            pointerEvents: 'none',
            gap: 8,
          }}
        >
          <div
            style={{
              minWidth: 56,
              padding: '6px 10px',
              borderRadius: 10,
              background: theme?.isDark ? 'rgba(2,6,23,0.78)' : 'rgba(255,255,255,0.86)',
              border: `1px solid ${theme?.cellBorder || '#333'}`,
              color: theme?.isDark ? '#dbeafe' : '#111827',
              fontFamily: 'var(--mono-font), monospace',
              lineHeight: 1.1,
            }}
          >
            <div style={{ fontSize: 9, opacity: 0.8 }}>SCORE</div>
            <div style={{ fontSize: 14, fontWeight: 800 }}>{score}</div>
          </div>

          <div
            style={{
              minWidth: 56,
              padding: '6px 10px',
              borderRadius: 10,
              background: theme?.isDark ? 'rgba(2,6,23,0.78)' : 'rgba(255,255,255,0.86)',
              border: `1px solid ${theme?.cellBorder || '#333'}`,
              color: theme?.isDark ? '#fde68a' : '#92400e',
              fontFamily: 'var(--mono-font), monospace',
              lineHeight: 1.1,
              textAlign: 'right',
            }}
          >
            <div style={{ fontSize: 9, opacity: 0.85 }}>BEST</div>
            <div style={{ fontSize: 14, fontWeight: 800 }}>{best}</div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 8,
          marginTop: 2,
          padding: '6px 10px',
          borderRadius: 999,
          background: theme?.isDark ? 'rgba(15,23,42,0.45)' : 'rgba(255,255,255,0.72)',
          border: `1px solid ${theme?.cellBorder || '#333'}`,
        }}
      >
        <button onClick={start} style={{ ...(theme?.smallBtn || {}), fontWeight: 700, padding: '8px 14px' }}>
          Start
        </button>
        <button onClick={flap} style={{ ...(theme?.smallBtn || {}), fontWeight: 700, padding: '8px 14px' }}>
          Flap
        </button>
      </div>

      <div
        style={{
          marginTop: 2,
          fontSize: '11px',
          color: theme?.subColor,
          background: theme?.isDark ? 'rgba(15,23,42,0.4)' : 'rgba(255,255,255,0.65)',
          border: `1px solid ${theme?.cellBorder || '#333'}`,
          borderRadius: 999,
          padding: '4px 10px',
        }}
      >
        Portrait mode - tap, click, or press Space
      </div>

      {gameOver && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              padding: '8px 12px',
              borderRadius: 10,
              background: theme?.isDark ? 'rgba(2,6,23,0.82)' : 'rgba(255,255,255,0.85)',
              border: `1px solid ${theme?.cellBorder || '#333'}`,
              color: theme?.titleColor || '#111827',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            Game Over
          </div>
        </div>
      )}
    </div>
  );
};

export default FlappyBird;
