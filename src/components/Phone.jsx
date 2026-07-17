import React, { useState, useEffect, useRef, lazy, Suspense, useContext } from 'react';
import { Link } from 'react-scroll';
import { useGitHubContributions } from '../hooks/useGitHubContributions';
import ContributionHeatmap from './ContributionHeatmap';
import { ThemeContext } from '../context/ThemeContext';
import { projects } from '../data/projects';
import { certificateDetails } from '../data/certificates';
import { sendContactForm } from '../utils/sendContactForm';
import { getCareerAssistantReply } from '../utils/careerAssistant';
import './Phone.css';

// Assets
import aboutImage from '../assets/images/Hero-512.png';
import mayaQR from '../assets/images/maya-qr.jpg';

// Import skill SVG icons
import { ReactComponent as FrontendIcon } from '../assets/icons/frontend.svg';
import { ReactComponent as BackendIcon } from '../assets/icons/backend.svg';
import { ReactComponent as MobileIcon } from '../assets/icons/mobile.svg';
import { ReactComponent as JavascriptIcon } from '../assets/icons/javascript.svg';
import { ReactComponent as ReactIcon } from '../assets/icons/react.svg';
import { ReactComponent as HtmlIcon } from '../assets/icons/html.svg';
import { ReactComponent as NodejsIcon } from '../assets/icons/node-js.svg';
import { ReactComponent as KotlinIcon } from '../assets/icons/kotlin.svg';
import { ReactComponent as FlutterIcon } from '../assets/icons/flutter.svg';
import { ReactComponent as FirebaseIcon } from '../assets/icons/firebase.svg';
import { ReactComponent as SqliteIcon } from '../assets/icons/sqlite.svg';
import { ReactComponent as TailwindIcon } from '../assets/icons/tailwind.svg';
import { ReactComponent as ViteIcon } from '../assets/icons/vite.svg';
import { ReactComponent as CssIcon } from '../assets/icons/css.svg';
import { ReactComponent as ExpressIcon } from '../assets/icons/express.svg';
import { ReactComponent as ExpoIcon } from '../assets/icons/expo.svg';
import { ReactComponent as NextjsIcon } from '../assets/icons/nextjs.svg';
import { ReactComponent as NativeWindIcon } from '../assets/icons/nativewind.svg';
import { ReactComponent as SupabaseIcon } from '../assets/icons/supabase.svg';
import { ReactComponent as EasIcon } from '../assets/icons/eas.svg';

// Lazy load games
const TicTacToe = lazy(() => import('./games/TicTacToe'));
const SnakeGame = lazy(() => import('./games/Snake'));
const TetrisGame = lazy(() => import('./games/Tetris'));
const MinesweeperGame = lazy(() => import('./games/Minesweeper'));
const SudokuGame = lazy(() => import('./games/Sudoku'));
const CookieClicker = lazy(() => import('./games/CookieClicker'));
const Dinosaur = lazy(() => import('./games/Dinosaur'));
const FlappyBird = lazy(() => import('./games/FlappyBird'));
const ResumeViewerApp = lazy(() => import('./apps/ResumeViewer'));

const TicTacToeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M8 4v16M16 4v16M4 8h16M4 16h16" />
    <circle cx="8" cy="8" r="1.5" />
    <path d="M14.5 14.5l3 3M17.5 14.5l-3 3" />
  </svg>
);

const SnakeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M5 15c2-6 6-7 9-4s4 4 7 2" />
    <circle cx="18" cy="9" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const TetrisIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <rect x="4" y="4" width="5" height="5" rx="1" fill="currentColor" stroke="none" />
    <rect x="10" y="4" width="5" height="5" rx="1" fill="currentColor" stroke="none" opacity="0.85" />
    <rect x="10" y="10" width="5" height="5" rx="1" fill="currentColor" stroke="none" opacity="0.7" />
    <rect x="16" y="10" width="4" height="5" rx="1" fill="currentColor" stroke="none" opacity="0.55" />
  </svg>
);

const MinesweeperIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <circle cx="12" cy="13" r="5.5" />
    <path d="M12 4v3M9.2 5.2l1.5 2M14.8 5.2l-1.5 2M7 11l-2-1M17 11l2-1" />
    <circle cx="14" cy="12" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

const SudokuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M4 8h16M4 16h16M8 4v16M16 4v16" />
    <path d="M10.5 9.5h2.5v5h-2.5" />
  </svg>
);

const CookieIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="9" cy="8.5" r="1.1" fill="#050510" opacity="0.55" />
    <circle cx="15.5" cy="9.5" r="0.9" fill="#050510" opacity="0.55" />
    <circle cx="14" cy="15" r="1" fill="#050510" opacity="0.55" />
    <circle cx="10" cy="14" r="0.8" fill="#050510" opacity="0.55" />
  </svg>
);

const DinosaurIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M5 14c1.6-3.6 4.8-6 8.3-6H17l2.2 2.2-1.7 1.7H15l-.8 2.1c-.4 1.1-1.5 1.9-2.7 1.9H10l-1.1 3.1H6.1l.9-3.1H5.4c-.8 0-1.3-.9-.9-1.9z" />
    <path d="M15.5 8.2l1.8-2.2M18.5 10.5l1.8-1" />
    <circle cx="16.5" cy="11" r="0.6" fill="currentColor" stroke="none" />
  </svg>
);

const FlappyBirdIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M6 15c2.2-3.7 5.2-5.8 8.8-5.8 1.4 0 2.9.3 4.2.8-1.2 1.4-2.2 2.8-3 4.2-1.1 1.9-2.7 3.1-4.9 3.1-2 0-3.8-.7-5.1-2.3z" />
    <path d="M13.5 9.4l1.9-2.4" />
    <circle cx="15.2" cy="8.5" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);

const CoffeeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M6 9h10v5.2a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V11a2 2 0 0 1 2-2z" />
    <path d="M16 10h1.5a2 2 0 0 1 0 4H16" />
    <path d="M7 4c0 1 .8 1.4.8 2.2S7 7.1 7 8" />
    <path d="M10 4c0 1 .8 1.4.8 2.2S10 7.1 10 8" />
  </svg>
);

const CardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <rect x="4" y="6" width="16" height="12" rx="2" />
    <path d="M4 10h16M7 15h4" />
  </svg>
);

const MayaIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <rect x="6" y="3.5" width="12" height="17" rx="2.8" />
    <path d="M9 7h6M9 11h6M9 15h3" />
  </svg>
);

const GraduationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M3 10l9-4 9 4-9 4-9-4z" />
    <path d="M7 11v3c0 1.8 2.2 3.2 5 3.2s5-1.4 5-3.2v-3" />
    <path d="M21 10v5" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <rect x="4" y="7" width="16" height="12" rx="2" />
    <path d="M9 7V6a3 3 0 0 1 6 0v1M4 12h16" />
  </svg>
);

const PhoneMiniIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M7 4h3l2 5-2 1.5c1.2 2.4 3.1 4.4 5.5 5.5L17 14l3 2v3c0 .6-.4 1-1 1C10.8 20 4 13.2 4 5c0-.6.4-1 1-1h2z" />
  </svg>
);

// ===== Data =====

const GAMES = [
  { id: 'tictactoe', name: 'Tic Tac Toe', component: TicTacToe, icon: <TicTacToeIcon />, color: '#4fc3f7', background: 'linear-gradient(135deg, rgba(79, 195, 247, 0.18), rgba(79, 195, 247, 0.08))' },
  { id: 'snake', name: 'Snake', component: SnakeGame, icon: <SnakeIcon />, color: '#4caf50', background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.18), rgba(76, 175, 80, 0.08))' },
  { id: 'tetris', name: 'Tetris', component: TetrisGame, icon: <TetrisIcon />, color: '#ff9800', background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.18), rgba(255, 152, 0, 0.08))' },
  { id: 'minesweeper', name: 'Minesweeper', component: MinesweeperGame, icon: <MinesweeperIcon />, color: '#ff6b9d', background: 'linear-gradient(135deg, rgba(255, 107, 157, 0.18), rgba(255, 107, 157, 0.08))' },
  { id: 'sudoku', name: 'Sudoku', component: SudokuGame, icon: <SudokuIcon />, color: '#7c4dff', background: 'linear-gradient(135deg, rgba(124, 77, 255, 0.18), rgba(124, 77, 255, 0.08))' },
  { id: 'cookie', name: 'Cookie Clicker', component: CookieClicker, icon: <CookieIcon />, color: '#ffd54f', background: 'linear-gradient(135deg, rgba(255, 213, 79, 0.18), rgba(255, 213, 79, 0.08))' },
  { id: 'dino', name: 'Dinosaur', component: Dinosaur, icon: <DinosaurIcon />, color: '#81c784', background: 'linear-gradient(135deg, rgba(129, 199, 132, 0.18), rgba(129, 199, 132, 0.08))' },
  { id: 'flappy', name: 'Flappy Bird', component: FlappyBird, icon: <FlappyBirdIcon />, color: '#4dd0e1', background: 'linear-gradient(135deg, rgba(77, 208, 225, 0.18), rgba(77, 208, 225, 0.08))' },
];

// Years for contributions filter (defined elsewhere or unused)

const skillIcons = {
  frontend: <FrontendIcon />, backend: <BackendIcon />, mobile: <MobileIcon />,
  javascript: <JavascriptIcon />, react: <ReactIcon />, html: <HtmlIcon />,
  nodejs: <NodejsIcon />, kotlin: <KotlinIcon />, flutter: <FlutterIcon />,
  firebase: <FirebaseIcon />, sqlite: <SqliteIcon />,
  tailwind: <TailwindIcon />, vite: <ViteIcon />, css: <CssIcon />,
  express: <ExpressIcon />, expo: <ExpoIcon />, nextjs: <NextjsIcon />,
  nativewind: <NativeWindIcon />, supabase: <SupabaseIcon />, eas: <EasIcon />,
};

const SKILL_CATEGORIES = [
  { id: 'web', name: 'Web Development', iconKey: 'frontend', skills: [
    { name: 'JavaScript', iconKey: 'javascript' },
    { name: 'React', iconKey: 'react' }, { name: 'Next.js', iconKey: 'nextjs' },
    { name: 'HTML', iconKey: 'html' }, { name: 'CSS', iconKey: 'css' },
    { name: 'Tailwind CSS', iconKey: 'tailwind' }, { name: 'Vite', iconKey: 'vite' },
  ]},
  { id: 'mobile', name: 'Mobile Development', iconKey: 'mobile', skills: [
    { name: 'Expo', iconKey: 'expo' }, { name: 'NativeWind', iconKey: 'nativewind' },
    { name: 'EAS', iconKey: 'eas' }, { name: 'Kotlin', iconKey: 'kotlin' },
    { name: 'Flutter', iconKey: 'flutter' },
  ]},
  { id: 'services', name: 'Backend Services', iconKey: 'backend', skills: [
    { name: 'NodeJS', iconKey: 'nodejs' }, { name: 'Express.js', iconKey: 'express' },
    { name: 'Firebase', iconKey: 'firebase' }, { name: 'Supabase', iconKey: 'supabase' },
    { name: 'SQLite', iconKey: 'sqlite' },
  ]},
];

const PHONE_PROJECTS = projects;

const PROJECT_CATEGORIES = ['All', 'Website', 'Mobile App', 'Desktop App', 'Game', 'AI/ML'];

const PROFILE_BOT_GREETING = {
  id: 'bot-welcome',
  role: 'bot',
  intent: 'profile',
  text:
    'Hi! Ask me anything about Cedric or this portfolio. I use the website’s projects, experience, skills, certificates, and contact information as my reference.',
};

const BOT_VIEW_ACTIONS = {
  profile: { label: 'View profile', view: 'about' },
  experience: { label: 'View experience', view: 'about' },
  skills: { label: 'Explore skills', view: 'skills' },
  projects: { label: 'Explore projects', view: 'projects' },
  role: { label: 'Choose a resume', view: 'resume' },
  resume: { label: 'Open resumes', view: 'resume' },
  contact: { label: 'Contact Cedric', view: 'contact' }
};

const WEBSITE_REFERENCE_ROUTES = ['/', '/projects', '/contact', '/support', '/cedric-joshua-palapuz'];

const SUPPORT_OPTIONS = [
  {
    id: 2, name: 'Ko-fi',
    icon: <CoffeeIcon />,
    description: 'One-time or monthly support on Ko-fi',
    link: 'https://ko-fi.com/corelocked',
    color: '#FF5E5B',
  },
  {
    id: 3, name: 'PayPal',
    icon: <CardIcon />,
    description: 'Direct support via PayPal donation',
    link: 'https://paypal.me/Corelocked',
    color: '#00A0FF',
  },
  {
    id: 4, name: 'Maya',
    icon: <MayaIcon />,
    description: 'Send via Maya QR code (Philippines)',
    qrImage: mayaQR,
    isQR: true,
    color: '#00D563',
  },
];

// ===== App Grid =====

const apps = [
  {
    name: 'About', type: 'action', action: 'openAbout',
    bg: '#ff9800', color: '#fff',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="7" r="4"/><path d="M5.5 21c0-4 3-7 6.5-7s6.5 3 6.5 7"/>
      </svg>
    ),
  },
  {
    name: 'Skills', type: 'action', action: 'openSkills',
    bg: '#7c4dff', color: '#fff',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
  {
    name: 'Projects', type: 'action', action: 'openProjects',
    bg: '#4fc3f7', color: '#fff',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    name: 'Resume', type: 'action', action: 'openResume',
    bg: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', color: '#fff',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  {
    name: 'Certificates', type: 'scroll', to: 'certificates',
    bg: '#4caf50', color: '#fff',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
  },
  {
    name: 'GitHub', type: 'link', url: 'https://github.com/Corelocked',
    bg: '#24292e', color: '#f0f6fc',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
  {
    name: 'Theme', type: 'action', action: 'toggleTheme',
    bg: 'linear-gradient(135deg,#ffd86b,#ff6bcb)', color: '#111',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn', type: 'link', url: 'https://www.linkedin.com/in/cedric-joshua-palapuz-85645524a/',
    bg: '#0a66c2', color: '#fff',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    ),
  },
  {
    name: 'Instagram', type: 'link', url: 'https://www.instagram.com/corelockedd/',
    bg: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', color: '#fff',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    name: 'Facebook', type: 'link', url: 'https://www.facebook.com/cdrplpz/',
    bg: '#1877f2', color: '#fff',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
      </svg>
    ),
  },
  {
    name: 'Email', type: 'action', action: 'openContact',
    bg: '#00bcd4', color: '#fff',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
  {
    name: 'Donate', type: 'action', action: 'openSupport',
    bg: '#ff6b9d', color: '#fff',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    ),
  },
  {
    name: 'Assistant', type: 'action', action: 'openAssistant',
    bg: 'linear-gradient(135deg, #22d3ee, #3b82f6)', color: '#fff',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="7" width="16" height="10" rx="4" />
        <path d="M9 12h.01M15 12h.01" />
        <path d="M12 3v4M8 3h8" />
      </svg>
    ),
  },
  {
    name: 'Games', type: 'action', action: 'openGames',
    bg: 'linear-gradient(135deg, #7c4dff, #4fc3f7)', color: '#fff',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="6" y1="11" x2="10" y2="11"/><line x1="8" y1="9" x2="8" y2="13"/>
        <line x1="15" y1="12" x2="15.01" y2="12"/><line x1="18" y1="10" x2="18.01" y2="10"/>
        <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/>
      </svg>
    ),
  },
  {
    name: 'Home', type: 'scroll', to: 'home',
    bg: 'rgba(255,255,255,0.08)', color: '#fff',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
];

// ===== Phone Component =====

const Phone = ({ initiallyOpen = false }) => {
  // Navigation state
  const [gamesOpen, setGamesOpen] = useState(false);
  const [activeGame, setActiveGame] = useState(null);
  const [activeView, setActiveView] = useState(null); // 'about'|'skills'|'projects'|'contact'|'support'|'assistant'
  const [currentTime, setCurrentTime] = useState('');
  const [mobileOpen, setMobileOpen] = useState(initiallyOpen);
  const [phoneVideoSources, setPhoneVideoSources] = useState(null);

  // Skills state
  const [activeSkillCat, setActiveSkillCat] = useState('all');

  // Projects state
  const [activeProjectCat, setActiveProjectCat] = useState('All');

  // Contact form state
  const formRef = useRef();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState({ submitting: false, submitted: false, error: null });

  // Support state
  const [activeQR, setActiveQR] = useState(null);

  // Assistant chat state
  const [chatInput, setChatInput] = useState('');
  const [botTyping, setBotTyping] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [chatMessages, setChatMessages] = useState(() => [
    {
      ...PROFILE_BOT_GREETING,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [botContext, setBotContext] = useState({ lastIntent: 'profile', lastTopic: 'intro' });
  const chatEndRef = useRef(null);
  const chatInputRef = useRef(null);
  const replyTimerRef = useRef(null);
  const websiteIndexRef = useRef([]);

  // Swipe state for gesture-based navigation
  const [swipeStart, setSwipeStart] = useState(null);
  const phoneScreenRef = useRef(null);

  // Contributions state
  const [contribYear, setContribYear] = useState(new Date().getFullYear());
  const {
    data: contribData,
    loading: contribLoading,
    error: contribError,
    availableYears,
  } = useGitHubContributions(contribYear);
  const [yearMenuOpen, setYearMenuOpen] = useState(false); // State for year dropdown menu
  const yearMenuRef = useRef(null);

  // Theme context for toggling dark/light mode from phone app
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  // Dock apps (bottom dock) - ordered per user request
  const dockApps = [
    apps.find((a) => a.name === 'Certificates'),
    apps.find((a) => a.name === 'About'),
    apps.find((a) => a.name === 'Home'),
    apps.find((a) => a.name === 'Projects'),
    apps.find((a) => a.name === 'Resume'),
  ].filter(Boolean);

  // ===== Effects =====

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const videos = darkMode
      ? Promise.all([
          import('../assets/images/umbreon.webm'),
          import('../assets/images/umbreon.mp4')
        ])
      : Promise.all([
          import('../assets/images/spider-gwen.webm'),
          import('../assets/images/spider-gwen.mp4')
        ]);

    videos.then(([webm, mp4]) => {
      if (!cancelled) {
        setPhoneVideoSources({
          webm: webm.default || webm,
          mp4: mp4.default || mp4
        });
      }
    }).catch(() => {});

    return () => { cancelled = true; };
  }, [darkMode]);

  useEffect(() => {
    if (availableYears.length && !availableYears.includes(contribYear)) {
      setContribYear(availableYears[0]);
    }
  }, [availableYears, contribYear]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        if (activeQR) setActiveQR(null);
        else if (activeGame) setActiveGame(null);
        else if (gamesOpen) setGamesOpen(false);
        else if (activeView) setActiveView(null);
        else setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [activeGame, gamesOpen, activeView, activeQR]);

  useEffect(() => {
    if (!window.visualViewport) return undefined;

    const root = document.documentElement;
    const updateKeyboardOffset = () => {
      const viewport = window.visualViewport;
      const maybeKeyboardOffset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      const isTouchDevice = window.matchMedia('(pointer:coarse)').matches;
      const isMobileViewport = window.matchMedia('(max-width: 1024px)').matches;
      const focusedElement = document.activeElement;
      const isTextInputFocused =
        focusedElement &&
        (focusedElement.tagName === 'INPUT' || focusedElement.tagName === 'TEXTAREA');
      const keyboardOffset =
        isTouchDevice && isMobileViewport && isTextInputFocused && maybeKeyboardOffset > 110
          ? maybeKeyboardOffset
          : 0;
      root.style.setProperty('--phone-keyboard-offset', `${keyboardOffset}px`);
    };

    updateKeyboardOffset();
    window.visualViewport.addEventListener('resize', updateKeyboardOffset);
    window.visualViewport.addEventListener('scroll', updateKeyboardOffset);

    return () => {
      window.visualViewport.removeEventListener('resize', updateKeyboardOffset);
      window.visualViewport.removeEventListener('scroll', updateKeyboardOffset);
      root.style.setProperty('--phone-keyboard-offset', '0px');
    };
  }, []);

  useEffect(() => {
    if (activeView === 'assistant' && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [chatMessages, botTyping, activeView]);

  useEffect(() => () => clearTimeout(replyTimerRef.current), []);

  useEffect(() => {
    if (!chatInputRef.current) return;
    chatInputRef.current.style.height = 'auto';
    chatInputRef.current.style.height = `${Math.min(chatInputRef.current.scrollHeight, 76)}px`;
  }, [chatInput]);

  useEffect(() => {
    if (activeView !== 'assistant' || websiteIndexRef.current.length) return undefined;
    let active = true;

    Promise.allSettled(WEBSITE_REFERENCE_ROUTES.map(async (route) => {
      const html = await fetch(route).then((response) => response.text());
      const content = new DOMParser().parseFromString(html, 'text/html').querySelector('.main-content');
      return {
        text: content ? [...content.querySelectorAll('h1, h2, h3, h4, p, li, a')].map((element) => element.textContent).join('\n') : '',
        href: route,
        label: route === '/' ? 'Portfolio home' : route.split('/').filter(Boolean).pop().replace(/-/g, ' ')
      };
    })).then((pages) => {
      if (active) websiteIndexRef.current = pages.filter(({ status, value }) => status === 'fulfilled' && value.text).map(({ value }) => value);
    });

    return () => { active = false; };
  }, [activeView]);

  // Swipe gesture handling for phone navigation
  useEffect(() => {
    const phoneScreen = phoneScreenRef.current;
    if (!phoneScreen) return;

    const handleTouchStart = (e) => {
      setSwipeStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    };

    const handleTouchEnd = (e) => {
      if (!swipeStart) return;
      
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = swipeStart.x - endX;
      const diffY = swipeStart.y - endY;

      // Only register horizontal swipes (greater than vertical movement)
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          // Swiped left - go to next app/view or close current view
          if (activeView) setActiveView(null);
          else if (activeGame) setActiveGame(null);
          else if (gamesOpen) setGamesOpen(false);
        } else {
          // Swiped right - go to home or back
          if (activeView) setActiveView(null);
          else if (activeGame) setActiveGame(null);
          else if (gamesOpen) setGamesOpen(false);
        }
      }

      setSwipeStart(null);
    };

    phoneScreen.addEventListener('touchstart', handleTouchStart);
    phoneScreen.addEventListener('touchend', handleTouchEnd);

    return () => {
      phoneScreen.removeEventListener('touchstart', handleTouchStart);
      phoneScreen.removeEventListener('touchend', handleTouchEnd);
    };
  }, [swipeStart, activeView, activeGame, gamesOpen]);

  // Close year menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (yearMenuRef && yearMenuRef.current && !yearMenuRef.current.contains(e.target)) {
        setYearMenuOpen(false);
      }
    };
    if (yearMenuOpen) window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [yearMenuOpen]);

  // ===== Handlers =====

  const handleAppAction = (action) => {
    // Reset other views when opening a new one
    setGamesOpen(false);
    setActiveGame(null);
    setActiveView(null);
    setActiveQR(null);

    switch (action) {
      case 'openGames':
        setGamesOpen(true);
        break;
        case 'openResume':
          setActiveView('resume');
          break;
      case 'openAbout':
        setActiveView('about');
        break;
      case 'openSkills':
        setActiveSkillCat('all');
        setActiveView('skills');
        break;
      case 'openProjects':
        setActiveProjectCat('All');
        setActiveView('projects');
        break;
      case 'openContact':
        setFormStatus({ submitting: false, submitted: false, error: null });
        setActiveView('contact');
        break;
      case 'openSupport':
        setActiveView('support');
        break;
      case 'openAssistant':
        setActiveView('assistant');
        break;
      case 'toggleTheme':
        if (toggleDarkMode) toggleDarkMode();
        break;
      default:
        break;
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ submitting: true, submitted: false, error: null });
    try {
      await sendContactForm(formRef.current);
      setFormStatus({ submitting: false, submitted: true, error: null });
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setFormStatus((prev) => ({ ...prev, submitted: false })), 5000);
    } catch (error) {
      console.error('EmailJS Error:', error);
      setFormStatus({
        submitting: false,
        submitted: false,
        error: error?.status === 429 ? 'Please wait one minute before sending another message.' : 'Failed to send message. Please try again.',
      });
    }
  };

  const sendChatMessage = (message) => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || botTyping) return;
    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmedMessage,
      timestamp,
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput('');
    setBotTyping(true);

    replyTimerRef.current = setTimeout(() => {
      const websiteSources = [
        ...websiteIndexRef.current,
        { text: certificateDetails.map(({ title, description }) => `${title}. ${description}`).join('\n'), href: '/#certificates', label: 'Certificates & awards' },
        { text: document.querySelector('.main-content')?.innerText || '', href: window.location.pathname, label: 'Current page' }
      ];
      const reply = getCareerAssistantReply(trimmedMessage, botContext, PHONE_PROJECTS, SKILL_CATEGORIES, websiteSources);
      setChatMessages((prev) => [...prev, {
        id: `bot-${Date.now()}`,
        role: 'bot',
        intent: reply.intent,
        references: reply.references,
        text: reply.text,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }]);
      setBotContext({ lastIntent: reply.intent, lastTopic: reply.topic });
      setBotTyping(false);
    }, Math.min(800, 350 + trimmedMessage.length * 5));
  };

  const resetChat = () => {
    clearTimeout(replyTimerRef.current);
    setChatMessages([{
      ...PROFILE_BOT_GREETING,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    }]);
    setBotContext({ lastIntent: 'profile', lastTopic: 'intro' });
    setBotTyping(false);
    setChatInput('');
  };

  const copyChatMessage = async (message) => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopiedMessageId(message.id);
      setTimeout(() => setCopiedMessageId(null), 1500);
    } catch {
      setCopiedMessageId(null);
    }
  };

  // ===== Computed =====

  const filteredSkills =
    activeSkillCat === 'all'
      ? SKILL_CATEGORIES.flatMap((cat) => cat.skills)
      : SKILL_CATEGORIES.find((cat) => cat.id === activeSkillCat)?.skills || [];

  const filteredProjects =
    activeProjectCat === 'All'
      ? PHONE_PROJECTS
      : PHONE_PROJECTS.filter((p) => p.category.includes(activeProjectCat));

  const ActiveGameComponent = activeGame ? GAMES.find((g) => g.id === activeGame)?.component : null;
  // ===== Helpers =====

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric',
    });
  };

  // ===== Back Header Helper =====

  const renderBackHeader = (title) => (
    <div className="game-header">
      <button className="game-back-btn" onClick={() => { setActiveView(null); setActiveQR(null); }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <span className="game-header-title">{title}</span>
    </div>
  );

  // ===== Detail View Renderer =====

  const renderDetailView = () => {
    switch (activeView) {
      case 'resume':
        return (
          <div className="phone-detail-view">
            {renderBackHeader('Resume')}
            <div className="pv-content">
              <Suspense fallback={<div className="game-loading">Loading resume...</div>}>
                <ResumeViewerApp />
              </Suspense>
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="phone-detail-view">
            {renderBackHeader('About')}
            <div className="pv-content">
              <div className="pv-about-avatar">
                <img src={aboutImage} alt="Cedric Joshua" />
              </div>
              <h3 className="pv-about-name">Cedric Joshua Palapuz</h3>
              <p className="pv-about-role">Full-Stack Web Developer</p>
              <div className="pv-section-text">
                <p className="pv-lead">
                  I'm a full-stack web developer focused on building practical, user-friendly products.
                  I work mainly with React and Next.js on the frontend, with Node.js, Firebase,
                  and Supabase behind the scenes.
                </p>
                <p className="pv-sub">
                  I enjoy turning ideas into polished apps with clear UX and reliable workflows.
                  My goal is to build software people actually use and enjoy.
                </p>
              </div>
              <div className="pv-cards">
                <div className="pv-card">
                  <span className="pv-card-icon"><GraduationIcon /></span>
                  <h4>Education</h4>
                  <p className="pv-card-title">BS in Computer Science</p>
                  <p className="pv-card-sub">CIIT College of Arts and Technology</p>
                  <span className="pv-card-date">2022 - 2026</span>
                </div>
                <div className="pv-card">
                  <span className="pv-card-icon"><BriefcaseIcon /></span>
                  <h4>Experience</h4>
                  <p className="pv-card-title">Work Immersion Intern</p>
                  <p className="pv-card-sub">Philippine Nuclear Research Institute</p>
                  <span className="pv-card-date">2020</span>
                </div>
              </div>
              <div className="pv-highlights">
                <span className="pv-tag">Problem Solver</span>
                <span className="pv-tag">Creative Thinker</span>
                <span className="pv-tag">Fast Learner</span>
              </div>
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className="phone-detail-view">
            {renderBackHeader('Skills')}
            <div className="pv-content">
              <div className="pv-tabs">
                <button
                  className={`pv-tab ${activeSkillCat === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveSkillCat('all')}
                >
                  All
                </button>
                {SKILL_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    className={`pv-tab ${activeSkillCat === cat.id ? 'active' : ''}`}
                    onClick={() => setActiveSkillCat(cat.id)}
                  >
                    <span className="pv-tab-icon">{skillIcons[cat.iconKey]}</span>
                    {cat.name}
                  </button>
                ))}
              </div>
              <div className="pv-chips">
                {filteredSkills.map((skill, i) => (
                  <span key={skill.iconKey || i} className="pv-chip">
                    <span className="pv-chip-icon">{skillIcons[skill.iconKey]}</span>
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="phone-detail-view">
            {renderBackHeader('Projects')}
            <div className="pv-content">
              <div className="pv-tabs">
                {PROJECT_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    className={`pv-tab ${activeProjectCat === cat ? 'active' : ''}`}
                    onClick={() => setActiveProjectCat(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="pv-project-list">
                {filteredProjects.map((project) => (
                  <div key={project.id} className={`pv-project-card ${project.featured ? 'featured' : ''}`}>
                    <h4 className="pv-project-title">{project.title}</h4>
                    <p className="pv-project-desc">{project.description}</p>
                    <div className="pv-project-tags">
                      {project.category.map((c, i) => (
                        <span key={`c-${i}`} className="pv-cat-tag">{c}</span>
                      ))}
                      {project.roles && project.roles.map((r, i) => (
                        <span key={`r-${i}`} className="pv-role-tag">{r}</span>
                      ))}
                      {project.technologies.map((t, i) => (
                        <span key={`t-${i}`} className="pv-tech-tag">{t}</span>
                      ))}
                    </div>
                    <div className="pv-project-links">
                      {project.canvaLink && project.canvaLink !== '#' && (
                        <a href={project.canvaLink} target="_blank" rel="noopener noreferrer" className="pv-link">
                          Canva
                        </a>
                      )}
                      {project.githubLink && project.githubLink !== '#' && (
                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="pv-link">
                          GitHub
                        </a>
                      )}
                      {project.liveDemo && project.liveDemo !== '#' && (
                        <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" className="pv-link primary">
                          Demo
                        </a>
                      )}
                    </div>
                  </div>
                ))}
                {filteredProjects.length === 0 && (
                  <p className="pv-empty">No projects in this category.</p>
                )}
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="phone-detail-view">
            {renderBackHeader('Email')}
            <div className="pv-content">
              <div className="pv-contact-chips">
                <span className="pv-contact-chip">cedricjoshua.palapuz@gmail.com</span>
                <span className="pv-contact-chip"><PhoneMiniIcon /> (+63) 999-405-1077</span>
                <span className="pv-contact-chip">Philippines</span>
              </div>

              <form ref={formRef} onSubmit={handleContactSubmit} className="pv-form">
                <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px' }}>
                  <label htmlFor="phone-website">Website</label>
                  <input id="phone-website" name="website" type="text" tabIndex="-1" autoComplete="off" />
                </div>
                {formStatus.submitted && (
                  <div className="pv-form-msg success" role="status" aria-live="polite">✅ Message sent! I'll get back to you soon.</div>
                )}
                {formStatus.error && (
                  <div className="pv-form-msg error" role="alert">❌ {formStatus.error}</div>
                )}
                <div className="pv-form-group">
                  <label htmlFor="phone-name">Name <span className="pv-req">*</span></label>
                  <input
                    id="phone-name"
                    type="text"
                    name="from_name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    maxLength={100}
                    minLength={2}
                    autoComplete="name"
                    required
                    disabled={formStatus.submitting}
                  />
                </div>
                <div className="pv-form-group">
                  <label htmlFor="phone-email">Email <span className="pv-req">*</span></label>
                  <input
                    id="phone-email"
                    type="email"
                    name="from_email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    maxLength={254}
                    autoComplete="email"
                    required
                    disabled={formStatus.submitting}
                  />
                </div>
                <div className="pv-form-group">
                  <label htmlFor="phone-message">Message <span className="pv-req">*</span></label>
                  <textarea
                    id="phone-message"
                    name="message"
                    placeholder="Tell me about your project or just say hello..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    maxLength={3000}
                    minLength={10}
                    required
                    disabled={formStatus.submitting}
                    rows={4}
                  />
                </div>
                <button type="submit" className="pv-submit-btn" disabled={formStatus.submitting}>
                  {formStatus.submitting ? (
                    <>
                      <span className="pv-spinner"></span>
                      Sending...
                    </>
                  ) : (
                    '✉️ Send Message'
                  )}
                </button>
              </form>

              <div className="pv-socials">
                <span className="pv-social-label">Find me on</span>
                <div className="pv-social-links">
                  <a href="https://github.com/Corelocked" target="_blank" rel="noopener noreferrer">GitHub</a>
                  <a href="https://www.linkedin.com/in/cedric-joshua-palapuz-85645524a/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                  <a href="https://www.instagram.com/corelockedd/" target="_blank" rel="noopener noreferrer">Instagram</a>
                  <a href="https://www.facebook.com/cdrplpz/" target="_blank" rel="noopener noreferrer">Facebook</a>
                </div>
              </div>
            </div>
          </div>
        );

      case 'support':
        return (
          <div className="phone-detail-view">
            {renderBackHeader('Donate')}
            <div className="pv-content">
              <p className="pv-section-subtitle">
                If you enjoy my projects and want to support my work, consider buying me a coffee or becoming a sponsor!
              </p>

              {activeQR ? (
                <div className="pv-qr-view">
                  <button className="pv-qr-back" onClick={() => setActiveQR(null)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Back to options
                  </button>
                  <div className="pv-qr-content">
                    <h4 style={{ color: activeQR.color }}>{activeQR.name}</h4>
                    <img src={activeQR.qrImage} alt={`${activeQR.name} QR`} className="pv-qr-img" />
                    <p>Scan the QR code to send support</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="pv-support-list">
                    {SUPPORT_OPTIONS.map((option) =>
                      option.isQR ? (
                        <button
                          key={option.id}
                          className="pv-support-card"
                          onClick={() => setActiveQR(option)}
                          style={{ '--support-color': option.color }}
                        >
                          <span className="pv-support-icon" style={{ color: option.color }}>{option.icon}</span>
                          <div className="pv-support-info">
                            <h4>{option.name}</h4>
                            <p>{option.description}</p>
                          </div>
                          <span className="pv-support-arrow">›</span>
                        </button>
                      ) : (
                        <a
                          key={option.id}
                          href={option.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pv-support-card"
                          style={{ '--support-color': option.color }}
                        >
                          <span className="pv-support-icon" style={{ color: option.color }}>{option.icon}</span>
                          <div className="pv-support-info">
                            <h4>{option.name}</h4>
                            <p>{option.description}</p>
                          </div>
                          <span className="pv-support-arrow">›</span>
                        </a>
                      )
                    )}
                  </div>
                  <p className="pv-support-thanks">Your support means the world!</p>
                </>
              )}
            </div>
          </div>
        );

      case 'assistant':
        return (
          <div className="phone-detail-view">
            {renderBackHeader('Ask Cedric')}
            <div className="pv-assistant-shell">
              <div className="pv-assistant-controls">
                <span><i /> Portfolio-grounded</span>
                <button type="button" className="pv-assistant-reset" onClick={resetChat} aria-label="Start a new conversation" title="New conversation">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4v6h6M20 20v-6h-6M5.1 15a8 8 0 0 0 13.1 2.5M18.9 9A8 8 0 0 0 5.8 6.5" /></svg>
                </button>
              </div>

              <div className="pv-bot-scroll">
                <div className="pv-bot-messages" role="log" aria-live="polite" aria-busy={botTyping}>
                  {chatMessages.map((message) => (
                    <div key={message.id} className={`pv-bot-row ${message.role === 'user' ? 'user' : 'bot'}`}>
                      <div className="pv-bot-message-content">
                        <div className={`pv-bot-bubble ${message.role === 'user' ? 'user' : 'bot'}`}>
                          {message.text}
                        </div>
                        {message.role === 'bot' && message.references?.length > 0 && (
                          <div className="pv-bot-references" aria-label="Answer references">
                            <span>References</span>
                            <div>
                              {message.references.map((reference) => (
                                <a key={reference.href} href={reference.href} onClick={() => setMobileOpen(false)}>
                                  {reference.label}<span aria-hidden="true">↗</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="pv-bot-meta">
                          <span className="pv-bot-time">{message.timestamp}</span>
                          {message.role === 'bot' && (
                            <button type="button" onClick={() => copyChatMessage(message)} aria-label="Copy response">
                              {copiedMessageId === message.id ? 'Copied' : 'Copy'}
                            </button>
                          )}
                        </div>
                        {message.role === 'bot' && BOT_VIEW_ACTIONS[message.intent] && (
                          <button type="button" className="pv-bot-action" onClick={() => setActiveView(BOT_VIEW_ACTIONS[message.intent].view)}>
                            {BOT_VIEW_ACTIONS[message.intent].label}<span aria-hidden="true">→</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {botTyping && (
                    <div className="pv-bot-row bot pv-bot-typing-row" aria-label="Cedric is thinking">
                      <div className="pv-bot-typing"><i /><i /><i /></div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              </div>

              <div className="pv-bot-composer-wrap">
                <form
                  className="pv-bot-input-row"
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendChatMessage(chatInput);
                  }}
                >
                  <textarea
                    ref={chatInputRef}
                    rows="1"
                    maxLength="280"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendChatMessage(chatInput);
                      }
                    }}
                    onFocus={() => {
                      if (chatEndRef.current) {
                        setTimeout(() => {
                          chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
                        }, 120);
                      }
                    }}
                    placeholder="Ask anything about Cedric"
                    aria-label="Ask Cedric assistant"
                    disabled={botTyping}
                  />
                  <button type="submit" disabled={!chatInput.trim() || botTyping} aria-label="Send message">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 4 16 8-16 8 3-8-3-8Zm3 8h13" /></svg>
                  </button>
                </form>
                <span className="pv-bot-hint">Enter to send · Shift + Enter for a new line</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ===== App Renderer =====

  const renderApp = (app) => {
    const isThemeApp = app.action === 'toggleTheme';
    const isHomeApp = app.name === 'Home';
    
    let appIcon;
    if (isThemeApp) {
      appIcon = darkMode ? (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 12.79A9 9 0 1 1 11.21 3c0 .13-.01.26-.01.39A7.5 7.5 0 0 0 18.61 10.8c.13 0 .26-.01.39-.01z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      );
    } else if (isHomeApp) {
      // Use outline style for both themes, color changes via computedIconColor
      appIcon = (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      );
    } else {
      appIcon = app.icon;
    }
    const appBg = isThemeApp
      ? (darkMode ? 'linear-gradient(135deg,#263249,#182235)' : 'linear-gradient(135deg,#ffd86b,#ffb347)')
      : isHomeApp
      ? (darkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.75)')
      : app.bg;

    // Compute icon color.
    // - Theme toggle: sun = gold, moon = white
    // - Home app: light/dark inversion handled separately
    // - Other apps: prefer their configured color, otherwise fall back to theme default.
    let computedIconColor;
    if (isThemeApp) {
      computedIconColor = darkMode ? '#FFD700' : '#ffffff';
    } else if (app.name === 'Home') {
      computedIconColor = darkMode ? '#000000' : '#ffffff';
    } else {
      computedIconColor = app.color || (darkMode ? '#ffffff' : '#000000');
    }

    if (app.type === 'link') {
      return (
        <a key={app.name} href={app.url} target="_blank" rel="noopener noreferrer" className="phone-app">
          <div className="phone-app-icon" style={{ background: appBg, color: computedIconColor }}>{appIcon}</div>
          <span className="phone-app-name">{app.name}</span>
        </a>
      );
    }
    if (app.type === 'scroll') {
      return (
        <Link key={app.name} to={app.to} smooth={true} duration={500} offset={-80} className="phone-app" onClick={() => setMobileOpen(false)}>
          <div className="phone-app-icon" style={{ background: appBg, color: computedIconColor }}>{appIcon}</div>
          <span className="phone-app-name">{app.name}</span>
        </Link>
      );
    }
    if (app.type === 'action') {
      return (
        <button key={app.name} className="phone-app phone-app-btn" onClick={() => handleAppAction(app.action)}>
          <div className="phone-app-icon" style={{ background: appBg, color: computedIconColor }}>{appIcon}</div>
          <span className="phone-app-name">{app.name}</span>
        </button>
      );
    }
    return null;
  };

  // ===== Screen Content =====

  const renderScreenContent = () => {
    if (activeGame && ActiveGameComponent) {
      return (
        <div className="phone-game-screen">
          <div className="game-header">
            <button className="game-back-btn" onClick={() => setActiveGame(null)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <span className="game-header-title">{GAMES.find((g) => g.id === activeGame)?.name}</span>
          </div>
          <div className="game-body">
            <Suspense fallback={<div className="game-loading">Loading...</div>}>
              <ActiveGameComponent />
            </Suspense>
          </div>
        </div>
      );
    }

    if (gamesOpen) {
      return (
        <div className="phone-games-folder">
          <div className="game-header">
            <button className="game-back-btn" onClick={() => setGamesOpen(false)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <span className="game-header-title">Games</span>
          </div>
          <div className="games-list">
            {GAMES.map((game) => (
              <button key={game.id} className="game-list-item" onClick={() => setActiveGame(game.id)}>
                <span className="game-list-icon" style={{ color: game.color, background: game.background }}>{game.icon}</span>
                <span className="game-list-name">{game.name}</span>
                <svg className="game-list-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (activeView) {
      return renderDetailView();
    }

    return (
      <div className="phone-home">
        <div className="phone-greeting-section">
          <h2 className="phone-greeting">{getGreeting()}</h2>
          <span className="phone-date">{formatDate()}</span>
        </div>

        <div className="phone-app-grid">
          {apps.filter((a) => !dockApps.includes(a)).map(renderApp)}
        </div>

        {/* GitHub Contributions Widget */}
        <div className="phone-widget-card github-contrib-widget">
          <div className="widget-header-enhanced">
            <div className="widget-header-left">
              <svg className="widget-gh-icon-big" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="widget-title-big">Contributions</span>
            </div>
            <div className="widget-header-right">
              <div className="widget-year-dropdown" ref={yearMenuRef}>
                <button
                  className="widget-year-btn subdued"
                  aria-haspopup="listbox"
                  aria-expanded={yearMenuOpen}
                  onClick={() => setYearMenuOpen((s) => !s)}
                >
                  {contribYear}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 8 }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {yearMenuOpen && (
                  <ul className="widget-year-menu" role="listbox">
                    {availableYears.map((y) => (
                      <li
                        key={y}
                        role="option"
                        aria-selected={contribYear === y}
                        className={`widget-year-option ${contribYear === y ? 'active' : ''}`}
                        onClick={() => { setContribYear(y); setYearMenuOpen(false); }}
                      >
                        {y}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div className="widget-heatmap-container">
            <ContributionHeatmap
              weeks={contribData?.weeks}
              totalContributions={contribData?.totalContributions}
              year={contribYear}
              loading={contribLoading}
              error={contribError}
            />
          </div>
        </div>

        {/* Dock at bottom */}
        <div className="phone-app-dock">
          {dockApps.map(renderApp)}
        </div>
      </div>
    );
  };

  // ===== Main Render =====

  return (
    <div className="phone-widget">
      {/* Mobile toggle button */}
      <button
        className={`phone-mobile-toggle ${mobileOpen ? 'active' : ''}`}
        aria-expanded={mobileOpen}
        aria-controls="portfolio-phone"
        onClick={() => {
          setMobileOpen(!mobileOpen);
          if (mobileOpen) {
            setGamesOpen(false);
            setActiveGame(null);
            setActiveView(null);
            setActiveQR(null);
          }
        }}
        aria-label="Toggle phone"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
        <span>Mobile</span>
      </button>

      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="phone-overlay"
          onClick={() => {
            setMobileOpen(false);
            setGamesOpen(false);
            setActiveGame(null);
            setActiveView(null);
            setActiveQR(null);
          }}
        />
      )}

      {/* Phone sidebar container */}
      <div id="portfolio-phone" className={`phone-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className={`phone-mockup ${activeGame ? 'game-active' : ''}`}>
          <div className="phone-frame">
            {/* Theme video background inside phone */}
            <div className="phone-video-background" aria-hidden="true">
              {phoneVideoSources && (
                <video key={darkMode ? 'night' : 'day'} className={`phone-theme-video active ${darkMode ? 'night-video' : ''}`} autoPlay muted loop playsInline preload="none">
                  <source src={phoneVideoSources.webm} type="video/webm" />
                  <source src={phoneVideoSources.mp4} type="video/mp4" />
                </video>
              )}
              <div className="phone-video-overlay"></div>
            </div>

            {/* Dynamic Island */}
            <div className="phone-dynamic-island">
              <span className="island-camera"></span>

            
            </div>

            {/* Status bar */}
            <div className="phone-status-bar">
              <span className="status-time">{currentTime}</span>
              <div className="status-icons">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
                </svg>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" />
                </svg>
              </div>
            </div>

            {/* Phone screen content */}
            <div className="phone-screen">
              {renderScreenContent()}
            </div>

            {/* Footer text */}
            {/* <div className="phone-footer-text">
              Build With <span className="footer-bolt">⚡</span> Using{' '}
              <span className="footer-heart">💙</span>
            </div> */}

            {/* Home bar */}
            <div className="phone-home-bar">
              <span className="home-bar-line"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Phone;
