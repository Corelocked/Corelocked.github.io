import React, { useState, useRef, useContext } from 'react';
import emailjs from '@emailjs/browser';
import './Contact.css';
import '../components/Animations.css';
import useScrollReveal from '../hooks/useScrollReveal';
import { ThemeContext } from '../context/ThemeContext';
import umbreonVideo from '../assets/images/umbreon.mp4';
import spiderGwenVideo from '../assets/images/spider-gwen.mp4';

// EmailJS Configuration
// To set up EmailJS:
// 1. Create a free account at https://www.emailjs.com/
// 2. Create an Email Service (e.g., Gmail, Outlook)
// 3. Create an Email Template with variables: {{from_name}}, {{from_email}}, {{message}}
// 4. Replace the values below with your own:
const EMAILJS_SERVICE_ID = 'service_18woyam';  // e.g., 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'template_320vcsc'; // e.g., 'template_xyz789'
const EMAILJS_PUBLIC_KEY = 'R9B6dfHNiMoceaxmX';   // Found in Account > API Keys

const Contact = () => {
  const [titleRef, isTitleVisible] = useScrollReveal({ threshold: 0.2 });
  const [infoRef, isInfoVisible] = useScrollReveal({ threshold: 0.2 });
  const [formContainerRef, isFormVisible] = useScrollReveal({ threshold: 0.2 });
  const { darkMode } = useContext(ThemeContext);
  
  const formRef = useRef();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [status, setStatus] = useState({
    submitting: false,
    submitted: false,
    error: null
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing again
    if (status.error) {
      setStatus(prev => ({ ...prev, error: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setStatus({ submitting: true, submitted: false, error: null });

    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      );

      setStatus({ submitting: false, submitted: true, error: null });
      setFormData({ name: '', email: '', message: '' });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setStatus(prev => ({ ...prev, submitted: false }));
      }, 5000);

    } catch (error) {
      console.error('EmailJS Error:', error);
      setStatus({
        submitting: false,
        submitted: false,
        error: 'Failed to send message. Please try again or contact me directly via email.'
      });
    }
  };

  return (
    <section id="contact" className="contact">
      {/* Video Background */}
      <div className="video-background">
        <video 
          className={`theme-video ${darkMode ? 'active' : ''}`}
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source src={umbreonVideo} type="video/mp4" />
        </video>
        <video 
          className={`theme-video ${!darkMode ? 'active' : ''}`}
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source src={spiderGwenVideo} type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
      </div>
      <div className="container">
        <div 
          ref={titleRef}
          className={`contact-header scroll-reveal fade-up ${isTitleVisible ? 'visible' : ''}`}
        >
          <span className="section-label">Contact</span>
          <h2 className="section-title">
            Let's <span className="gradient-text">Connect</span>
          </h2>
          <p className="section-subtitle">
            Have a project in mind or just want to say hello? I'd love to hear from you!
          </p>
        </div>
        <div className="contact-content">
          <div 
            ref={infoRef}
            className={`contact-info scroll-reveal fade-left delay-200 ${isInfoVisible ? 'visible' : ''}`}
          >
            <div className="info-card">
              <h3>Let's talk about everything!</h3>
              <p className="info-description">
                Feel free to reach out for collaborations, opportunities, or just a friendly chat.
              </p>
              
              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <div className="contact-text">
                    <span className="contact-label">Email</span>
                    <a href="mailto:cedricjoshua.palapuz@gmail.com">cedricjoshua.palapuz@gmail.com</a>
                  </div>
                </div>
                
                <div className="contact-item">
                  <div className="contact-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div className="contact-text">
                    <span className="contact-label">Phone</span>
                    <a href="tel:+639994051077">(+63) 999-405-1077</a>
                  </div>
                </div>
                
                <div className="contact-item">
                  <div className="contact-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div className="contact-text">
                    <span className="contact-label">Location</span>
                    <span>Philippines</span>
                  </div>
                </div>
              </div>
              
              <div className="social-section">
                <span className="social-label">Find me on</span>
                <div className="social-links">
                  <a href="https://github.com/Corelocked" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="GitHub">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  <a href="https://www.linkedin.com/in/cedric-joshua-palapuz-85645524a/" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="LinkedIn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <a href="https://www.instagram.com/corelockedd/#" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Instagram">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a href="https://www.facebook.com/cdrplpz/" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Facebook">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div 
            ref={formContainerRef}
            className={`contact-form-wrapper scroll-reveal fade-right delay-400 ${isFormVisible ? 'visible' : ''}`}
          >
            <form 
              ref={formRef}
              onSubmit={handleSubmit} 
              className="contact-form"
            >
              <div className="form-header">
                <h3>Send a Message</h3>
                <p>I'll get back to you as soon as possible</p>
              </div>
              
              {status.submitted && (
                <div className="form-message success">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  Thank you for your message! I will get back to you soon.
                </div>
              )}
              {status.error && (
                <div className="form-message error">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                  {status.error}
                </div>
              )}
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Your Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="from_name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={status.submitting}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    Your Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="from_email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={status.submitting}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="message">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell me about your project or just say hello..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  disabled={status.submitting}
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="submit-btn"
                disabled={status.submitting}
              >
                {status.submitting ? (
                  <>
                    <span className="spinner"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;