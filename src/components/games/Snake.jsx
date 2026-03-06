import React, { useState, useEffect, useRef, useCallback } from 'react';

const GRID = 15;
const TICK = 140;

const Snake = () => {
  const [snake, setSnake] = useState([[7,7],[7,8],[7,9]]);
  const [food, setFood] = useState([3,3]);
  const [, setDir] = useState([0,-1]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [running, setRunning] = useState(false);
  const dirRef = useRef([0,-1]);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState(225);

  const spawnFood = useCallback((snk) => {
    let pos;
    while (true) {
      pos = [Math.floor(Math.random()*GRID), Math.floor(Math.random()*GRID)];
      let collision = false;
      for (let i = 0; i < snk.length; i++) {
        if (snk[i][0] === pos[0] && snk[i][1] === pos[1]) { collision = true; break; }
      }
      if (!collision) return pos;
    }
  }, []);

  const reset = () => {
    const s = [[7,7],[7,8],[7,9]];
    setSnake(s);
    setDir([0,-1]);
    dirRef.current = [0,-1];
    setFood(spawnFood(s));
    setGameOver(false);
    setScore(0);
    setRunning(true);
  };

  // Key / swipe controls
  useEffect(() => {
    const handleKey = (e) => {
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d'].includes(e.key)) {
        e.preventDefault();
      }
      const d = dirRef.current;
      if ((e.key === 'ArrowUp' || e.key === 'w') && d[1] !== 1) { dirRef.current = [0,-1]; setDir([0,-1]); }
      else if ((e.key === 'ArrowDown' || e.key === 's') && d[1] !== -1) { dirRef.current = [0,1]; setDir([0,1]); }
      else if ((e.key === 'ArrowLeft' || e.key === 'a') && d[0] !== 1) { dirRef.current = [-1,0]; setDir([-1,0]); }
      else if ((e.key === 'ArrowRight' || e.key === 'd') && d[0] !== -1) { dirRef.current = [1,0]; setDir([1,0]); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Game loop
  useEffect(() => {
    if (!running || gameOver) return;
    const interval = setInterval(() => {
      setSnake(prev => {
        const d = dirRef.current;
        const head = [(prev[0][0]+d[0]+GRID)%GRID, (prev[0][1]+d[1]+GRID)%GRID];
        // Self collision
        if (prev.some(s => s[0]===head[0] && s[1]===head[1])) {
          setGameOver(true);
          setRunning(false);
          setBest(b => Math.max(b, score));
          return prev;
        }
        const next = [head, ...prev];
        if (head[0]===food[0] && head[1]===food[1]) {
          setScore(s => s+1);
          setFood(spawnFood(next));
        } else {
          next.pop();
        }
        return next;
      });
    }, TICK);
    return () => clearInterval(interval);
  }, [running, gameOver, food, score, spawnFood]);

  // Draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const cellPx = w / GRID;
    ctx.clearRect(0,0,w,w);

    // Grid
    ctx.fillStyle = 'rgba(255,255,255,0.02)';
    for (let i=0;i<GRID;i++) for (let j=0;j<GRID;j++) {
      if ((i+j)%2===0) ctx.fillRect(i*cellPx,j*cellPx,cellPx,cellPx);
    }

    // Food
    ctx.fillStyle = '#ff6b9d';
    ctx.beginPath();
    ctx.arc(food[0]*cellPx+cellPx/2, food[1]*cellPx+cellPx/2, cellPx*0.4, 0, Math.PI*2);
    ctx.fill();

    // Snake
    snake.forEach((s,i) => {
      const ratio = 1 - i/snake.length*0.4;
      ctx.fillStyle = i===0 ? '#4fc3f7' : `rgba(79,195,247,${ratio*0.8})`;
      const pad = i===0 ? 0.5 : 1;
      ctx.beginPath();
      ctx.roundRect(s[0]*cellPx+pad, s[1]*cellPx+pad, cellPx-pad*2, cellPx-pad*2, 3);
      ctx.fill();
    });
  }, [snake, food, canvasSize]);

  // Responsive canvas sizing based on container width
  useEffect(() => {
    const updateSize = () => {
      const container = containerRef.current;
      if (!container) return;
      const available = Math.floor(container.clientWidth - 32); // padding
      const size = Math.max(180, Math.min(420, available));
      setCanvasSize(size);
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Touch controls
  const touchStart = useRef(null);
  const handleTouchStart = (e) => { touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
  const handleTouchEnd = (e) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    const d = dirRef.current;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 20 && d[0] !== -1) { dirRef.current = [1,0]; setDir([1,0]); }
      else if (dx < -20 && d[0] !== 1) { dirRef.current = [-1,0]; setDir([-1,0]); }
    } else {
      if (dy > 20 && d[1] !== -1) { dirRef.current = [0,1]; setDir([0,1]); }
      else if (dy < -20 && d[1] !== 1) { dirRef.current = [0,-1]; setDir([0,-1]); }
    }
    touchStart.current = null;
  };

  return (
    <div style={styles.container} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div ref={containerRef} style={styles.scoresContainer}>
        <div style={styles.scores}>
        <span style={styles.scoreText}>Score: {score}</span>
        <span style={{...styles.scoreText, color: '#ff6b9d'}}>Best: {best}</span>
        </div>
        <canvas ref={canvasRef} width={canvasSize} height={canvasSize} style={styles.canvas} />
      </div>
      {(!running || gameOver) && (
        <div style={styles.overlay}>
          <div style={styles.overlayText}>{gameOver ? 'Game Over!' : 'Snake'}</div>
          <button onClick={reset} style={styles.btn}>{gameOver ? 'Retry' : 'Start'}</button>
          <div style={styles.hint}>Swipe or Arrow keys</div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'center', position: 'relative', padding: '4px 0', touchAction: 'none' },
  scoresContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' },
  scores: { display: 'flex', gap: 16, marginBottom: 8 },
  scoreText: { fontSize: 12, fontWeight: 700, color: '#4fc3f7', fontFamily: 'var(--mono-font), monospace' },
  canvas: { borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)', maxWidth: '100%', height: 'auto' },
  overlay: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', borderRadius: 10, backdropFilter: 'blur(4px)' },
  overlayText: { color: '#fff', fontSize: 18, fontWeight: 700, marginBottom: 12, fontFamily: 'var(--heading-font), sans-serif' },
  btn: { padding: '6px 24px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #4fc3f7, #7c4dff)', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--body-font)' },
  hint: { color: 'rgba(255,255,255,0.4)', fontSize: 9, marginTop: 8, fontFamily: 'var(--body-font)' },
};

export default Snake;
