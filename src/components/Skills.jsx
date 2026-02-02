import React, { useState, useContext } from 'react';
import './Skills.css';
import '../components/Animations.css';
import useScrollReveal from '../hooks/useScrollReveal';
import { ThemeContext } from '../context/ThemeContext';
import umbreonVideo from '../assets/images/umbreon.mp4';
import spiderGwenVideo from '../assets/images/spider-gwen.mp4';
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
      { name: 'JavaScript', level: 80, iconKey: 'javascript' },
      { name: 'React', level: 90, iconKey: 'react' },
      { name: 'HTML/CSS', level: 80, iconKey: 'html' },
    ]
  },
  {
    id: 'backend',
    name: 'Backend',
    iconKey: 'backend',
    skills: [
      { name: 'NodeJS', level: 90, iconKey: 'nodejs' },
      { name: 'Python', level: 75, iconKey: 'python' },
      { name: 'Laravel', level: 85, iconKey: 'laravel' },
    ]
  },
  {
    id: 'mobile',
    name: 'Mobile',
    iconKey: 'mobile',
    skills: [
      { name: 'Kotlin', level: 90, iconKey: 'kotlin' },
      { name: 'Java', level: 50, iconKey: 'java' },
      { name: 'Dart/Flutter', level: 50, iconKey: 'flutter' },
    ]
  },
  {
    id: 'creative',
    name: 'Creative',
    iconKey: 'creative',
    skills: [
      { name: 'Canva', level: 95, iconKey: 'canva' },
      { name: 'Photoshop', level: 70, iconKey: 'photoshop' },
      { name: 'Premiere Pro', level: 80, iconKey: 'premiere' },
    ]
  },
  {
    id: 'productivity',
    name: 'Productivity',
    iconKey: 'productivity',
    skills: [
      { name: 'MS Office', level: 95, iconKey: 'msoffice' },
      { name: 'Google Workspace', level: 95, iconKey: 'google' },
      { name: 'Power BI', level: 85, iconKey: 'powerbi' },
    ]
  },
  {
    id: 'tools',
    name: 'Dev Tools',
    iconKey: 'tools',
    skills: [
      { name: 'Git/GitHub', level: 90, iconKey: 'git' },
      { name: 'Firebase', level: 90, iconKey: 'firebase' },
      { name: 'MongoDB', level: 75, iconKey: 'mongodb' },
      { name: 'SQLite', level: 75, iconKey: 'sqlite' },
      { name: 'Jupyter Notebook', level: 80, iconKey: 'jupyter' },
      { name: 'Google Colab', level: 90, iconKey: 'colab' },
    ]
  }
];

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [headerRef, isHeaderVisible] = useScrollReveal({ threshold: 0.2 });
  const [tabsRef, isTabsVisible] = useScrollReveal({ threshold: 0.3 });
  const [gridRef, isGridVisible] = useScrollReveal({ threshold: 0.1 });
  const { darkMode } = useContext(ThemeContext);

  const displayedCategories = activeCategory === 'all' 
    ? skillCategories 
    : skillCategories.filter(cat => cat.id === activeCategory);

  return (
    <section id="skills" className="skills">
      {/* Video Background */}
      <div className="video-background">
        <video 
          className={`theme-video ${darkMode ? 'active' : ''}`}
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source src={umbreonVideo} type="video/mp4" />
        </video>
        <video 
          className={`theme-video ${!darkMode ? 'active' : ''}`}
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source src={spiderGwenVideo} type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
      </div>
      {/* Background decoration */}
      <div className="skills-bg-decoration"></div>
      <div className="skills-bg-decoration-2"></div>

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
        <div 
          ref={tabsRef}
          className={`skills-tabs scroll-reveal fade-up ${isTabsVisible ? 'visible' : ''}`}
        >
          <button 
            className={`tab-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All Skills
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

        {/* Skills Grid */}
        <div 
          ref={gridRef}
          className={`skills-categories ${isGridVisible ? 'visible' : ''}`}
        >
          {displayedCategories.map((category, catIndex) => (
            <div key={category.id} className="skill-category">
              <div className="category-header">
                <span className="category-icon">{icons[category.iconKey]}</span>
                <h3 className="category-title">{category.name}</h3>
              </div>
              <div className="skills-grid">
                {category.skills.map((skill, index) => (
                  <div 
                    key={index} 
                    className="skill-card"
                    style={{ animationDelay: `${(catIndex * 3 + index) * 0.1}s` }}
                  >
                    <div className="skill-header">
                      <span className="skill-icon">{icons[skill.iconKey]}</span>
                      <div className="skill-info">
                        <h4 className="skill-name">{skill.name}</h4>
                        <span className="skill-level">{skill.level}%</span>
                      </div>
                    </div>
                    <div className="skill-bar">
                      <div 
                        className="skill-progress" 
                        style={{ 
                          width: isGridVisible ? `${skill.level}%` : '0%',
                          transitionDelay: `${(catIndex * 3 + index) * 0.1}s`
                        }}
                      >
                        <span className="progress-glow"></span>
                      </div>
                    </div>
                    <div className="skill-label">
                      <span>{skill.level >= 90 ? 'Confident' : skill.level >= 70 ? 'Average' : skill.level >= 50 ? 'Intermediate' : 'Learning'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;