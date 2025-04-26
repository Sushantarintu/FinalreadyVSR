import React, { useEffect, useRef, useState, useContext } from "react";
import { StudyContext } from "./Store.js";
import socketIOClient from "socket.io-client";

const GroupChatting = () => {
  const users = useContext(StudyContext);
  const [inputedMsg, setInputedMsg] = useState("");
  const [curGrData, setCurGrData] = useState([]);
  const [isChat, setIsChat] = useState(false);
  const [messages, setMessages] = useState([]);
  
  const socket = useRef(null);

  useEffect(() => {
    if (Array.isArray(users.userData) && Array.isArray(users.GRData)) {
      setCurGrData(users.GRData);
    } else {
      console.warn("Users from StudyContext is not an array:", users);
    }
  }, [users]);

  useEffect(() => {
    socket.current = socketIOClient("https://readyvsr.onrender.com");

    // Listen for incoming messages
    socket.current.on('message', (sender, message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender, message }
      ]);
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  const handleSend = () => {
    if (!inputedMsg.trim()) {
      alert("Message cannot be empty!");
      return;
    }

    const message = inputedMsg.trim();

    // Emit a group message event
    if (socket.current) {
      const groupMembers = curGrData.map((gr) => gr.grmembers.map(member=>member)).flat(); // Assuming 'username' is the key
      socket.current.emit("group-message", groupMembers, users.username, message);
      console.log(`Message sent: ${message} to group: ${groupMembers}`);
    }

    // Clear the input field
    setInputedMsg("");
  };

  const handleTarget = () => {
    setIsChat(true);
  };

  return (
    <div>
      {/* <div className="grps">
        {curGrData.map((gr, index) => (
          <div key={index}>
            <h3>
              {index + 1}. {gr.gname}
            </h3>
          </div>
        ))}
        <div className="msg-box"></div>
      </div> */}
      {isChat ? (
        <div>
          {messages.map((msg, msgIndex) => (
            <div key={msgIndex}>
              <strong>{msg.sender}:</strong> {msg.message}
            </div>
          ))}
          <input
            type="text"
            placeholder="Enter msg"
            value={inputedMsg}
            onChange={(e) => setInputedMsg(e.target.value)}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      ) : (
        <button onClick={handleTarget}>Show Groups</button>
      )}
    </div>
  );
};

export default GroupChatting;

