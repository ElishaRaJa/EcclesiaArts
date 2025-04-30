import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <h1>About Elisha Ramroop</h1>
        <p>Emerging Contemporary Artist</p>
      </section>

      <section className="artist-story">
        <div className="story-content">
          <div className="story-text">
            <h2>Artistic Journey</h2>
            <p>
              Elisha Ramroop is a young, up-and-coming artist based in South Africa, 
              whose vibrant works explore themes of identity, transformation, and 
              cultural heritage through mixed media techniques.
            </p>
            <p>
              From an early age, Elisha showed exceptional talent in visual arts, 
              developing a unique style that blends traditional techniques with 
              contemporary expression.
            </p>
          </div>
          <div className="story-image">
            <img src="/leeloothefirst.jpg" alt="Elisha Ramroop in studio" />
          </div>
        </div>
      </section>

      <section className="artist-process">
        <h2>Creative Process</h2>
        <div className="process-grid">
          <div className="process-item">
            <h3>Inspiration</h3>
            <p>
              Drawing from personal experiences and cultural influences, each piece 
              begins with extensive research and sketching.
            </p>
          </div>
          <div className="process-item">
            <h3>Technique</h3>
            <p>
              Specializing in acrylic and mixed media, Elisha builds layers of texture 
              and color to create depth and movement.
            </p>
          </div>
          <div className="process-item">
            <h3>Philosophy</h3>
            <p>
              "Art should challenge perceptions while remaining accessible - a visual 
              dialogue between artist and viewer."
            </p>
          </div>
        </div>
      </section>

      <section className="studio-gallery">
        <h2>Studio & Workspace</h2>
        <div className="gallery-grid">
          <img src="/cottonbro2.jpg" alt="Studio workspace" />
          <img src="/cottonbro.jpg" alt="Art materials" />
          <img src="/anete-lusina.jpg" alt="Work in progress" />
        </div>
      </section>

      <section className="contact-info">
        <h2>Get In Touch</h2>
        <p>For inquiries, commissions, or studio visits:</p>
        <div className="contact-details">
          <p>Email: elisha@ramroopart.com</p>
          <p>Phone: +27 12 345 6789</p>
          <p>Studio: Johannesburg, South Africa</p>
        </div>
      </section>
    </div>
  );
};

export default About;
