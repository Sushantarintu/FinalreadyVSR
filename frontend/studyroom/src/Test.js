import React, { useState } from 'react';
import RoomCreation from './RoomCreation';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import axios from 'axios' 
import './testcss.css'

const Test = ({goto}) => {
    const [roomId, setRoomId] = useState('');
    const [userName, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [joinRoom,setjoinRoom]= useState(false)
    const navigate = useNavigate();

    const createNewRoom = () => {
        const id = uuidV4();
        setRoomId(id);
        toast.success('Created a new room');
    };

    // const joinRoom = () => {
    //     if (!roomId || !username || !password) {
    //         toast.error('Room ID, Username, and Password are required');
    //         return;
    //     }

    //     // Save password in localStorage (or manage via backend for real security)
    //     localStorage.setItem(`room_password_${roomId}`, password);
        
    //     navigate(`/room/${roomId}`, { state: { password } });
    // };

    const handlejoin = () => {
        if (!roomId  || !password) {
            toast.error('Room ID, Username, and Password are required');
            return;
        }
        setjoinRoom(true);
    
        // Fix: Change "password" to "roomPassword" to match backend
        const roomData = { roomId, roomPassword: password };

    
        axios.post("http://localhost:10000/create-room", roomData)
            .then((res) => {
                // console.log(res.data);
    
                if (res.data.success) {
                    alert("Room created successfully!");
                    // Navigate to the room (if needed)
                    switch(goto){
                        case "grstudy":navigate(`/study/${roomId}`,{ state: { userName, password } });break;
                        case "roomcreation":navigate(`/create-room2/${roomId}`,{ state: { userName, password } });break;
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
        <>
         <div className="test-container">
    <h2 className="test-heading">Create a Room</h2>
    <input className="test-input" type="text" placeholder="Room ID" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
    <button className="test-button" onClick={createNewRoom}>Generate Random RoomId</button>
    <br />
    <input className="test-input" type="password" placeholder="Set/Enter Room Password" value={password} onChange={(e) => setPassword(e.target.value)} />
    <p>Set Timer</p>
    <button className="test-button" onClick={handlejoin}>Join Room</button>
</div>

        </>
    );
    
};

export default Test;
