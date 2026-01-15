import React, { useState } from 'react';
import './Contact.css';
import '../components/Animations.css';
import useScrollReveal from '../hooks/useScrollReveal';

const Contact = () => {
  const [titleRef, isTitleVisible] = useScrollReveal({ threshold: 0.2 });
  const [infoRef, isInfoVisible] = useScrollReveal({ threshold: 0.2 });
  const [formRef, isFormVisible] = useScrollReveal({ threshold: 0.2 });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (e.g., send to backend or email service)
    console.log('Form submitted:', formData);
    alert('Thank you for your message! I will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
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
          <form 
            ref={formRef}
            onSubmit={handleSubmit} 
            className={`contact-form scroll-reveal fade-right delay-400 ${isFormVisible ? 'visible' : ''}`}
          >
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn">Send Message</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;