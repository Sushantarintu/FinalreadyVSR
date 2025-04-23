import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import joinroomimg from "./Join-link-photo.jpg";
import "./joinsection.css";
import axios from 'axios'
import LandingPage from "./LandingPage";

const JoinSection = () => {
  const [roomLink, setRoomLink] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const navigate = useNavigate();
  const [back,setIsback]= useState(false);
  
  const handleJoin = async () => {
    if (!roomLink || !roomPassword) {
      alert('Please enter Room ID and Password!');
      return;
    }

      // ✅ Extract only UUID from URL (after last '/')
  const extractedRoomId = roomLink.split('/').pop();
  const urlParts = roomLink.split('/');
  const extractedRoute = urlParts[urlParts.length - 2]; // `create-room` or `study`
  console.log("Extracted Route:", extractedRoute);
    try {
      const response = await axios.post('http://localhost:10000/check-room', {
        roomId: extractedRoomId,
        roomPassword: roomPassword
      });
    
      const data = response.data;
    
      if (response.status === 200 && data.success) {
        // Room exists and password matched
        console.log('Room verified:', data);
        switch(extractedRoute){
          case "create-room":navigate(`/create-room2/${data.roomId}`);break;
          case "study":navigate(`/study/${data.roomId}`);break;
        }
        // navigate(`/${extractedRoute}/${data.roomId}`);  // Navigate to room
      } else {
        alert('Failed to join the room. Please try again .');
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        const status = error.response.status;
        if (status === 401) {
          alert('Incorrect password. Please try again.');
        } else if (status === 404) {
          alert('Room does not exist. Please check the Room ID.');
        } else {
          alert('Failed to join the room. Please try again later.');
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        alert('No response from server. Please try again later.');
      } else {
        // Something else happened while setting up the request
        console.error('Error:', error.message);
        alert('An error occurred. Please try again later.');
      }
    }
  }

  return (
    <>
    {back ? (
      <LandingPage/>
    ):(
      <div className="join-container">
      <div className="join-content">
        <h2>Join a Study Room</h2>
        <p>Enter the link of the study room you want to join below.</p>

        <input
          type="text"
          placeholder="Paste Room Link Here"
          value={roomLink}
          onChange={(e) => setRoomLink(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Room Password"
          value={roomPassword}
          onChange={(e) => setRoomPassword(e.target.value)}
        />
        <button onClick={handleJoin}>Join Room</button>
        <button onClick={()=>setIsback(true)}>Back</button>

        <p className="instruction">
          Click the join button after entering the link.
        </p>
      </div>

      <div className="join-image">
        <img src={joinroomimg} alt="Join Room" />
      </div>
    </div>
    )}
    </>
  );
};

export default JoinSection;



