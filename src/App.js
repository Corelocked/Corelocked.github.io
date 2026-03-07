import React, { useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Certificates from './components/Certificates';
import Projects from './components/Projects';
import AllProjects from './components/AllProjects';
import Contact from './components/Contact';
import Support from './components/Support';
import Footer from './components/Footer';
import Phone from './components/Phone';
import LoadingScreen from './components/LoadingScreen';
/* eslint-disable-next-line import/first */
const StarryBackground = React.lazy(() => import('./components/StarryBackground'));

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Router>
      <ScrollToHash />
      <div className="App">
        {isLoading && <LoadingScreen onFinished={() => setIsLoading(false)} />}

        <Suspense fallback={null}>
          <StarryBackground />
        </Suspense>

        <Phone />

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;

function ScrollToHash() {
  const { hash, pathname } = useLocation();

  React.useEffect(() => {
    if (!hash) return;
    const id = hash.replace('#', '');
    // small delay to allow route to mount
    setTimeout(() => {
      if (id === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }, [hash, pathname]);

  return null;
}