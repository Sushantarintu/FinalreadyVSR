import React,{useContext, useState,useEffect,useRef} from 'react'
import './landpage.css'
import { StudyContext } from "./Store.js";
import GrStudyPage from './GrStudyPage.js'
import ProfilePage from './ProfilePage.js'
import {Avatar} from "@mui/material"
import defimg from './default-profileimg.webp'
import RoomCreation from './RoomCreation.js'
import QuizMode from './QuizMode.js'
import SignUp from './SignUp.js';
import axios from 'axios';
import JoinSection from './JoinSection.js';
import Todo from './Todo.js'
import GrpTest from './GrpTest.js';
import UserEngagement from './UserEngagement.js';

const LandingPage = () => {
    const { usrData, GRData, updateData, ldata,appendData ,curUserData} = useContext(StudyContext);
    // console.log("landing log",ldata);
    
    const [curUser,setCuruser]=useState([])
    const [isStudy,setIsStudy]= useState(false)
    const [isTest,setIsTest]= useState(false)
    const [profile,setProfile]= useState(false)
    const [isLink,setIsLink]= useState(false)
    const [isRoomcre,setIsRoomCre]= useState(false)
    // const [curLoginer,setCurLoginer]= useState({})
    const [isTask,setIsTask]= useState(false)
    const [isAdmin,setIsAdmin]= useState(false)
    const [isQue,setIsQue]= useState(false)
    
useEffect(()=>{
    axios.get('https://readyvsr.onrender.com/getloginers')
    .then((res)=>{
        setCuruser(res.data)
    })
    .catch((err)=>{
        console.log(err)
    })
},[])


const validUser= curUser.find((user)=>{
  return  user.email === ldata.email
})

    //   console.log("New Loginer is",ldata);
    //   console.log("All loginers with avatar",curUser);
    //   console.log("It is the valid user",validUser);
      
      
  return (
    <div className='sabuthupare'>
        {isRoomcre?(
            <RoomCreation />
        ):isAdmin?(
            <GrpTest val={"roomcr"}/>
        ):isLink?(
            <UserEngagement />
        ):profile?(
            <ProfilePage />
        ):
        isTest?(
            <QuizMode />
        ):
        isQue?(
            <GrpTest val={"que"}/>
        ):isTask?(
            <Todo />
        ):(
            <div className='haulo'>
            <div className="page">
        <div className="header">
            <div className="logo">
                <img src="https://tse1.mm.bing.net/th?id=OIP.dk7EtxhBCMLJEFLfVRzlAQHaHa&pid=Api&P=0&h=180" alt="Site Logo" style={{width:"100%"}}/>
            </div>
            <div id="title">
                <h1>Virtual Study Room</h1>
            </div>
                <ul className="headerelement">
                    <li><a href="#">Home</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/serv">Services</a></li>
                    <li><a href="/cont">Contact</a></li>
                </ul>
                <div>
                <h2>Hey {ldata.name}</h2>
                </div>
                {/* <img src='https://cdn3.iconfinder.com/data/icons/social-messaging-productivity-6/128/profile-male-circle2-512.png' onClick={()=>setProfile(true)} */}
                {/* <img src={ldata.imagePath||defimg} style={{width:"30px"}} onClick={()=>setProfile(true)}/>              */}
                <Avatar src={validUser && validUser.imagePath ? `https://virtualstudyroom2.onrender.com/${validUser.imagePath}` : defimg}  onClick={() => setProfile(true)} alt="User Avatar"style={{cursor:"pointer"}}/>

        </div>
             <div className="contain">
             <div id="leftdiv">
                    <div id="first">
                        <h1>STUDY <br/>TOGETHER</h1>
                    </div>
                    <div id="second">
                        <h2>Welcome to the Virtual Study Room.Stay focused, stay motivated, and collaborate with peers to achieve your learning goals. Let's make the most of our study time together.</h2>
                    </div>
                    <div className="btn">
                        <button onClick={()=>setIsAdmin(true)}>STUDY ROOM</button> 
                        <button onClick={()=>setIsLink(true)}>ANALYTICS</button>
                        <button onClick={()=>setIsQue(true)}>SET TEST QUE</button>
                        <button onClick={()=>setIsTest(true)}>TEST</button>
                        <button onClick={()=>setIsTask(true)}>SET TASK</button>
                    </div>
               
            </div>
                <div id="rightdiv">
                        <div className="slider">
                            <div className="slides">
                                <img src="https://tse4.mm.bing.net/th?id=OIP.g3ZZrsOw2c1klgwbPIlT6wHaDt&pid=Api&P=0&h=180" alt="Slide 1" loading="lazy"/>
                                <img src="https://tse2.mm.bing.net/th?id=OIP.1x5htsbfTTkjQfMHLZ_0lgHaEO&pid=Api&P=0&h=180" alt="Slide 2" loading="lazy"/>
                                <img src="https://tse4.mm.bing.net/th?id=OIP.NMk18qBLgBVsp-SbrtN62wHaFi&pid=Api&P=0&h=180" alt="Slide 3" loading="lazy"/>
                                <img src="https://tse4.mm.bing.net/th?id=OIP.pRFYD74bFS7iegPwZ1mCiQHaFy&pid=Api&P=0&h=180" alt="Slide 4" loading="lazy"/>
                                <img src="https://tse4.mm.bing.net/th?id=OIP.g3ZZrsOw2c1klgwbPIlT6wHaDt&pid=Api&P=0&h=180" alt="Slide 1 clone" loading="lazy"/>
                            </div>
                        </div>
                </div>
            </div>
        <div className="footer">
            <p>&copy; 2025 Your Website Name. All rights reserved.</p>
            <p>Contact us: <a href="mailto:info@yourwebsite.com">info@yourwebsite.com</a></p>
            <div className="social-icons">
                <a href="https://facebook.com/yourpage" target="_blank">Facebook</a> |
                <a href="https://twitter.com/yourhandle" target="_blank">Twitter</a> |
                <a href="https://linkedin.com/in/yourprofile" target="_blank">LinkedIn</a>

                {/* <a href='/useng'>User engagement</a> */}
            </div>
        </div>
        {/* <a href='/quizsetque'>Quiz Que Set</a> */}
    </div>  
    </div>
        )}

        
    </div>
  )
}

export default LandingPage
