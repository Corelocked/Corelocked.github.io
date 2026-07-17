import React, { useEffect, useRef, useState, useCallback } from 'react';
import './Certificates.css';
import '../components/Animations.css';
import useScrollReveal from '../hooks/useScrollReveal';
import useModalFocus from '../hooks/useModalFocus';
import { certificateDetails } from '../data/certificates';

import cert1 from '../assets/images/certificates/dometrain-csharp-certificate.jpg';
import cert2 from '../assets/images/certificates/simplilearn-powerbi-certificate.jpg';
import inabelAward from '../assets/images/inabel-awards-2026-innsight.jpg';

const certificateImages = { inabel: inabelAward, csharp: cert1, powerbi: cert2 };
const certificates = certificateDetails.map((certificate) => ({ ...certificate, src: certificateImages[certificate.image] }));

const Certificates = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState('next');
  const [isPaused, setIsPaused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const modalRef = useModalFocus(isModalOpen);
  const lightboxRef = useModalFocus(lightboxIdx !== null);
  const autoplayRef = useRef(null);
  const progressRef = useRef(null);

  const [headerRef, isHeaderVisible] = useScrollReveal({ threshold: 0.2 });
  const [carouselRef, isCarouselVisible] = useScrollReveal({ threshold: 0.15 });

  /* ---------- autoplay ---------- */
  useEffect(() => {
    autoplayRef.current = () => {
      setDirection('next');
      setIndex((prev) => (prev + 1) % certificates.length);
    };
  });

  useEffect(() => {
    if (isPaused || isModalOpen) return;
    // restart CSS progress-bar animation
    if (progressRef.current) {
      progressRef.current.style.animation = 'none';
      // eslint-disable-next-line no-void
      void progressRef.current.offsetWidth;
      progressRef.current.style.animation = '';
    }
    const tick = () => autoplayRef.current();
    const id = setInterval(tick, 5000);
    return () => clearInterval(id);
  }, [isPaused, isModalOpen, index]);

  /* ---------- keyboard ---------- */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (lightboxIdx !== null) return setLightboxIdx(null);
        if (isModalOpen) return setIsModalOpen(false);
      }
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen, lightboxIdx]);

  /* ---------- helpers ---------- */
  const prev = useCallback(() => {
    setDirection('prev');
    setIndex((i) => (i - 1 + certificates.length) % certificates.length);
  }, []);

  const next = useCallback(() => {
    setDirection('next');
    setIndex((i) => (i + 1) % certificates.length);
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const goToAndClose = (i) => {
    setDirection(i > index ? 'next' : 'prev');
    setIndex(i);
    setIsModalOpen(false);
  };

  return (
    <section id="certificates" className="certificates-section">
      {/* Background decorations */}
      <div className="cert-bg-decoration" />
      <div className="cert-bg-decoration-2" />

      <div className="container">
        {/* Header */}
        <div
          ref={headerRef}
          className={`cert-header scroll-reveal fade-up ${isHeaderVisible ? 'visible' : ''}`}
        >
          <span className="section-label">
            <span className="label-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 12l3 3 7-7" /></svg>
            </span>
            Certifications
          </span>
          <h2 className="section-title">
            Certifications &amp; <span className="gradient-text">Achievements</span>
          </h2>
          <p className="section-subtitle">
            Courses and recognitions that sharpen my craft
          </p>
        </div>

        {/* Carousel */}
        <div
          ref={carouselRef}
          className={`cert-carousel scroll-reveal fade-up ${isCarouselVisible ? 'visible' : ''}`}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Progress bar */}
          <div className="cert-progress-track">
            <div
              ref={progressRef}
              className={`cert-progress-bar ${isPaused || isModalOpen ? 'paused' : ''}`}
            />
          </div>

          {/* Slide counter badge */}
          <span className="cert-counter">{index + 1} / {certificates.length}</span>

          <button className="cert-arrow left" onClick={prev} aria-label="Previous certificate">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>

          <div className="cert-slides">
            {certificates.map((item, i) => (
              <div
                key={i}
                className={`cert-slide ${i === index ? 'active' : ''} ${direction}`}
                aria-hidden={i !== index}
              >
                {item.src ? (
                  <button type="button" className="cert-image-button" onClick={() => setLightboxIdx(i)} aria-label={`Enlarge ${item.title}`}>
                    <img src={item.src} alt={item.alt} />
                  </button>
                ) : (
                  <article className="achievement-slide" aria-label={item.alt}>
                    <span className="achievement-badge">{item.badge}</span>
                    <p className="achievement-kicker">Achievement</p>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <span className="achievement-project">{item.project}</span>
                  </article>
                )}
              </div>
            ))}
          </div>

          <button className="cert-arrow right" onClick={next} aria-label="Next certificate">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>

          {/* Meta info */}
          <div className="cert-meta" key={index}>
            <h3 className="cert-title">{certificates[index].title}</h3>
            <p className="cert-desc">{certificates[index].description}</p>
          </div>

          {/* Controls */}
          <div className="cert-controls">
            <div className="cert-dots">
              {certificates.map((_, i) => (
                <button
                  key={i}
                  className={`dot ${i === index ? 'active' : ''}`}
                  onClick={() => {
                    setDirection(i > index ? 'next' : 'prev');
                    setIndex(i);
                  }}
                  aria-label={`Go to certificate ${i + 1}`}
                />
              ))}
            </div>

            <button className="view-all-btn" onClick={openModal}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
              View all
            </button>
          </div>
        </div>

        {/* View-All Modal */}
        {isModalOpen && (
          <div className="cert-modal" role="dialog" aria-modal="true" aria-labelledby="cert-modal-title">
            <div className="cert-modal-backdrop" onClick={closeModal} />
            <div ref={modalRef} className="cert-modal-content" tabIndex="-1">
              <div className="modal-header">
                <h3 id="cert-modal-title">All Certificates</h3>
                <button className="modal-close" onClick={closeModal} aria-label="Close">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
              <div className="cert-grid">
                {certificates.map((item, i) => (
                  <button
                    key={i}
                    className="cert-grid-item"
                    onClick={() => goToAndClose(i)}
                  >
                    <div className="grid-img-wrap">
                      {item.src ? (
                        <img src={item.src} alt={item.alt} />
                      ) : (
                        <div className="achievement-grid-card" aria-label={item.alt}>
                          <span>{item.badge}</span>
                          <strong>{item.project}</strong>
                        </div>
                      )}
                      <div className="grid-overlay">
                        <span>View</span>
                      </div>
                    </div>
                    <div className="grid-meta">
                      <strong>{item.title}</strong>
                      <span>{item.description}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Lightbox */}
        {lightboxIdx !== null && certificates[lightboxIdx].src && (
          <div ref={lightboxRef} className="cert-lightbox" role="dialog" aria-modal="true" aria-label={`${certificates[lightboxIdx].title} preview`} tabIndex="-1" onClick={() => setLightboxIdx(null)}>
            <img
              src={certificates[lightboxIdx].src}
              alt={certificates[lightboxIdx].alt}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="lightbox-close"
              onClick={() => setLightboxIdx(null)}
              aria-label="Close lightbox"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Certificates;
