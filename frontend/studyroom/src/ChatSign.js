import React, { useState } from 'react';
import ChatSection from './ChatSection';
import GroupCreation from './GroupCreation';
import axios from 'axios'

function ChatSign() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isRegistered, setIsRegistered] = useState(false);
  const [showGroupCreation, setShowGroupCreation] = useState(false);

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleRegister = () => {
    const { name, email, password } = userData;

    if (!name.trim() || !email.trim() || !password.trim()) {
      alert('All fields are required!');
      return;
    }

    axios.post("https://readyvsr.onrender.com/userreg",userData)
    .then((res)=>{
      console.log(res.message);
    }).catch((err)=>{
      console.log(err)
    })

    console.log('User Data:', userData);
    setIsRegistered(true);
    // setIsGroupCreationEnabled(true);
  };

  if (isRegistered) {
    return <ChatSection username={userData.name} />;
  }
  const handleCreate = () => {
    setShowGroupCreation(true); // Toggle Group Creation visibility
  };

  return (
    <div>
        <div className="container">
          <h2>Register</h2>
          <input
            type="text"
            name="name"
            value={userData.name}
            placeholder="Enter your name"
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            value={userData.email}
            placeholder="Enter your email"
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="password"
            value={userData.password}
            placeholder="Enter your password"
            onChange={handleInputChange}
          />
          <button onClick={handleRegister}>Sign In</button>
        </div>
        <button onClick={handleCreate}>Create Group</button>
        {showGroupCreation && <GroupCreation builder={userData.name} />}
    </div>
  );
}

export default ChatSign;
