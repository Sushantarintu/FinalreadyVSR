import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const EngagementGraph = ({ userId }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/user/${userId}/engagement-graph?from=2025-04-14&to=2025-04-21`)
      .then((res) => {
        setData(res.data.sessions);
      })
      .catch((err) => {
        console.error('Error loading engagement data:', err);
      });
  }, [userId]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-xl">
      <h2 className="text-xl font-bold mb-4 text-center">📊 Engagement Analytics</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis label={{ value: 'Seconds', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalSeconds" name="Total Time" fill="#8884d8" />
          <Bar dataKey="active" name="Active Events" fill="#82ca9d" />
          <Bar dataKey="idle" name="Idle Events" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EngagementGraph;
