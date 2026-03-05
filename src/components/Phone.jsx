import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Link } from 'react-scroll';
import './Phone.css';

const TicTacToe = lazy(() => import('./games/TicTacToe'));
const SnakeGame = lazy(() => import('./games/Snake'));
const TetrisGame = lazy(() => import('./games/Tetris'));
const MinesweeperGame = lazy(() => import('./games/Minesweeper'));
const SudokuGame = lazy(() => import('./games/Sudoku'));

const GAMES = [
  { id: 'tictactoe', name: 'Tic Tac Toe', component: TicTacToe, icon: '⭕', bg: '#1a1a2e' },
  { id: 'snake', name: 'Snake', component: SnakeGame, icon: '🐍', bg: '#0d2137' },
  { id: 'tetris', name: 'Tetris', component: TetrisGame, icon: '🧱', bg: '#1a0d2e' },
  { id: 'minesweeper', name: 'Minesweeper', component: MinesweeperGame, icon: '💣', bg: '#1a2e1a' },
  { id: 'sudoku', name: 'Sudoku', component: SudokuGame, icon: '🔢', bg: '#2e1a1a' },
];

const Phone = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [gamesOpen, setGamesOpen] = useState(false);
  const [activeGame, setActiveGame] = useState(null);
  const phoneRef = useRef(null);

  // Update clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      );
      setCurrentDate(
        now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Close phone on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && phoneRef.current && !phoneRef.current.contains(e.target)) {
        setIsOpen(false);
        setGamesOpen(false);
        setActiveGame(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close phone on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        if (activeGame) { setActiveGame(null); }
        else if (gamesOpen) { setGamesOpen(false); }
        else { setIsOpen(false); }
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [activeGame, gamesOpen]);

  const socialApps = [
    {
      name: 'GitHub',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      ),
      url: 'https://github.com/Corelocked',
      color: '#f0f6fc',
      bg: '#24292e'
    },
    {
      name: 'LinkedIn',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      ),
      url: 'https://www.linkedin.com/in/cedric-joshua-palapuz-85645524a/',
      color: '#ffffff',
      bg: '#0a66c2'
    },
    {
      name: 'Instagram',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      url: 'https://www.instagram.com/corelockedd/',
      color: '#ffffff',
      bg: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)'
    },
    {
      name: 'Facebook',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
        </svg>
      ),
      url: 'https://www.facebook.com/cdrplpz/',
      color: '#ffffff',
      bg: '#1877f2'
    },
  ];

  const donateApp = {
    name: 'Donate',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    ),
    color: '#ffffff',
    bg: '#ff6b9d',
    scrollTo: 'support',
  };

  const gamesFolder = {
    name: 'Games',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="6" y1="11" x2="10" y2="11"/><line x1="8" y1="9" x2="8" y2="13"/>
        <line x1="15" y1="12" x2="15.01" y2="12"/><line x1="18" y1="10" x2="18.01" y2="10"/>
        <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/>
      </svg>
    ),
    bg: 'linear-gradient(135deg, #7c4dff, #4fc3f7)',
    color: '#ffffff',
  };

  const navItems = [
    { name: 'Home', to: 'home', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    )},
    { name: 'About', to: 'about', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    )},
    { name: 'Skills', to: 'skills', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    )},
    { name: 'Projects', to: 'projects', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
      </svg>
    )},
    { name: 'Contact', to: 'contact', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    )},
  ];

  // Active game component
  const ActiveGameComponent = activeGame ? GAMES.find(g => g.id === activeGame)?.component : null;

  return (
    <div className={`phone-widget ${activeGame ? 'game-active' : ''}`} ref={phoneRef}>
      {/* Floating phone trigger */}
      <button
        className={`phone-fab ${isOpen ? 'open' : ''}`}
        onClick={() => { setIsOpen(!isOpen); if (isOpen) { setGamesOpen(false); setActiveGame(null); } }}
        aria-label="Open phone navigation"
      >
        <span className="fab-icon">
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
              <line x1="12" y1="18" x2="12.01" y2="18"/>
            </svg>
          )}
        </span>
        {!isOpen && <span className="fab-pulse"></span>}
      </button>

      {/* Phone mockup */}
      <div className={`phone-mockup ${isOpen ? 'visible' : ''}`}>
        {/* Phone frame */}
        <div className="phone-frame">
          {/* Notch */}
          <div className="phone-notch">
            <span className="notch-camera"></span>
          </div>

          {/* Status bar */}
          <div className="phone-status-bar">
            <span className="status-time">{currentTime}</span>
            <div className="status-icons">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></svg>
            </div>
          </div>

          {/* ===== ACTIVE GAME VIEW ===== */}
          {activeGame && ActiveGameComponent && (
            <div className="phone-game-screen">
              <div className="game-header">
                <button className="game-back-btn" onClick={() => setActiveGame(null)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                </button>
                <span className="game-header-title">{GAMES.find(g=>g.id===activeGame)?.name}</span>
              </div>
              <div className="game-body">
                <Suspense fallback={<div className="game-loading">Loading...</div>}>
                  <ActiveGameComponent />
                </Suspense>
              </div>
            </div>
          )}

          {/* ===== GAMES FOLDER VIEW ===== */}
          {gamesOpen && !activeGame && (
            <div className="phone-games-folder">
              <div className="game-header">
                <button className="game-back-btn" onClick={() => setGamesOpen(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                </button>
                <span className="game-header-title">Games</span>
              </div>
              <div className="games-list">
                {GAMES.map(game => (
                  <button key={game.id} className="game-list-item" onClick={() => setActiveGame(game.id)}>
                    <span className="game-list-icon">{game.icon}</span>
                    <span className="game-list-name">{game.name}</span>
                    <svg className="game-list-arrow" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ===== HOME SCREEN ===== */}
          {!gamesOpen && !activeGame && (
            <>
              {/* Lock screen info */}
              <div className="phone-lockscreen">
                <span className="lock-date">{currentDate}</span>
                <span className="lock-time">{currentTime}</span>
              </div>

              {/* App grid */}
              <div className="phone-app-grid">
                <div className="app-section-label">Socials</div>
                <div className="app-grid">
                  {socialApps.map((app) => (
                    <a
                      key={app.name}
                      href={app.url}
                      target={app.url.startsWith('http') ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      className="app-icon-wrapper"
                    >
                      <div
                        className="app-icon"
                        style={{ background: app.bg, color: app.color }}
                      >
                        {app.icon}
                      </div>
                      <span className="app-name">{app.name}</span>
                    </a>
                  ))}
                  {/* Donate button - scrolls to support */}
                  <Link
                    to={donateApp.scrollTo}
                    smooth={true}
                    duration={500}
                    offset={-80}
                    className="app-icon-wrapper app-icon-btn"
                    onClick={() => setIsOpen(false)}
                  >
                    <div
                      className="app-icon"
                      style={{ background: donateApp.bg, color: donateApp.color }}
                    >
                      {donateApp.icon}
                    </div>
                    <span className="app-name">{donateApp.name}</span>
                  </Link>
                  {/* Games folder icon */}
                  <button
                    className="app-icon-wrapper app-icon-btn"
                    onClick={() => setGamesOpen(true)}
                  >
                    <div
                      className="app-icon"
                      style={{ background: gamesFolder.bg, color: gamesFolder.color }}
                    >
                      {gamesFolder.icon}
                    </div>
                    <span className="app-name">{gamesFolder.name}</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Navigation dock - only on home */}
          {!gamesOpen && !activeGame && (
            <div className="phone-dock">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  smooth={true}
                  duration={500}
                  offset={-80}
                  className="dock-item"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="dock-icon">{item.icon}</span>
                  <span className="dock-label">{item.name}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Home bar indicator */}
          <div className="phone-home-bar">
            <span className="home-bar-line"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Phone;
