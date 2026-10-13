import React, { lazy, Suspense, useState } from 'react';
import { Link } from 'react-router-dom';
import { projects, categories } from '../../data/projects';
import { certificateDetails } from '../../data/certificates';
import { destinationPath, destinations } from './destinations';
import award from '../../assets/images/inabel-awards-2026-innsight.jpg';
import csharp from '../../assets/images/certificates/dometrain-csharp-certificate.jpg';
import powerbi from '../../assets/images/certificates/simplilearn-powerbi-certificate.jpg';
import blogsharkFeature from '../../assets/images/blogshark-featured.webm';
import portrait from '../../assets/images/Hero-512.png';
import { WORK_ENTRIES, EDUCATION_ENTRIES, CURRENT_STACK } from '../About';
import { skillCategories, icons } from '../Skills';
import GitHubShowcase from './GitHubShowcase';

const Resume = lazy(() => import('../Resume'));
const Contact = lazy(() => import('../Contact'));
const Support = lazy(() => import('../Support'));
const VoxelArcade = lazy(() => import('./VoxelArcade'));
const ProjectPage = lazy(() => import('../ProjectPage'));

const pixelPaths = {
  cabin: 'M3 10h2V8h2V6h2V4h6v2h2v2h2v2h2v2h-2v9h-5v-6h-4v6H5v-9H3z',
  workshop: 'M3 5h18v4h-2v10h-5v-6h-4v6H5V9H3zm4 2v2h2V7zm8 0v2h2V7z',
  trophy: 'M7 3h10v3h4v6h-4v3h-3v4h4v3H6v-3h4v-4H7v-3H3V6h4zm-2 5v2h2V8zm12 0v2h2V8z',
  pickaxe: 'M4 3h12v2h3v3h2v5h-3V9h-3V7h-2v3h-2v3H9v3H7v3H5v3H2v-5h2v-3h2v-3h2V8h2V6H4z',
  book: 'M3 3h8v2h2V3h8v17h-8v2h-2v-2H3zm3 3v11h4V6zm8 0v11h4V6z',
  mail: 'M2 5h20v14H2zm3 3v2h2v2h3v2h4v-2h3v-2h2V8h-3v2h-3v2h-2v-2H8V8z',
  game: 'M5 5h14v3h3v12h-6v-3H8v3H2V8h3zm1 4v2H4v2h2v2h2v-2h2v-2H8V9zm9 1v3h3v-3z',
  compass: 'M8 2h8v2h4v4h2v8h-2v4h-4v2H8v-2H4v-4H2V8h2V4h4zm1 5v10l7-10zm2 4v3l2-3z',
};

export function PixelIcon({ name, className = '' }) {
  return <svg className={`pixel-icon ${className}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={pixelPaths[name] || pixelPaths.cabin} fillRule="evenodd" /></svg>;
}

function BuilderStory() {
  return <div className="world-collection">
    <h1>About me.</h1>
    <div className="world-profile"><img src={portrait} alt="Cedric Joshua Palapuz" /><div><h2>Cedric Joshua Palapuz</h2><p className="world-profile-role">Web developer · Philippines</p><p>I’m a Computer Science student and full-stack web developer. I build responsive interfaces, reliable backend services, and practical applications—from finance dashboards and route engines to AI assistants and Shopify storefronts.</p><p>I work across Firebase and Supabase depending on the product. I care about maintainable code, thoughtful products, and solving real problems through technology.</p><Link className="world-text-link" to="/contact">Let’s talk ↗</Link></div></div>
    <div className="world-current-stack"><h2>Currently using</h2><div>{CURRENT_STACK.map(skill => <span key={skill.name}>{skill.icon}{skill.name}</span>)}</div></div>
    <h2 className="world-subheading">The journey so far</h2>
    <div className="world-career-timeline">{[...WORK_ENTRIES,...EDUCATION_ENTRIES].map(entry => <article key={entry.id}><div className="world-career-date">{entry.date}</div><div className="world-career-entry"><div className="world-career-heading"><img src={entry.logo} alt="" loading="lazy" /><div><h3>{entry.org}</h3><p>{entry.role}</p></div></div><ul>{entry.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul><div className="world-tags">{entry.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div></article>)}</div>
  </div>;
}

function CraftingTools() {
  return <div className="world-collection"><h1>What I use.</h1><div className="world-tool-groups">{skillCategories.map((category,i) => <article key={category.id}><div className="world-tool-heading"><span>0{i+1}</span><h2>{category.name}</h2></div><div className="world-tool-inventory">{category.skills.map(skill => <div key={skill.name}><span>{icons[skill.iconKey]}</span><strong>{skill.name}</strong></div>)}</div></article>)}</div><Link className="world-text-link" to="/projects">See these tools in action ↗</Link></div>;
}

function ProjectCollection() {
  const [filter, setFilter] = useState('All');
  const [featured, setFeatured] = useState(false);
  const visible = projects.filter(project => (!featured || project.featured) && (filter === 'All' || project.category.includes(filter)));
  return <div className="world-collection">
    
    <h1>My work.</h1>
    <p className="world-panel-intro">Here’s what I’ve been working on.</p>
    <div className="world-project-filters" aria-label="Filter projects">
      {categories.filter(category => category !== 'Top Picks').map(category => <button key={category} className={filter === category ? 'selected' : ''} onClick={() => setFilter(category)} aria-pressed={filter === category}>{category}</button>)}
      <button className={featured ? 'selected' : ''} onClick={() => setFeatured(!featured)} aria-pressed={featured}>★ Featured</button>
    </div>
    <p className="world-result-count" aria-live="polite">{visible.length} projects</p>
    <div className="world-project-grid">
      {visible.map(project => <Link className="world-project-card" to={`/projects/${project.slug}/info`} key={project.id}>
        <div className="world-project-image"><img src={project.image} alt="" loading="lazy" />{project.featured && <span>FEATURED</span>}</div>
        <div className="world-project-copy"><small>{project.eyebrow || project.category[0]} <span>{project.year}</span></small><h2>{project.title} <span aria-hidden="true">↗</span></h2><p>{project.tagline || project.description}</p><div className="world-tags">{project.technologies.map(tech => <span key={tech}>{tech}</span>)}</div></div>
      </Link>)}
    </div>
    {!visible.length && <p className="world-empty">Nothing here with these filters. Try another category or turn off Featured.</p>}
  </div>;
}

function AchievementWall() {
  const images = { inabel: award, csharp, powerbi };
  return <div className="world-collection">
    <h1>A few things I’m proud of.</h1>

    <div className="world-awards">
      {certificateDetails.map(certificate => <article className={`world-award ${certificate.type === 'achievement' ? 'world-award-featured' : ''}`} key={certificate.image}>
        <a href={images[certificate.image]} target="_blank" rel="noreferrer" aria-label={`View full image: ${certificate.title}`}><img src={images[certificate.image]} alt={certificate.alt} loading="lazy" /></a>
        <div>{certificate.badge && <span className="world-award-badge">★ {certificate.badge}</span>}<h2>{certificate.title}</h2><p>{certificate.description}</p>{certificate.project && <Link to="/projects/innsight/info" className="world-text-link">Explore InnSight ↗</Link>}</div>
      </article>)}
      <article className="world-award"><video src={blogsharkFeature} controls preload="none" playsInline aria-label="BlogShark featured post" /><div><span className="world-award-badge">FEATURED WORK</span><h2>BlogShark on CIIT social media</h2><p>A full-stack blogging platform, built from scratch and featured by CIIT.</p><Link to="/projects/blogshark/info" className="world-text-link">Explore BlogShark ↗</Link></div></article>
    </div>
  </div>;
}

export default function WorldPanels({ section, onTravel, lightingMode, onLightingMode, clock, contributions, year, onYear }) {
  if (section === 'inventory') return <div className="world-collection world-inventory">
    <h1>Inventory</h1>
    <div className="world-lighting-settings"><div><h2>Day & night</h2><p>Auto follows your local time.</p></div><div className="world-lighting-switch" role="group" aria-label="World lighting">{['auto','day','night'].map(mode=><button key={mode} onClick={()=>onLightingMode(mode)} aria-pressed={lightingMode===mode}><span aria-hidden="true">{mode==='auto'?'◷':mode==='day'?'☀':'☾'}</span>{mode[0].toUpperCase()+mode.slice(1)}</button>)}</div><p className="world-local-time">LOCAL TIME · {clock.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</p></div>
    <h2 className="world-subheading">Portfolio</h2><div className="world-inventory-slots">{destinations.map((place,index)=><Link key={place.id} to={destinationPath(place.id)}><small>{index+1}</small><PixelIcon name={place.icon} /><strong>{place.label}</strong></Link>)}</div>
  </div>;
  if (section === 'guide') return <div className="world-collection">
    <h1>Get to know me.</h1>

    <div className="world-guide-grid">{destinations.map(destination => <article className="world-guide-entry" key={destination.id}>
      <div className="world-guide-icon" style={{ color: destination.color }}><PixelIcon name={destination.icon} /></div>
      <div className="world-guide-copy"><h2>{destination.name}</h2><p>{destination.description}</p><div className="world-guide-actions"><Link to={destinationPath(destination.id)}>Open {destination.label.split(' &')[0]} ↗</Link><button onClick={() => onTravel(destination.id)}>Go there</button></div></div>
    </article>)}</div>
    <div className="world-guide-footer"><Link to="/support">Support my work ↗</Link><a href="https://github.com/Corelocked" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/cedric-joshua-palapuz-85645524a/" target="_blank" rel="noreferrer">LinkedIn ↗</a></div>
  </div>;
  return <Suspense fallback={<p className="world-loading" role="status">Loading…</p>}>
    {section === 'projects' ? <ProjectCollection />
      : section === 'certificates' ? <AchievementWall />
      : section === 'about' ? <BuilderStory />
      : section === 'skills' ? <CraftingTools />
      : section === 'resume' ? <Resume />
      : section === 'contact' ? <><Contact /><p className="world-contact-support"><Link to="/support">Support my work ↗</Link></p></>
      : section === 'support' ? <Support />
      : section === 'arcade' ? <VoxelArcade />
      : section === 'github' ? <GitHubShowcase contributions={contributions} year={year} onYear={onYear} />
      : section === 'project' ? <ProjectPage />
      : <div className="world-collection"><h1>Page not found</h1><p>This page isn’t available.</p><Link className="world-button" to="/#guide">Browse portfolio</Link></div>}
  </Suspense>;
}
