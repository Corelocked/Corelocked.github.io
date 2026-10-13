import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SeoManager from './components/SeoManager';
import WorldPortfolio from './components/world/WorldPortfolio';

const FullProjectView = lazy(() => import('./components/FullProjectView'));

export function AppContent() {
  return <div className="App">
    <SeoManager />
    <Suspense fallback={<p className="world-loading" role="status">Opening project…</p>}>
      <Routes>
        <Route path="/projects/:slug/view" element={<FullProjectView />} />
        <Route path="/projects/:slug/info" element={<WorldPortfolio />} />
        <Route path="/projects/:slug" element={<FullProjectView />} />
        <Route path="*" element={<WorldPortfolio />} />
      </Routes>
    </Suspense>
  </div>;
}

export default function App() {
  return <Router><AppContent /></Router>;
}
