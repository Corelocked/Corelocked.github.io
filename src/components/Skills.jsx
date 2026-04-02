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
import { ReactComponent as TailwindIcon } from '../assets/icons/tailwind.svg';
import { ReactComponent as ViteIcon } from '../assets/icons/vite.svg';
import { ReactComponent as PhpIcon } from '../assets/icons/php.svg';
import { ReactComponent as CssIcon } from '../assets/icons/css.svg';
import { ReactComponent as ExpressIcon } from '../assets/icons/express.svg';
import { ReactComponent as CsharpIcon } from '../assets/icons/csharp.svg';
import { ReactComponent as VercelIcon } from '../assets/icons/vercel.svg';
import { ReactComponent as ExpoIcon } from '../assets/icons/expo.svg';
import { ReactComponent as NextjsIcon } from '../assets/icons/nextjs.svg';
import { ReactComponent as NativeWindIcon } from '../assets/icons/nativewind.svg';
import { ReactComponent as SupabaseIcon } from '../assets/icons/supabase.svg';
import { ReactComponent as EasIcon } from '../assets/icons/eas.svg';

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
  tailwind: <TailwindIcon />,
  vite: <ViteIcon />,
  php: <PhpIcon />,
  css: <CssIcon />,
  express: <ExpressIcon />,
  csharp: <CsharpIcon />,
  vercel: <VercelIcon />,
  expo: <ExpoIcon />,
  nextjs: <NextjsIcon />,
  nativewind: <NativeWindIcon />,
  supabase: <SupabaseIcon />,
  eas: <EasIcon />,
};

const skillCategories = [
  {
    id: 'languages',
    name: 'Programming Languages',
    iconKey: 'frontend',
    color: '#f7df1e',
    gradient: 'linear-gradient(135deg, #f7df1e, #ffa000)',
    skills: [
      { name: 'JavaScript', iconKey: 'javascript' },
      { name: 'Python', iconKey: 'python', featured: false },
      { name: 'PHP', iconKey: 'php' },
      { name: 'C#', iconKey: 'csharp' },
      { name: 'Kotlin', iconKey: 'kotlin' },
      { name: 'Java', iconKey: 'java' },
    ]
  },
  {
    id: 'frontend',
    name: 'Frontend & UI',
    iconKey: 'frontend',
    color: '#61dafb',
    gradient: 'linear-gradient(135deg, #61dafb, #4da7d8)',
    skills: [
      { name: 'React', iconKey: 'react', featured: true },
      { name: 'Next.js', iconKey: 'nextjs', featured: true },
      { name: 'HTML', iconKey: 'html' },
      { name: 'CSS', iconKey: 'css' },
      { name: 'Tailwind CSS', iconKey: 'tailwind', featured: true },
      { name: 'NativeWind', iconKey: 'nativewind', featured: true },
    ]
  },
  {
    id: 'backend',
    name: 'Backend & APIs',
    iconKey: 'backend',
    color: '#68a063',
    gradient: 'linear-gradient(135deg, #68a063, #4a7a43)',
    skills: [
      { name: 'NodeJS', iconKey: 'nodejs' },
      { name: 'Express.js', iconKey: 'express' },
      { name: 'Laravel', iconKey: 'laravel' },
    ]
  },
  {
    id: 'database',
    name: 'Databases & Backend Services',
    iconKey: 'backend',
    color: '#ff6f00',
    gradient: 'linear-gradient(135deg, #ff6f00, #c43e00)',
    skills: [
      { name: 'Firebase', iconKey: 'firebase', featured: true },
      { name: 'Supabase', iconKey: 'supabase', featured: true },
      { name: 'MongoDB', iconKey: 'mongodb' },
      { name: 'SQLite', iconKey: 'sqlite' },
    ]
  },
  {
    id: 'devtools',
    name: 'Dev Tools & Deployment',
    iconKey: 'tools',
    color: '#6cc644',
    gradient: 'linear-gradient(135deg, #6cc644, #4a9134)',
    skills: [
      { name: 'Git/GitHub', iconKey: 'git', featured: true },
      { name: 'Vite', iconKey: 'vite' },
      { name: 'Vercel', iconKey: 'vercel', featured: true },
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
      { name: 'Flutter', iconKey: 'flutter' },
      { name: 'EAS', iconKey: 'eas', featured: true },
    ]
  },
  {
    id: 'data',
    name: 'Data & Analytics',
    iconKey: 'tools',
    color: '#f37726',
    gradient: 'linear-gradient(135deg, #f37726, #d35813)',
    skills: [
      { name: 'Jupyter', iconKey: 'jupyter' },
      { name: 'Google Colab', iconKey: 'colab' },
      { name: 'Power BI', iconKey: 'powerbi' },
    ]
  },
  {
    id: 'design',
    name: 'Creative Tools',
    iconKey: 'creative',
    color: '#00c4cc',
    gradient: 'linear-gradient(135deg, #00c4cc, #0097a7)',
    skills: [
      { name: 'Canva', iconKey: 'canva' },
      { name: 'Photoshop', iconKey: 'photoshop' },
      { name: 'Premiere Pro', iconKey: 'premiere' },
    ]
  },
  {
    id: 'productivity',
    name: 'Productivity Tools',
    iconKey: 'productivity',
    color: '#d83b01',
    gradient: 'linear-gradient(135deg, #d83b01, #a92c00)',
    skills: [
      { name: 'MS Office', iconKey: 'msoffice' },
      { name: 'Google Workspace', iconKey: 'google' },
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

  const activeCategoryData = skillCategories.find((cat) => cat.id === activeCategory);

  const allSkills = activeCategory === 'all'
    ? categorizedSkills
    : categorizedSkills.filter((skill) => skill.categoryId === activeCategoryData?.id);

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

        {/* Creative Skills Grid */}
        <div
          ref={gridRef}
          className={`skills-chip-grid ${isGridVisible ? 'visible' : ''}`}
        >
          {allSkills.map((skill, index) => {
            return (
              <div
                key={skill.iconKey}
                className={`skill-chip ${skill.featured ? 'featured' : ''}`}
                style={{ 
                  animationDelay: `${index * 0.05}s`,
                  '--category-color': skill.categoryColor || '#4fc3f7',
                  '--category-gradient': skill.categoryGradient || 'linear-gradient(135deg, #4fc3f7, #7c4dff)'
                }}
              >
                <div className="skill-chip-bg"></div>
                <div className="skill-chip-glow"></div>
                
                <div className="chip-icon-container">
                  <div className="chip-icon">
                    {icons[skill.iconKey]}
                  </div>
                </div>
                
                <div className="chip-label">{skill.name}</div>
                
                {skill.featured && (
                  <div className="featured-indicator">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
