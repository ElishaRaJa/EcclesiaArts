import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../Firebase/firebaseConfig";
import { useAuth } from "../Firebase/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import './Artworks.css';

const ArtworkCard = ({ artwork, isAdmin, handleDeleteArtwork }) => {
  const navigate = useNavigate();
  return (
    <div className={`artwork-card ${artwork.sold ? 'artwork-card--sold' : ''}`}>
      {artwork.sold && <div className="artwork-card__sold-badge">SOLD</div>}
      <img
        src={artwork.images?.[0] || "https://via.placeholder.com/400"}
        alt={artwork.title}
        className="artwork-card__image"
      />
      <div className="artwork-card__content">
        <h3 className="artwork-card__title">{artwork.title}</h3>
        <div className="artwork-card__price">
          {artwork.price} {artwork.currency}
        </div>
        <div className="artwork-card__status-container">
          <div className={`artwork-card__status ${
            artwork.sold ? 'artwork-card__status--sold' : 'artwork-card__status--available'
          }`}>
            {artwork.sold ? 'Sold' : 'Available'}
          </div>
          <Link to={`/artwork-details/${artwork.id}`}>
            <button
              className="artwork-card__btn artwork-card__btn--details"
            >
              Details
            </button>
          </Link>
        </div>
        <div className="artwork-card__actions">
          <div className="artwork-card__user-actions">
            {/* The first "Details" button was here */}
          </div>
          {isAdmin && (
            <div className="artwork-card__admin-actions">
              <Link to={`/admin/artcrud/edit-artwork/${artwork.id}`}>
                <button className="artwork-card__btn artwork-card__btn--edit">
                  Edit
                </button>
              </Link>
              <button
                className="artwork-card__btn artwork-card__btn--delete"
                onClick={() => handleDeleteArtwork(artwork.id)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Artworks = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const artworksSnapshot = await getDocs(collection(db, "artworks"));
        setArtworks(artworksSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            sold: data.status === 'sold' // Map status to sold
          };
        }));
      } catch (error) {
        console.error("Error fetching artwork data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteArtwork = async (artworkId) => {
    if (window.confirm('Are you sure you want to delete this artwork?')) {
      try {
        await deleteDoc(doc(db, "artworks", artworkId));
        setArtworks(artworks.filter(artwork => artwork.id !== artworkId));
      } catch (error) {
        console.error("Error deleting artwork: ", error);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading artworks...</div>;
  }

  return (
    <div className="artworks-page">
      <h2 className="artworks__title">Artworks</h2>
      {role === 'admin' && (
        <Link to="/admin/artcrud/create-artwork">
          <button className="artworks__create-btn">Create Artwork</button>
        </Link>
      )}

      <div className="artworks__grid">
        {artworks.map(artwork => (
          <ArtworkCard
            key={artwork.id}
            artwork={artwork}
            isAdmin={role === 'admin'}
            handleDeleteArtwork={handleDeleteArtwork}
          />
        ))}
      </div>
    </div>
  );
};

export default Artworks;
