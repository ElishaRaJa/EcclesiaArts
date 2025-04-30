import React, { useState } from "react";
import "./SignUp.css";
import { registerCustomer } from "../../Firebase/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/Toast";
import { getProfileCompletionMessage } from "../../utils/profileUtils";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState(""); // New state for username
    const [firstName, setFirstName] = useState(""); // New state for first name
    const [lastName, setLastName] = useState(""); // New state for last name
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError(null); // Reset error state before making the sign-up attempt

        try {
            // Call the registerCustomer function to create the user in Firebase
            await registerCustomer(email, password, username, firstName, lastName);
            showToast({
                message: "Account created successfully! " + 
                         getProfileCompletionMessage(['all']),
                type: "info",
                action: {
                    text: "Complete Profile",
                    onClick: () => navigate("/edit-profile")
                }
            });
            navigate("/"); // Redirect to home page after successful registration
        } catch (err) {
            showToast(err);
            setError("Failed to sign up. Please check your details and try again.");
        }
    };

    const [passwordError, setPasswordError] = useState(null);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const validatePassword = (pass) => {
        if (pass.length < 8) {
            setPasswordError("Password must be at least 8 characters");
            return false;
        }
        setPasswordError(null);
        return true;
    };

    const passwordRequirementsClass = password.length >= 8 ? 
        "signup__requirements valid" : "signup__requirements";

    return (
        <div className="signup-container">
            <h1 className="signup__title">Sign Up</h1>
            <form onSubmit={handleSignUp} className="signup__form">
                <div className="signup__field">
                    <input
                        className="signup__input"
                        placeholder="Username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="signup__field">
                    <input
                        className="signup__input"
                        placeholder="First Name"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>

                <div className="signup__field">
                    <input
                        className="signup__input"
                        placeholder="Last Name"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>

                <div className="signup__field">
                    <input
                        className="signup__input"
                        placeholder="Email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="signup__field">
                    <input
                        className="signup__input"
                        placeholder="Password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            validatePassword(e.target.value);
                        }}
                    />
                    <p className={passwordRequirementsClass}>
                        Must be at least 8 characters
                    </p>
                    {passwordError && (
                        <p className="signup__error">{passwordError}</p>
                    )}
                </div>

                <div className="signup__terms">
                    <input
                        type="checkbox"
                        id="terms"
                        required
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                    />
                    <label htmlFor="terms">
                        I agree to the Terms and Conditions
                    </label>
                </div>

                {error && (
                    <p className="signup__error">{error}</p>
                )}

                <button 
                    type="submit" 
                    className="signup__submit-btn"
                    disabled={passwordError || !acceptedTerms}
                >
                    Sign Up
                </button>

                <div className="signup__link">
                    Already have an account? <a href="/login">Log in</a>
                </div>
            </form>
        </div>
    );
};

export default SignUp;
