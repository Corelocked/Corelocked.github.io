import React, { useState, useEffect } from 'react';
import { getHighscore, setHighscore } from '../../utils/highscores';
import { useGameTheme } from './gameTheme';

const CookieClicker = () => {
  const theme = useGameTheme();
  const [cookies, setCookies] = useState(0);
  const [perClick, setPerClick] = useState(1);
  const [cost, setCost] = useState(50);
  const [best, setBest] = useState(0);
  const [pressed, setPressed] = useState(false);

  useEffect(() => { try { setBest(getHighscore('cookie') || 0); } catch(e){} }, []);
  useEffect(() => { if (cookies > best) { setBest(cookies); try { setHighscore('cookie', cookies); } catch(e){} } }, [cookies, best]);

  const clickCookie = () => setCookies(c => c + perClick);
  const buyUpgrade = () => {
    if (cookies >= cost) {
      setCookies(c => c - cost);
      setPerClick(p => p + 1);
      setCost(c => Math.floor(c * 1.8));
    }
  };
  const reset = () => { setCookies(0); setPerClick(1); setCost(50); };

  const cookieStyle = {
    width: 260,
    height: 260,
    borderRadius: 999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 108,
    border: 'none',
    background: 'transparent',
    boxShadow: 'none',
    cursor: 'pointer',
    transform: pressed ? 'scale(0.96)' : 'scale(1)',
    transition: 'transform 0.08s ease',
    padding: 6,
  };

  return (
    <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%'}}>
      <div style={{marginTop:14}}>
        <button
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          onMouseLeave={() => setPressed(false)}
          onTouchStart={() => setPressed(true)}
          onTouchEnd={() => setPressed(false)}
          onClick={clickCookie}
          aria-label="cookie button"
          style={cookieStyle}
        >
          🍪
        </button>
      </div>
      <div style={{marginTop:12, fontFamily:'var(--mono-font)', color: theme?.subColor, fontSize:16}}>Cookies: {cookies}</div>
      <div style={{display:'flex', gap:8, marginTop:12}}>
        <button onClick={buyUpgrade} style={{...(theme?.smallBtn || {} )}}>Upgrade (+1)</button>
        <button onClick={reset} style={{...(theme?.smallBtn || {} )}}>Reset</button>
      </div>
      <div style={{marginTop:10, fontSize:12, color: theme?.subColor}}>Per click: {perClick} · Next cost: {cost}</div>
      <div style={{marginTop:8, fontSize:12, color: '#ff6b9d'}}>Best: {best}</div>
    </div>
  );
};

export default CookieClicker;
