import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CompStyle/Navbar.css';
import { useAuth } from "../Firebase/AuthContext";

const Navbar = ({ onLogout }) => {
    const { user, role, loading } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        onLogout();
        setMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <nav className="navbar">
            <button 
                className="menu-button"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
            >
                ☰
            </button>

            <div className="navbar__brand">EcclesiaArt</div>

            <div className={`navbar__main ${mobileMenuOpen ? 'active' : ''}`}>
                <div className="navbar__links">
                    <Link 
                        className="navbar__link" 
                        to="/"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <Link 
                        className="navbar__link" 
                        to="/artworks"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Artworks
                    </Link>
                    <Link 
                        className="navbar__link" 
                        to="/about"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        About
                    </Link>
                    <Link 
                        className="navbar__link" 
                        to="/contact"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Contact
                    </Link>
                    {role === 'admin' && (
                        <Link 
                            className="navbar__link" 
                            to="/admin"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Admin
                        </Link>
                    )}
                </div>

                <div className="user-section">
                    <div className="user-links">
                        {user ? (
                            <>
                                <span className="user-name">Hello, {user.displayName || 'User'}!</span>
                                {role && <span className="user-role">({role})</span>}
                                <Link 
                                    to="/profile" 
                                    className="navbar__link"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Profile
                                </Link>
                                <button 
                                    className="navbar__button" 
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link 
                                    to="/login" 
                                    className="navbar__link"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/signup" 
                                    className="navbar__link"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Signup
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
