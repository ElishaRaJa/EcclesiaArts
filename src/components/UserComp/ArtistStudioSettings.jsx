import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Alert, Grid } from '@mui/material';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../Firebase/firebaseConfig';
import { useAuth } from '../../Firebase/AuthContext';

// Bob Go requires these exact province names
const PROVINCES = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Northern Cape',
  'Western Cape'
];

export default function ArtistStudioSettings({ artistData }) {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    street_address: '',
    city: '',
    zone: '',
    country: 'ZA',
    code: '',
    phone: '',
    company: '',
    pickup_instructions: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (artistData?.bobgo_address) {
      setFormData(artistData.bobgo_address);
    }
  }, [artistData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validatePhone = (phone) => {
    return phone.match(/^\+27[0-9]{9}$/);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate required fields
    if (!formData.street_address || !formData.city || !formData.zone || !formData.code) {
      setError('Please fill all required address fields');
      setLoading(false);
      return;
    }

    if (!validatePhone(formData.phone)) {
      setError('Phone must be in +27 format with 9 digits');
      setLoading(false);
      return;
    }

    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        bobgo_address: formData
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update studio location');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Studio Pickup Location
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        This address will be used by Bob Go couriers to collect artworks
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>Studio location updated!</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Street Address"
            name="street_address"
            value={formData.street_address}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Province"
            name="zone"
            value={formData.zone}
            onChange={handleChange}
            SelectProps={{ native: true }}
            required
          >
            <option value=""></option>
            {PROVINCES.map(province => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Postal Code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Contact Phone (+27...)"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+27821234567"
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Business/Studio Name"
            name="company"
            value={formData.company}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Pickup Instructions"
            name="pickup_instructions"
            value={formData.pickup_instructions}
            onChange={handleChange}
            placeholder="e.g. 'Ring bell at back entrance'"
          />
        </Grid>
      </Grid>

      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        sx={{ mt: 3 }}
      >
        {loading ? 'Saving...' : 'Save Studio Location'}
      </Button>
    </Box>
  );
}
