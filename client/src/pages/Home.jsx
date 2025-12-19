import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import "./Home.css";
import EventCard from "../components/EventCard";
import PixelBlast from "../components/PixelBlast.jsx";
import logo from "../assets/Odyssey Events Logo.svg";

function Home() {
  const { user, logout } = useAuth();

  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    if (user?.preferredCategories?.length) {
      setSelectedCategories([...user.preferredCategories]);
    }
  }, [user]);

  const isAllActive = selectedCategories.length === 0;

  const isForYouActive =
    user?.preferredCategories?.length > 0 &&
    selectedCategories.length === user.preferredCategories.length &&
    selectedCategories.every(cat =>
      user.preferredCategories.includes(cat)
    );

  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const panelRef = useRef(null);
  const btnRef = useRef(null);

  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // scroll memory
  const scrollPosRef = useRef(0);

  // reset when switching category tabs
  useEffect(() => {
    setPage(1);
    setEvents([]);
    setHasMore(true);
  }, [selectedCategories]);

  function handleLoadMore() {
    if (!loading && hasMore) {
      scrollPosRef.current = window.scrollY;
      setPage(p => p + 1);
    }
  }

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
          setEvents(prev => [...prev, ...data]);
        }

        setHasMore(data.length === pageSize);
      } catch (err) {
        console.error("Failed to load events", err);
        setHasMore(false);
      } finally {
        setLoading(false);

        // ✔ Smooth scroll restore without jump
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollPosRef.current);
        });
      }
    }

    loadPage(page);
  }, [page, selectedCategories]);
  
    // Detect mobile device (simple + effective)
  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768;
  
  return (
    <div className="home-page">
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

      <div className="nav_bar">
        <div className="logo" onClick={() => (window.location.hash = "#/home")}>
          <img src={logo} alt="OdysseyEvents" />
        </div>

        <div className="nav_buttons">
          <button
            className={`nav_button ${isAllActive ? "active" : ""}`}
            onClick={() => setSelectedCategories([])}
          >
            All events
          </button>

          <button
            className={`nav_button ${isForYouActive ? "active" : ""}`}
            onClick={() =>
              setSelectedCategories([...(user?.preferredCategories || [])])
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
          onClick={() => setOpen(v => !v)}
        >
          {user?.username?.charAt(0).toUpperCase()}
        </button>
      </div>

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
            setOpen(false);
            logout();
          }}
        >
          Log out
        </button>
      </div>

      <div className="home-container">
        <div className="events-container">
          {loading && <p>Loading events...</p>}

          {!loading && events.length === 0 && (
            <div style={{ textAlign: "center", marginTop: 40, color: "#aaa" }}>
              <p>No events available yet.</p>
              <p>Check back later or create one if you’re an admin.</p>
            </div>
          )}

          {!loading && events.length > 0 && (
            <div className="events-grid">
              {events.map(ev => (
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
            {!hasMore && <small style={{ color: "#aaa" }}>No more events</small>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
