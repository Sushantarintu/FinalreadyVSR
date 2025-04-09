import React, { useState, useEffect, useRef, useContext } from 'react';
import socketIOClient from 'socket.io-client';
import axios from 'axios';
import {Avatar} from "@mui/material"
import logo from './default-profileimg.webp'
import { StudyContext } from './Store.js';
import './style.css';
import './chatssec.css'


const ChatSection = ({ onNewMessage ,roomid,username}) => {
  const [target, setTarget] = useState('');
  const [inputedMsg, setInputedMsg] = useState('');
  const [messages, setMessages] = useState([]);
  const [individuals, setIndividuals] = useState([]);
  const [Grps, setGrps] = useState([]);
  const [isIndividual, setIsIndividual] = useState(false);
  const [isAll, setIsAll] = useState(false);
  const [isSetOption, setIsSetOption] = useState(false);
  const [Allaccounts,setallaccounts]= useState([])
  const [loginer, setLoginer] = useState(null);

  const socket = useRef(null);

  const users = useContext(StudyContext);

// console.log(Grps);

useEffect(()=>{
  axios.get('https://virtualstudyroom2.onrender.com/getloginers')
        .then((res)=>{
          // console.log(res.data);
          setallaccounts(res.data)
        })
        .catch(err => console.error('Error fetching loginers:', err))
},[])

const messageEndRef = useRef(null);

useEffect(() => {
  if (messageEndRef.current) {
    messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }
}, [messages]);

  useEffect(() => {
    if (Array.isArray(users.userData) && Array.isArray(users.GRData)) {
      setIndividuals(users.userData);
      setGrps(users.GRData);
      setLoginer(users.ldata)
    } else {
      console.warn('Users from StudyContext is not an array:', users);
    }
  }, [users]);

  // console.log("This is current loginer",loginer);

  // const validUser = useMemo(() => {
  //   return Allaccounts.find(user => user.email === loginer.email);
  // }, [Allaccounts, loginer]);

  // const handleJoinChat = () => {
  //   if (username && roomid) {
  //     console.log("Registering user:", username, "Room:", roomid);
  //     socket.current.emit('register', { username, roomid });
  
  //     console.log("Joining user:", username, "Room:", roomid);
  //     socket.current.emit('join-user', { username, roomid, password: 'somepassword' });
  //   } else {
  //     console.warn("Cannot register/join, missing username or roomid");
  //   }
  // };

  useEffect(() => {
    socket.current = socketIOClient('http://localhost:10000');

    socket.current.on('connect', () => {
      console.log('Connected to backend:', socket.current.id);
  
    });

      if (username && roomid) {
        console.log("Registering user:", username, "Room:", roomid);
        socket.current.emit('register', { username, roomid });
      } else {
        console.warn("Cannot register, missing username or roomid", { username, roomid });
      }
    

    socket.current.on('message', (sender, message) => {
      console.log("the message is",message);
      
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender, message, fromSelf: false },
        // { sender, message, fromSelf: sender === socket.current.id },
      ]);

       // Notify parent component about new message
       if (onNewMessage) {
        onNewMessage();
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, [username]);

//   useEffect(() => {
//     // ✅ Connect only once when the component mounts
//     socket.current = socketIOClient('http://localhost:10000');

//     socket.current.on('connect', () => {
//         console.log('Connected to backend:', socket.current.id);
//         if (username && roomid) {
//             console.log("Registering user:", username, "Room:", roomid);
//             socket.current.emit('register', { username, roomid });
//         }
//     });

//     // ✅ Set up message listener once
//     socket.current.on('message', (sender, message) => {
//         setMessages((prevMessages) => [
//             ...prevMessages,
//             { sender, message, fromSelf: false },
//         ]);

//         if (onNewMessage) {
//             onNewMessage();
//         }
//     });

//     // ✅ Cleanup on unmount
//     return () => {
//         socket.current.disconnect();
//     };
// }, []); // ✅ Empty dependency array ensures this runs only once

  const handleHover = () => {
    setIsSetOption(true);
  };

  const handleSendMessage = (para) => {
    if ( !username) {
      console.warn('User is not available');
      return;
    }

    if (para === 'all') {
      if (inputedMsg.trim()) {
        const message = inputedMsg.trim();
        socket.current.emit('msg-all', {message, sender:username,roomid});

        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: username, message, fromSelf: true },
        ]);

        setInputedMsg('');
      } else {
        console.warn('Cannot send an empty message');
      }
    }

    if (para === 'indiv') {
      if (inputedMsg.trim() && target.trim()) {
        const message = inputedMsg.trim();
        socket.current.emit('private-message', {target, message, sender:username,roomid});

        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: username, message, fromSelf: true },
        ]);

        setInputedMsg('');
      } else {
        console.warn('Target or message is empty');
      }
    }
  };

  return (
    <>
      {isSetOption ? (
        <div>
          <button
            onClick={() => {
              setIsAll(true);
              setIsSetOption(false);
            }}
          >
            Msg To all
          </button>
          <button
            onClick={() => {
              setIsIndividual(true);
              setIsSetOption(false);
            }}
          >
            To Individual
          </button>
        </div>
      ) : isAll ? (
        <div className="chat-container">
          <h2>Chat with All</h2>
          {/* <button onClick={handleJoinChat}>Join Chat Room</button> */}
          <div className="chat-messages">
  {messages.map((msg, index) => {
    const senderAccount = Allaccounts.find(user => user.name === msg.sender);
    const senderAvatar = senderAccount && senderAccount.imagePath 
      ? `http://localhost:10000/${senderAccount.imagePath}`
      : logo;

    return (
      <div key={index} className={`message-item ${msg.fromSelf ? 'self' : 'other'}`}>
        {!msg.fromSelf && <Avatar src={senderAvatar} className="sender-avatar" />}
        <div className="message-content">
          <strong>{msg.sender}</strong>: {msg.message}
        </div>
        {msg.fromSelf && <Avatar src={senderAvatar} className="sender-avatar" />}
      </div>
    );
  })}
  <div ref={messageEndRef} />
</div>



          <div className="message-input">
            <input
              type="text"
              placeholder="Type your message"
              value={inputedMsg}
              onChange={(e) => setInputedMsg(e.target.value)}
            />
            <button onClick={() => handleSendMessage('all')}>Send</button>
          </div>
        </div>
      ) : isIndividual ? (
        <div className='ind-msg'>
          <div className="contact-list">
            {individuals.map((inv, index) => (
              <div key={index} onClick={() => setTarget(inv.name)}>
                <h3>
                  {index + 1}. {inv.name}
                </h3>
              </div>
            ))}
          </div>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.fromSelf ? 'self' : 'other'}`}
              >
                <div>
                  <strong>{msg.sender}</strong>: {msg.message}
                </div>
              </div>
            ))}
          </div>
          <div className="message-input">
            <input
              type="text"
              placeholder="Type your message"
              value={inputedMsg}
              onChange={(e) => setInputedMsg(e.target.value)}
            />
            <button onClick={() => handleSendMessage('indiv')}>Send</button>
          </div>
        </div>
      ) : (
        <div onMouseEnter={handleHover}>Message</div>
      )}
    </>
  );
};

export default ChatSection;
