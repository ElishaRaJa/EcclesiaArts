import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! Elisha will respond shortly.');
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <h1>Contact Elisha Ramroop</h1>
        <p>Get in touch for inquiries, commissions, or studio visits</p>
      </section>

      <div className="contact-content">
        <section className="contact-form-section">
          <h2>Send a Message</h2>
          <form onSubmit={handleSubmit} className="contact-form">
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
                rows="6"
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-button">
              Send Message
            </button>
          </form>
        </section>

        <section className="contact-info-section">
          <h2>Contact Information</h2>
          <div className="contact-details">
            <h3>Studio Location</h3>
            <p>123 Art Street, Johannesburg, South Africa</p>
            
            <h3>Email</h3>
            <p>elisha@ramroopart.com</p>
            
            <h3>Phone</h3>
            <p>+27 12 345 6789</p>
            
            <h3>Business Hours</h3>
            <p>Monday - Friday: 9am - 5pm</p>
            <p>Saturday: 10am - 2pm</p>
            <p>Sunday: Closed</p>
          </div>

          <div className="social-links">
            <h3>Follow Elisha</h3>
            <div className="social-icons">
              <a href="#" className="social-icon">Instagram</a>
              <a href="#" className="social-icon">Facebook</a>
              <a href="#" className="social-icon">Twitter</a>
            </div>
          </div>

          <div className="map-container">
            <img 
              src="https://via.placeholder.com/600x300" 
              alt="Map to Elisha Ramroop's studio" 
              className="map-image"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
