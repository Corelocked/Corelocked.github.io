import React, { useState, useEffect } from 'react';
import { getHighscore, setHighscore } from '../../utils/highscores';
import { useGameTheme } from './gameTheme';

const CookieIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="9" cy="8.5" r="1.1" fill="#050510" opacity="0.55" />
    <circle cx="15.5" cy="9.5" r="0.9" fill="#050510" opacity="0.55" />
    <circle cx="14" cy="15" r="1" fill="#050510" opacity="0.55" />
    <circle cx="10" cy="14" r="0.8" fill="#050510" opacity="0.55" />
  </svg>
);

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
    border: 'none',
    background: 'transparent',
    boxShadow: 'none',
    cursor: 'pointer',
    transform: pressed ? 'scale(0.96)' : 'scale(1)',
    transition: 'transform 0.08s ease',
    padding: 6,
    lineHeight: 0,
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
          <CookieIcon />
        </button>
      </div>
      <div style={{marginTop:12, fontFamily:'var(--mono-font)', color: theme?.titleColor ?? '#fff', fontSize:18, fontWeight: 700}}>Cookies: {cookies}</div>
      <div style={{display:'flex', gap:8, marginTop:12}}>
        <button onClick={buyUpgrade} style={theme?.smallBtn ?? {}}>Upgrade (+1)</button>
        <button onClick={reset} style={theme?.smallBtn ?? {}}>Reset</button>
      </div>
      <div style={{...(theme?.hint ?? {}), marginTop:10}}>Per click: {perClick} · Next cost: {cost}</div>
      <div style={{marginTop:8, fontSize:12, color: '#ff6b9d', fontFamily: 'var(--mono-font)', fontWeight: 700}}>Best: {best}</div>
    </div>
  );
};

export default CookieClicker;
