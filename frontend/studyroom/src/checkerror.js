// videofront code
// import React, { useEffect, useRef, useState } from 'react';
// import io from 'socket.io-client';
// import './App.css';

// const SOCKET_SERVER_URL = 'http://localhost:3009';
// const ICE_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }];

// const VideoFront = () => {
//   const [username, setUsername] = useState('');
//   const [allUsers, setAllUsers] = useState({});
//   const [caller, setCaller] = useState([]);
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const socketRef = useRef(null);
//   const peerConnectionRef = useRef(null);
//   const localStreamRef = useRef(null);
//   const callerRef = useRef([]); // ✅ Fix: Use a ref to track the caller

//   useEffect(() => {
//     socketRef.current = io(SOCKET_SERVER_URL);

//     socketRef.current.on('joined', handleUserListUpdate);
//     socketRef.current.on('offer', handleOffer);
//     socketRef.current.on('answer', handleAnswer);

//     // ✅ Prevent multiple event listeners
//     if (!socketRef.current.hasIceListener) {
//       socketRef.current.on('icecandidate', handleIceCandidate);
//       socketRef.current.hasIceListener = true;
//     }

//     socketRef.current.on('call-ended', handleEndCall);

//     startLocalVideo();

//     return () => {
//       socketRef.current.disconnect();
//       if (peerConnectionRef.current) {
//         peerConnectionRef.current.close();
//       }
//     };
//   }, []);

//   const startLocalVideo = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
//       localStreamRef.current = stream;
//       if (localVideoRef.current) localVideoRef.current.srcObject = stream;
//     } catch (error) {
//       console.error('Error accessing media devices:', error);
//     }
//   };

//   const handleUserListUpdate = (users) => {
//     setAllUsers(users);
//   };

//   const createPeerConnection = () => {
//     const peerConnection = new RTCPeerConnection({ iceServers: ICE_SERVERS });

//     localStreamRef.current.getTracks().forEach((track) => {
//       peerConnection.addTrack(track, localStreamRef.current);
//     });

//     peerConnection.ontrack = (event) => {
//       if (remoteVideoRef.current) {
//         remoteVideoRef.current.srcObject = event.streams[0];
//       }
//     };

//     // ✅ Prevent infinite ICE candidate forwarding
//     peerConnection.onicecandidate = (event) => {
//       if (event.candidate && callerRef.current.length > 1) {
//         console.log("Sending ICE Candidate to:", callerRef.current[1]);

//         socketRef.current.emit('icecandidate', { candidate: event.candidate, to: callerRef.current[1] });
//       }
//     };

//     return peerConnection;
//   };

//   const handleOffer = async ({ from, offer }) => {
//     console.log("Offer received:", { from, offer });
//     peerConnectionRef.current = createPeerConnection();
//     try {
//       await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
//       const answer = await peerConnectionRef.current.createAnswer();
//       await peerConnectionRef.current.setLocalDescription(answer);
  
//       socketRef.current.emit('answer', { from, answer });
//       setCaller([socketRef.current.id, from]);
//       callerRef.current = [socketRef.current.id, from]; // ✅ Fix: Update callerRef
//     } catch (error) {
//       console.error('Error handling offer:', error);
//     }
//   };

//   const handleAnswer = async ({ answer }) => {
//     try {
//       await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
//     } catch (error) {
//       console.error('Error setting remote description for answer:', error);
//     }
//   };

//   const handleIceCandidate = async ({ candidate }) => {
//     if (!candidate || !peerConnectionRef.current) return;

//     console.log("Received ICE Candidate:", candidate);

//     try {
//       await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
//     } catch (error) {
//       console.error("Error adding ICE candidate:", error);
//     }
//   };

//   const handleEndCall = () => {
//     if (peerConnectionRef.current) {
//       peerConnectionRef.current.close();
//       peerConnectionRef.current = null;
//     }
//     setCaller([]);
//     callerRef.current = [];
//     if (remoteVideoRef.current) {
//       remoteVideoRef.current.srcObject = null;
//     }
//   };

//   const startCall = async (userId) => {
//     if (!localStreamRef.current) {
//       console.error('Local stream not available');
//       return;
//     }
//     peerConnectionRef.current = createPeerConnection();
//     const offer = await peerConnectionRef.current.createOffer();
//     await peerConnectionRef.current.setLocalDescription(offer);

//     socketRef.current.emit('offer', { from: username, to: userId, offer });
//     setCaller([username, userId]);
//     callerRef.current = [username, userId]; // ✅ Fix: Update callerRef
//   };

//   const endCall = () => {
//     socketRef.current.emit('call-ended', caller[1]);
//     handleEndCall();
//   };

//   const handleCreateUser = () => {
//     if (username) {
//       socketRef.current.emit('join-user', username);
//     }
//   };

//   console.log("Caller state:", caller);  // ✅ Debugging log to verify the caller state

//   return (
//     <div className="app">
//       <aside className="caller-list-wrapper">
//         <h1>Contacts</h1>
//         <ul id="allusers" className="caller-list">
//           {Object.entries(allUsers).map(([id, user]) => (
//             <li key={id}>
//               {user} {id === socketRef.current.id ? '(You)' : ''}
//               {id !== socketRef.current.id && (
//                 <button onClick={() => startCall(id)}>Call</button>
//               )}
//             </li>
//           ))}
//         </ul>
//       </aside>

//       <section className="video-call-container">
//         <div className="username-input">
//           <input
//             type="text"
//             placeholder="Enter Username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//           <button onClick={handleCreateUser}>Create</button>
//         </div>

//         <div className="video-streams">
//           <div className="local-video">
//             <video ref={localVideoRef} autoPlay muted playsInline />
//           </div>
//           <div className="remote-video">
//             <video ref={remoteVideoRef} autoPlay muted playsInline />
//           </div>
//         </div>

//         <div>
//           {caller.length > 0 && (
//             <button onClick={endCall}>End Call</button>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default VideoFront;


// backend code
// const express = require('express');
// const path = require('path');
// const cors = require('cors');
// const fs = require('fs');
// const mongoose= require('mongoose')
// const multer = require('multer');
// // const uniqueValidator = require('mongoose-unique-validator');
// const bodyParser = require('body-parser');
// const session = require('express-session');
// const MongoStore = require('connect-mongo');
// const http = require('http');

// require('./imageDetails')

// const port= process.env.PORT || 3009;

// const app = express();

// app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
// app.use(express.json());
// app.use(bodyParser.json());



// io.on('connection', (socket) => {
//   console.log(`User connected: ${socket.id}`);

  
//   const connectedUsers = {};
  
//   io.on('connection', (socket) => {
//     console.log('New client connected:', socket.id);
  
//     socket.on('join-user', (username) => {
//       connectedUsers[socket.id] = username;
//       io.emit('joined', connectedUsers);
//     });
  
//     socket.on('offer', (data) => {
//       io.to(data.to).emit('offer', { offer: data.offer, from: socket.id });
//     });
  
//     socket.on('answer', (data) => {
//       io.to(data.from).emit('answer', { answer: data.answer });
//     });
  
//     socket.on('icecandidate', ({ candidate, to }) => {
//       console.log(`Forwarding ICE candidate to ${to}`);
//       socket.to(to).emit('icecandidate', { candidate });
//     });
    
  
//     socket.on('call-ended', (targetSocketId) => {
//       io.to(targetSocketId).emit('call-ended');
//     });
  
//     socket.on('disconnect', () => {
//       delete connectedUsers[socket.id];
//       io.emit('joined', connectedUsers);
//       console.log(`Client disconnected: ${socket.id}`);
//     });
//   });
  




//   socket.on('register', (username) => {
//     if(username){
//       users[username] = socket.id;
//     console.log(`Registered users:`,users);
    
//     console.log(`Registered user: ${username} with ID: ${socket.id}`);
//     }else{
//      console.log("No users have registerd..");
//  }
//   });

//   socket.on('msg-all',(message,sender)=>{
//     socket.broadcast.emit('message',sender,message);
//     console.log(`Message ${message} sent from ${sender} to All`);
    
//   })

//   socket.on('private-message', (target, message, sender) => {
//     const targetSocketId = users[target];
//     if (targetSocketId) {
//       io.to(targetSocketId).emit('message', sender, message);
//       console.log(`Message sent from ${sender} to ${target}: ${message}`);
//     } else {
//       console.log(`User ${target} not found.`);
//     }
//   });

//   socket.on('group-message', (groupMembers, sender, message) => {
//     console.log("Group members:", groupMembers);
//     console.log("message:",message)
//   console.log("Users:", users);
//     groupMembers.forEach(target => {
//       const targetSocketId = users[target];
//       if (targetSocketId) {
//         io.to(targetSocketId).emit('message', sender, message);
//         console.log(`Message sent from ${sender} to ${target}: ${message}`);
//       } else {
//         console.log(`User ${target} not found.`);
//       }
//     });
//   });
  

//   socket.on('disconnect', () => {
//     for (const [username, id] of Object.entries(users)) {
//       if (id === socket.id) {
//         delete users[username];
//         console.log(`User ${username} disconnected.`);
//         // UserData.deleteMany({name:})
//         break;
//       }
//     }
//   });
// });

// server.listen(port, () => {
//   console.log(`Server running on ${port}`);
// });


// add sfa functanility in th ecode so that multiple persons can join yhe video conference



