import React, { useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./SignInOrUp.css";

function SignIn() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();

  const validate = () => {
    if (!identifier) return "Email or username is required";
    if (!password) return "Password is required";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const v = validate();
    if (v) {
      setError(v);
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
      window.location.hash = "#/home";
    } catch (err) {
      setError(err.message || "Invalid credentials");
    }
  };

  return (
    <div className="signin-container">
      <h2 className="signin-title">Sign In</h2>

      <form onSubmit={handleSubmit} className="signin-form">
        <label className="signin-label">
          Email or Username
          <input
            className="signin-input"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="email or username"
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
      </form>
    </div>
  );
}

export default SignIn;
