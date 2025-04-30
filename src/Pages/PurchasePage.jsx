import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase/firebaseConfig';
import { useAuth } from '../Firebase/AuthContext';
import { isProfileComplete, getProfileCompletionMessage } from '../utils/profileUtils';
import { useToast } from '../components/ui/Toast';
import { Button, Box, Typography, CircularProgress } from '@mui/material';

const PurchasePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLocal, setIsLocal] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const artworkRef = doc(db, "artworks", id);
        const docSnap = await getDoc(artworkRef);

        if (docSnap.exists()) {
          setArtwork(docSnap.data());
          // TODO: Determine if local based on user location
          setIsLocal(true); // Temporary - replace with actual location check
        } else {
          showToast(new Error('Artwork not found'));
          navigate('/');
        }
      } catch (error) {
        showToast(error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchArtwork();
  }, [id, navigate, showToast]);

  const handlePurchase = async () => {
    try {
      // Check if profile is complete
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const { complete, missing } = isProfileComplete(userDoc.data());
      
      if (!complete) {
        showToast({
          message: getProfileCompletionMessage(missing),
          type: "error",
          action: {
            text: "Complete Profile",
            onClick: () => navigate("/edit-profile")
          }
        });
        return;
      }

      // Mark artwork as sold in Firestore
      await updateDoc(doc(db, "artworks", id), {
        sold: true,
        soldTo: user.uid,
        soldAt: new Date()
      });

      // TODO: Initiate Bob Go delivery for local purchases
      if (isLocal) {
        // Bob Go API integration
      }

      // TODO: Process payment via PayPal

      showToast({ message: 'Purchase successful!', type: 'success' });
      navigate('/');
    } catch (error) {
      showToast(error);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!artwork) {
    return <Typography>Artwork not found</Typography>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Purchase {artwork.title}
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Price: {artwork.currency} {artwork.price}</Typography>
        {isLocal && (
          <Typography>Local delivery via Bob Go</Typography>
        )}
        {!isLocal && (
          <Typography>International shipping: {artwork.currency} {artwork.shippingPrice}</Typography>
        )}
      </Box>

      <Button 
        variant="contained" 
        color="primary"
        onClick={handlePurchase}
        disabled={!user}
      >
        Complete Purchase
      </Button>
    </Box>
  );
};

export default PurchasePage;
