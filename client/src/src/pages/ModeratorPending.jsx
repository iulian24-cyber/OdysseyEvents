import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import "./Home.css";
import logo from "../assets/Odyssey Events Logo.svg";
import PixelBlast from "../components/PixelBlast";

function ModeratorPending() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPending = async () => {
    try {
      const res = await api("/events/pending");
      setEvents(res);
    } catch (err) {
      setError(err.message || "Failed to load pending events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api(`/events/${id}/approve`, { method: "POST" });
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      setError(err.message || "Failed to approve event");
    }
  };

  const handleDecline = async (id) => {
    try {
      await api(`/events/${id}`, { method: "DELETE" });
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      setError(err.message || "Failed to decline event");
    }
  };

  if (loading) return <div>Loading pending events...</div>;

  return (
    <div className="create-event-page pending-page">
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
          <button className="nav_button" onClick={() => (window.location.hash = "#/home")}>
            Home
          </button>
        </div>
      </div>

      <div className="create-event-container">
        <h2 className="create-event-title">Pending Submissions</h2>
        {error && <div className="signin-error">{error}</div>}

        {events.length === 0 ? (
          <p>No pending events.</p>
        ) : (
          <div className="events-list">
            {events.map((ev) => (
              <div className="event-card" key={ev._id}>
                <h3>{ev.title}</h3>
                  {ev.imageUrl && (
                    <div style={{ margin: '10px 0' }}>
                      <img
                        src={ev.imageUrl}
                        alt="Event banner"
                        style={{ maxWidth: '100%', height: 'auto', borderRadius: 6 }}
                      />
                    </div>
                  )}

                  <p><b>Date:</b> {ev.date} <b>Time:</b> {ev.time}</p>
                  <p><b>Location:</b> {ev.location}</p>
                  <p>{ev.description}</p>

                <div style={{ marginTop: 10 }}>
                  <button onClick={() => handleApprove(ev._id)} className="create-event-submit-btn">Approve</button>
                  <button onClick={() => handleDecline(ev._id)} style={{ marginLeft: 8 }} className="create-event-submit-btn">Decline</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ModeratorPending;
