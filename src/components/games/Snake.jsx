import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getHighscore, setHighscore } from '../../utils/highscores';
import { useGameTheme } from './gameTheme';

const GRID = 15;
const TICK = 140;

const Snake = () => {
  const [snake, setSnake] = useState([[7,7],[7,8],[7,9]]);
  const [food, setFood] = useState([3,3]);
  const [, setDir] = useState([0,-1]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
    const [best, setBest] = useState(0); // Best score

    // load persisted best
    useEffect(() => {
      try { const b = getHighscore('snake'); setBest(b); } catch (e) {}
    }, []);
  const [running, setRunning] = useState(false);
  const dirRef = useRef([0,-1]);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState(225);
  const theme = useGameTheme();

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
          setBest(b => {
            const nb = Math.max(b, score);
            try { setHighscore('snake', nb); } catch (e) {}
            return nb;
          });
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
    ctx.fillStyle = theme ? theme.unrevealedCellBg : 'rgba(255,255,255,0.02)';
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
  }, [snake, food, canvasSize, theme]);

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
              <div style={{...styles.scoreCard, background: theme?.panelBg ?? styles.scoreCard.background, border: theme?.cellBorder ?? styles.scoreCard.border}}>
                <span style={{...styles.scoreLabel}}>Score</span>
                <span style={{...styles.scoreValue, color: '#4fc3f7'}}>{score}</span>
              </div>
              <div style={{...styles.scoreCard, background: theme?.panelBg ?? styles.scoreCard.background, border: theme?.cellBorder ?? styles.scoreCard.border}}>
                <span style={{...styles.scoreLabel}}>Best</span>
                <span style={{...styles.scoreValue, color: '#ff6b9d'}}>{best}</span>
              </div>
          </div>
          <canvas ref={canvasRef} width={canvasSize} height={canvasSize} style={{...styles.canvas, background: theme ? theme.cellBg : styles.canvas.background, border: theme ? theme.cellBorder : styles.canvas.border, boxShadow: running ? '0 8px 24px rgba(79, 195, 247, 0.15)' : '0 4px 12px rgba(0, 0, 0, 0.2)'}} />
        </div>
      {(!running || gameOver) && (
        <div style={styles.overlay}>
          <div style={{...styles.overlayText, fontSize: gameOver ? 22 : 24}}>{gameOver ? 'Game Over!' : 'Snake'}</div>
          {gameOver && <div style={styles.finalScore}>Score: {score}</div>}
              <button onClick={reset} style={theme ? theme.primaryBtn : styles.btn}>{gameOver ? 'Retry' : 'Start'}</button>
          <div style={{...styles.hint, color: theme ? theme.subColor : styles.hint.color}}>Use Arrow Keys or Swipe to Move</div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    height: '100%', 
    justifyContent: 'center', 
    position: 'relative', 
    padding: '8px 0', 
    touchAction: 'none',
    animation: 'fadeIn 0.4s ease-out'
  },
  scoresContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: 10 },
  scores: { 
    display: 'flex', 
    gap: 12, 
    marginBottom: 6,
    width: '100%',
    maxWidth: '420px',
    justifyContent: 'center'
  },
  scoreCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '8px 20px',
    background: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 12,
    border: '1px solid rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(8px)',
    minWidth: '70px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: 2,
    fontFamily: 'var(--body-font), sans-serif'
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: 800,
    fontFamily: 'var(--mono-font), monospace',
    textShadow: '0 2px 8px currentColor'
  },
  scoreText: { fontSize: 12, fontWeight: 700, color: '#4fc3f7', fontFamily: 'var(--mono-font), monospace' },
  canvas: { 
    borderRadius: 14, 
    border: '2px solid rgba(255,255,255,0.1)', 
    background: 'rgba(0,0,0,0.25)', 
    maxWidth: '100%', 
    height: 'auto',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
  },
  overlay: { 
    position: 'absolute', 
    inset: 0, 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    background: 'rgba(0,0,0,0.75)', 
    borderRadius: 14, 
    backdropFilter: 'blur(8px)',
    animation: 'fadeIn 0.3s ease-out'
  },
  overlayText: { 
    color: '#fff', 
    fontSize: 24, 
    fontWeight: 800, 
    marginBottom: 8, 
    fontFamily: 'var(--heading-font), sans-serif',
    textShadow: '0 2px 12px rgba(79, 195, 247, 0.5)'
  },
  finalScore: {
    color: '#4fc3f7',
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 16,
    fontFamily: 'var(--mono-font), monospace',
    textShadow: '0 2px 8px rgba(79, 195, 247, 0.4)'
  },
  btn: { 
    padding: '10px 32px', 
    borderRadius: 12, 
    border: 'none', 
    background: 'linear-gradient(135deg, #4fc3f7, #7c4dff)', 
    color: '#fff', 
    fontSize: 14, 
    fontWeight: 700, 
    cursor: 'pointer', 
    fontFamily: 'var(--body-font)',
    boxShadow: '0 4px 12px rgba(79, 195, 247, 0.3)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  hint: { 
    color: 'rgba(255,255,255,0.45)', 
    fontSize: 11, 
    marginTop: 12, 
    fontFamily: 'var(--body-font)',
    textAlign: 'center',
    lineHeight: 1.4
  },
};

export default Snake;
