import React, { useState, useEffect ,useContext} from 'react';
import axios from 'axios';
import QuizQueSection from './QuizQueSection';
import AdminPage from './AdminPage';
import RoomCreation from './RoomCreation';
import GrStudyPage from './GrStudyPage';
import LandingPage from './LandingPage';
import './grptest.css';
import { StudyContext } from "./Store.js";

const GrpTest = ({val,backval}) => {
  const [givenId, setGivenId] = useState('');
  const { updateauthdata,ldata} = useContext(StudyContext);
  const [givenPass, setGivenPass] = useState('');
  const [authDatas, setAuthDatas] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track authentication
  const [isRoom,setIsRoom]= useState(false)
  const [back,setIsBack]= useState(false)
  const [yesauthenticated,setYesAuthenticated2]= useState(false)


  useEffect(() => {
    let isMounted = true;
    axios
      .get('https://finalreadyvsr.onrender.com/getauthdatas')
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

  console.log("hi ldata",ldata);
  
  const handleVerify = () => {
    const validauth = authDatas.find(
      (authUser) => authUser.authid === givenId && authUser.password === givenPass
    );

     if (validauth) {
      // console.log("its the valid user",validauth);
      
        const finalcheck = validauth.email === ldata.email ;
  
       if(!finalcheck){
        alert("Id Password doesnot match with youe email id..")
        return;
      }
      // setPassAuth(validauth)
      updateauthdata(validauth);
      switch(val){
        case "que": setIsAuthenticated(true);break;
  
        case "roomcr": setIsRoom(true);break;
      }
    } else {
      alert("Not Authenticated");
    }
  };

  const setIsAdmin2=()=>{
    console.log("hello am i visible");
    
    axios
    .get('https://finalreadyvsr.onrender.com/getauthdatas')
    .then((res) => {
        const data = res.data;
        console.log("i am coming",data);
        const validauth2 = data.find((authUser) => authUser.email === ldata.email);
          if(validauth2){
            alert("You are already authenticated so give ur authid and authpassword..")
          }
          else{
            setIsAdmin(true)
          }     
    })
    .catch((err) => {
      console.log("Error fetching auth data:", err.message);
    });
  }

  
  return (
    <>
      {back ? (
        <LandingPage />
      ) : isAdmin ? (
        <AdminPage grpval={val} />
      ) : isRoom ? (
        <GrStudyPage />
      ) : isAuthenticated ? (
        <QuizQueSection />
      ) : (
        <div className="vsr-container-main">
        <h4 style={{marginBottom:"20px",color:"brown"}}><span style={{fontSize:"40px",fontFamily:"sans-serif"}}>⚠️</span>Only authenticated persons can create rooms or set test questions</h4>
      <h1 style={{marginBottom:"20px",color:"orange"}}>Are you authenticated ?...</h1>
        <div className="vsr-container">
          <input
            type="text"
            className="vsr-input"
            placeholder="Give Authentication ID"
            onChange={(e) => setGivenId(e.target.value)}
          />
          <input
            type="text"
            className="vsr-input"
            placeholder="Authenticated Password"
            onChange={(e) => setGivenPass(e.target.value)}
          />
          <div className='movealign'>
          <button className="vsr-button" onClick={handleVerify}>Verify</button>
          <button className="vsr-button" onClick={() => setIsAdmin2(true)}>Get Authenticated</button>
          </div>
          <button className="vsr-button" onClick={() => setIsBack(true)}>Back</button>
        
        </div>
        </div>
      )}
    </>
  );
};

export default GrpTest;
