import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Alert, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import BobGoService from '../../Order/bobgoService';
import { formatAddressForBobGo, formatContactInfo } from '../../utils/addressFormatter';

const DeliveryStep = ({ userData, artworkId, onBack }) => {
  const [rates, setRates] = useState([]);
  const [selectedRate, setSelectedRate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Current userData:', JSON.stringify(userData, null, 2));
  }, [userData]);
  useEffect(() => {
    if (userData?.shipping_country && userData?.shipping_postal_code) {
      const fetchRates = async () => {
        setLoading(true);
        setError(null);
        try {
          // Format addresses for API
          const collectionAddress = formatAddressForBobGo({
            street: "123 Art Gallery Street",
            city: "Johannesburg",
            zone: "Gauteng",
            postalCode: "2000",
            country: "ZA",
            phone: "+27123456789"
          });

          const deliveryAddress = formatAddressForBobGo({
            ...userData,
            country: userData.shipping_country,
            postalCode: userData.shipping_postal_code
          });

          // Get artwork details (simplified - in real app would fetch from store/API)
          const artwork = {
            title: "Artwork", // Would come from actual data
            price: 1000, // Would come from actual data
            packaging_length: 30,
            packaging_width: 30,
            packaging_height: 5,
            total_weight: 2
          };

          // Validate address first
          const validation = await BobGoService.validateAddress(deliveryAddress);
          if (!validation.isValid) {
            throw new Error('Invalid shipping address');
          }

          // Get shipping rates using RAC endpoint
          const response = await BobGoService.getRatesAtCheckout(
            artwork,
            collectionAddress,
            deliveryAddress
          );
          
          console.log('RAC response:', response);
          setRates(response?.rates || []);
          if (response?.rates?.length > 0) {
            setSelectedRate(response.rates[0].id);
          }
        } catch (err) {
          let errorMessage = err.message;
          if (userData.shipping_country !== 'ZA') {
            errorMessage = 'International shipping requires manual processing. Please contact us for arrangements.';
          }
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      };
      fetchRates();
    }
  }, [userData]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Delivery Options
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      ) : rates.length > 0 ? (
        <Box sx={{ mb: 4 }}>
          <RadioGroup
            value={selectedRate}
            onChange={(e) => setSelectedRate(e.target.value)}
          >
            {rates.map((rate) => (
              <FormControlLabel
                key={rate.id}
                value={rate.id}
                control={<Radio />}
                label={`${rate.service} - R${rate.price} (${rate.estimated_days} business days)`}
              />
            ))}
          </RadioGroup>
        </Box>
      ) : (
        <Typography variant="body1" paragraph>
          {userData.shipping_country === 'ZA'
            ? 'No shipping options available for this location'
            : 'International shipping will be arranged via our partners'}
        </Typography>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button variant="outlined" onClick={onBack}>
          Back
        </Button>
        <Button 
          variant="contained" 
          color="primary"
          disabled={!selectedRate}
          onClick={() => onNext({
            shippingRate: rates.find(r => r.id === selectedRate),
            shippingMethod: 'bobgo'
          })}
        >
          Continue to Payment
        </Button>
      </Box>
    </Box>
  );
};

export default DeliveryStep;
