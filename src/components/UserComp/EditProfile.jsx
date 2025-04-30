// src/Pages/EditProfile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Firebase/AuthContext';
import { db } from '../../Firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { editUserDetails } from '../../Firebase/userManagement';
import './EditProfile.css'
const EditProfile = () => {
    const { user, loading } = useAuth();
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
        shipping_country: '',
        billing_street: '',
        billing_city: '',
        billing_state: '',
        billing_zip: '',
        billing_country: '',
        same_billing_shipping: true,
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const fetchUserData = async () => {
                try {
                    const docRef = doc(db, 'users', user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setUserInfo({
                            username: data.username,
                            first_name: data.first_name,
                            last_name: data.last_name,
                            email: data.email,
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
                    } else {
                        console.log('No such document!');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };
            fetchUserData();
        } else {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserInfo((prevUserInfo) => ({
            ...prevUserInfo,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!userInfo.username) newErrors.username = 'Username is required';
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        console.log("Data being sent to editUserDetails:", userInfo);
        try {
            await editUserDetails(user.uid, userInfo);
            alert('Profile updated successfully!');
            navigate('/profile');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="edit-profile">
            <h1 className="edit-profile__title">Edit Profile</h1>
            <form onSubmit={handleSubmit} className="edit-profile__form">
                <div className="edit-profile__section">
                    <label className="edit-profile__label">Username:</label>
                    <input type="text" name="username" value={userInfo.username} onChange={handleChange} 
                           className="edit-profile__input" required />
                    {errors.username && <p className="edit-profile__error">{errors.username}</p>}
                </div>

                <div className="edit-profile__section">
                    <label className="edit-profile__label">First Name:</label>
                    <input type="text" name="first_name" value={userInfo.first_name} onChange={handleChange} 
                           className="edit-profile__input" required />
                    {errors.first_name && <p className="edit-profile__error">{errors.first_name}</p>}
                </div>

                <div className="edit-profile__section">
                    <label className="edit-profile__label">Last Name:</label>
                    <input type="text" name="last_name" value={userInfo.last_name} onChange={handleChange} 
                           className="edit-profile__input" required />
                    {errors.last_name && <p className="edit-profile__error">{errors.last_name}</p>}
                </div>

                <div className="edit-profile__section">
                    <label className="edit-profile__label">Email:</label>
                    <input type="email" name="email" value={userInfo.email} onChange={handleChange} 
                           className="edit-profile__input" disabled />
                </div>

                <div className="edit-profile__section">
                    <label className="edit-profile__label">Phone Number:</label>
                    <input type="text" name="phone_number" value={userInfo.phone_number} onChange={handleChange} 
                           className="edit-profile__input" required />
                    {errors.phone_number && <p className="edit-profile__error">{errors.phone_number}</p>}
                </div>

                <div className="edit-profile__section">
                    <h3 className="edit-profile__subtitle">Shipping Address</h3>
                    <label className="edit-profile__label">Street:</label>
                    <input type="text" name="shipping_street" value={userInfo.shipping_street} onChange={handleChange} 
                           className="edit-profile__input" required />
                    {errors.shipping_street && <p className="edit-profile__error">{errors.shipping_street}</p>}

                    <label className="edit-profile__label">City:</label>
                    <input type="text" name="shipping_city" value={userInfo.shipping_city} onChange={handleChange} 
                           className="edit-profile__input" required />
                    {errors.shipping_city && <p className="edit-profile__error">{errors.shipping_city}</p>}

                    <label className="edit-profile__label">State:</label>
                    <input type="text" name="shipping_state" value={userInfo.shipping_state} onChange={handleChange} 
                           className="edit-profile__input" required />
                    {errors.shipping_state && <p className="edit-profile__error">{errors.shipping_state}</p>}

                    <label className="edit-profile__label">Zip:</label>
                    <input type="text" name="shipping_zip" value={userInfo.shipping_zip} onChange={handleChange} 
                           className="edit-profile__input" required />
                    {errors.shipping_zip && <p className="edit-profile__error">{errors.shipping_zip}</p>}

                    <label className="edit-profile__label">Country:</label>
                    <input type="text" name="shipping_country" value={userInfo.shipping_country} onChange={handleChange} 
                           className="edit-profile__input" required />
                    {errors.shipping_country && <p className="edit-profile__error">{errors.shipping_country}</p>}
                </div>

                <div className="edit-profile__section">
                    <label className="edit-profile__label">
                        Same Billing Address:
                        <input type="checkbox" name="same_billing_shipping" checked={userInfo.same_billing_shipping} 
                               onChange={handleChange} className="edit-profile__checkbox" />
                    </label>
                </div>

                {!userInfo.same_billing_shipping && (
                    <div className="edit-profile__section">
                        <h3 className="edit-profile__subtitle">Billing Address</h3>
                        <label className="edit-profile__label">Street:</label>
                        <input type="text" name="billing_street" value={userInfo.billing_street} onChange={handleChange} 
                               className="edit-profile__input" required />
                        {errors.billing_street && <p className="edit-profile__error">{errors.billing_street}</p>}

                        <label className="edit-profile__label">City:</label>
                        <input type="text" name="billing_city" value={userInfo.billing_city} onChange={handleChange} 
                               className="edit-profile__input" required />
                        {errors.billing_city && <p className="edit-profile__error">{errors.billing_city}</p>}

                        <label className="edit-profile__label">State:</label>
                        <input type="text" name="billing_state" value={userInfo.billing_state} onChange={handleChange} 
                               className="edit-profile__input" required />
                        {errors.billing_state && <p className="edit-profile__error">{errors.billing_state}</p>}

                        <label className="edit-profile__label">Zip:</label>
                        <input type="text" name="billing_zip" value={userInfo.billing_zip} onChange={handleChange} 
                               className="edit-profile__input" required />
                        {errors.billing_zip && <p className="edit-profile__error">{errors.billing_zip}</p>}

                        <label className="edit-profile__label">Country:</label>
                        <input type="text" name="billing_country" value={userInfo.billing_country} onChange={handleChange} 
                               className="edit-profile__input" required />
                        {errors.billing_country && <p className="edit-profile__error">{errors.billing_country}</p>}
                    </div>
                )}

                <button type="submit" className="edit-profile__submit">Save Changes</button>
            </form>
        </div>
    );
};

export default EditProfile;
