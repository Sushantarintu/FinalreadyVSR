import React, { useState } from 'react';
import RoomCreation from './RoomCreation';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import axios from 'axios' 
import './testcss.css'

const Test = ({ goto }) => {
    const [roomId, setRoomId] = useState('');
    const [userName, setUsername] = useState('');
    const [password, setPassword] = useState('123');
    const [duration, setDuration] = useState(60); // timer in minutes
    const [joinRoom, setjoinRoom] = useState(false);
    const navigate = useNavigate();

    const createNewRoom = () => {
        const id = uuidV4();
        setRoomId(id);
        toast.success('Created a new room');
    };

    const handlejoin = () => {
        if (!roomId || !duration) {
            toast.error('Room ID and Timer are required');
            return;
        }

        setjoinRoom(true);

        const roomData = {
            roomId,
            roomPassword: password,
            duration // send this to backend
        };

        axios.post("http://localhost:10000/create-room", roomData)
            .then((res) => {
                if (res.data.success) {
                    alert("Room created successfully!");
                    switch (goto) {
                        case "grstudy":
                            navigate(`/study/${roomId}`, { state: { userName } });
                            break;
                        case "roomcreation":
                            navigate(`/create-room2/${roomId}`, { state: { userName } });
                            break;
                    }
                } else {
                    alert(res.data.message);
                }
            })
            .catch((err) => {
                console.error(err);
                if (err.response) {
                    alert(err.response.data.message || "Failed to create room.");
                } else {
                    alert("Network error! Please try again.");
                }
            });
    };

    return (
        <div className="test-container">
            <h2 className="test-heading">Create a Room</h2>
            <input className="test-input" type="text" placeholder="Room ID" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
            <button className="test-button" onClick={createNewRoom}>Generate Random RoomId</button>
            <br />

            <input
                className="test-input"
                type="number"
                placeholder="Duration in minutes"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
            />

            <p>Set Timer</p>
            <button className="test-button" onClick={handlejoin}>Join Room</button>
        </div>
    );
};

export default Test;
