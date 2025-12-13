import React from 'react';
import '../pages/Home.css'; // uses Home.css additions below

export default function EventCard({ event, onJoin }) {
    const { id, title, date, time, imageUrl, subject, description } = event;
    return (
        <article className="event-card" tabIndex="0" aria-labelledby={`title-${id}`}>
            <div className="event-image">
                {imageUrl ? <img src={imageUrl} alt={title} /> : <div className="placeholder">Image</div>}
            </div>

            <div className="event-meta">
                <h3 id={`title-${id}`} className="event-title">{title}</h3>
                <div className="event-info">{date} • {time}</div>
                <div className="event-subject">{subject}</div>
            </div>

            <div className="event-description" role="region" aria-hidden={description ? "false" : "true"}>
                <div className="desc-container">
                    <div className="desc-inner">{description || 'No description available.'}</div>
                </div>

                <div className="desc-actions">
                    <button
                        className="join-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (typeof onJoin === 'function') onJoin(event);
                            else console.log('Join clicked for event', id);
                        }}
                        aria-label={`Join ${title}`}
                    >
                        Check out event
                    </button>
                </div>
            </div>
        </article>
    );
}