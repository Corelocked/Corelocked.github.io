import React, { useState } from 'react';
import './Skills.css';
import '../components/Animations.css';
import useScrollReveal from '../hooks/useScrollReveal';
// Import SVGs as React components
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

const icons = {
  frontend: <FrontendIcon />,
  backend: <BackendIcon />,
  mobile: <MobileIcon />,
  creative: <CreativeIcon />,
  productivity: <ProductivityIcon />,
  tools: <ToolsIcon />,
  javascript: <JavascriptIcon />,
  react: <ReactIcon />,
  html: <HtmlIcon />,
  nodejs: <NodejsIcon />,
  python: <PythonIcon />,
  laravel: <LaravelIcon />,
  kotlin: <KotlinIcon />,
  java: <JavaIcon />,
  flutter: <FlutterIcon />,
  canva: <CanvaIcon />,
  photoshop: <PhotoshopIcon />,
  premiere: <PremiereIcon />,
  msoffice: <MsofficeIcon />,
  google: <GoogleIcon />,
  powerbi: <PowerbiIcon />,
  git: <GitIcon />,
  firebase: <FirebaseIcon />,
  mongodb: <MongodbIcon />,
  sqlite: <SqliteIcon />,
  jupyter: <JupyterIcon />,
  colab: <ColabIcon />,
};

const skillCategories = [
  {
    id: 'frontend',
    name: 'Frontend',
    iconKey: 'frontend',
    skills: [
      { name: 'JavaScript', iconKey: 'javascript' },
      { name: 'React', iconKey: 'react' },
      { name: 'HTML/CSS', iconKey: 'html' },
    ]
  },
  {
    id: 'backend',
    name: 'Backend',
    iconKey: 'backend',
    skills: [
      { name: 'NodeJS', iconKey: 'nodejs' },
      { name: 'Python', iconKey: 'python' },
      { name: 'Laravel', iconKey: 'laravel' },
    ]
  },
  {
    id: 'mobile',
    name: 'Mobile',
    iconKey: 'mobile',
    skills: [
      { name: 'Kotlin', iconKey: 'kotlin' },
      { name: 'Java', iconKey: 'java' },
      { name: 'Dart/Flutter', iconKey: 'flutter' },
    ]
  },
  {
    id: 'creative',
    name: 'Creative',
    iconKey: 'creative',
    skills: [
      { name: 'Canva', iconKey: 'canva' },
      { name: 'Photoshop', iconKey: 'photoshop' },
      { name: 'Premiere Pro', iconKey: 'premiere' },
    ]
  },
  {
    id: 'productivity',
    name: 'Productivity',
    iconKey: 'productivity',
    skills: [
      { name: 'MS Office', iconKey: 'msoffice' },
      { name: 'Google Workspace', iconKey: 'google' },
      { name: 'Power BI', iconKey: 'powerbi' },
    ]
  },
  {
    id: 'tools',
    name: 'Dev Tools',
    iconKey: 'tools',
    skills: [
      { name: 'Git/GitHub', iconKey: 'git' },
      { name: 'Firebase', iconKey: 'firebase' },
      { name: 'MongoDB', iconKey: 'mongodb' },
      { name: 'SQLite', iconKey: 'sqlite' },
      { name: 'Jupyter', iconKey: 'jupyter' },
      { name: 'Google Colab', iconKey: 'colab' },
    ]
  }
];

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [headerRef, isHeaderVisible] = useScrollReveal({ threshold: 0.2 });
  const [gridRef, isGridVisible] = useScrollReveal({ threshold: 0.1 });

  /* Flatten all skills when "All" is selected, otherwise show filtered */
  const allSkills = activeCategory === 'all'
    ? skillCategories.flatMap(cat => cat.skills)
    : skillCategories.find(cat => cat.id === activeCategory)?.skills || [];

  return (
    <section id="skills" className="skills">
      <div className="container">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={`skills-header scroll-reveal fade-up ${isHeaderVisible ? 'visible' : ''}`}
        >
          <span className="section-label">
            <span className="label-icon">{icons.tools}</span>
            Expertise
          </span>
          <h2 className="section-title">
            Skills & <span className="gradient-text">Technologies</span>
          </h2>
          <p className="section-subtitle">
            Technologies and tools I use to bring ideas to life
          </p>
        </div>

        {/* Category Tabs */}
        <div className="skills-tabs">
          <button
            className={`tab-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All
          </button>
          {skillCategories.map((category) => (
            <button
              key={category.id}
              className={`tab-btn ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              <span className="tab-icon">{icons[category.iconKey]}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Skills Chip Grid */}
        <div
          ref={gridRef}
          className={`skills-chip-grid ${isGridVisible ? 'visible' : ''}`}
        >
          {allSkills.map((skill, index) => (
            <div
              key={skill.iconKey}
              className="skill-chip"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <span className="chip-icon">{icons[skill.iconKey]}</span>
              <span className="chip-label">{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;