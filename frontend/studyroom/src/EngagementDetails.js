import React, { useEffect, useState } from 'react';

const EngagementDetails = ({ sessionId }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!sessionId) return;

    const fetchEvents = async () => {
      try {
        const res = await fetch(`http://localhost:10000/api/session/${sessionId}/engagement`);
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error('Failed to fetch engagement data:', err);
      }
    };

    fetchEvents();
  }, [sessionId]);

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '10px' }}>
      <h3>Activity Timeline</h3>
      {events.length === 0 ? (
        <p>No activity data found.</p>
      ) : (
        <ul>
          {events.map((event, index) => (
            <li key={index} style={{color:"black"}}>
              <strong>{event.eventType.toUpperCase()}</strong> at{' '}
              {new Date(event.timestamp).toLocaleTimeString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EngagementDetails;
