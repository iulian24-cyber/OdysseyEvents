import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import "./Home.css";
import EventCard from "../components/EventCard";

function Home() {
  const { user } = useAuth();

  // 🔑 category state
  const [selectedCategories, setSelectedCategories] = useState([]);

  // apply preferred categories ONCE when user loads
  useEffect(() => {
    if (user?.preferredCategories?.length) {
      setSelectedCategories(user.preferredCategories);
    }
  }, [user]);

  // UI state
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const panelRef = useRef(null);
  const btnRef = useRef(null);

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // reset pagination when filters change
  useEffect(() => {
    setPage(1);
    setEvents([]);
    setHasMore(true);
  }, [selectedCategories]);

  function handleLoadMore() {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  }

  // close account panel on outside click
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
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // load events
  useEffect(() => {
    async function loadPage(p) {
      setLoading(true);

      try {
        const categoryQuery =
          selectedCategories.length > 0
            ? `&categories=${selectedCategories.join(",")}`
            : "";

        const data = await api(
          `/events?page=${p}&limit=${pageSize}${categoryQuery}`
        );

        if (p === 1) {
          setEvents(data);
        } else {
          setEvents((prev) => [...prev, ...data]);
        }

        setHasMore(data.length === pageSize);
      } catch (err) {
        console.error("Failed to load events", err);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    }

    loadPage(page);
  }, [page, selectedCategories]);

  return (
    <div className="home-container">
      {/* NAV BAR */}
      <div className="nav_bar">
        <div className="logo">OdysseyEvents</div>

        <div className="nav_buttons">
          <button
            className="nav_button"
            onClick={() => setSelectedCategories([])}
          >
            All events
          </button>

          <button
            className="nav_button"
            onClick={() =>
              setSelectedCategories(user?.preferredCategories || [])
            }
          >
            For you
          </button>
        </div>

        <button
          className="account_button"
          ref={btnRef}
          aria-expanded={open}
          aria-controls="account-panel"
          onClick={() => setOpen((v) => !v)}
        />
      </div>

      {/* ACCOUNT PANEL */}
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

      {/* EVENTS */}
      <div className="events-container">
        {loading && <p>Loading events...</p>}

        {!loading && events.length === 0 && (
          <div
            style={{
              textAlign: "center",
              marginTop: 40,
              color: "#aaa",
            }}
          >
            <p>No events available yet.</p>
            <p>Check back later or create one if you’re an admin.</p>
          </div>
        )}

        {!loading && events.length > 0 && (
          <div className="events-grid">
            {events.map((ev) => (
              <EventCard key={ev._id} event={ev} />
            ))}
          </div>
        )}

        <div style={{ textAlign: "center", margin: "18px 0" }}>
          {hasMore && !loading && (
            <button onClick={handleLoadMore} className="nav_button">
              Load more
            </button>
          )}
          {!hasMore && (
            <small style={{ color: "#aaa" }}>No more events</small>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
