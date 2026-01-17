import React, { useState } from 'react';
import './Support.css';
import '../components/Animations.css';
import useScrollReveal from '../hooks/useScrollReveal';
import umbreonVideo from '../assets/images/umbreon.mp4';

// Import QR code images
import mayaQR from '../assets/images/maya-qr.jpg';
//import gcashQR from '../assets/images/maya-qr.jpg';

const Support = () => {
  const [titleRef, isTitleVisible] = useScrollReveal({ threshold: 0.2 });
  const [cardsRef, isCardsVisible] = useScrollReveal({ threshold: 0.2 });
  const [messageRef, isMessageVisible] = useScrollReveal({ threshold: 0.2 });
  const [activeQR, setActiveQR] = useState(null);
  const [heartClicked, setHeartClicked] = useState(false);
  const [heartPop, setHeartPop] = useState(false);

  const supportOptions = [
    // {
    //   id: 1,
    //   name: 'Buy Me a Coffee',
    //   icon: (
    //     <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    //       <path d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-.152-.143-.196-.366-.231-.572-.065-.378-.125-.756-.192-1.133-.057-.325-.102-.69-.25-.987-.195-.4-.597-.634-.996-.788a5.723 5.723 0 00-.626-.194c-1-.263-2.05-.36-3.077-.416a25.834 25.834 0 00-3.7.062c-.915.083-1.88.184-2.75.5-.318.116-.646.256-.888.501-.297.302-.393.77-.177 1.146.154.267.415.456.692.58.36.162.737.284 1.123.366 1.075.238 2.189.331 3.287.37 1.218.05 2.437.01 3.65-.118.299-.033.598-.073.896-.119.352-.054.578-.513.474-.834-.124-.383-.457-.531-.834-.473-.466.074-.96.108-1.382.146-1.177.08-2.358.082-3.536.006a22.228 22.228 0 01-1.157-.107c-.086-.01-.18-.025-.258-.036-.243-.036-.484-.08-.724-.13-.111-.027-.111-.185 0-.212h.005c.277-.06.557-.108.838-.147h.002c.131-.009.263-.032.394-.048a25.076 25.076 0 013.426-.12c.674.019 1.347.067 2.017.144l.228.031c.267.04.533.088.798.145.392.085.895.113 1.07.542.055.137.08.288.111.431l.319 1.484a.237.237 0 01-.199.284h-.003c-.037.006-.075.01-.112.015a36.704 36.704 0 01-4.743.295 37.059 37.059 0 01-4.699-.304c-.14-.017-.293-.042-.417-.06-.326-.048-.649-.108-.973-.161-.393-.065-.768-.032-1.123.161-.29.16-.527.404-.675.701-.154.316-.199.66-.267 1-.069.34-.176.707-.135 1.056.087.753.613 1.365 1.37 1.502a39.69 39.69 0 0011.343.376.483.483 0 01.535.53l-.071.697-1.018 9.907c-.041.41-.047.832-.125 1.237-.122.637-.553 1.028-1.182 1.171-.577.131-1.165.2-1.756.205-.656.004-1.31-.025-1.966-.022-.699.004-1.556-.06-2.095-.58-.475-.458-.54-1.174-.605-1.793l-.731-7.013-.322-3.094c-.037-.351-.286-.695-.678-.678-.336.015-.718.3-.678.679l.228 2.185.949 9.112c.147 1.344 1.174 2.068 2.446 2.272.742.12 1.503.144 2.257.156.966.016 1.942.053 2.892-.122 1.408-.258 2.465-1.198 2.616-2.657.34-3.332.683-6.663 1.024-9.995l.215-2.087a.484.484 0 01.39-.426c.402-.078.787-.212 1.074-.518.455-.488.546-1.124.385-1.766zm-1.478.772c-.145.137-.363.201-.578.233-2.416.359-4.866.54-7.308.46-1.748-.06-3.477-.254-5.207-.498-.17-.024-.353-.055-.47-.18-.22-.236-.111-.71-.054-.995.052-.26.152-.609.463-.646.484-.057 1.046.148 1.526.22.577.088 1.156.159 1.737.212 2.48.226 5.002.19 7.472-.14.45-.06.899-.13 1.345-.21.399-.072.84-.206 1.08.206.166.281.188.657.162.974a.544.544 0 01-.169.364zm-6.159 3.9c-.862.37-1.84.788-3.109.788a5.884 5.884 0 01-1.569-.217l.877 9.004c.065.78.717 1.38 1.5 1.38 0 0 1.243.065 1.658.065.447 0 1.786-.065 1.786-.065.783 0 1.434-.6 1.499-1.38l.94-9.95a3.996 3.996 0 00-1.322-.238c-.826 0-1.491.284-2.26.613z"/>
    //     </svg>
    //   ),
    //   description: 'Support my work with a virtual coffee!',
    //   link: '#', // Replace with your Buy Me a Coffee link
    //   color: '#FFDD00',
    //   bgColor: 'rgba(255, 221, 0, 0.1)'
    // },
    {
      id: 2,
      name: 'Ko-fi',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z"/>
        </svg>
      ),
      description: 'One-time or monthly support on Ko-fi',
      link: 'https://ko-fi.com/corelocked', // Replace with your Ko-fi link
      color: '#FF5E5B',
      bgColor: 'rgba(255, 94, 91, 0.1)'
    },
    {
      id: 3,
      name: 'PayPal',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/>
        </svg>
      ),
      description: 'Direct support via PayPal donation',
      link: 'https://paypal.me/Corelocked', // Replace with your PayPal.me link
      color: '#00A0FF',
      bgColor: 'rgba(0, 160, 255, 0.1)'
    },
    {
      id: 4,
      name: 'Maya',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
        </svg>
      ),
      description: 'Send via Maya QR code (Philippines)',
      qrImage: mayaQR,
      isQR: true,
      color: '#00D563',
      bgColor: 'rgba(0, 213, 99, 0.1)'
    },
    // {
    //   id: 5,
    //   name: 'GitHub Sponsors',
    //   icon: (
    //     <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    //       <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    //     </svg>
    //   ),
    //   description: 'Sponsor me on GitHub',
    //   link: '#', // Replace with your GitHub Sponsors link
    //   color: '#EA4AAA',
    //   bgColor: 'rgba(234, 74, 170, 0.1)'
    // },
    // {
    //   id: 5,
    //   name: 'QR Ph',
    //   icon: (
    //     <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    //       <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 13h6v6H3v-6zm2 2v2h2v-2H5zm13-2h3v2h-3v-2zm-3 0h2v3h-2v-3zm3 3h3v4h-2v-2h-1v-2zm-3 3h2v2h-2v-2zm-7-6h2v2h-2v-2zm2 2h2v2h-2v-2zm2-2h2v2h-2v-2zm0 4h2v4h-2v-4z"/>
    //     </svg>
    //   ),
    //   description: 'Send support via QR Ph (Philippines)',
    //   link: '#', // Replace with your QR Ph link
    //   color: '#E31837',
    //   bgColor: 'rgba(227, 24, 55, 0.1)'
    // }
  ];

  return (
    <section id="support" className="support">
      {/* Video Background */}
      <div className="video-background">
        <video autoPlay muted loop playsInline>
          <source src={umbreonVideo} type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
      </div>
      <div className="container">
        <div 
          ref={titleRef}
          className={`support-header scroll-reveal fade-up ${isTitleVisible ? 'visible' : ''}`}
        >
          <span className="section-label">Support</span>
          <h2 className="section-title">
            Support My <span className="gradient-text">Work</span>
          </h2>
          <p className="section-subtitle">
            If you enjoy my projects and want to support my work, consider buying me a coffee or becoming a sponsor!
          </p>
        </div>

        <div 
          ref={cardsRef}
          className={`support-options scroll-reveal fade-up delay-200 ${isCardsVisible ? 'visible' : ''}`}
        >
          {supportOptions.map((option) => (
            option.isQR ? (
              <button 
                key={option.id}
                onClick={() => setActiveQR(option)}
                className="support-card"
                style={{ '--card-color': option.color, '--card-bg': option.bgColor }}
              >
                <div className="support-icon" style={{ color: option.color }}>
                  {option.icon}
                </div>
                <h3 className="support-name">{option.name}</h3>
                <p className="support-description">{option.description}</p>
                <span className="support-btn">
                  Show QR
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                </span>
              </button>
            ) : (
              <a 
                key={option.id}
                href={option.link}
                target="_blank"
                rel="noopener noreferrer"
                className="support-card"
                style={{ '--card-color': option.color, '--card-bg': option.bgColor }}
              >
                <div className="support-icon" style={{ color: option.color }}>
                  {option.icon}
                </div>
                <h3 className="support-name">{option.name}</h3>
                <p className="support-description">{option.description}</p>
                <span className="support-btn">
                  Support
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </span>
              </a>
            )
          ))}
        </div>

        {/* QR Code Modal */}
        {activeQR && (
          <div className="qr-modal-overlay" onClick={() => setActiveQR(null)}>
            <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
              <button className="qr-modal-close" onClick={() => setActiveQR(null)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <h3 className="qr-modal-title" style={{ color: activeQR.color }}>{activeQR.name}</h3>
              <div className="qr-modal-image">
                <img src={activeQR.qrImage} alt={`${activeQR.name} QR Code`} />
              </div>
              <p className="qr-modal-description">Scan the QR code to send support</p>
            </div>
          </div>
        )}

        <div 
          ref={messageRef}
          className={`support-message scroll-reveal fade-up delay-400 ${isMessageVisible ? 'visible' : ''}`}
        >
          <div 
            className={`heart-icon${heartClicked ? ' heart-clicked' : ''}${heartPop ? ' heart-pop' : ''}`}
            onClick={() => {
              if (!heartClicked) {
                setHeartClicked(true);
                setHeartPop(false);
                // Force reflow to restart animation
                setTimeout(() => {
                  setHeartPop(true);
                  setTimeout(() => setHeartPop(false), 900);
                }, 10);
              } else {
                setHeartClicked(false);
                setHeartPop(false);
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: heartClicked ? '#e53935' : 'white', transition: 'color 0.3s' }}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
            </svg>
          </div>
          <p>Your support means the world to me and helps me continue creating awesome projects!</p>
        </div>
      </div>
    </section>
  );
};

export default Support;
