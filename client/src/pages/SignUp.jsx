import React, { useState } from "react";
import { api } from "../services/api";
import "./SignInOrUp.css";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");

  const interestsList = [
    "Sports",
    "Music",
    "Tech",
    "Art",
    "Gaming",
    "Science",
    "Business",
    "Food",
    "Health"
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
    if (password.length < 6)
      return "Password must be at least 6 characters";
    if (password !== confirmPassword)
      return "Passwords do not match";
    if (!agreeTerms)
      return "You must agree to the terms";
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

      // Signup success → redirect to sign in
      window.location.hash = "#/signin";
    } catch (err) {
      setError(err.message || "Sign up failed");
    }
  };

  return (
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
            placeholder="Your User name"
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

        <label
          className="signin-label"
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
          />
          <span style={{ fontSize: 13 }}>
            I agree to the terms and privacy policy
          </span>
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
      </form>
    </div>
  );
}

export default SignUp;
