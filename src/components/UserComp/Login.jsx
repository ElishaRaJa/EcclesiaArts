import React, { useState } from "react";
import "./Login.css";
import { loginUser } from "../../Firebase/auth";
import { useAuth } from "../../Firebase/AuthContext";
import { useToast } from "../ui/Toast";
import { useNavigate } from "react-router-dom";  // For navigation after login

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { user, role, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();  // To navigate after login

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);  // Reset error state before making the login attempt

    try {
      // Call the loginUser function to authenticate with Firebase
      await loginUser(email, password);
      navigate("/");  // Redirect to home page after login
    } catch (err) {
      showToast(err);
      setError("Failed to log in. Please check your credentials.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;  // Show a loading message while Firebase is checking the user's authentication state
  }

  if (user) {
    // If user is already logged in, navigate to dashboard or home
    navigate("/");
  }

  return (
    <div className="login-container">
      <h1 className="login__title">Login</h1>
      <form onSubmit={handleLogin} className="login__form">
        <div className="login__field">
          <input
            className="login__input"
            placeholder="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className="login__field">
          <input
            className="login__input"
            placeholder="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="login__link">
            <a href="/forgot-password">Forgot password?</a>
          </div>
        </div>

        {error && (
          <p className="login__error">{error}</p>
        )}

        <button type="submit" className="login__submit-btn">
          Login
        </button>

        <div className="login__link">
          Don't have an account? <a href="/signup">Create one</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
