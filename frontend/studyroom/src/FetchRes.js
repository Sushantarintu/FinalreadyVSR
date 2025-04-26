// React + Tailwind + Express backend

// === FRONTEND (React) ===
// App.jsx
import React, { useState } from "react";
import axios from "axios";

const FetchRes=() =>{
  const [topic, setTopic] = useState("");
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchResources = async () => {
    console.log("hello api");
    
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get(`https://readyvsr.onrender.com/resources?q=${topic}`);
      setResources(res.data);
    } catch (err) {
      console.error("Error fetching resources", err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Study Resource Finder 📚</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="p-2 border rounded w-72"
          placeholder="Enter a topic (e.g., React, DBMS)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={fetchResources}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
      <div className="w-full max-w-2xl">
        {resources.map((res, idx) => (
          <div key={idx} className="bg-white p-4 mb-2 rounded shadow">
            <h2 className="text-lg font-semibold">{res.title}</h2>
            <p className="text-sm text-gray-600 mb-2">{res.snippet}</p>
            <a
              href={res.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View Resource ↗
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FetchRes