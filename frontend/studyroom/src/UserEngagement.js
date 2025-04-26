import React, { useState } from "react";
import "./userEngagement.css";

const UserEngagement = () => {
  const [userId, setUserId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [engagementData, setEngagementData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchEngagement = async () => {
    setLoading(true);
    setError("");
    setEngagementData(null);

    let url = `https://readyvsr.onrender.com/getUserEngagement/${userId}`;
    if (fromDate && toDate) {
      url += `?from=${fromDate}&to=${toDate}`;
    }

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error fetching data");
      }

      setEngagementData(data);
    } catch (err) {
      setError(err.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-engagement-container">
      <h2>📊 User Engagement Tracker</h2>

      <div className="user-engagement-inputs">
        <input
          type="text"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <div className="user-engagement-date-range">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <button onClick={fetchEngagement} className="user-engagement-button">
          Fetch Engagement
        </button>
      </div>

      {loading && <p style={{color:"black"}}>Loading...</p>}
      {error && <p className="error-text">{error}</p>}

      {engagementData && (
        <div className="engagement-summary">
          <h3>👤 User: {engagementData.userId}</h3>

          <ul>
            {engagementData.engagement.map((room, index) => (
              <li key={index} className="engagement-room" >
                <p style={{color:"black"}}><strong>Room:</strong> {room.roomId}</p>
                <p style={{color:"black"}}><strong>Time Spent:</strong> {room.duration} ({room.totalMinutes} mins)</p>
              </li>
            ))}
          </ul>

          <div className="engagement-total">
            <p>🕒 Total Engagement Time:</p>
            <p>{engagementData.grandTotalFormatted} ({engagementData.grandTotalMinutes} minutes)</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserEngagement;
