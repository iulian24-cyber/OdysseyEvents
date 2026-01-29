import React, { useState } from "react";
import { api } from "../services/api";
import "./SignInOrUp.css";
import PixelBlast from "../components/PixelBlast";
import logo from "../assets/logo.png";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const interestsList = [
    "Music",
    "Sports",
    "Technology",
    "Art",
    "Food",
    "Cinema",
    "Wellness",
    "Photography"
  ];

  const [interests, setInterests] = useState([]);

  const toggleInterest = (item) => {
    setInterests((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  const validate = () => {
    if (!name.trim()) return "Name is required";
    if (!email) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Enter a valid email";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password !== confirmPassword) return "Passwords do not match";
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
      await api("/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          username: name,
          email,
          password,
          categories: interests
        })
      });

      // Go to sign-in; App will prevent going back into protected areas if logged out
      window.location.hash = "#/signin";
    } catch (err) {
      setError(err.message || "Sign up failed");
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
          <h2 className="signin-title">Create an account</h2>

          <form onSubmit={handleSubmit} className="signin-form">
            <label className="signin-label">
              User name
              <input
                className="signin-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your user name"
              />
            </label>

            <label className="signin-label">
              Email
              <input
                className="signin-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </label>

            <label className="signin-label">
              Password
              <input
                className="signin-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
              />
            </label>

            <label className="signin-label">
              Confirm password
              <input
                className="signin-input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
              />
            </label>

            <div className="interest-box">
              <div className="interest-label">Select interests</div>

              <div className="interest-buttons">
                {interestsList.map((item) => (
                  <button
                    type="button"
                    key={item}
                    className={`interest-btn ${
                      interests.includes(item) ? "selected" : ""
                    }`}
                    onClick={() => toggleInterest(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="interest-hint">
                You can select multiple interests
              </div>
            </div>

            {error && <div className="signin-error">{error}</div>}

            <button type="submit" className="signin-button">
              Create account
            </button>

            <a href="#/signin">Already have an account? Sign In</a>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
