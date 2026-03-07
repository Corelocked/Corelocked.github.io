import React, { useState } from 'react';
import './ResumeViewer.css';
import Resume from '../Resume';

/**
 * ResumeViewer - Wrapper component for displaying Resume in phone app context
 * Provides optimized layout and scrolling for mobile viewing
 */
const ResumeViewer = () => {
  const [hasError, setHasError] = useState(false);

  // Error boundary fallback
  if (hasError) {
    return (
      <div className="resume-viewer resume-viewer--error">
        <div className="resume-viewer__error-message">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h3>Unable to load resume</h3>
          <p>Please try refreshing the app</p>
          <button onClick={() => setHasError(false)} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="resume-viewer">
      <div className="resume-viewer__content">
        <Resume />
      </div>
    </div>
  );
};

export default ResumeViewer;
