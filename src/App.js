import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Certificates from './components/Certificates';
import Projects from './components/Projects';
import AllProjects from './components/AllProjects';
import ProjectPage from './components/ProjectPage';
import FullProjectView from './components/FullProjectView';
import Contact from './components/Contact';
import Support from './components/Support';
import AuthorProfile from './components/AuthorProfile';
import Footer from './components/Footer';
import ResponsivePhone from './components/ResponsivePhone';
import SeoManager from './components/SeoManager';
/* eslint-disable-next-line import/first */
const StarryBackground = React.lazy(() => import('./components/StarryBackground'));

function App() {
  return (
    <Router>
      <ScrollToHash />
      <AppContent />
    </Router>
  );
}

export function AppContent() {
  const { pathname } = useLocation();
  // Treat /projects/:slug and /projects/:slug/view as full-project views (hide app chrome)
  const isFullProjectView = /^\/projects\/[^/]+(?:\/view)?$/.test(pathname);

  return (
    <div className="App">
      <SeoManager />

      {!isFullProjectView && (
        <Suspense fallback={null}>
          <StarryBackground />
        </Suspense>
      )}

      {!isFullProjectView && <ResponsivePhone />}

      <Routes>
        {/* Home Route */}
        <Route path="/" element={
          <div className="main-content">
            <Header />
            <Hero />
            <About />
            <Projects />
            <Skills />
            <Certificates />
            <Footer />
          </div>
        } />
        
        {/* All Projects Route */}
        <Route path="/projects" element={
          <div className="main-content">
            <Header />
            <AllProjects />
          </div>
        } />

        {/* Fullscreen project demo (no header or global chrome) at /projects/:slug */}
        <Route path="/projects/:slug" element={
          <FullProjectView />
        } />

        {/* Per-project details (with header) moved to /projects/:slug/info */}
        <Route path="/projects/:slug/info" element={
          <div className="main-content">
            <Header />
            <ProjectPage />
          </div>
        } />

        {/* keep explicit /view route for backwards-compat */}
        <Route path="/projects/:slug/view" element={
          <FullProjectView />
        } />

        {/* Contact Route */}
        <Route path="/contact" element={
          <div className="main-content">
            <Header />
            <Contact />
          </div>
        } />

        {/* Support Route */}
        <Route path="/support" element={
          <div className="main-content">
            <Header />
            <Support />
          </div>
        } />

        {/* Name SEO Route */}
        <Route path="/cedric-joshua-palapuz" element={
          <div className="main-content">
            <Header />
            <AuthorProfile />
            <Footer />
          </div>
        } />

        <Route path="*" element={
          <div className="main-content">
            <Header />
            <main className="not-found">
              <p className="section-label">404</p>
              <h1>Page not found</h1>
              <p>The page you requested does not exist.</p>
            </main>
          </div>
        } />
      </Routes>
    </div>
  );
}

export default App;

function ScrollToHash() {
  const { hash, pathname } = useLocation();

  React.useEffect(() => {
    // small delay to allow route to mount
    const timer = setTimeout(() => {
      if (hash) {
        const id = hash.replace('#', '');
        if (id === 'home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }

      // No hash (regular route change) — ensure page starts at top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);

    return () => clearTimeout(timer);
  }, [hash, pathname]);

  return null;
}
