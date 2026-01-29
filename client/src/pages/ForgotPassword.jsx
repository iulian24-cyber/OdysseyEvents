import React, { useState } from "react";
import { api } from "../services/api";
import "./SignInOrUp.css";
import PixelBlast from "../components/PixelBlast";
import logo from "../assets/logo.png";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await api("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email })
      });

      setMessage(res.message || "If that email exists, a reset code has been sent");
      setSubmitted(true);

      // Redirect to reset password page after 2 seconds
      setTimeout(() => {
        window.location.hash = "#/reset-password";
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to process request");
    } finally {
      setLoading(false);
    }
  };

  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768;

  return (
    <div className="auth-page">
      {!isMobile && (
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
          className="home-pixelblast"
        />
      )}

      <div className="auth-content">
        <div className="logo-container">
          <img src={logo} alt="App Logo" className="auth-logo" />
        </div>

        <div className="signin-container">
          <h2 className="signin-title">Reset Your Password</h2>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="signin-form">
              <p style={{ marginBottom: "20px", fontSize: "14px", color: "#666" }}>
                Enter the email address associated with your account, and we'll send you a reset code.
              </p>

              <label className="signin-label">
                Email
                <input
                  className="signin-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </label>

              {error && <div className="signin-error">{error}</div>}

              <button type="submit" className="signin-button" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Code"}
              </button>

              <a href="#/signin">Back to Sign In</a>
            </form>
          ) : (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <p style={{ color: "#4100a9", fontSize: "16px", marginBottom: "10px" }}>
                ✓ {message}
              </p>
              <p style={{ fontSize: "14px", color: "#666" }}>
                Redirecting to reset password...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
