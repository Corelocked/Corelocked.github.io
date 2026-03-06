import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useGameTheme } from './gameTheme';

const Sudoku = () => {
  const containerRef = useRef(null);
  const [gridSize, setGridSize] = useState(0);
  const theme = useGameTheme();
  const isDark = theme?.isDark;

  const [difficulty, setDifficulty] = useState('medium');
  // Removed cells by difficulty: higher = harder (increased counts)
  const removedTarget = difficulty === 'easy' ? 36 : difficulty === 'hard' ? 64 : 50;

  useEffect(() => {
    const update = () => {
      const w = containerRef.current ? containerRef.current.clientWidth : 0;
      const size = Math.max(220, Math.min(520, Math.floor(w * 0.9)));
      setGridSize(size);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  const [board, setBoard] = useState(null);
  const [solution, setSolution] = useState(null);
  const [locked, setLocked] = useState(null);
  const [selected, setSelected] = useState(null);
  const [errors, setErrors] = useState(new Set());
  const [won, setWon] = useState(false);

  const generate = useCallback(() => {
    // Generate a solved board then remove cells
    const grid = Array.from({length:9},()=>Array(9).fill(0));
    const isOk = (g,r,c,n) => {
      for (let i=0;i<9;i++) { if(g[r][i]===n||g[i][c]===n) return false; }
      const br=Math.floor(r/3)*3, bc=Math.floor(c/3)*3;
      for (let i=br;i<br+3;i++) for (let j=bc;j<bc+3;j++) if(g[i][j]===n) return false;
      return true;
    };
    const fill = (g) => {
      for (let r=0;r<9;r++) for (let c=0;c<9;c++) {
        if (g[r][c]===0) {
          const nums = [1,2,3,4,5,6,7,8,9].sort(()=>Math.random()-0.5);
          for (let n of nums) {
            if (isOk(g,r,c,n)) { g[r][c]=n; if(fill(g)) return true; g[r][c]=0; }
          }
          return false;
        }
      }
      return true;
    };
    fill(grid);
    const sol = grid.map(r=>[...r]);
    // Remove cells according to difficulty
    let removed = 0;
    const positions = [];
    for (let r=0;r<9;r++) for (let c=0;c<9;c++) positions.push([r,c]);
    positions.sort(()=>Math.random()-0.5);
    for (let [r,c] of positions) {
      if (removed >= removedTarget) break;
      grid[r][c] = 0;
      removed++;
    }
    const lock = grid.map(r=>r.map(c=>c!==0));
    setBoard(grid);
    setSolution(sol);
    setLocked(lock);
    setSelected(null);
    setErrors(new Set());
    setWon(false);
  }, [removedTarget]);

  const handleCellClick = (r,c) => {
    if (locked && locked[r][c]) return;
    setSelected([r,c]);
  };

  const handleNumberInput = (n) => {
    if (!selected || !board) return;
    const [r,c] = selected;
    if (locked[r][c]) return;
    const b = board.map(r=>[...r]);
    b[r][c] = n;
    setBoard(b);
    // Check errors
    const errs = new Set();
    for (let i=0;i<9;i++) for (let j=0;j<9;j++) {
      if (b[i][j] && b[i][j] !== solution[i][j]) errs.add(`${i}-${j}`);
    }
    setErrors(errs);
    // Check win
    if (errs.size===0 && b.every(r=>r.every(c=>c!==0))) setWon(true);
  };

  const baseSmallBtn = {
    padding: '8px 14px',
    borderRadius: 12,
    border: theme ? theme.cellBorder : (isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)'),
    background: theme ? theme.panelBg : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)'),
    color: theme ? theme.titleColor : (isDark ? 'rgba(255,255,255,0.95)' : '#111'),
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'var(--body-font)',
    transition: 'all 0.14s ease',
  };

  if (!board) {
    return (
      <div ref={containerRef} style={styles.container}>
        <div style={{...styles.title, color: theme ? theme.titleColor : styles.title.color}}>Sudoku</div>
        <div style={{...styles.sub, color: theme ? theme.subColor : styles.sub.color}}>Fill the 9×9 grid</div>
        <div style={{display:'flex', gap:8, marginBottom:8}}>
            <button
              onClick={() => setDifficulty('easy')}
              style={{
                ...baseSmallBtn,
                background: difficulty==='easy' ? theme?.accentGradient || baseSmallBtn.background : baseSmallBtn.background,
                color: difficulty==='easy' ? '#fff' : baseSmallBtn.color,
                boxShadow: difficulty==='easy' ? (theme?.isDark ? '0 6px 18px rgba(76,195,247,0.18)' : '0 6px 18px rgba(76,195,247,0.12)') : undefined,
                transform: difficulty==='easy' ? 'translateY(-2px)' : 'none',
              }}
            >Easy</button>
            <button
              onClick={() => setDifficulty('medium')}
              style={{
                ...baseSmallBtn,
                background: difficulty==='medium' ? (isDark ? 'linear-gradient(135deg,#4fc3f7,#7c4dff)' : 'linear-gradient(135deg,#4fc3f7,#7c4dff)') : baseSmallBtn.background,
                color: difficulty==='medium' ? '#fff' : baseSmallBtn.color,
                boxShadow: difficulty==='medium' ? (isDark ? '0 6px 18px rgba(76,195,247,0.18)' : '0 6px 18px rgba(76,195,247,0.12)') : undefined,
                transform: difficulty==='medium' ? 'translateY(-2px)' : 'none',
              }}
            >Medium</button>
            <button
              onClick={() => setDifficulty('hard')}
              style={{
                ...baseSmallBtn,
                background: difficulty==='hard' ? theme?.accentGradient || baseSmallBtn.background : baseSmallBtn.background,
                color: difficulty==='hard' ? '#fff' : baseSmallBtn.color,
                boxShadow: difficulty==='hard' ? (theme?.isDark ? '0 6px 18px rgba(76,195,247,0.18)' : '0 6px 18px rgba(76,195,247,0.12)') : undefined,
                transform: difficulty==='hard' ? 'translateY(-2px)' : 'none',
              }}
            >Hard</button>
        </div>
        <button onClick={generate} style={{...styles.btn, ...(theme? theme.smallBtn : {})}}>New Game</button>
      </div>
    );
  }

  const cellPx = gridSize ? Math.floor(gridSize / 9) : 26;
  const cellDynamicStyle = {
    width: cellPx,
    height: cellPx,
    fontSize: Math.max(12, Math.floor(cellPx * 0.45)),
  };

  return (
    <div ref={containerRef} style={styles.container}>
      {won && <div style={styles.winText}>🎉 Solved!</div>}
      <div style={{...styles.grid, width: gridSize, border: theme ? `2px solid ${theme.isDark ? 'rgba(79,195,247,0.3)' : 'rgba(79,195,247,0.3)'}` : styles.grid.border}}>
        {board.map((row,r)=>(
          <div key={r} style={{...styles.row, borderBottom: (r===2||r===5)?'2px solid rgba(79,195,247,0.3)':'none'}}>
            {row.map((cell,c)=>{
              const isSel = selected && selected[0]===r && selected[1]===c;
              const isLocked = locked[r][c];
              const isError = errors.has(`${r}-${c}`);
              return (
                <button
                  key={c}
                  onClick={()=>handleCellClick(r,c)}
                  style={{
                    ...styles.cell,
                    ...cellDynamicStyle,
                    borderRight: (c===2||c===5)?'2px solid rgba(79,195,247,0.3)': theme ? theme.cellBorder : '1px solid rgba(255,255,255,0.04)',
                    background: isSel ? (theme ? 'rgba(79,195,247,0.2)' : 'rgba(79,195,247,0.2)') : isError ? 'rgba(255,107,157,0.15)' : 'transparent',
                    color: isError ? '#ff6b9d' : isLocked ? (theme ? theme.titleColor : 'rgba(255,255,255,0.85)') : '#4fc3f7',
                    fontWeight: isLocked ? 700 : 500,
                    cursor: isLocked ? 'default' : 'pointer',
                    padding: 0,
                  }}
                >
                  {cell||''}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div style={{...styles.numPad, maxWidth: Math.max(220, Math.floor(gridSize * 0.9))}}>
        {[1,2,3,4,5,6,7,8,9].map(n=>(
          <button key={n} onClick={()=>handleNumberInput(n)} style={{...styles.numBtn, width: Math.max(30, Math.floor(cellPx * 0.9)), height: Math.max(30, Math.floor(cellPx * 0.9))}}>{n}</button>
        ))}
        <button onClick={()=>handleNumberInput(0)} style={{...styles.numBtn, color:'#ff6b9d', width: Math.max(30, Math.floor(cellPx * 0.9)), height: Math.max(30, Math.floor(cellPx * 0.9))}}>✕</button>
      </div>
      <div style={styles.actions}>
        <button onClick={generate} style={styles.smallBtn}>New Game</button>
      </div>
    </div>
  );
};

  const styles = {
  container: { display:'flex', flexDirection:'column', alignItems:'center', height:'100%', justifyContent:'center', padding:'2px 0' },
  title: { fontSize:18, fontWeight:700, color:'#fff', marginBottom:4, fontFamily:'var(--heading-font)' },
  sub: { fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:12, fontFamily:'var(--body-font)' },
  grid: { display:'flex', flexDirection:'column', border:'2px solid rgba(79,195,247,0.3)', borderRadius:4, overflow:'hidden' },
  row: { display:'flex' },
  cell: { width:26, height:26, border:'1px solid rgba(255,255,255,0.04)', fontSize:13, display:'flex', alignItems:'center', justifyContent:'center', padding:0, fontFamily:'var(--mono-font)', borderRadius:0 },
  numPad: { display:'flex', flexWrap:'wrap', gap:4, marginTop:8, justifyContent:'center', maxWidth:220 },
  numBtn: { width:30, height:30, borderRadius:8, border:'none', background:'rgba(255,255,255,0.06)', color:'#4fc3f7', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'var(--mono-font)', display:'flex', alignItems:'center', justifyContent:'center' },
  actions: { marginTop:6 },
  smallBtn: {
    padding:'8px 14px',
    borderRadius:12,
    border:'1px solid rgba(255,255,255,0.12)',
    background:'rgba(255,255,255,0.03)',
    color:'rgba(255,255,255,0.95)',
    fontSize:13,
    fontWeight:700,
    cursor:'pointer',
    fontFamily:'var(--body-font)',
    transition:'all 0.14s ease',
  },
  winText: { fontSize:16, fontWeight:700, color:'#4db6ac', marginBottom:8, fontFamily:'var(--heading-font)' },
  btn: { padding:'6px 24px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#4fc3f7,#7c4dff)', color:'#fff', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'var(--body-font)' },
};

export default Sudoku;
