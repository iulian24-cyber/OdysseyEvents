import "./CreateEvent.css";
import "./Home.css";
import React, { useState, useRef, useEffect } from "react";
import { api } from "../services/api";
import logo from "../assets/Odyssey Events Logo.svg";
import PixelBlast from "../components/PixelBlast";

function CreateEvent({ editId }) {
  const isEdit = Boolean(editId);

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

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [eventLink, setEventLink] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // banner preview + file
  const [bannerPreview, setBannerPreview] = useState("");
  const [bannerFile, setBannerFile] = useState(null);
  const previewRef = useRef(null);

  // 🔁 LOAD EVENT WHEN EDITING
  useEffect(() => {
    if (!isEdit) return;

    api(`/events/${editId}`)
      .then((event) => {
        setTitle(event.title);
        setDate(event.date);
        setTime(event.time);
        setDescription(event.description);
        setLocation(event.location);
        setCategory(event.category);
        setEventLink(event.eventLink || "");
        setBannerPreview(event.imageUrl || "");
        setBannerFile(null);
      })
      .catch(() => {
        setError("Failed to load event");
      });
  }, [editId, isEdit]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBannerFile(file);

    const url = URL.createObjectURL(file);
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = url;
    setBannerPreview(url);
  };

  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  const isValidUrl = (url) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validate = () => {
    if (!title.trim()) return "Event name is required";
    if (!date) return "Date is required";
    if (!time) return "Time is required";
    if (!location.trim()) return "Location is required";
    if (!description.trim()) return "Description is required";
    if (!category) return "Please select a category";
    if (!isValidUrl(eventLink)) return "Event link must be a valid URL";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("date", date);
      formData.append("time", time);
      formData.append("description", description);
      formData.append("location", location);
      formData.append("category", category);
      formData.append("eventLink", eventLink);

      // ✅ only send image if user selected one
      if (bannerFile) {
        formData.append("image", bannerFile);
      }

      await api(isEdit ? `/events/${editId}` : "/events", {
        method: isEdit ? "PUT" : "POST",
        body: formData
      });

      window.location.hash = "#/home";
    } catch (err) {
      setError(err.message || "Failed to save event");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-event-page">
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
    <div className="nav_bar">
        <div className="logo" onClick={() => (window.location.hash = "#/home")}>
          <img src={logo} alt="OdysseyEvents" />
        </div>
        <div className="nav_buttons">
          <button
            className="nav_button"
            onClick={() => (window.location.hash = "#/home")}
          >
            Home
          </button>
        </div>
      </div>
    <div className="create-event-container">
      <h2 className="create-event-title">
        {isEdit ? "Edit Event" : "Create New Event"}
      </h2>

      <form className="create-event-form" onSubmit={handleSubmit}>
        <p>Event Name</p>
        <input
          className="create-event-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <p>Date</p>
        <input
          type="date"
          className="create-event-input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <p>Time</p>
        <input
          className="create-event-input"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="18:00"
        />

        <p>Location</p>
        <input
          className="create-event-input"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <p>Description</p>
        <textarea
          className="create-event-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <p>Event link (optional)</p>
        <input
          className="create-event-input"
          value={eventLink}
          onChange={(e) => setEventLink(e.target.value)}
          placeholder="https://example.com"
        />

        <p>Banner Photo (optional)</p>
        <input
          type="file"
          accept=".jpg,.png,.jpeg,.webp"
          onChange={handleFileChange}
        />
        {bannerPreview && (
          <img src={bannerPreview} alt="Preview" className="banner-preview" />
        )}

        <p>Select category</p>
        <div className="interest-box">
          <div className="interest-buttons">
            {categories.map((item) => (
              <button
                type="button"
                key={item}
                className={`interest-btn ${category === item ? "selected" : ""}`}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="signin-error">{error}</div>}

        <button
          type="submit"
          className="create-event-submit-btn"
          disabled={submitting}
        >
          {submitting
            ? isEdit
              ? "Updating…"
              : "Creating…"
            : isEdit
            ? "Update Event"
            : "Create Event"}
        </button>
      </form>
    </div>
  </div>
  );
}

export default CreateEvent;
