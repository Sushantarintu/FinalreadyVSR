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
import GrpTest from './GrpTest.js'
import AdminPage from './AdminPage.js'

const SOCKET_SERVER_URL = 'https://virtualstudyroom2.onrender.com';
const ICE_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }];


const GrStudyPage = () => {
  const { roomid2 } = useParams()
  const location = useLocation();
  const { userName, password } = location.state || {}; // Get passed data
  const [showNotesPopup2, setShowNotesPopup2] = useState(false);
  const [hasNewFile2, setHasNewFile2] = useState(false); // Store notifications for remote users
  const [hasNewMessage2, setHasNewMessage2] = useState(false);

  const [showChat2, setShowChat2] = useState(false);
  const [test2,setTest2]= useState(false)
  const [showWhiteboard2, setShowWhiteboard2] = useState(false);

    const [username2, setUsername2] = useState('');
    const [time, setTime] = useState(0);
  const [isRunning2, setIsRunning2] = useState(false);
      const [allUsers2, setAllUsers2] = useState({});
      const [joined2, setJoined2] = useState(false);
      const localVideoRef2 = useRef(null);
      const remoteVideosRef2 = useRef({});
      const socketRef2 = useRef(null);
      const screenSharingRef2 = useRef(false);
      const peerConnections2 = useRef({});
      const localStreamRef2 = useRef(null);
      const [isVideoOn2, setIsVideoOn2] = useState(true);
    const [isAudioOn2, setIsAudioOn2] = useState(true);
    // const [isWhiteboard,setIsWhiteboard]=useState(false)
    const [isWhiteboardOpen2, setIsWhiteboardOpen2] = useState(false);
    const whiteboardRef2 = useRef(null);
    const [isScreenSharing2, setIsScreenSharing2] = useState(false);
    const [userAudioStatus2, setUserAudioStatus2] = useState({});
    const [generatedRoomId2,setGeneratedRoomId2]= useState('')
    const [remoteStreams, setRemoteStreams] = useState({});
    const [checkauth,setcheckauth]= useState(false)

    // useEffect(()=>{
    //   setUsername(userName)
    // },[])
    
    // console.log(`roomid: ${roomid}, password:${password}`);
    
  // Handle new room ID creation
  useEffect(() => {
    if (roomid2) {
      const newRoomId2 = roomid2
      const baseUrl = window.location.origin;
      setGeneratedRoomId2(`${baseUrl}/study/${newRoomId2}`);
    }
  }, [roomid2]);

useEffect(() => {
  socketRef2.current = io("http://localhost:10000");
  
  socketRef2.current.on('joined', handleUserListUpdate2);
  socketRef2.current.on('offer', handleOffer2);
  socketRef2.current.on('answer', handleAnswer2);
  socketRef2.current.on('icecandidate', handleIceCandidate2);
  socketRef2.current.on('call-ended', handleEndCall2);
  
  return () => {
    socketRef2.current.disconnect();
    Object.values(peerConnections2.current).forEach(pc => pc.close());
  };
  // return () => {
  //   if (socketRef2.current) {
  //     socketRef2.current.disconnect();
  //     socketRef2.current = null; // Prevent reconnections
  //   }
  //   Object.values(peerConnections2.current).forEach(pc => pc.close());
  // };
}, []);


useEffect(() => {
  // Listen for file upload notifications
  socketRef2.current.on("newFileUploaded", ({ username }) => {
    console.log(`New file uploaded by ${username}`);
    setHasNewFile2(true); // Show notification
  });

  return () => {
    socketRef2.current.off("newFileUploaded");
  };
}, []);

  useEffect(() => {
    let timer;
    if (isRunning2) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning2]);



const startLocalVideo2 = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    localStreamRef2.current = stream;
    if ( localVideoRef2.current) localVideoRef2.current.srcObject = stream;
  } catch (error) {
    console.error('Error accessing media devices:', error);
  }
};

const handleUserListUpdate2 = (users) => {
  console.log("all users are",users);
  
  setAllUsers2(users);

  
  // Remove users who have disconnected to prevent empty divs
  Object.keys(remoteVideosRef2.current).forEach((userId) => {
    if (!users[userId]) {
      delete remoteVideosRef2.current[userId];
    }
  });

   // Automatically start calls with new users
  //  Object.keys(users).forEach((userId) => {
  //   if (userId !== username && !peerConnections2.current[userId]) {
  //     startCall(userId); // Start call automatically
  //   }
  // });
};



// console.log("Now all users are:",allUsers);

const createPeerConnection2 = (userId) => {
  const peerConnection = new RTCPeerConnection({ iceServers: ICE_SERVERS });

  // Add local stream tracks
  localStreamRef2.current.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStreamRef2.current);
  });

  peerConnection.ontrack = (event) => {
    if (!remoteVideosRef2.current[userId]) {
      remoteVideosRef2.current[userId] = document.createElement('video');
      remoteVideosRef2.current[userId].autoplay = true;
      remoteVideosRef2.current[userId].playsInline = true;
    }

    const remoteContainer = document.getElementById('remoteVideosContainer2');
    if (remoteContainer && !remoteContainer.contains(remoteVideosRef2.current[userId])) {
      remoteContainer.appendChild(remoteVideosRef2.current[userId]);
    }

    remoteVideosRef2.current[userId].srcObject = event.streams[0];
  };


  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socketRef2.current.emit('icecandidate', { candidate: event.candidate, to: userId });
    }
  };

  return peerConnection;
};

const handleOffer2 = async ({ from, offer }) => {
  if (peerConnections2.current[from]) {
    console.warn(`PeerConnection with ${from} already exists.`);
    return;
  }

  peerConnections2.current[from] = createPeerConnection2(from);
  
  // Only set remote description if the signaling state is "stable"
  if (peerConnections2.current[from].signalingState === "stable") {
    await peerConnections2.current[from].setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnections2.current[from].createAnswer();
    await peerConnections2.current[from].setLocalDescription(answer);
    socketRef2.current.emit('answer', { from: username2, to: from, answer });
  } else {
    console.warn(`Skipping setRemoteDescription for ${from} because signalingState is ${peerConnections2.current[from].signalingState}`);
  }
};



const handleAnswer2 = async ({ from, answer }) => {
  const peerConnection = peerConnections2.current[from];
  if (!peerConnection) return;

  // Check signaling state before setting remote description
  if (peerConnection.signalingState === "have-local-offer") {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  } else {
    console.warn(`Skipping setRemoteDescription because state is: ${peerConnection.signalingState}`);
  }
  
};

const handleIceCandidate2 = async ({ from, candidate }) => {
  if (peerConnections2.current[from]) {
    await peerConnections2.current[from].addIceCandidate(new RTCIceCandidate(candidate));
  }
};



const startCall2 = async (userId) => {
  // console.log("try userid",userId);
  
  if (peerConnections2.current[userId]) {
    console.warn(`Already in a call with ${userId}`);
    return;
  }

  peerConnections2.current[userId] = createPeerConnection2(userId);
  const offer = await peerConnections2.current[userId].createOffer();
  await peerConnections2.current[userId].setLocalDescription(offer);
  socketRef2.current.emit('offer', { from: username2, to: userId, offer });
};

const joinConference2 = () => {
  // if (username2 && roomid) {
  //   console.log("Registering user:", username2, "Room:", roomid);
  //   socketRef2.current.emit('register', { username2, roomid });
  // }
  console.log("Emitting join-user event:", { username2, roomid:roomid2, password });  
  socketRef2.current.emit('join-user', {username:username2,roomid:roomid2,password});
  setJoined2(true);
  setIsRunning2(true);
  startLocalVideo2();
};

const endCall2 = () => {
  Object.keys(peerConnections2.current).forEach((userId) => {
    socketRef2.current.emit('call-ended', userId);
    handleEndCall2(userId);
  });
  setJoined2(false);
};

const handleEndCall2 = (userId) => {
  if (peerConnections2.current[userId]) {
    peerConnections2.current[userId].close();
    delete peerConnections2.current[userId];
  }
  if (remoteVideosRef2.current[userId]) {
    remoteVideosRef2.current[userId].remove();
    delete remoteVideosRef2.current[userId];
  }

  setAllUsers2((prevUsers) => {
    const updatedUsers = { ...prevUsers };
    delete updatedUsers[userId]; // Remove from state to clean UI
    return updatedUsers;
  });
};

const toggleChat2 = () => {
      setShowChat2(!showChat2);
      if (!showChat2) {
        setHasNewMessage2(false); // Clear the notification when opening chat
      }
      setShowWhiteboard2(false); // Hide Whiteboard when Chat is open
    };

  const toggleVideo2 = () => {
    const videoTrack = localStreamRef2.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOn2(videoTrack.enabled);
    }
  };

  const toggleAudio2 = () => {
    const audioTrack = localStreamRef2.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioOn2(audioTrack.enabled);

      // sendMicStatusUpdate(audioTrack.enabled);
    }
  };

    const toggleScreenShare2 = async () => {
    if (!screenSharingRef2.current) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenSharingRef2.current = true;
        setIsScreenSharing2(true);
        
        const screenTrack = stream.getTracks()[0];
        Object.values(peerConnections2.current).forEach(pc => {
          const sender = pc.getSenders().find(s => s.track.kind === 'video');
          if (sender) sender.replaceTrack(screenTrack);
        });
        
        screenTrack.onended = () => stopScreenShare2();
      } catch (error) {
        console.error('Error accessing screen sharing:', error);
      }
    } else {
      stopScreenShare2();
    }
  };

  const stopScreenShare2 = () => {
    screenSharingRef2.current = false;
    setIsScreenSharing2(false);
    startLocalVideo2();
  };

  //   // Function to handle new messages from ChatSection
  const handleNewMessage2 = () => {
    if (!showChat2) {
      setHasNewMessage2(true);
    }
  };

  const toggleNotesPopup2 = () => {
    setShowNotesPopup2(!showNotesPopup2);
    setHasNewFile2(false); // Reset notification when opened
  };

  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? `0${secs}` : secs}`;
  };

    const toggleWhiteboard2 = () => {
    setShowWhiteboard2((prev) => !prev);
    setShowChat2(false); // Hide chat when Whiteboard is open
  };

  // Close Whiteboard when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (whiteboardRef2.current && !whiteboardRef2.current.contains(event.target)) {
        setIsWhiteboardOpen2(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

return (
  <>
  {checkauth ? (
    <GrpTest val={"que"}/>
  ):test2?(
    <Test goto={"grstudy"}/>
  ):(

  <div className="host-full-page">
      <div className="host-upper-row">
      <h2>Welcome to Room: <a href={generatedRoomId2} className="text-blue-500">{roomid2}</a></h2>
      <p style={{color:"black"}}>Room Password: {password}</p>
      <input 
        type="text" 
        placeholder='Enter username'
        value={username2} 
        onChange={(e)=>setUsername2(e.target.value)}
        className="username-input"
      />
      <button onClick={()=>setcheckauth(true)}>Group Test</button>
      <button onClick={()=>setTest2(true)}>Create Room</button>
      {joined2 && <div className="timer">Time: {formatTime(time)}</div>}
      </div>

      <div className="host-middle-div">
              <div className={`host-left-middle-div ${showChat2||showWhiteboard2  ? 'shrink' : ''}`}>
                  <div className="app">
                  <ul className="user-list">
                          {Object.entries(allUsers2).map(([id, user]) => (
                            <li key={id} className="user-item" style={{color:"black"}}>
                              {user.username} 
                        <button onClick={() => startCall2(id)} className="call-btn">Allow</button>
                            </li>
                          ))}
                      </ul>
                  <div className="video-container" style={{width:"60%",height:"auto"}}>
                      <div className="local-video-container">
                          <video ref={localVideoRef2} autoPlay muted playsInline id="localVideo"  style={{width: "100%",height: "100%"}}/>
                      </div>
                    </div>
                
                  </div>
                  {/* <div className="host-remote-videos" id="remoteVideosContainer">
         {Object.entries(allUsers).map(([userId, user]) => (
          remoteVideosRef2.current[userId] ? (
            <div key={userId} className="remote-video-wrapper" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
  <video ref={(el) => (remoteVideosRef2.current[userId] = el)} autoPlay playsInline className="remote-video" />
  
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
  {Object.entries(allUsers2).map(([userId, user]) => (
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
          if (el) remoteVideosRef2.current[userId] = el;
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
  <button onClick={joinConference2} disabled={joined2} className="join-btn">
    Join
  </button>

  {/* Video Toggle */}
  {joined2 && (
    <img 
      onClick={toggleVideo2} 
      className="control-icon" 
      src={isVideoOn2 ? 'https://tse4.mm.bing.net/th?id=OIP.LOMPTRGrLN2-coUz2VGJLwHaEf&pid=Api&P=0&h=180' : "https://tse2.mm.bing.net/th?id=OIP.3sYc_KH5RGv6_uRqAQnENQHaHa&pid=Api&P=0&h=180"} 
    />
  )}

  {/* Audio Toggle */}
  {joined2 && (
    <img 
      onClick={toggleAudio2} 
      className="control-icon" 
      src={isAudioOn2 ? 'https://tse1.mm.bing.net/th?id=OIP.5VoN9XNBWrEx4lKc1u9oxgHaJQ&pid=Api&P=0&h=180' : 'https://tse3.mm.bing.net/th?id=OIP.LQYQB6u6py-JsGEVAGjcCwHaHa&pid=Api&P=0&h=180'} 
    />
  )}

  {/* Disconnect Button */}
  {joined2 && (
    <button onClick={endCall2} className="disconnect-btn">
      Disconnect
    </button>
  )}

  {/* Whiteboard Toggle */}
  {joined2 && (
    <button onClick={toggleWhiteboard2} className={`whiteboard-btn ${showWhiteboard2 ? 'active' : ''}`}>
      {showWhiteboard2 ? "Close Whiteboard" : "Open Whiteboard"}
    </button>
  )}

  {/* Screen Share */}
  {joined2 && (
    <img 
      onClick={toggleScreenShare2}
      className="control-icon"
      src={isScreenSharing2 ? "https://tse4.mm.bing.net/th?id=OIP.iNdKd9jxoWjKqyV-YYh54wHaHa&pid=Api&P=0&h=180" : 'https://tse4.mm.bing.net/th?id=OIP.x_9Vc9hXxmWPrl10Vj959AHaHa&pid=Api&P=0&h=180'} 
    />
  )}

  {/* Chat Icon with Notification */}
  {joined2 && (
    <div style={{ position: "relative", display: "inline-block" }}>
      <img 
        onClick={toggleChat2}
        className="control-icon"
        src="https://tse1.mm.bing.net/th?id=OIP.2xM9b_J8akiM3A0tnqAXzwHaHa&pid=Api&P=0&h=180"
      />
      {hasNewMessage2 && <span className="notification-dot"></span>}
    </div>
  )}

  {/* File Icon with Notification */}
  {joined2 && (
    <div style={{ position: "relative", display: "inline-block" }}>
      <img 
        src={fileimg} 
        onClick={toggleNotesPopup2} 
        className="control-icon"
      />
      {hasNewFile2 && <span className="notification-dot"></span>}

      {/* Notes Popup */}
      {showNotesPopup2 && (
        <div className="popup">
          <NotesApp roomId={roomid2} username={username2} setHasNewFile={setHasNewFile2} />
        </div>
      )}
    </div>
  )}
</div>

              </div>
               <div className={`host-chatting ${showChat2 ? 'visible' : ''}`}>
               {showWhiteboard2 ? <WhiteBoard /> : <ChatSection onNewMessage={handleNewMessage2} roomid={roomid2} username={username2}/>}
                </div>
      </div>
 </div>
  )}
  </>
)

  
}

export default GrStudyPage



