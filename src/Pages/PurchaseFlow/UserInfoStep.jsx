import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Firebase/AuthContext';
import { db } from '../../Firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, TextField, Checkbox, FormControlLabel } from '@mui/material';

const UserInfoStep = ({ initialData, onUpdate, onNext, onBack }) => {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    shipping_street: '',
    shipping_city: '',
    shipping_state: '',
    shipping_zip: '',
    shipping_country: '',
    billing_street: '',
    billing_city: '',
    billing_state: '',
    billing_zip: '',
    billing_country: '',
    same_billing_shipping: true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setUserInfo(initialData);
      return;
    }

    const fetchUserData = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserInfo({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            email: data.email || '',
            phone_number: data.phone_number || '',
            shipping_street: data.shipping_address?.street || '',
            shipping_city: data.shipping_address?.city || '',
            shipping_state: data.shipping_address?.state || '',
            shipping_zip: data.shipping_address?.zip || '',
            shipping_country: data.shipping_address?.country || '',
            billing_street: data.billing_address?.street || data.shipping_address?.street || '',
            billing_city: data.billing_address?.city || data.shipping_address?.city || '',
            billing_state: data.billing_address?.state || data.shipping_address?.state || '',
            billing_zip: data.billing_address?.zip || data.shipping_address?.zip || '',
            billing_country: data.billing_address?.country || data.shipping_address?.country || '',
            same_billing_shipping: data.same_billing_shipping !== undefined ? data.same_billing_shipping : true,
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user, initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!userInfo.first_name) newErrors.first_name = 'First name is required';
    if (!userInfo.last_name) newErrors.last_name = 'Last name is required';
    if (!userInfo.phone_number) newErrors.phone_number = 'Phone number is required';
    if (!userInfo.shipping_street) newErrors.shipping_street = 'Shipping street is required';
    if (!userInfo.shipping_city) newErrors.shipping_city = 'Shipping city is required';
    if (!userInfo.shipping_state) newErrors.shipping_state = 'Shipping state is required';
    if (!userInfo.shipping_zip) newErrors.shipping_zip = 'Shipping zip is required';
    if (!userInfo.shipping_country) newErrors.shipping_country = 'Shipping country is required';
    if (!userInfo.same_billing_shipping) {
      if (!userInfo.billing_street) newErrors.billing_street = 'Billing street is required';
      if (!userInfo.billing_city) newErrors.billing_city = 'Billing city is required';
      if (!userInfo.billing_state) newErrors.billing_state = 'Billing state is required';
      if (!userInfo.billing_zip) newErrors.billing_zip = 'Billing zip is required';
      if (!userInfo.billing_country) newErrors.billing_country = 'Billing country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onUpdate(userInfo);
      onNext();
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>Shipping Information</Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
        <TextField
          label="First Name"
          name="first_name"
          value={userInfo.first_name}
          onChange={handleChange}
          error={!!errors.first_name}
          helperText={errors.first_name}
          required
        />
        <TextField
          label="Last Name"
          name="last_name"
          value={userInfo.last_name}
          onChange={handleChange}
          error={!!errors.last_name}
          helperText={errors.last_name}
          required
        />
        <TextField
          label="Email"
          name="email"
          value={userInfo.email}
          onChange={handleChange}
          disabled
          fullWidth
          sx={{ gridColumn: 'span 2' }}
        />
        <TextField
          label="Phone Number"
          name="phone_number"
          value={userInfo.phone_number}
          onChange={handleChange}
          error={!!errors.phone_number}
          helperText={errors.phone_number}
          required
          fullWidth
          sx={{ gridColumn: 'span 2' }}
        />
      </Box>

      <Typography variant="h6" gutterBottom>Shipping Address</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
        <TextField
          label="Street"
          name="shipping_street"
          value={userInfo.shipping_street}
          onChange={handleChange}
          error={!!errors.shipping_street}
          helperText={errors.shipping_street}
          required
          sx={{ gridColumn: 'span 2' }}
        />
        <TextField
          label="City"
          name="shipping_city"
          value={userInfo.shipping_city}
          onChange={handleChange}
          error={!!errors.shipping_city}
          helperText={errors.shipping_city}
          required
        />
        <TextField
          label="State/Province"
          name="shipping_state"
          value={userInfo.shipping_state}
          onChange={handleChange}
          error={!!errors.shipping_state}
          helperText={errors.shipping_state}
          required
        />
        <TextField
          label="ZIP/Postal Code"
          name="shipping_zip"
          value={userInfo.shipping_zip}
          onChange={handleChange}
          error={!!errors.shipping_zip}
          helperText={errors.shipping_zip}
          required
        />
        <TextField
          label="Country"
          name="shipping_country"
          value={userInfo.shipping_country}
          onChange={handleChange}
          error={!!errors.shipping_country}
          helperText={errors.shipping_country}
          required
        />
      </Box>

      <FormControlLabel
        control={
          <Checkbox
            name="same_billing_shipping"
            checked={userInfo.same_billing_shipping}
            onChange={handleChange}
          />
        }
        label="Same billing address"
        sx={{ mb: 2 }}
      />

      {!userInfo.same_billing_shipping && (
        <>
          <Typography variant="h6" gutterBottom>Billing Address</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
            <TextField
              label="Street"
              name="billing_street"
              value={userInfo.billing_street}
              onChange={handleChange}
              error={!!errors.billing_street}
              helperText={errors.billing_street}
              required
              sx={{ gridColumn: 'span 2' }}
            />
            <TextField
              label="City"
              name="billing_city"
              value={userInfo.billing_city}
              onChange={handleChange}
              error={!!errors.billing_city}
              helperText={errors.billing_city}
              required
            />
            <TextField
              label="State/Province"
              name="billing_state"
              value={userInfo.billing_state}
              onChange={handleChange}
              error={!!errors.billing_state}
              helperText={errors.billing_state}
              required
            />
            <TextField
              label="ZIP/Postal Code"
              name="billing_zip"
              value={userInfo.billing_zip}
              onChange={handleChange}
              error={!!errors.billing_zip}
              helperText={errors.billing_zip}
              required
            />
            <TextField
              label="Country"
              name="billing_country"
              value={userInfo.billing_country}
              onChange={handleChange}
              error={!!errors.billing_country}
              helperText={errors.billing_country}
              required
            />
          </Box>
        </>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button variant="outlined" onClick={onBack}>Back</Button>
        <Button type="submit" variant="contained" color="primary">
          Continue to Delivery
        </Button>
      </Box>
    </Box>
  );
};

export default UserInfoStep;
