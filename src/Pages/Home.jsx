import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  // Placeholder data - to be replaced with actual content
  const featuredArtworks = [
    {
      id: 1,
      title: "Emerging Vision",
      image: "head.png",
      price: 450,
      currency: "USD"
    },
    {
      id: 2,
      title: "Urban Reflections", 
      image: "/table.png",
      price: 600,
      currency: "USD"
    },
    {
      id: 3,
      title: "Colorful Horizons",
      image: "/hori.jpg",
      price: 550,
      currency: "USD"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      text: "Elisha's work captures raw emotion in ways I've never seen before. My piece is the centerpiece of my home.",
      image: "shvetsa.jpg"
    },
    {
      name: "Michael Chen",
      text: "The depth and texture in Ramroop's paintings are even more stunning in person. Worth every penny.",
      image: "olly.jpg"
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Discover the Art of Elisha Ramroop</h1>
          <p>Original paintings by this up-and-coming contemporary artist</p>
          <Link to="/artworks" className="cta-button">View Collection</Link>
        </div>
      </section>

      {/* Featured Artworks */}
      <section className="featured-artworks">
        <h2>Featured Works</h2>
        <div className="artworks-grid">
          {featuredArtworks.map(artwork => (
            <div key={artwork.id} className="artwork-card">
              <img src={artwork.image} alt={artwork.title} />
              <h3>{artwork.title}</h3>
              <p>{artwork.price} {artwork.currency}</p>
              <Link to={`/artwork-details/${artwork.id}`} className="view-button">View Details</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Artist Bio */}
      <section className="artist-bio">
        <div className="bio-content">
          <div className="bio-image">
            <img src="/steve.jpg" alt="Elisha Ramroop" />
          </div>
          <div className="bio-text">
            <h2>About Elisha Ramroop</h2>
            <p>
              Elisha Ramroop is an emerging contemporary artist known for his vibrant 
              use of color and unique textures. As a young, up-and-coming talent, 
              Elisha's work explores themes of identity and transformation through 
              mixed media techniques.
            </p>
            <p>
              Each original piece is handcrafted in his studio, with careful attention 
              to detail and material quality. Elisha ships worldwide and personally 
              oversees the delivery of each artwork to ensure its safe arrival.
            </p>
            <Link to="/about" className="bio-link">Learn More About the Artist</Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>Collector Testimonials</h2>
        <div className="testimonial-cards">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <img src={testimonial.image} alt={testimonial.name} />
              <h3>{testimonial.name}</h3>
              <p>"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
