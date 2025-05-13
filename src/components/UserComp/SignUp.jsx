import React, { useState } from "react";
import "./SignUp.css";
import { registerCustomer } from "../../Firebase/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/Toast";
import { getProfileCompletionMessage } from "../../utils/profileUtils";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            // 1. Simulate user creation
            console.log("Simulated User Registration:", { email, username, firstName, lastName });
            const simulatedUser = { uid: "simulated-user-id" };

            // 2. Simulate Firestore document creation
            const registrationDate = new Date();
            const customerData = {
                first_name: firstName,
                last_name: lastName,
                email: email,
                phone_number: null,
                user_id: simulatedUser.uid, // Use simulated user ID
                registration_date: registrationDate,
                billing_address: null,
                shipping_address: {
                    company: "",
                    street_address: "",
                    local_area: "",
                    city: "",
                    zone: "",
                    country: "ZA",
                    code: "",
                },
                order_history: [],
                current_orders: [],
                username: username,
                same_billing_shipping: false,
            };
            console.log("Simulated Firestore Document Creation:", customerData);


            alert("Account created successfully! (Simulated). Please complete your profile.");
            navigate("/edit-profile");
        } catch (err) {
            console.error("Simulated Error:", err);
            setError("Failed to sign up. Please check your details and try again. (Simulated)");
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

    const passwordRequirementsClass = password.length >= 8
        ? "signup__requirements valid"
        : "signup__requirements";

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