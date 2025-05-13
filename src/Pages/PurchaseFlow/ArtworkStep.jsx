import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../Firebase/firebaseConfig';
import { useToast } from '../../components/ui/Toast';
import { Button, Box, Typography, CircularProgress } from '@mui/material';
import BobGoService from '../../Order/bobgoService';

const ArtworkStep = ({ artworkId, onNext }) => {
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLocal, setIsLocal] = useState(false);
  const [shippingRates, setShippingRates] = useState([]);
  const [loadingRates, setLoadingRates] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const artworkRef = doc(db, "artworks", artworkId);
        const docSnap = await getDoc(artworkRef);

        if (docSnap.exists()) {
          const artworkData = docSnap.data();
          setArtwork(artworkData);
          setIsLocal(true); // Temporary - replace with actual location check
          
          // Calculate shipping rates
          setLoadingRates(true);
          try {
            const collectionAddress = {
              street: "123 Art Gallery Street",
              city: "Johannesburg",
              zone: "Gauteng",
              postalCode: "2000",
              country: "ZA",
              phone: "+27123456789"
            };

            const deliveryAddress = {
              street: "Default Street",
              city: "Default City",
              zone: "Default Province",
              postalCode: "0000",
              country: "ZA"
            };

            const response = await BobGoService.getRatesAtCheckout(
              {
                title: artworkData.title,
                price: artworkData.price,
                packaging_length: artworkData.packaging_length || 30,
                packaging_width: artworkData.packaging_width || 30,
                packaging_height: artworkData.packaging_height || 5,
                total_weight: artworkData.total_weight || 2
              },
              collectionAddress,
              deliveryAddress
            );
            setShippingRates(response?.rates || []);
          } catch (error) {
            showToast(error);
          } finally {
            setLoadingRates(false);
          }
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
  }, [artworkId, navigate, showToast]);

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
        
        {loadingRates ? (
          <CircularProgress size={20} />
        ) : (
          <>
            {shippingRates.length > 0 ? (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">Shipping Options:</Typography>
                {shippingRates.map((rate, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography>{rate.service}</Typography>
                    <Typography>{artwork.currency} {rate.price.toFixed(2)}</Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography>No shipping options available</Typography>
            )}
          </>
        )}
      </Box>

      <Button 
        variant="contained" 
        color="primary"
        onClick={onNext}
      >
        Continue to Shipping
      </Button>
    </Box>
  );
};

export default ArtworkStep;
