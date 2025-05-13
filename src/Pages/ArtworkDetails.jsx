import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../Firebase/firebaseConfig";
import { useAuth } from "../Firebase/AuthContext";
import './ArtworkDetails.css';

const ArtworkDetails = () => {
    const [artwork, setArtwork] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const { role } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, "artworks", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setArtwork({ 
                        id: docSnap.id, 
                        ...data,
                        sold: data.status === 'sold'
                    });
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
                navigate('/artworks');
            } catch (error) {
                console.error("Error deleting artwork: ", error);
            }
        }
    };

    if (loading) {
        return <div className="loading">Loading artwork details...</div>;
    }

    if (!artwork) {
        return <div className="error">Artwork not found</div>;
    }

    return (
        <div className="artwork-detail-page">
            <div className="artwork-detail__header">
                <h2 className="artwork-detail__title">{artwork.title}</h2>
                <Link to="/artworks" className="artwork-detail__back-btn">
                    ← Back to Gallery
                </Link>
            </div>
            <div className="artwork-detail__content">
                <img
                    src={artwork.images?.[0] || "https://via.placeholder.com/600"}
                    alt={artwork.title}
                    className="artwork-detail__image"
                />
                <div className="artwork-detail__info">
                    <p className="artwork-detail__description">{artwork.description}</p>
                    <div className="artwork-detail__price">
                        Price: {parseFloat(artwork.price).toFixed(2)} {artwork.currency}
                    </div>
                    {artwork.height && artwork.width && (
                        <div className="artwork-detail__dimensions">
                            Dimensions: {artwork.height} × {artwork.width} cm
                        </div>
                    )}
                    {artwork.shippingPrice && (
                        <div className="artwork-detail__shipping">
                            Shipping: {parseFloat(artwork.shippingPrice).toFixed(2)} {artwork.currency}
                        </div>
                    )}
                    {artwork.deliveryTimeEstimate && (
                        <div className="artwork-detail__delivery">
                            Delivery: {artwork.deliveryTimeEstimate}
                        </div>
                    )}
                    {artwork.categories?.length > 0 && (
                        <div className="artwork-detail__categories">
                            Categories: {artwork.categories.join(', ')}
                        </div>
                    )}
                    {artwork.shippingRegions?.length > 0 && (
                        <div className="artwork-detail__regions">
                            Ships to: {artwork.shippingRegions.join(', ')}
                        </div>
                    )}
                    <div className="artwork-detail__purchase-section">
                        <div className={`artwork-detail__status ${
                            artwork.status === 'sold' ? 'artwork-detail__status--sold' : 'artwork-detail__status--available'
                        }`}>
                            {artwork.status === 'sold' ? 'Sold' : 'Available'}
                        </div>
                        {artwork.status !== 'sold' ? (
                            <Link to={`/purchase/${artwork.id}`} className="artwork-detail__purchase-btn">
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
                            <Link to={`/admin/artcrud/edit-artwork/${artwork.id}`}>
                                <button className="artwork-detail__btn artwork-detail__btn--edit">
                                    Edit
                                </button>
                            </Link>
                            <button
                                className="artwork-detail__btn artwork-detail__btn--delete"
                                onClick={() => handleDeleteArtwork(artwork.id)}
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
};

export default ArtworkDetails;
