import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useGameTheme } from './gameTheme';

const BombIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>
    <circle cx="12" cy="13" r="5.5" />
    <path d="M12 4v3M9.2 5.2l1.5 2M14.8 5.2l-1.5 2M7 11l-2-1M17 11l2-1" />
    <circle cx="14" cy="12" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

const FlagIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>
    <path d="M6 20V5" />
    <path d="M6 6c2.2-1.1 4.7-1.1 7 0s4.8 1.1 7 0v8c-2.2 1.1-4.8 1.1-7 0s-4.8-1.1-7 0" />
  </svg>
);

const Minesweeper = () => {
  const containerRef = useRef(null);
  const [gridSize, setGridSize] = useState(0);
  const [mode, setMode] = useState('easy');

  const settings = useMemo(() => {
    if (mode === 'easy') return { rows: 9, cols: 9, mines: 10 };
    if (mode === 'hard') return { rows: 16, cols: 16, mines: 40 };
    return { rows: 12, cols: 12, mines: 20 };
  }, [mode]);
  const { rows: ROWS, cols: COLS, mines: MINES } = settings;

  const theme = useGameTheme();
  const isDark = theme?.isDark;

  useEffect(() => {
    const update = () => {
      const w = containerRef.current ? containerRef.current.clientWidth : 0;
      const size = Math.max(180, Math.min(420, Math.floor(w * 0.92)));
      setGridSize(size);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  const [board, setBoard] = useState(null);
  const [revealed, setRevealed] = useState(null);
  const [flagged, setFlagged] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [started, setStarted] = useState(false);

  const initBoard = useCallback((safeR, safeC) => {
    const b = Array.from({length:ROWS},()=>Array(COLS).fill(0));
    let placed = 0;
    while (placed < MINES) {
      const r = Math.floor(Math.random()*ROWS), c = Math.floor(Math.random()*COLS);
      if (b[r][c]===-1 || (Math.abs(r-safeR)<=1 && Math.abs(c-safeC)<=1)) continue;
      b[r][c] = -1;
      placed++;
    }
    // Numbers
    for (let r=0;r<ROWS;r++) for (let c=0;c<COLS;c++) {
      if (b[r][c]===-1) continue;
      let count=0;
      for (let dr=-1;dr<=1;dr++) for (let dc=-1;dc<=1;dc++) {
        const nr=r+dr, nc=c+dc;
        if (nr>=0&&nr<ROWS&&nc>=0&&nc<COLS&&b[nr][nc]===-1) count++;
      }
      b[r][c]=count;
    }
    return b;
  }, [ROWS, COLS, MINES]);

  const start = () => {
    setBoard(null);
    setRevealed(Array.from({length:ROWS},()=>Array(COLS).fill(false)));
    setFlagged(Array.from({length:ROWS},()=>Array(COLS).fill(false)));
    setGameOver(false);
    setWon(false);
    setStarted(true);
  };

  const floodFill = (b, rev, r, c) => {
    if (r<0||r>=ROWS||c<0||c>=COLS||rev[r][c]) return;
    rev[r][c]=true;
    if (b[r][c]===0) {
      for (let dr=-1;dr<=1;dr++) for (let dc=-1;dc<=1;dc++) floodFill(b,rev,r+dr,c+dc);
    }
  };

  const checkWin = (rev) => {
    let safe=0;
    for (let r=0;r<ROWS;r++) for (let c=0;c<COLS;c++) if(rev[r][c]) safe++;
    return safe === ROWS*COLS - MINES;
  };

  const handleClick = (r,c) => {
    if (gameOver||won) return;
    if (flagged && flagged[r][c]) return;
    let b = board;
    if (!b) {
      b = initBoard(r,c);
      setBoard(b);
    }
    if (b[r][c]===-1) { setGameOver(true); setRevealed(Array.from({length:ROWS},()=>Array(COLS).fill(true))); return; }
    const rev = revealed.map(r=>[...r]);
    floodFill(b,rev,r,c);
    setRevealed(rev);
    if (checkWin(rev)) setWon(true);
  };

  const handleRightClick = (e,r,c) => {
    e.preventDefault();
    if (gameOver||won||!started) return;
    if (revealed && revealed[r][c]) return;
    const f = flagged.map(r=>[...r]);
    f[r][c]=!f[r][c];
    setFlagged(f);
  };

  const minesLeft = started && flagged ? MINES - flagged.flat().filter(Boolean).length : MINES;
  const numColors = ['','#4fc3f7','#4db6ac','#ff6b9d','#7c4dff','#ffd54f','#ff8a65','#81c784','#e0e0e0'];

  const cellPx = gridSize ? Math.floor(gridSize / COLS) : 24;
  const cellIconSize = Math.max(12, Math.floor(cellPx * 0.55));
  const cellStyleDynamic = {
    width: cellPx,
    height: cellPx,
    fontSize: Math.max(10, Math.floor(cellPx * 0.45)),
    borderRadius: Math.max(3, Math.floor(cellPx * 0.08)),
  };

  const baseSmallBtn = {
    ...(theme ? theme.smallBtn : styles.smallBtn),
    background: theme ? theme.panelBg : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)'),
    border: theme ? theme.cellBorder : (isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)'),
    color: theme ? theme.titleColor : (isDark ? styles.smallBtn.color : '#111'),
  };

  return (
    <div ref={containerRef} style={styles.container}>
      {!started ? (
        <div style={styles.menu}>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:12}}>
            <div>
                <div style={{...styles.title, color: theme ? theme.titleColor : (isDark ? '#fff' : '#111')}}>Minesweeper</div>
                  <div style={{...styles.sub, color: theme ? theme.subColor : (isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.45)')}}>{ROWS}×{COLS} · {MINES} mines</div>
            </div>
            <div style={{display:'flex', gap:8}}>
                  <button
                onClick={() => setMode('easy')}
                style={{
                      ...baseSmallBtn,
                      background: mode==='easy' ? theme?.accentGradient || baseSmallBtn.background : baseSmallBtn.background,
                      color: mode==='easy' ? '#fff' : baseSmallBtn.color,
                      boxShadow: mode==='easy' ? (theme?.isDark ? '0 6px 18px rgba(76,195,247,0.18)' : '0 6px 18px rgba(76,195,247,0.12)') : baseSmallBtn.boxShadow,
                      transform: mode==='easy' ? 'translateY(-2px)' : 'none',
                }}
              >Easy</button>
              <button
                onClick={() => setMode('medium')}
                style={{
                  ...baseSmallBtn,
                  background: mode==='medium' ? (isDark ? 'linear-gradient(135deg,#4fc3f7,#7c4dff)' : 'linear-gradient(135deg,#4fc3f7,#7c4dff)') : baseSmallBtn.background,
                  color: mode==='medium' ? '#fff' : baseSmallBtn.color,
                  boxShadow: mode==='medium' ? (isDark ? '0 6px 18px rgba(76,195,247,0.18)' : '0 6px 18px rgba(76,195,247,0.12)') : baseSmallBtn.boxShadow,
                  transform: mode==='medium' ? 'translateY(-2px)' : 'none',
                }}
              >Medium</button>
              <button
                onClick={() => setMode('hard')}
                style={{
                  ...baseSmallBtn,
                  background: mode==='hard' ? (isDark ? 'linear-gradient(135deg,#4fc3f7,#7c4dff)' : 'linear-gradient(135deg,#4fc3f7,#7c4dff)') : baseSmallBtn.background,
                  color: mode==='hard' ? '#fff' : baseSmallBtn.color,
                  boxShadow: mode==='hard' ? (isDark ? '0 6px 18px rgba(76,195,247,0.18)' : '0 6px 18px rgba(76,195,247,0.12)') : baseSmallBtn.boxShadow,
                  transform: mode==='hard' ? 'translateY(-2px)' : 'none',
                }}
              >Hard</button>
            </div>
          </div>
          <div style={{marginTop:10}}>
            <button onClick={start} style={theme ? theme.primaryBtn : {...styles.btn, ...(theme? theme.smallBtn : {})}}>Start</button>
          </div>
        </div>
      ) : (
        <>
          <div style={styles.info}>
            <span style={{...styles.infoText, color: theme ? theme.titleColor : styles.infoText.color}}><BombIcon style={{width: 12, height: 12}} /> {minesLeft}</span>
            {(gameOver||won) && <span style={{...styles.infoText, color: won? (theme?.isDark? '#4db6ac':'#4db6ac') : '#ff6b9d'}}>{won?'You Win!':'Boom!'}</span>}
          </div>
          <div style={{...styles.grid, width: gridSize}}>
            {Array.from({length:ROWS}).map((_,r)=>(
              <div key={r} style={styles.row}>
                {Array.from({length:COLS}).map((_,c)=>{
                  const isRevealed = revealed && revealed[r][c];
                  const isFlagged = flagged && flagged[r][c];
                  const val = board ? board[r][c] : 0;
                  return (
                    <button
                      key={c}
                      onClick={()=>handleClick(r,c)}
                      onContextMenu={(e)=>handleRightClick(e,r,c)}
                          style={{
                            ...styles.cell,
                            ...cellStyleDynamic,
                            background: isRevealed
                              ? (val===-1 ? (theme ? 'rgba(255,107,157,0.25)' : (isDark ? 'rgba(255,107,157,0.25)' : 'rgba(255,107,157,0.12)')) : (theme ? theme.cellBg : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)')))
                              : (theme ? theme.unrevealedCellBg : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)')),
                            color: val===-1 ? '#ff6b9d' : (numColors[val]|| (theme ? theme.titleColor : (isDark ? 'rgba(255,255,255,0.7)' : '#222'))),
                            cursor: isRevealed ? 'default' : 'pointer',
                            padding: 0,
                            border: theme ? theme.cellBorder : (isDark ? 'none' : '1px solid rgba(0,0,0,0.06)'),
                          }}
                    >
                      {isRevealed ? (val===-1 ? <BombIcon style={{width: cellIconSize, height: cellIconSize}} /> : val>0 ? val : '') : (isFlagged ? <FlagIcon style={{width: cellIconSize, height: cellIconSize}} /> : '')}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          {(gameOver||won) && <button onClick={start} style={{...(theme? theme.primaryBtn : styles.btn), marginTop:8}}>Play Again</button>}
          {!gameOver && !won && <div style={{...(theme? theme.hint : styles.hint)}}>Long-press or right-click to flag</div>}
        </>
      )}
    </div>
  );
};

const styles = {
  container: { display:'flex', flexDirection:'column', alignItems:'center', height:'100%', justifyContent:'center', padding:'4px 0' },
  menu: { textAlign:'center' },
  title: { fontSize:18, fontWeight:700, color:'#fff', marginBottom:4, fontFamily:'var(--heading-font)' },
  sub: { fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:12, fontFamily:'var(--body-font)' },
  info: { display:'flex', gap:12, marginBottom:6, alignItems:'center' },
  infoText: { fontSize:12, fontWeight:600, color:'#4fc3f7', fontFamily:'var(--mono-font)' },
  grid: { display:'flex', flexDirection:'column', gap:1 },
  row: { display:'flex', gap:1 },
  cell: { width:24, height:24, border:'none', borderRadius:3, fontSize:11, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', padding:0, fontFamily:'var(--mono-font)', lineHeight:1 },
  btn: { padding:'6px 24px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#4fc3f7,#7c4dff)', color:'#fff', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'var(--body-font)' },
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
    boxShadow:'0 2px 6px rgba(0,0,0,0.12) inset',
  },
  hint: { color:'rgba(255,255,255,0.35)', fontSize:8, marginTop:6, fontFamily:'var(--body-font)' },
};

export default Minesweeper;
