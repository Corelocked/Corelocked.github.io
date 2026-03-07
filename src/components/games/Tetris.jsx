import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getHighscore, setHighscore } from '../../utils/highscores';
import { useGameTheme } from './gameTheme';

const COLS = 10, ROWS = 20, CELL = 12;
const SHAPES = [
  [[1,1,1,1]],
  [[1,1],[1,1]],
  [[0,1,0],[1,1,1]],
  [[1,0,0],[1,1,1]],
  [[0,0,1],[1,1,1]],
  [[1,1,0],[0,1,1]],
  [[0,1,1],[1,1,0]],
];
const COLORS = ['#4fc3f7','#7c4dff','#ff6b9d','#ffd54f','#4db6ac','#ff8a65','#81c784'];

const Tetris = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState(COLS*CELL);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [running, setRunning] = useState(false);
  const boardRef = useRef(Array.from({length:ROWS},()=>Array(COLS).fill(0)));
  const pieceRef = useRef(null);
  const posRef = useRef({x:0,y:0});
  const colorRef = useRef(0);
  const tickRef = useRef(null);
  const scoreRef = useRef(0);

  const rotate = (matrix) => matrix[0].map((_,i)=>matrix.map(r=>r[i]).reverse());

  const valid = useCallback((board, piece, pos) => {
    for (let y=0;y<piece.length;y++) for (let x=0;x<piece[y].length;x++) {
      if (!piece[y][x]) continue;
      const nx=pos.x+x, ny=pos.y+y;
      if (nx<0||nx>=COLS||ny>=ROWS) return false;
      if (ny>=0 && board[ny][nx]) return false;
    }
    return true;
  }, []);

  const spawn = useCallback(() => {
    const idx = Math.floor(Math.random()*SHAPES.length);
    const piece = SHAPES[idx];
    const pos = { x: Math.floor((COLS-piece[0].length)/2), y: -piece.length };
    pieceRef.current = piece;
    posRef.current = pos;
    colorRef.current = idx;
    return valid(boardRef.current, piece, pos);
  }, [valid]);

  const merge = useCallback(() => {
    const board = boardRef.current.map(r=>[...r]);
    const piece = pieceRef.current;
    const pos = posRef.current;
    for (let y=0;y<piece.length;y++) for (let x=0;x<piece[y].length;x++) {
      if (piece[y][x] && pos.y+y>=0) board[pos.y+y][pos.x+x] = colorRef.current+1;
    }
    // Clear lines
    let cleared = 0;
    for (let y=ROWS-1;y>=0;y--) {
      if (board[y].every(c=>c)) { board.splice(y,1); board.unshift(Array(COLS).fill(0)); cleared++; y++; }
    }
    if (cleared) {
      const pts = [0,100,300,500,800][cleared]||0;
      scoreRef.current += pts;
      setScore(scoreRef.current);
    }
    boardRef.current = board;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0,0,w,h);
    const cell = Math.floor(w / COLS);
    // Board
    boardRef.current.forEach((row,y)=>row.forEach((c,x)=>{
      if (c) { ctx.fillStyle=COLORS[c-1]; ctx.fillRect(x*cell+0.5,y*cell+0.5,cell-1,cell-1); }
      else { ctx.fillStyle='rgba(255,255,255,0.015)'; ctx.fillRect(x*cell+0.5,y*cell+0.5,cell-1,cell-1); }
    }));
    // Piece
    if (pieceRef.current) {
      ctx.fillStyle = COLORS[colorRef.current];
      pieceRef.current.forEach((row,y)=>row.forEach((c,x)=>{
        if (c && posRef.current.y+y>=0) ctx.fillRect((posRef.current.x+x)*cell+0.5,(posRef.current.y+y)*cell+0.5,cell-1,cell-1);
      }));
    }
  }, []);

  const tick = useCallback(() => {
    const nPos = { ...posRef.current, y: posRef.current.y+1 };
    if (valid(boardRef.current, pieceRef.current, nPos)) {
      posRef.current = nPos;
    } else {
      merge();
      if (!spawn()) { setGameOver(true); setRunning(false); return; }
    }
    draw();
  }, [valid, merge, spawn, draw]);

  const start = () => {
    boardRef.current = Array.from({length:ROWS},()=>Array(COLS).fill(0));
    scoreRef.current = 0;
    setScore(0);
    setGameOver(false);
    spawn();
    setRunning(true);
    draw();
  };

  const theme = useGameTheme();

  // load persisted best score
  useEffect(() => {
    try { setBest(getHighscore('tetris')); } catch (e) {}
  }, []);

  // persist when score increases
  useEffect(() => {
    if (score > best) {
      try { setHighscore('tetris', score); setBest(score); } catch (e) {}
    }
  }, [score, best]);

  useEffect(() => {
    if (!running) { clearInterval(tickRef.current); return; }
    tickRef.current = setInterval(tick, 500);
    return () => clearInterval(tickRef.current);
  }, [running, tick]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!running) return;
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d',' '].includes(e.key)) {
        e.preventDefault();
      }
      const piece = pieceRef.current;
      const pos = posRef.current;
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        const n = {...pos, x:pos.x-1}; if (valid(boardRef.current,piece,n)) posRef.current=n;
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        const n = {...pos, x:pos.x+1}; if (valid(boardRef.current,piece,n)) posRef.current=n;
      } else if (e.key === 'ArrowDown' || e.key === 's') {
        const n = {...pos, y:pos.y+1}; if (valid(boardRef.current,piece,n)) posRef.current=n;
      } else if (e.key === 'ArrowUp' || e.key === 'w') {
        const r = rotate(piece); if (valid(boardRef.current,r,pos)) pieceRef.current=r;
      } else if (e.key === ' ') {
        while (valid(boardRef.current,pieceRef.current,{...posRef.current,y:posRef.current.y+1})) posRef.current.y++;
      }
      draw();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [running, valid, draw]);

  // Responsive canvas sizing based on container
  useEffect(() => {
    const update = () => {
      const w = containerRef.current ? containerRef.current.clientWidth : 0;
      // target about half the container width, clamp to sensible range
      const size = Math.max(160, Math.min(520, Math.floor(w * 0.5)));
      setCanvasSize(size);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Redraw when canvas size changes
  useEffect(() => {
    draw();
  }, [canvasSize, draw]);

  // Touch: tap left/right halves, swipe down, tap top = rotate
  const touchStart = useRef(null);
  const handleTouchStart = (e) => {
    const t = e.touches[0];
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) touchStart.current = { x: t.clientX, y: t.clientY, rx: t.clientX - rect.left, ry: t.clientY - rect.top, w: rect.width, h: rect.height };
  };
  const handleTouchEnd = (e) => {
    if (!touchStart.current || !running) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    if (Math.abs(dy) > 30 && dy > 0) {
      // Swipe down = hard drop
      while (valid(boardRef.current,pieceRef.current,{...posRef.current,y:posRef.current.y+1})) posRef.current.y++;
    } else if (Math.abs(dx) < 15 && Math.abs(dy) < 15) {
      const { rx, ry, w, h } = touchStart.current;
      if (ry < h*0.3) {
        // Tap top = rotate
        const r = rotate(pieceRef.current); if (valid(boardRef.current,r,posRef.current)) pieceRef.current=r;
      } else if (rx < w/2) {
        const n = {...posRef.current, x:posRef.current.x-1}; if (valid(boardRef.current,pieceRef.current,n)) posRef.current=n;
      } else {
        const n = {...posRef.current, x:posRef.current.x+1}; if (valid(boardRef.current,pieceRef.current,n)) posRef.current=n;
      }
    }
    draw();
    touchStart.current = null;
  };

  return (
    <div ref={containerRef} style={styles.container} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div style={styles.scoreRow}>
        <span style={{...styles.scoreText, color: theme ? theme.titleColor : styles.scoreText.color}}>Score: {score}</span>
        <span style={{...styles.scoreText, color:'#ff6b9d', marginLeft:12}}>Best: {best}</span>
      </div>
      <canvas ref={canvasRef} width={canvasSize} height={Math.floor(canvasSize * (ROWS/COLS))} style={{...styles.canvas, width: canvasSize, height: Math.floor(canvasSize * (ROWS/COLS)), background: theme ? theme.cellBg : styles.canvas.background, border: theme ? theme.cellBorder : styles.canvas.border}} />
      {(!running) && (
        <div style={styles.overlay}>
          <div style={styles.overlayText}>{gameOver ? 'Game Over!' : 'Tetris'}</div>
          {gameOver && <div style={styles.finalScore}>Score: {score}</div>}
          <button onClick={start} style={theme ? theme.primaryBtn : styles.btn}>{gameOver ? 'Retry' : 'Start'}</button>
          <div style={{...(theme ? theme.hint : styles.hint)}}>Tap sides / Swipe down</div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { display:'flex', flexDirection:'column', alignItems:'center', height:'100%', justifyContent:'center', position:'relative', touchAction:'none' },
  scoreRow: { marginBottom: 6 },
  scoreText: { fontSize:12, fontWeight:700, color:'#4fc3f7', fontFamily:'var(--mono-font)' },
  canvas: { borderRadius:6, border:'1px solid rgba(255,255,255,0.06)', background:'rgba(0,0,0,0.25)' },
  overlay: { position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.6)', borderRadius:10, backdropFilter:'blur(4px)' },
  overlayText: { color:'#fff', fontSize:18, fontWeight:700, marginBottom:8, fontFamily:'var(--heading-font)' },
  finalScore: { color:'#ff6b9d', fontSize:14, fontWeight:600, marginBottom:12, fontFamily:'var(--mono-font)' },
  btn: { padding:'6px 24px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#4fc3f7,#7c4dff)', color:'#fff', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'var(--body-font)' },
  hint: { color:'rgba(255,255,255,0.4)', fontSize:9, marginTop:8, fontFamily:'var(--body-font)' },
};

export default Tetris;
