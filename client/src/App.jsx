import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import "./App.css";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import CreateEvent from "./pages/CreateEvent";
import AccountSettings from "./pages/AccountSettings";

function App() {
  const { user, loading } = useAuth();

  /* ============================
     NORMALIZE ROUTE
  ============================ */
  const normalizeHash = () => {
    const hash = window.location.hash.replace(/^#/, "");
    const token = localStorage.getItem("token");

    // If no hash → route based on token only
    if (!hash) {
      return token ? "/home" : "/signin";
    }

    return hash;
  };

  const [page, setPage] = useState(normalizeHash);

  /* ============================
     HASH LISTENER
  ============================ */
  useEffect(() => {
    const onHashChange = () => {
      const nextRoute = normalizeHash();

      // If auth still loading → don't do redirects yet
      if (loading) return;

      // If logged in → block signin/signup entirely
      if (user && (nextRoute === "/signin" || nextRoute === "/signup")) {
        window.location.hash = "#/home";
        return;
      }

      // If logged out → block protected routes
      if (!user) {
        const publicOnly = ["/signin", "/signup"];
        if (!publicOnly.includes(nextRoute)) {
          window.location.hash = "#/signin";
          return;
        }
      }

      setPage(nextRoute);
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [user, loading]);

  /* ============================
     WAIT FOR AUTH RESTORE
  ============================ */
  if (loading) {
    return <div>Loading...</div>;
  }

  /* ============================
     POST-LOAD ROUTE FIXES
  ============================ */

  // Logged-in users cannot visit SignIn or SignUp
  if (user && (page === "/signin" || page === "/signup")) {
    window.location.hash = "#/home";
    return <Home />;
  }

  // Logged-out users cannot visit protected pages
  if (!user) {
    const publicRoutes = ["/signin", "/signup"];

    if (!publicRoutes.includes(page)) {
      window.location.hash = "#/signin";
      return <SignIn />;
    }
  }

  // Moderator-only create route
  if (page === "/create" && user?.role !== "moderator") {
    window.location.hash = "#/home";
    return <Home />;
  }

  /* ============================
     ROUTER
  ============================ */
  switch (true) {
    case page === "/signin":
      return <SignIn />;

    case page === "/signup":
      return <SignUp />;

    case page === "/home":
      return <Home />;

    case page === "/create":
      return <CreateEvent />;

    case page.startsWith("/edit/"): {
      const editId = page.split("/edit/")[1];
      return <CreateEvent editId={editId} />;
    }

    case page === "/account":
      return <AccountSettings />;

    default:
      window.location.hash = "#/home";
      return <Home />;
  }
}

export default App;
