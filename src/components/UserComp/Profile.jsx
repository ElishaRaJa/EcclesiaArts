// src/Pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import "./Profile.css";
import { useAuth } from "../../Firebase/AuthContext";
import { db } from "../../Firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom"; // Import Link

const Profile = () => {
    const { user, loading } = useAuth();
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const fetchUserData = async () => {
                try {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUserInfo(docSnap.data());
                    } else {
                        console.log("No such document!");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            };
            fetchUserData();
        } else {
            navigate("/login");
        }
    }, [user, navigate]);

    const handleLogout = () => {
        // Logout functionality here
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            {userInfo ? (
                <>
                    <h1 className="profile__title">Profile</h1>
                    <div className="profile__info">
                        <p className="profile__info-item">
                            <span className="profile__info-label">Username:</span>
                            {userInfo.username}
                        </p>
                        <p className="profile__info-item">
                            <span className="profile__info-label">First Name:</span>
                            {userInfo.first_name}
                        </p>
                        <p className="profile__info-item">
                            <span className="profile__info-label">Last Name:</span>
                            {userInfo.last_name}
                        </p>
                        <p className="profile__info-item">
                            <span className="profile__info-label">Email:</span>
                            {userInfo.email}
                        </p>
                        <p className="profile__info-item">
                            <span className="profile__info-label">Phone:</span>
                            {userInfo.phone_number || "Not provided"}
                        </p>
                        <p className="profile__info-item">
                            <span className="profile__info-label">Address:</span>
                            {userInfo.shipping_address ? `${userInfo.shipping_address.street}, ${userInfo.shipping_address.city}, ${userInfo.shipping_address.state} ${userInfo.shipping_address.zip}, ${userInfo.shipping_address.country}` : "Not provided"}
                        </p>
                    </div>
                    <div className="profile__actions">
                        <Link to="/edit-profile" className="profile__link">Update Details</Link>
                        <Link to="/my-orders" className="profile__link">My Orders</Link>
                        <button className="profile__btn" onClick={handleLogout}>Logout</button>
                    </div>
                </>
            ) : (
                <p>Loading user information...</p>
            )}
        </div>
    );
};

export default Profile;
