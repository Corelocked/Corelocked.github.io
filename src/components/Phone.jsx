import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Link } from 'react-scroll';
import emailjs from '@emailjs/browser';
import { useGitHubContributions } from '../hooks/useGitHubContributions';
import ContributionHeatmap from './ContributionHeatmap';
import './Phone.css';

// Assets
import aboutImage from '../assets/images/Hero.png';
import mayaQR from '../assets/images/maya-qr.jpg';

// Import skill SVG icons
import { ReactComponent as FrontendIcon } from '../assets/icons/frontend.svg';
import { ReactComponent as BackendIcon } from '../assets/icons/backend.svg';
import { ReactComponent as MobileIcon } from '../assets/icons/mobile.svg';
import { ReactComponent as CreativeIcon } from '../assets/icons/creative.svg';
import { ReactComponent as ProductivityIcon } from '../assets/icons/productivity.svg';
import { ReactComponent as ToolsIcon } from '../assets/icons/dev-tools.svg';
import { ReactComponent as JavascriptIcon } from '../assets/icons/javascript.svg';
import { ReactComponent as ReactIcon } from '../assets/icons/react.svg';
import { ReactComponent as HtmlIcon } from '../assets/icons/html.svg';
import { ReactComponent as NodejsIcon } from '../assets/icons/node-js.svg';
import { ReactComponent as PythonIcon } from '../assets/icons/python.svg';
import { ReactComponent as LaravelIcon } from '../assets/icons/laravel.svg';
import { ReactComponent as KotlinIcon } from '../assets/icons/kotlin.svg';
import { ReactComponent as JavaIcon } from '../assets/icons/java.svg';
import { ReactComponent as FlutterIcon } from '../assets/icons/flutter.svg';
import { ReactComponent as CanvaIcon } from '../assets/icons/canva.svg';
import { ReactComponent as PhotoshopIcon } from '../assets/icons/photoshop.svg';
import { ReactComponent as PremiereIcon } from '../assets/icons/premiere.svg';
import { ReactComponent as MsofficeIcon } from '../assets/icons/msoffice.svg';
import { ReactComponent as GoogleIcon } from '../assets/icons/google.svg';
import { ReactComponent as PowerbiIcon } from '../assets/icons/powerbi.svg';
import { ReactComponent as GitIcon } from '../assets/icons/github.svg';
import { ReactComponent as FirebaseIcon } from '../assets/icons/firebase.svg';
import { ReactComponent as MongodbIcon } from '../assets/icons/mongodb.svg';
import { ReactComponent as SqliteIcon } from '../assets/icons/sqlite.svg';
import { ReactComponent as JupyterIcon } from '../assets/icons/jupyter.svg';
import { ReactComponent as ColabIcon } from '../assets/icons/colab.svg';

// Lazy load games
const TicTacToe = lazy(() => import('./games/TicTacToe'));
const SnakeGame = lazy(() => import('./games/Snake'));
const TetrisGame = lazy(() => import('./games/Tetris'));
const MinesweeperGame = lazy(() => import('./games/Minesweeper'));
const SudokuGame = lazy(() => import('./games/Sudoku'));

// ===== Data =====

const GAMES = [
  { id: 'tictactoe', name: 'Tic Tac Toe', component: TicTacToe, icon: '⭕' },
  { id: 'snake', name: 'Snake', component: SnakeGame, icon: '🐍' },
  { id: 'tetris', name: 'Tetris', component: TetrisGame, icon: '🧱' },
  { id: 'minesweeper', name: 'Minesweeper', component: MinesweeperGame, icon: '💣' },
  { id: 'sudoku', name: 'Sudoku', component: SudokuGame, icon: '🔢' },
];

// Years for contributions filter (defined elsewhere or unused)

const skillIcons = {
  frontend: <FrontendIcon />, backend: <BackendIcon />, mobile: <MobileIcon />,
  creative: <CreativeIcon />, productivity: <ProductivityIcon />, tools: <ToolsIcon />,
  javascript: <JavascriptIcon />, react: <ReactIcon />, html: <HtmlIcon />,
  nodejs: <NodejsIcon />, python: <PythonIcon />, laravel: <LaravelIcon />,
  kotlin: <KotlinIcon />, java: <JavaIcon />, flutter: <FlutterIcon />,
  canva: <CanvaIcon />, photoshop: <PhotoshopIcon />, premiere: <PremiereIcon />,
  msoffice: <MsofficeIcon />, google: <GoogleIcon />, powerbi: <PowerbiIcon />,
  git: <GitIcon />, firebase: <FirebaseIcon />, mongodb: <MongodbIcon />,
  sqlite: <SqliteIcon />, jupyter: <JupyterIcon />, colab: <ColabIcon />,
};

const SKILL_CATEGORIES = [
  { id: 'frontend', name: 'Frontend', iconKey: 'frontend', skills: [
    { name: 'JavaScript', iconKey: 'javascript' }, { name: 'React', iconKey: 'react' }, { name: 'HTML/CSS', iconKey: 'html' },
  ]},
  { id: 'backend', name: 'Backend', iconKey: 'backend', skills: [
    { name: 'NodeJS', iconKey: 'nodejs' }, { name: 'Python', iconKey: 'python' }, { name: 'Laravel', iconKey: 'laravel' },
  ]},
  { id: 'mobile', name: 'Mobile', iconKey: 'mobile', skills: [
    { name: 'Kotlin', iconKey: 'kotlin' }, { name: 'Java', iconKey: 'java' }, { name: 'Dart/Flutter', iconKey: 'flutter' },
  ]},
  { id: 'creative', name: 'Creative', iconKey: 'creative', skills: [
    { name: 'Canva', iconKey: 'canva' }, { name: 'Photoshop', iconKey: 'photoshop' }, { name: 'Premiere Pro', iconKey: 'premiere' },
  ]},
  { id: 'productivity', name: 'Productivity', iconKey: 'productivity', skills: [
    { name: 'MS Office', iconKey: 'msoffice' }, { name: 'Google Workspace', iconKey: 'google' }, { name: 'Power BI', iconKey: 'powerbi' },
  ]},
  { id: 'tools', name: 'Dev Tools', iconKey: 'tools', skills: [
    { name: 'Git/GitHub', iconKey: 'git' }, { name: 'Firebase', iconKey: 'firebase' },
    { name: 'MongoDB', iconKey: 'mongodb' }, { name: 'SQLite', iconKey: 'sqlite' },
    { name: 'Jupyter', iconKey: 'jupyter' }, { name: 'Google Colab', iconKey: 'colab' },
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
  { id: 10, title: 'DOST Website Redesign', description: 'A redesign of the Department of Science and Technology (DOST) website using Canva.', technologies: ['Canva'], category: ['Creative Design', 'Graphic Design'], canvaLink: 'https://www.canva.com/design/DAG2bUOs0xA/1UyWpP2ibUgTOVAQeM9gRQ/edit', liveDemo: '#', featured: false },
  { id: 11, title: 'Lakbay Logo Design', description: 'A logo design for "Lakbay", our Thesis project about a scenic travel mobile app.', technologies: ['Canva', 'Photoshop'], category: ['Creative Design', 'Graphic Design'], canvaLink: 'https://www.canva.com/design/DAG3DY7iccM/gGWzD2lJDBGp3n9ekzTcMw/edit', liveDemo: '#', featured: false },
  { id: 12, title: 'Lakbay', description: 'A scenic travel mobile app. Created as our Thesis project.', technologies: ['Kotlin', 'Python', 'Firebase'], category: ['Mobile App'], roles: ['Tech Lead', 'Backend'], githubLink: 'https://github.com/Corelocked/Lakbay_Prototype.git', liveDemo: '#', featured: false },
  { id: 13, title: 'BlogShark', description: 'A social media platform for bloggers to share and connect. Made completely from scratch using Laravel and SQLite.', technologies: ['Laravel', 'SQLite', 'JavaScript', 'CSS'], category: ['Website'], roles: ['Tech Lead', 'Backend', 'Frontend'], githubLink: 'https://github.com/Corelocked/dywebFinals.git', liveDemo: 'https://youtu.be/T-8okZkfd_0', featured: true },
  { id: 14, title: 'Delirium', description: 'A Short film I edited using Premiere Pro for my Social Issues class.', technologies: ['Premiere Pro'], category: ['Creative Design', 'Film'], githubLink: '#', liveDemo: 'https://youtu.be/TAJ7gHYPAGI', featured: true },
  { id: 15, title: 'Budget Book', description: 'A personal finance web app to track incomes, expenses, savings, wallets and lendings with CSV export and realtime Firestore sync.', technologies: ['React', 'Vite', 'Firebase', 'JavaScript', 'CSS'], category: ['Website'], roles: ['Frontend', 'Integration', 'DevOps'], githubLink: 'https://github.com/Corelocked/budget-book.git', liveDemo: 'https://budgetbook-5b9c3-de3bd.web.app/#/', featured: true },
];

const PROJECT_CATEGORIES = ['All', 'Website', 'Mobile App', 'Desktop App', 'Game', 'AI/ML', 'Creative Design'];

const SUPPORT_OPTIONS = [
  {
    id: 2, name: 'Ko-fi', emoji: '☕',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z"/>
      </svg>
    ),
    description: 'One-time or monthly support on Ko-fi',
    link: 'https://ko-fi.com/corelocked',
    color: '#FF5E5B',
  },
  {
    id: 3, name: 'PayPal', emoji: '💳',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/>
      </svg>
    ),
    description: 'Direct support via PayPal donation',
    link: 'https://paypal.me/Corelocked',
    color: '#00A0FF',
  },
  {
    id: 4, name: 'Maya', emoji: '📱',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
      </svg>
    ),
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
  const [activeView, setActiveView] = useState(null); // 'about'|'skills'|'projects'|'contact'|'support'
  const [currentTime, setCurrentTime] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

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

  // Contributions state
  const [contribYear, setContribYear] = useState(new Date().getFullYear());
  const { data: contribData, loading: contribLoading, error: contribError } = useGitHubContributions(contribYear);
  const startYear = 2022;
  const years = Array.from({ length: new Date().getFullYear() - startYear + 1 }, (_, i) => startYear + i);
  const [yearMenuOpen, setYearMenuOpen] = useState(false); // State for year dropdown menu
  const yearMenuRef = useRef(null);

  // Dock apps (bottom dock)
  const dockApps = [
    apps.find((a) => a.name === 'GitHub'),
    apps.find((a) => a.name === 'Email'),
    apps.find((a) => a.name === 'Donate'),
    apps.find((a) => a.name === 'Games'),
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
      case 'about':
        return (
          <div className="phone-detail-view">
            {renderBackHeader('About')}
            <div className="pv-content">
              <div className="pv-about-avatar">
                <img src={aboutImage} alt="Cedric Joshua" />
              </div>
              <h3 className="pv-about-name">Cedric Joshua Palapuz</h3>
              <p className="pv-about-role">Full-Stack Developer</p>
              <div className="pv-section-text">
                <p className="pv-lead">
                  I'm a passionate developer with 4+ years of experience building web applications.
                  I specialize in JavaScript technologies including React, Node.js, and Express.
                  I also have experience in mobile app development using Kotlin and a little bit of Flutter.
                </p>
                <p className="pv-sub">
                  I love creating efficient, user-friendly solutions that solve real-world problems.
                  When I'm not coding, I enjoy graphic design and video editing to bring ideas to life visually.
                </p>
              </div>
              <div className="pv-cards">
                <div className="pv-card">
                  <span className="pv-card-emoji">🎓</span>
                  <h4>Education</h4>
                  <p className="pv-card-title">BS in Computer Science</p>
                  <p className="pv-card-sub">CIIT College of Arts and Technology</p>
                  <span className="pv-card-date">2022 - 2026</span>
                </div>
                <div className="pv-card">
                  <span className="pv-card-emoji">💼</span>
                  <h4>Experience</h4>
                  <p className="pv-card-title">Work Immersion Intern</p>
                  <p className="pv-card-sub">Philippine Nuclear Research Institute</p>
                  <span className="pv-card-date">2020</span>
                </div>
              </div>
              <div className="pv-highlights">
                <span className="pv-tag">🎯 Problem Solver</span>
                <span className="pv-tag">💡 Creative Thinker</span>
                <span className="pv-tag">🚀 Fast Learner</span>
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
                <span className="pv-contact-chip">📧 cedricjoshua.palapuz@gmail.com</span>
                <span className="pv-contact-chip">📱 (+63) 999-405-1077</span>
                <span className="pv-contact-chip">📍 Philippines</span>
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
                  <p className="pv-support-thanks">Your support means the world! ❤️</p>
                </>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ===== App Renderer =====

  const renderApp = (app) => {
    if (app.type === 'link') {
      return (
        <a key={app.name} href={app.url} target="_blank" rel="noopener noreferrer" className="phone-app">
          <div className="phone-app-icon" style={{ background: app.bg, color: app.color }}>{app.icon}</div>
          <span className="phone-app-name">{app.name}</span>
        </a>
      );
    }
    if (app.type === 'scroll') {
      return (
        <Link key={app.name} to={app.to} smooth={true} duration={500} offset={-80} className="phone-app" onClick={() => setMobileOpen(false)}>
          <div className="phone-app-icon" style={{ background: app.bg, color: app.color }}>{app.icon}</div>
          <span className="phone-app-name">{app.name}</span>
        </Link>
      );
    }
    if (app.type === 'action') {
      return (
        <button key={app.name} className="phone-app phone-app-btn" onClick={() => handleAppAction(app.action)}>
          <div className="phone-app-icon" style={{ background: app.bg, color: app.color }}>{app.icon}</div>
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
                <span className="game-list-icon">{game.icon}</span>
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
            {/* Stars inside phone */}
            <div className="phone-stars"></div>

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
