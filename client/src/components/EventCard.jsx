import React from "react";
import "../pages/Home.css";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

export default function EventCard({ event }) {
    console.log("EVENT RECEIVED BY CARD:", event);

    const { user } = useAuth();
    const {
        _id,
        title,
        date,
        time,
        imageUrl,
        category,
        description,
        eventLink
    } = event;

    return (
        <article className="event-card" tabIndex="0" aria-labelledby={`title-${_id}`}>
            <div className="event-image">
                {imageUrl ? (
                    <img src={imageUrl} alt={title} />
                ) : (
                    <div className="placeholder">Image</div>
                )}
            </div>

            <div className="event-meta">
                <h3 id={`title-${_id}`} className="event-title">
                    {title}
                </h3>
                <div className="event-info">
                    {date} • {time}
                </div>
                <div className="event-subject">{category}</div>
            </div>

            <div className="event-description">
                <div className="desc-container">
                    <div className="desc-inner">
                        {description || "No description available."}
                    </div>
                </div>

                {eventLink && (
                    <div className="desc-actions">
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
                        <button
                            className="join-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(eventLink, "_blank", "noopener,noreferrer");
                            }}
                        >
                            Check out event
                        </button>
                    </div>
                )}
            </div>
        </article>
    );
}
