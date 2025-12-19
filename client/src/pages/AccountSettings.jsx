import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import "./AccountSettings.css";
import logo from "../assets/Odyssey Events Logo.svg";
import PixelBlast from "../components/PixelBlast.jsx";


function AccountSettings() {
  const { user, login } = useAuth();

  // canonical categories
  const categories = [
    "Music",
    "Sports",
    "Technology",
    "Art",
    "Food",
    "Cinema",
    "Wellness",
    "Photography"
  ];

  // form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [preferredCategories, setPreferredCategories] = useState([]);
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // prefill from user
  useEffect(() => {
    if (!user) return;
    setUsername(user.username || "");
    setEmail(user.email || "");
    setPreferredCategories(user.preferredCategories || []);
  }, [user]);

  const toggleCategory = (cat) => {
    setPreferredCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const validate = () => {
    if (!username.trim()) return "Username is required";
    if (!email.trim()) return "Email is required";
    if (newPassword || confirmPassword) {
      if (newPassword.length < 6) return "Password must be at least 6 characters";
      if (newPassword !== confirmPassword) return "Passwords do not match";
    }
    return "";
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setMessage({ type: "error", text: v });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const payload = { username, email, preferredCategories };
      if (newPassword) payload.password = newPassword;

      const updatedUser = await api("/auth/me", {
        method: "PUT",
        body: JSON.stringify(payload)
      });

      login(localStorage.getItem("token"), updatedUser);

      setNewPassword("");
      setConfirmPassword("");
      setMessage({ type: "success", text: "Account updated successfully" });
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to update account" });
    } finally {
      setSubmitting(false);
    }
  };

  // account panel state
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        open &&
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Detect mobile device (simple + effective)
  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768;

  return (
    <div className="account-page">
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
      {/* Navbar */}
      <div className="nav_bar">
        <div className="logo" onClick={() => (window.location.hash = "#/home")}>
          <img src={logo} alt="OdysseyEvents" />
        </div>

        <div className="nav_buttons">
          <button
            className={`nav_button`}
            onClick={() => (window.location.hash = "#/home")}
          >
            Home
          </button>
        </div>

        <button
          className="account_button"
          ref={btnRef}
          aria-expanded={open}
          aria-controls="account-panel"
          onClick={() => setOpen((v) => !v)}
        >
          {user?.username?.charAt(0).toUpperCase()}
        </button>

        {/* Account Panel */}
        <div
          id="account-panel"
          ref={panelRef}
          className={`account_panel ${open ? "open" : ""}`}
          role="menu"
          aria-hidden={!open}
        >
          <button
            className="account_item"
            onClick={() => {
              window.location.hash = "#/account";
              setOpen(false);
            }}
          >
            My profile
          </button>

          {user?.role === "moderator" && (
            <button
              className="account_item add"
              onClick={() => {
                window.location.hash = "#/create";
                setOpen(false);
              }}
            >
              Add event
            </button>
          )}

          <hr />

          <button
            className="account_item logout"
            onClick={() => {
              window.location.hash = "#/signin";
            }}
          >
            Log out
          </button>
        </div>
      </div>

      {/* Account Settings Form */}
      <div className="account-container">
        <h2 className="account-title">Account Settings</h2>

        <div className="interest-box">
          <div className="interest-label">Preferred categories</div>
          <div className="interest-buttons">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`interest-btn ${
                  preferredCategories.includes(cat) ? "selected" : ""
                }`}
                onClick={() => toggleCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleUpdate} className="account-form">
          <label className="account-label">
            Username
            <input
              className="account-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          <label className="account-label">
            Email
            <input
              className="account-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="account-label">
            New password
            <input
              className="account-input"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Leave empty to keep current password"
            />
          </label>

          <label className="account-label">
            Confirm new password
            <input
              className="account-input"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>

          {message && (
            <div
              className={`account-message ${
                message.type === "success" ? "success" : "error"
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            className="account-submit-btn"
            disabled={submitting}
          >
            {submitting ? "Updating…" : "Update Settings"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AccountSettings;
