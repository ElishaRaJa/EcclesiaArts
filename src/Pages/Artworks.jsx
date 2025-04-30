import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../Firebase/firebaseConfig";
import { useAuth } from "../Firebase/AuthContext";
import { Link, useParams, useNavigate } from "react-router-dom";
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
  const [singleArtwork, setSingleArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const { role } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const docRef = doc(db, "artworks", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setSingleArtwork({ 
              id: docSnap.id, 
              ...data,
              sold: data.status === 'sold' // Map status to sold
            });
          }
        } else {
          const artworksSnapshot = await getDocs(collection(db, "artworks"));
          setArtworks(artworksSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              sold: data.status === 'sold' // Map status to sold
            };
          }));
        }
      } catch (error) {
        console.error("Error fetching artwork data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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

  if (id && singleArtwork) {
    return (
      <div className="artwork-detail-page">
        <div className="artwork-detail__header">
          <h2 className="artwork-detail__title">{singleArtwork.title}</h2>
          <Link to="/artworks" className="artwork-detail__back-btn">
            ← Back to Gallery
          </Link>
        </div>
        <div className="artwork-detail__content">
          <img
            src={singleArtwork.images?.[0] || "https://via.placeholder.com/600"}
            alt={singleArtwork.title}
            className="artwork-detail__image"
          />
          <div className="artwork-detail__info">
            <p className="artwork-detail__description">{singleArtwork.description}</p>
            <div className="artwork-detail__price">
              Price: {parseFloat(singleArtwork.price).toFixed(2)} {singleArtwork.currency}
            </div>
            {singleArtwork.height && singleArtwork.width && (
              <div className="artwork-detail__dimensions">
                Dimensions: {singleArtwork.height} × {singleArtwork.width} cm
              </div>
            )}
            {singleArtwork.shippingPrice && (
              <div className="artwork-detail__shipping">
                Shipping: {parseFloat(singleArtwork.shippingPrice).toFixed(2)} {singleArtwork.currency}
              </div>
            )}
            {singleArtwork.deliveryTimeEstimate && (
              <div className="artwork-detail__delivery">
                Delivery: {singleArtwork.deliveryTimeEstimate}
              </div>
            )}
            {singleArtwork.categories?.length > 0 && (
              <div className="artwork-detail__categories">
                Categories: {singleArtwork.categories.join(', ')}
              </div>
            )}
            {singleArtwork.shippingRegions?.length > 0 && (
              <div className="artwork-detail__regions">
                Ships to: {singleArtwork.shippingRegions.join(', ')}
              </div>
            )}
            <div className="artwork-detail__purchase-section">
              <div className={`artwork-detail__status ${
                singleArtwork.status === 'sold' ? 'artwork-detail__status--sold' : 'artwork-detail__status--available'
              }`}>
                {singleArtwork.status === 'sold' ? 'Sold' : 'Available'}
              </div>
            {singleArtwork.status !== 'sold' ? (
                <Link to={`/purchase/${singleArtwork.id}`} className="artwork-detail__purchase-btn">
                  Purchase
                </Link>
              ) : (
                <button className="artwork-detail__purchase-btn" disabled>
                  Sold
                </button>
              )}
            </div>
            {role === 'admin' ? (
              <div className="artwork-detail__admin-actions">
                <Link to={`/admin/artcrud/edit-artwork/${singleArtwork.id}`}>
                  <button className="artwork-detail__btn artwork-detail__btn--edit">
                    Edit
                  </button>
                </Link>
                <button
                  className="artwork-detail__btn artwork-detail__btn--delete"
                  onClick={() => handleDeleteArtwork(singleArtwork.id)}
                >
                  Delete
                </button>
              </div>
            ) : (
              <div className="artwork-detail__spacer"></div>
            )}
          </div>
        </div>
      </div>
    );
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
