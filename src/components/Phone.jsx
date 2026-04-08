import React, { useState, useEffect, useRef, lazy, Suspense, useContext } from 'react';
import { Link } from 'react-scroll';
import emailjs from '@emailjs/browser';
import { useGitHubContributions } from '../hooks/useGitHubContributions';
import ContributionHeatmap from './ContributionHeatmap';
import { ThemeContext } from '../context/ThemeContext';
import './Phone.css';

// Assets
import aboutImage from '../assets/images/Hero.png';
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

const PHONE_PROJECTS = [
  { id: 1, title: 'InnSight', description: 'An interactive web application designed as a virtual assistant tool, allowing users to inquire about hotel and restaurant-related topics through voice or text input.', technologies: ['React', 'Javascript', 'CSS', 'Python', 'HTML'], category: ['Website', 'AI/ML'], roles: ['Tech Lead', 'Backend'], githubLink: 'https://github.com/Corelocked/react-voice-enabled-ordering-system.git', liveDemo: 'https://voice-order-assistant.web.app/', featured: true },
  { id: 2, title: 'unFriendster', description: 'An attempt to create a social media app for my Android App Dev class.', technologies: ['Java', 'Firebase', 'XML'], category: ['Mobile App'], roles: ['Tech Lead', 'Backend', 'Frontend'], githubLink: 'https://github.com/Corelocked/unFriendster2.git', liveDemo: 'https://youtube.com/shorts/c1DHCTcY41w', featured: true },
  { id: 3, title: 'Ang Pagong at ang Kuneho Game', description: 'A recreational game about the story "Ang Pagong at ang Kuneho", a classic Filipino fable that teaches the value of perseverance and humility.', technologies: ['Python'], category: ['Game', 'Desktop App'], roles: ['Tech Lead', 'Backend', 'Frontend'], githubLink: 'https://github.com/Corelocked/Pagong-at-Kuneho.git', liveDemo: 'https://youtu.be/TzjV_CaTXyI', featured: true },
  { id: 4, title: 'Emotion Detector', description: 'A program I made using Python that detects your emotion in real-time using a camera.', technologies: ['Python'], category: ['AI/ML', 'Desktop App'], roles: ['Tech Lead', 'Backend', 'Frontend'], githubLink: 'https://github.com/Corelocked/emotion_detector.git', liveDemo: 'https://youtu.be/GxW6s2Wpxaw', featured: false },
  { id: 5, title: 'Moody', description: 'An interactive web application that tracks your daily mood and provides insights based on your emotional patterns.', technologies: ['Javascript', 'React', 'CSS', 'HTML'], category: ['Website'], roles: ['Tech Lead', 'Backend', 'Frontend'], githubLink: 'https://github.com/Corelocked/moody.git', liveDemo: 'https://youtu.be/L98Uc9FQ8DU', featured: false },
  { id: 7, title: 'Tetris Game', description: 'A simple Tetris game made using Java and CSS.', technologies: ['Java', 'CSS'], category: ['Game', 'Desktop App'], roles: ['Tech Lead', 'Backend', 'Frontend'], githubLink: 'https://github.com/Corelocked/Tetris.git', liveDemo: '#', featured: false },
  { id: 9, title: 'E-Tala', description: 'A mobile inventory app with barcode scanner feature.', technologies: ['Kotlin'], category: ['Mobile App'], roles: ['Tech Lead', 'Backend'], githubLink: 'https://github.com/Corelocked/E-TALA.git', liveDemo: '#', featured: false },
  { id: 12, title: 'Lakbay', description: 'A scenic travel mobile app. Created as our Thesis project.', technologies: ['Kotlin', 'Python', 'Firebase'], category: ['Mobile App'], roles: ['Tech Lead', 'Backend'], githubLink: 'https://github.com/Corelocked/Lakbay_Prototype.git', liveDemo: '#', featured: false },
  { id: 13, title: 'BlogShark', description: 'A social media platform for bloggers to share and connect. Made completely from scratch using Laravel and SQLite.', technologies: ['Laravel', 'SQLite', 'JavaScript', 'CSS'], category: ['Website'], roles: ['Tech Lead', 'Backend', 'Frontend'], githubLink: 'https://github.com/Corelocked/dywebFinals.git', liveDemo: 'https://youtu.be/T-8okZkfd_0', featured: true },
  { id: 15, title: 'Pitaka', description: 'A publicly available personal finance web app for tracking income, expenses, savings, wallets, and lendings with CSV export and realtime Firestore sync.', technologies: ['React', 'Vite', 'Firebase', 'JavaScript', 'CSS'], category: ['Website'], roles: ['Frontend', 'Integration', 'DevOps'], githubLink: 'https://github.com/Corelocked/budget-book.git', liveDemo: 'https://pitaka-sigma.vercel.app/', featured: true },
  { id: 16, title: 'TaskFlow', description: 'A task management web app built to help users organize tasks, track progress, and keep day-to-day workflow moving smoothly.', technologies: ['React', 'JavaScript', 'CSS'], category: ['Website'], roles: ['Frontend', 'Product Design'], githubLink: 'https://github.com/Corelocked/taskflow.git', liveDemo: 'https://taskflow-pied-five.vercel.app/', featured: false },
];

const PROJECT_CATEGORIES = ['All', 'Website', 'Mobile App', 'Desktop App', 'Game', 'AI/ML'];

const BOT_QUICK_QUESTIONS = [
  'Who is Cedric?',
  'What are your top skills?',
  'Which projects are featured?',
  'How can I contact you?',
  'What tools do you use for mobile apps?'
];

const BOT_CONTEXT_SUGGESTIONS = {
  profile: [
    'What are your top skills?',
    'Which projects are featured?',
    'What are you currently focused on?'
  ],
  skills: [
    'Tell me more about your web stack',
    'What tools do you use for mobile apps?',
    'Which skills are strongest for internships?'
  ],
  projects: [
    'Which featured project should I view first?',
    'Tell me more about Pitaka',
    'Tell me more about BlogShark'
  ],
  contact: [
    'Are you open for internships?',
    'What should I include in my message?',
    'Do you prefer email or LinkedIn?'
  ],
  resume: [
    'Which resume fits web development roles?',
    'What is your strongest role right now?',
    'Do you have freelance availability?'
  ],
  smalltalk: [
    'What are your top skills?',
    'Which projects are featured?',
    'How can I contact you?'
  ],
  policy: [
    'Which projects are featured?',
    'What are your top skills?',
    'How can I contact you?'
  ],
  clarify: BOT_QUICK_QUESTIONS
};

const PROFILE_BOT_GREETING = {
  id: 'bot-welcome',
  role: 'bot',
  text:
    'Hi, I am Cedric. Ask me about my skills, projects, experience, and contact details.',
};

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

// EmailJS Config
const EMAILJS_SERVICE_ID = 'service_18woyam';
const EMAILJS_TEMPLATE_ID = 'template_320vcsc';
const EMAILJS_PUBLIC_KEY = 'R9B6dfHNiMoceaxmX';

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

const Phone = () => {
  // Navigation state
  const [gamesOpen, setGamesOpen] = useState(false);
  const [activeGame, setActiveGame] = useState(null);
  const [activeView, setActiveView] = useState(null); // 'about'|'skills'|'projects'|'contact'|'support'|'assistant'
  const [currentTime, setCurrentTime] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [phoneNightVideoSrc, setPhoneNightVideoSrc] = useState(null);
  const [phoneDayVideoSrc, setPhoneDayVideoSrc] = useState(null);

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
  const [chatMessages, setChatMessages] = useState(() => [
    {
      ...PROFILE_BOT_GREETING,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [botContext, setBotContext] = useState({ lastIntent: 'profile', lastTopic: 'intro' });
  const chatEndRef = useRef(null);

  // Swipe state for gesture-based navigation
  const [swipeStart, setSwipeStart] = useState(null);
  const phoneScreenRef = useRef(null);

  // Contributions state
  const [contribYear, setContribYear] = useState(new Date().getFullYear());
  const { data: contribData, loading: contribLoading, error: contribError } = useGitHubContributions(contribYear);
  const startYear = 2022;
  const years = Array.from({ length: new Date().getFullYear() - startYear + 1 }, (_, i) => startYear + i);
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
    let mounted = true;
    import('../assets/images/umbreon.mp4').then((m) => {
      if (mounted) setPhoneNightVideoSrc(m.default || m);
    }).catch(() => {});
    import('../assets/images/spider-gwen.mp4').then((m) => {
      if (mounted) setPhoneDayVideoSrc(m.default || m);
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

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
  }, [chatMessages, activeView]);

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
      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formRef.current, EMAILJS_PUBLIC_KEY);
      setFormStatus({ submitting: false, submitted: true, error: null });
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setFormStatus((prev) => ({ ...prev, submitted: false })), 5000);
    } catch (error) {
      console.error('EmailJS Error:', error);
      setFormStatus({ submitting: false, submitted: false, error: 'Failed to send message. Please try again.' });
    }
  };

  const buildMixedToneReply = ({ professional, casual, technical, prompt }) => {
    return [professional, casual, technical, prompt].filter(Boolean).join(' ');
  };

  const getProfileBotReply = (rawQuestion, context) => {
    const question = rawQuestion.toLowerCase();
    const featuredProjects = PHONE_PROJECTS.filter((project) => project.featured).map((project) => project.title);
    const matchedProject = PHONE_PROJECTS.find((project) => question.includes(project.title.toLowerCase()));
    const isGreeting = /\b(hi|hello|hey|yo|good\s+morning|good\s+afternoon|good\s+evening)\b/.test(question);
    const isThanks = /\b(thanks|thank\s+you|ty|appreciate\s+it)\b/.test(question);
    const asksHowAreYou = /how\s+are\s+you/.test(question);
    const wantsMore = /\b(tell me more|elaborate|more details|expand|what else|can you explain|go deeper|more about that)\b/.test(question);

    const portfolioKeywords = [
      'portfolio', 'project', 'projects', 'skills', 'stack', 'tech', 'technology', 'contact', 'email', 'hire',
      'resume', 'cv', 'experience', 'education', 'work', 'featured', 'react', 'next.js', 'nextjs', 'expo',
      'kotlin', 'firebase', 'supabase', 'laravel', 'blogshark', 'pitaka', 'lakbay', 'innsight', 'taskflow',
      'unfriendster', 'emotion detector', 'tetris', 'e-tala', 'cedric'
    ];

    const privatePersonalKeywords = [
      'age', 'birthday', 'birthdate', 'address', 'home address', 'religion', 'politics', 'political',
      'relationship', 'girlfriend', 'boyfriend', 'wife', 'husband', 'family', 'parents', 'siblings',
      'income', 'salary', 'net worth', 'private life', 'personal life', 'secret', 'password'
    ];

    const isPrivatePersonalQuestion = privatePersonalKeywords.some((keyword) => question.includes(keyword));
    const isPortfolioRelated = portfolioKeywords.some((keyword) => question.includes(keyword)) || Boolean(matchedProject);
    const isGeneralSmallTalk = isGreeting || isThanks || asksHowAreYou;

    if (isPrivatePersonalQuestion || (!isPortfolioRelated && !isGeneralSmallTalk && !wantsMore)) {
      return {
        text: buildMixedToneReply({
          professional: 'I can only answer questions directly related to my portfolio and listed projects.',
          casual: 'I keep things focused on what is publicly shared here.',
          technical: 'That includes my stack, shipped work, contact channels, and role-relevant experience shown in the portfolio.',
          prompt: 'Try asking about my projects, skills, or how to contact me.'
        }),
        intent: 'policy',
        topic: 'scope'
      };
    }

    if (isGreeting) {
      return {
        text: buildMixedToneReply({
          professional: 'Great to connect with you.',
          casual: 'Happy to chat and keep things practical.',
          technical: 'I can walk through my stack, project architecture, and delivery approach.',
          prompt: 'What should we start with?'
        }),
        intent: 'smalltalk',
        topic: 'greeting'
      };
    }

    if (asksHowAreYou) {
      return {
        text: buildMixedToneReply({
          professional: 'I am doing well, thanks for asking.',
          casual: 'I am focused on portfolio work and project quality.',
          technical: 'Lately that means React and Next.js on web, plus Expo and Kotlin on mobile.',
          prompt: 'Want a quick breakdown of my recent projects?'
        }),
        intent: 'smalltalk',
        topic: 'status'
      };
    }

    if (isThanks) {
      return {
        text: buildMixedToneReply({
          professional: 'You are welcome.',
          casual: 'Glad that helped.',
          technical: 'If useful, I can next map my skills directly to internship or freelance role requirements.',
          prompt: ''
        }),
        intent: 'smalltalk',
        topic: 'gratitude'
      };
    }

    if (wantsMore) {
      switch (context.lastIntent) {
        case 'projects':
          return {
            text: buildMixedToneReply({
              professional: 'Here is a deeper project view.',
              casual: 'I prioritize products that feel usable, not just demo-ready.',
              technical: 'My featured work spans Laravel + SQLite, React + Firebase, and cross-platform mobile delivery with Expo and Kotlin.',
              prompt: 'If you want, I can compare two projects side by side.'
            }),
            intent: 'projects',
            topic: 'projects-deeper'
          };
        case 'skills':
          return {
            text: buildMixedToneReply({
              professional: 'Absolutely, here is more depth on my stack.',
              casual: 'I like tools that ship fast but stay maintainable.',
              technical: 'Web: React, Next.js, CSS systems. Mobile: Expo, NativeWind, EAS, Kotlin. Backend integrations: Firebase, Supabase, and lightweight API layers.',
              prompt: 'Want me to tailor this to a specific role like frontend or mobile intern?'
            }),
            intent: 'skills',
            topic: 'skills-deeper'
          };
        case 'contact':
          return {
            text: buildMixedToneReply({
              professional: 'I am open to internships, freelance builds, and collaborations.',
              casual: 'Best way to reach me is still direct and simple.',
              technical: 'Email gives the fastest turnaround for project scope, stack fit, and timeline discussions.',
              prompt: 'You can also message me through the Contact app form here.'
            }),
            intent: 'contact',
            topic: 'contact-deeper'
          };
        default:
          return {
            text: buildMixedToneReply({
              professional: 'Sure, I can expand further.',
              casual: 'Just point me to the topic you care about most.',
              technical: 'I can go deeper on project architecture, stack decisions, or delivery workflow.',
              prompt: ''
            }),
            intent: 'clarify',
            topic: 'needs-topic'
          };
      }
    }

    if (matchedProject) {
      return {
        text: buildMixedToneReply({
          professional: `${matchedProject.title} is one of my key portfolio projects.`,
          casual: 'It is a build I am genuinely proud of.',
          technical: `I developed it with ${matchedProject.technologies.join(', ')} and centered the implementation on ${matchedProject.description.toLowerCase()}`,
          prompt: 'Open the Projects app here if you want links and a full walkthrough.'
        }),
        intent: 'projects',
        topic: matchedProject.title
      };
    }

    if (question.includes('who') || question.includes('about') || question.includes('cedric')) {
      return {
        text: buildMixedToneReply({
          professional: 'I am Cedric Joshua Palapuz, a web and mobile developer focused on practical, production-ready products.',
          casual: 'I like shipping things people can actually use.',
          technical: 'My core stack includes React, Next.js, Expo, Kotlin, Firebase, and Supabase.',
          prompt: ''
        }),
        intent: 'profile',
        topic: 'intro'
      };
    }

    if (question.includes('skill') || question.includes('stack') || question.includes('tech')) {
      return {
        text: buildMixedToneReply({
          professional: 'Here are my strongest skills.',
          casual: 'These are the tools I use the most in real builds.',
          technical: `Top stack items: ${SKILL_CATEGORIES.flatMap((cat) => cat.skills.map((skill) => skill.name)).slice(0, 8).join(', ')}.`,
          prompt: 'I can break this down by frontend, mobile, or backend next.'
        }),
        intent: 'skills',
        topic: 'stack'
      };
    }

    if (question.includes('project') || question.includes('built') || question.includes('work')) {
      return {
        text: buildMixedToneReply({
          professional: `My featured projects include ${featuredProjects.join(', ')}.`,
          casual: 'Each one reflects a different kind of problem-solving style.',
          technical: 'The portfolio covers web, mobile, and full-stack product workflows with deployment-ready implementations.',
          prompt: 'Open the Projects app and I can guide you on which one to review first.'
        }),
        intent: 'projects',
        topic: 'featured'
      };
    }

    if (question.includes('contact') || question.includes('email') || question.includes('hire') || question.includes('reach')) {
      return {
        text: buildMixedToneReply({
          professional: 'You can reach me directly for internships, freelance work, or collaboration.',
          casual: 'I am approachable, so feel free to send a quick message.',
          technical: 'Primary contact: cedricjoshua.palapuz@gmail.com, or phone (+63) 999-405-1077 for direct coordination.',
          prompt: 'You can also use the Contact app form here for structured project details.'
        }),
        intent: 'contact',
        topic: 'reachout'
      };
    }

    if (question.includes('mobile') || question.includes('android') || question.includes('expo') || question.includes('kotlin')) {
      return {
        text: buildMixedToneReply({
          professional: 'My mobile workflow is centered on reliability and rapid iteration.',
          casual: 'I keep the tooling practical so shipping does not get blocked.',
          technical: 'I commonly use Expo, NativeWind, EAS, and Kotlin, with Firebase or Supabase for backend services.',
          prompt: 'If you want, I can map which stack I use for MVP vs production scale.'
        }),
        intent: 'skills',
        topic: 'mobile-stack'
      };
    }

    if (question.includes('resume') || question.includes('cv')) {
      return {
        text: buildMixedToneReply({
          professional: 'I maintain targeted resume versions for different roles.',
          casual: 'So you can check the one that matches what you are hiring for.',
          technical: 'Available tracks: Web Developer, QA, and Data Engineer, each tuned to role-specific skills and project evidence.',
          prompt: 'Open the Resume app in the dock to view them.'
        }),
        intent: 'resume',
        topic: 'resume'
      };
    }

    return {
      text: buildMixedToneReply({
        professional: 'I can definitely help with that.',
        casual: 'Let us narrow it down so I can give you the best answer.',
        technical: 'I can cover stack choices, project architecture, contact options, and role-fit details.',
        prompt: 'Tell me whether you want skills, projects, or availability first.'
      }),
      intent: 'clarify',
      topic: 'unknown'
    };
  };

  const sendChatMessage = (message) => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;
    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmedMessage,
      timestamp,
    };

    const reply = getProfileBotReply(trimmedMessage, botContext);

    const botMessage = {
      id: `bot-${Date.now() + 1}`,
      role: 'bot',
      text: reply.text,
      timestamp,
    };

    setChatMessages((prev) => [...prev, userMessage, botMessage]);
    setBotContext({ lastIntent: reply.intent, lastTopic: reply.topic });
    setChatInput('');
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
  const contextualSuggestions = BOT_CONTEXT_SUGGESTIONS[botContext.lastIntent] || BOT_QUICK_QUESTIONS;

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
              <p className="pv-about-role">Web & Mobile Developer</p>
              <div className="pv-section-text">
                <p className="pv-lead">
                  I'm a web and mobile developer focused on building practical, user-friendly products.
                  I work mainly with React and Next.js for web, plus Expo and Kotlin for mobile.
                  I also use Firebase and Supabase to ship full features quickly.
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
                {formStatus.submitted && (
                  <div className="pv-form-msg success">✅ Message sent! I'll get back to you soon.</div>
                )}
                {formStatus.error && (
                  <div className="pv-form-msg error">❌ {formStatus.error}</div>
                )}
                <div className="pv-form-group">
                  <label>Name <span className="pv-req">*</span></label>
                  <input
                    type="text"
                    name="from_name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={formStatus.submitting}
                  />
                </div>
                <div className="pv-form-group">
                  <label>Email <span className="pv-req">*</span></label>
                  <input
                    type="email"
                    name="from_email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={formStatus.submitting}
                  />
                </div>
                <div className="pv-form-group">
                  <label>Message <span className="pv-req">*</span></label>
                  <textarea
                    name="message"
                    placeholder="Tell me about your project or just say hello..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
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
            {renderBackHeader('Cedric Assistant')}
            <div className="pv-assistant-shell">
              <div className="pv-bot-scroll">
                <div className="pv-bot-messages" role="log" aria-live="polite">
                  {chatMessages.map((message) => (
                    <div key={message.id} className={`pv-bot-row ${message.role === 'user' ? 'user' : 'bot'}`}>
                      <span className={`pv-bot-avatar ${message.role === 'user' ? 'user' : 'bot'}`}>
                        {message.role === 'user' ? 'You' : 'Cedric'}
                      </span>
                      <div className="pv-bot-message-content">
                        <div className={`pv-bot-bubble ${message.role === 'user' ? 'user' : 'bot'}`}>
                          {message.text}
                        </div>
                        <span className="pv-bot-time">{message.timestamp}</span>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              </div>

              <div className="pv-bot-quick-grid">
                {contextualSuggestions.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="pv-bot-quick-btn"
                    onClick={() => sendChatMessage(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <div className="pv-bot-composer-wrap">
                <form
                  className="pv-bot-input-row"
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendChatMessage(chatInput);
                  }}
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onFocus={() => {
                      if (chatEndRef.current) {
                        setTimeout(() => {
                          chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
                        }, 120);
                      }
                    }}
                    placeholder="Ask about skills, projects, or contact info"
                    aria-label="Ask Cedric assistant"
                  />
                  <button type="submit">Send</button>
                </form>
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
                    {years.slice().reverse().map((y) => (
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
      <div className={`phone-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className={`phone-mockup ${activeGame ? 'game-active' : ''}`}>
          <div className="phone-frame">
            {/* Theme video background inside phone */}
            <div className="phone-video-background" aria-hidden="true">
              {phoneNightVideoSrc && (
                <video className={`phone-theme-video night-video ${darkMode ? 'active' : ''}`} autoPlay muted loop playsInline preload="none">
                  <source src={phoneNightVideoSrc} type="video/mp4" />
                </video>
              )}
              {phoneDayVideoSrc && (
                <video className={`phone-theme-video ${!darkMode ? 'active' : ''}`} autoPlay muted loop playsInline preload="none">
                  <source src={phoneDayVideoSrc} type="video/mp4" />
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
