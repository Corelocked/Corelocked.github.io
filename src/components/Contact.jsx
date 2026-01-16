import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import './Contact.css';
import '../components/Animations.css';
import useScrollReveal from '../hooks/useScrollReveal';

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
      <div className="container">
        <h2 
          ref={titleRef}
          className={`section-title scroll-reveal fade-up section-title-animated ${isTitleVisible ? 'visible' : ''}`}
        >
          Get In Touch
        </h2>
        <div className="contact-content">
          <div 
            ref={infoRef}
            className={`contact-info scroll-reveal fade-left delay-200 ${isInfoVisible ? 'visible' : ''}`}
          >
            <h3>Contact Information</h3>
            <p>Email: cedricjoshua.palapuz@gmail.com</p>
            <p>Phone: (+63) 999-405-1077</p>
            <div className="social-links">
              <a href="https://github.com/Corelocked" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://www.linkedin.com/in/cedric-joshua-palapuz-85645524a/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://www.instagram.com/corelockedd/#" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://www.facebook.com/cdrplpz/" target="_blank" rel="noopener noreferrer">Facebook</a>
            </div>
          </div>
          <div 
            ref={formContainerRef}
            className={`scroll-reveal fade-right delay-400 ${isFormVisible ? 'visible' : ''}`}
          >
            <form 
              ref={formRef}
              onSubmit={handleSubmit} 
              className="contact-form"
            >
            {status.submitted && (
              <div className="form-message success">
                Thank you for your message! I will get back to you soon.
              </div>
            )}
            {status.error && (
              <div className="form-message error">
                {status.error}
              </div>
            )}
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="from_name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={status.submitting}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="from_email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={status.submitting}
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                disabled={status.submitting}
              ></textarea>
            </div>
            <button 
              type="submit" 
              className="btn"
              disabled={status.submitting}
            >
              {status.submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;