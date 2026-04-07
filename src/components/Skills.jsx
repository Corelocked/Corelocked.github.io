import React, { useState } from 'react';
import './Skills.css';
import '../components/Animations.css';
import useScrollReveal from '../hooks/useScrollReveal';
// Import SVGs as React components
import { ReactComponent as FrontendIcon } from '../assets/icons/frontend.svg';
import { ReactComponent as BackendIcon } from '../assets/icons/backend.svg';
import { ReactComponent as MobileIcon } from '../assets/icons/mobile.svg';
import { ReactComponent as ToolsIcon } from '../assets/icons/dev-tools.svg';
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

const icons = {
  frontend: <FrontendIcon />,
  backend: <BackendIcon />,
  mobile: <MobileIcon />,
  tools: <ToolsIcon />,
  javascript: <JavascriptIcon />,
  react: <ReactIcon />,
  html: <HtmlIcon />,
  nodejs: <NodejsIcon />,
  kotlin: <KotlinIcon />,
  flutter: <FlutterIcon />,
  firebase: <FirebaseIcon />,
  sqlite: <SqliteIcon />,
  tailwind: <TailwindIcon />,
  vite: <ViteIcon />,
  css: <CssIcon />,
  express: <ExpressIcon />,
  expo: <ExpoIcon />,
  nextjs: <NextjsIcon />,
  nativewind: <NativeWindIcon />,
  supabase: <SupabaseIcon />,
  eas: <EasIcon />,
};

const skillCategories = [
  {
    id: 'web',
    name: 'Web Development',
    iconKey: 'frontend',
    color: '#61dafb',
    gradient: 'linear-gradient(135deg, #61dafb, #4da7d8)',
    skills: [
      { name: 'JavaScript', iconKey: 'javascript' },
      { name: 'React', iconKey: 'react', featured: true },
      { name: 'Next.js', iconKey: 'nextjs', featured: true },
      { name: 'HTML', iconKey: 'html' },
      { name: 'CSS', iconKey: 'css' },
      { name: 'Tailwind CSS', iconKey: 'tailwind', featured: true },
      { name: 'Vite', iconKey: 'vite' },
    ]
  },
  {
    id: 'mobile',
    name: 'Mobile Development',
    iconKey: 'mobile',
    color: '#02569b',
    gradient: 'linear-gradient(135deg, #02569b, #014578)',
    skills: [
      { name: 'Expo', iconKey: 'expo', featured: true },
      { name: 'NativeWind', iconKey: 'nativewind' },
      { name: 'EAS', iconKey: 'eas', featured: true },
      { name: 'Kotlin', iconKey: 'kotlin' },
      { name: 'Flutter', iconKey: 'flutter' },
    ]
  },
  {
    id: 'services',
    name: 'Backend Services',
    iconKey: 'backend',
    color: '#68a063',
    gradient: 'linear-gradient(135deg, #68a063, #4a7a43)',
    skills: [
      { name: 'NodeJS', iconKey: 'nodejs' },
      { name: 'Express.js', iconKey: 'express' },
      { name: 'Firebase', iconKey: 'firebase', featured: true },
      { name: 'Supabase', iconKey: 'supabase', featured: true },
      { name: 'SQLite', iconKey: 'sqlite' }
    ]
  }
];

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [headerRef, isHeaderVisible] = useScrollReveal({ threshold: 0.2 });
  const [gridRef, isGridVisible] = useScrollReveal({ threshold: 0.1 });

  // Attach category metadata once so chip styles are accurate and stable.
  const categorizedSkills = skillCategories.flatMap((cat) =>
    cat.skills.map((skill) => ({
      ...skill,
      categoryId: cat.id,
      categoryColor: cat.color,
      categoryGradient: cat.gradient,
    }))
  );

  const allSkills = activeCategory === 'all'
    ? categorizedSkills
    : categorizedSkills.filter((skill) => skill.categoryId === activeCategory);

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
            Web & Mobile <span className="gradient-text">Stack</span>
          </h2>
          <p className="section-subtitle">
            I build modern web and mobile apps with this core stack.
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
              {category.name}
            </button>
          ))}
        </div>

        {/* Creative Skills Grid */}
        <div
          ref={gridRef}
          className={`skills-chip-grid ${isGridVisible ? 'visible' : ''}`}
        >
          {allSkills.map((skill, index) => {
            return (
              <div
                key={`${skill.categoryId}-${skill.name}-${index}`}
                className="skill-chip"
                style={{ animationDelay: `${index * 0.04}s` }}
              >
                <div className="chip-icon-container">
                  <div className="chip-icon">
                    {icons[skill.iconKey]}
                  </div>
                </div>
                
                <div className="chip-label">{skill.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
