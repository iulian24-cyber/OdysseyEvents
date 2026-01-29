import React, { useState } from "react";
import { api } from "../services/api";
import "./SignInOrUp.css";
import PixelBlast from "../components/PixelBlast";
import logo from "../assets/logo.png";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    if (!email) return "Email is required";
    if (!resetCode) return "Reset code is required";
    if (!newPassword) return "New password is required";
    if (newPassword.length < 6) return "Password must be at least 6 characters";
    if (newPassword !== confirmPassword) return "Passwords do not match";
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
    setMessage("");
    setLoading(true);

    try {
      const res = await api("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          email,
          resetCode,
          newPassword
        })
      });

      setSuccess(true);
      setMessage(res.message || "Password reset successfully!");

      // Redirect to sign in after 2 seconds
      setTimeout(() => {
        window.location.hash = "#/signin";
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to reset password");
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
          <h2 className="signin-title">Create New Password</h2>

          {!success ? (
            <form onSubmit={handleSubmit} className="signin-form">
              <p style={{ marginBottom: "20px", fontSize: "14px", color: "#666" }}>
                Enter the reset code we sent to your email and choose a new password.
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

              <label className="signin-label">
                Reset Code
                <input
                  className="signin-input"
                  type="text"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder="6-digit code from email"
                  disabled={loading}
                />
              </label>

              <label className="signin-label">
                New Password
                <input
                  className="signin-input"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  disabled={loading}
                />
              </label>

              <label className="signin-label">
                Confirm Password
                <input
                  className="signin-input"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  disabled={loading}
                />
              </label>

              {error && <div className="signin-error">{error}</div>}

              <button type="submit" className="signin-button" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <a href="#/signin">Back to Sign In</a>
            </form>
          ) : (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <p style={{ color: "#4100a9", fontSize: "16px", marginBottom: "10px" }}>
                ✓ {message}
              </p>
              <p style={{ fontSize: "14px", color: "#666" }}>
                Redirecting to sign in...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
