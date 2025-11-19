import React, { useState } from 'react';
import './SignInOrUp.css';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const validate = () => {
        if (!email) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(email)) return 'Enter a valid email';
        if (!password) return 'Password is required';
        if (password.length < 6) return 'Password must be at least 6 characters';
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const v = validate();
        if (v) {
            setError(v);
            return;
        }
        setError('');
        try {
            // Replace with auth API call
            console.log('Signing in', { email, password });
        } catch (err) {
            setError('Sign in failed. Please try again.');
        }
    };

    return (
        <div className="signin-container">
            <h2 className="signin-title">Sign In</h2>
            <form onSubmit={handleSubmit} className="signin-form">
                <label className="signin-label">
                    Email
                    <input
                        className="signin-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                    />
                </label>

                <label className="signin-label">
                    Password
                    <input
                        className="signin-input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                </label>

                {error && <div className="signin-error">{error}</div>}

                <button type="submit" className="signin-button">Sign In</button>
            </form>
        </div>
    );
}

export default SignIn;