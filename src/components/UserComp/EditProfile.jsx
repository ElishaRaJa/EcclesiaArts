import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Firebase/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../Firebase/firebaseConfig';
import { Box, Typography, TextField, Button, Checkbox, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

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

const EditProfile = () => {
    const { user, currentUser } = useAuth();
    const [userInfo, setUserInfo] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        shipping_street: '',
        shipping_city: '',
        shipping_state: '',
        shipping_zip: '',
        shipping_country: 'South Africa',
        billing_street: '',
        billing_city: '',
        billing_state: '',
        billing_zip: '',
        billing_country: 'South Africa',
        same_billing_shipping: true,
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setUserInfo({
                        username: data.username || '',
                        first_name: data.first_name || '',
                        last_name: data.last_name || '',
                        email: data.email || '',
                        phone_number: data.phone_number || '',
                        shipping_street: data.shipping_address?.street_address || '',
                        shipping_city: data.shipping_address?.city || '',
                        shipping_state: data.shipping_address?.zone || '',
                        shipping_zip: data.shipping_address?.code || '',
                        shipping_country: data.shipping_address?.country || 'South Africa',
                        billing_street: data.billing_address?.street_address || null, // Ensure null for initial load
                        billing_city: data.billing_address?.city || null,           // Ensure null
                        billing_state: data.billing_address?.zone || null,          // Ensure null
                        billing_zip: data.billing_zip || null,            // Ensure null
                        billing_country: data.billing_address?.country || 'South Africa', // Ensure "South Africa"
                        same_billing_shipping: data.same_billing_shipping !== undefined ? data.same_billing_shipping : true,
                    });
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setSaveError('Failed to load profile data.');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchUserData();
        } else {
            navigate('/login');
        }
    }, [user, navigate]);

    const validatePhone = (phone) => {
        return phone.match(/^\+27[0-9]{9}$/);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserInfo(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!userInfo.first_name) newErrors.first_name = 'Required';
        if (!userInfo.last_name) newErrors.last_name = 'Required';

        // Phone validation for Bob Go
        if (!userInfo.phone_number) {
            newErrors.phone_number = 'Required';
        } else if (!validatePhone(userInfo.phone_number)) {
            newErrors.phone_number = 'Must be +27 followed by 9 digits';
        }

        // Address validation for Bob Go
        if (!userInfo.shipping_street) newErrors.shipping_street = 'Required';
        if (!userInfo.shipping_city) newErrors.shipping_city = 'Required';
        if (!userInfo.shipping_state) {
            newErrors.shipping_state = 'Required';
        } else if (!PROVINCES.includes(userInfo.shipping_state)) {
            newErrors.shipping_state = 'Must be a valid South African province';
        }
        if (!userInfo.shipping_zip) newErrors.shipping_zip = 'Required';
        if (!userInfo.shipping_country || userInfo.shipping_country !== 'South Africa') {
            newErrors.shipping_country = 'Must be "South Africa"';
        }

        if (!userInfo.same_billing_shipping) {
            if (!userInfo.billing_street) newErrors.billing_street = 'Required';
            if (!userInfo.billing_city) newErrors.billing_city = 'Required';
            if (!userInfo.billing_state) {
                newErrors.billing_state = 'Required';
            } else if (!PROVINCES.includes(userInfo.billing_state)) {
                newErrors.billing_state = 'Must be a valid South African province';
            }
            if (!userInfo.billing_zip) newErrors.billing_zip = 'Required';
            if (!userInfo.billing_country || userInfo.billing_country !== 'South Africa') {
                newErrors.billing_country = 'Must be "South Africa"';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSaveLoading(true);
        setSaveError(null);
        try {
            const userRef = doc(db, 'users', user.uid);
            const updateData = {
                username: userInfo.username,
                first_name: userInfo.first_name,
                last_name: userInfo.last_name,
                phone_number: userInfo.phone_number,
                shipping_address: {
                    street_address: userInfo.shipping_street,
                    city: userInfo.shipping_city,
                    zone: userInfo.shipping_state,
                    code: userInfo.shipping_zip,
                    country: userInfo.shipping_country,
                },
                same_billing_shipping: userInfo.same_billing_shipping,
            };

            if (userInfo.same_billing_shipping) {
                updateData.billing_address = { // setting billing address same as shipping.
                    street_address: userInfo.shipping_street,
                    city: userInfo.shipping_city,
                    zone: userInfo.shipping_state,
                    code: userInfo.shipping_zip,
                    country: userInfo.shipping_country,
                };
            } else {
                updateData.billing_address = { // different billing address.
                    street_address: userInfo.billing_street,
                    city: userInfo.billing_city,
                    zone: userInfo.billing_state,
                    code: userInfo.billing_zip,
                    country: userInfo.billing_country,
                };
            }
            await updateDoc(userRef, updateData);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            setSaveError('Failed to update profile');
            console.error(error);
        } finally {
            setSaveLoading(false);
        }
    };

    if (loading) return <Box>Loading...</Box>;

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>Edit Profile</Typography>

            {saveError && <Alert severity="error" sx={{ mb: 2 }}>{saveError}</Alert>}
            {saveSuccess && <Alert severity="success" sx={{ mb: 2 }}>Profile updated!</Alert>}

            <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
                <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={userInfo.username}
                    onChange={handleChange}
                    margin="normal"
                    required
                    disabled
                />
                <TextField
                    fullWidth
                    label="First Name"
                    name="first_name"
                    value={userInfo.first_name}
                    onChange={handleChange}
                    margin="normal"
                    required
                    error={!!errors.first_name}
                    helperText={errors.first_name}
                />
                <TextField
                    fullWidth
                    label="Last Name"
                    name="last_name"
                    value={userInfo.last_name}
                    onChange={handleChange}
                    margin="normal"
                    required
                    error={!!errors.last_name}
                    helperText={errors.last_name}
                />
                <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={userInfo.email}
                    onChange={handleChange}
                    margin="normal"
                    required
                    disabled
                />
                <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone_number"
                    value={userInfo.phone_number}
                    onChange={handleChange}
                    margin="normal"
                    required
                    error={!!errors.phone_number}
                    helperText={errors.phone_number}
                />

                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Shipping Address</Typography>
                <TextField
                    fullWidth
                    label="Street Address"
                    name="shipping_street"
                    value={userInfo.shipping_street}
                    onChange={handleChange}
                    margin="normal"
                    required
                    error={!!errors.shipping_street}
                    helperText={errors.shipping_street}
                />
                <TextField
                    fullWidth
                    label="City"
                    name="shipping_city"
                    value={userInfo.shipping_city}
                    onChange={handleChange}
                    margin="normal"
                    required
                    error={!!errors.shipping_city}
                    helperText={errors.shipping_city}
                />
                <TextField
                    fullWidth
                    label="Province"
                    name="shipping_state"
                    select
                    value={userInfo.shipping_state}
                    onChange={handleChange}
                    margin="normal"
                    required
                    error={!!errors.shipping_state}
                    helperText={errors.shipping_state}
                >
                    {PROVINCES.map((province) => (
                        <option key={province} value={province}>{province}</option>
                    ))}
                </TextField>
                <TextField
                    fullWidth
                    label="Zip Code"
                    name="shipping_zip"
                    value={userInfo.shipping_zip}
                    onChange={handleChange}
                    margin="normal"
                    required
                    error={!!errors.shipping_zip}
                    helperText={errors.shipping_zip}
                />
                <TextField
                    fullWidth
                    label="Country"
                    name="shipping_country"
                    value={userInfo.shipping_country}
                    onChange={handleChange}
                    margin="normal"
                    required
                    disabled
                    error={!!errors.shipping_country}
                    helperText={errors.shipping_country}
                />

                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                    <Checkbox
                        name="same_billing_shipping"
                        checked={userInfo.same_billing_shipping}
                        onChange={handleChange}
                    />
                    Billing Address
                </Typography>
                {!userInfo.same_billing_shipping && (
                    <>
                        <TextField
                            fullWidth
                            label="Street Address"
                            name="billing_street"
                            value={userInfo.billing_street}
                            onChange={handleChange}
                            margin="normal"
                            required
                            error={!!errors.billing_street}
                            helperText={errors.billing_street}
                        />
                        <TextField
                            fullWidth
                            label="City"
                            name="billing_city"
                            value={userInfo.billing_city}
                            onChange={handleChange}
                            margin="normal"
                            required
                            error={!!errors.billing_city}
                            helperText={errors.billing_city}
                        />
                        <TextField
                            fullWidth
                            label="Province"
                            name="billing_state"
                            select
                            value={userInfo.billing_state}
                            onChange={handleChange}
                            margin="normal"
                            required
                            error={!!errors.billing_state}
                            helperText={errors.billing_state}
                        >
                            {PROVINCES.map((province) => (
                                <option key={province} value={province}>{province}</option>
                            ))}
                        </TextField>
                        <TextField
                            fullWidth
                            label="Zip Code"
                            name="billing_zip"
                            value={userInfo.billing_zip}
                            onChange={handleChange}
                            margin="normal"
                            required
                            error={!!errors.billing_zip}
                            helperText={errors.billing_zip}
                        />
                        <TextField
                            fullWidth
                            label="Country"
                            name="billing_country"
                            value={userInfo.billing_country}
                            onChange={handleChange}
                            margin="normal"
                            required
                            disabled
                            error={!!errors.billing_country}
                            helperText={errors.billing_country}
                        />
                    </>
                )}

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={saveLoading}
                    sx={{ mt: 2 }}
                >
                    {saveLoading ? 'Saving...' : 'Save Profile'}
                </Button>
            </Box>

        </Box>
    );
};

export default EditProfile;
