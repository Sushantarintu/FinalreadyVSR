import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import validator from 'validator';
import { StudyContext } from "./Store.js";
// import './style.css';
import './signup.css'
import LandingPage from './LandingPage';

const SignUp = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
  });
  // const [signedUsers, setSignedUsers] = useState([]);
  const [isAllowed, setIsAllowed] = useState(false);
  const { updateData, ldata } = useContext(StudyContext);
  const [isRegistered, setIsRegistered] = useState(false);

  // useEffect(() => {
  //   axios.get('https://virtualstudyroom2.onrender.com/getUserData')
  //     .then(response => {
  //       setSignedUsers(response.data);
  //     })
  //     .catch(error => console.error('Error fetching users:', error));
  // }, []);

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    const { name, email, password } = userData;
    if (!name.trim() || !email.trim() || !password.trim()) {
      alert('All fields are required!');
      return;
    } else if (!validator.isEmail(email)) {
      alert('Please enter a valid email.');
      return;
    }
  
    try {
      const regResponse = await axios.post('https://readyvsr.onrender.com/userreg', userData);
      alert(regResponse.data.message || "Registration successful!");
      
      // await axios.post('http://localhost:3009/curloginer', userData);
      setIsRegistered(true);
      setIsAllowed(true);
      updateData(userData);
    } catch (error) {
      alert("Registration failed.");
      console.error("Registration error:", error);
    }
  };
  
  

  // useEffect(() => {
  //   console.log("Data from context on component render:", ldata);
  // }, [ldata]);

  return (
    <div className='signupWrapper'>
    <div className="signupPage">
      {isAllowed ? (
        <LandingPage />
      ) : (

        <div className="signupContainer">
    <input type="checkbox" id="toggleAuthMode" className="authCheckbox" />
    <div className="signupSection">
      <label htmlFor="toggleAuthMode" className="signupLabel">Sign Up</label>
      <input
        type="text"
        name="name"
        value={userData.name}
        placeholder="Enter your name"
        onChange={handleInputChange}
        className="signupInput"
      />
      <input
        type="email"
        name="email"
        value={userData.email}
        placeholder="Enter your email"
        onChange={handleInputChange}
        className="signupInput"
      />
      <input
        type="password"
        name="password"
        value={userData.password}
        placeholder="Enter your password"
        onChange={handleInputChange}
        className="signupInput"
      />
      <button onClick={handleRegister} className="signupButton">Sign In</button>
    </div>
  </div>

      )}
      {/* <a href="/quizmode">Quiz Mode</a>
      <a href='/quizsetque'>Quiz QueMode</a>
      <a href='/grstudy'>Study Room</a> */}
    </div>
    </div>
  );
};

export default SignUp;

