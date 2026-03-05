import React, { useState, useCallback } from 'react';

const ROWS = 9, COLS = 9, MINES = 10;

const Minesweeper = () => {
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
  }, []);

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

  return (
    <div style={styles.container}>
      {!started ? (
        <div style={styles.menu}>
          <div style={styles.title}>Minesweeper</div>
          <div style={styles.sub}>9×9 · 10 mines</div>
          <button onClick={start} style={styles.btn}>Start</button>
        </div>
      ) : (
        <>
          <div style={styles.info}>
            <span style={styles.infoText}>💣 {minesLeft}</span>
            {(gameOver||won) && <span style={{...styles.infoText, color: won?'#4db6ac':'#ff6b9d'}}>{won?'You Win!':'Boom!'}</span>}
          </div>
          <div style={styles.grid}>
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
                        background: isRevealed
                          ? (val===-1 ? 'rgba(255,107,157,0.25)' : 'rgba(255,255,255,0.04)')
                          : 'rgba(255,255,255,0.08)',
                        color: val===-1 ? '#ff6b9d' : (numColors[val]||'transparent'),
                        cursor: isRevealed ? 'default' : 'pointer',
                      }}
                    >
                      {isRevealed ? (val===-1?'💣': val>0?val:'') : (isFlagged?'🚩':'')}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          {(gameOver||won) && <button onClick={start} style={{...styles.btn, marginTop:8}}>Play Again</button>}
          {!gameOver && !won && <div style={styles.hint}>Long-press or right-click to flag</div>}
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
  hint: { color:'rgba(255,255,255,0.35)', fontSize:8, marginTop:6, fontFamily:'var(--body-font)' },
};

export default Minesweeper;
