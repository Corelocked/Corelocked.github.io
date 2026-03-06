import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useGameTheme } from './gameTheme';

const TicTacToe = () => {
  const containerRef = useRef(null);
  const [boardSize, setBoardSize] = useState(0);

  useEffect(() => {
    const update = () => {
      const w = containerRef.current ? containerRef.current.clientWidth : 0;
      const size = Math.max(180, Math.min(420, Math.floor(w * 0.85)));
      setBoardSize(size);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0 });

  const calculateWinner = useCallback((squares) => {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6],
    ];
    for (let [a,b,c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: [a,b,c] };
      }
    }
    return null;
  }, []);

  const result = calculateWinner(board);
  const winner = result?.winner;
  const winLine = result?.line || [];
  const isDraw = !winner && board.every(Boolean);

  const handleClick = (i) => {
    if (board[i] || winner) return;
    const next = board.slice();
    next[i] = xIsNext ? 'X' : 'O';
    setBoard(next);
    setXIsNext(!xIsNext);
  };

  const reset = () => {
    if (winner) {
      setScores(s => ({ ...s, [winner]: s[winner] + 1 }));
    }
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  const status = winner
    ? `${winner} wins!`
    : isDraw
    ? "It's a draw!"
    : `${xIsNext ? 'X' : 'O'}'s turn`;

  const theme = useGameTheme();
  const isDark = theme?.isDark;

  const cellSize = Math.max(40, Math.floor(boardSize / 3));

  return (
    <div ref={containerRef} style={styles.container}>
      <div style={styles.scoreboard}>
        <span style={{...styles.score, color: '#4fc3f7'}}>X: {scores.X}</span>
        <span style={{...styles.score, color: '#ff6b9d'}}>O: {scores.O}</span>
      </div>
      <div style={{...styles.status, color: winner ? '#4fc3f7' : (theme ? theme.titleColor : (isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'))}}>{status}</div>
      <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
        <div style={{...styles.board, width: boardSize, height: boardSize, margin: '8px 0'}}>
          {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            style={{
              ...styles.cell,
              width: cellSize,
              height: cellSize,
              fontSize: Math.max(18, Math.floor(cellSize * 0.5)),
              borderRadius: Math.max(6, Math.floor(cellSize * 0.08)),
              color: cell === 'X' ? '#4fc3f7' : '#ff6b9d',
              background: winLine.includes(i) ? (theme ? (theme.isDark ? 'rgba(79,195,247,0.15)' : 'rgba(76,195,247,0.12)') : (isDark ? 'rgba(79,195,247,0.15)' : 'rgba(76,195,247,0.12)')) : (theme ? theme.unrevealedCellBg : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)')) ,
              border: theme ? theme.cellBorder : (isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)'),
              cursor: cell || winner ? 'default' : 'pointer',
            }}
          >
            {cell}
          </button>
        ))}
        </div>
      </div>
      {(winner || isDraw) && (
        <button onClick={reset} style={{...styles.resetBtn, ...(theme? theme.smallBtn : {})}}>Play Again</button>
      )}
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 0', height: '100%', justifyContent: 'center' },
  scoreboard: { display: 'flex', gap: 20, marginBottom: 6 },
  score: { fontSize: 13, fontWeight: 700, fontFamily: 'var(--mono-font), monospace' },
  status: { fontSize: 12, marginBottom: 10, fontFamily: 'var(--body-font), sans-serif', fontWeight: 600 },
  board: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 },
  cell: {
    aspectRatio: '1',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8,
    fontSize: 26,
    fontWeight: 800,
    fontFamily: 'var(--heading-font), sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s ease',
  },
  resetBtn: {
    marginTop: 12,
    padding: '6px 20px',
    borderRadius: 10,
    border: 'none',
    background: 'linear-gradient(135deg, #4fc3f7, #7c4dff)',
    color: '#fff',
    fontSize: 11,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'var(--body-font), sans-serif',
  },
};

export default TicTacToe;
