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

    useEffect(() => {
        if (ldata.name) {
            const uniqueId = ldata.name.slice(0, 3).toUpperCase() + '-' + uuidv4().slice(0, 8);
            setAuthid(uniqueId);
        }
    }, [ldata.name]); // Generate when ldata.name changes

    console.log("admin sent value : ",grpval);
    
    useEffect(() => {
        let isMounted = true;
        axios
          .get('https://readyvsr.onrender.com/getauthdatas')
          .then((authdata) => {
            if (isMounted) setauthDatas(authdata.data);
          })
          .catch((err) => {
            console.log(err.message);
          });
    
          const validauth = authdatas.find(
            (authUser) =>  authUser.email === ldata.email
          );
      
          if (validauth) {
            setYesAuthenticated(true); // Set authentication state to true
          } 
        return () => {
          isMounted = false;
        };
      }, []);

    const handleauthchange = () => {
        const authUsers = {
            name: ldata.name,
            email: ldata.email,
            password: authPass,
            authid: authid
        };

        axios.post("https://readyvsr.onrender.com/authenticatedusers", authUsers)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
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
            <h1 style={{color:"yellow"}}>You are already authenticated</h1>
        ):(
            <>
            <h1>Admin Page</h1>
            <input type='text' value={ldata.name} readOnly />
            <input type='text' value={ldata.email} readOnly />
            <p>Create Your Authenticated Password</p>
            <input type='text' onChange={(e) => setAuthPass(e.target.value)} />
            <p>Your Authentication ID</p>
            <input type='text' value={authid} readOnly />
            <button onClick={handleauthchange}>Submit</button>
            </>
        )}
        </>
    );
};

export default AdminPage;
