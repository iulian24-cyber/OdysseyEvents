import './CreateEvent.css';
import './Home.css';
import React, { useState, useRef, useEffect } from 'react';

function CreateEvent() {
    
    const interestsList = ['Sports', 'Music', 'Tech', 'Art', 'Gaming', 'Science', 'Business', 'Food', 'Health'];
    const [interests, setInterests] = useState([]);
    
    const toggleInterest = (item) => {
        setInterests(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
    };

    // new state + ref for banner preview
    const [bannerPreview, setBannerPreview] = useState('');
    const [bannerFile, setBannerFile] = useState(null);
    const previewRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] ?? null;
        if (file) {
            const url = URL.createObjectURL(file);
            // revoke previous preview if it exists
            if (previewRef.current) {
                URL.revokeObjectURL(previewRef.current);
            }
            previewRef.current = url;
            setBannerPreview(url);
            setBannerFile(file);
        } else {
            if (previewRef.current) {
                URL.revokeObjectURL(previewRef.current);
                previewRef.current = null;
            }
            setBannerPreview('');
            setBannerFile(null);
        }
    };

    useEffect(() => {
        return () => {
            if (previewRef.current) {
                URL.revokeObjectURL(previewRef.current);
                previewRef.current = null;
            }
        };
    }, []);

    return (
        <div className="create-event-container">
            <div className='nav_bar'>
                <div className='logo'>OdessyEvents</div>
                <div className='as_nav_buttons'>
                    <button className='as_nav_button' onClick={ () => window.location.hash = '#/home'}>Home</button>
                </div>
            </div>
            <h2 className="create-event-title">Create New Event</h2>
            <form className="create-event-form">
                <label className="create-event-label">
                    <p>Event Name</p> 
                    <input
                        className="create-event-input"
                        type="text"
                        placeholder="Enter event name"
                    />
                </label>
                <label className="create-event-label">
                    <p>Date</p>
                    <input
                        className="create-event-input"
                        type="date"
                        placeholder="Select event date"
                    />
                </label>

                <p>Description</p>
                <textarea
                    className="create-event-textarea"
                    placeholder="Describe your event"
                ></textarea>

                <p>Location</p>
                <input
                    className="create-event-input"
                    type="text"
                    placeholder="Enter event location"
                />

                 <p>Time</p>
                 <input
                    className="create-event-input"
                    type="text"
                    placeholder="Enter event time"
                />
                <p>Banner Photo</p>
                 <input 
                    type='file'
                    id="bannerPhoto"
                    className="create-event-banner"
                    accept='.jpg, .jpeg, .png, .bmp'
                    onChange={handleFileChange}
                 />

                <img
                    src={bannerPreview}
                    alt="Banner Preview"
                    className="banner-preview"
                />

                <p>Select tags</p>
                <div className="interest-box">
                    <div className="interest-buttons">
                        {interestsList.map(item => (
                            <button
                                type="button"
                                key={item}
                                className={`interest-btn ${interests.includes(item) ? 'selected' : ''}`}
                                onClick={() => toggleInterest(item)}
                                aria-pressed={interests.includes(item)}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                    <div className="interest-hint">You can select multiple tags</div>
                </div>

                <button type="submit" className="create-event-submit-btn">Create Event</button>

            </form>
        </div>
    )
}
export default CreateEvent;
