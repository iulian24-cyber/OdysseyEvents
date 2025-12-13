import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Home.css';
import EventCard from '../components/EventCard';

function Home() {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const panelRef = useRef(null);
    const btnRef = useRef(null);
    const [page, setPage] = useState(1);
    const pageSize = 5;
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    function handleLoadMore() {
        if (!loading && hasMore) setPage(prev => prev + 1);
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
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    // load events (try API, fallback to mock)
    useEffect(() => {
        const mockAll = [
            { id: 1, title: 'Concert Night', date: '2025-12-01', time: '19:00', imageUrl:'', subject: 'Music', description: 'Join us for an unforgettable night of live music and entertainment.'    },
            { id: 2, title: 'Art Expo', date: '2025-12-05', time: '11:00', imageUrl: '', subject: 'Art', description: 'Explore the latest works from contemporary artists around the world.'     },
            { id: 3, title: 'Tech Meetup', date: '2025-12-12', time: '18:30', imageUrl: '', subject: 'Technology', description: 'Network with fellow tech enthusiasts and learn about the latest industry trends.'     },
            { id: 4, title: 'Food Festival', date: '2025-12-20', time: '12:00', imageUrl: '', subject: 'Culinary', description: 'Taste delicious dishes from local chefs and food trucks.'     },
            { id: 5, title: 'Marathon', date: '2025-12-25', time: '07:00', imageUrl: '', subject: 'Sports', description: 'Participate in a city-wide marathon and challenge your limits.'     },
            { id: 6, title: 'Book Fair', date: '2025-12-30', time: '10:00', imageUrl: '', subject: 'Literature', description: 'Discover new authors and titles at the annual book fair.'     },
            { id: 7, title: 'Film Screening', date: '2026-01-05', time: '20:00', imageUrl: '', subject: 'Cinema', description: 'Watch exclusive screenings of indie films and documentaries.'     },
            { id: 8, title: 'Dance Workshop', date: '2026-01-10', time: '15:00', imageUrl: '', subject: 'Dance', description: 'Learn new dance styles from professional instructors in a fun environment.'     },
            { id: 9, title: 'Yoga Retreat', date: '2026-01-15', time: '08:00', imageUrl: '', subject: 'Wellness', description: 'Rejuvenate your mind and body with a weekend yoga retreat.'     },
            { id: 10, title: 'Photography Walk', date: '2026-01-20', time: '09:00', imageUrl: '', subject: 'Photography', description: 'Capture stunning photos while exploring scenic locations with fellow photographers.'           },
            
        ];
        async function loadPage(p) {
        setLoading(true);
        try {
            const res = await fetch(`/api/events?page=${p}&limit=${pageSize}`);
            if (res.ok) {
                const data = await res.json();
                if (p === 1) {
                    setEvents(data);                // replace on first page
                } else {
                    setEvents(prev => [...prev, ...data]); // append later pages
                }
                setHasMore(data.length === pageSize);
            } else {
                // fallback to mock paging
                const slice = mockAll.slice((p - 1) * pageSize, p * pageSize);
                if (p === 1) {
                    setEvents(slice);
                } else {
                    setEvents(prev => [...prev, ...slice]);
                }
                setHasMore(slice.length === pageSize);
            }
        } catch (err) {
            const slice = mockAll.slice((p - 1) * pageSize, p * pageSize);
            if (p === 1) {
                setEvents(slice);
            } else {
                setEvents(prev => [...prev, ...slice]);
            }
            setHasMore(slice.length === pageSize);
        } finally {
            setLoading(false);
        }
    }

        // initial load
        loadPage(page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    return (
        <div className="home-container">
            <div className='nav_bar'>
                <div className='logo'>OdessyEvents</div>
                <div className='nav_buttons'>
                    <button className='nav_button' onClick={() => (window.location.hash = '#/home')}>All events</button>
                    <button className='nav_button' onClick={() => (window.location.hash = '#/home')}>For you</button>
                </div>
                <button
                    className='account_button'
                    ref={btnRef}
                    aria-expanded={open}
                    aria-controls="account-panel"
                    onClick={() => setOpen(v => !v)}
                />
            </div>
            <div
                id="account-panel"
                ref={panelRef}
                className={`account_panel ${open ? 'open' : ''}`}
                role="menu"
                aria-hidden={!open}
            >
                <button className="account_item" role="menuitem" onClick={() => { window.location.hash = '#/account'; setOpen(false); }}>My profile</button>
                {user?.role === 'moderator' && (
                    <button className="account_item add" role="menuitem" onClick={() => { window.location.hash = '#/create'; setOpen(false); }}>Add event</button>
                )}
                <hr />
                <button className="account_item logout" role="menuitem">Log out</button>
            </div>

            <div className='events-container'>
                {events.length === 0 && loading ? (
                    <p>Loading events...</p>
                ) : (
                    <div className="events-grid">
                        {events.map(ev => (
                            <EventCard key={ev.id} event={ev} />
                        ))}
                    </div>
                )}

                <div style={{ textAlign: 'center', margin: '18px 0' }}>
                    {hasMore ? (
                        <button onClick={handleLoadMore} disabled={loading} className="nav_button">
                            {loading ? 'Loading…' : 'Load more'}
                        </button>
                    ) : (
                        <small style={{ color: '#aaa' }}>No more events</small>
                    )}
                </div>
            </div>
        </div>
    );
}
export default Home;