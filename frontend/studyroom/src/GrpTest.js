import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QuizQueSection from './QuizQueSection';
import AdminPage from './AdminPage';
import RoomCreation from './RoomCreation';

const GrpTest = ({val}) => {
  const [givenId, setGivenId] = useState('');
  const [givenPass, setGivenPass] = useState('');
  const [authDatas, setAuthDatas] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track authentication
  const [isRoom,setIsRoom]= useState(false)

  useEffect(() => {
    let isMounted = true;
    axios
      .get('http://localhost:10000/getauthdatas')
      .then((authdata) => {
        if (isMounted) setAuthDatas(authdata.data);
      })
      .catch((err) => {
        console.log(err.message);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleVerify = () => {
    const validauth = authDatas.find(
      (authUser) => authUser.authid === givenId && authUser.password === givenPass
    );

    if (validauth) {
      switch(val){
        case "que": setIsAuthenticated(true);break;
  
        case "roomcr": setIsRoom(true);break;
      }
    } else {
      alert("Not Authenticated");
    }
  };

  return (
    <>
      {isAdmin ? (
        <AdminPage grpval={val}/>
      ) :isRoom ? (
        <RoomCreation />
      ) : isAuthenticated ? (
        <QuizQueSection />
      ) : (
        <>
          <input type="text" placeholder="Give Authentication ID" onChange={(e) => setGivenId(e.target.value)} />
          <input type="text" placeholder="Authenticated Password" onChange={(e) => setGivenPass(e.target.value)} />
          <button onClick={handleVerify}>Verify</button>
          <button onClick={() => setIsAdmin(true)}>Get Authenticated</button>
          <a href='/quizmode'>Give test</a>
        </>
      )}
    </>
  );
};

export default GrpTest;
