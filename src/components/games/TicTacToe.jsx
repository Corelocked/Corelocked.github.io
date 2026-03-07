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
    
    // Play sound effect (optional)
    if (typeof Audio !== 'undefined') {
      try {
        // Simple click feedback
        const beep = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUKXh8LllHAU2j9XyzH0sBSR2xu/dkUAKEl+y6OyqVhMMRp7f8r9uIwUsgs/z2Ik2Bhxqvujjm0oMC1Cf3vC3aB4FNI3U8seCLgUmc77t3I9BCRZftOntqFYUCkaf3/G/cCYGK4PQ89iTOQYabrzm359LDAxPodu7cywFLoPP89uNOgcafrzk4qJQDA5Poty+dC4GMInU8t6APwocb7Xs7bFcFQ5Kp+jvuWsjBiuF0PPcjToHG3C96+mjUA0NUKbh8bhmHQU0jdXzzoQsBSd1xu3dkT8JF2Cz6+2qVxMLRp/h8L9xJgcrgtDy2IozBxptu+bjnEsMDFGn4+u2ZhwFN4/W8s59LQUngM/u3IxACRdgsuvtq1cTDEeg4O+/bSUFK4PQ8tiKMwcablzq4Z1NCgxRp+PrtmlcBTaP1vLPgC0GJ3vH7tyNPwkXY K3s6atWFQxGoN/vwG4lBSuBz/PYijMHGm+76+OcTQwLUaXi7rZpHQU2jtXzz30uByV7xvDckUAJGGGz7O6qVhUMRqDg78BuJQUrgs/z2IkzBxpwu+vjn00MCVGn4+62aR0FNo3V889+LgYle8bv3JFACR').trim();
        beep.volume = 0.1;
        beep.play().catch(() => {});
      } catch (e) {}
    }
  };

  const reset = () => {
    if (winner) {
      setScores(s => ({ ...s, [winner]: s[winner] + 1 }));
    }
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  const status = winner
    ? `🎉 ${winner} wins! 🎉`
    : isDraw
    ? "🤝 It's a draw!"
    : `${xIsNext ? 'X' : 'O'}'s turn`;

  const theme = useGameTheme();
  const isDark = theme?.isDark;

  const cellSize = Math.max(40, Math.floor(boardSize / 3));

  return (
    <div ref={containerRef} style={styles.container}>
      <div style={{...styles.scoreboard, background: theme?.panelBg ?? styles.scoreboard.background, border: theme?.cellBorder ?? undefined}}>
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
              borderRadius: Math.max(8, Math.floor(cellSize * 0.1)),
              color: cell === 'X' ? '#4fc3f7' : '#ff6b9d',
              background: winLine.includes(i) 
                ? 'linear-gradient(135deg, rgba(79,195,247,0.25), rgba(124,77,255,0.25))' 
                : (theme ? theme.unrevealedCellBg : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)')),
              border: theme ? theme.cellBorder : (isDark ? '2px solid rgba(255,255,255,0.08)' : '2px solid rgba(0,0,0,0.08)'),
              cursor: cell || winner ? 'default' : 'pointer',
              transform: cell ? 'scale(1)' : 'scale(0.98)',
              animation: cell ? 'popIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'none',
              textShadow: cell ? '0 2px 12px currentColor' : 'none',
              ...((!cell && !winner) && {
                ':hover': {
                  transform: 'scale(1.05)',
                  background: 'rgba(79, 195, 247, 0.1)',
                  boxShadow: '0 4px 16px rgba(79, 195, 247, 0.2)'
                }
              })
            }}
            onMouseEnter={(e) => {
              if (!cell && !winner) {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.background = 'rgba(79, 195, 247, 0.1)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(79, 195, 247, 0.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (!cell && !winner) {
                e.currentTarget.style.transform = 'scale(0.98)';
                e.currentTarget.style.background = theme ? theme.unrevealedCellBg : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)');
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
              }
            }}
          >
            {cell}
          </button>
        ))}
        </div>
      </div>
      {(winner || isDraw) && (
        <button onClick={reset} style={theme ? theme.primaryBtn : styles.resetBtn}>Play Again</button>
      )}
    </div>
  );
};

const styles = {
  container: { 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    padding: '12px 0', 
    height: '100%', 
    justifyContent: 'center',
    animation: 'fadeInScale 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  scoreboard: { 
    display: 'flex', 
    gap: 24, 
    marginBottom: 10,
    padding: '8px 16px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    backdropFilter: 'blur(8px)'
  },
  score: { 
    fontSize: 14, 
    fontWeight: 700, 
    fontFamily: 'var(--mono-font), monospace',
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
  },
  status: { 
    fontSize: 14, 
    marginBottom: 14, 
    fontFamily: 'var(--body-font), sans-serif', 
    fontWeight: 700,
    textAlign: 'center',
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
    minHeight: '20px',
    animation: 'pulse 0.3s ease'
  },
  board: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(3, 1fr)', 
    gap: 6,
    padding: '4px'
  },
  cell: {
    aspectRatio: '1',
    border: '2px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    fontSize: 26,
    fontWeight: 800,
    fontFamily: 'var(--heading-font), sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    position: 'relative',
    overflow: 'hidden'
  },
  resetBtn: {
    marginTop: 16,
    padding: '10px 28px',
    borderRadius: 12,
    border: 'none',
    background: 'linear-gradient(135deg, #4fc3f7, #7c4dff)',
    color: '#fff',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'var(--body-font), sans-serif',
    boxShadow: '0 4px 12px rgba(79, 195, 247, 0.3)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
};

export default TicTacToe;
