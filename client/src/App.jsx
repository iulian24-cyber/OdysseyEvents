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

  const normalizeHash = () => {
    const h = window.location.hash;
    if (!h) return user ? "/home" : "/signin";
    return h.replace(/^#/, "");
  };

  const [page, setPage] = useState(normalizeHash);

  useEffect(() => {
    const onHashChange = () => setPage(normalizeHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [user]);

  // ⏳ Wait until auth is restored
  if (loading) {
    return <div>Loading...</div>;
  }

  const publicPages = ["/signin", "/signup"];
  const isPublic = publicPages.includes(page);

  // 🔐 Auth guard
  if (!user && !isPublic) {
    window.location.hash = "#/signin";
    return <SignIn />;
  }

  // 🔒 Moderator-only pages (ACCESS control only)
  if (page === "/create" && user?.role !== "moderator") {
    window.location.hash = "#/home";
    return <Home />;
  }

  // 🧭 ROUTING — NO ROLE-BASED REDIRECTS HERE
  switch (true) {
    case page === "/signin":
      return <SignIn />;

    case page === "/signup":
      return <SignUp />;

    case page === "/home":
      return <Home />;

    case page === "/create":
      return <CreateEvent />;

    case page.startsWith("/edit/"):
      return <CreateEvent editId={page.split("/edit/")[1]} />;

    case page === "/account":
      return <AccountSettings />;

    default:
      window.location.hash = "#/home";
      return <Home />;
  }
}

export default App;
