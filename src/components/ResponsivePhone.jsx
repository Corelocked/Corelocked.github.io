import React, { lazy, Suspense, useEffect, useState } from 'react';

const Phone = lazy(() => import('./Phone'));
const desktopQuery = '(min-width: 1025px)';

const isDesktop = () => typeof window !== 'undefined'
  && typeof window.matchMedia === 'function'
  && window.matchMedia(desktopQuery).matches;

const MobileLauncher = ({ onClick }) => (
  <button className="phone-lazy-launcher" type="button" onClick={onClick} aria-label="Open interactive mobile portfolio">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
    <span>Mobile</span>
  </button>
);

const ResponsivePhone = () => {
  const [desktop, setDesktop] = useState(isDesktop);
  const [enabled, setEnabled] = useState(isDesktop);

  useEffect(() => {
    const media = window.matchMedia(desktopQuery);
    const handleChange = ({ matches }) => {
      setDesktop(matches);
      if (matches) setEnabled(true);
    };

    if (media.addEventListener) media.addEventListener('change', handleChange);
    else media.addListener(handleChange);
    return () => {
      if (media.removeEventListener) media.removeEventListener('change', handleChange);
      else media.removeListener(handleChange);
    };
  }, []);

  if (!enabled) return <MobileLauncher onClick={() => setEnabled(true)} />;

  return (
    <Suspense fallback={null}>
      <Phone initiallyOpen={!desktop} />
    </Suspense>
  );
};

export default ResponsivePhone;
