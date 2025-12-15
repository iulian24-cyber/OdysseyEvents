import "./CreateEvent.css";
import "./Home.css";
import React, { useState, useRef, useEffect } from "react";
import { api } from "../services/api";

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

  // banner preview (still UI-only)
  const [bannerPreview, setBannerPreview] = useState("");
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
      })
      .catch(() => {
        setError("Failed to load event");
      });
  }, [editId, isEdit]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      await api(isEdit ? `/events/${editId}` : "/events", {
        method: isEdit ? "PUT" : "POST",
        body: JSON.stringify({
          title,
          date,
          time,
          description,
          location,
          category,
          eventLink,
          imageUrl: bannerPreview || "https://placehold.co/600x400"
        })
      });

      window.location.hash = "#/home";
    } catch (err) {
      setError(err.message || "Failed to save event");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-event-container">
      <div className="nav_bar">
        <div className="logo">OdysseyEvents</div>
        <div className="as_nav_buttons">
          <button
            className="as_nav_button"
            onClick={() => (window.location.hash = "#/home")}
          >
            Home
          </button>
        </div>
      </div>

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
        <input type="file" accept=".jpg,.png,.jpeg" onChange={handleFileChange} />
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
                className={`interest-btn ${
                  category === item ? "selected" : ""
                }`}
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
  );
}

export default CreateEvent;
