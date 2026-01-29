import React, { useState } from "react";
import { api } from "../services/api";
import "./SignInOrUp.css";
import PixelBlast from "../components/PixelBlast";
import logo from "../assets/logo.png";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [success, setSuccess] = useState(false);

  const validate = () => {
    if (!name.trim()) return "Name is required";
    if (!email.trim()) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Email must be valid";
    if (!message.trim()) return "Message is required";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const v = validate();
    if (v) {
      setResult(v);
      return;
    }

    setResult("");
    setLoading(true);

    try {
      const res = await api("/contact", {
        method: "POST",
        body: JSON.stringify({ name, email, message })
      });

      setSuccess(true);
      setResult(res.message || "Message sent successfully");
      setName("");
      setEmail("");
      setMessage("");

      setTimeout(() => {
        window.location.hash = "#/home";
      }, 2000);
    } catch (err) {
      setResult(err.message || "Failed to send message");
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
          <h2 className="signin-title">Contact Us</h2>

          {!success ? (
            <form onSubmit={handleSubmit} className="signin-form">
              <label className="signin-label">
                Name
                <input
                  className="signin-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  disabled={loading}
                />
              </label>

              <label className="signin-label">
                Email
                <input
                  className="signin-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  disabled={loading}
                />
              </label>

              <label className="signin-label">
                Message
                <textarea
                  className="signin-input"
                  style={{ minHeight: 120, resize: "vertical", fontFamily: "inherit" }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your message"
                  disabled={loading}
                />
              </label>

              {result && <div className="signin-error">{result}</div>}

              <button type="submit" className="signin-button" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </button>

              <a href="#/home">Back to Home</a>
            </form>
          ) : (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <p style={{ color: "#4100a9", fontSize: "16px", marginBottom: "10px" }}>
                ✓ {result}
              </p>
              <p style={{ fontSize: "14px", color: "#666" }}>
                Redirecting to home...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Contact;
