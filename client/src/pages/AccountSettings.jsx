import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './AccountSettings.css';

function AccountSettings() {
    const { user } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);

    const handleUpdate = (e) => {
        e.preventDefault();
    };
    const panelRef = useRef(null);
    const btnRef = useRef(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        function handleClickOutside(e) {
            if (open && panelRef.current && !panelRef.current.contains(e.target) && btnRef.current && !btnRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    return (
    <div className="account-page" style={{'grid-template-columns': 'auto auto'}}>
        <div className='nav_bar'>
            <div className='logo'>OdessyEvents</div>
            <div className='as_nav_buttons'>
                <button className='as_nav_button' onClick={ () => window.location.hash = '#/home'}>Home</button>
            </div>
        </div>
            <div className="account-container">
            <h2 className="account-title">Change account details</h2>
            <form onSubmit={handleUpdate} className="account-form">
                <label className="account-label">
                    Username
                    <input
                        className="account-input"
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>

                <label className="account-label">
                    Email
                    <input
                        className="account-input"
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>

                <label className="account-label">
                    Password
                    <input
                        className="account-input"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>

                {message && (
                    <div className={`account-message ${message.type === 'success' ? 'success' : 'error'}`}>
                        {message.text}
                    </div>
                )}

                <button type="submit" className="account-submit-btn">Update Settings</button>
            </form>
        </div>
    </div>
);

}
export default AccountSettings;