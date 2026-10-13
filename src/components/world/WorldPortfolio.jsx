import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import WorldPanels, { PixelIcon } from './WorldPanels';
import WorldChat from './WorldChat';
import WorldMusic from './WorldMusic';
import { useGitHubContributions } from '../../hooks/useGitHubContributions';
import { daylightAt } from './worldState';
import { destinations, destinationPath, sectionFromLocation } from './destinations';
import './WorldPortfolio.css';

export default function WorldPortfolio() {
  const location = useLocation();
  const navigate = useNavigate();
  const section = sectionFromLocation(location.pathname, location.hash);
  const host = useRef(null);
  const engine = useRef(null);
  const dialog = useRef(null);
  const resumeButton = useRef(null);
  const joystick = useRef(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [entered, setEntered] = useState(false);
  const [nearby, setNearby] = useState(null);
  const [position, setPosition] = useState({ x: 0, z: 12, yaw: 0 });
  const [help, setHelp] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const resumeAfterChat = useRef(false);
  const [clock, setClock] = useState(() => new Date());
  const [lightingMode, setLightingMode] = useState(() => {
    try { const saved = localStorage.getItem('portfolio-world-lighting'); return ['day','night'].includes(saved) ? saved : 'auto'; } catch { return 'auto'; }
  });
  const [year, setYear] = useState(() => new Date().getFullYear());
  const contributions = useGitHubContributions(year);
  const daylight = daylightAt(lightingMode, clock);
  const callbacks = useRef({});
  callbacks.current = {
    onInteract: id => navigate(destinationPath(id)),
    onGuide: () => navigate('/#guide'),
    onPause: () => setPlaying(false),
    onNearby: setNearby,
    onPosition: setPosition,
    onError: () => { setFailed(true); setPlaying(false); },
  };

  useEffect(() => {
    let cancelled = false;
    import('./createVoxelWorld').then(async ({ default: createVoxelWorld }) => {
      await document.fonts?.load('16px Minecraft').catch(() => {});
      if (cancelled) return;
      try {
        engine.current = createVoxelWorld(host.current, Object.fromEntries(Object.keys(callbacks.current).map(key => [key, (...args) => callbacks.current[key](...args)])));
        setReady(true);
      } catch (error) {
        console.warn('The 3D world could not start. The portfolio is still available.', error);
        setFailed(true);
      }
    }).catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; engine.current?.dispose(); engine.current = null; };
  }, []);

  useEffect(() => {
    if (section) {
      setChatOpen(false); resumeAfterChat.current = false;
      engine.current?.pause(); setPlaying(false); setHelp(false);
      if (!dialog.current.open) dialog.current.showModal();
      dialog.current.scrollTop = 0;
    } else if (dialog.current?.open) {
      dialog.current.close(); resumeButton.current?.focus();
    }
  }, [section, location.pathname]);

  useEffect(() => {
    const update = () => setClock(new Date());
    const timer = setInterval(update, 60000);
    document.addEventListener('visibilitychange', update);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', update); };
  }, []);
  useEffect(() => {
    engine.current?.setLighting?.(daylight);
    try { localStorage.setItem('portfolio-world-lighting', lightingMode); } catch { /* Settings still work without storage. */ }
  }, [daylight, lightingMode, ready]);
  useEffect(() => { engine.current?.setContributions?.(contributions.data?.weeks || []); }, [contributions.data, ready]);
  useEffect(() => {
    if (contributions.error && contributions.availableYears.length && !contributions.availableYears.includes(year)) setYear(contributions.availableYears[0]);
  }, [contributions.error, contributions.availableYears, year]);

  const openChat = useCallback(() => {
    resumeAfterChat.current = playing;
    engine.current?.pause(); setPlaying(false); setHelp(false); setChatOpen(true);
  }, [playing]);

  useEffect(() => {
    const update = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', update);
    return () => document.removeEventListener('fullscreenchange', update);
  }, []);

  useEffect(() => {
    const shortcut = event => {
      if (section || chatOpen || event.repeat || event.ctrlKey || event.metaKey || event.altKey || event.target.closest?.('input, textarea, select')) return;
      const index = Number(event.code.replace('Digit', '')) - 1;
      if (/^Digit[1-8]$/.test(event.code)) { event.preventDefault(); navigate(destinationPath(destinations[index].id)); }
      if (event.code === 'KeyM' && !playing) { event.preventDefault(); navigate('/#guide'); }
      if (event.code === 'KeyI') { event.preventDefault(); navigate('/#inventory'); }
      if (event.code === 'KeyT') { event.preventDefault(); openChat(); }
    };
    window.addEventListener('keydown', shortcut);
    return () => window.removeEventListener('keydown', shortcut);
  }, [navigate, playing, section, chatOpen, openChat]);

  const start = useCallback(() => {
    if (!engine.current || failed) { navigate('/#guide'); return; }
    setEntered(true); setPlaying(true); setHelp(false); engine.current.start();
  }, [failed, navigate]);

  const closeChat = (resume = true) => {
    setChatOpen(false);
    if (resume && resumeAfterChat.current) start();
    resumeAfterChat.current = false;
  };

  const travel = id => {
    if (failed || !engine.current) { navigate(destinationPath(id)); return; }
    dialog.current.close(); engine.current.travel(id); navigate('/'); start();
  };

  const pause = () => { engine.current?.pause(); setPlaying(false); };
  const closePanel = () => navigate('/');
  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen?.();
    } catch { /* The world also works in a normal browser window. */ }
  };

  const moveTouch = event => {
    if (joystick.current !== event.pointerId) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left - bounds.width / 2) / (bounds.width / 2);
    const z = -(event.clientY - bounds.top - bounds.height / 2) / (bounds.height / 2);
    engine.current?.move(Math.max(-1,Math.min(1,x)),Math.max(-1,Math.min(1,z)));
  };
  const stopTouch = () => { joystick.current=null; engine.current?.move(0,0); };
  const panelTitle = destinations.find(item => item.id === section)?.name || ({ inventory: 'Inventory', guide: 'Portfolio', project: 'Project details', support: 'Support my work' }[section] || 'Page not found');
  const showWelcome = !playing && !section && !chatOpen;

  return <main id="page-content" data-lighting={daylight < .5 ? 'night' : 'day'} className={`voxel-portfolio ${playing ? 'is-playing' : ''} ${failed ? 'world-unavailable' : ''}`}>
    <div className="world-canvas" ref={host} aria-hidden={!playing} />
    <div className="world-vignette" aria-hidden="true" />
    <a className="world-skip" href="/#guide">Skip walking and browse portfolio</a>

    <header className="world-header">
      <Link to="/" className="world-brand" onClick={pause} aria-label="Cedric Palapuz home"><span className="world-brand-block" aria-hidden="true"><span /></span><span>CEDRIC PALAPUZ</span></Link>
      <nav aria-label="Portfolio navigation" className="world-header-nav"><WorldMusic playing={playing} onOpen={pause} /><Link to="/#inventory" aria-label="Inventory and world settings"><PixelIcon name="workshop" /><span>Inventory</span><kbd>I</kbd></Link><Link to="/#guide"><PixelIcon name="book" /> Portfolio <kbd>M</kbd></Link><button onClick={() => { pause(); setHelp(!help); }} aria-label="Show controls" aria-expanded={help}>?</button><button className="world-fullscreen" onClick={toggleFullscreen} aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} aria-pressed={fullscreen}>⛶</button></nav>
    </header>

    {showWelcome && <section className={`world-welcome ${entered ? 'world-paused' : ''}`}>
      {entered ? <><h1>Let me show you <em>more.</em></h1><p className="world-welcome-copy">My work, what I’ve learned, and a little about me.</p></> : <><p className="world-kicker">Hi, I’m Cedric.</p><h1>I design the interface.<br /><em>I engineer what’s underneath.</em></h1><p className="world-welcome-copy">Full-time web developer at Mega Cat Studios.<br />Here’s a look at my work.</p></>}
      <div className="world-welcome-actions"><button ref={resumeButton} className="world-button world-button-primary" onClick={start} disabled={!ready && !failed}>{failed ? 'Browse portfolio' : !ready ? 'Loading…' : entered ? 'Continue' : 'Let me show you'}<span aria-hidden="true">→</span></button><Link className="world-browse-link" to="/#guide">Browse portfolio ↗</Link></div>
      {failed && <p className="world-compatibility" role="status">3D is unavailable. You can still browse my portfolio.</p>}
    </section>}

    {playing && <>
      <div className="world-explore-note"><div>{nearby ? nearby.name : 'WASD to move · E to open'}</div><button onClick={pause} aria-label="Pause">Ⅱ</button></div>
      <div className="world-crosshair" aria-hidden="true">+</div>
      {nearby && <button className="world-interact" onClick={() => engine.current?.interact()}><kbd>E</kbd><span><strong>{nearby.label}</strong></span><span aria-hidden="true">↗</span></button>}
      <div className="world-touch-controls"><button className="world-joystick" aria-label="Movement pad: hold and drag to walk" onPointerDown={event => { joystick.current=event.pointerId; event.currentTarget.setPointerCapture(event.pointerId); moveTouch(event); }} onPointerMove={moveTouch} onPointerUp={stopTouch} onPointerCancel={stopTouch} onLostPointerCapture={stopTouch}><span aria-hidden="true">▲<br />◀ <i /> ▶<br />▼</span></button><span className="world-touch-look">Drag the world to look</span><button className="world-jump" onClick={() => engine.current?.jump()} aria-label="Jump">↑<small>JUMP</small></button></div>
    </>}

    {help && !section && <aside className="world-help" aria-label="Exploration controls"><div><h2>Controls</h2><button onClick={() => setHelp(false)} aria-label="Close controls">×</button></div><dl><dt>W A S D</dt><dd>Walk around</dd><dt>Mouse / drag</dt><dd>Look around</dd><dt>Arrow keys</dt><dd>Walk forward/back, turn left/right</dd><dt>E / click</dt><dd>Open a nearby display</dd><dt>Space / Shift</dt><dd>Jump / walk faster</dd><dt>Esc / M</dt><dd>Pause / portfolio</dd><dt>I / T</dt><dd>Inventory / chat</dd><dt>Touch</dt><dd>Move with the pad. Drag the scene to look.</dd></dl><Link to="/#guide">Browse portfolio ↗</Link></aside>}

    {!section && playing && <aside className="world-minimap" aria-label="Map">
      <svg viewBox="-25 -25 50 50" role="img" aria-label={`Player position: ${Math.round(position.x)}, ${Math.round(position.z)}`}>
        <path d="M-20-21H18L23-15V14L17 22H-17L-23 15V-15Z" fill="#789568" stroke="#a4b989" strokeWidth=".4" />
        <path d="M0-16V19M-16 1H16M-16 11H16M-11-6V13M11-6V13" stroke="#c8bf90" strokeWidth="2" fill="none" />
        {destinations.map(place => <rect key={place.id} x={place.x-2} y={place.z-1.5} width="4" height="3" fill={place.color} stroke="#374831" strokeWidth=".5" />)}
        <path d="M0-1.8L1.3 1.4L0 .6L-1.3 1.4Z" fill="#fff8dc" stroke="#24382b" strokeWidth=".3" transform={`translate(${position.x} ${position.z}) rotate(${-position.yaw*180/Math.PI})`} />
      </svg>
    </aside>}

    {!section && <footer className="world-hud"><nav className="world-hotbar" aria-label="Quick access to portfolio sections">{destinations.map((place,i) => <Link key={place.id} to={destinationPath(place.id)} title={place.label} aria-label={place.label} className={nearby?.id === place.id ? 'is-nearby' : ''}><small>{i+1}</small><PixelIcon name={place.icon} /><span>{place.label.split(' &')[0]}</span></Link>)}</nav></footer>}

    <dialog ref={dialog} className="world-dialog" aria-labelledby="world-panel-title" onCancel={event => { if(event.target === event.currentTarget) { event.preventDefault(); closePanel(); } }}>
      <div className="world-dialog-header"><Link to="/#guide" aria-label="Open portfolio"><PixelIcon name="book" /><span>PORTFOLIO</span></Link><h2 id="world-panel-title">{panelTitle}</h2><button onClick={closePanel} aria-label="Close portfolio and return to world">×</button></div>
      {section && <div className="world-panel-body" key={location.pathname+location.hash}><WorldPanels section={section} onTravel={travel} lightingMode={lightingMode} onLightingMode={setLightingMode} clock={clock} contributions={contributions} year={year} onYear={setYear} /></div>}
      <nav className="world-panel-nav" aria-label="Portfolio sections">{destinations.map(place => <Link key={place.id} to={destinationPath(place.id)} aria-current={section === place.id ? 'page' : undefined}><PixelIcon name={place.icon} />{place.label.split(' &')[0]}</Link>)}</nav>
    </dialog>
    {!section && !chatOpen && <button className="world-chat-launcher" onClick={openChat}><kbd>T</kbd> Chat</button>}
    <WorldChat open={chatOpen && !section} onClose={closeChat} />
  </main>;
}
