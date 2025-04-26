import React, { useState, useEffect,useRef, use } from 'react'
import { useLocation,useParams, useNavigate } from 'react-router-dom'
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid'
import ChatSection from './ChatSection.js';
import WhiteBoard from './WhiteBoard.js'
import micon from './mic.png'
import micoff from './microphone.png'
import NotesApp from './NotesApp.js'
import fileimg from './file.png'
import Test from './Test.js'
import './grstudy.css';
import AdminPage from './AdminPage.js'
import LandingPage from './LandingPage.js';

const SOCKET_SERVER_URL = 'https://readyvsr.onrender.com';
const ICE_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }];


const RoomCreation = () => {
  const { roomid } = useParams()
  const location = useLocation();
  const { userName, password } = location.state || {}; // Get passed data
  const [showNotesPopup, setShowNotesPopup] = useState(false);
  const [hasNewFile, setHasNewFile] = useState(false); // Store notifications for remote users
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [back,setIsback]= useState(false);

  const [showChat, setShowChat] = useState(false);
  const [test,setTest]= useState(false)
  const [showWhiteboard, setShowWhiteboard] = useState(false);

    const [username, setUsername] = useState('');
    const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
      const [allUsers, setAllUsers] = useState({});
      const [joined, setJoined] = useState(false);
      const localVideoRef = useRef(null);
      const remoteVideosRef = useRef({});
      const socketRef = useRef(null);
      const screenSharingRef = useRef(false);
      const peerConnections = useRef({});
      const localStreamRef = useRef(null);
      const [isVideoOn, setIsVideoOn] = useState(true);
    const [isAudioOn, setIsAudioOn] = useState(true);
    // const [isWhiteboard,setIsWhiteboard]=useState(false)
    const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);
    const whiteboardRef = useRef(null);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [userAudioStatus, setUserAudioStatus] = useState({});
    const [generatedRoomId,setGeneratedRoomId]= useState('')
    const [remoteStreams, setRemoteStreams] = useState({});

    // useEffect(()=>{
    //   setUsername(userName)
    // },[])
    
    // console.log(`roomid: ${roomid}, password:${password}`);
    
  // Handle new room ID creation
  useEffect(() => {
    if (roomid) {
      const newRoomId = roomid
      const baseUrl = window.location.origin;
      setGeneratedRoomId(`${baseUrl}/create-room/${newRoomId}`);
    }
  }, [roomid]);

useEffect(() => {
  socketRef.current = io("https://readyvsr.onrender.com");
  
  socketRef.current.on('joined', handleUserListUpdate);
  socketRef.current.on('offer', handleOffer);
  socketRef.current.on('answer', handleAnswer);
  socketRef.current.on('icecandidate', handleIceCandidate);
  socketRef.current.on('call-ended', handleEndCall);
  
  return () => {
    socketRef.current.disconnect();
    Object.values(peerConnections.current).forEach(pc => pc.close());
  };
  // return () => {
  //   if (socketRef.current) {
  //     socketRef.current.disconnect();
  //     socketRef.current = null; // Prevent reconnections
  //   }
  //   Object.values(peerConnections.current).forEach(pc => pc.close());
  // };
}, []);


useEffect(() => {
  // Listen for file upload notifications
  socketRef.current.on("newFileUploaded", ({ username }) => {
    console.log(`New file uploaded by ${username}`);
    setHasNewFile(true); // Show notification
  });

  return () => {
    socketRef.current.off("newFileUploaded");
  };
}, []);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning]);



const startLocalVideo = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    localStreamRef.current = stream;
    if ( localVideoRef.current) localVideoRef.current.srcObject = stream;
  } catch (error) {
    console.error('Error accessing media devices:', error);
  }
};

const handleUserListUpdate = (users) => {
  console.log("all users are",users);
  
  setAllUsers(users);

  
  // Remove users who have disconnected to prevent empty divs
  Object.keys(remoteVideosRef.current).forEach((userId) => {
    if (!users[userId]) {
      delete remoteVideosRef.current[userId];
    }
  });

   // Automatically start calls with new users
  //  Object.keys(users).forEach((userId) => {
  //   if (userId !== username && !peerConnections.current[userId]) {
  //     startCall(userId); // Start call automatically
  //   }
  // });
};



// console.log("Now all users are:",allUsers);

const createPeerConnection = (userId) => {
  const peerConnection = new RTCPeerConnection({ iceServers: ICE_SERVERS });

  // Add local stream tracks
  localStreamRef.current.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStreamRef.current);
  });

  peerConnection.ontrack = (event) => {
    if (!remoteVideosRef.current[userId]) {
      remoteVideosRef.current[userId] = document.createElement('video');
      remoteVideosRef.current[userId].autoplay = true;
      remoteVideosRef.current[userId].playsInline = true;
    }

    const remoteContainer = document.getElementById('remoteVideosContainer');
    if (remoteContainer && !remoteContainer.contains(remoteVideosRef.current[userId])) {
      remoteContainer.appendChild(remoteVideosRef.current[userId]);
    }

    remoteVideosRef.current[userId].srcObject = event.streams[0];
  };


  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socketRef.current.emit('icecandidate', { candidate: event.candidate, to: userId });
    }
  };

  return peerConnection;
};

const handleOffer = async ({ from, offer }) => {
  if (peerConnections.current[from]) {
    console.warn(`PeerConnection with ${from} already exists.`);
    return;
  }

  peerConnections.current[from] = createPeerConnection(from);
  
  // Only set remote description if the signaling state is "stable"
  if (peerConnections.current[from].signalingState === "stable") {
    await peerConnections.current[from].setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnections.current[from].createAnswer();
    await peerConnections.current[from].setLocalDescription(answer);
    socketRef.current.emit('answer', { from: username, to: from, answer });
  } else {
    console.warn(`Skipping setRemoteDescription for ${from} because signalingState is ${peerConnections.current[from].signalingState}`);
  }
};



const handleAnswer = async ({ from, answer }) => {
  const peerConnection = peerConnections.current[from];
  if (!peerConnection) return;

  // Check signaling state before setting remote description
  if (peerConnection.signalingState === "have-local-offer") {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  } else {
    console.warn(`Skipping setRemoteDescription because state is: ${peerConnection.signalingState}`);
  }
  
};

const handleIceCandidate = async ({ from, candidate }) => {
  if (peerConnections.current[from]) {
    await peerConnections.current[from].addIceCandidate(new RTCIceCandidate(candidate));
  }
};



const startCall = async (userId) => {
  // console.log("try userid",userId);
  
  if (peerConnections.current[userId]) {
    console.warn(`Already in a call with ${userId}`);
    return;
  }

  peerConnections.current[userId] = createPeerConnection(userId);
  const offer = await peerConnections.current[userId].createOffer();
  await peerConnections.current[userId].setLocalDescription(offer);
  socketRef.current.emit('offer', { from: username, to: userId, offer });
};

const joinConference = () => {
  // if (username && roomid) {
  //   console.log("Registering user:", username, "Room:", roomid);
  //   socketRef.current.emit('register', { username, roomid });
  // }
  console.log("Emitting join-user event:", { username, roomid, password });  
  socketRef.current.emit('join-user', {username,roomid,password});
  setJoined(true);
  setIsRunning(true);
  startLocalVideo();
};

const endCall = () => {
  Object.keys(peerConnections.current).forEach((userId) => {
    socketRef.current.emit('call-ended', userId);
    handleEndCall(userId);
  });
  setJoined(false);
};

const handleEndCall = (userId) => {
  if (peerConnections.current[userId]) {
    peerConnections.current[userId].close();
    delete peerConnections.current[userId];
  }
  if (remoteVideosRef.current[userId]) {
    remoteVideosRef.current[userId].remove();
    delete remoteVideosRef.current[userId];
  }

  setAllUsers((prevUsers) => {
    const updatedUsers = { ...prevUsers };
    delete updatedUsers[userId]; // Remove from state to clean UI
    return updatedUsers;
  });
};

const toggleChat = () => {
      setShowChat(!showChat);
      if (!showChat) {
        setHasNewMessage(false); // Clear the notification when opening chat
      }
      setShowWhiteboard(false); // Hide Whiteboard when Chat is open
    };

  const toggleVideo = () => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOn(videoTrack.enabled);
    }
  };

  const toggleAudio = () => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioOn(audioTrack.enabled);

      // sendMicStatusUpdate(audioTrack.enabled);
    }
  };

    const toggleScreenShare = async () => {
    if (!screenSharingRef.current) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenSharingRef.current = true;
        setIsScreenSharing(true);
        
        const screenTrack = stream.getTracks()[0];
        Object.values(peerConnections.current).forEach(pc => {
          const sender = pc.getSenders().find(s => s.track.kind === 'video');
          if (sender) sender.replaceTrack(screenTrack);
        });
        
        screenTrack.onended = () => stopScreenShare();
      } catch (error) {
        console.error('Error accessing screen sharing:', error);
      }
    } else {
      stopScreenShare();
    }
  };

  const stopScreenShare = () => {
    screenSharingRef.current = false;
    setIsScreenSharing(false);
    startLocalVideo();
  };

  //   // Function to handle new messages from ChatSection
  const handleNewMessage = () => {
    if (!showChat) {
      setHasNewMessage(true);
    }
  };

  const toggleNotesPopup = () => {
    setShowNotesPopup(!showNotesPopup);
    setHasNewFile(false); // Reset notification when opened
  };

  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? `0${secs}` : secs}`;
  };

    const toggleWhiteboard = () => {
    setShowWhiteboard((prev) => !prev);
    setShowChat(false); // Hide chat when Whiteboard is open
  };

  // Close Whiteboard when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (whiteboardRef.current && !whiteboardRef.current.contains(event.target)) {
        setIsWhiteboardOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

return (
  <>
  {back ? (
    <LandingPage/>
  ):test?(
    <Test goto={"roomcreation"}/>
  ):(

  <div className="host-full-page">
      <div className="host-upper-row">
      <button onClick={()=>setIsback(true)}>Back</button>
      <h2>Welcome to Room: <a href={generatedRoomId} className="text-blue-500">{roomid}</a></h2>
      <p style={{color:"black"}}>Room Password: {password}</p>
      <input 
        type="text" 
        placeholder='Enter username'
        value={username} 
        onChange={(e)=>setUsername(e.target.value)}
        className="username-input"
      />
      {/* {username} */}
      <button onClick={()=>setTest(true)}>Create Room</button>
      {joined && <div className="timer">Time: {formatTime(time)}</div>}
      </div>

      <div className="host-middle-div">
              <div className={`host-left-middle-div ${showChat||showWhiteboard  ? 'shrink' : ''}`}>
                  <div className="app">
                  <ul className="user-list">
                          {Object.entries(allUsers).map(([id, user]) => (
                            <li key={id} className="user-item" style={{color:"black"}}>
                              {user.username} 
                        <button onClick={() => startCall(id)} className="call-btn">Allow</button>
                            </li>
                          ))}
                      </ul>
                  <div className="video-container" style={{width:"60%",height:"auto"}}>
                      <div className="local-video-container">
                          <video ref={localVideoRef} autoPlay muted playsInline id="localVideo"  style={{width: "100%",height: "100%"}}/>
                      </div>
                    </div>
                
                  </div>
                  {/* <div className="host-remote-videos" id="remoteVideosContainer">
         {Object.entries(allUsers).map(([userId, user]) => (
          remoteVideosRef.current[userId] ? (
            <div key={userId} className="remote-video-wrapper" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
  <video ref={(el) => (remoteVideosRef.current[userId] = el)} autoPlay playsInline className="remote-video" />
  
  <div className="remote-user-info" >
    <span className="remote-user-name" style={{ color: "white" }}>
      {user.username || "guest"} 
    </span>
  </div>
</div>

          ) : null
        ))}
      </div> */}
              
              <div className="host-remote-videos" id="remoteVideosContainer">
  {Object.entries(allUsers).map(([userId, user]) => (
    <div
      key={userId}
      className="remote-video-wrapper"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      
      <video
        ref={(el) => {
          if (el) remoteVideosRef.current[userId] = el;
        }}
        autoPlay
        playsInline
        className="remote-video"
      />

      
      <div className="remote-user-info">
        <span className="remote-user-name" style={{ color: "white" }}>
          {user.username || "Guest"}
        </span>
      </div>
    </div>
  ))}
</div>




      <div className="bottom-controls">
  {/* Join Button */}
  <button onClick={joinConference} disabled={joined} className="join-btn">
    Join
  </button>

  {/* Video Toggle */}
  {joined && (
    <img 
      onClick={toggleVideo} 
      className="control-icon" 
      src={isVideoOn ? 'https://tse4.mm.bing.net/th?id=OIP.LOMPTRGrLN2-coUz2VGJLwHaEf&pid=Api&P=0&h=180' : "https://tse2.mm.bing.net/th?id=OIP.3sYc_KH5RGv6_uRqAQnENQHaHa&pid=Api&P=0&h=180"} 
    />
  )}

  {/* Audio Toggle */}
  {joined && (
    <img 
      onClick={toggleAudio} 
      className="control-icon" 
      src={isAudioOn ? 'https://tse1.mm.bing.net/th?id=OIP.5VoN9XNBWrEx4lKc1u9oxgHaJQ&pid=Api&P=0&h=180' : 'https://tse3.mm.bing.net/th?id=OIP.LQYQB6u6py-JsGEVAGjcCwHaHa&pid=Api&P=0&h=180'} 
    />
  )}

  {/* Disconnect Button */}
  {joined && (
    <button onClick={endCall} className="disconnect-btn">
      Disconnect
    </button>
  )}

  {/* Whiteboard Toggle */}
  {joined && (
    <button onClick={toggleWhiteboard} className={`whiteboard-btn ${showWhiteboard ? 'active' : ''}`}>
      {showWhiteboard ? "Close Whiteboard" : "Open Whiteboard"}
    </button>
  )}

  {/* Screen Share */}
  {joined && (
    <img 
      onClick={toggleScreenShare}
      className="control-icon"
      src={isScreenSharing ? "https://tse4.mm.bing.net/th?id=OIP.iNdKd9jxoWjKqyV-YYh54wHaHa&pid=Api&P=0&h=180" : 'https://tse4.mm.bing.net/th?id=OIP.x_9Vc9hXxmWPrl10Vj959AHaHa&pid=Api&P=0&h=180'} 
    />
  )}

  {/* Chat Icon with Notification */}
  {joined && (
    <div style={{ position: "relative", display: "inline-block" }}>
      <img 
        onClick={toggleChat}
        className="control-icon"
        src="https://tse1.mm.bing.net/th?id=OIP.2xM9b_J8akiM3A0tnqAXzwHaHa&pid=Api&P=0&h=180"
      />
      {hasNewMessage && <span className="notification-dot"></span>}
    </div>
  )}

  {/* File Icon with Notification */}
  {joined && (
    <div style={{ position: "relative", display: "inline-block" }}>
      <img 
        src={fileimg} 
        onClick={toggleNotesPopup} 
        className="control-icon"
      />
      {hasNewFile && <span className="notification-dot"></span>}

      {/* Notes Popup */}
      {showNotesPopup && (
        <div className="popup">
          <NotesApp roomId={roomid} username={username} setHasNewFile={setHasNewFile} />
        </div>
      )}
    </div>
  )}
</div>

              </div>
               <div className={`host-chatting ${showChat ? 'visible' : ''}`}>
               {showWhiteboard ? <WhiteBoard /> : <ChatSection onNewMessage={handleNewMessage} roomid={roomid} username={username}/>}
                </div>
      </div>
 </div>
  )}
  </>
)

  
}

export default RoomCreation



