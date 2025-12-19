import React, { useState, useEffect } from "react";
import "../pages/Home.css";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

export default function EventCard({ event }) {
  const { user } = useAuth();

  const { _id, title, date, time, imageUrl, category, description, eventLink } = event;

  // Detect mobile device
  const isMobile = window.innerWidth <= 768;

  // Whether the action overlay is visible on mobile
  const [showActions, setShowActions] = useState(false);

  // Tap outside to close on mobile
  useEffect(() => {
    if (!isMobile || !showActions) return;

    const handleOutside = (e) => {
      if (!e.target.closest(`#event-${_id}`)) {
        setShowActions(false);
      }
    };

    document.addEventListener("click", handleOutside);
    return () => document.removeEventListener("click", handleOutside);
  }, [showActions, isMobile, _id]);

  return (
    <article
      id={`event-${_id}`}
      className={`event-card ${showActions ? "mobile-show" : ""}`}
      tabIndex="0"
      onClick={() => {
        if (isMobile && !showActions) {
          // First tap: show overlay only
          setShowActions(true);
        }
      }}
    >
      {/* IMAGE */}
      <div className="event-image">
        {imageUrl ? (
          <img src={imageUrl} alt={title} loading="lazy" />
        ) : (
          <div className="placeholder">Image</div>
        )}
      </div>

      {/* META */}
      <div className="event-meta">
        <h3 className="event-title">{title}</h3>
        <div className="event-info">{date} • {time}</div>
        <div className="event-subject">{category}</div>
      </div>

      {/* OVERLAY DESCRIPTION + BUTTONS */}
      <div className="event-description">
        <div className="desc-container">
          <div className="desc-inner">
            {description || "No description available."}
          </div>
        </div>

        <div className="desc-actions">
          {/* Moderator only actions */}
          {user?.role === "moderator" && (
            <div className="moderator-actions">
              <button
                className="edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.hash = `#/edit/${_id}`;
                }}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={async (e) => {
                  e.stopPropagation();
                  if (!window.confirm("Delete this event?")) return;
                  await api(`/events/${_id}`, { method: "DELETE" });
                  window.location.reload();
                }}
              >
                Delete
              </button>
            </div>
          )}

          {/* Event link */}
          {eventLink && (
            <button
              className="join-btn"
              onClick={(e) => {
                e.stopPropagation();
                window.open(eventLink, "_blank", "noopener,noreferrer");
              }}
            >
              Check out event
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
