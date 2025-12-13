import { useState, useEffect } from 'react'
import { useAuth } from './context/AuthContext'
import './App.css'
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import CreateEvent from './pages/CreateEvent';
import AccountSettings from './pages/AccountSettings';

function App(){
  const normalizeHash = () => {
    const h = window.location.hash || '#/home';
    // normalize to /page (no hash)
    return h.replace(/^#/, '');
  };

  const [page, setPage] = useState(normalizeHash());

  useEffect(() => {
    const onHashChange = () => setPage(normalizeHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const { user } = useAuth();

  // protect create event page: only moderators can view
  if (page === '/create' && user?.role !== 'moderator') {
    // redirect back to home
    window.location.hash = '#/home';
    return <Home />;
  }

  switch (page) {
    case '/signup':
      return <SignUp />;
    case '/create':
      return <CreateEvent />;
    case '/account':
      return <AccountSettings />;
    case '/signin':
      return <SignIn />;
    case '/home':
    default:
      return <Home />;
  }
}

export default App;
