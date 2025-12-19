import React, { useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./SignInOrUp.css";
import PixelBlast from "../components/PixelBlast";
import logo from "../assets/logo.png";

function SignIn() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();

  const validate = () => {
    if (!identifier) return "Email or Username is required";
    if (!password) return "Password is required";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");

    try {
      const res = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          identifier,
          password
        })
      });

      login(res.token, res.user);

      // Normal hash navigation – App.jsx will protect routes
      window.location.hash = "#/home";
    } catch (err) {
      setError(err.message || "Invalid credentials");
    }
  };

  return (
    <div className="auth-page">
      <PixelBlast
        variant="triangle"
        pixelSize={15}
        color="#4100a9"
        patternScale={25}
        patternDensity={1.2}
        pixelSizeJitter={0.5}
        enableRipples
        rippleSpeed={0.4}
        rippleThickness={0.12}
        rippleIntensityScale={1.5}
        liquid
        liquidStrength={0.12}
        liquidRadius={1.2}
        liquidWobbleSpeed={5}
        speed={0.6}
        edgeFade={0.1}
        transparent
      />

      <div className="auth-content">
        <div className="logo-container">
          <img src={logo} alt="App Logo" className="auth-logo" />
        </div>

        <div className="signin-container">
          <h2 className="signin-title">Sign In to OdysseyEvents</h2>

          <form onSubmit={handleSubmit} className="signin-form">
            <label className="signin-label">
              Email or Username
              <input
                className="signin-input"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Email or Username"
              />
            </label>

            <label className="signin-label">
              Password
              <input
                className="signin-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </label>

            {error && <div className="signin-error">{error}</div>}

            <button type="submit" className="signin-button">
              Sign In
            </button>

            <a href="#/signup">Don't have an account? Sign Up</a>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
