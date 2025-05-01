import React, { useContext, useState, useEffect } from 'react';
import { StudyContext } from "./Store.js";
import { v4 as uuidv4 } from 'uuid'; // Import uuid
import axios from 'axios'
import QuizQueSection from './QuizQueSection.js';
import RoomCreation from './RoomCreation.js';

const AdminPage = ({grpval}) => {
    const { ldata } = useContext(StudyContext);
    const [authPass, setAuthPass] = useState('');
    const [authid, setAuthid] = useState('');
    const [isQue,setIsQue]= useState(false)
    const [authdatas,setauthDatas]= useState([])
    const [yesAuthenticated,setYesAuthenticated]= useState(false)
    const [isRoom,setIsRoom]= useState(false)

      // Generate unique Auth ID
  useEffect(() => {
    if (ldata.name) {
      const uniqueId = ldata.name.slice(0, 3).toUpperCase() + '-' + uuidv4().slice(0, 8);
      setAuthid(uniqueId);
    }
  }, [ldata.name]);

  // Fetch Auth Data and check if user is already authenticated
  useEffect(() => {
    let isMounted = true;

    axios
      .get('https://finalreadyvsr.onrender.com/getauthdatas')
      .then((res) => {
        if (isMounted) {
          const data = res.data;
          setauthDatas(data);
          const validauth = data.find((authUser) => authUser.email === ldata.email);
          if (validauth) setYesAuthenticated(true);
        }
      })
      .catch((err) => {
        console.log("Error fetching auth data:", err.message);
      });

    return () => {
      isMounted = false;
    };
  }, [ldata.email]);


  // Submit Auth Data
  const handleauthchange = () => {
    if (!authPass.trim()) {
      alert("Please enter a password.");
      return;
    }

    const authUsers = {
      name: ldata.name,
      email: ldata.email,
      password: authPass,
      authid: authid,
    };

    axios
      .post("https://finalreadyvsr.onrender.com/authenticatedusers", authUsers)
      .then((res) => {
        console.log("Authentication successful:", res.data);
        // setYesAuthenticated(true);
      })
      .catch((err) => {
        console.log("Error during authentication:", err.message);
      });

      switch(grpval){
          case "que": setIsQue(true);break;
    
          case "roomcr": setIsRoom(true);break;
        }
        
  };

    return (
        <>
        {isQue?(
            <QuizQueSection />
        ):isRoom?(
          <RoomCreation />
      ):yesAuthenticated?(
            <>
            <h1 style={{color:"orange"}}>You are already authenticated</h1>
            </>            
        ):(
            <>
            <h1>Admin Page</h1>
            <input type='text' value={ldata.name} readOnly />
            <input type='text' value={ldata.email} readOnly />
            <p>Create Your Authenticated Password</p>
            <input type='text' onChange={(e) => setAuthPass(e.target.value)} placeholder=''/>
            <p>Your Authentication ID</p>
            <input type='text' value={authid} readOnly />
            <button onClick={handleauthchange}>Submit</button>
            </>
        )}
        </>
    );
};

export default AdminPage;
