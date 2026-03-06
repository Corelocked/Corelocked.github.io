import React, { useState, Suspense } from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Certificates from './components/Certificates';
import Projects from './components/Projects';
import Resume from './components/Resume';
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
    <div className="App">
      {isLoading && <LoadingScreen onFinished={() => setIsLoading(false)} />}

      <Suspense fallback={null}>
        <StarryBackground />
      </Suspense>

      <Phone />

      <div className="main-content">
        <Header />
        <Hero />
        <About />
        <Skills />
        <Certificates />
        <Projects />
        <Resume />
        <Contact />
        <Support />
        <Footer />
      </div>
    </div>
  );
}

export default App;